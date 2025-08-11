/* eslint-disable */

import { Gamepad2 } from "lucide-react";
import React from "react";

// @ts-ignore
const ConfirmTournamentModal = ({ match, onClose }: any) => {
  console.log(match);
  return (
    <div className="">
      <div className="w-[100vw] h-[100vh] bg-black/50 absolute  opacity-[0.9] inset-0"></div>
      <div className=" absolute inset-0 mt-46 max-w-fit mx-auto px-2 flex flex-col rounded-2xl h-96  bg-white text-black">
        <h1 className="text-yellow-400 font-extrabold text-center text-2xl mt-4 bg-black/50 rounded-lg px-2 py-2">
          Confirm Tournament
        </h1>
        <p>Are you sure you want to confirm the tournament?</p>

        <div className="div">
          {/* Time & Owner */}
          <div className="mt-4 flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-red-400 font-medium">
              <Gamepad2 size={16} /> {match.gameName}
            </div>
          </div>

          {/* Features */}
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex flex-wrap justify-between gap-3">
              <span className="bg-blue-500/80 text-white px-3 py-1 rounded-md">
                {match.ammo === false ? "UnLimited Ammo" : "Limited Ammo"}
              </span>

              <span className="text-gray-300">Created by : Admin</span>
            </div>
            <div className="inline-block bg-purple-600 px-3 py-1 rounded-md text-white">
              {match.skill === true
                ? "Character Skill On"
                : "Character Skill Off"}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-6">
            <span className="bg-green-500 text-white px-4 py-1 rounded-md font-bold text-sm">
              Gain: {match.winnerPrice}
            </span>
          </div>
        </div>
        <div className="btn flex gap-2">
          <button
            className=" bg-red-600 px-2 rounded-lg cursor-pointer mt-10 py-1"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className=" bg-green-600 px-2 rounded-lg cursor-pointer mt-10 py-1"
            onClick={onClose}
          >
            Confirm create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTournamentModal;
