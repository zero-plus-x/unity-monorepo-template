import sequence from '@start/plugin-sequence'
import { TGithubOptions, TSlackOptions, TTelegramOptions } from '@auto/log'
import { TGitOptions } from '@auto/git'
import { TWorkspacesOptions } from '@auto/utils'
import { TBumpOptions } from '@auto/bump'
import { TNpmOptions } from '@auto/npm'

export const runVerdaccio = async () => {
  const path = await import('path')
  const { runVerdaccio } = await import('./plugins/run-verdaccio')
  const { waitForPort } = await import('./plugins/wait-for-port')

  const configPath = path.resolve('tasks/config/verdaccio.yml')

  return sequence(
    runVerdaccio(configPath),
    waitForPort('4873')
  )
}


export const publish = async () => {
  const {
    getPackagesBumps,
    publishPrompt,
    writePackagesDependencies,
    writeDependenciesCommit,
    writePackageVersions,
    publishPackagesBumps,
    pushCommitsAndTags,
    writePublishTags,
    makeGithubReleases,
    sendSlackMessage,
    sendTelegramMessage,
    writeChangelogFiles,
  } = await import('@auto/start-plugin')
  const { getAutoOptions } = await import('./utils/get-auto-options')
  const {
    initialType,
    autoNamePrefix,
    zeroBreakingChangeType,
    npm,
    shouldAlwaysBumpDependents = false,
    shouldMakeGitTags = false,
    shouldMakeGitHubReleases = false,
    shouldSendSlackMessage = false,
    shouldSendTelegramMessage = false,
    shouldWriteChangelogFiles = false,
  } = await getAutoOptions()
  const { writePublishCommit } = await import('./plugins/write-publish-commit')
  const { prefixes } = await import('./config/auto')

  const npmOptions: TNpmOptions = npm || {}
  const workspacesOptions: TWorkspacesOptions = {
    autoNamePrefix,
  }
  const bumpOptions: TBumpOptions = {
    zeroBreakingChangeType,
    shouldAlwaysBumpDependents,
  }
  const gitOptions: TGitOptions = {
    initialType,
  }
  const githubOptions: TGithubOptions = {
    token: process.env.AUTO_GITHUB_TOKEN as string,
    username: process.env.AUTO_GITHUB_USERNAME as string,
    repo: process.env.AUTO_GITHUB_REPO as string,
  }
  const slackOptions: TSlackOptions = {
    token: process.env.AUTO_SLACK_TOKEN as string,
    channel: process.env.AUTO_SLACK_CHANNEL as string,
    username: process.env.AUTO_SLACK_USERNAME as string,
    iconEmoji: process.env.AUTO_SLACK_ICON_EMOJI as string,
    colors: {
      major: process.env.AUTO_SLACK_COLOR_MAJOR as string,
      minor: process.env.AUTO_SLACK_COLOR_MINOR as string,
      patch: process.env.AUTO_SLACK_COLOR_PATCH as string,
    },
  }
  const telegramOptions: TTelegramOptions = {
    token: process.env.AUTO_TELEGRAM_TOKEN as string,
    chatId: process.env.AUTO_TELEGRAM_CHAT_ID as string,
  }

  return sequence(
    getPackagesBumps(prefixes, gitOptions, bumpOptions, workspacesOptions),
    publishPrompt(prefixes),
    writePackagesDependencies,
    writeDependenciesCommit(prefixes),
    writePackageVersions,
    shouldWriteChangelogFiles && writeChangelogFiles(prefixes),
    writePublishCommit(prefixes, workspacesOptions),
    shouldMakeGitTags && writePublishTags(workspacesOptions),
    publishPackagesBumps(npmOptions),
    pushCommitsAndTags,
    shouldMakeGitHubReleases && makeGithubReleases(prefixes, workspacesOptions, githubOptions),
    shouldSendSlackMessage && sendSlackMessage(prefixes, workspacesOptions, slackOptions),
    shouldSendTelegramMessage && sendTelegramMessage(prefixes, workspacesOptions, telegramOptions)
  )
}
