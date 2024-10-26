"use client";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

const randomMessages = [
  "Hey! Just dropping by to say hi.",
  "What's something exciting you're working on?",
  "Got any book recommendations?",
  "Hope you're having a great day!",
];

const page = () => {
  const param = useParams();
  const [content, setContent] = useState("");
  const handleSuggestMessage = (message: string) => {
    const textarea = document.getElementById(
      "message-2"
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = message;
    }
  };
  console.log(param);
  console.log(content);
  const handleSubmit = async () => {
    const username = param.username;
    const response = await axios.post(`/api/send-message`, {
      username,
      content,
    });
    console.log(content);
    console.log(response.data);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-6 py-12">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg transform transition-transform hover:scale-105">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800 tracking-tight">
          Send an Anonymous Message
        </h1>
        <div className="space-y-4">
          <Label htmlFor="message-2" className="text-gray-700 text-lg">
            Your Message
          </Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message here."
            id="message-2"
            className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md"
          />
          <p className="text-sm text-gray-500 text-center mt-2">
            Your message will be shared anonymously.
          </p>
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 mt-6 rounded-md shadow-md transition-all"
          >
            Send Message
          </Button>
        </div>
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Quick Suggestions
          </h2>
          <div className="grid gap-3">
            {randomMessages.map((message, index) => (
              <Button
                key={index}
                onClick={() => handleSuggestMessage(message)}
                className="w-full text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all text-sm rounded-md py-2 shadow-sm"
              >
                {message}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
