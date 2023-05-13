import React, { useState } from 'react';
import { Button, Modal, Rate } from 'antd';
import { useRouter } from 'next/router';
import firebase from 'firebase/compat/app';
import { db } from '@/utils/firebase';

interface RatingModalProps {
    classUrlId: string | null;
    userType: string | '';
    userUid: string;
    isVisible: boolean;
    closeModal: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ classUrlId, userType, userUid, isVisible, closeModal }) => {
    const [teacherRating, setTeacherRating] = useState<number | null>(null);
    const router = useRouter();

    const submitRating = async () => {
        if (classUrlId && teacherRating !== null) {
            const userRef = db.collection('users').doc(classUrlId);
            await userRef.update({
                evaluation: firebase.firestore.FieldValue.arrayUnion(teacherRating),
            });
        }
        closeModal();
        router.push(`/teacher/${classUrlId}`);
    };

    return (
        <Modal
            title='為老師評分'
            visible={isVisible}
            onCancel={closeModal}
            footer={[
                <Button key='submit' type='primary' onClick={submitRating} style={{ backgroundColor: '#ffab34' }}>
                    送出
                </Button>,
            ]}
        >
            <Rate onChange={(value: number) => setTeacherRating(value)} />
        </Modal>
    );
};

export default RatingModal;
