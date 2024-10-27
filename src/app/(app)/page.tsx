"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Lock } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

const messages = [
  {
    title: "Anonymous Admirer",
    content: "Your creativity inspires me every day!",
    received: "3 days ago",
  },
  {
    title: "Secret Supporter",
    content: "Thank you for being such a positive influence",
    received: "2 hours ago",
  },
  {
    title: "Mystery Friend",
    content: "Your recent achievements are truly remarkable",
    received: "1 day ago",
  },
  {
    title: "Hidden Helper",
    content: "Keep spreading joy wherever you go!",
    received: "1 day ago",
  },
];

const features = [
  {
    icon: <MessageSquare className="w-12 h-12 mb-4 text-blue-400" />,
    title: "Anonymous Messages",
    description: "Share your thoughts freely without revealing your identity",
  },
  {
    icon: <Lock className="w-12 h-12 mb-4 text-green-400" />,
    title: "Secure & Private",
    description: "Your privacy is our top priority with end-to-end protection",
  },
  {
    icon: <Send className="w-12 h-12 mb-4 text-purple-400" />,
    title: "Instant Delivery",
    description: "Messages are delivered instantly to their recipients",
  },
];


const HomePage = () => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 animate-fade-in">
              Express Yourself Freely
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Share your thoughts anonymously with anyone, anywhere
            </p>
            <div className="flex justify-center gap-4">
              {session ? (
                <Link href="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                    View Messages
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-in">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-750"
              >
                <div className="text-center">
                  {feature.icon}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Carousel */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              Recent Anonymous Messages
            </h2>
            <Carousel
              className="max-w-2xl mx-auto"
              plugins={[Autoplay({ delay: 3000 })]}
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index}>
                    <Card className="bg-gray-800 border border-gray-700 transform transition-all duration-300 hover:border-blue-500">
                      <CardHeader className="text-lg font-semibold text-blue-400 border-b border-gray-700">
                        {message.title}
                      </CardHeader>
                      <CardContent className="p-6">
                        <p className="text-xl text-white mb-4">
                          {message.content}
                        </p>
                        <p className="text-sm text-gray-400">
                          {message.received}
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="text-white" />
              <CarouselNext className="text-white" />
            </Carousel>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-lg font-semibold">Mystery Message</span>
              <p className="text-sm">Express yourself freely and securely</p>
            </div>
            <div className="text-sm">
              © 2024 Made by @karan - All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
