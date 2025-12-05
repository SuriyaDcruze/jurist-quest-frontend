"use client"

import { Scale, Gavel } from "lucide-react"
import Logo from "@/assets/Logo.png"

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-green-800 to-slate-800 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-800/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      {/* Main loading content */}
      <div className="relative z-10 text-center">
        
        {/* Title */}
        <img src={Logo}></img>
        <p className="text-2xl text-amber-300 font-light tracking-wide drop-shadow-md mb-8 animate-fade-in delay-300">
          Competition Portal
        </p>
        {/* Loading animation */}
        <div className="flex flex-col items-center gap-6">
          {/* Spinning loader */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-green-800/20 border-b-green-800 rounded-full animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
          {/* Loading text */}
          <div className="text-white/80 text-lg font-medium animate-pulse">Loading Competition Portal...</div>
          {/* Progress dots */}
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
        {/* Decorative line */}
        <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-8 rounded-full shadow-lg animate-pulse" />
      </div>
      {/* Floating legal symbols */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 text-amber-400/20 animate-float">
          <Scale className="w-8 h-8" />
        </div>
        <div className="absolute top-40 right-32 text-green-800/20 animate-float delay-1000">
          <Gavel className="w-6 h-6" />
        </div>
        <div className="absolute bottom-32 left-32 text-amber-400/20 animate-float delay-500">
          <Scale className="w-10 h-10" />
        </div>
        <div className="absolute bottom-20 right-20 text-green-800/20 animate-float delay-1500">
          <Gavel className="w-8 h-8" />
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen