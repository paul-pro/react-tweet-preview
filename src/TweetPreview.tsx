import { useEffect, useState } from 'react';
import { TweetBody, TweetContainer, TweetHeader, TweetInfo, enrichTweet, TweetInReplyTo, TweetMedia, QuotedTweet, TweetActions } from 'react-tweet';
import type { Tweet, Indices, MediaDetails } from 'react-tweet/api';
import { TweetErrorBoundary } from './TweetErrorBoundary';

export type TweetPreviewProps = {
  content: string;
  author?: {
    name?: string;
    username?: string;
    image?: string;
    is_verified?: boolean;
  };
  theme?: 'light' | 'dark';
  created_at?: Date;
  favorite_count?: number;
  image?: string;
};

const MAX_TWEET_LENGTH = 280;

const FALLBACK_AUTHOR = {
  name: 'User',
  username: 'user',
  image: 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png',
} as const;

const createPreviewTweet = ({ content, author = {}, created_at = new Date(), favorite_count, image, imageSize }: TweetPreviewProps & { imageSize?: { width: number; height: number } | null }): Tweet => {
  const { name, username, image: authorImage, is_verified = false } = author;
  const normalizedUsername = username?.toLowerCase().replace(/\s+/g, '');

  const media = image && imageSize ? createMediaDetails(image, imageSize, content.length) : [];

  return {
    text: content,
    created_at: created_at.toISOString(),
    user: {
      name: name ?? FALLBACK_AUTHOR.name,
      screen_name: normalizedUsername ?? FALLBACK_AUTHOR.username,
      profile_image_url_https: authorImage ?? FALLBACK_AUTHOR.image,
      profile_image_shape: 'Circle',
      verified: is_verified,
      is_blue_verified: is_verified,
      id_str: 'preview',
    },
    entities: {
      hashtags: [],
      urls: [],
      user_mentions: [],
      symbols: [],
      ...(media.length ? { media } : {}),
    },
    mediaDetails: media.length ? media : undefined,
    __typename: 'Tweet',
    favorite_count: favorite_count ?? 0,
    conversation_count: 0,
    news_action_type: 'conversation',
    lang: 'en',
    display_text_range: [0, content.length],
    id_str: 'preview',
    edit_control: {
      edit_tweet_ids: ['preview'],
      editable_until_msecs: '0',
      is_edit_eligible: false,
      edits_remaining: '0',
    },
    quoted_tweet: undefined,
    isEdited: false,
    isStaleEdit: false,
  };
};

export const TweetPreview = ({ content, author = {}, theme = 'light', created_at, favorite_count, image }: TweetPreviewProps) => {
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>();

  useEffect(() => {
    if (image) {
      getImageSize(image).then(setImageSize);
    }
  }, [image]);

  if (content.length > MAX_TWEET_LENGTH) {
    throw new Error(`Tweet content exceeds maximum length of ${MAX_TWEET_LENGTH} characters`);
  }

  const tweet = enrichTweet(createPreviewTweet({ content, author, created_at, favorite_count, image, imageSize }));

  const tweetContent = (
    <TweetContainer>
      <TweetHeader tweet={tweet} />
      <TweetBody tweet={tweet} />
      {image && imageSize && <TweetMedia tweet={tweet} components={{ MediaImg: CustomMediaImg }} />}
      <TweetInfo tweet={tweet} />
      {favorite_count !== undefined && <TweetActions tweet={tweet} />}
    </TweetContainer>
  );

  if (theme === 'dark') {
    return (
      <TweetErrorBoundary>
        <div data-theme='dark'>{tweetContent}</div>
      </TweetErrorBoundary>
    );
  }

  return <TweetErrorBoundary>{tweetContent}</TweetErrorBoundary>;
};

const getImageSize = (url: string): Promise<{ width: number; height: number } | null> => {
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
  
  const createMediaDetails = (
    image: string,
    imageSize: { width: number; height: number },
    contentLength: number,
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

  const CustomMediaImg = ({ src, ...props }: { src: string; alt: string; className?: string; draggable?: boolean }) => {
    const originalUrl = src.split('?')[0].endsWith('.jpg')
      ? src.split('?')[0]
      : `${src.split('?')[0]}.jpg`;
    return <img src={originalUrl} {...props} />;
  };