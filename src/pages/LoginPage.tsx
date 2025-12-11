import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
        description: 'Bienvenue sur BusinessConnect !',
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
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Connexion</CardTitle>
        <CardDescription>
          Accédez à votre espace BusinessConnect
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              S'inscrire
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-4 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
          <p className="font-medium mb-1">Mode démo :</p>
          <p>Utilisez n'importe quel email pour vous connecter. Ajoutez "startup" dans l'email pour un profil startup.</p>
        </div>
      </CardContent>
    </Card>
  )
}
