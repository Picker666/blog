# loginTimeout

登录超时前，提示客户是否退出。

## 核心思想

自客户登录接口调用成功之后，开始倒计时，到达约定的时间前，弹框提示用户，继续（调接口刷新token时间）还是退出。客户每次调接口的操作都会刷新倒计时时间，后端同步刷新token时间。

```ts
import React from 'react';
import ReactDOM from 'react-dom';
import TimeOutModal from '@/components/TimeOutModal';

const HandleWithLoginTimeout = () => {
  const maxTime = 60 * 60; // 60min
  const minValve = 60 * 2;
  let leaveTime = maxTime;
  let interval: any = null;

  const setRootEle = () => {
    const attr = document.createAttribute('class');
    attr.value = 'loginTimeoutRoot';

    const node = document.createElement('div');
    node.setAttributeNode(attr);

    setTimeout(() => {
      document?.querySelector('#root')?.appendChild(node);
    }, 0);
  };

  // const modalUnmount = () => {
  //   ReactDOM.unmountComponentAtNode(
  //     document.querySelector('.loginTimeoutRoot'),
  //   );
  // };
  const cancelInterval = () => {
    interval && clearInterval(interval);
    interval = null;
  };

  const resetTime = (resetTokenTime: boolean) => {
    if (resetTokenTime) {
      leaveTime = maxTime;
      // eslint-disable-next-line no-use-before-define
      !interval && startInterval();
    }
  };

  const modalMount = () => {
    ReactDOM.render(
      <TimeOutModal cancelInterval={cancelInterval} leaveTime={leaveTime} minValve={minValve} />,
      document.querySelector('.loginTimeoutRoot')
    );
  };

  const startInterval = () => {
    interval = setInterval(() => {
      leaveTime--;
      modalMount();
    }, 1000);
  };


  // start
  setRootEle();

  return resetTime;
};

export default HandleWithLoginTimeout;
```

## 应用

```ts
import { request } from 'umi';
import handleLoading from '../utils/handleFullScreenLoading';
import handleWithLoginTimeout from '../utils/handleWithLoginTimeout';

type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

const resetInterval = handleWithLoginTimeout();

const calcParams = (param: { method: Method; [key: string]: any }) => {
  const { method } = param || {};
  const key = (method === 'GET' && 'params') || 'data';
  const { withoutLoading, resetTokenTime = true, ...restParams } = param[key] || {};

  const loadingId = (!withoutLoading && `request_loading_${Date.now().toString(36)}`) || '';

  return {
    params: {
      ...param,
      [key]: restParams,
    },
    loadingId,
    resetTokenTime,
  };
};

const requestWithLoading = <Res>(url: string, originParam: { method: Method; [key: string]: any }) => {
  const { params, loadingId, resetTokenTime } = calcParams(originParam);
  // loading start;
  const { closeLoading } = handleLoading(loadingId);

  return (
    request<{
      success: boolean;
      code: string;
      ext: string;
      msg: string;
      result: Res;
    }>(url, params)
      .then((res) => {
        resetInterval(resetTokenTime);
        return Promise.resolve(res);
      })
      // eslint-disable-next-line arrow-body-style
      .catch((error) => {
        return Promise.resolve({ success: false, code: '', msg: error, result: null });
      })
      .finally(() => {
        // loading end;
        closeLoading(loadingId);
      })
  );
};

export default requestWithLoading;

export function Request<T, Res>(url: string, method: Method = 'GET') {
  return (params?: T, options?: Record<string, unknown>) => {
    const key = (method === 'GET' && 'params') || 'data';

    return requestWithLoading<Res>(url, {
      method,
      [key]: params,
      ...options,
    });
  };
}
```
