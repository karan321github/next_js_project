"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Send, Sparkles, Lock, MessageSquare } from "lucide-react";
import axios from "axios";

const randomMessages = [
  "Hey! Just dropping by to say hi.",
  "What's something exciting you're working on?",
  "Got any book recommendations?",
  "Hope you're having a great day!",
];

const ProfilePage = () => {
  const { toast } = useToast();
  const param = useParams();
  const [message, setMessages] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSuggestMessage = (message: string) => {
    setMessages(message);
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const username = param.username;
    const content = message;

    try {
      const response = await axios.post(`/api/send-message`, {
        username,
        content,
      });

      if (response.status === 200) {
        toast({
          title: "Message Sent",
          description: "Your anonymous message has been delivered!",
        });
        setMessages("");
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast({
          title: "Not Available",
          description: "This user is not accepting messages at the moment",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Send to @{param.username}
            </h1>
            <p className="text-gray-400">
              Your message will be delivered anonymously
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-750 rounded-lg">
              <Lock className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-sm text-gray-300">100% Anonymous</p>
            </div>
            <div className="text-center p-4 bg-gray-750 rounded-lg">
              <Send className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <p className="text-sm text-gray-300">Instant Delivery</p>
            </div>
            <div className="text-center p-4 bg-gray-750 rounded-lg">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <p className="text-sm text-gray-300">Safe & Secure</p>
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-4">
            <Label htmlFor="message" className="text-gray-300 text-lg">
              Your Anonymous Message
            </Label>
            <Textarea
              value={message}
              onChange={(e) => setMessages(e.target.value)}
              placeholder="Type your message here..."
              id="message"
              className="min-h-[120px] bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Anonymous Message"
              )}
            </Button>
          </div>

          {/* Quick Suggestions */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-300 mb-4 text-center">
              Message Suggestions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {randomMessages.map((message, index) => (
                <Button
                  key={index}
                  onClick={() => handleSuggestMessage(message)}
                  variant="outline"
                  className="bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 transition-all duration-300"
                >
                  {message}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            All messages are encrypted and anonymous. Be kind and respectful.
          </p>
          <p className="mt-2">© 2024 Mystery Message - All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
