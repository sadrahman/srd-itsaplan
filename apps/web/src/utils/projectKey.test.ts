import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { suggestKey, normalizeKey, isValidKey } from './projectKey';

describe('suggestKey', () => {
  it('builds a valid key from a name', () => {
    assert.equal(suggestKey('Marketing Team'), 'MT');
    assert.equal(suggestKey('Marketing'), 'MARK');
    assert.equal(suggestKey('Команда'), 'KOMA');
  });

  it('handles names starting with numbers', () => {
    assert.equal(suggestKey('123 Team'), 'T');
    assert.equal(suggestKey('42 Ops'), 'O');
    assert.equal(suggestKey('99'), 'PROJ');
  });

  it('handles special characters', () => {
    assert.equal(suggestKey('!!!Team!!!'), 'TEAM');
    assert.equal(suggestKey('---Team---'), 'TEAM');
    assert.equal(suggestKey('@#$Team@#$'), 'TEAM');
  });

  it('handles mixed alphanumeric', () => {
    assert.equal(suggestKey('Team123'), 'TEAM');
    assert.equal(suggestKey('123Team456'), 'T');
  });

  it('handles empty or whitespace', () => {
    assert.equal(suggestKey(''), 'PROJ');
    assert.equal(suggestKey('   '), 'PROJ');
  });

  it('handles non-Latin scripts that transliterate to empty', () => {
    assert.equal(suggestKey('团队'), 'PROJ');
    assert.equal(suggestKey('فريق'), 'PROJ');
  });

  it('respects maximum length', () => {
    assert.equal(suggestKey('A'.repeat(100)).length, 4);
    assert.equal(suggestKey('A B C D E F G H I J K L M N O P').length, 10);
  });
});

describe('normalizeKey', () => {
  it('normalizes user input', () => {
    assert.equal(normalizeKey('  team-123  '), 'TEAM123');
    assert.equal(normalizeKey('123Team'), 'TEAM');
    assert.equal(normalizeKey('Команда'), 'KOMANDA');
  });

  it('strips leading digits', () => {
    assert.equal(normalizeKey('123ABC'), 'ABC');
    assert.equal(normalizeKey('42XYZ'), 'XYZ');
  });

  it('handles empty input', () => {
    assert.equal(normalizeKey(''), '');
    assert.equal(normalizeKey('   '), '');
  });

  it('caps at maximum length', () => {
    assert.equal(normalizeKey('ABCDEFGHIJKL').length, 10);
  });
});

describe('isValidKey', () => {
  it('validates keys', () => {
    assert.equal(isValidKey('TEAM'), true);
    assert.equal(isValidKey('TEAM123'), true);
    assert.equal(isValidKey(''), false);
    assert.equal(isValidKey('123'), false);
  });

  it('rejects keys that would normalize differently', () => {
    assert.equal(isValidKey('team'), false);
    assert.equal(isValidKey('TEAM-'), false);
    assert.equal(isValidKey('123TEAM'), false);
  });
});
