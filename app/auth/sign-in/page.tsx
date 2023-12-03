'use client';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type FormSchema = z.infer<typeof formSchema>;

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',

    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = async (values: FormSchema) => {
    setIsLoading(true);
    setError('');
    const signInData = await signIn('credentials', {
      username: values.username,
      password: values.password,
      redirect: false,
    });

    if (signInData?.error) {
      setError(signInData.error);
      setIsLoading(false);
    } else {
      router.refresh();
      router.push('/');
    }
  };

  return (
    <div className="h-screen flex justify-start items-start p-10">
      {/* <div className="grid w-full grid-cols-1 bg-white md:grid-cols-2"> */}
      <div className="text-black flex items-center flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <h1 className="text-3xl font-semibold mb-4">Login</h1>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 mb-4 bg-transparent rounded-full"
                      placeholder="Username"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 bg-transparent rounded-full"
                      placeholder="Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center w-full mt-8 gap-4 px-12 rounded-full"
            >
              {isLoading ? 'Signing you in...' : 'Sign in'}
            </Button>
            {error && (
              <Alert variant="destructive" className="mt-12">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignInPage;
