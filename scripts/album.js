var setSong = function(songNumber){
  if (currentSoundFile){
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: [ 'mp3'],
    preload: true
  });
  setVolume(currentVolume);

};

var setVolume = function(volume){
  if(currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
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
                  currentSoundFile.play();
                }

                else if (currentlyPlayingSongNumber === songNumber) {

                  if(currentSoundFile.isPaused()) {
                    currentSoundFile.play();
                    $(this).html(pauseButtonTemplate);
                    $playPauseButton.html(playerBarPauseButton);
                  }
                  else {
                    currentSoundFile.pause();
                    $(this).html(playButtonTemplate);
                    $playPauseButton.html(playerBarPlayButton);
                  }
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


var nextSong = function(index) {
  var getLastSongNumber = function(index) {
    if(index === 0) {
      return currentAlbum.songs.length;
    }
    else{
      return index;
    }
  };
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex ++;
  if(currentSongIndex >= currentAlbum.songs.length){
    currentSongIndex = 0;
  }
  setSong(currentSongIndex + 1);
  currentSoundFile.play();

  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  updatePlayerBarSong();
  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
}
var previousSong = function() {
  var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }


    setSong(currentSongIndex + 1);
    currentSoundFile.play();

    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];


    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

var togglePlayFromPlayerBar = function() {
  if(currentSoundFile.isPaused()){
    currentSoundFile.play();
    var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingCell.html(pauseButtonTemplate);
    $playPauseButton.html(playerBarPauseButton);

  }


  else if(currentSoundFile !== null) {
    var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingCell.html(playButtonTemplate);
    $playPauseButton.html(playerBarPlayButton);
    currentSoundFile.pause();

  }


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
var currentSoundFile = null;
var currentVolume = 80;

var $nextButton = $('.main-controls .next');
var $previousButton = $('.main-controls .previous');
var $playPauseButton = $('.main-controls .play-pause');


$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  $nextButton.click(nextSong);
  $previousButton.click(previousSong);
  $playPauseButton.click(togglePlayFromPlayerBar);


});
