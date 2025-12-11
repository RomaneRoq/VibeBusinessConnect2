import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Rocket, Building2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useAuthStore, RegisterData } from '@/store/authStore'
import { toast } from '@/hooks/useToast'
import { SECTOR_LABELS, type ParticipantType, type Sector } from '@/types'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    type: 'startup',
    name: '',
    sector: 'fintech'
  })
  const [confirmPassword, setConfirmPassword] = useState('')

  const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    return hasMinLength && hasUppercase && hasNumber
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      if (!formData.type) {
        toast({
          title: 'Erreur',
          description: 'Veuillez sélectionner un type de profil.',
          variant: 'destructive'
        })
        return
      }
      setStep(2)
      return
    }

    // Validate form
    if (!formData.email || !formData.password || !formData.name || !formData.sector) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires.',
        variant: 'destructive'
      })
      return
    }

    if (!validatePassword(formData.password)) {
      toast({
        title: 'Mot de passe invalide',
        description: 'Le mot de passe doit contenir au moins 8 caractères, 1 majuscule et 1 chiffre.',
        variant: 'destructive'
      })
      return
    }

    if (formData.password !== confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas.',
        variant: 'destructive'
      })
      return
    }

    const success = await register(formData)

    if (success) {
      toast({
        title: 'Compte créé !',
        description: 'Bienvenue sur BusinessConnect. Complétez votre profil pour commencer.',
      })
      navigate('/onboarding')
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Inscription</CardTitle>
        <CardDescription>
          {step === 1 ? 'Choisissez votre type de profil' : 'Créez votre compte'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'startup' })}
                className={cn(
                  'p-6 rounded-lg border-2 text-center transition-all',
                  formData.type === 'startup'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <Rocket className={cn(
                  'h-8 w-8 mx-auto mb-3',
                  formData.type === 'startup' ? 'text-primary' : 'text-gray-400'
                )} />
                <p className="font-semibold">Startup</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Entreprise innovante
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'enterprise' })}
                className={cn(
                  'p-6 rounded-lg border-2 text-center transition-all',
                  formData.type === 'enterprise'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <Building2 className={cn(
                  'h-8 w-8 mx-auto mb-3',
                  formData.type === 'enterprise' ? 'text-primary' : 'text-gray-400'
                )} />
                <p className="font-semibold">Entreprise</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Groupe ou PME établie
                </p>
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nom de {formData.type === 'startup' ? 'la startup' : "l'entreprise"} *
                </Label>
                <Input
                  id="name"
                  placeholder={formData.type === 'startup' ? 'Ma Startup' : 'Mon Entreprise'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@entreprise.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Secteur d'activité *</Label>
                <Select
                  value={formData.sector}
                  onValueChange={(value) => setFormData({ ...formData, sector: value as Sector })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SECTOR_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Min. 8 caractères, 1 majuscule, 1 chiffre
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="flex gap-2">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Retour
              </Button>
            )}
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : step === 1 ? (
                'Continuer'
              ) : (
                'Créer mon compte'
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
