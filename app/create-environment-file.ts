import * as fs from 'fs';

interface Environment {
  production: string;
  cognito: {
    userPoolId: string;
    userPoolWebClientId: string;
  };
  apiUrl: string;
}

const environment: Environment = {
  production: process.env.production,
  cognito: {
    userPoolId: process.env.userPoolId,
    userPoolWebClientId: process.env.userPoolWebClientId,
  },
  apiUrl: process.env.apiUrl,
};

const environmentFileContent = `export const environment = ${JSON.stringify(
  environment
)};`;

fs.writeFileSync(
  'src/environments/environment.prod.ts',
  environmentFileContent
);
