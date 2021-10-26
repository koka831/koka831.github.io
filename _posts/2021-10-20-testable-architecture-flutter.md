---
title: テスト容易性を考慮したFlutterのアーキテクチャ考察
date: 2021-10-25
categories:
- Programming
tags:
- Flutter
description: MVVM architecture with Repository pattern, state_notifier and riverpod
---

ここ半年ほどFlutterを書いていて，アプリケーションのアーキテクチャで試行錯誤してます．状態管理ムズくない？  
なのでいっそ表に出して意見もらえたらな，と思ったので書きます．

本記事では，Flutterアプリケーションにおいてテスト容易性を向上するためにはどうすればいいか，サンプルアプリケーションを例題にアーキテクチャレベルで検討します．

## アーキテクチャの目的
今回は**テスト容易性**を主軸に置いたアーキテクチャ選定を行いました．
特にFlutterの単体テストはネットワークリクエストが遮断されるので，副作用を伴う処理を行うレイヤを適切に分離し，テストが容易になるよう設計を行うこととしました．

アーキテクチャは何かしら課題を解決するために設計されるもの(だと思っている)なので，今回示す例が必ずしもベストなものとは限らないです．

### テスト容易性とは

テスト容易性とは，James Bachが提唱した[Heuristics of Software Testability][testability](テスタビリティ・テスト容易性のモデル)に示される，テストの品質を測る指標です．
それぞれの説明は[優れたテスト容易性を実現するためのポイント - PrAha ENGINEER LAB][praha_test]に詳しいです．  
こちらの記事でも示されている通り，テスト容易性の向上にはテスト容易性を低下させる要因を抑えることが必要不可欠です．そしてその要因はコードレベルに留まらずアーキテクチャレベルで抑えることが求められます．

## 全体像

ざっくり以下の機能を持つアプリケーションを例にとります．

- APIサーバからデータ`Foo`のリストを取得してデータを描画する
- データ`Foo`を作成し，描画されるリストを更新する
- pull-to-refreshでのデータ再取得機能を持つ

また，今回用いるレイヤは以下のようになります;

- **API Client**: APIサーバからのデータ取得+モデルへのdeserializeを行う
  - 実装: `GetRequestProtocol` + `ListFooRequest`
- **Repository**: API Client(+[shared_preferences][shared_preferences])を利用してデータ取得・更新を行う
  - 実装: `FooRepository` + `fooRepositoryProvider`
- **Service**: ドメインロジック担当(もしくはTransaction Script)
  - 実装は省略
- **ViewModel**: Viewの描画以外の責務全て
  - 実装: `FooViewModel` + `fooViewModelProvider`
- **View**: 描画+イベントとViewModelのイベントハンドラの糊付け
  - 実装は省略

テスト容易性を念頭に置いた際にどのレイヤの分割が必要か判断した結果，基本的なMVVMアーキテクチャとなりました．  
テスト容易性のためには特にViewをいかに薄く保てるかがキモで，そのためにViewModelはやや責務過多になる傾向にあります．
したがってViewModelの肥大化を防ぐためにドメインロジックをViewModelからServiceクラスへ委譲し，また描画用のデータ管理とステートレスなドメインロジックを分離してテストできるようにします．  
ViewModelと共に扱われることの多い，StreamやReactiveな双方向データバインディングは扱いません．

以下では各レイヤ毎に簡易実装及びそのテストコードを示し，そのレイヤにおける責務と設計基準を説明します．  
実際の設計時はテストコードから書いて書き心地を試しつつの実装を行いましたが，説明の都合で実装->テストの順で示します．

また，Widgetについての設計はここでは述べません．
テスト容易性の観点からViewを薄く保つことを念頭に置いているため，ViewはViewModelまでの設計と異なる目的での設計を取りうるためです．

## API Client

APIクライアントクラスはネットワーク越しのリクエストを行い，アプリ内でのモデルへのdeserializeを行います．

ここではREST APIを仮定したクラス設計を行いますが，gRPCやGraphQLの場合でも実装が異なるだけで責務自体は変わらないと思います．  
APIレスポンスは対応するモデルクラスにマッピングし，`dynamic`型として存在する期間を極力短く保ちます．

モデルクラスは適当な集約単位で作成し，レスポンスを正規化して持つようにします．
[json_serializable][json_serializable]と組み合わせて`deserialize`の実装をModelのconstructorとして任せると楽です．

