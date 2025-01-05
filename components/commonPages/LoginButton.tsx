import { signIn, signOut, useSession } from "next-auth/react";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { Icons } from "../common/Icons";

const FormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export function LoginButton() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    const { email, password } = data;
    try {
      const response: any = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!response?.error && response.ok) {
        // Process response here
        toast({ title: "Login Successful", variant: "success" });
      } else {
        throw new Error("Check your email and password");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google");
  };

  const { data: session, status } = useSession();
  console.log(session);

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <DropdownMenu>
        <div className="flex align-middle justify-center">
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={session.user?.image as string} alt="bm" />
              <AvatarFallback>
                {session.user?.name
                  ?.split(" ")
                  .map((name: string) => name[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <div className=" ml-3 mt-2 flex align-middle justify-center">
            {session.user?.name || session.user?.email}
          </div>
        </div>
        <DropdownMenuContent className="min-w-40">
          <DropdownMenuLabel>{session.user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-3">
          Login
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Register</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <>
                  <FormItem className="grid grid-cols-4 items-center gap-4 ">
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
                  <FormMessage className="text-right " />
                </>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <>
                  <FormItem className="grid grid-cols-4 items-center gap-4 mt-5">
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

            <DialogFooter className="block text-center">
              <Button className="mt-5 mb-5 w-" type="submit">
                Login
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
                Sign in with Google
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
