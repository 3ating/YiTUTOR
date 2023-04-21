import React from 'react';
import styled from 'styled-components';
import { FaFacebookSquare, FaGithub, FaLinkedin } from 'react-icons/fa';

const FooterWrapper = styled.footer`
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
    font-size: 32px;
    line-height: 42px;
    letter-spacing: 0.05em;
`;

const FooterText = styled.p`
    /* font-weight: 700; */
    font-size: 13px;
    line-height: 21px;
`;

const SocialLinks = styled.div`
    display: flex;
    align-items: center;
    line-height: 21px;
    letter-spacing: 0.05em;
`;

const SocialLink = styled.a`
    color: #333;
    font-size: 2rem;
    margin-left: 16px;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: #333;
    }
`;

const Footer: React.FC = () => {
    return (
        <FooterWrapper>
            <Logo>YiTUTOR</Logo>
            <FooterText>© 2023 YiTUTOR All rights reserved.</FooterText>
            <SocialLinks>
                <SocialLink href='https://www.facebook.com/'>
                    <FaFacebookSquare />
                </SocialLink>
                <SocialLink href='https://github.com/'>
                    <FaGithub />
                </SocialLink>
                <SocialLink href='https://www.linkedin.com/'>
                    <FaLinkedin />
                </SocialLink>
            </SocialLinks>
        </FooterWrapper>
    );
};

export default Footer;
