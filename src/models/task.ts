import type FileEventType from 'src/abc/file-event-type';
import type FileTaskResult from 'src/abc/file-task-result';

// ----------------------------------------------------------------------

export interface FileTask {
  id: number; // タスクID
  type: FileEventType; // タスクタイプ
  progress: number | null; // 進捗度
  result: FileTaskResult; // タスクの結果
  src: string | null; // 元ファイルのパス
  dst: string | null; // 送り先または処理後のファイルパス
  serverId: string | null; // 対象のサーバー。値がある場合、xxx_path はサーバーディレクトリからの相対パス。
}
