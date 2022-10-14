/*
 * @Description: Frontend stack for create frontend website on AWS
 * @Author: Mo Xu
 * @Date: 2022-10-08 18:39:42
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-10-14 16:06:13
 */
import {
  StackContext,
  ReactStaticSite,
  use,
} from "@serverless-stack/resources";
import { ApiStack } from "./ApiStack";
import configs from "./../configs.json";

export function FrontendStack({ stack, app }: StackContext) {
  const { newsApi, podcastApi, costApi }: any = use(ApiStack);

  const site = new ReactStaticSite(stack, "ReactSite", {
    customDomain:
      app.stage === "prod"
        ? {
            domainName: configs.domain,
            domainAlias: "www." + configs.domain,
          }
        : undefined,
    path: "frontend",
    // Pass in our environment variables
    environment: {
      REACT_APP_API_URL_NEWS: newsApi.customDomainUrl || newsApi.url,
      REACT_APP_API_URL_PODCAST: podcastApi.customDomainUrl || podcastApi.url,
      REACT_APP_API_URL_COST: costApi.customDomainUrl || costApi.url,
      REACT_APP_REGION: app.region,
    },
  });

  // Show the url in the output
  stack.addOutputs({
    SiteUrl: site.customDomainUrl || site.url,
  });
}
