"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifyMessageValidation } from "@/schemas/verifyMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const VerifyAccount = () => {
  const param = useParams<{ username: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifyMessageValidation>>({
    resolver: zodResolver(verifyMessageValidation),
    defaultValues: {},
  });

  const getCode = async (data: z.infer<typeof verifyMessageValidation>) => {
    try {
      const response = await axios.post("/api/verify-code", {
        userName: param.username,
        code: data.code,
      });
      console.log(response.data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in verifying code", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 px-4 py-12">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center space-y-4 pb-6">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Verify your email
          </h1>
          <p className="text-gray-400">
            Sign up to start your anonymous adventure
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(getCode)} className="space-y-8">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      Verification code
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="pl-1 0 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your verification code"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className=" bg-gray-600 hover:bg-gray-50   0" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyAccount;
