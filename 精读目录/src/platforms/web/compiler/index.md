用来输出 compile, compileToFunctions

<a href="">baseOptions</a>

<a href="">createCompiler</a>

```
import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
```
