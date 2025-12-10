import React from "react";
import users from "@/data/user";
import UserClient from "./client";

// Required for static export with dynamic routes
export async function generateStaticParams() {
  return users.map((user) => ({
    id: user.id.toString(),
  }));
}

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = users.find((u) => u.id === parseInt(id));

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User not found...</h1>
      </div>
    );
  }

  // Pass plain user object to client component
  return <UserClient user={user} />;
}
