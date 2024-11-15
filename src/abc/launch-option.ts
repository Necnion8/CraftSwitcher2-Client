export default class LaunchOption {
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
      'launch_option.enable_report': this.enableReporterAgent,
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
      enable_report: this.enableReporterAgent,
      enable_screen: this.enableScreen,
    };
  }

  static serializeFromConfig(config: LaunchOptionResult): LaunchOption {
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

export type LaunchOptionResult = {
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
};
