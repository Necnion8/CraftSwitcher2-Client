import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useState, useEffect, useContext, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import Server from 'src/api/server';
import { APIError } from 'src/abc/api-error';
import { WebSocketContext } from 'src/websocket';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { emptyRows } from '../utils';
import { TableNoData } from '../table-no-data';
import { TableLoading } from '../table-loading';
import { ServerTableRow } from '../server-table-row';
import { TableEmptyRows } from '../table-empty-rows';
import { ServerTableHead } from '../server-table-head';

// ----------------------------------------------------------------------

export function ServerView() {
  const table = useTable();

  const [servers, setServers] = useState<Server[]>([]);
  const ws = useContext(WebSocketContext);

  const [isLoading, setIsLoading] = useState(true);
  const [unableToLoad, setUnableToLoad] = useState(false);

  const notFound = !servers.length;

  const reloadServers = async () => {
    try {
      setServers(await Server.all());
    } catch (e) {
      setUnableToLoad(true);
      toast.error(`サーバの取得に失敗しました: ${APIError.createToastMessage(e)}`);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    reloadServers();
  }, []);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          サーバー
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          component={Link}
          to="./create"
        >
          新規作成
        </Button>
      </Box>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ServerTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={servers.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    servers.map((s) => s.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: '名前' },
                  { id: 'type', label: '種類' },
                  { id: 'status', label: '状態' },
                  { id: 'buttons' },
                  { id: 'manage' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {servers.map((server) => (
                  <ServerTableRow
                    key={server.id}
                    server={server}
                    ws={ws}
                    selected={table.selected.includes(server.id)}
                    onSelectRow={() => table.onSelectRow(server.id)}
                    reloadServers={reloadServers}
                  />
                ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, servers.length)}
                />

                {notFound && !isLoading && <TableNoData />}
                {isLoading && <TableLoading unableToLoad={unableToLoad} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  const resetSelected = useCallback(() => {
    setSelected([]);
  }, []);

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
    resetSelected,
  };
}
