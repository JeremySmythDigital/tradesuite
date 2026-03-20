import { Metadata } from 'next';
import { NotificationSettings } from './NotificationSettings';

export const metadata: Metadata = {
  title: 'Notification Settings - TradeSuite',
  description: 'Manage your notification preferences for email, SMS, and push notifications.',
};

export default function NotificationsPage() {
  return <NotificationSettings />;
}