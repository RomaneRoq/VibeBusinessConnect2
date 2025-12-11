import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Rocket, Building2, Mail, Lock, Briefcase, ArrowRight, ArrowLeft, Check, Home, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useAuthStore, RegisterData } from '@/store/authStore'
import { toast } from '@/hooks/useToast'
import { SECTOR_LABELS, type Sector } from '@/types'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    type: 'startup',
    name: '',
    sector: 'fintech',
    isVillageNetwork: false
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
        description: 'Bienvenue sur Business Connect. Complétez votre profil pour commencer.',
      })
      navigate('/onboarding')
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Inscription</h1>
        <p className="text-muted-foreground">
          {step === 1 ? 'Choisissez votre type de profil' : 'Créez votre compte Business Connect'}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
          step >= 1 ? "gradient-primary text-white shadow-lg shadow-primary/25" : "bg-muted text-muted-foreground"
        )}>
          {step > 1 ? <Check className="h-5 w-5" /> : "1"}
        </div>
        <div className={cn("w-16 h-1 rounded-full transition-all", step > 1 ? "bg-primary" : "bg-muted")} />
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
          step >= 2 ? "gradient-primary text-white shadow-lg shadow-primary/25" : "bg-muted text-muted-foreground"
        )}>
          2
        </div>
      </div>

      <Card className="border-0 shadow-xl">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'startup' })}
                  className={cn(
                    'p-6 rounded-2xl border-2 text-center transition-all group',
                    formData.type === 'startup'
                      ? 'border-primary bg-gradient-to-br from-blue-500/10 to-cyan-500/10 shadow-lg'
                      : 'border-muted hover:border-primary/30 hover:bg-muted/50'
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all",
                    formData.type === 'startup'
                      ? "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg"
                      : "bg-muted group-hover:bg-muted/80"
                  )}>
                    <Rocket className={cn(
                      'h-7 w-7',
                      formData.type === 'startup' ? 'text-white' : 'text-muted-foreground'
                    )} />
                  </div>
                  <p className="font-bold text-lg">Startup</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Entreprise innovante
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'enterprise' })}
                  className={cn(
                    'p-6 rounded-2xl border-2 text-center transition-all group',
                    formData.type === 'enterprise'
                      ? 'border-primary bg-gradient-to-br from-violet-500/10 to-purple-500/10 shadow-lg'
                      : 'border-muted hover:border-primary/30 hover:bg-muted/50'
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all",
                    formData.type === 'enterprise'
                      ? "bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg"
                      : "bg-muted group-hover:bg-muted/80"
                  )}>
                    <Building2 className={cn(
                      'h-7 w-7',
                      formData.type === 'enterprise' ? 'text-white' : 'text-muted-foreground'
                    )} />
                  </div>
                  <p className="font-bold text-lg">Entreprise</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Groupe ou PME établie
                  </p>
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nom de {formData.type === 'startup' ? 'la startup' : "l'entreprise"}
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder={formData.type === 'startup' ? 'Ma Startup' : 'Mon Entreprise'}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email professionnel</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@entreprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector" className="text-sm font-medium">Secteur d'activité</Label>
                  <Select
                    value={formData.sector}
                    onValueChange={(value) => setFormData({ ...formData, sector: value as Sector })}
                  >
                    <SelectTrigger className="h-11">
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

                {formData.type === 'startup' && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Home className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="village-network" className="text-sm font-medium cursor-pointer">
                          Startup du réseau Village
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Faites-vous partie du réseau des Villages by CA ?
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="village-network"
                      checked={formData.isVillageNetwork}
                      onCheckedChange={(checked) => setFormData({ ...formData, isVillageNetwork: checked })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
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
                  <p className="text-xs text-muted-foreground">
                    Min. 8 caractères, 1 majuscule, 1 chiffre
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
              )}
              <Button type="submit" className="flex-1 h-12 text-base shine" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : step === 1 ? (
                  <>
                    Continuer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Créer mon compte
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Déjà inscrit ?{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold">
                Se connecter
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
