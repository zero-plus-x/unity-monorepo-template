import plugin from '@start/plugin'

const PORT = 4873

const runVerdaccio = plugin('run-verdaccio', () => async () => {
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

export const runNpm = () => plugin<{}, any>('run-npm', ({ reporter }) => async () => {
  const { default: sequence } = await import('@start/plugin-sequence')
  const { waitForPort } = await import('./wait-for-port')

  return sequence(
    runVerdaccio,
    waitForPort(PORT)
  )(reporter)()
})
