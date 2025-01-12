import { TweetBody, TweetContainer, TweetHeader, TweetInfo, enrichTweet } from 'react-tweet';
import type { Tweet } from 'react-tweet/api';

export type TweetPreviewProps = {
  content: string;
  author: {
    name: string | null | undefined;
    username: string | null | undefined;
    image: string | null | undefined;
  };
};

const MAX_TWEET_LENGTH = 280;

const createPreviewTweet = ({ content, author }: TweetPreviewProps): Tweet => {
  const username = author.username?.toLowerCase().replace(/\s+/g, '') ?? 'user';
  return {
    text: content,
    created_at: new Date().toISOString(),
    user: {
      name: author.name ?? 'User',
      screen_name: username,
      profile_image_url_https:
        author.image ?? 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png',
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

export const TweetPreview = ({ content, author }: TweetPreviewProps) => {
  if (content.length > MAX_TWEET_LENGTH) {
    throw new Error(`Tweet content exceeds maximum length of ${MAX_TWEET_LENGTH} characters`);
  }

  const tweet = enrichTweet(createPreviewTweet({ content, author }));

  return (
    <TweetContainer>
      <TweetHeader tweet={tweet} />
      <TweetBody tweet={tweet} />
      <TweetInfo tweet={tweet} />
    </TweetContainer>
  );
}; 