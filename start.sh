#!/usr/bin/env bash
docker stop $(docker ps -q -a)
#cd ../backend && docker-compose up -d
cd ../frontend && npm start