::: info immutable
Dartで構造体や関数以外への型エイリアスが定義できないのでclassとして定義するしかない．
ただ内部状態を変更できるクラスメソッドを書けてしまうと変更検知が辛くなってしまう．
:::

```dart[class="line-numbers"][data-file="foo.dart"]
@freezed
class Foo with _$Foo {
  factory Foo.fromJson(Map<String, dynamic> json) => _$FooFromJson(json);
}
```

APIリクエストクラスは，実際のリクエスト処理の隠蔽及びテスト時のDIインターフェース統一のためにプロトコルで縛るようにします．
プロトコルはmixinとして定義し，リクエスト処理を行う`request`メソッドのみmixin側に実装します．  
ここでは簡単のため`url`以外の定義を省略していますが，クエリパラメータやヘッダなど，想定されるユースケースに応じた設定が行えるようにインターフェースを設計します．

今回はGETリクエストを想定した`GetRequestProtocol`を定義し，またそのユースケースとして`ListFooRequest`を実装します．  
また，`HttpClient`はHTTPリクエストを担う[http][http]や[dio][dio]，またはいずれかをwrapしたクラスです．

```dart[class="line-numbers"][data-file="api_protocol.dart"]
// `package:meta` に [@mustOverride] annotation が入ったら嬉しい
// @see: https://github.com/dart-lang/sdk/issues/30175
mixin GetRequestProtocol<M> {
  @protected
  String get url => throw UnimplementedError();

  Future<M> request(HttpClient client) async {
    final json = await client.get(/* api request */);
    return _deserialize(json);
  }

  @protected
  M _deserialize(Response json) {}
}
```

ユースケース側は`GetRequestProtocol`を取り込んだRequestクラスを定義し，`request`メソッドが返すレスポンスをモデルへ変換する`deserialize`メソッドを実装します．

ここでは簡単のため`url`を固定値としていますが，実際には[flutter_dotenv][dotenv]を用いて環境変数としてAPIエンドポイントの管理を行います．
これは設定と実装の分離の観点からももちろん好ましいのですが，読み込む`.env`ファイルをテスト時に差し替えられる利点が大きいです．詳細は後述します．

```dart[class="line-numbers"][data-file="list_foo_request.dart"]
class ListFooRequest with GetRequestProtocol<List<Foo>> {
  @override
  String get url => 'https://example.com/foos';

  @override
  List<Foo> _deserialize(Response json) {
    // レスポンスのJSONが`foos`をキーとして[Foo]の配列を持つと仮定
    // constructor の tear-off が入ると `.map(Foo.fromJson)`のようにかける
    // @see: https://twitter.com/remi_rousselet/status/1438207417154686980?s=20
    return (json['foos'] as List)
      .map((f) => Foo.fromJson(f as Map<String, dynamic>))
      .toList();
  }
}
```

### test

APIクライアントクラスはネットワークリクエストを行い，レスポンスをモデルに変換するところまでを責務としました．  
Flutterのテストライブラリ[flutter_test][flutter_test]ではネットワークリクエストが遮断されるため，APIクライアントクラスに対するテストは`request`メソッドの返り値が対応するモデルインスタンスであるかどうかを評価することになります．  
モックのアプローチとしては以下の2パターンが考えられます;

- A. [mockito][mockito]を用いて`HttpClient`のモックオブジェクトを生成し，対応するレスポンスをスタブする
- B. [mock_http_server][mock_http_server]を用いてテスト用APIサーバを構築し，閉じたネットワークでのテストを行う

mockitoを用いる場合，今回の例題では`HttpClient`クラスの`get`メソッドをスタブすれば良さそうですが，HTTPリクエストを担うレイヤはinterceptorなどの機構を用いてロガーやエラーハンドラなどを注入するケースが多々あります．  
そのためテスト時に生成される`HttpClient`のモックオブジェクトと実際のリクエスト時に渡される`HttpClient`のインスタンスはスタブされている箇所以外にも設定が異なってしまうことが懸念されます．
したがって`HttpClient`の挙動がランタイムと乖離しないように，ネットワークリクエスト先をすげ替えるBの方針を取ることにします．

