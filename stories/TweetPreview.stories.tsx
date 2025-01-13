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
    content: 'This is a preview of a tweet with #hashtag and @mention',
    author: {
      name: 'John Doe',
      username: 'johndoe',
      image: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
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

const ErrorExample = () => {
    throw new Error('Example error to demonstrate TweetErrorBoundary');
    return null;
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
