"use client"

import { useState } from "react"
import LoginForm from "@/components/LoginForm"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Index = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = async (data: any) => {
    setIsLoggedIn(true)

    // Check if user is admin
    if (data.user_type === "admin" || data.is_superuser) {
      navigate("/admin-dashboard")
      return
    }

    if (data.user_type === "jurymember") {
      const accessToken = localStorage.getItem("access_token")
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/jury/details/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      localStorage.setItem("jury_details", JSON.stringify(response.data))
      navigate("/juri-dashboard")
    } else {
      navigate("/member-dashboard")
    }
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />
  }

  return null
}

export default Index

