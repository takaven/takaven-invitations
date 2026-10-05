'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Eye, Mail, Phone, Users, Calendar, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface RsvpResponse {
  id: string
  name: string
  email: string | null
  phone: string | null
  attending: boolean | null
  guest_count: number
  message: string | null
  created_at: string
  invitation_id: string
  invitations: {
    title: string
    event_date: string | null
  }
}

interface ResponsesTableProps {
  responses: RsvpResponse[]
}

function getStatusBadge(attending: boolean | null) {
  if (attending === true) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
        Katılacak
      </Badge>
    )
  }
  if (attending === false) {
    return (
      <Badge className="bg-rose-100 text-rose-700 border-rose-200">
        Katılamayacak
      </Badge>
    )
  }
  return (
    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
      Beklemede
    </Badge>
  )
}

function ResponseDetailsDialog({ response }: { response: RsvpResponse }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Yanıt Detayları</DialogTitle>
          <DialogDescription>
            {response.name} tarafından gönderilen RSVP yanıtı
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Guest Count */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 mb-1">Durum</p>
              {getStatusBadge(response.attending)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 mb-1">
                Misafir Sayısı
              </p>
              <div className="flex items-center gap-2 text-slate-900">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">{response.guest_count}</span>
              </div>
            </div>
          </div>

          {/* Invitation Details */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
            <p className="text-sm font-medium text-slate-700 mb-2">Davetiye</p>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {response.invitations.title}
            </h3>
            {response.invitations.event_date && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(
                    new Date(response.invitations.event_date),
                    'dd MMMM yyyy, EEEE',
                    { locale: tr }
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">Ad Soyad</p>
              <p className="text-slate-900 font-medium">{response.name}</p>
            </div>
            {response.email && (
              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">
                  E-posta
                </p>
                <div className="flex items-center gap-2 text-slate-900">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a
                    href={`mailto:${response.email}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {response.email}
                  </a>
                </div>
              </div>
            )}
            {response.phone && (
              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">
                  Telefon
                </p>
                <div className="flex items-center gap-2 text-slate-900">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a
                    href={`tel:${response.phone}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {response.phone}
                  </a>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">
                Yanıt Tarihi
              </p>
              <div className="flex items-center gap-2 text-slate-900">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>
                  {format(new Date(response.created_at), 'dd MMMM yyyy, HH:mm', {
                    locale: tr,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Message */}
          {response.message && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <p className="text-sm font-medium text-slate-500">Mesaj</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-slate-700 whitespace-pre-wrap">
                  {response.message}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ResponsesTable({ responses }: ResponsesTableProps) {
  if (responses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Henüz yanıt yok
        </h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          Davetiyelerinize gelen RSVP yanıtları burada görünecektir.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
    >
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Ad Soyad
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Davetiye
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Durum
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Misafir
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                İletişim
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Tarih
              </th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {responses.map((response, index) => (
              <motion.tr
                key={response.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900">{response.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">
                    {response.invitations.title}
                  </p>
                </td>
                <td className="px-6 py-4">{getStatusBadge(response.attending)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-slate-900">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{response.guest_count}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {response.email && (
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[150px]">
                          {response.email}
                        </span>
                      </div>
                    )}
                    {response.phone && (
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{response.phone}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">
                    {format(new Date(response.created_at), 'dd MMM yyyy', {
                      locale: tr,
                    })}
                  </p>
                  <p className="text-xs text-slate-400">
                    {format(new Date(response.created_at), 'HH:mm')}
                  </p>
                </td>
                <td className="px-6 py-4 text-right">
                  <ResponseDetailsDialog response={response} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-slate-100">
        {responses.map((response, index) => (
          <motion.div
            key={response.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-slate-900">{response.name}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {response.invitations.title}
                </p>
              </div>
              <ResponseDetailsDialog response={response} />
            </div>

            <div className="flex items-center gap-3">
              {getStatusBadge(response.attending)}
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{response.guest_count} misafir</span>
              </div>
            </div>

            {(response.email || response.phone) && (
              <div className="flex flex-col gap-1.5 text-sm">
                {response.email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{response.email}</span>
                  </div>
                )}
                {response.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{response.phone}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {format(new Date(response.created_at), 'dd MMMM yyyy, HH:mm', {
                  locale: tr,
                })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
