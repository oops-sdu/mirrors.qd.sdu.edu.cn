---
sidebarDepth: 3
---
# 后端配置记录

## LXC 容器方案

### 为什么选择 LXC？

无论是搭建镜像站，还是其他服务，首要的任务是实现功能，其次是保证稳定，有余力则追求美观。

因此，在单一 Linux 发行版上部署所有服务是十分不明智的做法。例如，激进的发行版提供更多、更新的软件包，而保守的发行版则具有更好的稳定性。此外，在保守发行版上编译安装新程序的做法则显得十分愚蠢——应尽可能选择通过发行版的官方仓库来部署服务，否则稳定性就是无稽之谈。容器级虚拟化就是用来调和两者矛盾的方案。

为此，我们选择了基于 LXC 的容器方案。LXC 在 2008 年诞生，目的是在共享主机内核的基础上，提供虚拟容器，每个容器运行一个完整的操作系统。与 Docker 相比，一个容器不必仅运行单一服务，因此可根据功能划分容器，便于管理；LXC 主机非常“干净”，除了提供 LXC 管理工具及网络外，无需参与任何具体的任务逻辑，因此具有更强的健壮性——尤其是这台服务器没有 IPMI、没有控制台，唯一的控制方式就是 SSH 时，主机的稳定性就更显得重要了。

### LXC 主机应该选用什么发行版？

对于 LXC 主机而言，稳定是第一要素。RHEL/CentOS 7 虽然在稳定性方面广受赞誉，但 Linux 3.10 内核与 LXC 1.0 工具集则显得力不从心。理论上，你可以用低版本内核运行原本为高版本内核准备的发行版容器，但实际应用中会导致诸多的小问题，如容器无法开机、DNS 解析发生阻塞等。在经过初步尝试后，RHEL/CentOS 7 确实无法胜任 LXC 主机的角色，被首先排除。CentOS 8 的发布遥遥无期，不做考虑。

由于 LXC 主机要做的事情很简单，ArchLinux 或许可以保证稳定运行。但过于激进的发行版应放在最后考虑。

作为老牌 Linux 发行版，Debian 拥有不输 RHEL/CentOS 的稳定性，同时内核较新，是容器级虚拟化的理想选择。截至本文编写时（2019 年 5 月），稳定版对应了搭载 4.9 内核的 Debian 9，而搭载了 4.19 内核的 Debian 10 刚刚进入 RC 阶段，软件包版本已基本冻结。不要因为“非正式版”就将 Debian 10 排除在外，这条可能对于其他发行版适用，但 Debian 即使是 unstable 版本也有不输 Ubuntu 的稳定性。

由于 4.9 内核搭配高于 4.9 内核的发行版容器时仍会出现 DNS 解析阻塞问题，因此即使 Debian 10 正式发布还需要数月，我们仍然选择了 Debian 10。

### LXC 容器应该选用什么发行版？

容器的发行版主要根据要实现的功能决定。例如，对于 HTTP 服务器，由于镜像站主要在内网运行，我们暂不关心 TLS 1.3，因此选择了 CentOS 7 发行版。同步程序以 Python 脚本、rsync 等为主，选择范围较广，考虑到 apt-mirror 工具，我们选择了与主机相同的 Debian 10 发行版。对于前端代码，我们选择了 ArchLinux，以便使用最新版的 nodejs 和 yarn 等工具。重复一遍，官方源的软件是最稳定的，其次是可靠的第三方源，而编译安装则是最愚蠢的行为——但 Docker 用户请忽略这句话。

### LXC 主机的主要配置过程

#### 安装 Debian 10

##### 获取镜像

截至本文编写时（2019 年 5 月），Debian 10 尚未正式发行，因此 Debian 9 的镜像更易获取。虽然每周构建版本的 Debian 10 依然可用，但受限于下载速度，我们选择了先安装 Debian 9 再升级到 Debian 10 的做法。

注：不知出于何种原因，我们的虚拟机提供方仅愿意预装 CentOS 7——巧妇难为无米之炊。在仅有 SSH 的前提下，我们选择了对最开头 1GiB 的 boot 分区解除挂载，然后将预先制作好的磁盘镜像 dd 到硬盘开头的做法来更换操作系统。但出于方便读者的考虑，在下文的叙述中，仍假设可以直接从光盘安装 Debian。

将 Debian 的光盘插入服务器，进入安装界面。

##### 硬盘分区

对系统磁盘分区时，根据服务器是否支持 UEFI 启动，选择 GUID 分区表（GPT）或 MBR 分区表。

