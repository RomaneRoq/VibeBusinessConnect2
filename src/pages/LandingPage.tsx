import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock, ArrowRight, Sparkles, ChevronRight, Star, Zap, Target, Handshake } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { eventInfo } from '@/data/event'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gradient">Business Connect</span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">Se connecter</Button>
            </Link>
            <Link to="/register">
              <Button className="shadow-lg shadow-primary/25 shine">
                S'inscrire
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 dots-pattern opacity-50" />

        {/* Floating shapes */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl float" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl float delay-300" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20 badge-shine">
                <Sparkles className="h-4 w-4 mr-2" />
                {eventInfo.thematic}
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in delay-100">
              <span className="text-gradient">{eventInfo.name.split(' ').slice(0, 2).join(' ')}</span>
              <br />
              <span className="text-foreground">{eventInfo.name.split(' ').slice(2).join(' ')}</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in delay-200">
              {eventInfo.description}
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in delay-300">
              <div className="flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm font-medium">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{new Date(eventInfo.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </div>
              <div className="flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm font-medium">
                <Clock className="h-4 w-4 text-primary" />
                <span>{eventInfo.startTime} - {eventInfo.endTime}</span>
              </div>
              <div className="flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{eventInfo.location.name}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-400">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 shadow-xl shadow-primary/25 shine">
                  S'inscrire maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 glass">
                  J'ai déjà un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-primary/50 animate-pulse" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              <Zap className="h-4 w-4 mr-2" />
              Simple & Efficace
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              En 4 étapes simples, préparez vos rencontres et maximisez votre temps à l'événement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
            {[
              { step: '01', title: 'Inscrivez-vous', desc: 'Créez votre profil startup ou entreprise en moins de 5 minutes', icon: Users },
              { step: '02', title: 'Explorez', desc: 'Parcourez les profils des participants et identifiez vos cibles', icon: Target },
              { step: '03', title: 'Sélectionnez', desc: 'Choisissez jusqu\'à 10 participants que vous souhaitez rencontrer', icon: Star },
              { step: '04', title: 'Rencontrez', desc: 'Recevez votre agenda personnalisé de speed-meetings', icon: Handshake },
            ].map((item, index) => (
              <div key={item.step} className={`relative animate-fade-in delay-${index * 100}`}>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                <div className="relative text-center">
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6 relative shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <item.icon className="h-14 w-14 text-primary" />
                    <span className="absolute -top-3 -right-3 w-10 h-10 rounded-full gradient-primary text-white text-base font-bold flex items-center justify-center shadow-lg">
                      {item.step.slice(-1)}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              Fonctionnalités
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Tout ce qu'il vous faut pour<br />
              <span className="text-gradient">réussir vos rencontres</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Notre plateforme vous accompagne avant, pendant et après l'événement pour maximiser chaque opportunité de networking.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Features list */}
            <div className="space-y-6">
              {[
                { title: 'Profils détaillés', desc: 'Découvrez les startups et entreprises avec leurs pitchs et objectifs', icon: Users, color: 'from-blue-500 to-blue-600' },
                { title: 'Matching intelligent', desc: 'Indiquez vos préférences, nous optimisons votre planning', icon: Target, color: 'from-purple-500 to-purple-600' },
                { title: 'Messagerie intégrée', desc: 'Échangez avec les participants avant l\'événement', icon: Zap, color: 'from-orange-500 to-orange-600' },
                { title: 'Agenda personnalisé', desc: 'Visualisez et exportez vos rendez-vous facilement', icon: Calendar, color: 'from-green-500 to-green-600' },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group flex gap-5 p-5 rounded-2xl bg-white/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sectors card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Secteurs représentés</h3>
                  <p className="text-muted-foreground text-sm">Les thématiques de l'événement</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Fintech', icon: '💳', color: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' },
                    { name: 'Regtech', icon: '📋', color: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800' },
                    { name: 'IA & ML', icon: '🤖', color: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' },
                    { name: 'Insurtech', icon: '🛡️', color: 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800' },
                    { name: 'Blockchain', icon: '🔗', color: 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800' },
                    { name: 'Cybersécurité', icon: '🔒', color: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800' },
                    { name: 'Paiements', icon: '💸', color: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800' },
                    { name: 'Conformité', icon: '✅', color: 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800' },
                  ].map((sector) => (
                    <div
                      key={sector.name}
                      className={`flex items-center gap-3 p-4 rounded-xl ${sector.color} border hover:scale-105 transition-transform duration-200 cursor-default`}
                    >
                      <span className="text-2xl">{sector.icon}</span>
                      <span className="font-semibold text-sm">{sector.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 dots-pattern opacity-10" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Prêt à rencontrer vos futurs partenaires ?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Inscrivez-vous dès maintenant et maximisez vos opportunités de networking lors de cet événement exclusif.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-base px-8 shadow-xl shine">
                Créer mon compte gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white">Business Connect</span>
                <p className="text-xs text-gray-400">by Le Village by CA Luxembourg</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>

            <p className="text-sm text-gray-400">
              © 2025 Business Connect. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
