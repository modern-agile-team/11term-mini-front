import { authhandler } from './authhandler';
import { productHandlers } from './producthandlers';

export const handlers = [...authhandler, ...productHandlers];
