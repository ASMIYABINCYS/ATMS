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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Payroll() {
  const { role } = useAuth()
  const [payrollData, setPayrollData] = useState([])
  const [newEntry, setNewEntry] = useState({ employee: "", salary: "", bonus: "", deductions: "" })
  const { toast } = useToast()

  useEffect(() => {
    // Fetch payroll data
    const fetchPayrollData = async () => {
      const response = await fetch("/api/payroll")
      const data = await response.json()
      setPayrollData(data)
    }

    fetchPayrollData()
  }, [])

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to an API
    const response = await fetch("/api/payroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    })
    if (response.ok) {
      toast({
        title: "Success",
        description: "Payroll entry added successfully",
      })
      setNewEntry({ employee: "", salary: "", bonus: "", deductions: "" })
      // Refetch payroll data
      const updatedPayroll = await response.json()
      setPayrollData(updatedPayroll)
    } else {
      toast({
        title: "Error",
        description: "Failed to add payroll entry",
        variant: "destructive",
      })
    }
  }

  if (role !== "admin" && role !== "superAdmin") {
    return <div>Access Denied</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payroll Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payroll Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Payroll Entry</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Payroll Entry</DialogTitle>
                  <DialogDescription>Enter the details for the new payroll entry.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddEntry} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee">Employee</Label>
                    <Input
                      id="employee"
                      value={newEntry.employee}
                      onChange={(e) => setNewEntry({ ...newEntry, employee: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={newEntry.salary}
                      onChange={(e) => setNewEntry({ ...newEntry, salary: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bonus">Bonus</Label>
                    <Input
                      id="bonus"
                      type="number"
                      value={newEntry.bonus}
                      onChange={(e) => setNewEntry({ ...newEntry, bonus: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deductions">Deductions</Label>
                    <Input
                      id="deductions"
                      type="number"
                      value={newEntry.deductions}
                      onChange={(e) => setNewEntry({ ...newEntry, deductions: e.target.value })}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Entry</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Pay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((entry: any) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.employee}</TableCell>
                  <TableCell>${entry.salary}</TableCell>
                  <TableCell>${entry.bonus}</TableCell>
                  <TableCell>${entry.deductions}</TableCell>
                  <TableCell>${entry.salary + entry.bonus - entry.deductions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

