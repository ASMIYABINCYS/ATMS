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

export default function Resources() {
  const { role } = useAuth()
  const [resources, setResources] = useState([])
  const [newResource, setNewResource] = useState({ title: "", description: "", file: null })
  const { toast } = useToast()

  useEffect(() => {
    // In a real application, you would fetch resources from an API
    const fetchResources = async () => {
      const response = await fetch("/api/resources")
      const data = await response.json()
      setResources(data)
    }
    fetchResources()
  }, [])

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to an API
    const formData = new FormData()
    formData.append("title", newResource.title)
    formData.append("description", newResource.description)
    formData.append("file", newResource.file)

    const response = await fetch("/api/resources", {
      method: "POST",
      body: formData,
    })
    if (response.ok) {
      toast({
        title: "Success",
        description: "Resource added successfully",
      })
      setNewResource({ title: "", description: "", file: null })
      // Refetch resources
      const updatedResources = await response.json()
      setResources(updatedResources)
    } else {
      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive",
      })
    }
  }

  const handleDeleteResource = async (resourceId: string) => {
    // In a real application, you would send this request to an API
    const response = await fetch(`/api/resources/${resourceId}`, {
      method: "DELETE",
    })
    if (response.ok) {
      toast({
        title: "Success",
        description: "Resource deleted successfully",
      })
      // Refetch resources
      const updatedResources = await response.json()
      setResources(updatedResources)
    } else {
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Resource Management</h1>
      <div className="flex justify-between items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Resource</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
              <DialogDescription>Upload a new learning resource.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddResource} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setNewResource({ ...newResource, file: e.target.files[0] })}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">Upload Resource</Button>
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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource: any) => (
            <TableRow key={resource.id}>
              <TableCell>{resource.title}</TableCell>
              <TableCell>{resource.description}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">
                  Download
                </Button>
                {(role === "admin" || role === "superAdmin") && (
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteResource(resource.id)}>
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

