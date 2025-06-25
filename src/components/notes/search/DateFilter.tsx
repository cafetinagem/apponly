
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface DateFilterProps {
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  showDatePicker: boolean;
  onShowDatePickerChange: (show: boolean) => void;
}

export function DateFilter({ 
  dateRange, 
  onDateRangeChange, 
  showDatePicker, 
  onShowDatePickerChange 
}: DateFilterProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">Período</label>
      <Popover open={showDatePicker} onOpenChange={onShowDatePickerChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            {dateRange.from ? (
              `${dateRange.from.toLocaleDateString()}`
            ) : (
              "Selecionar data"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={dateRange.from}
            onSelect={(date) => {
              onDateRangeChange({ 
                from: date,
                to: dateRange.to 
              });
              onShowDatePickerChange(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
