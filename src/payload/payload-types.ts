/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    'bible-books': BibleBook;
    'bible-chapters': BibleChapter;
    'cover-images': CoverImage;
    pages: Page;
    media: Media;
    users: User;
    'talk-audio': TalkAudio;
    episodes: Episode;
    series: Series;
    speakers: Speaker;
    redirects: Redirect;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {
    settings: Settings;
    header: Header;
    footer: Footer;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "bible-books".
 */
export interface BibleBook {
  id: number;
  name: string;
  order: number;
  shortName: string;
  slug: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "bible-chapters".
 */
export interface BibleChapter {
  id: number;
  book: number | BibleBook;
  name: string;
  order: number;
  globalOrder: number;
  shortName: string;
  slug: string;
  hasNoChapters?: boolean | null;
  verses: number;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "cover-images".
 */
export interface CoverImage {
  id: number;
  alt: string;
  caption?:
    | {
        [k: string]: unknown;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    card?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "pages".
 */
export interface Page {
  id: number;
  title: string;
  publishedAt?: string | null;
  layout: (
    | {
        invertBackground?: boolean | null;
        richText: {
          [k: string]: unknown;
        }[];
        links?:
          | {
              link: {
                type?: ('reference' | 'custom') | null;
                newTab?: boolean | null;
                reference?: {
                  relationTo: 'pages';
                  value: number | Page;
                } | null;
                url?: string | null;
                label: string;
                appearance?: ('primary' | 'secondary') | null;
              };
              id?: string | null;
            }[]
          | null;
        id?: string | null;
        blockName?: string | null;
        blockType: 'cta';
      }
    | {
        invertBackground?: boolean | null;
        columns?:
          | {
              size?: ('oneThird' | 'half' | 'twoThirds' | 'full') | null;
              richText: {
                [k: string]: unknown;
              }[];
              enableLink?: boolean | null;
              link?: {
                type?: ('reference' | 'custom') | null;
                newTab?: boolean | null;
                reference?: {
                  relationTo: 'pages';
                  value: number | Page;
                } | null;
                url?: string | null;
                label: string;
                appearance?: ('default' | 'primary' | 'secondary') | null;
              };
              id?: string | null;
            }[]
          | null;
        id?: string | null;
        blockName?: string | null;
        blockType: 'content';
      }
    | {
        invertBackground?: boolean | null;
        position?: ('default' | 'fullscreen') | null;
        media: number | Media;
        id?: string | null;
        blockName?: string | null;
        blockType: 'mediaBlock';
      }
    | {
        title?: string | null;
        description?:
          | {
              [k: string]: unknown;
            }[]
          | null;
        linkTiles?:
          | {
              linkTile: {
                title: string;
                subtitle?: string | null;
                backgroundImage: number | CoverImage;
                overlayColour?: string | null;
                type?: ('reference' | 'custom' | 'mediaReference') | null;
                newTab?: boolean | null;
                reference?: {
                  relationTo: 'pages';
                  value: number | Page;
                } | null;
                url?: string | null;
                linkedMedia?: number | Media | null;
              };
              id?: string | null;
            }[]
          | null;
        paddingBottom?: ('large' | 'medium' | 'none') | null;
        id?: string | null;
        blockName?: string | null;
        blockType: 'linkTileList';
      }
    | {
        id?: string | null;
        blockName?: string | null;
        blockType: 'seriesList';
      }
    | {
        mediaType?: ('video' | 'audio') | null;
        id?: string | null;
        blockName?: string | null;
        blockType: 'libraryList';
      }
  )[];
  slug?: string | null;
  meta?: {
    title?: string | null;
    description?: string | null;
    image?: number | Media | null;
  };
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: number;
  alt: string;
  caption?:
    | {
        [k: string]: unknown;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: number;
  name?: string | null;
  roles?: ('admin' | 'user')[] | null;
  isConfiguringBooks?: boolean | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "talk-audio".
 */
export interface TalkAudio {
  id: number;
  alt: string;
  caption?:
    | {
        [k: string]: unknown;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "episodes".
 */
export interface Episode {
  id: number;
  title: string;
  series?: (number | null) | Series;
  biblePassageText?: string | null;
  biblePassages?:
    | {
        chapter?: (number | null) | BibleChapter;
        id?: string | null;
      }[]
    | null;
  speaker?: (number | null) | Speaker;
  sermonDate: string;
  episodeImage?: number | CoverImage | null;
  publishedAt?: string | null;
  videoFormat: 'embed' | 'none';
  videoUrl?: string | null;
  audioFormat: 'linked';
  audioUrl?: string | null;
  talkOutline?:
    | {
        [k: string]: unknown;
      }[]
    | null;
  slug: string;
  fullTitle: string;
  meta?: {
    title?: string | null;
    description?: string | null;
    image?: number | Media | null;
  };
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "series".
 */
export interface Series {
  id: number;
  title?: string | null;
  subtitle?: string | null;
  seriesDate?: string | null;
  seriesImage: number | CoverImage;
  slug?: string | null;
  meta?: {
    title?: string | null;
    description?: string | null;
    image?: number | Media | null;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "speakers".
 */
export interface Speaker {
  id: number;
  name?: string | null;
  meta?: {
    title?: string | null;
    description?: string | null;
    image?: number | Media | null;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "redirects".
 */
export interface Redirect {
  id: number;
  from: string;
  to?: {
    type?: ('reference' | 'custom') | null;
    reference?:
      | ({
          relationTo: 'pages';
          value: number | Page;
        } | null)
      | ({
          relationTo: 'bible-books';
          value: number | BibleBook;
        } | null)
      | ({
          relationTo: 'bible-chapters';
          value: number | BibleChapter;
        } | null)
      | ({
          relationTo: 'series';
          value: number | Series;
        } | null)
      | ({
          relationTo: 'episodes';
          value: number | Episode;
        } | null);
    url?: string | null;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: number;
  user: {
    relationTo: 'users';
    value: number | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: number;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "settings".
 */
export interface Settings {
  id: number;
  videoSermonsPage?: (number | null) | Page;
  audioSermonsPage?: (number | null) | Page;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "header".
 */
export interface Header {
  id: number;
  navItems?:
    | {
        link: {
          type?: ('reference' | 'custom') | null;
          newTab?: boolean | null;
          reference?: {
            relationTo: 'pages';
            value: number | Page;
          } | null;
          url?: string | null;
          label: string;
        };
        id?: string | null;
      }[]
    | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "footer".
 */
export interface Footer {
  id: number;
  navItems?:
    | {
        link: {
          type?: ('reference' | 'custom') | null;
          newTab?: boolean | null;
          reference?: {
            relationTo: 'pages';
            value: number | Page;
          } | null;
          url?: string | null;
          label: string;
        };
        id?: string | null;
      }[]
    | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}