import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getFirestore, doc, getDoc, collection, updateDoc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import styled from 'styled-components';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Calendar from '../Calendar';
import Schedule from '../Schedule';
import Button from '@/components/Button';
import { AiFillEdit } from 'react-icons/ai';

type BookedCoursesContainerProps = {
    isBookedCourseEmpty: boolean;
};

interface ProfilRightContainerProps {
    isTeacher: boolean;
}

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: antiquewhite;
`;

const ProfileContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
    padding: 0 50px;
`;

const UserInfoBox = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    /* background-color: #ffffff; */
    /* padding: 1.5rem; */
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    width: 100%;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: antiquewhite;
`;

const Avatar = styled.img`
    width: 182px;
    border-radius: 50%;
    margin: 20px auto;
    aspect-ratio: 1/1;
`;

const UserInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    /* margin-bottom: 30px; */
    /* margin-left: 24px; */
`;

const UserNameContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 240px;
    margin: 20px 0 30px;
`;

const UserName = styled.p`
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 29px;
    letter-spacing: 0.155em;
    margin: 0;
`;

const UserType = styled.p`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 55px;
    height: 25px;
    background: #ffd335;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    letter-spacing: 0.09em;
    margin: 0;
    border-radius: 9px;
`;

const UserInformationContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
`;

const UserInformation = styled.p`
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 1.5px;
`;

const UserInforContent = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
`;

const UserInformationLine = styled.div`
    width: 240px;
    height: 1px;
    background: #000000;
`;

const UserInfo = styled.div`
    font-size: 20px;
    color: #777;
    margin: 0 0 5px 0;
`;

const UserMail = styled.p`
    /* font-weight: 400; */
    font-size: 20px;
    color: #777;
    margin: 0 0 15px 0;
`;

const InputLabel = styled.label`
    display: block;
    margin-bottom: 0.5rem;
`;

const TextArea = styled.textarea`
    display: block;
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    resize: none;
`;

const UserInfoRow = styled.p`
    margin-bottom: 0.5rem;
`;

const ButtonContainer = styled.div`
    margin-top: 10px;
    width: 100%;
`;

const StyledInput = styled.input`
    display: block;
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
`;

const ConfirmButton = styled(Button)`
    margin: 0;
    width: 100%;
    border-radius: 9px;
    letter-spacing: 2px;
    height: 45px;
    background-color: #ffab34;
    &:hover {
        background-color: #f9b352;
    }
`;

const CancelButton = styled(Button)`
    margin: 0;
    width: 100%;
    border-radius: 9px;
    letter-spacing: 2px;
    margin-top: 8px;
    height: 45px;
`;

const CourseCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    /* margin-top: 2rem; */
`;

const CourseCard = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 800px;
    background-color: #ffffff;
    padding: 1.5rem;
    margin-bottom: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: all 0.3s ease;

    /* &:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        transform: translateY(-4px);
    } */
`;

const CourseInfo = styled.div`
    display: flex;
    align-items: center;
    /* margin-right: 1.5rem; */
`;

const CourseLabel = styled.span`
    font-weight: 600;
    margin-right: 5px;
    color: #444;
    font-size: 18px;
`;

const CourseValue = styled.span`
    font-weight: 400;
    font-size: 18px;
    /* width: 35.5px; */
`;

const StyledTextDescription = styled.textarea`
    display: block;
    width: 100%;
    height: 100px;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    resize: none;
`;

const StyledTextIntro = styled.textarea`
    display: block;
    width: 100%;
    height: 200px;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    resize: none;
`;

const BookingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    /* min-width: 300px; */
    box-sizing: border-box;
    padding: 35px 20px;
    width: 100%;
`;

const BookingCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: 100px;
    border-radius: 9px;
    padding: 0 1rem;
    margin-bottom: 1rem;
    cursor: pointer;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s, transform 0.3s;
    &:hover {
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
    }
`;

const BookingAvatar = styled.img`
    width: 80px;
    border-radius: 50%;
    margin-right: 1rem;
    aspect-ratio: 1/1;
