// components/ChatRoom.tsx
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import styled from 'styled-components';
import { useAuth } from '../../../public/AuthContext';

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    max-height: 600px;
    width: 100%;
    max-width: 800px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f0f2f5;
    padding: 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const MessageList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
    height: calc(100% - 60px);
    overflow-y: auto;
`;

const Message = styled.li`
    margin-bottom: 12px;
    font-size: 16px;
    color: #444;
    word-wrap: break-word;

    span {
        font-weight: bold;
    }
`;

const ChatInput = styled.input`
    flex-grow: 1;
    outline: none;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 16px;
    margin-right: 10px;
`;

const ChatForm = styled.form`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;

    button {
        background-color: #4285f4;
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 500;
        padding: 10px 20px;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(66, 133, 244, 0.3);
        transition: background-color 0.3s;

        &:hover {
            background-color: #2a75d9;
        }
    }
`;

interface ChatRoomProps {
    selectedUserId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ selectedUserId }: ChatRoomProps) => {
    const firestore = firebase.firestore();

    const { userUid } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');

    console.log('teacherId in chatroom:', selectedUserId);
    console.log('userId in chatroom:', userUid);

    const user = firebase.auth().currentUser;

    const chatRoomId = user?.uid && selectedUserId ? `${selectedUserId}` : '';

    // useEffect(() => {
    //     const messagesRef = firebase.database().ref('messages').child(teacherId);
    //     messagesRef.on('child_added', (snapshot) => {
    //         const message = snapshot.val();
    //         setMessages((prevMessages) => [...prevMessages, message]);
    //     });

    //     return () => {
    //         messagesRef.off();
    //     };
    // }, [teacherId]);

    // useEffect(() => {
    //     if (chatRoomId) {
    //         const messagesRef = firebase.database().ref('messages').child(chatRoomId);
    //         messagesRef.on('child_added', (snapshot) => {
    //             const message = snapshot.val();
    //             setMessages((prevMessages) => [...prevMessages, message]);
    //         });

    //         return () => {
    //             messagesRef.off();
    //         };
    //     }
    // }, [chatRoomId]);

    useEffect(() => {
        if (!chatRoomId) return;

        const messagesRef = firestore.collection(`users/${user?.uid}/messages`).doc(chatRoomId).collection('messages');
        const teacherMessagesRef = firestore
            .collection(`users/${selectedUserId}/messages`)
            .doc(chatRoomId)
            .collection('messages');

        const unsubscribe = messagesRef.orderBy('timestamp').onSnapshot((snapshot) => {
            setMessages(snapshot.docs.map((doc) => doc.data()));
        });

        const unsubscribeTeacher = teacherMessagesRef.orderBy('timestamp').onSnapshot((snapshot) => {
            setMessages(snapshot.docs.map((doc) => doc.data()));
        });

        return () => {
            unsubscribe();
            unsubscribeTeacher();
        };
    }, [chatRoomId, user?.uid, selectedUserId, firestore]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (input.trim() === '' || !chatRoomId) return;

        const newMessage = {
            text: input,
            userId: user?.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        };

        firestore.collection(`users/${user?.uid}/messages`).doc(chatRoomId).collection('messages').add(newMessage);
        firestore.collection(`users/${selectedUserId}/messages`).doc(chatRoomId).collection('messages').add(newMessage);

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
