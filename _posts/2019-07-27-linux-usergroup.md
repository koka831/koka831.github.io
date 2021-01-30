---
title: 'Linux: 画面の明るさを変更できなくなった'
date: 2019-07-27
categories:
- diary
tags:
- Linux
- udev
description: バルス
---

## TL; DR
- 作業ユーザを`video`グループに追加
- udevのrulesを追加し`brightness`デバイスへの書き込み権限を付与


## 概要
Thinkpad X1 Carbon(2019)を購入したので，Gentooをインストールした. 
が，F5, F6での明るさ調整が効かなかった. クッソまぶしい.

明るさ調整には`light`コマンドを用いたところ，`sudo light -A 5`のようにroot権限を用いると調整が行えた.

## 解決策
1. 作業ユーザを`video`グループに追加する.

usergroupは以下で確認できる.
```sh
$ cut -d: -f1 /etc/group
```
そのなかでもメジャーなものは以下(独断).
|name|role|
|:---:|:---:|
|wheel| 管理権限作業用グループ|
|log| /var/log/ へのアクセス用グループ|
|video| ビデオキャプチャ・フレームバッファアクセス|
|docker| docker作業用グループ|

```sh
usermod -aG video ${USER}
```
`usermod`コマンドを用いて`$USER`をグループに追加する.  
例えば`$USER`を`docker`グループに追加した場合, `$USER`は`docker`の操作に管理者権限が不要となる.  

(ただ第三者が作成したスクリプトであってもroot権限で実行できるということなので，`docker`を用いる場合には`newgrp`を用いて一時的にグループを変更するなどのほうがいいと思う. `docker`の場合権限昇格などのリスクもあるので気をつけよう．お兄さんとの約束だよ)

2. `brightness`デバイスの書き込み権限を`video`グループに付与する.

画面の明るさ(`brightness`)は`udev`によって管理されている. 
`/usr/lib/udev/rules.d/xx-brightness.rules`を次のように記述する.

```
ACTION=="add", SUBSYSTEM=="backlight", RUN+="/bin/chgrp video /sys/class/backlight/%k/brightness"
ACTION=="add", SUBSYSTEM=="backlight", RUN+="/bin/chmod g+w /sys/class/backlight/%k/brightness"
```

これで起動時に`video`グループに対して`brightness`デバイスへの書き込み権限が付与される.

## 追記

かわいい感じになりました. yay
![](./img/desktop.png)

## reference
- [arch linux#グループ一覧](https://wiki.archlinux.jp/index.php/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%A8%E3%82%B0%E3%83%AB%E3%83%BC%E3%83%97)
- [arch linux#brightness](https://wiki.archlinux.org/index.php/Backlight)
