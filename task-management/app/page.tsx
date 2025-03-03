"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, Line, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

export default function Dashboard() {
  const { role } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeBatches: 0,
    completedTasks: 0,
    resourceUsage: 0,
  })

  useEffect(() => {
    // Simulating real-time data fetching
    const fetchData = () => {
      setStats({
        totalUsers: Math.floor(Math.random() * 2000) + 1000,
        activeBatches: Math.floor(Math.random() * 30) + 20,
        completedTasks: Math.floor(Math.random() * 1000) + 500,
        resourceUsage: Math.floor(Math.random() * 20) + 80,
      })
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "User Growth",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  }

  const lineChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Task Completion Rate",
        data: [65, 59, 80, 81],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  const doughnutChartData = {
    labels: ["Completed", "In Progress", "Not Started"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBatches}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resource Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resourceUsage}%</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={barChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={lineChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut data={doughnutChartData} />
          </CardContent>
        </Card>
      </div>
      {role === "admin" && (
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">Team Performance</h2>
          {/* Add team performance metrics and charts here */}
        </div>
      )}
      {role === "lecturer" && (
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">My Tasks</h2>
          {/* Add a list of assigned tasks and their status here */}
        </div>
      )}
    </div>
  )
}

