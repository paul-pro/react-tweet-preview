import { useEffect, useState } from 'react';
import {
  TweetBody,
  TweetContainer,
  TweetHeader,
  TweetInfo,
  enrichTweet,
  TweetInReplyTo,
  TweetMedia,
  QuotedTweet,
  TweetActions,
} from 'react-tweet';
import type { Tweet } from 'react-tweet/api';
import { TweetErrorBoundary } from './TweetErrorBoundary';
import {
  parseTweetContent,
  transformToTweetEntities,
  createMediaDetails,
  getImageSize,
  createQuotedTweet,
  MAX_TWEET_LENGTH,
  FALLBACK_AUTHOR,
} from './utils';

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

const createPreviewTweet = ({
  content,
  author = {},
  created_at = new Date(),
  favorite_count,
  image,
  imageSize,
  in_reply_to_screen_name,
  quoted_tweet,
}: TweetPreviewProps & { imageSize?: { width: number; height: number } | null }): Tweet => {
  const { name, username, image: authorImage, is_verified = false } = author;
  const normalizedUsername = username?.toLowerCase().replace(/\s+/g, '');

  const media = image && imageSize ? createMediaDetails(image, imageSize, content.length) : [];
  const parsedEntities = parseTweetContent(content);

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
    entities: transformToTweetEntities(parsedEntities, media),
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

export const TweetPreview = ({
  content,
  author = {},
  theme = 'light',
  created_at,
  favorite_count,
  image,
  in_reply_to_screen_name,
  quoted_tweet,
}: TweetPreviewProps) => {
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>();

  useEffect(() => {
    if (image) {
      getImageSize(image).then(setImageSize);
    }
  }, [image]);

  if (content.length > MAX_TWEET_LENGTH) {
    throw new Error(`Tweet content exceeds maximum length of ${MAX_TWEET_LENGTH} characters`);
  }

  const tweet = enrichTweet(
    createPreviewTweet({
      content,
      author,
      created_at,
      favorite_count,
      image,
      imageSize,
      in_reply_to_screen_name,
      quoted_tweet,
    })
  );

  const tweetContent = (
    <TweetContainer>
      <TweetHeader tweet={tweet} />
      {in_reply_to_screen_name && <TweetInReplyTo tweet={tweet} />}
      <TweetBody tweet={tweet} />
      {image && imageSize && (
        <TweetMedia
          tweet={tweet}
          components={{
            MediaImg: ({ src: _src, ...props }) => (
              // biome-ignore lint/a11y/useAltText: no alt text for this image
              <img src={image} {...props} />
            ),
          }}
        />
      )}
      {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
      <TweetInfo tweet={tweet} />
      {favorite_count !== undefined && <TweetActions tweet={tweet} />}
    </TweetContainer>
  );

  if (theme === 'dark') {
    return (
      <TweetErrorBoundary>
        <div data-theme="dark">{tweetContent}</div>
      </TweetErrorBoundary>
    );
  }

  return <TweetErrorBoundary>{tweetContent}</TweetErrorBoundary>;
};
