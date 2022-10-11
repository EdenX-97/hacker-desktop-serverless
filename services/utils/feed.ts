import Parser from "rss-parser";

/**
 * @description: Return the feed read from rss url
 * @param {string} url
 * @return {*} the feed
 */
export const readFeed = async (url: string) => {
  const parser = new Parser({
    headers: {
      Accept: "application/rss+xml, application/xml;",
    },
  });

  const feed = await parser.parseURL(url);
  return feed;
};
