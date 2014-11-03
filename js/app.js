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
        });
    }
    console.log(tiles);

    var shuffledTiles = _.shuffle(tiles);
    var selectedTiles = shuffledTiles.slice(0, 8);
    console.log(selectedTiles);

    var tilePairs = [];
    _.forEach(selectedTiles, function(tile) {
       tilePairs.push(_.clone(tile));
       tilePairs.push(_.clone(tile));
    });

    tilePairs = _.shuffle(tilePairs);
    console.log(tilePairs);

    var gameBoard = $('#game-board');
    var row  = $(document.createElement('div'));
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
        if (currentTile == null) {
            currentTile = $(this);
            console.log(currentTile);
            flipTile(currentTile);
        }
        else if (currentTile != null && ) {
            var secondTile = $(this);
            console.log(secondTile);

            if (!secondTile.data('tile').flipped) {
                flipTile(secondTile);
                match = compareTiles(currentTile.data('tile'), secondTile.data('tile'));

                if (!match) {
                    ++missedCount;
                    window.setTimeout(function () {
                        flipTile(currentTile);
                        flipTile(secondTile);
                        currentTile = null;
                    }, 1000);
                }
                else {
                    ++matchCount;
                    --remaining;
                    currentTile = null;
                }
            }
            else {
                secondTile = null;
                return;
            }
        }
    });

    function compareTiles(tile1, tile2) {
        if (tile1.tileNum == tile2.tileNum) {
            tile1.isMatched = true;
            tile2.isMatched = true;
            return true;
        }
        return false;
    }

    function flipTile(currentTile) {
        var tile = currentTile.data('tile');
        currentTile.fadeOut(100, function() {
        if (!currentTile.isMatched) {
               if (tile.flipped) {
                   currentTile.attr('src', 'img/tile-back.png');
               }
               else {
                   currentTile.attr('src', tile.src);
               }
               tile.flipped = !tile.flipped;
               currentTile.fadeIn(100);
            }
        });
    }
});