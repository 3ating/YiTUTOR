import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import ChatRoom from '../chat/ChatRoom';
import { useAuth } from '../../../public/AuthContext';
import ChatIcon from '../chat/ChatIcon';
import Schedule from '../Schedule';
import Calendar from '../Calendar';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { AiFillStar, AiOutlineMail, AiOutlinePhone, AiOutlineStar } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa';
import { BsStarHalf } from 'react-icons/bs';
import { FiAlertTriangle } from 'react-icons/fi';
import { VscDebugBreakpointFunction } from 'react-icons/vsc';
import Button from '@/components/Button';

interface StyledDialogProps {
    open: boolean;
}

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    /* height: 100vh; */
    background-color: antiquewhite;
`;

const TeacherContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const TeacherTopContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 20px;
`;

const TeacherIntroContainer = styled.div`
    width: 95%;
    background-color: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    display: flex;
    padding: 30px 30px;
    border-radius: 9px;
    margin: 0 0 0 10px;
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

const ScrollableContent = styled.div`
    max-height: 200px;
    overflow-y: auto;
    padding-right: 8px;
`;

const AvailableTimeContainer = styled.div`
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    padding: 30px 30px;
    border-radius: 9px;
    margin: 10px 10px 0 10px;
`;

const TeacherBottomContainer = styled.div`
    width: 98.5%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
    /* overflow-y: auto; */
    margin-bottom: 20px;
`;

const CoursePriceContainer = styled.div`
    width: 95%;
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

const Container = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Arial', sans-serif;
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
    /* width: 45px;
    height: 20px; */
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

const SubHeading = styled.h2`
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 0.5rem;
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

const Text = styled.p`
    font-size: 1rem;
    color: #333;
    margin-bottom: 10px;
`;

const TeacherContactContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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
    margin-bottom: 15px;
    object-fit: cover;
    border: 2px solid gray;
`;

const Section = styled.div`
    margin-bottom: 2rem;
    width: 100%;
`;

const DirectLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

