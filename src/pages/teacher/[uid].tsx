import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import styled from 'styled-components';
import Link from 'next/link';
import ChatRoom from '../chat/ChatRoom';
import { useAuth } from '../../../public/AuthContext';
import ChatIcon from '../chat/ChatIcon';
import Schedule from '../Schedule';
import Calendar from '../Calendar';

interface StyledDialogProps {
    open: boolean;
}

const Container = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Arial', sans-serif;
`;

const Heading = styled.h1`
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 1rem;
`;

const SubHeading = styled.h2`
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 0.5rem;
`;

const Text = styled.p`
    font-size: 1rem;
    color: #333;
    line-height: 1.5;
`;

const Image = styled.img`
    max-width: 200px;
    border-radius: 50%;
    margin-bottom: 1rem;
`;

const Section = styled.div`
    margin-bottom: 2rem;
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
    z-index: 999;
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
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    color: #333;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0;
    transition: all 0.2s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    &:hover {
        color: #0070f3;
        border-color: #0070f3;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    align-items: center;
`;

const ConfirmButton = styled.button`
    background-color: #4caf50;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
        background-color: #45a049;
    }
`;

const RejectButton = styled.button`
    background-color: #f44336;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
        background-color: #e42a15;
    }
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
    };

    if (!teacher) {
        return <div>Loading...</div>;
    }

    console.log('userUid:', userUid);
    console.log('teacherUID', uid);
    // console.log('userinfo:', userInfo);

    // console.log('teacher:', teacher);
    console.log('selectedTime:', selectedTime);
    console.log('selectedDate:', selectedDate);
    console.log(showBookButtons);

    return (
        <Container>
            <Heading>{teacher.name}</Heading>
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
                    {/* <Schedule selectedTimes={teacher.selectedTimes} /> */}
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
            <Section>
                <SubHeading>認證</SubHeading>
                <Text>{teacher.certification ? '是' : '否'}</Text>
            </Section>
            {teacher.document && (
                <Section>
                    <SubHeading>證書</SubHeading>
                    <a href={teacher.document}>查看證書</a>
                </Section>
            )}
            <DirectLink href={'/teacher/Teachers'}>
                <button>尋找其他教師</button>
            </DirectLink>
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
        </Container>
    );
};

export default TeacherDetails;
