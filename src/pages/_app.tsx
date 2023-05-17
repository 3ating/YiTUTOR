import React from 'react';
import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import { TeachersProvider } from '../context/TeacherContext';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <AuthProvider>
                <TeachersProvider>
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
