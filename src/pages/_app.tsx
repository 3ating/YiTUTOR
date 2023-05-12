import React from 'react';
import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import { AuthProvider } from '../context/AuthContext';
import { TeachersProvider } from '../context/TeacherContext';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

const GlobalStyle = createGlobalStyle`
    body {
        /* display: flex;
        flex-direction: column;
        min-height: 100vh;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        position: relative; */
    }
`;

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <AuthProvider>
                <TeachersProvider>
                    <GlobalStyle />
                    <Header />
                    <title>YiTUTOR</title>
                    <Component {...pageProps} />
                    <Footer />
                </TeachersProvider>
            </AuthProvider>
        </>
    );
}

export default App;
