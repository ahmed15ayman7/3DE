"use client"
import React, { Suspense,   useEffect } from 'react';
import dynamic from 'next/dynamic';
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div>});
const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div></div> });
const DataGrid = dynamic(() => import('@/components/common/DataGrid'), { loading: () => <div></div> });

import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@/lib/api';
import { useUser } from '@/hooks/useUser';
import { Course,Instructor,Lesson,Quiz,User,File as FileModel } from '@shared/prisma';
import { redirect } from 'next/navigation';

let getCoursesData = async (id: string) => {
    const response = await courseApi.getByStudentId(id);
    return response.data;
}


 function StudentCourses() {
    let {user} = useUser();
    const { data: courses, isLoading: isLoadingCourses ,refetch} = useQuery({
        queryKey: ['courses'],
        queryFn: () => getCoursesData(user?.id),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        // placeholderData: (previousData) => previousData ?? activeCourses,
    });
    useEffect(() => {
        refetch();
    }, [user]);
    // const activeCourses: (Course & { instructors: (Instructor & { user: User })[], lessons: (Lesson & { files: FileModel[], quizzes: Quiz[] })[] })[] = [
    //     {
    //         id: '1',
    //         title: 'البرمجة بلغة Python',
    //         instructors: [
    //             {
    //                 id: '1',
    //                 academyId: '1',
    //                 userId: '1',
    //                 title: 'مدرس تطوير الويب',
    //                 user: {
    //                     id: '1',
    //                     firstName: 'أحمد',
    //                     lastName: 'محمد',
    //                     email: 'ahmed@gmail.com',
    //                     phone: '01234567890',
    //                     role: 'STUDENT',
    //                     subRole: 'STUDENT',
    //                     isVerified: true,
    //                     age: 20,
    //                     createdAt: new Date(),
    //                     updatedAt: new Date(),
    //                     password: '123456',
    //                     avatar: 'https://via.placeholder.com/150',
    //                     isOnline: true,
    //                     academyId: '1',
                        
    //                 },
    //             },
    //         ],
    //         lessons: [
    //             {
    //                 id: '1',
    //                 title: 'الوظائف والدوال',
    //                 files: [],
    //                 quizzes: [],
    //                 createdAt: new Date(),
    //                 updatedAt: new Date(),
    //                 status: 'COMPLETED',
    //                 content: 'الوظائف والدوال',
    //                 courseId: '1',
    //             },
    //         ],
    //         description: 'البرمجة بلغة Python',
    //         academyId: '1',
    //         image: 'https://via.placeholder.com/150',
    //         level: 'مبتدئ',
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         status: 'ACTIVE',

    //     },
    //     {
    //         id: '2',
    //         title: 'تطوير تطبيقات الويب',
    //         instructors: [
    //             {
    //                 id: '1',
    //                 academyId: '1',
    //                 userId: '1',
    //                 title: 'مدرس HTML',
    //                 user: {
    //                     id: '1',
    //                     firstName: 'سارة',
    //                     lastName: 'أحمد',
    //                     email: 'sara@gmail.com',
    //                     phone: '01234567890',
    //                     role: 'STUDENT',
    //                     subRole: 'STUDENT',
    //                     isVerified: true,
    //                     age: 20,
    //                     createdAt: new Date(),
    //                     updatedAt: new Date(),
    //                     password: '123456',
    //                     avatar: 'https://via.placeholder.com/150',
    //                     isOnline: true,
    //                     academyId: '1',
                        
    //                 },          
    //             },
    //         ],
    //         lessons: [
    //             {
    //                 id: '1',
    //                 title: 'CSS المتقدم',
    //                 files: [],
    //                 quizzes: [],
    //                 createdAt: new Date(),
    //                 updatedAt: new Date(),
    //                 status: 'COMPLETED',
    //                 content: 'CSS المتقدم',
    //                 courseId: '1',
    //             },
    //         ],
    //         description: 'تطوير تطبيقات الويب',
    //         academyId: '1',
    //         image: 'https://via.placeholder.com/150',
    //         level: 'متقدم',
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         status: 'ACTIVE',
    //     },
    // ];

    // const completedCourses: (Course & { instructors: (Instructor & { user: User })[], lessons: (Lesson & { files: FileModel[], quizzes: Quiz[] })[] })[] = [
    //     {
    //         id: '3',
    //         title: 'أساسيات HTML',
    //         instructors: [
    //             {
    //                 id: '1',
    //                 academyId: '1',
    //                 userId: '1',
    //                 title: 'مدرس تطوير الويب',
    //                 user: {
    //                     id: '1',
    //                     firstName: 'محمد',
    //                     lastName: 'علي',
    //                     email: 'mohamed@gmail.com',
    //                     phone: '01234567890',
    //                     role: 'STUDENT',
    //                     subRole: 'STUDENT',
    //                     isVerified: true,
    //                     age: 20,
    //                     createdAt: new Date(),
    //                     updatedAt: new Date(),
    //                     password: '123456',
    //                     avatar: 'https://via.placeholder.com/150',
    //                     isOnline: true,
    //                     academyId: '1',
                        
    //                 },
    //             },
    //         ],
    //         lessons: [
    //             {
    //                 id: '1',
    //                 title: 'HTML المتقدم',
    //                 files: [],
    //                 quizzes: [],
    //                 createdAt: new Date(),
    //                 updatedAt: new Date(),
    //                 status: 'COMPLETED',
    //                 content: 'HTML المتقدم',
    //                 courseId: '1',
    //             },
    //             {
    //                 id: '2',
    //                 title: 'CSS المتقدم',
    //                 files: [],
    //                 quizzes: [],
    //                 createdAt: new Date(),
    //                 updatedAt: new Date(),
    //                 status: 'COMPLETED',
    //                 content: 'CSS المتقدم',
    //                 courseId: '1',
    //             },
    //         ],
    //         description: 'أساسيات HTML',
    //         academyId: '1',
    //         image: 'https://via.placeholder.com/150',
    //         level: 'مبتدئ',
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         status: 'COMPLETED',
    //     },
    //     {
    //         id: '4',
    //         title: 'أساسيات CSS',
    //         instructors: [
    //             {
    //                 id: '1',
    //                 academyId: '1',
    //                 userId: '1',
    //                 title: 'مدرس CSS',
    //                 user: {
    //                     id: '1',
    //                     firstName: 'فاطمة',
    //                     lastName: 'حسن',
    //                     email: 'fatma@gmail.com',
    //                     phone: '01234567890',
    //                     role: 'STUDENT',
    //                     subRole: 'STUDENT',
    //                     isVerified: true,
    //                     age: 20,
    //                     createdAt: new Date(),
    //                     updatedAt: new Date(),
    //                     password: '123456',
    //                     avatar: 'https://via.placeholder.com/150',
    //                     isOnline: true,
    //                     academyId: '1',
                        
    //                 },
    //             },
    //         ],
    //         lessons: [
    //             {
    //                 id: '1',
    //                 title: 'CSS المتقدم',
    //                 files: [],
    //                 quizzes: [],
    //                 createdAt: new Date(),
    //                 updatedAt: new Date(),
    //                 status: 'COMPLETED',
    //                 content: 'CSS المتقدم',
    //                 courseId: '1',
    //             },
    //             {
    //                 id: '2',
    //                 title: 'HTML المتقدم',
    //                 files: [],
    //                 quizzes: [],
    //                 createdAt: new Date(),
    //                 updatedAt: new Date(),
    //                 status: 'COMPLETED',
    //                 content: 'HTML المتقدم',
    //                 courseId: '1',
    //             },
    //             {
    //                 id: '3',
    //                 title: 'JavaScript المتقدم',
    //                 files: [],
    //                 quizzes: [],
    //                 createdAt: new Date(),
    //                 updatedAt: new Date(),
    //                 status: 'COMPLETED',
    //                 content: 'JavaScript المتقدم',
    //                 courseId: '1',
    //             },
    //         ],
    //         description: 'أساسيات CSS',
    //         academyId: '1',
    //         image: 'https://via.placeholder.com/150',
    //         level: 'مبتدئ',
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         status: 'COMPLETED',
    //     },
    // ];

    const activeColumns = [
        { field: 'title', headerName: 'عنوان الكورس', width: 200 },
        { field: 'instructor', headerName: 'المدرس', width: 150 },
        { field: 'progress', headerName: 'التقدم', width: 100 },
        { field: 'lastAccessed', headerName: 'آخر دخول', width: 150 },
        { field: 'nextLesson', headerName: 'الدرس التالي', width: 200 },
    ];

    const completedColumns = [
        { field: 'title', headerName: 'عنوان الكورس', width: 200 },
        { field: 'instructor', headerName: 'المدرس', width: 150 },
        { field: 'completionDate', headerName: 'تاريخ الإكمال', width: 150 },
        { field: 'grade', headerName: 'الدرجة', width: 100 },
        {
            field: 'certificate', headerName: 'الشهادة', width: 400, renderCell: (params: any) => {
                return <img src={params.row.certificate} alt="certificate" className="w-16 h-16 border border-primary-main p-1" onClick={()=>{}} />
            }
        },
    ];
    let progress = 0;

    let nextLesson = '';
    if(Array.isArray(courses)){
        progress = courses.reduce((acc, course) => acc + course.lessons.filter((lesson) => lesson.status === 'COMPLETED').length, 0);
        nextLesson = courses.find((course) => course.lessons.find((lesson) => lesson.status === 'NOT_STARTED'))?.lessons[0].title ?? '';
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">كورساتي</h1>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">الكورسات النشطة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.isArray(courses) && courses.map((course) => (
                        <Card
                            key={course.id}
                            title={course.title}
                            description={`المدرس: ${course.instructors[0].user.firstName} ${course.instructors[0].user.lastName}`}
                            className="h-full"
                        >
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 ">
                                        التقدم
                                    </span>
                                    <span className="font-medium">{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200  rounded-full h-2">
                                    <div
                                        className="bg-primary-main h-2 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                {/* <div className="text-sm text-gray-600 ">
                                    آخر دخول: {course.lastAccessed}
                                </div> */}
                                <div className="text-sm text-gray-600 ">
                                    الدرس التالي: {nextLesson}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">الكورسات المكتملة</h2>
                <DataGrid
                    columns={completedColumns}
                    rows={Array.isArray(courses) ? courses.filter((course) => course.status === 'COMPLETED') : []}
                    pageSize={5}
                    checkboxSelection={false}
                />
            </div>
        </div>
    );
} 
export default function StudentCoursesS() {
    redirect('/student/courses/overview');
    // return null;
}