import { toast } from 'sonner';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import Server from 'src/api/server';
import ServerType from 'src/abc/server-type';
import { APIError } from 'src/abc/api-error';
import { LaunchOption } from 'src/abc/server-config';
import { ServerGlobalConfig } from 'src/api/global-config';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

export default function ServerCreateNew({ setPage }: { setPage: (page: number) => void }) {
  const [activeStep, setActiveStep] = useState(0);

  const [version, setVersion] = useState('');
  const [type, setType] = useState<ServerType | null>(null);
  const [name, setName] = useState('');
  const [directory, setDirectory] = useState('');
  const [port, setPort] = useState(25565);
  const [maxHeapMemory, setMaxHeapMemory] = useState<number>(2024);

  // advanced options
  const [javaExecutable, setJavaExecutable] = useState('');
  const [javaOptions, setJavaOptions] = useState('');
  const [serverOptions, setServerOptions] = useState('');
  const [minHeapMemory, setMinHeapMemory] = useState<number>(2024);
  const [shutdownTimeout, setShutdownTimeout] = useState<number>(30);
  const [enableFreeMemoryCheck, setEnableFreeMemoryCheck] = useState(true);
  const [enableReporterAgent, setEnableReporterAgent] = useState(true);

  const [agreeToEula, setAgreeToEula] = useState(false);

  // jardl
  const [availableTypes, setAvailableTypes] = useState<ServerType[]>([]);
  const [availableVersions, setAvailableVersions] = useState<
    { version: string; buildCount: number | null }[]
  >([]);

  // errors
  const [nameEmptyError, setNameEmptyError] = useState(false);
  const [directoryEmptyError, setDirectoryEmptyError] = useState(false);
  const [maxHeapMemoryError, setMaxHeapMemoryError] = useState(false);
  const [minHeapMemoryError, setMinHeapMemoryError] = useState(false);

  // user changed
  const [modifiedDirectory, setModifiedDirectory] = useState(false);

  const theme = useTheme();

  useState(() => {
    (async () => {
      try {
        const res = await ServerType.availableTypes();
        setAvailableTypes(res.reverse());
      } catch (e) {
        toast.error(APIError.createToastMessage(e));
      }
    })();
  });

  const handleSetType = async (t: ServerType) => {
    setType(t);

    try {
      const res = await t.getVersions();
      setAvailableVersions(res.reverse());
    } catch (e) {
      toast.error(APIError.createToastMessage(e));
      return;
    }

    setActiveStep(1);
  };

  const handleSetVersion = async (v: string) => {
    setVersion(v);

    try {
      const res = await ServerGlobalConfig.get();
      setJavaExecutable(res.javaExecutable);
      setJavaOptions(res.javaOptions);
      setServerOptions(res.serverOptions);
      setMaxHeapMemory(res.maxHeapMemory);
      setMinHeapMemory(res.minHeapMemory);
      setEnableFreeMemoryCheck(res.enableFreeMemoryCheck);
      setEnableReporterAgent(res.enableReporterAgent);
    } catch (e) {
      toast.error(APIError.createToastMessage(e));
      return;
    }

    setActiveStep(2);
  };

  const handleCreate = async () => {
    setNameEmptyError(false);
    setDirectoryEmptyError(false);
    setMaxHeapMemoryError(false);
    setMinHeapMemoryError(false);

    if (
      !name ||
      !directory ||
      (maxHeapMemory && maxHeapMemory <= 1) ||
      (minHeapMemory && minHeapMemory <= 1)
    ) {
      setNameEmptyError(!name);
      setDirectoryEmptyError(!directory);
      setMaxHeapMemoryError(maxHeapMemory <= 1);
      setMinHeapMemoryError(minHeapMemory <= 1);
      return;
    }

    // サーバー作成
    let server: Server | false;

    try {
      const launchOption = new LaunchOption(
        null,
        javaExecutable,
        javaOptions,
        '',
        serverOptions,
        maxHeapMemory,
        minHeapMemory,
        enableFreeMemoryCheck,
        enableReporterAgent,
        false
      );

      server = await Server.create({
        name,
        directory,
        type: type!,
        launchOption,
        shutdownTimeout,
      });
      if (!server) {
        toast.error('サーバーの作成に失敗しました');
        return;
      }
    } catch (e) {
      toast.error(`サーバーの作成に失敗しました: ${APIError.createToastMessage(e)}`);
      return;
    }

    try {
      const builds = await type!.getBuilds(version);
      const latestBuild = builds[builds.length - 1];
      await server.install(type!, version, latestBuild.build);
    } catch (e) {
      toast.error(`サーバーのインストールに失敗しました: ${APIError.createToastMessage(e)}`);
    }

    try {
      await server.setEula(agreeToEula);
    } catch (e) {
      toast.error(`EULAファイル作成に失敗しました: ${APIError.createToastMessage(e)}`);
    }

    setActiveStep(3);
  };

  return (
    <>
      {activeStep === 0 ? (
        <>
          <Stack flexDirection="row" alignItems="center" gap={2} mb={2}>
            <Button
              onClick={() => setPage(0)}
              color="inherit"
              startIcon={<Iconify icon="eva:arrow-ios-back-outline" />}
            >
              戻る
            </Button>
            <Typography variant="h5">サーバーの種類を選択</Typography>
          </Stack>
          <Grid container spacing={2}>
            {availableTypes.map((t, i) => (
              <Grid xs={4} key={i}>
                <Card>
                  <Button
                    onClick={() => handleSetType(t)}
                    sx={{ display: 'flex', p: 2, gap: 1.5, justifyContent: 'left' }}
                    color="inherit"
                    fullWidth
                  >
                    <Box
                      bgcolor={theme.palette.grey[800]}
                      height={48}
                      width={48}
                      borderRadius={1}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <SvgColor src={t.imagePath} color="#fff" />
                    </Box>
                    <Box>
                      <Typography variant="h6" textAlign="left">
                        {t.displayName}
                      </Typography>
                      <Typography variant="caption" textAlign="left">
                        {t.description}
                      </Typography>
                    </Box>
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : activeStep === 1 ? (
        <>
          <Stack flexDirection="row" alignItems="center" gap={2} mb={2}>
            <Button
              onClick={() => setActiveStep(0)}
              color="inherit"
              startIcon={<Iconify icon="eva:arrow-ios-back-outline" />}
            >
              戻る
            </Button>
            <Typography variant="h5">バージョンを選択</Typography>
          </Stack>
          <Grid container spacing={2}>
            {availableVersions.map((v, i) => (
              <Grid xs={3} key={i}>
                <Card>
                  <Button
                    onClick={() => handleSetVersion(v.version)}
                    sx={{ display: 'flex', px: 2, py: 1, gap: 1.5 }}
                    color="inherit"
                    fullWidth
                  >
                    <Typography variant="h6" fontFamily={theme.typography.h1.fontFamily}>
                      {v.version}
                    </Typography>
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : activeStep === 2 ? (
        <>
          <Stack flexDirection="row" alignItems="center" gap={2} mb={2}>
            <Button
              onClick={() => setActiveStep(1)}
              color="inherit"
              startIcon={<Iconify icon="eva:arrow-ios-back-outline" />}
            >
              戻る
            </Button>
            <Typography variant="h5">詳細</Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid xs={8}>
              <TextField
                fullWidth
                label="名前"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!modifiedDirectory) {
                    setDirectory(
                      e.target.value.replaceAll(/[\\/:*?"<>|]/g, '_').replaceAll(/_+/g, '_')
                    );
                  }
                }}
                error={nameEmptyError}
                helperText={nameEmptyError ? '必須項目です' : ''}
              />
            </Grid>
            <Grid xs={4}>
              <TextField
                fullWidth
                label="メモリ割り当て量"
                value={maxHeapMemory}
                onChange={(e) => setMaxHeapMemory(Number(e.target.value))}
                type="number"
                placeholder={maxHeapMemory.toString()}
                error={maxHeapMemoryError}
                helperText={maxHeapMemoryError ? '数値は1以上でなければなりません' : ''}
                InputProps={{
                  endAdornment: <InputAdornment position="end">MB</InputAdornment>,
                  inputProps: { min: 1 },
                }}
              />
            </Grid>
            <Grid xs={8}>
              <TextField
                fullWidth
                label="ディレクトリ名"
                value={directory}
                onChange={(e) => {
                  setDirectory(e.target.value);
                  setModifiedDirectory(true);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip
                        title="サーバーファイルが保存されるディレクトリ名です"
                        placement="right"
                      >
                        <Iconify icon="eva:question-mark-circle-outline" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                error={directoryEmptyError}
                helperText={directoryEmptyError ? '必須項目です' : ''}
              />
            </Grid>
            <Grid xs={4}>
              <TextField
                fullWidth
                label="ポート"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                type="number"
                error={maxHeapMemoryError}
                helperText={maxHeapMemoryError ? '数値は1以上でなければなりません' : ''}
                InputProps={{
                  inputProps: { min: 1 },
                }}
              />
            </Grid>
          </Grid>
          <Accordion>
            <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-outline" />}>
              高度な設定
            </AccordionSummary>
            <AccordionDetails>
              <Stack gap={2}>
                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <Alert severity="warning">
                      自動で設定されるため、手動での設定は不要です。この設定は後から変更できます。
                    </Alert>
                  </Grid>

                  <Grid xs={6}>
                    <TextField
                      fullWidth
                      label="Java Excutable"
                      placeholder="java"
                      value={javaExecutable}
                      onChange={(e) => setJavaExecutable(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Javaコマンド、もしくはパス" placement="right">
                              <Iconify icon="eva:question-mark-circle-outline" />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <TextField
                      fullWidth
                      label="Java オプション"
                      value={javaOptions}
                      onChange={(e) => setJavaOptions(e.target.value)}
                      placeholder="-Dfile.encoding=UTF-8"
                    />
                  </Grid>
                  <Grid xs={6}>
                    <TextField
                      fullWidth
                      label="サーバーオプション"
                      value={serverOptions}
                      onChange={(e) => setServerOptions(e.target.value)}
                      placeholder="nogui"
                    />
                  </Grid>

                  <Grid xs={3}>
                    <TextField
                      fullWidth
                      label="メモリ最小割り当て量"
                      value={minHeapMemory}
                      onChange={(e) => setMinHeapMemory(Number(e.target.value))}
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">MB</InputAdornment>,
                        inputProps: { min: 1 },
                      }}
                      placeholder="2048"
                      error={minHeapMemoryError}
                      helperText={minHeapMemoryError ? '数値は1以上でなければなりません' : ''}
                    />
                  </Grid>
                  <Grid xs={3}>
                    <TextField
                      fullWidth
                      label="停止タイムアウト"
                      value={shutdownTimeout}
                      onChange={(e) => setShutdownTimeout(Number(e.target.value))}
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">秒</InputAdornment>,
                        inputProps: { min: 1 },
                      }}
                      placeholder="2048"
                      error={minHeapMemoryError}
                      helperText={minHeapMemoryError ? '数値は1以上でなければなりません' : ''}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={enableFreeMemoryCheck}
                          onChange={(e) => setEnableFreeMemoryCheck(e.target.checked)}
                          defaultChecked
                        />
                      }
                      label="起動時に空きメモリを確認する"
                    />
                  </Grid>
                  <Grid xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={enableReporterAgent}
                          onChange={(e) => setEnableReporterAgent(e.target.checked)}
                          defaultChecked
                        />
                      }
                      label="サーバーと連携するエージェントを使う"
                    />
                  </Grid>
                </Grid>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {type && !type.spec.isProxy && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreeToEula}
                  onChange={(e) => setAgreeToEula(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2">
                  <Link to="https://aka.ms/MinecraftEULA" target="_blank">
                    Minecraft EULA
                  </Link>{' '}
                  に同意します
                </Typography>
              }
            />
          )}

          <Button
            onClick={handleCreate}
            color="inherit"
            variant="contained"
            sx={{ width: 'fit-content' }}
          >
            作成
          </Button>
        </>
      ) : (
        <Stack alignItems="center" my={4} gap={2}>
          <Iconify
            icon="eva:checkmark-circle-2-fill"
            color={theme.palette.success.dark}
            maxWidth={120}
            maxHeight={120}
            sx={{ width: '100%', height: '100%' }}
          />
          <Typography variant="h4">サーバーを作成しました</Typography>
          <Button color="inherit" variant="contained" component={RouterLink} href="../">
            サーバーリストへ
          </Button>
        </Stack>
      )}
    </>
  );
}
