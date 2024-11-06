import * as migration_20241101_044723_initialDB from './20241101_044723_initialDB';
import * as migration_20241106_004615_sermonlisttype from './20241106_004615_sermonlisttype';

export const migrations = [
  {
    up: migration_20241101_044723_initialDB.up,
    down: migration_20241101_044723_initialDB.down,
    name: '20241101_044723_initialDB',
  },
  {
    up: migration_20241106_004615_sermonlisttype.up,
    down: migration_20241106_004615_sermonlisttype.down,
    name: '20241106_004615_sermonlisttype'
  },
];
