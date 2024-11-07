"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";
import {
  Menu,
  X,
  MessageSquare,
  User as UserIcon,
  LogOut,
  Home,
} from "lucide-react";

const NavBar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-3 text-xl font-bold text-white hover:text-blue-400 transition-colors duration-200"
            >
              <MessageSquare className="h-6 w-6" />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Mystery Message
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 hover:bg-gray-800 transition-all duration-200"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 hover:bg-gray-800 transition-all duration-200"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center space-x-4 ml-4 border-l border-gray-700 pl-4">
                  <span className="text-sm text-gray-300">
                    Welcome,{" "}
                    <span className="font-semibold text-blue-400">
                      {user?.username || user?.email}
                    </span>
                  </span>
                  <Button
                    onClick={() => signOut()}
                    className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-md transition-all duration-300 transform hover:scale-105">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900">
            <Link
              href="/"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800"
            >
              Home
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800"
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2">
                  <span className="text-sm text-gray-300">
                    Signed in as{" "}
                    <span className="font-medium text-blue-400">
                      {user?.username || user?.email}
                    </span>
                  </span>
                </div>
                <Button
                  onClick={() => signOut()}
                  className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white mt-2 py-2 rounded-md"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/sign-in" className="block px-3 py-2">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 rounded-md">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