```dart[class="line-numbers"][data-file="list_foo_request_test.dart"]
void main() {
  final server = MockWebServer(port: 8081);

  setUp(() async {
    // APIエンドポイントを[MockWebServer]にすげ替えるためにテスト用の.envファイルを読み込む．
    // HttpClientがbaseUrlを保持するパターンもあるが，全てのAPIが単一のbaseUrlからされない場合もあるので
    // このようにしておく．
    await dotenv.load(fileName: '.env.test');
    server.start();
  });

  tearDown(server.shutdown);

  // エラー時のテストケースについては，エラーハンドラを`request`メソッドの実装に持たせたり
  // interceptorで挟んだりするためHttpClientやmixinのテストで記述する．
  // したがって個々のRequestクラスのテストケースはシンプルに保つことができる．
  test('ListFooRequest returns list of Foo', () async {
    // ここではJSONの構築に[dart:convert#jsonEncode]を用いた．
    // `json_serializable` が生成する`toJson`メソッドで適当なレスポンスを組み立ててもよい．
    final body = { 'foos': [/* Foo モデル */] };
    server.enqueue(httpCode: 200, body: jsonEncode(body));
    final response = await ListFooRequest().request(httpClient);

    expect(response, isA<List<Foo>>);
  });
}
```

## Repository

Repositoryクラスはデータ取得及びデータの更新操作を行います．  
ここではAPIからのリモートデータリソースのみを扱っていますが，[shared_preferences][shared_preferences]やKeychain/KeyStoreを利用したローカルデータソースに対する操作も責務に含まれます．  

RepositoryクラスはViewModelレイヤから利用されるのですが，Repositoryクラスはネットワークアクセスが行われるためViewModelクラスの内部でRepositoryクラスを初期化してしまうとViewModelのテストが困難になります．  
かといってViewModelクラスのコンストラクタにRepositoryクラスを引数として渡す場合，そのViewModelクラスを利用するViewでRepositoryクラスを作成してViewModelを得る必要が出てしまい，レイヤ跨ぎ(View -> Repository)が発生してしまいます．

これを解消するためにDI(Dependency Injection)を用いて各レイヤ間の結合をDIプロバイダに委任します．

Repositoryインスタンスには[riverpod][riverpod]の提供する`Provider`を介してアクセスするようにします．
そのために`FooRepository`にはパブリックなコンストラクタを実装せずプライベートコンストラクタ`._()`のみを定義し，外部ファイルから`FooRepository`インスタンスを直接立ち上げることを禁止します．  

```dart[data-file="foo_repository.dart"]
final fooRepositoryProvider = Provider<FooRepository>(
  (ref) => FooRepository._(ref.read(httpClientProvider)),
);
```

また，(一般的なアーキテクチャにおける)Repositoryクラスは永続化層と表現されることもあり，その文脈ではキャッシュ機構を持つことがあります．  
仮に`FooRepository`がキャッシュ機構を持つとした場合，そのテストがどのように記述されるべきかを見ていきます．

`FooRepository`がキャッシュ機構を持つ場合，リモートデータソースとキャッシュとの整合性の不一致が生じえます．
例えば`create`を呼んだ後に`list`を実行すると，`create`したデータが含まれないキャッシュが返されるなどが考えられます．  
データの整合性を担保するにはいくつか方法がありますが，ここではシンプルにキャッシュの破棄操作を行う実装を行うとしましょう．

```dart[data-file="foo_repository.dart"]
class FooRepository {
  FooRepository._(this._httpClient);

  final HttpClient _httpClient;
  List<Foo>? _cache;

  Future<List<Foo>> list() async {
    if (_cache != null) return _cache;

    _cache = ListFooRequest().request(_httpClient);
    return _cache;
  }

  // Requestクラスの説明では省略した[CreateFooRequest]を用いて
  // [Foo]レコードを作成するリクエストを行う．
  // [CreateFoo]クラスは[Foo]レコードを作成する際のDTO.
  Future<Foo> create(CreateFoo createFoo) async {
    _cache = null;
    await CreateFooRequest(createFoo).request(_httpClient);
  }
}
```

### test

Repositoryクラスはデータ取得・更新操作を行い，データの整合性を担保します．
Repositoryクラスのユースケースにおいては，その内部にキャッシュ機構があるかどうか，またはインメモリデータベースを利用しているかどうかは隠蔽されているべきです．
したがって実装の詳細には触れず，その振る舞いのみを保証するにはテストデータ更新後に最新のデータを返すかどうかを確認すれば良さそうです．  

