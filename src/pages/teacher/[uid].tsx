import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import styled from 'styled-components';
import Link from 'next/link';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import ChatRoom from '../ChatRoom';

const Container = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Arial', sans-serif;
`;

const Heading = styled.h1`
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 1rem;
`;

const SubHeading = styled.h2`
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 0.5rem;
`;

const Text = styled.p`
    font-size: 1rem;
    color: #333;
    line-height: 1.5;
`;

const Image = styled.img`
    max-width: 200px;
    border-radius: 50%;
    margin-bottom: 1rem;
`;

const Section = styled.div`
    margin-bottom: 2rem;
`;

const DirectLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

interface Teacher {
    uid: string;
    name: string;
    description?: string;
    avatar?: string;
    certification?: boolean;
    courses?: Record<string, any>;
    document?: string;
    email?: string;
    evaluation?: string;
    phone?: string;
    price?: { qty: number; price: number }[];
    subject?: string[];
    userType?: string;
}

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

const TeacherDetails = () => {
    const router = useRouter();
    const { uid } = router.query;

    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [openChat, setOpenChat] = useState(false);

    console.log(uid);

    const handleOpenChat = () => {
        setOpenChat(true);
    };

    const handleCloseChat = () => {
        setOpenChat(false);
    };

    useEffect(() => {
        if (uid) {
            const db = firebase.firestore();
            db.collection('users')
                .doc(uid as string)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        const teacherData = doc.data() as Teacher;
                        setTeacher(teacherData);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching teacher details:', error);
                });
        }
    }, [uid]);

    if (!teacher) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Heading>{teacher.name}</Heading>
            <Image src={teacher.avatar} alt={`${teacher.name} 的大頭照`} />
            <Section>
                <SubHeading>關於我</SubHeading>
                <Text>{teacher.description}</Text>
            </Section>
            <Section>
                <SubHeading>聯繫方式</SubHeading>
                <Text>電子郵件: {teacher.email}</Text>
                <Text>電話: {teacher.phone}</Text>
            </Section>
            <Section>
                <SubHeading>科目</SubHeading>
                <Text>{teacher.subject?.join(', ')}</Text>
            </Section>
            <Section>
                <SubHeading>課程價格</SubHeading>
                <Text>
                    {teacher.price &&
                        teacher.price.map((priceObj: { qty: number; price: number }, idx: number) => {
                            return (
                                <span key={idx}>
                                    {priceObj.qty} 堂課: {priceObj.price} 元
                                </span>
                            );
                        })}
                </Text>
            </Section>
            <Section>
                <SubHeading>評價</SubHeading>
                <Text>{teacher.evaluation}</Text>
            </Section>
            <Section>
                <SubHeading>認證</SubHeading>
                <Text>{teacher.certification ? '是' : '否'}</Text>
            </Section>
            {teacher.document && (
                <Section>
                    <SubHeading>證書</SubHeading>
                    <a href={teacher.document}>查看證書</a>
                </Section>
            )}
            <DirectLink href={'/Teachers'}>
                <button>尋找其他教師</button>
            </DirectLink>
            <button onClick={handleOpenChat}>與我聊聊</button>
            <Dialog open={openChat} onClose={handleCloseChat} maxWidth='md' fullWidth>
                <DialogContent>
                    <ChatRoom teacherId={teacher.uid} />
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default TeacherDetails;
