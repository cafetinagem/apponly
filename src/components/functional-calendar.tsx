
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ModelSession } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FunctionalCalendarProps {
  sessions: ModelSession[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export const FunctionalCalendar = ({
  sessions,
  selectedDate,
  onDateSelect,
  currentMonth,
  onMonthChange
}: FunctionalCalendarProps) => {
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
      if (days.length > 42) break; // Limit to 6 weeks
    }

    return days;
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  const getSessionDot = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'canceled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const previousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="bg-card text-card-foreground">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <span className="text-sm text-muted-foreground">
            {sessions.length} calls agendadas
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => {
          const daySession = getSessionsForDate(day);
          const hasSession = daySession.length > 0;

          return (
            <div
              key={index}
              className={`
                relative p-2 h-16 border border-border cursor-pointer transition-colors
                ${isCurrentMonth(day) 
                  ? 'bg-card hover:bg-accent text-card-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
                ${isSelected(day) ? 'bg-primary/10 border-primary' : ''}
                ${isToday(day) ? 'ring-2 ring-primary' : ''}
              `}
              onClick={() => onDateSelect(day)}
            >
              <div className="text-sm font-medium">
                {day.getDate()}
              </div>
              
              {hasSession && (
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="flex space-x-1 overflow-hidden">
                    {daySession.slice(0, 3).map((session, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full ${getSessionDot(session.status)}`}
                      />
                    ))}
                    {daySession.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{daySession.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
