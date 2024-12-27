import 'src/global.css';

import axios from 'axios';
import humps from 'humps';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { SonnerToaster } from 'src/components/toaster/toaster';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  axios.defaults.baseURL = import.meta.env.VITE_FRONTEND_URL;
  axios.defaults.headers.post['content-type'] = 'application/x-www-form-urlencoded';
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use((req) => {
    req.data = humps.decamelizeKeys(req.data);
    return req;
  });
  axios.interceptors.response.use((res) => {
    if (res.headers['content-type'] === 'application/json') res.data = humps.camelizeKeys(res.data);
    return res;
  });

  return (
    <ThemeProvider>
      <Router />
      <SonnerToaster />
    </ThemeProvider>
  );
}
