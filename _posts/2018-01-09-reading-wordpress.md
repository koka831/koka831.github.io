---
title: reading wordpress
date: 2018-01-09
categories:
- Code Reading
image: /assets/img/2018-01-10-thumb.png
tags:
  - Wordpress
description: How to read source code with an example
---
 
友人からコードリーディングの方法について聞かれたので,僕自身もCSバックグラウンドではないけれどソースコードの読み方を説明しようと思う.  
以下友人向け文体.


途中でプロジェクトにアサインされた時、過去の自分のコードをリファクタリングする時、OSSのコードを読む時など、ある程度の規模のソースコードを読む機会があると思う.  
サーバーだったりコマンドラインツールだったり,言語も責務も異なる様々なプログラムを読む際に一貫した読み方はあるのだろうか.
完全な解はないと思うが、僕個人の経験からすると、
- 抽象化・抽象度を意識すること
- 読まないこと
これらを意識するだけででソースコードはだいぶ読みやすくなる.

抽象化・抽象度を意識するとはどういうことか.
具体的に言うと、自分が今、全体の処理の流れのうち、どの部分を読んでいるかを意識することである。

僕らは普段プログラムを書くためにOSを使っているけれど、OSは実際どんなことをしてくれているのか.  
プログラムをコンパイラに喰わせると実行可能なファイルを吐いてくれるけれど、内部ではなにをしているのか.  
CPUはフリップフロップ[^1]という素子からできているし、フリップフロップは半導体からできている.  
けれど、プログラムを組む上で僕らはそんなこと気にする必要がない.  
これが抽象化である. 内部構造を隠蔽し、表に見えるのはユーザが触って良い部分だけ.

注意して欲しいのが、ここで言うユーザは必ずしも人間だけではないということ.  
例えば実行中のプログラムがメモリの状態を知りたい時、直接メモリを参照するのは無理がある.
実行中のプログラムからメモリまでには以下のような層がある.

```
+-----+    +-----+    +-----------+    +---------+
| mem | == | CPU | == | kernel/OS | == | program |
+-----+    +-----+    +-----------+    +---------+
```

ではどうするか. 見えないものは下の層が知っているかもしれない.
OSにメモリの使用状況を尋ねる命令を送るのである.

上の例では物理的に層が分かれていたので抽象化の区切りが分かりやすかったが、ソフトウェアの構成も同様に抽象化が行われている.  
ソフトウェアのコードを読む時にも、自分が今メモリを見ているのかOSの命令を見ているのか、また隠蔽されている処理なのか、表に見えている部分なのか、どのレベルを見ているのかを意識することが必要なのがわかると思う.

次に、読まないこと.
これは**読むべき情報以外を読まない**という意味.

全体像を知る、というのは全部を知ることではない. 上の話でも言ったように、基本的にソフトウェアは抽象化の繰り返しで構成されている.  
つまり、自分が欲しい情報の層に立った時に、表に見える情報以外は読まなくていい.
OSがどうなっているか知りたいのにメモリを分解してみてもどうにもならない.


恐らくソースコードを読むことに慣れているエンジニアはこれらを無意識に行っている.
そのため同じ抽象度のものを見る時に,自分の培ったパターンを当てはめることができ、更に自分がコードを書く際に、同様の設計で実装することが出来る.  
プロジェクトが書けるエンジニアは読む力もある.

以上を踏まえてWordPressのソースコード[^2]を読んでみよう.

まずなにを知りたいか.
ここでは全体的な構成とCMSとしての処理の流れを把握することを目標としてみよう.

全体構成を把握する場合、複数の層の責務を把握する必要があるため、特に**読まない**ことが重要である.  
コードを実際に読む前に、まずは公式サイトやリファレンスに書いていないか確認してみよう.
リファレンスがダメならコメントだ. 

