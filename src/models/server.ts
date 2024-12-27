import type ServerType from 'src/abc/server-type';
import type { LaunchOption } from 'src/abc/server-config';

// ------------------------------------------------------------

export type ServerResult = {
  id: string;
  name: string;
  type: string;
  state: string;
  directory: string;
  isLoaded: boolean;
  buildStatus: string;
};

export type CreateServerParams = {
  name: string | null;
  directory: string;
  type: ServerType;
  launchOption: LaunchOption;
  enableLaunchCommand?: boolean;
  launchCommand?: string;
  stopCommand?: string | null;
  shutdownTimeout?: number | null;
};

/**
export type ServerOperationResult = {
  result: boolean;
  serverId: string;
};
 */
