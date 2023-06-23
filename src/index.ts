import { encrypt, decrypt } from './crypto';
import { globalConfig } from './types';

class LocalCache {
  private config: globalConfig = {
    type: 'localStorage', //存储类型，localStorage | sessionStorage
    prefix: 'tmd-ui_0.0.1', //版本号
    expire: 24 * 60, //过期时间，默认为一天，单位为分钟
    isEncrypt: true, //支持加密、解密数据处理
  };

  constructor(config: globalConfig) {
    this.config = { ...this.config, ...config };
  }

  private autoAddPreFix(key: string): string {
    //添加前缀，保持唯一性
    const prefix = this.config.prefix || '';
    return `${prefix}_${key}`;
  }

  private autoRemovePreFix = (key: string) => {
    //删除前缀，进行增删改查
    const lineIndex = this.config.prefix.length + 1;
    return key.substring(lineIndex);
  };

  // 设置缓存
  public setCache(
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    expire: number = 24 * 60,
  ): boolean {
    //设定值
    if (value === '' || value === null || value === undefined) {
      //空值重置
      value = null;
    }
    if (isNaN(expire) || expire < 0) {
      //过期时间值合理性判断
      throw new Error('Expire must be a number');
    }
    const data = {
      value, //存储值
      time: Date.now(), //存储日期
      expire: Date.now() + 1000 * 60 * expire, //过期时间
    };
    //是否需要加密，判断装载加密数据或原数据
    window[this.config.type].setItem(
      this.autoAddPreFix(key),
      this.config.isEncrypt
        ? encrypt(JSON.stringify(data))
        : JSON.stringify(data),
    );
    return true;
  }

  //获取指定值
  public getCache(key: string) {
    if (this.config.prefix) {
      key = this.autoAddPreFix(key);
    }
    if (!window[this.config.type].getItem(key)) {
      //不存在判断
      return null;
    }

    const storageVal = this.config.isEncrypt
      ? JSON.parse(decrypt(window[this.config.type].getItem(key) as string))
      : JSON.parse(window[this.config.type].getItem(key) as string);
    const now = Date.now();
    if (now >= storageVal.expire) {
      //过期销毁
      this.deleteCache(key);
      return null;
      //不过期回值
    } else {
      return storageVal.value;
    }
  }

  //获取全部值
  public getAllCache(): object {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storageList: any = {};
    const keys = Object.keys(window[this.config.type]);
    keys.forEach((key) => {
      const value = this.getCache(this.autoRemovePreFix(key));
      if (value !== null) {
        //如果值没有过期，加入到列表中
        storageList[this.autoRemovePreFix(key)] = value;
      }
    });
    return storageList;
  }

  //获取缓存列表长度
  public getCacheLength(): number {
    return window[this.config.type].length;
  }

  //删除指定值
  public deleteCache(key: string): boolean {
    if (this.config.prefix) {
      key = this.autoAddPreFix(key);
    }
    window[this.config.type].removeItem(key);
    return true;
  }

  //清空所有缓存
  public clearCache(): boolean {
    window[this.config.type].clear();
    return true;
  }
}

export default LocalCache;
