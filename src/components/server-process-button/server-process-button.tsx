import React from 'react';
import { toast } from 'sonner';

import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import { APIError } from 'src/abc/api-error';
import ServerState from 'src/abc/server-state';

import { Iconify } from 'src/components/iconify';

import { stopDisabled, killDisabled, startDisabled } from './types';

import type { ServerProcessButtonProps } from './types';

// ----------------------------------------------------------------------

export const ServerProcessButton = ({ server, state, ...other }: ServerProcessButtonProps) => {
  const _state = state || server?.state || ServerState.UNKNOWN;

  const isStartDisabled = startDisabled.includes(_state.name);
  const isStopDisabled = stopDisabled.includes(_state.name);
  const isKillDisabled = killDisabled.includes(_state.name);

  const handleStart = async () => {
    if (!server) return;
    try {
      const res = await server.start();
      if (!res) {
        toast.error(`サーバーの起動に失敗しました`);
      }
    } catch (e) {
      toast.error(APIError.createToastMessage(e));
    }
  };

  const handleStop = async () => {
    if (!server) return;
    try {
      const res = await server.stop();
      if (!res) {
        toast.error(`サーバーの停止に失敗しました`);
      }
    } catch (e) {
      toast.error(APIError.createToastMessage(e));
    }
  };

  const handleRestart = async () => {
    if (!server) return;
    try {
      const res = await server.restart();
      if (!res) {
        toast.error(`サーバーの再起動に失敗しました`);
      }
    } catch (e) {
      toast.error(APIError.createToastMessage(e));
    }
  };

  const handleKill = async () => {
    if (!server) return;
    try {
      const res = await server.kill();
      if (!res) {
        toast.error(`サーバーの強制停止に失敗しました`);
      }
    } catch (e) {
      toast.error(APIError.createToastMessage(e));
    }
  };

  return (
    <Stack direction="row" gap={1}>
      <Tooltip title="起動">
        <Fab
          color="success"
          size="small"
          onClick={handleStart}
          disabled={isStartDisabled}
          {...other}
        >
          <Iconify icon="mingcute:play-fill" />
        </Fab>
      </Tooltip>
      <Tooltip title="停止">
        <Fab color="error" size="small" onClick={handleStop} disabled={isStopDisabled}>
          <Iconify icon="mingcute:square-fill" />
        </Fab>
      </Tooltip>
      <Tooltip title="再起動">
        <Fab
          color="warning"
          size="small"
          onClick={handleRestart}
          disabled={isStopDisabled}
          sx={{ color: '#ffffff' }}
        >
          <Iconify icon="eva:sync-outline" />
        </Fab>
      </Tooltip>
      <Tooltip title="強制停止">
        <Fab color="error" size="small" onClick={handleKill} disabled={isKillDisabled}>
          <Iconify icon="mingcute:skull-fill" />
        </Fab>
      </Tooltip>
    </Stack>
  );
};
