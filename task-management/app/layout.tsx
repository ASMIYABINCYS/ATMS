import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthProvider } from "@/components/auth-provider"
import { ModeToggle } from "@/components/mode-toggle"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ATMS",
  description: "A comprehensive task management system for trainers and admins",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <SidebarProvider>
              <div className="flex h-screen">
                <AppSidebar />
                <main className="flex-1 overflow-y-auto p-4">
                  <div className="flex justify-end mb-4">
                    <ModeToggle />
                  </div>
                  {children}
                </main>
              </div>
              <Toaster />
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'