次にテスト容易性を主軸にRepositoryクラスをどのように提供するか考察します．  
Repositoryクラスはその責務上複数のAPIクライアントクラスを操作するため，テストのタイミングではAPIクライアントクラスもしくはその処理のモックが必要となります．
Repositoryクラスにおいてもどのレイヤーをモックするかが設計のポイントとなるのですが，Repositoryクラスのコンストラクタに渡される`HttpClient`をモックする方針をとります．  
判断に至った思考仮定は次のようなものです;

**A. APIクライアントのテストのようにAPIサーバをモックする場合**  
この場合Repositoryクラスが扱う各APIクライアントクラスに対するモックAPIサーバの設定を記述する必要があります．
この設定にはエンドポイントのURLやレスポンスのJSONスキーマ定義など，APIクライアントクラスの責務となる詳細部分が必要なので，
APIクライアントの実装を変更することでRepositoryクラスのテストがfailする可能性があり，修正に脆いテストとなり得ます．

**B. 個々のAPIクライアントクラスをモックする場合**  
先に示した`FooRepository`クラスの実装ではAPIクライアントクラスをハードコードして利用しています．  
APIクライアントクラスをモックする場合には各APIクライアントクラスをDIするかコンストラクタの引数として受け取るような実装をする必要が生じます．  
(callerの直接の)コンストラクタでの引数渡しについては先に述べたとおり抽象化レイヤを跨いでしまうため避けたいです．  
またAPIクライアントクラスはRepositoryクラスにとってStatic Dependency[^1]であり，また各APIクライアントクラスをDIすることはOver-Injection[^2]に繋がるのでこれもベストとは言い難いです．

**C. HttpClientをモックする場合**  
Aではネットワーク先，BではAPIクライアントの振る舞いをそれぞれスタブする方針でした．  
APIクライアントクラスが利用する`HttpClient`をモックすることで，APIクライアントのネットワークリクエスト処理のみをスタブすることができます．  
APIクライアントクラスが`HttpClient`を利用する処理はmixinとして実装を与えてあるため，個々のAPIクライアントクラスの振る舞いには左右されず修正に強いテストが期待できます．
またBと比較してもDIする対象が1つで済むため適切であると言えます．

::: warn FooRepositoryのコンストラクタについて
FooRepository内部で直接ProviderをService Locatorとして利用することを避けるために，HttpClientをコンストラクタの引数として渡すような設計になっています．
:::

テストコードで`HttpClient`をProviderから受け取るには`ProviderContainer`を利用します．  
`ProviderContainer`の引数にDIプロバイダのオーバーライド設定を指定することで，テスト内では`mockHttpClient`を利用するRepositoryクラスを利用することができます．

```dart[data-file="foo_repository_test.dart"]
void main() {
  final container = ProviderContainer(
    overrides: [httpClientProvider.overrideWithValue(mockHttpClient)],
  );
  final repository = container.read(fooRepositoryProvider);
}
```

データ整合性のテストはユースケースを元に，`create`メソッド実行後に`list`メソッドの実行結果が`create`したデータを含むかどうかを確認します．

<small>もちろん`list`メソッド単体のテストは書く前提です.</small>

```dart[data-file="foo_repository_test.dart"]
void main() {
  // omitted

  // HttpClientの挙動をスタブ
  when(mockHttpClient.get(any)).thenAnswer((_) async => listFooResponse);
  var response = await repository.list();
  // verify(mockHttpClient.get(any)) として
  // **内部でmockHttpClientが呼ばれた**ことをテストすることも可能だが，
  // ここではRepositoryクラスの振る舞いを見ることを主軸に置くためテストに含めない．
  // 実際のユースケースではRepositoryクラスはProvider経由で利用され，
  // HttpClientはProvider内部で渡されるため利用する側からはHttpClientはされている.
  // あくまでテストにおいてのみRepositoryクラスがHttpClientを利用していることを知る必要が生じている．
  //
  // ListFooRequestの結果が返される
  expect(response, listFooResponse);

  // create時の挙動をスタブ
  when(mockHttpClient.post(any)).thenAnswer((_) async => createResponse);
  final createFoo = CreateFoo(/* */);
  response = await repository.create(createFoo);
  expect(response, createResponse);

  // 再度Listした際に更新されたResponseが返される
  when(mockHttpClient.get(any)).thenAnswer((_) async => updatedListResponse);
  response = await repository.list();
  expect(response, updatedListResponse);
}
```

