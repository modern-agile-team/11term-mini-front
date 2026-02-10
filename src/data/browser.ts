import { setupWorker } from 'msw/browser';
import { authhandler } from '../data/authhandler.ts';

export const worker = setupWorker(...authhandler);
