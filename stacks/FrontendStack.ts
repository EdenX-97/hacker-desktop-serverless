/*
 * @Description: Frontend stack for create frontend website on AWS
 * @Author: Mo Xu
 * @Date: 2022-10-08 18:39:42
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-10-11 17:31:11
 */
import {
  StackContext,
  ReactStaticSite,
  use,
} from "@serverless-stack/resources";
import { ApiStack } from "./ApiStack";
import configs from "./../configs.json";

export function FrontendStack({ stack, app }: StackContext) {
  const { newsApi, podcastApi }: any = use(ApiStack);

  const site = new ReactStaticSite(stack, "ReactSite", {
    customDomain:
      app.stage === "prod"
        ? {
            domainName: configs.domain.frontDomainName,
            domainAlias: configs.domain.frontDomainAlias,
          }
        : undefined,
    path: "frontend",
    // Pass in our environment variables
    environment: {
      REACT_APP_API_URL_NEWS: newsApi.customDomainUrl || newsApi.url,
      REACT_APP_API_URL_PODCAST: podcastApi.customDomainUrl || podcastApi.url,
      REACT_APP_REGION: app.region,
    },
  });

  // Show the url in the output
  stack.addOutputs({
    SiteUrl: site.customDomainUrl || site.url,
  });
}
