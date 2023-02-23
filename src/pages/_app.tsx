import type { AppType } from 'next/app';
import { trpc } from '@/utils/trpc';

import {ThemeProvider, createTheme} from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import "../styles/globals.css";
import darkScrollbar from '@mui/material/darkScrollbar';
import Navbar from "@/components/Navbar";
import {UserProvider} from "@/context/UserState";

const MyApp: AppType = ({ Component, pageProps }) => {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: (themeParam) => ({
          body: themeParam.palette.mode === 'dark' ? darkScrollbar() : null,
        }),
      },
    },
  });

  return (
    <UserProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline enableColorScheme={true} />
        <Navbar />
        <Component {...pageProps} />
      </ThemeProvider>
    </UserProvider>
  )
};

export default trpc.withTRPC(MyApp);