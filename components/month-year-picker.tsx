"use client"

import * as React from "react"
import { isAfter, isSameMonth, isSameYear, parseISO, format } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MonthYearPickerProps {
  date: string | null;
  onDateChange: (date: string) => void;
  disabled?: boolean;
  minDate?: string | null;
  maxDate?: string | null;
}

export function MonthYearPicker({ date, onDateChange, disabled, minDate, maxDate }: MonthYearPickerProps) {
  const [year, month] = date && date !== "" ? date.split("-") : [undefined, undefined];
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  const minYear = minDate && minDate !== "" ? parseISO(minDate).getFullYear() : 1960;
  const minMonth = minDate && minDate !== "" ? parseISO(minDate).getMonth() + 1 : 1;
  
  const maxYear = maxDate && maxDate !== "" ? parseISO(maxDate).getFullYear() : currentYear;
  const maxMonth = maxDate && maxDate !== "" ? parseISO(maxDate).getMonth() + 1 : currentMonth;

  const handleYearChange = (newYear: string) => {
    const newYearNum = parseInt(newYear, 10);
    let selectedMonth = month ? parseInt(month, 10) : 1;

    // Validate month against min/max constraints
    if (minDate && minDate !== "" && newYearNum === minYear && selectedMonth < minMonth) {
      selectedMonth = minMonth;
    }
    
    if (maxDate && maxDate !== "" && newYearNum === maxYear && selectedMonth > maxMonth) {
      selectedMonth = maxMonth;
    }
    
    // Don't allow future months in current year
    if (newYearNum === currentYear && selectedMonth > currentMonth) {
      selectedMonth = currentMonth;
    }

    onDateChange(`${newYear}-${String(selectedMonth).padStart(2, '0')}-01`);
  };

  const handleMonthChange = (newMonth: string) => {
    const selectedYear = year ? parseInt(year, 10) : currentYear;
    onDateChange(`${selectedYear}-${newMonth}-01`);
  };

  // Generate years from 1960 to current year
  const years = Array.from({ length: currentYear - 1959 }, (_, i) => currentYear - i);
  
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  
  const selectedYear = year ? parseInt(year, 10) : null;

  return (
    <div className="flex gap-2">
      <Select onValueChange={handleYearChange} value={year} disabled={disabled}>
        <SelectTrigger className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => {
            let isYearDisabled = false;
            
            // Don't allow years before minDate
            if (minDate && minDate !== "" && y < minYear) {
              isYearDisabled = true;
            }
            
            // Don't allow years after maxDate (current year)
            if (y > currentYear) {
              isYearDisabled = true;
            }
            
            return (
              <SelectItem key={y} value={String(y)} disabled={isYearDisabled}>
                {y}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Select onValueChange={handleMonthChange} value={month || undefined} disabled={disabled}>
        <SelectTrigger className="h-9 rounded-md border-gray-200 text-sm focus:border-black focus:ring-black">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => {
            const monthValue = parseInt(m.value, 10);
            let isMonthDisabled = false;
            
            if (selectedYear) {
              // Don't allow future months in current year
              if (selectedYear === currentYear && monthValue > currentMonth) {
                isMonthDisabled = true;
              }
              
              // Don't allow months before minDate
              if (minDate && minDate !== "" && selectedYear === minYear && monthValue < minMonth) {
                isMonthDisabled = true;
              }
              
              // Don't allow months after maxDate
              if (maxDate && maxDate !== "" && selectedYear === maxYear && monthValue > maxMonth) {
                isMonthDisabled = true;
              }
            }
            
            return (
              <SelectItem key={m.value} value={m.value} disabled={isMonthDisabled}>
                {m.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
} 