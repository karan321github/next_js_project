"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const messages = [
  {
    title: "Message from Mystery Guest",
    content: "Hi, how are you doing today?",
    received: "3 days ago",
  },
  {
    title: "Message from Mystery Guest",
    content: "I really liked your recent post",
    received: "2 hours ago",
  },
  {
    title: "Message from Mystery Guest",
    content: "Do you have any book suggestions for me?",
    received: "1 day ago",
  },
  {
    title: "Message from Mystery Guest",
    content: "What did you eat today?",
    received: "1 day ago",
  },
];

const HomePage = () => {
  return (
    <>
      <main className="h-full flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gradient-to-b from-gray-800 to-gray-900 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-100 transition-all duration-300 hover:scale-105">
            Dive into the World of Anonymous Conversation
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 transition-opacity duration-200 hover:opacity-90">
            Explore Mystery Message – Where your identity remains a secret
          </p>
        </section>

        <Carousel
          className="w-full max-w-lg rounded-lg overflow-hidden shadow-lg bg-gray-900"
          plugins={[Autoplay({ delay: 2500 })]}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-4">
                  <Card className="bg-gray-800 text-white rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105">
                    <CardHeader className="text-center text-xl font-bold border-b border-gray-600 py-2">
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-6">
                      <p className="text-lg md:text-2xl font-medium text-center">
                        {message.content}
                      </p>
                    </CardContent>
                    <div className="text-xs text-gray-400 text-center pb-4">
                      Received {message.received}
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="bg-gray-800 text-gray-300 text-center px-2 py-4 border-t border-gray-700">
        <span className="hover:text-gray-200 transition-colors duration-200">
          © 2024 Made by @karan
        </span>
      </footer>

    </>
  );
};

export default HomePage;
