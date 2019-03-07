# GitHubScraper

Github Webscrapper that pulls contribution data

## Standard routes

>GET /{user}

Returns all contributions as by day for the past year of a given github user.

>GET /{user}/daily

Returns averages and totals for the past year of a given github user by day of week.

>GET /{user}/monthly

Returns averages and totals for the past year of a given github suer by month of year.

## Admin routes

>GET /admin/keyRequest

Creates an API key and show the user.
NOTE: Currently there are no limits on API keys, request away!

>GET /admin/request/all/{API_KEY}

Returns data for all requests made by the API.

>GET /admin/request/{user}/{API_KEY}

Returns data for the requests made for a specific user.

## Helpful links

Github pages:

https://swharrison.github.io/GitHubScraper/

Follow me for more updates!

https://github.com/SWHarrison/GitHubScraper

Live version:

https://githubscraper-swharrison.herokuapp.com
