'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Invitation {
  id: string
  title: string
}

interface ResponsesFiltersProps {
  invitations: Invitation[]
}

export function ResponsesFilters({ invitations }: ResponsesFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selectedInvitation, setSelectedInvitation] = useState<string>(
    searchParams.get('invitation') || 'all'
  )
  const [selectedStatus, setSelectedStatus] = useState<string>(
    searchParams.get('status') || 'all'
  )

  const hasActiveFilters =
    searchParams.get('invitation') || searchParams.get('status')

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setSelectedInvitation('all')
    setSelectedStatus('all')
    router.push(pathname)
  }

  useEffect(() => {
    setSelectedInvitation(searchParams.get('invitation') || 'all')
    setSelectedStatus(searchParams.get('status') || 'all')
  }, [searchParams])

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Invitation Filter */}
      <Select
        value={selectedInvitation}
        onValueChange={(value) => {
          setSelectedInvitation(value)
          updateFilters('invitation', value)
        }}
      >
        <SelectTrigger className="w-[200px] bg-white border-slate-200">
          <SelectValue placeholder="Tüm Davetiyeler" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Davetiyeler</SelectItem>
          {invitations.map((invitation) => (
            <SelectItem key={invitation.id} value={invitation.id}>
              {invitation.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={selectedStatus}
        onValueChange={(value) => {
          setSelectedStatus(value)
          updateFilters('status', value)
        }}
      >
        <SelectTrigger className="w-[180px] bg-white border-slate-200">
          <SelectValue placeholder="Tüm Durumlar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Durumlar</SelectItem>
          <SelectItem value="attending">Katılacak</SelectItem>
          <SelectItem value="declined">Katılamayacak</SelectItem>
          <SelectItem value="pending">Beklemede</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="text-slate-600 hover:text-slate-900"
        >
          <X className="w-4 h-4 mr-1" />
          Filtreleri Temizle
        </Button>
      )}
    </div>
  )
}
