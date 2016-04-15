function Card(suit, name, parent) {
    this.suit = suit;
    this.name = name;
    this.priority = cardsProperties.ranks[name].priority;
    this.id = suit + '-' + name;
    this.isDraggable = false;
    this.color = cardsProperties.suits[suit].color;
    this.parent = parent;

    this.imagePositionX = cardsProperties.ranks[name].imagePosition;
    this.imagePositionY = cardsProperties.suits[suit].imagePosition;
}

function renderCard(card) {
    var renderCard = document.createElement('div');
    renderCard.properties = {
        priority: card.priority,
        suit: card.suit,
        color: card.color,
        parent: card.parent
    };
    renderCard.style.backgroundPosition = card.imagePositionX + 'px ' + card.imagePositionY + 'px';
    if (card.isDraggable) {
        renderCard.className = 'card draggable';
    } else {
        renderCard.className = 'card back';
    }
    addDradAndDropListener(renderCard);
    return renderCard;
}

function Deck() {
    this.cards = [];
}

Deck.prototype.createAllCards = function() {
    for (var suit in cardsProperties.suits) {
        if (cardsProperties.suits.hasOwnProperty(suit)) {
            for (var i = 0; i < cardsProperties.names.length; i++) {
                var card = new Card(suit, cardsProperties.names[i]);
                card.isDraggable = false;
                this.cards.push(card);
            }
        }
    }
};

Deck.prototype.shuffleCards = function() {
    this.cards.sort(function() {
        return Math.random() - Math.random();
    })
};

Deck.prototype.addDeckListener = function(game) {
    var container = document.getElementById('stack-close-placeholder');
    container.onclick = function(event) {
        if (game.deck.cards.length === 0) {
            game.deck.cards = game.deckWithOpenCard.cards.splice(0);
            game.deck.cards.forEach(function(item) {
                item.isDraggable = false;
            })
        } else {
            var card = game.deck.cards.pop();
            card.isDraggable = true;
            game.deckWithOpenCard.cards.push(card);
        }
        game.renderDeck(game.deck.cards, 'stack-close-placeholder');
        game.renderDeck(game.deckWithOpenCard.cards, 'stack-open-placeholder');
    };
}

Deck.prototype.removeCard = function(suit, priority) {
    var len = this.cards.length;
    for (var i = 0; i < len; i++) {
        if (this.cards[i].suit === suit && this.cards[i].priority === priority) {
            this.cards.splice(i, 1);
        }
    }
};

function Home() {
    this.cards = [];
}

function Set(cardsToAdd) {
    this.cards = cardsToAdd;
    for (var i = 0; i < this.cards.length; i++) {
        this.cards[i].parent = this;
    }
}

Set.prototype.removeCard = function(card) { //nead fix for adding next drooppable sibling search
    return this.pop();
};