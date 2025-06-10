import { AppLayout } from '@/components/AppLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | Securibot',
  description: 'Configure your Securibot application settings.',
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
