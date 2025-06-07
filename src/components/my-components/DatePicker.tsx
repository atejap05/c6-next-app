"use client";

import * as React from "react";
import {
  format,
  isSameMonth,
  isSameYear,
  startOfMonth,
  subMonths,
  endOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  period: DateRange | undefined;
  onPeriodChange: (period: DateRange | undefined) => void;
  className?: string;
  iconOnly?: boolean;
}

export function DatePicker({
  period,
  onPeriodChange,
  className,
  iconOnly = false,
}: DatePickerProps) {
  const displaySelectedPeriod = () => {
    if (iconOnly) return "";

    const currentDate = new Date();
    const startOfCurrentMonth = startOfMonth(currentDate);
    const startOfPreviousMonth = startOfMonth(subMonths(currentDate, 1));

    if (period?.from && period?.to) {
      const fromDate = period.from;
      const toDate = period.to;

      // Check for "Mês Atual"
      if (
        isSameMonth(fromDate, startOfCurrentMonth) &&
        isSameYear(fromDate, startOfCurrentMonth) &&
        isSameMonth(toDate, startOfCurrentMonth) &&
        isSameYear(toDate, startOfCurrentMonth)
      ) {
        return "Mês Atual";
      }

      // Check for "Mês Anterior"
      if (
        isSameMonth(fromDate, startOfPreviousMonth) &&
        isSameYear(fromDate, startOfPreviousMonth) &&
        isSameMonth(toDate, startOfPreviousMonth) &&
        isSameYear(toDate, startOfPreviousMonth)
      ) {
        return "Mês Anterior";
      }

      // Default range display
      return `${format(period.from, "MMMM/yyyy", {
        locale: ptBR,
      })} - ${format(period.to, "MMMM/yyyy", { locale: ptBR })}`;
    }

    if (period?.from) {
      return `${format(period.from, "MMMM/yyyy", { locale: ptBR })} - ...`;
    }

    return "Escolha o período";
  };

  const ariaLabel = iconOnly
    ? period?.from
      ? period.to
        ? `Período selecionado: ${format(period.from, "PPP", {
            locale: ptBR,
          })} até ${format(period.to, "PPP", { locale: ptBR })}`
        : `Data inicial selecionada: ${format(period.from, "PPP", {
            locale: ptBR,
          })}, selecione a data final`
      : "Escolha um período"
    : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !period?.from && "text-muted-foreground",
            iconOnly ? "w-10 h-10 p-0" : "w-full",
            className
          )}
          aria-label={ariaLabel}
        >
          <CalendarIcon className={cn("h-4 w-4", iconOnly ? "" : "mr-2")} />
          {!iconOnly && displaySelectedPeriod()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={period}
          onSelect={onPeriodChange}
          initialFocus
          locale={ptBR}
          captionLayout="dropdown"
          fromYear={2020} // TODO: Make this dynamic based on the oldest invoice date from DB
          toYear={new Date().getFullYear()} // Set max year to current year
          toDate={endOfDay(new Date())} // Disable selection of dates after today
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
