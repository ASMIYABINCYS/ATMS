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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Tasks() {
  const { role } = useAuth()
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
    assigned_to: "",
    status: "pending",
  })
  const [editTask, setEditTask] = useState(null)
  const [users, setUsers] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    // In a real application, you would fetch tasks and users from an API
    const fetchData = async () => {
      const tasksResponse = await fetch("/api/tasks")
      const tasksData = await tasksResponse.json()
      setTasks(tasksData)

      const usersResponse = await fetch("/api/users")
      const usersData = await usersResponse.json()
      setUsers(usersData)
    }
    fetchData()
  }, [])

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to an API
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
    if (response.ok) {
      toast({
        title: "Success",
        description: "Task added successfully",
      })
      setNewTask({ title: "", description: "", due_date: "", assigned_to: "", status: "pending" })
      // Refetch tasks
      const updatedTasks = await response.json()
      setTasks(updatedTasks)
    } else {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      })
    }
  }

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to an API
    const response = await fetch(`/api/tasks/${editTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editTask),
    })
    if (response.ok) {
      toast({
        title: "Success",
        description: "Task updated successfully",
      })
      setEditTask(null)
      // Refetch tasks
      const updatedTasks = await response.json()
      setTasks(updatedTasks)
    } else {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    // In a real application, you would send this request to an API
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    })
    if (response.ok) {
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
      // Refetch tasks
      const updatedTasks = await response.json()
      setTasks(updatedTasks)
    } else {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Manage Tasks</h1>
      <div className="flex justify-between items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Enter the details for the new task.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assigned_to">Assigned To</Label>
                <Select
                  value={newTask.assigned_to}
                  onValueChange={(value) => setNewTask({ ...newTask, assigned_to: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newTask.status} onValueChange={(value) => setNewTask({ ...newTask, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">Add Task</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task: any) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.due_date}</TableCell>
              <TableCell>{task.assigned_to_name}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Task</DialogTitle>
                      <DialogDescription>Edit the task details.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditTask} className="space-y-4">
                      {/* Add form fields similar to the Add Task form */}
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

