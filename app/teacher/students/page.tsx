"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  GraduationCap,
  Users,
  Trash2,
} from "lucide-react";
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
import { fetchData } from "@/utils/api";

interface Student {
  name: string;
  email: string;
  admissionNo: number;
}

interface Batch {
  id: number;
  name: string;
}

interface BatchStudentsResponse {
  batch: string;
  students: Student[];
}

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

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

  const fetchBatchStudents = async (batchId: string) => {
    if (batchId === "all") {
      setStudentList([]);
      return;
    }

    try {
      setLoadingStudents(true);
      const response = await fetchData("/batch/list_batch_students/", "POST", {
        batch_id: parseInt(batchId),
      });
      console.log("Batch students response:", response);

      if (response && response.students) {
        setStudentList(response.students);
      } else {
        console.error("Invalid response format:", response);
        setStudentList([]);
      }
    } catch (error) {
      console.error("Error fetching batch students:", error);
      setStudentList([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    return studentList.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNo.toString().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [searchTerm, studentList]);

  // View student details
  const viewStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  // Handle batch selection
  const handleBatchChange = (value: string) => {
    setSelectedBatch(value);
    fetchBatchStudents(value);
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
        <SidebarPage />
        {/* Header */}
        <div className="block w-full">
          <header className="bg-[#181818] py-4 px-8">
            <div className="container flex items-center justify-between mx-auto">
              <div className="flex items-center">
                <GraduationCap className="w-8 h-8 mr-3 text-white" />
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
                <span className="text-white">
                  {studentList.length} Students
                </span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container px-8 py-8 mx-auto">
            <div className="flex flex-col gap-4 mb-6 md:flex-row">
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
                    <SelectValue placeholder="Choose a Batch" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0A0A] border-[#0A0A0A] text-white">
                    <SelectItem value="all">Choose a Batch</SelectItem>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id.toString()}>
                        {batch.name}
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
                        <ChevronDown className="w-4 h-4 ml-1" />
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
                  {loadingStudents ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-[#b8b8d4]"
                      >
                        Loading students...
                      </TableCell>
                    </TableRow>
                  ) : filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <TableRow
                        key={student.admissionNo}
                        className="border-b border-[#2d2d4a] hover:bg-[#232442]"
                      >
                        <TableCell className="font-medium text-white">
                          {student.name}
                        </TableCell>
                        <TableCell className="text-[#b8b8d4]">
                          {student.email}
                        </TableCell>
                        <TableCell className="text-[#b8b8d4]">
                          {student.admissionNo}
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-xs font-medium bg-purple-700 rounded">
                            {batches.find(
                              (b) => b.id.toString() === selectedBatch
                            )?.name || "Unknown"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewStudentDetails(student)}
                            className="text-[#8a85ff] hover:text-[#a5a1ff] hover:bg-[#2d2d4a]"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white bg-red-600 hover:bg-red-700"
                            disabled
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : selectedBatch === "all" ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-[#b8b8d4]"
                      >
                        Please select a batch to view students
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-[#b8b8d4]"
                      >
                        No students found in this batch
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </main>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[#1a1b36] border-[#2d2d4a] text-white">
            <DialogHeader className=" dark">
              <DialogTitle className="text-white">Student Details</DialogTitle>
              <DialogDescription className="text-[#b8b8d4]">
                Detailed information about the student.
              </DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <div className="grid gap-4 py-4">
                <div className="grid items-center grid-cols-4 gap-4">
                  <span className="font-medium text-[#b8b8d4]">
                    Admission Number:
                  </span>
                  <span className="col-span-3 text-white">
                    {selectedStudent.admissionNo}
                  </span>
                </div>
                <div className="grid items-center grid-cols-4 gap-4">
                  <span className="font-medium text-[#b8b8d4]">Name:</span>
                  <span className="col-span-3 text-white">
                    {selectedStudent.name}
                  </span>
                </div>
                <div className="grid items-center grid-cols-4 gap-4">
                  <span className="font-medium text-[#b8b8d4]">Email:</span>
                  <span className="col-span-3 text-white">
                    {selectedStudent.email}
                  </span>
                </div>
                <div className="grid items-center grid-cols-4 gap-4">
                  <span className="font-medium text-[#b8b8d4]">Batch:</span>
                  <span className="col-span-3">
                    <span className="px-2 py-1 text-xs font-medium bg-purple-700 rounded">
                      {batches.find((b) => b.id.toString() === selectedBatch)
                        ?.name || "Unknown"}
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
