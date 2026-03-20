import { Metadata } from 'next';
import { NotificationSettings } from './NotificationSettings';

export const metadata: Metadata = {
  title: 'Notification Settings - Cypress Signal',
  description: 'Manage your notification preferences for email, SMS, and push notifications.',
};

export default function NotificationsPage() {
  return <NotificationSettings />;
}