## ViewModel

ViewModelはViewが利用するデータ及びロジックを提供します．  
ここが一番責務をどこにおくか悩むところだと思うので，ViewModelの定義について John Gossman. (2005)[^3]を紹介します．

> The UI may want to perform complex operations that must be implemented in code which doesn't make sense in our strict definition of the View but are too specific to be included in the Model (or didn't come with the pre-existing model).
> Finally we need a place to put view state such as selection or modes.
>
> The ViewModel is responsible for these tasks.
> The term means "Model of a View", and can be thought of as abstraction of the view,
> but it also provides a specialization of the Model that the View can use for data-binding.
> In this latter role the ViewModel contains data-transformers that convert Model types into View types, and it contains Commands the View can use to interact with the Model.

ここで示したいのはViewModelはViewとのデータバインディングだけではなく，Viewが行う複雑な操作(=ドメインロジック)をも責務に含むという点です．
これは逆にViewにそのような処理をもたせてはいけないというだけなので，ViewModelまたはServiceレイヤに持たせるようにします．  
ViewModelからはViewでの操作のハンドラを提供し，ViewからServiceクラスを直接呼ぶことのないようにします．  
例外的にpull-to-refreshのように描画・アニメーションがメインとなるロジックや，`BuildContext`を介する処理(例: `Navigator.push`等)についてはView側の責務となります．

また，テスト容易性の観点からはMartin Fowler氏のHumble Object[^4]をイメージするとViewとViewModelとのそれぞれの責務の切り分けがしやすいかと思います．

Viewのテストを考慮すると，View内部でViewModelをイニシャライズするとViewModelのモックがやや手間になります．  
したがってViewModelにおいてもProviderを利用して提供します．

ここで，ViewModelのライフサイクルをどうするか検討しましょう．  
ViewModelがViewを参照しない・してはならないことからもわかるように，ViewModelとViewとのライフサイクルは異なります．
しかしViewインスタンスが破棄された後にViewModelが生き続けると，再度Viewが生成された際にその(中途半端な状態を持つ)ViewModelが参照されると困るケースもあります．
そういったケースでは`StateNotifierProvider.autoDispose`を用いてViewModelのライフサイクルをViewに揃え，Viewが生成されるタイミングでViewModelを生成してデータの整合性を担保するようにします．

```dart[data-file="view_model.dart"]
final fooViewModelProvider = StateNotifierProvider.autoDispose<FooViewModel, FooState>(
  (ref) => WaitingListViewModel(
    fooRepository: ref.read(fooRepositoryProvider),
  ),
);
```

ViewModelが持つ状態はたとえ変数が1つであってもクラスとして切り出し，内包する状態が増えた際に変更に対して閉じるようにします．  

```dart[data-file="view_model.dart"]
@freezed
class FooState with _$FooState {
  const factory FooState._({
    required AsyncValue<List<Foo>> foos,
  }) = _FooState;
}
```

今回はViewがpull-to-refresh機能を提供するとして設計します．
その場合，Viewで必要となるロジックは以下のようなデータ及びイベントハンドラが考えられます；

- Viewで描画するデータ(`List<Foo>`)
- View作成時のViewModelの初期化処理(`onInit`)
- pull-to-refresh実行時のリフレッシュ処理(`onRefresh`)
- `Foo`の追加処理(`createFoo(CreateFoo foo)`)

また描画するデータ`List<Foo>`はAPIから取得するため，初期状態はデータを保持しておらずローディング中・ローディング失敗の状態も考えられます．
そういったケースに対応するため`Future`の値の変化を検知・通知できる[`AsyncValue`][async_value]を利用します．

それぞれを実装におとすと次のようになります．

