/*
 * @Description: Define APIs
 * @Author: Mo Xu
 * @Date: 2022-10-01 00:29:32
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-10-15 01:47:01
 */
import { StackContext, Api, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";
import configs from "./../configs.json";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

export function ApiStack({ stack, app }: StackContext) {
  // Import table in storage stack
  const { feeds, news, podcasts, dictionary } = use(StorageStack);

  const environment = {
    TABLE_NAME_FEEDS: feeds.tableName,
    TABLE_NAME_NEWS: news.tableName,
    TABLE_NAME_PODCASTS: podcasts.tableName,
    TABLE_NAME_DICTIONARY: dictionary.tableName,
  };

  const apiDomain = {
    feedDomain: "feed." + configs.domain,
    newsDomain: "news." + configs.domain,
    podcastDomain: "podcast." + configs.domain,
    costDomain: "cost." + configs.domain,
    weatherDomain: "weather." + configs.domain,
  };

  const feedApi = new Api(stack, "FeedApi", {
    customDomain: app.stage === "prod" ? apiDomain.feedDomain : undefined,
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

  const newsApi = new Api(stack, "NewsApi", {
    customDomain: app.stage === "prod" ? apiDomain.newsDomain : undefined,
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

  const podcastApi = new Api(stack, "PodcastApi", {
    customDomain: app.stage === "prod" ? apiDomain.podcastDomain : undefined,
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

  // Role for lambda function to get cost through cost explorer
  const costRole = new PolicyStatement({
    sid: "Stmt1665678808689",
    actions: ["ce:GetCostAndUsage"],
    effect: Effect.ALLOW,
    resources: ["*"],
  });

  const costApi = new Api(stack, "CostApi", {
    customDomain: app.stage === "prod" ? apiDomain.costDomain : undefined,
    defaults: {
      function: {
        permissions: [dictionary, costRole],
        environment: environment,
        timeout: 60,
      },
    },
    routes: {
      "PUT /cost/updateBilling": "functions/costFunctions.updateBilling",
      "GET /cost/getBilling": "functions/costFunctions.getBilling",
    },
  });

  const weatherApi = new Api(stack, "WeatherApi", {
    customDomain: app.stage === "prod" ? apiDomain.weatherDomain : undefined,
    defaults: {
      function: {
        permissions: [dictionary],
        environment: environment,
        timeout: 60,
      },
    },
    routes: {
      "PUT /weather/updateWeather": "functions/weatherFunctions.updateWeather",
      "GET /weather/getWeather": "functions/weatherFunctions.getWeather",
      "GET /weather/getTemp": "functions/weatherFunctions.getTemp",
    },
  });

  // // Add outputs of api
  // stack.addOutputs({ ApiEndpoint: feedApi.url + newsApi.url + podcastApi.url +  });

  return {
    feedApi,
    newsApi,
    podcastApi,
    costApi,
    weatherApi,
  };
}
