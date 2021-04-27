---
title: 'Renewal Blog'
date: 2021-04-26
categories:
- Diary
tags:
- Diary
description: scratch new blog with Next.js; switched from VuePress
---

1年ぶりになります．今年もよろしくお願いします．

最近は紅茶コーディネータになるべく日々精進しています[^tea]．

## TL;DR

- [VuePress][vuepress]のアルファ版を使っていて，メンテが辛くなった
- [Next.js][next] + [remark][remark]でMarkdown->HTMLのSSGを構築した
- [できたもの](https://github.com/koka831/koka831.github.io)

## About

ブログを書こうと思い立って，以前構築したブログを久々に確認した.
今つかってるパソコンにブログのソースコードを持ってきていなかったので，`npm install`すると脆弱性の嵐.

```shell-session[data-file="terminal"]
$npm i
removed 22 packages, changed 14 packages, and audited 1090 packages in 8s

33 vulnerabilities (7 low, 15 moderate, 11 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues, run:
  npm audit fix --force

Run `npm audit` for details.
```

また，ブログシステムのベースに使っているVuePressが0.xから1.8までバージョンアップしていたので，これは追従しよう.

しかし早々に更新を断念. デザインをフルスクラッチでやるためにVuePressのソースを`eject`していたため，追従をすべて手でやる必要があった.

ブログ自体のメンテにはそこまでコストをかけてられないので，今度は`eject`しなくてもデザインを触れるライブラリを選定することにした.

- 開発言語自体にはこだわりはないが，型システムはほしい
- マークダウンで書ける
- サーバ管理は避けたいので，GitHub Pagesに載せられるもの

を探した.最終的には次の2つから選んだ. ~結局相当のyak shavingが発生した.~

### Gatsby.js

[Gatsby.js][gatsby]はReact.jsをベースにしたリッチなCMSフレームワーク.バックエンドとはGraphQLで連携し，コンテンツの取得は[contentful][contentful]+Markdownだったりと選定の自由度が高い.

SSGのプロセスについてもAPIの呼び出し回数は全ページに対して1回で済む(ようなquery buildをする必要はある)ようなので，productionでの利用をするならGatsby.jsを選ぶと思う.

### Next.js

[Next.js][next]はGatsby.jsと比べると薄いフレームワークで，ビルドやルーティング等ベースとなる機能の提供がメインになっている.
Server-Side Generationの仕組みはあるが，Gatsby.jsほどの最適化は行われていない感じ.

したがってCMSとして使うためにはそれ相当の機能の実装が必要となるため，~コストは高い~面白そう.

## Artifacts

[これ][blog]ができた.

### Architecture

Next.jsの[`getStaticProps`][getStaticProps]と[`getStaticPaths`][getStaticPaths]を用いて一覧・詳細ページをSSG.
コンテンツはMarkdownで記述し，[remark][remark]を用いてHTMLを生成している．
Next.js側でも[MDX][mdx](Markdown+React Component)を描画できる仕組みがあったけど，内部で呼ばれているコンパイラに手を加えるのに難儀したため，情報の多いremarkを選んだ.

([amdx][amdx]はマジですごいと思う)

remarkはMarkdownを入力として，指定した形式での出力を行うプロセッサで，fig.1のように`Parser`，`Transformer`や`Compiler`といったプラグインを処理に挟むことができる.
受け取ったMarkdownは[mdast][mdast][^1]という形式のastに変換され，プラグインはmdastを受取りmdastを返すよう要求される.

```asciidoc[data-file="process"]
| ........................ process ........................... |
| .......... parse ... | ... run ... | ... stringify ..........|

          +--------+                     +----------+
Input ->- | Parser | ->- Syntax Tree ->- | Compiler | ->- Output
          +--------+          |          +----------+
                              X
                              |
                       +--------------+
                       | Transformers |
                       +--------------+
```
**fig.1 remarkの変換プロセス. 図はベースとなるunifiedから. [[出典][unified-process]]**

このブログではそこそこプラグインを使っていて，中には自作したものもある[^2].

```typescript[data-file="interpreter.ts"][class="line-numbers"]
const markdownToHtml = async (markdown: string): Promise<string> => {
  const result = await remark()
    .use(gfm) // remark-gfm
    .use(math) // remark-math
    .use(emoji) // remark-emoji
    .use(container) // 自作 | VuePressで使っていたCustom Container記法に対応
    .use(caption) // 自作 | Markdown中の画像に対して通し番号+figcaptionを付与
    .use(prism) // remark-prism
    .use(externalLink) // remark-external-links
    .use(slug) // remark-slug
    .use(headings, { behavior: "wrap" }) // remark-autolink-headings
    .use(footnotes) // remark-footnotes
    .use(remark2rehype) // remark-rehype | mdastからhast形式へ変換
    .use(katex) // rehype-katex | remark-mathで変換したmarkdownでの数式をkatex記法へ変換
    .use(stringify) // rehype-stringify
    .process(markdown);

  return result.toString();
};
```
**fig.2 プラグイン一覧**

### remark plugin

実際作ってみると結構簡単に実装できる. READMEにあるサンプルだと型情報がなかったりで結構辛いけど，fig.1と[guide][unified-guide]が参考になる.

* **remark-container**

もともと使っていたVuePressでは，Custom Containersと呼ばれるMarkdownの拡張記法が使える[^3].

```markdown[data-file="custom-container.md"]
::: info Custom Title
Custom Container Body
:::
```
**fig.3 これがこうじゃ**

::: info Custom Title
Custom Container Body
:::

remark版を探すといくつか見つかったけど，どれも動かなかったので作ることにした.

実装は正規表現でdirectiveにマッチした行のastを書き換えるもので，単純なため対応してないケースもある(directive内のcode blockとかnodeが分割されるケース).
これらの対応は[remark-directive][remark-directive]を用いて後々やりたい.

* **remark-image-caption**

img要素のようなself-closing tagについては`::before`等の疑似要素が使えないため，例えばMarkdownで記述した画像のタイトルをCSSのみで抽出・表示するといったことができない．

画像に対してcaptionを付与するプラグインは動作するいくつか見つかったけど，画像に対して連番を振ってくれるようなものは見当たらなかった.

```markdown[data-file="image.md"]
![alt text](image.png "image title")
```

![alt text](/img/icon.png "image title")

今回作成したプラグインでは，画像を`<figure>`タグで囲んでタイトルを`<figcaption>`に設定するようにした.
ただ，この手法は例えばtableのようなMarkdown記法でタイトルを付与できない要素に対しては使えないため，画像やコード，テーブル等の直下の`em`や`strong`をcaptionとみなすといったやり方に移行すると思う.

### Commit Log

各記事の編集履歴を表示する**Commits**コンポーネント(↓の**Commits**).

やっていることは単純で，`getStaticProps`呼び出し時に該当するファイルに対してのGit履歴を取得しているだけ.

### Table of Contents

現在のページにあるheadingsから目次を構築するコンポーネント(→の目次.表示されてない人は1200px以上の画面で見てね).

これは単に実装したことがなかったから作った[^4].
原理は単純で，現在のスクロール位置を取得して，通り過ぎたheadingのうち最も近いものをhighlightしている.
最初はmarkdownを与えてheadingを抽出するやり方にしていたけど，markdown外にあるCommitsやComments等，そのページにあるheadingを動的に抽出する方針に切り替えた.

### Comments

GitHub Issueと連携したコメントコンポーネント(↓の**Comments**).
[utterances][utterances]というサービスを利用した. ブログからコメントするにはGitHub AccountでのAuthが必要だけど，[Issues][issues]に直接コメントすることもできる.

## これから

フリーランスとしてのお仕事も現在は募集しておらず，自身の身の振り方については少なくとも今年いっぱいは考える予定.
とりあえずプライベートではアルゴリズムやデータ構造等再度やっていこうと思う.

紅茶コーディネータについては年初からの受講なので，順調に行けば今年の秋ころには取れるかなあ，という感じ.
ミーハーなので今年のセカンドフラッシュを楽しみにしてたりする.

[blog]: https://koka831.github.io/
[vuepress]: https://vuepress.vuejs.org/
[next]: https://nextjs.org/
[remark]: https://github.com/remarkjs/remark
[remark-directive]: https://github.com/remarkjs/remark-directive
[gatsby]: https://www.gatsbyjs.com/
[contentful]: https://www.contentful.com/
[getStaticProps]: https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
[getStaticPaths]: https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation
[mdx]: https://nextjs.org/blog/markdown
[amdx]: https://github.com/mizchi/amdx
[unified-process]: https://github.com/unifiedjs/unified#description
[unified-guide]: https://unifiedjs.com/learn/guide/create-a-plugin/
[unist]: https://github.com/syntax-tree/unist
[mdast]: https://github.com/syntax-tree/mdast
[hast]: https://github.com/syntax-tree/hast
[rehype]: https://github.com/rehypejs/rehype
[remark#536]: https://github.com/remarkjs/remark/pull/536
[utterances]: https://utteranc.es
[issues]: https://github.com/koka831/blog/issues

[^tea]: 余談だけど茶葉のテイスティングカップ，料理の際に調味料を混ぜる小さい容器に最適すぎる
[^1]: mdastは[unist][unist]という規格に従っていて，他にはHTMLのunist表記である[hast][hast]などがある. またmdastのプロセッサ実装(remark)があるように，hastのプロセッサには[rehype][rehype]がある.
[^2]: remark内部で使っている[ライブラリの移行][remark#536]が2020後半にあって，npmに上がっているプラグインの中にも動作しないものが少なくない. 実際動作するプラグインの中には(This plugin is made for the new parser in remark (micromark, see remarkjs/remark#536).)のように注釈があったりする.
[^3]: 大元は[これ](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444/155)っぽい.
[^4]: 今回UIコンポーネントライブラリは一切使わなかった. ~コストとは~
