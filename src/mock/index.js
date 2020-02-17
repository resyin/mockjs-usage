import Mock from "mockjs";

if (
  process.env.NODE_ENV === "development" &&
  process.env.VUE_APP_MOCK === "true"
) {
  let ret = Mock.mock({
    code: "OK",
    "results|5-10": [
      {
        id: "@guid", // 生成 UUID
        title: "@ctitle(3,5)", // 生成 2-5 字的中文标题
        img: "@dataImage('200x100')", // 生成 200px*100px 的图片 Base64
        publishedAt: "@date('yyyy-MM-dd')", // 生成 yyyy-MM-dd 格式的日期
        author: "@name(true)", // 生成英文姓名
        url: "@url('http')" // 生成 http 协议的 URL
      }
    ]
  });

  Mock.mock("/api/news", "get", () => {
    return ret;
  });

  Mock.mock("/api/news", "post", opts => {
    let result = JSON.parse(opts.body);
    result.id = Mock.Random.guid();
    ret.results.push(result);
    return ret;
  });

  Mock.mock(/\/api\/news/, "delete", opts => {
    const pathArray = /\/api\/news\/([\w\\-]+)/.exec(opts.url);
    const id = pathArray[1];
    ret.results = ret.results.filter(val => {
      return val.id != id;
    });
    return ret;
  });

  Mock.mock(/\/api\/news/, "put", opts => {
    const pathArray = /\/api\/news\/([\w\\-]+)/.exec(opts.url);
    const id = pathArray[1];
    let result = JSON.parse(opts.body);
    ret.results = ret.results.map(val => {
      return val.id === id ? result : val;
    });
    return ret;
  });
}
