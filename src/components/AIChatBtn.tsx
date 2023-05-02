import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { FaRobot } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { useAuth } from '../../public/AuthContext';
import AIChatRoom from './AIChatRoom';
import { Modal, Button, message, Alert } from 'antd';

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

const AIChatBtn = () => {
    const router = useRouter();
    const [showChatRoom, setShowChatRoom] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const { isLoading } = useAuth();

    const handleShowChatRoom = () => {
        if (!isLoading) {
            setShowAlert(true);
        } else {
            setShowChatRoom((prevShowChatRoom) => !prevShowChatRoom);
        }
    };

    return (
        <>
            <ChatButtonWrapper showChatRoom={showChatRoom} onClick={handleShowChatRoom}>
                {showChatRoom ? <AiOutlineClose /> : <FaRobot />}
            </ChatButtonWrapper>
            {showChatRoom && <AIChatRoom />}
            {showAlert && (
                <Alert
                    message='請先登入'
                    type='warning'
                    closable
                    onClose={() => setShowAlert(false)}
                    style={{ position: 'fixed', bottom: 100, right: 20, zIndex: 3 }}
                />
            )}
        </>
    );
};

export default AIChatBtn;
