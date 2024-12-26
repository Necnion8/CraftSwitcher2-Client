import type { LaunchOption } from 'src/abc/server-config';
import type { BackupTask, BackupPreviewResult } from 'src/models/backup';

import axios from 'axios';

import ServerType from 'src/abc/server-type';
import { APIError } from 'src/abc/api-error';
import ServerState from 'src/abc/server-state';
import { ServerConfig } from 'src/abc/server-config';

import { Backup } from './backup';
import { FileManager } from './file-manager';

import type { ServerDirectory } from './file-manager';

// ----------------------------------------------------------------------

export default class Server {
  constructor(
    public id: string,
    public name: string,
    public type: ServerType,
    public state: ServerState,
    public directory: string,
    public isLoaded: boolean,
    public buildStatus: string
  ) {}

  /**
   * 登録されているサーバーを取得します
   */
  static async all(): Promise<Server[]> {
    try {
      const result = await axios.get('/servers');
      return result.data.map((value: ServerResult) => this.serializeFromResult(value));
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  static async get(id: string): Promise<Server> {
    try {
      const result = await axios.get(`/server/${id}`);
      return this.serializeFromResult(result.data);
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  private static serializeFromResult(value: ServerResult) {
    return new Server(
      value.id,
      value.name,
      ServerType.get(value.type),
      ServerState.get(value.state),
      value.directory,
      value.is_loaded,
      value.build_status
    );
  }

  /**
   * サーバーを作成します
   * @returns 成功した場合はサーバーID、失敗した場合はfalse
   */
  static async create({
    name,
    directory,
    type,
    launchOption,
    enableLaunchCommand = false,
    launchCommand = '',
    stopCommand = null,
    shutdownTimeout = null,
  }: ServerCreateParams): Promise<Server | false> {
    const id = window.crypto.randomUUID();

    try {
      const result = await axios.post(
        `/server/${id}`,
        {
          name,
          directory,
          type: type.name,
          launch_option: launchOption.toCreateSchema(),
          enable_launch_command: enableLaunchCommand,
          launch_command: launchCommand,
          stop_command: stopCommand,
          shutdown_timeout: shutdownTimeout,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return result.data.result ? (await Server.get(id))! : false;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  get displayName(): string {
    return this.name || this.id;
  }

  /**
   * サーバーを起動します
   */
  async start(): Promise<boolean> {
    try {
      const result = await axios.post(`/server/${this.id}/start`);
      return result.data.result;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  /**
   * サーバーを停止します
   */
  async stop(): Promise<boolean> {
    try {
      const result = await axios.post(`/server/${this.id}/stop`);
      return result.data.result;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  /**
   * サーバーを再起動します
   */
  async restart(): Promise<boolean> {
    try {
      const result = await axios.post(`/server/${this.id}/restart`);
      return result.data.result;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  /**
   * サーバーを強制終了します
   */
  async kill(): Promise<boolean> {
    try {
      const result = await axios.post(`/server/${this.id}/kill`);
      return result.data.result;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  /**
   * サーバーにコマンドを送信します
   */
  async sendLine(line: string): Promise<boolean> {
    try {
      const result = await axios.post(`/server/${this.id}/send_line?line=${line}`);
      return result.data.result;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  /**
   * 擬似端末のウインドウサイズを取得します
   * 幅x高のカーソル数を返します
   */
  async getTermSize(): Promise<number[]> {
    try {
      const result = await axios.get(`/server/${this.id}/term/size`);
      return result.data;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  /**
   * 擬似端末のウインドウサイズを設定します
   * 幅x高のカーソル数を指定します
   */
  async setTermSize(cols: number, rows: number): Promise<boolean> {
    try {
      const result = await axios.post(`/server/${this.id}/term/size?cols=${cols}&rows=${rows}`);
      return result.data.result;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  /**
   * キャッシュされているサーバーログを取得します
   */
  async getLogsLatest(
    includeBuffer: boolean = false,
    maxLines: number | null = null
  ): Promise<string[]> {
    try {
      const params = new URLSearchParams({
        include_buffer: includeBuffer ? 'true' : 'false',
      });
      if (maxLines) {
        params.set('max_lines', String(maxLines));
      }

      const result = await axios.get(`/server/${this.id}/logs/latest?${params.toString()}`);
      return result.data;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  /**
   * 構成済みのサーバーを登録します
   */
  async import(directory: string): Promise<boolean> {
    try {
      const result = await axios.post(
        `/server/${this.id}/import`,
        { directory },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return result.data.result;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  /**
   *  サーバーを削除します
   * @param deleteConfigFile
   */
  async remove(deleteConfigFile: boolean = false): Promise<boolean> {
    try {
      const result = await axios.delete(
        `/server/${this.id}${deleteConfigFile ? '?delete_config_file=true' : ''}`
      );
      return result.data.result;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  /**
   * サーバーの設定を取得します
   */
  async getConfig(): Promise<ServerConfig> {
    try {
      const result = await axios.get(`/server/${this.id}/config`);
      return ServerConfig.serializeFromResult(result);
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  /**
   * サーバーの設定を更新します
   * @param config
   */
  async updateConfig(config: Partial<ServerConfig>): Promise<boolean> {
    try {
      const result = await axios.put(`/server/${this.id}/config`, ServerConfig.toJSON(config), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return result.status === 200;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  /**
   * 設定ファイルを再読み込みします
   */
  async reloadConfig(): Promise<boolean> {
    try {
      const result = await axios.post(`/server/${this.id}/config/reload`);
      return result.status === 200;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  /**
   * サーバーJarのインストールをします
   * ビルドが必要な場合は、サーバーの初回起動時に実行されます。
   */
  async install(serverType: ServerType, version: string, build: string): Promise<string> {
    try {
      const params = new URLSearchParams({
        server_type: serverType.name,
        version,
        build,
      });
      const result = await axios.post(`/server/${this.id}/install?${params.toString()}`);
      return result.data.result;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  /**
   * ビルダーを削除をします
   */
  async removeBuild(): Promise<boolean> {
    try {
      const result = await axios.delete(`/server/${this.id}/build`);
      return result.data.result;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  async getDirectory(path: string): Promise<ServerDirectory> {
    return FileManager.get(this.id, path);
  }

  async getEula(): Promise<string> {
    try {
      const result = await axios.get(`/server/${this.id}/eula`);
      return result.data.eula;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  async setEula(accept: boolean): Promise<boolean> {
    try {
      const result = await axios.post(`/server/${this.id}/eula?accept=${accept}`);
      return result.status === 200;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  async getBackups(): Promise<Backup[]> {
    return Backup.getByServer(this);
  }

  async getBackupTask(): Promise<BackupTask> {
    return Backup.getTask(this);
  }

  async createBackup(comments: string | null, snapshot: boolean = false): Promise<BackupTask> {
    return Backup.create(this, comments, snapshot);
  }

  async previewBackup(params: {
    checkFiles?: boolean;
    includeFiles?: boolean;
    includeErrors?: boolean;
    onlyUpdates?: boolean;
  }): Promise<BackupPreviewResult> {
    return Backup.preview(this, params);
  }
}

type ServerResult = {
  id: string;
  name: string;
  type: string;
  state: string;
  directory: string;
  is_loaded: boolean;
  build_status: string;
};

type ServerCreateParams = {
  name: string | null;
  directory: string;
  type: ServerType;
  launchOption: LaunchOption;
  enableLaunchCommand?: boolean;
  launchCommand?: string | null;
  stopCommand?: string | null;
  shutdownTimeout?: number | null;
};
