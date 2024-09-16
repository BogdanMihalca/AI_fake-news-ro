"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const FormSchema = z.object({
  text: z.string().optional(),
  web_address: z.string().optional(),
  type: z.enum(["free_text", "web_address"]),
});

export type FormSchemaType = z.infer<typeof FormSchema>;

interface BlackBoxFormProps {
  handleOnSubmit: (data: z.infer<typeof FormSchema>) => void; // eslint-disable-line
  reset?: () => void;
}

const BlackBoxForm = ({ handleOnSubmit, reset }: BlackBoxFormProps) => {
  const { status } = useSession();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: "",
      web_address: "",
      type: "free_text",
    },
  });

  const textValue = form.watch("text");

  return (
    <Tabs
      defaultValue="free_text"
      className="w-[400px] mx-auto md:mx-4 flex-shrink-0"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          value="free_text"
          onClick={() => {
            form.setValue("type", "free_text");
            form.setValue("text", "");
            reset && reset();
          }}
        >
          Free Text
        </TabsTrigger>
        <TabsTrigger
          value="web_address"
          onClick={() => {
            form.setValue("type", "web_address");
            form.setValue("text", "");
            reset && reset();
          }}
        >
          Web Address
        </TabsTrigger>
      </TabsList>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((d) => {
            status === "authenticated" && handleOnSubmit(d);
          })}
          className="w-full space-y-6 "
        >
          <TabsContent value="free_text">
            <Card className="min-h-[420px]">
              <CardHeader>
                <CardTitle>Free Text</CardTitle>
                <CardDescription>
                  Enter the text you want to send for analysis to the Blackbox
                  API. Make sure to press the &apos;analyze&apos; button when
                  you are done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormControl>
                          <Textarea
                            placeholder="enter your text here"
                            className="min-h-[200px] pr-8"
                            {...field}
                          />
                        </FormControl>
                        {/* clear input button*/}
                        <Button
                          type="button"
                          onClick={() => form.setValue("text", "")}
                          variant="link"
                          className={`absolute top-0 right-[-.5rem] bg-transparent ${
                            (textValue?.length || 0) < 1 ? "opacity-50" : ""
                          }`}
                          disabled={textValue === ""}
                        >
                          <CrossCircledIcon className="w-5 h-5" />
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <span tabIndex={0}>
                        <Button
                          type="submit"
                          disabled={status !== "authenticated"}
                        >
                          Analyze
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {status !== "authenticated" ? (
                      <TooltipContent>
                        <p className="max-w-60">
                          To use this functionality you need to be
                          authenticated.
                        </p>
                      </TooltipContent>
                    ) : null}
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="web_address">
            <Card className="min-h-[420px]">
              <CardHeader>
                <CardTitle>Web Address</CardTitle>
                <CardDescription>
                  Enter the web address you want to send for analysis to the
                  Blackbox API. Make sure to press the &apos;analyze&apos;
                  button when you are done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="web_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <span tabIndex={0}>
                        <Button
                          type="submit"
                          disabled={status !== "authenticated"}
                        >
                          Analyze
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {status !== "authenticated" ? (
                      <TooltipContent>
                        <p className="max-w-60">
                          To use this functionality you need to be
                          authenticated.
                        </p>
                      </TooltipContent>
                    ) : null}
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  );
};

export { BlackBoxForm };
