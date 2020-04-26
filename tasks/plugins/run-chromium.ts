import plugin from '@start/plugin'
import { waitForPort } from './wait-for-port'

const CHROMIUM_VERSION = 79
const PORT = 9222

export const runChromium = plugin('run-chromium', ({ reporter }) => async () => {
  const { default: execa } = await import('execa')

  await execa('docker', ['stop', 'chromium-headless-remote'], {
    reject: false,
  })

  await execa(
    'docker',
    [
      'run',
      '-d',
      '--rm',
      '-p',
      `${PORT}:${PORT}`,
      '--name',
      'chromium-headless-remote',
      `deepsweet/chromium-headless-remote:${CHROMIUM_VERSION}`,
    ],
    {
      stdout: process.stdout,
      stderr: process.stderr,
    }
  )

  // Run Chrome locally
  // execa(
  //   '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  //   [
  //     '--remote-debugging-port=9222',
  //     '--auto-open-devtools-for-tabs',
  //     '--ignore-certificate-errors',
  //     '--ignore-certificate-errors-spki-list',
  //     '--disable-setuid-sandbox',
  //     '--no-sandbox',
  //     '-incognito',
  //   ]
  // )

  await (await waitForPort(PORT, 'json'))(reporter)()
})
