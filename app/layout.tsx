"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddStudentPage from "./(teacher)/student/add/page";
import UploadImagePage from "./(teacher)/student/image/upload/page";
import LandingPage from "./page";
import CreateBatchPage from "./(teacher)/batches/add/page";
import SignInPage from "./(authentication)/student/sign-in/page";
import TeacherSignInPage from "./(authentication)/teacher/sign-in/page";
import DashboardPage from "./(teacher)/dashboard/page";
import StudentManagement from "./(teacher)/student/view/page";
import { Toaster } from "@/components/ui/toaster";

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
            <Route
              path="/teacher/student/image/upload"
              element={<UploadImagePage />}
            />
            <Route path="/teacher/student/add" element={<AddStudentPage />} />
            <Route path="/teacher/student/view" element={<StudentManagement />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/teacher/batches/add" element={<CreateBatchPage />} />
            <Route path="/student/sign-in" element={<SignInPage />} />
            <Route path="/teacher/sign-in" element={<TeacherSignInPage />} />
            <Route path="/teacher/dashboard" element={<DashboardPage />} />

          </Routes>
        </Router>
        <Toaster />
      </body>
    </html>
  );
}
