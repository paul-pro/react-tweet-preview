import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TweetPreview } from '../src/TweetPreview';
import { TweetErrorBoundary } from '../src/TweetErrorBoundary';

const meta = {
  title: 'Components/TweetPreview',
  component: TweetPreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TweetPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content:
      "Just saw my tweet about react-tweet-preview in react-tweet-preview before I tweeted it 🌀\n\nA React component for previewing tweets before posting, built on @vercel's react-tweet.\n\nThe simulation is complete now.",
    author: {
      name: 'Guillermo Rauch',
      username: 'rauchg',
      image: 'https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg',
      is_verified: true,
    },
    favorite_count: 4269,
    theme: 'light',
  },
};

export const Dark: Story = {
  args: {
    content: 'This is a preview of a tweet with #hashtag and @mention in dark mode',
    author: {
      name: 'John Doe',
      username: 'johndoe',
      image: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
    theme: 'dark',
    favorite_count: 1337,
  },
};

export const TextOnly: Story = {
  args: {
    content: 'Sometimes all you need is 280 characters to express your thoughts',
  },
};

export const FullProps: Story = {
  args: {
    content:
      'Excited to share my thoughts on web development! Check out this article about React Server Components 🚀\n\nThread incoming... 🧵',
    author: {
      name: 'Engagement Factory',
      username: 'fordevs',
      image: 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png',
      is_verified: true,
    },
    theme: 'light',
    created_at: new Date('2024-03-14T12:00:00Z'),
    favorite_count: 853,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    in_reply_to_screen_name: 'reactjs',
    quoted_tweet: {
      content:
        'Announcing React Server Components: A new model for building applications that combines the rich interactivity of client-side apps with the improved performance of traditional server rendering.',
      author: {
        name: 'React',
        username: 'reactjs',
        image: 'https://avatars.githubusercontent.com/u/6412038?v=4',
        is_verified: true,
      },
      created_at: new Date('2024-03-14T11:30:00Z'),
    },
  },
};

export const WithImage: Story = {
  args: {
    content: 'Look at this beautiful bird! 🐦',
    author: {
      name: 'Nature Lover',
      username: 'naturelover',
      image: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Parus_major_Luc_Viatour.jpg',
    favorite_count: 42,
  },
};

export const WithReply: Story = {
  args: {
    content: 'Great shot! What camera did you use? 📸',
    author: {
      name: 'Photography Fan',
      username: 'photofan',
      image: 'https://avatars.githubusercontent.com/u/2?v=4',
    },
    in_reply_to_screen_name: 'naturelover',
    favorite_count: 7,
  },
};

export const WithQuote: Story = {
  args: {
    content: 'This is exactly what I was talking about! 🎯',
    author: {
      name: 'Tech Enthusiast',
      username: 'techlover',
      image: 'https://avatars.githubusercontent.com/u/3?v=4',
      is_verified: true,
    },
    quoted_tweet: {
      content:
        'Just released a new version of react-tweet-preview with image and quote support! 🚀',
      author: {
        name: 'Pavel Pro',
        username: 'pavelpro',
        image: 'https://avatars.githubusercontent.com/u/1?v=4',
        is_verified: true,
      },
    },
    favorite_count: 128,
  },
};

const ErrorExample = () => {
  throw new Error('Example error to demonstrate TweetErrorBoundary');
};

export const ErrorBoundary: StoryObj = {
  render: () => (
    <TweetErrorBoundary>
      <ErrorExample />
    </TweetErrorBoundary>
  ),
  parameters: {
    docs: {
      description: 'Shows error display when an error occurs',
    },
  },
};
