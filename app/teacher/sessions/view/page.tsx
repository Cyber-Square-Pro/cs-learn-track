"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Calendar,
} from "lucide-react";

import { SidebarPage } from "../../_components/sidebar";
import { fetchData } from "@/utils/api";

interface Session {
  id: number;
  sessionName: string;
  startDateTime: string;
  endDateTime: string;
  createdBy: string | null;
}

interface BatchData {
  batch_name: string;
  batch_id: number;
  sessions: Session[];
}

// Mock data matching the API structure
const mockBatchData: BatchData[] = [
  {
    batch_name: "Advanced Mathematics",
    batch_id: 101,
    sessions: [
      {
        id: 1,
        sessionName: "Calculus Fundamentals",
        startDateTime: "2024-12-30T09:00:00",
        endDateTime: "2024-12-30T10:30:00",
        createdBy: "Dr. Smith",
      },
      {
        id: 2,
        sessionName: "Linear Algebra",
        startDateTime: "2024-12-31T14:00:00",
        endDateTime: "2024-12-31T15:30:00",
        createdBy: "Dr. Smith",
      },
      {
        id: 3,
        sessionName: "Differential Equations",
        startDateTime: "2025-01-01T11:00:00",
        endDateTime: "2025-01-01T12:30:00",
        createdBy: "Dr. Smith",
      },
    ],
  },
  {
    batch_name: "Computer Science",
    batch_id: 102,
    sessions: [
      {
        id: 4,
        sessionName: "Data Structures",
        startDateTime: "2024-12-30T10:00:00",
        endDateTime: "2024-12-30T11:30:00",
        createdBy: "Prof. Johnson",
      },
      {
        id: 5,
        sessionName: "Algorithms",
        startDateTime: "2025-01-02T13:00:00",
        endDateTime: "2025-01-02T14:30:00",
        createdBy: "Prof. Johnson",
      },
      {
        id: 6,
        sessionName: "Database Systems",
        startDateTime: "2025-01-03T15:00:00",
        endDateTime: "2025-01-03T16:30:00",
        createdBy: "Prof. Johnson",
      },
    ],
  },
];

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

interface Batch {
  id: number;
  name: string;
}

export default function CalendarPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return monday;
  });
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("all");
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [batchSessions, setBatchSessions] = useState<BatchData[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoadingBatches(true);
        const response = await fetchData("batch/list/", "POST", {});
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
    if (batchId === "all") {
      setBatchSessions(mockBatchData);
      return;
    }

    try {
      setLoadingSessions(true);
      const response = await fetchData("batch/get_batch_sessions/", "POST", {
        batch_id: parseInt(batchId),
      });
      console.log("Batch sessions response:", response);

      if (response && response.sessions) {
        // Transform API response to match our BatchData structure
        const batchData: BatchData = {
          batch_id: parseInt(batchId),
          batch_name:
            batches.find((b) => b.id.toString() === batchId)?.name ||
            "Unknown Batch",
          sessions: response.sessions,
        };
        setBatchSessions([batchData]);
      } else {
        setBatchSessions([]);
      }
    } catch (error) {
      console.error("Error fetching batch sessions:", error);
      setBatchSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleBatchChange = (value: string) => {
    setSelectedBatchId(value);
    fetchBatchSessions(value);
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
    const dateStr = date.toISOString().split("T")[0];
    const sessions: (Session & { batch_name: string; batch_id: number })[] = [];

    batchSessions.forEach((batch) => {
      batch.sessions.forEach((session) => {
        const sessionDate = new Date(session.startDateTime)
          .toISOString()
          .split("T")[0];
        if (sessionDate === dateStr) {
          sessions.push({
            ...session,
            batch_name: batch.batch_name,
            batch_id: batch.batch_id,
          });
        }
      });
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

  return (
    <div className="flex w-full dark">
      <SidebarPage />
      <div className="min-h-screen bg-[#181818] text-gray-100 p-4 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Header */}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                  <Calendar className="h-8 w-8" />
                  Weekly Schedule
                </h1>
                <p className="text-gray-400">Manage your teaching sessions</p>
              </div>

              <div className="flex items-center gap-4">
                <Select
                  value={selectedBatchId}
                  onValueChange={handleBatchChange}
                >
                  <SelectTrigger className="w-[200px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue
                      placeholder={
                        loadingBatches ? "Loading..." : "Select batch"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="all">Choose a Batch</SelectItem>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id.toString()}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousWeek}
                  className="dark"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="text-lg font-semibold text-white">
                  {formatWeekRange()}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextWeek}
                  className="dark"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-0">
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
                      <div className="text-lg font-semibold text-white mt-1">
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
                      className="h-20 border-b border-gray-800 p-2 flex items-start bg-gray-800/30"
                    >
                      <span className="text-xs text-gray-500 font-medium">
                        {time}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Day columns */}
                {weekDates.map((date, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="border-r border-gray-800 last:border-r-0 relative"
                  >
                    {/* Time slot backgrounds */}
                    {timeSlots.map((time, timeIndex) => (
                      <div
                        key={time}
                        className="h-20 border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
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
                            className="absolute left-1 right-1 pointer-events-auto"
                            style={{
                              top: `${position.top}px`,
                              height: `${position.height}px`,
                            }}
                          >
                            <div className="h-full bg-blue-600 rounded-md p-2 border border-blue-500 shadow-lg hover:bg-blue-700 transition-colors cursor-pointer">
                              <div className="text-xs font-semibold text-white truncate">
                                {session.sessionName}
                              </div>
                              <div className="text-xs text-blue-200 mt-1 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(session.startDateTime)} -{" "}
                                {formatTime(session.endDateTime)}
                              </div>
                              <div className="text-xs text-blue-300 mt-1 flex items-center gap-1">
                                <Users className="h-3 w-3" />
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
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>Scheduled Session</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Time slots: 8:00 AM - 3:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
