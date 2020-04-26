import sequence from '@start/plugin-sequence'
import { activateRequest } from './activate-request'
import { activateLicense } from './activate-license'

export const activate = () => sequence(
  activateRequest(),
  activateLicense()
)
