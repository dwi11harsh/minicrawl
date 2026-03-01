- if `bun run --filter @mc/api dev` is put in root `package.json`'s `dev` script then sometimes graceful shutdown is not getting triggered

- BullMQ requires the policy to be set to noeviction; otherwise, Redis may start deleting keys (e.g., job data, queue metadata) when memory limits are reached, leading to data corruption and undefined behavior. Following runtime error occurs:

```txt
IMPORTANT! Eviction policy is volatile-lru. It should be "noeviction"
```

- BullMQ and not Bull as I might wanna use `promoteJobs` in future to add priorities to queue jobs

- crawl sitemap is nothing but a bunch of scrape jobs with all urls from sitemap

- graceful shutdown logic should not be asynchronous

- we MUST attach an error listener to the worker. If we don't, an unhandled error event can crash the entire process and stop the worker silently.
