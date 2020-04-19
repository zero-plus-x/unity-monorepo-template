import plugin from '@start/plugin'

const runTest = async (mode: 'edit' | 'play') => {
  const { default: execa } = await import('execa')

  const unityVersion = process.env.UNITY_VERSION
  const licenseDir = process.env.UNITY_LICENSE_DIR

  if (typeof unityVersion !== 'string' || unityVersion.length === 0) {
    throw new Error('Variable "UNITY_VERSION" is not set')
  }

  if (typeof licenseDir !== 'string' || licenseDir.length === 0) {
    throw new Error('Variable "UNITY_LICENSE_DIR" is not set')
  }

  if (mode !== 'edit' && mode !== 'play') {
    throw new Error(`Test mode should be set to "edit" or "play". Got ${mode}.`)
  }

  const { stdout } = await execa(
    'docker',
    [
      'run',
      '--rm',
      '--name',
      'unity-test',
      '-e',
      `UNITY_LICENSE_DIR=${licenseDir}`,
      '-e',
      `UNITY_VERSION=${unityVersion}`,
      '-e',
      `TEST_PLATFORM=${mode}mode`,
      '-v',
      `${process.cwd()}:/project`,
      '-w',
      '/project',
      `gableroux/unity3d:${unityVersion}`,
      '/bin/bash',
      '-c',
      'tasks/scripts/test.sh',
    ]
  )

  return stdout
}

type TReportAssembly = {
  type: 'Assembly',
  id: string, // '1016',
  name: string, // 'MyCompany.TemplatePackage.Editor.Tests.dll'
  fullname: string, // '/project/Library/ScriptAssemblies/MyCompany.TemplatePackage.Editor.Tests.dll'
  runstate: 'Runnable', // 'Runnable'
  testcasecount: string, // '3'
  result: 'Failed' | 'Passed', // Passed'
  site: 'Child',
  'start-time': string, // '2020-04-26 12:37:45Z'
  'end-time': string, // '2020-04-26 12:37:45Z'
  duration: string, // '0.266250'
  total: string, // '3'
  passed: string, // '3'
  failed: string, // '0'
  inconclusive: string, // '0'
  skipped: string, // '0'
  asserts: string, // '0'
}

type TReportFixture = {
  type: 'TestFixture',
  id: string, // '1016'
  name: string, // 'Tests_AddValues'
  fullname: string, // 'RuntimeTests.Tests_AddValues'
  classname: string, // 'RuntimeTests.Tests_AddValues'
  runstate: 'Runnable', // 'Runnable'
  testcasecount: string, // '3'
  result: 'Failed' | 'Passed',
  site: 'Child',
  'start-time': string, // '2020-04-26 12:37:45Z'
  'end-time': string, // '2020-04-26 12:37:45Z'
  duration: string, // '0.266250'
  total: string, // '3'
  passed: string, // '3'
  failed: string, // '0'
  inconclusive: string, // '0'
  skipped: string, // '0'
  asserts: string, // '0'
}

type TReportMessage = {
  type: 'Message',
  message: string[],
  'stack-trace': string[],
}

type TReportDone = {
  type: 'Done',
}

type TReportItem = TReportAssembly | TReportFixture | TReportMessage

type TReportVisitor = (item: TReportAssembly | TReportFixture | TReportMessage | TReportDone) => void

const traverseParsedResults = (parsedResults: any, onItem: TReportVisitor, levelDeep = 0): void => {
  if (Array.isArray(parsedResults)) {
    for (const item of parsedResults) {
      traverseParsedResults(item, onItem, levelDeep + 1)
    }
  } else if (parsedResults !== null && typeof parsedResults === 'object') {
    if (Reflect.has(parsedResults, 'type')) {
      // console.log(parsedResults)
      onItem(parsedResults)

      return
    }

    if (Reflect.has(parsedResults, 'stack-trace')) {
      // console.log(parsedResults)
      onItem({ type: 'Message', ...parsedResults })

      return
    }

    for (const item of Object.keys(parsedResults)) {
      traverseParsedResults(parsedResults[item], onItem, levelDeep + 1)
    }
  }

  if (levelDeep === 0) {
    onItem({ type: 'Done' })
  }
}

const transformTestResult = async (xmlData: string): Promise<TReportItem[]> => {
  if (!xmlData.startsWith('<?xml')) {
    throw new Error(`Invalid XML: ${xmlData.slice(0, 48)}...`)
  }

  const { Parser } = await import('xml2js')
  const parsedData = await new Parser().parseStringPromise(xmlData)

  return new Promise<TReportItem[]>((resolve) => {
    const items: TReportItem[] = []

    traverseParsedResults(parsedData, (item) => {
      if (item.type === 'Done') {
        return resolve(items)
      }

      items.push(item)
    })
  })
}

const isTestOk = (items: TReportItem[]): boolean => {
  for (const item of items) {
    if (item.type === 'TestFixture' && item.result === 'Failed') {
      return false
    }
  }

  return true
}

const printTestResult = async (items: TReportItem[], log: (...values: any[]) => void) => {
  const { default: chalk } = await import('chalk')
  const { default: figures } = await import('figures')
  const cleanMessage = (message: string, pad = ''): string => {
    return pad + message
      .split('\n')
      .map((m) => m.trim())
      .filter((m) => m.length > 0)
      .join(`\n${pad}`)
  }
  const getFunctioName = (trace: string): string => {
    const match = trace.match(/<(.+)>/)

    if (match === null) {
      return '[No Name]'
    }

    return match[1]
  }

  const PAD = '  '
  const pad = (num = 1): string => Array(num).fill(PAD).join('')

  let numPassedTests = 0
  let numFailedTests = 0

  for (const item of items) {
    switch (item.type) {
      case 'Assembly': {
        log('')
        log(pad() + chalk.underline(item.name))
        log('')

        break
      }

      case 'TestFixture': {
        if (item.result === 'Passed') {
          ++numPassedTests
          log(`${pad(2)}${chalk.green(figures.tick)} ${chalk.dim(item.fullname)}`)
        } else {
          ++numFailedTests
          log(`${pad(2)}${chalk.red(figures.cross)} ${chalk.red(item.fullname)}`)
        }

        break
      }

      case 'Message': {
        log('')
        log(pad(3) + chalk.red(getFunctioName(item['stack-trace'][0])))
        log(chalk.red(cleanMessage(item.message[0], pad(4))))

        break
      }
    }
  }

  // Done
  const padStr = pad()

  log('\n')
  log(`${padStr}total:      ${numPassedTests + numFailedTests}`)

  if (numPassedTests > 0) {
    log(chalk.green(`${padStr}passing:    ${numPassedTests}`))
  }

  if (numFailedTests > 0) {
    log(chalk.red(`${padStr}failing:    ${numFailedTests}`))
  }

  log('\n')
}

type TTestMode = 'edit' | 'play'

export const test = (mode?: TTestMode) => plugin('unity-test', ({ logMessage }) => async () => {
  const modes: TTestMode[] = (mode === 'edit' || mode === 'play') ? [mode] : ['edit', 'play']

  for (const mode of modes) {
    logMessage(`Running tests in ${mode} mode...`)

    const stdout = await runTest(mode)
    const testResults = await transformTestResult(stdout)

    await printTestResult(testResults, console.log)

    if (!isTestOk(testResults)) {
      throw null
    }
  }
})
