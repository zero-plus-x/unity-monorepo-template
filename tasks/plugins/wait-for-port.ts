import plugin from '@start/plugin'

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout))

export const waitForPort = (port: number, path = '', timeout = 5000) => plugin<any, any>('wait-for-port', ({ logMessage }) => async () => {
  const { default: fetch } = await import('node-fetch')
  const isResponding = async (url: string) => {
    try {
      logMessage(`fetching URL: ${url}`)
      await fetch(url, { timeout: 500 })

      return true
    } catch {
      return false
    }
  }

  const url = `http://localhost:${port}/${path}`
  const maxTries = Math.round(Math.max(timeout, 1000) / 500)
  let numTries = 0

  while (numTries++ < maxTries && !(await isResponding(url))) {
    await sleep(500)
  }
})
