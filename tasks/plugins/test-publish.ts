import plugin from '@start/plugin'

export const testPublish = () => plugin('test-publish', ({ reporter }) => async () => {
  const { default: sequence } = await import('@start/plugin-sequence')
  const { auto, publishPackages } = await import('@auto/core')
  const { forEachRelease } = await import('./for-each-release')
  const { preparePackage } = await import('./prepare-package')
  const { runNpm } = await import('./run-npm')
  const { removeYarnCache } = await import('./remove-yarn-cache')

  await auto({
    depsCommit: false,
    publishCommit: false,
    prePublish: async (props) => {
      const taskRunner = sequence(
        forEachRelease(preparePackage),
        runNpm(),
        removeYarnCache
      )

      await taskRunner(reporter)(props)
    },
    publish: publishPackages({
      registry: 'http://localhost:4873',
    }),
    push: false,
  })
})
