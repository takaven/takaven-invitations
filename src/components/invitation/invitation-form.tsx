'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createInvitation, updateInvitation } from '@/lib/actions/invitations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Invitation, InvitationType, ThemeStyle, AnimationType } from '@/types/database'
import {
  Type,
  MessageSquare,
  Calendar,
  MapPin,
  Palette,
  Sparkles,
  Eye,
  Save,
  Settings,
  Video,
  Music,
  ListOrdered,
  Plus,
  Trash2,
  Mail,
  Gift,
  Link
} from 'lucide-react'
import { InvitationPreview } from './invitation-preview'

interface InvitationFormProps {
  invitation?: Invitation
}

const invitationTypes: { value: InvitationType; label: string }[] = [
  { value: 'wedding', label: 'Düğün' },
  { value: 'birthday', label: 'Doğum Günü' },
  { value: 'graduation', label: 'Mezuniyet' },
  { value: 'baby_shower', label: 'Baby Shower' },
  { value: 'engagement', label: 'Nişan' },
  { value: 'anniversary', label: 'Yıldönümü' },
  { value: 'corporate', label: 'Kurumsal Etkinlik' },
  { value: 'party', label: 'Parti' },
  { value: 'religious', label: 'Dini Tören' },
  { value: 'other', label: 'Diğer' }
]

const themeStyles: { value: ThemeStyle; label: string; colors: string }[] = [
  { value: 'classic', label: 'Klasik', colors: 'from-amber-400 to-orange-500' },
  { value: 'modern', label: 'Modern', colors: 'from-slate-600 to-slate-800' },
  { value: 'elegant', label: 'Zarif', colors: 'from-purple-500 to-indigo-600' },
  { value: 'romantic', label: 'Romantik', colors: 'from-pink-400 to-rose-500' },
  { value: 'playful', label: 'Eğlenceli', colors: 'from-cyan-400 to-blue-500' },
  { value: 'minimal', label: 'Minimal', colors: 'from-gray-300 to-gray-500' },
  { value: 'rustic', label: 'Rustik', colors: 'from-amber-600 to-yellow-700' },
  { value: 'luxury', label: 'Lüks', colors: 'from-yellow-400 to-amber-500' },
  { value: 'vintage', label: 'Vintage', colors: 'from-rose-300 to-pink-400' },
  { value: 'tropical', label: 'Tropik', colors: 'from-emerald-400 to-teal-500' }
]

const animationTypes: { value: AnimationType; label: string }[] = [
  { value: 'fade', label: 'Solma' },
  { value: 'slide_up', label: 'Yukarı Kayma' },
  { value: 'slide_down', label: 'Aşağı Kayma' },
  { value: 'slide_left', label: 'Sola Kayma' },
  { value: 'slide_right', label: 'Sağa Kayma' },
  { value: 'zoom', label: 'Yakınlaştırma' },
  { value: 'rotate', label: 'Döndürme' },
  { value: 'bounce', label: 'Zıplama' },
  { value: 'flip', label: 'Çevirme' },
  { value: 'confetti', label: 'Konfeti' },
  { value: 'sparkle', label: 'Parıltı' },
  { value: 'elegant', label: 'Zarif Giriş' },
  { value: 'none', label: 'Animasyon Yok' }
]

const entryAnimationTypes = [
  { value: 'envelope', label: 'Zarf Açılışı', description: 'Zarftan çıkan davetiye', icon: '✉️' },
  { value: 'curtain', label: 'Perde Açılışı', description: 'İki yandan açılan perde', icon: '🎭' },
  { value: 'confetti_burst', label: 'Konfeti Patlaması', description: 'Renkli konfeti efekti', icon: '🎉' },
  { value: 'cloud_reveal', label: 'Bulut Açılımı', description: 'Yumuşak bulut geçişi', icon: '☁️' },
  { value: 'cap_toss', label: 'Kep Fırlatma', description: 'Mezuniyet kepi havaya', icon: '🎓' },
  { value: 'gift_box', label: 'Hediye Kutusu', description: 'Açılan hediye kutusu', icon: '🎁' },
  { value: 'none', label: 'Animasyon Yok', description: 'Doğrudan aç', icon: '⏭️' }
]

