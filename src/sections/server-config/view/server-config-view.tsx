import type Server from 'src/api/server';

import { toast } from 'sonner';
import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Select, Switch, InputLabel, FormControl } from '@mui/material';

import { APIError } from 'src/abc/api-error';
import ServerType from 'src/abc/server-type';

export function ServerConfigView() {
  const { server } = useOutletContext<{ server: Server | null }>();
  const [types, setTypes] = useState<ServerType[]>([]);

  const [name, setName] = useState('');
  const [type, setType] = useState<ServerType>();

  const [useJavaPreset, setUseJavaPreset] = useState(false);

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
    setName(server?.displayName || '');
    setType(server?.type);

    (async () => {
      try {
        const serverConfig = await server?.getConfig();

        setJavaPreset(serverConfig?.launchOption!.javaPreset || null);
        setJavaExecutable(serverConfig?.launchOption!.javaExecutable || null);
        setJavaOptions(serverConfig?.launchOption!.javaOptions || null);
        setJarFilePath(serverConfig?.launchOption!.javaPreset || null);
      } catch (e) {
        console.log(e);
        toast.error(`サーバの取得に失敗しました: ${APIError.createToastMessage(e)}`);
      }

      setTypes(await ServerType.availableTypes());
    })();
  }, [server]);

  return (
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
  );
}
