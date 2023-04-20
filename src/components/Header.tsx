// src/components/Header.tsx

import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #e4d477;
    height: 45px;
    padding: 0 40px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
    font-size: 1.5rem;
    color: white;
    margin: 0;
    cursor: pointer;
`;

const NavLinks = styled.nav`
    display: flex;
    align-items: center;
`;

const NavLink = styled.a`
    color: white;
    text-decoration: none;
    font-size: 1.1rem;
    font-weight: 500;
    margin-right: 24px;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: #333;
    }
`;

const Header: React.FC = () => {
    return (
        <HeaderWrapper>
            <Logo>YiTUTOR</Logo>
            <NavLinks>
                <NavLink>尋找老師</NavLink>
                <NavLink>智慧解題</NavLink>
                <NavLink>線上教室</NavLink>
                <NavLink>登入</NavLink>
                <NavLink>註冊</NavLink>
            </NavLinks>
        </HeaderWrapper>
    );
};

export default Header;
