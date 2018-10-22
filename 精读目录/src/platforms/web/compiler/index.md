用来输出 compile, compileToFunctions

<a href="">baseOptions</a>

<a href="https://github.com/HanLess/vue-analysis/blob/master/%E7%B2%BE%E8%AF%BB%E7%9B%AE%E5%BD%95/src/compiler/index.md">createCompiler</a>

```
import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
```
