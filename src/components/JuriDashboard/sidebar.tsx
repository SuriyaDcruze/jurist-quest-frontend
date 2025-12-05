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
  User,
  Calendar,
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
  const [isTeamsOpen, setTeamsOpen] = useState(false)

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
          {/* Regular Menu Items */}
          {/* Dashboard - Featured Button */}
          <TabsTrigger
            value="overview"
            className="w-full bg-transparent hover:bg-gray-50 text-gray-700 rounded-lg h-12 flex items-center justify-start gap-3 px-4 data-[state=active]:[background-color:#2d4817] data-[state=active]:text-white font-medium"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger
            value="announcement"
            className="w-full bg-transparent hover:bg-gray-50 text-gray-700 rounded-lg h-12 flex items-center justify-start gap-3 px-4 data-[state=active]:[background-color:#2d4817] data-[state=active]:text-white border-none"
          >
            <Bell className="h-5 w-5" />
            <span>Announcement</span>
          </TabsTrigger>

          <TabsTrigger
            value="calendar"
            className="w-full bg-transparent hover:bg-gray-50 text-gray-700 rounded-lg h-12 flex items-center justify-start gap-3 px-4 data-[state=active]:[background-color:#2d4817] data-[state=active]:text-white border-none"
          >
            <Calendar className="h-5 w-5" />
            <span>Calendar</span>
          </TabsTrigger>

          <TabsTrigger
            value="rounds"
            className="w-full bg-transparent hover:bg-gray-50 text-gray-700 rounded-lg h-12 flex items-center justify-start gap-3 px-4 data-[state=active]:[background-color:#2d4817] data-[state=active]:text-white border-none"
          >
            <Calendar className="h-5 w-5" />
            <span>Rounds</span>
          </TabsTrigger>

          {/* Hidden Items
          <TabsTrigger
            value="team"
            className="w-full bg-transparent hover:bg-gray-50 text-gray-700 rounded-lg h-12 flex items-center justify-start gap-3 px-4 data-[state=active]:[background-color:#2d4817] data-[state=active]:text-white border-none"
          >
            <User className="h-5 w-5" />
            <span>Teams</span>
          </TabsTrigger>

          <TabsTrigger
            value="profile"
            className="w-full bg-transparent hover:bg-gray-50 text-gray-700 rounded-lg h-12 flex items-center justify-start gap-3 px-4 data-[state=active]:[background-color:#2d4817] data-[state=active]:text-white border-none"
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </TabsTrigger>
          */}
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
