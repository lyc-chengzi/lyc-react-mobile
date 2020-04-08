const babelConfig = require('./babel.config.common');

const newEnv = Object.assign({}, babelConfig.preset_env, {
    "loose": true,
    "modules": false
});
module.exports = {
    "presets": [
        ["@babel/preset-env", newEnv],
        "@babel/preset-react",
        ["@babel/preset-typescript", babelConfig.preset_typescript]
    ],
    "plugins": babelConfig.plugins
};
