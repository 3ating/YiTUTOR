import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getFirestore, doc, getDoc, collection, updateDoc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
`;

const Avatar = styled.img`
    width: 100px;
    border-radius: 50%;
    margin-bottom: 1rem;
`;

const UserInfoRow = styled.p`
    margin-bottom: 0.5rem;
`;

const ButtonContainer = styled.div`
    margin-top: 1rem;
`;

const StyledInput = styled.input`
    display: block;
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
`;

const StyledButton = styled.button<{ primary?: boolean }>`
    background-color: ${(props) => (props.primary ? '#3f51b5' : '#f44336')};
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 18px;
    font-weight: 500;
    padding: 8px 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-right: ${(props) => (props.primary ? '1rem' : '0')};
    &:hover {
        background-color: ${(props) => (props.primary ? '#303f9f' : '#d32f2f')};
    }
`;

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
        <Container>
            <h1>{userInfo.name} 的個人資料</h1>
            {isEditing ? (
                <>
                    <label htmlFor='name'>姓名</label>
                    <StyledInput
                        type='text'
                        id='name'
                        name='name'
                        value={editedUserInfo?.name || ''}
                        onChange={handleChange}
                    />
                    <label htmlFor='email'>電子郵件</label>
                    <StyledInput
                        type='email'
                        id='email'
                        name='email'
                        value={editedUserInfo?.email || ''}
                        onChange={handleChange}
                    />
                    <label htmlFor='phone'>電話</label>
                    <StyledInput
                        type='tel'
                        id='phone'
                        name='phone'
                        value={editedUserInfo?.phone || ''}
                        onChange={handleChange}
                    />
                    <ButtonContainer>
                        <StyledButton primary onClick={handleSave}>
                            保存
                        </StyledButton>
                        <StyledButton onClick={handleCancel}>取消</StyledButton>
                    </ButtonContainer>
                </>
            ) : (
                <>
                    {userInfo.avatar && <Avatar src={userInfo.avatar} alt={`${name} 的大頭照`} />}
                    <UserInfoRow>姓名: {userInfo.name}</UserInfoRow>
                    <UserInfoRow>電子郵件: {userInfo.email}</UserInfoRow>
                    <UserInfoRow>電話: {userInfo.phone}</UserInfoRow>
                    <UserInfoRow>使用者類型: {userInfo.userType}</UserInfoRow>
                </>
            )}
            {/* <ButtonContainer>
                {!isEditing && (
                    <Button onClick={handleEdit} variant='contained' color='primary'>
                        編輯個人資料
                    </Button>
                )}
            </ButtonContainer> */}
            <ButtonContainer>
                {!isEditing && (
                    <StyledButton primary onClick={handleEdit}>
                        編輯個人資料
                    </StyledButton>
                )}
            </ButtonContainer>
        </Container>
    );
};

export default UserProfile;
