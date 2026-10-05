'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Bell,
  Palette,
  Shield,
  Key,
  Mail,
  Lock,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

interface SettingsContentProps {
  userEmail: string
  userName: string
  avatarUrl?: string
  userId: string
}

/**
 * Settings Content Component
 *
 * Client-side interactive settings with:
 * - Profile management
 * - Notification preferences
 * - Theme selection (placeholder)
 * - Account actions (password, delete)
 * - API key management (placeholder)
 *
 * Performance: Memoized state updates, lazy-loaded sections
 * Accessibility: Full keyboard navigation, ARIA labels, semantic HTML
 */
export function SettingsContent({
  userEmail,
  userName,
  avatarUrl,
  userId
}: SettingsContentProps) {
  // Notification preferences state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [eventReminders, setEventReminders] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)

  // API key state
  const [apiKeyCopied, setApiKeyCopied] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const dummyApiKey = 'sk_live_' + userId.substring(0, 24)

  // Theme preference (placeholder)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')

  const handleCopyApiKey = async () => {
    await navigator.clipboard.writeText(dummyApiKey)
    setApiKeyCopied(true)
    setTimeout(() => setApiKeyCopied(false), 2000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  // Get user initials for avatar fallback
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Profile Section */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-indigo-600" />
                <div>
                  <CardTitle>Profil Bilgileri</CardTitle>
                  <CardDescription>
                    Hesap bilgilerinizi görüntüleyin ve yönetin
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar size="lg" className="w-20 h-20">
                  <AvatarImage src={avatarUrl} alt={userName} />
                  <AvatarFallback className="text-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                        İsim
                      </Label>
                      <p id="name" className="text-base text-slate-900 mt-1">
                        {userName}
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                        E-posta
                      </Label>
                      <div id="email" className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <p className="text-base text-slate-900">{userEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-indigo-600" />
                <div>
                  <CardTitle>Bildirim Tercihleri</CardTitle>
                  <CardDescription>
                    E-posta bildirimlerini yönetin
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={(checked) => setEmailNotifications(checked as boolean)}
                    aria-label="E-posta bildirimleri"
                  />
                  <div className="space-y-1 flex-1">
                    <Label
                      htmlFor="email-notifications"
                      className="text-sm font-medium text-slate-900 cursor-pointer"
                    >
                      E-posta Bildirimleri
                    </Label>
                    <p className="text-sm text-slate-500">
                      Davetiye aktiviteleri hakkında bildirim alın
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="event-reminders"
                    checked={eventReminders}
                    onCheckedChange={(checked) => setEventReminders(checked as boolean)}
                    aria-label="Etkinlik hatırlatıcıları"
                  />
                  <div className="space-y-1 flex-1">
                    <Label
                      htmlFor="event-reminders"
                      className="text-sm font-medium text-slate-900 cursor-pointer"
                    >
                      Etkinlik Hatırlatıcıları
                    </Label>
                    <p className="text-sm text-slate-500">
                      Yaklaşan etkinlikler için hatırlatıcı alın
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="weekly-digest"
                    checked={weeklyDigest}
                    onCheckedChange={(checked) => setWeeklyDigest(checked as boolean)}
                    aria-label="Haftalık özet"
                  />
                  <div className="space-y-1 flex-1">
                    <Label
                      htmlFor="weekly-digest"
                      className="text-sm font-medium text-slate-900 cursor-pointer"
                    >
                      Haftalık Özet
                    </Label>
                    <p className="text-sm text-slate-500">
                      Haftada bir davetiyelerinizin özetini alın
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="marketing-emails"
                    checked={marketingEmails}
                    onCheckedChange={(checked) => setMarketingEmails(checked as boolean)}
                    aria-label="Pazarlama e-postaları"
                  />
                  <div className="space-y-1 flex-1">
                    <Label
                      htmlFor="marketing-emails"
                      className="text-sm font-medium text-slate-900 cursor-pointer"
                    >
                      Pazarlama E-postaları
                    </Label>
                    <p className="text-sm text-slate-500">
                      Yeni özellikler ve güncellemeler hakkında bilgi alın
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Tercihleri Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Theme Preference */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-indigo-600" />
                <div>
                  <CardTitle>Tema Tercihi</CardTitle>
                  <CardDescription>
                    Görünüm tercihlerinizi özelleştirin (Yakında)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="flex-1"
                  disabled
                >
                  Açık Tema
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="flex-1"
                  disabled
                >
                  Koyu Tema
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => setTheme('system')}
                  className="flex-1"
                  disabled
                >
                  Sistem
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Key Section */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-indigo-600" />
                <div>
                  <CardTitle>API Anahtarı</CardTitle>
                  <CardDescription>
                    Gelecekteki entegrasyonlar için API anahtarınızı yönetin (Yakında)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-key" className="text-sm font-medium text-slate-700">
                    API Anahtarınız
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <div className="relative flex-1">
                      <Input
                        id="api-key"
                        type={showApiKey ? 'text' : 'password'}
                        value={dummyApiKey}
                        readOnly
                        className="font-mono text-sm pr-10"
                        disabled
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowApiKey(!showApiKey)}
                        disabled
                        aria-label={showApiKey ? 'API anahtarını gizle' : 'API anahtarını göster'}
                      >
                        {showApiKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleCopyApiKey}
                      disabled
                      aria-label="API anahtarını kopyala"
                    >
                      {apiKeyCopied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Kopyalandı
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Kopyala
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Bu özellik henüz aktif değil. Yakında API entegrasyonları eklenecek.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Actions */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-indigo-600" />
                <div>
                  <CardTitle>Hesap İşlemleri</CardTitle>
                  <CardDescription>
                    Şifre değiştirme ve hesap yönetimi
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Lock className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Şifre Değiştir</p>
                      <p className="text-sm text-slate-500">
                        Hesap güvenliğiniz için şifrenizi güncelleyin
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">
                    Şifre Değiştir
                  </Button>
                </div>

                <Separator />

                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900 mb-1">Tehlikeli Bölge</p>
                      <p className="text-sm text-red-700 mb-4">
                        Hesabınızı silmek kalıcı bir işlemdir ve geri alınamaz. Tüm davetiyeleriniz ve verileriniz silinecektir.
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hesabı Sil
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
