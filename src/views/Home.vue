<template>
  <div class="home">
    <button @click="onCreate">新增</button>
    <br />
    <div v-for="(i, k) in news" :key="k">
      <span>{{ i.title }} {{ i.publishedAt }}</span>
      <a @click="onDelete(i)">删除</a> |
      <a @click="onUpdate(i)">修改</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      news: []
    };
  },
  created() {
    this.getNews();
  },
  methods: {
    async getNews() {
      const { data: res } = await this.$http({ url: "/api/news" });
      console.log("get", res);
      this.news = res.results;
    },
    async onCreate() {
      const { data: res } = await this.$http({
        url: `/api/news`,
        method: "post",
        data: {
          title: "前端组件设计原则",
          img:
            "https://user-gold-cdn.xitu.io/2019/1/24/16880541998cbc09?imageView2/0/w/1280/h/960/format/webp/ignore-error/1",
          publishedAt: "2018-11-02",
          author: "Andrew Dinihan",
          url: "https://juejin.im/post/5c49cff56fb9a049bd42a90f"
        }
      });
      console.log("post", res);
      this.getNews();
    },
    async onDelete(news) {
      const { data: res } = await this.$http({
        url: `/api/news/${news.id}`,
        method: "delete"
      });
      console.log("delete", res);
      this.getNews();
    },
    async onUpdate(news) {
      const { data: res } = await this.$http({
        url: `/api/news/${news.id}`,
        method: "put",
        data: {
          title: "正则全攻略使用手册",
          img: "https://segmentfault.com/img/bVbnRSc?w=650&h=255",
          publishedAt: "2019-01-28",
          author: "Croc_wend",
          url: "https://segmentfault.com/a/1190000018042746"
        }
      });
      console.log("update", res);
      this.getNews();
    }
  }
};
</script>
