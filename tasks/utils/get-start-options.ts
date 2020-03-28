export type TStartOptions = {
  file?: string,
  auto?: {
    shouldMakeGitTags?: boolean,
    shouldMakeGitHubReleases?: boolean,
    shouldSendSlackMessage?: boolean,
    shouldSendTelegramMessage?: boolean,
    shouldWriteChangelogFiles?: boolean,
  },
}

export const getStartOptions = async () => {
  const path = await import('path')
  const { start } = await import(path.resolve('./package.json'))

  return start as TStartOptions
}
