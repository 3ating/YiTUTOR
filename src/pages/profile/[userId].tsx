import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getFirestore, doc, getDoc, collection, updateDoc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Button, TextField } from '@material-ui/core';

interface UserInfo {
    name: string;
    email: string;
    phone?: string;
    userType?: string;
    courses?: object;
    avatar?: string;
}

const firebaseConfig = {
    apiKey: process.env.FIRESTORE_API_KEY,
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

const UserProfile = () => {
    const router = useRouter();
    const { userId } = router.query;
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUserInfo, setEditedUserInfo] = useState<UserInfo | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (editedUserInfo) {
            setEditedUserInfo({ ...editedUserInfo, [name]: value });
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditedUserInfo(userInfo);
    };

    const handleSave = async () => {
        if (userId && editedUserInfo) {
            const usersCollectionRef = collection(
                db,
                'users'
            ) as unknown as firebase.firestore.CollectionReference<UserInfo>;
            const userDocRef = doc(usersCollectionRef, userId as string);
            await updateDoc(userDocRef, editedUserInfo);
            setUserInfo(editedUserInfo);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedUserInfo(null);
    };

    useEffect(() => {
        if (userId) {
            const fetchUserData = async () => {
                const userDocRef = doc(db, 'users', userId as string);
                const docSnapshot = await getDoc(userDocRef);

                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data() as UserInfo;
                    setUserInfo(userData);
                }
            };

            fetchUserData();
        }
    }, [userId]);

    console.log(userId);

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{userInfo.name} 的個人資料</h1>
            {isEditing ? (
                <>
                    <TextField label='姓名' name='name' value={editedUserInfo?.name || ''} onChange={handleChange} />
                    <TextField
                        label='電子郵件'
                        name='email'
                        value={editedUserInfo?.email || ''}
                        onChange={handleChange}
                    />
                    <TextField label='電話' name='phone' value={editedUserInfo?.phone || ''} onChange={handleChange} />
                    {/* <TextField
                        label='使用者類型'
                        name='userType'
                        value={editedUserInfo?.userType || ''}
                        onChange={handleChange}
                    /> */}
                    <Button onClick={handleSave} variant='contained' color='primary'>
                        保存
                    </Button>
                    <Button onClick={handleCancel} variant='contained' color='secondary'>
                        取消
                    </Button>
                </>
            ) : (
                <>
                    {userInfo && (
                        <img
                            src={userInfo.avatar}
                            alt={`${name} 的大頭照`}
                            style={{ width: '100px', borderRadius: '50%' }}
                        />
                    )}
                    <p>姓名: {userInfo.name}</p>
                    <p>電子郵件: {userInfo.email}</p>
                    <p>電話: {userInfo.phone}</p>
                    <p>使用者類型: {userInfo.userType}</p>
                </>
            )}
            <div>
                {!isEditing && (
                    <Button onClick={handleEdit} variant='contained' color='primary'>
                        編輯個人資料
                    </Button>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
