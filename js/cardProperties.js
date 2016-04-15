'use strict';

var cardsProperties = function() {
    var suits = {
        diamonds: {
            color: 'red',
            imagePosition: 0
        },
        clubs: {
            color: 'black',
            imagePosition: -196
        },
        hearts: {
            color: 'red',
            imagePosition: -392
        },
        spades: {
            color: 'black',
            imagePosition: -588
        }
    };

    var names = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven',
        'eight', 'nine', 'ten', 'jack', 'queen', 'king'
    ];
    var ranks = {};
    var cardWidth = 140;
    for (var i = 0; i < names.length; ++i) {
        ranks[names[i]] = {
            name: names[i],
            priority: i + 1,
            imagePosition: (-i) * cardWidth
        }
    }
    return {
        suits: suits,
        ranks: ranks,
        names: names
    }
}();