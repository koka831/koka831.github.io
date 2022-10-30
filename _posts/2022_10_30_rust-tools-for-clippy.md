---
title: clippyの開発でもrust-analyzerを使いたい
date: 2022-10-30
categories:
- memo
tags:
- Rust
description: rust-tools.nvim(nvim-lspconfig)でrust-clippyの開発時にrust-analyzerの補完を有効化するための設定方法
---

[rust-clippy][clippy]はrustcのAPIを利用しており、`clippy`のソースコードを編集する際、デフォルトでは[rust-analyzer][analzer]の補完が効かない.
そのため`rust-analyzer`に対し以下の設定が必要.

```json
{ "rust-analyzer.rustc.source": "discover" }
```

これを[rust-tools.nvim][tools]で設定する方法が若干わかりづらかったのでメモ.

## TL;DR

結論、以下の様に`server`に対し`settings.["rust-analyzer"]`を渡す.

```lua
require('rust-tools').setup({
  server = {
    settings = {
      ["rust-analyzer"] = {
        rustc = {
          source = "discover"
        }
      }
    }
  }
})
```

---

`rust-tools`の[#configuration][config]の項を見ると、`rust-analyzer`へのオプションを渡す`server`が用意されていることがわかる.

```lua[data-file="rust-tools.nvim#configuration"]
  -- all the opts to send to nvim-lspconfig
  -- these override the defaults set by rust-tools.nvim
  -- see https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#rust_analyzer
  server = {
    -- standalone file support
    -- setting it to false may improve startup time
    standalone = true,
  }, -- rust-analyzer options
```

> all the opts to send to nvim-lspconfig

とあるので、`nvim-lspconfig`での設定をそのまま`rust-tools`の`server`に記述すればよいのだが、当時の自分は"そうは言っても`["rust-analyzer"]`ディレクティブに渡すのだろう"と思い込みんでいた.

[clippy]: https://github.com/rust-lang/rust-clippy
[analzer]: https://rust-analyzer.github.io/
[tools]: https://github.com/simrat39/rust-tools.nvim
[config]: https://github.com/simrat39/rust-tools.nvim#configuration
