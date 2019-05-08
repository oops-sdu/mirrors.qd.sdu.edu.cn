---
sidebarDepth: 1
---
# Ubuntu

目前支持的指令集：amd64 和 i386。

目前支持的版本：bionic 和 xenial。

仅二进制包，不包含源码。

## Ubuntu 18.04 LTS

Ubuntu 18.04 LTS (bionic) 用户请将 `/etc/apt/sources.list` 文件改为以下内容：

    deb http://intranet.mirrors.oops-sdu.cn/ubuntu/ bionic main restricted universe multiverse
    deb http://intranet.mirrors.oops-sdu.cn/ubuntu/ bionic-security main restricted universe multiverse

## Ubuntu 16.04 LTS

Ubuntu 16.04 LTS (xenial) 用户请将 `/etc/apt/sources.list` 文件改为以下内容：

    deb http://intranet.mirrors.oops-sdu.cn/ubuntu/ xenial main restricted universe multiverse
    deb http://intranet.mirrors.oops-sdu.cn/ubuntu/ xenial-security main restricted universe multiverse

## 强迫症选项

桌面版 Ubuntu 在主要使用 amd64 架构的同时，默认也同时支持了 i386 架构。如果希望彻底抛弃 i386 架构，可按以下步骤进行。

1. 搜索并删除所有 i386 的软件包。不过，默认情况下，应该没有 i386 软件包。

```bash
apt-get remove "^.*:i386$"
```

2. 移除对 i386 架构的支持。

```bash
dpkg --remove-architecture i386
```

