# 深拷贝

## 简单粗暴的方式

```js
const getType = obj => Object.prototype.toString.call(obj);

const isObject = (target) => (typeof target === 'object' || typeof target === 'function') && target !== null;

const canTraverse = {
  '[object Map]': true,
  '[object Set]': true,
  '[object Array]': true,
  '[object Object]': true,
  '[object Arguments]': true,
};
const mapTag = '[object Map]';
const setTag = '[object Set]';
const boolTag = '[object Boolean]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const handleRegExp = (target) => {
  const { source, flags } = target;
  return new target.constructor(source, flags);
}

const handleFunc = (func) => {
  // 箭头函数直接返回自身
  if(!func.prototype) return func;
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  // 分别匹配 函数参数 和 函数体
  const param = paramReg.exec(funcString);
  const body = bodyReg.exec(funcString);
  if(!body) return null;
  if (param) {
    const paramArr = param[0].split(',');
    return new Function(...paramArr, body[0]);
  } else {
    return new Function(body[0]);
  }
}

const handleNotTraverse = (target, tag) => {
  const Ctor = target.constructor;
  switch(tag) {
    case boolTag:
      return new Object(Boolean.prototype.valueOf.call(target));
    case numberTag:
      return new Object(Number.prototype.valueOf.call(target));
    case stringTag:
      return new Object(String.prototype.valueOf.call(target));
    case symbolTag:
      return new Object(Symbol.prototype.valueOf.call(target));
    case errorTag: 
    case dateTag:
      return new Ctor(target);
    case regexpTag:
      return handleRegExp(target);
    case funcTag:
      return handleFunc(target);
    default:
      return new Ctor(target);
  }
}

const deepClone = (target, map = new WeakMap()) => {
  if(!isObject(target)) 
    return target;
  let type = getType(target);
  let cloneTarget;
  if(!canTraverse[type]) {
    // 处理不能遍历的对象
    return handleNotTraverse(target, type);
  }else {
    // 这波操作相当关键，可以保证对象的原型不丢失！
    let ctor = target.constructor;
    cloneTarget = new ctor();
  }

  if(map.get(target)) 
    return target;
  map.set(target, true);

  if(type === mapTag) {
    //处理Map
    target.forEach((item, key) => {
      cloneTarget.set(deepClone(key, map), deepClone(item, map));
    })
  }
  
  if(type === setTag) {
    //处理Set
    target.forEach(item => {
      cloneTarget.add(deepClone(item, map));
    })
  }

  // 处理数组和对象
  for (let prop in target) {
    if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = deepClone(target[prop], map);
    }
  }
  return cloneTarget;
}
```

## hasOwnProperty

```js
function deepClone(obj, hash = new WeakMap()) {
    if (hash.has(obj)) {
        return obj;
    }
    let res = null;
    const reference = [Date, RegExp, Set, WeakSet, Map, WeakMap, Error];

    if (reference.includes(obj?.constructor)) {
        res = new obj.constructor(obj);
    } else if (Array.isArray(obj)) {
        res = [];
        obj.forEach((e, i) => {
            res[i] = deepClone(e);
        });
    } else if (typeof obj === "object" && obj !== null) {
        res = {};
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                res[key] = deepClone(obj[key]);
            }
        }
        hash.set(obj, res);
    } else {
        res = obj;
    }
    return res;
}
```

## 循环引用的深copy

### 方案一

:::tip
for-in遍历对象所有的可枚举属性，包括**原型**;

ps：for-in和for-of的区别

* for in 遍历的是数组的索引（即键名），for of遍历的是数组元素值;
* for in 得到对象的key or 数组 or 字符串的下标;
* for of 得到对象的value or 数组 or 字符串的值;

hasOwnProperty 遍历可枚举属性;（返回一个布尔值，只能判断自有属性是否存在，对于继承属性会返回false，因为它不查找原型链的函数）

getOwnPropertyNames() 返回可枚举属性和不可枚举属性;（不包括prototype属性，不包括symbol类型的key）

getOwnPropertySymbols() 返回symbol类型的key属性；（不关心是否可枚举，返回对象自身的所有Symbol属性组成的数组）
:::

```js
const deepCopy = (data, keyMap?: Map<unknown, unknown>) => {
  if (!keyMap) {
    keyMap = new Map();
    keyMap.set(data, data);
  }
  const newData = new data.constructor();
  for (const key in data) {
    const currentItem = data[key];
    if (currentItem === undefined || typeof currentItem !== 'object') {
      newData[key] = currentItem;
    } else if (currentItem instanceof Date) {
      newData[key] = new Date(currentItem);
    } else if (currentItem instanceof RegExp) {
      newData[key] = new RegExp(currentItem);
    } else {
      if (keyMap.get(currentItem)) {
        return { [key]: keyMap.get(currentItem) };
      }

      keyMap.set(currentItem, currentItem);

      newData[key] = deepCopy(currentItem, keyMap);
    }
  }

  return newData;
};
```

