import { notification } from 'antd';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaRobot } from 'react-icons/fa';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import ChatRoom from './ChatRoom';

const ChatButtonWrapper = styled.button<{ showChatRoom: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: ${({ showChatRoom }) => (showChatRoom ? '#000' : '#f8ab13')};
    border: none;
    outline: none;
    cursor: pointer;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    font-size: 24px;
    color: white;
    z-index: 2;

    &:hover {
        background-color: ${({ showChatRoom }) => (showChatRoom ? '#333' : '#f5c300')};
    }
`;

const ChatBtn = () => {
    const { isLoading } = useAuth();
    const [showChatRoom, setShowChatRoom] = useState(false);

    const handleShowChatRoom = () => {
        if (!isLoading) {
            notification.warning({
                message: '請先登入',
                description: '登入後使用智慧助教功能',
                placement: 'topRight',
            });
        } else {
            setShowChatRoom((prevShowChatRoom) => !prevShowChatRoom);
        }
    };

    return (
        <>
            <ChatButtonWrapper showChatRoom={showChatRoom} onClick={handleShowChatRoom}>
                {showChatRoom ? <AiOutlineClose /> : <FaRobot />}
            </ChatButtonWrapper>
            {showChatRoom && <ChatRoom />}
        </>
    );
};

export default ChatBtn;
