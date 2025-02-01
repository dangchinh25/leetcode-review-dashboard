module.exports = {
    root: true,
    env: {
        browser: true,
        amd: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    extends: [
        "next/core-web-vitals",
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended",
        "prettier",
    ],
    plugins: [
        "import",
        "simple-import-sort",
        "unused-imports",
        "prefer-arrow",
        "no-only-tests",
        "prettier",
    ],
    rules: {
        "prettier/prettier": ["error", {}, { usePrettierrc: true }],
        "react/prop-types": "error",
        "jsx-a11y/anchor-is-valid": "error",
        "react/no-unescaped-entities": "error",
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": "error",
        "import/no-restricted-paths": [
            "error",
            {
                zones: [
                    {
                        target: "src/frontend/**",
                        from: "src/backend/**",
                        message: "Please do not import backend code from frontend.",
                    },
                    {
                        target: "src/backend/**",
                        from: "src/frontend/**",
                        message: "Please do not import frontend code from backend.",
                    },
                    {
                        target: "src/shared/**",
                        from: "src/frontend/**",
                        message: "Please do not import frontend code from shared.",
                    },
                    {
                        target: "src/shared/**",
                        from: "src/backend/**",
                        message: "Please do not import backend code from shared.",
                    },
                    {
                        target: "src/frontend/**",
                        from: "src/pages/**",
                        message: "Please do not import pages code from frontend.",
                    },
                    {
                        target: "src/backend/**",
                        from: "src/pages/**",
                        message: "Please do not import pages code from backend.",
                    },
                    {
                        target: "src/frontend/**",
                        from: "src/app/**",
                        message: "Please do not import app code from frontend.",
                    },
                    {
                        target: "src/backend/**",
                        from: "src/app/**",
                        message: "Please do not import app code from backend.",
                    },
                    {
                        target: "src/frontend/**",
                        from: "src/dataproxy/**",
                        message: "Please do not import dataproxy code from frontend.",
                    },
                    {
                        target: "src/dataproxy/**",
                        from: "src/frontend/**",
                        message: "Please do not import frontend code from dataproxy.",
                    },
                    {
                        target: "src/dataproxy/**",
                        from: "src/backend/**",
                        message: "Please do not import backend code from dataproxy.",
                    },
                    {
                        target: "src/dataproxy/**",
                        from: "src/app/**",
                        message: "Please do not import app code from dataproxy.",
                    },
                    {
                        target: "src/dataproxy/**",
                        from: "src/pages/**",
                        message: "Please do not import pages code from dataproxy.",
                    },
                ],
            },
        ],
        "simple-import-sort/exports": "error",
        "simple-import-sort/imports": [
            "error",
            {
                groups: [
                    ["^\\u0000"], // Side effect imports.
                    ["^node:"], // Node.js builtins prefixed with `node:`.
                    ["^(react|next)"], // React.js and Next.js builtins.
                    ["^@?\\w"], // Packages. Things that start with a letter (or digit or underscore), or `@` followed by a letter.
                    ["^"], // Absolute imports. Anything not matched in group above.
                    ["^@/.*$"], // @/ Next.js absolute imports.
                    ["^\\."], // Relative imports. Anything that starts with a dot.
                    ["^\\..*.css$"], // Relative style imports. Anything that starts with a dot ends with .css
                ],
            },
        ],
        "unused-imports/no-unused-imports": "error",
        "object-shorthand": ["error", "always", { avoidQuotes: true }],
        "react/react-in-jsx-scope": "off",
        "max-params": ["error", { max: 3 }],
        "prefer-arrow/prefer-arrow-functions": "error",
        "no-only-tests/no-only-tests": ["error"],
    },
    overrides: [
        // https://stackoverflow.com/a/64488474
        {
            files: ["**/*.ts", "**/*.tsx"],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                project: ["./tsconfig.json"], // Specify it only for TypeScript files
            },
            // As mentioned in the comments, you should extend TypeScript plugins here,
            // instead of extending them outside the `overrides`.
            // If you don't want to extend any rules, you don't need an `extends` attribute.
            extends: [
                "plugin:@typescript-eslint/recommended",
                "plugin:@typescript-eslint/recommended-requiring-type-checking",
            ],
            rules: {
                "no-restricted-imports": ["error", "assert"],
                "@typescript-eslint/no-unused-vars": "warn",
                "@typescript-eslint/no-namespace": "error",
                "@typescript-eslint/no-floating-promises": "error",
                "@typescript-eslint/no-misused-promises": "error",
                "@typescript-eslint/await-thenable": "error",
                "@typescript-eslint/explicit-function-return-type": "off",
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "@typescript-eslint/consistent-type-imports": "error",
            },
        },
    ],
};
