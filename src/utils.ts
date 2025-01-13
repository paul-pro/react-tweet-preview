import type { Indices, TweetEntities, MediaDetails, QuotedTweet } from 'react-tweet/api';
import type { TweetPreviewProps } from './TweetPreview';

type Entity = {
  type: 'hashtag' | 'mention' | 'url' | 'text';
  text: string;
  href?: string;
  indices: Indices;
};

export const MAX_TWEET_LENGTH = 280;

export const FALLBACK_AUTHOR = {
  name: 'User',
  username: 'user',
  image: 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png',
} as const;

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
const MENTION_REGEX = /@(\w+)/g;
const HASHTAG_REGEX = /#(\w+)/g;

// Helper to get the visual index in a string
const getVisualIndex = (str: string, rawIndex: number): number => {
  return [...str.slice(0, rawIndex)].length;
};

export const parseTweetContent = (content: string): Entity[] => {
  const entities: Entity[] = [];
  let lastIndex = 0;

  // Helper to add text entity for gaps
  const addTextEntity = (endIndex: number) => {
    if (endIndex > lastIndex) {
      const text = content.slice(lastIndex, endIndex);
      if (text.trim()) {
        entities.push({
          type: 'text',
          text,
          indices: [getVisualIndex(content, lastIndex), getVisualIndex(content, endIndex)],
        });
      }
    }
  };

  // Find all matches for each type
  const matches = [
    ...Array.from(content.matchAll(URL_REGEX)).map((match) => ({ type: 'url' as const, match })),
    ...Array.from(content.matchAll(MENTION_REGEX)).map((match) => ({
      type: 'mention' as const,
      match,
    })),
    ...Array.from(content.matchAll(HASHTAG_REGEX)).map((match) => ({
      type: 'hashtag' as const,
      match,
    })),
  ].sort((a, b) => (a.match.index ?? 0) - (b.match.index ?? 0));

  // Process matches in order
  for (const { type, match } of matches) {
    const startIndex = match.index ?? 0;
    const endIndex = startIndex + match[0].length;

    // Add text entity for content before this match
    addTextEntity(startIndex);

    // Add entity for the match
    const text = match[0];
    let href = '';

    switch (type) {
      case 'url':
        href = text;
        break;
      case 'mention':
        href = `https://twitter.com/${match[1]}`;
        break;
      case 'hashtag':
        href = `https://twitter.com/hashtag/${match[1]}`;
        break;
    }

    entities.push({
      type,
      text,
      href,
      indices: [getVisualIndex(content, startIndex), getVisualIndex(content, endIndex)],
    });

    lastIndex = endIndex;
  }

  // Add remaining text as entity
  addTextEntity(content.length);

  return entities;
};

export const transformToTweetEntities = (
  entities: Entity[],
  media?: MediaDetails[]
): TweetEntities => {
  const result: TweetEntities = {
    hashtags: [],
    urls: [],
    user_mentions: [],
    symbols: [],
  };

  for (const entity of entities) {
    switch (entity.type) {
      case 'hashtag':
        result.hashtags.push({
          text: entity.text.slice(1),
          indices: entity.indices,
        });
        break;
      case 'mention':
        result.user_mentions.push({
          screen_name: entity.text.slice(1),
          indices: entity.indices,
          id_str: 'preview',
          name: entity.text.slice(1),
        });
        break;
      case 'url':
        result.urls.push({
          url: entity.text,
          expanded_url: entity.text,
          display_url: entity.text,
          indices: entity.indices,
        });
        break;
    }
  }

  if (media?.length) {
    result.media = media;
  }

  return result;
};

export const getImageSize = (url: string): Promise<{ width: number; height: number } | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => {
      console.error(`TweetPreview: Failed to load image from "${url}"`);
      resolve(null);
    };
    img.src = url;
  });
};

export const createMediaDetails = (
  image: string,
  imageSize: { width: number; height: number },
  contentLength: number
): MediaDetails[] => [
  {
    display_url: image,
    expanded_url: image,
    media_url_https: image,
    type: 'photo' as const,
    ext_alt_text: 'Image preview',
    ext_media_availability: { status: 'available' },
    ext_media_color: {
      palette: [
        {
          percentage: 100,
          rgb: { red: 255, green: 255, blue: 255 },
        },
      ],
    },
    indices: [contentLength + 1, contentLength + 23] as Indices,
    original_info: {
      height: imageSize.height,
      width: imageSize.width,
      focus_rects: [],
    },
    sizes: {
      large: { h: imageSize.height, w: imageSize.width, resize: 'fit' },
      medium: { h: imageSize.height, w: imageSize.width, resize: 'fit' },
      small: { h: imageSize.height, w: imageSize.width, resize: 'fit' },
      thumb: { h: 150, w: 150, resize: 'crop' },
    },
    url: image,
  },
];

export const createQuotedTweet = (
  quoted_tweet: NonNullable<TweetPreviewProps['quoted_tweet']>
): QuotedTweet => ({
  text: quoted_tweet.content,
  created_at: (quoted_tweet.created_at ?? new Date()).toISOString(),
  user: {
    name: quoted_tweet.author?.name ?? FALLBACK_AUTHOR.name,
    screen_name:
      quoted_tweet.author?.username?.toLowerCase().replace(/\s+/g, '') ?? FALLBACK_AUTHOR.username,
    profile_image_url_https: quoted_tweet.author?.image ?? FALLBACK_AUTHOR.image,
    profile_image_shape: 'Circle' as const,
    verified: quoted_tweet.author?.is_verified ?? false,
    is_blue_verified: quoted_tweet.author?.is_verified ?? false,
    id_str: 'quoted',
  },
  entities: {
    hashtags: [],
    urls: [],
    user_mentions: [],
    symbols: [],
  },
  favorite_count: 0,
  reply_count: 0,
  retweet_count: 0,
  lang: 'en',
  display_text_range: [0, quoted_tweet.content.length] as Indices,
  id_str: 'quoted',
  edit_control: {
    edit_tweet_ids: ['quoted'],
    editable_until_msecs: '0',
    is_edit_eligible: false,
    edits_remaining: '0',
  },
  isEdited: false,
  isStaleEdit: false,
  self_thread: {
    id_str: 'quoted',
  },
});
