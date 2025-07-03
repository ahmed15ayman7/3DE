// Parallel Route: طلب شهادة
'use client';
import dynamic from 'next/dynamic';
import { useUser } from '@/hooks/useUser';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { certificateApi } from '@/lib/api';
import { Grid } from '@mui/material';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div /> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div /> });
const Input = dynamic(() => import('@/components/common/Input'), { loading: () => <div /> });

export default function RequestCertificateTab() {
  const { user } = useUser();
  const [requestData, setRequestData] = useState({
    name: '',
    address: '',
    phone: '',
    notes: '',
    userId: user?.id || '',
    title: '',
    description: '',
    points: 0,
    type: '',
    earnedAt: '',
  });
  const { mutate: requestCertificate, isPending } = useMutation({
    mutationFn: (data: any) => certificateApi.create(data),
    onSuccess: () => setRequestData({ name: '', address: '', phone: '', notes: '', userId: user?.id || '', title: '', description: '', points: 0, type: '', earnedAt: '' }),
  });
  return (
    <Card title="طلب شهادة مطبوعة">
      <form
        className="space-y-4"
        onSubmit={e => {
          e.preventDefault();
          requestCertificate(requestData);
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Input label="الاسم" className="w-4/5" value={requestData.name} onChange={e => setRequestData({ ...requestData, name: e.target.value })} required />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input label="العنوان" className="w-4/5" value={requestData.address} onChange={e => setRequestData({ ...requestData, address: e.target.value })} required />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input label="رقم الهاتف" className="w-4/5" value={requestData.phone} onChange={e => setRequestData({ ...requestData, phone: e.target.value })} required />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input label="ملاحظات" className="w-4/5" value={requestData.notes} onChange={e => setRequestData({ ...requestData, notes: e.target.value })} />
          </Grid>
        </Grid>
        <div className="flex justify-end">
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? 'جاري الإرسال...' : 'إرسال الطلب'}
          </Button>
        </div>
      </form>
    </Card>
  );
} 