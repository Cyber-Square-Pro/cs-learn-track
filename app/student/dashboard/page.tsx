"use client";

import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
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
  Upload,
  Clock,
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

  useEffect(() => {
    fetchStudentData();
    fetchSessionData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const data = await fetchData("/student/data/", "POST", {}, false);
      console.log("Student data response:", data); // Debug log
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
      console.error("Error fetching session data:", error);
    } finally {
      setLoading(false);
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

    const startPosition = (((startHour - 8) * 60 + startMinute) / 60) * 80; // 80px per hour
    const duration =
      (((endHour - startHour) * 60 + (endMinute - startMinute)) / 60) * 80;

    return { top: startPosition, height: Math.max(duration, 40) };
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
        await fetchData("/student/update", "POST", editedData);
        setStudentData(editedData);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error saving student data:", error);
      }
    }
  };

  const handleProfilePicUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePicFile(file);
      try {
        const formData = new FormData();
        formData.append("profilePic", file);
        await fetchData("/student/upload-profile", "POST", formData, true);
        // Refresh student data after upload
        fetchStudentData();
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  const calculateAttendance = () => {
    // Mock calculation - implement based on actual attendance data
    return Math.floor(Math.random() * 30) + 70;
  };

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
        {/* Student ID Card - Always visible with loading state */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 mb-8 border border-gray-800">
          {studentData ? (
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Profile Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="flex items-center justify-center w-32 h-32 mb-4 overflow-hidden bg-gray-700 rounded-full">
                    {studentData.profilePic ? (
                      <img
                        src={studentData.profilePic}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <User size={48} className="text-gray-400" />
                    )}
                  </div>
                  <label className="absolute right-0 p-2 transition-colors bg-blue-600 rounded-full cursor-pointer bottom-4 hover:bg-blue-700">
                    <Upload size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <h2 className="text-xl font-bold text-center">
                  {studentData.studentName}
                </h2>
                <p className="text-gray-400">Roll No: {studentData.rollNo}</p>
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
                    <span className="text-gray-300">Father's Name:</span>
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
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-blue-400" />
                    <span className="text-gray-300">Attendance:</span>
                    <span className="text-green-400">
                      {calculateAttendance()}%
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
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-gray-800">
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
                    className="flex items-start h-20 p-2 border-b border-gray-800 bg-gray-800/30"
                  >
                    <span className="text-xs font-medium text-gray-500">
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
                      className="h-20 transition-colors border-b border-gray-800 hover:bg-gray-800/30"
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
                          className="absolute pointer-events-auto left-1 right-1"
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
                  Father's Name
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
    </div>
  );
}
