import React, { useEffect, useState } from 'react';
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    User,
} from 'firebase/auth';
import styled from 'styled-components';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Input } from '@material-ui/core';
import Link from 'next/link';
import Image from 'next/image';

interface UserInfo {
    name: string;
    email: string;
    phone: string;
    userType: string;
    courses?: object;
    avatar?: string;
}

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
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ProfileButton = styled.button`
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 18px;
    font-weight: 500;
    padding: 12px 40px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3);
    transition: background-color 0.3s;
    margin-top: 20px;

    &:hover {
        background-color: #388e3c;
    }
`;

const SignIn = () => {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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
                    const userDocRef = db.collection('users').doc(result.user.uid);

                    const docSnapshot = await userDocRef.get();
                    if (!docSnapshot.exists) {
                        await userDocRef.set({
                            name: result.user.displayName,
                            email: result.user.email,
                            photoURL: result.user.photoURL,
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleLoginWithEmail = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then(async (result: { user: React.SetStateAction<User | null> }) => {
                setUser(result.user);
            })
            .catch((error: any) => {
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

    useEffect(() => {
        const auth = getAuth();
        const unsubscribeAuth = onAuthStateChanged(auth, (user: React.SetStateAction<User | null>) => {
            setUser(user);
        });

        if (user) {
            const userDocRef = db.collection('users').doc(user.uid);
            const unsubscribeFirestore = userDocRef.onSnapshot((doc) => {
                const userData = doc.data();

                if (doc.exists && userData) {
                    setUserInfo(userData as UserInfo);
                }
            });
            return () => {
                unsubscribeFirestore();
            };
        }
        return () => {
            unsubscribeAuth();
        };
    }, [user]);

    console.log('user', user);
    console.log('userInfo', userInfo);

    return (
        <Container>
            {user ? (
                <UserInfo>
                    <p>歡迎, {userInfo?.name}！</p>
                    {userInfo?.avatar && (
                        <img
                            src={userInfo.avatar}
                            alt={`${userInfo.name} 的大頭照`}
                            style={{ width: '100px', borderRadius: '50%' }}
                        />
                    )}
                    <LogoutButton onClick={handleLogout}>登出</LogoutButton>
                    <Link href={`/profile/${user.uid}`} passHref>
                        <ProfileButton>查看個人資料</ProfileButton>
                    </Link>
                </UserInfo>
            ) : (
                <>
                    <Title>會員登入</Title>
                    <Input
                        type='email'
                        placeholder='輸入帳號'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type='password'
                        placeholder='輸入密碼'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <LoginButton onClick={handleLoginWithEmail}>使用帳號密碼登入</LoginButton>
                    <LoginButton onClick={handleLoginGoogle}>使用 Google 登入</LoginButton>
                    <Link href='/SignIn'>還沒有帳號，前往註冊</Link>
                </>
            )}
        </Container>
    );
};

export default SignIn;
function doc(db: firebase.firestore.Firestore, arg1: string, uid: string) {
    throw new Error('Function not implemented.');
}
