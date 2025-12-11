import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'
import { toast } from '@/hooks/useToast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs.',
        variant: 'destructive'
      })
      return
    }

    const success = await login(formData.email, formData.password)

    if (success) {
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue sur Business Connect !',
        variant: 'default'
      })
      navigate('/dashboard')
    } else {
      toast({
        title: 'Erreur',
        description: 'Email ou mot de passe incorrect.',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Connexion</h1>
        <p className="text-muted-foreground">
          Accédez à votre espace Business Connect
        </p>
      </div>

      <Card className="border-0 shadow-xl">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
                <a href="#" className="text-xs text-primary hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-11"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base shine" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-primary hover:underline font-semibold">
                S'inscrire
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Demo hint */}
      <Card className="border-0 bg-muted/50">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Mode démo :</span> Utilisez n'importe quel email pour vous connecter.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Ajoutez "startup" dans l'email pour un profil startup.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
