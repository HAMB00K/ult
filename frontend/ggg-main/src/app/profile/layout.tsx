import { AppLayout } from '@/components/AppLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | Securibot',
  description: 'Manage your Securibot profile.',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
