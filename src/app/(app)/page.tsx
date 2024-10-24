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
    title: "Message from mystery guest",
    content: "Hi how are you doing today",
    received: "3 day ago",
  },
  {
    title: "Message from mystery guest",
    content: "I really liked your recent post",
    received: "2 hours day ago",
  },
  {
    title: "Message from mystery guest",
    content: "Do you have any book suggestion for me",
    received: "1 day ago",
  },
  {
    title: "Message from mystery guest",
    content: "What you ate today",
    received: "one day ago",
  },
];

const page = () => {
  return (
    <>
      <main className="flex flex-grow flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the world of anonyms conversation
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Explore Mystery Message - Where your identity will remain secret
          </p>
        </section>
        <Carousel
          className="w-full max-w-xs"
          plugins={[Autoplay({ delay: 2000 })]}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>{message.title}</CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="text-pretty shadow-md text-center px-2 py-4 border-t-2">
        Copyright @2024 made by @karan
      </footer>
    </>
  );
};

export default page;
