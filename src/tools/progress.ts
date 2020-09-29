/**
 * This function analyzes the output from `react-native init` and provides a prettier
 * output.
 */
export function cliProgress(output) {
  switch (true) {
    case output.includes("Welcome to React Native!"):
      return "🏃‍♀️ Initializing React Native app"
    case output.includes("Run instructions for"):
      return "🧍‍♀️ React Native app initialized successfully"
  }
  return ""
}

export function expoProgress(output) {
  switch (true) {
    case output.includes("🧶 Using Yarn"):
      return "🏃‍♀️ Initializing Expo app"
    case output.includes("✅ Your project is ready!"):
      return "🧍‍♀️ Expo app initialized successfully"
  }
  return ""
}

export function yarnProgress(output) {
  switch (true) {
    case output.includes("yarn add"):
      return "🏃‍♀️ Adding packages"
    case output.includes("Saved lockfile."):
      return "🧍‍♀️ Added packages"
  }
  return ""
}
