<template>
    <div class="item">
        <a class="name" :href="url">{{name}}</a>
        <a v-if="help_url!==''" class="label" :href="help_url">HELP</a>
        <span class="date">{{nowDate}}</span>
        <span class="size">{{nowSize}} MB</span>
    </div>
</template>

<script>
// 数字格式化
function toThousands(num) {
    var num = (num || 0).toString(),
        result = "";
    while (num.length > 3) {
        result = "," + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return result;
}
// 时间戳处理
function transformTime(timestamp = +new Date()) {
    var time = new Date(timestamp);
    var y = time.getFullYear();
    var M = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();
    return (
        y +
        "-" +
        addZero(M) +
        "-" +
        addZero(d) +
        " " +
        addZero(h) +
        ":" +
        addZero(m)
    );
}
function addZero(m) {
    return m < 10 ? "0" + m : m;
}

export default {
    components: {},
    props: {
        name: String,
        url: String,
        help_url: String,
        date: Number,
        size: Number,
        status: Number
    },
    methods: {},
    computed: {
        nowDate: function() {
            return transformTime(this.date);
        },
        nowSize: function() {
            return toThousands(this.size);
        }
    },
    beforeMount: () => {}
};
</script>

<style lang="stylus" scoped>
.item {
    width: 100%;
    font-size: 23px;

    .name {
        cursor: pointer;
    }

    .label {
        font-size: 10px;
        background-color: #4b5cc4;
        border-radius: 3px;
        color: white;
        padding: 2px;
        margin-left: 0.5em;
    }

    .size {
        float: right;
        margin-right: 1em;
    }

    .date {
        float: right;
    }
}
</style> 