import React, { useState } from 'react';
import { useAuth } from '../../../public/AuthContext';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Button from '../../components/Button';
import SignInImg from './signin.png';
import Image from 'next/image';
import { ToastContainer } from 'react-toastify';

const LoginContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    justify-content: center;
    gap: 50px;
    /* justify-content: space-between; */
    height: calc(100vh - 130px);
    background-color: antiquewhite;
    /* padding: 0 10%; */
`;

const SignInImage = styled(Image)`
    width: 450px;
    height: auto;
`;

const LoginFormWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background-color: white;
    padding: 100px 35px 90px;
    border-radius: 9px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 400px;
    max-width: 90%;
    height: 300px;
`;

const Title = styled.h2`
    font-size: 32px;
    font-weight: 600;
    color: #444;
    margin-bottom: 30px;
    text-align: center;
`;

const InputField = styled.input`
    border: 1px solid #ccc;
    font-size: 16px;
    padding: 8px 12px;
    margin: 5px 0;
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    border-radius: 9px;
`;

const LoginButton = styled(Button)`
    margin: 20px 0 20px;
    width: 100%;
    border-radius: 9px;
    letter-spacing: 2px;
    &:hover {
        background-color: #333333;
        color: #ffffff;
    }
`;

const LogoutButton = styled(Button)`
    margin: 35px 0 0;
    width: 100%;
    border-radius: 9px;
    letter-spacing: 2px;
    background-color: #ffab34;
    /* color: black; */
    &:hover {
        background-color: #f9b352;
        /* color: #ffffff; */
    }
`;

const ProfileButton = styled(Button)`
    margin: 10px 0;
    width: 100%;
    border-radius: 9px;
    letter-spacing: 2px;
    &:hover {
        background-color: #333333;
        color: #ffffff;
    }
`;

const UserInfo = styled.div`
    text-align: center;
    color: #444;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
`;

const UserContent = styled.p`
    margin: 0;
    font-size: 21px;
    letter-spacing: 1px;
    color: #333;
`;

const Avatar = styled.img`
    width: 130px;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    border: 2px solid gray;
    aspect-ratio: 1/1;
`;

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const LoadingSpinner = styled.div`
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #4285f4;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: ${spin} 1s linear infinite;
`;

const DirectLink = styled(Link)`
    text-decoration: none;
    color: gray;
    width: 100%;
    display: inline-block;
    text-align: center;
    &:hover {
        color: #333333;
    }
`;

const SignIn = () => {
    const { user, userInfo, isLoading, userUid, handleLoginWithEmail, handleLogout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleFormSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        handleLoginWithEmail(email, password);
    };

    // console.log('userInfo in sign page:', userInfo);
    console.log('use in sign page:', user);
    console.log('isLoading:', isLoading);
    // console.log('uid:', userUid);

    return (
        <>
            <Header />
            <LoginContainer>
                <ToastContainer />
                {isLoading ? (
                    user ? (
                        <>
                            <LoginFormWrapper>
                                <UserInfo>
                                    {userInfo?.avatar && (
                                        <Avatar src={userInfo.avatar} alt={`${userInfo.name} 的大頭照`} />
                                    )}
                                    <UserContent>{userInfo?.name}</UserContent>
                                    <UserContent>{userInfo?.email}</UserContent>

                                    <LogoutButton onClick={handleLogout}>登出</LogoutButton>
                                    <DirectLink href={`/profile/${user.uid}`} passHref>
                                        <ProfileButton>查看個人資料</ProfileButton>
                                    </DirectLink>
                                </UserInfo>
                            </LoginFormWrapper>
                            <SignInImage src={SignInImg} alt='Sign In' />
                        </>
                    ) : (
                        <LoadingSpinner />
                    )
                ) : (
                    <>
                        <LoginFormWrapper>
                            <form onSubmit={handleFormSubmit}>
                                <Title>會員登入</Title>
                                <InputField
                                    type='email'
                                    placeholder='輸入信箱'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <InputField
                                    type='password'
                                    placeholder='輸入密碼'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <LoginButton type='submit'>登入</LoginButton>
                            </form>
                            <DirectLink href='SignUp'>還沒有帳號，前往註冊</DirectLink>
                        </LoginFormWrapper>
                        <SignInImage src={SignInImg} alt='Sign In' />
                    </>
                )}
            </LoginContainer>
            <Footer />
        </>
    );
};

export default SignIn;