公式に[ディレクトリ階層](http://wpdocs.osdn.jp/%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88%E9%9A%8E%E5%B1%A4)というページがある.   
見てみるとこれは自作テーマにおけるディレクトリ階層のようだ. 今回はWordPress自体がどのように動作するのかを知りたいので、今回は素直にコードを読むしかなさそうだ.

では実際にディレクトリ構成を見てみよう.

```shell
index.php
license.txt
readme.html
wp-activate.php
wp-blog-header.php
wp-comments-post.php
wp-config-sample.php
wp-cron.php
wp-links-opml.php
wp-load.php
wp-login.php
wp-mail.php
wp-settings.php
wp-signup.php
wp-trackback.php
xmlrpc.php
.
├── wp-admin
│   ├── css
│   ├── images
│   ├── includes
│   ├── js
│   ├── maint
│   ├── network
│   └── user
├── wp-content
│   ├── plugins
│   ├── themes
│   └index.php
└── wp-includes
    ├── certificates
    ├── css
    ├── customize
    ├── fonts
    ├── ID3
    ├── images
    ├── IXR
    ├── js
    ├── pomo
    ├── random_compat
    ├── Requests
    ├── rest-api
    ├── SimplePie
    ├── Text
    ├── theme-compat
    ├── widgets
    └...

28 directories
```

構成を見つつ、このうちどれが読まなくてもいいものか考えてみよう.

まず`wp-admin/`. これは管理者パネル用のディレクトリだろう. CMSとしてはとりあえず読まなくても良さそうだ.

次に`wp-content/`配下. `plugins/`, `themes/`は それぞれユーザインストールのプラグインとテーマ用のディレクトリだろうか.  
`index.php`はルートディレクトリにもあったがどちらがエントリーポイントになるのだろう. テーマを読み込む処理はルーティング後に行われるだろうからとりあえずは後回しにしよう.

最後に`wp-includes`はどうだろう.  
大抵`includes/`ディレクトリにはシステムで利用するライブラリ等が置かれる. 読むのは必要な機能が出てきてからで良さそうだ.

つまり最初に読む必要があるのはこれらになりそうだ.

```shell
$ tree -I 'wp-includes|wp-admin|themes|plugins|licence|readme'

├── index.php
├── wp-activate.php
├── wp-blog-header.php
├── wp-comments-post.php
├── wp-config-sample.php
├── wp-content
│   └── index.php
├── wp-cron.php
├── wp-links-opml.php
├── wp-load.php
├── wp-login.php
├── wp-mail.php
├── wp-settings.php
├── wp-signup.php
├── wp-trackback.php
└── xmlrpc.php

1 directory, 17 files
```

では実際の処理の流れを追っていこう.

大抵WordPressはApacheやNginx等のウェブサーバを介してPHP-FPMやFastCGIを用いてホスティングされる.  
Apacheであれば`DirectoryIndex`, Nginxであれば`http`ディレクティブ内の`index`に、ウェブサーバにアクセスがあった時に最初にアクセスされるファイルが指定されている.

```nginx
# nginx.conf
http {
  # ...
  index                index.php index.html index.htm;
}
```

なので`/index.php`が最初に読み込まれる.
処理より流れを把握することを意識して実際に読んでいこう.

```php
/* index.php */
define('WP_USE_THEMES', true);
require( dirname(__FILE__).'/wp-blog-header.php');
```

`index.php`では定数を定義して、`wp-blog-header.php`を読み込んでいる.
では`wp-blog-header.php`を見てみよう.

```php
/* wp-blog-header.php */
/* Loads the WordPress environment and template. */
if (!isset($wp_did_header)) {
  $wp_did_header = true;
  /* Load the WordPress library. */
  require_once( dirname(__FILE__) . '/wp-load.php' );
  /* Set up the WordPress query. */
  wp();
  /* Load the theme template. */
  require_once( ABSPATH . WPINC . '/template-loader.php' );
}
```
> Loads the WordPress environment and template.

とあるので、`wp-load.php`が"environment"、定数やデータベースの設定を、`template-loader.php`が"template"、`wp-contents/themes`のテーマテンプレートをロードするファイルなのだろう.  
では`wp()`は? `wp()`を呼ぶ前にインクルードしたファイルは`wp-load.php`しかないので、ここで定義されているのだろう.  
そして"Set up the WordPress query."とはどういうことだろう.  
順に追っていこう.

#### wp-load.php
コメントを読むと
- ABSPATHの定義
- `wp-config.php`, `wp-settings.php`のロード
  - ファイルが存在しなければセットアップするように表示する
と書いてある.
セットアップ時のエラーハンドリングもCMSの機能としては本質ではないので、ここもコメントを読んでこれくらいで次に進むようにしよう.

#### wp-config.php
これは初期状態では存在しない. `wp-config-sample.php`をベースにセットアップ時に作成されるようだ.
このファイルでは
- MySQL settings
- Secret Keys
- Database table prefix
- ABSPATH
の定義がされるようだ.

`wp-load.php`でABSPATHの定義をしたはずなのに、どうしてまた定義するのだろうか?
とりあえず全体像を確認するためにこれは置いておこう.

#### wp-settings.php
トップレベルコメントには、
> Used to set up and fix common variables and include the WordPress procedural and class library

とあるので、基本的な関数やクラスのロードが行われるのだろう.

次に進みたいけれどまだ`wp()`が見つかっていない. 恐らく`wp-settings.php`で読み込んでいるファイルのどれかに定義されているのだろう.   
ただこの量の`require`文を全て読んでいくのはしんどい.

こんな時は**タグジャンプ**を使ってみよう.  
タグジャンプとは、ctagsを用いてソースコードを静的解析し、定義元のファイルを開く方法である.
VimやSublime Textのプラグインとして公開されているものがあるので使ってみよう.
もちろんgrepでもいい.

そうして`wp-includes/functions.php`に`wp()`を見つけた.

```php
/**
 * Set up the WordPress query.
 *
 * @since 2.0.0
 *
 * @global WP       $wp_locale
 * @global WP_Query $wp_query
 * @global WP_Query $wp_the_query
 *
 * @param string|array $query_vars Default WP_Query arguments.
 */
function wp( $query_vars = '' ) {
  global $wp, $wp_query, $wp_the_query;
  $wp->main( $query_vars );

  if ( !isset($wp_the_query) )
    $wp_the_query = $wp_query;
}
```

なるほど、この`$wp`がメインのオブジェクトなのだろう.   
@globalとあるので、`$GLOBALS['wp']`を定義している箇所を探してみよう.


```php
// wp-settings.php
/**
 * WordPress Object
 * @global WP $wp
 * @since 2.0.0
 */
$GLOBALS['wp'] = new WP();
```

`$wp`の実態はclass WPのインスタンスだった.  
`$wp->main( $query_vars )`とあったので、WPクラスのmainメソッドを見てみよう.  
WPクラスは`wp-includes/class-wp.php`に定義されている.

```php
/**
 * Sets up all of the variables required by the WordPress environment.
 *
 * The action {@see 'wp'} has one parameter that references the WP object. It
 * allows for accessing the properties and methods to further manipulate the
 * object.
 *
 * @param string|array $query_args Passed to parse_request().
 */
public function main($query_args = '') {
  $this->init();
  $this->parse_request($query_args);
  $this->send_headers();
  $this->query_posts();
  $this->handle_404();
  $this->register_globals();

  /**
   * Fires once the WordPress environment has been set up.
   *
   * @since 2.1.0
   *
   * @param WP $this Current WordPress environment instance (passed by reference).
   */
  do_action_ref_array( 'wp', array( &$this ) );
}
```

ようやく実態が見えてきた. ここでそれぞれのメソッドを読みたい気持ちをこらえて、最後のフェーズ、`wp-includes/template-loader.php`を読んでいこう.

#### template-loader.php
まず`do_action( 'template_redirect' )`が目につく.   
コメントを見るとどのテンプレートを読むかを判断する命令を送っているようだ.   
`do_action()`は命令に応じたアクションを呼び出す関数らしい. これも後で確認してみよう.

読み進めると、elseifの分岐に圧倒されるが`is_`でリクエストされたページのタイプを判定して、それにあったテンプレートをレンダリングする関数を呼んでいるだけのようだ.   
`is_`系の関数が全て引数を取っていないので、先の`main()`関数で読んでいた  
`$this->register_globals()`でそれらの情報もグローバル変数に定義しているのだろう.
  
ここまで読んだ流れをまとめると次のようになる.

![](./img/2018-01-10.png)


#### 終わりに
これで予想も交えながらではあったが処理の流れをさらうことができた.  
内容の確認よりも確認する手順を自分の思考とともに紹介することに重きをおいたので、課題がそのまま残っている. 良かったら読んで教えて欲しい.


### reference
[^1]: [wikipedia](https://ja.wikipedia.org/wiki/%E3%83%95%E3%83%AA%E3%83%83%E3%83%97%E3%83%95%E3%83%AD%E3%83%83%E3%83%97#D%E5%9E%8B%E3%83%95%E3%83%AA%E3%83%83%E3%83%97%E3%83%95%E3%83%AD%E3%83%83%E3%83%97)

[^2]: WordPress/ver.4.9
