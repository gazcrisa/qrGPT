'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  MedicationRequest,
  MedicationResponse,
  Concept,
} from '@/utils/service';
import { ConceptCard } from '@/components/QrCard';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import LoadingDots from '@/components/ui/loadingdots';
import { Toaster } from 'react-hot-toast';

const formSchema = z.object({
  medication: z.string().min(1).max(300),
});

type FormSchema = z.infer<typeof formSchema>;

const Body = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<MedicationResponse | null>(null);
  const [submittedMedication, setSubmittedMedication] = useState<string | null>(
    null,
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',

    // Set default values so that the form inputs are controlled components.
    defaultValues: {
      medication: '',
    },
  });

  const handleSubmit = async (values: FormSchema) => {
    setIsLoading(true);
    setResponse(null);
    setError(null);
    setSubmittedMedication(values.medication);

    try {
      const request: MedicationRequest = {
        medication: values.medication,
      };
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      // Handle API errors.
      if (!response.ok || response.status !== 200) {
        const text = await response.text();
        throw new Error(
          `Failed to look up medication info: ${response.status}, ${text}`,
        );
      }


      const data = await response.json();

      setResponse(data)
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col w-full lg:p-0 p-4 sm:mb-28 mb-0">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mt-10">
        <div className="col-span-1">
          <h1 className="text-3xl font-bold mb-10">Enter your medication</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="medication"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Name</FormLabel>
                      <FormControl>
                        <Input placeholder="AMITRIPTYLINE 25MG" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center
                 max-w-[200px] w-full"
                >
                  {isLoading ? (
                    <LoadingDots color="white" />
                  ) : response ? (
                    '✨ Resubmit'
                  ) : (
                    'Submit'
                  )}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </Form>
        </div>
        <div className="col-span-1">
          {submittedMedication && (
            <>
              <h1 className="text-3xl font-bold sm:mb-5 mb-5 mt-5 sm:mt-0 sm:text-center text-left">
                Results
              </h1>
              <div>
                <div className="flex flex-col justify-center relative h-auto items-center gap-4">
                  {response ? (
                    response.concepts.map((concept: Concept, index: number) => (
                      <div key={index} className="qr-code-container">
                        <ConceptCard concept={concept} />
                      </div>
                    ))
                  ) : (
                    <div className="relative flex flex-col justify-center items-center gap-y-2 w-[510px] border border-gray-300 rounded shadow group p-2 mx-auto animate-pulse bg-gray-400 aspect-square max-w-full" />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Body;
