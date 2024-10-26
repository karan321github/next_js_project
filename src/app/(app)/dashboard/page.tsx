"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message, User } from "@/models/user";
import { acceptMessageValidation } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageValidation),
    defaultValues: {
      acceptMessages: false, // set initial value
    },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "error",
        description:
          axiosError.response?.data.message || "failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, acceptMessages]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        console.log(response.data);
        setMessages(response.data.message || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "error",
          description:
            axiosError.response?.data.message || "failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
      fetchAcceptMessage();
    }
  }, [session, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const newStatus = !acceptMessages;
      const response = await axios.post("/api/accept-messages", {
        acceptMessages: newStatus,
      });
      setValue("acceptMessages", newStatus);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to update message acceptance status",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const username = session?.user ? session.user.username : null;
  // if (!username) {
  //   return <div>Please login</div>;
  // }

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied",
      description: "Url has been copied to clipBoard",
    });
  };
  if (!session || !session.user) {
    return <div>please login</div>;
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded shadow-lg max-w-6xl">
      <h1 className="text-4xl font-semibold mb-6 text-gray-800">
        User Dashboard
      </h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">
          Copy your unique link
        </h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            title="User profile URL"
            className="input input-bordered w-full p-2 mr-2 border rounded"
          />
          <Button
            onClick={copyToClipBoard}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Copy
          </Button>
        </div>
      </div>
      <div className="mb-6">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
        />
        <span className="ml-2 text-gray-600">
          Accept Messages:{" "}
          <span className="font-semibold">{acceptMessages ? "On" : "Off"}</span>
        </span>
      </div>
      <Separator />
      <Button
        className="mt-6"
        variant="outline"
        onClick={() => fetchMessages(true)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
        Refresh Messages
      </Button>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message.content}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-gray-500">No messages to display</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
