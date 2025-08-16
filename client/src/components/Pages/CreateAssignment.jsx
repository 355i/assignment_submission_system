import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Manual from "@/components/Helper/Manual"
import { PlusCircle, Brain, List, Save, Sparkles, Palette, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import AIAssistant from "@/components/Helper/AIQuestion"

export default function CreateQuiz() {
  const [questions, setQuestions] = useState([])
  const [quizTitle, setQuizTitle] = useState("New Quiz")
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeTab, setActiveTab] = useState("manual")

  const addQuestion = (question) => {
    setQuestions([...questions, question])
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  const floatingIcons = [
    { icon: <Sparkles className="text-blue-400" />, delay: 0 },
    { icon: <Brain className="text-blue-400" />, delay: 1.5 },
    { icon: <Wand2 className="text-blue-400" />, delay: 3 },
    { icon: <Palette className="text-blue-400" />, delay: 4.5 },
  ]

  return (
    <><Card className="w-screen border-none shadow-2xl bg-white/90 backdrop-blur-md mt-10 p-20">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-white-600 to-blue-500 text-white rounded-t-lg relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute w-40 h-40 rounded-full bg-white/10"
                animate={{
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 15,
                  ease: "easeInOut",
                }}
                style={{ top: -20, right: -20 }}
              />
              <motion.div
                className="absolute w-20 h-20 rounded-full bg-white/10"
                animate={{
                  x: [0, -50, 0],
                  y: [0, 30, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 10,
                  ease: "easeInOut",
                }}
                style={{ bottom: -10, left: 100 }}
              />
            </div>

            <div className="flex justify-between items-center relative z-10">
              <div>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-yellow-300" />
                    Assignment Creator
                  </CardTitle>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <CardDescription className="text-white/90 text-sm">
                    Create engaging Assignments for your students
                  </CardDescription>
                </motion.div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  variant="secondary"
                  className="gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
                >
                  <Save size={18} />
                  Save Assignment
                </Button>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="manual" className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4 p-1 bg-gray-100/80">
                <TabsTrigger
                  value="manual"
                  className="text-l py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all duration-300"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Manual Creation
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="text-l py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-white-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
                >
                  <Brain className="mr-2 h-5 w-5" />
                  AI-Assisted
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="manual" className="mt-0">
                    <Manual onAddQuestion={addQuestion} />
                  </TabsContent>
                  <TabsContent value="ai" className="mt-0">
                    <AIAssistant onAddQuestion={addQuestion} />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>

          </CardContent>
        </Card>
    </>
  )
}

