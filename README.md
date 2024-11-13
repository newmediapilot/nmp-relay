# About

This repository automates posting tweets sourced from selected Reddit meme subreddits. It continuously pulls memes at specified intervals ~~and applies AI-based filters to ensure preferred content and maturity ratings for safe posting~~.

## Prerequisites

- **Node.js 20+**
- **Twitter API Access**
- **OpenAI API Access**
- Create a `.secret` file with API credentials as specified below.

### Sample `.secret` File

```json
{
  "TWITTER_APP_KEY": "YOUR_TWITTER_API_KEY",
  "TWITTER_APP_SECRET": "YOUR_TWITTER_API_SECRET",
  "TWITTER_ACCESS_TOKEN": "YOUR_TWITTER_ACCESS_TOKEN",
  "TWITTER_ACCESS_SECRET": "YOUR_TWITTER_ACCESS_SECRET",
  // "OPENAI_API_KEY": "YOUR_OPENAI_API_KEY"
}
```

## Installation

```bash
npm install
```


## Usage

```bash
npm run start
```

