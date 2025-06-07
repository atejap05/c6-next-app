"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  iconOnly?: boolean; // New prop for icon-only display
}

export function DatePicker({
  date,
  setDate,
  className,
  iconOnly = false,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground",
            iconOnly ? "w-10 h-10 p-0" : "w-full", // Adjust width for iconOnly
            className
          )}
          aria-label={
            iconOnly
              ? date
                ? `Data selecionada: ${format(date, "PPP", { locale: ptBR })}`
                : "Escolha uma data"
              : undefined
          }
        >
          <CalendarIcon className={cn("h-4 w-4", iconOnly ? "" : "mr-2")} />
          {!iconOnly &&
            (date
              ? format(date, "MMMM/yyyy", { locale: ptBR })
              : "Escolha o mês")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={ptBR} // Set locale for Calendar
          captionLayout="dropdown" // Corrected value
          fromYear={2020} // Optional: set a range for years
          toYear={new Date().getFullYear() + 5} // Optional: set a range for years
        />
      </PopoverContent>
    </Popover>
  );
}
