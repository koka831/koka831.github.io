---
title: 'Linux: Login/sudo with Yubikey'
date: 2019-08-08
categories:
- diary
tags:
- Linux
- udev
- yubikey
description: Yubikeyを自宅に忘れて１敗
---

## Abstract
- Linux Desktopのログイン時及び`sudo`時にYubikey + Passwordを必須にしてみた.
- ログインした状態でYubikeyを抜くとlockするようにした.

## Env
- Ubuntu 18.04
- FIDO U2F Security Key(自分は[これ](https://www.amazon.co.jp/dp/B06XHTKFH3/ref=cm_sw_em_r_mt_dp_U_Ha5sDbS6H12P6)つかってます. 端子ガードついてるKey他にも出てほしい)

## Install Dependencies

```sh
$ sudo add-apt-repository ppa:yubico/stable
$ sudo apt-get install yubikey-manager-qt yubioath-desktop yubikey-personalization-gui
```

## Setup U2F Key
### U2F Keyの登録

```sh
$ mkdir -p $HOME/.config/Yubico
$ pamu2fcfg -u${USER} > $HOME/.config/Yubico/u2f_keys
```

またバックアップデバイスを追加する場合には`--nouser`をつけて追記[^pamu2fcfg].

```sh
$ pamu2fcfg -n >> $HOME/.config/Yubico/u2f_keys
```

### U2F for SUDO
以下の6行目を追記. PAM(Pluggable Authentication Modules)での認証において，password入力後にYubikeyがrequireされるようになる(Yubikeyが無いとauthできない).

**`/etc/pam.d/sudo`**

```diff
 #%PAM-1.0

 session    required    pam_env.so readenv=1 user_readenv=0
 session    required    pam_env.so readenv=1 envfile=/etc/default/locale user_readenv=0
 @include   common-auth
+auth       required    pam_u2f.so
 @include   common-account
 @include   common-session-noninteractive
```

### U2F for Login
Display ManagerにGDM(Gnome Display Manager)を用いている場合は以下のファイルに`pam_u2f.so`の行を追記する.  
**`/etc/pam.d/gdm-password`**
その他のDMを用いている場合(KDE等)は **`/etc/pam.d/lightdm`** に追記する.


```diff
 #%PAM-1.0
 auth     requisite       pam_nologin.so
 auth     required        pam_succeed_if.so user != root quiet_success
 @include common-auth
+auth     required        pam_u2f.so
 auth     optional        pam_gnome_keyring.so
 @include common-account
 ...omit
```

## Auto-lock without U2F
ここからが本題. U2F Keyの接続が解除されると端末をロックする.  

もともと自分の使っているLaptopには指紋認証センサが付属している．一般に生体認証はU2Fよりもセキュアであるし，自分も異論はない.  
ではU2Fが生体認証より優れている点はなにか. 自分の答えは認証の持続性をコントロールできる点である.  

指紋認証を例に取ると，一度ログインした端末は一定時間操作をしない際のオートロックまたはユーザ自身の能動的なログアウトをしない限り，認証を再度必要としない.  
対してU2Fでは**デバイスが接続されている間だけ認証されている**という状態をもたらすことができる.

Apple Watchを身に着けた状態でMacの自動ログインが可能[^applewatch]という例がある.
これはbluetooth接続したU2Fデバイスが一定距離離れるもしくはUSB接続したデバイスをejectすることで端末からログアウトする，という仕様で再現できる.

### monitoring U2F key by udev
U2F Keyモニターをudevに任せることにする. まず対象のIDを特定する.
`udevadm monitor`でudevのイベントをモニタリングした状態でU2F Keyを抜き差しすると `bind`, `remove` イベントが通知されるので， `$ID_MODEL_ID` 及び `$ID_VENDOR_ID` を取得する.

```sh
$ udevadm monitor --environment --udev

UDEV  [28028.490650] bind     /devices/pci0000:00/0000:00:14.0/usb1/1-3 (usb)
ACTION=bind
BUSNUM=001
DEVNAME=/dev/bus/usb/001/013
DEVNUM=013
DEVPATH=/devices/pci0000:00/0000:00:14.0/usb1/1-3
DEVTYPE=usb_device
DRIVER=usb
ID_BUS=usb
ID_MODEL=XXXXX
ID_MODEL_ENC=XXXXX
ID_MODEL_ID=f025
ID_REVISION=0100
ID_SERIAL=ExcelSecu_EsecuFIDO_HID
ID_USB_INTERFACES=:030000:
ID_VENDOR=ExcelSecu
ID_VENDOR_ENC=ExcelSecu
ID_VENDOR_ID=1ea8
MAJOR=189
MINOR=12
PRODUCT=1ea8/f025/100
SEQNUM=12938
SUBSYSTEM=usb
TYPE=0/0/0
USEC_INITIALIZED=28027949334
```

上記の例では `ID_MODEL_ID=f025`，`ID_VENDOR_ID=1ea8` となっている.
このIDペアを用いて，U2F Key解除時の`udev`ルールを作成する.

**`/etc/udev/rules.d/xx-u2fkey.rules`** (xxは適当な数字)

```config
ACTION=="remove", ENV{ID_VENDOR_ID}=="1ea8", ENV{ID_MODEL_ID}=="f025", RUN+="/usr/local/bin/i3lock"
```

最後にrulesを登録し完了.

```sh
$ udevadm control --reload-rules
$ service udev reload
```

---
フリーランスという職業柄，PCを所持して企業へ出向くことが多くどうやってセキュリティ担保するかなーと考えてたところ`pamu2fcfg`を見かけたので試してみた.  
Yubikeyを忘れて外出するという失態を犯した[^twi]ので既に運用が危ういがデータは守れてるのでよし(よくないが)


## Reference
[^pamu2fcfg]: [developers.yubico.com/pam-u2f/Manuals/pamu2fcfg.1.html](https://developers.yubico.com/pam-u2f/Manuals/pamu2fcfg.1.html)
[^applewatch]: [support.apple.com/ja-jp/HT206995](https://support.apple.com/ja-jp/HT206995)
[^twi]: [twitter.com/k_0ka/status/1159312312156561408](https://twitter.com/k_0ka/status/1159312312156561408)
- [Enable FIDO U2F USB support](https://wiki.gentoo.org/wiki/Pam_u2f)
- [support.yubico.com#enabling the Yubico PPA on Ubuntu](https://support.yubico.com/support/solutions/articles/15000010964-enabling-the-yubico-ppa-on-ubuntu)
- [support.yubico.com#Ubuntu Linux Login Guide - U2F](https://support.yubico.com/support/solutions/articles/15000011356-ubuntu-linux-login-guide-u2f)
