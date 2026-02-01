"use client";

import Link from "next/link";
import { Plus, Sparkles, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              AI Chat
            </h1>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/characters"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
            >
              Discover
            </Link>
            <Link
              href="/my-characters"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
            >
              My Characters
            </Link>
            <Link
              href="/profile/edit"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
            >
              <User className="h-5 w-5" />
            </Link>
            <ThemeToggle />
            <Link
              href="/create-character"
              className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Character
            </Link>
            <UserButton afterSignOutUrl="/" />
          </nav>
        </div>
      </div>
    </header>
  );
}
