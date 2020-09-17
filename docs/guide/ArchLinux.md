# ArchLinux

编辑 `/etc/pacman.d/mirrorlist`，改为以下内容：

```ini
Server = http://mirrors.qd.sdu.edu.cn/archlinux/$repo/os/$arch 
```

更新 pacman 数据库和安装的软件。

```bash
pacman -Syu
```

## 提示
ArchLinux 是滚动更新的 Linux 发行版，请尽可能频繁地更新系统，不要间隔太长时间再去更新。
如果在更新系统时出现导入 PGP 公钥的提示，请按 `Ctrl+C` 中止 pacman，并使用 pacman -S archlinux-keyring 命令首先更新信任的公钥链。