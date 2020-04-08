const preset_env = {
    "targets": {
        "ie": "11",
        "edge": "17",
        "firefox": "60",
        "chrome": "67",
        "safari": "11.1"
    },
    "useBuiltIns": "usage",
    "corejs": { "version": 3, "proposals": true }
};
const preset_typescript = {
    "isTSX": true,
    "allExtensions": true
};
const plugins = ["babel-plugin-transform-class-properties"];
module.exports = {preset_env, preset_typescript, plugins};
