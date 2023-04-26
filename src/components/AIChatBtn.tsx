import React, { useState } from 'react';
import styled from 'styled-components';
import { FaRobot } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import AIChatRoom from './AIChatRoom';

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
    const [showChatRoom, setShowChatRoom] = useState(false);

    const handleShowChatRoom = () => {
        setShowChatRoom((prevShowChatRoom) => !prevShowChatRoom);
    };

    return (
        <>
            <ChatButtonWrapper showChatRoom={showChatRoom} onClick={handleShowChatRoom}>
                {showChatRoom ? <AiOutlineClose /> : <FaRobot />}
            </ChatButtonWrapper>
            {showChatRoom && <AIChatRoom />}
        </>
    );
};

export default AIChatBtn;
