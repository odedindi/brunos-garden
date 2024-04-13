import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: "schema.graphql",
  documents: ["src/**/*.{graphql,ts,tsx}"],
  ignoreNoDocuments: true,
  generates: {
    "./generated/resolvers-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
    './generated/': {
        preset: 'client'
      }
  },
}
export default config
