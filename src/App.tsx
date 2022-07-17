import React from 'react';
import { useState } from 'react';
import './index.css';
import SomePic from './some-pic.png';

type Props = {}

function App({}: Props) {
  const [count, setCount] = useState<number>(0);

  function increaseCount() {
    setCount(count + 1);
  }

  return (
    <>
      <h1>Some title</h1>
      <img src={SomePic} alt="" />
      <h2>count: {count}</h2>
      <button onClick={increaseCount}>Increase count</button>
    </>
  )
}

export default App;