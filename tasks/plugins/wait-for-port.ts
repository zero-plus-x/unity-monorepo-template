import fetch from 'node-fetch'
import plugin from '@start/plugin'

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout))

const fetchPort = async (port: string) => {
  try {
    await fetch(`http://localhost:${port}`)

    return true
  } catch {
    return false
  }
}

export const waitForPort = (port: string) =>
  plugin('wait-for-port', () => async () => {
    while (!(await fetchPort(port))) {
      await sleep(200)
    }
  })
