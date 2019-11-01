"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var patterns_1 = require("../../lib/patterns");
exports.description = "Generates a React Navigation navigator.";
exports.run = function (toolbox) {
    return __awaiter(this, void 0, void 0, function () {
        var parameters, print, _a, pascalCase, isBlank, camelCase, kebabCase, ignite, filesystem, patching, ask, list, navigatorTypes, packageJSON, name, navigatorName, pascalName, camelName, navigatorType, askForNavigatorType, result, pascalScreens, allKebabScreens, allPascalScreens, askForScreens, result, pascalNavigators, allKebabNavigators, allPascalNavigators, askForNavigators, result, props, jobs, navFilePath, msg, screenImport, navigatorImports, toImport, routes;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    parameters = toolbox.parameters, print = toolbox.print, _a = toolbox.strings, pascalCase = _a.pascalCase, isBlank = _a.isBlank, camelCase = _a.camelCase, kebabCase = _a.kebabCase, ignite = toolbox.ignite, filesystem = toolbox.filesystem, patching = toolbox.patching, ask = toolbox.prompt.ask, list = toolbox.filesystem.list;
                    navigatorTypes = {
                        'Stack': "createStackNavigator",
                        'Tab': "createBottomTabNavigator",
                        'Switch': "createSwitchNavigator",
                        'Drawer': "createDrawerNavigator",
                        'Material Bottom Tab': "createMaterialBottomTabNavigator",
                        'Material Top Tab': "createMaterialTopTabNavigator"
                    };
                    // validation
                    if (isBlank(parameters.first)) {
                        print.info("A name is required.");
                        print.info("ignite generate navigator <name>\n");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, require("read-pkg-up")()];
                case 1:
                    packageJSON = (_b.sent()).package;
                    if (!packageJSON) {
                        print.error("Can't find a package.json here or in parent directories.");
                        return [2 /*return*/];
                    }
                    // ensure react-navigation is installed
                    if (Object.keys(packageJSON.dependencies).includes("react-navigation") === false) {
                        print.error("This generator only works with react-navigation.");
                        return [2 /*return*/];
                    }
                    name = parameters.first;
                    navigatorName = name.endsWith("-navigator") ? name : name + "-navigator";
                    // prettier-ignore
                    if (name.endsWith('-navigator')) {
                        print.info("Note: For future reference, the `-navigator` suffix is automatically added for you.");
                        print.info("You're welcome to add it manually, but we wanted you to know you don't have to. :)");
                    }
                    pascalName = pascalCase(navigatorName);
                    camelName = camelCase(navigatorName);
                    navigatorType = parameters.options["type"];
                    if (!!navigatorType) return [3 /*break*/, 3];
                    askForNavigatorType = {
                        type: "select",
                        name: "navigatorType",
                        message: "What type of navigator do you want to create?",
                        initial: "Stack",
                        choices: Object.keys(navigatorTypes),
                    };
                    return [4 /*yield*/, ask(askForNavigatorType)];
                case 2:
                    result = _b.sent();
                    navigatorType = result.navigatorType;
                    _b.label = 3;
                case 3:
                    pascalScreens = parameters.options["screens"] && parameters.options["screens"].split(",");
                    if (!!pascalScreens) return [3 /*break*/, 5];
                    allKebabScreens = list(process.cwd() + "/app/screens/")
                        .filter(function (s) { return !RegExp("index").test(s); })
                        .map(function (s) { return s.replace(/\..{0,3}/, ""); });
                    allPascalScreens = allKebabScreens.map(function (s) { return pascalCase(s); });
                    if (!allKebabScreens) return [3 /*break*/, 5];
                    askForScreens = {
                        type: "multiselect",
                        name: "screens",
                        message: "What screens would you like to import to the navigator?",
                        choices: allPascalScreens,
                    };
                    return [4 /*yield*/, ask(askForScreens)];
                case 4:
                    result = _b.sent();
                    pascalScreens = result.screens;
                    _b.label = 5;
                case 5:
                    pascalNavigators = parameters.options["navigators"] && parameters.options["navigators"].split(",");
                    if (!!pascalNavigators) return [3 /*break*/, 7];
                    allKebabNavigators = list(process.cwd() + "/app/navigation/").filter(function (n) { return n.includes("-navigator.") && !n.includes("stateful-") && !n.includes("root-"); });
                    allPascalNavigators = allKebabNavigators.map(function (s) {
                        return pascalCase(s.replace(".tsx", "").replace(".ts", ""));
                    });
                    if (!allPascalNavigators) return [3 /*break*/, 7];
                    askForNavigators = {
                        type: "multiselect",
                        name: "navigators",
                        message: "What other navigators would you like to import to the navigator?",
                        choices: allPascalNavigators,
                    };
                    return [4 /*yield*/, ask(askForNavigators)];
                case 6:
                    result = _b.sent();
                    pascalNavigators = result.navigators;
                    _b.label = 7;
                case 7:
                    props = {
                        name: navigatorName,
                        pascalName: pascalName,
                        camelName: camelName,
                        navigatorType: navigatorTypes[navigatorType],
                    };
                    jobs = [
                        {
                            template: "navigator.ejs",
                            target: "app/navigation/" + navigatorName + ".ts",
                        },
                    ];
                    // make the template
                    return [4 /*yield*/, ignite.copyBatch(toolbox, jobs, props)
                        // import screens/navigators to newly created navigator
                    ];
                case 8:
                    // make the template
                    _b.sent();
                    if (!(!!pascalScreens.length || !!pascalNavigators.length)) return [3 /*break*/, 12];
                    navFilePath = process.cwd() + "/app/navigation/" + navigatorName + ".ts";
                    if (!filesystem.exists(navFilePath)) {
                        msg = "No '" + navFilePath + "' file found.  Can't insert screen." +
                            "Something went wrong with the navigator generator.";
                        print.error(msg);
                        process.exit(1);
                    }
                    screenImport = pascalScreens.join(',\n  ');
                    return [4 /*yield*/, patching.patch(navFilePath, {
                            before: new RegExp(patterns_1.Patterns.NAV_IMPORTS_SCREENS),
                            insert: "  " + screenImport + ",\n",
                        })];
                case 9:
                    _b.sent();
                    navigatorImports = pascalNavigators.map(function (pascalNavigator) {
                        var kebabNavigator = kebabCase(pascalNavigator);
                        return "\nimport { " + pascalNavigator + " } from \"./" + kebabNavigator + "\"";
                    });
                    toImport = navigatorImports.join("");
                    return [4 /*yield*/, patching.patch(navFilePath, {
                            after: new RegExp(patterns_1.Patterns.NAV_IMPORTS_NAVIGATORS),
                            insert: toImport,
                        })
                        // insert routes
                    ];
                case 10:
                    _b.sent();
                    routes = __spreadArrays(pascalScreens, pascalNavigators).map(function (pascalItem) {
                        var camelItem = camelCase(pascalItem);
                        return "\n  " + camelItem
                            .replace("Screen", "")
                            .replace("Navigator", "") + ": { screen: " + pascalItem + " },";
                    })
                        .join("");
                    return [4 /*yield*/, patching.patch(navFilePath, {
                            after: new RegExp(patterns_1.Patterns.NAV_ROUTES),
                            insert: routes,
                        })];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    });
};
//# sourceMappingURL=navigator.js.map