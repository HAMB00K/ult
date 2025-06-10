'use client';

import * as React from 'react'; // Import React
import { useState } from 'react'; // Import useState
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Palette, Trash2, ShieldQuestion } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  // Placeholder state for settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // Assuming a toggle, actual implementation differs

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 md:px-0">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary">Application Settings</h1>
        <p className="text-muted-foreground">Customize your Securibot experience.</p>
      </header>

      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary"/> Notifications</CardTitle>
            <CardDescription>Manage how you receive notifications from Securibot.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label htmlFor="notifications" className="font-medium">Enable Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates and alerts via email.</p>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
                aria-label="Toggle email notifications"
              />
            </div>
             <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label htmlFor="prompts-notifications" className="font-medium">New Prompt Suggestions</Label>
                <p className="text-sm text-muted-foreground">Get notified about new suggested prompts.</p>
              </div>
              <Switch
                id="prompts-notifications"
                defaultChecked
                aria-label="Toggle new prompt suggestion notifications"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary"/> Appearance</CardTitle>
            <CardDescription>Adjust the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Reduce eye strain in low light.</p>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={(checked) => {
                  setDarkMode(checked);
                  // This is a placeholder. Actual dark mode toggling affects :root or body class.
                  // For ShadCN, it usually involves document.documentElement.classList.toggle('dark').
                  if (typeof window !== "undefined") {
                     document.documentElement.classList.toggle('dark', checked);
                  }
                }}
                aria-label="Toggle dark mode"
              />
            </div>
            {/* Add more appearance settings here if needed */}
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldQuestion className="h-5 w-5 text-primary"/> Privacy & Data</CardTitle>
            <CardDescription>Manage your data and privacy settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Button variant="outline" className="w-full md:w-auto">
                View Privacy Policy
              </Button>
               <Button variant="outline" className="w-full md:w-auto">
                Export My Data
              </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive"><Trash2 className="h-5 w-5"/> Account Management</CardTitle>
            <CardDescription>Manage your account status.</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full md:w-auto">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => console.log("Account deletion initiated (placeholder)")}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-sm text-muted-foreground mt-2">
              Be careful, this action is irreversible.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
