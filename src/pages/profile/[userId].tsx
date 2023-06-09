import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import { UserInfo } from '@/types/User';
import { db } from '@/utils/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import styled from 'styled-components';
import ChatBtn from '../../components/chat/ChatBtn';

type BookedCoursesContainerProps = {
    isBookedCourseEmpty: boolean;
};

type UserInfoKeys = 'email' | 'phone';

interface ProfilRightContainerProps {
    isTeacher: boolean;
}

interface Booking {
    date: firebase.firestore.Timestamp;
    teacherId: string;
    studentId?: string;
    courseTime: { dayLabel: string; time: string };
}

interface BookingWithTeacherInfo extends Booking {
    teacherInfo: TeacherInfo;
}

interface TeacherInfo {
    avatar: string;
    name: string;
    subject: string;
}

interface UserInfoDetails extends UserInfo {
    courses?: object;
    description?: string;
    intro?: string;
    selectedTimes?: {
        day: string;
        hours: number[];
    }[];
    bookings: Booking[];
}

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: antiquewhite;
`;

const UserInfoBox = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    width: 100%;
    padding: 65px 50px 0;
    height: 100vh;
    box-sizing: border-box;
    @media (max-width: 815px) {
        padding: 65px 20px 0;
    }
`;

const Avatar = styled.img`
    width: 60%;
    border-radius: 50%;
    margin: 20px auto;
    aspect-ratio: 1/1;
    object-fit: cover;
`;

const UserInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const UserNameContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
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
    width: 100%;
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
    width: 100%;
    height: 1px;
    background: #000000;
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
`;

const CourseCard = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 800px;
    background-color: #ffffff;
    padding: 15px 10px;
    margin-bottom: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: all 0.3s ease;
    @media screen and (max-width: 850px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const CourseInfo = styled.div`
    display: flex;
    align-items: center;
    font-size: 16px;
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
    object-fit: cover;
    @media screen and (max-width: 850px) {
        width: 60px;
    }
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
    @media screen and (max-width: 850px) {
        font-size: 18px;
    }
`;

const BookingSubject = styled.p`
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: 20px;
    background: #fee690;
    border-radius: 9px;
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
    text-align: center;
    letter-spacing: 0.09em;
    margin: 0;
    @media screen and (max-width: 850px) {
        font-size: 10px;
    }
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
`;

const ProfileMiddleContainer = styled.div<BookedCoursesContainerProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: ${(props) => (props.isBookedCourseEmpty ? '70%' : '35%')};
    padding: 65px 0 0 0;
    box-sizing: border-box;
    @media (max-width: 815px) {
        width: ${(props) => (props.isBookedCourseEmpty ? '60%' : '30%')};
    }
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
    padding: 30px 0;
    box-sizing: border-box;
    justify-content: center;
    overflow: auto;
    max-height: calc(100vh - 230px);
    &::-webkit-scrollbar {
        display: none;
    }
    scrollbar-width: none;
    -ms-overflow-style: none;
    @media screen and (max-width: 1500px) {
        grid-template-columns: 1fr;
    }
`;

const ProfilRightContainer = styled.div<ProfilRightContainerProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: ${(props) => (props.isTeacher ? '0' : '35%')};
    padding: 65px 0 0 0;
    box-sizing: border-box;
    @media (max-width: 815px) {
        width: ${(props) => (props.isTeacher ? '0' : '30%')};
    }
`;

const PurchasedContainer = styled.div`
    display: flex;
    justify-items: center;
    justify-content: center;
    grid-gap: 1rem;
    width: 90%;
    padding: 30px 0;
    box-sizing: border-box;
    overflow: auto;
    max-height: calc(100vh - 230px);
    scrollbar-width: none;
    -ms-overflow-style: none;
`;

const ModifiedInput = styled.input`
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s ease-in-out;
    width: 100%;
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const ProfileLeftContainer = styled.div`
    display: flex;
    width: 30%;
    background: white;

    @media (max-width: 815px) {
        width: 40%;
    }
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

const UserProfile = () => {
    const router = useRouter();
    const { userId } = router.query;
    const [userInfo, setUserInfo] = useState<UserInfoDetails | null>(null);
    const [editedUserInfo, setEditedUserInfo] = useState<UserInfoDetails | null>(null);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [bookingsInfo, setBookingsInfo] = useState<BookingWithTeacherInfo[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
        const { value } = event.target;
        if (editedUserInfo) {
            setEditedUserInfo({ ...editedUserInfo, [fieldName]: value });
        }
    };

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
            ) as unknown as firebase.firestore.CollectionReference<UserInfoDetails>;
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

    useEffect(() => {
        if (userId) {
            const fetchUserData = async () => {
                const userDocRef = doc(db, 'users', userId as string);
                const docSnapshot = await getDoc(userDocRef);
                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data() as UserInfoDetails;
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

    if (!userInfo) {
        return <Loader />;
    }

    return (
        <MainWrapper>
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
                                    href={`/onlineclass/classroom?id=${booking.teacherId || booking.studentId}`}
                                >
                                    <BookingCard>
                                        <BookingAvatar
                                            src={booking.teacherInfo.avatar}
                                            alt={`${booking.teacherInfo.name} 的大頭照`}
                                        />
                                        <BookingInfo>
                                            <BookingTitleContainer>
                                                <BookingInfoTitle>{booking.teacherInfo.name}</BookingInfoTitle>
                                                {userInfo.userType === 'student' && (
                                                    <BookingSubject>{booking.teacherInfo.subject}</BookingSubject>
                                                )}
                                            </BookingTitleContainer>
                                            <BookingInfoTime>
                                                {booking.courseTime.dayLabel} {booking.courseTime.time}
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
                                            <DirectLink key={courseId} href={`../teachers/${courseData.teacherid}`}>
                                                <CourseCard>
                                                    <CourseInfo>
                                                        <CourseValue>{courseData.subject} &nbsp;</CourseValue>
                                                    </CourseInfo>
                                                    <CourseInfo>
                                                        <CourseLabel>老師:</CourseLabel>
                                                        <CourseValue>{courseData.teachername} &nbsp;</CourseValue>
                                                    </CourseInfo>
                                                    <CourseInfo>
                                                        <CourseLabel> 剩餘堂數:</CourseLabel>
                                                        <CourseValue>{courseData.quantity}</CourseValue>
                                                    </CourseInfo>
                                                </CourseCard>
                                            </DirectLink>
                                        ))}
                                    </CourseCardContainer>
                                ) : (
                                    <NoBookedCourse>
                                        <TeacherLink href={'/teachers/allteachers'}>尋找老師</TeacherLink>
                                    </NoBookedCourse>
                                )}
                            </PurchasedContainer>
                        </>
                    )}
                </ProfilRightContainer>
            </ProfileWrapper>
            <ChatBtn />
        </MainWrapper>
    );
};

export default UserProfile;
