var setSong = function(songNumber){
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

};

var getSongNumberCell = function(number){
  return $('.song-item-number[data-song-number="' + number + '"]');

};

var createSongRow = function(songNumber, songName, songLength) {
  var template =  '<tr class="album-view-song-item">'
                + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
                + ' <td class="song-item-title">' + songName + '</td>'
                + ' <td class="song-item-duration">' + songLength + '</td>'
                + '</tr>'
                ;

              var $row = $(template);
              var clickHandler = function() {

                var songNumber = parseInt($(this).attr('data-song-number'));


                if(currentlyPlayingSongNumber !== null) {
                  var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
                  currentlyPlayingCell.html(currentlyPlayingSongNumber);
                }

                if (currentlyPlayingSongNumber !== songNumber) {
                  $(this).html(pauseButtonTemplate);
                  setSong(songNumber);
                }

                else if (currentlyPlayingSongNumber === songNumber) {
                  $(this).html(playButtonTemplate);
                  $('.main-controls .play-pause').html(playerBarPlayButton);
                  setSong(null);
                }
                updatePlayerBarSong();
              };

              var onHover = function(event){
                var songNumberCell = $(this).find('.song-item-number');
                var songNumber = parseInt(songNumberCell.attr('data-song-number'));

                if (songNumber !== currentlyPlayingSongNumber){
                  songNumberCell.html(playButtonTemplate);
                }
              };

              var offHover = function(event){
                var songNumberCell = $(this).find('.song-item-number');
                var songNumber = parseInt(songNumberCell.attr('data-song-number'));

                if(songNumber !== currentlyPlayingSongNumber) {
                  songNumberCell.html(songNumber);
                }

              };

              $row.find('.song-item-number').click(clickHandler);
              $row.hover(onHover, offHover);
              return $row;
};

var setCurrentAlbum = function(album) {
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + " " + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();
  for(var i = 0; i < album.songs.length; i ++){
    var $newRow = createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};



var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
}


var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};


var songPicker = function(type) {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  if (type ==  'next'){
      var getLastSongNumber = function(index) {
        if(index === 0) {
          return currentAlbum.songs.length;
    }
    else{
      return index;
    }
  }

  currentSongIndex ++;
  if(currentSongIndex >= currentAlbum.songs.length){
    currentSongIndex = 0;
  }
  currentlyPlayingSongNumber = currentSongIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

};
 if(type == 'previous'){
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };


    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }


    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
};

    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};


var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>'
var currentlyPlayingSongNumber = null;
var currentAlbum = null;
var currentSongFromAlbum = null;

var $nextButton = $('.main-controls .next');
var $previousButton = $('.main-controls .previous');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  $nextButton.click(function(){
    songPicker('next');
  });
  $previousButton.click(function(){
    songPicker('previous');
  });

});
