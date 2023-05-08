import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import styled from 'styled-components';
import { useAuth } from '../../../public/AuthContext';
import Schedule from '../Schedule';
import Calendar from '../Calendar';
import { AiFillStar, AiOutlineMail, AiOutlinePhone, AiOutlineStar } from 'react-icons/ai';
import { BsStarHalf } from 'react-icons/bs';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import { Modal, notification } from 'antd';
import ReservationNotice from './ReservationNotice';
import AIChat from '../../components/AIChatBtn';

interface Teacher {
    selectedTimes: { day: string; hours: number[] }[];
    uid: string;
    name: string;
    description?: string;
    avatar?: string;
    certification?: boolean;
    courses?: Record<string, any>;
    document?: string;
    email?: string;
    phone?: string;
    price?: { qty: number; price: number }[];
    subject?: string[];
    userType?: string;
    intro?: string;
    evaluation?: number[];
}

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    background-color: antiquewhite;
    margin: 65px 0;
`;

const TeacherContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 30px;
`;

const TeacherLeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 70%;
`;

const TeacherIntroContainer = styled.div`
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    display: flex;
    padding: 50px;
    border-radius: 9px;
    margin: 0 0 10px;
`;

const TeacherAvatarContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;

const TeacherContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`;

const TeacherTextContainer = styled.div``;

const AvailableTimeContainer = styled.div`
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 50px;
    border-radius: 9px;
    margin: 0;
`;

const TeacherRightContainer = styled.div`
    width: 30%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    padding-left: 5px;
    position: fixed;
    right: 5px;
    top: 95px;
    height: 100%;
    overflow-y: auto;
`;

const CoursePriceContainer = styled.div`
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    border-radius: 9px;
    margin: 0;
    padding: 25px;
`;

const TeacherNameContainer = styled.div`
    display: flex;
    align-items: flex-end;
`;

const TeacherName = styled.h1`
    font-size: 40px;
    color: #333;
    margin: 0;
    letter-spacing: 3px;
`;

const TeacherSubjectContainer = styled.div`
    width: 50px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fee690;
    border-radius: 9px;
    margin: 0 0 8px 10px;
`;

const TeacherSubject = styled.p`
    background: #fee690;
    border-radius: 9px;
    font-weight: 500;
    font-size: 18px;
    line-height: 17px;
    text-align: center;
    margin-bottom: 10px;
    margin: 0;
`;

const RatingContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 8px 0 20px 0;
`;

const RatingNumber = styled.p`
    font-size: 18px;
    font-weight: 550;
    margin: 0 5px 0 0;
`;

const StarIcon = styled(AiFillStar)`
    color: #f5c518;
`;

const EmptyStarIcon = styled(AiOutlineStar)`
    color: #f5c518;
`;

const HalfStarIcon = styled(BsStarHalf)`
    color: #f5c518;
`;

const Description = styled.p`
    font-size: 16px;
    color: gray;
    margin: 10px 0 20px;
    letter-spacing: 0.5px;
`;

const Introduction = styled.p`
    font-size: 18px;
    margin: 0;
    letter-spacing: 0.5px;
`;

const NameTopContainer = styled.div`
    display: flex;
    margin-bottom: 30px;
    /* justify-content: center; */
`;

const NameRatingContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const TeacherContactContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 25px;
`;

const TeacherEmailContainer = styled.div`
    display: flex;
    align-items: center;
`;

const TeacherEmail = styled.p`
    font-size: 20px;
    color: #000;
    margin: 0 0 0 10px;
    letter-spacing: 0.5px;
`;

const TeacherPhoneContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
`;

const TeacherPhone = styled(TeacherEmail)``;

const Avatar = styled.img`
    max-width: 200px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid gray;
    aspect-ratio: 1/1;
`;

const Section = styled.div`
    margin-bottom: 2rem;
    width: 100%;
`;

const PriceButton = styled.button`
    background-color: #ffffff;
    border-radius: 4px;
    width: 100%;
    color: #000;
    cursor: pointer;
    font-size: 18px;
    font-weight: 500;
    font-size: 20px;
    margin: 0.5rem 0;
    border: 2px solid gray;
    transition: all 0.2s;
    height: 55px;
    &:hover {
        background-color: #000;
        color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    }
