import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState("student")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleAuth = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill in all required fields.")
      return
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      if (isLogin) {
        // 登录请求
        const res = await fetch("http://localhost:1000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || "Login failed.")
          return
        }

        // 保存 token
        localStorage.setItem("token", data.token)

        // 解析 token 获取用户信息
        const decoded = jwtDecode(data.token)
        // decoded 里包含 id, role, name, email 等你后端生成的字段
        // localStorage.setItem("user", JSON.stringify({
        //   id: decoded.id,
        //   role: decoded.role,
        //   name: decoded.name,
        //   email: decoded.email,
        // }))
        if (decoded.role === "teacher") {
          navigate("/dash")
        } else {
          navigate("/home")
        }

      } else {
        // 注册请求
        const res = await fetch("http://localhost:1000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || "Registration failed.")
          return
        }
        alert("Registration successful! Please sign in.")
        setIsLogin(true)
        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setError("")
      }
    } catch (err) {
      setError("Network error, please try again.")
    }
  }

  return (
    <div className="w-screen h-screen pt-20 flex items-center justify-center p-4 bg-gradient-to-br from-yellow-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <div className="w-full max-w-md">
        <motion.div
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              className={`relative flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                isLogin ? "text-black" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setIsLogin(true)}
              type="button"
            >
              Sign In
              {isLogin && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md -z-10"
                  layoutId="activeTab"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </button>
            <button
              className={`relative flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                !isLogin ? "text-black" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setIsLogin(false)}
              type="button"
            >
              Sign Up
              {!isLogin && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-md -z-10"
                  layoutId="activeTab"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <form className="space-y-4" onSubmit={handleAuth}>
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <User className="h-5 w-5" />
                      </div>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        className="pl-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder={isLogin ? "Enter your password" : "Create a password"}
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <div className="relative">
                      <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 rounded-md"
                        required
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                      </select>
                    </div>
                  </div>
                )}


                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg py-2.5"
                >
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                {error && (
                  <motion.p
                    className="text-sm text-red-600 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {error}
                  </motion.p>
                )}
              </form>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.p
          className="text-center text-sm text-gray-600 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className={`font-medium ${
              isLogin ? "text-purple-600" : "text-blue-600"
            } hover:underline`}
            type="button"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </motion.p>
      </div>
    </div>
  )
}
