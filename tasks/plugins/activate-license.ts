import plugin from '@start/plugin'

export const activateLicense = () => plugin('activate-license', () => async () => {
  const username = process.env.UNITY_USERNAME
  const password = process.env.UNITY_PASSWORD
  const activationDir = process.env.UNITY_LICENSE_DIR
  const unityVersion = process.env.UNITY_VERSION

  if (typeof username !== 'string' || username.length === 0) {
    throw new Error('Variable "UNITY_USERNAME" is not set')
  }

  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('Variable "UNITY_PASSWORD" is not set')
  }

  if (typeof activationDir !== 'string' || activationDir.length === 0) {
    throw new Error('Variable "UNITY_LICENSE_DIR" is not set')
  }

  if (typeof unityVersion !== 'string' || unityVersion.length === 0) {
    throw new Error('Variable "UNITY_VERSION" is not set')
  }

  const { default: execa } = await import('execa')
  const path = await import('path')

  await execa(
    'docker',
    [
      'run',
      '--rm',
      '--name',
      'activate-license',
      '-e',
      `UNITY_USERNAME=${username}`,
      '-e',
      `UNITY_PASSWORD=${password}`,
      '-e',
      `UNITY_ACTIVATION_FILE=${path.join(activationDir, `Unity_v${unityVersion}.alf`)}`,
      '-e',
      `UNITY_LICENSE_FILE=${path.join(activationDir, `Unity_v${unityVersion}.ulf`)}`,
      '-v',
      `${path.resolve(activationDir)}:/app/${activationDir}`,
      'gableroux/unity3d-activator',
      'node',
      'index.js',
    ],
    {
      stdout: process.stdout,
      stderr: process.stderr,
    }
  )
})
