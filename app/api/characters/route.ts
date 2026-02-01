import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      const clerkUser = await (await import("@clerk/nextjs/server")).currentUser();
      if (!clerkUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          username: clerkUser.username || clerkUser.firstName || "User",
          imageUrl: clerkUser.imageUrl,
        },
      });
    }

    const body = await req.json();
    const {
      name,
      description,
      greeting,
      personality,
      scenario,
      exampleConversation,
      isPublic,
    } = body;

    const character = await prisma.character.create({
      data: {
        name,
        description,
        greeting,
        personality: personality || "",
        scenario: scenario || "",
        exampleConversation: exampleConversation || "",
        isPublic: isPublic ?? true,
        userId: user.id,
      },
    });

    return NextResponse.json(character);
  } catch (error) {
    console.error("Error creating character:", error);
    return NextResponse.json(
      { error: "Failed to create character" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isPublicOnly = searchParams.get("public") === "true";

    const characters = await prisma.character.findMany({
      where: isPublicOnly ? { isPublic: true } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return NextResponse.json(characters);
  } catch (error) {
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { error: "Failed to fetch characters" },
      { status: 500 }
    );
  }
}
