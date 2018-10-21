```
import { inBrowser } from 'core/util/index'

// 检查当前浏览器是否将元素属性中的 \n 转码
let div
function getShouldDecode (href: boolean): boolean {
  div = div || document.createElement('div')
  div.innerHTML = href ? `<a href="\n"/>` : `<div a="\n"/>`
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
// 兼容 ie
export const shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false
// #6828: chrome encodes content in a[href]
// 兼容 chrome
export const shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false
```
