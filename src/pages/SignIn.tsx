import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Input, TextField, CircularProgress } from '@material-ui/core';
import Link from 'next/link';
import styled from 'styled-components';

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
    const { user, userInfo, isLoading, userUid, handleLoginWithEmail, handleLogout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // console.log('userInfo in sign page:', userInfo);
    console.log('use in sign page:', user);
    console.log('isLoading:', isLoading);
    // console.log('uid:', userUid);

    return (
        <Container>
            {isLoading ? (
                user ? (
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
                    <CircularProgress />
                )
            ) : (
                <>
                    <Title>會員登入</Title>
                    <TextField
                        type='email'
                        label='輸入帳號'
                        variant='outlined'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        type='password'
                        label='輸入密碼'
                        variant='outlined'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <LoginButton onClick={() => handleLoginWithEmail(email, password)}>登入</LoginButton>
                    {/* <LoginButton onClick={handleLoginGoogle}>使用 Google 登入</LoginButton> */}
                    <Link href='/SignIn'>還沒有帳號，前往註冊</Link>
                </>
            )}
        </Container>
    );
};

export default SignIn;
