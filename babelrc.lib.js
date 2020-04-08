const babelConfig = require('./babel.config.common');
module.exports = {
    "presets": [
        ["@babel/preset-env", babelConfig.preset_env],
        "@babel/preset-react",
        ["@babel/preset-typescript", babelConfig.preset_typescript]
    ],
    "plugins": babelConfig.plugins
};
