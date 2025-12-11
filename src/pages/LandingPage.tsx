import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock, ArrowRight, Rocket, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { eventInfo } from '@/data/event'
import { participants } from '@/data/participants'

export default function LandingPage() {
  const startupCount = participants.filter(p => p.type === 'startup').length
  const enterpriseCount = participants.filter(p => p.type === 'enterprise').length

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BC</span>
            </div>
            <span className="font-bold text-primary">BusinessConnect</span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Se connecter</Button>
            </Link>
            <Link to="/register">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-700 text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm mb-6">
              {eventInfo.thematic}
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {eventInfo.name}
            </h1>
            <p className="text-lg lg:text-xl text-white/90 mb-8">
              {eventInfo.description}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(eventInfo.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <Clock className="h-5 w-5" />
                <span>{eventInfo.startTime} - {eventInfo.endTime}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <MapPin className="h-5 w-5" />
                <span>{eventInfo.location.name}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  S'inscrire maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 hover:bg-white/20">
                  J'ai déjà un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary mb-2">{startupCount}</p>
                <p className="text-muted-foreground">Startups innovantes</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-6 w-6 text-secondary" />
                </div>
                <p className="text-3xl font-bold text-secondary mb-2">{enterpriseCount}</p>
                <p className="text-muted-foreground">Entreprises établies</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <p className="text-3xl font-bold text-success mb-2">20</p>
                <p className="text-muted-foreground">Meetings par participant</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">
            Comment ça marche ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'Inscrivez-vous', desc: 'Créez votre profil startup ou entreprise en moins de 5 minutes' },
              { step: '2', title: 'Explorez', desc: 'Parcourez les profils des participants et identifiez vos cibles' },
              { step: '3', title: 'Sélectionnez', desc: 'Choisissez jusqu\'à 10 participants que vous souhaitez rencontrer' },
              { step: '4', title: 'Rencontrez', desc: 'Recevez votre agenda personnalisé de speed-meetings' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Prêt à rencontrer vos futurs partenaires ?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Inscrivez-vous dès maintenant et maximisez vos opportunités de networking lors de cet événement exclusif.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Créer mon compte
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BC</span>
            </div>
            <span className="font-bold text-white">BusinessConnect</span>
          </div>
          <p className="text-sm">
            Organisé par Le Village by CA Luxembourg
          </p>
          <p className="text-xs mt-2">
            © 2025 BusinessConnect. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
