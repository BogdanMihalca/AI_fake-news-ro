import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { Icons } from "../common/Icons";

const FormSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    password2: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  })
  .superRefine(({ password2, password }, ctx) => {
    if (password2 !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["password2"],
      });
    }
  });

type FormData = z.infer<typeof FormSchema>;

export function RegisterButton() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password2: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    console.log("Submitting form", data);

    const { email, password, name } = data;

    try {
      const response: any = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });
      if (!response.ok || response.error) {
        const error = await response.json();
        throw new Error(error.message);
      }
      // Process response here
      console.log("Registration Successful", response);
      toast({ title: "Registration Successful" });
      setOpen(false);
    } catch (error: any) {
      console.error("Registration Failed:", error);
      toast({ title: "Registration Failed", description: error.message });
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google");
  };

  const { status } = useSession();

  if (status === "authenticated" || status === "loading") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-3">
          Register
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            className="grid gap-4 py-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <DialogHeader>
              <DialogTitle>Register</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <>
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="name" className="text-right">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        type="text"
                        className="col-span-3"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                  <FormMessage className="text-right" />
                </>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <>
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="name" className="text-right">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        type="email"
                        className="col-span-3"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                  <FormMessage className="text-right" />
                </>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <>
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="password" className="text-right">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        className="col-span-3"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                  <FormMessage className="text-right" />
                </>
              )}
            />

            <FormField
              control={form.control}
              name="password2"
              render={({ field }) => (
                <>
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="password2" className="text-right">
                      Retype Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="password2"
                        type="password"
                        className="col-span-3"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                  <FormMessage className="text-right" />
                </>
              )}
            />

            <DialogFooter className="block text-center">
              <Button className="mt-3 mb-3" type="submit">
                Register
              </Button>
              <Separator />
              <p className="mt-3">or</p>
              <Button
                variant="outline"
                type="button"
                className="mt-3 mb-3"
                onClick={handleGoogleLogin}
              >
                <Icons.googleLogo
                  width={20}
                  height={20}
                  className="mr-3"
                  color="unset"
                />{" "}
                Sign up with Google
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
