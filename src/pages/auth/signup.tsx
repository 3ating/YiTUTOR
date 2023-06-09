import { auth, db, storage } from '@/utils/firebase';
import { CSSObject } from '@emotion/react';
import 'firebase/compat/firestore';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import ReactSelect, { ControlProps, OptionProps, StylesConfig } from 'react-select';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import SignUpButton from './components/SignUpButton';
import defaultAvatar from './components/images/defaultAvatar.png';
import SignUpImg from './components/images/signup.png';

type SubjectButtonProps = {
    selected: boolean;
};

interface UserTypeOption {
    value: string;
    label: string;
}

const SignupContainer = styled.div`
    width: 100%;
    display: flex;
    min-height: calc(100vh - 130px);
    margin: 65px 0;
`;

const WelcomeContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 40%;
    background: antiquewhite;
`;

const WelcomeTextContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 20px 0 45px;
`;

const WelcomeTitle = styled.p`
    font-size: 50px;
    font-weight: 600;
    letter-spacing: 3px;
    margin: 20px 0 0;
`;

const WelcomeText = styled.p`
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 1px;
    color: gray;
    margin: 5px 0 0 0;
    line-height: 25px;
    margin-top: 10px;
`;

const SignUpImage = styled(Image)`
    width: 450px;
    height: auto;
`;

const SignupInputContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60%;
`;

const SignupFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 650px;
`;

const SignupTitle = styled.p`
    font-size: 30px;
    font-weight: 600;
    letter-spacing: 3px;
    margin: 25px 0 10px;
`;

const SignupTitleLine = styled.div`
    width: 100%;
    height: 1px;
    background: #aaaaaa;
`;

const UserInfoForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    margin-top: 20px;
    align-items: center;
`;

const UserInfoInput = styled.input`
    padding: 8px;
    height: 28px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 8px;
`;

const UserInfoContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    width: 100%;
    margin-bottom: 20px;
`;

const UserInfoLabel = styled.label`
    display: flex;
    flex-direction: column;
    font-size: 16px;
    letter-spacing: 1px;
`;

const AvatarContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

const AvatarText = styled.p`
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 1px;
    color: gray;
    margin-left: 20px;
    line-height: 25px;
`;

const AvatarInput = styled(UserInfoInput)`
    display: none;
`;

const AvatarPreviewContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 110px;
    height: 110px;
    border: 3px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
`;

const AvatarPreviewImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
`;

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

const TimeButtonContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(6, auto);
    gap: 10px;
    justify-content: center;
    margin-top: 5px;
`;

const TimeDayContainer = styled.div`
    margin-bottom: 10px;
`;

const WeekDay = styled.p`
    font-size: 14px;
    margin: 0;
`;

const TimeButton = styled.button<{ selected: boolean }>`
    background-color: ${(props) => (props.selected ? '#000' : '#ccc')};
    color: ${(props) => (props.selected ? 'white' : 'black')};
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    border: none;
    width: 100px;
    letter-spacing: 1px;
    &:hover {
        background-color: #000;
        color: white;
    }
`;

const InputHint = styled.span`
    font-size: 11px;
    color: #999;
    margin-left: auto;
