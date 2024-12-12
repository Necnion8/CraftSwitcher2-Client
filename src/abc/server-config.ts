// eslint-disable-next-line max-classes-per-file
import type { AxiosResponse } from 'axios';

import ServerType from './server-type';

export class ServerConfig {
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

  static toJSON(config: Partial<ServerConfig>) {
    return JSON.stringify({
      name: config.name,
      type: config.type?.name,
      ...config.launchOption?.toConfig(),
      enable_launch_command: config.enableLaunchCommand,
      launch_command: config.launchCommand,
      stop_command: config.stopCommand,
      shutdown_timeout: config.shutdownTimeout,
    });
  }

  static serializeFromResult(result: AxiosResponse): ServerConfig {
    const { data }: { data: ServerConfigResult } = result;

    console.log(data);

    return new ServerConfig(
      data.name,
      ServerType.get(data.type),
      LaunchOption.serializeFromConfig(data),
      data.enable_launch_command,
      data.launch_command,
      data.stop_command,
      data.shutdown_timeout,
      data.created_at ? new Date(data.created_at) : null,
      data.last_launch_at ? new Date(data.last_launch_at) : null,
      data.last_backup_at ? new Date(data.last_backup_at) : null
    );
  }
}

export class LaunchOption {
  constructor(
    public javaPreset: string | null,
    public javaExecutable: string | null,
    public javaOptions: string | null,
    public jarFile: string,
    public serverOptions: string | null,
    public maxHeapMemory: number | null,
    public minHeapMemory: number | null,
    public enableFreeMemoryCheck: boolean | null,
    public enableReporterAgent: boolean | null,
    public enableScreen: boolean | null
  ) {}

  toConfig() {
    return {
      'launch_option.java_preset': this.javaPreset,
      'launch_option.java_executable': this.javaExecutable,
      'launch_option.java_options': this.javaOptions,
      'launch_option.jar_file': this.jarFile,
      'launch_option.server_options': this.serverOptions,
      'launch_option.max_heap_memory': this.maxHeapMemory,
      'launch_option.min_heap_memory': this.minHeapMemory,
      'launch_option.enable_free_memory_check': this.enableFreeMemoryCheck,
      'launch_option.enable_reporter_agent': this.enableReporterAgent,
      'launch_option.enable_screen': this.enableScreen,
    };
  }

  toCreateSchema() {
    return {
      java_preset: this.javaPreset,
      java_executable: this.javaExecutable,
      java_options: this.javaOptions,
      jar_file: this.jarFile,
      server_options: this.serverOptions,
      max_heap_memory: this.maxHeapMemory,
      min_heap_memory: this.minHeapMemory,
      enable_free_memory_check: this.enableFreeMemoryCheck,
      enable_reporter_agent: this.enableReporterAgent,
      enable_screen: this.enableScreen,
    };
  }

  static serializeFromConfig(config: ServerConfigResult): LaunchOption {
    return new LaunchOption(
      config['launch_option.java_preset'],
      config['launch_option.java_executable'],
      config['launch_option.java_options'],
      config['launch_option.jar_file'],
      config['launch_option.server_options'],
      config['launch_option.max_heap_memory'],
      config['launch_option.min_heap_memory'],
      config['launch_option.enable_free_memory_check'],
      config['launch_option.enable_reporter_agent'],
      config['launch_option.enable_screen']
    );
  }
}

export type ServerConfigResult = {
  name: string | null;
  type: string;
  'launch_option.java_preset': string | null;
  'launch_option.java_executable': string | null;
  'launch_option.java_options': string | null;
  'launch_option.jar_file': string;
  'launch_option.server_options': string | null;
  'launch_option.max_heap_memory': number | null;
  'launch_option.min_heap_memory': number | null;
  'launch_option.enable_free_memory_check': boolean | null;
  'launch_option.enable_reporter_agent': boolean | null;
  'launch_option.enable_screen': boolean | null;
  enable_launch_command: boolean | null;
  launch_command: string | null;
  stop_command: string | null;
  shutdown_timeout: number | null;
  created_at: Date | null;
  last_launch_at: Date | null;
  last_backup_at: Date | null;
};
