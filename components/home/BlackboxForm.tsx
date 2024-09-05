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
}

const BlackBoxForm = ({ handleOnSubmit }: BlackBoxFormProps) => {
  const { status } = useSession();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: "",
      web_address: "",
      type: "free_text",
    },
  });

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
          }}
        >
          Text liber
        </TabsTrigger>
        <TabsTrigger
          value="web_address"
          onClick={() => {
            form.setValue("type", "web_address");
          }}
        >
          Adresa web
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
                <CardTitle>Text liber</CardTitle>
                <CardDescription>
                  Introdu textul pe care vrei să îl trimiți spre analizare la
                  API-ul Blackbox. Asigură-te că apeși butonul de
                  &apos;analizeaza&apos; când ai terminat.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="enter your text here"
                            className="min-h-[200px]"
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
                          Analizeaza
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {status !== "authenticated" ? (
                      <TooltipContent>
                        <p>
                          Pentru a folosi această funcționalitate trebuie să fii
                          autentificat.
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
                <CardTitle>Adresa web</CardTitle>
                <CardDescription>
                  Introdu adresa web pe care vrei să o trimiți spre analizare la
                  API-ul Blackbox. Asigură-te că apeși butonul de
                  &apos;analizeaza&apos; când ai terminat.
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
                          Analizeaza
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {status !== "authenticated" ? (
                      <TooltipContent>
                        <p>
                          Pentru a folosi această funcționalitate trebuie să fii
                          autentificat.
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
