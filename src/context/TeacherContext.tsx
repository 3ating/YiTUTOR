import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import { db } from '@/utils/firebase';

export interface Teacher {
    uid: string;
    evaluation: number[];
    subject: any;
    name: string;
    email: string;
    phone: string;
    userType: string;
    description?: string;
    price?: { qty: number; price: number }[];
    avatar?: string;
}
interface TeacherContextProps {
    teachers: Teacher[];
    setTeachers: Dispatch<SetStateAction<Teacher[]>>;
}

interface TeacherProviderProps {
    children: ReactNode;
}

export const TeacherContext = createContext<TeacherContextProps>({
    teachers: [],
    setTeachers: () => {},
});

export const useTeachers = (): TeacherContextProps => {
    return useContext(TeacherContext);
};

export const TeachersProvider = ({ children }: TeacherProviderProps) => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    useEffect(() => {
        const unsubscribe = db
            .collection('users')
            .where('userType', '==', 'teacher')
            .onSnapshot((snapshot) => {
                const teachersData: Teacher[] = snapshot.docs.map((doc) => {
                    return {
                        ...doc.data(),
                        uid: doc.id,
                    } as unknown as Teacher;
                });
                setTeachers(teachersData);
            });

        return () => {
            unsubscribe();
        };
    }, []);

    return <TeacherContext.Provider value={{ teachers, setTeachers }}>{children}</TeacherContext.Provider>;
};