```dart[data-file="view_model.dart"]
class FooViewModel extends StateNotifier<FooState> {
  FooViewModel({required FooRepository fooRepository})
      : _repository = fooRepository,
        super(const FooState._(foos: AsyncValue.loading())) {
    // construct時に初期化処理`onInit`を実行
    onInit();
  }

  final FooRepository _repository;

  Future<void> onInit() async {
    // 今回の例では簡単のため`onRefresh`を呼ぶだけ
    await onRefresh();
  }

  Future<void> createFoo(CreateFoo foo) async {
    await _repository.create(foo).then((res) {
      await onRefresh();
    }).catchError((e) {
      // TODO
    });
  }

  Future<void> onRefresh() async {
    await _repository.list().then((res) {
      state = state.copyWith(foos: AsyncValue.data(res));
    }).catchError((e) {
      state = state.copyWith(foos: AsyncValue.error(e as Object));
    });
  }
}
```

### test

ViewModelはViewが利用するデータ及びロジックの提供を責務とします．  
ViewModelのテストですが，単体でのテストを行うかViewと組み合わせたテストを行うか正直自分の中で答えを出せていません．
Viewの持つロジックを極力薄くすることで，擬似的にViewの取りうる振る舞いをViewModelでテストすることは可能です．ただViewModelの取りうる状態に応じた描画はViewでのテストでしか担保することができず，かつそれらは無視できる量・質のものとは言い難いです．  
そのためViewはViewのテストが必要となりますが，ViewModelが示す状態に沿う描画ができているかを検査すればよいので，ある程度宣言的にテストを記述できます．  

実際，実機での[integration_test][integration_test]や回帰テストを行う[golden toolkit][golden_test]などViewを対象としたテストツールも充実してきておりそれらを用いることで描画内容にとどまらないデザインのテストをも行うことが可能となってきています．  

ただ，そこに実際のViewModelを持ち込むかモックしたViewModelを持ち込むかは明確な判断理由を持てていません．  
ここではテスト容易性を主軸においたアーキテクチャの紹介を行い，いわゆるUIテストについては上記の説明に留めることとします．

---

先程実装した`FooRepository`はProvider経由のみのアクセスとするためにパブリックなコンストラクタを公開していませんでした．
直接インスタンスを生成できないというのも理由のひとつですが，`FooRepository`は内部でネットワークリクエストを行うためどのみちそのまま扱うことができません．  
そのため`FooRepository`のモックオブジェクトを生成し，`fooRepositoryProvider`に注入して`FooViewModel`から`MockFooRepository`が参照されるように設定します．

今回利用するモックライブラリ[mockito][mockito]が生成するモックは，次のように対象のクラスを`implements`する形で実装されます．  
パブリックなコンストラクタを自動で生成してくれるので，`MockFooRepository`インスタンスを用いて`fooRepositoryProvider`を上書きできます．

```dart[class="line-numbers"][data-file="foo_repository.mocks.dart"]
class MockFooRepository extends _i1.Mock implements _i2.FooRepository {
  MockFooRepository() {
    _i1.throwOnMissingStub(this);
  }

  @override
  _i3.Future<List<Foo>> list() => (/* omitted */);
}
```

今回はViewModelとViewを共に扱いテストを行います．
ここでは`FooViewModel`を利用するViewを`FooView`とします．

```dart[class="line-numbers"][data-file="foo_view_model_test.dart"]
void main() {
  final repository = MockFooRepository();
  final container = ProviderContainer(
    overrides: [fooRepositoryProvider.overrideWithValue(repository)],
  );

  // repositoryのmock等を行う

  testWidgets('FooViewModel smoke test with view', (WidgetTester tester) async {
    final widget = ProviderScope(
      overrides: [fooRepositoryProvider.overrideWithValue(repository)],
      child: const MaterialApp(home: FooView()),
    );

    await tester.runAsync(() async {
      await tester.pumpWidget();
      // 初期状態の確認.
      // APIリクエストが完了していないのでデータローディングの旨を表示したい
      expect(find.text('データ読み込み中'), findsOneWidget);
      // 描画更新を更新.
      // APIリクエストが完了している(ようレスポンスをスタブする)ので
      // ローディングが完了しデータが描画されていることを確認
      // (レスポンスはListViewで描画しているとする)
      expect(find.text('データ読み込み中'), findsNothing);
      expect(find.byType(ListView), findsOneWidget);

      // pull to refresh 実行
      // pull to refreshをテスト上でimitateする処理は以下を参照
      // @see: https://github.com/flutter/flutter/blob/d62f75dde1cb6f04fadb9aff48896491ff0e2163/packages/flutter/test/material/refresh_indicator_test.dart#L119-L122
      when(repository.list()).thenAnswer((_) async => /* response */);
      await tester.fling(find.byType(ListView), const Offset(0, 300), 1000);
      await tester.pump();
      await tester.pump(const Duration(seconds: 3));
      // responseが更新されていることを確認
      expect(/* */);
    });
  });
}
```

