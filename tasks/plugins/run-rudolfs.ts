import path from 'path'
import plugin from '@start/plugin'
import { TPluginData } from '@auto/start-plugin'

const PORT = 8080

export type TRudolfsConfig = {
  accessKeyId: string,
  secretAccessKey: string,
  region: string,
  bucketName: string,
  cachePath?: string,
  maxCacheSize?: number,
}

export const runRudolfs = ({
  accessKeyId,
  secretAccessKey,
  region,
  bucketName,
  cachePath = path.resolve('./lfscache'),
  maxCacheSize = 10,
}: TRudolfsConfig) =>
  plugin<TPluginData, any>('run-rudolfs', () => async () => {
    const { default: execa } = await import('execa')

    if (typeof accessKeyId !== 'string' || accessKeyId.length === 0) {
      throw new Error('config.accessKeyId is required')
    }

    if (typeof secretAccessKey !== 'string' || secretAccessKey.length === 0) {
      throw new Error('config.secretAccessKey is required')
    }

    if (typeof region !== 'string' || region.length === 0) {
      throw new Error('config.region is required')
    }

    if (typeof bucketName !== 'string' || bucketName.length === 0) {
      throw new Error('config.bucketName is required')
    }

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
        `--max-cache-size=${maxCacheSize}GB`,
      ]
    )
  })
