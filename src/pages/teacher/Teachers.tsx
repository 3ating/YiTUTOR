import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import styled from 'styled-components';
import Link from 'next/link';
import { useAuth } from '../../../public/AuthContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TeacherCardComponents from '../../components/TeacherCard';

const {
    TeachersContainer,
    TeacherImg,
    TeacherCard,
    Hightline,
    CoursePrice,
    TeacherInfoContainer,
    TeacherName,
    Subject,
    TeacherDescription,
    TeacherBtn,
} = TeacherCardComponents;

// const TeacherContainer = styled.div`
//     display: grid;
//     grid-gap: 20px;
//     grid-template-columns: repeat(3, 1fr);
// `;

// const TeacherCard = styled.div`
//     border: 1px solid #ccc;
//     border-radius: 5px;
//     padding: 20px;
//     margin-bottom: 20px;
//     width: 300px;
//     height: 400px;
//     max-width: 100%;
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;

//     &:hover {
//         cursor: pointer;
//     }
// `;

// const DirectLink = styled(Link)`
//     text-decoration: none;
//     color: black;
// `;

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

// 在現有的 TeacherContainer 樣式中添加 flex: 1
const TeacherContainer = styled.div`
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
        'search search search search'
        'subject subject subject subject'
        'teacher teacher teacher teacher';
    padding: 20px;
    background-color: antiquewhite;
    flex: 1;
`;

const TeacherCardWrapper = styled.div`
    width: 25%;
    padding: 0 10px;
    box-sizing: border-box;
`;

// const TeacherCard = styled.div`
//     border: 1px solid #ccc;
//     border-radius: 10px;
//     padding: 20px;
//     margin-bottom: 20px;
//     width: 300px;
//     height: 400px;
//     max-width: 100%;
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;
//     background-color: #ffffff;
//     transition: transform 0.3s, box-shadow 0.3s;

//     &:hover {
//         cursor: pointer;
//         transform: translateY(-5px);
//         box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
//     }
// `;

const DirectLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

const SearchForm = styled.form`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    grid-area: search;
`;

const SearchInput = styled.input`
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    font-size: 16px;
    width: 100%;
    height: 25px;
    max-width: 300px;
    margin: 10px;
`;

const SearchButton = styled.button`
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #4a9df8;
    color: white;
    cursor: pointer;
    margin: 10px;

    &:hover {
        background-color: #3b8de1;
    }
`;

const SubjectSelect = styled.select`
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    font-size: 16px;
    background-color: white;
    margin-bottom: 20px;
    max-width: 300px;
    /* width: 100%; */
    margin: 10px;
    grid-area: subject;
    margin-left: 0;
    height: 45px;
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
    const { isLoading, userUid } = useAuth();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [search, setSearch] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    console.log('userUid:', userUid);
    console.log('isLoading:', isLoading);

    // const handleFilter = () => {
    //     let query = db.collection('users').where('userType', '==', 'teacher');

    //     if (selectedSubject) {
    //         query = query.where('subject', 'array-contains', selectedSubject);
    //     }

    //     query.get().then((snapshot) => {
    //         const filteredTeachersData = snapshot.docs
    //             .map((doc) => {
    //                 return {
    //                     ...doc.data(),
    //                     uid: doc.id,
    //                 } as unknown as Teacher;
    //             })
    //             .filter((teacher) => teacher.name.toLowerCase().includes(search.toLowerCase()));

    //         setTeachers(filteredTeachersData);
    //     });
    // };

    // useEffect(() => {
    //     handleFilter();
    // }, []);

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
    }, [search, selectedSubject]);

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
        <PageContainer>
            <Header />
            <TeacherContainer>
                <SearchForm
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleFilter();
                    }}
                >
                    <SearchInput
                        type='text'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='搜尋教師名字'
                    />
                    <SubjectSelect
                        value={selectedSubject}
                        onChange={(e) => {
                            setSelectedSubject(e.target.value);
                        }}
                    >
                        <option value=''>選擇科目</option>
                        <option value='國文'>國文</option>
                        <option value='英文'>英文</option>
                        <option value='數學'>數學</option>
                        <option value='物理'>物理</option>
                        <option value='化學'>化學</option>
                    </SubjectSelect>
                </SearchForm>

                {/* <TeachersContainer>                </TeachersContainer> */}

                {teachers.map((teacher, index) => (
                    <TeacherCardWrapper key={index}>
                        <TeacherCard>
                            {teacher.avatar && (
                                <TeacherImg
                                    src={teacher.avatar}
                                    alt={`${teacher.name} 的大頭照`}
                                    width={148}
                                    height={148}
                                />
                            )}

                            <CoursePrice>NT${teacher.price?.[0]?.price}/50分鐘</CoursePrice>
                            <Hightline />
                            <TeacherInfoContainer>
                                <TeacherName>{teacher.name}</TeacherName>
                                <Subject>{teacher.subject}家教</Subject>

                                <TeacherDescription>{teacher.description}</TeacherDescription>
                                <div>
                                    <DirectLink href={`/teacher/${teacher.uid}`} key={teacher.uid}>
                                        <TeacherBtn>購買課程</TeacherBtn>
                                    </DirectLink>
                                </div>
                            </TeacherInfoContainer>
                        </TeacherCard>
                    </TeacherCardWrapper>
                ))}
            </TeacherContainer>
            <Footer />
        </PageContainer>
    );
};

export default Teachers;
