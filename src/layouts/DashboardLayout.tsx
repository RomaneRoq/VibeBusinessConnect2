import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import ChatBot from '@/components/shared/ChatBot'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main content */}
      <div className="lg:pl-64">
        <Header />

        <main className="p-4 lg:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom Nav - Mobile */}
      <BottomNav />

      {/* ChatBot */}
      <ChatBot />
    </div>
  )
}
