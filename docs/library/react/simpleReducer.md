# simpleReducer

这是一个自定义hooks组件

```ts
import { useReducer } from 'react';

type Anyobject = Record<string, any> & T;
type ActionType = Anyobject & { type: string };

const reducerGenerator = (actionsToState: Anyobject) => (state: Anyobject, action: ActionType) => {
  const { type, payload } = action;
  const calcState = actionsToState[type];
  let newState = state;
  if (calcState) {
    newState = calcState(state, payload);
  }
  return newState;
};

const generator = (simpleReducer: Anyobject, dispatch?: any) => {
  const product = {};
  const handlerKeys = Object.keys(simpleReducer);

  handlerKeys.forEach((handlerKey) => {
    const type = handlerKey.toLocaleUpperCase();
    if (dispatch) {
      product[handlerKey] = (targetData: any) => {
        dispatch({ type, payload: targetData });
      };
    } else {
      product[type] = simpleReducer[handlerKey];
    }
  });

  return product;
};

const useSimpleReducer = (simpleReducer: Anyobject, initialState: Record<string, any>) => () => {
  const actionsToState = generator(simpleReducer);
  const reducer = reducerGenerator(actionsToState);
  const [state, dispatch] = useReducer(reducer, initialState);

  const dispatches = generator(simpleReducer, dispatch);

  return [state, dispatches];
};

export default useSimpleReducer;
```

使用：

```ts
import useSimpleReducer from './useSimpleReducer';

import { DATA_SUBSCRIPTION } from '../constants';// 常量

const initialState = {
  visible: false,
  citysOptions: [],
  hover: false,
  permission: false,
  citys: []
};

const simpleReducer = {
  toggleMode: (state: { visible: any }) => ({ ...state, visible: !state.visible }),
  updateCitys: (state: any, citys: any[]) => {
    const citysOptions = citys.map((city: { location: any; code: any }) => {
      const { location, code } = city;
      return { label: location, value: code };
    });
    return {
      ...state,
      citysOptions,
      cityCode: '310100',
      citys,
    };
  },
  updateHover: (state: any, hover: any) => ({ ...state, hover }),
  updatePermission: (state: any, code: string | number) => ({ ...state, permission: !!DATA_SUBSCRIPTION[code] }),
};

const useVipReducer = useSimpleReducer(simpleReducer, initialState);

export default useVipReducer;
```
