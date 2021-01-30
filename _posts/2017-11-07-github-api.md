---
title: memo:GitHub API & Serde.rs
date: 2017-11-07
categories:
- memo
tags:
- Rust
- GitHub
---

Rusk/Task Manager in Rust の作成log.

Rust とTask から命名
## <span class="olive">Motivation</span>
Googleカレンダーで主にスケジュール・タスク管理をしてたのだけど、
色々と不満点があったので小さいCLIツールを作ることにした。  

- Web上でGoogle ToDoリストを作成するまでの導線が長い
- ToDoにタグ付けしたい & Tag毎に確認したい
- ターミナルからも見たい

Task管理する上で欲しい項目/機能をリストアップ。  

#### 項目
- task/name
- description
- tag(s)
- deadline

#### 機能
- CRUD
- Notification
- ターミナル/Web(スマホ)両方から確認したい

で、上記を一番楽に実装しようと考えた結果、GitHubのレポジトリを立てToDoをIssueとして管理することにした。  
データ構造としてのタスクの項目が多いので、ToDoの作成は主にWebから。CLIから作成する場合はinteractiveな感じに。

## <span class="olive">Approach</span>
Rustの[hyper](https://github.com/hyperium/hyper)を使ってhttpクライアントを作成。
hyper単体だとTLS対応していないので、[hyper-tls](https://github.com/hyperium/hyper-tls)をコネクタに利用した。  
CLIには[structopt](https://github.com/TeXitoi/structopt)を用いてCRUD操作をenumとstructでいい感じに。
出力の整形は[prettytable-rs](https://github.com/phsym/prettytable-rs)を使用。OSS様様。

GitHubのAPIコールは[ここ](https://github.com/settings/tokens)から発行できる`personal access token`をヘッダに付与するだけで、curlでも簡単に呼べる。  
レポジトリのissue一覧を叩くと以下のようにissueに対してユーザ情報、ラベルリストが入れ子構造になって返される。

```sh
curl -H "Authorization: token $GITHUB_API_TOKEN" https://api.github.com/repos/koka831/todo/issues

[
  {
    "url": "https://api.github.com/repos/...",
    ..
    "id": 271094185,
    "number": 2,
    "title": "hoge",
    "user": {
      "login": "koka831",
      ...
    },
    "labels": [
      {
        "id": ...
        "name": "ToDo",
        "color": "3778ba",
      }
    ],
    "state": "open",
    ...
  }, ...
]
```

同じことをhyperからもやってみると、403/Forbiddenが返される。
[reference](https://developer.github.com/v3/#user-agent-required)を読み直すとUserAgentが必須とのこと。
> All API requests MUST include a valid User-Agent header. Requests with no User-Agent header will be rejected. 

したがって最小限必要なheaderは以下の２つ。
```
User-Agent: app/1.0
Authorization: token $TOKEN
```
２つ目の`Authorization`の書式が曲者で、`token`とトークン文字列の間の**スペースが２つあっても**`Bad credentials`となる。

hyperで独自ヘッダを付与する際には、hyperのマクロが便利。
Authorizationのheader生成関数を作成して、TLSコネクタベースのHttpClientに渡す。
Clientサイドなのでシングルスレッドで。

```rust
use hyper::{Client, Method, Request};
use hyper::header::UserAgent;
use hyper_tls::HttpsConnector;
use tokio_core::reactor::Core;

// ...
header! { ( Authorization, "Authorization" ) => [String] }
let auth_header = format!("token {}", token);

let mut req = Request::new(Method::Get, url);
req.headers_mut().set(UserAgent::new("todo"));
req.headers_mut().set(Authorization(auth_header));

// setup client
let handle = core.handle();
let client = Client::configure()
  // creates connector with 1 thread
  .connector(HttpsConnector::new(1, &handle).unwrap())
  .build(&handle);
```

取得したIssueリストはdeserializeしてstructに落としこむ。  
とりあえずの構造体を作ってserde-jsonとすり合わせようと思っていたのだけど、
構造体のkeyをjsonのkeyと合わせておくだけでそのままシリアライズしてくれた。
今回はv3のREST APIを使ったけど、struct/enumのSerializerとGraphQLも相性がいいと思う。

```rust
#[derive(Debug, Serialize, Deserialize)]
struct Issue {
  id: u32,
  number: u8,
  title: String,
  labels: Vec<Label>,
  state: String,
  body: String
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Label {
    id: u32,
    pub name: String,
    pub color: String,
    default: bool,
}

// ...
// send request
let res = client.request(req)
  .and_then(|res| { res.body().concat2()
  .and_then(move |body| {
    let v: Vec<Issue> = serde_json::from_slice(&body).unwrap();
    Ok(v)
  })
});

core.run(res).unwrap()
```

## <span class="olive">ToDo</span>
- APIコールが1~2secかかるのでその間スピナーアイコン表示したい
- rusk + fzf + vimでタスクをシームレスに編集できるように
  - CLI側のメモは後日fzf+vimインターフェースと合わせて
