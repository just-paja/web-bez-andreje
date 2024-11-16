const { archiveName } = require('../paths')

require('dotenv').config()

const fs = require('fs')
// const ChromeExtension = require('crx')
const pkg = require('../package.json')
const path = require('path')
const webpack = require('../webpack.config.js')
const archiver = require('archiver')
const Jimp = require('jimp')

const mainIconName = 'web-bez-andreje'
const iconSizes = [16, 48, 128]

const mainIcon = `${mainIconName}.png`
/*
const mainIcon16 = `${mainIconName}-16.png`
const mainIcon48 = `${mainIconName}-48.png`
const mainIcon128 = `${mainIconName}-128.png`
*/

const rootPath = path.resolve(__dirname, '..')
const mainIconSrc = path.join(rootPath, 'icons', 'main.png')
const srcPath = path.join(rootPath, 'src')
const bundlePath = webpack.output.path
const distPath = path.resolve(bundlePath, '..')
// const packagePath = path.join(distPath, `${archiveName}.crx`)
const zipPath = path.join(distPath, archiveName)
const manifestPath = path.join(bundlePath, 'manifest.json')
const mainIconPath = path.join(bundlePath, mainIcon)
const popupPageSrc = path.join(srcPath, 'popup.html')
const popupPagePath = path.join(bundlePath, 'popup.html')

const icons = {}

function createManifest () {
  const manifest = {
    manifest_version: 3,
    name: 'Nakupuj bez Andreje',
    description: pkg.description,
    version: pkg.version,
    action: {
      default_icon: mainIcon,
      default_popup: 'popup.html'
    },
    icons,
    permissions: [
      'storage',
      '*://*.itesco.cz/*',
      '*://itesco.cz/*',
      '*://*.kosik.cz/*',
      '*://kosik.cz/*',
      '*://*.rohlik.cz/*',
      '*://rohlik.cz/*',
      '*://*.makro.cz/*'
    ],
    content_scripts: [
      {
        matches: [
          'https://www.kosik.cz/*',
          'https://www.rohlik.cz/*',
          'https://nakup.itesco.cz/*',
          'https://sortiment.makro.cz/*'
        ],
        js: ['main.js'],
        run_at: 'document_end'
      }
    ],
    web_accessible_resources: [{
      resources: [
        mainIcon
      ],
      matches: [
        "*://*/*"
      ]

    }]
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  fs.copyFileSync(mainIconSrc, mainIconPath)
  fs.copyFileSync(popupPageSrc, popupPagePath)
}

async function createIcons () {
  for (const size of iconSizes) {
    const jimp = await Jimp.read(mainIconSrc)
    const iconName = `${mainIconName}-${size}.png`
    jimp
      .resize(size, size)
      .quality(99)
      .write(path.join(bundlePath, iconName))
    icons[size] = iconName
  }
}

/*
async function createPackage () {
  const crx = new ChromeExtension({
    privateKey: process.env.PACKAGE_KEY
  })
  await crx.load(bundlePath)
  const buffer = await crx.pack()
  fs.writeFileSync(packagePath, buffer)
  process.stdout.write(`Created package in ${packagePath}\n`)
}
*/

async function createZip () {
  const archive = archiver('zip')
  const output = fs.createWriteStream(zipPath)

  await new Promise((resolve, reject) => {
    output.on('close', resolve)
    output.on('error', reject)
    archive.directory(bundlePath, false)
    archive.pipe(output)
    archive.finalize()
  })
  process.stdout.write(`Created package in ${zipPath}\n`)
}

async function compile () {
  await createIcons()
  createManifest()
  await createZip()
}

compile().catch(e => {
  console.error(e)
  process.exit(255)
})
