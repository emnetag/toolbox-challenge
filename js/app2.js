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
        if (currentTile == null) {
            currentTile = $(this);
            flipTile(currentTile);
        }
        else if (currentTile != null) {
            var secondTile = $(this);
            flipTile(secondTile);

            match = compareImages(currentTile.data('tile'), secondTile.data('tile'));

            if (match) {
                if (matchCount == 8) {
                    window.alert('You won!!');
                }
                else {
                    ++matchCount;
                    --remaining;
                    currentTile.data('tile').isMatched = true;
                    secondTile.data('tile').isMatched = true;
                }
            }
            else {
                ++missedCount;
                window.setTimeout(function() {
                    flipTile(currentTile);
                    flipTile(secondTile);
                    currentTile = null;
                }, 1000)
            }
        }
    });

    function flipTile(tile) {
        var currentImg = tile.data('tile');
        if (!currentImg.isMatched) {
            tile.fadeOut(100, function() {
                if (currentImg.flipped) {
                    tile.attr('src', 'img/tile-back.png');
                }
                else {
                    tile.attr('src', currentImg.src);
                }
            }, 100);
        }
    }

    function compareImages(img1, img2) {
        return img1.src == img2.src;
    }
});