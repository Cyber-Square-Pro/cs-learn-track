"use client";

import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { LogOut, Search } from "lucide-react";
import withAuth from "@/lib/withAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchData } from "@/utils/api";
import { useState, useEffect } from "react";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { SidebarPage } from "../_components/sidebar";
import Cookies from "js-cookie";
import { ReactElement } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartContainerProps {
  className?: string;
  children: ReactElement;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  className,
  children,
}) => (
  <div className={className}>
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  </div>
);

const attendanceData = [
  { day: "Mon", value: 85 },
  { day: "Tue", value: 82 },
  { day: "Wed", value: 85 },
  { day: "Thu", value: 82 },
  { day: "Fri", value: 80 },
  { day: "Sat", value: 81 },
  { day: "Sun", value: 83 },
];

interface DashboardData {
  total_students: number;
  active_students: number;
  recent_students_details: {
    admissionNo: number;
    studentName: string;
    batch: string;
    email: string;
    active: boolean;
  }[];
  attendance_data: {
    date: string;
    percentage: number;
  }[];
  status: number;
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  const [batches, setBatches] = useState<{ name: string; id: any }[]>([]);

  let batch: { label: string; value: any }[] = [];
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Access localStorage only after component has mounted (client-side)
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      setUserData(JSON.parse(userDataString));
    }
  }, []);

  const handleLogout = () => {
    // Remove the access token cookie
    Cookies.remove("accessToken");

    // Clear local storage
    localStorage.removeItem("userData");
    localStorage.removeItem("dashboardData");
    localStorage.removeItem("dashboardDataTimestamp");

    // Redirect to login page
    router.push("/teacher/sign-in");
  };

  const fetchDashboardData = async () => {
    try {
      const dashboardRes = await fetchData(
        "/teacher/dashboard/",
        "POST",
        null,
        false
      );
      setDashboardData(dashboardRes);

      // Store in localStorage only on client-side
      if (typeof window !== "undefined") {
        localStorage.setItem("dashboardData", JSON.stringify(dashboardRes));
        localStorage.setItem("dashboardDataTimestamp", Date.now().toString());
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  console.log(dashboardData);

  const fetchBatches = async () => {
    if (typeof window !== "undefined") {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const response = await fetchData(
          "/batch/list/",
          "POST",
          null,
          false,
          userData.accessToken
        );
        setBatches(response.batches);
      }
    }
  };
  useEffect(() => {
    fetchBatches();
  }, []);
  batch = batches.map((batch) => ({
    label: batch.name,
    value: batch.id,
  }));

  // Calculate average attendance percentage
  const averageAttendance = dashboardData?.attendance_data?.length
    ? Math.round(
        dashboardData.attendance_data.reduce(
          (sum, item) => sum + item.percentage,
          0
        ) / dashboardData.attendance_data.length
      )
    : 0;

  return (
    <div className="min-h-screen bg-[#181818] dark ">
      <div className="flex">
        <SidebarPage />

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="relative w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-white" />
              <Input placeholder="Search..." className="pl-8 text-white" />
            </div>
            <div className="flex items-center gap-7">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full" />
                <div>
                  <div className="font-medium text-white">
                    {userData ? userData.name : "Guest"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {userData ? userData.userType : ""}
                  </div>
                </div>
              </div>
              <div className="flex items-center ">
                <Button className="w-full " onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="hover:bg-[#0d1218]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData ? dashboardData.total_students : "Loading..."}
                </div>
              </CardContent>
            </Card>
            <Card className="hover:bg-[#0d1218]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Active Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData ? dashboardData.active_students : "0"}
                </div>
              </CardContent>
            </Card>
            <Card className="hover:bg-[#0d1218]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {"Today's Sessions"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
              </CardContent>
            </Card>
            <Card className="hover:bg-[#0d1218]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Attendance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageAttendance}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
              <CardTitle>Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[200px]">
                <LineChart
                  data={
                    dashboardData?.attendance_data?.map((item) => ({
                      day: new Date(
                        item.date.split("-").reverse().join("-")
                      ).toLocaleDateString("en-US", { weekday: "short" }),
                      value: item.percentage,
                    })) || attendanceData
                  }
                  margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                >
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={true}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-8">
            {/* Recent Students */}
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!dashboardData?.recent_students_details ||
                      dashboardData.recent_students_details.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            No recent students found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        dashboardData.recent_students_details.map((student) => (
                          <TableRow key={student.admissionNo}>
                            <TableCell>{student.studentName}</TableCell>
                            <TableCell>{student.admissionNo}</TableCell>
                            <TableCell>{student.batch}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                                  student.active
                                    ? "bg-green-100 text-green-800 border border-green-200"
                                    : "bg-red-100 text-red-800 border border-red-200"
                                }`}
                              >
                                {student.active ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => router.push("/teacher/student/add")}
                  className="w-full "
                >
                  Register New Student
                </Button>
                <Button
                  onClick={() => router.push("/teacher/batches/add")}
                  className="w-full "
                  variant={"outline"}
                >
                  Create Batch
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/teacher/sessions/create")}
                >
                  Schedule Session
                </Button>
                <Button variant="outline" className="w-full">
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard, ["Teacher"]);
