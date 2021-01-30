---
title: 'ABC105-D: Candy Distribution'
date: 2019-03-15
categories:
- Competitive Programming
tags:
- 累積和
description: 余りの累積和
---

## 概要
$N$要素の配列$A_N$($N \leq 10^5$)に
$\sum^{r}_{i = l} A_i \% m = 0$を満たす$(l, r)$ペアはいくつあるか.  

---

連続区間なので, 累積和を用いて区間$(l, r)$の和の余りを表せないか考える.  
$S_k = \sum^{k}_{i=0} A_i$ とすると, $S_i \% m$で表せる.
区間$(l, r)$の場合には, $\left(S(r) - S(l)\right) \% m$となる.  
ただ, 上式だと余りを求める際に$S(r), S(l)$両端が必要になるので, ２重ループになってしまい, まだ計算量を削る必要がある.  
これは $S(r) - S(l) \% m == 0 \iff S(r) \equiv S(l) \ (mod \: m)$と変形できるので, $S(i) \% m$を累積和として持てば$O(N)$で計算できる.  


## 解答

```rust
fn main() {
    let (n, m) = {
        let i = read::<usize>();
        (i[0], i[1])
    };

    let an = read::<usize>();
    let mut rem = HashMap::new();
    let mut cs = vec![0; n];
    cs[0] = an[0] % m;
    *rem.entry(cs[0]).or_insert(0) += 1;

    for i in 1..n {
        cs[i] = (cs[i - 1] + an[i]) % m;
        *rem.entry(cs[i]).or_insert(0) += 1;
    }

    let ans = rem.iter()
        .map(|(_, &num)| if num >= 2 { ncr(num, 2) } else { 0 })
        .sum::<usize>();

    println!("{}", ans + rem.get(&0).unwrap_or(&0));
}
```


## まとめ
$\sum^{r}_{i = l} A_i \% m = 0 \iff (S(r) - S(l) \% m = 0 \iff S(r) \equiv S(l) \ (mod \: m)$
