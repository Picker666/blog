# Loading

集中处理项目中的loading 问题。

## 核心思想

劫持request，每次调接口都会往 loadingQueue 中 push 一个当前 loading的id，每次接口调用结束，删除对应的id，如果 loadingQueue 有值 就保持loading 展示，如果 loadingQueue 为空数组，卸载loading组件。

```ts
import ReactDOM from 'react-dom';
import PageLoading from '@/components/PageLoading';

const TIMEOUT_TIME = 1000 * 60; // 超时时间 60s

const loadingMount = () => {
  ReactDOM.render(
    <PageLoading />,
    document.querySelector('.fullScreenLoading'),
  );
};

const loadingUnmount = () => {
  ReactDOM.unmountComponentAtNode(document.querySelector('.fullScreenLoading') as Element);
};

const handleFullScreenLoading = () => {
  let loadingQueue: any[] = [];
  let timePlan: any = null;

  const timeOutStart = () =>
    setTimeout(() => {
      // eslint-disable-next-line no-use-before-define
      clearAll();
      clearTimeout(timePlan);
    }, TIMEOUT_TIME);

  const setLoadingRootEle = () => {
    const attr = document.createAttribute('class');
    attr.value = 'fullScreenLoading';

    const node = document.createElement('div');
    node.setAttributeNode(attr);
    setTimeout(() => {
      // that umi render content component maybe replace all root children element, so append child async
      document?.querySelector('#root')?.appendChild(node);
    }, 0);
  };

  const renderLoading = () => {
    if (loadingQueue.length === 1) {
      timePlan = timeOutStart();
      loadingMount();// 单例模式
    } else if (!loadingQueue.length) {
      clearTimeout(timePlan);
      loadingUnmount();
    }
  };

  const showLoading = (loadingId: number | string) => {
    loadingQueue.push({ id: loadingId });
    renderLoading();
  };

  const closeLoading = (loadingId: number | string) => {
    if (loadingQueue.length) {
      loadingQueue = loadingQueue.filter((item) => item.id !== loadingId);
    }

    renderLoading();
  };

  const clearAll = () => {
    loadingQueue = [];
    renderLoading();
  };

  setLoadingRootEle();

  return (loadingId: number | string) => {
    if (loadingId) {
      showLoading(loadingId);
    }
    return {
      renderLoading,
      showLoading,
      closeLoading,
      clearAll,
    };
  };
};

export default handleFullScreenLoading();
```


应用：

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
