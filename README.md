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

localCache.setCache('name', 'cake', 1)
localCache.getCache('name')
```