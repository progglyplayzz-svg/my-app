import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import CalendarTaskManager from './CalendarTaskManager';

export default async function DashboardPage() {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to your Dashboard</h1>
      <CalendarTaskManager userId={userId} />
    </div>
  );
}
