var request = require('request'),
    cheerio = require('cheerio'),
    async   = require('async');

(function( exports ) {

    'use strict';

    var url = 'http://www.yellowpages.com/{{location}}/{{term}}?page={{page}}&s={{sort}}',
        _scrape = function( options, callback ) {
            var term = options.term,
                location = options.location,
                pages = options.pages || 10,
                sort = options.sort || 'relevance',
                results = [],
                i = 0,
                length = pages + 1,
                fetch;

            async.forever(
                function( next ) {
                    i++;

                    if ( i < length ) {
                        fetch =  url.replace(/{{location}}/g, location)
                                    .replace(/{{term}}/g, term)
                                    .replace(/{{page}}/g, i)
                                    .replace(/{{sort}}/g, sort);

                        request( fetch, function( error, response, html ) {
                            if ( !error ) {
                                var $ = cheerio.load( html );

                                if ( $( '.search-results.organic' ).length ) {
                                    var $result = $( '.search-results.organic .result' ),
                                        x = 0,
                                        len = $result.length,
                                        $item;

                                    for ( ; x < len; x++ ) {
                                        $item = $( $result[ x ] );

                                        results.push({
                                            name: $item.find( 'span[itemprop="name"]' ).text(),
                                            address: {
                                                street: $item.find( 'span[itemprop="streetAddress"]' ).text(),
                                                city: $item.find( 'span[itemprop="addressLocality"]' ).text().slice( 0, -2 ),
                                                state: $item.find( 'span[itemprop="addressRegion"]' ).text(),
                                                zip: $item.find( 'span[itemprop="postalCode"]' ).text()
                                            },
                                            phone: $item.find( 'li[itemprop="telephone"]' ).text(),
                                            site: $item.find( 'a.track-visit-website' ).attr( 'href' ) || null,
                                        });
                                    }

                                    next();
                                } else {
                                    next( 'No Result!' );
                                }
                            }
                        });
                    } else {
                        next( 'End This Shit!' );
                    }
                },
                function( err ) {
                    callback( results );
                }
            );
        };

    exports.search = function( options, callback ) {
        if ( !options.term || !options.location ) {
            return;
        }

        _scrape( options, function( result ) {
            if ( !!( callback && callback.constructor && callback.call && callback.apply ) ) callback( result );
        });
    };

}( typeof exports === 'object' && exports || this ));
