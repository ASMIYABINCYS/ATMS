type User = {
  id: string
  email: string
  role: "superAdmin" | "admin" | "lecturer"
}

const users: User[] = [
  { id: "1", email: "superadmin@example.com", role: "superAdmin" },
  { id: "2", email: "admin@example.com", role: "admin" },
  { id: "3", email: "lecturer@example.com", role: "lecturer" },
]

export const authenticate = (email: string, password: string): User | null => {
  // In a real application, you would hash the password and compare it securely
  const user = users.find((u) => u.email === email)
  if (user && password === "password") {
    // All users have the same password for this example
    return user
  }
  return null
}

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem("currentUser")
  return userJson ? JSON.parse(userJson) : null
}

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } else {
    localStorage.removeItem("currentUser")
  }
}

