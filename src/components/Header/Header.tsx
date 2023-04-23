import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffd335;
    height: 65px;
    padding: 0 40px;
`;

const Logo = styled.h1`
    font-style: normal;
    font-weight: 700;
    font-size: 40px;
    line-height: 47px;
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
    color: #000000;
`;

const SignInBtn = styled(Link)`
    width: 114px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border-radius: 9px;

    /* line-height: 19px; */
    /* letter-spacing: 0.42em; */
    text-align: center;
    color: #f5f5f5;
    background: #000000;
    opacity: 0.7;
    text-decoration: none;

    /* &:hover {
        color: #f5f5f5;
        background: #000000;
    } */
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

    /* &:hover {
        color: #f5f5f5;
        background: #000000;
    } */
`;

const LogoLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

const Header: React.FC = () => {
    return (
        <HeaderWrapper>
            <LogoLink href={'/'}>
                <Logo>YiTUTOR</Logo>
            </LogoLink>
            <NavContainer>
                <MenuContainer>
                    <Menu href='/teacher/Teachers'>尋找老師</Menu>
                    <Menu href='/gpt/AISols'>智慧解題</Menu>
                    <Menu href='/streamroom/VideoChat'>線上教室</Menu>
                </MenuContainer>
                <SignBtnContainer>
                    <SignUpBtn href='/membership/SignUp'>註 冊</SignUpBtn>
                    <SignInBtn href='/membership/SignIn'>登 入</SignInBtn>
                </SignBtnContainer>
            </NavContainer>
        </HeaderWrapper>
    );
};

export default Header;