const fontFamilies = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Dancing Script', label: 'Dancing Script' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Great Vibes', label: 'Great Vibes' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond (Zarif)' }
]

interface TimelineEvent {
  time: string
  title: string
  description: string
  icon: string
}

const defaultTimelineEvents: TimelineEvent[] = [
  { time: '16:30', title: 'Misafir Karşılama', description: 'Hoş geldiniz', icon: 'users' },
  { time: '17:00', title: 'Nikah Töreni', description: 'Resmi nikah', icon: 'heart' },
  { time: '18:00', title: 'Kokteyl', description: 'Aperatif ve içecekler', icon: 'wine' },
  { time: '20:00', title: 'Yemek', description: 'Düğün ziyafeti', icon: 'utensils' },
  { time: '22:30', title: 'İlk Dans', description: 'Gelin ve damadın dansı', icon: 'heart' },
  { time: '23:00', title: 'Parti', description: 'Dans başlasın!', icon: 'music' },
  { time: '02:30', title: 'Kapanış', description: 'Hoşçakalın', icon: 'party' }
]

const iconOptions = [
  { value: 'users', label: 'Kullanıcılar' },
  { value: 'heart', label: 'Kalp' },
  { value: 'wine', label: 'Kadeh' },
  { value: 'utensils', label: 'Yemek' },
  { value: 'music', label: 'Müzik' },
  { value: 'party', label: 'Parti' }
]

