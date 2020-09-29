import { system } from "gluegun"

// we really need a packager core extension on Gluegun
// in the meantime, we'll use this hacked together version

const packageOptions = { dev: false, expo: false }
type PackageOptions = typeof packageOptions

let isYarn = undefined
function yarn() {
  if (isYarn !== undefined) return isYarn
  isYarn = Boolean(system.which("yarn"))
  return isYarn
}

function add(pkg: string, options: PackageOptions = packageOptions) {
  const dev = options.dev ? " --save-dev" : ""
  if (options.expo) {
    return `npx expo-cli install ${pkg}${dev}`
  } else if (yarn()) {
    return `yarn add ${pkg}${dev}`
  } else {
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
    return system.exec(cmd, { stdio: "inherit" })
  },
  remove: async (pkg: string, options?: PackageOptions) => {
    const cmd = remove(pkg, options)
    console.log(cmd)
    return system.exec(cmd, { stdio: "inherit" })
  },
  install: async () => {
    const cmd = install()
    console.log(cmd)
    return system.exec(cmd, { stdio: "inherit" })
  },
}
