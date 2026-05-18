import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App' // 확장자 .tsx는 생략합니다.

// TypeScript에서는 getElementById가 null을 반환할 수 있으므로 !를 붙여 null이 아님을 명시합니다.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)