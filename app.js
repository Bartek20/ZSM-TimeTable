#!/usr/bin/env node

import chalk from 'chalk'
import inquirer from 'inquirer'
import { createSpinner } from 'nanospinner'
import { spawn } from 'child_process'
import pkg from "./package.json" assert { type: "json" };

// Początek programu
console.log(chalk.magentaBright('ZSM TimeTable CLI'))
const answers = await inquirer.prompt({
  name: 'menu',
  type: 'list',
  message: 'Co chcesz zrobić?\n',
  choices: [
    'Zaktualizuj zależności do najnowszej wersji',
    'Uruchom aplikację w trybie deweloperskim',
    'Zbuduj aplikację',
    'Generator ustawień',
    'Wyjście'
  ],
});

// Aktualizacja zależności
if (answers.menu === 'Zaktualizuj zależności do najnowszej wersji') {
  const spinner = createSpinner('Aktualizuję zależności...')
  spinner.start()
  const args = [ 'i' ]
  Object.keys(pkg.dependencies).forEach(dependency => args.push(`${dependency}@latest`))
  if (args.indexOf('vue-toastification@latest') !== -1) args[ args.indexOf('vue-toastification@latest') ] = 'https://github.com/Bartek20/vue-toastification.git#next'
  const proc = spawn('npm', args)
  proc.on('close', code => {
    code === 0 ? spinner.success() : spinner.error()
  })
  const spinnerD = createSpinner('Aktualizuję zależności deweloperskie...')
  const argsD = [ 'i', '-D' ]
  Object.keys(pkg.devDependencies).forEach(dependency => argsD.push(`${dependency}@latest`))
  const procD = spawn('npm', argsD)
  procD.on('close', code => {
    code === 0 ? spinnerD.success() : spinnerD.error()
  })
}
// Uruchom aplikację w trybie deweloperskim
if (answers.menu === 'Uruchom aplikację w trybie deweloperskim') {
  const proc = spawn('npm', ['run', 'dev'])
}
// Wyjście
if (answers.menu === 'Wyjście') {
  console.log(chalk.magentaBright('Do zobaczenia!'))
  process.exit(0)
}