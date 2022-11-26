---
title: UnionFind
date: 2019-03-08
categories:
- Competitive Programming
tags:
- Graph
- TODO
description: rankしかもってなかった
---

[AtCoder Beginners Contest 120](https://atcoder.jp/contests/abc120) で連結成分のsizeを計算するdisjoint-setの問題が出題された.
それまでrankを用いたUnion-Findしか経験がなかったので, この機会にまとめる.

## Union-Find
Union-Findは要素が同一の集合に含まれるかどうかを判定するデータ構造.

| Query      | Process       |
|------------|---------------|
| unite(x, y)|X(x $\in$ X)とY(y $\in$ Y)をマージする |
| same(x, y) |X == Y か判定する   |

の操作を

各要素を1つのノード, 集合を木と表現する.
要素が同一の集合に含まれる場合, それらの要素は同一の木のノードである.


上記操作をならし計算量$O(\alpha(n))$で行う[^1]ためのマージ戦略が以下の経路圧縮とrankである.

### 経路圧縮
要素が同一の木のノードであるか判定する場合, 各要素のrootが同一かどうか見ればよい.
ただその場合木の高さだけ再帰的に親ノードを辿る必要がある.  
そこで, 親ノードを調べる際に調べたノードをrootに直接つなぎ直すことで,次回以降の判定時の計算量を$O(1)$に削減する.


### Rank
$unite()$操作時に木の高さが高い方を親として, 低い方を高い方に繋げるようにする.

ここで, 経路圧縮と併用する場合には圧縮前の高さでrankを持つ必要がある.
経路圧縮は$find()$操作時に行うため, $unite()$の段階では必ずしも木の高さが$1$となっている保証はない.

<details>
<summary>以下は経路圧縮のみの実装例.</summary>
<div>

```rust
struct UnionFind {
  par: Vec<usize>,
}

impl UnionFind {
  fn new(n: usize) -> Self {
    UnionFind {
      par: (0..n).collect(),
    }
  }

  fn unite(&mut self, x: usize, y: usize) {
    let px = self.find(x);
    let py = self.find(y);
    if px == py { return; }
    self.par[py] = px;
  }

  fn same(&mut self, x: usize, y: usize) -> bool {
    self.find(x) == self.find(y)
  }

  fn find(&mut self, x: usize) -> usize {
    if self.par[x] == x { x }
    else {
      // 経路圧縮
      let p = self.par[x];
      self.par[x] = self.find(p);
      self.par[x]
    }
  }
}
```
</div>
</details>

## [Decayed Bridges](https://atcoder.jp/contests/abc120/tasks/abc120_d)

本題.

$n$頂点$m$辺の無向単純グラフの辺$i \in M$を順番に取り除いたとき, 時刻$i$でアクセスできない頂点が何組あるか.

### かんがえたこと

Union-Findでは要素を統合することはできても分割操作は行えない.
辺を除去する操作を考える場合にはグラフ全体を保持する必要が出てきてしまう. でも$n, m \leq 10^5$で隣接グラフを持つのはエグいし連結判定が厳しい.

では操作を巻き戻すとどうなるかを考えた.

まず辺をすべて取り除いた状態から開始し，辺を追加していく.  
このアプローチならUnion-Findで管理できる.

辺を追加することで$a$頂点と$b$頂点が新たに連結されたとすると, アクセスできる頂点ペアは$a * b$個増える.
この連結された頂点の増加判定は$same$操作を$unite$操作の前後に行うことで行える.

が, Union-Findで集合の要素数を持つケースを初めて見たのでやや手間取った. 本番では構造体に要素数`siz`を`Vec`で保持させて$unite$時に更新してなんとかなった.

::: info 追記

この辺が存在した場合の連結する頂点数を考えると, $n * (n - 1) / 2$なのでここから引いてくと楽.

:::

<details>
<summary>解答</summary>
<div>

```rust
fn main() {
    let (n, m) = {
        let i = read::<usize>();
        (i[0], i[1])
    };

    let mut ab = Vec::new();
    for _ in 0..m {
        let (a, b) = {
            let i = read::<usize>();
            (i[0], i[1])
        };
        ab.push((a, b));
    }

    let mut uf = UnionFind::new(n + 1);
    let mut cost = n * (n - 1) / 2;
    let mut ans = Vec::new();

    for (a, b) in ab.into_iter().rev() {
        ans.push(cost);
        if uf.same(a, b) { continue; }
        let pa = uf.find(a);
        let pb = uf.find(b);
        let c = uf.siz[pa] * uf.siz[pb];
        uf.unite(a, b);
        cost -= c;
    }

    for a in ans.iter().rev() {
        println!("{}", a);
    }
}
```
</div>
</details>

## 所感
unite by rankとunite by sizeは本質的には同じなので落ち着いて対処したかった.

またrankに符号付き整数を用いて, 正負でsize or rankを表すテクもあることを知った.

::: info TODO

basic ([Bridge/ABC075](https://atcoder.jp/contests/abc075/tasks/abc075_c))  
weighted(Potential) Union-Find ([People on a line/ABC087](https://atcoder.jp/contests/abc087/tasks/arc090_b))  
永続UF ([Stamp Rally/AGC002](https://agc002.contest.atcoder.jp/tasks/agc002_d))  
わからん ([Nuske vs Phantom Thnook/AGC015](https://agc015.contest.atcoder.jp/tasks/agc015_c))

:::

[^1]: $\alpha^{-1}(n) = Ackerman(n, n)$. 経路圧縮とrankどちらかのみの場合はならし計算量$O(log n)$.
