import { useState, useEffect } from "react";
import "./App.css";
import Person from "./components/Person";

const App = () => {
  const people = [
    "Jack",
    "Maher",
    "Youssef",
    "Muhammad",
    "Arun",
    "Sam",
    "Ibrahim",
    "Jadon",
    "Ben",
  ];

  const TEAMS_MAP = {
    Jack: ["Germany", "Netherlands", "Korea Republic", "IR Iran", "Congo DR"],
    Maher: ["Spain", "Ecuador", "Sweden", "Australia", "Qatar"],
    Youssef: ["France", "Uruguay", "Türkiye", "Ghana", "New Zealand"],
    Muhammad: ["Portugal", "Morocco", "Senegal", "Saudi Arabia", "Jordan"],
    Arun: [
      "Argentina",
      "USA",
      "Mexico",
      "Bosnia and Herzegovina",
      "Uzbekistan",
    ],
    Sam: ["Brazil", "Croatia", "Norway", "Scotland", "Tunisia"],
    Ibrahim: [
      "England",
      "Columbia",
      "Côte d'Ivoire",
      "Paraguay",
      "South Africa",
    ],
    Jadon: ["Belgium", "Switzerland", "Austria", "Egypt", "Cabo Verde"],
    Ben: ["Japan", "Canada", "Czechia", "Algeria", "Panama"],
  };

  const [standings, setStandings] = useState({});
  const [bracket, setBracket] = useState({});

  const WORLDCUP_API_KEY = import.meta.env.VITE_WORLDCUP_API_KEY;

  const getGroupStandings = async () => {
    try {
      const res = await fetch(
        "https://api.zafronix.com/fifa/worldcup/v1/standings?year=2026",
        {
          headers: { "X-API-Key": WORLDCUP_API_KEY },
          cache: "no-store",
        }
      );
      const data = await res.json();
      setStandings(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBracket = async () => {
    try {
      const res = await fetch(
        "https://api.zafronix.com/fifa/worldcup/v1/bracket?year=2026",
        {
          headers: { "X-API-Key": WORLDCUP_API_KEY },
          cache: "no-store",
        }
      );
      const data = await res.json();
      setBracket(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPointsFromStandings = () => {
    const standingPoints = {};
    const groups = standings?.groups;

    if (!groups) return;

    const thirdPlaceTeams = [];
    for (const group of Object.values(groups)) {
      if (group[2]) {
        thirdPlaceTeams.push(group[2]);
      }
    }

    thirdPlaceTeams.sort((a, b) => (b.points || 0) - (a.points || 0));

    const top8Names = thirdPlaceTeams.slice(0, 8).map((team) => team.name);
    for (const group of Object.values(groups)) {
      for (const team of group) {
        const points =
          team.position == 1
            ? 3
            : team.position == 2
            ? 2
            : team.position == 4
            ? 0
            : team.position == 3
            ? top8Names.includes(team.team)
              ? 1
              : 0
            : 0;
        standingPoints[team.team] = points;
      }
    }
    return standingPoints;
  };

  const getPointsFromBracket = () => {
    const bracketPoints = {};
    const stages = bracket?.stages;
    if (!stages) return;

    const addPoints = (teamName, pointsToAdd) => {
      if (!teamName) return;
      bracketPoints[teamName] = (bracketPoints[teamName] || 0) + pointsToAdd;
    };
    for (const match of stages.round_of_16) {
      addPoints(match?.home, 4);
      addPoints(match?.away, 4);
    }
    for (const match of stages.quarter_final) {
      addPoints(match?.home, 5);
      addPoints(match?.away, 5);
    }
    for (const match of stages.semi_final) {
      addPoints(match?.home, 6);
      addPoints(match?.away, 6);
    }
    for (const match of stages.final) {
      addPoints(match?.home, 7);
      addPoints(match?.away, 7);
      addPoints(match?.winner, 8);
    }
    for (const match of stages.third_place) {
      addPoints(match?.winner, 8);
    }
    return bracketPoints;
  };

  const getPointsByTeam = (teamName) => {
    try {
      const standingPoints = getPointsFromStandings();
      const bracketPoints = getPointsFromBracket();
      console.log("standingpoints: ", standingPoints);
      console.log("bracket points: ", bracketPoints);
      if (!standingPoints || !bracketPoints) return 0;

      const groupScore = Number(standingPoints[teamName]) || 0;
      const bracketScore = Number(bracketPoints[teamName]) || 0;

      return groupScore + bracketScore;
    } catch (error) {
      console.log("uh oh: ", error);
    }
  };

  useEffect(() => {
    getGroupStandings();
    getBracket();
  }, []);

  const [scores, setScores] = useState({});

  useEffect(() => {
    if (!standings?.groups || !bracket?.stages) {
      console.log("Waiting for data to calculate totals...");
      return;
    }

    const calculatedScores = {};

    for (const person of people) {
      let personTotal = 0;

      for (const team of TEAMS_MAP[person]) {
        personTotal += getPointsByTeam(team);
      }

      calculatedScores[person] = personTotal;
    }

    setScores(calculatedScores);
  }, [standings, bracket]);

  const sortedPeople = [...people].sort((a, b) => {
    const scoreA = scores[a] || 0;
    const scoreB = scores[b] || 0;

    return scoreB - scoreA;
  });

  return (
    <>
      <div className="mt-16 max-w-2xl mx-auto px-4">
        {sortedPeople.map((person) => {
          const personScore = scores[person] || 0;

          return <Person key={person} name={person} points={personScore} />;
        })}
      </div>
    </>
  );
};
export default App;
