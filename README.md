# Decorasaurus Dashboard

## Todos
- ~~Setup a router guard with login auth page~~
  - Can be finicky on login
- Home orders page with a bit of reporting / graphs
- Orders page with table of orders
  - ~~Setup sorting~~
  - Setup filtering
    - Just a dynamic call to the generic api endpoint with our filter options. Some simple stuff like by status, shipped, and maybe created (last day, week, etc)
  - Export to CSV
    - https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
- ~~Order item page~~
- ~~Search capability~~
- Ability to edit status / shipping of orders
- Ability to print shipping labels
  - https://goshippo.com/
  - ~~Create label~~
  - Expand data model to include shipping info
  - ~~Verify address~~
  - Tracking
  - Webhook. Try and wire up with email to send something out when it changes to order has shipped
    - Create webhook here https://app.goshippo.com/settings/api/
    - For tracking status updates. The POST request body will contain a JSON of the Tracking object.
    - Server needs to be live with a real ip address to test
- Consider adding status to individual order items because maybe one is done and not the other.

## Inspiration
  - Will need a role for our poster producer accounts that would have access to orders, but probably not the rest and then an admin dash which has orders, customers, sales, usage analytics, reports, and other good stuff
  - http://help.wanelo.com/customer/portal/articles/1790355-how-do-i-fulfill-an-order-
  - Shopify has solid responsive dash too
  - Moltin
  - Stripe is nice
  - Nice to export to csv
  - Filters of orders by date, fulfilled etc

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Updating Production

- Web app uses a service worked so we need to break the cache when we update. Change the cache version in service-worker.js to do this and prompt users to do the same.
- Run `$ ng build --prod` to run an AoT build
- Use SFTP (cyber duck) to replace the www folder in /var/www/packonmyback.com/html on the server

## Graphql / Apollo

### Code Generation

#### Run
`$ npm run generate`

#### Setup
- Make sure both graphql-code-generator and graphql are installed globally for this to work.
- Can run `$ gql-gen init` to get it working which will install some things and setup an npm script and codegen.yml file
- Create schemas in the src/app/graphql folder for each and the script will pull from there and generate code in src/app/generated/graphql.ts