var App = angular.module('proto', ['ngRoute', 'classy']);

App.classy.controller({
  name: 'ProtoCtrl',
  inject: ['$scope', '$route', '$routeParams', '$location'],
  init: function() {
    this.$._slides = ['slide_01', 'slide_02'];
    this.$.slides = [];
    this.$.slideMap = {};
    this.$.slidesLength = this.$._slides.length;
    this.$.current = 0;
  }
})

App.directive('slides', function() {
  return {
    restrict: 'E',
    transclude: true,
    controller: App.classy.controller({
      inject: ['$scope', '$element', '$attrs', '$transclude', '$location'],
      init: function() {

        this.$._slides.forEach(function(slide, i) {
          this.$.slides.push({ slide: slide, show: false, idx: i})
          this.$.slideMap[slide] = i;
        }, this)        

        this.$.showSlide = function(idx) {
          this.slides[this.current].show = false;
          this.current = idx;
          this.slides[idx].show = true;
        }

        this.$.showSlide(0);

        this.$.next = function(target) {          
          
          // default
          if (target === true) {

            // at the end? start over.
            if (this.current === this.slidesLength - 1) {
              this.showSlide(0);
            } else {
              this.showSlide(this.current + 1)
            }

          } else { // custom
            this.showSlide(this.slideMap[target])
          }
        }
      }
    }),
    link: function(s,e,a) {
    },
    template: '<slide ng-repeat="slide in slides" slide="slide"></slide>'
  }
})

App.directive('slide', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: { slide: '=' },
    controller: App.classy.controller({
      inject: ['$scope', '$element', '$attrs', '$transclude'],
      init: function() {
        this.$.root = this.$.$parent.$parent;
        this.$.nextEval = function() { return true; };
        this.$.next = function() {                    
            this.$parent.root.next.call(this.$parent.root, this.$parent.nextEval());
          }
        }
    }),
    link: function(s,e,a) {
      s.getSlideUrl = function() {
        return '../slides/' + this.slide.slide + '.html';
      }
    },

    template: '<slide ng-include="getSlideUrl()" ng-show="slide.show"></slide>'
  }
})

App.directive('eval', function() {
  return {
    restrict: 'A',
    transclude: true,
    controller: App.classy.controller({
      inject: ['$scope', '$element', '$attrs', '$transclude'],
      init: function() {
        eval("this.$.$parent.nextEval = " + this.$transclude().text())
      }
    })    
  }
})