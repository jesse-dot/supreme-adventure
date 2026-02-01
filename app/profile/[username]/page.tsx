import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Header } from "@/components/Header";
import { MessageSquare } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/sign-in");
  }

  // Find the profile user
  const profileUser = await prisma.user.findFirst({
    where: { username },
  });

  if (!profileUser) {
    redirect("/");
  }

  // Get their public characters
  const characters = await prisma.character.findMany({
    where: {
      userId: profileUser.id,
      isPublic: true,
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          favorites: true,
          conversations: true,
        },
      },
    },
  });

  // Check if viewing own profile
  const currentUser = await prisma.user.findUnique({
    where: { clerkId },
  });
  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="relative">
              {profileUser.imageUrl ? (
                <img
                  src={profileUser.imageUrl}
                  alt={profileUser.username || "User"}
                  className="w-24 h-24 rounded-full border-4 border-blue-500 dark:border-blue-400"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold border-4 border-blue-500">
                  {(profileUser.username || "U")[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 dark:text-white">
                {profileUser.username || "User"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {profileUser.email}
              </p>
              {profileUser.bio && (
                <p className="text-gray-700 dark:text-gray-200 mb-4">
                  {profileUser.bio}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{characters.length} public characters</span>
                <span>Joined {new Date(profileUser.createdAt).toLocaleDateString()}</span>
              </div>
              {isOwnProfile && (
                <Link
                  href="/profile/edit"
                  className="mt-4 inline-block bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                >
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Characters Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6 dark:text-white">
            {isOwnProfile ? "Your" : `${profileUser.username}'s`} Characters
          </h2>
          
          {characters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character: any) => (
                <Link
                  key={character.id}
                  href={`/character/${character.id}`}
                  className="block group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white">
                      <span className="text-5xl font-bold">{character.name[0]}</span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition dark:text-white">
                        {character.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                        {character.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>💬 {character._count.conversations} chats</span>
                        <span>❤️ {character._count.favorites} favorites</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                No public characters yet
              </h3>
              {isOwnProfile && (
                <>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Create your first character to get started!
                  </p>
                  <Link
                    href="/create-character"
                    className="inline-block bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                  >
                    Create Character
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
