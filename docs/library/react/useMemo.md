# useMemo用法汇总

用来缓存数据，当 组件内部某一个渲染的数据，需要通过计算而来，这个计算是依赖与特定的state、props数据，我们就用useMemo来缓存这个数据，以至于我们在修改她们没有依赖的数据源的情况下，多次调用这个计算函数，浪费计算资源。

直接上代码

```ts
import React, { useState, useMemo } from 'react';

function Info(props) {
  let [personalInfo , setPersonalInfo] = useState({
    name: 'kevin kang',
    gender: 'male'
  })

  function formatGender(gender) {
    console.log('---调用了翻译性别的方法---')
    return gender === 'male' ? '男' : '女'
  }


  // BAD 
  // 不使用useMemo的情况下，修改其他属性，也会重新调用formatGender方法，浪费计算资源
  // let gender =  formatGender(personalInfo.gender)

  // GOOD
  let gender = useMemo(()=>{
    return formatGender(personalInfo.gender)
  }, 
  [personalInfo.gender])

  return (
    <>
        <div>
          姓名： {personalInfo.name} -- 性别:  { gender } <br/>
          <button onClick={ 
            ()=> { 
              setPersonalInfo({
                ...personalInfo,
                name: 'Will Kang'
              }) 
            }  
          }> 点击修改名字</button>
        </div>
    </>
  )
}

export default Info
```
