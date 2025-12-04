"use client"

import { useState } from "react"
import {
  Download,
  Upload,
  MessageSquare,
  Bell,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  UserRound,
  PhoneCallIcon,
  Archive,
} from "lucide-react"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Logo from "@/assets/Logo.png"

interface SidebarProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

const Sidebar = ({ isSidebarOpen, toggleSidebar }: SidebarProps) => {
  const [isAnnouncementsOpen, setAnnouncementsOpen] = useState(false)

  return (
    <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 fixed top-0 left-0 h-screen z-50`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={Logo}></img>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <TabsList className="grid grid-cols-1 h-auto bg-transparent space-y-2 p-0">
          {/* Dashboard - Featured Button */}
          <TabsTrigger 
            value="overview" 
            className="w-full bg-transparent hover:bg-gray-50 text-gray-700 rounded-lg h-12 flex items-center justify-start gap-3 px-4 data-[state=active]:[background-color:#2d4817] data-[state=active]:text-white border-none"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger
            value="announcements"
            className="w-full bg-transparent hover:bg-gray-50 text-gray-700 rounded-lg h-10 flex items-center justify-start gap-3 px-4 data-[state=active]:[background-color:#2d4817] data-[state=active]:text-white border-none"
                >
                  <Bell className="h-5 w-5" />
                  <span>Announcement</span>
                </TabsTrigger>
          
          <TabsTrigger
                  value="round-details"
                  className="w-full bg-transparent hover:bg-gray-50 text-gray-700 rounded-lg h-10 flex items-center justify-start gap-3 px-4 data-[state=active]:[background-color:#2d4817] data-[state=active]:text-white border-none"
                >
                  <UserRound className="h-5 w-5"/>
                  <span>Round Details</span>
                </TabsTrigger>
          {/* Regular Menu Items */}
          <TabsTrigger 
            value="downloads" 
            className="w-full bg-transparent hover:bg-gray-50 text-gray-700 rounded-lg h-12 flex items-center justify-start gap-3 px-4 data-[state=active]:[background-color:#2d4817] data-[state=active]:text-white border-none"
          >
            <Download className="h-5 w-5" />
            <span>Download Materials</span>
          </TabsTrigger>

          <TabsTrigger 
            value="memorial" 
            className="w-full bg-transparent hover:bg-gray-50 text-gray-700 rounded-lg h-12 flex items-center justify-start gap-3 px-4 data-[state=active]:[background-color:#2d4817] data-[state=active]:text-white border-none"
          >
            <Upload className="h-5 w-5" />
            <span>Memorial Submission</span>
          </TabsTrigger>

          <TabsTrigger 
            value="clarifications" 
            className="w-full bg-transparent hover:bg-gray-50 text-gray-700 rounded-lg h-12 flex items-center justify-start gap-3 px-4 data-[state=active]:[background-color:#2d4817] data-[state=active]:text-white border-none"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Clarifications</span>
          </TabsTrigger>

          <TabsTrigger
                  value="support"
                  className="w-full bg-transparent hover:bg-gray-50 text-gray-700 rounded-lg h-10 flex items-center justify-start gap-3 px-4 data-[state=active]:[background-color:#2d4817] data-[state=active]:text-white border-none"
                >
                  <PhoneCallIcon className="h-5 w-5" />
                  <span>Contact</span>
                </TabsTrigger>
          <TabsTrigger
                  value="others"
                  className="w-full bg-transparent hover:bg-gray-50 text-gray-700 rounded-lg h-10 flex items-center justify-start gap-3 px-4 data-[state=active]:[background-color:#2d4817] data-[state=active]:text-white border-none"
                >
                  <Archive className="h-5 w-5" />
                  <span>Others</span>
                </TabsTrigger>
        </TabsList>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <Button 
  variant="ghost" 
  className="w-full bg-[#2d4817] text-white rounded-lg h-12 flex items-center justify-start gap-3 px-4 hover:bg-[#2d4817] hover:text-white"
  onClick={() => {
    localStorage.clear()
    window.location.href = "/"
  }}
>
  <LogOut className="h-5 w-5" />
  <span>Logout</span>
</Button>

      </div>
    </aside>
  )
}

export default Sidebar
