# Ubuntu

目前支持的指令集：仅 amd64。

目前支持的版本：bionic 和 xenial。

## Ubuntu 18.04 LTS

Ubuntu 18.04 LTS (bionic) 用户请将 `/etc/apt/sources.list` 文件改为以下内容：

    deb http://mirrors.oops-sdu.cn/ubuntu/ bionic main restricted universe multiverse
    deb http://mirrors.oops-sdu.cn/ubuntu/ bionic-security main restricted universe multiverse

因为镜像站硬盘容量限制，我们只备份了 64 位的源。如果曾安装过 32 位的包请尝试适用以下命令解除安装。

    sudo dpkg --remove-architecture i386

## Ubuntu 16.04 LTS

Ubuntu 16.04 LTS (xenial) 用户请将 `/etc/apt/sources.list` 文件改为以下内容：

    deb http://mirrors.oops-sdu.cn/ubuntu/ xenial main restricted universe multiverse
    deb http://mirrors.oops-sdu.cn/ubuntu/ xenial-security main restricted universe multiverse

因为镜像站硬盘容量限制，我们只备份了 64 位的源。如果曾安装过 32 位的包请尝试适用以下命令解除安装。

    sudo dpkg --remove-architecture i386

