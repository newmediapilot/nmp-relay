### About

This repository allows us to run a command which posts a bunch of tweets sources from a reddit meme subreddit.
It's intended to run every X amount of milliseconds to pull from each URL continuously.
The idea is to aggregate some favorites based on a preference that AI provisions.
In addition to this we have an AI based maturity rating to protect against poisoned memes.

### Pre-requisite

- Must have node 20+
- Must have Twitter API
- Must have OpenAI API
- Create `.secret` file with API info and then proceed to Usage

### Usage

`npm i`
`npm run start`

