"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import {
  Loader2,
  RefreshCcw,
  Copy,
  MessageSquare,
  Bell,
  BellOff,
} from "lucide-react";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/models/user";
import { acceptMessageValidation } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageValidation),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg._id !== messageId)
    );
  };

  console.log("Message", messages[0]);

  const fetchAcceptMessage = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.message || []);
        if (refresh) {
          toast({
            title: "Messages Refreshed",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

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

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
      fetchAcceptMessage();
    }
  }, [session, fetchAcceptMessage, fetchMessages]);

  const username = session?.user ? session.user.username : null;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied",
      description: "Profile URL has been copied to clipboard",
    });
  };

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <Card className="bg-gray-800 border-gray-700 p-8">
          <CardContent>
            <p className="text-white text-xl">
              Please login to access your dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6">
              Welcome, {username}
            </h1>

            {/* Profile URL Section */}
            <Card className="bg-gray-750 border-gray-600">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Your Profile Link
                </h2>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="flex-1 bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
                  />
                  <Button
                    onClick={copyToClipBoard}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Section */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Switch
                  {...register("acceptMessages")}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className="data-[state=checked]:bg-blue-600"
                />
                <div className="flex items-center space-x-2">
                  {acceptMessages ? (
                    <Bell className="w-5 h-5 text-blue-400" />
                  ) : (
                    <BellOff className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="text-white font-medium">
                    {acceptMessages
                      ? "Accepting Messages"
                      : "Not Accepting Messages"}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => fetchMessages(true)}
                variant="outline"
                className="border-gray-600 text-stone hover:bg-gray-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <RefreshCcw className="w-5 h-5 mr-2" />
                )}
                Refresh
              </Button>
            </div>
          </div>

          {/* Messages Grid */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <MessageSquare className="w-6 h-6 text-blue-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">
                Your Messages
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <MessageCard
                    key={message._id}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No messages yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
