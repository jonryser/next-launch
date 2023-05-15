# Development

## Requirements

1. [Node](https://nodejs.org/en/) version 20.1.0
   - This project is setup to use [asdf](https://github.com/asdf-vm/asdf). This allows installing a specific version for the project. To install nodejs with asdf, see [https://github.com/asdf-vm/asdf-nodejs](https://github.com/asdf-vm/asdf-nodejs)
   - If using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to set a compatible version based on the project [.nvmrc](./.nvmrc)

2. Yarn (for package management)
   - This project is setup to use [asdf](https://github.com/asdf-vm/asdf). This allows installing a specific version for the project. To install yarn with asdf, see [https://github.com/twuni/asdf-yarn](https://github.com/twuni/asdf-yarn)
   - Or install globally via npm: `npm i -g yarn`

3. Docker ([Desktop](https://www.docker.com/products/docker-desktop/))

4. PostgreSQL [https://www.postgresql.org/](https://www.postgresql.org/)

   - See [Running PostgreSQL in Docker](#running-postgresql-in-docker)

## Steps to start

1. Create an env file

   Create a file called `.env` in project's root directory. Copy the contents of [.env.template](.env.template). See more on [Environment Variables](#environment-variables).

   ```sh
   cp .env.template .env
   ```

2. Install dependencies by using yarn

   ```sh
   yarn
   ```

3. Initialize the DB

   ```sh
   yarn prisma:migrate:dev
   ```

   This will run the Prisma migrations found in [./prisma/migrations](./prisma/migrations) and seed the database from [./prisma/seedData/index.ts](./prisma/seedData/index.ts).

4. Set up Husky

   Run `yarn prepare`

5. Run the development server.

   - Read about starting the app [Dockerized](./DEV_DOCKERIZED.md).

   - Read about starting the app [Non-Dockerized](./DEV_NON_DOCKERIZED.md).

   The app is started with the `dev` script from [`package.json`](./package.json)

   ```sh
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

   Log in with `test@email.com` and `testPassw0rd!`

## Running PostgreSQL in Docker

A simple way to get PostgreSQL running locally is to use Docker. Here is a simple Dockerized PostgreSQL server with pgAdmin:

["postgres_docker" on Github](https://github.com/generalui/postgres_docker)

### Linux ONLY

If you are running on a Linux operating system the default connection to the docker container `host.docker.internal` will not work. To connect to the local dockerized PostgreSQL DB, ensure there is a `.env` file ([`.env.template`](./.env.template) can be used as a reference.) In the `.env` file, ensure the `DB_URL` variable has `host.docker.internal` replaced with `172.17.0.1`.

```.env
DB_URL="postgresql://postgres:docker@172.17.0.1:5432/my_db_dev?schema=public"
```

### Connecting to a different Database

Alternatively, the app may be set up to connect to the existing staging database or another database.

To connect to a different database (ie staging), the `.env` file must also be used with values similar to:

```.env
DB_URL="postgresql://{get_the_database_user}:{get_the_database_password}@{get_the_database_host}:{get_the_database_port}/{get_the_database_name}?schema=public"
```

## Testing

1. setup testing: `npx playwright install`
2. test: `yarn test`

The development server must be running in order to execute playwright tests.

Unit tests written with Jest + @react-testing-library.
Integration tests written in Playwright.

``` sh
yarn test       # Run all tests
yarn test:unit  # Run unit tests
yarn test:e2e   # Run integration tets
```

## General Development

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction).

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Environment Variables

All the environment variables used by the app have defaults. To set the environment variables, simply run the following bash script from the root of the [`project folder`](./):

```bash
bash ./set_env_variables.sh
```

The default environment variables' values may be over-written by adding the value to a `.env` file in the root of the [`project folder`](./). This file is not versioned in the repository.

The [`.env.template`](./.env.template) file is an example of what the `.env` could be like and may be used as a reference.

To reset the environment variables to the defaults (still using the values in the `.env` file), run the following bash script in the root of the [`project folder`](./):

```bash
bash ./reset_env_variables.sh
```

## Pre-commit hooks

This project uses husky to test code before changes are committed. This means that linting, unit, and e2e tests are run locally before changes can be committed by default.

### Skipping pre-commit hooks

Husky pre-commit scripts can be skipped by using the `--no-verify` flag, or the `-n` alias of the same flag.

``` sh
git commit --no-verify -m "<conventional commit message>"
```

or

``` sh
git commit -n -m "<conventional commit message>"
```

## Commit message format

Use the [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) format when writing commit messages. See the [contributing guide](./CONTRIBUTING.md#commit-message-format) for more information.

## Using this starter

[NextJS](https://nextjs.org/) can be used to build Static React Apps that are deployed on a static CDN like an AWS S3 Bucket, github pages, or any static hosting provider. It can also be used as a full stack framework with a Node Express backend that serves server side rendered (SSR) react pages, that includes an API. This server implementation is optional. Static Generating is recommended for most client side only React apps.

Nextjs can be removed entirely by removing the contents of the `./src` folder, `next.config.js` and `next-env.d.ts`. Then place whatever React implementation you prefer.

## What's in the box?

- [x] [**Next.js**](https://nextjs.org/): Tried and tested React full-stack react framework.
- [x] [**Typescript**](https://www.typescriptlang.org/): Configured and ready to go. With path aliases
- [x] [**Prisma**](https://www.prisma.io/): The best Node ORM. Type safe front end to back.
- [x] [**PostgreSQL**](https://www.postgresql.org/): Ready to go database running in a docker container for easy development.
- [x] [**Docker**](https://www.postgresql.org/): docker for the the db in development and set up to export the whole project for easy shipping.
- [x] [**ReactQuery**](https://react-query-v3.tanstack.com/): API request management made super simple with hooks.
- [x] [**Tailwind**](https://tailwindcss.com/): Like bootstrap, but good. A flexible styling framework that only exports the styles you use.
- [x] [**EsLint**](https://eslint.org/): linting policies configured to work with prettier and auto sort imports.
- [x] [**Jest**](https://jestjs.io/): unit tests configured with jest on front and backend.
- [x] [**Playwright**](https://playwright.dev/): Cross browser integration testing.
- [x] [**Localization routing**](https://nextjs.org/docs/advanced-features/i18n-routing): Easily add multi-language support, using Next.js' i18n routing.
- [x] [**Plop code generator**](https://plopjs.com/): Keep your code dry and modular, while improving DX.
- [x] [**React Final Form**](https://final-form.org/react): High performance subscription-based form state management for React.
- [x] [**Zod**](https://zod.dev): Validate and parse form inputs while keeping all types consistent. TypeScript-first schema validation with static type inference.
- [x] [**Husky**](https://typicode.github.io/husky/#/): Prevent bad code from being pushed with pre-commit hooks already configured to lint and test before pushing local changes.

### Using Plop Templates

This project uses plop templates to generate consistent code that is flat and modular. Running `yarn plop` will allow you to generate a component (common, partial, or page), data model, or type.
Plop will generate the appropriate code template in the appropriate folder. In the case of components plop will generate a folder with a nested component tsx, unit tests, types, and index for easier imports. In the case of pages, plop will generate the appropriate component in the `/pages` folder and `/components/pages`.

``` sh
yarn plop
```

You can also skip any part of the interactive menu by calling plop with the proper arguments.

``` sh
yarn plop component common <commonComponent>
```

[Learn more about using plop](https://plopjs.com/) for generating cleaner code

## Learn More

### NextJS

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Using this starter as static react app

A static react app generated at build time and hosted as client side only. All static content is pre-rendered on the page.

- See [static generation](https://nextjs.org/docs/basic-features/pages#static-generation-recommended)
- Remove `/pages/api`
- Build app with `yarn build:static`
- See [Next unsupported static features](https://nextjs.org/docs/advanced-features/static-html-export#unsupported-features)

### Using this starter as fullstack framework

A fullstack Nextjs app requires the app to be hosted in on most VMs that support Node.js. This server can be used to
server-side generate pages, host api logic, and optimize page loading. This is optional.

- See [server side rendering](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props)
- See [api routes](https://nextjs.org/docs/api-routes/introduction)
- See [next/server](https://nextjs.org/docs/api-reference/next/server)

### State Management

This project uses [ReactQuery](https://react-query-v3.tanstack.com/) for 99% of the state management. All api queries should be wrapped in hook with the relative model, with a reference to react query.

[Hooks for redux](https://github.com/generalui/hooks-for-redux) is used for client side only state management. Currently this is only be used by the Multi-Step Form and may be removed in the future.

## Project Source Code Map

``` txt
app
├── __tests__
│   ├── __mocks__    // mock functions
│   ├── integration  // end to end integration tests
│   └── unit         // global unit tests
├── .github  
│   └── workflows    // workflow yaml files for github actions
├── .vscode          // recommended extensions and settings for vscode
├── .husky
│   └── pre-commit   // actions to be executed before allowing a code push
├── .github  
│   └── workflows    // workflow yaml files for github actions
├── plop_templates   // templates for plop code generation
├── prisma
│   ├── migrations   // prisma generated database migrations
│   ├── seedData     // contains fake data in json format for seeding development database
│   ├── schema.prisma   // prisma schema file
│   └── seed.ts         // script executed to seed prisma development database
├── src
│   ├── components
│   │   ├── common      // simple components with no state management
│   │       │           // the building blocks for partials and pages
│   │   |   └── <Component>      // Component folder
│   │   |       ├── <Component>.spec.ts      // unit test for component
│   │   |       ├── <Component>.tsx          // component JSX markup
│   │   |       ├── <Component>.types.tsx    // types used by the component
│   │   |       └── index.ts                 // generated index file to easily import
│   │   ├── partials    // complex components and model specific components (e.g. TodoForm vs Form)
│   │       │           // composed of other partials (sparingly) and common components
│   │   |   └── <Component>      // shares the same component folder structure as common
│   │   └── pages       // contains jsx mark up for pages.
│   │       │           // composed of partials and common components
│   │       └── <Component>      // shares the same component folder structure as common
│   ├── models
│   │   └── <Model>  
│   │       ├── includes
│   │       │   └── index.ts // contains json objects to be used for prisma includes
│   │       ├── mutation
│   │       │   └── <action><Model>[By<Field>].ts  // create | update | delete actions for model optionally specified field
│   │       ├── query
│   │       │   └── get<Model>[By<Field>].ts       // read actions for model optionally specified field
│   │       └── <Model>.types.ts                   // model specific type references for prisma and zod validation
│   ├── pages        // components in this folder are converted to page routes
│   │   ├── api      // used for server routes if using NextJS fullstack.
│   │   │            // folders and nested files are converted into api routs via Nextjs
│   │   ├── _app.tsx       // warps all other pages (similar to create-react-app app.tsx)
│   │   ├── _document.tsx  // using by Nextjs when generating static pages
│   │   └── /**/*.tsx   // all other folders and nested files generate app page routes
│   │                   // actual markup should live in components/pages/<CorrespondingPageComponent>
│   ├── public       // static files (images, icons, fonts)
│   ├── store        // state management setup (hooks-for-redux)
│   ├── styles       // global project styles
│   ├── types        // all non-component, non-model specific types
│   └── utils        // shared utility functions
│       ├── api      // api specific utils
│       ├── client   // client side specific utils
│       └── requests // client side logic for api url requests as promises
│
├── client.config.js    // client in this case refers to the organization in which the app is being built for
│                       // contains template information for quickly changing the project
├── .babelrc            // babel config (for inlining css with Nextjs)
├── .dockerignore       // which files docker ignores
├── .env.template       // template env folder used for development !DO NOT PUT API KEYS HERE!
├── .eslintrc.js        // eslint config
├── .gitignore          // which files git ignores
├── .nvmrc              // contains recommended node version
├── .prettierignore     // which files should not be formatted
├── .prettierrc.js      // code formatting rules
├── docker-compose.yml  // docker compose to build db image (and production container if applicable)
├── Dockerfile          // docker file to build production db and webapp images
├── jest.config.js      // unit testing config
├── jest.setup.js       // extends unit testing library
├── next-env.d.ts       // Nextjs typescript setup
├── next.config.js      // Nextjs config
├── package.json        // project dependencies and versioning
├── playwright.config.ts// playwright config
├── plopfile.js         // code template generator config file
├── postcss.config.js   // post css processing config used for tailwind css
├── tsconfig.json       // TS config and project absolute path config
├── tailwind.config.js  // tailwind config
└── yarn.lock           // generated yarn.lock file
```

<!-- TODO: add development workflow here -->
