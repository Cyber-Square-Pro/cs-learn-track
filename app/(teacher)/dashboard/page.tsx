"use client";

import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";

const ChartContainer = ({ className, children }) => (
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

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-10 bg-[#181818] dark ">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 p-6 space-y-4 border-r bg-[#0a0a0a] text-white">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-500 rounded" />
            <span className="text-lg font-semibold">LearnTrack</span>
          </div>
          <nav className="space-y-2">
            <Button
              variant="secondary"
              className="justify-start w-full font-normal"
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full font-normal"
            >
              Students
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full font-normal"
            >
              Batches
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full font-normal"
            >
              Schedule
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full font-normal"
            >
              Reports
            </Button>
          </nav>
        </div>

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
                  <div className="font-medium text-white">John Smith</div>
                  <div className="text-sm text-gray-500">Teacher</div>
                </div>
              </div>
              <div className="flex items-center ">
                <Button className="w-full ">Logout</Button>
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
                <div className="text-2xl font-bold">1,234</div>
              </CardContent>
            </Card>
            <Card className="hover:bg-[#0d1218]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Active Teachers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
              </CardContent>
            </Card>
            <Card className="hover:bg-[#0d1218]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Today's Sessions
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
                        <TableCell>Sarah Johnson</TableCell>
                        <TableCell>STU001</TableCell>
                        <TableCell>Batch A</TableCell>
                        <TableCell>sarah.j@example.com</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                            Active
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Michael Brown</TableCell>
                        <TableCell>STU002</TableCell>
                        <TableCell>Batch B</TableCell>
                        <TableCell>michael.b@example.com</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                            Active
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
                  onClick={() => navigate("/student/add")}
                  className="w-full "
                >
                  Register New Student
                </Button>
                <Button
                  onClick={() => navigate("/batches/add")}
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
}
