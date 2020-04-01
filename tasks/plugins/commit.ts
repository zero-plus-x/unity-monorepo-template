import plugin from '@start/plugin'

export const commit = () => plugin('commit', () => async () => {
  const { makeCommit } = await import('@auto/commit-prompt')

  return makeCommit()
})
