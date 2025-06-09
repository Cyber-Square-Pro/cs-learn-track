"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Clock, Users, BookOpen, ArrowLeft } from "lucide-react";
import { fetchData } from "@/utils/api";
import { useRouter } from "next/navigation";

interface SessionFormData {
  sessionName: string;
  batch_id: string;
  date: string;
  period: string;
}

interface Batch {
  id: number;
  name: string;
}

export default function CreateSessionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SessionFormData>({
    sessionName: "",
    batch_id: "",
    date: "",
    period: "",
  });
  const [errors, setErrors] = useState<Partial<SessionFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);

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

  const validateForm = (): boolean => {
    const newErrors: Partial<SessionFormData> = {};

    if (!formData.sessionName.trim()) {
      newErrors.sessionName = "Session name is required";
    }

    if (!formData.batch_id.trim()) {
      newErrors.batch_id = "Batch is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      // Check if date is in the past
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    if (!formData.period) {
      newErrors.period = "Period is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SessionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const calculateDateTime = (
    date: string,
    period: number
  ): { startDateTime: string; endDateTime: string } => {
    const selectedDate = new Date(date);

    // Calculate start hour (8 AM for period 1, 9 AM for period 2, etc.)
    const startHour = 7 + period; // 8 AM = 7 + 1
    const endHour = startHour + 1;

    // Create start datetime
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(startHour, 0, 0, 0);

    // Create end datetime
    const endDateTime = new Date(selectedDate);
    endDateTime.setHours(endHour, 0, 0, 0);

    return {
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { startDateTime, endDateTime } = calculateDateTime(
        formData.date,
        Number.parseInt(formData.period)
      );

      const sessionData = {
        sessionName: formData.sessionName,
        batch_id: Number.parseInt(formData.batch_id),
        startDateTime: startDateTime,
        endDateTime: endDateTime,
      };

      console.log("Sending session data:", sessionData);

      // Send API request to create session
      const response = await fetchData(
        "/batch/create_session/",
        "POST",
        sessionData
      );

      console.log("Session created:", response);
      if (response.error) {
        setErrors({ batch_id: response.error });
        setSubmitSuccess(false);
      } else {
        setSubmitSuccess(true);
        // Reset form after successful submission
        setFormData({
          sessionName: "",
          batch_id: "",
          date: "",
          period: "",
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error creating session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 text-gray-100 bg-gray-950">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-white">
            Create New Session
          </h1>
          <p className="text-gray-400">
            Schedule a new learning session for your students
          </p>
        </div>

        {submitSuccess && (
          <Alert className="mb-6 text-green-400 border-green-600 bg-green-950/50">
            <CalendarDays className="w-4 h-4" />
            <AlertDescription>
              Session created successfully! Students will be notified about the
              new session.
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/teacher/dashboard/")}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4" />
                
              </Button>
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="w-5 h-5" />
                  Session Details
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Fill in the details for your new teaching session
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sessionName" className="text-gray-200">
                  Session Name *
                </Label>
                <Input
                  id="sessionName"
                  type="text"
                  placeholder="e.g., Advanced Mathematics - Calculus"
                  value={formData.sessionName}
                  onChange={(e) =>
                    handleInputChange("sessionName", e.target.value)
                  }
                  className="text-white bg-gray-800 border-gray-700 placeholder:text-gray-500 focus:border-blue-500"
                />
                {errors.sessionName && (
                  <p className="text-sm text-red-400">{errors.sessionName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="batch_id"
                  className="flex items-center gap-2 text-gray-200"
                >
                  <Users className="w-4 h-4" />
                  Batch *
                </Label>
                <Select
                  value={formData.batch_id}
                  onValueChange={(value) =>
                    handleInputChange("batch_id", value)
                  }
                >
                  <SelectTrigger className="text-white bg-gray-800 border-gray-700 focus:border-blue-500">
                    <SelectValue
                      placeholder={
                        loadingBatches ? "Loading batches..." : "Select batch"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="text-white bg-gray-800 border-gray-700">
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id.toString()}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.batch_id && (
                  <p className="text-sm text-red-400">{errors.batch_id}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="date"
                    className="flex items-center gap-2 text-gray-200"
                  >
                    <CalendarDays className="w-4 h-4" />
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="text-white bg-gray-800 border-gray-700 focus:border-blue-500"
                  />
                  {errors.date && (
                    <p className="text-sm text-red-400">{errors.date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="period"
                    className="flex items-center gap-2 text-gray-200"
                  >
                    <Clock className="w-4 h-4" />
                    Period *
                  </Label>
                  <Select
                    value={formData.period}
                    onValueChange={(value) =>
                      handleInputChange("period", value)
                    }
                  >
                    <SelectTrigger className="text-white bg-gray-800 border-gray-700 focus:border-blue-500">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent className="text-white bg-gray-800 border-gray-700">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((period) => (
                        <SelectItem key={period} value={period.toString()}>
                          Period {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.period && (
                    <p className="text-sm text-red-400">{errors.period}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 text-white bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "Creating Session..." : "Create Session"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      sessionName: "",
                      batch_id: "",
                      date: "",
                      period: "",
                    });
                    setErrors({});
                    setSubmitSuccess(false);
                  }}
                  className="text-gray-300 border-gray-700 hover:bg-gray-800 dark"
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-sm text-center text-gray-500">
          <p>All fields marked with * are required</p>
        </div>
      </div>
    </div>
  );
}
