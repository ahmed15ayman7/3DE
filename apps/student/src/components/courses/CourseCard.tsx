'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Users, BookOpen, Play } from 'lucide-react';
import { Button, Badge, Progress, toast, Modal, Input } from '@3de/ui';
import { Course } from '@3de/interfaces';
import { enrollmentApi } from '@3de/apis';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CourseCardProps {
  userId: string;
  course: Course;
  isEnrolled?: boolean;
  refetch: () => void;
}

export default function CourseCard({ userId, course, isEnrolled = false, refetch }: CourseCardProps) {
  const router = useRouter();
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollmentCode, setEnrollmentCode] = useState('');
  const progress = (course.lessons?.filter((lesson: any) => lesson.WatchedLesson.some((watched: any) => watched.userId === userId)).length || 0) / (course.lessons?.length || 1) * 100 || 0;
  let isPending = course.enrollments?.find((enrollment) => enrollment.userId === userId && enrollment.status === "PENDING");
  // تحويل التاريخ إلى string إذا كان Date object
  const formatDate = (date: any) => {
    if (!date) return 'غير محدد';
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('ar-EG');
    }
    if (date instanceof Date) {
      return date.toLocaleDateString('ar-EG');
    }
    return 'غير محدد';
  };
  let handleEnroll = async () => {
    let toastId = toast.loading('يتم الالتحاق بالكورس...');
    try{
    let enrollment =isPending ? await enrollmentApi.update(course.enrollments?.find((enrollment)=>enrollment.userId === userId)?.id||'',{status:"PENDING"}) : await enrollmentApi.create({courseId:course.id,userId:userId,status:"PENDING"});
    if(enrollment.status>=200 && enrollment.status<300){
      let code = await enrollmentApi.updateEnrollmentCode(enrollmentCode,{courseId:course.id,usedById:userId,isUsed:true});
      if(code.status>=200 && code.status<300){
        let enrollment2 = await enrollmentApi.update(enrollment.data.id,{status:"ACTIVE"});
        if(enrollment2.status>=200 && enrollment2.status<300){
          toast.success('تم الالتحاق بالكورس بنجاح',{id:toastId});
          refetch();
          setShowEnrollModal(false);
          setEnrollmentCode('');
        }else{
          toast.error('حدث خطأ أثناء الالتحاق بالكورس',{id:toastId});
        }
      }else{
        toast.error('يرجى التأكد من كود التفعيل والتاكد من عدم استخدامه من قبل',{id:toastId});
      }
    }else{
      toast.error('حدث خطأ أثناء الالتحاق بالكورس',{id:toastId});
    }
    }catch(error){
      toast.error('يرجى التأكد من كود التفعيل والتاكد من عدم استخدامه من قبل',{id:toastId});
    }
  }

  return (
    <div className="">
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Course Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-main to-secondary-main">
        {course.image && (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        )}
        {/* <div className="absolute inset-0 bg-black bg-opacity-20" /> */}
        <div className="absolute top-4 right-4">
          <Badge variant={isEnrolled ? 'primary' : 'outline'}>
            {isEnrolled ? 'مشترك' : 'متاح'}
          </Badge>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {course.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(course.startDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.enrollments?.length || 0} طالب</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.lessons?.length || 0} درس</span>
          </div>
        </div>

        {/* Progress Bar */}
        {isEnrolled && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">التقدم</span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Action Button */}
        <Button className="w-full" variant={isEnrolled && !isPending ? 'primary' : 'outline'} onClick={()=>{
          if(isEnrolled && isPending||!isEnrolled){
            setShowEnrollModal(true);
          }else{
            router.push(`/courses/${course.id}`);
          }
        }}>
          <Play className="w-4 h-4 ml-2" />
           {isPending && isEnrolled ? 'استكمل الاشتراك': isEnrolled ? 'استكمال الكورس' : 'الالتحاق بالكورس'}
        </Button>
      </div>
    </motion.div>
      {showEnrollModal&&<Modal isOpen={showEnrollModal} onClose={()=>setShowEnrollModal(false)}>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-900">الالتحاق بالكورس</h2>
          <p>لكي تتمكن من الالتحاق بالكورس، يرجى كتابة كود التفعيل</p>
          <Input type="text" placeholder="كود التفعيل" onChange={(e)=>setEnrollmentCode(e.target.value)} />
          <Button className="w-full" variant="primary" onClick={handleEnroll}>
            <Play className="w-4 h-4 ml-2" />
            الالتحاق بالكورس
          </Button>
        </div>
      </Modal>}
    </div>
  );
} 