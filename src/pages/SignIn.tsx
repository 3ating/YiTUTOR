import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import styled from 'styled-components';
import { log } from 'console';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyDrG9uBznJyP7Fe_4JRwVG7pvR7SjScQsg',
    authDomain: 'board-12c3c.firebaseapp.com',
    projectId: 'board-12c3c',
    storageBucket: 'board-12c3c.appspot.com',
    messagingSenderId: '662676665549',
    appId: '1:662676665549:web:d2d23417c365f3ec666584',
    measurementId: 'G-YY6Q81WPY9',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f2f5;
`;

const Title = styled.h2`
    font-size: 32px;
    font-weight: 600;
    color: #444;
    margin-bottom: 30px;
`;

const LoginButton = styled.button`
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 18px;
    font-weight: 500;
    padding: 12px 40px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(66, 133, 244, 0.3);
    transition: background-color 0.3s;

    &:hover {
        background-color: #2a75d9;
    }
`;

const LogoutButton = styled.button`
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 18px;
    font-weight: 500;
    padding: 12px 40px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(244, 67, 54, 0.3);
    transition: background-color 0.3s;
    margin-top: 20px;

    &:hover {
        background-color: #d32f2f;
    }
`;

const UserInfo = styled.div`
    text-align: center;
    color: #444;
`;

const SignIn = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user: React.SetStateAction<User | null>) => {
            setUser(user);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleLoginGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                setUser(result.user);

                if (result.user) {
                    const userDocRef = db.collection('users').doc();

                    await userDocRef.set({
                        displayName: result.user.displayName,
                        email: result.user.email,
                        photoURL: result.user.photoURL,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                setUser(null);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    console.log('user', user);

    return (
        <Container>
            {user ? (
                <UserInfo>
                    <p>歡迎, {user.displayName}！</p>
                    <LogoutButton onClick={handleLogout}>登出</LogoutButton>
                </UserInfo>
            ) : (
                <>
                    <Title>會員登入</Title>
                    <LoginButton onClick={handleLoginGoogle}>使用 Google 登入</LoginButton>
                </>
            )}
        </Container>
    );
};

export default SignIn;
function doc(db: firebase.firestore.Firestore, arg1: string, uid: string) {
    throw new Error('Function not implemented.');
}

function setDoc(userDocRef: void, arg1: { displayName: string | null; email: string | null; photoURL: string | null }) {
    throw new Error('Function not implemented.');
}
