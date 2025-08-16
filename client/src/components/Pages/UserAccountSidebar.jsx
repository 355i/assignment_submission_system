import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, Camera, Save, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { jwtDecode } from "jwt-decode"

export default function UserAccountSidebar({ isOpen, onClose }) {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    id: "",
    name: "",
    email: "",
    avatar: null,
    signature: ""
  })
  const [editedInfo, setEditedInfo] = useState({})
  const [loading, setLoading] = useState(false)

  // 从token获取用户信息并获取完整数据
  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const decoded = jwtDecode(token)
          console.log("🔍 Token decoded:", decoded)
          
          const initialUserInfo = {
            id: decoded.id,
            name: decoded.name || "",
            email: decoded.email || "",
            avatar: null,
            signature: ""
          }
          
          setUserInfo(initialUserInfo)
          setEditedInfo(initialUserInfo)
          
          // 获取完整用户信息
          fetchUserDetails(decoded.id, token)
        } catch (e) {
          console.error("❌ Token decode error:", e)
          alert("Session expired. Please log in again.")
          localStorage.removeItem("token")
          onClose()
        }
      } else {
        console.error("❌ No token found")
        alert("Please log in first.")
        onClose()
      }
    }
  }, [isOpen, onClose])

  // 获取用户完整信息
  const fetchUserDetails = async (userId, token) => {
    try {
      console.log("📡 Fetching user details for ID:", userId)
      
      const response = await fetch(`http://localhost:1000/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log("📡 API Response status:", response.status)
      
      if (response.ok) {
        const userData = await response.json()
        console.log("✅ User data received:", userData)
        
        const updatedUserInfo = {
          id: userData.id,
          name: userData.name || "",
          email: userData.email || "",
          avatar: userData.avatar,
          signature: userData.signature || ""
        }
        
        setUserInfo(updatedUserInfo)
        setEditedInfo(updatedUserInfo)
      } else {
        const errorText = await response.text()
        console.error("❌ API Error:", response.status, errorText)
        
        if (response.status === 401) {
          alert("Session expired. Please log in again.")
          localStorage.removeItem("token")
          onClose()
        } else {
          alert(`Failed to load user data: ${errorText}`)
        }
      }
    } catch (error) {
      console.error("❌ Fetch error:", error)
      alert("Failed to load user data. Please check your connection.")
    }
  }

  // 处理头像上传
  const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.')
        return
      }
      
      // 验证文件大小 (限制为 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB.')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedInfo(prev => ({
          ...prev,
          avatar: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // 处理输入改变
  const handleInputChange = (field, value) => {
    setEditedInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 保存用户信息
  const handleSave = async () => {
    if (!editedInfo.name || editedInfo.name.trim().length === 0) {
      alert("Name cannot be empty.")
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      console.log("💾 Saving user info:", {
        name: editedInfo.name,
        signature: editedInfo.signature,
        avatar: editedInfo.avatar ? "Image data present" : null
      })
      
      const response = await fetch(`http://localhost:1000/api/users/${userInfo.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editedInfo.name.trim(),
          signature: editedInfo.signature || "",
          avatar: editedInfo.avatar
        })
      })

      console.log("💾 Save response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Save successful:", result)
        
        // 更新本地状态
        setUserInfo(editedInfo)
        setIsEditing(false)
        
        // 如果返回了新的token，更新localStorage
        if (result.token) {
          localStorage.setItem("token", result.token)
        }
        
        alert("Profile updated successfully!")
      } else {
        const errorText = await response.text()
        console.error("❌ Save error:", response.status, errorText)
        throw new Error(errorText || "Failed to update profile")
      }
    } catch (error) {
      console.error("❌ Save error:", error)
      alert(`Failed to update profile: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // 取消编辑
  const handleCancel = () => {
    setEditedInfo(userInfo)
    setIsEditing(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
          />
          
          {/* 侧边栏 */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">My Account</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* 内容区域 */}
            <div className="p-6 space-y-6">
              {/* 用户头像 */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
                    {(isEditing ? editedInfo.avatar : userInfo.avatar) ? (
                      <img
                        src={isEditing ? editedInfo.avatar : userInfo.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
                      <Camera className="h-4 w-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* 用户信息 */}
              <div className="space-y-4">
                {/* 姓名 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Name:</Label>
                  {isEditing ? (
                    <Input
                      value={editedInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-2 rounded border">
                      {userInfo.name || "No name set"}
                    </p>
                  )}
                </div>

                {/* 个人签名 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Your Signature</Label>
                  <p className="text-xs text-gray-500">let everyone know YOU!</p>
                  {isEditing ? (
                    <Textarea
                      value={editedInfo.signature}
                      onChange={(e) => handleInputChange('signature', e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="w-full h-20 resize-none"
                      maxLength={200}
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded border min-h-[60px]">
                      <p className="text-gray-700 text-sm">
                        {userInfo.signature || "No signature yet..."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="pt-4 border-t">
                {isEditing ? (
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1"
                      disabled={loading}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Edit your profile
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}