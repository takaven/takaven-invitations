'use client'

import { useState } from 'react'
import { Header } from '@/components/dashboard/header'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle,
  ChevronDown,
  Mail,
  Book,
  Play,
  MessageSquare,
  FileText,
  Palette,
  Share2,
  Users,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Send,
  Phone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

// FAQ Data Structure
interface FAQItem {
  question: string
  answer: string
  icon: typeof HelpCircle
}

const faqData: FAQItem[] = [
  {
    question: 'Nasıl davetiye oluşturabilirim?',
    answer: 'Dashboard sayfasında "Davetiye Oluştur" butonuna tıklayın. Ardından etkinlik türünüzü seçin (düğün, doğum günü, mezuniyet vb.), davetiye bilgilerinizi girin ve bir tema seçin. Canlı önizleme ile tasarımınızı görüntüleyebilir ve istediğiniz zaman düzenleyebilirsiniz. Tasarımınızdan memnun kaldığınızda, "Yayınla" butonuna tıklayarak davetiyenizi paylaşıma açabilirsiniz.',
    icon: FileText
  },
  {
    question: 'Temaları nasıl özelleştirebilirim?',
    answer: 'Davetiye düzenleme sayfasında "Tema" sekmesine gidin. Burada hazır temalardan birini seçebilir veya kendi renk paletinizi oluşturabilirsiniz. Renk şemaları, yazı tipleri, arka plan görselleri ve dekoratif öğeleri özelleştirebilirsiniz. Tüm değişiklikler anlık olarak önizlemede görünür. Ayrıca, kendi logonuzu veya özel görsellerinizi yükleyebilirsiniz.',
    icon: Palette
  },
  {
    question: 'Davetiyemi nasıl paylaşabilirim?',
    answer: 'Davetiyenizi yayınladıktan sonra, benzersiz bir paylaşım linki oluşturulur. Bu linki WhatsApp, SMS, e-posta veya sosyal medya üzerinden paylaşabilirsiniz. Ayrıca QR kod oluşturarak basılı davetiyelerinize ekleyebilirsiniz. Davetiye kartınızdaki "Paylaş" butonuna tıklayarak tüm paylaşım seçeneklerine erişebilirsiniz. Misafirleriniz linke tıklayarak davetiyenizi görüntüleyebilir ve RSVP yapabilir.',
    icon: Share2
  },
  {
    question: 'RSVP\'leri nasıl yönetebilirim?',
    answer: 'Her davetiyenin kendi RSVP yönetim paneli bulunmaktadır. Davetiye kartınızda "RSVP\'ler" bölümüne tıklayarak tüm yanıtları görüntüleyebilirsiniz. Katılacak, katılamayacak ve bekleyen yanıtları filtreleyebilir, misafir listesini Excel formatında indirebilir ve toplu e-posta gönderebilirsiniz. Her RSVP için misafir sayısı, özel istekler ve iletişim bilgilerini görebilirsiniz.',
    icon: Users
  },
  {
    question: 'Sık karşılaşılan sorunlar ve çözümleri',
    answer: 'Davetiyeniz yüklenmiyorsa, tarayıcınızın önbelleğini temizleyin veya gizli modda açmayı deneyin. Görsel yüklenme sorunlarında, dosya boyutunun 5MB\'ı geçmediğinden emin olun ve JPG veya PNG formatı kullanın. RSVP bildirimleri gelmiyorsa, e-posta ayarlarınızı ve spam klasörünüzü kontrol edin. Tasarım değişiklikleri görünmüyorsa sayfayı yenileyip önbelleği temizleyin. Sorun devam ederse, destek ekibimizle iletişime geçin.',
    icon: AlertCircle
  }
]

// Quick Start Guide Steps
interface QuickStartStep {
  title: string
  description: string
  icon: typeof Sparkles
}

