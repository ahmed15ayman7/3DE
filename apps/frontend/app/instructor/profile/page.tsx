import React from 'react';
import dynamic from 'next/dynamic';
const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div>جاري التحميل...</div> });

export default function InstructorProfile() {

    const profile = {
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        specialization: 'تطوير البرمجيات',
        experience: '5 سنوات',
        bio: 'مطور برمجيات ومدرس متخصص في تطوير تطبيقات الويب والذكاء الاصطناعي. حاصل على شهادة الماجستير في علوم الحاسب.',
        courses: [
            {
                id: 1,
                title: 'البرمجة بلغة Python',
                students: 45,
                rating: 4.8,
            },
            {
                id: 2,
                title: 'تطوير تطبيقات الويب',
                students: 30,
                rating: 4.9,
            },
            {
                id: 3,
                title: 'أساسيات HTML',
                students: 50,
                rating: 4.7,
            },
        ],
        certificates: [
            {
                id: 1,
                title: 'شهادة تدريب المعلمين',
                issuer: 'وزارة التعليم',
                date: '2023-01-15',
            },
            {
                id: 2,
                title: 'شهادة تطوير الويب المتقدم',
                issuer: 'جامعة الملك سعود',
                date: '2022-06-20',
            },
        ],
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{('الملف الشخصي')}</h1>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
                    {('تعديل الملف الشخصي')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2">
                    <Card className="mb-6" title="">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-4xl">👨‍🏫</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{profile.name}</h2>
                                <p className="text-gray-600">{profile.specialization}</p>
                                <p className="text-gray-600">{profile.experience} خبرة</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium mb-2">{('البريد الإلكتروني')}</h3>
                                <p>{profile.email}</p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">{('رقم الهاتف')}</h3>
                                <p>{profile.phone}</p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">{('نبذة عني')}</h3>
                                <p>{profile.bio}</p>
                            </div>
                        </div>
                    </Card>

                    <Card title='المواد التدريبية'>
                        <div className="space-y-4">
                            {profile.courses.map(course => (
                                <div key={course.id} className="border-b pb-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium">{course.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <span>⭐ {course.rating}</span>
                                            <span className="text-gray-600">({course.students} طالب)</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="mb-6" title='الشهادات'>
                        <div className="space-y-4">
                            {profile.certificates.map(cert => (
                                <div key={cert.id} className="border-b pb-4">
                                    <h3 className="font-medium">{cert.title}</h3>
                                    <p className="text-gray-600">{cert.issuer}</p>
                                    <p className="text-sm text-gray-500">{cert.date}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title='الإحصائيات'>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium mb-2">{('إجمالي الطلاب')}</h3>
                                <p className="text-2xl font-bold">
                                    {profile.courses.reduce((acc, course) => acc + course.students, 0)}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">{('متوسط التقييم')}</h3>
                                <p className="text-2xl font-bold">
                                    {Math.round(
                                        profile.courses.reduce((acc, course) => acc + course.rating, 0) /
                                        profile.courses.length * 10
                                    ) / 10}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">{('عدد المواد')}</h3>
                                <p className="text-2xl font-bold">{profile.courses.length}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
} 