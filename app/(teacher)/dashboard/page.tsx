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
import { useNavigate } from "react-router-dom";
import { SidebarPage } from "../_components/sidebar";
import Cookies from "js-cookie";
import { ReactElement } from "react";

interface ChartContainerProps {
  className?: string;
  children: ReactElement;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ className, children }) => (
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
  active_teachers: number;
  recent_students_details: any[];
  // Add other properties as needed
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const navigate = useNavigate();
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const handleLogout = () => {
    // Remove the access token cookie
    Cookies.remove('accessToken');
    
    // Clear local storage
    localStorage.removeItem('userData');
    localStorage.removeItem('dashboardData');
    localStorage.removeItem('dashboardDataTimestamp');
    
    // Redirect to login page
    navigate('/teacher/sign-in');
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
      localStorage.setItem("dashboardData", JSON.stringify(dashboardRes));
      localStorage.setItem("dashboardDataTimestamp", Date.now().toString());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  console.log(dashboardData);
  useEffect(() => {
    // console.log("Active");
    const statusBox = document.querySelectorAll(".status-div");
    statusBox.forEach((box) => {
      console.log(box.textContent);
      if (box.textContent === "Active") {
        box.classList.remove("text-red-700");
        box.classList.remove("bg-red-100");
        box.classList.add("text-green-700");
        box.classList.add("bg-green-100");
        (box as HTMLElement).style.padding = "0.25rem 0.76rem";
      } else if (box.textContent === "Inactive") {
        (box as HTMLElement).style.padding = "0.25rem 0.5rem";
        box.classList.remove("text-green-700");
        box.classList.remove("bg-green-100");
        box.classList.add("text-red-700");
        box.classList.add("bg-red-100");
      }
    });
  }, [dashboardData]);
  return (
    <div className="min-h-screen bg-[#181818] dark ">
      <div className="flex">
        <SidebarPage></SidebarPage>

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
                  {dashboardData ? dashboardData.active_teachers : "Loading..."}
                </div>
              </CardContent>
            </Card>
            <Card className="hover:bg-[#0d1218]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                {'Today\'s Sessions'}
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
                <div className="text-2xl font-bold">92%</div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[200px]">
                <LineChart
                  data={attendanceData}
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
                      <TableRow>
                        <TableCell>
                          {
                            dashboardData?.recent_students_details[0]
                              .studentName
                          }
                        </TableCell>
                        <TableCell>
                          {
                            dashboardData?.recent_students_details[0]
                              .admissionNo
                          }
                        </TableCell>
                        <TableCell>
                          {dashboardData?.recent_students_details[0].batch}
                        </TableCell>
                        <TableCell>
                          {dashboardData?.recent_students_details[0].email}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full status-div">
                            {dashboardData?.recent_students_details[0].active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          {
                            dashboardData?.recent_students_details[1]
                              .studentName
                          }
                        </TableCell>
                        <TableCell>
                          {
                            dashboardData?.recent_students_details[1]
                              .admissionNo
                          }
                        </TableCell>
                        <TableCell>
                          {dashboardData?.recent_students_details[1].batch}
                        </TableCell>
                        <TableCell>
                          {dashboardData?.recent_students_details[1].email}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full status-div">
                            {dashboardData?.recent_students_details[1].active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          {
                            dashboardData?.recent_students_details[2]
                              .studentName
                          }
                        </TableCell>
                        <TableCell>
                          {
                            dashboardData?.recent_students_details[2]
                              .admissionNo
                          }
                        </TableCell>
                        <TableCell>
                          {dashboardData?.recent_students_details[2].batch}
                        </TableCell>
                        <TableCell>
                          {dashboardData?.recent_students_details[2].email}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full status-div">
                            {dashboardData?.recent_students_details[2].active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
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
                  onClick={() => navigate("/teacher/student/add")}
                  className="w-full "
                >
                  Register New Student
                </Button>
                <Button
                  onClick={() => navigate("/teacher/batches/add")}
                  className="w-full "
                  variant={"outline"}
                >
                  Create Batch
                </Button>
                <Button variant="outline" className="w-full">
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
