"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, Eye, GraduationCap, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarPage } from "../_components/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThemeProvider } from "@/components/theme-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock student data
const students = [
  {
    id: 1,
    adminNumber: "A12345",
    name: "Michael Chang",
    email: "michael.chang@example.com",
    phone: "(555) 345-6789",
    batch: "2022A",
  },
  {
    id: 2,
    adminNumber: "A12346",
    name: "Ethan Davis",
    email: "ethan.davis@example.com",
    phone: "(555) 789-0123",
    batch: "2022A",
  },
  {
    id: 3,
    adminNumber: "A12347",
    name: "James Smith",
    email: "james.smith@example.com",
    phone: "(555) 567-8901",
    batch: "2022B",
  },
  {
    id: 4,
    adminNumber: "A12348",
    name: "Noah Wilson",
    email: "noah.wilson@example.com",
    phone: "(555) 901-2345",
    batch: "2022B",
  },
  {
    id: 5,
    adminNumber: "A12349",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    batch: "2023A",
  },
  {
    id: 6,
    adminNumber: "A12350",
    name: "Sophia Williams",
    email: "sophia.williams@example.com",
    phone: "(555) 456-7890",
    batch: "2023A",
  },
  {
    id: 7,
    adminNumber: "A12351",
    name: "Olivia Brown",
    email: "olivia.brown@example.com",
    phone: "(555) 234-5678",
    batch: "2023B",
  },
  {
    id: 8,
    adminNumber: "A12352",
    name: "William Taylor",
    email: "william.taylor@example.com",
    phone: "(555) 678-9012",
    batch: "2023B",
  },
];

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<
    (typeof students)[0] | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string>("all");

  // Get unique batch names for the filter dropdown
  const batchOptions = useMemo(() => {
    const batches = [...new Set(students.map((student) => student.batch))];
    return ["all", ...batches];
  }, []);

  // Filter students based on search term and selected batch
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.adminNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBatch =
        selectedBatch === "all" || student.batch === selectedBatch;

      return matchesSearch && matchesBatch;
    });
  }, [searchTerm, selectedBatch]);

  // View student details
  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  // Handle batch selection
  const handleBatchChange = (value: string) => {
    setSelectedBatch(value);
  };

  // Handle student removal
  const removeStudent = (studentId: number) => {
    // This would typically make an API call to delete the student
    // For now, we'll just show an alert
    alert(`Student with ID: ${studentId} would be removed`);
    // In a real implementation, you would update the state after successful deletion
  };

  // Get batch color class
  const getBatchColorClass = (batch: string) => {
    if (batch.includes("2022A")) return "bg-purple-700";
    if (batch.includes("2022B")) return "bg-purple-700";
    if (batch.includes("2023A")) return "bg-purple-700";
    if (batch.includes("2023B")) return "bg-purple-700";
    return "bg-purple-700";
  };

  return (
    <ThemeProvider defaultTheme="dark" forcedTheme="dark">
      <div className="min-h-screen bg-[#181818] flex dark  gap -0">
        <SidebarPage
         />
        {/* Header */}
        <div className="block w-full">
          <header className="bg-[#181818] py-4 px-8">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center">
                <GraduationCap className="text-white h-8 w-8 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Student Manager
                  </h1>
                  <p className="text-[#b8b8d4]">
                    Organize, search, and manage student information
                  </p>
                </div>
              </div>
              <div className="bg-[#2d1a45] px-4 py-2 rounded-md flex items-center">
                <Users className="text-[#b8b8d4] h-5 w-5 mr-2" />
                <span className="text-white">{students.length} Students</span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto py-8 px-8">
            <div className="bg-[#0A0A0A] rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-1">
                Student Management
              </h2>
              <p className="text-[#b8b8d4]">
                View, search, and filter student information across all batches
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#b8b8d4]" />
                <Input
                  placeholder="Search students..."
                  className="pl-10 bg-[#0A0A0A] border-[#1b1b2b] text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={selectedBatch} onValueChange={handleBatchChange}>
                  <SelectTrigger className="bg-[#0A0A0A] border-[#1d1d2e] text-white">
                    <SelectValue placeholder="All Batches" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0A0A] border-[#0A0A0A] text-white">
                    <SelectItem value="all">All Batches</SelectItem>
                    {batchOptions
                      .filter((batch) => batch !== "all")
                      .map((batch) => (
                        <SelectItem key={batch} value={batch}>
                          {batch}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-[#0A0A0A] rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-[#0A0A0A]">
                  <TableRow className="border-b-0 hover:bg-transparent">
                    <TableHead className="text-[#b8b8d4] font-medium">
                      NAME
                    </TableHead>
                    <TableHead className="text-[#b8b8d4] font-medium">
                      EMAIL
                    </TableHead>
                    <TableHead className="text-[#b8b8d4] font-medium">
                      PHONE NUMBER
                    </TableHead>
                    <TableHead className="text-[#b8b8d4] font-medium">
                      <div className="flex items-center">
                        BATCH
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-[#b8b8d4] font-medium">
                      ACTIONS
                    </TableHead>
                    <TableHead className="text-[#b8b8d4] font-medium">
                      REMOVE
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow
                        key={student.id}
                        className="border-b border-[#2d2d4a] hover:bg-[#232442]"
                      >
                        <TableCell className="font-medium text-white">
                          {student.name}
                        </TableCell>
                        <TableCell className="text-[#b8b8d4]">
                          {student.email}
                        </TableCell>
                        <TableCell className="text-[#b8b8d4]">
                          {student.phone}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getBatchColorClass(
                              student.batch
                            )}`}
                          >
                            {student.batch}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewStudentDetails(student)}
                            className="text-[#8a85ff] hover:text-[#a5a1ff] hover:bg-[#2d2d4a]"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeStudent(student.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6} {/* Updated colspan to account for the new column */}
                        className="text-center py-8 text-[#b8b8d4]"
                      >
                        No students found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </main>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
          <DialogContent className="bg-[#1a1b36] border-[#2d2d4a] text-white">
            <DialogHeader className=" dark">
              <DialogTitle className="text-white">Student Details</DialogTitle>
              <DialogDescription className="text-[#b8b8d4]">
                Detailed information about the student.
              </DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium text-[#b8b8d4]">
                    Admin Number:
                  </span>
                  <span className="col-span-3 text-white">
                    {selectedStudent.adminNumber}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium text-[#b8b8d4]">Name:</span>
                  <span className="col-span-3 text-white">
                    {selectedStudent.name}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium text-[#b8b8d4]">Email:</span>
                  <span className="col-span-3 text-white">
                    {selectedStudent.email}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium text-[#b8b8d4]">Phone:</span>
                  <span className="col-span-3 text-white">
                    {selectedStudent.phone}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium text-[#b8b8d4]">Batch:</span>
                  <span className="col-span-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getBatchColorClass(
                        selectedStudent.batch
                      )}`}
                    >
                      {selectedStudent.batch}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
