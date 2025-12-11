import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, ArrowLeft, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useMessagesStore } from '@/store/messagesStore'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

function ConversationList({ onSelect }: { onSelect: (id: string) => void }) {
  const { conversations, activeConversationId, setActiveConversation } = useMessagesStore()

  return (
    <div className="space-y-2">
      {conversations.length > 0 ? (
        conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => {
              setActiveConversation(conv.id)
              onSelect(conv.id)
            }}
            className={cn(
              'w-full p-3 rounded-lg text-left transition-colors',
              activeConversationId === conv.id
                ? 'bg-primary text-white'
                : 'hover:bg-muted'
            )}
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={conv.participant.logo} />
                <AvatarFallback>
                  {conv.participant.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium truncate">{conv.participant.name}</p>
                  {conv.unreadCount > 0 && (
                    <Badge variant={activeConversationId === conv.id ? 'secondary' : 'destructive'}>
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
                {conv.lastMessage && (
                  <p className={cn(
                    'text-sm truncate',
                    activeConversationId === conv.id
                      ? 'text-white/70'
                      : 'text-muted-foreground'
                  )}>
                    {conv.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucune conversation</p>
        </div>
      )}
    </div>
  )
}

function ConversationView({ conversationId, onBack }: { conversationId: string; onBack: () => void }) {
  const [message, setMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const { conversations, getConversationMessages, sendMessage, markAsRead } = useMessagesStore()

  const conversation = conversations.find(c => c.id === conversationId)
  const messages = getConversationMessages(conversationId)

  useEffect(() => {
    markAsRead(conversationId)
  }, [conversationId, markAsRead])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    sendMessage(conversationId, message.trim())
    setMessage('')
  }

  if (!conversation) return null

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarImage src={conversation.participant.logo} />
          <AvatarFallback>
            {conversation.participant.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{conversation.participant.name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {conversation.participant.type === 'startup' ? 'Startup' : 'Entreprise'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => {
            const isOwn = msg.senderId === 'current-user'
            return (
              <div
                key={msg.id}
                className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[70%] rounded-lg px-4 py-2',
                    isOwn
                      ? 'bg-primary text-white'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={cn(
                    'text-xs mt-1',
                    isOwn ? 'text-white/70' : 'text-muted-foreground'
                  )}>
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: fr })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function Messages() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { activeConversationId, setActiveConversation, conversations } = useMessagesStore()
  const [mobileView, setMobileView] = useState<'list' | 'conversation'>('list')

  useEffect(() => {
    if (id) {
      const conv = conversations.find(c => c.id === id || c.participantId === id)
      if (conv) {
        setActiveConversation(conv.id)
        setMobileView('conversation')
      }
    }
  }, [id, conversations, setActiveConversation])

  const handleSelectConversation = (convId: string) => {
    setActiveConversation(convId)
    setMobileView('conversation')
    navigate(`/messages/${convId}`)
  }

  const handleBack = () => {
    setMobileView('list')
    navigate('/messages')
  }

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)]">
      <Card className="h-full">
        <CardContent className="p-0 h-full">
          <div className="flex h-full">
            {/* Conversation list - hidden on mobile when viewing conversation */}
            <div className={cn(
              'w-full lg:w-80 border-r h-full overflow-y-auto',
              mobileView === 'conversation' && 'hidden lg:block'
            )}>
              <div className="p-4 border-b">
                <h2 className="font-semibold">Messages</h2>
              </div>
              <div className="p-2">
                <ConversationList onSelect={handleSelectConversation} />
              </div>
            </div>

            {/* Conversation view */}
            <div className={cn(
              'flex-1 h-full',
              mobileView === 'list' && 'hidden lg:flex'
            )}>
              {activeConversationId ? (
                <ConversationView
                  conversationId={activeConversationId}
                  onBack={handleBack}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                    <p>Sélectionnez une conversation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
