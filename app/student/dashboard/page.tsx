"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  User,
  Calendar,
  Phone,
  Mail,
  Users,
  LogOut,
  Camera,
  Clock,
  CheckCircle,
  AlertCircle,
  History,
  X,
  Eye,
} from "lucide-react";
import { fetchData } from "@/utils/api";

interface Session {
  id: number;
  sessionName: string;
  startDateTime: string;
  endDateTime: string;
  createdBy: string | null;
}

interface SessionData {
  batch_name: string;
  batch_id: number;
  sessions: Session[];
}

interface StudentData {
  admissionNo: number;
  studentName: string;
  rollNo: number;
  studentClass: string;
  gender: string;
  fatherName: string;
  email: string;
  contactNo: string;
  joinedDate: string;
  studentPassword: string;
  profilePic: string | null;
}

interface AttendanceRecord {
  sessionName: string;
  startDateTime: string;
  endDateTime: string;
  status: boolean;
}

interface AttendanceHistory {
  attendance_history: AttendanceRecord[];
  status: number;
}

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
];

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return monday;
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedData, setEditedData] = useState<StudentData | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadMessage, setUploadMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<
    AttendanceRecord[]
  >([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    fetchStudentData();
    fetchSessionData();
    fetchAttendanceHistory();
  }, []);

  const fetchStudentData = async () => {
    try {
      const data = await fetchData("/student/data/", "POST", {}, false);
      setStudentData(data.student_data);
      setEditedData(data.student_data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const fetchSessionData = async () => {
    try {
      const data = await fetchData("/batch/get_batch_sessions/", "POST", {});
      setSessionData(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceHistory = async () => {
    try {
      setLoadingAttendance(true);
      const data = await fetchData("/attendance/history/", "POST", null);
      if (data.status === 200) {
        setAttendanceHistory(data.attendance_history);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const weekDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentWeekStart]);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const getSessionsForDate = (date: Date) => {
    if (!sessionData) return [];

    const dateStr = date.toISOString().split("T")[0];
    const sessions: (Session & { batch_name: string; batch_id: number })[] = [];

    sessionData.sessions.forEach((session) => {
      const sessionDate = new Date(session.startDateTime)
        .toISOString()
        .split("T")[0];
      if (sessionDate === dateStr) {
        sessions.push({
          ...session,
          batch_name: sessionData.batch_name,
          batch_id: sessionData.batch_id,
        });
      }
    });

    return sessions;
  };

  const getSessionPosition = (startDateTime: string, endDateTime: string) => {
    const startTime = new Date(startDateTime);
    const endTime = new Date(endDateTime);

    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();

    const startPosition = (((startHour - 8) * 60 + startMinute) / 60) * 96; // 96px per hour (24px * 4 quarters)
    const duration =
      (((endHour - startHour) * 60 + (endMinute - startMinute)) / 60) * 96;

    return { top: startPosition, height: Math.max(duration, 48) };
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatWeekRange = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(currentWeekStart.getDate() + 4);

    return `${currentWeekStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  const handleLogout = () => {
    // Clear JWT token from cookie
    Cookies.remove("accessToken");
    // Clear session storage
    sessionStorage.removeItem("userData");
    // Redirect to login
    window.location.href = "/student/sign-in";
  };

  const handleSaveEdit = async () => {
    if (editedData) {
      try {
        const updateData = {
          studentName: editedData.studentName,
          gender: editedData.gender,
          fatherName: editedData.fatherName,
          email: editedData.email,
          contactNo: editedData.contactNo,
        };

        const response = await fetchData(
          "/student/update/",
          "POST",
          updateData
        );

        // Check if response has the expected structure
        if (response && (response.admissionNo || response.studentName)) {
          // Update local state with the response data
          const updatedStudentData = {
            admissionNo: response.admissionNo || editedData.admissionNo,
            studentName: response.studentName || editedData.studentName,
            rollNo: response.rollNo || editedData.rollNo,
            studentClass: response.studentClass || editedData.studentClass,
            gender: response.gender || editedData.gender,
            fatherName: response.fatherName || editedData.fatherName,
            email: response.email || editedData.email,
            contactNo: response.contactNo || editedData.contactNo,
            joinedDate: response.joinedDate || editedData.joinedDate,
            studentPassword:
              response.studentPassword || editedData.studentPassword,
            profilePic: response.profilePic || editedData.profilePic,
          };

          setStudentData(updatedStudentData);
          setEditedData(updatedStudentData);
          setShowEditModal(false);

          // Show success message
          setUploadMessage({
            type: "success",
            message: "Details updated successfully!",
          });
          setTimeout(() => setUploadMessage(null), 3000);
        } else if (response && response.error) {
          // Handle API error response
          setUploadMessage({
            type: "error",
            message: response.error || "Failed to update details.",
          });
          setTimeout(() => setUploadMessage(null), 5000);
        } else {
          // Handle unexpected response format
          setUploadMessage({
            type: "error",
            message: "Unexpected response from server. Please try again.",
          });
          setTimeout(() => setUploadMessage(null), 5000);
        }
      } catch (error) {
        setUploadMessage({
          type: "error",
          message: "Failed to update details. Please try again.",
        });
        setTimeout(() => setUploadMessage(null), 5000);
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/...;base64, prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const startCamera = async () => {
    try {
      setCameraReady(false);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      setStream(mediaStream);
      setShowCamera(true);

      // Wait for the modal to render before setting video source
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(console.error);
        }
      }, 100);
    } catch (error) {
      setUploadMessage({
        type: "error",
        message:
          "Unable to access camera. Please check permissions and try again.",
      });
      setTimeout(() => setUploadMessage(null), 5000);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flip the image horizontally to match the mirror effect
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      async (blob) => {
        if (!blob) return;

        setIsUploading(true);
        setUploadMessage(null);
        stopCamera();

        try {
          // Convert blob to base64 for face encoding
          const base64Image = await convertBlobToBase64(blob);

          // Send face encoding request
          const faceEncodingResponse = await fetchData(
            "/add_pfp_and_face_encoding/",
            "POST",
            {
              face_image: base64Image,
            }
          );

          if (faceEncodingResponse.status === 200) {
            setUploadMessage({
              type: "success",
              message: "Profile picture and face encoding added successfully!",
            });
            // Refresh student data after upload
            fetchStudentData();
          } else {
            setUploadMessage({
              type: "error",
              message:
                faceEncodingResponse.message ||
                "Failed to add face encoding. Please try again.",
            });
          }
        } catch (error) {
          setUploadMessage({
            type: "error",
            message:
              "Upload failed. Please ensure the image contains a clear face and try again.",
          });
        } finally {
          setIsUploading(false);
          setTimeout(() => setUploadMessage(null), 5000);
        }
      },
      "image/jpeg",
      0.8
    );
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const calculateAttendance = () => {
    // Mock calculation - implement based on actual attendance data
    return Math.floor(Math.random() * 30) + 70;
  };

  // Mock face detection - replace with actual face detection logic
  const checkFacePosition = () => {
    // This is a placeholder - in a real implementation, you would use
    // face detection libraries like MediaPipe or TensorFlow.js
    // For now, we'll simulate random face detection
    const isPositioned = Math.random() > 0.3; // 70% chance of good positioning
    setFaceDetected(isPositioned);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cameraReady && showCamera) {
      // Check face position every 500ms
      interval = setInterval(checkFacePosition, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cameraReady, showCamera]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Top Navigation */}
      <nav className="bg-[#1A1A1A] border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-400">Learn Track</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 transition-colors bg-red-600 rounded-lg hover:bg-red-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      <div className="container px-6 py-8 mx-auto">
        {/* Upload Message Alert */}
        {uploadMessage && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              uploadMessage.type === "success"
                ? "bg-green-950/50 border-green-600 text-green-400"
                : "bg-red-950/50 border-red-600 text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {uploadMessage.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{uploadMessage.message}</span>
            </div>
          </div>
        )}

        {/* Student ID Card - Always visible with loading state */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 mb-8 border border-gray-800">
          {studentData ? (
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Profile Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="flex items-center justify-center w-32 h-32 mb-4 overflow-hidden bg-gray-700 rounded-full">
                    {studentData.profilePic ? (
                      <Image
                        src={`data:image/jpeg;base64,${studentData.profilePic}`}
                        alt="Profile"
                        className="object-cover w-full h-full"
                        width={128}
                        height={128}
                        priority
                      />
                    ) : (
                      <User size={48} className="text-gray-400" />
                    )}
                  </div>
                  <button
                    onClick={startCamera}
                    disabled={isUploading}
                    className={`absolute right-0 p-2 transition-colors rounded-full bottom-4 ${
                      isUploading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    title={
                      studentData.profilePic
                        ? "Update profile picture"
                        : "Add profile picture"
                    }
                  >
                    <Camera size={16} />
                  </button>
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <div className="w-6 h-6 border-2 border-blue-400 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-center">
                  {studentData.studentName}
                </h2>
                <p className="text-gray-400">Roll No: {studentData.rollNo}</p>
                {!studentData.profilePic && (
                  <p className="mt-1 text-xs text-center text-gray-500">
                    Click camera icon to add profile picture
                  </p>
                )}
                {isUploading && (
                  <p className="mt-2 text-sm text-blue-400">
                    Processing image...
                  </p>
                )}
              </div>

              {/* Details Section */}
              <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-blue-400" />
                    <span className="text-gray-300">Admission No:</span>
                    <span>{studentData.admissionNo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-blue-400" />
                    <span className="text-gray-300">Class:</span>
                    <span>{studentData.studentClass}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-blue-400" />
                    <span className="text-gray-300">Gender:</span>
                    <span>{studentData.gender}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-blue-400" />
                    <span className="text-gray-300">Father&apos;s Name:</span>
                    <span>{studentData.fatherName}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-blue-400" />
                    <span className="text-gray-300">Email:</span>
                    <span>{studentData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-blue-400" />
                    <span className="text-gray-300">Contact:</span>
                    <span>{studentData.contactNo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-blue-400" />
                    <span className="text-gray-300">Joined:</span>
                    <span>
                      {new Date(studentData.joinedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col justify-center">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 px-4 py-2 transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Edit size={16} />
                  Edit Details
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <User size={64} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400">Loading student information...</p>
              </div>
            </div>
          )}
        </div>

        {/* Timetable - Updated to match teacher's view */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-gray-800 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
              <Calendar className="w-8 h-8" />
              Weekly Schedule
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousWeek}
                className="flex items-center gap-2 px-3 py-2 text-sm transition-colors bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="text-lg font-semibold text-white">
                {formatWeekRange()}
              </div>
              <button
                onClick={goToNextWeek}
                className="flex items-center gap-2 px-3 py-2 text-sm transition-colors bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg">
            <div className="grid grid-cols-6 border-b border-gray-800">
              {/* Time column header */}
              <div className="p-4 border-r border-gray-800 bg-gray-800/50">
                <div className="text-sm font-medium text-gray-400">Time</div>
              </div>

              {/* Day headers */}
              {weekDates.map((date, index) => (
                <div
                  key={index}
                  className="p-4 border-r border-gray-800 bg-gray-800/50 last:border-r-0"
                >
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-400">
                      {weekdays[index]}
                    </div>
                    <div className="mt-1 text-lg font-semibold text-white">
                      {date.getDate()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar body */}
            <div className="grid grid-cols-6">
              {/* Time slots column */}
              <div className="border-r border-gray-800">
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className="flex items-start h-24 p-2 border-b border-gray-800 bg-gray-800/30"
                  >
                    <span className="text-sm font-medium text-gray-500">
                      {time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {weekDates.map((date, dayIndex) => (
                <div
                  key={dayIndex}
                  className="relative border-r border-gray-800 last:border-r-0"
                >
                  {/* Time slot backgrounds */}
                  {timeSlots.map((time, timeIndex) => (
                    <div
                      key={time}
                      className="h-24 transition-colors border-b border-gray-800 hover:bg-gray-800/30"
                    />
                  ))}

                  {/* Sessions */}
                  <div className="absolute inset-0 pointer-events-none">
                    {getSessionsForDate(date).map((session) => {
                      const position = getSessionPosition(
                        session.startDateTime,
                        session.endDateTime
                      );
                      return (
                        <div
                          key={session.id}
                          className="absolute p-1 pointer-events-auto left-1 right-1"
                          style={{
                            top: `${position.top}px`,
                            height: `${position.height}px`,
                          }}
                        >
                          <div className="h-full p-2 transition-colors bg-blue-600 border border-blue-500 rounded-md shadow-lg cursor-pointer hover:bg-blue-700">
                            <div className="text-xs font-semibold text-white truncate">
                              {session.sessionName}
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-blue-200">
                              <Clock className="w-3 h-3" />
                              {formatTime(session.startDateTime)} -{" "}
                              {formatTime(session.endDateTime)}
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-blue-300">
                              <Users className="w-3 h-3" />
                              {session.batch_name}
                            </div>
                            {session.createdBy && (
                              <div className="text-xs text-blue-300 truncate">
                                by {session.createdBy}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>Scheduled Session</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Time slots: 8:00 AM - 3:00 PM</span>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">
              Attendance History
            </h2>
          </div>

          {loadingAttendance ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-400 rounded-full border-t-transparent animate-spin"></div>
              <span className="ml-2 text-gray-400">
                Loading attendance history...
              </span>
            </div>
          ) : attendanceHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-4 font-medium text-left text-gray-300">
                      Session Name
                    </th>
                    <th className="p-4 font-medium text-left text-gray-300">
                      Date
                    </th>
                    <th className="p-4 font-medium text-left text-gray-300">
                      Time
                    </th>
                    <th className="p-4 font-medium text-center text-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((record, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-800 hover:bg-gray-800/30"
                    >
                      <td className="p-4 text-white">{record.sessionName}</td>
                      <td className="p-4 text-gray-300">
                        {new Date(record.startDateTime).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="p-4 text-gray-300">
                        {formatTime(record.startDateTime)} -{" "}
                        {formatTime(record.endDateTime)}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            record.status
                              ? "bg-green-950/50 text-green-400 border border-green-600"
                              : "bg-red-950/50 text-red-400 border border-red-600"
                          }`}
                        >
                          {record.status ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Present
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4" />
                              Absent
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <History className="w-16 h-16 mb-4 text-gray-600" />
              <p className="text-lg">No attendance history found</p>
              <p className="text-sm">
                Your attendance records will appear here once sessions begin
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-2xl mx-4 border border-gray-800">
            <h3 className="mb-4 text-xl font-bold">Edit Details</h3>
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Student Name
                </label>
                <input
                  type="text"
                  value={editedData.studentName}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      studentName: e.target.value,
                    })
                  }
                  className="w-full p-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={editedData.email}
                  onChange={(e) =>
                    setEditedData({ ...editedData, email: e.target.value })
                  }
                  className="w-full p-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={editedData.contactNo}
                  onChange={(e) =>
                    setEditedData({ ...editedData, contactNo: e.target.value })
                  }
                  className="w-full p-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Father&apos;s Name
                </label>
                <input
                  type="text"
                  value={editedData.fatherName}
                  onChange={(e) =>
                    setEditedData({ ...editedData, fatherName: e.target.value })
                  }
                  className="w-full p-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-md mx-4 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Take Profile Picture</h3>
              <button
                onClick={stopCamera}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Instructions */}
            <div className="p-3 mb-4 border rounded-lg bg-blue-950/30 border-blue-600/30">
              <div className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-300">
                  <p className="mb-1 font-medium">Position your face:</p>
                  <ul className="space-y-1 text-xs text-blue-200">
                    <li>• Center your face in the oval guide</li>
                    <li>• Look directly at the camera</li>
                    <li>• Ensure good lighting on your face</li>
                    <li>• Remove glasses if possible</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Face position status */}
            {cameraReady && (
              <div
                className={`mb-4 p-2 rounded-lg text-center text-sm font-medium ${
                  faceDetected
                    ? "bg-green-950/30 border border-green-600/30 text-green-400"
                    : "bg-red-950/30 border border-red-600/30 text-red-400"
                }`}
              >
                {faceDetected
                  ? "✓ Face positioned correctly"
                  : "⚠ Adjust your position"}
              </div>
            )}

            <div className="relative mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="object-cover w-full h-64 bg-gray-800 rounded-lg"
                style={{ transform: "scaleX(-1)" }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    videoRef.current.play().catch(console.error);
                  }
                }}
                onCanPlay={() => {
                  setCameraReady(true);
                }}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Face Guide Overlay */}
              {cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    {/* Oval face guide with dynamic color */}
                    <div
                      className={`border-2 rounded-full transition-colors duration-300 ${
                        faceDetected ? "border-green-400" : "border-red-400"
                      }`}
                      style={{
                        width: "160px",
                        height: "200px",
                        boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.3)",
                      }}
                    />

                    {/* Guide text with dynamic color */}
                    <div
                      className={`absolute px-2 py-1 text-xs transform -translate-x-1/2 rounded -bottom-8 left-1/2 bg-black/50 whitespace-nowrap transition-colors duration-300 ${
                        faceDetected ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {faceDetected
                        ? "Perfect! Ready to capture"
                        : "Align your face with the guide"}
                    </div>
                  </div>
                </div>
              )}

              {/* Loading indicator while camera initializes */}
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-lg">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 border-2 border-blue-400 rounded-full border-t-transparent animate-spin"></div>
                    <p className="text-sm text-gray-300">
                      Initializing camera...
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={capturePhoto}
                disabled={!cameraReady}
                className={`flex-1 px-4 py-2 transition-colors rounded-lg disabled:cursor-not-allowed ${
                  cameraReady && faceDetected
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-600 text-gray-300"
                } disabled:bg-gray-600`}
              >
                {!cameraReady
                  ? "Initializing..."
                  : faceDetected
                  ? "Capture Photo"
                  : "Position Face First"}
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-2 transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
