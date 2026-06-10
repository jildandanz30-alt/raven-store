const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

interface DiscordField {
  name: string
  value: string
  inline?: boolean
}

interface DiscordEmbed {
  title: string
  description?: string
  color?: number
  fields?: DiscordField[]
}

export async function sendDiscordEmbed(embed: DiscordEmbed) {
  if (!WEBHOOK_URL) return
  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    })
  } catch (e) {
    console.error('[Discord]', e)
  }
}

export async function sendDiscordNotification(embed: DiscordEmbed) {
  return sendDiscordEmbed(embed)
}

export async function sendAdminAlert(message: string) {
  return sendDiscordEmbed({ title: '⚠️ Admin Alert', description: message, color: 0xff4444 })
}
