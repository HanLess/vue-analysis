用来输出 compile, compileToFunctions

<a>baseOptions</a>

<a>createCompiler</a>

```
import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
```
