import plugin from '@start/plugin'
import { TGithubConfig } from '@auto/github'
import { TSlackConfig } from '@auto/slack'
import { TTelegramConfig } from '@auto/telegram'

export const publish = () => plugin('publish', ({ reporter, logMessage }) => async () => {
  const { auto } = await import('@auto/core')
  const { writePublishTags } = await import('@auto/tag')
  const { getStartOptions } = await import('../utils/get-start-options')
  const { concurrentHooks } = await import('../utils/concurrent-hooks')
  const {
    auto: {
      shouldWriteChangelogFiles = false,
      shouldMakeGitHubReleases = false,
      shouldSendSlackMessage = false,
      shouldSendTelegramMessage = false,
      shouldMakeGitTags = false,
    } = {},
  } = await getStartOptions()
  const { makeGithubReleases } = await import('@auto/github')
  const { sendSlackMessage } = await import('@auto/slack')
  const { sendTelegramMessage } = await import('@auto/telegram')

  const slackConfig: TSlackConfig = {
    token: process.env.AUTO_SLACK_TOKEN as string,
    channel: process.env.AUTO_SLACK_CHANNEL as string,
    username: process.env.AUTO_SLACK_USERNAME as string,
    iconEmoji: process.env.AUTO_SLACK_ICON_EMOJI as string,
    colors: {
      initial: process.env.AUTO_SLACK_COLOR_INITIAL as string,
      major: process.env.AUTO_SLACK_COLOR_MAJOR as string,
      minor: process.env.AUTO_SLACK_COLOR_MINOR as string,
      patch: process.env.AUTO_SLACK_COLOR_PATCH as string,
    },
  }
  const githubConfig: TGithubConfig = {
    token: process.env.AUTO_GITHUB_TOKEN as string,
    username: process.env.AUTO_GITHUB_USERNAME as string,
    repo: process.env.AUTO_GITHUB_REPO as string,
  }
  const telegramConfig: TTelegramConfig = {
    token: process.env.AUTO_TELEGRAM_TOKEN as string,
    chatId: process.env.AUTO_TELEGRAM_CHAT_ID as string,
  }

  try {
    await auto({
      prePublishCommit: async (props) => {
      // Write changelog files
        if (shouldWriteChangelogFiles) {
          const { writeChangelogFiles } = await import('@auto/changelog')

          await writeChangelogFiles(props)
        }
      },
      prePublish: async (props) => {
      // Prepare package
        const { forEachRelease } = await import('./for-each-release')
        const { preparePackage } = await import('./prepare-package')
        const taskRunner = await forEachRelease(preparePackage)

        await taskRunner(reporter)(props)
      },
      prePush: shouldMakeGitTags && writePublishTags,
      postPush: concurrentHooks(
        shouldMakeGitHubReleases && makeGithubReleases(githubConfig),
        shouldSendSlackMessage && sendSlackMessage(slackConfig),
        shouldSendTelegramMessage && sendTelegramMessage(telegramConfig)
      ),
    })
  } catch (e) {
    logMessage(e?.message)

    throw null
  }
})
