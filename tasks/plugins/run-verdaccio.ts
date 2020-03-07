import plugin from '@start/plugin'
import { TPluginData } from '@auto/start-plugin'

const PORT = 4873

export const runVerdaccio = (configPath: string) =>
  plugin<TPluginData, any>('run-verdaccio', () => async () => {
    const { default: execa } = await import('execa')

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
      ]
    )
  })
