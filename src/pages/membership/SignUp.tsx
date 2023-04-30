import React, { CSSProperties, useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styled from 'styled-components';
import Image from 'next/image';
import SignUpImg from './signup.png';
import Button from '../../components/Button';
import { AiOutlineCamera } from 'react-icons/ai';
import Select, { OptionProps, ControlProps, StylesConfig } from 'react-select';
import ReactSelect from 'react-select';
import { CSSObject } from '@emotion/react';

const firebaseConfig = {
    apiKey: 'AIzaSyDrG9uBznJyP7Fe_4JRwVG7pvR7SjScQsg',
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
const auth = firebase.auth();
const storage = firebase.storage();

interface UserTypeOption {
    value: string;
    label: string;
}

type SubjectButtonProps = {
    selected: boolean;
};

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    min-height: 100vh;
`;

const SignupContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    height: calc(100vh - 130px);
`;

const WelcomeContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 40%;
    height: 100%;
    /* border: 1px solid black; */
    background: antiquewhite;
    height: calc(100vh - 130px);
`;

const WelcomeTextContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 400px;
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
    /* border: 1px solid black; */
`;

const SignupFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    /* border: 1px solid red; */
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
    /* align-items: flex-start; */
    flex-direction: column;
    /* align-items: flex-start; */
    gap: 20px;
    width: 100%;
    margin-top: 20px;
    align-items: center;
`;

const UserInfoInput = styled.input`
    padding: 8px;
    /* width: 298px; */
    height: 28px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 8px;
    /* letter-spacing: 1px;  */
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
    /* width: 100%; */
`;

const UserInfoSelect = styled.select`
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 400;
    color: #555;
    background-color: #f9f9f9;
    appearance: none;
    cursor: pointer;
    margin-top: 8px;
`;

const TextArea = styled.textarea`
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const SubmitButton = styled(Button)`
    border-radius: 9px;
    letter-spacing: 2px;
    background-color: ${(props) =>
        props.children === '下一步' || props.children === '最後一步' ? 'black' : '#ffab34'};
    &:hover {
        background-color: ${(props) =>
            props.children === '下一步' || props.children === '最後一步' ? '#333' : '#f9b352'};
    }
`;

const AvatarLabel = styled(UserInfoLabel)`
    position: relative;
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

const DirectLink = styled(Link)`
    text-decoration: none;
    color: gray;
    width: fit-content;
    display: inline-block;
    /* text-align: center; */
    margin-top: 10px;
    &:hover {
        color: #333333;
    }
`;

const TeacherSubjectContainer = styled.div`
    width: 100%;
`;

const ButtonContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    /* margin-top: 20px; */
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
    /* width: 100%; */
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

    /* -webkit-appearance: none;
    -moz-appearance: textfield; */
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const TimeContainer = styled.div`
    display: flex;
`;

const TimeButtonContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(6, auto);
    gap: 10px;
    justify-content: center;
    margin-top: 5px;
`;

const TimeSelectedTitle = styled.p`
    font-size: 18px;
    margin: 0 0 20px;
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
    /* margin: 5px; */
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

const RegistrationForm = () => {
    const availableSubjects = ['國文', '英文', '數學', '物理', '化學'];

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [userType, setUserType] = useState('');
    const [courses, setCourses] = useState({});
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [price, setPrice] = useState<{ [key: number]: number | undefined }>({});
    // const [document, setDocument] = useState('');

    const [subjects, setSubjects] = useState(['']);
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    // const [certification, setCertification] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [intro, setIntro] = useState('');
    const [selectedTimes, setSelectedTimes] = useState<{ [day: string]: Set<number> }>({
        Monday: new Set(),
        Tuesday: new Set(),
        Wednesday: new Set(),
        Thursday: new Set(),
        Friday: new Set(),
        // Saturday: new Set(),
        // Sunday: new Set(),
    });

    const [evaluation, setEvaluation] = useState('');
    const [showTeacherDetails, setShowTeacherDetails] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [finalStep, setFinalStep] = useState(false);

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

    const addSubject = () => {
        setSubjects([...subjects, '']);
    };

    const selectedTimesArray = Object.entries(selectedTimes).map(([day, hours]) => {
        return { day, hours: Array.from(hours) };
    });

    const handleSubjectChange = (index: number, value: string) => {
        const newSubjects = [...subjects];
        newSubjects[index] = value;
        setSubjects(newSubjects);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAvatarFile(e.target.files[0]);
            setAvatarPreview(URL.createObjectURL(e.target.files[0]));
        } else {
            setAvatarPreview('');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setDocumentFile(e.target.files[0]);
        }
    };

    const handlePriceChange = (lessons: number, value: string) => {
        setPrice({ ...price, [lessons]: parseInt(value) });
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

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
                                // document: documentUrl,
                                // certification,
                                intro,
                                selectedTimes: selectedTimesArray,
                            }),
                        })
                        .then(() => {
                            setMessage('註冊成功！');
                            router.push('/membership/SignIn');
                            setName('');
                            setEmail('');
                            setPhone('');
                            setPassword('');
                            setUserType('');
                            setDescription('');
                            setSubject('');
                            setPrice({});
                            // setDocument('');
                            setSubjects(['']);
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

    const handleTimeChange = (day: string, hour: number, checked: boolean) => {
        const newSelectedTimes = { ...selectedTimes };
        if (checked) {
            newSelectedTimes[day].add(hour);
        } else {
            newSelectedTimes[day].delete(hour);
        }
        setSelectedTimes(newSelectedTimes);
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

    // const handleSubjectSelection = (subject: string) => {
    //     if (selectedSubjects.includes(subject)) {
    //         setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    //     } else {
    //         setSelectedSubjects([...selectedSubjects, subject]);
    //     }
    // };

    const handleSubjectSelection = (subject: string) => {
        if (selectedSubjects.includes(subject)) {
            setSelectedSubjects([]);
        } else {
            setSelectedSubjects([subject]);
        }
    };

    console.log(finalStep);
    console.log(selectedSubjects);

    return (
        <PageContainer>
            <Header />
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
                                            required
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
                                        </UserInfoLabel>
                                        <UserInfoLabel>
                                            密碼：
                                            <UserInfoInput
                                                required
                                                type='password'
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
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

                                    {/* <fieldset>
                                        <legend>Available Time Slots:</legend>
                                        {Object.keys(selectedTimes).map((day) => (
                                            <fieldset key={day}>
                                                <legend>{day}:</legend>
                                                {Array.from({ length: 12 }, (_, i) => i + 9).map((hour) => (
                                                    <label key={hour}>
                                                        <input
                                                            type='checkbox'
                                                            onChange={(e) =>
                                                                handleTimeChange(day, hour, e.target.checked)
                                                            }
                                                        />
                                                        {hour}:00
                                                    </label>
                                                ))}
                                            </fieldset>
                                        ))}
                                    </fieldset> */}
                                </>
                            )}
                            {userType === 'teacher' && showTeacherDetails && finalStep && (
                                <div>
                                    {/* <TimeSelectedTitle>選擇可以上課的時間 ⏰</TimeSelectedTitle> */}
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

                            <ButtonContainer>
                                <SubmitButton type='submit'>
                                    {userType === 'teacher'
                                        ? showTeacherDetails
                                            ? finalStep
                                                ? '提交'
                                                : '最後一步'
                                            : '下一步'
                                        : finalStep
                                        ? '提交'
                                        : '提交'}
                                </SubmitButton>

                                {message && <p>{message}</p>}
                                {!showTeacherDetails && <DirectLink href='SignIn'>已經有帳號，前往登入</DirectLink>}
                            </ButtonContainer>
                        </UserInfoForm>
                    </SignupFormContainer>
                </SignupInputContainer>
            </SignupContainer>

            <Footer />
        </PageContainer>
    );
};

export default RegistrationForm;
