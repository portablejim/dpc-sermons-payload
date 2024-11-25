import * as migration_20241101_044723_initialDB from './20241101_044723_initialDB';
import * as migration_20241106_004615_sermonlisttype from './20241106_004615_sermonlisttype';
import * as migration_20241106_101919_codeblock from './20241106_101919_codeblock';
import * as migration_20241106_132835_uploadaudio from './20241106_132835_uploadaudio';
import * as migration_20241106_135031_fixes from './20241106_135031_fixes';
import * as migration_20241111_081701_coverImageSvgs from './20241111_081701_coverImageSvgs';
import * as migration_20241125_065915_nameTalkAudio from './20241125_065915_nameTalkAudio';

export const migrations = [
  {
    up: migration_20241101_044723_initialDB.up,
    down: migration_20241101_044723_initialDB.down,
    name: '20241101_044723_initialDB',
  },
  {
    up: migration_20241106_004615_sermonlisttype.up,
    down: migration_20241106_004615_sermonlisttype.down,
    name: '20241106_004615_sermonlisttype',
  },
  {
    up: migration_20241106_101919_codeblock.up,
    down: migration_20241106_101919_codeblock.down,
    name: '20241106_101919_codeblock',
  },
  {
    up: migration_20241106_132835_uploadaudio.up,
    down: migration_20241106_132835_uploadaudio.down,
    name: '20241106_132835_uploadaudio',
  },
  {
    up: migration_20241106_135031_fixes.up,
    down: migration_20241106_135031_fixes.down,
    name: '20241106_135031_fixes',
  },
  {
    up: migration_20241111_081701_coverImageSvgs.up,
    down: migration_20241111_081701_coverImageSvgs.down,
    name: '20241111_081701_coverImageSvgs',
  },
  {
    up: migration_20241125_065915_nameTalkAudio.up,
    down: migration_20241125_065915_nameTalkAudio.down,
    name: '20241125_065915_nameTalkAudio'
  },
];
