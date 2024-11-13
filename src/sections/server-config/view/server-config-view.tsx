import type { ServerChangeStateEvent } from 'src/websocket';

import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';

import Box from '@mui/material/Box';
import { Skeleton } from '@mui/lab';
import Tab from '@mui/material/Tab';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTheme, type Breakpoint } from '@mui/material/styles';
import { Select, Switch, InputLabel, FormControl, useMediaQuery } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import Server from 'src/api/server';
import { APIError } from 'src/abc/api-error';
import ServerType from 'src/abc/server-type';
import ServerState from 'src/abc/server-state';
import { WebSocketContext } from 'src/websocket';
import { DashboardContent } from 'src/layouts/dashboard';

import { ServerStateLabel } from 'src/components/server-state-label';
import { ServerProcessButton } from 'src/components/server-process-button';

export function ServerConfigView() {
  const theme = useTheme();
  const layoutQuery: Breakpoint = 'lg';

  const isMobileSize = useMediaQuery(theme.breakpoints.down(layoutQuery));

  const { id } = useParams<{ id: string }>();
  const [server, setServer] = useState<Server | null>(null);
  const [state, setState] = useState<ServerState>(ServerState.UNKNOWN);
  const ws = useContext(WebSocketContext);
  const [types, setTypes] = useState<ServerType[]>([]);

  const [useJavaPreset, setUseJavaPreset] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState<ServerType>();

  const [javaExecutable, setJavaExecutable] = useState<string | null>('');
  const [javaPreset, setJavaPreset] = useState<string | null>('');
  const [javaOptions, setJavaOptions] = useState<string | null>('');
  const [jarFilePath, setJarFilePath] = useState<string | null>('');
  const [serverOptions, setServerOptions] = useState<string | null>('');
  const [maxHeapMemory, setMaxHeapMemory] = useState<string | null>('');
  const [minHeapMemory, setMinHeapMemory] = useState<string | null>('');
  const [enableFreeMemoryCheck, setEnableFreeMemoryCheck] = useState(false);
  const [enableReporterAgent, setEnableReporterAgent] = useState(false);
  const [enableScreen, setEnableScreen] = useState(false);
  const [launchCommand, setLaunchCommand] = useState<string | null>('');
  const [stopCommand, setStopCommand] = useState<string | null>('');
  const [shutdownTimeout, setShutdownTimeout] = useState<string | null>('');

  useEffect(() => {
    if (!id) return undefined;

    (async () => {
      try {
        const s = await Server.get(id!);
        if (!s) {
          toast.error('サーバの取得に失敗しました');
          return;
        }

        setServer(s);
        setState(s.state);

        setName(s.displayName);
        setType(s.type);

        const serverConfig = await s.getConfig();

        setJavaPreset(serverConfig.launchOption!.javaPreset || null);
        setJavaExecutable(serverConfig.launchOption!.javaExecutable || null);
        setJavaOptions(serverConfig.launchOption!.javaOptions || null);
        setJarFilePath(serverConfig.launchOption!.javaPreset || null);
      } catch (e) {
        console.log(e);
        toast.error(`サーバの取得に失敗しました: ${APIError.createToastMessage(e)}`);
      }

      setTypes(await ServerType.availableTypes());
    })();

    const onServerChangeState = (e: ServerChangeStateEvent) => {
      if (e.serverId === id) {
        setState(e.newState);
      }
    };
    ws.addEventListener('ServerChangeState', onServerChangeState);

    return () => {
      ws.removeEventListener('ServerChangeState', onServerChangeState);
    };

    // eslint-disable-next-line
  }, []);

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" alignItems="center" pb={4}>
        <Box flexGrow={1}>
          <Link
            key="1"
            color="inherit"
            fontSize="small"
            component={RouterLink}
            href="../"
            sx={{ width: 'fit-content' }}
          >
            サーバー
          </Link>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Typography variant="h3">{server?.displayName || <Skeleton />}</Typography>
            <ServerStateLabel state={state} />
          </Stack>
        </Box>
        <Card sx={{ px: 2, py: 1, display: 'flex', gap: 1 }}>
          <ServerProcessButton server={server} state={state} />
        </Card>
      </Box>

      <Card
        sx={{
          width: '100%',
          flexGrow: 1,
          display: 'flex',
          [theme.breakpoints.down(layoutQuery)]: { flexDirection: 'column' },
        }}
      >
        <Tabs
          orientation={isMobileSize ? 'horizontal' : 'vertical'}
          value="config"
          sx={{
            pr: 0.5,
            flexShrink: 0,
            [theme.breakpoints.down(layoutQuery)]: {
              borderBottom: 1,
              borderColor: 'grey.300',
            },
            [theme.breakpoints.up(layoutQuery)]: {
              borderRight: 1,
              borderColor: 'grey.300',
            },
          }}
        >
          <Tab value="summary" label="概要" component={RouterLink} href="../" />
          <Tab value="console" label="コンソール" component={RouterLink} href="../console" />
          <Tab value="file" label="ファイル" component={RouterLink} href="../file" />
          <Tab value="config" label="設定" component={RouterLink} href="../file" />
        </Tabs>
        <Stack flexGrow={1} p={3} gap={2}>
          <Typography variant="h5">一般</Typography>
          <Divider />
          <Stack gap={2}>
            <TextField
              label="名前"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ width: 300 }}
            />
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="type-label">種類</InputLabel>
              <Select
                labelId="type-label"
                value={type?.name || ''}
                label="種類"
                onChange={(e) => {
                  setType(ServerType.get(e.target.value));
                }}
                variant="outlined"
                displayEmpty
              >
                {types.reverse().map((t) => (
                  <MenuItem key={t.name} value={t.name}>
                    {t.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Typography variant="h5">起動</Typography>
          <Divider />
          <Grid container spacing={2}>
            <Grid xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useJavaPreset}
                    onChange={(e) => setUseJavaPreset(e.target.checked)}
                  />
                }
                label="Javaプリセットを使用する"
              />
            </Grid>
            <Grid xs={12} md={6}>
              {useJavaPreset ? (
                <TextField
                  label="Java プリセット名"
                  value={javaPreset}
                  onChange={(e) => setJavaPreset(e.target.value)}
                  fullWidth
                />
              ) : (
                <TextField
                  label="Java Excutable"
                  value={javaExecutable}
                  onChange={(e) => setJavaExecutable(e.target.value)}
                  fullWidth
                />
              )}
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField label="Java オプション" fullWidth />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField label="Jarファイルパス" fullWidth />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField label="サーバーオプション" fullWidth />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField label="メモリ割り当て" fullWidth />
            </Grid>
          </Grid>
          <Divider />
        </Stack>
      </Card>
    </DashboardContent>
  );
}
