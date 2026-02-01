import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { messages, characterId, conversationId } = body;

    // Get character
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    // Build the system prompt with character information
    const systemPrompt = `You are ${character.name}. ${character.description}

Personality: ${character.personality}

${character.scenario ? `Scenario: ${character.scenario}` : ""}

${character.exampleConversation ? `Example conversation:\n${character.exampleConversation}` : ""}

Always stay in character and respond as ${character.name} would. Be engaging and conversational.`;

    // Call Stable Hoard API
    const apiKey = process.env.STABLE_HOARD_API_KEY;
    if (!apiKey) {
      console.error("STABLE_HOARD_API_KEY not configured");
      // Return a simulated response for demo purposes
      return simulateAIResponse(character, messages, user, characterId, conversationId);
    }

    try {
      // Stable Horde API endpoint
      const response = await fetch("https://stablehorde.net/api/v2/generate/text/async", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": apiKey,
        },
        body: JSON.stringify({
          prompt: formatMessagesForStableHorde(systemPrompt, messages),
          params: {
            max_length: 200,
            temperature: 0.7,
            top_p: 0.9,
          },
          models: ["koboldcpp/TinyLlama-1.1B-Chat-v1.0-GGUF"],
        }),
      });

      if (!response.ok) {
        console.error("Stable Horde API error:", await response.text());
        return simulateAIResponse(character, messages, user, characterId, conversationId);
      }

      const data = await response.json();
      const jobId = data.id;

      // Poll for completion
      let result;
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const statusResponse = await fetch(`https://stablehorde.net/api/v2/generate/text/status/${jobId}`, {
          headers: { "apikey": apiKey },
        });
        
        const statusData = await statusResponse.json();
        
        if (statusData.done) {
          result = statusData.generations?.[0]?.text;
          break;
        }
      }

      if (!result) {
        return simulateAIResponse(character, messages, user, characterId, conversationId);
      }

      // Save messages to database
      const conversation = await saveConversation(
        user.id,
        characterId,
        conversationId,
        messages,
        result
      );

      return NextResponse.json({
        response: result,
        conversationId: conversation.id,
      });
    } catch (error) {
      console.error("Error calling Stable Horde:", error);
      return simulateAIResponse(character, messages, user, characterId, conversationId);
    }
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}

function formatMessagesForStableHorde(systemPrompt: string, messages: any[]) {
  let prompt = systemPrompt + "\n\n";
  messages.forEach((msg: any) => {
    if (msg.role === "user") {
      prompt += `User: ${msg.content}\n`;
    } else {
      prompt += `Assistant: ${msg.content}\n`;
    }
  });
  prompt += "Assistant: ";
  return prompt;
}

async function simulateAIResponse(
  character: any,
  messages: any[],
  user: any,
  characterId: string,
  conversationId?: string
) {
  // Simple simulated response for demo purposes
  const lastMessage = messages[messages.length - 1];
  let response = "";

  if (lastMessage.content.toLowerCase().includes("hello") || 
      lastMessage.content.toLowerCase().includes("hi")) {
    response = character.greeting || `Hello! I'm ${character.name}. How can I help you today?`;
  } else if (lastMessage.content.toLowerCase().includes("how are you")) {
    response = `I'm doing wonderfully, thank you for asking! As ${character.name}, I'm always excited to chat. What would you like to talk about?`;
  } else if (lastMessage.content.toLowerCase().includes("bye")) {
    response = `It was great talking with you! Feel free to come back anytime you want to chat with ${character.name}!`;
  } else {
    response = `As ${character.name}, I find that very interesting! ${character.description} What else would you like to know?`;
  }

  const conversation = await saveConversation(
    user.id,
    characterId,
    conversationId,
    messages,
    response
  );

  return NextResponse.json({
    response,
    conversationId: conversation.id,
  });
}

async function saveConversation(
  userId: string,
  characterId: string,
  conversationId: string | undefined,
  messages: any[],
  aiResponse: string
) {
  let conversation;

  if (conversationId) {
    conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });
  }

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userId,
        characterId,
      },
    });
  }

  // Save the last user message
  const lastUserMessage = messages[messages.length - 1];
  await prisma.message.create({
    data: {
      content: lastUserMessage.content,
      role: "user",
      conversationId: conversation.id,
      userId,
      characterId,
    },
  });

  // Save the AI response
  await prisma.message.create({
    data: {
      content: aiResponse,
      role: "assistant",
      conversationId: conversation.id,
      userId,
      characterId,
    },
  });

  return conversation;
}
