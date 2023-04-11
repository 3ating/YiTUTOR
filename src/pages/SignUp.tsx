import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import Link from 'next/link';

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

    const addSubject = () => {
        setSubjects([...subjects, '']);
    };

    const handleSubjectChange = (index: number, value: string) => {
        const newSubjects = [...subjects];
        newSubjects[index] = value;
        setSubjects(newSubjects);
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
                            ...(userType === 'teacher' && {
                                description,
                                subject: subjects,
                                price: priceArray,
                                document: documentUrl,
                                certification,
                            }),
                        })
                        .then(() => {
                            setMessage('註冊成功！');
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

    return (
        <>
            <form onSubmit={handleSubmit}>
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
                            自我描述：
                            <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
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
                        <label>
                            證明文件：
                            <input type='file' accept='image/*' onChange={handleFileChange} />
                        </label>
                    </>
                )}
                <button type='submit'>提交</button>
                {message && <p>{message}</p>}
            </form>
            <Link href='/SignIn'>已經有帳號，前往登入</Link>
        </>
    );
};

export default RegistrationForm;
