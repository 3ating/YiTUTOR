import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTeachers } from '@/context/TeacherContext';
import { db } from '@/utils/firebase';
import 'firebase/compat/firestore';
import ReactSelect, { CSSObjectWithLabel, GroupBase, OptionProps, StylesConfig } from 'react-select';
import TeacherCardComponents from '@/components/common/TeacherCard';
import ChatBtn from '@/components/chat/ChatBtn';
import { Teacher } from '@/types/Teacher';
import TeacherInfoCard from '@/components/common/TeacherInfoCard';
import Loader from '@/components/common/Loader';

type OptionType = {
    label: string;
    value: string;
};

interface ReactSelectProps {
    value: string;
    options: OptionType[];
    placeholder: string;
    onChange: (value: string) => void;
}

const { calculateAverage } = TeacherCardComponents;

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

const Teachers = () => {
    const { teachers, setTeachers } = useTeachers();
    const [search, setSearch] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedPriceSort, setSelectedPriceSort] = useState('');
    const [selectedRatingSort, setSelectedRatingSort] = useState('');
    const [loading, setLoading] = useState(false);
    const selectOptions = [
        {
            label: '價格排序',
            value: selectedPriceSort,
            options: priceSortOptions,
            onChange: setSelectedPriceSort,
        },
        {
            label: '評分排序',
            value: selectedRatingSort,
            options: ratingSortOptions,
            onChange: setSelectedRatingSort,
        },
        {
            label: '科目',
            value: selectedSubject,
            options: subjectOptions,
            onChange: setSelectedSubject,
        },
    ];

    const handleFilter = async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        let query = db.collection('users').where('userType', '==', 'teacher');
        if (selectedSubject) {
            query = query.where('subject', 'array-contains', selectedSubject);
        }
        try {
            const snapshot = await query.get();
            const filteredTeachersData = snapshot.docs
                .map(
                    (doc) =>
                        ({
                            ...doc.data(),
                            uid: doc.id,
                        } as Teacher)
                )
                .filter((teacher) => teacher.name.toLowerCase().includes(search.toLowerCase()));

            const sortedTeachersData = sortTeachers(filteredTeachersData);
            setTeachers(sortedTeachersData);
        } catch (error) {
            console.error('Error filtering teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    const sortTeachers = (teachersList: Teacher[]) => {
        if (selectedPriceSort) {
            teachersList.sort((a, b) => {
                const aPrice = a.price?.[0]?.price || 0;
                const bPrice = b.price?.[0]?.price || 0;
                return selectedPriceSort === 'asc' ? aPrice - bPrice : bPrice - aPrice;
            });
        }

        if (selectedRatingSort) {
            teachersList.sort((a, b) => {
                const aRating = calculateAverage(a.evaluation);
                const bRating = calculateAverage(b.evaluation);
                return selectedRatingSort === 'asc' ? aRating - bRating : bRating - aRating;
            });
        }

        return teachersList;
    };

    const createReactSelect = ({ value, options, placeholder, onChange }: ReactSelectProps) => (
        <ReactSelect
            styles={customStyles}
            value={value ? options.find((option) => option.value === value) : null}
            options={options}
            placeholder={placeholder}
            onChange={(selectedOption) => {
                onChange((selectedOption as OptionType)?.value || '');
            }}
        />
    );

    useEffect(() => {
        handleFilter();
    }, [search, selectedSubject, selectedPriceSort, selectedRatingSort]);

    useEffect(() => {
        const sortedTeachers = sortTeachers([...teachers]);
        setTeachers(sortedTeachers);
    }, [selectedPriceSort]);

    return (
        <PageContainer>
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
                    {selectOptions.map(({ label, value, options, onChange }) =>
                        createReactSelect({
                            value,
                            options,
                            placeholder: label,
                            onChange,
                        })
                    )}
                </SearchForm>
                {loading && <Loader />}
                {!loading && (
                    <TeacherContainer>
                        {teachers.map((teacher, index) => (
                            <TeacherInfoCard key={index} teacher={teacher} href={`./${teacher.uid}`} />
                        ))}
                    </TeacherContainer>
                )}
            </TeachersPageContainer>
            <ChatBtn />
        </PageContainer>
    );
};

export default Teachers;
