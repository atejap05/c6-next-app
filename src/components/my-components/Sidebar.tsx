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
  BarChart2,
  Settings,
  UploadCloud,
  Eye,
  ChevronsLeft,
  ChevronsRight,
  Layers,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Upload", icon: Home },
  { href: "/visao-geral", label: "Visão Geral", icon: Eye },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/parcelas", label: "Parcelas", icon: Layers },
  { href: "/analysis", label: "Análises", icon: BarChart2 },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar collapse

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

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
      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"; // Added transition-colors
    const activeClasses = "bg-primary text-primary-foreground";
    const inactiveClasses =
      "text-muted-foreground hover:bg-muted hover:text-foreground";

    const linkContent = (
      <>
        <Icon
          className={cn(
            "h-5 w-5", // Removed mr-3 for collapsed state
            isActive
              ? "text-primary-foreground"
              : "text-muted-foreground group-hover:text-foreground",
            isCollapsed && !isMobile ? "mx-auto" : "mr-3" // Center icon when collapsed on desktop
          )}
        />
        {(!isCollapsed || isMobile) && <span>{label}</span>}{" "}
        {/* Hide label when collapsed on desktop */}
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
          "group",
          isCollapsed ? "justify-center" : "" // Center content when collapsed
        )}
        // Show tooltip when collapsed
        title={isCollapsed ? label : undefined}
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
                <>
                  <UploadCloud className="h-7 w-7 text-primary" />
                  <span className="text-xl font-semibold">FinanceApp</span>
                </>
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
      <aside
        className={cn(
          "hidden md:flex md:flex-col md:fixed md:inset-y-0 md:border-r md:bg-background md:z-40 transition-all duration-300 ease-in-out", // Added transition-all
          isCollapsed ? "md:w-20" : "md:w-64" // Dynamic width
        )}
      >
        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <div
            className={cn(
              "mb-8 flex items-center py-4",
              isCollapsed ? "justify-center" : "justify-between" // Adjust logo and toggle button alignment
            )}
          >
            {!isCollapsed && (
              <Link href="/" className="flex items-center space-x-2">
                <>
                  <UploadCloud className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold">FinanceApp</span>
                </>
              </Link>
            )}
            {isCollapsed && ( // Show only icon when collapsed
              <Link href="/" className="flex items-center">
                <UploadCloud className="h-8 w-8 text-primary" />
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:inline-flex" // Show only on desktop
              aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              {isCollapsed ? (
                <ChevronsRight className="h-6 w-6" />
              ) : (
                <ChevronsLeft className="h-6 w-6" />
              )}
            </Button>
          </div>
          <nav className="flex-1 space-y-2">
            {navItems.map(item => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
