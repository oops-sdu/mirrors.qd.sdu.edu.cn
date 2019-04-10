<template>
    <div class="main">
        <input class="search" v-model="searchText" v-on:input="search">
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
            searchText: "",
            items: "",
            items_bak: ""
        };
    },
    methods: {
        search: function() {
            this.items = new Array();
            for (let item of this.items_bak) {
                if (
                    item.name
                        .toLowerCase()
                        .indexOf(this.searchText.toLowerCase()) > -1
                ) {
                    this.items.push(item);
                }
            }
        }
    },
    mounted: function() {
        Axios.get("http://10.102.42.105/sync.json").then(res => {
            this.items = res.data;
            this.items_bak = res.data;
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