"use client";
import CancelTournamentModal from "@/components/CancelTournament";
/* eslint-disable */

import axios from "axios";
import { Loader } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
  id: string;
  userId?: string;
  balance?: number;
}

interface EnteredTournament {
  id: string;
  gameName: string;
  user: User;
  isWinner: boolean;
  status: string;
  message: string;
}

interface Tournament {
  id: string;
  title: string;
  time: string;
  owner: string;
  ammo: boolean;
  skill: boolean;
  reward: number;
  cost: number;
  roomId?: string;
  password?: string;
  enteredFfTournament: EnteredTournament[];
}

const page = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<EnteredTournament[]>(
    []
  );
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBtnLoad, setIsBtnLoad] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cancelTournamentModal, setCancelTournamentModal] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState<string | null>(
    null
  );
  const [showPlayersDrawer, setShowPlayersDrawer] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/get-all-tournament`
      );
      setTournaments(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const closeCancelModal = () => {
    setCancelTournamentModal(!cancelTournamentModal);
  };

  const openEditModal = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setRoomId(tournament.roomId || "");
    setPassword(tournament.password || "");
  };

  const closeEditModal = () => {
    setSelectedTournament(null);
    setRoomId("");
    setPassword("");
  };

  const handleSaveTournament = async () => {
    if (!selectedTournament) return;
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/update-roomid-password/${selectedTournament.id}`,
        { roomId, password }
      );
      fetchTournaments();
      closeEditModal();
      toast.success("Update sucessfully");
    } catch (error) {
      console.error(error);
      toast.error("Unable to update");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteTournament = (id: string) => {
    setTournamentToDelete(id);
    setShowDeleteConfirm(true);
  };

  const deleteTournament = async () => {
    if (!tournamentToDelete) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/delete-tournament/${tournamentToDelete}`
      );
      setTournaments((prev) => prev.filter((t) => t.id !== tournamentToDelete));
    } catch (error) {
      console.error(error);
    } finally {
      setShowDeleteConfirm(false);
      setTournamentToDelete(null);
    }
  };

  const openPlayersDrawer = (players: EnteredTournament[]) => {
    setSelectedPlayers(players);
    setShowPlayersDrawer(true);
  };

  const handleWinner = async (winnerId: string) => {
    setIsBtnLoad(true);
    if (!winnerId) return;
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/make-winner/${winnerId}`
      );
      if (res.data) {
        setIsBtnLoad(false);
        toast.success("Winner updated successfully");
      }
    } catch (error) {
      console.error(error);
      setIsBtnLoad(false);
      toast.error("error on update winner");
    } finally {
      setIsBtnLoad(false);
    }
  };

  return (
    <div className="px-4 py-6 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-yellow-400 drop-shadow-lg">
          🎯 Manage Tournaments
        </h1>
        <Link
          href="/freefire"
          className="mt-4 md:mt-0 bg-yellow-500 text-black font-semibold px-5 py-2 rounded-lg shadow hover:bg-yellow-400 transition-all"
        >
          ← Back to FreeFire
        </Link>
      </div>

      {/* Tournament List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="bg-gray-800 rounded-xl shadow-lg p-5 hover:shadow-yellow-500/30 transition-all flex flex-col justify-between border border-gray-700"
          >
            <div>
              <h2 className="text-xl font-bold text-yellow-300 mb-1">
                {tournament.title}
              </h2>
              <p className="text-sm text-gray-400 mb-3">
                👤 Owner:{" "}
                <span className="font-medium">{tournament.owner}</span>
              </p>

              <p className="text-sm text-gray-300 mb-2">
                ⏰{" "}
                {new Date(tournament.time).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Kathmandu",
                })}
              </p>

              <div className="flex justify-between text-sm mb-3">
                <span className="text-green-400 font-medium">
                  Reward: {tournament.reward} 💰
                </span>
                <span className="text-red-400 font-medium">
                  Entry: {tournament.cost} 💵
                </span>
              </div>

              <p className="text-sm font-medium text-gray-300 mb-2">
                👥 Joined:{" "}
                <span className="text-yellow-400">
                  {tournament.enteredFfTournament.length}
                </span>{" "}
                players
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4 flex-wrap">
              <button
                onClick={() => openEditModal(tournament)}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-all cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() =>
                  openPlayersDrawer(tournament.enteredFfTournament)
                }
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-all cursor-pointer"
              >
                Players
              </button>
              {cancelTournamentModal ? (
                <CancelTournamentModal
                  onCancel={closeCancelModal}
                  tournamentId={tournament.id}
                  cost={tournament.cost}
                />
              ) : null}
              <button
                onClick={() => setCancelTournamentModal(true)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteTournament(tournament.id)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {selectedTournament && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 w-96 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-yellow-300">
              Edit Tournament
            </h2>
            <input
              type="text"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="mb-3 w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-3 w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-3 py-2"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={closeEditModal}
                className="bg-gray-700 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTournament}
                className="bg-yellow-500 cursor-pointer px-4 py-2 rounded-lg text-black font-semibold hover:bg-yellow-400"
              >
                {loading ? (
                  <div className="flex gap-1 items-center">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 w-96 text-center border border-gray-700">
            <h2 className="text-lg font-bold mb-4 text-red-400">
              Are you sure you want to delete?
            </h2>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-700 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={deleteTournament}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Players Drawer */}
      {showPlayersDrawer && (
        <div className="fixed inset-y-0 right-0 w-96 bg-gray-900 border-l border-gray-700 shadow-lg p-4 z-50 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4 text-yellow-300">
            Entered Users
          </h2>
          {selectedPlayers.map((player: any) => (
            <div key={player.id} className="border-b border-gray-700 pb-3 mb-3">
              <p>
                🎮 {player.gameName}{" "}
                <span className="text-gray-400">
                  ({player.userId || "No name"})
                </span>
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleWinner(player.userId)}
                  className="bg-green-600 text-white cursor-pointer px-2 py-1 rounded hover:bg-green-500"
                >
                  {isBtnLoad ? (
                    <div className="div  flex gap-1">
                      <Loader className="w-6 h-6 text-white font-semibold animate-spin" />
                      <p>Loading...</p>
                    </div>
                  ) : (
                    "Make winner"
                  )}
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => setShowPlayersDrawer(false)}
            className="mt-4 w-full bg-gray-700 py-2 rounded-lg text-gray-300 hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default page;
