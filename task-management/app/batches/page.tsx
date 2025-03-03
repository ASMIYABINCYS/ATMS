"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Batches() {
  const { role } = useAuth()
  const [batches, setBatches] = useState([])
  const [newBatch, setNewBatch] = useState({ name: "", start_date: "", end_date: "", lecturer_id: "" })
  const [editBatch, setEditBatch] = useState(null)
  const [lecturers, setLecturers] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { toast } = useToast()

  useEffect(() => {
    // In a real application, you would fetch batches and lecturers from an API
    const fetchData = async () => {
      const batchesResponse = await fetch("/api/batches")
      const batchesData = await batchesResponse.json()
      setBatches(batchesData)

      const lecturersResponse = await fetch("/api/lecturers")
      const lecturersData = await lecturersResponse.json()
      setLecturers(lecturersData)
    }
    fetchData()
  }, [])

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to an API
    const response = await fetch("/api/batches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBatch),
    })
    if (response.ok) {
      toast({
        title: "Success",
        description: "Batch added successfully",
      })
      setNewBatch({ name: "", start_date: "", end_date: "", lecturer_id: "" })
      // Refetch batches
      const updatedBatches = await response.json()
      setBatches(updatedBatches)
    } else {
      toast({
        title: "Error",
        description: "Failed to add batch",
        variant: "destructive",
      })
    }
  }

  const handleEditBatch = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to an API
    const response = await fetch(`/api/batches/${editBatch.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editBatch),
    })
    if (response.ok) {
      toast({
        title: "Success",
        description: "Batch updated successfully",
      })
      setEditBatch(null)
      // Refetch batches
      const updatedBatches = await response.json()
      setBatches(updatedBatches)
    } else {
      toast({
        title: "Error",
        description: "Failed to update batch",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBatch = async (batchId: string) => {
    // In a real application, you would send this request to an API
    const response = await fetch(`/api/batches/${batchId}`, {
      method: "DELETE",
    })
    if (response.ok) {
      toast({
        title: "Success",
        description: "Batch deleted successfully",
      })
      // Refetch batches
      const updatedBatches = await response.json()
      setBatches(updatedBatches)
    } else {
      toast({
        title: "Error",
        description: "Failed to delete batch",
        variant: "destructive",
      })
    }
  }

  if (role !== "admin" && role !== "superAdmin") {
    return <div>Access Denied</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Manage Batches</h1>
      <div className="flex justify-between items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Batch</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Batch</DialogTitle>
              <DialogDescription>Enter the details for the new batch.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBatch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Batch Name</Label>
                <Input
                  id="name"
                  value={newBatch.name}
                  onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={newBatch.start_date}
                  onChange={(e) => setNewBatch({ ...newBatch, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={newBatch.end_date}
                  onChange={(e) => setNewBatch({ ...newBatch, end_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lecturer">Lecturer</Label>
                <Select
                  value={newBatch.lecturer_id}
                  onValueChange={(value) => setNewBatch({ ...newBatch, lecturer_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lecturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {lecturers.map((lecturer: any) => (
                      <SelectItem key={lecturer.id} value={lecturer.id}>
                        {lecturer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">Add Batch</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Lecturer</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.map((batch: any) => (
              <TableRow key={batch.id}>
                <TableCell>{batch.name}</TableCell>
                <TableCell>{batch.start_date}</TableCell>
                <TableCell>{batch.end_date}</TableCell>
                <TableCell>{batch.lecturer_name}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Batch</DialogTitle>
                        <DialogDescription>Edit the batch details.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleEditBatch} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Batch Name</Label>
                          <Input
                            id="name"
                            value={editBatch?.name || ""}
                            onChange={(e) => setEditBatch({ ...editBatch, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="start_date">Start Date</Label>
                          <Input
                            id="start_date"
                            type="date"
                            value={editBatch?.start_date || ""}
                            onChange={(e) => setEditBatch({ ...editBatch, start_date: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end_date">End Date</Label>
                          <Input
                            id="end_date"
                            type="date"
                            value={editBatch?.end_date || ""}
                            onChange={(e) => setEditBatch({ ...editBatch, end_date: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lecturer">Lecturer</Label>
                          <Select
                            value={editBatch?.lecturer_id || ""}
                            onValueChange={(value) => setEditBatch({ ...editBatch, lecturer_id: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a lecturer" />
                            </SelectTrigger>
                            <SelectContent>
                              {lecturers.map((lecturer: any) => (
                                <SelectItem key={lecturer.id} value={lecturer.id}>
                                  {lecturer.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteBatch(batch.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div>
          <h2 className="text-xl font-semibold mb-4">Batch Calendar</h2>
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Batches on {selectedDate.toDateString()}</h3>
            <ul className="list-disc list-inside">
              {batches
                .filter(
                  (batch: any) =>
                    new Date(batch.start_date) <= selectedDate && new Date(batch.end_date) >= selectedDate,
                )
                .map((batch: any) => (
                  <li key={batch.id}>{batch.name}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

