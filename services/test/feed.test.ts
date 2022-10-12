import { it, expect, test } from "vitest";
import { subscribe } from "./../functions/feedFunctions";
import { resultType } from "./../utils/result";
import status from "./../enums/status";

test("Bad URL", async () => {
  const badURLs: string[] = [
    "htt://stackoverflow.blog/feed/",
    "http:/stackoverflow.blog/feed/",
    "http:/stackoverflow/feed/",
    "stackoverflow",
    "1",
  ];

  for (let index in badURLs) {
    const result: resultType = await subscribe(badURLs[index]);

    expect(result.statusCode).toBe(status.NOTFOUND);
  }
});
