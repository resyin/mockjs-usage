# [基于 Mock.js 的前端开发指南](https://resyin.github.io/post/mockjs-usage/)

## 关于 Mock.js

[Mock.js](http://mockjs.com/) 能做什么？

- 能生成随机数据
- 能拦截 Ajax 请求

Mock.js 有哪些特点？

- 前后端分离
    让前端工程师独立于后端进行开发。
- 低耦合
    无需修改既有代码，即可拦截 Ajax 请求，返回模拟的响应数据。
- 数据类型多样
    支持生成随机的文本、数字、布尔值、日期、邮箱、链接、图片、颜色等。
- 增加单元测试的真实性
    通过随机数据，模拟各种场景。
- 方便扩展
    支持扩展更多数据类型，支持自定义函数和正则。
- 简单易用

**基于以上特点，Mock.js 被广泛应用于前端开发中，以保证开发效率与进度。**

## 安装

Mock.js 允许多种安装方式：

**浏览器引入**

`<script type="text/javascript" src="http://mockjs.com//dist/mock.js"></script>` 

**使用 npm 或 yarn 安装**

- `$ npm install mockjs --save`
- `$ yarn add mockjs`

## 拦截 Ajax 请求

以 [Vue CLI](https://cli.vuejs.org/) 生成的项目为例，安装 [Axios]((https://github.com/axios/axios)) 发送 Ajax 请求。

**引用 Mock.js**

安装完成 Mock.js 后，在项目 src 目录下新建 mock 目录及 index.js 文件，引用 Mock.js：

```js
// in src/mock/index.js
import Mock from "mockjs";
```

将 mock 配置关联到项目中：

```js
// in src/main.js
import "./mock";
// 将 Axios 挂载到 Vue 原型中，以便在单文件组件中以 this.$http 使用
import axios from "axios";
Vue.prototype.$http = axios;
```

**使用 [Mock.mock()](https://github.com/nuysoft/Mock/wiki/Mock.mock())**
    
`Mock.mock( rurl?, rtype?, template|function( options ) )`

- `rurl`
    可选参数，表示需要拦截的 Ajax URL，可以是 URL 字符串或 URL 正则。
    例如 /\/domain\/list\.json/、'/domian/list.json'。
- `rtype`
    可选参数，表示需要拦截的 Ajax 请求类型。
    例如 GET、POST、PUT、DELETE 等。
- `template`
    可选参数，表示数据模板，可以是对象或字符串。
- `function(options)`
    可选参数，表示用于生成响应数据的函数。
    - `options`
        指向本次请求的 Ajax 选项集，含有 url、type 和 body 三个属性，参见 XMLHttpRequest 规范。

假设业务场景是获取一段资讯列表，网络请求 URL 为 /api/news，类型为 get，拦截函数为：

```js
// in src/mock/index.js
import Mock from "mockjs";

Mock.mock("/api/news", "get", {
    code: "OK",
    results: [
        {
            id: "1",
            title: "前端组件设计原则",
            img:
                "https://user-gold-cdn.xitu.io/2019/1/24/16880541998cbc09?imageView2/0/w/1280/h/960/format/webp/ignore-error/1",
            publishedAt: "2018-11-02",
            author: "Andrew Dinihan",
            url: "https://juejin.im/post/5c49cff56fb9a049bd42a90f"
        },
        {
            id: "2",
            title: "正则全攻略使用手册",
            img: "https://segmentfault.com/img/bVbnRSc?w=650&h=255",
            publishedAt: "2019-01-28",
            author: "Croc_wend",
            url: "https://segmentfault.com/a/1190000018042746"
        }
    ]
});
```

网络请求方法：

```js
// in any.vue
async getNews() {
    const { data: res } = await this.$http({ url: "/api/news" });
    console.log("get", res);
}
```

控制台中可见，响应数据为编写的测试数据，至此 Mock.js 拦截了 Ajax 请求。

## 生成随机数据

Mock.js 提供了多种数据类型：

- Base
    - boolean 布尔类型
    - natural  自然数（大于等于0的整数）
    - integer 整数
    - float 浮点数
    - character 字符
    - string 字符串
    - range 整数区间
- Date
    - date 日期
    - time 时间
    - datetime 日期时间
    - now 当前日期时间
- Image
    - image 图片地址
    - dataImage 图片 Base64
- Color
    - color 16进制颜色值
    - hex 16进制颜色值
    - rgb rgb颜色值
    - rgba rgba颜色值
    - hsl hsl颜色值
- Text
    - paragraph 一段英文
    - cparagraph 一段中文
    - sentence 一句英文（首字母大写）
    - csentence 一句中文
    - word 一个英文单词
    - cword 一个中文字
    - title 一个英文标题（所有字母大写）
    - ctitle 一个中文标题
- Name
    - first 英文名
    - last 英文姓
    - name 英文姓名
    - cfirst 中文姓
    - clast 中文名
    - cname 中文姓名
- Web
    - url URL
    - protocol 协议
    - domain 域名
    - tld 顶级域名
    - email 邮件地址
    - ip IP 地址
- Address
    - region 中国区域
    - province 中国省、直辖市、自治区、特别行政区
    - city 中国城市
    - county 中国县
    - zip 邮政编码
- Helper
    - capitalize 把字符串的第一个字母转换为大写
    - upper 把字符串转换为大写
    - lower 把字符串转换为小写
    - pick 从数组中随机选取一个元素
    - shuffle 打乱数组中元素的顺序
- Miscellaneous 
    - guid UUID
    - id 18位身份证号
    - increment 自增整数

使用 `@` 符号与以上任一数据类型的生成函数名相结合，即可组成占位符，在 Mock.mock() 的 template 中替换固定字符串，生成随机字符串。

速查以上数据类型，改写拦截函数：

```js
// in src/mock/index.js
import Mock from "mockjs";

Mock.mock("/api/news", "get", {
    code: "OK",
    results: [
        {
            id: "@guid", // 生成 UUID
            title: "@ctitle(3,5)", // 生成 3-5 字的中文标题
            img: "@dataImage('200x100')", // 生成 200px*100px 的图片 Base64
            publishedAt: "@date('yyyy-MM-dd')", // 生成 yyyy-MM-dd 格式的日期
            author: "@name(true)", // 生成英文姓名
            url: "@url('http')" // 生成 http 协议的 URL
        }
    ]
});
```

## 语法规范

Mock.js 的语法规范包括两部分：

- 数据占位符定义规范（Data Placeholder Definition，DPD）
- 数据模板定义规范（Data Template Definition，DTD）

上一节中使用的 `@guid` 等占位符属于 Mock.js 语法规范的数据占位符定义规范； 数据模板定义规范则定义 Mock.mock() template 内属性的最终值。

属性由属性名、生成规则、属性值组成：

```js
Mock.mock({
    // 属性名|生成规则:属性值
    'name|rule': value
});
```
其中：

- 属性名和生成规则之间用竖线 ` | ` 分隔
- 生成规则是可选参数
- 生成规则有 7 种格式：
    - `'name|min-max': value`
    - `'name|count': value`
    - `'name|min-max.dmin-dmax': value`
    - `'name|min-max.dcount': value`
    - `'name|count.dmin-dmax': value`
    - `'name|count.dcount': value`
    - `'name|+step': value`
- 属性值的类型影响生成规则
    - String
        - `'name|min-max': string` 通过重复 `string` 生成一个字符串，重复次数大于等于 `min`，小于等于 `max`
        - `'name|count': string` 通过重复 `string` 生成一个字符串，重复次数等于 `count`
    - Number
        - `'name|+1': number` 属性值自动加 1，初始值为 `number`
        - `'name|min-max': number` 生成一个大于等于 `min`、小于等于 `max` 的整数，属性值 `number` 只是用来确定类型
        - `'name|min-max.dmin-dmax': number` 生成一个浮点数，整数部分大于等于 `min`、小于等于 `max`，小数部分保留 `dmin` 到 `dmax` 位
    - Boolean
        - `'name|1': boolean` 随机生成一个布尔值，值为 `true` 的概率是 1/2，值为 `false` 的概率同样是 1/2
        -  `'name|min-max': value ` 随机生成一个布尔值，值为 value 的概率是  `min / (min + max) `，值为  `!value ` 的概率是  `max / (min + max) `
    -  Object
        - `'name|count': object ` 从属性值  `object ` 中随机选取  `count ` 个属性
        -  `'name|min-max': object `从属性值  `object ` 中随机选取  `min ` 到  `max ` 个属性
    -  Array
        -  `'name|1': array` 从属性值 array 中随机选取 1 个元素，作为最终值
        -  `'name|+1': array` 从属性值 array 中顺序选取 1 个元素，作为最终值
        -  `'name|min-max': array` 通过重复属性值 `array` 生成一个新数组，重复次数大于等于 `min`，小于等于 `max`
        -  `'name|count': array` 通过重复属性值 `array` 生成一个新数组，重复次数为 `count`
    -  Function
        -  执行函数 `function`，取其返回值作为最终的属性值，函数的上下文为属性 `'name'` 所在的对象
    -  RegExp
        -  根据正则表达式 regexp 反向生成可以匹配它的字符串。用于生成自定义格式的字符串。
- 属性值中可以含有占位符
- 属性值还指定了最终值的初始值和类型

回到项目中。业务场景是获取一段资讯列表，但上一节生成的随机数据只有 1 项，此时使用数据模板定义规范的属性生成规则，将 1 项目变为多项：

```js
// in src/mock/index.js
import Mock from "mockjs";

Mock.mock("/api/news", "get", {
    code: "OK",
    // 数组内，随机生产 5-10 个对象
    "results|5-10": [
        {
            id: "@guid", // 生成 UUID
            title: "@ctitle(3,5)", // 生成 3-5 字的中文标题
            img: "@dataImage('200x100')", // 生成 200px*100px 的图片 Base64
            publishedAt: "@date('yyyy-MM-dd')", // 生成 yyyy-MM-dd 格式的日期
            author: "@name(true)", // 生成英文姓名
            url: "@url('http')" // 生成 http 协议的 URL
        }
    ]
});
```

## 增删改查

除了拦截 `GET` 请求，Mock.js 同样支持 `POST` 、`DELETE`、`PUT` 请求：

**拦截 POST 请求**
    
```js
// in src/mock/index.js
Mock.mock("/api/news", "post", opts => {
    let result = JSON.parse(opts.body);
    result.id = Mock.Random.guid();
    return {
        code: "OK",
        result
    };
});
```

```js
// in any.vue
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
},
```

**拦截 DELETE 请求**

通常 Delete 请求会将 ID 作为 Path 参数放在 URL 中传递，此时需要使用正则表达式匹配 URL，并获取 Path 参数。

```js
// in src/mock/index.js
Mock.mock(/\/api\/news/, "delete", opts => {
    const pathArray = /\/api\/news\/([\w\\-]+)/.exec(opts.url);
    const id = pathArray[1];
    return {
        code: "OK",
        result: { id }
    };
});
```

```js
// in any.vue
async onDelete(news) {
    const { data: res } = await this.$http({
        url: `/api/news/${news.id}`,
        method: "delete"
    });
    console.log("delete", res);
},
```

**拦截 PUT 请求**

与 Delete 拦截方式一致。

```js
// in src/mock/index.js
Mock.mock(/\/api\/news/, "put", opts => {
    const pathArray = /\/api\/news\/([\w\\-]+)/.exec(opts.url);
    const id = pathArray[1];
    let result = JSON.parse(opts.body);
    result.id = id;
    return {
        code: "OK",
        result
    };
});
```

```js
// in any.vue
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
}
```

## 关联 Mock 数据

上一节中的增删改查操作虽然在 Ajax 请求时被拦截，但是彼此间并无关联，数据并无变更。此时可以将 4 者关联（该节与 Mock.js 无关，纯粹的 JavaScript 操作）。

```js
import Mock from "mockjs";

let ret = Mock.mock({
  code: "OK",
  "results|5-10": [
    {
      id: "@guid", // 生成 UUID
      title: "@ctitle(3,5)", // 生成 3-5 字的中文标题
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
```

## 动态开启

项目中可以使用 npm script 编辑启动命令，通过环境变量来控制是否加载 Mock 服务。

以 [Vue CLI](https://cli.vuejs.org/zh/guide/mode-and-env.html) 为例，在 `development` 模式下，增加 Mock 服务的启动命令：

**新增 serve:mock**

```json
// in package.json
{
    "scripts": {
        "serve": "vue-cli-service serve",
        "serve:mock": "vue-cli-service serve --mode mock",
        "build": "vue-cli-service build",
        "lint": "vue-cli-service lint"
    } 
},
```

**新建 .env.mock 文件**

```txt
NODE_ENV=development
VUE_APP_MOCK=true
```

**判断环境变量是否启用 Mock 服务**

```js
// in src/mock/index.js
import Mock from "mockjs";

if (
  process.env.NODE_ENV === "development" &&
  process.env.VUE_APP_MOCK === "true"
) {
    // your mock code
}
```

此时当你运行 `$ npm run serve`，Mock 服务未启用，请求 API 服务；当你运行 `$ npm run serve:mock`，Mock 服务启用，Ajax 请求被拦截。

##  结语

[示例代码](https://github.com/resyin/mockjs-usage)，欢迎一起玩耍。



