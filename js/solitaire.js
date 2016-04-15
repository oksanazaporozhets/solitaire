function Solitaire() {
    this.deck = {};
    this.deckWithOpenCard = {};
    this.setsArray = [];
    this.homesArray = [];
    this.properties = {
        setsNumber: 7,
        homeNumber: 4,
        oneSuitCardsNumber: 13
    };
}

Solitaire.prototype.renderSet = function(set, elementId) {
    var setCards = set.cards;
    var container = document.getElementById('cartSets');
    var setName = 'set-' + elementId;
    var setBlock = document.createElement('div');
    setBlock.setAttribute("id", setName);
    setBlock.className = 'set-placeholder';
    for (var i = 0; i < setCards.length; i++) {
        setCards[i].parent = set;
        if (i === setCards.length - 1) {
            setCards[i].isDraggable = true;
        }
        var renderedCard = renderCard(setCards[i]);
        renderedCard.style.top = (40 * i) + 'px';
        renderedCard.style.zIndex = i + 1;
        setBlock.appendChild(renderedCard);
    }
    container.appendChild(setBlock);
};

Solitaire.prototype.renderHome = function(home, elementId) {
    var homeCards = home.cards;
    var container = document.getElementById('stack-homes-holders');
    var homeName = 'home-' + elementId;
    var homeBlock = document.createElement('div');
    homeBlock.setAttribute("id", homeName);
    homeBlock.className = 'home-placeholder';
    for (var i = 0; i < homeCards.length; i++) {
        homeCards[i].parent = home;
        var renderedCard = renderCard(homeCards[i]);
        homeCards[i].isDraggable = false;
        renderedCard.style.zIndex = i + 1;
        homeBlock.appendChild(renderedCard);
        renderedCard.className = 'card fixed-home';
    }
    container.appendChild(homeBlock);
};

Solitaire.prototype.renderDeck = function(set, elementId) {
    var container = document.getElementById(elementId);
    container.innerHTML = '';
    for (var i = 0; i < set.length; i++) {
        var renderedCard = renderCard(set[i]);
        renderedCard.style.zIndex = i + 1;
        container.appendChild(renderedCard);
    }
};

function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}