### 方案二

```js
const deepCopy2 = (data, map = new Map()) => {
  let newData;
  if (data === undefined || typeof data !== 'object') {
    newData = data;
  } else if (data instanceof Date) {
    newData = new Date(data);
  } else if (data instanceof RegExp) {
    newData = new RegExp(data);
  } else {
    const oldData = map.get(data);
    if (oldData) {
      return oldData;
    }

    map.set(data, data);

    newData = new data.constructor();
    for (const key in data) {
      newData[key] = deepCopy2(data[key], map);
    }
  }

  return newData;
};
```

### 方案三

将 Date，RegExp归为对象进行遍历

```js
const deepCopy = (data, mp = new Map()) => {
  let copyedData;

  if (typeof data === 'object' && data !== null) {
    const dataValue = mp.get(data);
    if (dataValue) {
      return dataValue;
    }

    mp.set(data, data);
    copyedData = new data.constructor();

    for (let key in data) {
      copyedData[key] = deepCopy(data[key], mp);
    }
  } else {
    copyedData = data;
  }

  return copyedData;
};

const handleClick = () => {
  const obj = {
    name: 'picker666',
    age: 22,
    sex: '男',
    hobby: ['跑步', '读书', '睡觉'],
    fn: function () {
      console.log(this.name);
    },
    friends: [11, 2, 3, { name: 'picker', age: 18 }],
    time: new Date(),
    reg: new RegExp(/D{9,19}/gi),
    id: Symbol('picker'),
  };

  function People(name) {
    this.name = name;
  }
  People.prototype.eat = function () {
    console.log(`${this.name} eat any thing!`);
  };
  obj[Symbol('picker666')] = 'picker666';
  obj.love = new People('Christine');

  Object.defineProperty(obj, 'learning', {
    enumerable: false,
    value: 666,
  });

  obj.other = obj;

  console.log('obj: ', obj);
  const targetData = deepCopy(obj);
  console.log('targetData: ', targetData);
  console.log(new Date(targetData.time).getTime());
};
```

两个问题：

* 1、symbal 属性没有遍历；（Object.getOwnpropertySymbal(), Reflect.ownKeys()）
* 2、for in 遍历了 prototype上的属性，一下方法被放置到实例中；（Object.getOwnPropertyNames() ）
* 3、不可枚举属性没有copy （Reflect.ownKeys()）

:::tip
Reflect.ownKeys()返回所有自有属性key，不管是否可枚举，但不包括继承自原型的属性;
:::

![三个问题](/images/newFunction/deepCopy1.png)

### 方案四

```js
const deepCopy = (data, mp = new Map()) => {
  let copyedData;

  if (typeof data === 'object' && data !== null) {
    const dataValue = mp.get(data);
    if (dataValue) {
      return dataValue;
    }

    mp.set(data, data);
    copyedData = new data.constructor();

    if (Array.isArray(data)) {
      copyedData = data.map((item) => deepCopy(item, mp));
    } else {
      const normalAttrs = Object.getOwnPropertyNames(data);
      const symbalAttrs = Object.getOwnPropertySymbols(data);
      [...normalAttrs, ...symbalAttrs].forEach((attr) => {
        copyedData[attr] = deepCopy(data[attr], mp);
      });
    }
  } else {
    copyedData = data;
  }

  return copyedData;
};

const handleClick = () => {
  const obj = {
    name: 'picker666',
    age: 22,
    sex: '男',
    hobby: ['跑步', '读书', '睡觉'],
    fn: function () {
      console.log(this.name);
    },
    friends: [11, 2, 3, { name: 'picker', age: 18 }],
    time: new Date(),
    reg: new RegExp(/D{9,19}/gi),
    id: Symbol('picker'),
  };

  function People(name) {
    this.name = name;
  }
  People.prototype.eat = function () {
    console.log(`${this.name} eat any thing!`);
  };
  obj[Symbol('picker666')] = 'picker666';
  obj.love = new People('Christine');

  Object.defineProperty(obj, 'learning', {
    enumerable: false,
    value: 666,
  });

  obj.other = obj;

  console.log('obj: ', obj);
  const targetData = deepCopy(obj);
  console.log('targetData: ', targetData);
  console.log(new Date(targetData.time).getTime());
};
```

