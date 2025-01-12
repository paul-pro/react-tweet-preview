import type { Meta, StoryObj } from '@storybook/react';
import { TweetPreview } from '../src/TweetPreview';

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
  },
};