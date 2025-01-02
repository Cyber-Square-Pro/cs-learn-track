"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddStudentPage from "./(addStudent)/addStudent/page";
import UploadImagePage from "./(addStudent)/uploadImg/page";
import LandingPage from "./page";
import CreateBatchPage from "./(batch)/newBatch/page";
import SignInPage from "./(authentication)/student_signin/page";
import TeacherSignInPage from "./(authentication)/teacher_signin/page";

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
            <Route path="/" element={<LandingPage />} />
            <Route path="/newBatch" element={<CreateBatchPage />} />
            <Route path="/student_signin" element={<SignInPage />} />
            <Route path="/teacher_signin" element={<TeacherSignInPage   />} />
          </Routes>
        </Router>
      </body>
    </html>
  );
}
