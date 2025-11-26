import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

interface CalendarDay {
  day: number;
  isOpen: boolean;
  canOpen: boolean;
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, MatButtonModule, MatDialogContent, MatDialogActions],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calendar {
  days: CalendarDay[] = [];
  currentDate: Date = new Date();

  readonly dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(DialogElementsExampleDialog);
  }

  ngOnInit() {
    this.initializeCalendar();
    this.loadOpenedDays();
  }

  initializeCalendar() {
    // Shuffle days for random layout
    const dayNumbers = Array.from({ length: 24 }, (_, i) => i + 1);
    const shuffled = this.shuffleArray(dayNumbers);

    this.days = shuffled.map(day => ({
      day,
      isOpen: false,
      canOpen: this.canOpenDay(day)
    }));
  }

  canOpenDay(day: number): boolean {
    // For demo purposes, allow opening if current day >= advent day
    // In December, this would be: currentDate.getDate() >= day
    const currentDay = this.currentDate.getDate();
    const currentMonth = this.currentDate.getMonth();

    // Allow all days in demo mode (remove this for production)
    // For production: return currentMonth === 11 && currentDay >= day;
    return true; // Demo mode - allows opening any day
  }

  onDayClick(day: CalendarDay) {
    if (day.canOpen && !day.isOpen) {
      // Open the door
      day.isOpen = true;
      this.saveOpenedDay(day.day);
    }
  }

  saveOpenedDay(day: number) {
    const opened = this.getOpenedDays();
    if (!opened.includes(day)) {
      opened.push(day);
      localStorage.setItem('adventCalendarOpened', JSON.stringify(opened));
    }
  }

  loadOpenedDays() {
    const opened = this.getOpenedDays();
    this.days.forEach(day => {
      if (opened.includes(day.day)) {
        day.isOpen = true;
      }
    });
  }

  getOpenedDays(): number[] {
    const stored = localStorage.getItem('adventCalendarOpened');
    return stored ? JSON.parse(stored) : [];
  }

  shuffleArray(array: number[]): number[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}


@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: 'dialog/dialog.html',
  styleUrl: 'dialog/dialog.css',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogElementsExampleDialog {}
