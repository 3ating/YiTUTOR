import React, { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../../public/AuthContext';

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

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1>Chatroom</h1>
            <div style={{ marginBottom: '16px' }}>
                <input
                    type='text'
                    placeholder='Your name'
                    value={name}
                    onChange={handleNameChange}
                    style={{ marginRight: '8px', width: '25%' }}
                />
                <input
                    type='text'
                    placeholder='Type your message'
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    style={{ width: '50%' }}
                />
                <button onClick={sendMessage} style={{ marginLeft: '8px' }}>
                    Send
                </button>
            </div>
            <div style={{ overflowY: 'scroll', maxHeight: '400px' }}>
                {messages.map((message) => (
                    <div key={message.id}>
                        <strong>{message.name}:</strong> {message.content}
                        <br />
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
        </div>
    );
}
