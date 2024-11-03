import { createContext } from 'react';

import {
  FileTaskEvent,
  WebSocketClient,
  PerformanceProgress,
  ServerProcessReadEvent,
  ServerChangeStateEvent,
} from './client';

import type { EventMap } from './client';

// ----------------------------------------------------------------------

export const WebSocketContext = createContext(new WebSocketClient());

export {
  FileTaskEvent,
  WebSocketClient,
  PerformanceProgress,
  ServerProcessReadEvent,
  ServerChangeStateEvent,
};
export type { EventMap };
