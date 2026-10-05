'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Sparkles,
  Heart,
  Calendar,
  Mail,
  Palette,
  Users,
  ChevronRight,
  Check,
  Star,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const features = [
  {
    icon: Palette,
    title: 'Profesyonel Tasarımlar',
    description: 'Düğün, doğum günü, nişan ve daha fazlası için özel hazırlanmış şablonlar.'
  },
  {
    icon: Sparkles,
    title: 'Etkileyici Animasyonlar',
    description: 'Misafirlerinizi büyüleyen göz alıcı animasyonlar ve geçiş efektleri.'
  },
  {
    icon: Calendar,
    title: 'Geri Sayım',
    description: 'Özel gününüze kalan süreyi canlı olarak gösteren sayaç.'
  },
  {
    icon: Mail,
    title: 'E-posta ile Paylaşım',
    description: 'Davetiyelerinizi tek tıkla misafirlerinize e-posta ile gönderin.'
  },
  {
    icon: Users,
    title: 'RSVP Yönetimi',
    description: 'Katılımcılarınızı kolayca takip edin ve yönetin.'
  },
  {
    icon: Heart,
    title: 'Kişiselleştirme',
    description: 'Renkler, yazı tipleri ve içeriklerle davetiyenizi özelleştirin.'
  }
]

const plans = [
  {
    name: 'Ücretsiz',
    price: '0',
    description: 'Başlamak için ideal',
    features: [
      '1 Davetiye',
      'Temel Şablonlar',
      'RSVP Takibi',
      'Paylaşım Linki'
    ],
    cta: 'Ücretsiz Başla',
    popular: false
  },
  {
    name: 'Premium',
    price: '99',
    description: 'Tüm özellikler dahil',
    features: [
      'Sınırsız Davetiye',
      'Premium Şablonlar',
      'E-posta Bildirimleri',
      'Özel Alan Adı',
      'Müzik Ekleme',
      'Video Arka Plan',
      'Öncelikli Destek'
    ],
    cta: 'Premium Ol',
    popular: true
  },
  {
    name: 'Kurumsal',
    price: 'İletişim',
    description: 'Büyük etkinlikler için',
    features: [
      'Tüm Premium Özellikler',
      'Özel Tasarım',
      'API Erişimi',
      'Çoklu Kullanıcı',
      'Dedicated Destek'
    ],
    cta: 'İletişime Geç',
    popular: false
  }
]

const testimonials = [
  {
    name: 'Elif & Murat',
    event: 'Düğün',
    quote: 'Düğün davetiyemiz çok şık oldu. Misafirlerimiz bayıldı!',
    rating: 5
  },
  {
    name: 'Ayşe Yılmaz',
    event: 'Doğum Günü',
    quote: 'Oğlumun doğum günü partisi için mükemmel bir davetiye hazırladık.',
    rating: 5
  },
  {
    name: 'Mehmet & Zeynep',
    event: 'Nişan',
    quote: 'Modern ve zarif tasarım tam aradığımız gibiydi.',
    rating: 5
  }
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">
                Sanal<span className="text-indigo-600">Davetiye</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
                Özellikler
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
                Fiyatlar
              </a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">
                Yorumlar
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25">
                  Ücretsiz Başla
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>Türkiye&apos;nin En Zarif Dijital Davetiyeleri</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6"
            >
              Özel Günleriniz İçin{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                Büyüleyici
              </span>{' '}
              Dijital Davetiyeler
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto"
            >
              Düğün, nişan, doğum günü ve tüm özel anlarınız için saniyeler içinde
              profesyonel dijital davetiyeler oluşturun.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/30 transition-all hover:scale-105"
                >
                  Ücretsiz Davetiye Oluştur
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-6 text-lg border-2"
                >
                  Nasıl Çalışır?
                </Button>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center gap-8 sm:gap-16 mt-16 pt-8 border-t border-slate-200"
            >
              {[
                { value: '10,000+', label: 'Davetiye Oluşturuldu' },
                { value: '50,000+', label: 'Mutlu Misafir' },
                { value: '4.9/5', label: 'Kullanıcı Puanı' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50 border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 aspect-video max-w-5xl mx-auto">
              {/* Mock Preview */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-script text-slate-700">Elif & Murat</h3>
                  <p className="text-slate-500 mt-2">Evleniyoruz</p>
                  <p className="text-sm text-slate-400 mt-4">15 Haziran 2025</p>
                </div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 left-10 w-4 h-4 rounded-full bg-pink-400"
              />
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-20 right-20 w-3 h-3 rounded-full bg-indigo-400"
              />
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-20 left-20 w-5 h-5 rounded-full bg-purple-400"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Neden Sanal Davetiye?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Özel günlerinizi unutulmaz kılacak tüm araçlar elinizin altında.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Basit ve Şeffaf Fiyatlandırma
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              İhtiyaçlarınıza uygun planı seçin, gizli ücret yok.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-500/30 scale-105'
                    : 'bg-white border border-slate-200 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium rounded-full shadow-lg">
                    En Popüler
                  </div>
                )}

                <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price === 'İletişim' ? '' : '₺'}{plan.price}
                  </span>
                  {plan.price !== 'İletişim' && (
                    <span className={plan.popular ? 'text-indigo-100' : 'text-slate-500'}>/ay</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <Check className={`w-5 h-5 ${plan.popular ? 'text-indigo-200' : 'text-indigo-600'}`} />
                      <span className={plan.popular ? 'text-indigo-50' : 'text-slate-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/login">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                    }`}
                  >
                    {plan.cta}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Kullanıcılarımız Ne Diyor?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Binlerce mutlu çiftten ve aileden gelen yorumlar.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.event}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl shadow-indigo-500/30"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto">
            Ücretsiz hesap oluşturun ve dakikalar içinde ilk davetiyenizi hazırlayın.
          </p>
          <Link href="/login">
            <Button
              size="lg"
              className="px-8 py-6 text-lg bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl transition-all hover:scale-105"
            >
              Ücretsiz Kaydol
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">
                Sanal<span className="text-indigo-600">Davetiye</span>
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-900 transition-colors">Gizlilik Politikası</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Kullanım Şartları</a>
              <a href="#" className="hover:text-slate-900 transition-colors">İletişim</a>
            </div>

            <p className="text-sm text-slate-500">
              © 2025 sanaldavetiye.com.tr. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
