import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { BarChart3, Brain, Home, PenTool, User2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import UserAccountSidebar from "./UserAccountSidebar" // 导入新的侧边栏组件

export default function Navbar() {
  const [hoveredItem, setHoveredItem] = useState(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // 新增：控制侧边栏显示
  const [role, setRole] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setRole(decoded?.role || "student")
        setIsAuthenticated(true)
      } catch (e) {
        console.error("Invalid token", e)
        setRole(null)
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
    window.location.reload()
  }

  // 新增：处理My Account点击
  const handleMyAccountClick = () => {
    setIsUserMenuOpen(false) // 关闭下拉菜单
    setIsSidebarOpen(true) // 打开侧边栏
  }

  // 新增：关闭侧边栏
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
  }

  if (!isAuthenticated) return null

  const navItems = [
    {
      name: "Home",
      href: "/home",
      icon: Home,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      name: "Assign",
      href: "/assignment",
      icon: Brain,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    ...(role === "teacher"
      ? [{
          name: "Create",
          href: "/create",
          icon: PenTool,
          color: "text-blue-500",
          bgColor: "bg-blue-100",
        }]
      : []),
    {
      name: "Dashboard",
      href: role === "teacher" ? "/dash" : "/dashboard",
      icon: BarChart3,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 z-50 w-full border-b bg-transparent backdrop-blur-md"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-blue-500"
            >
              <Link to="/home" className="text-xl font-bold tracking-tighter text-blue-600">
                Smart Learning & Teaching Assistant
              </Link>
            </motion.div>

            {/* Navigation */}
            <div className="hidden space-x-1 md:flex">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredItem(item.name)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Link
                    to={item.href}
                    className={`group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:${item.bgColor}`}
                  >
                    <motion.div
                      animate={{
                        scale: hoveredItem === item.name ? 1.2 : 1,
                        rotate: hoveredItem === item.name ? [0, -10, 10, -10, 0] : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </motion.div>
                    <span>{item.name}</span>
                    {hoveredItem === item.name && (
                      <motion.div
                        layoutId="navHighlight"
                        className={`absolute inset-0 -z-10 rounded-lg ${item.bgColor} opacity-50`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* User Menu */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <DropdownMenu onOpenChange={setIsUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 rounded-full p-0 relative" aria-label="User menu">
                    <motion.div
                      animate={{
                        rotate: isUserMenuOpen ? 360 : 0,
                        scale: isUserMenuOpen ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <User2 className="h-5 w-5 text-pink-600" />
                    </motion.div>
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          className="absolute -inset-1 rounded-full border-2 border-pink-200"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                        />
                      )}
                    </AnimatePresence>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                      My Account
                    </motion.div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* 修改：My Account点击事件 */}
                  <DropdownMenuItem onSelect={handleMyAccountClick}>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="w-full text-gray-700"
                    >
                      My Account
                    </motion.div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout}>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="w-full text-red-600"
                    >
                      Log out
                    </motion.div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* 用户账户侧边栏 */}
      <UserAccountSidebar 
        isOpen={isSidebarOpen} 
        onClose={handleCloseSidebar} 
      />
    </>
  )
}