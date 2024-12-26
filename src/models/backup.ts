import type { Backup } from 'src/api/backup';
import type BackupType from 'src/abc/backup-type';
import type SnapshotStatus from 'src/abc/snapshot-status';
import type BackupFileErrorType from 'src/abc/backup-file-error-type';

import type { FileTask } from './task';

// ----------------------------------------------------------------------

export interface BackupResult {
  id: string;
  type: string;
  source: string;
  createdAt: string;
  previousBackupId: string | null;
  path: string;
  comments: string | null;
  totalFiles: number;
  totalFilesSize: number;
  errorFiles: number;
  finalSize: number | null;
}

export interface BackupId {
  id: string;
  source: string;
  server: string;
}

export interface BackupFileInfo {
  size: number;
  modify_time: string;
  is_dir: boolean;
}

export interface BackupFileDifference {
  path: string;
  old_info: BackupFileInfo | null;
  new_info: BackupFileInfo | null;
  status: SnapshotStatus;
}

export interface BackupFilePathInfo {
  path: string;
  is_dir: boolean;
  size: number;
  modify_time: string;
}

export interface BackupFilePathErrorInfo {
  path: string;
  error_type: BackupFileErrorType;
  error_message: string | null;
}

export interface BackupFilesResult {
  totalFiles: number;
  totalFilesSize: number;
  errorFiles: number;
  backupFilesSize: number;

  files: BackupFilePathInfo[] | null;
  errors: BackupFilePathErrorInfo[] | null;
}

export interface BackupsCompareResult {
  totalFiles: number;
  totalFilesSize: number;
  errorFiles: number;
  backupFilesSize: number;

  updateFiles: number;
  updateFilesSize: number;

  targetTotalFiles: number;
  targetTotalFilesSize: number;
  targetErrorFiles: number;
  targetBackupFilesSize: number;

  files: BackupFileDifference[] | null;
  errors: BackupFilePathErrorInfo[] | null;
  targetErrors: BackupFilePathErrorInfo[] | null;
}

export interface BackupPreviewResult {
  total_files: number;
  total_files_size: number;
  error_files: number;
  update_files: number;
  update_files_size: number;
  backup_files_size: number;

  snapshot_source: string;

  files: BackupFilePathInfo[];
  errors: BackupFilePathErrorInfo[];
}

export interface BackupFileHistoryEntry {
  backup: Backup;
  info: BackupFileInfo | null;
  status: SnapshotStatus | null;
}

export interface BackupTask extends FileTask {
  comments: string | null; // バックアップメモ
  backupType: BackupType;
  backupId: string; // バックアップID
}
