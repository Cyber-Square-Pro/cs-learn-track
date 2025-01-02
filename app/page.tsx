"use client";

import React from "react";
import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center justify-around bg-black ">
      <div className="relative flex flex-col items-center justify-center w-3/5 h-auto min-h-screen text-white">
        <header className="top-0 left-0 w-full py-4 ">
          <h1 className="text-2xl font-bold text-white">Learn Track</h1>
        </header>
        <main className="relative flex flex-col items-center justify-center min-h-screen">
          <span className={poppins.className}>
            <h2 className="mb-8 text-6xl font-bold text-center">
              Welcome to Learn Track
            </h2>
          </span>

          <div className={poppins.className}>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 text-white transition rounded-md bg-primary hover:bg-white hover:text-primary"
                onClick={() => (window.location.href = "/student-login")}
              >
                Student Login
              </button>
              <button
                className="px-4 py-2 text-white transition rounded-md bg-primary hover:bg-white hover:text-primary"
                onClick={() => (window.location.href = "/admin-login")}
              >
                Admin Login
              </button>
            </div>
          </div>
          <br />
          <br />
          <Image
            src="/lp_img.webp"
            alt="Education"
            className="relative bottom-0 w-3/4 mb-8"
            width={900}
            height={800}
          />
        </main>
      </div>
    </div>
  );
};

export default SignInPage;
