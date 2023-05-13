import React from 'react';
import { Button, Modal, Rate } from 'antd';
import { useRouter } from 'next/router';
import { db } from '@/utils/firebase';
import firebase from 'firebase/compat';

interface RatingModalProps {
    showRatingModal: boolean;
    classUrlId: string | null;
    onClose: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ showRatingModal, classUrlId, onClose }) => {
    const [teacherRating, setTeacherRating] = React.useState<number | null>(null);
    const router = useRouter();

    const submitRating = async () => {
        if (classUrlId && teacherRating !== null) {
            const userRef = db.collection('users').doc(classUrlId);
            await userRef.update({
                evaluation: firebase.firestore.FieldValue.arrayUnion(teacherRating),
            });
        }
        onClose();
        router.push(`/teacher/${classUrlId}`);
    };

    return (
        <Modal
            title='為老師評分'
            open={showRatingModal}
            onCancel={onClose}
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