`;

const BookingInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const BookingTitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const BookingInfoTitle = styled.h3`
    font-size: 22px;
    font-weight: 500;
    margin: 0;
    letter-spacing: 0.1em;
`;

const BookingSubject = styled.p`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 20px;
    background: #fee690;
    border-radius: 9px;
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
    text-align: center;
    letter-spacing: 0.09em;
    margin: 0;
`;

const BookingInfoTime = styled.p`
    font-size: 16px;
    margin: 20px 0 5px;
`;

const DirectLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

const TeacherLink = styled(Link)`
    text-decoration: none;
    color: #ffab34;
    transition: color 0.2s ease;
`;

const ProfileWrapper = styled.div`
    display: flex;
    height: calc(100vh - 130px);
    /* border: 1px solid red; */
`;

const ProfileMiddleContainer = styled.div<BookedCoursesContainerProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: ${(props) => (props.isBookedCourseEmpty ? '75%' : '40%')};
    height: 100%;
    /* border: 1px solid black; */
`;

const CourseTitle = styled.p`
    font-weight: 600;
    font-size: 24px;
    line-height: 29px;
    text-align: center;
    letter-spacing: 0.155em;
`;

const CourseLine = styled.div`
    width: 60%;
    height: 1px;
    background: black;
`;

const BookedCoursesContainer = styled.div<BookedCoursesContainerProps>`
    display: ${(props) => (props.isBookedCourseEmpty ? 'flex' : 'grid')};
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    align-items: center;
    grid-gap: 1rem;
    width: 518.4px;
    padding: 30px 0;
    box-sizing: border-box;
    justify-content: center;
`;

const ProfilRightContainer = styled.div<ProfilRightContainerProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: ${(props) => (props.isTeacher ? '0' : '35%')};
    height: 100%;
`;

const PurchasedContainer = styled.div`
    display: flex;
    justify-items: center;
    justify-content: center;
    grid-gap: 1rem;
    width: 90%;
    height: 100%;
    padding: 30px 25px;
    box-sizing: border-box;
    /* border: 1px solid red; */
`;

const ModifiedInput = styled.input`
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s ease-in-out;
    width: 100%;
    /* &:focus {
        border-color: #ffab34;
    } */
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const ProfileLeftContainer = styled.div`
    display: flex;
    /* border: 1px solid red; */
    width: 25%;
    background: white;
`;

const EditContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
`;

const IconWrapper = styled.div`
    cursor: pointer;
`;

const NoBookedCourse = styled.div`
    font-size: 20px;
    display: flex;
    justify-content: center;
    letter-spacing: 1px;
    color: #878787;
