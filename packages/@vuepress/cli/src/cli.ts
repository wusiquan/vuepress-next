import { cac } from 'cac'
import { chalk } from '@vuepress/utils'
import { build, dev } from './commands'
import { allowTs } from './utils'

/**
 * Wrap raw command to catch errors and exit process
 */
const wrapCommand = (cmd: (...args: any[]) => Promise<void>): typeof cmd => {
  const wrappedCommand: typeof cmd = (...args) =>
    cmd(...args).catch((err) => {
      console.error(chalk.red(err.stack))
      process.exit(1)
    })
  return wrappedCommand
}

/**
 * Vuepress cli
 */
export const cli = (): void => {
  // allow ts files globally
  allowTs()

  // create cac instance
  const program = cac('vuepress')

  // display core version and cli version
  const versionCli = require('../package.json').version
  const versionCore = require('@vuepress/core/package.json').version
  program.version(`core@${versionCore} vuepress/cli@${versionCli}`)

  // display help message
  program.help()

  // register `dev` command
  program
    .command('dev [sourceDir]', 'Start development server')
    .option('-c, --config <config>', 'Set path to config file')
    .option('-p, --port <port>', 'Use specified port (default: 8080)')
    .option('-h, --host <host>', 'Use specified host (default: 0.0.0.0)')
    .option('-t, --temp <temp>', 'Set the directory of the temporary files')
    .option('--cache <cache>', 'Set the directory of the cache files')
    .option('--clean-cache', 'Clean the cache before dev')
    .option('--open', 'Open browser when ready')
    .option('--debug', 'Enable debug mode')
    .option('--no-watch', 'Disable watching page and config files')
    .action(wrapCommand(dev))

  // register `build` command
  program
    .command('build [sourceDir]', 'Build to static site')
    .option('-c, --config <config>', 'Set path to config file')
    .option(
      '-d, --dest <dest>',
      'Set the directory build output (default: .vuepress/dist)'
    )
    .option('-t, --temp <temp>', 'Set the directory of the temporary files')
    .option('--cache <cache>', 'Set the directory of the cache files')
    .option('--clean-cache', 'Clean the cache before build')
    .option('--debug', 'Enable debug mode')
    .action(wrapCommand(build))

  program.parse(process.argv)
}
