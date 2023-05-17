import Link from 'next/link';
import styled from 'styled-components';

const CenteredContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const UnLoginText = styled.p`
    font-size: 24px;
    letter-spacing: 2px;
    margin: 0 0 5px;
`;

const DirectLink = styled(Link)`
    font-size: 24px;
    letter-spacing: 2px;
    text-decoration: none;
    color: black;
`;

const LoginPrompt = () => {
    return (
        <CenteredContainer>
            <UnLoginText>請先登入再使用此功能</UnLoginText>
            <DirectLink href='/auth/login'>點我登入</DirectLink>
        </CenteredContainer>
    );
};

export default LoginPrompt;
