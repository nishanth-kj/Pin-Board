"use client";

import React from "react";
import { useRouter } from "next/navigation";

// Define strict types for the user data to match page.tsx
interface UserAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface UserPreferences {
  theme: string;
  notifications: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  address: UserAddress;
  preferences: UserPreferences;
  age: number;
}

export default function UserClient({ user }: { user: User }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">User Details</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-md">
        <p className="text-gray-700 dark:text-gray-300"><strong>ID:</strong> {user.id}</p>
        <p className="text-gray-700 dark:text-gray-300"><strong>Name:</strong> {user.name}</p>
        <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {user.email}</p>
        <p className="text-gray-700 dark:text-gray-300"><strong>Address:</strong> {user.address.street}, {user.address.city}, {user.address.state}, {user.address.zip}</p>
        <p className="text-gray-700 dark:text-gray-300"><strong>Preferences:</strong> Theme - {user.preferences.theme}, Notifications - {user.preferences.notifications ? "Enabled" : "Disabled"}</p>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => router.push("/")}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
