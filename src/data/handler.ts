import { authhandler } from './authhandler';
import { aa } from './producthandler';

export const handlers = [...authhandler, ...aa];
