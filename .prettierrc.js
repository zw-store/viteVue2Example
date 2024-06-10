// .prettierrc.js
module.exports = {
  printWidth: 350, // 每行代码长度（默认80）
  overrides: [
    {
      files: 'src/components/Menu/index.vue',
      options: {
        printWidth: 80,
      },
    },
  ],
  tabWidth: 2, // 每个tab相当于多少个空格（默认2）ab进行缩进（默认false）
  useTabs: false, // 是否使用tab
  semi: false, // 声明结尾使用分号(默认true)
  vueIndentScriptAndStyle: false,
  singleQuote: true, // 使用单引号（默认false）
  quoteProps: 'as-needed', // 对象的key仅在必要时用引号（默认as-needed）
  bracketSpacing: true, // 对象字面量的大括号间使用空格（默认true）
  trailingComma: 'all', // 多行使用拖尾逗号（默认none）
  jsxSingleQuote: false, // 在jsx中使用单引号（默认false）
  arrowParens: 'avoid', // (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
  insertPragma: false, // 是否插入Pragma标记
  requirePragma: false, // 是否要求Pragma标记
  proseWrap: 'never', // 是否换行
  endOfLine: 'auto',
  rangeStart: 0, // 每个文件格式化的范围是文件的全部内容
}
