// Parallel Route: الكورسات النشطة
'use client';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/useUser';
import { courseApi } from '@/lib/api';
import { Course, Instructor, Lesson, Quiz, User, File as FileModel } from '@shared/prisma';
import { useRouter } from 'next/navigation';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div /> });

// جلب بيانات الكورسات النشطة
let getCoursesData = async (id: string) => {
  const response = await courseApi.getByStudentId(id);
  return response.data;
};

export default function ActiveCoursesTab() {
  let { user } = useUser();
  let router = useRouter();
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => getCoursesData(user?.id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: [],
  });

  // تصفية الكورسات النشطة فقط
  const activeCourses = Array.isArray(courses)
    ? courses.filter((course) => course.status === 'ACTIVE')
    : [];
    let progress = 0;
    let nextLesson = '';
    if(Array.isArray(courses) && courses.length > 0){
        progress = courses.reduce((acc, course) => acc + course.lessons?.filter((lesson) => lesson.status === 'COMPLETED').length, 0);
        nextLesson = courses.find((course) => course.lessons?.find((lesson) => lesson.status === 'NOT_STARTED'))?.lessons[0].title ?? '';
    }
  return (
    <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {activeCourses.length === 0 ? (
        <div className="text-center text-gray-400">لا توجد كورسات نشطة حالياً</div>
      ) : (
        activeCourses.map((course) => (
          
            <Card
            key={course.id}
            title={course.title}
            variant={"course"}
            image={course?.image||"https://assets.sahl.io/LRPHGtES4M18oAie8MTY4krGs4FCibuZfaKTtAJz.gif"}
            onClick={()=>{
              router.push("/student/courses/"+course.id)
            }}
            description={`المدرس: ${course.instructors?.[0]?.user.firstName} ${course.instructors?.[0]?.user.lastName}`}
            className="h-full cursor-pointer"
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
        ))
      )}
    </div>
  );
} 