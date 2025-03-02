---
id: React Best Practices
aliases: []
tags: [React, StrictMode, useEffect]
title: 
description: 
---

# Reactプロジェクトのベストプラクティス

## 基本方針

Reactプロジェクトの信頼性、保守性、テスト容易性の向上と予測可能な動作を重視するために、以下の方針を守ってコーディングを行う。

- `React.StrictMode` を有効にすることで、React特有の問題を検出しやすくし、事前に解決します。
    - `StrictMode` は、Reactアプリケーション内の潜在的な問題を見つけるためのツールです。
    - 特に、`useEffect` フック内で副作用を起こすコードを見つけるのに役立ちます。
    - この副作用は予測できない振る舞いを引き起こし再現条件の特定が困難な場合があるため、そのようなリスクを回避しやすくなります。
- コンポーネントのコーディング時には、まずコンポーネントの参照透明性を確保できないかを考える。
    - 参照透明性とは、同じ引数を与えられた関数が常に同じ結果を返すことを意味します。
    - この性質を持つ関数は、副作用がないため、コンポーネントのメンテナン性やテスト容易性が向上します。
    - `useEffect` は、コンポーネントをReactの外側の世界と同期させるためのReactフックなので、使わないに越したことはありません。
        - Reactの内側の状態を同期させるために使うべきではありません。
- 参照透明性を確保できない場合(Reactの外部の副作用を伴う処理)に限り、React Hooksやライブラリのフック関数を利用したり、カスタムフックに隔離する。
    - カスタムフックは、関連のあるロジックをまとめることで、コンポーネントの責任を明確にし、メンテナンス性やテスト容易性を高める。

---
## 1. StrictModeを使用する

**理由**  
React公式ドキュメントにもあるように、`React.StrictMode` はアプリ全体の潜在的な問題（特に副作用の検出など）を早期に把握できるツールです。これにより、開発中に予測不能な振る舞いや将来的な問題発生のリスクを低減できます。

**悪いコード例**  
```jsx
// index.js（StrictMode未使用）
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

**良いコード例**  
```jsx
// index.js（StrictMode使用）
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

## 2. 関数コンポーネントを採用する

**理由**  
関数コンポーネントは、クラスコンポーネントに比べ記述が簡潔でテストしやすく、参照透明性（同じ入力で必ず同じ出力となる性質）を意識しやすいため、メンテナンス性が向上します。

**悪いコード例**  
```jsx
// 悪い例：クラスコンポーネントを使用
import React from 'react';

class MyComponent extends React.Component {
  render() {
    return <div>Hello World</div>;
  }
}
export default MyComponent;
```

**良いコード例**  
```jsx
// 良い例：関数コンポーネントを使用
import React from 'react';

const MyComponent = () => {
  return <div>Hello World</div>;
};

export default MyComponent;
```

## 3. Hooksをトップレベルで記述する

**理由**  
Hooks（useState、useEffectなど）は、コンポーネント内で常に同じ順序で呼び出す必要があります。条件分岐内やループ内で呼び出すと、Reactのルールに反し不具合の原因になるため、必ずコンポーネントのトップレベルで記述してください。

**悪いコード例**  
```jsx
// 悪い例：条件内でuseStateを呼び出す
import React, { useState } from 'react';

const MyComponent = () => {
  if (Math.random() > 0.5) {
    const [count, setCount] = useState(0);
  }
  return <div>Conditional hook</div>;
};
```

**良いコード例**  
```jsx
// 良い例：必ずトップレベルでHooksを呼び出す
import React, { useState } from 'react';

const MyComponent = () => {
  const [count, setCount] = useState(0);
  return <div>Count: {count}</div>;
};
```

## 4. 状態を適切な粒度で管理する

