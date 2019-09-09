<template>
  <div class="main">
    <input class="search" v-model="searchText" @input="search" />
    <one-item
      v-for="item in items"
      :name="item.name"
      :url="item.url"
      :help_url="item.help_url"
      :size="item.size"
      :date="item.last_timestamp"
      :status="item.status"
    />

    <div v-if="isIntranet" style>
      <h2>无法连接到 intranet.mirrors.oops-sdu.cn</h2>
      <ol>
        <li>
          您的路由器可能开启了 Rebind Protection。请参阅
          <a href="/guide/TurnOffRebindProtection.html">路由器用户必看：关闭 Rebind Protection</a>。
        </li>
        <li>您可能没有连接到山东大学校园网。</li>
      </ol>
    </div>

    <div v-if="isOldBrowser" style>
      <h2>请使用 Firefox、Chrome 等现代浏览器访问本页面。</h2>
    </div>
  </div>
</template>

<script>
import OneItem from "./OneItem.vue";
import "axios";
import Axios from "axios";
export default {
  components: { OneItem },
  data: function() {
    return {
      searchText: "",
      items: "",
      items_bak: "",
      isIntranet: false
    };
  },
  methods: {
    search: function() {
      this.items = new Array();
      for (let item of this.items_bak)
        if (item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1)
          this.items.push(item);
    }
  },
  mounted: function() {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
      this.isOldBrowser = true;
      return;
    }

    Axios.defaults.timeout = 5000;
    Axios.get("//intranet.mirrors.oops-sdu.cn/sync.json")
      .then(res => {
        this.items = res.data;
        this.items_bak = res.data;
      })
      .catch(() => {
        console.warn(
          "intranet.mirrors.oops-sdu.cn not accessible. It is most likey you are under an OpenWRT router with rebind protection enabled. Please turn it off. Besides, another explanation is you are not connected to sdu-net."
        );
        this.isIntranet = true;
        Axios.get("/sync.json")
          .then(res => {
            this.items = res.data;
            this.items_bak = res.data;
          })
          .catch(() => {
            //todo
          });
      });
  }
};
</script>
<style lang="stylus" scoped>
.main {
  width: 100%;

  .search {
    border: 3px solid gray;
    padding: 5px;
    width: 100%;
    font-size: 23px;
    margin-bottom: 29px;
  }
}
</style> 
