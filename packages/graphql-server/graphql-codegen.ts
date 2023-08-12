import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/**/*.ts',
  generates: {
    'generated/schema.graphql':{
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
        federation: true
      }
    },
    'generated/resolvers-types.ts': {
      config: {
        useIndexSignature: true,
        defaultMapper: 'PartialDeep<{T},{recurseIntoArrays: true}>'
      },
      plugins: [
        {
          add: {
            content: ['/* eslint-disable */',"import { PartialDeep } from 'type-fest'"],
          }
        },
        'typescript', 'typescript-resolvers'
      ],
    },
  },
};

export default config;