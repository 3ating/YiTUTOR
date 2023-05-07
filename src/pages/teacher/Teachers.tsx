import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import styled from 'styled-components';
import Link from 'next/link';
import { useAuth } from '../../../public/AuthContext';
import TeacherCardComponents from '../../components/TeacherCard';
import ReactSelect, { StylesConfig, OptionProps, CSSObjectWithLabel, GroupBase } from 'react-select';

type OptionType = {
    label: string;
    value: string;
};

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
    RatingContainer,
    RatingNumber,
    StarIcon,
    EmptyStarIcon,
    HalfStarIcon,
    calculateAverage,
    renderStars,
} = TeacherCardComponents;

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: antiquewhite;
    margin: 65px 0;
`;

const TeachersPageContainer = styled.div`
    background-color: antiquewhite;
    padding: 50px 0 80px;
    display: flex;
    flex-direction: column;
`;

const TeacherContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 345px);
    justify-content: center;
    margin-top: 30px;

    @media (max-width: 1380px) and (min-width: 901px) {
        grid-template-columns: repeat(3, 345px);
    }

    @media (max-width: 1000px) {
        grid-template-columns: repeat(2, 345px);
    }
`;

const TeacherCardWrapper = styled.div`
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 10px;
`;

const DirectLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

const SearchForm = styled.form`
    display: flex;
    justify-content: center;
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
    margin-right: 10px;
    letter-spacing: 1px;
    @media (max-width: 1000px) {
        width: unset;
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

const customStyles: StylesConfig<OptionType, false> = {
    control: (provided) => ({
        ...provided,
        border: '1px solid #ccc',
        borderColor: '#ccc',
        boxShadow: 'none',
        borderRadius: '5px',
        padding: '2px 10px',
        fontSize: '16px',
        backgroundColor: 'white',
        marginBottom: '20px',
        maxWidth: '300px',
        margin: '0',
        gridArea: 'subject',
        marginLeft: '0',
        marginRight: '5px',
        minHeight: '45px',
        cursor: 'pointer',
        letterSpacing: '1px',
        width: '150px',
        '&:hover': {
            borderColor: '#999',
        },
    }),
    option: (base: CSSObjectWithLabel, state: OptionProps<OptionType, false, GroupBase<OptionType>>) => ({
        ...base,
        backgroundColor: state.isFocused ? '#f0f0f0' : '#fff',
        color: '#555',
    }),
};

const subjectOptions: OptionType[] = [
    { label: '預設', value: '' },
    { label: '國文', value: '國文' },
    { label: '英文', value: '英文' },
    { label: '數學', value: '數學' },
    { label: '物理', value: '物理' },
    { label: '化學', value: '化學' },
];

const priceSortOptions: OptionType[] = [
    { label: '預設', value: '' },
    { label: '由低到高', value: 'asc' },
    { label: '由高到低', value: 'desc' },
];

const ratingSortOptions: OptionType[] = [
    { label: '預設', value: '' },
    { label: '由高到低', value: 'desc' },
    { label: '由低到高', value: 'asc' },
];

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
    evaluation: number[];
    subject: any;
    name: string;
    email: string;
    phone: string;
    userType: string;
    description?: string;
    price?: { qty: number; price: number }[];
    avatar?: string;
}

const Teachers = () => {
    const { isLoading, userUid } = useAuth();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [search, setSearch] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedPriceSort, setSelectedPriceSort] = useState('');
    const [selectedRatingSort, setSelectedRatingSort] = useState('');

    const handleFilter = () => {
        let query = db.collection('users').where('userType', '==', 'teacher');

        if (selectedSubject) {
            query = query.where('subject', 'array-contains', selectedSubject);
        }

        query.get().then((snapshot) => {
            let filteredTeachersData = snapshot.docs
                .map((doc) => {
                    return {
                        ...doc.data(),
                        uid: doc.id,
                    } as unknown as Teacher;
                })
                .filter((teacher) => teacher.name.toLowerCase().includes(search.toLowerCase()));

            filteredTeachersData = sortTeachers(filteredTeachersData);

            setTeachers(filteredTeachersData);
        });
    };

    const sortTeachers = (teachersList: Teacher[]) => {
        if (selectedPriceSort) {
            teachersList.sort((a, b) => {
                const aPrice = a.price?.[0]?.price || 0;
                const bPrice = b.price?.[0]?.price || 0;

                if (selectedPriceSort === 'asc') {
                    return aPrice - bPrice;
                } else if (selectedPriceSort === 'desc') {
                    return bPrice - aPrice;
                }

                return 0;
            });
        }

        if (selectedRatingSort) {
            teachersList.sort((a, b) => {
                const aRating = calculateAverage(a.evaluation);
                const bRating = calculateAverage(b.evaluation);

                if (selectedRatingSort === 'asc') {
                    return aRating - bRating;
                } else if (selectedRatingSort === 'desc') {
                    return bRating - aRating;
                }

                return 0;
            });
        }

        return teachersList;
    };

    useEffect(() => {
        handleFilter();
    }, [search, selectedSubject, selectedPriceSort, selectedRatingSort]);

    useEffect(() => {
        const sortedTeachers = sortTeachers([...teachers]);
        setTeachers(sortedTeachers);
    }, [selectedPriceSort]);

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

    return (
        <PageContainer>
            {/* <Header /> */}
            <TeachersPageContainer>
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
                        placeholder='搜尋老師名字'
                    />
                    <ReactSelect
                        styles={customStyles}
                        value={
                            selectedPriceSort
                                ? priceSortOptions.find((option) => option.value === selectedPriceSort)
                                : null
                        }
                        options={priceSortOptions}
                        placeholder='價格排序'
                        onChange={(value) => setSelectedPriceSort((value as OptionType)?.value || '')}
                    />

                    <ReactSelect
                        styles={customStyles}
                        value={
                            selectedRatingSort
                                ? ratingSortOptions.find((option) => option.value === selectedRatingSort)
                                : null
                        }
                        options={ratingSortOptions}
                        placeholder='評分排序'
                        onChange={(value) => setSelectedRatingSort((value as OptionType)?.value || '')}
                    />

                    <ReactSelect
                        styles={customStyles}
                        value={
                            selectedSubject ? subjectOptions.find((option) => option.value === selectedSubject) : null
                        }
                        options={subjectOptions}
                        placeholder='科目'
                        onChange={(value) => setSelectedSubject((value as OptionType)?.value || '')}
                    />
                </SearchForm>
                <TeacherContainer>
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
                                    <RatingContainer>
                                        <RatingNumber>{calculateAverage(teacher.evaluation).toFixed(1)}</RatingNumber>
                                        {renderStars(parseFloat(calculateAverage(teacher.evaluation).toFixed(1)))}
                                    </RatingContainer>
                                    <TeacherDescription>{teacher.description}</TeacherDescription>
                                    {/* <div> */}
                                    <DirectLink href={`/teacher/${teacher.uid}`} key={teacher.uid}>
                                        <TeacherBtn>購買課程</TeacherBtn>
                                    </DirectLink>
                                    {/* </div> */}
                                </TeacherInfoContainer>
                            </TeacherCard>
                        </TeacherCardWrapper>
                    ))}
                </TeacherContainer>
            </TeachersPageContainer>

            {/* <Footer /> */}
        </PageContainer>
    );
};

export default Teachers;
