import { teams2026Config } from './teams2026.config'

export function getCartonImageUrl(variant: number, tokenId?: bigint): string {
  let index: number
  if (variant > 0) {
    index = variant - 1
  } else if (tokenId !== undefined) {
    index = Number(tokenId % BigInt(teams2026Config.length))
  } else {
    return ''
  }
  const team = teams2026Config[index]
  if (!team) return ''
  return `https://cdn.jsdelivr.net/npm/flag-icons@7.5.0/flags/4x3/${team.flag}.svg`
}
