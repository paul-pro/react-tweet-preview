import { TweetBody, TweetContainer, TweetHeader, TweetInfo, enrichTweet } from 'react-tweet';
import type { Tweet } from 'react-tweet/api';

export type TweetPreviewProps = {
  content: string;
  author?: {
    name?: string | null;
    username?: string | null;
    image?: string | null;
  };
  theme?: 'light' | 'dark';
  created_at?: Date;
};

const MAX_TWEET_LENGTH = 280;

const DEFAULT_AUTHOR = {
  name: null,
  username: null,
  image: null,
} as const;

const FALLBACK_AUTHOR = {
  name: 'User',
  username: 'user',
  image: 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png',
} as const;

const createPreviewTweet = ({ content, author = DEFAULT_AUTHOR, created_at = new Date() }: TweetPreviewProps): Tweet => {
  const { name, username, image } = author;
  const normalizedUsername = username?.toLowerCase().replace(/\s+/g, '') ?? FALLBACK_AUTHOR.username;
  return {
    text: content,
    created_at: created_at.toISOString(),
    user: {
      name: name ?? FALLBACK_AUTHOR.name,
      screen_name: normalizedUsername,
      profile_image_url_https: image ?? FALLBACK_AUTHOR.image,
      profile_image_shape: 'Circle',
      verified: false,
      is_blue_verified: false,
      id_str: 'preview',
    },
    entities: {
      hashtags: [],
      urls: [],
      user_mentions: [],
      symbols: [],
    },
    __typename: 'Tweet',
    favorite_count: 0,
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

export const TweetPreview = ({ content, author = DEFAULT_AUTHOR, theme = 'light', created_at }: TweetPreviewProps) => {
  if (content.length > MAX_TWEET_LENGTH) {
    throw new Error(`Tweet content exceeds maximum length of ${MAX_TWEET_LENGTH} characters`);
  }

  const tweet = enrichTweet(createPreviewTweet({ content, author, created_at }));

  const tweetContent = (
    <TweetContainer>
      <TweetHeader tweet={tweet} />
      <TweetBody tweet={tweet} />
      <TweetInfo tweet={tweet} />
    </TweetContainer>
  );

  if (theme === 'dark') {
    return <div data-theme='dark'>{tweetContent}</div>;
  }

  return tweetContent;
};
