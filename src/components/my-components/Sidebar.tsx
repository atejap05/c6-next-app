"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Menu,
  Home,
  List,
  BarChart2,
  Settings,
  UploadCloud,
  Eye, // Import Eye icon
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/upload", label: "Upload Fatura", icon: UploadCloud }, // Moved to top
  { href: "/visao-geral", label: "Visão Geral", icon: Eye }, // Added Visão Geral
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/transactions", label: "Transações", icon: List },
  { href: "/analysis", label: "Análises", icon: BarChart2 },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const NavLink = ({
    href,
    label,
    icon: Icon,
    isMobile = false,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
    isMobile?: boolean;
  }) => {
    const isActive = pathname === href;
    const commonClasses =
      "flex items-center px-3 py-2 rounded-md text-sm font-medium";
    const activeClasses = "bg-primary text-primary-foreground";
    const inactiveClasses =
      "text-muted-foreground hover:bg-muted hover:text-foreground";

    const linkContent = (
      <>
        <Icon
          className={cn(
            "mr-3 h-5 w-5",
            isActive
              ? "text-primary-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          )}
        />
        {label}
      </>
    );

    if (isMobile) {
      return (
        <SheetClose asChild>
          <Link
            href={href}
            className={cn(
              commonClasses,
              isActive ? activeClasses : inactiveClasses,
              "w-full justify-start"
            )}
          >
            {linkContent}
          </Link>
        </SheetClose>
      );
    }

    return (
      <Link
        href={href}
        className={cn(
          commonClasses,
          isActive ? activeClasses : inactiveClasses,
          "group"
        )}
      >
        {linkContent}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Sidebar (Sheet) */}
      <div className="md:hidden p-4 fixed top-0 left-0 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6">
            <div className="mb-6">
              <Link href="/" className="flex items-center space-x-2">
                {/* You can replace this with your app logo or name */}
                <UploadCloud className="h-7 w-7 text-primary" />
                <span className="text-xl font-semibold">FinanceApp</span>
              </Link>
            </div>
            <nav className="flex flex-col space-y-2">
              {navItems.map(item => (
                <NavLink key={item.href} {...item} isMobile={true} />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:border-r md:bg-background md:z-40">
        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <div className="mb-8 flex items-center justify-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <UploadCloud className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">FinanceApp</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-2">
            {navItems.map(item => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>
          {/* Optional: Add a section at the bottom of the sidebar */}
          {/* <div className="mt-auto p-2">
            <Button variant="outline" className="w-full">
              User Profile
            </Button>
          </div> */}
        </div>
      </aside>
    </>
  );
}
