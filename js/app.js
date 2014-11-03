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

    $('#startButton').click(function() {
        newGame();
        startTimer();
    });

    var timer;
    function startTimer() {
        var startTime = _.now();
        timer = window.setInterval(function() {
            var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
            $('elapsed-seconds').text('Elapsed Time: ' + elapsedSeconds + 's');
        }, 1000);
    }

    function newGame() {
        $('#game-board').empty();
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
    }


    var currentTile = null;
    var matchCount = 0;
    var missedCount = 0;
    var remaining = 8;
    var match = false;

    $('#game-board img').click(function() {
        if (currentTile == null && !$(this).data('tile').isMatched) {
            currentTile = $(this);
            console.log(currentTile);
            flipTile(currentTile);
        }
        else if (currentTile != null) {
            var secondTile = $(this);
            console.log(secondTile);

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
                if (matchCount < 8) {
                    ++matchCount;
                    --remaining;
                    currentTile.data('tile').isMatched = true;
                    secondTile.data('tile').isMatched = true;
                    currentTile = null;
                }
                else if (matchCount == 8) {
                    window.clearInterval(timer);
                    $('#game-board').empty();
                }
            }
        }
    });

    function compareTiles(tile1, tile2) {
        return tile1.src == tile2.src;
    }

    function flipTile(currentTile) {
        var tile = currentTile.data('tile');
        console.log(currentTile.data('tile').isMatched + ' from flipTile');
        if (!tile.isMatched) {
            currentTile.fadeOut(100, function () {
                if (tile.flipped) {
                    currentTile.attr('src', 'img/tile-back.png');
                }
                else {
                    currentTile.attr('src', tile.src);
                }
                tile.flipped = !tile.flipped;
                currentTile.fadeIn(100);
            });
        }
    }
});