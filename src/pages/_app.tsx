// import '@/styles/globals.css';
// import type { AppProps } from 'next/app';

// export default function App({ Component, pageProps }: AppProps) {
//     return <Component {...pageProps} />;
// }
import React from 'react';
import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { createGlobalStyle, ThemeProvider, StyleSheetManager } from 'styled-components';
import { AuthProvider } from '../../public/AuthContext';

const GlobalStyle = createGlobalStyle`
    body {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        /* height: 100vh;
        background: antiquewhite; */
    }
`;

const theme = {
    colors: {
        primary: '#0070f3',
    },
};

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <AuthProvider>
                <GlobalStyle />
                {/* <StyleSheetManager disableVendorPrefixes> */}
                {/* <ThemeProvider theme={theme}> */}
                <Component {...pageProps} />
                {/* </ThemeProvider> */}
                {/* </StyleSheetManager> */}
            </AuthProvider>
        </>
    );
}

export default App;
