# ArchLinux

编辑 `/etc/pacman.d/mirrorlist`，改为以下内容：

```ini
Server = http://mirrors.qd.sdu.edu.cn/archlinux/$repo/os/$arch 
```

使用以下命令更新系统，即更新 pacman 数据库和安装的软件。

```bash
pacman -Syu
```

## 提示
ArchLinux 是滚动更新的 Linux 发行版，请尽可能频繁地更新系统。

如果间隔太长时间没有更新系统，在更新系统时可能出现 `Import PGP key` 的提示，一般是由于之前信任的 GPG 公钥的过期时间已到，自动失效。请按 `Ctrl+C` 中止 pacman，并使用 pacman -S archlinux-keyring 命令重新导入信任的公钥列表。