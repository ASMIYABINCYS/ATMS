"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { authenticate, setCurrentUser } from "@/lib/auth"
import { Checkbox } from "@/components/ui/checkbox"
import { Mountain, ChevronRight } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = authenticate(email, password)
    if (user) {
      setCurrentUser(user)
      router.push("/")
    } else {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary to-secondary text-white overflow-hidden">
      <div className="flex-1 hidden lg:block relative">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img
          src="/placeholder.svg?height=1080&width=1920"
          alt="ATMS"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-start p-24">
          <h1 className="text-6xl font-bold mb-6">ACADEMICS TEAM MANAGEMENT SYSTEM</h1>
          <p className="text-2xl max-w-xl">
            Empower your team, streamline your workflow, and achieve more with our cutting-edge task management system.
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/3 flex flex-col justify-center items-center p-12 bg-white text-black-400">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-12">
            <Mountain className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-4xl font-bold mb-2 text-center">Welcome Back</h2>
          <p className="text-gray-600 text-center mb-8">Sign in to your account</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-white shadow-sm text-white"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-white"
              />
            </div>
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-black-300 rounded"
                /> */}
                {/* <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 w-full">
                  Remember me
                </Label>
              </div>
              <a href="#" className="text-sm font-medium text-primary hover:text-primary/80">
                Forgot your password?
              </a>
            </div> */}
            <Button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-Blue-400 rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-black"
            >
              Sign in
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

