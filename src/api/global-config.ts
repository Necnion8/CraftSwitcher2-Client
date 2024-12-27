import axios from 'axios';

import { APIError } from 'src/abc/api-error';

// ------------------------------------------------------------

export class ServerGlobalConfig {
  public javaPreset: string;

  public javaExecutable: string;

  public javaOptions: string;

  public serverOptions: string;

  public maxHeapMemory: number;

  public minHeapMemory: number;

  public enableFreeMemoryCheck: boolean;

  public enableReporterAgent: boolean;

  public enableScreen: boolean;

  public shutdownTimeout: number;

  constructor(data: ServerGlobalConfigResult) {
    this.javaPreset = data['launchOption.javaPreset'];
    this.javaExecutable = data['launchOption.javaExecutable'];
    this.javaOptions = data['launchOption.javaOptions'];
    this.serverOptions = data['launchOption.serverOptions'];
    this.maxHeapMemory = data['launchOption.maxHeapMemory'];
    this.minHeapMemory = data['launchOption.minHeapMemory'];
    this.enableFreeMemoryCheck = data['launchOption.enableFreeMemoryCheck'];
    this.enableReporterAgent = data['launchOption.enableReporterAgent'];
    this.enableScreen = data['launchOption.enableScreen'];
    this.shutdownTimeout = data.shutdownTimeout;
  }

  static async get(): Promise<ServerGlobalConfig> {
    try {
      const result = await axios.get('/config/server_global');
      return new ServerGlobalConfig(result.data);
    } catch (e) {
      throw APIError.fromError(e);
    }
  }
}

type ServerGlobalConfigResult = {
  'launchOption.javaPreset': string;
  'launchOption.javaExecutable': string;
  'launchOption.javaOptions': string;
  'launchOption.serverOptions': string;
  'launchOption.maxHeapMemory': number;
  'launchOption.minHeapMemory': number;
  'launchOption.enableFreeMemoryCheck': boolean;
  'launchOption.enableReporterAgent': boolean;
  'launchOption.enableScreen': boolean;
  shutdownTimeout: number;
};