**理由**  
React公式ドキュメントの [useState](https://ja.react.dev/reference/react/useState) では、状態が更新されるとコンポーネント全体が再レンダリングされることが説明されています。複数の状態をひとつのオブジェクトで管理すると、たとえばユーザー名と年齢など互いに独立した情報を一緒に管理している場合、一部を更新するときに既存のプロパティを展開してマージする必要があり、誤った更新方法では意図しない副作用が発生する可能性があります。  
また、状態が互いに独立している場合は、useStateを複数回呼び出して状態を分割することで、不要な再レンダリングを防ぎ、各状態の更新が他の状態に影響を及ぼさないようにすることができます。

**悪い例（オブジェクト全体で管理して誤った更新を行う場合）**  
```jsx
import React, { useState } from 'react';

function UserProfile() {
  const [user, setUser] = useState({ name: '', age: 0 });

  // 部分更新の際に既存の状態を保持せず、ageが失われる
  const updateNameBad = (newName) => {
    setUser({ name: newName });
  };

  return (
    <div>
      <div>Name: {user.name}</div>
      <div>Age: {user.age}</div>
      <button onClick={() => updateNameBad('Alice')}>Set Name to Alice</button>
    </div>
  );
}
```

**良い例（状態を分割して管理する場合）**  
```jsx
import React, { useState } from 'react';

function UserProfile() {
  // ユーザー名と年齢を独立した状態として管理する
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);

  return (
    <div>
      <div>Name: {name}</div>
      <div>Age: {age}</div>
      <button onClick={() => setName('Alice')}>Set Name to Alice</button>
    </div>
  );
}
```

または、ひとつのオブジェクトで管理する必要がある場合は、スプレッド構文を利用して前の状態を正しくマージする方法も推奨されます。

**良い例（オブジェクトで管理しながら正しくマージする場合）**  
```jsx
import React, { useState } from 'react';

function UserProfile() {
  const [user, setUser] = useState({ name: '', age: 0 });

  // 前の状態を展開して新しい値をマージする
  const updateNameGood = (newName) => {
    setUser((prevUser) => ({
      ...prevUser,
      name: newName,
    }));
  };

  return (
    <div>
      <div>Name: {user.name}</div>
      <div>Age: {user.age}</div>
      <button onClick={() => updateNameGood('Alice')}>Set Name to Alice</button>
    </div>
  );
}
```

これにより、状態の更新が個別に行われ、他の状態が誤って上書きされる問題を防げるため、より予測可能で保守性の高いコードを書くことができます。

## 5. 局所状態を管理する

**理由**  
コンポーネント間で必要なデータ共有のため、局所状態は `useState` と状態の「リフトアップ」を組み合わせて管理します。これにより、状態管理が分散せず、明確なデータフローを保つことができ、テストもしやすくなります（[useState](https://ja.react.dev/reference/react/useState)を参照）。

**悪いコード例**  
```jsx
// 悪い例：各コンポーネントで状態を個別に管理（リフトアップしていない）
import React from 'react';

const Child = ({ value, onChange }) => {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
};

const Parent = () => {
  // 状態が各子コンポーネントに分散している
  return (
    <div>
      <Child value="foo" onChange={(newValue) => console.log(newValue)} />
      <Child value="bar" onChange={(newValue) => console.log(newValue)} />
    </div>
  );
};

export default Parent;
```

**良いコード例**  
```jsx
// 良い例：状態をリフトアップして一元管理する
import React, { useState } from 'react';

const Child = ({ value, onChange }) => {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
};

const Parent = () => {
  const [childValues, setChildValues] = useState({ child1: 'foo', child2: 'bar' });
  const handleChange = (child, newValue) => {
    setChildValues(prev => ({ ...prev, [child]: newValue }));
  };

  return (
    <div>
      <Child value={childValues.child1} onChange={(val) => handleChange('child1', val)} />
      <Child value={childValues.child2} onChange={(val) => handleChange('child2', val)} />
    </div>
  );
};

export default Parent;
```

## 6. グローバル状態は規模や用途に応じてContext APIまたはZustandなどのライブラリを使用する

**理由**  
中規模以上のプロジェクトでは、グローバルな状態管理には Zustand などの専用ライブラリを、また小規模の場合は Context API を積極的に採用してください。これにより、プロパティの受け渡し（プロップス・ドリリング）の煩雑さを解消し、状態管理が明確になります。

**悪いコード例**  
```jsx
// 悪い例：プロップス・ドリリングによるグローバル状態の伝播
import React from 'react';

const ComponentA = ({ user }) => <div>{user.name}</div>;

const ComponentB = ({ user }) => <ComponentA user={user} />;

const App = () => {
  const user = { name: 'Alice' };
  return <ComponentB user={user} />;
};

export default App;
```

**良いコード例（Context API）**  
```jsx
// 良い例：Context APIを利用してグローバル状態を管理する
import React, { createContext, useContext } from 'react';

const UserContext = createContext();

const ComponentA = () => {
  const user = useContext(UserContext);
  return <div>{user.name}</div>;
};

const App = () => {
  const user = { name: 'Alice' };
  return (
    <UserContext.Provider value={user}>
      <ComponentA />
    </UserContext.Provider>
  );
};

export default App;
```

*※ 中規模以上の場合は Zustand などのライブラリも検討してください。*

## 7. 非同期処理を正しく扱う

**理由**  
`useEffect` 内で非同期処理を実施する際は、Race Condition（複数の非同期処理が競合して予測不能な状態更新を引き起こす問題）を防ぐために、必ずクリーンアップ関数を用いてキャンセル処理を行います。（[useEffect](https://ja.react.dev/reference/react/useEffect)を参照）

**悪いコード例**  
```jsx
// 悪い例：非同期処理にクリーンアップ関数を使用していない
import React, { useEffect, useState } from 'react';

const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(json => setData(json));
  }, []);

  return <div>{data ? data.message : 'Loading...'}</div>;
};

export default MyComponent;
```

**良いコード例**  
```jsx
// 良い例：クリーンアップ関数を使用してRace Conditionを防止
import React, { useEffect, useState } from 'react';

const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      const response = await fetch('/api/data');
      const json = await response.json();
      if (!isCancelled) {
        setData(json);
      }
    }
    fetchData();

    return () => {
      isCancelled = true;
    };
  }, []);

  return <div>{data ? data.message : 'Loading...'}</div>;
};

export default MyComponent;
```

## 8. 副作用を正しく扱う

**理由**  
`useEffect` は、React の外部に影響を及ぼす副作用（データフェッチ、購読、DOM操作など）を扱うためのものです。状態から計算できる値はレンダリング時に直接計算し、不要な副作用による再レンダリングや予期しない挙動を防ぎます。（[useEffect](https://ja.react.dev/reference/react/useEffect)を参照）

**悪いコード例**  
```jsx
// 悪い例：状態から計算できる値をuseEffectで更新している
import React, { useState, useEffect } from 'react';

const MyComponent = ({ a, b }) => {
  const [result, setResult] = useState(0);

  useEffect(() => {
    setResult(a + b);
  }, [a, b]);

  return <div>{result}</div>;
};

export default MyComponent;
```

**良いコード例**  
```jsx
// 良い例：レンダリング中に直接計算する
import React from 'react';

const MyComponent = ({ a, b }) => {
  const result = a + b;
  return <div>{result}</div>;
};

export default MyComponent;
```

## 9. カスタムフックに切り出し関心を分離する

**理由**  
複雑な副作用処理や複数コンポーネントで再利用するロジックは、カスタムフックに切り出すことでコンポーネントの責務を明確化し、保守性やテスト容易性を向上させます。

**悪いコード例**  
```jsx
// 悪い例：複数コンポーネントで同じ非同期処理ロジックが重複している
import React, { useEffect, useState } from 'react';

const ComponentA = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/data');
      const json = await response.json();
      setData(json);
    }
    fetchData();
  }, []);

  return <div>{data ? data.message : 'Loading...'}</div>;
};

export default ComponentA;
```

**良いコード例**  
```jsx
// 良い例：共通ロジックをカスタムフックに切り出して再利用
import React, { useEffect, useState } from 'react';

const useFetchData = (url) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    async function fetchData() {
      const response = await fetch(url);
      const json = await response.json();
      if (!isCancelled) {
        setData(json);
      }
    }
    fetchData();
    return () => {
      isCancelled = true;
    };
  }, [url]);

  return data;
};

const ComponentA = () => {
  const data = useFetchData('/api/data');
  return <div>{data ? data.message : 'Loading...'}</div>;
};

export default ComponentA;
```

## 10. 依存配列を正確に記述する

**理由**  
`useEffect` の依存配列は、内部で参照している外部変数を正確に列挙する必要があります。依存配列が不足していると、必要なタイミングで副作用が再実行されず、過剰だと不要な再レンダリングが発生します。

**悪いコード例**  
```jsx
// 悪い例：依存配列に必要な変数が含まれていない
import React, { useEffect, useState } from 'react';

const MyComponent = ({ propValue }) => {
  const [state, setState] = useState(0);

  useEffect(() => {
    console.log(propValue);
  }, []); // propValueが依存配列に含まれていない

  return <div>{state}</div>;
};

export default MyComponent;
```

**良いコード例**  
```jsx
// 良い例：必要な変数が正しく依存配列に含まれている
import React, { useEffect, useState } from 'react';

const MyComponent = ({ propValue }) => {
  const [state, setState] = useState(0);

  useEffect(() => {
    console.log(propValue);
  }, [propValue]);

  return <div>{state}</div>;
};

export default MyComponent;
```

## 11. パフォーマンス最適化を必要な時のみ行う

**理由**  
`React.memo`、`useMemo`、`useCallback` などのパフォーマンス最適化手法は、実際にパフォーマンス上の問題が発生した場合に限定して使用してください。過剰な最適化はコードの可読性を低下させ、予期せぬ副作用を招く可能性があります。

**悪いコード例**  
```jsx
// 悪い例：不必要にuseMemoやuseCallbackを多用
import React, { useMemo, useCallback } from 'react';

const MyComponent = ({ value }) => {
  const computedValue = useMemo(() => value * 2, [value]);
  const handleClick = useCallback(() => console.log('Clicked'), []);

  return <div onClick={handleClick}>{computedValue}</div>;
};

export default React.memo(MyComponent);
```

**良いコード例**  
```jsx
// 良い例：必要な場合のみ最適化を実施
import React from 'react';

const MyComponent = ({ value, onClick }) => {
  const computedValue = value * 2; // 単純な計算は直接実行
  return <div onClick={onClick}>{computedValue}</div>;
};

export default MyComponent;
```

## 12. サーバー状態はライブラリを用いて管理する

**理由**  
サーバーからのデータ取得やキャッシュ、再検証といったサーバー状態の管理は頻出である一方、React公式で便利なフック関数が提供されておらず、自前で実装すると複雑になりがちです。
車輪の再発明を避けるため、React Query や SWR などのデータフェッチライブラリを利用することで、コードのシンプルさと信頼性を向上させられます。

**悪いコード例**  
```jsx
// 悪い例：サーバー状態を自前で管理している
import React, { useState, useEffect } from 'react';

const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  return <div>{data ? data.message : 'Loading...'}</div>;
};

export default MyComponent;
```

**良いコード例（React Query使用）**  
```jsx
// 良い例：React Queryでサーバー状態を管理する
import React from 'react';
import { useQuery } from 'react-query';

const fetchData = async () => {
  const res = await fetch('/api/data');
  return res.json();
};

const MyComponent = () => {
  const { data, isLoading } = useQuery('dataKey', fetchData);

  if (isLoading) return <div>Loading...</div>;
  return <div>{data.message}</div>;
};

export default MyComponent;
```

## 13. 参照透明性と冪等性を確保する

**理由**  
コンポーネントや関数が、同じ入力に対して必ず同じ出力を返す参照透明性・冪等性を保つことで、テストの容易性とバグの予防に繋がります。副作用を最小限にし、予測可能な動作を実現してください。

**悪いコード例**  
```jsx
// 悪い例：外部変数を直接変更し、参照透明性が損なわれる
let counter = 0;
const increment = () => {
  counter++;
  return counter;
};

const MyComponent = () => {
  const value = increment(); // 呼び出すたびに異なる結果に
  return <div>{value}</div>;
};

export default MyComponent;
```

**良いコード例**  
```jsx
// 良い例：純粋な関数で参照透明性を保つ
const add = (a, b) => a + b;

const MyComponent = ({ a, b }) => {
  const value = add(a, b); // 常に同じ結果を返す
  return <div>{value}</div>;
};

export default MyComponent;
```

---
## プロンプト

下記の内容でReactプロジェクトの実装者向けのコーディング規約を作成してください。

**基本方針**

- `React.StrictMode` を有効にすることで、React特有の問題を検出しやすくし、事前に解決します。
    - `StrictMode` は、Reactアプリケーション内の潜在的な問題を見つけるためのツールです。
    - 特に、`useEffect` フック内で副作用を起こすコードを見つけるのに役立ちます。
    - この副作用は予測できない振る舞いを引き起こし再現条件の特定が困難な場合があるため、そのようなリスクを回避しやすくなります。
- コンポーネントのコーディング時には、まずコンポーネントの参照透明性を確保できないかを考える。
    - 参照透明性とは、同じ引数を与えられた関数が常に同じ結果を返すことを意味します。
    - この性質を持つ関数は、副作用がないため、コンポーネントのメンテナン性やテスト容易性が向上します。
    - `useEffect` は、コンポーネントをReactの外側の世界と同期させるためのReactフックなので、使わないに越したことはありません。
        - Reactの内側の状態を同期させるために使うべきではありません。
- 参照透明性を確保できない場合(Reactの外部の副作用を伴う処理)に限り、React Hooksやライブラリのフック関数を利用したり、カスタムフックに隔離する。
    - カスタムフックは、関連のあるロジックをまとめることで、コンポーネントの責任を明確にし、メンテナンス性やテスト容易性を高める。

**具体的な項目**

- React.StrictModeを有効にする
- 関数コンポーネントを使用する
- Hooksはコンポーネント内で必ずトップレベルで記述する
- 状態を適切な粒度で管理する
- 局所的な状態管理はuseStateとリフトアップで実装する
- グローバルな状態管理は中規模以上でZustandなどの状態管理ライブラリ、小規模な場合はContext APIの採用を積極的に採用する
- React.memo, useMemo, useCallbackは本当に必要になった時以外は使わない
- useEffect内で非同期処理を行う場合はクリーンアップ関数を必須化してRace Condition問題を回避する
- useEffectはReactの外側の副作用を扱う場合のみの使用に限定する
- useEffectを使用する時はカスタムフックに切り出すことを積極的に検討する
- 関連のないロジックは複数のuseEffect（カスタムフック）に分割する
- useEffect では依存配列を過不足なく記述する
- 状態から計算できる値はuseEffectを使わずにレンダリング中に直接計算する
- サーバー状態管理はデータフェッチライブラリを積極的に採用する
- コンポーネントは可能な限り参照透明性、冪等性を確保する

**書き方**

- 各項目の見出しは動詞で終わるようにしてください。
- 各項目の順序は意味のあるまとまりを考慮して並べ替えてください。
- 各項目は理由とサンプルコードで構成してください。
- 理由やサンプルコードは、可能な限り以下の公式ドキュメントを使用してください。
- 理由は、問題点を含め、その方針がなぜ必要であるのかを丁寧に説明してください。
- Race Conditiionやリフトアップなど、重要な用語は省略しないでください。
- サンプルコードは悪いコードの例と良いコードの例を示すようにしてください。
- 下記のページ内になければ、同公式ページ内のリンクを辿り最新の情報を確認してください。

**参考にする公式ドキュメント**

- [React公式ドキュメント - StrictMode](https://ja.react.dev/reference/react/StrictMode)
- [React公式ドキュメント - useEffect](https://ja.react.dev/reference/react/useEffect)
- [React公式ドキュメント - useState](https://ja.react.dev/reference/react/useState)


