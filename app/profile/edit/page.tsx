"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/Header";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      loadProfile();
    }
  }, [isLoaded, user]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setFormData({
          username: data.username || "",
          bio: data.bio || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const data = await response.json();
      router.push(`/profile/${data.username}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Link
            href={`/profile/${formData.username || user?.username}`}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold mb-6 dark:text-white">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2 dark:text-white">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Your username"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-2 dark:text-white">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 dark:bg-gray-700 dark:text-white"
                placeholder="Tell us about yourself..."
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Share a bit about yourself with the community
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                {isSaving ? "Saving..." : "Save Profile"}
              </button>
              <Link
                href={`/profile/${formData.username || user?.username}`}
                className="flex-1 border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center dark:text-white"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
