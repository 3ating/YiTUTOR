import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import styled from 'styled-components';
import { useAuth } from '../auth/AuthContext';

const UserListContainer = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
`;

const UserItem = styled.li`
    cursor: pointer;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;

    &:hover {
        background-color: #f0f2f5;
    }
`;

interface ChatUser {
    uid: string;
    name: string;
}

interface ChatUserListProps {
    onSelectUser: (uid: string) => void;
}

const ChatUserList: React.FC<ChatUserListProps> = ({ onSelectUser }) => {
    const { userUid } = useAuth();
    const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
    const firestore = firebase.firestore();

    useEffect(() => {
        if (!userUid) return;

        const unsubscribe = firestore.collection(`users/${userUid}/messages`).onSnapshot(async (snapshot) => {
            const usersData: ChatUser[] = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const userDoc = await firestore.collection('users').doc(doc.id).get();
                    const userData = userDoc.data();
                    return {
                        uid: userDoc.id,
                        name: userData?.name,
                    } as ChatUser;
                })
            );
            setChatUsers(usersData);
        });

        return () => {
            unsubscribe();
        };
    }, [userUid, firestore]);

    return (
        <UserListContainer>
            {chatUsers.map((user) => (
                <UserItem key={user.uid} onClick={() => onSelectUser(user.uid)}>
                    {user.name}
                </UserItem>
            ))}
        </UserListContainer>
    );
};

export default ChatUserList;
