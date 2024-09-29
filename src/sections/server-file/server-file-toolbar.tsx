import type FileDirectory from 'src/api/file-directory';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme, type Breakpoint } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  directory?: FileDirectory | null;
  handleChangePath: (path: string) => void;
};

export default function ServerFileToolbar({ directory, handleChangePath }: Props) {
  const theme = useTheme();
  const layoutQuery: Breakpoint = 'lg';

  const path = directory?.path || '';
  const pathSegments = path.split('/');

  return (
    <Toolbar
      sx={{
        height: 64,
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: 'grey.200',
        p: theme.spacing(0, 1, 0, 3),
        [theme.breakpoints.down(layoutQuery)]: { flexDirection: 'column' },
      }}
    >
      <Stack direction="row">
        <Button sx={{ minWidth: 'unset' }}>
          <Iconify icon="eva:arrow-upward-outline" />
        </Button>
        <Button sx={{ minWidth: 'unset' }}>
          <Iconify icon="eva:refresh-outline" />
        </Button>
        <Breadcrumbs
          sx={{
            bgcolor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 1,
            px: 1,
            ml: 1,
          }}
        >
          {pathSegments.map((name, index) => {
            if (name === '') return <span />;
            const p = `${pathSegments.slice(0, index + 1).join('/')}`;

            return (
              <Button
                key={index}
                sx={{ minWidth: 'unset', px: 0.7, py: 0 }}
                onClick={() => {
                  console.log(p);
                  handleChangePath(p);
                }}
              >
                <Typography variant="h6">{name}</Typography>
              </Button>
            );
          })}
        </Breadcrumbs>
      </Stack>
      <Stack direction="row" gap={1}>
        <Tooltip title="コピー">
          <IconButton color="primary">
            <Iconify icon="solar:copy-bold" />
          </IconButton>
        </Tooltip>
        <Tooltip title="カット">
          <IconButton color="primary">
            <Iconify icon="solar:scissors-bold" />
          </IconButton>
        </Tooltip>
        <Tooltip title="ペースト">
          <IconButton color="primary">
            <Iconify icon="solar:clipboard-bold" />
          </IconButton>
        </Tooltip>
        <Tooltip title="削除">
          <IconButton color="primary">
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
        <OutlinedInput
          fullWidth
          value=""
          placeholder="検索"
          startAdornment={
            <InputAdornment position="start">
              <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          sx={{ maxWidth: 320, height: 42 }}
        />
      </Stack>
    </Toolbar>
  );
}
