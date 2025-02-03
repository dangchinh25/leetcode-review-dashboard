# LeetCode Proficiency Tracker

A simple dashboard to track your LeetCode proficiency over each problems. This is a rewrite of this project [PMCA](https://github.com/HaolinZhong/PMCA) by fetching data directly from LeetCode intead of relying on tracking submission button on the browser, which is not reliable. It also adds better QAL features like better filtering, sorting, and searching.

<img src="/public/screenshot.png"/>

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

### Seed data
- Define the seed data logic in `src/backend/seed/seed.ts`. Right now this file is filled with my own logic to sync my own LeetCode data, take it as an example to implement your own logic.
- Run the seed script
```sh
pnpm run temp-database-seed
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How it works
- Let the server running and open the dashboard.
- The dashboard will not automatically sync the problems, whenever you want to sync the problems, click the "Sync Problems" button. This will fetch the most recent `50 submissions` and update the proficiency of the problems based on the submissions.
- If you want to sync more submissions, change the `LEETCODE_SUBMISSION_FETCH_LIMIT` in `src/shared/constants.ts`. Note that doing this may significantly increase the time it takes to sync the problems.

## To Do
- Integrate NextAuth to handle user authentication.
- Add `LEETCODE_SUBMISSION_FETCH_LIMIT` to be user's preference => Create user's preferences page
- Add operations column to interact with each problem (e.g: remove/reset proficiency tracking, sync this individual problem, ...) => Important to not have to rely on the "Sync Problems" button, which is not that reliable.
- Support filter problems by tags.
- Add ability to not have to put in LEETCODE_SESSION_COOKIE in the `.env` file by just using Leetcode's handle. => Important as session cookie can change.