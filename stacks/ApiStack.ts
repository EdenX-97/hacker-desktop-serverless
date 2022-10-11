/*
 * @Description: Define APIs
 * @Author: Mo Xu
 * @Date: 2022-10-01 00:29:32
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-10-11 17:30:42
 */
import { StackContext, Api, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";
import configs from "./../configs.json";

export function ApiStack({ stack, app }: StackContext) {
  // Import table in storage stack
  const { feeds, news, podcasts } = use(StorageStack);

  const environment = {
    TABLE_NAME_FEEDS: feeds.tableName,
    TABLE_NAME_NEWS: news.tableName,
    TABLE_NAME_PODCASTS: podcasts.tableName,
  };

  // Set feed api
  const feedApi = new Api(stack, "FeedApi", {
    customDomain:
      app.stage === "prod" ? configs.domain.feedApiDomain : undefined,
    defaults: {
      function: {
        permissions: [feeds],
        environment: environment,
        timeout: 60,
      },
    },
    routes: {
      "POST /feeds/subscribeAll": "functions/feedFunctions.subscribeAll",
    },
  });

  // Set news api
  const newsApi = new Api(stack, "NewsApi", {
    customDomain:
      app.stage === "prod" ? configs.domain.newsApiDomain : undefined,
    defaults: {
      function: {
        permissions: [news, feeds],
        environment: environment,
        timeout: 60,
      },
    },
    routes: {
      "GET /news/getAllNews": "functions/newsFunctions.getAllNews",
      "PUT /news/updateAllNews": "functions/newsFunctions.updateAllNews",
    },
  });

  // Set podcast api
  const podcastApi = new Api(stack, "PodcastApi", {
    customDomain:
      app.stage === "prod" ? configs.domain.podcastApiDomain : undefined,
    defaults: {
      function: {
        permissions: [podcasts, feeds],
        environment: environment,
        timeout: 60,
      },
    },
    routes: {
      "GET /podcast/getAllPodcasts":
        "functions/podcastFunctions.getAllPodcasts",
      "PUT /podcast/updateAllPodcasts":
        "functions/podcastFunctions.updateAllPodcasts",
    },
  });

  // Add outputs of api
  stack.addOutputs({ ApiEndpoint: feedApi.url + newsApi.url + podcastApi.url });

  return {
    feedApi,
    newsApi,
    podcastApi,
  };
}
