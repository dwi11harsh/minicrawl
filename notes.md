- if `bun run --filter @mc/api dev` is put in root `package.json`'s `dev` script then sometimes graceful shutdown is not getting triggered

- BullMQ requires the policy to be set to noeviction; otherwise, Redis may start deleting keys (e.g., job data, queue metadata) when memory limits are reached, leading to data corruption and undefined behavior. Following runtime error occurs:

```txt
IMPORTANT! Eviction policy is volatile-lru. It should be "noeviction"
```
