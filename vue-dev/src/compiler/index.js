/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.

export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {

  // 把 template 转换成 AST 结构的数据  
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    // 这里给 ast 增加了 static 和 staticRoot 两个属性，优化语法树
    optimize(ast, options)
  }
  // 把优化后的 AST 树转换成可执行的代码
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
