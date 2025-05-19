
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

// Define notification settings schema
const notificationSchema = z.object({
  email_notifications: z.boolean().default(true),
  marketing_emails: z.boolean().default(false),
  update_notifications: z.boolean().default(true),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

interface NotificationSettingsProps {
  settings?: {
    email_notifications: boolean;
    marketing_emails: boolean;
    update_notifications: boolean;
  };
  updateSettings: (settings: NotificationFormValues) => Promise<boolean>;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  settings,
  updateSettings
}) => {
  // Initialize form with react-hook-form
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      email_notifications: settings?.email_notifications ?? true,
      marketing_emails: settings?.marketing_emails ?? false,
      update_notifications: settings?.update_notifications ?? true,
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: NotificationFormValues) => {
    await updateSettings(data);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose what notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email_notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email Notifications</FormLabel>
                    <FormDescription>
                      Receive notifications about your account activity via email
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="marketing_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Marketing Emails</FormLabel>
                    <FormDescription>
                      Receive emails about new features, offers, and updates
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="update_notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">System Updates</FormLabel>
                    <FormDescription>
                      Receive notifications about system updates and important announcements
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <CardFooter className="px-0 pt-4">
              <Button type="submit" className="ml-auto">Save Preferences</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
