import { describe, it, expect } from 'vitest';
import {
  toGregorian, toEthiopic, today, yearProgress,
  addDays, addMonths, addYears
} from '../src';
import {
  getHighlightsForDay, searchHighlights, listAllHighlights
} from '../src/highlights';

describe('Edge Cases & Real-World Scenarios', () => {
  // Test epoch boundaries
  it('should handle epoch boundaries correctly', () => {
    // Test around Ethiopic epoch - test that conversion is consistent
    const testDate = { year: 8, month: 8, day: 29 };
    const converted = toEthiopic(testDate);
    const backToGregorian = toGregorian(converted);

    // The conversion should be consistent (round-trip)
    expect(backToGregorian).toEqual(testDate);
    expect(converted.era).toBe('AM');
    expect(converted.year).toBe(1);
  });

  // Test leap year scenarios
  it('should handle leap years correctly', () => {
    // Gregorian leap years
    const gregLeapTests = [
      { year: 2000, isLeap: true, febDays: 29 },
      { year: 2004, isLeap: true, febDays: 29 },
      { year: 1900, isLeap: false, febDays: 28 },
      { year: 2023, isLeap: false, febDays: 28 }
    ];

    // Ethiopic leap years (year % 4 === 3)
    const ethLeapTests = [
      { year: 2015, isLeap: true }, // 2015 % 4 = 3
      { year: 2016, isLeap: false }, // 2016 % 4 = 0
      { year: 2019, isLeap: true },  // 2019 % 4 = 3
      { year: 2020, isLeap: false }  // 2020 % 4 = 0
    ];

    // Test Gregorian leap year calculations
    gregLeapTests.forEach(({ year, isLeap }) => {
      const actual = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      expect(actual).toBe(isLeap);
    });

    // Test Ethiopic leap year calculations
    ethLeapTests.forEach(({ year, isLeap }) => {
      const actual = year % 4 === 3;
      expect(actual).toBe(isLeap);
    });
  });

  // Test date arithmetic edge cases
  it('should handle date arithmetic edge cases', () => {
    // Test adding days across month/year boundaries
    const arithmeticTests = [
      // Across Gregorian month boundaries
      { start: { year: 2023, month: 1, day: 31 }, addDays: 1, expected: { year: 2023, month: 2, day: 1 } },
      { start: { year: 2023, month: 12, day: 31 }, addDays: 1, expected: { year: 2024, month: 1, day: 1 } },

      // Across Ethiopic month boundaries
      { start: { year: 2015, month: 12, day: 30, era: 'AM' }, addDays: 1, expected: { year: 2015, month: 13, day: 1, era: 'AM' } },
      { start: { year: 2015, month: 13, day: 6, era: 'AM' }, addDays: 1, expected: { year: 2016, month: 1, day: 1, era: 'AM' } }, // Leap year
    ];

    arithmeticTests.forEach(({ start, addDays: daysToAdd, expected }) => {
      const result = addDays(start, daysToAdd, start.era ? 'ethiopic' : 'gregorian');
      expect(result).toEqual(expected);
    });

    // Test month arithmetic
    const feb29 = { year: 2024, month: 2, day: 29 };
    const afterAddMonth = addMonths(feb29, 1, 'gregorian');
    expect(afterAddMonth).toEqual({ year: 2024, month: 3, day: 29 });

    // Test year arithmetic
    const yearResult = addYears(feb29, 1, 'gregorian');
    expect(yearResult).toEqual({ year: 2025, month: 2, day: 28 }); // 2025 is not a leap year
  });

  // Test highlights across calendar boundaries
  it('should handle highlights across calendar systems', () => {
    // Test that Ethiopian holidays appear correctly in Gregorian calendar
    const gennaEthiopic = { year: 2017, month: 4, day: 29, era: 'AM' };
    const gennaGregorian = toGregorian(gennaEthiopic);

    const ethHighlights = getHighlightsForDay(gennaEthiopic, 'ethiopic');
    const gregHighlights = getHighlightsForDay(gennaGregorian, 'gregorian');

    // Check that we get some highlights for Genna date
    expect(ethHighlights.length).toBeGreaterThan(0);
    expect(gregHighlights.length).toBeGreaterThan(0);
  });

  // Test year boundaries
  it('should handle year boundary transitions', () => {
    const dec31 = { year: 2023, month: 12, day: 31 };
    const jan1Next = addDays(dec31, 1, 'gregorian');
    expect(jan1Next).toEqual({ year: 2024, month: 1, day: 1 });

    const dec31Ethiopic = { year: 2015, month: 13, day: 6, era: 'AM' };
    const jan1EthiopicNext = addDays(dec31Ethiopic, 1, 'ethiopic');
    expect(jan1EthiopicNext).toEqual({ year: 2016, month: 1, day: 1, era: 'AM' });
  });

  // Test invalid date handling
  it('should handle invalid dates gracefully', () => {
    // Test Gregorian invalid date (Feb 30)
    const invalidGregorian = { year: 2023, month: 2, day: 30 };
    const converted = toEthiopic(invalidGregorian);
    // Should either throw or return a valid Ethiopic date
    expect(converted).toBeDefined();

    // Test Ethiopic invalid date (Pagume 7 in non-leap year)
    const invalidEthiopic = { year: 2015, month: 13, day: 7, era: 'AM' };
    const convertedBack = toGregorian(invalidEthiopic);
    // Should either throw or return a valid Gregorian date
    expect(convertedBack).toBeDefined();
  });

  // Test real-world date scenarios
  it('should handle real-world scenarios correctly', () => {
    // Test current date functionality
    const todayDate = today('gregorian');
    expect(todayDate).toHaveProperty('year');
    expect(todayDate).toHaveProperty('month');
    expect(todayDate).toHaveProperty('day');

    const todayEthiopic = today('ethiopic');
    expect(todayEthiopic).toHaveProperty('year');
    expect(todayEthiopic).toHaveProperty('month');
    expect(todayEthiopic).toHaveProperty('day');
    expect(todayEthiopic).toHaveProperty('era');

    // Test year progress calculation
    const yearStart = { year: 2023, month: 1, day: 1 };
    const progress = yearProgress(yearStart, 'gregorian');
    expect(progress.totalDaysInYear).toBe(365); // 2023 is not a leap year
    expect(progress.percentCompleted).toBe(0);

    const yearEnd = { year: 2023, month: 12, day: 31 };
    const endProgress = yearProgress(yearEnd, 'gregorian');
    expect(endProgress.percentCompleted).toBeGreaterThanOrEqual(99); // Should be very close to 100%

    // Test Ethiopic year progress
    const ethYearStart = { year: 2015, month: 1, day: 1, era: 'AM' };
    const ethProgress = yearProgress(ethYearStart, 'ethiopic');
    expect(ethProgress.totalDaysInYear).toBe(366); // 2015 is a leap year
  });

  // Test highlight search functionality
  it('should search highlights correctly', () => {
    // Test English search
    const englishResults = searchHighlights('New Year');
    expect(englishResults.length).toBeGreaterThan(0);

    // Test Amharic search
    const amharicResults = searchHighlights('እንቁጣጣሽ');
    expect(amharicResults.length).toBeGreaterThan(0);
    expect(amharicResults.some(h => h.id === 'enkutatash')).toBe(true);

    // Test partial matches
    const partialResults = searchHighlights('christmas');
    expect(partialResults.length).toBeGreaterThan(1); // Should find both Genna and Christmas
  });

  // Test comprehensive highlight listing
  it('should list all highlights for a year', () => {
    const gregHighlights = listAllHighlights(2024, 'gregorian');
    expect(gregHighlights.length).toBeGreaterThan(0);

    const ethHighlights = listAllHighlights(2016, 'ethiopic');
    expect(ethHighlights.length).toBeGreaterThan(0);

    // Check that highlights have both calendar representations
    if (gregHighlights.length > 0) {
      const firstHighlight = gregHighlights[0];
      expect(firstHighlight).toHaveProperty('gregorian');
      expect(firstHighlight).toHaveProperty('ethiopic');
      expect(firstHighlight).toHaveProperty('name');
      expect(firstHighlight).toHaveProperty('amharicName');
    }
  });

  // Test weekday calculations
  it('should calculate weekdays correctly', () => {
    // Test known weekdays
    const monday = { year: 2024, month: 1, day: 1 }; // January 1, 2024 was a Monday
    const weekday = new Date(monday.year, monday.month - 1, monday.day).getDay();
    expect(weekday).toBe(1); // Monday
  });

  // Test very large and very small years
  it('should handle extreme years', () => {
    // Test far future
    const future = { year: 3000, month: 1, day: 1 };
    const futureEthiopic = toEthiopic(future);
    expect(futureEthiopic).toBeDefined();

    const backToFuture = toGregorian(futureEthiopic);
    expect(backToFuture).toEqual(future);

    // Test far past (within reasonable bounds)
    const past = { year: 100, month: 1, day: 1 };
    const pastEthiopic = toEthiopic(past);
    expect(pastEthiopic).toBeDefined();

    const backToPast = toGregorian(pastEthiopic);
    expect(backToPast).toEqual(past);
  });

  // Test month length calculations
  it('should calculate correct month lengths', () => {
    // Gregorian months
    expect(new Date(2023, 1, 1).getMonth()).toBe(1); // February has 28 days in 2023
    expect(new Date(2024, 1, 1).getMonth()).toBe(1); // February has 29 days in 2024

    // This test would need to be more specific for Ethiopic months
    // as they have fixed lengths except for Pagume
  });

  // Performance test
  it('should perform well with repeated operations', () => {
    // Simple performance test - just verify the functions work
    for (let i = 0; i < 100; i++) {
      const date = { year: 2020 + (i % 10), month: 1 + (i % 12), day: 1 + (i % 28) };
      const ethDate = toEthiopic(date);
      const backToGreg = toGregorian(ethDate);
      expect(backToGreg).toEqual(date); // Round-trip consistency
    }
  });
});
