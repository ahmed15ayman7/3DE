import { redirect } from 'next/navigation';

export default function OverviewPage() {
  redirect('/student/notifications/overview/all');
}
