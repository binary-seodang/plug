import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://192.168.0.137:4337/graphql',
  documents: ['src/**/*.{tsx,ts}'],
  ignoreNoDocuments: true,
  generates: {
    // './src/__api__/types.ts': {
    // plugins: ['typescript', 'typescript-operations'],
    // },
    './src/gql/': {
      plugins: ['typescript', 'typescript-operations'],
      preset: 'client',
    },
  },
}

export default config

