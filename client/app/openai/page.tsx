"use client";

import { useState } from "react";
import OpenAI from "openai";
import Layout from "@/app/dashboard/page";

export default function StoryGenerator() {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [voice, setVoice] = useState("alloy");

  const generateStory = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4001/api/generate-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
  
      const data = await response.json();
      setStory(data.story);
      generateSpeech(data.story);
    } catch (error) {
      console.error("Error generating story:", error);
      setStory("Failed to generate a story. Try again.");
    }
    setLoading(false);
  };
  

  const generateSpeech = async (text) => {
    try {
      const response = await fetch("http://localhost:4001/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, voice }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }
  
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };
  

  return (
    <Layout>
      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">AI Generador de Historias</h1>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Ingresa ..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <select
          className="mt-2 p-2 border rounded w-full"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
        >
          <option value="alloy">Alloy (Hombre)</option>
          <option value="nova">Nova (Mujer)</option>
          <option value="echo">Echo (Neutral)</option>
        </select>
        <button
          className="mt-2 p-2 bg-blue-500 text-white rounded"
          onClick={generateStory}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Story"}
        </button>
        {story && (
          <div className="mt-4 p-2 border rounded bg-gray-100">
            <h2 className="font-semibold">Generated Story:</h2>
            <p>{story}</p>
            {audioUrl && (
              <audio controls className="mt-2 w-full">
                <source src={audioUrl} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
