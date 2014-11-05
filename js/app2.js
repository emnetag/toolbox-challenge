"use strict";

$(document).ready(function() {
    var tiles = [];
    var idx;

    for (idx = 1; idx <= 32; ++idx) {
        tiles.push({
             tileNum: idx,
             src: 'img/tile' + idx + '.jpg',
             flipped: false,
             isMatched: false
            }
        );
    }

    var shuffledTiles = _.shuffle(tiles);
    var selectedTiles = shuffledTiles.slice(0, 8);

    var tilePairs = [];
    _.forEach(selectedTiles, function(tile) {
       tilePairs.push(_.clone(tile));
       tilePairs.push(_.clone(tile));
    });
    tilePairs = _.shuffle(tilePairs);

    var gameBoard = $('#game-board');
    var row = $(document.createElement('div'));
    var img;

    _.forEach(tilePairs, function(tile, elemIndex) {
        if (elemIndex > 0  && elemIndex % 4 == 0) {
            gameBoard.append(row);
            row = $(document.createElement('div'))
        }

        img = $(document.createElement('img'));
        img.attr({
            src: "img/tile-back.png",
            alt: "image of tile " + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);

    var currentTile = null;
    var matchCount = 0;
    var missedCount = 0;
    var remaining = 8;
    var match = false;

    $('#game-board img').click(function() {
        if ($(this).data('tile').flipped) {
            return;
        }
        else if (currentTile == null) {
            currentTile = $(this);
            flipTile(currentTile);
        }
        else {
            var secondTile = $(this);
            flipTile(secondTile);

            match = compareImages(currentTile.data('tile'), secondTile.data('tile'));

            if (!match) {
                ++missedCount;
                window.setTimeout(function() {
                    flipTile(currentTile);
                    flipTile(secondTile);
                    currentTile = null;
                }, 1000)
            }
            else {
                ++matchCount;
                --remaining;
                currentTile.data('tile').isMatched = true;
                secondTile.data('tile').isMatched = true;
                currentTile = null;
            }
            if (matchCount == 8) {
                alert('You Won!!');
            }
        }
    });

    function flipTile(currentTile) {
        var tile = currentTile.data('tile');
        if (!tile.isMatched) {
            currentTile.fadeOut(100, function () {
                if (tile.flipped) {
                    currentTile.attr('src', 'img/tile-back.png');
                }
                else {
                    currentTile.attr('src', tile.src);
                }
                tile.flipped = !tile.flipped;
            });
            currentTile.fadeIn(100);
        }
    }

    function compareImages(img1, img2) {
        return img1.tileNum == img2.tileNum;
    }
});