同様にしてRepositoryから`Future.error`を返すことでWidgetのエラー時の描画のテストを行うことが可能です．

### ViewModelとService class

ViewModelの処理をどのタイミングでServiceクラスへ委譲するかの基準は，[Arrange-Act-Assert][aaa]におけるArrange[^6]のコストを一つの目安とすることができます．  
テストの準備の記述(Arrange)が少なくない割合を占める場合，テスト対象が状態や責務を持ちすぎている可能性があります．
そうなった場合にはArrangeの記述及びViewModelのメソッドの処理からテスト(の準備が)しづらいメソッドを探しだしてServiceクラスへ抽出します．
そうすることでテスト容易性を高め，かつテスト対象の関心の対象を絞ることで壊れづらいテストコードを保つことが可能です．  

<small>このアプローチは実際テスト対象とレイヤーの異なる責務を見分けて分離するには便利な手法だと感じています</small>

補足:  
SOLID原則の[Single-responsibility principle][srp]は"1つのクラスは1つの責務"といった説明がされがちですが，真意は"1つのクラスは1つの(アクターに対し)責務(を負う)"ということです．  
ViewModelは責務が多くなりがちですが，対応するViewに対してのみ責務を追っているためSRPの観点からは適切です．  
ただしViewModelのメソッドの処理をテストする際にViewModelがServiceクラスのアクターになれる場合においては，それはメソッドの処理をServiceクラスへと切り出すタイミングだと思います．

---

以上，テスト容易性を意識したFlutterアプリケーションのアーキテクチャを考察していきました．
長くなってスマン.

Dartの型システムは比較的緩いので，そういった言語特性も含めテストでカバーしていきたい気持ちがあり今回このような検討を行いました．  
結合度と凝集度など関数レベルでの設計やTDDなどのプラクティスはもちろん，アーキテクチャレベルで考慮することで更にテスト容易性を向上することができ，またソフトウェアの品質を担保することに繋がります．

<small>
  半年とか経ったら振り返りをしようと考えています．  
</small>

[praha_test]: https://www.praha-inc.com/lab/posts/testability
[testability]: https://www.satisfice.com/download/heuristics-of-software-testability
[shared_preferences]: https://pub.dev/packages/shared_preferences
[freezed]: https://pub.dev/packages/freezed
[riverpod]: https://pub.dev/packages/riverpod
[dotenv]: https://pub.dev/packages/flutter_dotenv
[json_serializable]: https://pub.dev/packages/json_serializable
[http]: https://pub.dev/packages/http
[dio]: https://pub.dev/packages/dio
[flutter_test]: https://api.flutter.dev/flutter/flutter_test/flutter_test-library.html
[mockito]: https://pub.dev/packages/mockito
[mock_http_server]: https://pub.dev/packages/mock_web_server

[async_value]: https://pub.dev/documentation/riverpod/latest/riverpod/AsyncValue-class.html
[di_principles]: https://livebook.manning.com/book/dependency-injection-principles-practices-patterns/about-this-book/1

[integration_test]: https://flutter.dev/docs/cookbook/testing/integration/introduction
[golden_test]: https://pub.dev/packages/golden_toolkit

[aaa]: https://docs.microsoft.com/en-us/visualstudio/test/unit-test-basics?view=vs-2019#write-your-tests
[srp]: https://en.wikipedia.org/wiki/Single-responsibility_principle


[^1]: [Dependency Injection principles, Manning][di_principles]. volatile dependency/static dependency
[^2]: https://blog.ploeh.dk/2018/08/27/on-constructor-over-injection/
[^3]: https://docs.microsoft.com/en-us/archive/blogs/johngossman/introduction-to-modelviewviewmodel-pattern-for-building-wpf-apps
[^4]: https://martinfowler.com/bliki/HumbleObject.html
[^5]: https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html
[^6]: またはHeuristics of Software TestabilityにおけるControllability/Decomposability.
