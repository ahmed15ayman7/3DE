'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { eventApi } from '@3de/apis';
import { Event } from '@3de/interfaces';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import EventCard from '../../components/EventCard';
import { 
  Search, 
  Filter, 
  Calendar,
  Clock,
  MapPin,
  Users,
  Globe,
  Video,
  X,
  TrendingUp
} from 'lucide-react';
import { Button } from '@3de/ui';
import axios from 'axios';
const categories = [
  "جميع الفئات",
  "مؤتمر",
  "ورشة عمل",
  "ندوة",
  "لقاء",
  "مسابقة",
  "حلقة نقاش"
];

const eventTypes = [
  { value: "all", label: "جميع الأنواع" },
  { value: "online", label: "عبر الإنترنت" },
  { value: "offline", label: "حضوري" },
  { value: "hybrid", label: "مختلط" }
];

const sortOptions = [
  { value: "date", label: "التاريخ" },
  { value: "popular", label: "الأكثر حضوراً" },
  { value: "newest", label: "الأحدث إضافة" }
];
let getEvents = async () => {
  const response = await axios.get('https://api.3de.school/events/public');
  return response as {data: Event[]};
}

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('جميع الفئات');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Fetch events
  const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useQuery({
    queryKey: ['events'],
    queryFn: () =>
       getEvents(),
  });

  const allEvents = eventsData?.data || [];

  // Transform event data to match component props
  const transformEventData = (event: Event) => ({
    id: event.id,
    title: event.title,
    description: event.description || "حدث تعليمي مميز",
    featuredImage: "/images/events/default.jpg",
    startDate: new Date(event.startTime).toISOString().split('T')[0],
    startTime: new Date(event.startTime).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    endTime: new Date(event.endTime).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    location: {
      type: "offline" as const,
      venue: "أكاديمية 3DE",
      city: "الخانكة"
    },
    organizer: {
      name: "أكاديمية 3DE",
      avatar: "/images/logo.png"
    },
    category: "فعالية تعليمية",
    tags: ["تعليم", "تدريب"],
    maxAttendees: 100,
    currentAttendees: Math.floor(Math.random() * 80) + 10, // Mock attendees
    price: undefined,
    isFree: true
  });

  // Filter and search logic
  const filteredEvents = allEvents.filter((event: Event) => {
    const transformedEvent = transformEventData(event);
    
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'جميع الفئات' || transformedEvent.category.includes(selectedCategory);
    const matchesType = selectedType === 'all' || transformedEvent.location.type === selectedType;
    const matchesFree = !showFreeOnly || transformedEvent.isFree;
    const matchesFeatured = !showFeaturedOnly || false; // No featured field in Event interface
    
    return matchesSearch && matchesCategory && matchesType && matchesFree && matchesFeatured;
  });

  // Sort logic
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        // Sort by a mock popularity score since we don't have attendees data
        return Math.random() - 0.5;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default: // date
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    }
  });

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('جميع الفئات');
    setSelectedType('all');
    setShowFreeOnly(false);
    setShowFeaturedOnly(false);
    setSortBy('date');
  };

  const isEventPast = (eventDate: string) => {
    return new Date(eventDate) < new Date();
  };

  if (eventsError) {
    return (
      <Layout showBreadcrumb={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">حدث خطأ في تحميل الأحداث</h2>
            <p className="text-text-secondary">يرجى المحاولة مرة أخرى لاحقاً</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBreadcrumb={true}>
      {/* Hero Section */}
      <Hero
        title="الأحداث والفعاليات"
        subtitle="📅 انضم إلى مجتمع التعلم"
        description="اكتشف أحدث الأحداث التقنية والتعليمية، من المؤتمرات والورش التدريبية إلى اللقاءات والندوات التفاعلية"
        size="md"
        pattern={true}
      />

      <section className="section bg-white">
        <div className="container">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Search Bar */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="ابحث في الأحداث، المتحدثين، أو الكلمات المفتاحية..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  />
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter size={18} />
                  فلترة
                </Button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">نوع الحدث</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">طريقة الحضور</label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main"
                      >
                        {eventTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Sort Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ترتيب حسب</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Additional Filters */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 gap-reverse">
                        <input
                          type="checkbox"
                          id="freeOnly"
                          checked={showFreeOnly}
                          onChange={(e) => setShowFreeOnly(e.target.checked)}
                          className="w-4 h-4 text-primary-main border-gray-300 rounded focus:ring-primary-main"
                        />
                        <label htmlFor="freeOnly" className="text-sm font-medium text-gray-700">
                          الأحداث المجانية فقط
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-2 gap-reverse">
                        <input
                          type="checkbox"
                          id="featuredOnly"
                          checked={showFeaturedOnly}
                          onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                          className="w-4 h-4 text-primary-main border-gray-300 rounded focus:ring-primary-main"
                        />
                        <label htmlFor="featuredOnly" className="text-sm font-medium text-gray-700">
                          الأحداث المميزة فقط
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {sortedEvents.length} حدث من أصل {allEvents.length}
                    </span>
                    <Button variant="ghost" onClick={clearAllFilters} className="text-sm">
                      <X size={16} className="ml-1" />
                      مسح الفلاتر
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Active Filters */}
          {(selectedCategory !== 'جميع الفئات' || selectedType !== 'all' || showFreeOnly || showFeaturedOnly || searchTerm) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-wrap gap-2"
            >
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-dark rounded-full text-sm">
                  البحث: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="mr-2">
                    <X size={14} />
                  </button>
                </span>
              )}
              {selectedCategory !== 'جميع الفئات' && (
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-dark rounded-full text-sm">
                  النوع: {selectedCategory}
                  <button onClick={() => setSelectedCategory('جميع الفئات')} className="mr-2">
                    <X size={14} />
                  </button>
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-dark rounded-full text-sm">
                  الحضور: {eventTypes.find(t => t.value === selectedType)?.label}
                  <button onClick={() => setSelectedType('all')} className="mr-2">
                    <X size={14} />
                  </button>
                </span>
              )}
              {showFreeOnly && (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  مجاني فقط
                  <button onClick={() => setShowFreeOnly(false)} className="mr-2">
                    <X size={14} />
                  </button>
                </span>
              )}
              {showFeaturedOnly && (
                <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  مميز فقط
                  <button onClick={() => setShowFeaturedOnly(false)} className="mr-2">
                    <X size={14} />
                  </button>
                </span>
              )}
            </motion.div>
          )}

          {/* Events Grid */}
          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card">
                  <div className="card-body animate-pulse">
                    <div className="h-40 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedEvents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {sortedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <EventCard {...transformEventData(event)} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">
                  لم نجد أي أحداث
                </h3>
                <p className="text-text-secondary mb-6">
                  لم نتمكن من العثور على أحداث تطابق معايير البحث الخاصة بك. 
                  جرب تعديل الفلاتر أو مصطلحات البحث.
                </p>
                <Button onClick={clearAllFilters}>
                  مسح جميع الفلاتر
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Event Statistics */}
      <section className="section bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-8">
              إحصائيات الأحداث
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { 
                  icon: Calendar, 
                  number: allEvents.length.toString(), 
                  label: "حدث قادم" 
                },
                { 
                  icon: Users, 
                  number: (allEvents.length * 75).toLocaleString(), // Mock total participants
                  label: "مشارك مسجل" 
                },
                { 
                  icon: Globe, 
                  number: Math.ceil(allEvents.length * 0.3).toString(), // Mock online events
                  label: "حدث عبر الإنترنت" 
                },
                { 
                  icon: MapPin, 
                  number: Math.ceil(allEvents.length * 0.6).toString(), // Mock free events
                  label: "حدث مجاني" 
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-main rounded-xl flex items-center justify-center">
                    <stat.icon size={28} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-text-primary">{stat.number}</div>
                  <div className="text-text-secondary">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-20"></div>
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              هل تريد تنظيم حدث؟
            </h2>
            <p className="text-xl mb-8 opacity-90">
              انضم إلى شبكة منظمي الأحداث التقنية وشارك معرفتك مع المجتمع
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:gap-6 sm:gap-reverse">
              <Button size="lg" className="bg-white text-primary-main hover:bg-gray-100">
                <Calendar size={20} className="ml-2" />
                اقترح حدث
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-main">
                تعرف على الشروط
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
} 