`;

const customStyles: StylesConfig<UserTypeOption, false> = {
    control: (base: CSSObject, state: ControlProps<UserTypeOption, false>) => ({
        ...base,
        borderColor: '#ccc',
        boxShadow: 'none',
        marginTop: '8px',
        height: '46px',
        '&:hover': {
            borderColor: '#999',
        },
    }),
    option: (base: CSSObject, state: OptionProps<UserTypeOption, false>) => ({
        ...base,
        backgroundColor: state.isFocused ? '#f0f0f0' : '#fff',
        color: '#555',
    }),
};

const userTypeOptions = [
    { value: '', label: '請選擇' },
    { value: 'student', label: '👨🏻‍🎓 學生' },
    { value: 'teacher', label: '👨🏻‍🏫 老師' },
];

const SignUp = () => {
    const { isLoading } = useAuth();
    const defaultAvatarUrl = defaultAvatar.src;
    const availableSubjects = ['國文', '英文', '數學', '物理', '化學'];
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [message, setMessage] = useState('');
    const [courses, setCourses] = useState({});
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<{ [key: number]: number | undefined }>({});
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [intro, setIntro] = useState('');
    const [selectedTimes, setSelectedTimes] = useState<{ [day: string]: Set<number> }>({
        Monday: new Set(),
        Tuesday: new Set(),
        Wednesday: new Set(),
        Thursday: new Set(),
        Friday: new Set(),
    });
    const [showTeacherDetails, setShowTeacherDetails] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [finalStep, setFinalStep] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const router = useRouter();

    const convertDayToChinese = (day: string) => {
        const dayMap: { [key: string]: string } = {
            Monday: '星期一',
            Tuesday: '星期二',
            Wednesday: '星期三',
            Thursday: '星期四',
            Friday: '星期五',
        };

        return dayMap[day] || day;
    };
    const selectedTimesArray = Object.entries(selectedTimes).map(([day, hours]) => {
        return { day, hours: Array.from(hours) };
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAvatarFile(e.target.files[0]);
            setAvatarPreview(URL.createObjectURL(e.target.files[0]));
        } else {
            setAvatarPreview('');
        }
    };

    const handlePriceChange = (lessons: number, value: string) => {
        setPrice({ ...price, [lessons]: parseInt(value) });
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (password.length < 8) {
            setPasswordError('密碼至少需要8個字符');
            return;
        } else {
            setPasswordError('');
        }

        const randomRating = Math.floor(Math.random() * 5);

        if (userType === 'teacher' && !showTeacherDetails) {
            setShowTeacherDetails(true);
            return;
        }

        if (userType === 'teacher' && showTeacherDetails && !finalStep) {
            setFinalStep(true);
            return;
        }

        let documentUrl = '';
        if (documentFile) {
            const storageRef = storage.ref();
            const documentRef = storageRef.child(`documents/${documentFile.name}`);
            const snapshot = await documentRef.put(documentFile);
            documentUrl = await snapshot.ref.getDownloadURL();
        }

        let avatarUrl = '';
        if (avatarFile) {
            const storageRef = storage.ref();
            const avatarRef = storageRef.child(`avatars/${avatarFile.name}`);
            const snapshot = await avatarRef.put(avatarFile);
            avatarUrl = await snapshot.ref.getDownloadURL();
        } else {
            avatarUrl = defaultAvatarUrl;
        }

        const priceArray = Object.entries(price).map(([key, value]) => {
            return { qty: parseInt(key), price: value };
        });

        auth.createUserWithEmailAndPassword(email, password)
            .then((result) => {
                if (result.user) {
                    db.collection('users')
                        .doc(result.user.uid)
                        .set({
                            name,
                            email,
                            phone,
                            userType,
                            courses,
                            avatar: avatarUrl,
                            ...(userType === 'teacher' && {
                                description,
                                subject: selectedSubjects,
                                price: priceArray,
                                evaluation: [randomRating],
                                intro,
                                selectedTimes: selectedTimesArray,
                            }),
                        })
                        .then(() => {
                            setMessage('註冊成功！');
                            router.push('/auth/login');
                            setName('');
                            setEmail('');
                            setPhone('');
                            setPassword('');
                            setUserType('');
                            setDescription('');
                            setPrice({});
                            setAvatarFile(null);
                        })
                        .catch((error) => {
                            console.error('Error writing document: ', error);
                        });
                } else {
                    setMessage('註冊失敗。');
                }
            })
            .catch((error) => {
                console.error('Error creating user: ', error);
                setMessage('註冊失敗。');
            });
        if (!finalStep) {
            setFinalStep(true);
            return;
        }
    };

    const handleTimeButtonClick = (day: string, hour: number) => {
        const newSelectedTimes = { ...selectedTimes };
        if (newSelectedTimes[day].has(hour)) {
            newSelectedTimes[day].delete(hour);
        } else {
            newSelectedTimes[day].add(hour);
        }
        setSelectedTimes(newSelectedTimes);
    };

    const handleSubjectSelection = (subject: string) => {
        if (selectedSubjects.includes(subject)) {
            setSelectedSubjects([]);
        } else {
            setSelectedSubjects([subject]);
        }
    };

    if (isLoading) {
        router.push('/');
        return;
    }

    return (
        <SignupContainer>
            <WelcomeContainer>
                <WelcomeTextContainer>
                    <WelcomeTitle>
                        Welcome to <br /> YiTUTOR
                    </WelcomeTitle>
                    <WelcomeText>
                        填寫右邊的註冊資訊，選擇老師或學生
                        <br />
                        成為 YiTUTOR 的一員，與我們一同成長吧！
                    </WelcomeText>
                </WelcomeTextContainer>
                <SignUpImage src={SignUpImg} alt='Sign Up' />
            </WelcomeContainer>
            <SignupInputContainer>
                <SignupFormContainer>
                    <SignupTitle>註冊</SignupTitle>
                    <SignupTitleLine />
                    <UserInfoForm onSubmit={handleSubmit}>
                        {!showTeacherDetails && (
                            <>
                                <AvatarContainer>
                                    <AvatarInput
                                        ref={avatarInputRef}
                                        type='file'
                                        accept='image/*'
                                        onChange={(e) => handleAvatarChange(e)}
                                    />
                                    <AvatarPreviewContainer onClick={() => avatarInputRef.current?.click()}>
                                        {avatarPreview ? (
                                            <AvatarPreviewImage src={avatarPreview} alt='Avatar Preview' />
                                        ) : (
                                            <AiOutlineCamera size={35} color='#818181' />
                                        )}
                                    </AvatarPreviewContainer>
                                    <AvatarText>
                                        點擊左側的相機圖示
                                        <br />
                                        並選一張照片作為你的大頭貼吧！
                                    </AvatarText>
                                </AvatarContainer>
                                <UserInfoContainer>
                                    <UserInfoLabel>
                                        姓名：
                                        <UserInfoInput
                                            required
                                            type='text'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            pattern='[\u4e00-\u9fa5]+'
                                        />
                                        <InputHint>請輸入中文姓名</InputHint>
                                    </UserInfoLabel>
                                    <UserInfoLabel>
                                        手機：
                                        <UserInfoInput
                                            required
                                            type='tel'
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </UserInfoLabel>
                                    <UserInfoLabel>
                                        信箱：
                                        <UserInfoInput
                                            required
                                            type='email'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <InputHint>同時為您的帳號</InputHint>
                                    </UserInfoLabel>
                                    <UserInfoLabel>
                                        密碼：
                                        <UserInfoInput
                                            required
                                            type='password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <InputHint>{passwordError || '至少由8個數字或英文組成'}</InputHint>
                                    </UserInfoLabel>
                                    <UserInfoLabel>
                                        身份：
                                        <ReactSelect
                                            styles={customStyles}
                                            options={userTypeOptions}
                                            value={userTypeOptions.find((option) => option.value === userType)}
                                            onChange={(selectedOption) => {
                                                if (selectedOption !== null) {
                                                    setUserType(selectedOption.value);
                                                }
                                            }}
                                        />
                                    </UserInfoLabel>
                                </UserInfoContainer>
                            </>
                        )}
                        {userType === 'teacher' && showTeacherDetails && !finalStep && (
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
                                    <TeacherTextArea
                                        required
                                        value={intro}
                                        onChange={(e) => setIntro(e.target.value)}
                                        rows={5}
                                        cols={50}
                                    />
                                </TeacherInfoLabel>
                                <TeacherSubjectContainer>
                                    <TeacherInfoLabel>科目：</TeacherInfoLabel>
                                    <SubjectContainer>
                                        {availableSubjects.map((subject, index) => (
                                            <SubjectButton
                                                key={index}
                                                selected={selectedSubjects.includes(subject)}
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
                                        <PriceItem>
                                            <PriceInput
                                                required
                                                type='number'
                                                value={price[1] || ''}
                                                onChange={(e) => handlePriceChange(1, e.target.value)}
                                                placeholder=' '
                                            />
                                            <PriceLabel>一堂課</PriceLabel>
                                        </PriceItem>
                                        <PriceItem>
                                            <PriceInput
                                                required
                                                type='number'
                                                value={price[5] || ''}
                                                onChange={(e) => handlePriceChange(5, e.target.value)}
                                                placeholder=' '
                                            />
                                            <PriceLabel>五堂課</PriceLabel>
                                        </PriceItem>
                                        <PriceItem>
                                            <PriceInput
                                                required
                                                type='number'
                                                value={price[10] || ''}
                                                onChange={(e) => handlePriceChange(10, e.target.value)}
                                                placeholder=' '
                                            />
                                            <PriceLabel>十堂課</PriceLabel>
                                        </PriceItem>
                                    </PriceContainer>
                                </TeacherInfoLabel>
                            </>
                        )}
                        {userType === 'teacher' && showTeacherDetails && finalStep && (
                            <div>
                                {Object.keys(selectedTimes).map((day) => (
                                    <TimeDayContainer key={day}>
                                        <WeekDay>{convertDayToChinese(day)}</WeekDay>
                                        <TimeButtonContainer>
                                            {Array.from({ length: 12 }, (_, i) => i + 9).map((hour) => (
                                                <TimeButton
                                                    key={hour}
                                                    selected={selectedTimes[day].has(hour)}
                                                    onClick={() => handleTimeButtonClick(day, hour)}
                                                    type='button'
                                                >
                                                    {hour}:00
                                                </TimeButton>
                                            ))}
                                        </TimeButtonContainer>
                                    </TimeDayContainer>
                                ))}
                            </div>
                        )}
                        <SignUpButton
                            userType={userType}
                            showTeacherDetails={showTeacherDetails}
                            finalStep={finalStep}
                            message={message}
                        />
                    </UserInfoForm>
                </SignupFormContainer>
            </SignupInputContainer>
        </SignupContainer>
    );
};

export default SignUp;
