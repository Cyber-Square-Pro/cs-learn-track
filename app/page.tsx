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
    <div className="bg-richBlack flex flex-col justify-around items-center ">
      <div className="relative min-h-screen w-3/5 h-auto text-white flex flex-col items-center justify-center">
        <header className="w-full top-0 left-0 py-4 ">
          <h1 className="text-2xl font-bold text-white">Learn Track</h1>
        </header>
        <main className="flex relative flex-col items-center justify-center min-h-screen">
          <span className={poppins.className}>
            <h2 className="text-6xl font-bold mb-8 text-center">
              Welcome to Learn Track
            </h2>
          </span>

          <div className={poppins.className}>
            <div className="flex space-x-4">
              <button
                className="bg-primary text-white py-2 px-4 rounded-md hover:bg-white hover:text-primary transition"
                onClick={() => (window.location.href = "/student-login")}
              >
                Student Login
              </button>
              <button
                className="bg-primary text-white py-2 px-4 rounded-md hover:bg-white hover:text-primary transition"
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
            className="relative w-3/4 mb-8 bottom-0"
            width={900}
            height={800}
          />
        </main>
      </div>
    </div>
  );
};

export default SignInPage;
