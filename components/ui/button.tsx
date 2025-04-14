"use client";

import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-4 py-2 bg-black text-white rounded-xl hover:opacity-80 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
