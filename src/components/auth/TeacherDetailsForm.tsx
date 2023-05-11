import React from 'react';
import styled from 'styled-components';

type SubjectButtonProps = {
    selected: boolean;
};

type TeacherDetailsFormProps = {
    description: string;
    setDescription: (value: string) => void;
    intro: string;
    setIntro: (value: string) => void;
    selectedSubjects: string[];
    handleSubjectSelection: (subject: string) => void;
    price: { [key: number]: number | undefined };
    handlePriceChange: (lessons: number, value: string) => void;
    availableSubjects: string[];
};

const TeacherSubjectContainer = styled.div`
    width: 100%;
`;

const TeacherInfoLabel = styled.label`
    display: flex;
    flex-direction: column;
    font-size: 16px;
    letter-spacing: 1px;
    width: 100%;
`;

const TeacherTextArea = styled.textarea`
    padding: 8px;
    display: block;
    padding: 0.5rem;
    margin-top: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
`;

const SubjectContainer = styled.div`
    margin-top: 8px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 0.5rem;
`;

const SubjectButton = styled.button<SubjectButtonProps>`
    width: 100%;
    padding: 0.5rem 1rem;
    background-color: ${(props) => (props.selected ? '#ffab34' : '#ccc')};
    color: ${(props) => (props.selected ? 'white' : 'black')};
    border: none;
    border-radius: 5px;
    cursor: pointer;
    letter-spacing: 2px;
    &:hover {
        background-color: #ffab34;
        color: white;
    }
`;

const PriceContainer = styled.div`
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 1.5rem;
    margin: 20px 0 10px;
    gap: 50px;
`;

const PriceItem = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
`;

const PriceLabel = styled.label`
    position: absolute;
    top: 0.45rem;
    left: 0.5rem;
    font-size: 14px;
    transition: all 0.2s;
    pointer-events: none;
    color: #ccc;
`;

const PriceInput = styled.input`
    max-width: 200px;
    padding: 10px 8px 5px;
    font-size: 1rem;
    border: none;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
    outline: none;
    background: transparent;
    &:focus {
        outline: none;
        border-bottom-color: #000000;
    }

    &:focus-within ~ ${PriceLabel}, &:not(:placeholder-shown) ~ ${PriceLabel} {
        font-size: 0.75rem;
        transform: translateY(-1rem);
    }
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const InputHint = styled.span`
    font-size: 11px;
    color: #999;
    margin-left: auto;
`;

const priceItems = [
    { lessons: 1, label: '一堂課' },
    { lessons: 5, label: '五堂課' },
    { lessons: 10, label: '十堂課' },
];

const TeacherDetailsForm: React.FC<TeacherDetailsFormProps> = ({
    description,
    setDescription,
    intro,
    setIntro,
    selectedSubjects,
    handleSubjectSelection,
    price,
    handlePriceChange,
    availableSubjects,
}) => {
    console.log('Available subjects:', availableSubjects);

    return (
        <>
            <TeacherInfoLabel>
                簡述：
                <TeacherTextArea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    cols={50}
                    maxLength={60}
                />
                <InputHint>請勿超過 60 個字</InputHint>
            </TeacherInfoLabel>
            <TeacherInfoLabel>
                自我介紹：
                <TeacherTextArea required value={intro} onChange={(e) => setIntro(e.target.value)} rows={5} cols={50} />
            </TeacherInfoLabel>
            <TeacherSubjectContainer>
                <TeacherInfoLabel>科目：</TeacherInfoLabel>
                <SubjectContainer>
                    {availableSubjects.map((subject, index) => (
                        <SubjectButton
                            key={index}
                            selected={selectedSubjects?.includes(subject)}
                            onClick={() => handleSubjectSelection(subject)}
                            type='button'
                        >
                            {subject}
                        </SubjectButton>
                    ))}
                </SubjectContainer>
            </TeacherSubjectContainer>
            <TeacherInfoLabel>
                課程價格：
                <PriceContainer>
                    {priceItems.map((item) => (
                        <PriceItem key={item.lessons}>
                            <PriceInput
                                required
                                type='number'
                                value={price[item.lessons] || ''}
                                onChange={(e) => handlePriceChange(item.lessons, e.target.value)}
                                placeholder=' '
                            />
                            <PriceLabel>{item.label}</PriceLabel>
                        </PriceItem>
                    ))}
                </PriceContainer>
            </TeacherInfoLabel>
        </>
    );
};

export default TeacherDetailsForm;
