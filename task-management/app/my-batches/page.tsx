"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MyBatches() {
  const { user, role } = useAuth()
  const [batches, setBatches] = useState([])
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (user) {
      // In a real application, you would fetch this data from an API
      setBatches([
        { id: "1", name: "Batch 1", start_date: "2023-01-01", end_date: "2023-06-30" },
        { id: "2", name: "Batch 2", start_date: "2023-07-01", end_date: "2023-12-31" },
      ])
      setTasks([
        { id: "1", name: "Task 1", due_date: "2023-03-15", status: "Completed" },
        { id: "2", name: "Task 2", due_date: "2023-08-30", status: "In Progress" },
      ])
    }
  }, [user])

  if (role !== "lecturer") {
    return <div>Access Denied</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Batches and Tasks</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch: any) => (
                  <TableRow key={batch.id}>
                    <TableCell>{batch.name}</TableCell>
                    <TableCell>{batch.start_date}</TableCell>
                    <TableCell>{batch.end_date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task: any) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.due_date}</TableCell>
                    <TableCell>{task.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

