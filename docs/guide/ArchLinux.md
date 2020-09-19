# ArchLinux

编辑 `/etc/pacman.d/mirrorlist`，改为以下内容：

```ini
Server = http://mirrors.qd.sdu.edu.cn/archlinux/$repo/os/$arch 
```

使用以下命令更新系统，这会同时更新 pacman 数据库和安装的软件。

```bash
pacman -Syu
```

## 提示

- ArchLinux 是滚动更新的 Linux 发行版，请尽可能频繁地更新系统。如果间隔太长时间没有更新系统，在更新系统时可能出现 `Import PGP key` 的提示，一般是由于之前信任的 GPG 公钥的过期时间已到，自动失效。请按 `Ctrl+C` 中止 pacman，并使用 pacman -S archlinux-keyring 命令重新导入信任的公钥列表。
- 由于不同镜像站的更新进度不一样，为最大程度保证 ArchLinux 的稳定性，切换镜像站之前，建议先搁置一两天不要更新，然后再切换镜像站并更新系统。否则，在更换镜像站后，在使用 `pacman -Syu` 更新系统时可能会出现 HTTP 404 问题，此时可使用 `pacman -Syyu` 命令强制更新数据库。如果依然存在问题，可考虑使用 `pacman -Syyuu` 命令降级。注意，这些命令都是比较危险的命令，应慎重考虑后再使用。