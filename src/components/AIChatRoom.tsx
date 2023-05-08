import { SetStateAction, useEffect, useRef, useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import styled from 'styled-components';
// import { OPENAI_API_KEY } from '../../config';
import { useAuth } from '../../public/AuthContext';
import Link from 'next/link';
import { BsFillSendFill } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import { Spin, notification } from 'antd';

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

// const API_KEY = OPENAI_API_KEY;
// const API_KEY = process.env.OPENAI_API_KEY;

interface MessageProps {
    position: 'incoming' | 'outgoing';
}

interface SendIconProps {
    active: boolean;
    size: number;
}

const ChatRoomContainer = styled.div`
    position: fixed;
    bottom: 0px;
    right: 50px;
    height: 700px;
    width: 380px;
    z-index: 1;
    margin: 0;
`;

const ChatRoomTitle = styled.p`
    text-align: center;
    margin: 0 0 10px;
    padding: 12px 16px;
    background-color: #000;
    color: white;
    border-top-left-radius: 9px;
    border-top-right-radius: 9px;
    font-size: 18px;
    margin-bottom: 14px;
    letter-spacing: 1px;
`;

const StyledMainContainer = styled.div`
    height: 100%;
`;

const StyledChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    border-radius: 9px;
    margin: 50px auto;
    max-width: 600px;
    height: 80%;
    /* padding-top: 8px; */
`;

const MessageList = styled.div`
    flex: 1;
    overflow-y: auto;
    position: relative;
`;

const Message = styled.div<MessageProps>`
    padding: 8px 16px;
    margin: 8px;
    max-width: 70%;
    border-radius: 12px;
    word-wrap: break-word;
    width: fit-content;
    font-size: 14px;
    ${(props) =>
        props.position === 'incoming'
            ? `
        background-color: #c4c4c4;
        margin-left: auto;
        `
            : `
        background-color: #dfdfdf;
        margin-right: auto;
    `}
`;

const TypingIndicator = styled.div`
    font-size: 12px;
    color: #656565;
    padding: 0 20px 0;
    margin: 8px;
    /* position: absolute; */
    /* bottom: 0; */
    margin: 0;
`;

const MessageInputContainer = styled.div`
    display: flex;
    align-items: center;
    /* border-top: 1px solid #ccc; */
`;

const MessageInput = styled.input`
    flex: 1;
    padding: 16px;
    border: none;
    outline: none;
    border-radius: 9px;
    &::placeholder {
        letter-spacing: 1.5px;
        color: #ccc;
    }
`;

const SendButton = styled.button`
    padding: 8px 0;
    border: none;
    background-color: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SendIcon = styled(BsFillSendFill)<SendIconProps>`
    color: ${(props) => (props.active ? '#000' : '#ccc')};
`;

const DeleteButton = styled.button`
    padding: 8px 16px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
        color: #ccc;
    }
    &:hover {
        svg {
            color: #000;
        }
    }
`;

const AIChatRoom = () => {
    const ICON_SIZE = 18;
    const { userUid, isLoading } = useAuth();
    const INITIAL_MESSAGE = [
        {
            message: '我是智慧解題機器人🤖，我會盡我所能為你解答任何考題！',
            sentTime: 'just now',
            sender: 'ChatGPT',
        },
    ];
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState(INITIAL_MESSAGE);
    const [inputMessage, setInputMessage] = useState('');
    const messageListRef = useRef<HTMLDivElement>(null);

    const handleSend = async () => {
        if (inputMessage.trim() === '') return;

        const newMessage = {
            message: inputMessage,
            direction: 'outgoing',
            sender: 'user',
            sentTime: new Date().toLocaleString(),
        };

        const newMessages = [...messages, newMessage];

        setMessages(newMessages);
        setInputMessage('');

        setIsTyping(true);
        await processMessageToChatGPT(newMessages);
        messageListRef.current?.scrollTo(0, messageListRef.current?.scrollHeight);
    };

    const handleInputChange = (e: { target: { value: SetStateAction<string> } }) => {
        setInputMessage(e.target.value);
    };

    const handleKeyPress = (e: { key: string }) => {
        if (e.key === 'Enter') {
            handleSend();
        }
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
                    '你是一個專業的補習班老師，個性一板一眼，若是被問到考題以外的問題請你回答：「此問題與學習無關，請您重新發問！」',
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
        console.log('apiRequestBody:', apiRequestBody);

        await fetch('/api/gpt/AISols', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiRequestBody),
        })
            .then((data) => {
                if (data.status === 504) {
                    notification.warning({
                        message: '請確認問題是否與學習有關',
                        description: '重新整理後再發問一次',
                        placement: 'topRight',
                    });
                    throw new Error('Status 504');
                }
                console.log('API response:', data);
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

    const DotLoadingIcon = () => {
        return (
            <span>
                <i className='dot' />
                <i className='dot' />
                <i className='dot' />
                <style jsx>{`
                    .dot {
                        display: inline-block;
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background-color: #ccc;
                        margin-right: 4px;
                        animation: dotBounce 1.4s infinite ease-in-out;
                    }
                    .dot:last-child {
                        margin-right: 0;
                    }
                    .dot:nth-child(1) {
                        animation-delay: -0.32s;
                    }
                    .dot:nth-child(2) {
                        animation-delay: -0.16s;
                    }
                    @keyframes dotBounce {
                        0%,
                        80%,
                        100% {
                            transform: translateY(0);
                        }
                        40% {
                            transform: translateY(-30%);
                        }
                    }
                `}</style>
            </span>
        );
    };

    const scrollToBottom = () => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        fetchUserHistory();
    }, [userUid]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <ChatRoomContainer>
            <StyledMainContainer>
                <StyledChatContainer>
                    <ChatRoomTitle>智慧解題助教</ChatRoomTitle>
                    <MessageList ref={messageListRef}>
                        {messages.map((message, i) => (
                            <Message key={i} position={message.sender === 'ChatGPT' ? 'outgoing' : 'incoming'}>
                                {message.message}
                            </Message>
                        ))}
                    </MessageList>
                    {isTyping && (
                        <TypingIndicator>
                            <Spin indicator={<DotLoadingIcon />} style={{ marginRight: 8 }} />
                        </TypingIndicator>
                    )}
                    <MessageInputContainer>
                        <MessageInput
                            placeholder='輸入問題'
                            value={inputMessage}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                        />
                        <SendButton onClick={handleSend}>
                            <SendIcon size={ICON_SIZE} active={inputMessage.trim() ? true : false} />
                        </SendButton>
                        <DeleteButton onClick={clearHistory}>
                            <AiFillDelete size={ICON_SIZE + 4} />
                        </DeleteButton>
                    </MessageInputContainer>
                </StyledChatContainer>
            </StyledMainContainer>
        </ChatRoomContainer>
    );
};

export default AIChatRoom;
