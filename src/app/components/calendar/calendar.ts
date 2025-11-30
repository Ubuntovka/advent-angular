import {ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy, Inject, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ApiService} from '../../services/api.service';

interface CalendarDay {
  day: number;
  isOpen: boolean;
  canOpen: boolean;
  content?: string;
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calendar implements OnInit, OnDestroy {
  days: CalendarDay[] = [];
  currentDate: Date = new Date();
  private refreshTimer: any;

  readonly dialog = inject(MatDialog);
  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  openDialog(day: CalendarDay) {
    this.dialog.open(DialogElementsExampleDialog, {
      data: { content: day.content ?? '', day: day.day }
    });
  }

  ngOnInit() {
    this.initializeCalendar();
    this.loadOpenedDays();
    this.loadAllowedDaysFromApi();
    // Refresh available days every 5 minutes
    this.refreshTimer = setInterval(() => {
      this.loadAllowedDaysFromApi();
    }, 5 * 60 * 1000);
  }

  ngOnDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }

  initializeCalendar() {
    // Shuffle days for random layout
    const dayNumbers = Array.from({ length: 24 }, (_, i) => i + 1);
    const shuffled = this.shuffleArray(dayNumbers);

    this.days = shuffled.map(day => ({
      day,
      isOpen: false,
      canOpen: false,
      content: undefined,
    }));
  }

  loadAllowedDaysFromApi() {
    this.api.getDays().subscribe({
      next: (resp: any) => {
        const items = Array.isArray(resp?.items) ? resp.items : [];
        const lookup = new Map<number, string>();
        for (const it of items) {
          const d = new Date(it.date);
          const dayNum = d.getDate(); // per requirements: ignore month, take day of month
          if (dayNum >= 1 && dayNum <= 24) {
            lookup.set(dayNum, typeof it.content === 'string' ? it.content : '');
          }
        }
        // Update calendar days
        this.days.forEach(cd => {
          if (lookup.has(cd.day)) {
            cd.canOpen = true;
            cd.content = lookup.get(cd.day);
          } else {
            cd.canOpen = false;
            cd.content = undefined;
          }
        });
        this.cdr.markForCheck();
      },
      error: (err) => {
        // On error, keep all days locked
        console.error('Failed to load allowed days', err);
        this.days.forEach(cd => {
          cd.canOpen = false;
          cd.content = undefined;
        });
        this.cdr.markForCheck();
      }
    });
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
export class DialogElementsExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {content: string, day: number}) {}
}
