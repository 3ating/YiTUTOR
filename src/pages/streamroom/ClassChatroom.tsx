import React, { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../../public/AuthContext';
import styled from 'styled-components';
import { BsFillSendFill } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';

const ChatroomContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 400px;
    /* width: 85%; */
    height: 495px;
    background-color: #f5f5f5;
    padding: 5px 15px;
    /* border-radius: 8px 8px 0 0; */
    box-shadow: 0 -1px 6px rgba(0, 0, 0, 0.1);
    z-index: 2;
    position: relative;
    border-radius: 9px;
`;

const ChatHeader = styled.p`
    font-size: 16px;
    color: #333;
    margin: 4px 0 0;
    letter-spacing: 1.5px;
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    justify-content: center;
    align-items: center;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: #e8e8e8;
    margin-top: 20px;
    padding: 3px 10px 0 5px;
    border-radius: 4px;
    margin-bottom: 5px;
`;

const ChatInput = styled.input`
    flex-grow: 1;
    padding: 8px 12px;
    background-color: #e8e8e8;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    outline: none;
    transition: background-color 0.2s;

    &:focus {
        background-color: #e8e8e8;
    }
`;

const SendButton = styled.button<{ hasInput: boolean }>`
    padding: 8px 12px;
    background-color: transparent;
    color: ${({ hasInput }) => (hasInput ? '#282525f' : 'gray')};
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 8px;
    transition: background-color 0.2s;
`;

const MessagesContainer = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    max-height: 400px;
    padding: 20px 0px 16px;
    border-radius: 4px;
    background-color: #f5f5f5;
`;

const MessageBubble = styled.div`
    margin-bottom: 6px;
    padding: 5px 15px;
    background-color: ${({ ownMessage }: { ownMessage: boolean }) => (ownMessage ? 'white' : '#e9e8e8')};
    color: ${({ ownMessage }: { ownMessage: boolean }) => (ownMessage ? '#333' : '#333')};
    border-radius: 8px;
    max-width: 70%;
    display: inline-block;
    word-wrap: break-word;
`;

const MessageSender = styled.strong`
    font-size: 13px;
    color: ${({ ownMessage }: { ownMessage: boolean }) => (ownMessage ? '#333' : '#555')};
    margin-right: 8px;
`;

const MessageRow = styled.div`
    display: flex;
    font-size: 14px;
    justify-content: ${({ ownMessage }: { ownMessage: boolean }) => (ownMessage ? 'flex-end' : 'flex-start')};
    margin-bottom: 3px;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 4px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 18px;
    color: #333;
`;

interface MessageType {
    id: string;
    name: string;
    content: string;
    timestamp: firebase.firestore.Timestamp;
}

interface ChatroomProps {
    roomId: string | null;
    toggleChat: () => void;
}

export default function ClassChatroom({ roomId, toggleChat }: ChatroomProps) {
    const { userInfo } = useAuth();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [name, setName] = useState(userInfo?.name);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!roomId) return;

        const unsubscribe = db
            .collection('rooms')
            .doc(roomId)
            .collection('messages') //rooms/{roomId}/messages
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) => {
                const messagesData: MessageType[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as MessageType[];

                setMessages(messagesData);
                scrollToBottom();
            });

        return () => {
            unsubscribe();
        };
    }, [roomId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const sendMessage = async () => {
        if (!inputValue.trim() || !name?.trim() || !roomId) return;

        await db
            .collection('rooms')
            .doc(roomId)
            .collection('messages')
            .add({
                name,
                content: inputValue,
                timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
            });

        setInputValue('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <ChatroomContainer>
            <HeaderContainer>
                <ChatHeader>課堂中的訊息</ChatHeader>
                <CloseButton onClick={toggleChat}>
                    <AiOutlineClose />
                </CloseButton>
            </HeaderContainer>

            <MessagesContainer>
                {messages.map((message) => {
                    const ownMessage = message.name === name;
                    return (
                        <MessageRow key={message.id} ownMessage={ownMessage}>
                            <MessageBubble ownMessage={ownMessage}>
                                <MessageSender ownMessage={ownMessage}>{message.name}</MessageSender>
                                {message.content}
                            </MessageBubble>
                        </MessageRow>
                    );
                })}
                <div ref={messagesEndRef}></div>
            </MessagesContainer>

            <InputContainer>
                <ChatInput
                    type='text'
                    placeholder='傳送訊息'
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <SendButton hasInput={inputValue.trim().length > 0} onClick={sendMessage}>
                    <BsFillSendFill size={18} />
                </SendButton>
            </InputContainer>
        </ChatroomContainer>
    );
}
