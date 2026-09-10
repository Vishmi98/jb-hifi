"use client";

import React, { useState } from 'react';

import "../globals.css";
import Sidebar from '@/components/Sidebar';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">
        <div className="flex h-screen p-5 bg-gray-100">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

          <main className="flex-1 relative w-full">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden fixed top-2 left-2 z-50 p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>

            {/* Scrollable content area */}
            <div className="h-full bg-white shadow-md rounded-2xl overflow-y-auto p-4 md:ml-5 mt-5 md:mt-0">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
