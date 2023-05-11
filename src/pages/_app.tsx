import React from 'react';
import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { createGlobalStyle, ThemeProvider, StyleSheetManager } from 'styled-components';
import { AuthProvider } from '../context/AuthContext';
// import { TeacherProvider } from '../context/TeacherContext';
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

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <AuthProvider>
                {/* <TeacherProvider> */}
                <GlobalStyle />
                <Header />
                <title>YiTUTOR</title>
                <Component {...pageProps} />
                <Footer />
                {/* </TeacherProvider> */}
            </AuthProvider>
        </>
    );
}

export default App;
