"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  CheckCircle,
  XCircle,
  Save,
  RotateCcw,
  Calendar,
  Clock,
} from "lucide-react";
import { SidebarPage } from "../_components/sidebar";
import { fetchData } from "@/utils/api";

interface Student {
  name: string;
  email: string;
  admissionNo: number;
}

interface Session {
  id: number;
  sessionName: string;
  startDateTime: string;
  endDateTime: string;
  batch_name?: string;
  batch_id?: number;
}

interface BatchStudentsResponse {
  batch: string;
  students: Student[];
}

interface Batch {
  id: number;
  name: string;
}

export default function AttendancePage() {
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [batchStudents, setBatchStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoadingBatches(true);
        const response = await fetchData("/batch/list/", "POST", {});
        console.log("Batch list response:", response);
        if (response && response.status === 200 && response.batches) {
          setBatches(response.batches);
        } else {
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
      } finally {
        setLoadingBatches(false);
      }
    };

    fetchBatches();
  }, []);

  const fetchBatchSessions = async (batchId: string) => {
    if (!batchId) {
      setSessions([]);
      return;
    }

    try {
      const response = await fetchData("/batch/get_batch_sessions/", "POST", {
        batch_id: parseInt(batchId),
      });
      console.log("Batch sessions response:", response);

      if (response && response.sessions) {
        setSessions(response.sessions);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error("Error fetching batch sessions:", error);
      setSessions([]);
    }
  };

  const fetchBatchStudents = async (batchId: string) => {
    if (!batchId) {
      setBatchStudents([]);
      return;
    }

    try {
      setLoadingStudents(true);
      const response = await fetchData("/batch/list_batch_students/", "POST", {
        batch_id: parseInt(batchId),
      });
      console.log("Batch students response:", response);

      if (response && response.students) {
        setBatchStudents(response.students);
      } else {
        setBatchStudents([]);
      }
    } catch (error) {
      console.error("Error fetching batch students:", error);
      setBatchStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const selectedSession = useMemo(() => {
    return sessions.find(
      (session) => session.id.toString() === selectedSessionId
    );
  }, [sessions, selectedSessionId]);

  const attendanceStats = useMemo(() => {
    if (!batchStudents.length) return { present: 0, absent: 0, total: 0 };

    const total = batchStudents.length;
    const present = batchStudents.filter(
      (student) => attendance[student.admissionNo] === true
    ).length;
    const absent = total - present;

    return { present, absent, total };
  }, [batchStudents, attendance]);

  const handleBatchChange = (batchId: string) => {
    setSelectedBatchId(batchId);
    setSelectedSessionId("");
    setAttendance({});
    setSaveSuccess(false);
    fetchBatchSessions(batchId);
    fetchBatchStudents(batchId);
  };

  const handleSessionChange = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setAttendance({});
    setSaveSuccess(false);
  };

  const handleAttendanceChange = (studentId: number, isPresent: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: isPresent,
    }));
  };

  const handleSelectAll = () => {
    if (!batchStudents.length) return;

    const newAttendance: Record<number, boolean> = {};
    batchStudents.forEach((student) => {
      newAttendance[student.admissionNo] = true;
    });
    setAttendance(newAttendance);
  };

  const handleClearAll = () => {
    setAttendance({});
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!selectedSession || !batchStudents.length) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      // Get list of admission numbers for students marked as present
      const presentStudents = batchStudents
        .filter((student) => attendance[student.admissionNo] === true)
        .map((student) => student.admissionNo);

      const attendanceData = {
        session_id: selectedSession.id,
        attendance: presentStudents,
      };

      console.log("Sending attendance data:", attendanceData);

      const response = await fetchData(
        "/batch/mark_attendance/",
        "POST",
        attendanceData
      );
      console.log("Attendance response:", response);

      if (response && response.message === "Attendance marked successfully") {
        setSaveSuccess(true);
        setSaveError(null);
      } else {
        setSaveError("Failed to mark attendance. Please try again.");
        setSaveSuccess(false);
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      setSaveError("Failed to mark attendance. Please try again.");
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
  };

  return (
    <div className="flex dark">
      <SidebarPage />
      <div className="min-h-screen bg-[#181818] text-gray-100 p-4 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="flex items-center gap-2 mb-2 text-3xl font-bold text-white">
              <Users className="w-8 h-8" />
              Attendance Management
            </h1>
            <p className="text-gray-400">Mark attendance for your students</p>
          </div>

          {saveSuccess && (
            <Alert className="mb-6 text-green-400 border-green-600 bg-green-950/50">
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                Attendance marked successfully for {attendanceStats.total}{" "}
                students!
              </AlertDescription>
            </Alert>
          )}

          {saveError && (
            <Alert className="mb-6 text-red-400 border-red-600 bg-red-950/50">
              <XCircle className="w-4 h-4" />
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}

          {/* Batch and Session Selection */}
          <Card className="bg-[#0A0A0A] border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="w-5 h-5" />
                Select Batch & Session
              </CardTitle>
              <CardDescription className="text-gray-400">
                Choose a batch & Session to mark attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Select Batch
                </label>
                <Select
                  value={selectedBatchId}
                  onValueChange={handleBatchChange}
                >
                  <SelectTrigger className="bg-[#201f1f] border-gray-700 text-white">
                    <SelectValue placeholder="Select a batch..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#201f1f] border-gray-700">
                    {batches.map((batch) => (
                      <SelectItem
                        key={batch.id}
                        value={batch.id.toString()}
                        className="text-white hover:bg-gray-700"
                      >
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBatchId && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Select Session
                  </label>
                  <Select
                    value={selectedSessionId}
                    onValueChange={handleSessionChange}
                  >
                    <SelectTrigger className="bg-[#201f1f] border-gray-700 text-white">
                      <SelectValue placeholder="Select a session...">
                        {selectedSession?.sessionName}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-[#201f1f] border-gray-700">
                      {sessions.map((session) => {
                        const { date, time } = formatDateTime(
                          session.startDateTime
                        );
                        return (
                          <SelectItem
                            key={session.id}
                            value={session.id.toString()}
                            className="text-white hover:bg-gray-700"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {session.sessionName}
                              </span>
                              <span className="text-sm text-gray-400">
                                {date} at {time}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Details and Attendance */}
          {selectedSession && batchStudents.length > 0 && (
            <>
              {/* Session Info */}
              <Card className="bg-[#0A0A0A] border-gray-800 mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">
                        {selectedSession.sessionName}
                      </CardTitle>
                      <CardDescription className="mt-2 text-gray-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {
                              batches.find(
                                (b) => b.id.toString() === selectedBatchId
                              )?.name
                            }
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {
                              formatDateTime(selectedSession.startDateTime).date
                            }{" "}
                            •{" "}
                            {formatDateTime(selectedSession.startDateTime).time}{" "}
                            - {formatDateTime(selectedSession.endDateTime).time}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="text-green-400 border-green-600"
                      >
                        Present: {attendanceStats.present}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-red-400 border-red-600"
                      >
                        Absent: {attendanceStats.absent}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-blue-400 border-blue-600"
                      >
                        Total: {attendanceStats.total}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Attendance List */}
              <Card className="bg-[#0A0A0A] border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">
                      Student Attendance
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        className="text-gray-300 border-gray-700 hover:bg-gray-800"
                      >
                        Mark All Present
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearAll}
                        className="text-gray-300 border-gray-700 hover:bg-gray-800"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingStudents ? (
                    <div className="py-8 text-center">
                      <div className="text-gray-400">Loading students...</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {batchStudents.map((student) => (
                        <div
                          key={student.admissionNo}
                          className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <Checkbox
                              id={`student-${student.admissionNo}`}
                              checked={attendance[student.admissionNo] || false}
                              onCheckedChange={(checked) =>
                                handleAttendanceChange(
                                  student.admissionNo,
                                  checked as boolean
                                )
                              }
                              className="border-gray-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                            <div>
                              <div className="font-medium text-white">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-400">
                                {student.admissionNo} • {student.email}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {attendance[student.admissionNo] === true ? (
                              <Badge className="text-white bg-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Present
                              </Badge>
                            ) : attendance[student.admissionNo] === false ? (
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3 mr-1" />
                                Absent
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-gray-400 border-gray-600"
                              >
                                Not Marked
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 mt-6 border-t border-gray-800">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving || loadingStudents}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Attendance"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClearAll}
                      className="text-gray-300 border-gray-700 hover:bg-gray-800"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {selectedBatchId &&
            selectedSessionId &&
            batchStudents.length === 0 &&
            !loadingStudents && (
              <Card className="bg-[#0A0A0A] border-gray-800">
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <h3 className="mb-2 text-lg font-medium text-gray-400">
                    No Students Found
                  </h3>
                  <p className="text-gray-500">
                    No students are enrolled in this batch.
                  </p>
                </CardContent>
              </Card>
            )}

          {!selectedSession && selectedBatchId === "" && (
            <Card className="bg-[#0A0A0A] border-gray-800">
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h3 className="mb-2 text-lg font-medium text-gray-400">
                  No Batch Selected
                </h3>
                <p className="text-gray-500">
                  Please select a batch and session to mark attendance.
                </p>
              </CardContent>
            </Card>
          )}

          {selectedBatchId && !selectedSessionId && (
            <Card className="bg-[#0A0A0A] border-gray-800">
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h3 className="mb-2 text-lg font-medium text-gray-400">
                  No Session Selected
                </h3>
                <p className="text-gray-500">
                  Please select a session from the dropdown above to mark
                  attendance.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
