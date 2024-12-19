"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddStudentPage from "./(addStudent)/addStudent/page";
import UploadImagePage from "./(addStudent)/uploadImg/page";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Router>
          <Routes>
            <Route path="/uploadImg" element={<UploadImagePage />} />
            <Route path="/addStudent" element={<AddStudentPage />} />
          </Routes>
          {children}
        </Router>
      </body>
    </html>
  );
}