import { authhandler } from './authhandler';
import { producthandler } from './producthandler';
import { chathandler } from './chathandler';

export const handlers = [...authhandler, ...producthandler, ...chathandler];
