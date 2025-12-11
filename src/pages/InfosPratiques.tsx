import { MapPin, Phone, Mail, Car, Train, Clock, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { eventInfo } from '@/data/event'

export default function InfosPratiques() {
  const openMaps = () => {
    const { lat, lng } = eventInfo.location.coordinates || { lat: 49.6116, lng: 6.1319 }
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Informations pratiques</h1>
        <p className="text-muted-foreground">
          Tout ce qu'il faut savoir pour bien préparer votre venue
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Lieu de l'événement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">{eventInfo.location.name}</p>
              <p className="text-muted-foreground">{eventInfo.location.address}</p>
              <p className="text-muted-foreground">
                {eventInfo.location.city}, {eventInfo.location.country}
              </p>
            </div>

            <Button onClick={openMaps} variant="outline" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ouvrir dans Google Maps
            </Button>

            {/* Map placeholder */}
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Carte interactive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact organisateur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">{eventInfo.organizer.name}</p>
            </div>

            <div className="space-y-3">
              <a
                href={`mailto:${eventInfo.organizer.email}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                <span>{eventInfo.organizer.email}</span>
              </a>

              <a
                href={`tel:${eventInfo.organizer.phone}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                <span>{eventInfo.organizer.phone}</span>
              </a>
            </div>

            <Separator />

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Besoin d'aide ?</p>
              <p className="text-sm text-muted-foreground">
                Notre équipe est disponible pour répondre à toutes vos questions.
                N'hésitez pas à nous contacter avant ou pendant l'événement.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="h-5 w-5 text-primary" />
              Accès
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{eventInfo.access}</p>

            <Separator />

            <div>
              <p className="font-medium mb-2">Transports en commun</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-white text-xs px-2 py-0.5 rounded">Bus</span>
                  <span>Lignes 4, 16, 18 - Arrêt "Kirchberg Centre"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-secondary text-white text-xs px-2 py-0.5 rounded">Tram</span>
                  <span>Ligne 1 - Arrêt "Rout Bréck - Pafendall"</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Parking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              Parking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{eventInfo.parking}</p>

            <div className="p-4 bg-success/10 text-success rounded-lg">
              <p className="text-sm font-medium">Places réservées</p>
              <p className="text-sm mt-1">
                Des places sont réservées aux participants. Présentez votre badge à l'entrée du parking.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Horaires importants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Accueil</p>
                <p className="text-lg font-semibold">09:00 - 09:30</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Récupération des badges
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Speed-Meetings</p>
                <p className="text-lg font-semibold">10:00 - 17:00</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Pause déjeuner 12:30-14:30
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Cocktail</p>
                <p className="text-lg font-semibold">17:30 - 19:00</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Networking libre
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
