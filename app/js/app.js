var App = angular.module('proto', ['ngRoute', 'classy']);

App.classy.controller({
  name: 'ProtoCtrl',
  inject: ['$scope', '$route', '$routeParams', '$location'],
  init: function() {
    this.$._slides = ['splash', 'newaccount', 'auth_googleplay', 'auth_gamecenter', 'auth_facebook', 'retrieve_googleplay', 'retrieve_gamecenter','game', 'config'];
    this.$.slides = [];
    this.$.slideMap = {};
    this.$.slidesLength = this.$._slides.length;
    this.$.current = 0;

    this.$.logs = [];

    this.$.log = function(msg) {
      this.logs.unshift(msg);
    }

    this.$.data = {};

    this.$.json = document.querySelector('json')

    this.$.dataUpdate = function() {      
      this.json.innerHTML = '';
      createExplorer(this.data, this.json)
    }

    this.$.os = "iOS";
    this.$.oauth = {
      gamecenter: "out-no-account",
      googleplay: "out-no-account",
      facebook: "out-no-account"
    }
  }
})

App.directive('slides', function() {
  return {
    restrict: 'E',
    transclude: true,
    controller: App.classy.controller({
      inject: ['$scope', '$element', '$attrs', '$transclude', '$location'],
      init: function() {
        this.$.data = [];    

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

          this.dataUpdate();
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
        this.$.next = function(value) {
            this.$parent.root.next.call(this.$parent.root, this.$parent.nextEval(value));
          }
        }
    }),
    link: function(s,e,a) {      
      s.getSlideUrl = function() {
        return './slides/' + this.slide.slide + '.html';
      }
      s.deriveClass = function() { return 'slide-' + this.slide.slide }
    },

    template: '<slide ng-include="getSlideUrl()" ng-class="deriveClass()" ng-show="slide.show"></slide>'
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



// App.directive('json', function() {
//   return {
//     restrict: 'E',    
//     controller: App.classy.controller({
//       inject: ['$scope', '$element', '$attrs'],
//       init: function() {
//         this.$.jsonEl = this.$element;

//         this.$.$watch('data', function(a,b,scope) {
//           scope.jsonEl.html('');
//           createExplorer(this.last, scope.jsonEl[0])
//         })
//       }
//     }),    
//     template: '<div></div>'
//   }
// })

function createExplorer(obj, el) {
  el.innerHTML = '';
  el.className = "json-explorer"

  if (!el.getAttribute('bound')) {
    el.setAttribute('bound', true)
    el.addEventListener('click', function (e) {      

      if (e.target.classList.contains('parent')) {
        e.target.classList.toggle('expanded')
      }
    })
  }

  function buildList(parentObj, parentEl) {
    var rEl, rParent;

    rParent = document.createElement('ul');   

    for (var key in parentObj) {
      rEl = document.createElement('li');

      if (typeof parentObj[key] == "object") {
        rEl.className = parentObj[key] instanceof Array ? 'parent array' : 'parent';
        rEl.innerHTML = '<span class="key">' + key + '</span>: {'
        buildList(parentObj[key], rEl)
      } else {
        rEl.innerHTML = '<span class="key">' + key + '</span>: <span class="value">' + parentObj[key] + '</span>';
      }

      rParent.appendChild(rEl);
    }
    parentEl.appendChild(rParent);
  }

  buildList(obj, el);     
}

