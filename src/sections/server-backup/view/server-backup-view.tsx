import type Server from 'src/api/server';
import type Backup from 'src/api/backup';

import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { Scrollbar } from 'src/components/scrollbar';

import { useTable } from '../utils';
import { BackupTableRow } from '../backup-table-row';
import { BackupTableHead } from '../backup-table-head';
import { TableLoading } from '../../server/table-loading';

export function ServerBackupView() {
  const { server } = useOutletContext<{ server: Server | null }>();

  const table = useTable();
  const [backups, setBackups] = React.useState<Backup[]>([]);

  const [isLoading, setIsLoading] = React.useState(true);
  const [unableToLoad, setUnableToLoad] = React.useState(false);

  useEffect(() => {
    if (!server) return;

    (async () => {
      try {
        const b = await server.getBackups();
        setBackups(b);
        setIsLoading(false);
      } catch (e) {
        console.error(e);
        setUnableToLoad(true);
      }
    })();
  }, [server]);

  return (
    <Scrollbar>
      <TableContainer sx={{ overflow: 'unset' }}>
        <Table sx={{ minWidth: 800 }}>
          <BackupTableHead
            order={table.order}
            orderBy={table.orderBy}
            rowCount={backups.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
            onSelectAllRows={(checked) => table.onSelectAllRows(checked, backups)}
          />
          <TableBody>
            {backups.map((b) => (
              <BackupTableRow
                key={b.id}
                backup={b}
                selected={table.selected.includes(b)}
                onSelectRow={() => table.onSelectRow(b)}
              />
            ))}
            {isLoading && <TableLoading unableToLoad={unableToLoad} />}
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>
  );
}
