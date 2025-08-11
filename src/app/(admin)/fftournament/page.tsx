"use client";
/* eslint-disable */
import ConfirmTournamentModal from "@/components/ConfirmTournamentModal";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [matchType, setMatchType] = useState<"cs 4 v 4" | "br solo" | null>(
    null
  );
  const [limitedAmmo, setLimitedAmmo] = useState<boolean | null>(null);
  const [characterSkill, setCharacterSkill] = useState<boolean | null>(null);
  const [gameName, setGameName] = useState<string>("");
  const [winnerPrice, setWinnerPrice] = useState<number>(0);
  const [entryCost, setEntryCost] = useState<number>(0);
  const [isModalOpen, setIsModalOPen] = useState(false);
  const [match, setMatches] = useState({});

  const [dateTime, setDateTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const onClose = () => {
    setIsModalOPen(!isModalOpen);
    const matches = {
      matchType: matchType,
      limitedAmmo: limitedAmmo,
      characterSkill: characterSkill,
      gameName: gameName,
      winnerPrice: winnerPrice,
      entryCost: entryCost,
    };
    setMatches(matches);
  };

  const handleConfirm = async () => {
    // onClose();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/create-ff-tournament`,
        {
          title: matchType,
          time: dateTime,
          owner: gameName,
          ammo: limitedAmmo,
          skill: characterSkill,
          reward: winnerPrice,
          cost: entryCost,
        }
      );
      if (res.data) {
        toast.success("Tournament created successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("unable to create");
    }
  };

  return (
    <div className="px-6 py-6 max-w-xl mx-auto text-white bg-black">
      {isModalOpen ? <ConfirmTournamentModal onClose={onClose} match={match} /> : null}
      <h1 className="text-3xl text-yellow-400 font-bold text-center underline mb-6">
        Create Free Fire Tournament
      </h1>

      {/* Owner */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-semibold">Game Name</label>
        <input
          onChange={(e) => setGameName(e.target.value)}
          type="text"
          placeholder="Enter owner name"
          className="w-full px-3 py-2 border text-white border-gray-300 rounded-lg"
        />
      </div>

      {/* Match Type */}
      <div className="mb-4">
        <p className="mb-1 text-sm font-semibold">Match Type</p>
        <div className="flex gap-3">
          {["cs 4 v 4", "br solo"].map((type) => (
            <button
              key={type}
              onClick={() => setMatchType(type as "cs 4 v 4" | "br solo")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                matchType === type
                  ? "bg-green-500 text-white"
                  : "bg-[#8beeff] text-black"
              }`}
            >
              {type === "cs 4 v 4" ? "CS 4 v 4" : "BR Solo"}
            </button>
          ))}
        </div>
      </div>

      {/* Limited Ammo */}
      <div className="mb-4">
        <p className="mb-1 text-sm font-semibold">Limited Ammo</p>
        <div className="flex gap-3">
          {[true, false].map((val) => (
            <button
              key={val.toString()}
              onClick={() => setLimitedAmmo(val)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                limitedAmmo === val
                  ? val
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-[#8beeff] text-black"
              }`}
            >
              {val ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>

      {/* Character Skill */}
      <div className="mb-4">
        <p className="mb-1 text-sm font-semibold">Character Skills</p>
        <div className="flex gap-3">
          {[true, false].map((val) => (
            <button
              key={val.toString()}
              onClick={() => setCharacterSkill(val)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                characterSkill === val
                  ? val
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-[#8beeff] text-black"
              }`}
            >
              {val ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>

      {/* Tournament Date Time */}
      <div className="mb-4">
        <p className="mb-1 text-sm  font-semibold">Tournament Date & Time</p>
        <input
          className="w-full border px-3 py-2 rounded-lg text-white"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
      </div>

      {/* Cost & Reward */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <p>Entry cost</p>
        <input
          onChange={(e: any) => setEntryCost(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg text-white"
          type="number"
          placeholder="Entry Cost"
        />
        <p>Reward for winner</p>
        <input
          onChange={(e: any) => setWinnerPrice(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg text-white"
          type="number"
          placeholder="Reward for Winner"
        />
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        className="w-full bg-yellow-400 hover:bg-yellow-500 transition-all text-black font-bold py-2 rounded-lg shadow-md"
      >
        Confirm to Create
      </button>
    </div>
  );
};

export default Page;
