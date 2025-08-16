import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"
import { jwtDecode } from 'jwt-decode';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, CheckCircle } from "lucide-react"
import { Upload } from 'lucide-react';


export default function Manual() {
  const [title, setTitle] = useState("")
  const [course, setCourse] = useState("")
  const [year, setYear] = useState("")
  const [semester, setSemester] = useState("")
  const [description, setDescription] = useState("")
  const [rubric, setRubric] = useState("")
  const [createdBy, setCreatedBy] = useState(null)
  const [releaseDate, setReleaseDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [faqFile, setFaqFile] = useState(null);
  const [detailFile, setDetailFile] = useState(null);

  const faqInputRef = useRef(null);
  const detailInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setCreatedBy(decoded?.id)
      } catch (e) {
        console.error("Invalid token", e)
      }
    }
    // Set default year to current year
    const currentYear = new Date().getFullYear()
    setYear(currentYear.toString())
  }, [])

  const handleSubmitAssignment = async () => {
    const token = localStorage.getItem("token");

    if (!title || !course || !year || !semester || !description || !rubric) {
      alert("请填写所有必填字段");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("course_name", course);
      formData.append("year", year);
      formData.append("semester", semester);
      formData.append("description", description);
      formData.append("marking_rubric", rubric);
      if (releaseDate) formData.append("release_date", new Date(releaseDate).toISOString());
      if (dueDate) formData.append("due_date", new Date(dueDate).toISOString());
      if (faqFile) formData.append("faq", faqFile);
      if (detailFile) formData.append("detail", detailFile);

      const response = await fetch("http://localhost:1000/assignment", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Content-Type 不设置，浏览器会自动加 multipart/form-data
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData?.error || `HTTP ${response.status} ${response.statusText}`;
        throw new Error(message);
      }

      const data = await response.json();
      alert("Assignment created successfully!");
      console.log(data);

      // 重置表单
      setTitle("");
      setCourse("");
      setYear("");
      setSemester("");
      setDescription("");
      setRubric("");
      setReleaseDate("");
      setDueDate("");
      setFaqFile(null);
      setDetailFile(null);
      if (faqInputRef.current) faqInputRef.current.value = "";
      if (detailInputRef.current) detailInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      alert("Error creating assignment: " + error.message);
    }
  };

  const isFormValid = title && course && year && semester && description && rubric;


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label className="text-l font-medium flex items-center gap-3">
          <Sparkles className="h-5 w-4 text-blue-500" />
          Title
        </Label>
        <Input placeholder="e.g., Group Project Milestone 1" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      {/* Course / Year / Semester */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label>Course</Label>
          <Input
            type="text"
            placeholder="e.g., COMP9900"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </div>

        <div>
          <Label>Year</Label>
          <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g., 2025" />
        </div>

        <div>
          <Label>Semester</Label>
          <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full rounded-md p-2 border">
            <option value="">Select semester</option>
            <option value="T0">T0</option>
            <option value="T1">T1</option>
            <option value="T2">T2</option>
            <option value="T3">T3</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label className="text-l font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          Description
        </Label>
        <Textarea
          rows={6}
          placeholder="Enter structured assignment description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Rubric */}
      <div className="space-y-2">
        <Label className="text-l font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-green-500" />
          Marking Rubric
        </Label>
        <Textarea
          rows={4}
          placeholder="Outline how the assignment will be assessed"
          value={rubric}
          onChange={(e) => setRubric(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Release Date</Label>
          <Input
            type="datetime-local"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </div>
        <div>
          <Label>Due Date</Label>
          <Input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      {/* FAQ 文件上传 */}
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
        <Label className="block text-lg font-medium mb-2">Upload FAQ CSV</Label>
        <div className="flex items-center gap-4">
          <Upload className="w-6 h-6 text-blue-500" />
          <button
            type="button"
            onClick={() => faqInputRef.current?.click()}
            className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition"
          >
            Choose File
          </button>
          <input
            type="file"
            accept=".csv"
            ref={faqInputRef}
            onChange={(e) => setFaqFile(e.target.files?.[0])}
            className="hidden"
          />
        </div>
        {faqFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected file: {faqFile.name}
          </p>
        )}
      </div>

      {/* Detail 文件上传 */}
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-200 mt-4">
        <Label className="block text-lg font-medium mb-2">Upload Detail PDF</Label>
        <div className="flex items-center gap-4">
          <Upload className="w-6 h-6 text-purple-500" />
          <button
            type="button"
            onClick={() => detailInputRef.current?.click()}
            className="text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full transition"
          >
            Choose File
          </button>
          <input
            type="file"
            accept="application/pdf"
            ref={detailInputRef}
            onChange={(e) => setDetailFile(e.target.files?.[0])}
            className="hidden"
          />
        </div>
        {detailFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected file: {detailFile.name}
          </p>
        )}
      </div>

      {/* Submit */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
        <Button
          onClick={handleSubmitAssignment}
          disabled={!isFormValid}
          className="w-full py-6 text-l gap-2 bg-gradient-to-r from-green-500 via-lime-500 to-emerald-500"
        >
          <CheckCircle className="h-5 w-5" />
          Submit Assignment
        </Button>
      </motion.div>
    </motion.div >
  )
}
