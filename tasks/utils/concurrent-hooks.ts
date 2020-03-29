import { THook } from '@auto/core'

export const concurrentHooks = (...hooks: (THook | false)[]): THook => async (props) => {
  await Promise.all(
    hooks.map(async (hook) => {
      if (hook !== false) {
        try {
          await hook(props)
        } catch (e) {
          console.error(e)
        }
      }
    })
  )
}
