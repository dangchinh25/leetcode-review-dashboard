# LeetCode Proficiency Tracker

A simple dashboard to track your LeetCode proficiency over each problems.


## Prerequisites

- Docker ([Installation guide](https://docs.docker.com/get-started/))

## Installation

1. Setup environment variables.
   Create environment config file and change environment variable with the correct variables.

```sh
cp .env.example .env
```

Grab `LEETCODE_SESSION_COOKIE` from by inspecting the network tab of your browser when acessing LeetCode sites.

2. Create local database
```sh
pnpm run temp-database-up
```
This will spin up a docker container for postgres database using credentials in `.env` file.

3. Run the development server.

```sh
pnpm run dev
```



Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How it works
- Let the server running and open the dashboard.
- The dashboard will not automatically sync the problems, whenever you want to sync the problems, click the "Sync Problems" button. This will fetch the most recent `50 submissions` and update the proficiency of the problems based on the submissions.
- If you want to sync more submissions, change the `LEETCODE_SUBMISSION_FETCH_LIMIT` in `src/shared/constants.ts`. Note that doing this may significantly increase the time it takes to sync the problems.

## To Do
- Integrate NextAuth to handle user authentication.
- Add `LEETCODE_SUBMISSION_FETCH_LIMIT` to be user's preference => Create user's preferences page
- Add operations column to interact with each problem (e.g: remove/reset proficiency tracking, sync this individual problem, ...)
- Support displaying problem tags and filter problems by tags.