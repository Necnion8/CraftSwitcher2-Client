import type {
  BackupId,
  BackupResult,
  BackupFilesResult,
  BackupPreviewResult,
  BackupsCompareResult,
} from 'src/models/backup';

import axios from 'axios';

import { toCamelCase } from 'src/utils/to-camelcase';

import BackupType from 'src/abc/backup-type';
import { APIError } from 'src/abc/api-error';
import { BackupTask } from 'src/models/backup';

import type Server from './server';

// ----------------------------------------------------------------------

export default class Backup {
  constructor(
    public id: string,
    public type: BackupType,
    public source: string,
    public createdAt: Date,
    public previousBackupId: string | null,
    public path: string,
    public comments: string | null,
    public totalFiles: number,
    public totalFilesSize: number,
    public errorFiles: number,
    public finalSize: number | null // バックアップ後のサイズ
  ) {}

  private static serializeFromResult(data: BackupResult): Backup {
    return new Backup(
      data.id,
      BackupType.valueOf(data.type),
      data.source,
      new Date(data.createdAt),
      data.previousBackupId,
      data.path,
      data.comments,
      data.totalFiles,
      data.totalFilesSize,
      data.errorFiles,
      data.finalSize
    );
  }

  static async getIDList(): Promise<BackupId[]> {
    try {
      const result = await axios.get('/backups');
      return result.data as BackupId[];
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  static async getInfo(id: string): Promise<Backup> {
    try {
      const result = await axios.get(`/backup/${id}`);
      const data = toCamelCase(result.data) as BackupResult;
      return Backup.serializeFromResult(data);
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  static async getByServer(server: Server): Promise<Backup[]> {
    try {
      const result = await axios.get(`/server/${server.id}/backups`);
      const data = toCamelCase(result.data) as BackupResult[];
      return data.map((d) => Backup.serializeFromResult(d));
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  static async getTask(server: Server): Promise<BackupTask> {
    try {
      const result = await axios.get(`/server/${server.id}/backup/`);
      return new BackupTask(result.data);
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  static async create(server: Server, comments: string | null, snapshot: boolean = false) {
    try {
      const result = await axios.post(
        `/server/${server.id}/backup?comments=${comments}&snapshot=${snapshot}`
      );
      return new BackupTask(result.data);
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  static async preview(
    server: Server,
    {
      checkFiles,
      includeFiles,
      includeErrors,
      onlyUpdates,
    }: {
      checkFiles?: boolean;
      includeFiles?: boolean;
      includeErrors?: boolean;
      onlyUpdates?: boolean;
    }
  ) {
    const params = new URLSearchParams();
    if (checkFiles) params.append('check_files', checkFiles.toString());
    if (includeFiles) params.append('include_files', includeFiles.toString());
    if (includeErrors) params.append('include_errors', includeErrors.toString());
    if (onlyUpdates) params.append('only_updates', onlyUpdates.toString());

    try {
      const result = await axios.get(`/server/${server.id}/backup/preview?${params.toString()}`);
      return toCamelCase(result.data) as BackupPreviewResult;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  async remove(): Promise<boolean> {
    try {
      const result = await axios.delete(`/backup/${this.id}`);
      return result.data;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  async files({
    checkFiles,
    includeFiles,
    includeErrors,
  }: {
    checkFiles?: boolean;
    includeFiles?: boolean;
    includeErrors?: boolean;
  }) {
    const params = new URLSearchParams();
    if (checkFiles !== undefined) params.append('check_files', checkFiles.toString());
    if (includeFiles !== undefined) params.append('include_files', includeFiles.toString());
    if (includeErrors !== undefined) params.append('include_errors', includeErrors.toString());

    try {
      const result = await axios.get(`/backup/${this.id}/files?${params.toString()}`);
      return toCamelCase(result.data) as BackupFilesResult;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  async compareWithBackup(
    target: Backup,
    {
      checkFiles,
      includeFiles,
      includeErrors,
      onlyUpdates,
    }: {
      checkFiles?: boolean;
      includeFiles?: boolean;
      includeErrors?: boolean;
      onlyUpdates?: boolean;
    }
  ) {
    const params = new URLSearchParams();
    params.append('target_backup_id', target.id);
    if (checkFiles !== undefined) params.append('check_files', checkFiles.toString());
    if (includeFiles !== undefined) params.append('include_files', includeFiles.toString());
    if (includeErrors !== undefined) params.append('include_errors', includeErrors.toString());
    if (onlyUpdates !== undefined) params.append('only_updates', onlyUpdates.toString());

    try {
      const result = await axios.get(`/backup/${this.id}/files/compare?${params.toString()}`);
      return toCamelCase(result.data) as BackupsCompareResult;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  async export(): Promise<Blob> {
    try {
      const result = await axios.get(`/backup/${this.id}/export`, {
        responseType: 'blob',
      });
      return result.data;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  async restore(server: Server): Promise<BackupTask> {
    try {
      const result = await axios.post(`/server/${server.id}/backup/${this.id}/restore`);

      const data = toCamelCase(result.data);
      data.backupType = BackupType.valueOf(data.backupType);
      return data as BackupTask;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  async verify(
    server: Server,
    {
      includeFiles,
      includeErrors,
      onlyUpdates,
    }: {
      includeFiles?: boolean;
      includeErrors?: boolean;
      onlyUpdates?: boolean;
    }
  ) {
    const params = new URLSearchParams();
    if (includeFiles !== undefined) params.append('include_files', includeFiles.toString());
    if (includeErrors !== undefined) params.append('include_errors', includeErrors.toString());
    if (onlyUpdates !== undefined) params.append('only_updates', onlyUpdates.toString());

    try {
      const result = await axios.post(
        `/server/${server.id}/backup/${this.id}/verify?${params.toString()}`
      );
      return toCamelCase(result.data) as BackupsCompareResult;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  async compareWithServer(
    server: Server,
    {
      checkFiles,
      includeFiles,
      includeErrors,
      onlyUpdates,
    }: {
      checkFiles?: boolean;
      includeFiles?: boolean;
      includeErrors?: boolean;
      onlyUpdates?: boolean;
    }
  ) {
    const params = new URLSearchParams();
    if (checkFiles !== undefined) params.append('check_files', checkFiles.toString());
    if (includeFiles !== undefined) params.append('include_files', includeFiles.toString());
    if (includeErrors !== undefined) params.append('include_errors', includeErrors.toString());
    if (onlyUpdates !== undefined) params.append('only_updates', onlyUpdates.toString());

    try {
      const result = await axios.get(
        `/server/${server.id}/backup/${this.id}/files/compare?${params.toString()}`
      );
      return toCamelCase(result.data) as BackupsCompareResult;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }

  // TODO: server?
  async getFile(server: Server, path: string): Promise<Blob> {
    try {
      const result = await axios.get(`/server/${server.id}/backup/${this.id}/file?path=${path}`, {
        responseType: 'blob',
      });
      return result.data;
    } catch (e) {
      throw APIError.fromError(e);
    }
  }
}
