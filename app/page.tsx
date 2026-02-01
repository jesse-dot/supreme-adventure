import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { MessageSquare, Plus, Sparkles } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get or create user in database
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    const clerkUser = await (await import("@clerk/nextjs/server")).currentUser();
    if (clerkUser) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          username: clerkUser.username || clerkUser.firstName || "User",
          imageUrl: clerkUser.imageUrl,
        },
      });
    }
  }

  // Get public characters for discovery
  const publicCharacters = await prisma.character.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 12,
    include: {
      user: {
        select: {
          username: true,
          imageUrl: true,
        },
      },
    },
  });

  // Get user's recent conversations
  const recentConversations = await prisma.conversation.findMany({
    where: { userId: user?.id },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: {
      character: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Chat with AI Characters
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Create, discover, and chat with unique AI personalities
          </p>
        </section>

        {/* Recent Conversations */}
        {recentConversations.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6 dark:text-white">Continue Your Conversations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentConversations.map((conversation: any) => (
                <Link
                  key={conversation.id}
                  href={`/chat/${conversation.id}`}
                  className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                      {conversation.character.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate dark:text-white">
                        {conversation.character.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {conversation.messages[0]?.content || conversation.character.greeting}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Discover Characters */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold dark:text-white">Discover Characters</h3>
            <Link
              href="/characters"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {publicCharacters.map((character: any) => (
              <Link
                key={character.id}
                href={`/character/${character.id}`}
                className="block group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white">
                    <span className="text-6xl font-bold">
                      {character.name[0]}
                    </span>
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
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {character.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {publicCharacters.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 dark:text-white">No characters yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Be the first to create a character!
              </p>
              <Link
                href="/create-character"
                className="inline-flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
              >
                <Plus className="h-5 w-5" />
                Create Your First Character
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
