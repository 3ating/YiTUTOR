import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import { db } from '@/utils/firebase';
import { Teacher } from '@/types/Teacher';

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
