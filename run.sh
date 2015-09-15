#!/usr/bin/env bash
cd /src
gulp && pm2 start lib/index.js --no-daemon
