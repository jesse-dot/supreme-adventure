import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Sparkles, Search } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function CharactersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const characters = await prisma.character.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          username: true,
          imageUrl: true,
        },
      },
      _count: {
        select: {
          favorites: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search characters..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {characters.map((character: any) => (
            <Link
              key={character.id}
              href={`/character/${character.id}`}
              className="block group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white">
                  <span className="text-6xl font-bold">{character.name[0]}</span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition dark:text-white">
                    {character.name}
                  </h4>
                  <Link
                    href={`/profile/${character.user.username}`}
                    className="text-sm text-gray-500 dark:text-gray-400 mb-2 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {character.user.imageUrl && (
                      <img
                        src={character.user.imageUrl}
                        alt={character.user.username}
                        className="w-4 h-4 rounded-full"
                      />
                    )}
                    by {character.user.username}
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                    {character.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>❤️ {character._count.favorites} favorites</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {characters.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">No public characters yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Be the first to create and share a character!</p>
            <Link
              href="/create-character"
              className="inline-block bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              Create Character
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
