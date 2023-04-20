// src/components/Footer.tsx

import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #e4d477;
    height: 45px;
    padding: 0 40px;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
`;

const FooterText = styled.p`
    color: white;
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
`;

const SocialLinks = styled.div`
    display: flex;
    align-items: center;
`;

const SocialLink = styled.a`
    color: white;
    font-size: 1.5rem;
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
            <FooterText>YiTUTOR - 線上家教媒合平台 © 2023</FooterText>
            <SocialLinks>
                <SocialLink href='https://www.facebook.com' target='_blank' rel='noopener noreferrer'>
                    <i className='fab fa-facebook-f'></i>
                </SocialLink>
                <SocialLink href='https://www.twitter.com' target='_blank' rel='noopener noreferrer'>
                    <i className='fab fa-twitter'></i>
                </SocialLink>
                <SocialLink href='https://www.linkedin.com' target='_blank' rel='noopener noreferrer'>
                    <i className='fab fa-linkedin-in'></i>
                </SocialLink>
            </SocialLinks>
        </FooterWrapper>
    );
};

export default Footer;
