"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { map } from "lodash";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const formSchema = z.object({
  label: z.string(),
  isCorrect: z.string(),
});

export type FeedbackFormSchemaType = z.infer<typeof formSchema>;

interface FeedbackFormProps {
  handleOnSubmit: (data: z.infer<typeof formSchema>) => void; // eslint-disable-line
  tags?: { label: string; value: string }[];
  feedbackSent?: boolean;
  isSendingFeedback?: boolean;
}

const FeedbackForm = ({
  handleOnSubmit,
  tags,
  feedbackSent,
  isSendingFeedback,
}: FeedbackFormProps) => {
  const form = useForm<FeedbackFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      isCorrect: "",
    },
  });

  const isCorrect = form.watch("isCorrect");
  const label = form.watch("label");

  return (
    <Card
      className={cn(
        "max-w-[400px]  md:rounded-l-none",
        feedbackSent ? "bg-slate-900" : ""
      )}
    >
      {feedbackSent ? (
        <div className="flex h-full flex-col text-center justify-center align-middle p-8 max-w-[400px]">
          <h3 className="text-2xl font-bold tracking-tight">
            Thank you for your feedback!
          </h3>
          <p className="text-sm text-muted-foreground mt-4">
            Your feedback helps us improve the AI model to provide better, more
            accurate, and faster results in the future.
          </p>
        </div>
      ) : (
        <>
          <CardHeader className="flex flex-row items-start bg-neutral-950/50 border-b-2 border-slate-800">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Feedback
              </CardTitle>
              <CardDescription>
                Submit feedback to help improve the results. Our model is still
                learning.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-0 pt-2">
            <div className="col-span-1">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOnSubmit)}>
                  {isSendingFeedback ? (
                    <>
                      <div className="flex h-full flex-col text-center justify-center align-middle p-8 max-w-[400px]">
                        <Skeleton className="mx-auto h-5 w-32 my-1" />
                        <Skeleton className="mx-auto h-5 w-32 my-1" />
                        <Skeleton className="mx-auto h-5 w-32 mt-1 mb-4" />
                        <Skeleton className="  mx-auto mb-4">
                          <p className="text-md tracking-tight px-10 py-2">
                            Sending...
                          </p>
                        </Skeleton>
                      </div>
                    </>
                  ) : (
                    <>
                      <FormField
                        control={form.control}
                        name="isCorrect"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="my-4 block text-center">
                              Is the result correct?
                            </FormLabel>
                            <FormControl>
                              <ToggleGroup
                                {...field}
                                type="single"
                                size="lg"
                                variant="outline"
                                onValueChange={field.onChange}
                              >
                                <ToggleGroupItem
                                  value="yes"
                                  className={`mr-4 ${
                                    isCorrect === "yes"
                                      ? "!bg-green-500 outline-1 outline-green-300 outline"
                                      : "!bg-green-950"
                                  }`}
                                >
                                  Yes
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                  value="no"
                                  className={` ${
                                    isCorrect === "no"
                                      ? "!bg-red-500 outline-1 outline-red-300 outline"
                                      : "!bg-red-950"
                                  }`}
                                >
                                  No
                                </ToggleGroupItem>
                              </ToggleGroup>
                            </FormControl>
                            <FormMessage {...field} />
                          </FormItem>
                        )}
                      />
                      {isCorrect === "no" && (
                        <FormField
                          control={form.control}
                          name="label"
                          render={({ field }) => (
                            <FormItem className="mt-5 mx-4 md:mx-10">
                              <FormLabel className="my-4 block text-center">
                                Which label would fit better?
                              </FormLabel>
                              <FormControl>
                                <Select
                                  {...field}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {map(tags, (tag) => (
                                      <SelectItem
                                        key={tag.value}
                                        value={tag.value}
                                      >
                                        {tag.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage {...field} />
                            </FormItem>
                          )}
                        />
                      )}
                      {((isCorrect === "no" && label !== "") ||
                        isCorrect === "yes") && (
                        <div className="text-center w-full mt-4  pt-4">
                          <Button
                            type="submit"
                            disabled={
                              form.formState.isSubmitting || isSendingFeedback
                            }
                          >
                            Submit feedback
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </form>
              </Form>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export { FeedbackForm };
