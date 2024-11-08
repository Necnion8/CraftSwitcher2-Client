import type Server from 'src/api/server';
import type ServerState from 'src/abc/server-state';
import type { WebSocketClient, ServerProcessReadEvent } from 'src/websocket';

import { toast } from 'sonner';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebglAddon } from '@xterm/addon-webgl';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material';
import Typography from '@mui/material/Typography';

import { APIError } from 'src/abc/api-error';

export default function ServerConsole({
  server,
  state,
  ws,
}: {
  server: Server;
  state: ServerState;
  ws: WebSocketClient;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [term] = useState<Terminal>(new Terminal());
  const [fitAddon] = useState(new FitAddon());
  const [webglAddon] = useState(new WebglAddon());

  const handleSendLine = useCallback(
    (data: string) => {
      if (!state.isRunning) return;
      ws.sendLine(server.id, data);
    },
    [server, ws, state]
  );

  useEffect(() => {
    term.loadAddon(fitAddon);
    term.loadAddon(webglAddon);
    term.onData(handleSendLine);

    term.open(ref.current!);
    fitAddon.fit();

    (async () => {
      try {
        const lines = await server.getLogsLatest(true);
        while (lines.length > 1) {
          term.writeln(lines.shift()!);
          term.write(lines.shift()!);
        }
      } catch (e) {
        toast.error(APIError.createToastMessage(e));
      }
    })();

    const observer = new ResizeObserver((entries) => {
      entries.forEach(() => {
        fitAddon.fit();
      });
    });

    observer.observe(ref.current!);

    const serverProcessReadEvent = (event: ServerProcessReadEvent) => {
      if (event.serverId === server.id) {
        term!.write(event.data);
      }
    };
    ws.addEventListener('ServerProcessRead', serverProcessReadEvent);

    return () => {
      observer.disconnect();
      ws.removeEventListener('ServerProcessRead', serverProcessReadEvent);
    };
  }, [fitAddon, handleSendLine, server, term, webglAddon, ws]);

  return (
    <Box sx={{ position: 'relative', flexGrow: 1 }}>
      <div ref={ref} style={{ width: '100%', height: '100%' }} />
      {!state.isRunning && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: (theme) => alpha(theme.palette.common.black, 0.8),
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5">このサーバーはオフラインです</Typography>
        </Box>
      )}
    </Box>
  );
}
