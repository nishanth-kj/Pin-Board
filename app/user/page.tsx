"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import users from "@/data/user";

export default function UserPage() {
  const router = useRouter();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => setLocation(null),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const [selectedUser, setSelectedUser] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Select User</h1>
      {location ? (
        <div className="mb-4 w-full max-w-md h-64">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&output=embed`}
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p className="mb-4 text-gray-700 dark:text-gray-300">Fetching location...</p>
      )}
      
      <select
        className="p-2 border rounded"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Select a User</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>{user.name}</option>
        ))}
      </select>
      
      <div className="mt-4">
        <input
          type="checkbox"
          id="confirm"
          checked={checkboxChecked}
          onChange={(e) => setCheckboxChecked(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="confirm" className="text-gray-700 dark:text-gray-300">Confirm Selection</label>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        disabled={!selectedUser || !checkboxChecked}
        onClick={() => router.push(`/user/${selectedUser}`)}
      >
        View Profile
      </button>
    </div>
  );
}
