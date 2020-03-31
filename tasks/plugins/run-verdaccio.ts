import { TReadonly } from 'tsfn'
import plugin from '@start/plugin'
import { THookProps } from '@auto/core'

const PORT = 4873

export const runVerdaccio = (configPath: string) =>
  plugin<TReadonly<THookProps>, any>('run-verdaccio', () => async () => {
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
