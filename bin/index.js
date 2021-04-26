#!/usr/bin/env node
const commader = require('commander')
const downloader = require('download-git-repo')
const child_process = require('child_process')
const chalk = require('chalk')
const ora = require('ora')
const fs = require('fs')


commader
    .command('project <name>')
    .action((name) => {
        const downloadTemplate = ora(chalk.green('Downloading the template...'))
        const downloadNpmPackage = ora(chalk.green('Downloading the npm package...'))
        console.log(chalk.green('Downloading get started, it will take a little while, please be patient\n'))
        downloadTemplate.start()
        fs.mkdirSync(name)
        downloader('github:gitborlando/Frame-template', name, () => {
            downloadTemplate.succeed()
            let packageJson = JSON.parse(fs.readFileSync(`${name}/package.json`, 'utf-8'))
            packageJson.name = name
            fs.writeFileSync(`${name}/package.json`, JSON.stringify(packageJson), 'utf-8')
            downloadNpmPackage.start()
            const npmPackage_D = `webpack webpack-cli@3 webpack-dev-server html-webpack-plugin`
            child_process.exec(`cd ${name} && cnpm i -D ${npmPackage_D} && cnpm i -S framex`, () => {
                downloadNpmPackage.succeed()
                console.log(chalk.green(`\nNow you can \n\n-> cd ${name}\n-> npm run dev`))
                console.log(chalk.green('\nand then, your Frame app will run at http://localhost:8787'))
            })
        })
    })
    .parse(process.argv)