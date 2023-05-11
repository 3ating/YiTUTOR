// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { db } from '../utils/firebase';

// export interface Teacher {
//     uid: string;
//     evaluation: number[];
//     subject: any;
//     name: string;
//     email: string;
//     phone: string;
//     userType: string;
//     description?: string;
//     price?: { qty: number; price: number }[];
//     avatar?: string;
// }

// interface TeacherContextValue {
//     teachers: Teacher[];
// }

// const TeacherContext = createContext<TeacherContextValue>({
//     teachers: [],
// });

// export const useTeachers = () => {
//     return useContext(TeacherContext);
// };

// export const TeacherProvider: React.FC = ({ children }) => {
//     const [teachers, setTeachers] = useState<Teacher[]>([]);

//     useEffect(() => {
//         const unsubscribe = db
//             .collection('users')
//             .where('userType', '==', 'teacher')
//             .onSnapshot((snapshot) => {
//                 const teachersData: Teacher[] = snapshot.docs.map((doc) => {
//                     return {
//                         ...doc.data(),
//                         uid: doc.id,
//                     } as unknown as Teacher;
//                 });
//                 setTeachers(teachersData);
//             });
//         return () => {
//             unsubscribe();
//         };
//     }, []);

//     return <TeacherContext.Provider value={{ teachers }}>{children}</TeacherContext.Provider>;
// };
