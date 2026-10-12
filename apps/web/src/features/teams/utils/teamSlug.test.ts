import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { TEAM_SLUG_PATTERN, suggestTeamSlug } from './teamSlug';

describe('suggestTeamSlug', () => {
  it('builds a valid slug from a name', () => {
    assert.equal(suggestTeamSlug('Acme Design'), 'acme-design');
    assert.equal(suggestTeamSlug('  42 -- Ops!  '), 'ops');
    assert.equal(suggestTeamSlug('Команда'), 'komanda');
    const long = suggestTeamSlug(`a${'-b'.repeat(30)}`);
    assert.ok(TEAM_SLUG_PATTERN.test(long), long);
  });

  it('handles names starting with numbers', () => {
    assert.equal(suggestTeamSlug('123 Team'), 'team');
    assert.equal(suggestTeamSlug('42 Ops'), 'ops');
    assert.equal(suggestTeamSlug('99'), 'team');
  });

  it('handles special characters', () => {
    assert.equal(suggestTeamSlug('!!!Team!!!'), 'team');
    assert.equal(suggestTeamSlug('---Team---'), 'team');
    assert.equal(suggestTeamSlug('@#$Team@#$'), 'team');
  });

  it('handles mixed alphanumeric', () => {
    assert.equal(suggestTeamSlug('Team123'), 'team123');
    assert.equal(suggestTeamSlug('123Team456'), 'team456');
  });

  it('handles empty or whitespace', () => {
    assert.equal(suggestTeamSlug(''), 'team');
    assert.equal(suggestTeamSlug('   '), 'team');
  });

  it('handles single character names', () => {
    assert.equal(suggestTeamSlug('A'), 'team');
    assert.equal(suggestTeamSlug('x'), 'team');
  });

  it('handles non-Latin scripts that transliterate to empty', () => {
    assert.equal(suggestTeamSlug('团队'), 'team');
    assert.equal(suggestTeamSlug('فريق'), 'team');
  });

  it('handles Unicode letters that are not Cyrillic', () => {
    assert.equal(suggestTeamSlug('Équipe'), 'quipe');
    assert.equal(suggestTeamSlug('Ñoño'), 'o-o');
  });
});