对于 GUID 分区表（GPT），首先创建一个 500 MB 左右的 EFI 系统分区（ESP），格式化为 FAT32（唯一被 UEFI 标准支持的文件系统），挂载到 `/boot/efi`。然后将剩余的空间全部分配给一个主分区，挂载到 `/`。

对于 MBR 分区表，则可选择将全部的空间分配给一个主分区（设为活动分区），挂载到 `/`。也可选择创建一个 500 MB 左右的主分区（设为活动分区），不格式化，然后将剩余的空间全部分配给一个主分区，挂载到 `/`（不是活动分区）。MBR 分区表的 `扩展分区` `逻辑分区`的设计是极其糟糕的，因此只需要使用主分区即可。

注意，均不分配 SWAP 分区。SWAP 分区的优势是保证交换空间在存储设备上的连续性，以便加速访问。然而，对于固态硬盘而言，位置连续没有意义。即便是对于机械硬盘，由于 SWAP 文件一般是在分区基本为空的情况下创建的，只要不改变 SWAP 文件的大小——SWAP 分区本来就做不到这一点——也不会产生碎片。Ubuntu 从 18.04 桌面版开始，默认使用 SWAP 文件代替了 SWAP 分区。因此，在大多数场景下，应使用 SWAP 文件而不是 SWAP 分区。

对于数据磁盘，一律使用 GUID 分区表。牢记，好习惯是，在一台机器上最多只有一个磁盘是 MBR 分区表，即在服务器不支持 UEFI 启动时系统盘可选择 MBR。除了系统盘外的其他磁盘一律不要使用 MBR 分区表，否则无论是对引导还是分区管理都没有好处。

##### 组件选择

不要选择桌面环境。LXC 主机的软件包应尽可能地少，软件包越少，系统越稳定，此外也有利于减少攻击面。记得选择 SSH Server，或者也可以等到后期再安装。

##### 安装 grub 引导器

Debian 安装程序会提示你该将 grub 安装至何处。对于 MBR 分区表，应将 Grub 安装在系统磁盘的活动分区上。（一个 MBR 磁盘上只能有一个或零个活动分区，且活动分区一定是主分区。）对于 GUID 分区表，将其安装在 `EFI 系统分区`（ESP）即可。

##### 升级到 Debian 10

Debian 的大版本升级很简单，只要将 `/etc/apt/sources.list` 中的发行版代号由 Debian 9 的 `stretch` 替换为 Debian 10 的 `buster`，然后执行 `apt update && apt dist-upgrade` 即可。中途要注意文件替换的问题，不要无脑 yes，以免配置文件被新版缺省配置文件覆盖。

##### 安装基本软件

安装以下基本软件。不再单独强调。

```shell
apt install screen tmux wget nano curl sudo
```

#### 网络配置

##### 更换网络管理器为 systemd-networkd

systemd-networkd 是主要适用于有线网络的网络管理器，与 NetworkManager 相比更简单，与传统的网络配置脚本相比更现代化。我们推荐在服务器上使用 systemd-networkd，以便为 LXC 容器提供更简单的网络设置。

###### 创建配置文件

`/etc/systemd/network` 是 systemd-networkd 的配置文件所在目录。创建一个 `10-wired.network` 文件，内容为：

```ini
[Match]
Name=e*

[Network]
DHCP=no
Address=10.102.7.58/23
Gateway=10.102.7.254
DNS=114.114.114.114

[Link]
MTUBytes=1428
```

一目了然，无需多言。

###### 禁用 Debian 默认的网络管理器

```bash
mv /etc/network/interfaces /etc/network/interfaces.bak
systemctl stop networking
systemctl disable networking
```

###### 启动 systemd-networkd

```shell
systemctl start systemd-networkd
systemctl enable systemd-networkd
```

###### 重启系统以验证设置

```bash
systemctl reboot
```

注意，如果配置不正确，SSH 将无法连接。请确保有备用手段可以连接主机。

在极端情况下，可考虑手动为其分配 IP 地址使其重新联网。假设网络接口名称为 `ens192`，以下命令会相当有用。

```bash
ip a # 查看 IP 地址
ip r # 查看路由表
ip n # 查看 ARP/NDP
ip a add 192.168.0.2/24 dev ens192 # 为 ens192 分配指定的静态 IP
ip r add default via 192.168.0.1 # 指定默认路由
rm /etc/resolv.conf && echo "nameserver 8.8.8.8" > /etc/resolv.conf #设置 DNS
```

###### 启用 systemd-resolved

使用与 systemd-networkd 配套的 systemd-resolved 以管理 DNS 地址。

