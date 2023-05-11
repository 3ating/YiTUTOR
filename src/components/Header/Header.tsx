import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import logo from './images/yitutor_logo.png';
import Image from 'next/image';

const HeaderWrapper = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffd335;
    height: 65px;
    padding: 0 40px;
    box-sizing: border-box;
    z-index: 2;
    position: fixed;
    top: 0;
    width: 100%;
`;

const Logo = styled.h1`
    font-style: normal;
    font-weight: 700;
    font-size: 40px;
    line-height: 47px;
    margin: 0;
`;

const NavContainer = styled.div`
    display: flex;
    width: -webkit-fill-available;
    justify-content: flex-end;
    align-items: center;
`;

const SignBtnContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 18px;
    margin-left: 40px;
`;

const MenuContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 30px;
`;

const Menu = styled(Link)`
    font-weight: 400;
    font-size: 18px;
    line-height: 23px;
    letter-spacing: 0.15em;
    text-align: center;
    text-decoration: none;
    color: #383333;
    transition: color 0.3s ease;

    &:hover {
        color: #000000;
    }
`;

const SignInBtn = styled(Link)`
    width: 114px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border-radius: 9px;
    text-align: center;
    color: #f5f5f5;
    background: #000000;
    text-decoration: none;
`;

const SignUpBtn = styled(Link)`
    width: 114px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border-radius: 9px;
    text-align: center;
    color: #000000;
    background: #f5f5f5;
    opacity: 0.7;
    text-decoration: none;
`;

const UserAvatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid gray;
`;

const LogoLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

const AvatarLink = styled(Link)`
    text-decoration: none;
    color: #000;
`;

const Header: React.FC = () => {
    const { userInfo, isLoading } = useAuth();
    return (
        <HeaderWrapper>
            <LogoLink href={'/'}>
                <Image src={logo} alt='YiTUTOR Logo' />
            </LogoLink>
            <NavContainer>
                <MenuContainer>
                    <Menu href='/teachers/allteachers'>尋找老師</Menu>
                    <Menu href='/streamroom/onlineclassroom'>線上教室</Menu>
                </MenuContainer>
                <SignBtnContainer>
                    {isLoading ? (
                        <AvatarLink href={`/membership/signin`} passHref>
                            <UserAvatar src={userInfo?.avatar} alt='User Avatar' />
                        </AvatarLink>
                    ) : (
                        <>
                            <SignUpBtn href='/membership/signup'>註 冊</SignUpBtn>
                            <SignInBtn href='/membership/signin'>登 入</SignInBtn>
                        </>
                    )}
                </SignBtnContainer>
            </NavContainer>
        </HeaderWrapper>
    );
};

export default Header;
