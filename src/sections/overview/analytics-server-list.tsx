import type Server from 'src/api/server';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';

import { ServerStateLabel } from 'src/components/server-state-label';

export function AnalyticsServerList({ servers, ...other }: { servers: Server[] }) {
  return (
    <Card {...other}>
      <CardHeader title="サーバーリスト" />
      <Table sx={{ my: 6, mx: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell>名前</TableCell>
            <TableCell>ステータス</TableCell>
            <TableCell>他に各項目あるかしら</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {servers.map((server) => (
            <TableRow key={server.id}>
              <TableCell>{server.name}</TableCell>
              <TableCell>
                <ServerStateLabel state={server.state} />
              </TableCell>
              <TableCell />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
