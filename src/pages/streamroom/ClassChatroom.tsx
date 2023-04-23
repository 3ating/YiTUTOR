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
    width: 85%;
    height: 495px;
    background-color: #f5f5f5;
    padding: 5px 15px;
    border-radius: 8px 8px 0 0;
    box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
    z-index: 2;
    position: relative;
`;

const ChatHeader = styled.p`
    /* text-align: center; */
    font-size: 20px;
    /* margin-bottom: 32px; */
    color: #333;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: #e8e8e8;
    margin-top: 20px;
    padding: 3px 10px 0 5px;
    /* border: 1px solid #ccc; */
    border-radius: 4px;
    margin-bottom: 16px;
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
    color: ${({ hasInput }) => (hasInput ? '#1d7bdf' : 'gray')};
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 8px;
    transition: background-color 0.2s;

    /* &:hover {
        background-color: #0056b3;
    } */
`;

const MessagesContainer = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    max-height: 400px;
    padding: 16px;
    /* border: 1px solid #ccc; */
    border-radius: 4px;
    background-color: white;
`;

const MessageBubble = styled.div`
    margin-bottom: 16px;
    padding: 12px;
    background-color: ${({ ownMessage }: { ownMessage: boolean }) => (ownMessage ? '#007bff' : '#f1f1f1')};
    color: ${({ ownMessage }: { ownMessage: boolean }) => (ownMessage ? 'white' : '#333')};
    border-radius: 12px;
    max-width: 70%;
    display: inline-block;
    word-wrap: break-word;
`;

const MessageSender = styled.strong`
    font-size: 14px;
    color: ${({ ownMessage }: { ownMessage: boolean }) => (ownMessage ? 'white' : '#555')};
    margin-right: 8px;
`;

const MessageRow = styled.div`
    display: flex;
    justify-content: ${({ ownMessage }: { ownMessage: boolean }) => (ownMessage ? 'flex-end' : 'flex-start')};
    margin-bottom: 8px;
`;

const MessageContent = styled.span`
    font-size: 16px;
    color: #333;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
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
}

export default function ClassChatroom({ roomId }: ChatroomProps) {
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

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const sendMessage = async () => {
        if (!inputValue.trim() || !name?.trim() || !roomId) return;

        await db
            .collection('rooms')
            .doc(roomId)
            .collection('messages')
            .add({
                // 存到 rooms/{roomId}/messages
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

    const handleClose = () => {
        // 在這裡執行關閉操作
    };

    return (
        <ChatroomContainer>
            <ChatHeader>通話中的訊息</ChatHeader>
            <CloseButton onClick={handleClose}>
                <AiOutlineClose />
            </CloseButton>

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
                {/* <NameInput type='text' placeholder='Your name' value={name} onChange={handleNameChange} /> */}
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
