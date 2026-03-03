- if `bun run --filter @mc/api dev` is put in root `package.json`'s `dev` script then sometimes graceful shutdown is not getting triggered

- BullMQ requires the policy to be set to noeviction; otherwise, Redis may start deleting keys (e.g., job data, queue metadata) when memory limits are reached, leading to data corruption and undefined behavior. Following runtime error occurs:

```txt
IMPORTANT! Eviction policy is volatile-lru. It should be "noeviction"
```

- BullMQ and not Bull as I might wanna use `promoteJobs` in future to add priorities to queue jobs

- crawl sitemap is nothing but a bunch of scrape jobs with all urls from sitemap

- graceful shutdown logic should not be asynchronous

- we MUST attach an error listener to the worker. If we don't, an unhandled error event can crash the entire process and stop the worker silently.

- don't add custom user agent, patchright takes care of that

- add `"dom"` to `"lib"` in `tsconfig.json` to use `document` api for browser ops

- try keep the actual scraper function free for most time

- page content needs to be the main source of raw html in case there is some JS rendered component and in case that fails then inevitably we have to go for response.body()

- in case of batch scraping from same url, we need to add random time delay between subsequent scrapes.
