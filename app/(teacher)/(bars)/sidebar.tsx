import React from "react";
import { Button } from "@/components/ui/button";

export const SidebarPage = () => {
  return (
    <div >
      <div className="w-64 p-6 h-full space-y-4 border-r bg-[#0a0a0a] text-white">
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
          <Button variant="ghost" className="justify-start w-full font-normal">
            Students
          </Button>
          <Button variant="ghost" className="justify-start w-full font-normal">
            Batches
          </Button>
          <Button variant="ghost" className="justify-start w-full font-normal">
            Sessions
          </Button>
          <Button variant="ghost" className="justify-start w-full font-normal">
            Reports
          </Button>
        </nav>
      </div>
    </div>
  );
};
