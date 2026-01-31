import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Sparkles, Plus } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function MyCharactersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  const characters = user
    ? await prisma.character.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              conversations: true,
              favorites: true,
            },
          },
        },
      })
    : [];

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
                <h1 className="text-xl font-bold">My Characters</h1>
              </div>
            </div>
            <Link
              href="/create-character"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Character
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character: any) => (
            <Link
              key={character.id}
              href={`/character/${character.id}`}
              className="block group"
            >
              <div className="bg-white rounded-lg border hover:shadow-xl transition-all duration-200 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white">
                  <span className="text-5xl font-bold">{character.name[0]}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-lg group-hover:text-blue-600 transition">
                      {character.name}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        character.isPublic
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {character.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {character.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>💬 {character._count.conversations} chats</span>
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
            <h3 className="text-xl font-semibold mb-2">No characters yet</h3>
            <p className="text-gray-600 mb-4">Create your first AI character to get started!</p>
            <Link
              href="/create-character"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="h-5 w-5" />
              Create Your First Character
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
