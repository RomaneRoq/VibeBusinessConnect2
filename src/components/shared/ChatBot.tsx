import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useChatbotStore } from '@/store/chatbotStore'

export default function ChatBot() {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const { isOpen, messages, toggleChat, sendMessage } = useChatbotStore()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    sendMessage(input.trim())
    setInput('')
  }

  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className={cn(
          'fixed bottom-20 lg:bottom-6 right-4 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105',
          isOpen && 'scale-0'
        )}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat window */}
      <div
        className={cn(
          'fixed bottom-20 lg:bottom-6 right-4 z-50 w-[calc(100%-2rem)] max-w-sm bg-white rounded-lg shadow-xl border transition-all duration-200',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-primary text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Assistant</h3>
              <p className="text-xs text-white/80">En ligne</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleChat}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-80" ref={scrollRef}>
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.isBot ? 'justify-start' : 'justify-end'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                    message.isBot
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-primary text-white'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
