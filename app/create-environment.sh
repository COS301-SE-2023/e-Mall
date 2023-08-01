#!/bin/bash

# Define environment variables
PRODUCTION=$production
USER_POOL_ID=$userPoolId
USER_POOL_WEB_CLIENT_ID=$userPoolWebClientId
API_URL=$apiUrl

# Create environment file content
ENVIRONMENT_FILE_CONTENT="export const environment = {
  production: '$PRODUCTION',
  cognito: {
    userPoolId: '$USER_POOL_ID',
    userPoolWebClientId: '$USER_POOL_WEB_CLIENT_ID',
  },
  apiUrl: '$API_URL',
};"

# Write environment file content to file
echo "$ENVIRONMENT_FILE_CONTENT" > src/environments/environment.prod.ts
echo "$ENVIRONMENT_FILE_CONTENT" > src/environments/environment.ts
