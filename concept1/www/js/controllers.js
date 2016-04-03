angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, $http, $localstorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.localstorage = $localstorage;

  $rootScope.levels = $localstorage.getObject('levels');
  $rootScope.questions = $localstorage.getObject('questions');
  $rootScope.scores = $localstorage.getObject('scores');
  $rootScope.images = $localstorage.getObject('images');

  $rootScope.username = $localstorage.get('username', '');

  $localstorage.setObject('unlockedImages', [])
  $rootScope.unlockedImages = $localstorage.getArray('unlockedImages');

  $http.get('http://areyoufurreal.com/api/gameinfo').then(function(data){
    //console.log(data.data);
    $rootScope.levels = data.data.levels;
    $rootScope.questions = data.data.facts;
    $rootScope.scores = data.data.scores;
    $rootScope.images = data.data.images;

    $localstorage.setObject('questions', data.data.facts);
    $localstorage.setObject('levels', data.data.levels);
    $localstorage.setObject('scores', data.data.scores);
    $localstorage.setObject('images', data.data.images);
  });


  //$rootScope.levels = [
  //  { name: 'Rainforest', background: 'http://i.imgur.com/2GOesW5.jpg', image: 'http://cdn2.list25.com/wp-content/uploads/2014/01/sharklegs.jpg' },
  //  { name: 'Underwater', background: 'http://i.imgur.com/iibQ229.jpg', image: 'https://s-media-cache-ak0.pinimg.com/236x/4e/a3/2c/4ea32cec9df2359d49a926887e17b9dc.jpg'}
  //];

  //$rootScope.questions = [
  //  [
  //    { question: 'A chameleon’s tongue can be as long as its body.', answer: 'true' },
  //    { question: 'Deers have no gall bladders', answer: 'true' },
  //    { question: 'A chameleon’s tongue can be as long as its body.', answer: 'false' },
  //  ],
  //  [
  //    { question: 'A chameleon’s tongue can be as long as its body.', answer: 'true' },
  //    { question: 'Deers have no gall bladders', answer: 'true' },
  //    { question: 'A chameleon’s tongue can be as long as its body.', answer: 'false' },
  //  ]
  //];



  // Form data for the login modal
  $rootScope.loginData = {};
  $rootScope.gameData = {
    currentScore: 0,
    score: 0,
    level: 0,
  };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $rootScope
  }).then(function(modal) {
    $rootScope.modal = modal;
  });

  // Triggered in the login modal to close it
  $rootScope.closeLogin = function() {
    $rootScope.modal.hide();
  };

  // Open the login modal
  $rootScope.login = function() {
    $rootScope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $rootScope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    $rootScope.username = $scope.loginData.username;
    $localstorage.set('username', $scope.loginData.username);

    $http.post('http://areyoufurreal.com/api/submitscore', {
      level_id: $rootScope.gameData.level,
      username: $localstorage.get('username'),
      score: $rootScope.gameData.score,
    }).then(function(data){
      $rootScope.gameData.showSubmit = false;
      $rootScope.highscores = data.data;
    });

  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})
  .controller('SubmitFactsCtrl', function($scope, $localstorage, $http){
    $scope.form = {
      username: $localstorage.get('username', ''),
      a: '1',
      added: 0
    };
    $scope.submitFact = function(form){
      $http.post('http://areyoufurreal.com/api/submitfact', form);
      $rootScope.username = form.username;
      $localstorage.set('username', form.username);
      $scope.form = {
        added: 0,
        username: form.username
      };
    }
  })

.controller('BrowseCtrl', function($scope, $rootScope, $localstorage, $http, $stateParams, $filter, TDCardDelegate){
  $rootScope.gameData.level = $stateParams.levelId;
  $rootScope.gameData.currentScore = 0;

  $rootScope.levels.forEach(function(level){
    if(level.id == $stateParams.levelId){
      $scope.level = level;
    }
  })

  $scope.cards = [];
  $rootScope.questions.forEach(function(question){
    if(question.level_id == $stateParams.levelId){
      $scope.cards.push(question);
    }
  });

  //$scope.cards = $rootScope.questions;
  //
  //$scope.cards = $rootScope.questions[$rootScope.gameData.level].slice();

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.cardSwipedLeft = function(index, card) {
    console.log('LEFT SWIPE');
    if(card.a === 0){
      $rootScope.gameData.currentScore++;
    }
    else{
      $rootScope.gameData.currentScore--;
    }
    if($scope.cards.length == 1){
      $scope.nextLevel();
    }
  };
  $scope.cardSwipedRight = function(index, card) {
    console.log('RIGHT SWIPE');
    if(card.a === 1){
      $rootScope.gameData.currentScore++;
    }
    else{
      $rootScope.gameData.currentScore--;
    }
    if($scope.cards.length == 1){
      $scope.nextLevel();
    }
  };
  $scope.nextLevel = function(){
    $rootScope.gameData.level = $stateParams.levelId;
    $rootScope.gameData.score = $rootScope.gameData.currentScore;
    $rootScope.gameData.currentScore = 0;
    $rootScope.modal.show();

    $rootScope.gameData.showSubmit = true;
    function isBlank(str) {
      return (!str || /^\s*$/.test(str));
    }
    if(!isBlank($localstorage.get('username'))){
      $rootScope.gameData.showSubmit = false;
      $http.post('http://areyoufurreal.com/api/submitscore', {
        level_id: $rootScope.gameData.level,
        username: $localstorage.get('username'),
        score: $rootScope.gameData.score,
      }).then(function(data){
        $rootScope.highscores = data.data;
      });
    }

    $rootScope.unlockedImages = $localstorage.getArray('unlockedImages');
    $rootScope.newUnlockedImages = [];

    console.log($rootScope.images);
    $rootScope.images.forEach(function(image){
      if(image.level_id == $stateParams.levelId){
        if(image.score <= $rootScope.gameData.score){
          $rootScope.newUnlockedImages.push(image);
          $rootScope.unlockedImages.push(image);
          $localstorage.setObject('unlockedImages', $rootScope.unlockedImages);
        }
      }
    });

    //$rootScope.gameData.level++;
    //if($rootScope.gameData.level < $rootScope.levels.length){
    //  $scope.cards = $rootScope.questions[$rootScope.gameData.level].slice();
    //}
  }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
