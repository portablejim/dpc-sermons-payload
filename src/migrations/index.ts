import * as migration_20241101_044723_initialDB from './20241101_044723_initialDB';

export const migrations = [
  {
    up: migration_20241101_044723_initialDB.up,
    down: migration_20241101_044723_initialDB.down,
    name: '20241101_044723_initialDB'
  },
];
