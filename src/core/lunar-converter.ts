import { THIEN_CAN, DIA_CHI } from './constants';

/**
 * Utility to convert Solar date to Lunar date and manage Can-Chi naming.
 * Ported from LunarConverter.kt and LunarDateUtil.kt
 * Supports range 1900 - 2049.
 */

const LUNAR_INFO = BigInt64Array.from([
  0x04bd8n, 0x04ae0n, 0x0a570n, 0x054d5n, 0x0d260n, 0x0d950n, 0x16554n, 0x056a0n, 0x09ad0n, 0x055d2n,
  0x04ae0n, 0x0a5b6n, 0x0a4d0n, 0x0d250n, 0x1d255n, 0x0b540n, 0x0d6a0n, 0x0ada2n, 0x095b0n, 0x14977n,
  0x04970n, 0x0a4b0n, 0x0b4b5n, 0x06a50n, 0x06d40n, 0x1ab54n, 0x02b60n, 0x09570n, 0x052f2n, 0x04970n,
  0x06566n, 0x0d4a0n, 0x0ea50n, 0x06e95n, 0x05ad0n, 0x02b60n, 0x186e3n, 0x092e0n, 0x1c8d7n, 0x0c950n,
  0x0d4a0n, 0x1d8a6n, 0x0b550n, 0x056a0n, 0x1a5b4n, 0x025d0n, 0x092d0n, 0x0d2b2n, 0x0a950n, 0x0b557n,
  0x06ca0n, 0x0b550n, 0x15355n, 0x04da0n, 0x0a5d0n, 0x14573n, 0x052d0n, 0x0a9a8n, 0x0e950n, 0x06aa0n,
  0x0aea6n, 0x0ab50n, 0x04b60n, 0x0aae4n, 0x0a570n, 0x05260n, 0x0f263n, 0x0d950n, 0x05b57n, 0x056a0n,
  0x096d0n, 0x04dd5n, 0x04ad0n, 0x0a4d0n, 0x0d4d4n, 0x0d250n, 0x0d558n, 0x0b540n, 0x0b5a0n, 0x195a6n,
  0x095b0n, 0x049b0n, 0x0a974n, 0x0a4b0n, 0x0b27an, 0x06a50n, 0x06d40n, 0x0af46n, 0x0ab60n, 0x09570n,
  0x04af5n, 0x04970n, 0x064b0n, 0x074a3n, 0x0ea50n, 0x06b58n, 0x055c0n, 0x0ab60n, 0x096d5n, 0x092e0n,
  0x0c960n, 0x0d954n, 0x0d4a0n, 0x0da50n, 0x07552n, 0x056a0n, 0x0abb7n, 0x025d0n, 0x092d0n, 0x0cab5n,
  0x0a950n, 0x0b4a0n, 0x0baa4n, 0x0ad50n, 0x055d9n, 0x04ba0n, 0x0a5b0n, 0x15176n, 0x052b0n, 0x0a930n,
  0x07954n, 0x06aa0n, 0x0ad50n, 0x05b52n, 0x04b60n, 0x0a6e6n, 0x0a4e0n, 0x0d260n, 0x0ea65n, 0x0d530n,
  0x05aa0n, 0x076a3n, 0x096d0n, 0x04bd7n, 0x04ad0n, 0x0a4d0n, 0x1d0b6n, 0x0d250n, 0x0d520n, 0x0dd45n,
  0x0b5a0n, 0x056d0n, 0x055b2n, 0x049b0n, 0x0a577n, 0x0a4b0n, 0x0aa50n, 0x1b255n, 0x06d20n, 0x0ada0n
]);

const MIN_YEAR = 1900;
const MAX_YEAR = 2049;

export interface LunarResult {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
}

