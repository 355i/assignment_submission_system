import { motion } from "framer-motion"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UploadTab({ selectedFile, setSelectedFile, uploadStatus, handleFileUpload }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
        <Upload className="h-5 w-5 text-green-500" /> Submit Your Work
      </h2>

      <div className="border-2 border-dashed border-green-300 rounded-xl p-8 bg-green-50/30 hover:bg-green-50/50 transition-all duration-300 text-center">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Upload className="h-10 w-10 text-green-400" />
          </motion.div>
          <p className="text-sm text-green-700">
            Drag & drop your file here, or click below
          </p>

          <input
            type="file"
            id="fileUpload"
            hidden
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />

          <Button
            type="button"
            onClick={() => document.getElementById("fileUpload").click()}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            Choose File
          </Button>

          {selectedFile && (
            <div className="mt-2 text-sm text-green-700">
              Selected: <strong>{selectedFile.name}</strong>
            </div>
          )}

          <Button
            type="button"
            onClick={handleFileUpload}
            className="mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
          >
            Upload Now
          </Button>

          {uploadStatus && (
            <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
