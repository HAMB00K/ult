import { AppLayout } from '@/components/AppLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat | Securibot',
  description: 'Chat with Securibot for cybersecurity insights.',
};

export default function ChatGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
