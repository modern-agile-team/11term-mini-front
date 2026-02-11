import { authhandler } from './authhandler';
import { producthandler } from './producthandler';

export const handlers = [...authhandler, ...producthandler];
