"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, Line } from "react-chartjs-2"
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
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

export default function TrackProgress() {
  const { role } = useAuth()
  const [batchProgress, setBatchProgress] = useState([])
  const [studentProgress, setStudentProgress] = useState([])

  useEffect(() => {
    // Fetch batch progress data
    const fetchBatchProgress = async () => {
      const response = await fetch("/api/batch-progress")
      const data = await response.json()
      setBatchProgress(data)
    }

    // Fetch student progress data
    const fetchStudentProgress = async () => {
      const response = await fetch("/api/student-progress")
      const data = await response.json()
      setStudentProgress(data)
    }

    fetchBatchProgress()
    fetchStudentProgress()
  }, [])

  const batchProgressData = {
    labels: batchProgress.map((batch: any) => batch.name),
    datasets: [
      {
        label: "Completion Rate",
        data: batchProgress.map((batch: any) => batch.completionRate),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  }

  const averageScoreData = {
    labels: batchProgress.map((batch: any) => batch.name),
    datasets: [
      {
        label: "Average Score",
        data: batchProgress.map((batch: any) => batch.averageScore),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Track Progress</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Batch Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={batchProgressData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Scores by Batch</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={averageScoreData} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Individual Student Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Completed Tasks</TableHead>
                <TableHead>Average Score</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentProgress.map((student: any) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                  <TableCell>{student.completedTasks}</TableCell>
                  <TableCell>{student.averageScore}</TableCell>
                  <TableCell>{student.progress}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

