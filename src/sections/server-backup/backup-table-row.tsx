import type Backup from 'src/api/backup';

import React from 'react';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type UserTableRowProps = {
  backup: Backup;
  selected: boolean;
  onSelectRow: () => void;
};

export function BackupTableRow({ backup, selected, onSelectRow }: UserTableRowProps) {
  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
      </TableCell>

      <TableCell component="th" scope="row">
        <Box gap={2} display="flex" alignItems="center">
          <Typography variant="subtitle1">{backup.id}</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {backup.path}
        </Typography>
      </TableCell>

      <TableCell>{fDateTime(backup.createdAt)}</TableCell>
      <TableCell>{backup.type.value}</TableCell>
      <TableCell>{backup.comments || '-'}</TableCell>
      <TableCell align="right">
        <IconButton>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
