'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@3de/auth';
import Layout from '../../../components/Layout';
import { Button, Card, Progress } from '@3de/ui';
import { 
  ArrowRight, 
  BookOpen, 
  Clock, 
  User, 
  Star,
  CheckCircle,
  Play,
  Calendar,
  Award,
  Download,
  BarChart3
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {  landingApi } from '@3de/apis';
import Image from 'next/image';

export default function CourseDetails() {
  const params = useParams();
  const router = useRouter();
  let {data:course}=useQuery({
    queryKey: ['courseData', params.courseId],
    queryFn: () => landingApi.getCourse(params.courseId as string),
  });
  console.log(course);
  let courseData=course?.data;


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-primary-main bg-blue-100';
      case 'not-started':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'in-progress':
        return 'قيد التنفيذ';
      case 'not-started':
        return 'لم يبدأ';
      default:
        return 'غير محدد';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {courseData?.title}
                </h1>
                <p className="text-gray-600">
                  {courseData?.description}
                </p>
            </div>
          </div>
        </div> */}

        {/* Course Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="w-full flex items-center justify-center gap-4">
                <img src={courseData?.image||''} alt={courseData?.title||''} width={500} height={500} className="rounded-lg" />
              </div>
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Info */}
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-main to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {courseData?.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {courseData?.description}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{courseData?.instructors?.[0]?.user?.firstName||''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{courseData?.duration} ساعة</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{courseData?.startDate?new Date(courseData?.startDate).toLocaleDateString("ar-EG"):''}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(courseData?.status||'')}`}>
                  {getStatusText(courseData?.status||'')}
                </div>
              </div>


            </Card>
            <div className="w-full flex items-center justify-end gap-4">
                <Button variant="primary" onClick={()=>{
                  window.open(`https://wa.me/+201282631736`);
                }}>
                  تواصل معنا 
                </Button>
              </div>
          </div>

        </div>
      </div>
    </Layout>
  );
} 