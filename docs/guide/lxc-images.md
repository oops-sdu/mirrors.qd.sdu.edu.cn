---
sidebarDepth: 1
---
# lxc-images

lxc-images 被 LXC 用于容器内操作系统的部署。截至目前（2019 年 12 月），中国大陆仅有 [清华大学开源软件镜像站](https://mirrors.tuna.tsinghua.edu.cn/help/lxc-images/) 这一个公网镜像，但此镜像存在严重的索引与内容不一致问题，因此不总是可用。山东大学镜像站对 lxc-images 做了镜像，严格保证索引与内容一致。

目前支持的指令集：仅 amd64。

注意，出于保证原子性和缩减大小的考虑，索引文件 index-system 及 index-user 经过了修改。lxc-create 的 download 模板默认校验数字签名。如果要使用不同的私钥重新签名，则只能对索引和内容全部重新签名，计算量较大。因此，索引文件对应的数字签名被直接去除。在使用 lxc-create 的 download 模板时，加入 `--no-validate` 以跳过校验。

## 使用方式

创建一个名为 `NAME` 的容器。

```bash
lxc-create -n NAME -t download -- --server intranet.mirrors.oops-sdu.cn/lxc-images --no-validate
```