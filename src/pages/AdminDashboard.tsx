import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/AdminDashboard/sidebar"
import Overview from "@/components/AdminDashboard/Overview"
import TeamManagement from "@/components/AdminDashboard/TeamManagement"
import JuryManagement from "@/components/AdminDashboard/JuryManagement"
import RoundManagement from "@/components/AdminDashboard/RoundManagement"
import AnnouncementManagement from "@/components/AdminDashboard/AnnouncementManagement"
import ClarificationManagement from "@/components/AdminDashboard/ClarificationManagement"

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex w-full">
                <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-y-auto lg:ml-64">
                    {/* Mobile Header */}
                    <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="w-full">
                        {activeTab === "overview" && <Overview />}
                        {activeTab === "teams" && <TeamManagement />}
                        {activeTab === "juries" && <JuryManagement />}
                        {activeTab === "rounds" && <RoundManagement />}
                        {activeTab === "announcements" && <AnnouncementManagement />}
                        {activeTab === "clarifications" && <ClarificationManagement />}
                    </div>
                </main>
            </Tabs>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    )
}

export default AdminDashboard
