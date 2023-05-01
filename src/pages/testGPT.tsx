import { useState } from 'react';
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

const API_KEY = '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';

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

const AskGPTPage = () => {
    const [messages, setMessages] = useState([
        {
            message: '我是智慧解題機器人🤖，我會盡我所能為你解答任何考題！',
            sentTime: 'just now',
            sender: 'ChatGPT',
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);

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

    console.log('messages:', messages);

    async function storeQuestionAndAnswer(question: { message: any }, answer: { message: any; sender?: string }) {
        try {
            await db.collection('questionsAndAnswers').add({
                question: question.message,
                answer: answer.message,
                timestamp: firebase.firestore.Timestamp.now(),
            });
        } catch (error) {
            console.error('Error writing document: ', error);
        }
    }

    async function processMessageToChatGPT(chatMessages: any[]) {
        let apiMessages = chatMessages.map((messageObject) => {
            let role = '';
            if (messageObject.sender === 'ChatGPT') {
                role = 'assistant';
            } else {
                role = 'user';
            }
            return { role: role, content: messageObject.message };
        });

        const apiRequestBody = {
            model: 'gpt-3.5-turbo',
            messages: apiMessages,
        };

        console.log('apiMessages:', apiMessages);
        console.log('apiRequestBody:', apiRequestBody);

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

    return (
        <StyledApp>
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
            </div>
        </StyledApp>
    );
};

export default AskGPTPage;
