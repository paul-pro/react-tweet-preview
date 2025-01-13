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
  in_reply_to_screen_name?: string;
  quoted_tweet?: {
    content: string;
    author?: {
      name?: string;
      username?: string;
      image?: string;
      is_verified?: boolean;
    };
    created_at?: Date;
  };
};

const MAX_TWEET_LENGTH = 280;

const FALLBACK_AUTHOR = {
  name: 'User',
  username: 'user',
  image: 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png',
} as const;

const createPreviewTweet = ({ content, author = {}, created_at = new Date(), favorite_count, image, imageSize, in_reply_to_screen_name, quoted_tweet }: TweetPreviewProps & { imageSize?: { width: number; height: number } | null }): Tweet => {
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
    quoted_tweet: quoted_tweet ? createQuotedTweet(quoted_tweet) : undefined,
    isEdited: false,
    isStaleEdit: false,
    in_reply_to_screen_name,
    in_reply_to_status_id_str: in_reply_to_screen_name ? 'preview' : undefined,
    in_reply_to_user_id_str: in_reply_to_screen_name ? 'preview' : undefined,
  };
};

export const TweetPreview = ({ content, author = {}, theme = 'light', created_at, favorite_count, image, in_reply_to_screen_name, quoted_tweet }: TweetPreviewProps) => {
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>();

  useEffect(() => {
    if (image) {
      getImageSize(image).then(setImageSize);
    }
  }, [image]);

  if (content.length > MAX_TWEET_LENGTH) {
    throw new Error(`Tweet content exceeds maximum length of ${MAX_TWEET_LENGTH} characters`);
  }

  const tweet = enrichTweet(createPreviewTweet({ content, author, created_at, favorite_count, image, imageSize, in_reply_to_screen_name, quoted_tweet }));

  const tweetContent = (
    <TweetContainer>
      <TweetHeader tweet={tweet} />
      {in_reply_to_screen_name && <TweetInReplyTo tweet={tweet} />}
      <TweetBody tweet={tweet} />
      {image && imageSize && <TweetMedia tweet={tweet} components={{ MediaImg: CustomMediaImg }} />}
      {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
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

  const createQuotedTweet = (quoted_tweet: NonNullable<TweetPreviewProps['quoted_tweet']>) => ({
    text: quoted_tweet.content,
    created_at: (quoted_tweet.created_at ?? new Date()).toISOString(),
    user: {
      name: quoted_tweet.author?.name ?? FALLBACK_AUTHOR.name,
      screen_name: quoted_tweet.author?.username?.toLowerCase().replace(/\s+/g, '') ?? FALLBACK_AUTHOR.username,
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
    __typename: 'Tweet',
    favorite_count: 0,
    reply_count: 0,
    retweet_count: 0,
    conversation_count: 0,
    news_action_type: 'conversation',
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
  