export function InvitationForm({ invitation }: InvitationFormProps) {
  // Parse custom fields for timeline
  const customFields = invitation?.custom_fields as { timeline?: TimelineEvent[] } | null
  const initialTimeline = customFields?.timeline || defaultTimelineEvents

  // Parse custom fields
  const customFieldsData = invitation?.custom_fields as {
    timeline?: TimelineEvent[]
    age?: number
    celebrant_name?: string
    timezone?: string
    baby_gender?: 'boy' | 'girl' | 'surprise'
    baby_name?: string
    graduate_name?: string
    degree?: string
    school_name?: string
    company_name?: string
    event_type?: string
    dress_code?: string
    gift_registry_url?: string
    couple_names?: { bride: string; groom: string }
    entry_animation?: string
    theme_id?: string
    show_dietary?: boolean
    show_gift_section?: boolean
  } | null

  const [formData, setFormData] = useState({
    title: invitation?.title || '',
    subtitle: invitation?.subtitle || '',
    message: invitation?.message || '',
    event_date: invitation?.event_date || '',
    event_time: invitation?.event_time || '',
    location_name: invitation?.location_name || '',
    location_address: invitation?.location_address || '',
    location_map_url: invitation?.location_map_url || '',
    invitation_type: invitation?.invitation_type || 'party',
    theme_style: invitation?.theme_style || 'modern',
    animation_type: invitation?.animation_type || 'fade',
    primary_color: invitation?.primary_color || '#6366f1',
    secondary_color: invitation?.secondary_color || '#8b5cf6',
    accent_color: invitation?.accent_color || '#ec4899',
    background_color: invitation?.background_color || '#ffffff',
    text_color: invitation?.text_color || '#1f2937',
    font_family: invitation?.font_family || 'Inter',
    background_image_url: invitation?.background_image_url || '',
    hero_image_url: invitation?.hero_image_url || '',
    video_url: (invitation as any)?.video_url || '',
    music_url: invitation?.music_url || '',
    hosts: (invitation as any)?.hosts?.join(', ') || '',
    show_countdown: invitation?.show_countdown ?? true,
    show_rsvp: invitation?.show_rsvp ?? true,
    rsvp_deadline: invitation?.rsvp_deadline || '',
    // Type-specific fields
    age: customFieldsData?.age || '',
    celebrant_name: customFieldsData?.celebrant_name || '',
    timezone: customFieldsData?.timezone || 'Indian/Mauritius',
    baby_gender: customFieldsData?.baby_gender || 'surprise',
    baby_name: customFieldsData?.baby_name || '',
    graduate_name: customFieldsData?.graduate_name || '',
    degree: customFieldsData?.degree || '',
    school_name: customFieldsData?.school_name || '',
    company_name: customFieldsData?.company_name || '',
    event_type: customFieldsData?.event_type || '',
    dress_code: customFieldsData?.dress_code || '',
    gift_registry_url: customFieldsData?.gift_registry_url || '',
    bride_name: customFieldsData?.couple_names?.bride || '',
    groom_name: customFieldsData?.couple_names?.groom || '',
    // Entry animation & section visibility
    entry_animation: customFieldsData?.entry_animation || 'envelope',
    theme_id: customFieldsData?.theme_id || 'default',
    show_dietary: customFieldsData?.show_dietary ?? true,
    show_gift_section: customFieldsData?.show_gift_section ?? true,
    // Editable slug
    slug: invitation?.slug || ''
  })

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(initialTimeline)
  const [showPreview, setShowPreview] = useState(false)

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formDataObj = new FormData(form)

    // Add all form data (excluding type-specific fields that go in custom_fields)
    const typeSpecificFields = ['age', 'celebrant_name', 'timezone', 'baby_gender', 'baby_name', 'graduate_name', 'degree', 'school_name', 'company_name', 'event_type', 'dress_code', 'gift_registry_url', 'bride_name', 'groom_name', 'hosts', 'entry_animation', 'theme_id', 'show_dietary', 'show_gift_section', 'slug']

    Object.entries(formData).forEach(([key, value]) => {
      if (!typeSpecificFields.includes(key)) {
        formDataObj.set(key, String(value))
      }
    })

    // Add hosts as array
    if (formData.hosts) {
      formDataObj.set('hosts', JSON.stringify(formData.hosts.split(',').map((h: string) => h.trim()).filter(Boolean)))
    }

    // Add video_url
    formDataObj.set('video_url', formData.video_url)

    // Add all type-specific fields to custom_fields
    const customFieldsObj: Record<string, any> = {
      timeline: timelineEvents
    }

    // Add type-specific fields based on invitation type
    if (formData.invitation_type === 'birthday' && formData.age) {
      customFieldsObj.age = Number(formData.age)
    }
    if (formData.celebrant_name) customFieldsObj.celebrant_name = formData.celebrant_name
    customFieldsObj.timezone = formData.timezone
    if (formData.invitation_type === 'baby_shower') {
      customFieldsObj.baby_gender = formData.baby_gender
      customFieldsObj.baby_name = formData.baby_name
    }
    if (formData.invitation_type === 'graduation') {
      customFieldsObj.graduate_name = formData.graduate_name
      customFieldsObj.degree = formData.degree
      customFieldsObj.school_name = formData.school_name
    }
    if (['wedding', 'engagement', 'anniversary'].includes(formData.invitation_type)) {
      customFieldsObj.couple_names = {
        bride: formData.bride_name,
        groom: formData.groom_name
      }
    }
    if (formData.invitation_type === 'corporate') {
      customFieldsObj.company_name = formData.company_name
      customFieldsObj.event_type = formData.event_type
    }
    // Common optional fields
    if (formData.dress_code) customFieldsObj.dress_code = formData.dress_code
    if (formData.gift_registry_url) customFieldsObj.gift_registry_url = formData.gift_registry_url

    // Entry animation and section visibility
    customFieldsObj.entry_animation = formData.entry_animation
    customFieldsObj.theme_id = formData.theme_id
    customFieldsObj.show_dietary = formData.show_dietary
    customFieldsObj.show_gift_section = formData.show_gift_section

    formDataObj.set('custom_fields', JSON.stringify(customFieldsObj))

    // Add slug for update
    if (formData.slug) {
      formDataObj.set('slug', formData.slug)
    }

    if (invitation) {
      await updateInvitation(invitation.id, formDataObj)
    } else {
      await createInvitation(formDataObj)
    }
  }

  // Timeline event handlers
  const addTimelineEvent = () => {
    setTimelineEvents(prev => [
      ...prev,
      { time: '00:00', title: '', description: '', icon: 'heart' }
    ])
  }

  const removeTimelineEvent = (index: number) => {
    setTimelineEvents(prev => prev.filter((_, i) => i !== index))
  }

  const updateTimelineEvent = (index: number, field: keyof TimelineEvent, value: string) => {
    setTimelineEvents(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline">İçerik</span>
            </TabsTrigger>
            <TabsTrigger value="event" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Etkinlik</span>
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Tasarım</span>
            </TabsTrigger>
            <TabsTrigger value="animation" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Animasyon</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Gelişmiş</span>
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Davetiye İçeriği
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invitation_type">Davetiye Türü</Label>
                  <Select
                    value={formData.invitation_type}
                    onValueChange={(value) => handleChange('invitation_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tür seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {invitationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Başlık *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Örn: Düğünümüze Davetlisiniz"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Alt Başlık</Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    placeholder="Örn: Ayşe & Mehmet"
                    value={formData.subtitle}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mesaj</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Davetiye mesajınızı yazın..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hosts">Ev Sahipleri / Davet Edenler</Label>
                  <Input
                    id="hosts"
                    name="hosts"
                    placeholder="Örn: Ayşe Yılmaz, Mehmet Yılmaz"
                    value={formData.hosts}
                    onChange={(e) => handleChange('hosts', e.target.value)}
                  />
                  <p className="text-xs text-slate-500">
                    Virgülle ayırarak birden fazla isim yazabilirsiniz.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Type-specific fields */}
            {formData.invitation_type === 'birthday' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🎂 Doğum Günü Detayları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="celebrant_name">İsim</Label>
                    <Input
                      id="celebrant_name"
                      placeholder="Örn: Aiden"
                      value={formData.celebrant_name}
                      onChange={(e) => handleChange('celebrant_name', e.target.value)}
                    />
                    <p className="text-xs text-slate-500">
                      Football reveal için kullanılacak isim.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Yaş</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="150"
                      placeholder="Örn: 25"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                    />
                    <p className="text-xs text-slate-500">
                      Animasyonlu yaş sayacı için yaşı girin.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {formData.invitation_type === 'baby_shower' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">👶 Baby Shower Detayları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="baby_name">Bebeğin Adı (Opsiyonel)</Label>
                    <Input
                      id="baby_name"
                      placeholder="Henüz belirlenmemişse boş bırakabilirsiniz"
                      value={formData.baby_name}
                      onChange={(e) => handleChange('baby_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cinsiyet</Label>
                    <div className="flex gap-4">
                      {[
                        { value: 'boy', label: '👦 Erkek', color: 'bg-blue-100 border-blue-400' },
                        { value: 'girl', label: '👧 Kız', color: 'bg-pink-100 border-pink-400' },
                        { value: 'surprise', label: '🎁 Sürpriz', color: 'bg-yellow-100 border-yellow-400' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleChange('baby_gender', option.value)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            formData.baby_gender === option.value
                              ? `${option.color} ring-2 ring-offset-1`
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">
                      Tema renkleri seçiminize göre otomatik ayarlanır.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {formData.invitation_type === 'graduation' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🎓 Mezuniyet Detayları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="graduate_name">Mezunun Adı</Label>
                    <Input
                      id="graduate_name"
                      placeholder="Örn: Ahmet Yılmaz"
                      value={formData.graduate_name}
                      onChange={(e) => handleChange('graduate_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school_name">Okul / Üniversite</Label>
                    <Input
                      id="school_name"
                      placeholder="Örn: İstanbul Teknik Üniversitesi"
                      value={formData.school_name}
                      onChange={(e) => handleChange('school_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="degree">Derece / Bölüm</Label>
                    <Input
                      id="degree"
                      placeholder="Örn: Bilgisayar Mühendisliği Lisans"
                      value={formData.degree}
                      onChange={(e) => handleChange('degree', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {['wedding', 'engagement', 'anniversary'].includes(formData.invitation_type) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💍 Çift Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bride_name">Gelin Adı</Label>
                      <Input
                        id="bride_name"
                        placeholder="Örn: Ayşe"
                        value={formData.bride_name}
                        onChange={(e) => handleChange('bride_name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="groom_name">Damat Adı</Label>
                      <Input
                        id="groom_name"
                        placeholder="Örn: Mehmet"
                        value={formData.groom_name}
                        onChange={(e) => handleChange('groom_name', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {formData.invitation_type === 'corporate' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🏢 Kurumsal Detaylar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Şirket / Kurum Adı</Label>
                    <Input
                      id="company_name"
                      placeholder="Örn: ABC Teknoloji A.Ş."
                      value={formData.company_name}
                      onChange={(e) => handleChange('company_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event_type">Etkinlik Türü</Label>
                    <Input
                      id="event_type"
                      placeholder="Örn: Yıllık Toplantı, Lansman, Seminer"
                      value={formData.event_type}
                      onChange={(e) => handleChange('event_type', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Common optional fields */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ek Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dress_code">Kıyafet Kodu (Opsiyonel)</Label>
                  <Input
                    id="dress_code"
                    placeholder="Örn: Resmi, Casual, Beyaz Giyinin"
                    value={formData.dress_code}
                    onChange={(e) => handleChange('dress_code', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gift_registry_url">Hediye Listesi URL (Opsiyonel)</Label>
                  <Input
                    id="gift_registry_url"
                    type="url"
                    placeholder="https://..."
                    value={formData.gift_registry_url}
                    onChange={(e) => handleChange('gift_registry_url', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Event Tab */}
          <TabsContent value="event" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Etkinlik Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_date">Tarih</Label>
                    <Input
                      id="event_date"
                      name="event_date"
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => handleChange('event_date', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event_time">Saat</Label>
                    <Input
                      id="event_time"
                      name="event_time"
                      type="time"
                      value={formData.event_time}
                      onChange={(e) => handleChange('event_time', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Etkinlik saat dilimi</Label>
                  <Input
                    id="timezone"
                    placeholder="Indian/Mauritius"
                    value={formData.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                  />
                  <p className="text-xs text-slate-500">
                    Geri sayımın etkinlik yerel saatine göre hesaplanması için IANA adı kullanın.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location_name">Mekan Adı</Label>
                  <Input
                    id="location_name"
                    name="location_name"
                    placeholder="Örn: Grand Hotel"
                    value={formData.location_name}
                    onChange={(e) => handleChange('location_name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location_address">Adres</Label>
                  <Textarea
                    id="location_address"
                    name="location_address"
                    placeholder="Tam adres..."
                    rows={2}
                    value={formData.location_address}
                    onChange={(e) => handleChange('location_address', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location_map_url">Harita Linki (Google Maps)</Label>
                  <Input
                    id="location_map_url"
                    name="location_map_url"
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={formData.location_map_url}
                    onChange={(e) => handleChange('location_map_url', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">RSVP Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="show_countdown"
                    checked={formData.show_countdown}
                    onChange={(e) => handleChange('show_countdown', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="show_countdown">Geri Sayım Göster</Label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="show_rsvp"
                    checked={formData.show_rsvp}
                    onChange={(e) => handleChange('show_rsvp', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="show_rsvp">RSVP Formu Göster</Label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="show_dietary"
                    checked={formData.show_dietary}
                    onChange={(e) => handleChange('show_dietary', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="show_dietary">Diyet/Alerji Bilgisi Göster</Label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="show_gift_section"
                    checked={formData.show_gift_section}
                    onChange={(e) => handleChange('show_gift_section', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="show_gift_section">Hediye Bölümü Göster</Label>
                </div>

                {formData.show_rsvp && (
                  <div className="space-y-2">
                    <Label htmlFor="rsvp_deadline">RSVP Son Tarih</Label>
                    <Input
                      id="rsvp_deadline"
                      name="rsvp_deadline"
                      type="date"
                      value={formData.rsvp_deadline}
                      onChange={(e) => handleChange('rsvp_deadline', e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Tema ve Renkler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tema Stili</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {themeStyles.map((theme) => (
                      <button
                        key={theme.value}
                        type="button"
                        onClick={() => handleChange('theme_style', theme.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.theme_style === theme.value
                            ? 'border-indigo-500 ring-2 ring-indigo-200'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`h-8 rounded bg-gradient-to-r ${theme.colors} mb-2`} />
                        <span className="text-sm font-medium">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
                  <Label htmlFor="theme_id">Opening deneyimi</Label>
                  <Select
                    value={formData.theme_id}
                    onValueChange={(value) => handleChange('theme_id', value)}
                  >
                    <SelectTrigger id="theme_id">
                      <SelectValue placeholder="Opening seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Standart davetiye</SelectItem>
                      <SelectItem value="football">Football — placeholder kick reveal</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-600">
                    Bu seçim yalnızca generic opening registry&apos;yi seçer; davetiye shell ve RSVP aynı kalır.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font_family">Yazı Tipi</Label>
                  <Select
                    value={formData.font_family}
                    onValueChange={(value) => handleChange('font_family', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Yazı tipi seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Ana Renk</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary_color"
                        name="primary_color"
                        type="color"
                        value={formData.primary_color}
                        onChange={(e) => handleChange('primary_color', e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={formData.primary_color}
                        onChange={(e) => handleChange('primary_color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary_color">İkincil Renk</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary_color"
                        name="secondary_color"
                        type="color"
                        value={formData.secondary_color}
                        onChange={(e) => handleChange('secondary_color', e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={formData.secondary_color}
                        onChange={(e) => handleChange('secondary_color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accent_color">Vurgu Rengi</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accent_color"
                        name="accent_color"
                        type="color"
                        value={formData.accent_color}
                        onChange={(e) => handleChange('accent_color', e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={formData.accent_color}
                        onChange={(e) => handleChange('accent_color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="background_color">Arkaplan Rengi</Label>
                    <div className="flex gap-2">
                      <Input
                        id="background_color"
                        name="background_color"
                        type="color"
                        value={formData.background_color}
                        onChange={(e) => handleChange('background_color', e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={formData.background_color}
                        onChange={(e) => handleChange('background_color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="text_color">Metin Rengi</Label>
                    <div className="flex gap-2">
                      <Input
                        id="text_color"
                        name="text_color"
                        type="color"
                        value={formData.text_color}
                        onChange={(e) => handleChange('text_color', e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={formData.text_color}
                        onChange={(e) => handleChange('text_color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background_image_url">Arkaplan Görseli URL</Label>
                  <Input
                    id="background_image_url"
                    name="background_image_url"
                    type="url"
                    placeholder="https://..."
                    value={formData.background_image_url}
                    onChange={(e) => handleChange('background_image_url', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Animation Tab */}
          <TabsContent value="animation" className="space-y-4 mt-4">
            {/* Entry Animation (Zarf vb.) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Sayfa Giriş Animasyonu
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Davetiye açıldığında gösterilecek giriş efekti
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {entryAnimationTypes.map((anim) => (
                      <button
                        key={anim.value}
                        type="button"
                        onClick={() => handleChange('entry_animation', anim.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          formData.entry_animation === anim.value
                            ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-lg block mb-1">{anim.icon}</span>
                        <span className="text-sm font-medium block">{anim.label}</span>
                        <span className="text-xs text-slate-500 block">{anim.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Animations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Bölüm Animasyonları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>İçerik Geçiş Animasyonu</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {animationTypes.map((animation) => (
                      <button
                        key={animation.value}
                        type="button"
                        onClick={() => handleChange('animation_type', animation.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          formData.animation_type === animation.value
                            ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-sm font-medium">{animation.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-4 mt-4">
            {/* Video Background */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video Arkaplan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video_url" className="flex items-center gap-2">
                    Video Arkaplan URL
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Öncelikli</span>
                  </Label>
                  <Input
                    id="video_url"
                    name="video_url"
                    type="url"
                    placeholder="https://example.com/video.mp4"
                    value={formData.video_url}
                    onChange={(e) => handleChange('video_url', e.target.value)}
                  />
                  <p className="text-xs text-slate-500">
                    MP4, WebM formatında direkt video linki veya YouTube/Vimeo embed URL'si.
                    <br />
                    <span className="text-indigo-600 font-medium">Bu alan dolu ise video gösterilir.</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_image_url" className="flex items-center gap-2">
                    Arkaplan Görseli URL
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Yedek</span>
                  </Label>
                  <Input
                    id="hero_image_url"
                    name="hero_image_url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.hero_image_url}
                    onChange={(e) => handleChange('hero_image_url', e.target.value)}
                  />
                  <p className="text-xs text-slate-500">
                    JPG, PNG, WebP formatında görsel linki.
                    <br />
                    <span className="text-slate-600 font-medium">Sadece video URL boş ise bu görsel kullanılır.</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Music */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Arkaplan Müziği
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="music_url">Müzik URL</Label>
                  <Input
                    id="music_url"
                    name="music_url"
                    type="url"
                    placeholder="https://... (.mp3, .wav)"
                    value={formData.music_url}
                    onChange={(e) => handleChange('music_url', e.target.value)}
                  />
                  <p className="text-xs text-slate-500">
                    Davetiye sayfasında çalacak arkaplan müziği. Ziyaretçiler açıp kapatabilir.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline/Program */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ListOrdered className="w-5 h-5" />
                  Günün Programı
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-500">
                  Etkinlik programınızı ekleyin. Bu, zarif düğün temasında gösterilecektir.
                </p>

                <div className="space-y-4">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">
                          Etkinlik {index + 1}
                        </span>
                        {timelineEvents.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimelineEvent(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Saat</Label>
                          <Input
                            type="time"
                            value={event.time.includes(':') ? event.time : '00:00'}
                            onChange={(e) => updateTimelineEvent(index, 'time', e.target.value)}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">İkon</Label>
                          <Select
                            value={event.icon}
                            onValueChange={(value) => updateTimelineEvent(index, 'icon', value)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {iconOptions.map((icon) => (
                                <SelectItem key={icon.value} value={icon.value}>
                                  {icon.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Başlık</Label>
                        <Input
                          value={event.title}
                          onChange={(e) => updateTimelineEvent(index, 'title', e.target.value)}
                          placeholder="Örn: Nikah Töreni"
                          className="h-9"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Açıklama</Label>
                        <Input
                          value={event.description}
                          onChange={(e) => updateTimelineEvent(index, 'description', e.target.value)}
                          placeholder="Örn: Resmi nikah"
                          className="h-9"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={addTimelineEvent}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Etkinlik Ekle
                </Button>
              </CardContent>
            </Card>

            {/* Slug / Link */}
            {invitation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  Davetiye Linki
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Kısa Adı</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 whitespace-nowrap">/i/</span>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => {
                        const value = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-\u00e7\u011f\u0131\u00f6\u015f\u00fc]/g, '-')
                          .replace(/-+/g, '-')
                          .replace(/^-|-$/g, '')
                        handleChange('slug', value)
                      }}
                      placeholder="davetiye-linki"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Davetiyenizin paylaşım linki: <span className="font-medium text-indigo-600">/i/{formData.slug || 'davetiye-linki'}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Submit Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Önizlemeyi Gizle' : 'Önizle'}
          </Button>
          <Button type="submit" className="flex items-center gap-2 flex-1 sm:flex-none">
            <Save className="w-4 h-4" />
            {invitation ? 'Güncelle' : 'Oluştur'}
          </Button>
        </div>
      </form>

      {/* Preview - iPhone Pro Max at 75% scale */}
      <div className={`${showPreview || 'hidden xl:block'}`}>
        <div className="sticky top-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Canlı Önizleme
          </h3>
          <div
            className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-4"
            style={{ width: '730px', height: '1440px' }}
          >
            <InvitationPreview data={formData} />
          </div>
        </div>
      </div>
    </div>
  )
}
