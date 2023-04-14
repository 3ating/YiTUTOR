import styled from 'styled-components';

const IconWrapper = styled.div`
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 50px;
    height: 50px;
    background-color: #007bff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-size: 24px;
    cursor: pointer;
    z-index: 1000;
`;

interface ChatIconProps {
    onClick: () => void;
}

const ChatIcon: React.FC<ChatIconProps> = ({ onClick }) => {
    return (
        <IconWrapper onClick={onClick}>
            <span role='img' aria-label='Chat Icon'>
                💬
            </span>
        </IconWrapper>
    );
};

export default ChatIcon;
