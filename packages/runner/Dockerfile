FROM node:20-alpine

RUN adduser -D -u 1001 runner

WORKDIR /sandbox

COPY harness.js /sandbox/harness.js

USER runner

ENTRYPOINT ["node", "/sandbox/harness.js"]
