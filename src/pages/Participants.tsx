import { useState } from 'react'
import { Search, Filter, X, Rocket, Building2, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import ParticipantCard from '@/components/shared/ParticipantCard'
import { useParticipantsStore } from '@/store/participantsStore'
import { SECTOR_LABELS } from '@/types'

export default function Participants() {
  const { filters, setFilter, resetFilters, getFilteredParticipants, favorites, participants } = useParticipantsStore()
  const [showFilters, setShowFilters] = useState(false)

  const filteredParticipants = getFilteredParticipants()
  const startupCount = participants.filter(p => p.type === 'startup').length
  const enterpriseCount = participants.filter(p => p.type === 'enterprise').length

  const hasActiveFilters = filters.type !== 'all' || filters.sector !== 'all' || filters.search !== ''

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Participants</h1>
          </div>
          <p className="text-muted-foreground">
            Découvrez les startups et entreprises présentes à l'événement
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex gap-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Rocket className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none">{startupCount}</p>
                <p className="text-xs text-muted-foreground">Startups</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none">{enterpriseCount}</p>
                <p className="text-xs text-muted-foreground">Entreprises</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, pitch..."
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
                className="pl-11 h-11"
              />
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="h-11 px-4"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 bg-white/20">
                  {(filters.type !== 'all' ? 1 : 0) + (filters.sector !== 'all' ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>

          {/* Filter dropdowns */}
          {showFilters && (
            <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-xl animate-fade-in">
              <div className="w-full sm:w-auto">
                <Select
                  value={filters.type}
                  onValueChange={(value) => setFilter('type', value)}
                >
                  <SelectTrigger className="w-full sm:w-[180px] h-11">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="startup">
                      <div className="flex items-center gap-2">
                        <Rocket className="h-3.5 w-3.5" />
                        Startups
                      </div>
                    </SelectItem>
                    <SelectItem value="enterprise">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5" />
                        Entreprises
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-auto">
                <Select
                  value={filters.sector}
                  onValueChange={(value) => setFilter('sector', value)}
                >
                  <SelectTrigger className="w-full sm:w-[220px] h-11">
                    <SelectValue placeholder="Secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les secteurs</SelectItem>
                    {Object.entries(SECTOR_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" onClick={resetFilters} className="h-11">
                  <X className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              )}
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredParticipants.length}</span> participant{filteredParticipants.length > 1 ? 's' : ''} trouvé{filteredParticipants.length > 1 ? 's' : ''}
            </p>
            {favorites.length > 0 && (
              <Badge variant="ghost" className="text-rose-500">
                {favorites.length} favori{favorites.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Participants grid */}
      {filteredParticipants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredParticipants.map((participant, index) => (
            <div key={participant.id} className={`animate-fade-in delay-${Math.min(index * 50, 500)}`}>
              <ParticipantCard participant={participant} />
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-md">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">Aucun participant trouvé</p>
            <p className="text-muted-foreground mb-4">Aucun participant ne correspond à vos critères de recherche.</p>
            <Button variant="outline" onClick={resetFilters}>
              <X className="h-4 w-4 mr-2" />
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
