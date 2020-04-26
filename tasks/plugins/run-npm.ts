import plugin from '@start/plugin'

export const PORT = 4873

export const runNpm = () => plugin<{}, any>('run-npm', () => async () => {
  const { default: execa } = await import('execa')
  const configPath = require.resolve('../config/verdaccio.yml')

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  execa(
    'docker',
    [
      'run',
      '--rm',
      '--name',
      'npm',
      '-p',
      `${PORT}:${PORT}`,
      '-v',
      `${configPath}:/verdaccio/conf/config.yaml`,
      'verdaccio/verdaccio',
    ],
    {
      stdout: process.stdout,
      stderr: process.stderr,
    }
  )
})
