'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button } from '@3de/ui';
import { Users, MessageCircle, Calendar, MapPin } from 'lucide-react';
import { Community, User } from '@3de/interfaces';

interface CommunityCardProps {
  community: Community & { participants: User[] };
  isMember?: boolean;
  onJoin?: (communityId: string) => void;
  onLeave?: (communityId: string) => void;
  onClick?: (communityId: string) => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  isMember = false,
  onJoin,
  onLeave,
  onClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="cursor-pointer"
      onClick={() => onClick?.(community.id)}
    >
      <Card className="p-6 space-y-4">
        {/* رأس المجتمع */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {community.name}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {community.description || 'لا يوجد وصف للمجتمع'}
            </p>
          </div>
          
          <Badge variant={isMember ? 'success' : 'secondary'}>
            {isMember ? 'عضو' : 'غير عضو'}
          </Badge>
        </div>

        {/* إحصائيات المجتمع */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
          <div className="flex items-center gap-2 gap-reverse text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{community.participants?.length || 0} عضو</span>
          </div>
          
          <div className="flex items-center gap-2 gap-reverse text-sm text-gray-600">
            <MessageCircle className="w-4 h-4" />
            <span>مناقشات نشطة</span>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2 gap-reverse">
            <Calendar className="w-4 h-4" />
            <span>
              تم الإنشاء في {new Date(community.createdAt).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long'
              })}
            </span>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="pt-4 border-t">
          {isMember ? (
            <Button
              onClick={() => onLeave?.(community.id)}
              variant="outline"
              fullWidth
            >
              مغادرة المجتمع
            </Button>
          ) : (
            <Button
              onClick={() => onJoin?.(community.id)}
              variant="primary"
              fullWidth
            >
              انضمام للمجتمع
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}; 