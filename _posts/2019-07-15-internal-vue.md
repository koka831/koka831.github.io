---
title: 'Internal Vue.js 1'
date: 2019-07-15
categories:
- Code Reading
tags:
- Vue
- Virtual DOM
description: internal Vue.js & read how Vue compiler works
---

[Vue.js](https://github.com/vuejs/vue)のreactive systemがどのように実装されているか追ってみた.
初回はコンパイラの挙動を確認.

- Vuejs v2.6.10


## src/compiler/index.js
compilerのentrypointとなるのが`src/compiler/index.js`.  
(Vue.jsは[flow](https://flow.org)を用いてtype checkを行っている. compiler周りの型は`flow/compiler.js`に記載.)

`parse(template, options)`でASTを生成し，`generate(ast, options)`でcodeを生成する.  
Virtual DOMのpatch/mergeを効率よく行うため，返り値の`CompiledResult`に`code`だけでなくASTを持たせている.

`staticRenderFns`についてはparser部分で説明する.

```js
// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

## src/compiler/parser/index.js
`.vue`ファイルからASTを生成する部分. `parse`関数内部で関数定義してて長いので，重要なところだけピックアップする.  
VueのテンプレートはHTMLのDOMをベースにしていて，特に
- Mustache
- Directive
の2点を拡張記法としてもっている．

そのためパース自体は`html-parse`を用いており，`parse`の主な仕事はHTML DOMのASTを返すのとパース時のエラー出力となっている．


```js
/**
 * Convert HTML string to AST.
 */
export function parse (
  template: string,
  options: CompilerOptions
): ASTElement | void {
  warn = options.warn || baseWarn
  /* omit */

  parseHTML(template, {
    /* omit */,
    start (tag, attrs, unary, start, end) { /* omit */ },
  })
  return root // ASTのroot Node
}
```


関係ないけど階段状にインポートしてるの好き.

```js
import {
  addProp,
  addAttr,
  baseWarn,
  addHandler,
  addDirective,
  getBindingAttr,
  getAndRemoveAttr,
  getRawBindingAttr,
  pluckModuleFunction,
  getAndRemoveAttrByRegex
} from '../helpers'
```

## Abstract Syntax Tree
`generate`が受け取る`ast`の型`ASTElement`は`flow/compiler.js`に定義されている．  
ASTは以下の3種類に分類され，`ASTNode`がそれぞれの`type`を元に判別している．
- `ASTElement`: type: 1
- `ASTText`: type: 2
- `ASTExpression`: type: 3

`type ASTNode = ASTElement | ASTText | ASTExpression`

`ASTElement`を例にとると以下のようになっている．

```js
declare type ASTElement = {
  type: 1;
  tag: string;
  attrsList: Array<ASTAttr>;
  attrsMap: { [key: string]: any };
  rawAttrsMap: { [key: string]: ASTAttr };
  parent: ASTElement | void;
  children: Array<ASTNode>;

  /* omit */
  staticRoot?: boolean;
  text?: string;
  component?: string;
  if?: string;
  for?: string;
  transition?: string | true;

  /* omit */

  model?: {
    value: string;
    callback: string;
    expression: string;
  };
}
```

ASTの構造は`ASTElement`がrootとなり，branchに`ASTNode`を再帰的に持つ構造になる.
`staticRoot?`や`component?`等のパラメータは，その`ASTNode`以下が`static`であるか`dynamic`であるか，等レンダリングの最適化の際に参照される．
この最適化機構は`src/compiler/optimizer.js`の`markStatic`及び`markStaticRoot`が担う.


## src/compiler/codegen/index.js

`generate`はASTから`render`と`staticRenderFns`の２つを生成する．  
`render`がVueのDynamic Renderingを担当し，`staticRenderFns`は静的な(変更のない)DOMを生成する.


```js
export function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  const state = new CodegenState(options)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}
```

`genElement`は`ASTElement`の`staticRoot?`や`for?`等を確認し，それぞれのディレクティブ・タグに対応する`Element`, `Component`を生成する.
各々の生成は`genStatic`, `genIf`のようにそれぞれのジェネレータで行う．
各々のジェネレータは受け取ったASTを処理した後に再帰的に`genElement`を呼び出す．  
最終的に`genElement`は最小単位である`Element`の生成を行う．  
`Element`は`<tag data>children</tag>`からなるDOMである．

以下がその生成部分.
```js
data = genData(el, state)
/* omit */
const children = el.inlineTemplate ? null : genChildren(el, state, true)
code = `_c('${el.tag}'${
  data ? `,${data}` : '' // data
}${
  children ? `,${children}` : '' // children
})`
```

`Element`のdata部分は`genData`が担当する. data部分に含まれるのは`class`, `directive`, `model`.


```js
export function genData (el: ASTElement, state: CodegenState): string {
  let data = '{'

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  const dirs = genDirectives(el, state)
  if (dirs) data += dirs + ','

  /* omit */
  // component v-model
  if (el.model) {
    data += `model:{value:${
      el.model.value
    },callback:${
      el.model.callback
    },expression:${
      el.model.expression
    }},`
  }
  /* omit */
  return data
}
```

最終的に`CompiledResult`が生成される.

```js
declare type CompiledResult = {
  ast: ?ASTElement;
  render: string;
  staticRenderFns: Array<string>;
  stringRenderFns?: Array<string>;
  errors?: Array<string | WarningMessage>;
  tips?: Array<string | WarningMessage>;
};
```

## Summary
- Vueのコンパイラは`parser`と`generator`からなる.
- `parser`は`html-parse`を元にASTを生成する.
- `generator`はASTを元に動的部分と静的部分の`render`群を生成する


## Next
次回は`src/core/observer`を読む.  
(名前からVueのreactive systemがObserver patternベースなんだろうな)

- [次回](/2019/08/08/internal-vue-2/)
