import React from 'react';
import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { createGlobalStyle, ThemeProvider, StyleSheetManager } from 'styled-components';
import { AuthProvider } from '../context/AuthContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const GlobalStyle = createGlobalStyle`
    body {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        position: relative;
        /* height: 100vh;
        background: antiquewhite; */
    }
`;

// const theme = {
//     colors: {
//         primary: '#0070f3',
//     },
// };

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <AuthProvider>
                <GlobalStyle />
                <Header />
                <title>YiTUTOR</title>
                {/* <StyleSheetManager disableVendorPrefixes> */}
                {/* <ThemeProvider theme={theme}> */}
                <Component {...pageProps} />
                {/* </ThemeProvider> */}
                {/* </StyleSheetManager> */}
                <Footer />
            </AuthProvider>
        </>
    );
}

export default App;
