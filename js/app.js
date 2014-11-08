"use strict";

$(document).ready(function() {
    var tiles = [];
    var idx;

    var currentImage = null;
    var matchCount = 0;
    var missedCount = 0;
    var remaining = 8;
    var match = false;

    for (idx = 1; idx <= 32; ++idx) {
        tiles.push({
             tileNum: idx,
             src: 'img/tile' + idx + '.jpg',
             flipped: false,
             isMatched: false
            }
        );
    }

    var gameBoard = $('#game-board');
    var timer;


    $('#startButton').click(function() {

        window.clearInterval(timer);
        $('#matches').text('Matches: 0');
        $('#missed').text('Missed: 0');
        $('#remaining-matches').text('Remaining: 0');
        newGame(tiles);
        startTimer();
    });

    $('#game-info-button').click(function() {
        $('#game-info-modal').modal();
    });


    function newGame(tiles) {
        gameBoard.empty();
        var shuffledTiles = _.shuffle(tiles);
        var selectedTiles = shuffledTiles.slice(0, 8);

        var tilePairs = [];
        _.forEach(selectedTiles, function(tile) {
            tilePairs.push(_.clone(tile));
            tilePairs.push(_.clone(tile));
        });
        tilePairs = _.shuffle(tilePairs);

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

        currentImage = null;
        matchCount = 0;
        remaining = 8;
        match = false;
        timer = null;

        $('#game-board img').click(playTurn);
    }

    function startTimer() {
        window.clearInterval(timer);
        $('#elapsed-seconds').text('Elapsed Time: 0s');
        var startTime = _.now();
        timer = window.setInterval(function() {
            var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
            $('#elapsed-seconds').text('Elapsed Time: ' + elapsedSeconds + 's');
        }, 1000);
    }


    function playTurn() {
        if ($(this).data('tile').flipped) {
            return;
        }
        else if (currentImage == null) {
            currentImage = $(this);
            flipTile(currentImage);
        }
        else {
            var secondImage = $(this);
            flipTile(secondImage);

            match = compareImages(currentImage.data('tile'), secondImage.data('tile'));

            if (!match) {
                ++missedCount;
                $("#missed").text("Missed: " + missedCount);
                window.setTimeout(function() {
                    flipTile(currentImage);
                    flipTile(secondImage);
                    currentImage = null;
                }, 1000);
            }
            else {
                ++matchCount;
                --remaining;
                $('#matches').text("Matches: " + matchCount);
                $('#remaining-matches').text("Remaining: " + remaining);
                currentImage = null;
                if (matchCount == 8) {
                    gameWon();
                }
            }
        }
    }

    function gameWon() {
        window.clearInterval(timer);
        $('main').css('opacity', 0.4);
        $('.game-won-message').hide().fadeIn(1000, function() {
            $('.crowd-cheer').trigger('play');
        });
        $('#close-message-button').click(function() {
            $('.game-won-message').hide();
            $('main').css('opacity', 1);
        });
    }

    function flipTile(currentImage) {
        var tile = currentImage.data('tile');
        currentImage.fadeOut(100, function() {
            if (tile.flipped) {
                currentImage.attr('src', 'img/tile-back.png');
            }
            else {
                currentImage.attr('src', tile.src);
            }
            tile.flipped = !tile.flipped;
            currentImage.fadeIn(100);
        });
    }

    function compareImages(img1, img2) {
        return img1.tileNum == img2.tileNum;
    }
});