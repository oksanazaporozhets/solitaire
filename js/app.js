'use strict';

var game = new Solitaire();
game.deck = new Deck();
game.deckWithOpenCard = new Deck();
game.deck.createAllCards();
game.deck.shuffleCards();
game.homesArray = [];
game.setsArray = [];

for (var i = 0; i < game.properties.setsNumber; i++) {
    var cardsToAdd = game.deck.cards.splice(0, i + 1);
    var set = new Set(cardsToAdd);
    game.setsArray.push(set);
    game.renderSet(game.setsArray[i], i);
}

game.renderDeck(game.deck.cards, 'stack-close-placeholder');
game.deck.addDeckListener(game);

for (var i = 0; i < game.properties.homeNumber; i++) {
    var home = new Home();
    game.homesArray.push(home);
    game.renderHome(game.homesArray[i], i);
}


function addDradAndDropListener(card) {
    card.onmousedown = function(e) {
        if (!card.classList.contains("draggable")) return;
        var parentElement = card.parentElement;

        var coords = getCoords(card);
        var shiftX = e.pageX - coords.left;
        var shiftY = e.pageY - coords.top;
        var cardParent = card.parentNode;

        function moveAt(e) {
            card.style.left = e.pageX - shiftX + 'px';
            card.style.top = e.pageY - shiftY + 'px';
        }

        document.onmousemove = function(e) {
            card.style.position = 'absolute';
            card.style.zIndex = 1000;
            document.body.appendChild(card);
            moveAt(e);
        };

        card.onmouseup = function(e) {
            document.onmousemove = null;
            var dropabbleObject = findDroppable(e, card);

            function moveCard() {
                if (parentElement.id === "stack-open-placeholder") {
                    game.deckWithOpenCard.removeCard(card.properties.suit, card.properties.priority);
                }
                if (dropabbleObject.element.id.substring(0, 4) === "home") {
                    card.className = "card";
                }
                dropabbleObject.element.appendChild(card);
                card.style.left = dropabbleObject.element.style.left;
                card.style.top = dropabbleObject.element.style.top;
                card.style.zIndex = dropabbleObject.element.childNodes.length + 1;
                if (checkIsWin()) {
                    alert("Congratulations! You win!");
                    return;
                }
                showNextCard();
            }

            function mouseupCardRollBack() {
                card.style.left = 0 + 'px';
                card.style.top = 40 * cardParent.childNodes.length + 'px';
                cardParent.appendChild(card);
            }

            if (!dropabbleObject) {
                mouseupCardRollBack();
                return;
            }

            if (dropabbleObject.type === 'home') {
                var home = dropabbleObject.element;
                var cardsInHome = home.childNodes;
                if (cardsInHome.length === 0) {
                    if (card.properties.priority === 1) {
                        moveCard();
                    } else {
                        mouseupCardRollBack();
                    }

                } else {
                    lastChild = cardsInHome[cardsInHome.length - 1].properties;
                    if ((card.properties.suit === lastChild.suit) &&
                        (card.properties.priority - lastChild.priority === 1)) {
                        moveCard();
                    } else {
                        mouseupCardRollBack();
                    }
                }
                return;
            } //end if(dropabbleObject.type === 'home')

            if (dropabbleObject.type === 'set') {
                var set = dropabbleObject.element;

                var cardsInSet = set.childNodes;
                if (cardsInSet.length === 0) {
                    if (card.properties.priority === 13) {
                        moveCard()
                        card.style.zIndex = set.childNodes.length + 1;

                    } else {
                        mouseupCardRollBack();
                    }

                } else {
                    var lastChild = cardsInSet[cardsInSet.length - 1].properties;
                    if ((card.properties.color !== lastChild.color) &&
                        (card.properties.priority - lastChild.priority === -1)) {
                        moveCard();
                        card.style.zIndex = set.childNodes.length + 1;
                    } else {
                        mouseupCardRollBack();
                    }
                }
            }

            function showNextCard() {
                if (parentElement.childNodes.length > 0) {
                    var lastChild = parentElement.childNodes[parentElement.childNodes.length - 1];
                    lastChild.className = "card draggable";
                }
            }

            card.onmouseup = null;
            card.ondragstart = function() {
                return false;
            };
        };
    };

    card.ondragstart = function() {
        return false;
    };
};


function findDroppable(event, card) {
    card.hidden = true;
    var elem = document.elementFromPoint(event.clientX, event.clientY);
    card.hidden = false;
    if (elem == undefined || elem.className == "" || !elem.classList) return false;
    while (!elem.classList.contains("home-placeholder") && !elem.classList.contains("set-placeholder")) {
        elem = elem.parentNode; // получить родительский элемент под курсором мыши
        if (elem.nodeName === 'body') return false;
    }
    if (elem.classList.contains("home-placeholder")) {
        var homeId = elem.id;
        var index = parseInt(homeId.substring(5));
        return {
            element: elem,
            type: "home",
            homeIndex: index
        }
    }
    if (elem.classList.contains("set-placeholder")) {
        var setId = elem.id;
        var index = parseInt(setId.substring(4));
        return {
            element: elem,
            type: "set",
            homeIndex: index
        }
    } else {
        return false;
    }
}

function checkIsWin() {
    for (var i = 0; i < game.properties.homeNumber; i++) {
        var home = document.getElementById("home-" + i);
        if (home.childNodes.length !== game.properties.oneSuitCardsNumber) {
            return false;
        }
    }
    return true;
}