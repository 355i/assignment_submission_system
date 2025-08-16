import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AiTab({ messages, input, setInput, handleAIInputChange, handleAISubmit, isTyping }) {
  return (
    <div className="border rounded-lg p-4 bg-white space-y-4">
      <div className="h-[300px] overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
            {m.role === 'assistant' && (
              <Avatar className="w-6 h-6">
                <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            )}
            <div className={`p-3 rounded-xl shadow-sm ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
              {m.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div className="p-3 rounded-xl shadow-sm bg-gray-100 text-gray-800 italic opacity-70">
              AI is typing...
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleAISubmit} className="flex gap-2">
        <Input value={input} onChange={handleAIInputChange} placeholder="Ask something..." />
        <Button type="submit" className="bg-blue-500 text-white"><Send className="h-4 w-4" /></Button>
      </form>
    </div>
  )
}
