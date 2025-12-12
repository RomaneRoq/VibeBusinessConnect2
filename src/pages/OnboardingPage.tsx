import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { toast } from '@/hooks/useToast'
import { STAGE_LABELS, PARTNERSHIP_LABELS, type StartupStage, type PartnershipType } from '@/types'

const steps = [
  { id: 1, title: 'Bienvenue', description: 'Découvrez BusinessConnect' },
  { id: 2, title: 'Profil', description: 'Présentez votre entreprise' },
  { id: 3, title: 'Détails', description: 'Informations complémentaires' },
  { id: 4, title: 'Objectifs', description: 'Ce que vous recherchez' },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, updateProfile, completeOnboarding } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    pitch: user?.participant.pitch || '',
    description: user?.participant.description || '',
    website: user?.participant.website || '',
    linkedIn: user?.participant.linkedIn || '',
    stage: user?.participant.stage || 'seed' as StartupStage,
    teamSize: user?.participant.teamSize || 5,
    annualRevenue: user?.participant.annualRevenue || '',
    fundingRaised: user?.participant.fundingRaised || '',
    employeeCount: user?.participant.employeeCount || '50-100',
    innovationBudget: user?.participant.innovationBudget || '',
    lookingFor: user?.participant.lookingFor || [] as PartnershipType[],
    thematicsInterest: user?.participant.thematicsInterest || [] as string[]
  })

  const isStartup = user?.participant.type === 'startup'

  const thematicOptions = [
    'Paiements', 'Blockchain', 'IA & Machine Learning', 'Conformité',
    'Cybersécurité', 'Open Banking', 'Assurance', 'Crédit',
    'Wealth Management', 'ESG', 'Data Analytics', 'RegTech'
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    updateProfile(formData)
    completeOnboarding()

    toast({
      title: 'Profil complété !',
      description: 'Vous pouvez maintenant explorer les participants.',
    })

    navigate('/dashboard')
  }

  const toggleLookingFor = (type: PartnershipType) => {
    setFormData(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(type)
        ? prev.lookingFor.filter(t => t !== type)
        : [...prev.lookingFor, type]
    }))
  }

  const toggleThematic = (thematic: string) => {
    setFormData(prev => ({
      ...prev,
      thematicsInterest: prev.thematicsInterest.includes(thematic)
        ? prev.thematicsInterest.filter(t => t !== thematic)
        : [...prev.thematicsInterest, thematic]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                    currentStep > step.id
                      ? 'bg-success text-white'
                      : currentStep === step.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                  )}
                >
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-1 w-12 lg:w-24 mx-2',
                      currentStep > step.id ? 'bg-success' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="font-medium">{steps[currentStep - 1].title}</p>
            <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-6">
            {currentStep === 1 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">BC</span>
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  Bienvenue, {user?.participant.name} !
                </h2>
                <p className="text-muted-foreground mb-6">
                  En quelques étapes, complétez votre profil pour maximiser vos opportunités de rencontres lors de l'événement Fintech & Regtech Connect.
                </p>
                <div className="bg-muted rounded-lg p-4 text-left text-sm">
                  <p className="font-medium mb-2">Ce qui vous attend :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Présentez votre {isStartup ? 'startup' : 'entreprise'}</li>
                    <li>• Ajoutez des informations clés</li>
                    <li>• Définissez vos objectifs de networking</li>
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pitch">Pitch court *</Label>
                  <Textarea
                    id="pitch"
                    placeholder="Décrivez votre activité en une phrase percutante..."
                    value={formData.pitch}
                    onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.pitch.length}/200
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description détaillée</Label>
                  <Textarea
                    id="description"
                    placeholder="Présentez votre entreprise plus en détail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      placeholder="https://..."
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedIn">LinkedIn</Label>
                    <Input
                      id="linkedIn"
                      placeholder="https://linkedin.com/..."
                      value={formData.linkedIn}
                      onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                {isStartup ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="stage">Stade de développement</Label>
                      <Select
                        value={formData.stage}
                        onValueChange={(value) => setFormData({ ...formData, stage: value as StartupStage })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STAGE_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="teamSize">Taille de l'équipe</Label>
                        <Input
                          id="teamSize"
                          type="number"
                          value={formData.teamSize}
                          onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="annualRevenue">Chiffre d'affaires</Label>
                        <Input
                          id="annualRevenue"
                          placeholder="Ex: 200K€"
                          value={formData.annualRevenue}
                          onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                        />
                      </div>
                    </div>
                    {formData.stage !== 'bootstrap' && (
                      <div className="space-y-2">
                        <Label htmlFor="fundingRaised">Fonds levés</Label>
                        <Input
                          id="fundingRaised"
                          placeholder="Ex: 500K€"
                          value={formData.fundingRaised}
                          onChange={(e) => setFormData({ ...formData, fundingRaised: e.target.value })}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="employeeCount">Nombre d'employés</Label>
                      <Select
                        value={formData.employeeCount}
                        onValueChange={(value) => setFormData({ ...formData, employeeCount: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-50">1-50</SelectItem>
                          <SelectItem value="50-100">50-100</SelectItem>
                          <SelectItem value="100-500">100-500</SelectItem>
                          <SelectItem value="500-1000">500-1000</SelectItem>
                          <SelectItem value="1000-2000">1000-2000</SelectItem>
                          <SelectItem value="2000+">2000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="innovationBudget">Budget innovation annuel</Label>
                      <Input
                        id="innovationBudget"
                        placeholder="Ex: 5M€"
                        value={formData.innovationBudget}
                        onChange={(e) => setFormData({ ...formData, innovationBudget: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">Que recherchez-vous ?</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(PARTNERSHIP_LABELS).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleLookingFor(value as PartnershipType)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm transition-colors',
                          formData.lookingFor.includes(value as PartnershipType)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Thématiques d'intérêt</Label>
                  <div className="flex flex-wrap gap-2">
                    {thematicOptions.map((thematic) => (
                      <button
                        key={thematic}
                        type="button"
                        onClick={() => toggleThematic(thematic)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm transition-colors',
                          formData.thematicsInterest.includes(thematic)
                            ? 'bg-secondary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {thematic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrev} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
              )}
              <Button onClick={handleNext} className="flex-1">
                {currentStep === 4 ? (
                  'Terminer'
                ) : (
                  <>
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {currentStep > 1 && currentStep < 4 && (
              <button
                onClick={handleNext}
                className="w-full mt-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Passer cette étape
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
