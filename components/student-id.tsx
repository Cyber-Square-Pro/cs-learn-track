import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Calendar, BookOpen, Hash } from "lucide-react";

interface StudentIdCardProps {
  profileImage: string;
  fullName: string;
  admissionNumber: string;
  studentClass: string;
  contactNumber: string;
  schoolName: string;
  expiryDate: string;
}

export function StudentIdCard({
  profileImage,
  fullName,
  admissionNumber,
  studentClass,
  contactNumber,
  schoolName,
  expiryDate,
}: StudentIdCardProps) {
  return (
    <Card className="w-full max-w-sm overflow-hidden bg-gray-900 shadow-lg transition-all hover:shadow-xl border-gray-800">
      {/* Header with school name */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-4 text-center text-white">
        <h1 className="text-xl font-bold tracking-wider">{schoolName}</h1>
        <p className="text-xs uppercase tracking-widest">
          Student Identification Card
        </p>
      </div>

      {/* Profile section */}
      <div className="flex flex-col items-center p-6 pt-8 bg-gray-900 text-gray-100">
        <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-purple-700 bg-gray-800 shadow-md">
          <Image
            src={profileImage || "/placeholder.svg"}
            alt={`${fullName}'s profile`}
            fill
            className="object-cover"
          />
        </div>
        <h2 className="mb-1 text-2xl font-bold text-gray-100">{fullName}</h2>
        <Badge
          variant="outline"
          className="mb-4 bg-purple-900/30 text-purple-300 border-purple-700"
        >
          Student
        </Badge>
      </div>

      {/* Details section */}
      <div className="space-y-3 bg-gray-800 p-6">
        <div className="flex items-center gap-3 text-gray-200">
          <Hash className="h-5 w-5 text-purple-400" />
          <div>
            <p className="text-xs font-medium text-gray-400">
              Admission Number
            </p>
            <p className="font-semibold text-gray-100">{admissionNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-200">
          <BookOpen className="h-5 w-5 text-purple-400" />
          <div>
            <p className="text-xs font-medium text-gray-400">Class</p>
            <p className="font-semibold text-gray-100">{studentClass}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-200">
          <Phone className="h-5 w-5 text-purple-400" />
          <div>
            <p className="text-xs font-medium text-gray-400">Contact</p>
            <p className="font-semibold text-gray-100">{contactNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-200">
          <Calendar className="h-5 w-5 text-purple-400" />
          <div>
            <p className="text-xs font-medium text-gray-400">Valid Until</p>
            <p className="font-semibold text-gray-100">{expiryDate}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black p-3 text-center text-xs text-white">
        <p className="mt-1 text-purple-300">www.learnTrack.edu</p>
      </div>    
    </Card>
  );
}