`;

const CalendarAndSchedule = styled.div`
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 30px;
`;

const ScheduleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    margin-left: 50px;
    width: 540px;
`;

const ScheduleTitle = styled.p`
    font-size: 30px;
    margin: 0 0 15px;
    letter-spacing: 1px;
`;

const ConfirmButton = styled(Button)`
    background-color: #ffab34;
    letter-spacing: 2px;
    margin-right: 10px;
    &:hover {
        background-color: #f9b352;
    }
`;

const RejectButton = styled(Button)`
    margin-left: 10px;
`;

const CoursePriceButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 25px 0;
`;

const CourseContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const CoursePriceSubHeading = styled.p`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text-align: left;
    width: fit-content;
    color: #000;
    margin: 0;
    height: 50px;
    border-radius: 9px 9px 0 0;
    letter-spacing: 3px;
    font-size: 24px;
    margin: 0;
`;

const ConfirmText = styled.p`
    font-size: 1rem;
    margin-bottom: 1.5rem;
`;

const ConfirmBuyButton = styled.button`
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    &:first-of-type {
        background-color: #ffab34;
        color: #ffffff;
        border: 1px solid #ffab34;
    }
    &:last-of-type {
        background-color: #000;
        color: #ffffff;
        border: 1px solid #000;
    }
    &:hover {
        opacity: 0.9;
    }
`;

const TitleLine = styled.div`
    width: 100%;
    height: 1px;
    background: gray;