`;

interface UserInfo {
    name: string;
    email: string;
    phone?: string;
    userType?: string;
    courses?: object;
    avatar?: string;
    description?: string;
    intro?: string;
    selectedTimes?: {
        day: string;
        hours: number[];
    }[];
    bookings: Booking[];
}

interface Booking {
    date: firebase.firestore.Timestamp;
    teacherId: string;
    studentId?: string; // Add this line to include the studentId property
    time: string;
}

interface BookingWithTeacherInfo extends Booking {
    teacherInfo: TeacherInfo;
}

interface TeacherInfo {
    avatar: string;
    name: string;
    subject: string;
}

type UserInfoKeys = 'email' | 'phone';

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

const UserProfile = () => {
    const router = useRouter();
    const { userId } = router.query;
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUserInfo, setEditedUserInfo] = useState<UserInfo | null>(null);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [bookingsInfo, setBookingsInfo] = useState<BookingWithTeacherInfo[]>([]);

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value } = event.target;
    //     if (editedUserInfo) {
    //         setEditedUserInfo({ ...editedUserInfo, [name]: value });
    //     }
    // };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
        const { value } = event.target;
        if (editedUserInfo) {
            setEditedUserInfo({ ...editedUserInfo, [fieldName]: value });
        }
    };

    // const handleEdit = () => {
    //     setIsEditing(true);
    //     setEditedUserInfo(userInfo);
    // };

    const handleEdit = (fieldName: string) => {
        if (fieldName === 'email') {
            if (isEditingPhone) {
                setIsEditingPhone(false);
            }
            setIsEditingEmail(!isEditingEmail);
        } else if (fieldName === 'phone') {
            if (isEditingEmail) {
                setIsEditingEmail(false);
            }
            setIsEditingPhone(!isEditingPhone);
        }
        setEditedUserInfo(userInfo);
    };

    const handleSave = async (fieldName: UserInfoKeys) => {
        if (userId && editedUserInfo) {
            const usersCollectionRef = collection(
                db,
                'users'
            ) as unknown as firebase.firestore.CollectionReference<UserInfo>;
            const userDocRef = doc(usersCollectionRef, userId as string);
            await updateDoc(userDocRef, { [fieldName]: editedUserInfo[fieldName] });
            setUserInfo(editedUserInfo);

            if (fieldName === 'email') {
                setIsEditingEmail(false);
            } else if (fieldName === 'phone') {
                setIsEditingPhone(false);
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedUserInfo(null);
    };

    useEffect(() => {
        if (userId) {
            const fetchUserData = async () => {
                const userDocRef = doc(db, 'users', userId as string);
                const docSnapshot = await getDoc(userDocRef);

                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data() as UserInfo;
                    setUserInfo(userData);
                    fetchBookingData(userData.bookings);
                }
            };

            const fetchBookingData = async (bookings: Booking[]) => {
                const usersCollectionRef = collection(db, 'users');
                if (bookings) {
                    const bookingsDataPromises = bookings.map(async (booking) => {
                        const bookingDocRef = doc(usersCollectionRef, booking.teacherId || booking.studentId);
                        const bookingDocSnapshot = await getDoc(bookingDocRef);
                        const bookingData = bookingDocSnapshot.data() as TeacherInfo;
                        return { ...booking, teacherInfo: bookingData };
                    });

                    const teachersData = await Promise.all(bookingsDataPromises);
                    setBookingsInfo(teachersData);
                }
            };

            fetchUserData();
        }
    }, [userId]);

    console.log(userId);
    console.log(bookingsInfo);
    console.log(userInfo);

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <MainWrapper>
            <Header />
            <ProfileWrapper>
                <ProfileLeftContainer>
                    <UserInfoBox>
                        {userInfo.avatar && <Avatar src={userInfo.avatar} alt={`${name} 的大頭照`} />}
                        <UserInfoContainer>
                            <UserNameContainer>
                                <UserName>{userInfo.name}</UserName>
                                <UserType>
                                    {userInfo.userType === 'student'
                                        ? '學生'
                                        : userInfo.userType === 'teacher'
                                        ? '老師'
                                        : ''}
                                </UserType>
                            </UserNameContainer>
                            <UserInformationContainer>
                                <UserInformation>信箱</UserInformation>
                                <UserInformationLine />
                                <UserInforContent>
                                    <EditContainer>
                                        {isEditingEmail ? (
                                            <>
                                                <ModifiedInput
                                                    type='email'
                                                    name='email'
                                                    value={editedUserInfo?.email || ''}
                                                    onChange={(e) => handleChange(e, 'email')}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                {userInfo.email}
                                                <IconWrapper>
                                                    <AiFillEdit onClick={() => handleEdit('email')} />
                                                </IconWrapper>
                                            </>
                                        )}
                                    </EditContainer>
                                </UserInforContent>
                            </UserInformationContainer>

                            <UserInformationContainer>
                                <UserInformation>電話</UserInformation>
                                <UserInformationLine />
                                <UserInforContent>
                                    <EditContainer>
                                        {isEditingPhone ? (
                                            <>
                                                <ModifiedInput
                                                    type='number'
                                                    name='phone'
                                                    value={editedUserInfo?.phone || ''}
                                                    onChange={(e) => handleChange(e, 'phone')}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                {userInfo.phone}
                                                <IconWrapper>
                                                    <AiFillEdit onClick={() => handleEdit('phone')} />
                                                </IconWrapper>
                                            </>
                                        )}
                                    </EditContainer>
                                </UserInforContent>
                            </UserInformationContainer>
                            {(isEditingEmail || isEditingPhone) && (
                                <>
                                    {isEditingEmail && (
                                        <ConfirmButton onClick={() => handleSave('email')}>確認</ConfirmButton>
                                    )}
                                    {isEditingPhone && (
                                        <ConfirmButton onClick={() => handleSave('phone')}>確認</ConfirmButton>
                                    )}
                                    <CancelButton
                                        onClick={() => {
                                            setIsEditingEmail(false);
                                            setIsEditingPhone(false);
                                        }}
                                    >
                                        取消
                                    </CancelButton>
                                </>
                            )}
                        </UserInfoContainer>
                    </UserInfoBox>
                </ProfileLeftContainer>

                <ProfileMiddleContainer isBookedCourseEmpty={userInfo.userType === 'teacher'}>
                    <CourseTitle>預約課程</CourseTitle>
                    <CourseLine />
                    <BookedCoursesContainer isBookedCourseEmpty={bookingsInfo.length === 0}>
                        {userInfo.userType === 'teacher' && bookingsInfo.length === 0 ? (
                            <NoBookedCourse>目前無學生預約課程</NoBookedCourse>
                        ) : userInfo.userType === 'student' && bookingsInfo.length === 0 ? (
                            <NoBookedCourse>無預約課程</NoBookedCourse>
                        ) : (
                            bookingsInfo.length > 0 &&
                            bookingsInfo.map((booking, index) => (
                                <DirectLink
                                    key={index}
                                    href={`/streamroom/VideoChat?id=${booking.teacherId || booking.studentId}`}
                                >
                                    <BookingCard>
                                        <BookingAvatar
                                            src={booking.teacherInfo.avatar}
                                            alt={`${booking.teacherInfo.name} 的大頭照`}
                                        />
                                        <BookingInfo>
                                            <BookingTitleContainer>
                                                <BookingInfoTitle>{booking.teacherInfo.name}</BookingInfoTitle>
                                                <BookingSubject>{booking.teacherInfo.subject}</BookingSubject>
                                            </BookingTitleContainer>
                                            <BookingInfoTime>
                                                {booking.date.toDate().toLocaleDateString()} {booking.time}
                                            </BookingInfoTime>
                                        </BookingInfo>
                                    </BookingCard>
                                </DirectLink>
                            ))
                        )}
                    </BookedCoursesContainer>
                </ProfileMiddleContainer>
                <ProfilRightContainer isTeacher={userInfo.userType === 'teacher'}>
                    {userInfo.userType === 'student' && (
                        <>
                            <CourseTitle>購買課程</CourseTitle>
                            <CourseLine />
                            <PurchasedContainer>
                                {userInfo?.courses && Object.entries(userInfo.courses).length > 0 ? (
                                    <CourseCardContainer>
                                        {Object.entries(userInfo.courses).map(([courseId, courseData]) => (
                                            <DirectLink key={courseId} href={`../teacher/${courseData.teacherid}`}>
                                                <CourseCard>
                                                    <CourseInfo>
                                                        <CourseLabel>科目:</CourseLabel>
                                                        <CourseValue>{courseData.subject}</CourseValue>
                                                    </CourseInfo>
                                                    <CourseInfo>
                                                        <CourseLabel>家教:</CourseLabel>
                                                        <CourseValue>{courseData.teachername}</CourseValue>
                                                    </CourseInfo>
                                                    <CourseInfo>
                                                        <CourseLabel>剩餘堂數:</CourseLabel>
                                                        <CourseValue>{courseData.quantity}</CourseValue>
                                                    </CourseInfo>
                                                    <CourseInfo>
                                                        <CourseLabel>價格:</CourseLabel>
                                                        <CourseValue>{courseData.price}</CourseValue>
                                                    </CourseInfo>
                                                </CourseCard>
                                            </DirectLink>
                                        ))}
                                    </CourseCardContainer>
                                ) : (
                                    <NoBookedCourse>
                                        無已購買課程，快去<TeacherLink href={'/teacher/Teachers'}>尋找老師</TeacherLink>
                                        吧！
                                    </NoBookedCourse>
                                )}
                            </PurchasedContainer>
                        </>
                    )}
                </ProfilRightContainer>
            </ProfileWrapper>
            <Footer />
        </MainWrapper>
    );
};

export default UserProfile;
