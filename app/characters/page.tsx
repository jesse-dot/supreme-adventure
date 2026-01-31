import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Sparkles, Search } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Link>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold">Discover Characters</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search characters..."
              className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {characters.map((character) => (
            <Link
              key={character.id}
              href={`/character/${character.id}`}
              className="block group"
            >
              <div className="bg-white rounded-lg border hover:shadow-xl transition-all duration-200 overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white">
                  <span className="text-6xl font-bold">{character.name[0]}</span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition">
                    {character.name}
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">
                    by {character.user.username}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {character.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>❤️ {character._count.favorites} favorites</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {characters.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No public characters yet</h3>
            <p className="text-gray-600 mb-4">Be the first to create and share a character!</p>
            <Link
              href="/create-character"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Create Character
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
