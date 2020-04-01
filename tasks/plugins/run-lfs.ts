import plugin from '@start/plugin'

const PORT = 8080

export type TLfsConfig = {
  cachePath?: string,
  maxCacheSize?: number,
}

const runRudolfs = plugin('run-rudolfs', () => async () => {
  const { default: execa } = await import('execa')

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  const region = process.env.AWS_DEFAULT_REGION
  const bucketName = process.env.LFS_S3_BUCKET
  const maxCacheSize = process.env.LFS_MAX_CACHE_SIZE || '10GB'
  const cachePath = process.env.LFS_CACHE_PATH || '~/.lfs-cache'

  if (typeof accessKeyId !== 'string') {
    throw new Error('Environment variable "AWS_ACCESS_KEY_ID" is not set')
  }

  if (typeof secretAccessKey !== 'string') {
    throw new Error('Environment variable "AWS_SECRET_ACCESS_KEY" is not set')
  }

  if (typeof region !== 'string') {
    throw new Error('Environment variable "AWS_DEFAULT_REGION" is not set')
  }

  if (typeof bucketName !== 'string') {
    throw new Error('Environment variable "LFS_S3_BUCKET" is not set')
  }

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  execa(
    'docker',
    [
      'run',
      '--rm',
      '--name',
      'lfs',
      '-p',
      `${PORT}:${PORT}`,
      '-v',
      `${cachePath}:/data`,
      '-e',
      `AWS_ACCESS_KEY_ID=${accessKeyId}`,
      '-e',
      `AWS_SECRET_ACCESS_KEY=${secretAccessKey}`,
      '-e',
      `AWS_DEFAULT_REGION=${region}`,
      'psxcode/rudolfs',
      '--cache-dir=/data',
      `--s3-bucket=${bucketName}`,
      `--max-cache-size=${maxCacheSize}`,
    ],
    {
      stdout: process.stdout,
      stderr: process.stderr,
    }
  )
})

export const runLfs = () => plugin('run-lfs', ({ reporter }) => async () => {
  const { default: sequence } = await import('@start/plugin-sequence')
  const { waitForPort } = await import('./wait-for-port')

  return sequence(
    runRudolfs,
    waitForPort(PORT)
  )(reporter)()
})
