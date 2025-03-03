"use client"

import { useAuth } from "./auth-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Home,
  Users,
  Briefcase,
  FileText,
  BarChart,
  LogOut,
  CheckSquare,
  DollarSign,
  UserCheck,
  BookOpen,
  Mountain,
} from "lucide-react"
import { useRouter } from "next/navigation"

export function AppSidebar() {
  const { role, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const menuItems = {
    superAdmin: [
      { title: "Dashboard", icon: Home, url: "/" },
      { title: "Manage Users", icon: Users, url: "/users" },
      { title: "Manage Batches", icon: Briefcase, url: "/batches" },
      { title: "Manage Tasks", icon: CheckSquare, url: "/tasks" },
      { title: "Track Progress", icon: BarChart, url: "/progress" },
      { title: "Payroll", icon: DollarSign, url: "/payroll" },
      { title: "Reports", icon: FileText, url: "/reports" },
    ],
    admin: [
      { title: "Dashboard", icon: Home, url: "/" },
      { title: "Manage Batches", icon: Briefcase, url: "/batches" },
      { title: "Manage Tasks", icon: CheckSquare, url: "/tasks" },
      { title: "Track Progress", icon: BarChart, url: "/progress" },
      { title: "Payroll", icon: DollarSign, url: "/payroll" },
    ],
    lecturer: [
      { title: "Dashboard", icon: Home, url: "/" },
      { title: "My Batches", icon: Briefcase, url: "/my-batches" },
      { title: "My Tasks", icon: CheckSquare, url: "/tasks" },
      { title: "Attendance", icon: UserCheck, url: "/attendance" },
      { title: "Resources", icon: BookOpen, url: "/resources" },
    ],
  }

  const items = role ? menuItems[role as keyof typeof menuItems] : []

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <div className="flex items-center space-x-2 px-6 py-4">
          <Mountain className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">ATMS</span>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center space-x-2 px-6 py-2 text-sm">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-6 py-2 text-sm text-red-500"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

