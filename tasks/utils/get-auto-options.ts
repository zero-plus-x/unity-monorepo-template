import { TBumpType } from '@auto/utils'

export type TAutoOptions = {
  initialType: TBumpType,
  autoNamePrefix: string,
  zeroBreakingChangeType: TBumpType,
  npm?: {
    publishSubDirectory?: string,
    registry?: string,
    access?: 'restricted' | 'public',
  },
  shouldAlwaysBumpDependents: boolean,
  shouldMakeGitTags: boolean,
  shouldMakeGitHubReleases: boolean,
  shouldSendSlackMessage: boolean,
  shouldSendTelegramMessage: boolean,
  shouldWriteChangelogFiles: boolean,
}

export const getAutoOptions = async () => {
  const path = await import('path')
  const { auto } = await import(path.resolve('./package.json'))

  return auto as TAutoOptions
}
