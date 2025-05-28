"use client";

import type React from "react";

import { useState } from "react";
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
import { CalendarDays, Clock, Users, BookOpen } from "lucide-react";
import { fetchData } from "@/utils/api";

interface SessionFormData {
  sessionName: string;
  batch_id: string;
  startDateTime: string;
  endDateTime: string;
}

export default function CreateSessionPage() {
  const [formData, setFormData] = useState<SessionFormData>({
    sessionName: "",
    batch_id: "",
    startDateTime: "",
    endDateTime: "",
  });
  const [errors, setErrors] = useState<Partial<SessionFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<SessionFormData> = {};
    const now = new Date();

    if (!formData.sessionName.trim()) {
      newErrors.sessionName = "Session name is required";
    }

    if (!formData.batch_id.trim()) {
      newErrors.batch_id = "Batch ID is required";
    } else if (
      isNaN(Number(formData.batch_id)) ||
      Number(formData.batch_id) <= 0
    ) {
      newErrors.batch_id = "Batch ID must be a positive number";
    }

    if (!formData.startDateTime) {
      newErrors.startDateTime = "Start date and time is required";
    } else {
      // Check if start date is in the past
      const startDate = new Date(formData.startDateTime);
      if (startDate < now) {
        newErrors.startDateTime = "Start date cannot be in the past";
      }
    }

    if (!formData.endDateTime) {
      newErrors.endDateTime = "End date and time is required";
    }

    if (formData.startDateTime && formData.endDateTime) {
      const startDate = new Date(formData.startDateTime);
      const endDate = new Date(formData.endDateTime);

      if (endDate <= startDate) {
        newErrors.endDateTime = "End time must be after start time";
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const sessionData = {
        sessionName: formData.sessionName,
        batch_id: Number.parseInt(formData.batch_id),
        startDateTime: formData.startDateTime,
        endDateTime: formData.endDateTime,
      };

      // Send API request to create session
      const response = await fetchData(
        "batch/create_session/",
        "POST",
        sessionData
      );

      console.log("Session created:", response);
      if (response.error) {
        setErrors({ batch_id: response.error });
        setSubmitSuccess(false);
      } else {
        setSubmitSuccess(true);
      }

      // Reset form after successful submission
      setFormData({
        sessionName: "",
        batch_id: "",
        startDateTime: "",
        endDateTime: "",
      });
    } catch (error) {
      console.error("Error creating session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create New Session
          </h1>
          <p className="text-gray-400">
            Schedule a new learning session for your students
          </p>
        </div>

        {submitSuccess && (
          <Alert className="mb-6 border-green-600 bg-green-950/50 text-green-400">
            <CalendarDays className="h-4 w-4" />
            <AlertDescription>
              Session created successfully! Students will be notified about the
              new session.
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Session Details
            </CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the details for your new teaching session
            </CardDescription>
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
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
                {errors.sessionName && (
                  <p className="text-red-400 text-sm">{errors.sessionName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="batch_id"
                  className="text-gray-200 flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Batch ID *
                </Label>
                <Input
                  id="batch_id"
                  type="number"
                  placeholder="e.g., 101"
                  value={formData.batch_id}
                  onChange={(e) =>
                    handleInputChange("batch_id", e.target.value)
                  }
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
                {errors.batch_id && (
                  <p className="text-red-400 text-sm">{errors.batch_id}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="startDateTime"
                    className="text-gray-200 flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Start Date & Time *
                  </Label>
                  <Input
                    id="startDateTime"
                    type="datetime-local"
                    value={formData.startDateTime}
                    onChange={(e) =>
                      handleInputChange("startDateTime", e.target.value)
                    }
                    className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                  />
                  {errors.startDateTime && (
                    <p className="text-red-400 text-sm">
                      {errors.startDateTime}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="endDateTime"
                    className="text-gray-200 flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    End Date & Time *
                  </Label>
                  <Input
                    id="endDateTime"
                    type="datetime-local"
                    value={formData.endDateTime}
                    onChange={(e) =>
                      handleInputChange("endDateTime", e.target.value)
                    }
                    className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                  />
                  {errors.endDateTime && (
                    <p className="text-red-400 text-sm">{errors.endDateTime}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
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
                      startDateTime: "",
                      endDateTime: "",
                    });
                    setErrors({});
                    setSubmitSuccess(false);
                  }}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 dark"
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>All fields marked with * are required</p>
        </div>
      </div>
    </div>
  );
}
