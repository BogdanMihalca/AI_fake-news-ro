"use client";

import * as React from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Icons } from "../common/Icons";
import { Separator } from "../ui/separator";
import { LoginButton } from "./LoginButton";
import { RegisterButton } from "./RegisterButton";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Veridica",
    href: "https://veridica.ro/baza-de-date",
    description:
      "O baza de date cu surse de știri verificate de jurnaliști profesioniști.",
  },
];

const Navbar = () => {
  const [path, setPath] = React.useState("");

  React.useEffect(() => {
    // This code runs only on the client side where `window` is defined
    setPath(window.location.pathname);
  }, []);

  const breadcrumbItems = React.useMemo(() => {
    const pathSegments = path
      ?.split("/")
      .filter((segment: string) => segment !== "");
    const items = pathSegments?.map((segment: any, index: number) => {
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      return { title: segment, href };
    });
    return items || [];
  }, [path]);

  const BreadCrumbs = React.useMemo(() => {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.length > 1 &&
            breadcrumbItems.map((item, index) => (
              <>
                <BreadcrumbItem key={item.title}>
                  <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && (
                  <BreadcrumbSeparator key={`${item.title}_sep`} />
                )}
              </>
            ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, [breadcrumbItems]);

  return (
    <>
      <NavigationMenu className="mt-5 flex justify-between max-w-none">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Acasă
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Informații generale</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <Icons.logo className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Stiri false
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        O aplicație pentru detectarea știrilor false. folosind
                        machine learning. Detectarea știrilor false este un
                        proces complex, care implică analiza conținutului, a
                        sursei și a contextului.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/docs" title="Introducere">
                  Informații generale despre aplicație.
                </ListItem>
                <ListItem href="/docs" title="Stiudiu Comparativ">
                  Un studiu comparativ al unor modele de machine learning.
                </ListItem>
                <ListItem href="/docs" title="Concluzii">
                  Concluzii și recomandări.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Surse de date</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/datasets" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Set de date
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuList>
          <NavigationMenuItem>
            <LoginButton />
            <RegisterButton />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Separator orientation="horizontal" className="mt-2 mb-2" />
      {BreadCrumbs}
      {breadcrumbItems.length > 1 && (
        <Separator
          orientation="horizontal"
          className="mt-2"
          style={{ width: "15%" }}
        />
      )}
    </>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
