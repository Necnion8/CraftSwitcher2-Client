import type { AxiosResponse } from 'axios';

import ServerType from './server-type';
import LaunchOption from './launch-option';

import type { LaunchOptionResult } from './launch-option';

export default class ServerConfig {
  constructor(
    public name: string | null,
    public type: ServerType,
    public launchOption: LaunchOption,
    public enableLaunchCommand: boolean | null,
    public launchCommand: string | null,
    public stopCommand: string | null,
    public shutdownTimeout: number | null,
    public readonly createdAt: Date | null,
    public readonly lastLaunchAt: Date | null,
    public readonly lastBackupAt: Date | null
  ) {}

  static toJSON(config: ServerConfig) {
    return JSON.stringify({
      name: config.name,
      type: config.type.name,
      ...config.launchOption.toConfig(),
      enableLaunchCommand: config.enableLaunchCommand,
      launchCommand: config.launchCommand,
      stopCommand: config.stopCommand,
      shutdownTimeout: config.shutdownTimeout,
    });
  }

  static serializeFromResult(result: AxiosResponse): ServerConfig {
    const { data }: { data: ServerConfigResult } = result;

    return new ServerConfig(
      data.name,
      ServerType.get(data.type),
      LaunchOption.serializeFromConfig(data.launchOption),
      data.enableLaunchCommand,
      data.launchCommand,
      data.stopCommand,
      data.shutdownTimeout,
      data.createdAt ? new Date(data.createdAt) : null,
      data.lastLaunchAt ? new Date(data.lastLaunchAt) : null,
      data.lastBackupAt ? new Date(data.lastBackupAt) : null
    );
  }
}

type ServerConfigResult = {
  name: string | null;
  type: string;
  launchOption: LaunchOptionResult;
  enableLaunchCommand: boolean | null;
  launchCommand: string | null;
  stopCommand: string | null;
  shutdownTimeout: number | null;
  createdAt: Date | null;
  lastLaunchAt: Date | null;
  lastBackupAt: Date | null;
};
