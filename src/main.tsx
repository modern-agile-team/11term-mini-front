import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root')!;
let root: ReactDOM.Root;

async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  const { worker } = await import('./data/browser');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  if (!root) {
    root = ReactDOM.createRoot(rootElement);
  }

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