export class LunarConverter {
  /**
   * Convert solar date to lunar date.
   */
  static convertSolarToLunar(day: number, month: number, year: number): LunarResult {
    if (year < MIN_YEAR || year > MAX_YEAR) {
      return { day, month, year, isLeap: false };
    }

    let offset = this.calculateOffsetFromBase(day, month, year);

    let iYear = MIN_YEAR;
    let daysInYear = 0;

    while (iYear <= MAX_YEAR) {
      daysInYear = this.getYearDays(iYear);
      if (offset < daysInYear) break;
      offset -= daysInYear;
      iYear++;
    }
    const lunarYear = iYear;

    const leapMonth = this.getLeapMonth(lunarYear);
    let iMonth = 1;
    let isLeapMonth = false;

    while (iMonth <= 12) {
      let daysInMonth = this.getMonthDays(lunarYear, iMonth);

      if (offset < daysInMonth) break;

      offset -= daysInMonth;

      if (leapMonth === iMonth) {
        if (isLeapMonth) {
          isLeapMonth = false;
          iMonth++;
        } else {
          daysInMonth = this.getLeapMonthDays(lunarYear);
          if (offset < daysInMonth) {
            isLeapMonth = true;
            break;
          }
          offset -= daysInMonth;
          isLeapMonth = false;
          iMonth++;
        }
      } else {
        iMonth++;
      }
    }

    const lunarDay = offset + 1;

    return { day: lunarDay, month: iMonth, year: lunarYear, isLeap: isLeapMonth };
  }

  private static getYearDays(year: number): number {
    let sum = 0;
    for (let i = 1; i <= 12; i++) {
      sum += this.getMonthDays(year, i);
    }
    return sum + this.getLeapMonthDays(year);
  }

  private static getLeapMonthDays(year: number): number {
    if (this.getLeapMonth(year) === 0) return 0;
    return (LUNAR_INFO[year - MIN_YEAR] & 0x10000n) !== 0n ? 30 : 29;
  }

  private static getLeapMonth(year: number): number {
    return Number(LUNAR_INFO[year - MIN_YEAR] & 0xfn);
  }

  private static getMonthDays(year: number, month: number): number {
    return (LUNAR_INFO[year - MIN_YEAR] & (0x10000n >> BigInt(month))) === 0n ? 29 : 30;
  }

  private static calculateOffsetFromBase(day: number, month: number, year: number): number {
    let days = 0;

    for (let y = MIN_YEAR; y < year; y++) {
      days += this.isLeapYear(y) ? 366 : 365;
    }

    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (let m = 1; m < month; m++) {
      days += daysInMonths[m - 1];
      if (m === 2 && this.isLeapYear(year)) days++;
    }

    days += day;
    days -= 31; // Jan 31, 1900

    return days;
  }

  private static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  // --- Can Chi Helpers ---

  static getCanChiNam(year: number): string {
    const can = THIEN_CAN[(year - 4) % 10];
    const chi = DIA_CHI[(year - 4) % 12];
    return `${can} ${chi}`;
  }

  static getChiNamIndex(year: number): number {
    return (year - 4) % 12;
  }

  static getCanNamIndex(year: number): number {
    return (year - 4) % 10;
  }

  static getCanChiThang(lunarMonth: number, yearCanIndex: number): string {
    const startCans: Record<number, number> = {
      0: 2, 1: 4, 2: 6, 3: 8, 4: 0,
      5: 2, 6: 4, 7: 6, 8: 8, 9: 0
    };

    const startCan = startCans[yearCanIndex] ?? 2;
    const currentCanIndex = (startCan + (lunarMonth - 1)) % 10;
    const currentChiIndex = (2 + (lunarMonth - 1)) % 12;

    return `${THIEN_CAN[currentCanIndex]} ${DIA_CHI[currentChiIndex]}`;
  }

  static getChiGio(hour: number): string {
    return DIA_CHI[this.getChiGioIndex(hour)];
  }

  static getChiGioIndex(hour: number): number {
    if (hour >= 23 || hour < 1) return 0;
    if (hour < 3) return 1;
    if (hour < 5) return 2;
    if (hour < 7) return 3;
    if (hour < 9) return 4;
    if (hour < 11) return 5;
    if (hour < 13) return 6;
    if (hour < 15) return 7;
    if (hour < 17) return 8;
    if (hour < 19) return 9;
    if (hour < 21) return 10;
    return 11;
  }
}
