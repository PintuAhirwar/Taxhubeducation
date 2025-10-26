"use client";
import React from "react";
import { signIn } from "next-auth/react";

const SocialSignIn = () => {
  return (
    <div className="flex">
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="flex w-full items-center justify-center gap-2 rounded-lg p-3.5 bg-primary text-white border border-primary hover:bg-primary/15 hover:text-black"
      >
        Sign In with Google
        <svg
          width="23"
          height="22"
          viewBox="0 0 23 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Google Icon */}
          <path
            d="M22.5001 11.2438C22.5134 10.4876 22.4338 9.73256 22.2629 8.995H11.7246V13.0771H17.9105..."
            fill="#4285F4"
          />
        </svg>
      </button>
    </div>
  );
};

export default SocialSignIn;
