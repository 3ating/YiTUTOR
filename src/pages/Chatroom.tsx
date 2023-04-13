// components/ChatRoom.tsx
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import styled from 'styled-components';

const ChatContainer = styled.div`
    // 根据需要添加聊天容器样式
`;

const MessageList = styled.ul`
    // 根据需要添加消息列表样式
`;

const Message = styled.li`
    // 根据需要添加消息样式
`;

const ChatInput = styled.input`
    // 根据需要添加聊天输入样式
`;

const ChatForm = styled.form`
    // 根据需要添加聊天表单样式
`;

interface ChatRoomProps {
    teacherId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ teacherId }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');

    const user = firebase.auth().currentUser;

    useEffect(() => {
        const messagesRef = firebase.database().ref('messages').child(teacherId);
        messagesRef.on('child_added', (snapshot) => {
            const message = snapshot.val();
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            messagesRef.off();
        };
    }, [teacherId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (input.trim() === '') return;

        const newMessage = {
            text: input,
            userId: user?.uid,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
        };

        firebase.database().ref('messages').child(teacherId).push(newMessage);

        setInput('');
    };

    return (
        <ChatContainer>
            <MessageList>
                {messages.map((message, index) => (
                    <Message key={index}>
                        <span>{message.userId === user?.uid ? '我: ' : '教師: '}</span>
                        {message.text}
                    </Message>
                ))}
            </MessageList>
            <ChatForm onSubmit={handleSubmit}>
                <ChatInput type='text' value={input} onChange={handleInputChange} placeholder='輸入您的訊息' />
                <button type='submit'>發送</button>
            </ChatForm>
        </ChatContainer>
    );
};

export default ChatRoom;
