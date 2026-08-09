import { describe, it, expect } from 'vitest';
import { getCardValue, getSuitColor, getSuitSymbol } from '../src/blackjack/card';

describe('Card Module', () => {
  it('should return correct values for ranks', () => {
    expect(getCardValue('2')).toBe(2);
    expect(getCardValue('9')).toBe(9);
    expect(getCardValue('10')).toBe(10);
    expect(getCardValue('J')).toBe(10);
    expect(getCardValue('Q')).toBe(10);
    expect(getCardValue('K')).toBe(10);
    expect(getCardValue('A')).toBe(11);
  });

  it('should return correct suit symbols and colors', () => {
    expect(getSuitSymbol('spades')).toBe('♠');
    expect(getSuitColor('spades')).toBe('black');
    expect(getSuitSymbol('hearts')).toBe('♥');
    expect(getSuitColor('hearts')).toBe('red');
    expect(getSuitSymbol('diamonds')).toBe('♦');
    expect(getSuitColor('diamonds')).toBe('red');
    expect(getSuitSymbol('clubs')).toBe('♣');
    expect(getSuitColor('clubs')).toBe('black');
  });
});
