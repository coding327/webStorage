# 快速开始

#### 安装

```bash
npm i web-storage-extend
```

#### 基本使用

```ts
// 引入
import LocalCache from 'web-storage-extend'

const localCache = new LocalCache()

// 有效期单位为秒
localCache.setCache('name', 'cake', 1)
localCache.getCache('name')
```

#### 进阶使用

```js
const localCache = new LocalCache({
  type: 'localStorage',
  prefix: 'cake',
  isEncrypt: true
})
```



| 字段      | 解释       | 必传 | 类型    | value                          | 默认值       |
| --------- | ---------- | ---- | ------- | ------------------------------ | ------------ |
| type      | 存储类型   | 是   | string  | localStorage \| sessionStorage | localStorage |
| prefix    | 前缀       | 是   | string  | -                              | -            |
| expire    | 有效时间   | 否   | number  | -                              | 24 * 60 * 60 |
| isEncrypt | 加密、解密 | 是   | boolean | -                              | true         |

