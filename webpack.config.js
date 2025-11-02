const config = require('flarum-webpack-config');
const { merge } = require('webpack-merge');

module.exports = merge(config(), {
  // 自定义配置可以在这里添加
  output: {
    // 确保输出路径正确
    path: __dirname + '/js/dist',
  },
  
  // 开发模式配置
  devtool: 'source-map',
  
  // 性能提示
  performance: {
    hints: false
  },
  
  // 解析配置
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': __dirname + '/js/src'
    }
  }
});