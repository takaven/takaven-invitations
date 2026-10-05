import { Resend } from 'resend'

// Keep email optional for local/demo environments. RSVP persistence must not
// fail during module evaluation just because transactional email is absent.
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

// Default from address - will need to be verified domain
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@sanaldavetiye.com.tr'
const FROM_NAME = 'Sanal Davetiye'

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (!resend) {
    console.warn('RESEND_API_KEY not set, skipping email')
    return { success: false, error: 'API key not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || subject
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

// Send RSVP confirmation email
export async function sendRSVPConfirmation({
  to,
  guestName,
  invitationTitle,
  eventDate,
  eventTime,
  locationName,
  attending
}: {
  to: string
  guestName: string
  invitationTitle: string
  eventDate: string
  eventTime?: string
  locationName?: string
  attending: boolean
}) {
  const formattedDate = new Date(eventDate).toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const subject = attending
    ? `${invitationTitle} - Katılımınız Onaylandı`
    : `${invitationTitle} - Yanıtınız Alındı`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px 16px 0 0; padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 300;">
            ${attending ? 'Harika!' : 'Teşekkürler!'}
          </h1>
          <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
            ${attending ? 'Sizi aramızda görmek için sabırsızlanıyoruz' : 'Yanıtınız için teşekkür ederiz'}
          </p>
        </div>

        <div style="background: white; border-radius: 0 0 16px 16px; padding: 40px 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="margin: 0 0 20px; color: #333; font-size: 16px;">
            Merhaba <strong>${guestName}</strong>,
          </p>

          <p style="margin: 0 0 30px; color: #666; font-size: 15px; line-height: 1.6;">
            ${attending
              ? `<strong>"${invitationTitle}"</strong> etkinliğine katılacağınızı bildirdiğiniz için teşekkür ederiz.`
              : `<strong>"${invitationTitle}"</strong> etkinliğine yanıt verdiğiniz için teşekkür ederiz.`
            }
          </p>

          ${attending ? `
          <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 20px; color: #333; font-size: 18px;">Etkinlik Detayları</h3>

            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 5px; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Tarih</p>
              <p style="margin: 0; color: #333; font-size: 16px; font-weight: 500;">${formattedDate}</p>
            </div>

            ${eventTime ? `
            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 5px; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Saat</p>
              <p style="margin: 0; color: #333; font-size: 16px; font-weight: 500;">${eventTime}</p>
            </div>
            ` : ''}

            ${locationName ? `
            <div>
              <p style="margin: 0 0 5px; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Konum</p>
              <p style="margin: 0; color: #333; font-size: 16px; font-weight: 500;">${locationName}</p>
            </div>
            ` : ''}
          </div>
          ` : ''}

          <p style="margin: 0; color: #999; font-size: 14px; text-align: center;">
            Sevgilerle,<br>
            <strong style="color: #667eea;">Sanal Davetiye</strong>
          </p>
        </div>

        <p style="margin: 30px 0 0; color: #999; font-size: 12px; text-align: center;">
          Bu e-posta ${invitationTitle} davetiyesi için gönderilmiştir.
        </p>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}

// Send invitation published notification to owner
export async function sendInvitationPublishedNotification({
  to,
  invitationTitle,
  invitationUrl
}: {
  to: string
  invitationTitle: string
  invitationUrl: string
}) {
  const subject = `Davetiyeniz Yayınlandı: ${invitationTitle}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 16px 16px 0 0; padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 300;">
            Tebrikler!
          </h1>
          <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
            Davetiyeniz başarıyla yayınlandı
          </p>
        </div>

        <div style="background: white; border-radius: 0 0 16px 16px; padding: 40px 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="margin: 0 0 20px; color: #333; font-size: 16px;">
            <strong>"${invitationTitle}"</strong> davetiyeniz artık yayında!
          </p>

          <p style="margin: 0 0 30px; color: #666; font-size: 15px; line-height: 1.6;">
            Artık misafirlerinizle paylaşabilirsiniz. Aşağıdaki bağlantıyı kopyalayıp arkadaşlarınıza ve ailenize gönderin.
          </p>

          <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 30px; text-align: center;">
            <p style="margin: 0 0 15px; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Davetiye Linkiniz</p>
            <a href="${invitationUrl}" style="color: #667eea; font-size: 16px; word-break: break-all; text-decoration: none;">
              ${invitationUrl}
            </a>
          </div>

          <div style="text-align: center;">
            <a href="${invitationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 40px; border-radius: 30px; font-weight: 500; font-size: 16px;">
              Davetiyeyi Görüntüle
            </a>
          </div>
        </div>

        <p style="margin: 30px 0 0; color: #999; font-size: 12px; text-align: center;">
          Bu e-posta Sanal Davetiye hesabınız için gönderilmiştir.
        </p>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}

// Send invitation share email
export async function sendInvitationShareEmail({
  to,
  senderName,
  invitationTitle,
  invitationUrl,
  message
}: {
  to: string
  senderName: string
  invitationTitle: string
  invitationUrl: string
  message?: string
}) {
  const subject = `${senderName} sizi davet ediyor: ${invitationTitle}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px 16px 0 0; padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 300;">
            Davetlisiniz!
          </h1>
          <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
            ${senderName} sizi özel bir etkinliğe davet ediyor
          </p>
        </div>

        <div style="background: white; border-radius: 0 0 16px 16px; padding: 40px 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px; color: #333; font-size: 24px; font-weight: 500;">
              ${invitationTitle}
            </h2>
          </div>

          ${message ? `
          <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 30px; border-radius: 0 12px 12px 0;">
            <p style="margin: 0; color: #666; font-size: 15px; font-style: italic; line-height: 1.6;">
              "${message}"
            </p>
            <p style="margin: 15px 0 0; color: #999; font-size: 14px;">
              - ${senderName}
            </p>
          </div>
          ` : ''}

          <div style="text-align: center;">
            <a href="${invitationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 50px; border-radius: 30px; font-weight: 500; font-size: 18px;">
              Davetiyeyi Görüntüle
            </a>
          </div>

          <p style="margin: 30px 0 0; color: #999; font-size: 14px; text-align: center;">
            Davetiyeyi görüntüleyerek katılım durumunuzu bildirebilirsiniz.
          </p>
        </div>

        <p style="margin: 30px 0 0; color: #999; font-size: 12px; text-align: center;">
          Bu e-posta Sanal Davetiye üzerinden gönderilmiştir.
        </p>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}

// Send new RSVP notification to invitation owner
export async function sendNewRSVPNotification({
  to,
  invitationTitle,
  guestName,
  guestEmail,
  attending,
  guestCount,
  message,
  dashboardUrl
}: {
  to: string
  invitationTitle: string
  guestName: string
  guestEmail?: string
  attending: boolean
  guestCount?: number
  message?: string
  dashboardUrl: string
}) {
  const subject = `Yeni RSVP: ${guestName} - ${invitationTitle}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, ${attending ? '#11998e, #38ef7d' : '#eb3349, #f45c43'}); border-radius: 16px 16px 0 0; padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 300;">
            Yeni RSVP Yanıtı
          </h1>
          <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
            ${invitationTitle}
          </p>
        </div>

        <div style="background: white; border-radius: 0 0 16px 16px; padding: 40px 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: ${attending ? '#d4edda' : '#f8d7da'}; border-radius: 12px; padding: 20px; margin-bottom: 25px; text-align: center;">
            <p style="margin: 0; color: ${attending ? '#155724' : '#721c24'}; font-size: 18px; font-weight: 500;">
              ${attending ? 'Katılacak' : 'Katılamayacak'}
            </p>
          </div>

          <div style="margin-bottom: 25px;">
            <p style="margin: 0 0 5px; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Misafir</p>
            <p style="margin: 0; color: #333; font-size: 18px; font-weight: 500;">${guestName}</p>
            ${guestEmail ? `<p style="margin: 5px 0 0; color: #666; font-size: 14px;">${guestEmail}</p>` : ''}
          </div>

          ${attending && guestCount && guestCount > 1 ? `
          <div style="margin-bottom: 25px;">
            <p style="margin: 0 0 5px; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Kişi Sayısı</p>
            <p style="margin: 0; color: #333; font-size: 16px;">${guestCount} kişi</p>
          </div>
          ` : ''}

          ${message ? `
          <div style="margin-bottom: 25px;">
            <p style="margin: 0 0 5px; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Mesaj</p>
            <p style="margin: 0; color: #666; font-size: 15px; font-style: italic;">"${message}"</p>
          </div>
          ` : ''}

          <div style="text-align: center; margin-top: 30px;">
            <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 40px; border-radius: 30px; font-weight: 500; font-size: 16px;">
              Tüm Yanıtları Görüntüle
            </a>
          </div>
        </div>

        <p style="margin: 30px 0 0; color: #999; font-size: 12px; text-align: center;">
          Bu e-posta Sanal Davetiye hesabınız için gönderilmiştir.
        </p>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}
