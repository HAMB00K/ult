
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/Logo';
import {
  FileText,
  History,
  MessageSquarePlus,
  Settings,
  UserCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import type { ConversationHistoryItem } from '@/lib/types';
import { getUserConversations } from '@/lib/chatApi';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/config/firebase-config'; // Import real auth
import { signOut as firebaseSignOut } from 'firebase/auth'; // Import real signOut
import { onAuthChange, type AppUser } from '@/lib/firebaseAuth'; // Import onAuthChange and AppUser type

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const [chatHistory, setChatHistory] = useState<ConversationHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [openHistory, setOpenHistory] = React.useState(true);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);


  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (!user) {
        // If user logs out or session expires, redirect to auth page from protected routes
        if (pathname.startsWith('/chat') || pathname.startsWith('/profile') || pathname.startsWith('/settings')) {
          router.push('/auth');
        }
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router, pathname]);

  const fetchHistory = useCallback(async () => {
    if (!currentUser?.uid) {
      setHistoryLoading(false);
      setChatHistory([]);
      return;
    }

    setHistoryLoading(true);
    try {
      const history = await getUserConversations();
      setChatHistory(history);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
      toast({
        title: "Error Loading History",
        description: (error as Error).message || "Could not load your past conversations.",
        variant: "destructive",
      });
      setChatHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [currentUser?.uid, toast]);

  useEffect(() => {
    if (currentUser) { // Fetch history if user is logged in
      fetchHistory();
    } else { // Clear history if user is not logged in
      setChatHistory([]);
      setHistoryLoading(false);
    }
  }, [currentUser, fetchHistory]);


  const handleNewChat = () => {
    // Check if user is authenticated before allowing new chat
    if (!currentUser) {
        toast({ title: "Authentication Required", description: "Please sign in to start a new chat.", variant: "destructive"});
        router.push('/auth');
        return;
    }
    router.push('/chat');
  };

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null); // Clear user state immediately
      setChatHistory([]); // Clear chat history
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/auth'); // Redirect to auth page
    } catch (error) {
      console.error("Logout failed:", error);
      toast({ title: "Logout Failed", description: (error as Error).message || "Could not log out.", variant: "destructive" });
    }
  };
  
  const userAvatarName = currentUser?.displayName || currentUser?.email || 'User';
  const userAvatarFallback = userAvatarName?.substring(0, 1).toUpperCase() || 'U';

  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" className="border-r">
        <SidebarHeader className="p-4 items-center flex justify-center group-data-[collapsible=icon]:justify-start">
          <Logo width={40} height={40} priority/>
        </SidebarHeader>

        <SidebarContent className="p-0">
          <ScrollArea className="h-full">
            <SidebarGroup className="p-2 pt-0">
               <SidebarMenu>
                <SidebarMenuItem>
                  <Button variant="ghost" 
                          className="w-full justify-start h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0"
                          onClick={handleNewChat}
                          disabled={!currentUser && !pathname.startsWith('/auth')} // Disable if not logged in and not on auth page
                  >
                     <MessageSquarePlus className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden ml-2">New Chat</span>
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            {currentUser && ( // Only show history if user is logged in
              <>
                <SidebarSeparator className="my-1"/>
                <SidebarGroup className="p-2">
                  <SidebarMenuButton 
                    onClick={() => setOpenHistory(!openHistory)}
                    className="w-full mb-1 group-data-[collapsible=icon]:justify-center"
                    size="sm"
                  >
                    <History className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden ml-2">Chat History</span>
                    {openHistory ? <ChevronDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" /> : <ChevronRight className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />}
                  </SidebarMenuButton>
                  {openHistory && (
                     <SidebarMenuSub className="group-data-[collapsible=icon]:hidden">
                      {historyLoading ? (
                        <div className="p-2 flex items-center justify-center text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading...
                        </div>
                      ) : chatHistory.length === 0 ? (
                         <SidebarMenuSubItem>
                            <span className="px-2 py-1 text-xs text-muted-foreground">No history yet.</span>
                         </SidebarMenuSubItem>
                      ) : (
                        chatHistory.map((chat) => (
                          <SidebarMenuSubItem key={chat.id}>
                            <SidebarMenuSubButton
                              href={`/chat?id=${chat.id}`}
                              isActive={pathname === `/chat` && (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('id') === chat.id)}
                              className="truncate"
                              size="sm"
                            >
                              <FileText className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              {chat.title}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))
                      )}
                    </SidebarMenuSub>
                  )}
                </SidebarGroup>
              </>
            )}
          </ScrollArea>
        </SidebarContent>

        <SidebarFooter className="p-2 border-t">
           {currentUser && ( // Show profile, settings, logout only if logged in
             <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/profile'}
                    tooltip={{ children: 'Profile', side: 'right', className: 'bg-primary text-primary-foreground' }}
                  >
                    <Link href="/profile">
                      <UserCircle /> <span className="group-data-[collapsible=icon]:hidden">Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/settings'}
                    tooltip={{ children: 'Settings', side: 'right', className: 'bg-primary text-primary-foreground' }}
                  >
                    <Link href="/settings">
                      <Settings /> <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    tooltip={{ children: 'Logout', side: 'right', className: 'bg-destructive text-destructive-foreground' }}
                  >
                    <LogOut className="text-destructive" /> <span className="group-data-[collapsible=icon]:hidden text-destructive">Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
           )}
           {currentUser && (
             <div className="flex items-center gap-2 mt-4 p-2 rounded-lg bg-secondary group-data-[collapsible=icon]:hidden">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="avatar person" />
                <AvatarFallback>{userAvatarFallback}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-foreground truncate">{currentUser?.displayName || 'User'}</span>
                <span className="text-xs text-muted-foreground truncate">{currentUser?.email || 'user@example.com'}</span>
              </div>
            </div>
           )}
           {!currentUser && !pathname.startsWith('/auth') && ( // Show login button if not logged in and not on auth page
            <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => router.push('/auth')}
                    tooltip={{ children: 'Login', side: 'right', className: 'bg-primary text-primary-foreground' }}
                  >
                    <LogIn /> <span className="group-data-[collapsible=icon]:hidden">Login</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
           )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="p-4 border-b md:hidden sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <Link href={currentUser ? "/chat" : "/auth"}>
                <Logo width={30} height={30} priority/>
              </Link>
            </div>
            <SidebarTrigger />
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
