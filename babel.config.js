//开发阶段用到的数组
const prodPlugins = []
if(process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    //发布产品时插件数组
    ...prodPlugins,
    '@babel/syntax-dynamic-import'
  ]
}
