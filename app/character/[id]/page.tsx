import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Phone, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
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
              <h1 className="text-xl font-bold">Character Profile</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg border overflow-hidden">
          {/* Character Header */}
          <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 h-48 flex items-center justify-center">
            <span className="text-8xl font-bold text-white">
              {character.name[0]}
            </span>
          </div>

          {/* Character Info */}
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-2">{character.name}</h1>
            <p className="text-gray-600 mb-4">by {character.user.username}</p>
            <p className="text-lg text-gray-700 mb-8">{character.description}</p>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Link
                href={
                  existingConversation
                    ? `/chat/${existingConversation.id}`
                    : `/chat/new?characterId=${character.id}`
                }
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-5 w-5" />
                Start Chat
              </Link>
              <Link
                href={`/voice-call/${character.id}`}
                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Voice Call
              </Link>
            </div>

            {/* Character Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Greeting</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {character.greeting}
                </p>
              </div>

              {character.personality && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Personality</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {character.personality}
                  </p>
                </div>
              )}

              {character.scenario && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Scenario</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
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
