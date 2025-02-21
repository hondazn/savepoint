# Reactプロジェクトのベストプラクティス

## StrictModeを有効にする
https://ja.react.dev/reference/react/StrictMode  
StrictModeを有効にするには、アプリケーションのエントリポイントでStrictModeコンポーネントを使用する。

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```
::: tip 理由
StrictModeは、Reactアプリケーション内の潜在的な問題を見つけるためのツール。StrictModeは、アプリケーション内のコンポーネントが副作用を引き起こす可能性のあるコードを見つけるために使用される。
特に `useEffect` フック内で副作用を起こすコードを見つけるのに役立つ。この副作用は予測できない振る舞いを引き起こし再現条件の特定が困難な場合があるため、そのようなリスクを回避しやすくなる。
:::
