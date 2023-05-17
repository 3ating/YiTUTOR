import React from 'react';
import styled from 'styled-components';

const ScheduleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 0;
    align-items: flex-start;
`;

const DayRow = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    max-width: 500px;
    flex-wrap: wrap;
    gap: 5px;
    margin-left: 5px;
`;

const TimeContainer = styled.div`
    display: flex;
    margin-top: 20px;
    align-items: center;
`;

const DayLabel = styled.div`
    width: 40px;
    font-size: 18px;
    /* text-align: center; */
    font-weight: bold;
`;

const TimeSlot = styled.div<{ selected: boolean; active: boolean }>`
    width: 100px;
    height: 35px;
    border: 2px solid #ccc;
    border-radius: 4px;
    background-color: ${(props) => (props.active ? '#ffab34' : props.selected ? 'white' : '#f0f0f0')};
    color: ${(props) => (props.active ? '#fff' : props.selected ? '#333' : '#666')};
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: ${(props) => (props.selected ? 'pointer' : 'not-allowed')};
    transition: all 0.2s ease-in-out;
    margin: 0;

    ${(props) =>
        props.selected &&
        `
        &:hover {
            background-color: #ffab34;
            color: #fff;
            border-color: #ffab34; 
        }
    `}
`;

const NoTimeContent = styled.p`
    font-size: 20px;
    color: gray;
    letter-spacing: 2px;
    line-height: 35px;
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
}

interface ScheduleProps {
    selectedTimes: { day: string; hours: number[] }[];
    userInfo?: UserInfo;
    selectedDate: Date;
    onTimeSlotClick: () => void;
    setSelectedTime: (selectedTime: { dayLabel: string; time: string } | null) => void;
    selectedTime: { dayLabel: string; time: string } | null;
}

const Schedule: React.FC<ScheduleProps> = ({
    selectedTimes,
    selectedDate = new Date(),
    onTimeSlotClick,
    setSelectedTime,
    selectedTime,
}) => {
    const dayMapping = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDate = selectedDate.getDay();

    const getToday = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    };

    const isDateInPast = (date: Date) => {
        return date < getToday();
    };

    const getWeekdays = () => {
        return Array.from({ length: 3 }, (_, i) => {
            const day = new Date(selectedDate);
            day.setDate(selectedDate.getDate() + i);
            return day;
        });
    };

    const getSelectedTimesForDay = (dayIndex: number) => {
        const dayName = dayMapping[dayIndex];
        const dayData = selectedTimes?.find((item) => item.day === dayName);
        return dayData ? dayData.hours : [];
    };

    const renderTimeSlots = (hours: number[], day: string, dayLabel: string) => {
        return hours
            .filter((hour) => hour >= 9 && hour <= 21)
            .map((hour) => (
                <TimeSlot
                    key={`${day}-${hour}`}
                    selected
                    active={selectedTime?.dayLabel === dayLabel && selectedTime?.time === `${hour}:00`}
                    onClick={() => handleTimeSlotClick(`${hour}:00`, dayLabel)}
                >
                    {hour}:00
                </TimeSlot>
            ));
    };

    const handleTimeSlotClick = (time: string, dayLabel: string) => {
        onTimeSlotClick();
        setSelectedTime(selectedTime?.time === time && selectedTime.dayLabel === dayLabel ? null : { dayLabel, time });
    };

    const availability = getWeekdays().reduce(
        (acc, date, index) => {
            const dayIndex = (currentDate + index) % 7;
            const hours = getSelectedTimesForDay(dayIndex);
            if (isDateInPast(date)) {
                acc.pastDate = true;
            } else if (hours.length > 0) {
                acc.available = true;
            }
            return acc;
        },
        { available: false, pastDate: false }
    );

    return (
        <ScheduleContainer>
            {getWeekdays().map((date, index) => {
                if (isDateInPast(date)) {
                    return null;
                }
                const dayIndex = (currentDate + index) % 7;
                const hours = getSelectedTimesForDay(dayIndex);
                if (hours.length > 0) {
                    const dateLabel = date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
                    return (
                        <TimeContainer key={index}>
                            <DayLabel>{dateLabel}</DayLabel>
                            <DayRow>{renderTimeSlots(hours, dayMapping[dayIndex], dateLabel)}</DayRow>
                        </TimeContainer>
                    );
                } else {
                    return null;
                }
            })}
            {!availability.available && (
                <NoTimeContent>
                    {availability.pastDate ? (
                        <>
                            日期已過 <br /> 請選擇其他日期
                        </>
                    ) : (
                        <>
                            近三日無可預約時段 <br /> 請選擇其他日期
                        </>
                    )}
                </NoTimeContent>
            )}
        </ScheduleContainer>
    );
};

export default Schedule;
