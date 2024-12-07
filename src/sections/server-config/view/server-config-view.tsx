import type Server from 'src/api/server';

import { toast } from 'sonner';
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Select, Switch, InputLabel, FormControl } from '@mui/material';

import { APIError } from 'src/abc/api-error';
import ServerType from 'src/abc/server-type';

import { Iconify } from 'src/components/iconify';
import { ServerGlobalConfig } from 'src/api/config';

export function ServerConfigView() {
  const { server } = useOutletContext<{ server: Server | null }>();
  const [globalSetting, setGlobalSetting] = useState<ServerGlobalConfig | null>(null);

  const [types, setTypes] = useState<ServerType[]>([]);

  const [name, setName] = useState('');
  const [type, setType] = useState<ServerType>();

  const [useJavaPreset, setUseJavaPreset] = useState(false);

  const [javaExecutable, setJavaExecutable] = useState('');
  const [useGlobalJavaExecutable, setUseGlobalJavaExecutable] = useState(false);

  const [javaPreset, setJavaPreset] = useState('');
  const [useGlobalJavaPreset, setUseGlobalJavaPreset] = useState(false);

  const [javaOptions, setJavaOptions] = useState('');
  const [useGlobalJavaOptions, setUseGlobalJavaOptions] = useState(false);

  const [jarFilePath, setJarFilePath] = useState('');

  const [serverOptions, setServerOptions] = useState('');
  const [useGlobalServerOptions, setUseGlobalServerOptions] = useState(false);

  const [maxHeapMemory, setMaxHeapMemory] = useState(0);
  const [useGlobalMaxHeapMemory, setUseGlobalMaxHeapMemory] = useState(false);

  const [minHeapMemory, setMinHeapMemory] = useState(0);
  const [useGlobalMinHeapMemory, setUseGlobalMinHeapMemory] = useState(false);

  const [enableFreeMemoryCheck, setEnableFreeMemoryCheck] = useState(false);
  const [useGlobalEnableFreeMemoryCheck, setUseGlobalEnableFreeMemoryCheck] = useState(false);

  const [enableReporterAgent, setEnableReporterAgent] = useState(false);
  const [useGlobalEnableReporterAgent, setUseGlobalEnableReporterAgent] = useState(false);

  const [enableScreen, setEnableScreen] = useState(false);
  const [useGlobalEnableScreen, setUseGlobalEnableScreen] = useState(false);

  const [launchCommand, setLaunchCommand] = useState('');
  const [useGlobalLaunchCommand, setUseGlobalLaunchCommand] = useState(false);

  const [stopCommand, setStopCommand] = useState('');
  const [useGlobalStopCommand, setUseGlobalStopCommand] = useState(false);

  const [shutdownTimeout, setShutdownTimeout] = useState(0);
  const [useGlobalShutdownTimeout, setUseGlobalShutdownTimeout] = useState(false);

  useEffect(() => {
    if (!server) return;

    setName(server.displayName);
    setType(server.type);

    (async () => {
      try {
        const serverConfig = await server.getConfig();
        const { launchOption } = serverConfig;

        if (launchOption.javaPreset) {
          setJavaPreset(launchOption.javaPreset);
        } else {
          setUseGlobalJavaPreset(true);
        }
        if (launchOption.javaExecutable) {
          setJavaExecutable(launchOption.javaExecutable);
        } else {
          setUseGlobalJavaExecutable(true);
        }
        if (launchOption.javaOptions) {
          setJavaOptions(launchOption.javaOptions);
        } else {
          setUseGlobalJavaOptions(true);
        }
        setJarFilePath(launchOption.jarFile);

        if (launchOption.serverOptions) {
          setServerOptions(launchOption.serverOptions);
        } else {
          setUseGlobalServerOptions(true);
        }
        if (launchOption.maxHeapMemory) {
          setMaxHeapMemory(launchOption.maxHeapMemory);
        } else {
          setUseGlobalMaxHeapMemory(true);
        }
        if (launchOption.minHeapMemory !== null) {
          setMinHeapMemory(launchOption.minHeapMemory);
        } else {
          setUseGlobalMinHeapMemory(true);
        }
        if (launchOption.enableFreeMemoryCheck !== null) {
          setEnableFreeMemoryCheck(launchOption.enableFreeMemoryCheck);
        } else {
          setUseGlobalEnableFreeMemoryCheck(true);
        }
        if (launchOption.enableReporterAgent !== null) {
          setEnableReporterAgent(launchOption.enableReporterAgent);
        } else {
          setUseGlobalEnableReporterAgent(true);
        }
        if (launchOption.enableScreen !== null) {
          setEnableScreen(launchOption.enableScreen);
        } else {
          setUseGlobalEnableScreen(true);
        }
        if (launchOption.enableScreen) {
          setEnableScreen(launchOption.enableScreen);
        } else {
          setUseGlobalEnableScreen(true);
        }

        setLaunchCommand(serverConfig.launchCommand || '');
        if (!serverConfig.stopCommand) {
          setUseGlobalLaunchCommand(true);
        }

        setStopCommand(serverConfig.stopCommand || '');
        if (!serverConfig.stopCommand) {
          setUseGlobalStopCommand(true);
        }

        setShutdownTimeout(serverConfig.shutdownTimeout || 0);
        if (!serverConfig.shutdownTimeout) {
          setUseGlobalShutdownTimeout(true);
        }
      } catch (e) {
        console.log(e);
        toast.error(`サーバの取得に失敗しました: ${APIError.createToastMessage(e)}`);
      }

      setTypes(await ServerType.availableTypes());
      setGlobalSetting(await ServerGlobalConfig.get());
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
              value={useGlobalJavaPreset ? globalSetting?.javaPreset : javaPreset}
              disabled={useGlobalJavaPreset}
              onChange={(e) => setJavaPreset(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setUseGlobalJavaPreset(!useGlobalJavaPreset)}>
                      <Iconify
                        icon={useGlobalJavaPreset ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <TextField
              label="Java Excutable"
              value={useGlobalJavaExecutable ? globalSetting?.javaExecutable : javaExecutable}
              disabled={useGlobalJavaExecutable}
              onChange={(e) => setJavaExecutable(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setUseGlobalJavaExecutable(!useGlobalJavaExecutable)}
                    >
                      <Iconify
                        icon={useGlobalJavaExecutable ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            label="Java オプション"
            value={useGlobalJavaOptions ? globalSetting?.javaOptions : javaOptions}
            disabled={useGlobalJavaOptions}
            onChange={(e) => setJavaOptions(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setUseGlobalJavaOptions(!useGlobalJavaOptions)}>
                    <Iconify
                      icon={useGlobalJavaOptions ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            label="Jarファイルパス"
            value={jarFilePath}
            onChange={(e) => setJarFilePath(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            label="サーバーオプション"
            value={useGlobalServerOptions ? globalSetting?.serverOptions : serverOptions}
            disabled={useGlobalServerOptions}
            onChange={(e) => setServerOptions(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setUseGlobalServerOptions(!useGlobalServerOptions)}>
                    <Iconify
                      icon={useGlobalServerOptions ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            label="最大メモリ割り当て量"
            value={useGlobalMaxHeapMemory ? globalSetting?.maxHeapMemory : maxHeapMemory}
            disabled={useGlobalMaxHeapMemory}
            onChange={(e) => setMaxHeapMemory(Number(e.target.value))}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setUseGlobalMaxHeapMemory(!useGlobalMaxHeapMemory)}>
                    <Iconify
                      icon={useGlobalMaxHeapMemory ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            label="最小メモリ割り当て量"
            value={useGlobalMinHeapMemory ? globalSetting?.minHeapMemory : minHeapMemory}
            disabled={useGlobalMinHeapMemory}
            onChange={(e) => setMinHeapMemory(Number(e.target.value))}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setUseGlobalMinHeapMemory(!useGlobalMinHeapMemory)}>
                    <Iconify
                      icon={useGlobalMinHeapMemory ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      <Divider />
    </Stack>
  );
}
