import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">BC</span>
            </div>
            <span className="text-xl font-bold text-primary">BusinessConnect</span>
          </Link>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Organisé par Le Village by CA Luxembourg</p>
        </div>
      </div>
    </div>
  )
}
