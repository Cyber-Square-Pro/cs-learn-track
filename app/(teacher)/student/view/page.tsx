"use client";

import { useState } from "react";
import {
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
interface Student {
  id: string;
  name: string;
  batch: string;
  email: string;
}

const initialStudents: Student[] = [
  {
    id: "STU001",
    name: "John Smith",
    batch: "2023A",
    email: "john.smith@example.com",
  },
  {
    id: "STU002",
    name: "Emma Johnson",
    batch: "2023B",
    email: "emma.johnson@example.com",
  },
  {
    id: "STU003",
    name: "Michael Brown",
    batch: "2023A",
    email: "michael.brown@example.com",
  },
];

export default function StudentManagement() {
  const [students] = useState<Student[]>(initialStudents);
  const navigate = useNavigate();
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectAll = (filteredStudents: Student[]) => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(
        new Set(filteredStudents.map((student) => student.id))
      );
    }
  };

  const handleSelectStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const filteredStudents = students.filter((student) => {
    const searchTerms = searchQuery.toLowerCase().split(" ");
    const studentData =
      `${student.name} ${student.id} ${student.email} ${student.batch}`.toLowerCase();
    return searchTerms.every((term) => studentData.includes(term));
  });

  return (
    <div className="min-h-screen p-6 bg-slate-950 text-slate-100">
      <div className="mx-auto space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Student Management
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              A complete list of all students including their details and
              management options.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="default"
              className="bg-slate-800 hover:bg-slate-700"
              onClick={() => navigate("/teacher/student/add")}
            >
              + Add New Student
            </Button>
            {selectedStudents.size > 1 && (
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedStudents.size})
              </Button>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
          <Input
            placeholder="Search students by name, ID, batch, or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedStudents(new Set()); // Clear selections when search changes
            }}
            className="pl-10 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:ring-slate-700 focus:border-slate-700"
          />
        </div>

        <div className="overflow-hidden border rounded-lg border-slate-800">
          <table className="w-full">
            <thead className="bg-slate-900">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={
                      filteredStudents.length > 0 &&
                      selectedStudents.size === filteredStudents.length
                    }
                    onCheckedChange={() => handleSelectAll(filteredStudents)}
                    className="border-slate-700 data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700"
                  />
                </th>
                <th className="p-4 text-sm font-medium text-left text-slate-300">
                  Student ID
                </th>
                <th className="p-4 text-sm font-medium text-left text-slate-300">
                  Student Name
                </th>
                <th className="p-4 text-sm font-medium text-left text-slate-300">
                  Batch
                </th>
                <th className="p-4 text-sm font-medium text-left text-slate-300">
                  Email
                </th>
                <th className="p-4 text-sm font-medium text-right text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    {searchQuery ? (
                      <div className="space-y-2">
                        <p className="text-lg font-medium">No students found</p>
                        <p className="text-sm">
                          No students match your search "{searchQuery}". Try
                          adjusting your search terms.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-lg font-medium">
                          No students available
                        </p>
                        <p className="text-sm">Add students to get started.</p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="transition-colors hover:bg-slate-900/50"
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedStudents.has(student.id)}
                        onCheckedChange={() => handleSelectStudent(student.id)}
                        className="border-slate-700 data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700"
                      />
                    </td>
                    <td className="p-4 text-sm text-slate-300">{student.id}</td>
                    <td className="p-4 text-sm text-slate-300">
                      {searchQuery ? (
                        <HighlightText
                          text={student.name}
                          highlight={searchQuery}
                        />
                      ) : (
                        student.name
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-300">
                      {student.batch}
                    </td>
                    <td className="p-4 text-sm text-slate-300">
                      {student.email}
                    </td>
                    <td className="p-4 space-x-2 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-slate-800"
                      >
                        <Pencil className="w-4 h-4 text-slate-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredStudents.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-medium">{filteredStudents.length}</span>{" "}
              {filteredStudents.length === 1 ? "result" : "results"}
              {searchQuery && " for your search"}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="dark">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="dark">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component to highlight matching text
function HighlightText({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${highlight.toLowerCase()})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part.toLowerCase()) ? (
          <span key={i} className="text-yellow-200 bg-yellow-500/20">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
