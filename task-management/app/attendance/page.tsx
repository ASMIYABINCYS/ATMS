"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"

export default function Attendance() {
  const { role } = useAuth()
  const [attendance, setAttendance] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { toast } = useToast()

  useEffect(() => {
    // In a real application, you would fetch attendance data from an API
    const fetchAttendance = async () => {
      const response = await fetch(`/api/attendance?date=${selectedDate.toISOString().split("T")[0]}`)
      const data = await response.json()
      setAttendance(data)
    }
    fetchAttendance()
  }, [selectedDate])

  const handleMarkAttendance = async (userId: string, status: string) => {
    // In a real application, you would send this data to an API
    const response = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, date: selectedDate.toISOString().split("T")[0], status }),
    })
    if (response.ok) {
      toast({
        title: "Success",
        description: "Attendance marked successfully",
      })
      // Refetch attendance
      const updatedAttendance = await response.json()
      setAttendance(updatedAttendance)
    } else {
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      })
    }
  }

  if (role !== "lecturer" && role !== "admin" && role !== "superAdmin") {
    return <div>Access Denied!</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Attendance Tracking</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Select Date</h2>
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Attendance for {selectedDate.toDateString()}</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((record: any) => (
                <TableRow key={record.id}>
                  <TableCell>{record.user_name}</TableCell>
                  <TableCell>{record.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleMarkAttendance(record.user_id, "present")}
                    >
                      Present
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleMarkAttendance(record.user_id, "absent")}>
                      Absent
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

