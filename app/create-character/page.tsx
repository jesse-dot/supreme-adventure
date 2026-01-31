"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CreateCharacterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    greeting: "",
    personality: "",
    scenario: "",
    exampleConversation: "",
    isPublic: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create character");

      const character = await response.json();
      router.push(`/character/${character.id}`);
    } catch (error) {
      console.error("Error creating character:", error);
      alert("Failed to create character. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
              <h1 className="text-xl font-bold">Create Character</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg border p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Character Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Luna the Wise Owl"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
              >
                Short Description *
              </label>
              <textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                placeholder="A brief description of your character..."
              />
            </div>

            <div>
              <label
                htmlFor="greeting"
                className="block text-sm font-medium mb-2"
              >
                Greeting Message *
              </label>
              <textarea
                id="greeting"
                required
                value={formData.greeting}
                onChange={(e) =>
                  setFormData({ ...formData, greeting: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                placeholder="The first message your character will send..."
              />
            </div>

            <div>
              <label
                htmlFor="personality"
                className="block text-sm font-medium mb-2"
              >
                Personality
              </label>
              <textarea
                id="personality"
                value={formData.personality}
                onChange={(e) =>
                  setFormData({ ...formData, personality: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                placeholder="Describe the personality traits, speaking style, and behavior..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Helps the AI understand how your character should respond
              </p>
            </div>

            <div>
              <label
                htmlFor="scenario"
                className="block text-sm font-medium mb-2"
              >
                Scenario/Background
              </label>
              <textarea
                id="scenario"
                value={formData.scenario}
                onChange={(e) =>
                  setFormData({ ...formData, scenario: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                placeholder="The setting or context for conversations..."
              />
            </div>

            <div>
              <label
                htmlFor="exampleConversation"
                className="block text-sm font-medium mb-2"
              >
                Example Conversation
              </label>
              <textarea
                id="exampleConversation"
                value={formData.exampleConversation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    exampleConversation: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                placeholder="Example dialogue to help train the AI..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Use format: User: Hello! / Character: Hi there!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isPublic"
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData({ ...formData, isPublic: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="isPublic" className="text-sm font-medium">
                Make this character public for others to chat with
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50 transition text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create Character"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
