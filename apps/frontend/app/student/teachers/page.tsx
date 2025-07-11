"use client";
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { instructorApi } from '@/lib/api';
import { Instructor, User, Course } from '@shared/prisma';
import { 
    User as UserIcon, 
    BookOpen, 
    Star, 
    Mail, 
    Phone, 
    GraduationCap,
    Clock,
    Users,
    Award,
    ChevronRight,
    X
} from 'lucide-react';

// Dynamic imports
const Card = dynamic(() => import('@/components/common/Card'), { 
    loading: () => <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div> 
});
const Badge = dynamic(() => import('@/components/common/Badge'), { 
    loading: () => <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div> 
});
const Button = dynamic(() => import('@/components/common/Button'), { 
    loading: () => <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div> 
});
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { 
    loading: () => <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div> 
});
const Avatar = dynamic(() => import('@/components/common/Avatar'), { 
    loading: () => <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse"></div> 
});

interface InstructorWithDetails extends Instructor {
    user: User;
    courses: Course[];
}

const TeachersPage = () => {
    const [selectedInstructor, setSelectedInstructor] = useState<InstructorWithDetails | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // استعلام المدرسين
    const { data: instructors, isLoading,refetch } = useQuery<InstructorWithDetails[]>({
        queryKey: ['instructors-for-students'],
        queryFn: async () => {
            const response = await instructorApi.getAll(0,10,searchTerm.toLowerCase());
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    // تصفية المدرسين حسب البحث
    const filteredInstructors = instructors?.filter(instructor =>
        instructor.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.title?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleInstructorClick = (instructor: InstructorWithDetails) => {
        setSelectedInstructor(instructor);
    };

    const closeModal = () => {
        setSelectedInstructor(null);
    };
    

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton height={40} width={300} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} height={200} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* العنوان والبحث */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">مدرسون الأكاديمية</h1>
                    <p className="text-gray-600 mt-2">تعرف على مدرسينا المتميزين وموادهم الدراسية</p>
                </div>
                
                <div className="relative">
                    <input
                        type="text"
                        placeholder="البحث عن مدرس..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
            </motion.div>

            {/* إحصائيات سريعة */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <Card title="" className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-blue-600">إجمالي المدرسين</p>
                            <p className="text-2xl font-bold text-blue-900">{instructors?.length || 0}</p>
                        </div>
                    </div>
                </Card>

                <Card title="" className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="p-2 bg-green-500 rounded-lg">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-green-600">إجمالي المواد</p>
                            <p className="text-2xl font-bold text-green-900">
                                {instructors?.reduce((acc, instructor) => acc + instructor.courses.length, 0) || 0}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card title="" className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                    <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="p-2 bg-purple-500 rounded-lg">
                            <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-purple-600">مدرسون متميزون</p>
                            <p className="text-2xl font-bold text-purple-900">
                                {instructors?.filter(instructor => instructor.courses.length > 2).length || 0}
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* قائمة المدرسين */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInstructors.map((instructor, index) => (
                    <motion.div
                        key={instructor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card  title=""
                            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary-300"
                            onClick={() => handleInstructorClick(instructor)}
                        >
                            <div className="text-center space-y-4">
                                {/* صورة المدرس */}
                                <div className="relative">
                                    <Avatar
                                        src={instructor.user.avatar||""}
                                        alt={`${instructor.user.firstName} ${instructor.user.lastName}`}
                                        size="xl"
                                        cw="250px"
                                        ch="250px"
                                        className="mx-auto"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                </div>

                                {/* معلومات المدرس */}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {instructor.user.firstName} {instructor.user.lastName}
                                    </h3>
                                    {instructor.title && (
                                        <p className="text-primary-600 font-medium">{instructor.title}</p>
                                    )}
                                    <p className="text-gray-600 text-sm mt-1">
                                        {instructor.courses.length} مادة دراسية
                                    </p>
                                </div>

                                {/* التقييم والمواد */}
                                <div className="flex items-center justify-center space-x-4 space-x-reverse">
                                    <div className="flex items-center space-x-1 space-x-reverse">
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        <span className="text-sm font-medium">4.8</span>
                                    </div>
                                    <Badge variant="standard" className="text-xs">
                                        <span>

                                        متاح
                                        </span>
                                    </Badge>
                                </div>

                                {/* المواد السريعة */}
                                <div className="flex flex-wrap justify-center gap-2">
                                    {instructor.courses.slice(0, 3).map((course) => (
                                        <Badge key={course.id} variant="standard" className="text-xs">
                                            <span>
                                            {course.title}
                                            </span>
                                        </Badge>
                                    ))}
                                    {instructor.courses.length > 3 && (
                                        <Badge variant="standard" className="text-xs">
                                            <span>
                                            +{instructor.courses.length - 3} أكثر
                                            </span>
                                        </Badge>
                                    )}
                                </div>

                                {/* زر التفاصيل */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => handleInstructorClick(instructor)}
                                >
                                    عرض التفاصيل
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* رسالة إذا لم يتم العثور على نتائج */}
            {filteredInstructors.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">لم يتم العثور على مدرسين</h3>
                    <p className="text-gray-600">جرب تغيير كلمات البحث</p>
                </motion.div>
            )}

            {/* Modal تفاصيل المدرس */}
            <AnimatePresence>
                {selectedInstructor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="relative p-6 border-b">
                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                                
                                <div className="flex items-center space-x-4 space-x-reverse">
                                    <Avatar
                                        src={selectedInstructor.user.avatar||""}
                                        alt={`${selectedInstructor.user.firstName} ${selectedInstructor.user.lastName}`}
                                        size="xl"
                                    />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {selectedInstructor.user.firstName} {selectedInstructor.user.lastName}
                                        </h2>
                                        {selectedInstructor.title && (
                                            <p className="text-primary-600 font-medium">{selectedInstructor.title}</p>
                                        )}
                                        <div className="flex items-center space-x-4 space-x-reverse mt-2">
                                            <div className="flex items-center space-x-1 space-x-reverse">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-sm font-medium">4.8</span>
                                            </div>
                                            <Badge variant="standard" className="text-xs">
                                                <span>
                                                    متاح
                                                </span>
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* معلومات الاتصال */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                                        <Mail className="h-5 w-5 mr-2" />
                                        معلومات الاتصال
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-2 space-x-reverse">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-700">{selectedInstructor.user.email}</span>
                                        </div>
                                        {selectedInstructor.user.phone && (
                                            <div className="flex items-center space-x-2 space-x-reverse">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-700">{selectedInstructor.user.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* المواد الدراسية */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                                        <BookOpen className="h-5 w-5 mr-2" />
                                        المواد الدراسية ({selectedInstructor.courses.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedInstructor.courses.map((course) => (
                                            <motion.div
                                                key={course.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                                                        <div className="flex items-center space-x-2 space-x-reverse mt-2">
                                                            <Badge variant="standard" className="text-xs">
                                                                <span>

                                                                {course.level}
                                                                </span>
                                                            </Badge>
                                                            <Badge 
                                                                variant={course.status === 'ACTIVE' ? 'standard' : 'standard'} 
                                                                className="text-xs"
                                                            >
                                                                <span>

                                                                {course.status === 'ACTIVE' ? 'نشط' : 'معلق'}
                                                                </span>
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* الإحصائيات */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                                        <GraduationCap className="h-5 w-5 mr-2" />
                                        الإحصائيات
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <p className="text-2xl font-bold text-primary-600">
                                                {selectedInstructor.courses.length}
                                            </p>
                                            <p className="text-sm text-gray-600">مادة</p>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <p className="text-2xl font-bold text-green-600">4.8</p>
                                            <p className="text-sm text-gray-600">تقييم</p>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <p className="text-2xl font-bold text-blue-600">150+</p>
                                            <p className="text-sm text-gray-600">طالب</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
                                <div className="flex justify-end space-x-3 space-x-reverse">
                                    <Button variant="outline" onClick={closeModal}>
                                        إغلاق
                                    </Button>
                                    <Button variant="default">
                                        التواصل مع المدرس
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeachersPage; 