Object.getOwnPropertyNames(data) + Object.getOwnPropertySymbols(data)

解决了1，2的问题；但是不可枚举属性不可遍历；

### 方案五

Reflect.ownKeys();

:::warning
Object.getOwnPropertyNames(data) + Object.getOwnPropertySymbols(data) !== Reflect.ownKeys(data);
:::

```js
const deepCopy = (data, mp = new Map()) => {
  let copyedData;

  if (typeof data === 'object' && data !== null) {
    const dataValue = mp.get(data);
    if (dataValue) {
      return dataValue;
    }

    mp.set(data, data);
    copyedData = new data.constructor();

    if (Array.isArray(data)) {
      copyedData = data.map((item) => deepCopy(item, mp));
    } else {
      const reflectKeys = Reflect.ownKeys(data);
      reflectKeys.forEach((attr) => {
        copyedData[attr] = deepCopy(data[attr], mp);
      });
    }
  } else {
    copyedData = data;
  }

  return copyedData;
};
```

![一个小瑕疵](/images/newFunction/deepCopy2.png)

不可枚举属性变成可枚举的！

![一个小瑕疵](/images/newFunction/deepCopy3.png)

这个问题不大，如果有必要可以设置成不可枚举属性；

```js
propertyIsEnumerable() // 判断属性是否可枚举
Object.defineProperty(person,'age',{
    enumerable:true //可以被枚举
})

const deepCopy = (data, mp = new Map()) => {
  let copyedData;

  if (typeof data === 'object' && data !== null) {
    const dataValue = mp.get(data);
    if (dataValue) {
      return dataValue;
    }

    mp.set(data, data);
    copyedData = new data.constructor();

    if (Array.isArray(data)) {
      copyedData = data.map((item) => deepCopy(item, mp));
    } else {
      const reflectKeys = Reflect.ownKeys(data);
      reflectKeys.forEach((attr) => {
        copyedData[attr] = deepCopy(data[attr], mp);

        if (!Object.propertyIsEnumerable.call(data, attr)) {
          Object.defineProperty(copyedData, attr, {
            enumerable: false,
          });
        }
      });
    }
  } else {
    copyedData = data;
  }

  return copyedData;
};
```

![完美](/images/newFunction/deepCopy4.png)

### 方案五 优化一

如果以上的例子中在copy之后执行一下代码，会怎样？

```js
obj.temp = '999';
```

![bug](/images/newFunction/deepCopy5.png)

```js
const deepCopy5 = (data, mp = new WeakMap()) => {
  let copyedData;

  if (typeof data === 'object' && data !== null) {
    const dataValue = mp.get(data);
    if (dataValue) {
      return dataValue;
    }

    // mp.set(data, data); 
    copyedData = new data.constructor();

    mp.set(data, copyedData); // 改为缓存copy后的新对象

    if (Array.isArray(data)) {
      copyedData = data.map((item) => deepCopy5(item, mp));
    } else {
      const reflectKeys = Reflect.ownKeys(data);
      reflectKeys.forEach((attr) => {
        copyedData[attr] = deepCopy5(data[attr], mp);

        if (!Object.propertyIsEnumerable.call(data, attr)) {
          Object.defineProperty(copyedData, attr, {
            enumerable: false,
          });
        }
      });
    }
  } else {
    copyedData = data;
  }

  return copyedData;
};
```

### 方案五 优化二

关于正则的处理

![bug](/images/newFunction/deepCopy6.png)

```js
const deepCopy6 = (data, mp = new Map()) => {
    let newData = data;
    if (typeof data === 'object' && data !== null) {
      const cd = mp.get(data);
      if (cd) {
        return cd;
      }

      let copyObj = new data.constructor();
      if (data instanceof RegExp) {
        copyObj = new data.constructor(data);
      }

      mp.set(data, copyObj);
      if (Array.isArray(data)) {
        newData = data.map((item) => deepCopy6(item, mp));
      } else {
        const keys = Reflect.ownKeys(data);

        keys.forEach((item) => {
          const copyValue = deepCopy6(data[item], mp);
          copyObj[item] = copyValue;
          // eslint-disable-next-line no-prototype-builtins
          if (!data.propertyIsEnumerable(item)) {
            Object.defineProperty(copyObj, item, {
              enumerable: false,
            });
          }
        });

        newData = copyObj;
      }
    }

    return newData;
  };
  ```

![bug](/images/newFunction/deepCopy7.png)

[dom 地址](https://github.com/Picker666/blog-example/blob/main/src/component/newFunction/DeepCopy.tsx)
