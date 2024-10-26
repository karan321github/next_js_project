"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";

const NavBar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="bg-gray-800 p-4 md:p-6 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-white">
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide hover:text-gray-300 transition-colors duration-200"
        >
          Mystery Message
        </Link>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {session ? (
            <>
              <span className="text-gray-300">
                Welcome,{" "}
                <span className="font-semibold">
                  {user?.username || user?.email}
                </span>
              </span>
              <Button
                className="bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white px-4 py-2 rounded-md"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white px-4 py-2 rounded-md">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
