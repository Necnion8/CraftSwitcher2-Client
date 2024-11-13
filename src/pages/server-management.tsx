import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ServerManagementView } from '../sections/server-management/server-management-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Server - ${CONFIG.appName}`}</title>
      </Helmet>

      <ServerManagementView />
    </>
  );
}