```bash
apt install systemd-resolved
systemctl enable systemd-resolved
systemctl start systemd-resolved
rm /etc/resolv.conf
ln -s /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf
```

###### 为 LXC 提供网桥和 NAT

创建 `20-lxc-bridge.netdev` 文件，内容如下：

```ini
[NetDev]
Name=lxc-bridge
Kind=bridge
```

创建 `20-lxc-bridge.network`文件，内容如下：

```ini
[Match]
Name=lxc-bridge

[Network]
Address=192.168.0.1/24
IPForward=ipv4
IPMasquerade=yes
DHCPServer=yes

[DHCPServer]
EmitDNS=yes
DNS=192.168.0.1
```

创建`20-lxc-dummy.netdev`文件，内容如下：

```ini
[NetDev]
Name=lxc-dummy
Kind=dummy
```

创建`20-lxc-dummy.network`文件，内容如下：

```ini
[Match]
Name=lxc-dummy

[Network]
Bridge=lxc-bridge
```

如此，名为 `lxc-bridge` 的网桥如同路由器的 LAN 口，接入的设备可自动获取 IP 并上网。

注意，这里我们将 `192.168.0.1` 作为了 DNS 服务器，但此时还没有架设它。一会儿将解决这个问题。

由于 LXC 容器要提供服务，端口转发是必备的，因此防火墙是必不可少的。

##### 安装 firewalld 防火墙

Debian 10 已将 iptables 更换为 nftables。但我们并不手动配置这些 *tables，而是使用 firewalld 作为防火墙。firewalld 可以认为是 *tables 的前端。

注意，一旦安装了 firewalld，之前在 systemd-networkd 中设置的 NAT 转发会作废，而 DHCP 服务也会被阻断。一会儿将解决这些问题。

```bash
apt install firewalld
systemctl enable firewalld
systemctl start firewalld
```

缺省情况下，SSH 服务已被放行。

###### 配置外网

将外网接口 `ens192` 接入 public 区域。此区域将作为 NAT 的出口，以及端口转发。

```bash
firewall-cmd --zone=public --add-interface=ens192 --permanent
firewall-cmd --zone=public --add-service=ssh --permanent # 这条应该默认存在，不过再写一次

firewall-cmd --zone=public --add-masquerade --permanent
firewall-cmd --zone=public --add-forward-port=port=9002:proto=tcp:toport=22:toaddr=192.168.0.2 --permanent
firewall-cmd --zone=public --add-forward-port=port=80:proto=tcp:toport=80:toaddr=192.168.0.2 --permanent
firewall-cmd --zone=public --add-forward-port=port=443:proto=tcp:toport=443:toaddr=192.168.0.2 --permanent

firewall-cmd --reload
```

注意，因为 firewalld 服务已经开启，如果这里没有设置 `--add-masquerade`，systemd-networkd 中设置的 `IPMasquerade=yes` 无效。另外，不要搞混在哪里设置 masquerade。对于 firewalld，在 NAT 的出口设置 masquerade；对于 systemd-networkd，在 NAT 的入口设置 masquerade。

###### 配置内网

将内网 `lxc-bridge` 接入 internal 区域。此区域将被配置为类似于路由器的 LAN。

```bash
firewall-cmd --zone=internal --add-interface=lxc-bridge --permanent
firewall-cmd --zone=internal --add-service=dhcp --permanent
firewall-cmd --zone=internal --add-service=dns --permanent
```

##### 安装 DNS 服务器

这里的 DNS 服务器是为了缓存 DNS 解析结果，因此使用 dnsmasq。

```bash
apt install dnsmasq
```

编辑 `/etc/dnsmasq.conf` 文件，内容改为：

```ini
no-resolv
server=114.114.114.114
interface=lxc-bridge
```

#### 使用 LXC 3.0

Debian 9 搭配的是 LXC 2.0，而 Debian 10 搭配的是 LXC 3.0。

```bash
apt install lxc
```

##### 创建一个名为 NAME 的容器

```bash
lxc-create -n NAME -t download -- --server mirrors.tuna.tsinghua.edu.cn/lxc-images --keyserver=hkp://keyserver.ubuntu.com:80 --arch amd64
```

注意，这里使用了清华源作为 lxc-images 的上游仓库。但是截至本文编写时（2019 年 5 月），清华源的 lxc-images 存在严重的索引提前于内容同步完成的情况，因此如果报错 404，请将 `--server mirrors.tuna.tsinghua.edu.cn/lxc-images` 部分删除，使用官方源。

##### 启停容器、进入容器

```bash
lxc-start -n NAME
lxc-attach -n NAME
```

