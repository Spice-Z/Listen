import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../graphql-server/generated/schema.graphql',
  documents: ['./app/**/*.tsx', './feature/**/*.tsx'],
  generates: {
    './feature/graphql/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: false,
};

export default config;
