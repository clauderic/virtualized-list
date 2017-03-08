module.exports = require('babel-jest').createTransformer({
  presets: ['es2015', 'stage-1', 'stage-2'],
  plugins: ['transform-runtime']
});
