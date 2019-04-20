# Ubuntu

目前支持的指令集：amd64 和 i386。

目前支持的版本：bionic 和 xenial。

仅二进制包，不包含源码。

## Ubuntu 18.04 LTS

Ubuntu 18.04 LTS (bionic) 用户请将 `/etc/apt/sources.list` 文件改为以下内容：

    deb http://10.102.7.58/ubuntu/ bionic main restricted universe multiverse
    deb http://10.102.7.58/ubuntu/ bionic-security main restricted universe multiverse

## Ubuntu 16.04 LTS

Ubuntu 16.04 LTS (xenial) 用户请将 `/etc/apt/sources.list` 文件改为以下内容：

    deb http://10.102.7.58/ubuntu/ xenial main restricted universe multiverse
    deb http://10.102.7.58/ubuntu/ xenial-security main restricted universe multiverse

## 强迫症选项

桌面版 Ubuntu 在主要使用 amd64 架构的同时，默认也同时支持了 i386 架构。如果希望彻底抛弃 i386 架构，以管理员权限执行以下命令。

```bash
dpkg --remove-architecture i386
```

