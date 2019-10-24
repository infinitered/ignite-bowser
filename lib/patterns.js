const constants = {
  PATTERN_NAV_IMPORTS_SCREENS: "navImportsScreens",
  PATTERN_NAV_IMPORTS_NAVIGATORS: "navImportsNavigators",
  PATTERN_NAV_ROUTES: "navRoutes",
  PATTERN_ROOT_NAV_ROUTES: "rootNavRoutes",
}

module.exports = {
  constants,
  [constants.PATTERN_NAV_IMPORTS_SCREENS]: `} from "../screens"`,
  [constants.PATTERN_NAV_IMPORTS_NAVIGATORS]: `import[\\s\\S]*from\\s+"react-navigation";?`,
  [constants.PATTERN_ROOT_NAV_ROUTES]: "export const RootNavigator.+[\\s\\S]\\s+{",
  [constants.PATTERN_NAV_ROUTES]: `export const [a-zA-Z0-9]+ = create[a-zA-Z]+[(][{]`,
}
