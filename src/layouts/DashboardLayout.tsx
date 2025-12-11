import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import ChatBot from '@/components/shared/ChatBot'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main content */}
      <div className="lg:pl-72">
        <Header />

        <main className="p-4 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom Nav - Mobile */}
      <BottomNav />

      {/* ChatBot */}
      <ChatBot />
    </div>
  )
}
