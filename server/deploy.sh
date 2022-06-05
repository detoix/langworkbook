#!/bin/sh
docker build -t registry.heroku.com/detoix-web-server/web . && heroku container:push web -a detoix-web-server && heroku container:release web -a detoix-web-server && docker image prune -f