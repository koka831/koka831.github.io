---
title: 'Install Arch Linux'
date: 2020-06-05
categories:
- Diary
tags:
- Linux
description: log
---

## 0. Partition Table
インストール先のディスク名を調べる.

```shell-session[data-file="terminal"]
$fdisk -l
bar
```

[[info | custom container]]
| content
| bar


multi line

## 1. Reset Partition
- cgdisk/sgdiskを使う
    - cgdiskがcursesベースなので使いやすい

```shell-session
$echo $EDITOR
vim
$git checkout master
Switched to branch 'master'
Your branch is up-to-date with 'origin/master'
#foo
$git push
Everything up-to-date
[sudo] password for koka:
$echo 'All
> done!'
All
done!
$cgdisk /dev/nvme0n1
```

```shell-session
$ ls -la
```

最低限必要なpartitionは以下の3つ. 

- /boot/efi: EFI
- /boot    : Linux FS
- / (root) : Linux FS

ブートセクタの開始領域がEFIになっている必要があるので、上から順に設定していく.
/boot/efiが/bootに入れ子になっているが, mount時に調整する.

### EFI partition

- /boot/efi partition
    - First Sector: Enter(default)
    - Size in sectors: 512M
    - Hex code or GUID: ef00
    - Enter new partition name: EFI System

### boot partition

- /boot
    - First Sector: Enter(default)
    - Size: 512M
    - Hex: 8300
    - Enter new partition name: Linux filesystem

### root partition

- /
    - First Sector: Enter(default)
    - Size: Enter(default=max)
    - Hex: 8300
    - Enter new partition name: Linux filesystem


### Result of partitioning
- 512G SSDを対象に行うと以下のようになる.

```sh
$ fdisk -l
Device          Start   End             Sectors Size    Type
/dev/nvme0n1p1  2048    1050623         1048576 512M    Efi system
/dev/nvme0n1p2 1050624  2099199         1048576 512M    Linux filesystem
/dev/nvme0n1p3  2099200 1000215182    998115983 476G    Linux filesystem
```

## 2. Disk Format
mkfsを用いて各partitionをフォーマットする.  
efi領域はFAT32指定、その他Linux filesystemの領域はext4等好みのファイルシステムを用いる.

```sh
mkfs.fat -F32 /dev/nvme0n1p1
mkfs.ext4 /dev/nvme0n1p2
mkfs.ext4 /dev/nvme0n1p3
```

## 3. Mount Volume
1, 2で作成したpartitionをboot USBからアクセスできるようにマウントする.
1.で行ったパーティショニングとマウントの順番が異なるので注意(1敗).

```shell-session
# /root
$ mount /dev/nvme0n1p3 /mnt

# /boot
$ mkdir /mnt/boot
$ mount /dev/nvme0n1p2 /mnt/boot

# /boot/efi
$ mkdir /mnt/boot/efi
$ mount /dev/nvme0n1p1 /mnt/boot/efi
```

## 4. Install Linux system

### Setup repository mirror
`/etc/pacman.d/mirrorlist`を編集し現在位置から距離の近いミラーを一番上にもってくる.

```shell-session
$ vim /etc/pacman.d/mirrorlist
# use mirror in Japan
```


### Install base system
マウントした`/root`に対してLinuxやその後の作業に必要な諸々をインストールする.
後述する5.1でマウント領域に`chroot`したあとはboot USB内のデフォルトツール類が使えなくなるので, エディタはここでインストールしておく.


```shell-session
# linux base system
pacstrap /mnt base linux linux-firmware
# for wifi
pacstrap /mnt base-devel grub efibootmgr dosfstools netctl iw wpa_supplicant networkmanager dialog vim
```

### generate fstab file

```sh
genfstab -U /mnt >> /mnt/etc/fstab
```

### check filesystem

```shell-session
$ cat /mnt/etc/fstab
/dev/nvme0n1p3 /         ext4 rw,relatime 0 1
/dev/nvme0n1p2 /boot     ext4 rw,relatime 0 2
/dev/nvme0n1p1 /boot/efi vfat rw,relatime,fmask=0022,codepage=... 0 2
```


## 5 enter arch!

```shell-session
arch-chroot /mnt /bin/bash
```

### Setup locale/timezone

```shell-session
# locale
$ vim /etc/locale.gen
# uncomment en_US.UTF-8 and ja_JP.UTF-8
$ locale-gen
$ echo "LANG=en_US.UTF-8" > /etc/locale.conf

# timezone
$ tzselect 4, 19, 1
$ hwclock --systohc --utc
```

### Setup bootloader
bootloaderの作成.

```shell-session
$ mkinitcpio -p linux
$ grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=arch --boot-directory=/boot/efi/EFI --recheck
$ grub-mkconfig -o /boot/efi/EFI/grub/grub.cfg
```

### Change Root password & add User
5.4にてリブートする前にユーザを作成しておく(1敗).

```shell-session
$ passwd
$ useradd -m -g users -G wheel -s /bin/bash koka
$ passwd koka
$ visudo # and uncomment %Wheel all=(all) all
```
### Reboot & eject USB
シャットダウンしてbootUSBを取り外し再起動する

## 6. Setup Arch Linux

### network
wifiの設定.
`nmtui`が好きなのでNetworkManagerを用いた.
セットアップ後の開発において`systemd-nspawn`を使う場合, ネットワークアダプタは`systemd-networkd`なのでそっちの場合は`systemd`に統一しといたほうが後々楽.

```shell-session
$ systemctl start NetworkManager
$ systemctl enable NetworkManager
$ nmtui
```

### Setup X Window System
[ref](https://wiki.archlinux.jp/index.php/Xorg)
CUIからGUIへ.

```shell-session
$ lspci | grep -e VGA -e 3D
$ # XとDMとしてlight DM(とログイン画面)をインストール
$ pacman -S xf86-video-intel xorg-server xorg-xrdb lightdm lightdm-gtk-greeter
$ # terminal emulatorも入ってないので何かしらいれとく(1敗)
$ pacman -S rxvt-unicode

$ systemctl enable lightdm
$ # WMをインストール
$ pacman -S i3-gaps i3status dmenu
$ # tlp/バッテリ最適化モジュール
$ pacman -S tlp
$ # フォント
$ # ブラウザやアプリはデフォだとシステム設定のフォント読まずに表示が汚くなるので、
$ # デフォ指定に含まれているttf-dejavuを入れとく(Ubuntuのデフォフォント).
$ pacman -S ttf-fira-code oft-ipamjfont ttf-dejavu
$ pacman -S xorg-xbacklight # 画面の明るさ
$ pacman -S pulseaudio-alsa alsa-utils alsa-plugins # 音量
```
