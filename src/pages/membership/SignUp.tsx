import React, { CSSProperties, useState } from 'react';
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
    font-size: 40px;
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
`;

const SignUpImage = styled(Image)`
    width: 450px;
    height: auto;
`;

const SignupInputContainer = styled.div`
    width: 60%;
    border: 1px solid black;
`;

const styles: { [key: string]: CSSProperties } = {
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    label: {
        marginBottom: '1rem',
    },
    input: {
        marginLeft: '0.5rem',
    },
    select: {
        marginLeft: '0.5rem',
    },
    button: {
        marginTop: '1rem',
    },
};

const RegistrationForm = () => {
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
    const [document, setDocument] = useState('');

    const [subjects, setSubjects] = useState(['']);
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [certification, setCertification] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [intro, setIntro] = useState('');
    const [selectedTimes, setSelectedTimes] = useState<{ [day: string]: Set<number> }>({
        Monday: new Set(),
        Tuesday: new Set(),
        Wednesday: new Set(),
        Thursday: new Set(),
        Friday: new Set(),
        Saturday: new Set(),
        Sunday: new Set(),
    });

    const [evaluation, setEvaluation] = useState('');

    const router = useRouter();

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
                                subject: subjects,
                                price: priceArray,
                                document: documentUrl,
                                certification,
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
                            setDocument('');
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
                            成為YiTUTOR的一員，與我們一同成長吧！
                        </WelcomeText>
                    </WelcomeTextContainer>
                    <SignUpImage src={SignUpImg} alt='Sign Up' />
                </WelcomeContainer>
                <SignupInputContainer>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <label style={styles.label}>
                            大頭貼：
                            <input type='file' accept='image/*' onChange={(e) => handleAvatarChange(e)} />
                        </label>
                        {avatarPreview && (
                            <div>
                                <img
                                    src={avatarPreview}
                                    alt='Avatar Preview'
                                    style={{ width: '100px', objectFit: 'cover', borderRadius: '50%' }}
                                />
                            </div>
                        )}
                        <label>
                            姓名：
                            <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                        </label>
                        <label>
                            Email：
                            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <label>
                            密碼：
                            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        <label>
                            手機號碼：
                            <input type='tel' value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </label>
                        <label>
                            身份：
                            <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                                <option value=''>請選擇</option>
                                <option value='student'>學生</option>
                                <option value='teacher'>老師</option>
                            </select>
                        </label>
                        {userType === 'teacher' && (
                            <>
                                <label>
                                    簡述：
                                    <input
                                        type='text'
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </label>
                                <label>
                                    自我介紹：
                                    <textarea
                                        value={intro}
                                        onChange={(e) => setIntro(e.target.value)}
                                        rows={10}
                                        cols={50}
                                    />
                                </label>
                                <div>
                                    <label>科目：</label>
                                    {subjects.map((subject, index) => (
                                        <input
                                            key={index}
                                            type='text'
                                            value={subject}
                                            onChange={(e) => handleSubjectChange(index, e.target.value)}
                                        />
                                    ))}
                                    <button type='button' onClick={addSubject}>
                                        新增科目
                                    </button>
                                </div>
                                <label>
                                    1 堂課價格：
                                    <input
                                        type='number'
                                        value={price[1] || ''}
                                        onChange={(e) => handlePriceChange(1, e.target.value)}
                                    />
                                </label>
                                <label>
                                    5 堂課價格：
                                    <input
                                        type='number'
                                        value={price[5] || ''}
                                        onChange={(e) => handlePriceChange(5, e.target.value)}
                                    />
                                </label>
                                <label>
                                    10 堂課價格：
                                    <input
                                        type='number'
                                        value={price[10] || ''}
                                        onChange={(e) => handlePriceChange(10, e.target.value)}
                                    />
                                </label>
                                <fieldset>
                                    <legend>Available Time Slots:</legend>
                                    {Object.keys(selectedTimes).map((day) => (
                                        <fieldset key={day}>
                                            <legend>{day}:</legend>
                                            {Array.from({ length: 12 }, (_, i) => i + 9).map((hour) => (
                                                <label key={hour}>
                                                    <input
                                                        type='checkbox'
                                                        onChange={(e) => handleTimeChange(day, hour, e.target.checked)}
                                                    />
                                                    {hour}:00
                                                </label>
                                            ))}
                                        </fieldset>
                                    ))}
                                </fieldset>
                                <label>
                                    證明文件：
                                    <input type='file' accept='image/*' onChange={handleFileChange} />
                                </label>
                            </>
                        )}
                        <button type='submit' style={styles.button}>
                            提交
                        </button>
                        {message && <p>{message}</p>}
                    </form>
                    <Link href='SignIn'>已經有帳號，前往登入</Link>
                </SignupInputContainer>
            </SignupContainer>

            <Footer />
        </PageContainer>
    );
};

export default RegistrationForm;
