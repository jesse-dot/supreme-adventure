import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Header } from "@/components/Header";
import { MessageSquare, Phone, Sparkles } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const character = await prisma.character.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
          imageUrl: true,
          bio: true,
        },
      },
    },
  });

  if (!character) {
    redirect("/");
  }

  // Get user
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // Get existing conversation if any
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      userId: user?.id,
      characterId: character.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Character Header */}
          <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 h-48 flex items-center justify-center">
            <span className="text-8xl font-bold text-white">
              {character.name[0]}
            </span>
          </div>

          {/* Character Info */}
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-2 dark:text-white">{character.name}</h1>
            <Link
              href={`/profile/${character.user.username}`}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {character.user.imageUrl && (
                <img
                  src={character.user.imageUrl}
                  alt={character.user.username || "User"}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span>by {character.user.username}</span>
            </Link>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-8">{character.description}</p>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Link
                href={
                  existingConversation
                    ? `/chat/${existingConversation.id}`
                    : `/chat/new?characterId=${character.id}`
                }
                className="flex-1 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-5 w-5" />
                Start Chat
              </Link>
              <Link
                href={`/voice-call/${character.id}`}
                className="flex-1 bg-purple-600 dark:bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Voice Call
              </Link>
            </div>

            {/* Character Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Greeting</h3>
                <p className="text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  {character.greeting}
                </p>
              </div>

              {character.personality && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Personality</h3>
                  <p className="text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg whitespace-pre-wrap">
                    {character.personality}
                  </p>
                </div>
              )}

              {character.scenario && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Scenario</h3>
                  <p className="text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg whitespace-pre-wrap">
                    {character.scenario}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
