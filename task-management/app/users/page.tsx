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

export default function Users() {
  const { role } = useAuth()
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "lecturer" })
  const [editUser, setEditUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const { toast } = useToast()

  useEffect(() => {
    // In a real application, you would fetch users from an API
    const fetchUsers = async () => {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data)
    }
    fetchUsers()
  }, [])

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to an API
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
    if (response.ok) {
      toast({
        title: "Success",
        description: "User added successfully",
      })
      setNewUser({ email: "", password: "", role: "lecturer" })
      // Refetch users
      const updatedUsers = await response.json()
      setUsers(updatedUsers)
    } else {
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      })
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to an API
    const response = await fetch(`/api/users/${editUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editUser),
    })
    if (response.ok) {
      toast({
        title: "Success",
        description: "User updated successfully",
      })
      setEditUser(null)
      // Refetch users
      const updatedUsers = await response.json()
      setUsers(updatedUsers)
    } else {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    // In a real application, you would send this request to an API
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    })
    if (response.ok) {
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      // Refetch users
      const updatedUsers = await response.json()
      setUsers(updatedUsers)
    } else {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter((user: any) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (role !== "superAdmin") {
    return <div>Access Denied</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Enter the details for the new user.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lecturer">Lecturer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superAdmin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">Add User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                      <DialogDescription>Edit the user's details.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditUser} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={editUser?.email}
                          onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-role">Role</Label>
                        <Select
                          value={editUser?.role}
                          onValueChange={(value) => setEditUser({ ...editUser, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lecturer">Lecturer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="superAdmin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Update User</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
          <Button key={i} onClick={() => paginate(i + 1)} variant={currentPage === i + 1 ? "default" : "outline"}>
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  )
}

