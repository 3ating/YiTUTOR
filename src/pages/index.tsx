import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import Header from '@/components/Header/Header';
import Main from '@/components/Main/Main';
import Footer from '@/components/Footer/Footer';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
`;

const Button = styled.button`
    background-color: #0070f3;
    color: white;
    font-size: 1.2rem;
    padding: 0.8rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0051a2;
    }
`;

const DirectLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

export default function Home() {
    return (
        <>
            <Header />
            {/* <Container>
                <Title>YiTUTOR</Title>
                <ButtonContainer>
                    <DirectLink href='/teacher/Teachers'>
                        <Button>尋找老師</Button>
                    </DirectLink>
                    <DirectLink href='/gpt/AISols'>
                        <Button>智慧解題</Button>
                    </DirectLink>
                    <DirectLink href='/streamroom/VideoChat'>
                        <Button>線上上課</Button>
                    </DirectLink>
                    <DirectLink href='/membership/SignIn'>
                        <Button>個人資訊/登入</Button>
                    </DirectLink>
                    <DirectLink href='/membership/SignUp'>
                        <Button>註冊帳號</Button>
                    </DirectLink>
                </ButtonContainer>
            </Container> */}
            <Main />
            <Footer />
        </>
    );
}