注意，如果你使用的是 LXC 1.0，请将 `lxc-start -n NAME` 改为 `lxc-start -n NAME -F`。

进入容器后，可以发现未分配网络。因此，按 Ctrl+D 退出容器，然后用以下命令建议容器退出。

```bash
lxc-stop -n NAME
```

##### 为容器分配网络、共享文件夹、自动启动

编辑 `/var/lib/lxc/NAME/config` 文件，最后两行应该像这样

```ini
# Network configuration
lxc.net.0.type = empty
```

将其改为

```ini
# Network configuration
lxc.net.0.type = veth
lxc.net.0.link = virbr0
lxc.net.0.flags = up
lxc.net.0.hwaddr = 00:16:3e:xx:xx:xx

# Autostart
lxc.start.auto = 1
lxc.start.delay = 0
lxc.start.order = 0

# Mount
lxc.mount.entry = /path/to/folder1 path/to/folder2 none bind 0 0
```

即可实现相应的配置。

请注意挂载文件夹的写法。这将把主机的 `/path/to/folder1` 文件夹与容器内的 `/path/to/folder2` 文件夹联通。容器内该文件夹必须事先存在，否则会报错。换句话说，记得在主机事先创建好 `/var/lib/lxc/NAME/rootfs/path/to/folder2` 文件夹。

##### 示例：容器内开启 SSH

首先，尽管主机已经开启了 DHCP 服务，应当使用静态 IP 来配置容器，这样才能和之前在 firewalld 中配置好的端口转发规则一致。假设之前在主机内设置了 `firewall-cmd --zone=public --add-forward-port=port=9002:proto=tcp:toport=22:toaddr=192.168.0.2`，则将容器内的 IP 设置为 `192.168.0.2`

后，直接安装 SSH 服务器即可从主机的 9002 端口访问 SSH。同样，在容器内可以使用 systemd-networkd 来配置网络。

#### LXC 主机的其他配置

以下配置与 LXC 方案无关，仅为推荐。

##### 安装 molly-guard

此软件包可避免意外关闭或重启服务器。使用 `lxc-attach` 在主机上操作容器时，以为在操作容器实际上却操作了主机是很常见的失误。

```shell
apt install molly-guard
```

可顺便将主机名更改为有意义的名称，如 `lxc-host`。

```bash
hostnamectl set-hostname lxc-host
```

##### 安装 haveged

虚拟机更容易出现熵不足的问题。比如，是否开机后 SSH 连接一直超时，然后从控制台登录后 SSH 连接又突然好了？这种情况很可能是熵不足。haveged 通过使用质量较低的伪随机数填充系统的熵池，达到加速 `/dev/random` 的目的，从而避免熵不足的问题。仅当安全不是首要考虑因素时，才应使用该软件，否则应将硬件随机数发生器直通到虚拟机内部。

```shell
apt install haveged
systemctl enable haveged
systemctl start haveged
```

注意，提供随机数是内核的事情，因此只能在主机上做这个事情。

##### 创建 SWAP 文件 #####

- 假设 SWAP 文件的大小为 10 GiB。创建一个大小为 10GiB 的全零文件。

  ```sh
  dd if=/dev/zero of=/data/swapfile bs=1M count=10240
  ```
  
  *对于 XFS 或 F2FS 文件系统，请确保创建全零文件，而不是使用 fallocate 或者 dd 等创建稀疏文件。不然可能无法 mkswap 和 swapon。见 [Bug 1129205 - fallocate to create swap file creates a file with holes](https://bugzilla.redhat.com/show_bug.cgi?id=1129205#c3)。

  *如非必要，不要随便使用 dd 等命令生成空的大文件。尽可能产生稀疏文件以节约时间和保护 SSD 寿命。本处为不得已而为之。*

- 确保该文件的所有者和组均为 root。

- 将其权限置为 600。

  ```sh
  chmod 600 /data/swapfile
  ```
  
- 格式化并临时启用该交换文件。
  
  ```sh
  mkswap /data/swapfile && swapon /data/swapfile
  ```
  
- 确保 SWAP 生效。检查以下命令返回的结果中的 Swap 一行的值是否增加了。
  
  ```sh
  free -h
  ```

- 修改 /etc/fstab。在最后增加一行

  ```sh
  /data/swapfile none swap defaults 0 0
  ```
  
  *确保 /data 的挂载在该行之前出现。*

- 重启系统，再用 free 命令查看 SWAP 是否生效。
  
   ```sh
   systemctl reboot
   free -h
   ```

## 镜像同步方案

未完待续。