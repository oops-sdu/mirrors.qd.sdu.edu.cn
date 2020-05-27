---
sidebarDepth: 1
---
# Debian

目前支持的指令集：仅 amd64。

目前支持的版本：仅 buster。

仅二进制包，不包含源码。

## Debian 10
Debian 10 (buster) 用户请将 `/etc/apt/sources.list` 文件改为以下内容：

```
deb http://mirrors.qd.sdu.edu.cn/debian buster main contrib non-free
deb http://mirrors.qd.sdu.edu.cn/debian-security buster/updates main contrib non-free
deb http://mirrors.qd.sdu.edu.cn/debian buster-updates main contrib non-free
```

## 一点小提示
debian-security 的 buster/updates 提供了重要的安全更新。类比于 ubuntu 中的 bionic-security。

debian 的 buster-updates 提前提供下一个更新点的部分软件更新，如病毒扫描程序和时区数据等。类比于 ubuntu 中的 bionic-updates。
