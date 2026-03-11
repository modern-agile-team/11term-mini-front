import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initTalkSocket } from './socket/talkSocket';

const rootElement = document.getElementById('root')!;

async function enableMocking() {
  if (import.meta.env.MODE !== 'development') return;

  const { worker } = await import('./data/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  initTalkSocket();

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
