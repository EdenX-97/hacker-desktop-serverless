/*
 * @Description: Define APIs
 * @Author: Mo Xu
 * @Date: 2022-10-01 00:29:32
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-11-15 17:29:14
 */
import { StackContext, Api, use, Config } from "@serverless-stack/resources";
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
        bind: [feeds],
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
        bind: [news, feeds],
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
        bind: [podcasts, feeds],
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

  const costApi = new Api(stack, "CostApi", {
    customDomain: app.stage === "prod" ? apiDomain.costDomain : undefined,
    defaults: {
      function: {
        bind: [dictionary],
        environment: environment,
        timeout: 60,
      },
    },
    routes: {
      "PUT /cost/updateBilling": "functions/costFunctions.updateBilling",
      "GET /cost/getBilling": "functions/costFunctions.getBilling",
    },
  });
  // Role for lambda function to get cost through cost explorer
  costApi.attachPermissions([
    new PolicyStatement({
      sid: "Stmt1665678808689",
      actions: ["ce:GetCostAndUsage"],
      effect: Effect.ALLOW,
      resources: ["*"],
    }),
  ]);

  const WEATHER_API_KEY = new Config.Secret(stack, "WEATHER_API_KEY");
  const weatherApi = new Api(stack, "WeatherApi", {
    customDomain: app.stage === "prod" ? apiDomain.weatherDomain : undefined,
    defaults: {
      function: {
        environment: environment,
        timeout: 60,
        bind: [WEATHER_API_KEY, dictionary],
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
