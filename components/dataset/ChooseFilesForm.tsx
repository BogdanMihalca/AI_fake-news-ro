"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "./ChooseFilesForm.scss";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

// 3. Define your form schema
export interface File {
  name: string;
  size: number;
  type: string;
}

export interface FileList {
  [Symbol.iterator](): IterableIterator<File>;
  length: number;
  item(index: number): File | null;
}

const formSchema = z.object({
  files: z.instanceof(FileList),
});

interface ChooseFilesFromProps {
  onFilesSelected: (files: FileList | null) => void;
  onCommit: () => void;
  isLoading?: boolean;
  numberOfFiles?: number;
  numberOfObjects?: number;
}

const ChooseFilesFrom: FC<ChooseFilesFromProps> = ({
  onFilesSelected,
  onCommit,
  isLoading,
  numberOfFiles = 0,
  numberOfObjects = 0,
}) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    onFilesSelected(values.files);
  }

  const session = useSession();

  return (
    <div className="grid gap-4 grid-cols-4  choose-files">
      <Card className="p-5 col-span-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">Files</FormLabel>
                  <FormControl className="custom-file-input">
                    <Input
                      name="files"
                      type="file"
                      className="text-white max-w-sm"
                      multiple
                      onChange={(e) => {
                        e.target.files &&
                          form.setValue("files", e.target.files, {
                            shouldValidate: true,
                          });
                      }}
                    />
                  </FormControl>
                  <FormDescription>Choose the JSON files</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} variant="secondary">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Load
            </Button>
            <Button
              variant="destructive"
              className="ml-2"
              onClick={onCommit}
              type="button"
              disabled={numberOfFiles === 0 || isLoading || !session.data?.user}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : !session.data?.user ? (
                "Not authorized"
              ) : (
                "Commit to db"
              )}
            </Button>
          </form>
        </Form>
      </Card>
      <Card className="p-5 col-span-3">
        <h3 className="text-2xl font-bold tracking-tight">Selected</h3>
        <div className="gird">
          {
            // display selected files as badges each having an x to remove it
            form.getValues().files && (
              <div>
                {Array.from(form.getValues().files).map((file) => (
                  <div key={file.name}>
                    <Badge variant="destructive" className="m-1">
                      <span>{file.name}</span>
                      <button
                        type="button"
                        className="ml-2 text-red-500"
                        onClick={() => {
                          const newFiles = Array.from(
                            form.getValues().files
                          ).filter((f: File) => f.name !== file.name);
                          let data = new DataTransfer();
                          newFiles.forEach((f) => data.items.add(f));

                          // Remove the file from the form value
                          form.setValue("files", data.files, {
                            shouldValidate: true,
                          });
                        }}
                      >
                        x
                      </button>
                    </Badge>
                  </div>
                ))}
              </div>
            )
          }
        </div>
        <Card className="inline-block w-6/12 mt-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Number of Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"> {numberOfFiles}</div>
          </CardContent>
        </Card>
        <Card className="inline-block w-6/12 mt-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total number of objects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{numberOfObjects}</div>
            <p className="text-xs text-muted-foreground"></p>
          </CardContent>
        </Card>
      </Card>
    </div>
  );
};

export default ChooseFilesFrom;
