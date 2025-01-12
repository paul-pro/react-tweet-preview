# React Tweet Preview

A React component for previewing tweets before posting, built on top of [react-tweet](https://github.com/vercel/react-tweet). This library focuses on data management and preview functionality, leveraging react-tweet's rendering capabilities.

[![Storybook](https://img.shields.io/badge/Storybook-View_Demo-1f618d?style=for-the-badge&labelColor=FF4785&logo=storybook&logoColor=white)](https://paul-pro.github.io/react-tweet-preview)

## Installation

```bash
bun add react-tweet-preview
# or oldfashioned
npm install react-tweet-preview
```

## Usage

```tsx
import { TweetPreview } from 'react-tweet-preview';

function App() {
  return (
    <TweetPreview
      content="Hello, world! #FirstTweet"
      author={{
        name: 'John Doe',
        username: 'johndoe',
        image: 'https://example.com/avatar.jpg'
      }}
    />
  );
}
```

## Props

- `content`: The content of the tweet (limited to 280 characters)
- `author`: Author information object
  - `name`: Display name
  - `username`: Twitter handle (without @)
  - `image`: URL to profile picture
- `theme`: Theme mode for the tweet preview ('light' | 'dark', defaults to 'light')

## Features

- Seamless integration with react-tweet for rendering
- Automatic tweet data structure generation
- Tweet length validation
- Fallback handling for missing author information

## Development

For detailed development instructions and guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

Oneliner start:
```bash
bun i && bun run storybook
```

## Roadmap

Future improvements and features we're considering:

- [ ] Image attachment previews
- [ ] Link preview support
- [ ] Customizable tweet metadata (created_at, language)
- [ ] Verified status customization
- [ ] Accessibility improvements
- [ ] Error boundary for graceful error handling
- [ ] Tweet thread support
- [ ] Use storycap to refresh readme image

## License

MIT
