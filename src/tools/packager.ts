import { system } from "gluegun"
import { spawnProgress } from "./spawn"

// we really need a packager core extension on Gluegun
// in the meantime, we'll use this hacked together version

const packageOptions = { dev: false, expo: false, onProgress: (out: string) => console.log(out) }
type PackageOptions = typeof packageOptions

let isYarn = undefined
function yarn() {
  if (isYarn !== undefined) return isYarn
  isYarn = Boolean(system.which("yarn"))
  return isYarn
}

function add(pkg: string, options: PackageOptions = packageOptions) {
  if (options.expo) {
    return `npx expo-cli install ${pkg}`
  } else if (yarn()) {
    const dev = options.dev ? " --dev" : ""
    return `yarn add ${pkg}${dev}`
  } else {
    const dev = options.dev ? " --save-dev" : ""
    return `npm install ${pkg}${dev}`
  }
}

function remove(pkg: string, options: PackageOptions = packageOptions) {
  if (options.expo) {
    return `npx expo-cli uninstall ${pkg}`
  } else if (yarn()) {
    return `yarn remove ${pkg}`
  } else {
    return `npm uninstall ${pkg}`
  }
}

function install() {
  if (yarn()) {
    return `yarn install -s`
  } else {
    return `npm install`
  }
}

export const packager = {
  add: async (pkg: string, options?: PackageOptions) => {
    const cmd = add(pkg, options)
    console.log(cmd)
    return spawnProgress(cmd, { onProgress: options.onProgress })
  },
  remove: async (pkg: string, options?: PackageOptions) => {
    const cmd = remove(pkg, options)
    console.log(cmd)
    return spawnProgress(cmd, { onProgress: options.onProgress })
  },
  install: async (options?: PackageOptions) => {
    const cmd = install()
    console.log(cmd)
    return spawnProgress(cmd, { onProgress: options.onProgress })
  },
}
