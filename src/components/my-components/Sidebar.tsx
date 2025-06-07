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
  BarChart2,
  Settings,
  UploadCloud,
  Eye,
  ChevronsLeft,
  ChevronsRight,
  Layers,
  LayoutDashboard,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { DatePicker } from "@/components/my-components/DatePicker";
import { useCsvStore } from "@/store/csvStore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

const navItems = [
  { href: "/", label: "Visão Geral", icon: Eye },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transações", icon: Layers },
  { href: "/parcelas", label: "Parcelas", icon: Layers },
  { href: "/analysis", label: "Análises", icon: BarChart2 },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { selectedPeriod, setSelectedPeriod } = useCsvStore();

  // Define sidebar widths
  const collapsedWidth = "80px"; // 5rem or w-20
  const expandedWidth = "256px"; // 16rem or w-64

  useEffect(() => {
    // Update CSS variable for sidebar width
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isCollapsed ? collapsedWidth : expandedWidth
    );
  }, [isCollapsed]);

  // Adapt Zustand's selectedPeriod to DateRange for the DatePicker
  const [currentPickerPeriod, setCurrentPickerPeriod] = useState<
    DateRange | undefined
  >(
    selectedPeriod.startDate
      ? { from: selectedPeriod.startDate, to: selectedPeriod.endDate }
      : undefined
  );

  useEffect(() => {
    setCurrentPickerPeriod(
      selectedPeriod.startDate
        ? { from: selectedPeriod.startDate, to: selectedPeriod.endDate }
        : undefined
    );
  }, [selectedPeriod]);

  const handlePickerPeriodChange = (newPickerPeriod: DateRange | undefined) => {
    setSelectedPeriod({
      startDate: newPickerPeriod?.from,
      endDate: newPickerPeriod?.to,
    });
  };

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
      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeClasses = "bg-primary text-primary-foreground";
    const inactiveClasses =
      "text-muted-foreground hover:bg-muted hover:text-foreground";

    const linkContent = (
      <>
        <Icon
          className={cn(
            "h-5 w-5",
            isActive
              ? "text-primary-foreground"
              : "text-muted-foreground group-hover:text-foreground",
            isCollapsed && !isMobile ? "mx-auto" : "mr-3"
          )}
        />
        {(!isCollapsed || isMobile) && <span>{label}</span>}
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
          isCollapsed ? "justify-center" : ""
        )}
        title={isCollapsed ? label : undefined}
      >
        {linkContent}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Sidebar (Sheet) */}
      <div className="md:hidden p-4 fixed top-0 left-0 z-50 bg-background border-b w-full">
        <div className="flex justify-between items-center">
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
                  <UploadCloud className="h-7 w-7 text-primary" />
                  <span className="text-xl font-semibold">FinanceApp</span>
                </Link>
              </div>
              <nav className="flex flex-col space-y-2">
                {navItems.map(item => (
                  <NavLink key={item.href} {...item} isMobile={true} />
                ))}
              </nav>
              <div className="mt-6 pt-6 border-t">
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Período Selecionado
                </p>
                <DatePicker
                  period={currentPickerPeriod}
                  onPeriodChange={handlePickerPeriodChange}
                />
              </div>
            </SheetContent>
          </Sheet>
          {/* DatePicker for mobile view - header */}
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">
              {currentPickerPeriod?.from
                ? currentPickerPeriod.to
                  ? `${format(currentPickerPeriod.from, "MMM/yy", {
                      locale: ptBR,
                    })} - ${format(currentPickerPeriod.to, "MMM/yy", {
                      locale: ptBR,
                    })}`
                  : format(currentPickerPeriod.from, "MMMM/yyyy", {
                      locale: ptBR,
                    })
                : "Selecione o período"}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar (Fixed) */}
      <aside
        className={cn(
          "hidden md:flex md:flex-col md:fixed md:inset-y-0 md:border-r md:bg-background md:z-40 transition-all duration-300 ease-in-out",
          isCollapsed ? "md:w-20" : "md:w-64" // Keeps direct style for immediate rendering
        )}
      >
        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <div
            className={cn(
              "mb-8 flex items-center py-4",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            {!isCollapsed && (
              <Link href="/" className="flex items-center space-x-2">
                <UploadCloud className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">FinanceApp</span>
              </Link>
            )}
            {isCollapsed && (
              <Link href="/" className="flex items-center">
                <UploadCloud className="h-8 w-8 text-primary" />
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:inline-flex"
              aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              {isCollapsed ? (
                <ChevronsRight className="h-6 w-6" />
              ) : (
                <ChevronsLeft className="h-6 w-6" />
              )}
            </Button>
          </div>
          <nav className="flex flex-col space-y-2 mt-4">
            {navItems.map(item => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>

          {/* DatePicker section for Desktop */}
          <div className="mt-8 pt-6 border-t">
            {" "}
            {/* Adjusted margin-top from mt-auto to mt-8 */}
            {!isCollapsed && (
              <p className="mb-2 text-sm font-medium text-muted-foreground px-3">
                Escolha o Período
              </p>
            )}
            {isCollapsed ? (
              <div className="flex justify-center my-2">
                <DatePicker
                  period={currentPickerPeriod}
                  onPeriodChange={handlePickerPeriodChange}
                  iconOnly={true}
                />
              </div>
            ) : (
              <DatePicker
                period={currentPickerPeriod}
                onPeriodChange={handlePickerPeriodChange}
                className="w-full"
              />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
