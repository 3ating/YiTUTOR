import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Teacher } from '@/types/Teacher';
import { db } from '@/utils/firebase';

export const useTeacher = () => {
    const router = useRouter();
    const { uid } = router.query;
    const [teacher, setTeacher] = useState<Teacher | null>(null);

    useEffect(() => {
        if (uid) {
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

    return teacher;
};