const quickStartSteps: QuickStartStep[] = [
  {
    title: 'Hesap Oluşturun',
    description: 'E-posta adresinizle ücretsiz hesap oluşturun ve dashboard\'a erişim sağlayın.',
    icon: Mail
  },
  {
    title: 'Davetiye Türü Seçin',
    description: 'Düğün, doğum günü, mezuniyet veya özel etkinlik kategorisinden birini seçin.',
    icon: FileText
  },
  {
    title: 'Tema ve Tasarım',
    description: 'Hazır temalardan birini seçin veya kendi tasarımınızı oluşturun. Renkleri ve öğeleri özelleştirin.',
    icon: Palette
  },
  {
    title: 'Bilgileri Girin',
    description: 'Etkinlik detaylarını, tarih ve saat bilgilerini, konum ve diğer önemli bilgileri ekleyin.',
    icon: Book
  },
  {
    title: 'Yayınla ve Paylaş',
    description: 'Davetiyenizi yayınlayın ve paylaşım linkini misafirlerinize gönderin. RSVP\'leri takip edin.',
    icon: Share2
  }
]

// Video Tutorial Data
interface VideoTutorial {
  title: string
  description: string
  duration: string
  thumbnail: string
}

const videoTutorials: VideoTutorial[] = [
  {
    title: 'İlk Davetiyenizi Oluşturma',
    description: 'Adım adım ilk davetiyenizi nasıl oluşturacağınızı öğrenin',
    duration: '5:30',
    thumbnail: 'beginner'
  },
  {
    title: 'Gelişmiş Tema Özelleştirme',
    description: 'Profesyonel görünümlü temalar için özelleştirme ipuçları',
    duration: '8:15',
    thumbnail: 'advanced'
  },
  {
    title: 'RSVP Yönetimi',
    description: 'Misafir yanıtlarını takip etme ve yönetme stratejileri',
    duration: '6:45',
    thumbnail: 'rsvp'
  },
  {
    title: 'Mobil Optimizasyon',
    description: 'Davetiyenizin tüm cihazlarda mükemmel görünmesini sağlayın',
    duration: '4:20',
    thumbnail: 'mobile'
  }
]

// Documentation Links
interface DocLink {
  title: string
  description: string
  icon: typeof Book
  href: string
}

const documentationLinks: DocLink[] = [
  {
    title: 'Başlangıç Kılavuzu',
    description: 'Platform hakkında temel bilgiler ve ilk adımlar',
    icon: Book,
    href: '/docs/getting-started'
  },
  {
    title: 'Tema Dokümantasyonu',
    description: 'Tema sistemini kullanma ve özelleştirme rehberi',
    icon: Palette,
    href: '/docs/themes'
  },
  {
    title: 'API Referansı',
    description: 'Geliştiriciler için API dokümantasyonu ve entegrasyon',
    icon: FileText,
    href: '/docs/api'
  },
  {
    title: 'En İyi Uygulamalar',
    description: 'Profesyonel davetiyeler için tasarım ve içerik önerileri',
    icon: Sparkles,
    href: '/docs/best-practices'
  }
]

