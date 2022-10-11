/*
 * @Description: Storage stack for create DynamoDB tables
 * @Author: Mo Xu
 * @Date: 2022-10-05 22:37:07
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-10-07 17:51:08
 */
import { StackContext, Table } from "@serverless-stack/resources";

export function StorageStack({ stack }: StackContext) {
  // Feeds table for RSS Feeds
  const feeds = new Table(stack, "Feeds", {
    fields: {
      name: "string",
      type: "string",
    },
    primaryIndex: {
      partitionKey: "name",
      sortKey: "type",
    },
  });

  // News table
  const news = new Table(stack, "News", {
    fields: {
      newsId: "string",
    },
    primaryIndex: {
      partitionKey: "newsId",
    },
  });

  // Podcast table
  const podcasts = new Table(stack, "Podcasts", {
    fields: {
      podcastId: "string",
    },
    primaryIndex: {
      partitionKey: "podcastId",
    },
  });

  return {
    feeds,
    news,
    podcasts,
  };
}
