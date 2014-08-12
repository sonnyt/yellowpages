YellowPages
===========
YellowPages search scrapper

#Install
`npm install yellowpages`

#Usage

Call search method of yellowpages, it accepts two parameters, options object and callback function.

```JS
var YellowPages = require('yellowpages');

YellowPages.search( { term: 'pizza', location: '10001' }, function( result ){
  // result
});
```

#Options
Key | Description
--- | ---
`location` | search location
`term` | keyword to search
`pages` | how many pages to paginate, defaults to 10
`sort` | sort results by
