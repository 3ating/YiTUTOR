import React, { useEffect, useState } from 'react';
import { FcAlarmClock } from 'react-icons/fc';

interface CountdownTimerProps {
    initialTime: number;
    bothUsersJoined: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialTime, bothUsersJoined }) => {
    const [timeRemaining, setTimeRemaining] = useState(initialTime);

    useEffect(() => {
        if (!bothUsersJoined) return;
        const timer = setInterval(() => {
            setTimeRemaining((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [bothUsersJoined]);

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return (
        <div>
            <FcAlarmClock size={26} /> {minutes}:{formattedSeconds}
        </div>
    );
};

export default CountdownTimer;
