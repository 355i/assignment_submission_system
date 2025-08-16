import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Upload, Brain, Sparkles, Pencil, Download } from "lucide-react"

import InfoTab from "../Section/InfoTab"
import UploadTab from "../Section/UploadTab"
import AiTab from "../Section/AiTab"
import GradeTab from "../Section/GradeTab"

export default function AssignmentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [assignment, setAssignment] = useState(null)       // 服务器数据
  const [editAssignment, setEditAssignment] = useState(null) // 编辑数据
  const [isEditing, setIsEditing] = useState(false)

  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your smart assistant. How can I help you understand this assignment?" }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState("")

  const [activeTab, setActiveTab] = useState("info")
  const [grade, setGrade] = useState("")
  const [feedback, setFeedback] = useState("")
  const [gradedAt, setGradedAt] = useState(null)
  const [graderName, setGraderName] = useState("")


  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:1000/assignment/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Failed to fetch assignment: ${res.status} - ${errText}`)
      }

      const data = await res.json()
      console.log("Fetched assignment data:", data)

      setAssignment({
        id: data.id,
        title: data.title,
        description: data.description?.content || "",
        rubric: data.marking_rubric || "",
        course_id: data.course_id,
        year: data.year ?? "",
        semester: data.semester ?? "",
        createdBy: data.created_by,
        dueDate: data.due_date ?? "",
        releaseDate: data.release_date ?? "",
        faqPath: data.faq_file_path || null,
        detailPath: data.detail_file_path || null,
        hasDetail: data.has_detail ?? false,
        canEdit: data.can_edit ?? false,
        time: data.time ?? null,
      })

    } catch (err) {
      console.error("Error fetching assignment:", err)
      alert(`Error fetching assignment: ${err.message}`)
    }
  }
  // 拉取数据
  useEffect(() => {

    fetchAssignment()
  }, [id])

  // 开始编辑 - 用 assignment 拷贝初始化 editAssignment
  const startEditing = () => {
    setEditAssignment({ ...assignment })
    setIsEditing(true)
  }

  // 取消编辑
  const cancelEditing = () => {
    setEditAssignment(null)
    setIsEditing(false)
  }

  // 编辑内容变更，field为属性名
  const handleEditChange = (field, value) => {
    setEditAssignment(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 保存编辑
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData();
      formData.append("title", editAssignment.title);
      formData.append("description", editAssignment.description);
      formData.append("marking_rubric", editAssignment.rubric);
      if (editAssignment.release_date) {
        formData.append("release_date", new Date(editAssignment.release_date).toISOString());
      }
      if (editAssignment.due_date) {
        formData.append("due_date", new Date(editAssignment.due_date).toISOString());
      }
      if (editAssignment.faqFile) {
        formData.append("faq", editAssignment.faqFile);
      }
      if (editAssignment.detailFile) {
        formData.append("detail", editAssignment.detailFile);
      }

      const res = await fetch(`http://localhost:1000/assignment/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // 注意：不要设置 Content-Type，浏览器会自动加
        },
        body: formData,
      });


      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Failed to save: ${res.status} - ${errText}`)
      }

      // 更新主数据并退出编辑
      // setAssignment(editAssignment)
      fetchAssignment()
      setEditAssignment(null)
      setIsEditing(false)
    } catch (err) {
      console.error("Error updating assignment:", err)
      alert("Failed to save changes.")
    }
  }

  // AI 输入处理示例
  const handleAIInputChange = (e) => setInput(e.target.value)

  const handleAISubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant',
        content: `You asked: "${input}". Here is some advice!`
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 800)
  }

  // 文件上传示例
  const handleFileUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      setUploadStatus("Please select a file.")
      return
    }

    const token = localStorage.getItem("token")
    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("assignment_id", id)

    try {
      const res = await fetch("http://localhost:1000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Upload failed: ${res.status} - ${errText}`)
      }

      setUploadStatus("Uploaded successfully!")
    } catch (err) {
      console.error("Upload error:", err)
      setUploadStatus("Upload failed.")
    }
  }

  if (!assignment) return <div>Loading...</div>

  return (
    <Card className="w-screen border-none shadow-2xl bg-white/90 backdrop-blur-md mt-10 p-10">
      <CardHeader className="bg-gradient-to-r from-blue-600 via-white-600 to-blue-500 text-white rounded-t-lg relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div className="absolute w-40 h-40 rounded-full bg-white/10"
            animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            style={{ top: -20, right: -20 }} />
          <motion.div className="absolute w-20 h-20 rounded-full bg-white/10"
            animate={{ x: [0, -50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            style={{ bottom: -10, left: 100 }} />
        </div>

        <div className="flex justify-between items-center relative z-10">
          <div>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-300" /> {assignment.title}
              </CardTitle>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <CardDescription className="text-white/90 text-sm">
                Created by: {assignment.createdBy}
              </CardDescription>
            </motion.div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="secondary" className="gap-2 bg-white/20 text-white border border-white/30"
              onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Back
            </Button>
          </motion.div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs defaultValue="info" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8 p-1 bg-gray-100/80">
            <TabsTrigger value="info" className="py-3 text-l">
              <BookOpen className="h-5 w-5 mr-1" /> Info
            </TabsTrigger>
            <TabsTrigger value="upload" className="py-3 text-l">
              <Upload className="h-5 w-5 mr-1" /> Upload
            </TabsTrigger>
            <TabsTrigger value="ai" className="py-3 text-l">
              <Brain className="h-5 w-5 mr-1" /> AI Assistant
            </TabsTrigger>
            <TabsTrigger value="grade" className="py-3 text-l">
              <Sparkles className="h-5 w-5 mr-1" /> Grade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <AnimatePresence mode="wait">
              {activeTab === "info" && (
                <motion.div key="info" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <InfoTab
                    assignment={assignment}
                    editAssignment={editAssignment}
                    setEditAssignment={setEditAssignment}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    handleSave={handleSave}
                  />

                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="upload">
            <AnimatePresence mode="wait">
              {activeTab === "upload" && (
                <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <UploadTab
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    uploadStatus={uploadStatus}
                    handleFileUpload={handleFileUpload}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="ai">
            <AnimatePresence mode="wait">
              {activeTab === "ai" && (
                <motion.div key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <AiTab
                    messages={messages}
                    input={input}
                    setInput={setInput}
                    handleAIInputChange={handleAIInputChange}
                    handleAISubmit={handleAISubmit}
                    isTyping={isTyping}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="grade">
            <AnimatePresence mode="wait">
              {activeTab === "grade" && (
                <motion.div key="grade" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <GradeTab
                    grade={grade}
                    setGrade={setGrade}
                    feedback={feedback}
                    setFeedback={setFeedback}
                    gradedAt={gradedAt}
                    graderName={graderName}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
