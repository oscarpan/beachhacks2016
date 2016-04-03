angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $rootScope.levels = [
    { name: 'Rainforest', background: 'http://i.imgur.com/2GOesW5.jpg', image: 'http://cdn2.list25.com/wp-content/uploads/2014/01/sharklegs.jpg' },
    { name: 'Underwater', background: 'http://i.imgur.com/iibQ229.jpg', image: 'https://s-media-cache-ak0.pinimg.com/236x/4e/a3/2c/4ea32cec9df2359d49a926887e17b9dc.jpg'}
  ];

  $rootScope.questions = [
    [
      { question: 'A chameleon’s tongue can be as long as its body.', answer: 'true' },
      { question: 'Deers have no gall bladders', answer: 'true' },
      { question: 'A chameleon’s tongue can be as long as its body.', answer: 'false' },
    ],
    [
      { question: 'A chameleon’s tongue can be as long as its body.', answer: 'true' },
      { question: 'Deers have no gall bladders', answer: 'true' },
      { question: 'A chameleon’s tongue can be as long as its body.', answer: 'false' },
    ]
  ];



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

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $rootScope.closeLogin();
    }, 1000);
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
  .controller('SubmitFactsCtrl', function($scope){
    $scope.form = {};
    $scope.submitFact = function(form){

    }
  })

.controller('BrowseCtrl', function($scope, $rootScope, TDCardDelegate){
  $scope.test = 'test';

  $rootScope.gameData.currentScore = 0;

  $scope.cards = $rootScope.questions[$rootScope.gameData.level].slice();

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.cardSwipedLeft = function(index, card) {
    console.log('LEFT SWIPE');
    if(card.answer == "false"){
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
    if(card.answer == "true"){
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
    $rootScope.gameData.score = $rootScope.gameData.currentScore;
    $rootScope.gameData.currentScore = 0;
    $rootScope.modal.show();
    $rootScope.gameData.level++;
    if($rootScope.gameData.level < $rootScope.levels.length){
      $scope.cards = $rootScope.questions[$rootScope.gameData.level].slice();
    }
  }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
