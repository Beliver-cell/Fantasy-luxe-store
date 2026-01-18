#!/bin/bash

# Kill any existing processes on ports 8000 and 5000
fuser -k 8000/tcp 2>/dev/null
fuser -k 5000/tcp 2>/dev/null

cd backendv3 && node server.js &
cd frontendv3 && npm run dev
