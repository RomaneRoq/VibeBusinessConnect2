import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import ParticipantCard from '@/components/shared/ParticipantCard'
import { useParticipantsStore } from '@/store/participantsStore'
import { SECTOR_LABELS, type ParticipantType, type Sector } from '@/types'

export default function Participants() {
  const { filters, setFilter, resetFilters, getFilteredParticipants, favorites } = useParticipantsStore()
  const [showFilters, setShowFilters] = useState(false)

  const filteredParticipants = getFilteredParticipants()

  const hasActiveFilters = filters.type !== 'all' || filters.sector !== 'all' || filters.search !== ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Participants</h1>
        <p className="text-muted-foreground">
          Découvrez les startups et entreprises présentes à l'événement
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, pitch..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {(filters.type !== 'all' ? 1 : 0) + (filters.sector !== 'all' ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter dropdowns */}
        {showFilters && (
          <div className="flex flex-wrap gap-4 p-4 bg-muted rounded-lg">
            <div className="w-full sm:w-auto">
              <Select
                value={filters.type}
                onValueChange={(value) => setFilter('type', value)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="startup">Startups</SelectItem>
                  <SelectItem value="enterprise">Entreprises</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto">
              <Select
                value={filters.sector}
                onValueChange={(value) => setFilter('sector', value)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
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
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="h-4 w-4 mr-1" />
                Réinitialiser
              </Button>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredParticipants.length} participant{filteredParticipants.length > 1 ? 's' : ''} trouvé{filteredParticipants.length > 1 ? 's' : ''}
          </p>
          {favorites.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {favorites.length} favori{favorites.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Participants grid */}
      {filteredParticipants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredParticipants.map((participant) => (
            <ParticipantCard key={participant.id} participant={participant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun participant ne correspond à vos critères.</p>
          <Button variant="link" onClick={resetFilters}>
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  )
}
