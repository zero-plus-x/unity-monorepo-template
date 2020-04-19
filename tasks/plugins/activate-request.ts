import plugin from '@start/plugin'

export const activateRequest = () => plugin('activate-request', () => async () => {
  const { default: execa } = await import('execa')
  const { default: fs } = await import('pifs')
  const path = await import('path')

  const unityVersion = process.env.UNITY_VERSION
  const licenseDir = process.env.UNITY_LICENSE_DIR

  if (typeof unityVersion !== 'string' || unityVersion.length === 0) {
    throw new Error('Variable "UNITY_VERSION" is not set')
  }

  if (typeof licenseDir !== 'string' || licenseDir.length === 0) {
    throw new Error('Variable "UNITY_LICENSE_DIR" is not set')
  }

  try {
    await fs.mkdir(licenseDir)
  } catch {}

  await execa(
    'docker',
    [
      'run',
      '--rm',
      '--name',
      'get-unity-activation-file',
      '-e',
      `UNITY_LICENSE_DIR=${licenseDir}`,
      '-v',
      `${path.resolve(licenseDir)}:/project/${licenseDir}`,
      '-v',
      `${path.resolve('tasks/scripts/get_activation_file.sh')}:/project/get_activation_file.sh`,
      '-w',
      '/project',
      `gableroux/unity3d:${unityVersion}`,
      '/bin/bash',
      '-c',
      './get_activation_file.sh',
    ],
    {
      stdout: process.stdout,
      stderr: process.stderr,
    }
  )
})
