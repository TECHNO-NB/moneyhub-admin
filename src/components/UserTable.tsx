"use client";
/* eslint-disable */
import { ShieldAlert, Trash2 } from "lucide-react"

type Props = {
  users: any[];
  onChangeRoleClick: (user: any) => void;
  onDeleteClick: (user: any) => void;
};

const UserTable = ({ users, onChangeRoleClick, onDeleteClick }: Props) => {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full text-sm border border-gray-700 text-white">
        <thead className="bg-zinc-800 text-gray-300">
          <tr>
            <th className="p-3">#</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-center">Balance</th>
            <th className="p-3 text-center">Role</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-zinc-900">
          {users?.map((user, index) => (
            <tr key={user.id} className="border-t border-zinc-700">
              <td className="p-3 text-center">{index + 1}</td>
              <td className="p-3">{user.fullName}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3 text-center">{user.balance}</td>
              <td className="p-3 text-center">{user.role}</td>
              <td className="p-3 flex justify-center gap-2">
                <button
                
                  className="text-xs"
                  onClick={() => onChangeRoleClick(user)}
                >
                  <ShieldAlert className="h-4 w-4 mr-1" />
                  Change Role
                </button>
                <button
              
                  className="text-xs"
                  onClick={() => onDeleteClick(user)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
