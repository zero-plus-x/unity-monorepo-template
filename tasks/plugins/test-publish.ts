import plugin from '@start/plugin'

export const testPublish = () => plugin('test-publish', ({ reporter, logMessage }) => async () => {
  const { default: sequence } = await import('@start/plugin-sequence')
  const { auto, publishPackages } = await import('@auto/core')
  const { forEachRelease } = await import('./for-each-release')
  const { preparePackage } = await import('./prepare-package')
  const { runNpm, PORT } = await import('./run-npm')
  const { waitForPort } = await import('./wait-for-port')
  const { removeYarnCache } = await import('./remove-yarn-cache')

  try {
    await auto({
      depsCommit: false,
      publishCommit: false,
      prePublish: async (props) => {
        const taskRunner = sequence(
          forEachRelease(preparePackage),
          removeYarnCache,
          runNpm(),
          waitForPort(PORT)
        )

        await taskRunner(reporter)(props)
      },
      publish: publishPackages({
        registry: 'http://localhost:4873',
      }),
      push: false,
    })
  } catch (e) {
    logMessage(e?.message)

    throw null
  }
})