// FAQ Accordion Component
function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  const Icon = item.icon

  return (
    <motion.div
      className="bg-white border border-slate-200 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          <div className="p-2 bg-indigo-100 rounded-lg shrink-0">
            <Icon className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-slate-900">{item.question}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-4 pt-0">
              <p className="text-slate-600 leading-relaxed pl-11">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Quick Start Step Component
function QuickStartStepCard({ step, index }: { step: QuickStartStep; index: number }) {
  const Icon = step.icon

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
            {index + 1}
          </div>
          {index < quickStartSteps.length - 1 && (
            <div className="w-0.5 h-full bg-gradient-to-b from-indigo-200 to-purple-200 my-2" />
          )}
        </div>
        <div className="pb-8 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-900">{step.title}</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">{step.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

// Video Tutorial Card Component
function VideoTutorialCard({ tutorial, index }: { tutorial: VideoTutorial; index: number }) {
  return (
    <motion.div
      className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="relative aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-indigo-600 ml-1" />
          </div>
        </div>
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white">
          {tutorial.duration}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
          {tutorial.title}
        </h3>
        <p className="text-sm text-slate-600">{tutorial.description}</p>
      </div>
    </motion.div>
  )
}

// Documentation Link Card Component
function DocumentationLinkCard({ doc, index }: { doc: DocLink; index: number }) {
  const Icon = doc.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link
        href={doc.href}
        className="block p-6 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
              <Icon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                {doc.title}
              </h3>
              <p className="text-sm text-slate-600">{doc.description}</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0 mt-1" />
        </div>
      </Link>
    </motion.div>
  )
}

export default function HelpPage() {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    email: '',
    subject: '',
    message: ''
  })

  const handleFAQToggle = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index)
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Contact form submitted:', contactForm)
    // Reset form
    setContactForm({ email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Yardım Merkezi"
        description="Sıkça sorulan sorular, kılavuzlar ve destek"
      />

      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Size Nasıl Yardımcı Olabiliriz?</h2>
              </div>
              <p className="text-indigo-100 text-lg">
                Davetiye oluşturma sürecinizde size yardımcı olmak için buradayız.
                Aşağıdaki kaynaklardan yararlanabilir veya doğrudan bizimle iletişime geçebilirsiniz.
              </p>
            </div>
            <div className="shrink-0">
              <Button
                size="lg"
                variant="secondary"
                className="font-semibold"
                asChild
              >
                <Link href="/dashboard/create">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Hemen Başlayın
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Start Guide */}
        <section>
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Hızlı Başlangıç Kılavuzu</h2>
            <p className="text-slate-600">5 adımda ilk davetiyenizi oluşturun</p>
          </motion.div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            {quickStartSteps.map((step, index) => (
              <QuickStartStepCard key={index} step={step} index={index} />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Sıkça Sorulan Sorular</h2>
            <p className="text-slate-600">En çok merak edilen konular hakkında detaylı bilgiler</p>
          </motion.div>

          <div className="space-y-3">
            {faqData.map((item, index) => (
              <FAQAccordion
                key={index}
                item={item}
                isOpen={openFAQIndex === index}
                onToggle={() => handleFAQToggle(index)}
              />
            ))}
          </div>
        </section>

        {/* Video Tutorials */}
        <section>
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Video Eğitimler</h2>
                <p className="text-slate-600">Görsel rehberlerle adım adım öğrenin</p>
              </div>
              <Button variant="outline" className="hidden sm:flex">
                Tüm Videolar
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {videoTutorials.map((tutorial, index) => (
              <VideoTutorialCard key={index} tutorial={tutorial} index={index} />
            ))}
          </div>
        </section>

        {/* Documentation Links */}
        <section>
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Dokümantasyon</h2>
            <p className="text-slate-600">Detaylı kılavuzlar ve teknik dokümantasyon</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentationLinks.map((doc, index) => (
              <DocumentationLinkCard key={index} doc={doc} index={index} />
            ))}
          </div>
        </section>

        {/* Contact Support Section */}
        <section>
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Destek Ekibimizle İletişime Geçin</h2>
            <p className="text-slate-600">Sorunuz için yanıt bulamadınız mı? Size yardımcı olmaktan mutluluk duyarız</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    E-posta Adresi
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    Konu
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Mesajınızın konusu"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Lütfen sorununuzu veya sorunuzu detaylı bir şekilde açıklayın..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Send className="w-5 h-5 mr-2" />
                  Mesaj Gönder
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              {/* Email Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">E-posta Desteği</h3>
                <p className="text-sm text-slate-600 mb-3">
                  24 saat içinde size geri dönüş yapıyoruz
                </p>
                <a
                  href="mailto:destek@davetiye.com"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  destek@davetiye.com
                </a>
              </div>

              {/* Phone Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Telefon Desteği</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Hafta içi 09:00 - 18:00
                </p>
                <a
                  href="tel:+905551234567"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  +90 555 123 45 67
                </a>
              </div>

              {/* Live Chat Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Canlı Destek</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Anında yardım alın
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Sohbeti Başlat
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Additional Resources Banner */}
        <motion.div
          className="bg-white rounded-2xl border border-slate-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Book className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Daha Fazla Kaynak mı Arıyorsunuz?</h3>
                <p className="text-sm text-slate-600">
                  Blog yazılarımızda ipuçları, tasarım fikirleri ve öneriler bulabilirsiniz
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/blog">
                Blogu Ziyaret Edin
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
