export enum Patterns {
  NAV_IMPORTS_SCREENS = '} from "../screens',
  NAV_IMPORTS_NAVIGATORS = 'import[\\s\\S]*from\\s+"react-navigation";?',
  ROOT_NAV_ROUTES = "export const RootNavigator.+[\\s\\S]\\s+{",
  NAV_ROUTES = "export const [a-zA-Z0-9]+ = create[a-zA-Z]+[(][{]",
}