`;

const BookButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

interface ChatRoomProps {
    teacherId?: string | string[] | undefined;
}

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

const TeacherDetails = () => {
    const ICON_SIZE = 20;
    const router = useRouter();
    const { uid } = router.query;
    const { userInfo, isLoading, userUid } = useAuth();
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [confirmPurchase, setConfirmPurchase] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState({ qty: 0, price: 0 });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<{ dayLabel: string; time: string } | null>(null);
    const [showBookButtons, setShowBookButtons] = useState(false);

    const handleSelectDate = (date: Date) => {
        setSelectedDate(date);
    };

    const handlePurchaseClick = (priceObj: { qty: number; price: number }) => {
        if (userInfo?.userType !== 'student' || !isLoading) {
            notification.error({
                message: '購買課程失敗',
                description: '請確認是否登入 / 是否為學生身份',
                placement: 'topRight',
            });
        } else {
            setSelectedPrice(priceObj);
            setConfirmPurchase(true);
        }
    };

    const handleConfirmPurchase = async () => {
        if (userUid) {
            try {
                const studentDocRef = db.collection('users').doc(userUid);
                await studentDocRef.update({
                    courses: firebase.firestore.FieldValue.arrayUnion({
                        teachername: teacher?.name,
                        teacherid: uid,
                        subject: teacher?.subject,
                        quantity: selectedPrice.qty,
                        price: selectedPrice.price,
                        purchaseDate: new Date(),
                    }),
                });

                notification.success({
                    message: '購買成功',
                    description: `您已成功購買 ${selectedPrice.qty} 堂課，價格為 ${selectedPrice.price} 元。`,
                });
            } catch (error) {
                notification.error({
                    message: '購買失敗',
                    description: '很抱歉，無法完成購買。請稍後再試。',
                });
            }
        }
        setConfirmPurchase(false);
    };

    const handleCancelPurchase = () => {
        setConfirmPurchase(false);
    };

    useEffect(() => {
        if (uid) {
            const db = firebase.firestore();
            db.collection('users')
                .doc(uid as string)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        const teacherData = doc.data() as Teacher;
                        setTeacher(teacherData);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching teacher details:', error);
                });
        }
    }, [uid]);

    const handleTimeSlotClick = () => {
        if (userInfo?.userType === 'teacher' || !isLoading) {
            notification.error({
                message: '預約時間失敗',
                description: '請確認是否登入 / 是否為學生身份',
                placement: 'topRight',
            });
        } else {
            setShowBookButtons(true);
        }
    };

    const getSelectedDate = (dayLabel: string) => {
        const [month, day] = dayLabel.split('/').map(Number);
        const date = new Date(selectedDate);
        date.setMonth(month - 1);
        date.setDate(day);
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const handleConfirmBook = async () => {
        if (!userUid || !selectedTime) return;
        setShowBookButtons(false);

        try {
            const studentDocRef = db.collection('users').doc(userUid as string);
            const studentDoc = await studentDocRef.get();

            const courses = studentDoc.data()?.courses || [];
            const matchingCourseIndex = courses.findIndex((course: any) => course.teacherid === uid);

            if (matchingCourseIndex === -1) {
                notification.error({
                    message: '預約時間失敗',
                    description: '請先購買課程',
                    placement: 'topRight',
                });
                return;
            }

            const matchingCourse = courses[matchingCourseIndex];
            matchingCourse.quantity = Math.max(matchingCourse.quantity - 1, 0);

            if (matchingCourse.quantity === 0) {
                courses.splice(matchingCourseIndex, 1);
            }

            const bookingDate = getSelectedDate(selectedTime.dayLabel);
            bookingDate.setHours(parseInt(selectedTime.time.split(':')[0]));

            await studentDocRef.update({
                bookings: firebase.firestore.FieldValue.arrayUnion({
                    teacherId: uid,
                    date: bookingDate,
                    courseTime: selectedTime,
                }),
                courses,
            });

            const teacherDocRef = db.collection('users').doc(uid as string);
            await teacherDocRef.update({
                bookings: firebase.firestore.FieldValue.arrayUnion({
                    studentId: userUid,
                    date: bookingDate,
                    courseTime: selectedTime,
                }),
            });
            const formattedDate = `${bookingDate.getFullYear()}/${bookingDate.getMonth() + 1}/${bookingDate.getDate()}`;
            notification.success({
                message: '預約成功',
                description: `預約時間：${formattedDate} ${selectedTime.time}`,
            });
        } catch (error) {
            notification.error({
                message: '預約時間失敗',
                description: '請確認是否有購買課程',
                placement: 'topRight',
            });
        }
    };

    const handleRejectBook = () => {
        setShowBookButtons(false);
        setSelectedTime(null);
    };

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const stars = [];
        const totalStars = 5;
        for (let i = 0; i < fullStars; i++) {
            stars.push(<StarIcon key={i} />);
        }
        if (hasHalfStar) {
            stars.push(<HalfStarIcon key={fullStars} />);
        }
        for (let i = stars.length; i < totalStars; i++) {
            stars.push(<EmptyStarIcon key={i} />);
        }
        return stars;
    };

    const calculateAverageRating = (evaluations: number[] | undefined) => {
        if (!evaluations || evaluations.length === 0) {
            return 0;
        }

        const sum = evaluations.reduce((acc, current) => acc + current, 0);
        return sum / evaluations.length;
    };

    const rating = calculateAverageRating(teacher?.evaluation);
    const formattedRating = rating.toFixed(1);

    if (!teacher) {
        return <Loader />;
    }

    // console.log('userUid:', userUid);
    // console.log('teacherUID', uid);
    // console.log('userinfo:', userInfo);

    console.log('teacher:', teacher);
    // console.log('selectedTime:', selectedTime);
    // console.log('selectedDate:', selectedDate);

    return (
        <MainWrapper>
            <TeacherContainer>
                <TeacherLeftContainer>
                    <TeacherIntroContainer>
                        <TeacherContentContainer>
                            <NameTopContainer>
                                <TeacherAvatarContainer>
                                    <Avatar src={teacher.avatar} alt={`${teacher.name} 的大頭照`} />
                                </TeacherAvatarContainer>
                                <NameRatingContainer>
                                    <TeacherNameContainer>
                                        <TeacherName>{teacher.name}</TeacherName>
                                        <TeacherSubjectContainer>
                                            <TeacherSubject>{teacher.subject?.join(', ')}</TeacherSubject>
                                        </TeacherSubjectContainer>
                                    </TeacherNameContainer>
                                    <RatingContainer>
                                        <RatingNumber>{formattedRating}</RatingNumber>
                                        {renderStars(rating)}
                                    </RatingContainer>
                                </NameRatingContainer>
                            </NameTopContainer>
                            <TitleLine />
                            <TeacherTextContainer>
                                <Description>{teacher.description}</Description>
                                <Introduction>{teacher.intro}</Introduction>
                            </TeacherTextContainer>
                        </TeacherContentContainer>
                    </TeacherIntroContainer>

                    <AvailableTimeContainer>
                        <CalendarAndSchedule>
                            <Calendar
                                handleSelectDate={handleSelectDate}
                                setSelectedTime={setSelectedTime}
                                setShowBookButtons={setShowBookButtons}
                            />
                            <ScheduleContainer>
                                <div>
                                    <ScheduleTitle>可預約時段</ScheduleTitle>
                                    <Schedule
                                        selectedTimes={teacher.selectedTimes}
                                        selectedDate={selectedDate}
                                        onTimeSlotClick={handleTimeSlotClick}
                                        setSelectedTime={setSelectedTime}
                                        selectedTime={selectedTime}
                                    />
                                </div>
                                {showBookButtons && selectedTime && (
                                    <BookButtonContainer>
                                        <ConfirmButton onClick={handleConfirmBook}>確認</ConfirmButton>
                                        <RejectButton onClick={handleRejectBook}>取消</RejectButton>
                                    </BookButtonContainer>
                                )}
                            </ScheduleContainer>
                        </CalendarAndSchedule>
                        <TitleLine />
                        <ReservationNotice />
                    </AvailableTimeContainer>
                </TeacherLeftContainer>

                <TeacherRightContainer>
                    <CourseContainer>
                        <CoursePriceContainer>
                            <Section>
                                <CoursePriceSubHeading>課程價格</CoursePriceSubHeading>
                                <TitleLine />
                                <CoursePriceButtonContainer>
                                    {teacher.price &&
                                        teacher.price.map((priceObj: { qty: number; price: number }, idx: number) => {
                                            return (
                                                <PriceButton key={idx} onClick={() => handlePurchaseClick(priceObj)}>
                                                    {priceObj.qty} 堂課 NT${priceObj.price} 元
                                                </PriceButton>
                                            );
                                        })}
                                </CoursePriceButtonContainer>
                                <CoursePriceSubHeading>聯絡老師</CoursePriceSubHeading>
                                <TitleLine />
                                <TeacherContactContainer>
                                    <TeacherEmailContainer>
                                        <AiOutlineMail size={ICON_SIZE} />
                                        <TeacherEmail>{teacher.email}</TeacherEmail>
                                    </TeacherEmailContainer>
                                    <TeacherPhoneContainer>
                                        <AiOutlinePhone size={ICON_SIZE} />
                                        <TeacherPhone>{teacher.phone}</TeacherPhone>
                                    </TeacherPhoneContainer>
                                </TeacherContactContainer>
                            </Section>

                            {userInfo?.userType !== 'teacher' && (
                                <Modal
                                    title='確認購買'
                                    open={confirmPurchase}
                                    onCancel={handleCancelPurchase}
                                    footer={[
                                        <ConfirmBuyButton key='confirm' onClick={handleConfirmPurchase}>
                                            確認
                                        </ConfirmBuyButton>,
                                        <ConfirmBuyButton
                                            key='cancel'
                                            style={{ marginLeft: '10px' }}
                                            onClick={handleCancelPurchase}
                                        >
                                            取消
                                        </ConfirmBuyButton>,
                                    ]}
                                >
                                    <ConfirmText>
                                        您確定要購買 {selectedPrice.qty} 堂課，價格為 {selectedPrice.price} 元嗎？
                                    </ConfirmText>
                                </Modal>
                            )}
                        </CoursePriceContainer>
                    </CourseContainer>
                </TeacherRightContainer>
            </TeacherContainer>
            <AIChat />
        </MainWrapper>
    );
};

export default TeacherDetails;
