import { Key, useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import styled from 'styled-components';
import Link from 'next/link';

const TeacherContainer = styled.div`
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(3, 1fr);
`;

const TeacherCard = styled.div`
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 20px;
    width: 300px;
    height: 400px;
    max-width: 100%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:hover {
        cursor: pointer;
    }
`;

const DirectLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

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

interface Teacher {
    uid: string;
    evaluation: JSX.Element;
    subject: any;
    name: string;
    email: string;
    phone: string;
    userType: string;
    description?: string;
    subjects?: string[];
    price?: { qty: number; price: number }[];
    avatar?: string;
}

const Teachers = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    useEffect(() => {
        const unsubscribe = db
            .collection('users')
            .where('userType', '==', 'teacher')
            .onSnapshot((snapshot) => {
                const teachersData: Teacher[] = snapshot.docs.map((doc) => {
                    return {
                        ...doc.data(),
                        uid: doc.id, // Add uid to the teacher data
                    } as unknown as Teacher;
                });
                setTeachers(teachersData);
            });

        return () => {
            unsubscribe();
        };
    }, []);

    console.log(teachers);

    return (
        <TeacherContainer>
            {teachers.map((teacher, index) => (
                <DirectLink href={`/teacher/${teacher.uid}`} key={teacher.uid}>
                    <TeacherCard key={index}>
                        <h2>{teacher.name}</h2>

                        {teacher.avatar && (
                            <img
                                src={teacher.avatar}
                                alt={`${teacher.name} 的大頭照`}
                                style={{ width: '100px', borderRadius: '50%' }}
                            />
                        )}
                        <p>{teacher.description}</p>
                        <p>{teacher.evaluation && <span>&#9733;{teacher.evaluation} </span>}</p>

                        <p>科目: {teacher.subject.join(', ')}</p>
                        {/* <p>
                            課程價格:{' '}
                            {teacher.price &&
                                teacher.price.map(
                                    (priceObj: { qty: number; price: number }, idx: Key | null | undefined) => {
                                        return (
                                            <span key={idx}>
                                                {priceObj.qty} 堂課: {priceObj.price} 元
                                            </span>
                                        );
                                    }
                                )}
                        </p> */}
                    </TeacherCard>
                </DirectLink>
            ))}
        </TeacherContainer>
    );
};

export default Teachers;
