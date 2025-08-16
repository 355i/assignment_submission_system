import { useState, useEffect } from "react"
import { Area, Bar, CartesianGrid, Cell, Legend, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart as RechartsRadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart as RechartsBarChart } from "recharts"; 
import { Activity, Award, BookOpen, Brain, Flame, LineChart, Lightbulb, BarChart2, PieChart, Target, TrendingUp, Rocket, Star, Trophy, Calendar, AlertCircle, BarChart, Sparkles, Atom } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [progressValues, setProgressValues] = useState({
    overall: 0,
    trigonometry: 0,
    chemical: 0,
    essay: 0,
  })

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)

      // Animate progress bars
      setProgressValues({
        overall: 87,
        trigonometry: 65,
        chemical: 68,
        essay: 72,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Mock data for the student
  const studentData = {
    upcomingTests: [
      { subject: "Mathematics", topic: "Calculus", date: "Aug 15", icon: <Atom className="h-5 w-5 text-indigo-500" /> },
      { subject: "Science", topic: "Physics", date: "Aug 18", icon: <Rocket className="h-5 w-5 text-blue-500" /> },
      { subject: "Science", topic: "Physics", date: "Aug 18", icon: <Rocket className="h-5 w-5 text-blue-500" /> },

      {
        subject: "English",
        topic: "Literature",
        date: "Aug 22",
        icon: <BookOpen className="h-5 w-5 text-emerald-500" />,
      },
    ],
    improvementData: [
      { name: "Improved", value: 3, color: "#10b981" },
      { name: "Stable", value: 1, color: "#6366f1" },
      { name: "Needs Work", value: 1, color: "#f43f5e" },
    ],
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded-md shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color || entry.stroke }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="flex min-h-screen py-16 w-screen flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <main className="flex-1 p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card className="w-full border-slate-200 bg-white shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Calendar className="h-5 w-5 text-blue-500" />
                Upcoming Tests & Preparation
              </CardTitle>
              <CardDescription className="text-slate-500">Stay prepared for your upcoming assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {studentData.upcomingTests.map((test, index) => (
                  <motion.div
                    key={index}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      transition: { duration: 0.2 },
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.6 + index * 0.1 },
                    }}
                  >
                    <Card className="bg-white border-slate-200 overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                            {test.date}
                          </Badge>
                          <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                            {test.icon}
                          </motion.div>
                        </div>
                        <CardTitle className="text-base mt-2 text-slate-800">{test.subject}</CardTitle>
                        <CardDescription className="text-slate-500">{test.topic}</CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Study Materials
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
    
  )
}

