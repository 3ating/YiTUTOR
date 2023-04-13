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
    // subjects?: string[];
    price?: { qty: number; price: number }[];
    avatar?: string;
}

const Teachers = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [search, setSearch] = useState('');

    const [selectedSubject, setSelectedSubject] = useState('');

    // const handleSearch = () => {
    //     db.collection('users')
    //         .where('userType', '==', 'teacher')
    //         .get()
    //         .then((snapshot) => {
    //             const filteredTeachersData = snapshot.docs
    //                 .map((doc) => {
    //                     return {
    //                         ...doc.data(),
    //                         uid: doc.id,
    //                     } as unknown as Teacher;
    //                 })
    //                 .filter((teacher) => teacher.name.toLowerCase().includes(search.toLowerCase()));
    //             setTeachers(filteredTeachersData);
    //         });
    // };

    // const handleSubjectFilter = () => {
    //     console.log('selectedSubject 上一層');
    //     if (selectedSubject) {
    //         console.log('selectedSubject 內層');

    //         db.collection('users')
    //             .where('userType', '==', 'teacher')
    //             .where('subject', 'array-contains', selectedSubject)
    //             .get()
    //             .then((snapshot) => {
    //                 const filteredTeachersData = snapshot.docs.map((doc) => {
    //                     return {
    //                         ...doc.data(),
    //                         uid: doc.id,
    //                     } as unknown as Teacher;
    //                 });
    //                 setTeachers(filteredTeachersData);
    //             });
    //     } else {
    //         handleSearch();
    //     }
    // };

    const handleFilter = () => {
        let query = db.collection('users').where('userType', '==', 'teacher');

        if (selectedSubject) {
            query = query.where('subject', 'array-contains', selectedSubject);
        }

        query.get().then((snapshot) => {
            const filteredTeachersData = snapshot.docs
                .map((doc) => {
                    return {
                        ...doc.data(),
                        uid: doc.id,
                    } as unknown as Teacher;
                })
                .filter((teacher) => teacher.name.toLowerCase().includes(search.toLowerCase()));

            setTeachers(filteredTeachersData);
        });
    };

    useEffect(() => {
        handleFilter();
    }, []);

    useEffect(() => {
        const unsubscribe = db
            .collection('users')
            .where('userType', '==', 'teacher')
            .onSnapshot((snapshot) => {
                const teachersData: Teacher[] = snapshot.docs.map((doc) => {
                    return {
                        ...doc.data(),
                        uid: doc.id,
                    } as unknown as Teacher;
                });
                setTeachers(teachersData);
            });

        return () => {
            unsubscribe();
        };
    }, []);

    console.log(teachers);
    console.log(selectedSubject);

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleFilter();
                }}
            >
                <input
                    type='text'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='搜尋教師名字'
                />
                <button type='submit'>搜尋</button>
            </form>
            <select
                value={selectedSubject}
                onChange={(e) => {
                    setSelectedSubject(e.target.value);
                }}
            >
                <option value=''>選擇科目</option>
                <option value='國文'>國文</option>
                <option value='物理'>物理</option>
                <option value='化學'>化學</option>
                <option value='英文'>英文</option>
                <option value='前端'>前端</option>
            </select>
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
        </>
    );
};

export default Teachers;
