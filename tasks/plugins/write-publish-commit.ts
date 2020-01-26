import path from 'path'
import execa from 'execa'
import plugin from '@start/plugin'
import { TGitBump, TPrefixes, TPackageBump, TWorkspacesOptions, removeAutoNamePrefix } from '@auto/utils'

export type TPluginData = {
  packagesBumps: TPackageBump[],
  gitBumps: TGitBump[],
}

export const writePublishCommit = (prefixes: TPrefixes, Options: TWorkspacesOptions) =>
  plugin<TPluginData, any>('writePublishCommit', ({ logMessage }) => async ({ packagesBumps }) => {
    const bumps = packagesBumps.filter((bump) => bump.type !== null && bump.version !== null)
    const names = bumps.map((bump) => removeAutoNamePrefix(bump.name, Options.autoNamePrefix)).join(', ')
    const addPaths = bumps.reduce((result, bump) => {
      result.push(path.join(bump.dir, 'package.json'))
      result.push(path.join(bump.dir, 'package.json.meta'))
      result.push(path.join(bump.dir, 'changelog.md'))
      result.push(path.join(bump.dir, 'changelog.md.meta'))

      return result
    }, [] as string[])

    if (bumps.length > 0) {
      await execa(
        'git',
        [
          'add',
          ...addPaths,
        ],
        {
          stdout: 'ignore',
          stderr: 'ignore',
        }
      )

      await execa(
        'git',
        [
          'commit',
          '-m',
          `${prefixes.required.publish.value} ${names}: release`,
        ],
        {
          stdout: 'ignore',
          stderr: 'ignore',
        }
      )
    }

    logMessage('write publish commit')
  })
