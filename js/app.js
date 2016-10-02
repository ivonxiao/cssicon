var app = angular.module("iconApp", []);
app.controller("MainCtrl", ['$scope','$http', '$filter', '$q', function($scope, $http, $filter, $q) { 
  $http.get('http://api.jsoneditoronline.org/v1/docs/995babe3c73846437f5f1d60549987f5/data').success(function(data){ 
    
    //995babe3c73846437f5f1d60549987f5 text
    //f26dbdc8aa88e459fb89a95b7067bf15 real
    $scope.icons = data; 
    $scope.viewerOpen = false;
    
    $scope.selectedIcon = $scope.icons[0];
    
    var generateHTML;
    $scope.generateHTML = generateHTML = function(icon){
      if (icon.htmlChildMarkup) {
        childHTML = "<i></i>";
      } else {
        childHTML = '';
      }
      var HTML = '<div class="' + icon.classNames + ' icon">' + childHTML + '</div>'
      return HTML;
    }
    
    var generateCSS = function(icon){
      var CSS = "";
      if (icon.cssBlocks.cssIcon) {
        CSS += icon.cssBlocks.cssIcon + '\n';
      }
      if (icon.cssBlocks.cssIconBefore) {
        CSS += icon.cssBlocks.cssIconBefore + '\n';
      }
      if (icon.cssBlocks.cssIconAfter) {
        CSS += icon.cssBlocks.cssIconAfter + '\n';
      }
      if (icon.cssBlocks.cssChild) {
        CSS += icon.cssBlocks.cssChild + '\n';
      }
      if (icon.cssBlocks.cssChildBefore) {
        CSS += icon.cssBlocks.cssChildBefore + '\n';
      }
      if (icon.cssBlocks.cssChildAfter) {
        CSS += icon.cssBlocks.cssChildAfter + '\n';
      }
      // CSS += ".icon {\n  position: absolute;\n}\n.icon:before, .icon:after {\n  content: '';\n  position: absolute;\n  display: block;\n}\n" ;
      // if (icon.htmlChildMarkup) {
      //   CSS += ".icon i {\n  position: absolute;\n}\n.icon i:before, .icon i:after {\n  content: '';\n  position: absolute;\n  display: block;\n}\n";
      // } 
      return CSS;
    }
    
    var generateCodepenString = function(icon){
      var html = "<div class='iconWrapper'>\n\t" + generateHTML(icon) + "\n</div>";
      var css = generateCSS(icon);
      css += ".iconWrapper {\n  position: relative;\n  width: 21px;\n  height: 21px;\n}\n"
      if (icon.cssHidden) {
        css += icon.cssHidden + '\n';
      }
      var title = icon.name + " icon";
      
      var data = {
        title                 : title,
        description           : title + " created with pure css",
        editors               : "110", 
        layout                : "left", // top | left | right
        html                  : html,
        css                   : css,
      }
      return JSON.stringify(data).replace(/"/g, "&​quot;").replace(/'/g, "&apos;");
    }
    
    $scope.handleIconClick = function(icon){
      $scope.selectedIcon = icon;
      $scope.selectedIcon.cssBlocks = {};
      var iconName = icon.name.replace(/\s+/g, '-').toLowerCase();
      var cssIconHttp = $http.get('../css/icons/' + iconName + '/main.css').then(function(res){
        //success
        $scope.selectedIcon.cssBlocks.cssIcon = res.data;
      }, function(){
        //error
        $scope.selectedIcon.cssBlocks.cssIcon = false;
      });

      var cssIconBeforeHttp = $http.get('../css/icons/' + iconName + '/before.css').then(function(res){
        //success
        $scope.selectedIcon.cssBlocks.cssIconBefore = res.data;
      }, function(){
        //error
        $scope.selectedIcon.cssBlocks.cssIconBefore = false;
      });

      var cssIconAfterHttp = $http.get('../css/icons/' + iconName + '/after.css').then(function(res){
        //success
        $scope.selectedIcon.cssBlocks.cssIconAfter = res.data;
      }, function(){
        //error
        $scope.selectedIcon.cssBlocks.cssIconAfter = false;
      });


      var cssChildHttp = $http.get('../css/icons/' + iconName + '/i.css').then(function(res){
        //success
        $scope.selectedIcon.cssBlocks.cssChild = res.data;
      }, function(){
        //error
        $scope.selectedIcon.cssBlocks.cssChild = false;
      });

      var cssChildBeforeHttp = $http.get('../css/icons/' + iconName + '/i-before.css').then(function(res){
        //success
        $scope.selectedIcon.cssBlocks.cssChildBefore = res.data;
      }, function(){
        //error
        $scope.selectedIcon.cssBlocks.cssChildBefore = false;
      });

      var cssChildAfterHttp = $http.get('../css/icons/' + iconName + '/i-after.css').then(function(res){
        //success
        $scope.selectedIcon.cssBlocks.cssChildAfter = res.data;
      }, function(){
        //error
        $scope.selectedIcon.cssBlocks.cssChildAfter = false;
      });



      $q.all([cssIconHttp, cssIconBeforeHttp, cssIconAfterHttp, cssChildHttp, cssChildBeforeHttp, cssChildAfterHttp, ]).then(function(){

        $scope.JSONstring = generateCodepenString($scope.selectedIcon);
        $scope.viewerOpen = true;

        var htmlClipboard = new Clipboard('.html.buttonCopy', {
            text: function() {
                return generateHTML($scope.selectedIcon);
            }
        });
        
        htmlClipboard.on('success', function(e) {
            console.log("html", e);
        });
        
        var cssClipboard = new Clipboard('.css.buttonCopy', {
            text: function() {
                return generateCSS($scope.selectedIcon);
            }
        });
        
        cssClipboard.on('success', function(e) {
            console.log("css", e);
        });

      });

      
    }
    
    $scope.handleButtonCloseClick = function(icon){
      $scope.viewerOpen = false;
    }
    
  }); 
}] ); 
