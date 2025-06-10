
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Edit3, Shield, Loader2, LogIn } from 'lucide-react'; // Added LogIn
import { useEffect, useState, useCallback } from 'react';
import { onAuthChange, type AppUser } from '@/lib/firebaseAuth'; // Using real auth
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'; // Added useRouter

interface UserProfileData {
  name: string;
  email: string;
  avatarUrl: string;
  joinDate: string; 
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchUserData = useCallback(async (authUser: AppUser | null) => {
    setLoading(true);
    if (authUser) {
      setUserProfile({
        name: authUser.displayName || 'Anonymous User',
        email: authUser.email || 'No email provided',
        avatarUrl: 'https://placehold.co/200x200.png', // Placeholder avatar
        // Firebase user objects don't directly have a join date (creationTime is on metadata)
        // For simplicity, using current date as placeholder. You might want to fetch this from Firestore if stored.
        joinDate: new Date().toISOString().split('T')[0], 
      });
    } else {
      setUserProfile(null);
      toast({ title: "Not Authenticated", description: "Please log in to view your profile.", variant: "destructive" });
      router.push('/auth'); // Redirect if not authenticated
    }
    setLoading(false);
  }, [toast, router]);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      fetchUserData(authUser);
    });
    return () => unsubscribe();
  }, [fetchUserData]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4 md:px-0 flex justify-center items-center h-[calc(100vh-var(--header-height,0px)-100px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4 md:px-0 text-center">
        <p className="text-muted-foreground mb-4">You need to be logged in to view this page.</p>
        <Button onClick={() => router.push('/auth')}>
            <LogIn className="mr-2 h-4 w-4"/> Go to Login
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 md:px-0">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account details and preferences.</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 bg-card">
          <Avatar className="h-24 w-24 border-4 border-background shadow-md">
            <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} data-ai-hint="avatar person" />
            <AvatarFallback className="text-3xl"><User size={40}/></AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl font-semibold">{userProfile.name}</CardTitle>
            <CardDescription className="text-md">{userProfile.email}</CardDescription>
            <p className="text-sm text-muted-foreground mt-1">Joined on: {new Date(userProfile.joinDate).toLocaleDateString()}</p>
          </div>
          <Button variant="outline" disabled> {/* Edit profile functionality not implemented */}
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">Personal Information</h3>
            <Separator className="mb-4"/>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={userProfile.name} className="mt-1" readOnly/>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={userProfile.email} readOnly className="mt-1 bg-muted cursor-not-allowed"/>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">Security Settings</h3>
            <Separator className="mb-4"/>
            <div className="space-y-4">
               <Button variant="outline" className="w-full md:w-auto" disabled> {/* Change password not implemented */}
                <Shield className="mr-2 h-4 w-4" /> Change Password
              </Button>
            </div>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}
