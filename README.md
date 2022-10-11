<div align="center">

![Logo](https://github.com/EdenX-97/hacker-desktop-serverless/blob/8abe88b2b95d6190ba9e69a77efdabc4016303e4/frontend/public/logo.png)

# Hacker Desktop

A desktop that provides news and podcasts with developer-related information. Additionally, provide you with quick start bookmarks, the search bars of popular search engines, the time, the weather, and the AWS billing/logs/status monitor. Running entirely on AWS serverless, convenient and awesome!

[Installing](#installing) • [Developing](#developing) • [Features](#features) • [Future](#future) • [Contributing](#contributing) • [Links](#links) • [Licensing](#licensing)

</div>

## Example

![Example](https://github.com/EdenX-97/hacker-desktop-serverless/blob/8abe88b2b95d6190ba9e69a77efdabc4016303e4/frontend/public/example.jpg)

## Installing

### What you need

1. An [AWS](https://aws.amazon.com/) account with access key, free tier is enough!
   - Suggest having an IAM account with **AdministratorAccess** Policy, do not directly use the root account.
   - If you do not know how to do it, follow these [steps](https://sst.dev/chapters/create-an-iam-user.html).
2. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
   - Need [Python](https://www.python.org/downloads/)
3. [Node.js](https://nodejs.org/en/)
   - Suggest version 16.17

### Configure the AWS

Run the following with your access key ID and secret access key.

`aws configure`

You can leave the Default region name and Default output format.

## Developing

Firstly clone and install dependencies of the project:

```shell
git clone https://github.com/EdenX-97/hacker-desktop-serverless.git
cd hacker-desktop-serverless
npm install
cd frontend
npm install
```

Then, you can configure the AWS Region you want to run the application in `sst.json`, for default, it will be running on ap-southeast-2 (Sydney).

### Running

Thanks to [SST framework](https://sst.dev/), we can run the lambda function locally and hot reload instantly (usually a few hundred milliseconds).

Under the root directory of project:

```shell
npx sst start
```

The first time you start the project, it takes some time to deploy dev and debug stack to your AWS services. You can modify the stage name in `.sst/stage`.

After starting, you may find the URL to view the website in the console, and then you must go to the SST console to execute some functions.

1. To subscribe to RSS feeds, choose FeedApi from the API menu's top right corner button, and then send `/feeds/subscribeAll`.
2. Switch to NewsApi and send `/news/updateAllNews` to update all news.
3. Switch to PodcastApi and send `/podcast/updateAllPodcasts` to update all podcasts.

After then, launch your frontend in a new terminal:

```shell
cd frontend
npm start
```

Now you can view the page by going to the frontend's URL.

> Please be aware that updating infrastructure changes (under /stacks) will take substantially longer.

### Deploying

Before to deploying, you must first configure the domain in `/configs.json` using the appropriate format. Alternately, you could remove all instances of `customDomain` from `stacks/ApiStack.ts` and `stacks/FrontendStack.ts`, in which case AWS will provide some default URLs for you to access your website and APIs.

Under the root directory of project:

```shell
npx sst deploy --stage prod
```

You can use whatever stage name you like, and updating feeds, news, and podcasts requires three steps (same to running).

You can access your website using the domain address if you set your own domain.

## Features

- Built entirely on AWS serverless architecture
- A handy and cool desktop with some developer-friendly functions
  - Weekly news
    - Hacker Newsletter
    - Stack Overflow Blog
    - InfoQ News
  - Podcasts
    - Accidental Tech
    - Developer Tea
    - Software Engineer Daily
    - Changelog
    - Code Newbie
  - Present the time

## Future

### Features

- Podcast 
  - The Stack Overflow Podcast 
- Search bar
  - Google
  - Bing
- Present the weather
- AWS monitor
  - Billing
  - CloudWatch
    - Logs
    - DynamoDB
    - Lambda
    - APIGateway
- Bookmarks 
  - Quick start
- Configurable background, theme, title name

### Code

- Frontend page responsive
- Scheduled tasks to update news and podcasts
- Cognite for auth
- SSM to use configurations
- Support Chrome extension to replace start page

## Contributing

Please fork the repository if you want to make a contribution and create a feature branch. Feel free to open issues. PRs are warmly welcome.

## Links

- Repository: https://github.com/EdenX-97/hacker-desktop-serverless
- Issue tracker: https://github.com/EdenX-97/hacker-desktop-serverless/issues
  - In case of sensitive bugs like security vulnerabilities, please contact [edenx97@gmail.com](mailto:edenx97@gmail.com) directly instead of using issue tracker.
- Related projects:
  - SST framework: https://github.com/serverless-stack/sst

## Licensing

The code in this project is licensed under MIT license.