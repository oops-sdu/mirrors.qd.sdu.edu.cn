# Ubuntu

目前支持的指令集：仅 amd64。

目前支持的版本：bionic 和 xenial。

Ubuntu 18.04 LTS (bionic) 用户请将 /etc/apt/source.list 文件改为以下内容：

    deb http://10.102.42.105/ubuntu/ bionic main restricted universe multiverse
    deb http://10.102.42.105/ubuntu/ bionic-security main restricted universe multiverse

Ubuntu 16.04 LTS (xenial) 用户请将 /etc/apt/source.list 文件改为以下内容：

    deb http://10.102.42.105/ubuntu/ xenial main restricted universe multiverse
    deb http://10.102.42.105/ubuntu/ xenial-security main restricted universe multiverse
