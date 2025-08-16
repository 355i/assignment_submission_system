import { useState } from "react"
import {  XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area } from "recharts"
import { Award, BarChart2, BookOpen, Calendar,  LineChartIcon,  Users } from "lucide-react";
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Sample data
const performanceData = [
  { name: "Quiz 1", average: 68, highest: 92, lowest: 40 },
  { name: "Quiz 2", average: 85, highest: 98, lowest: 55 },
  { name: "Midterm", average: 72, highest: 94, lowest: 45 },
  { name: "Quiz 3", average: 90, highest: 100, lowest: 60 },
  { name: "Quiz 4", average: 78, highest: 97, lowest: 50 },
  { name: "Quiz 5", average: 82, highest: 95, lowest: 48 },
  { name: "Final", average: 88, highest: 99, lowest: 65 }
];

const topicPerformance = [
  { name: "Algebra", score: 85 },
  { name: "Geometry", score: 72 },
  { name: "Calculus", score: 68 },
  { name: "Statistics", score: 90 },
  { name: "Probability", score: 78 },
]

const students = [
  {
    id: 1,
    name: "Emma Thompson",
    grade: "A+",
    score: 92,
    improvement: "+5%",
  },
  {
    id: 2,
    name: "James Wilson",
    grade: "D",
    score: 27,
    improvement: "-3%"
  },
  {
    id: 3,
    name: "Sophia Martinez",
    grade: "A",
    score: 89,
    improvement: "+7%",
  },
  {
    id: 4,
    name: "Liam Johnson",
    grade: "B",
    score: 75,
    improvement: "+10%",
  },
  {
    id: 5,
    name: "Olivia Davis",
    grade: "C",
    score: 64,
    improvement: "-2%",
  },
  {
    id: 6,
    name: "Noah Smith",
    grade: "D",
    score: 45,
    improvement: "+1%",
  },
  {
    id: 7,
    name: "Ava Brown",
    grade: "A",
    score: 85,
    improvement: "+15%",
  },
  {
    id: 8,
    name: "William Miller",
    grade: "B",
    score: 70,
    improvement: "-5%"
  },
]


export default function TeacherDashboard() {
  const [selectedTest, setSelectedTest] = useState("All Tests")

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
    <div className="flex min-h-screen flex-col bg-background w-screen my-10 ">
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Class Performance Dashboard</h2>
            <p className="text-muted-foreground">
              <Calendar className="inline mr-1 h-4 w-4" />
              <span>Spring Semester 2025 - Mathematics 101</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedTest} onValueChange={setSelectedTest}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Test" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Tests">All Tests</SelectItem>
                <SelectItem value="Quiz 1">Quiz 1</SelectItem>
                <SelectItem value="Quiz 2">Quiz 2</SelectItem>
                <SelectItem value="Midterm">Midterm</SelectItem>
                <SelectItem value="Quiz 3">Quiz 3</SelectItem>
                <SelectItem value="Quiz 4">Quiz 4</SelectItem>
                <SelectItem value="Final">Final</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={itemVariants}>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Class Average</CardTitle>
                <Award className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82%</div>
                <p className="text-xs text-muted-foreground">+4% from last semester</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Passing Rate</CardTitle>
                <Users className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">31 out of 33 students</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
                <BarChart2 className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground">Noah Smith - Final Exam</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Improvement</CardTitle>
                <LineChartIcon className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+7.5%</div>
                <p className="text-xs text-muted-foreground">Average improvement rate</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4 md:grid-cols-2"
            >
              <motion.div variants={itemVariants} className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trend</CardTitle>
                    <CardDescription>Average, highest, and lowest scores across all tests</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] overflow-hidden">
                    <ChartContainer
                      config={{
                        average: {
                          label: "Average",
                        },
                        highest: {
                          label: "Highest",
                        },
                        lowest: {
                          label: "Lowest",
                        },
                      }}
                    >
                      <AreaChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3498db" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3498db" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorHighest" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#2ecc71" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorLowest" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#e74c3c" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Area type="monotone" dataKey="average" stroke="var(--chart-1)" fill="url(#colorAverage)" strokeWidth={2} />
                        <Area type="monotone" dataKey="highest" stroke="var(--chart-2)" fill="url(#colorHighest)" strokeWidth={2} />
                        <Area type="monotone" dataKey="lowest" stroke="var(--chart-3)" fill="url(#colorLowest)" strokeWidth={2} />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>

            </motion.div>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
                <CardDescription>Detailed view of individual student performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium">Student</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Grade</th>
                          <th className="h-12 px-4 text-center align-middle font-medium">Score</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Improvement</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {students.map((student) => (
                          <motion.tr
                            key={student.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: student.id * 0.05 }}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                <div>{student.name}</div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <Badge
                                style={{
                                  backgroundColor: student.grade.startsWith("A")
                                    ? "#2ecc71"
                                    : student.grade.startsWith("B")
                                      ? "#3498db"
                                      : student.grade.startsWith("C")
                                        ? "#f39c12"
                                        : "#e74c3c",
                                  color: "#ffffff",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  fontWeight: "bold"
                                }}
                              >
                                {student.grade}
                              </Badge>
                            </td>
                            <td className="align-middle text-center">
                              <div className="flex justify-center items-center gap-2">
                                <div className="relative w-56 h-2 bg-gray-300 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${student.score >= 80
                                      ? "bg-green-500"
                                      : student.score >= 60
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                      }`}
                                    style={{ width: `${student.score}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{student.score}%</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <span className={student.improvement.startsWith("+") ? "text-green-500" : "text-red-500"}>
                                {student.improvement}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics">
            <Card>
              <CardHeader>
                <CardTitle>Topic Analysis</CardTitle>
                <CardDescription>Detailed breakdown of performance by subject area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {topicPerformance.map((topic, index) => (
                    <motion.div
                      key={topic.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen
                            className={`h-4 w-4 ${topic.score >= 80
                              ? "text-green-500"
                              : topic.score >= 70
                                ? "text-yellow-500"
                                : "text-red-500"
                              }`}
                          />
                          <span
                            className={"text-gray-700 text-xl"}
                          >
                            {topic.name}
                          </span>
                        </div>
                        <span
                          className={"text-gray-700"}
                        >
                          {topic.score}%
                        </span>
                      </div>
                      <Progress
                        value={topic.score}
                        className={`h-2 ${topic.score >= 80
                            ? "[&>*]:bg-green-300"
                            : topic.score >= 70
                              ? "[&>*]:bg-blue-300"
                              : "[&>*]:bg-red-300"
                          }`}
                      />
                      <div className="flex justify-between text-xs">
                        <span
                          className={`${topic.score >= 80
                            ? "text-green-600"
                            : topic.score >= 70
                              ? "text-yellow-600"
                              : "text-red-600"
                            }`}
                        >
                          {topic.score >= 80
                            ? "Strength"
                            : topic.score >= 70
                              ? "Satisfactory"
                              : "Needs Improvement"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

