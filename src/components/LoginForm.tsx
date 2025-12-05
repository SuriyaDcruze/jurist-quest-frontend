"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Scale, Gavel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import LoadingScreen from "@/components/TeamDashboard/LoadingScreen"
import Logo from "@/assets/Logo.png"
import axios from "axios"

interface LoginFormProps {
  onLogin: (teamData: any) => void
}

const Index = ({ onLogin }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading time for video and content
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      localStorage.clear()
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/token/`, {
        username: username,
        password: password,
      });
      const { access, refresh, user_type, is_superuser } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Check if user is admin/superuser
      if (user_type === 'admin' || is_superuser) {
        localStorage.setItem('user_type', 'admin');
        onLogin({ user_type: 'admin', is_superuser: true });
        return;
      }

      if (user_type === 'jurymember') {
        onLogin({ user_type });
      } else {
        const userDetailsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/team/details/`, {
          headers: {
            Authorization: `Bearer ${access}`
          }
        });

        localStorage.setItem('team_data', JSON.stringify(userDetailsResponse.data));

        onLogin({ ...userDetailsResponse.data, user_type });
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Invalid team code or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isPageLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
          <source
            src="https://videos.pexels.com/video-files/6192775/6192775-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
          {/* Fallback background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800" />
        </video>
        {/* Enhanced video overlay for better readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[0.5px]" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-800/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Content - Centered container for the split form */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        {/* The main container for the split form, now taking the original card's styling */}
        <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl flex flex-col lg:flex-row bg-white/15 backdrop-blur-xl border-white/25">
          {/* Left Panel (Solid Dark Green) */}
          <div className="w-full lg:w-1/2 [background-color:#2d4817] text-white p-8 flex flex-col items-center justify-center text-center py-12 lg:py-0">


            {/* Logo and Moot Court text - moved here */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src={Logo}></img>
            </div>
            <p className="text-xl text-green-400 font-light tracking-wide drop-shadow-md">Competition Portal</p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-900 mx-auto mt-4 rounded-full shadow-lg" />

            {/* Welcome Back message and button */}
            <h2 className="text-3xl font-bold mt-8 mb-4">Welcome!</h2>
            <p className="text-center text-white/80 mb-8">
              Use the team code and password sent to your email to log in and access your dashboard.
            </p>

          </div>

          {/* Right Panel (Login Form) - now transparent to show parent's blur */}
          <div className="w-full lg:w-1/2 p-8 bg-transparent">
            <div className="text-center pb-6">
              <h2 className="text-2xl font-semibold text-white drop-shadow-md">Welcome Back</h2>
              <p className="text-white/80 text-base">Sign in to access your competition dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white/90 font-medium">
                  Team ID
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white/10 border-white/25 text-white placeholder:text-white/60 h-12 focus:border-green-500 focus:ring-green-500/30 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/10 border-white/25 text-white placeholder:text-white/60 h-12 pr-12 focus:border-green-500 focus:ring-green-500/30 backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-black transition-colors"
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-white/25 bg-white/10 text-green-500 focus:ring-green-500/30"
                  />
                  Remember me
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r [background-color:#2d4817] hover:from-green-950 hover:to-green-900 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
