'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { instructorApi } from '@3de/apis';
import Layout from '../../components/layout/Layout';
import InstructorCard from '../../components/instructors/InstructorCard';
import { Button, Skeleton } from '@3de/ui';
import Pagination from '../../components/common/Pagination';
import { useState } from 'react';
import { Instructor } from '@3de/interfaces';
import { sanitizeApiResponse } from '@/lib/utils';

export default function InstructorsPage() {
  let [page, setPage] = useState(0);
  let [search, setSearch] = useState("");
  let [limit, setLimit] = useState(10);
  
  const { data: instructorsResponse, isLoading } = useQuery({
    queryKey: ['instructors', page, limit, search],
    queryFn: async () => {
      const response = await instructorApi.getAll(page, limit, search);
      return {
        ...response,
        data: JSON.parse(JSON.stringify(response.data))
      };
    },
  });

  const instructors = (instructorsResponse as any)?.data || [];

  const handlePrevious = () => {
    setPage(page - 1);
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">المحاضرون</h1>
          <p className="text-gray-600">
            تعرف على محاضرينا المتميزين وخبراتهم في التدريس
          </p>
        </motion.div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-64" />
            ))
          ) : (
            instructors?.map((instructor: Instructor, index: number) => (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <InstructorCard instructor={instructor} />
              </motion.div>
            ))
          )}
        </div>
        
        {/* Pagination */}
        {instructors && instructors.length && instructors.length > 0 && (
          <Pagination
            currentPage={page}
            onPrevious={handlePrevious}
            onNext={handleNext}
            hasPrevious={page > 0}
            hasNext={instructors.length === limit}
          />
        )}

        {/* Empty State */}
        {!isLoading && (!instructors || instructors.length === 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا يوجد محاضرون متاحون حالياً
            </h3>
            <p className="text-gray-600">
              سيتم إضافة المحاضرين قريباً
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
} 