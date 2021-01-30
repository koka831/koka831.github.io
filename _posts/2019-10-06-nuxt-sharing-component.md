---
title: 'Nuxt.js: sharing components'
date: 2019-10-06
categories:
- memo
tags:
- Vue
description: simple way to share components between multiple projects
---

## Abstract
- single repositoryで複数のprojectを管理する
- ビルド時に`nuxt.config.js`を上書きし, `pages`をproject毎に分離

## Motivation
- `admin`と`user`で共通のコンポーネントがある
- `/user`, `/admin` のようにルーティングで分ける方法もあるが, そもそも`/admin` を外に出したくない(同じ環境で動作させたくない)

### 1. setup subdir
[create-nuxt-app](https://github.com/nuxt/create-nuxt-app)で生成したテンプレートを元に, `admin/`ディレクトリ配下にサブプロジェクトを作成する.

```sh
$ mkdir -p admin/{pages,layouts}
$ touch admin/app.config.js
$ls
.gitignore
.nuxt/
admin/    <-- new
  layouts/
  pages/
  app.config.js
assets/
components/
...
layouts/  <-- default
pages/    <-- default

```


### 2. configure app.config.js
`srcDir`を`admin`とすることで, Nuxtがみるプロジェクトが`admin/`配下になる.
これでNuxtが生成するroutingも`admin/pages`によるものになる.
そのため, Storeをadmin側でも持ちたい場合は`admin/store/`を作成する.


また, `admin/pages/xxx.vue` でも`import XXX from '@/components/...`のように`@`を用いる為に`build`ディレクティブで`@ alias`を上書きする.  
(この設定がない場合, `@/../components/...`のように root directoryまで1階層のぼる必要がある)

```js
const path = require('path')
const merge = require('deepmerge')
const nuxt = require('../nuxt.config.js')

const extend = {
  srcDir: __dirname,
  buildDir: '.nuxt/admin',

  build: {
    extend(config) {
      config.resolve.alias['@'] = path.resolve(__dirname, '..')
    }
  }
}

export default merge(nuxt, extend)
```

### 3. configure package.json
`nuxt`の`--config-file` オプションを用いて`nuxt.config.js`を指定する.  
これで`yarn dev`とすればデフォルトの`pages`が用いられるし, `yarn dev:admin`とすれば`admin/pages`が用いられる.

```js
{
  "scripts": {
    "dev": "nuxt",
    "build": "nuxt build",
    "start": "nuxt start",
    "dev:admin": "nuxt --config-file admin/app.config.js",
    "build:admin": "nuxt build --config-file admin/app.config.js",
    "start:admin": "nuxt start --config-file admin/app.config.js",
  },
  ...
}
```


### Appendix: Generated Routing(.nuxt/admin/router.js)
`yarn build:admin`で生成された`routes` に `client`側の`pages`が含まれていないことが確認できる.


```js
import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _0510df08 = () => interopDefault(import('../../admin/pages/index.vue' /* webpackChunkName: "pages/index" */))

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
      path: "/",
      component: _0510df08,
      name: "index"
    }],

  fallback: false
}

export function createRouter() {
  return new Router(routerOptions)
}
```

### repository
[koka831/nuxt-multiple-sample](https://github.com/koka831/nuxt-multiple-sample)