const StyledDialog = styled.div<StyledDialogProps>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: ${(props) => (props.open ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
`;

const StyledDialogContent = styled.div`
    background-color: #fff;
    border-radius: 4px;
    padding: 2rem;
    max-width: 800px;
    width: 100%;
    box-sizing: border-box;
`;

const PriceButton = styled.button`
    background-color: #ffffff;
    border-radius: 4px;
    width: 100%;
    color: #000;
    cursor: pointer;
    font-size: 18px;
    font-weight: 500;
    /* padding: 20px; */
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

const ConfirmationDialog = styled.div<StyledDialogProps>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: ${(props) => (props.open ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
`;

const ConfirmationDialogContent = styled.div`
    background-color: #fff;
    border-radius: 4px;
    padding: 2rem;
    max-width: 400px;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
`;

const CalendarAndSchedule = styled.div`
    display: flex;
    flex-wrap: nowrap;
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
    font-size: 25px;
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
    margin-top: 10px;
`;

const CourseContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    /* margin-top: 10px; */
    width: 40%;
`;

const CoursePriceSubHeading = styled.p`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text-align: left;
    width: fit-content;
    /* background-color: #ffab34; */
    color: #000;
    margin: 0;
    height: 50px;
    border-radius: 9px 9px 0 0;
    letter-spacing: 3px;
    font-size: 24px;
    margin: 0;
`;

const OnlineClassImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding-top: 30px;
    padding-bottom: 30px;
`;

const OnlineClassImage = styled(Image)`
    width: 95%;
    height: auto;
    border-radius: 9px;
`;

const ConfirmTitle = styled.h3`
    font-size: 1.5rem;
    margin-bottom: 1rem;
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
    /* margin-right: 1rem; */

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

const PurchaseNotesContainer = styled.div`
    display: flex;
    width: 95%;
    height: 60px;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    flex-direction: row;
    letter-spacing: 1px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border-radius: 9px;
    margin: 0 0 10px 5px;
    padding: 0 25px;
`;

const PurchaseNotes = styled.p`
    font-size: 16px;
    color: gray;
    margin-left: 10px;
`;

const CalendarHintContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: fit-content;
    margin-right: 50px;
`;

const CalendarHintTitle = styled.p`
    font-size: 30px;
    letter-spacing: 2px;
    margin: 0 0 15px 0;
`;

const CalendarHintContentContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
`;

const CalendarHintContent = styled.p`
    font-size: 22px;
    margin: 0;
    margin-left: 5px;
    color: gray;
    letter-spacing: 1px;
`;

const BookButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

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
    evaluation?: string;
    phone?: string;
    price?: { qty: number; price: number }[];
    subject?: string[];
    userType?: string;
    intro?: string;
}

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

    const { user, userInfo, isLoading, userUid } = useAuth();
    const router = useRouter();
    const { uid } = router.query;

    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [openChat, setOpenChat] = useState(false);
    const [currentUser, setCurrentUser] = useState('');

    const [confirmPurchase, setConfirmPurchase] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState({ qty: 0, price: 0 });

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [showBookButtons, setShowBookButtons] = useState(false);

    const handleSelectDate = (date: Date) => {
        setSelectedDate(date);
    };

    // const handleOpenChat = () => {
    //     setOpenChat(true);
    // };

    // const handleCloseChat = () => {
    //     setOpenChat(false);
    // };

    const handlePurchaseClick = (priceObj: { qty: number; price: number }) => {
        setSelectedPrice(priceObj);
        setConfirmPurchase(true);
    };

    const handleConfirmPurchase = async () => {
        console.log(`User confirmed the purchase of ${selectedPrice.qty} classes for ${selectedPrice.price} dollars.`);

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

                console.log('Purchase successfully saved to Firestore');
            } catch (error) {
                console.error('Error updating the student document:', error);
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
        // setSelectedTime(time);
        setShowBookButtons(true);
    };

    const handleConfirmBook = async () => {
        if (!userUid) return;

        try {
            const studentDocRef = db.collection('users').doc(userUid as string);
            const studentDoc = await studentDocRef.get();

            const courses = studentDoc.data()?.courses || [];
            const matchingCourseIndex = courses.findIndex((course: any) => course.teacherid === uid);

            if (matchingCourseIndex === -1) {
                alert('請先購買課程！');
                console.error('No matching course found for the given teacherId');
                return;
            }

            const matchingCourse = courses[matchingCourseIndex];
            matchingCourse.quantity = Math.max(matchingCourse.quantity - 1, 0);

            if (matchingCourse.quantity === 0) {
                courses.splice(matchingCourseIndex, 1);
            }

            await studentDocRef.update({
                bookings: firebase.firestore.FieldValue.arrayUnion({
                    teacherId: uid,
                    date: selectedDate,
                    time: selectedTime,
                }),
                courses,
            });

            // Update the teacher's document with the student's booking information
            const teacherDocRef = db.collection('users').doc(uid as string);
            await teacherDocRef.update({
                bookings: firebase.firestore.FieldValue.arrayUnion({
                    studentId: userUid,
                    date: selectedDate,
                    time: selectedTime,
                }),
            });

            console.log('Booking and courses updated successfully in Firestore');
            const formattedDate = `${selectedDate.getFullYear()}/${
                selectedDate.getMonth() + 1
            }/${selectedDate.getDate()}`;
            alert(`預約成功！預約時間：${formattedDate} ${selectedTime}`);
        } catch (error) {
            alert('預約失敗');
            console.error('Error updating the student document:', error);
        }
        setShowBookButtons(false);
    };

    const handleRejectBook = () => {
        setShowBookButtons(false);
        setSelectedTime('');
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

    const rating = 4;
    const formattedRating = rating.toFixed(1);

    if (!teacher) {
        return <div>Loading...</div>;
    }

    // console.log('userUid:', userUid);
    // console.log('teacherUID', uid);
    console.log('userinfo:', userInfo?.userType);

    // console.log('teacher:', teacher);
    // console.log('selectedTime:', selectedTime);
    // console.log('selectedDate:', selectedDate);

    return (
        <MainWrapper>
            <Header />
            {/* <Container> */}
            <TeacherContainer>
                <TeacherTopContainer>
                    <TeacherIntroContainer>
                        <TeacherAvatarContainer>
                            <Avatar src={teacher.avatar} alt={`${teacher.name} 的大頭照`} />
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
                        </TeacherAvatarContainer>
                        <TeacherContentContainer>
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
                            <TitleLine />
                            <ScrollableContent>
                                <Description>{teacher.description}</Description>
                                <Introduction>{teacher.intro}</Introduction>
                            </ScrollableContent>
                        </TeacherContentContainer>
                    </TeacherIntroContainer>
                    <CourseContainer>
                        {/* <PurchaseNotesContainer>
                            <FiAlertTriangle size={23} />
                            <PurchaseNotes>購買前請確認堂數是否正確</PurchaseNotes>
                        </PurchaseNotesContainer> */}
                        {/* <OnlineClassImage src={onlineclass} alt='Online class' /> */}
                        <CoursePriceContainer>
                            <Section>
                                <CoursePriceSubHeading>課程價格</CoursePriceSubHeading>
                                <TitleLine />
                                <CoursePriceButtonContainer>
                                    {teacher.price &&
                                        teacher.price.map((priceObj: { qty: number; price: number }, idx: number) => {
                                            return (
                                                <PriceButton key={idx} onClick={() => handlePurchaseClick(priceObj)}>
                                                    {priceObj.qty} 堂課: NT$ {priceObj.price} 元
                                                </PriceButton>
                                            );
                                        })}
                                </CoursePriceButtonContainer>
                            </Section>

                            <ConfirmationDialog open={confirmPurchase} onClick={handleCancelPurchase}>
                                <ConfirmationDialogContent onClick={(e) => e.stopPropagation()}>
                                    <ConfirmTitle>確認購買</ConfirmTitle>
                                    <ConfirmText>
                                        您確定要購買 {selectedPrice.qty} 堂課，價格為 {selectedPrice.price} 元嗎？
                                    </ConfirmText>
                                    <ConfirmBuyButton onClick={handleConfirmPurchase}>確認</ConfirmBuyButton>
                                    <ConfirmBuyButton style={{ marginLeft: '10px' }} onClick={handleCancelPurchase}>
                                        取消
                                    </ConfirmBuyButton>
                                </ConfirmationDialogContent>
                            </ConfirmationDialog>
                        </CoursePriceContainer>
                    </CourseContainer>
                </TeacherTopContainer>
                <TeacherBottomContainer>
                    <AvailableTimeContainer>
                        <CalendarHintContainer>
                            <CalendarHintTitle>預定課程須知</CalendarHintTitle>
                            <CalendarHintContentContainer>
                                <VscDebugBreakpointFunction />
                                <CalendarHintContent>排定課程前請先確認有剩餘堂數</CalendarHintContent>
                            </CalendarHintContentContainer>
                            <CalendarHintContentContainer>
                                <VscDebugBreakpointFunction />
                                <CalendarHintContent>若無剩餘堂數請先去購買</CalendarHintContent>
                            </CalendarHintContentContainer>
                            <CalendarHintContentContainer>
                                <VscDebugBreakpointFunction />
                                <CalendarHintContent>先點選日曆中想上課的日期</CalendarHintContent>
                            </CalendarHintContentContainer>
                            <CalendarHintContentContainer>
                                <VscDebugBreakpointFunction />
                                <CalendarHintContent>出現近三天內老師能上課的時段</CalendarHintContent>
                            </CalendarHintContentContainer>
                            <CalendarHintContentContainer>
                                <VscDebugBreakpointFunction />
                                <CalendarHintContent>選定日期與時間後按下確認</CalendarHintContent>
                            </CalendarHintContentContainer>
                            <CalendarHintContentContainer>
                                <VscDebugBreakpointFunction />
                                <CalendarHintContent>課程排定成功 🎉</CalendarHintContent>
                            </CalendarHintContentContainer>
                        </CalendarHintContainer>
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
                                {showBookButtons && (
                                    <BookButtonContainer>
                                        <ConfirmButton onClick={handleConfirmBook}>確認</ConfirmButton>
                                        <RejectButton onClick={handleRejectBook}>拒絕</RejectButton>
                                    </BookButtonContainer>
                                )}
                            </ScheduleContainer>
                        </CalendarAndSchedule>
                    </AvailableTimeContainer>
                </TeacherBottomContainer>
            </TeacherContainer>
            {/* <Heading>{teacher.name}</Heading>
            <Image src={teacher.avatar} alt={`${teacher.name} 的大頭照`} />
            <Section>
                <SubHeading>關於我</SubHeading>
                <Text>{teacher.description}</Text>
            </Section>
            <Section>
                <SubHeading>自我介紹</SubHeading>
                <Text>{teacher.intro}</Text>
            </Section>
            <Section>
                <SubHeading>聯繫方式</SubHeading>
                <Text>電子郵件: {teacher.email}</Text>
                <Text>電話: {teacher.phone}</Text>
            </Section>
            <Section>
                <SubHeading>科目</SubHeading>
                <Text>{teacher.subject?.join(', ')}</Text>
            </Section>
            <Section>
                <SubHeading>課程價格</SubHeading>
                <Text>
                    {teacher.price &&
                        teacher.price.map((priceObj: { qty: number; price: number }, idx: number) => {
                            return (
                                <PriceButton key={idx} onClick={() => handlePurchaseClick(priceObj)}>
                                    {priceObj.qty} 堂課: {priceObj.price} 元
                                </PriceButton>
                            );
                        })}
                </Text>
            </Section>

            <Section>
                <SubHeading>選擇欲預約的日期 & 時間</SubHeading>
                <CalendarAndSchedule>
                    <Calendar handleSelectDate={handleSelectDate} />
                    <ScheduleContainer>
                        <Schedule
                            selectedTimes={teacher.selectedTimes}
                            selectedDate={selectedDate}
                            onTimeSlotClick={handleTimeSlotClick}
                            setSelectedTime={setSelectedTime}
                            selectedTime={selectedTime}
                        />
                        {showBookButtons && (
                            <div>
                                <ConfirmButton onClick={handleConfirmBook}>確認</ConfirmButton>
                                <RejectButton onClick={handleRejectBook}>拒絕</RejectButton>
                            </div>
                        )}
                    </ScheduleContainer>
                </CalendarAndSchedule>
            </Section>

            <ConfirmationDialog open={confirmPurchase} onClick={handleCancelPurchase}>
                <ConfirmationDialogContent onClick={(e) => e.stopPropagation()}>
                    <h3>確認購買</h3>
                    <p>
                        您確定要購買 {selectedPrice.qty} 堂課，價格為 {selectedPrice.price} 元嗎？
                    </p>
                    <button onClick={handleConfirmPurchase}>確認購買</button>
                    <button onClick={handleCancelPurchase}>取消</button>
                </ConfirmationDialogContent>
            </ConfirmationDialog>

            <Section>
                <SubHeading>評價</SubHeading>
                <Text>{teacher.evaluation}</Text>
            </Section>
            
            <DirectLink href={'/teacher/Teachers'}>
                <button>尋找其他教師</button>
            </DirectLink> */}

            {/* <button onClick={handleOpenChat}>與我聊聊</button> */}
            {/* <Dialog open={openChat} onClose={handleCloseChat} maxWidth='md' fullWidth>
                <DialogContent>
                    <ChatRoom teacherId={uid ? (uid as string) : ''} />
                </DialogContent>
            </Dialog> */}

            {/* <ChatIcon onClick={handleOpenChat} />
            <StyledDialog open={openChat} onClick={handleCloseChat}>
                <StyledDialogContent onClick={(e) => e.stopPropagation()}>
                    <ChatRoom selectedUserId={uid ? (uid as string) : ''} />
                </StyledDialogContent>
            </StyledDialog> */}
            {/* </Container> */}
            <Footer />
        </MainWrapper>
    );
};

export default TeacherDetails;
