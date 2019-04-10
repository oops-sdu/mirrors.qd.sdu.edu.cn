<template>
    <div class="main">
        <input class="search" v-model="searchText">
        <div class="url-text">{{urlText}}</div>
        <one-item
            v-for="item in items"
            :name="item.name"
            :url="item.url"
            :help_url="item.help_url"
            :size="item.size"
            :date="item.last_timestamp"
            :status="item.status"
        />
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
            urlText: "/mirrors",
            searchText: "",
            items: ""
        };
    },
    methods: {},
    mounted: function() {
        Axios.get("http://10.102.42.105/sync.json").then(res => {
            this.items = res.data;
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

    .url-text {
        font-size: 17px;
        color: gray;
    }
}
</style> 