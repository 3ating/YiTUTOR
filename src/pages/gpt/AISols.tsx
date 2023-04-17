import { useEffect, useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message as ChatMessage,
    MessageInput,
    TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import styled from 'styled-components';
import { OPENAI_API_KEY } from '../../../config';
import { useAuth } from '../../../public/AuthContext';
import Link from 'next/link';

const firebaseConfig = {
    apiKey: process.env.FIRESTORE_API_KEY,
    authDomain: 'board-12c3c.firebaseapp.com',
    projectId: 'board-12c3c',
    storageBucket: 'board-12c3c.appspot.com',
    messagingSenderId: '662676665549',
    appId: '1:662676665549:web:d2d23417c365f3ec666584',
    measurementId: 'G-YY6Q81WPY9',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const API_KEY = OPENAI_API_KEY;

const StyledApp = styled.div`
    font-family: Arial, Helvetica, sans-serif;
    background-color: #f5f5f5;
    height: 100vh;
`;

const StyledMainContainer = styled(MainContainer)`
    height: 100%;
`;

const StyledChatContainer = styled(ChatContainer)`
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    border-radius: 6px;
    margin: 50px auto;
    max-width: 600px;
    height: 80%;
`;

const DirectLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

const AISols = () => {
    const { userUid } = useAuth();
    const INITIAL_MESSAGE = [
        {
            message: '我是智慧解題機器人🤖，我會盡我所能為你解答任何考題！',
            sentTime: 'just now',
            sender: 'ChatGPT',
        },
    ];
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState(INITIAL_MESSAGE);

    const handleSend = async (message: string) => {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: 'user',
            sentTime: new Date().toLocaleString(),
        };

        const newMessages = [...messages, newMessage];

        setMessages(newMessages);

        setIsTyping(true);
        await processMessageToChatGPT(newMessages);
    };

    async function storeQuestionAndAnswer(question: { message: any }, answer: { message: any; sender?: string }) {
        try {
            if (userUid) {
                await db.collection('users').doc(userUid).collection('gpt_solutions').add({
                    question: question.message,
                    answer: answer.message,
                    timestamp: firebase.firestore.Timestamp.now(),
                });
            } else {
                console.error('User ID not found.');
            }
        } catch (error) {
            console.error('Error writing document: ', error);
        }
    }

    async function processMessageToChatGPT(chatMessages: any[]) {
        let apiMessages = [
            {
                role: 'system',
                content:
                    '你是一個專業的補習班老師，個性一板一眼，只會回答國文、數學、英文、物理和化學等科目的相關考題，若是被問到考題以外的問題請你回答：「此問題與學習無關，請您重新發問！」',
            },
        ].concat(
            chatMessages.map((messageObject) => {
                let role = '';
                if (messageObject.sender === 'ChatGPT') {
                    role = 'assistant';
                } else {
                    role = 'user';
                }
                return { role: role, content: messageObject.message };
            })
        );

        const apiRequestBody = {
            model: 'gpt-3.5-turbo',
            messages: apiMessages,
        };

        // console.log('apiMessages:', apiMessages);
        // console.log('apiRequestBody:', apiRequestBody);

        await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify(apiRequestBody),
        })
            .then((data) => {
                console.log(data);

                return data.json();
            })
            .then((data) => {
                console.log(data);
                if (data.choices && data.choices.length > 0) {
                    const chatGPTMessage = {
                        message: data.choices[0].message.content,
                        sender: 'ChatGPT',
                    };
                    const lastUserMessage = chatMessages
                        .filter((messageObject) => messageObject.sender === 'user')
                        .pop();
                    if (lastUserMessage) {
                        storeQuestionAndAnswer({ message: lastUserMessage.message }, chatGPTMessage);
                    }
                    setMessages([...chatMessages, chatGPTMessage]);
                } else {
                    console.error('No choices returned from the API.');
                }
                setIsTyping(false);
            })
            .catch((error) => {
                console.error('Error fetching API:', error);
                setIsTyping(false);
            });
    }

    async function fetchUserHistory() {
        if (userUid) {
            try {
                const historySnapshot = await db
                    .collection('users')
                    .doc(userUid)
                    .collection('gpt_solutions')
                    .orderBy('timestamp')
                    .get();
                if (!historySnapshot.empty) {
                    const historyMessages: { message: string; direction: string; sender: string; sentTime: any }[] = [];
                    historySnapshot.forEach((doc) => {
                        const data = doc.data();
                        historyMessages.push(
                            {
                                message: data.question,
                                direction: 'outgoing',
                                sender: 'user',
                                sentTime: data.timestamp.toDate().toLocaleString(),
                            },
                            {
                                message: data.answer,
                                direction: 'incoming',
                                sender: 'ChatGPT',
                                sentTime: data.timestamp.toDate().toLocaleString(),
                            }
                        );
                    });
                    setMessages((prevMessages) => [...prevMessages, ...historyMessages]);
                }
            } catch (error) {
                console.error('Error fetching user history:', error);
            }
        }
    }

    async function clearHistory() {
        if (userUid) {
            try {
                const historySnapshot = await db.collection('users').doc(userUid).collection('gpt_solutions').get();

                const batch = db.batch();

                historySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });

                await batch.commit();
                setMessages(INITIAL_MESSAGE);
            } catch (error) {
                console.error('Error deleting user history:', error);
            }
        }
    }

    useEffect(() => {
        fetchUserHistory();
    }, [userUid]);

    // console.log('messages:', messages);
    console.log(userUid);

    return (
        <StyledApp>
            {userUid ? (
                <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
                    <StyledMainContainer>
                        <StyledChatContainer>
                            <MessageList
                                scrollBehavior='smooth'
                                typingIndicator={isTyping ? <TypingIndicator content='ChatGPT is typing' /> : null}
                            >
                                {messages.map((message, i) => {
                                    return (
                                        <ChatMessage
                                            key={i}
                                            model={{
                                                position: 0,
                                                direction: message.sender === 'ChatGPT' ? 'incoming' : 'outgoing',
                                                message: message.message,
                                                sentTime: message.sentTime,
                                                sender: message.sender,
                                            }}
                                        />
                                    );
                                })}
                            </MessageList>
                            <MessageInput placeholder='Type message here' onSend={handleSend} />
                        </StyledChatContainer>
                    </StyledMainContainer>
                    <button onClick={clearHistory}>clear</button>
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <DirectLink href='/membership/SignIn'>
                        <p>請先登入再使用此功能</p>
                    </DirectLink>
                </div>
            )}
        </StyledApp>
    );
};

export default AISols;
