/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  collections: {
    'bible-books': BibleBook;
    'bible-chapters': BibleChapter;
    'cover-images': CoverImage;
    pages: Page;
    media: Media;
    'talk-audio': TalkAudio;
    episodes: Episode;
    series: Series;
    speakers: Speaker;
    users: User;
    redirects: Redirect;
    forms: Form;
    'form-submissions': FormSubmission;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  db: {
    defaultIDType: number;
  };
  globals: {
    header: Header;
    footer: Footer;
  };
  locale: null;
  user: User & {
    collection: 'users';
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
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
  caption?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  guid?: string | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
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
    largeSquare?: {
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
  layout: (
    | CallToActionBlock
    | ContentBlock
    | MediaBlock
    | FormBlock
    | {
        title?: string | null;
        description?: {
          root: {
            type: string;
            children: {
              type: string;
              version: number;
              [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
          };
          [k: string]: unknown;
        } | null;
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
                linkedMedia?: (number | null) | Media;
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
        blockType: 'libraryList';
      }
    | CodeBlock
  )[];
  meta?: {
    title?: string | null;
    image?: (number | null) | Media;
    description?: string | null;
  };
  publishedAt?: string | null;
  slug?: string | null;
  slugLock?: boolean | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "CallToActionBlock".
 */
export interface CallToActionBlock {
  richText?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
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
          appearance?: ('default' | 'outline') | null;
        };
        id?: string | null;
      }[]
    | null;
  id?: string | null;
  blockName?: string | null;
  blockType: 'cta';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "ContentBlock".
 */
export interface ContentBlock {
  columns?:
    | {
        size?: ('oneThird' | 'half' | 'twoThirds' | 'full') | null;
        richText?: {
          root: {
            type: string;
            children: {
              type: string;
              version: number;
              [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
          };
          [k: string]: unknown;
        } | null;
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
          appearance?: ('default' | 'outline') | null;
        };
        id?: string | null;
      }[]
    | null;
  id?: string | null;
  blockName?: string | null;
  blockType: 'content';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "MediaBlock".
 */
export interface MediaBlock {
  position?: ('default' | 'fullscreen') | null;
  media: number | Media;
  id?: string | null;
  blockName?: string | null;
  blockType: 'mediaBlock';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: number;
  alt: string;
  caption?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  guid?: string | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
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
 * via the `definition` "FormBlock".
 */
export interface FormBlock {
  form: number | Form;
  enableIntro?: boolean | null;
  introContent?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  id?: string | null;
  blockName?: string | null;
  blockType: 'formBlock';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "forms".
 */
export interface Form {
  id: number;
  title: string;
  fields?:
    | (
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            defaultValue?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'checkbox';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'country';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'email';
          }
        | {
            message?: {
              root: {
                type: string;
                children: {
                  type: string;
                  version: number;
                  [k: string]: unknown;
                }[];
                direction: ('ltr' | 'rtl') | null;
                format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
                indent: number;
                version: number;
              };
              [k: string]: unknown;
            } | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'message';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'number';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: string | null;
            options?:
              | {
                  label: string;
                  value: string;
                  id?: string | null;
                }[]
              | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'select';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'state';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: string | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'text';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: string | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'textarea';
          }
      )[]
    | null;
  submitButtonLabel?: string | null;
  confirmationType?: ('message' | 'redirect') | null;
  confirmationMessage?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  redirect?: {
    url: string;
  };
  emails?:
    | {
        emailTo?: string | null;
        cc?: string | null;
        bcc?: string | null;
        replyTo?: string | null;
        emailFrom?: string | null;
        subject: string;
        message?: {
          root: {
            type: string;
            children: {
              type: string;
              version: number;
              [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
          };
          [k: string]: unknown;
        } | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "CodeBlock".
 */
export interface CodeBlock {
  language?: ('typescript' | 'javascript' | 'css') | null;
  code: string;
  id?: string | null;
  blockName?: string | null;
  blockType: 'code';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "talk-audio".
 */
export interface TalkAudio {
  id: number;
  alt?: string | null;
  uploadQuality?: ('best' | 'good' | 'medium' | 'low') | null;
  lengthSeconds?: number | null;
  lengthDisplay?: string | null;
  status?: ('initial' | 'processing' | 'ready') | null;
  qualityGoodMp3_filename?: string | null;
  qualityGoodMp3_mimetype?: string | null;
  qualityGoodMp3_filesize?: number | null;
  qualityGoodOpus_filename?: string | null;
  qualityGoodOpus_mimetype?: string | null;
  qualityGoodOpus_filesize?: number | null;
  qualityMediumMp3_filename?: string | null;
  qualityMediumMp3_mimetype?: string | null;
  qualityMediumMp3_filesize?: number | null;
  qualityMediumOpus_filename?: string | null;
  qualityMediumOpus_mimetype?: string | null;
  qualityMediumOpus_filesize?: number | null;
  qualityLowMp3_filename?: string | null;
  qualityLowMp3_mimetype?: string | null;
  qualityLowMp3_filesize?: number | null;
  qualityLowOpus_filename?: string | null;
  qualityLowOpus_mimetype?: string | null;
  qualityLowOpus_filesize?: number | null;
  guid?: string | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
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
  subtitle?: string | null;
  series?: (number | null) | Series;
  episodeType?: ('regular' | 'special') | null;
  biblePassageText?: string | null;
  biblePassages?:
    | {
        chapter?: (number | null) | BibleChapter;
        id?: string | null;
      }[]
    | null;
  speaker?: (number | null) | Speaker;
  sermonDate: string;
  sermonDateYear?: number | null;
  episodeImage?: (number | null) | CoverImage;
  publishedAt?: string | null;
  videoFormat: 'vimeo' | 'youtube' | 'none';
  videoUrl?: string | null;
  audioFormat: 'linked' | 'uploaded' | 'none';
  linkedAudioUrl?: string | null;
  linkedAudioFiletype?: string | null;
  linkedAudioFileSize?: number | null;
  linkedAudioLength?: number | null;
  uploadedAudioFile?: (number | null) | TalkAudio;
  hasValidMedia?: boolean | null;
  talkOutline?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  slug: string;
  fullTitle: string;
  guid?: string | null;
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
  title: string;
  subtitle?: string | null;
  seriesType?: ('regular' | 'special') | null;
  seriesDate: string;
  seriesImage: number | CoverImage;
  slug: string;
  expandedTitle: string;
  episodes?: {
    docs?: (number | Episode)[] | null;
    hasNextPage?: boolean | null;
  } | null;
  guid?: string | null;
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
  guid?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: number;
  name?: string | null;
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
  password?: string | null;
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
    reference?: {
      relationTo: 'pages';
      value: number | Page;
    } | null;
    url?: string | null;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "form-submissions".
 */
export interface FormSubmission {
  id: number;
  form: number | Form;
  submissionData?:
    | {
        field: string;
        value: string;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: number;
  document?:
    | ({
        relationTo: 'bible-books';
        value: number | BibleBook;
      } | null)
    | ({
        relationTo: 'bible-chapters';
        value: number | BibleChapter;
      } | null)
    | ({
        relationTo: 'cover-images';
        value: number | CoverImage;
      } | null)
    | ({
        relationTo: 'pages';
        value: number | Page;
      } | null)
    | ({
        relationTo: 'media';
        value: number | Media;
      } | null)
    | ({
        relationTo: 'talk-audio';
        value: number | TalkAudio;
      } | null)
    | ({
        relationTo: 'episodes';
        value: number | Episode;
      } | null)
    | ({
        relationTo: 'series';
        value: number | Series;
      } | null)
    | ({
        relationTo: 'speakers';
        value: number | Speaker;
      } | null)
    | ({
        relationTo: 'users';
        value: number | User;
      } | null)
    | ({
        relationTo: 'redirects';
        value: number | Redirect;
      } | null)
    | ({
        relationTo: 'forms';
        value: number | Form;
      } | null)
    | ({
        relationTo: 'form-submissions';
        value: number | FormSubmission;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: number | User;
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
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}