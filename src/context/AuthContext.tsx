import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useRouter } from 'next/router';
import { Result, Modal, message } from 'antd';
import { db } from '@/utils/firebase';
import { UserInfo } from '../types/UserInfo';

interface AuthContextValue {
    user: User | null;
    userInfo: UserInfo | null;
    isLoading: boolean;
    userUid: string | null;
    handleLoginWithEmail: (email: string, password: string) => Promise<void>;
    handleLogout: () => Promise<void>;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    userInfo: null,
    isLoading: false,
    userUid: null,
    handleLoginWithEmail: async () => {},
    handleLogout: async () => {},
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userUid, setUserUid] = useState<string | null>(null);
    const [showLoginSuccess, setShowLoginSuccess] = useState(false);
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribeAuth = onAuthStateChanged(auth, (user: React.SetStateAction<User | null>) => {
            setUser(user);
        });

        if (user) {
            const userDocRef = db.collection('users').doc(user.uid);
            const unsubscribeFirestore = userDocRef.onSnapshot((doc) => {
                const userData = doc.data();
                setIsLoading(true);
                if (doc.exists && userData) {
                    setUserInfo(userData as UserInfo);
                    setUserUid(user.uid);
                }
            });
            setIsLoading(false);
            return () => {
                unsubscribeFirestore();
            };
        }

        return () => {
            unsubscribeAuth();
        };
    }, [user]);

    const handleLoginWithEmail = async (email: string, password: string) => {
        const auth = getAuth();
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            setUser(result.user);
            setIsLoading(true);
            setShowLoginSuccess(true);
            setTimeout(() => {
                setShowLoginSuccess(false);
                router.push('/');
            }, 2000);
        } catch (error) {
            message.error('帳號或密碼錯誤');
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            setUser(null);
            setIsLoading(false);
            setShowLogoutSuccess(true);
            setTimeout(() => {
                setShowLogoutSuccess(false);
            }, 2000);
        } catch (error) {
            console.log(error);
        }
    };

    const value = {
        user,
        userInfo,
        isLoading,
        userUid,
        handleLoginWithEmail,
        handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            <Modal
                open={showLoginSuccess}
                footer={null}
                closable={false}
                centered
                onCancel={() => setShowLoginSuccess(false)}
            >
                <Result status='success' title='登入成功' />
            </Modal>
            <Modal
                open={showLogoutSuccess}
                footer={null}
                closable={false}
                centered
                onCancel={() => setShowLogoutSuccess(false)}
            >
                <Result status='success' title='登出成功' />
            </Modal>
        </AuthContext.Provider>
    );
};
