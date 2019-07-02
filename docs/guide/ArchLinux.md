# ArchLinux

编辑 `/etc/pacman.d/mirrorlist`，改为以下内容：

```ini
Server = http://intranet.mirrors.oops-sdu.cn/archlinux/$repo/os/$arch 
```

更新 Pacman 数据库。

```bash
pacman -Syu
```

