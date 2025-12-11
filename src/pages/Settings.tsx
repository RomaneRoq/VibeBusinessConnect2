import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Bell, Shield, LogOut, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/store/authStore'
import { toast } from '@/hooks/useToast'

export default function Settings() {
  const navigate = useNavigate()
  const { user, updateProfile, logout } = useAuthStore()
  const [formData, setFormData] = useState({
    name: user?.participant.name || '',
    pitch: user?.participant.pitch || '',
    description: user?.participant.description || '',
    website: user?.participant.website || '',
    linkedIn: user?.participant.linkedIn || '',
  })
  const [notifications, setNotifications] = useState({
    messages: true,
    reminders: true,
    updates: false,
  })

  const handleSaveProfile = () => {
    updateProfile(formData)
    toast({
      title: 'Profil mis à jour',
      description: 'Vos modifications ont été enregistrées.',
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez votre compte et vos préférences
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="h-4 w-4 mr-2" />
            Confidentialité
          </TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
              <CardDescription>
                Modifiez les informations visibles par les autres participants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'entité</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pitch">Pitch</Label>
                <Textarea
                  id="pitch"
                  value={formData.pitch}
                  onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.pitch.length}/200
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
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
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedIn">LinkedIn</Label>
                  <Input
                    id="linkedIn"
                    value={formData.linkedIn}
                    onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les modifications
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
              <CardDescription>
                Email et mot de passe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  L'email ne peut pas être modifié.
                </p>
              </div>

              <Button variant="outline" disabled>
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notifications</CardTitle>
              <CardDescription>
                Choisissez les notifications que vous souhaitez recevoir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Messages</p>
                  <p className="text-sm text-muted-foreground">
                    Recevez une notification pour chaque nouveau message
                  </p>
                </div>
                <Switch
                  checked={notifications.messages}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, messages: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rappels de rendez-vous</p>
                  <p className="text-sm text-muted-foreground">
                    Recevez un rappel avant chaque rendez-vous
                  </p>
                </div>
                <Switch
                  checked={notifications.reminders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, reminders: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mises à jour</p>
                  <p className="text-sm text-muted-foreground">
                    Recevez des informations sur les nouveaux participants
                  </p>
                </div>
                <Switch
                  checked={notifications.updates}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, updates: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Confidentialité</CardTitle>
              <CardDescription>
                Gérez la visibilité de vos informations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Profil visible</p>
                  <p className="text-sm text-muted-foreground">
                    Votre profil est visible par tous les participants
                  </p>
                </div>
                <Switch checked disabled />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Recevoir des messages</p>
                  <p className="text-sm text-muted-foreground">
                    Autoriser les autres participants à vous contacter
                  </p>
                </div>
                <Switch checked disabled />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4 border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Zone de danger</CardTitle>
              <CardDescription>
                Actions irréversibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
