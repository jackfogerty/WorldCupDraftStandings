import React from "react";
import { useEffect, useState, useMemo } from "react";

`Knockout stage:
3rd place and qualify: 1 point
2nd place: 2 points
1st place: 3 points

Appearances in the knockout round
Round of 16: 4 points
QF: 5 points
Semi: 6 points
Final: 7 points

Win the world cup: 8 points

These points are cumulative so winning your group and the world cup would net you 33 points

If any undrafted team does better than any of your teams, that team will not count to your total`;

// Add 'teams' to the props
const Person = ({ name, points, isWinner, isLoser, teams = [] }) => {
  return (
    <div className="px-6 py-4 mb-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-4 text-xl font-bold text-slate-800">
          <span className="tracking-wide">{name}</span>
          {isWinner && (
            <span className="text-2xl drop-shadow-sm" title="Current Leader">
              👑
            </span>
          )}
          {isLoser && (
            <span className="text-2xl drop-shadow-sm" title="Current Loser">
              💩
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2 bg-slate-50 px-4 py-2 rounded-lg">
          <span className="text-3xl font-extrabold text-indigo-600">
            {points}
          </span>
          <span className="text-sm font-semibold text-slate-400 tracking-wider uppercase">
            pts
          </span>
        </div>
      </div>

      {teams.length > 0 && (
        <div className="pt-3 mt-1 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {teams.map((team) => (
              <div
                key={team.name}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-slate-500 font-medium">{team.name}</span>
                <span className="text-slate-800 font-semibold">
                  {team.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Person;
