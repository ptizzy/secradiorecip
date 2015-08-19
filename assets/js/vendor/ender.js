/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://enderjs.com)
  * Build: ender build jeesh reqwest traversty timeout verge valentine page morpheus
  * Packages: ender-core@2.0.0 ender-commonjs@1.0.8 domready@1.0.8 qwery@4.0.0 bonzo@2.0.0 bean@1.0.15 jeesh@0.0.6 reqwest@1.1.6 traversty@1.0.5 timeout@0.2.1 verge@1.9.1 valentine@2.1.3 isarray@0.0.1 path-to-regexp@1.0.3 page@1.6.3 morpheus@0.7.2
  * =============================================================
  */

(function () {

  /*!
    * Ender: open module JavaScript framework (client-lib)
    * http://enderjs.com
    * License MIT
    */
  
  /**
   * @constructor
   * @param  {*=}      item      selector|node|collection|callback|anything
   * @param  {Object=} root      node(s) from which to base selector queries
   */
  function Ender(item, root) {
    var i
    this.length = 0 // Ensure that instance owns length
  
    if (typeof item == 'string')
      // start with strings so the result parlays into the other checks
      // the .selector prop only applies to strings
      item = ender._select(this['selector'] = item, root)
  
    if (null == item) return this // Do not wrap null|undefined
  
    if (typeof item == 'function') ender._closure(item, root)
  
    // DOM node | scalar | not array-like
    else if (typeof item != 'object' || item.nodeType || (i = item.length) !== +i || item == item.window)
      this[this.length++] = item
  
    // array-like - bitwise ensures integer length
    else for (this.length = i = (i > 0 ? ~~i : 0); i--;)
      this[i] = item[i]
  }
  
  /**
   * @param  {*=}      item   selector|node|collection|callback|anything
   * @param  {Object=} root   node(s) from which to base selector queries
   * @return {Ender}
   */
  function ender(item, root) {
    return new Ender(item, root)
  }
  
  
  /**
   * @expose
   * sync the prototypes for jQuery compatibility
   */
  ender.fn = ender.prototype = Ender.prototype
  
  /**
   * @enum {number}  protects local symbols from being overwritten
   */
  ender._reserved = {
    reserved: 1,
    ender: 1,
    expose: 1,
    noConflict: 1,
    fn: 1
  }
  
  /**
   * @expose
   * handy reference to self
   */
  Ender.prototype.$ = ender
  
  /**
   * @expose
   * make webkit dev tools pretty-print ender instances like arrays
   */
  Ender.prototype.splice = function () { throw new Error('Not implemented') }
  
  /**
   * @expose
   * @param   {function(*, number, Ender)}  fn
   * @param   {object=}                     scope
   * @return  {Ender}
   */
  Ender.prototype.forEach = function (fn, scope) {
    var i, l
    // opt out of native forEach so we can intentionally call our own scope
    // defaulting to the current item and be able to return self
    for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(scope || this[i], this[i], i, this)
    // return self for chaining
    return this
  }
  
  /**
   * @expose
   * @param {object|function} o
   * @param {boolean=}        chain
   */
  ender.ender = function (o, chain) {
    var o2 = chain ? Ender.prototype : ender
    for (var k in o) !(k in ender._reserved) && (o2[k] = o[k])
    return o2
  }
  
  /**
   * @expose
   * @param {string}  s
   * @param {Node=}   r
   */
  ender._select = function (s, r) {
    return s ? (r || document).querySelectorAll(s) : []
  }
  
  /**
   * @expose
   * @param {function} fn
   */
  ender._closure = function (fn) {
    fn.call(document, ender)
  }
  
  if (typeof module !== 'undefined' && module['exports']) module['exports'] = ender
  var $ = ender
  
  /**
   * @expose
   * @param {string} name
   * @param {*}      value
   */
  ender.expose = function (name, value) {
    ender.expose.old[name] = window[name]
    window[name] = value
  }
  
  /**
   * @expose
   */
  ender.expose.old = {}
  
  /**
   * @expose
   * @param {boolean} all   restore only $ or all ender globals
   */
  ender.noConflict = function (all) {
    window['$'] = ender.expose.old['$']
    if (all) for (var k in ender.expose.old) window[k] = ender.expose.old[k]
    return this
  }
  
  ender.expose('$', ender)
  ender.expose('ender', ender); // uglify needs this semi-colon between concating files
  
  /*!
    * Ender: open module JavaScript framework (module-lib)
    * http://enderjs.com
    * License MIT
    */
  
  var global = this
  
  /**
   * @param  {string}  id   module id to load
   * @return {object}
   */
  function require(id) {
    if ('$' + id in require._cache)
      return require._cache['$' + id]
    if ('$' + id in require._modules)
      return (require._cache['$' + id] = require._modules['$' + id]._load())
    if (id in window)
      return window[id]
  
    throw new Error('Requested module "' + id + '" has not been defined.')
  }
  
  /**
   * @param  {string}  id       module id to provide to require calls
   * @param  {object}  exports  the exports object to be returned
   */
  function provide(id, exports) {
    return (require._cache['$' + id] = exports)
  }
  
  /**
   * @expose
   * @dict
   */
  require._cache = {}
  
  /**
   * @expose
   * @dict
   */
  require._modules = {}
  
  /**
   * @constructor
   * @param  {string}                                          id   module id for this module
   * @param  {function(Module, object, function(id), object)}  fn   module definition
   */
  function Module(id, fn) {
    this.id = id
    this.fn = fn
    require._modules['$' + id] = this
  }
  
  /**
   * @expose
   * @param  {string}  id   module id to load from the local module context
   * @return {object}
   */
  Module.prototype.require = function (id) {
    var parts, i
  
    if (id.charAt(0) == '.') {
      parts = (this.id.replace(/\/.*?$/, '/') + id.replace(/\.js$/, '')).split('/')
  
      while (~(i = parts.indexOf('.')))
        parts.splice(i, 1)
  
      while ((i = parts.lastIndexOf('..')) > 0)
        parts.splice(i - 1, 2)
  
      id = parts.join('/')
    }
  
    return require(id)
  }
  
  /**
   * @expose
   * @return {object}
   */
   Module.prototype._load = function () {
     var m = this
     var dotdotslash = /^\.\.\//g
     var dotslash = /^\.\/[^\/]+$/g
     if (!m._loaded) {
       m._loaded = true
  
       /**
        * @expose
        */
       m.exports = {}
       m.fn.call(global, m, m.exports, function (id) {
         if (id.match(dotdotslash)) {
           id = m.id.replace(/[^\/]+\/[^\/]+$/, '') + id.replace(dotdotslash, '')
         }
         else if (id.match(dotslash)) {
           id = m.id.replace(/\/[^\/]+$/, '') + id.replace('.', '')
         }
         return m.require(id)
       }, global)
     }
  
     return m.exports
   }
  
  /**
   * @expose
   * @param  {string}                     id        main module id
   * @param  {Object.<string, function>}  modules   mapping of module ids to definitions
   * @param  {string}                     main      the id of the main module
   */
  Module.createPackage = function (id, modules, main) {
    var path, m
  
    for (path in modules) {
      new Module(id + '/' + path, modules[path])
      if (m = path.match(/^(.+)\/index$/)) new Module(id + '/' + m[1], modules[path])
    }
  
    if (main) require._modules['$' + id] = require._modules['$' + id + '/' + main]
  }
  
  if (ender && ender.expose) {
    /*global global,require,provide,Module */
    ender.expose('global', global)
    ender.expose('require', require)
    ender.expose('provide', provide)
    ender.expose('Module', Module)
  }
  
  Module.createPackage('domready', {
    'ready': function (module, exports, require, global) {
      /*!
        * domready (c) Dustin Diaz 2014 - License MIT
        */
      !function (name, definition) {
      
        if (typeof module != 'undefined') module.exports = definition()
        else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
        else this[name] = definition()
      
      }('domready', function () {
      
        var fns = [], listener
          , doc = document
          , hack = doc.documentElement.doScroll
          , domContentLoaded = 'DOMContentLoaded'
          , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)
      
      
        if (!loaded)
        doc.addEventListener(domContentLoaded, listener = function () {
          doc.removeEventListener(domContentLoaded, listener)
          loaded = 1
          while (listener = fns.shift()) listener()
        })
      
        return function (fn) {
          loaded ? setTimeout(fn, 0) : fns.push(fn)
        }
      
      });
      
    },
    'src/ender': function (module, exports, require, global) {
      !function ($) {
        var ready = require('domready')
        $.ender({domReady: ready})
        $.ender({
          ready: function (f) {
            ready(f)
            return this
          }
        }, true)
      }(ender);
    }
  }, 'ready');

  Module.createPackage('qwery', {
    'qwery': function (module, exports, require, global) {
      /*!
        * @preserve Qwery - A selector engine
        * https://github.com/ded/qwery
        * (c) Dustin Diaz 2014 | License MIT
        */
      
      (function (name, context, definition) {
        if (typeof module != 'undefined' && module.exports) module.exports = definition()
        else if (typeof define == 'function' && define.amd) define(definition)
        else context[name] = definition()
      })('qwery', this, function () {
      
        var classOnly = /^\.([\w\-]+)$/
          , doc = document
          , win = window
          , html = doc.documentElement
          , nodeType = 'nodeType'
        var isAncestor = 'compareDocumentPosition' in html ?
          function (element, container) {
            return (container.compareDocumentPosition(element) & 16) == 16
          } :
          function (element, container) {
            container = container == doc || container == window ? html : container
            return container !== element && container.contains(element)
          }
      
        function toArray(ar) {
          return [].slice.call(ar, 0)
        }
      
        function isNode(el) {
          var t
          return el && typeof el === 'object' && (t = el.nodeType) && (t == 1 || t == 9)
        }
      
        function arrayLike(o) {
          return (typeof o === 'object' && isFinite(o.length))
        }
      
        function flatten(ar) {
          for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
          return r
        }
      
        function uniq(ar) {
          var a = [], i, j
          label:
          for (i = 0; i < ar.length; i++) {
            for (j = 0; j < a.length; j++) {
              if (a[j] == ar[i]) {
                continue label
              }
            }
            a[a.length] = ar[i]
          }
          return a
        }
      
      
        function normalizeRoot(root) {
          if (!root) return doc
          if (typeof root == 'string') return qwery(root)[0]
          if (!root[nodeType] && arrayLike(root)) return root[0]
          return root
        }
      
        /**
         * @param {string|Array.<Element>|Element|Node} selector
         * @param {string|Array.<Element>|Element|Node=} opt_root
         * @return {Array.<Element>}
         */
        function qwery(selector, opt_root) {
          var m, root = normalizeRoot(opt_root)
          if (!root || !selector) return []
          if (selector === win || isNode(selector)) {
            return !opt_root || (selector !== win && isNode(root) && isAncestor(selector, root)) ? [selector] : []
          }
          if (selector && arrayLike(selector)) return flatten(selector)
      
      
          if (doc.getElementsByClassName && selector == 'string' && (m = selector.match(classOnly))) {
            return toArray((root).getElementsByClassName(m[1]))
          }
          // using duck typing for 'a' window or 'a' document (not 'the' window || document)
          if (selector && (selector.document || (selector.nodeType && selector.nodeType == 9))) {
            return !opt_root ? [selector] : []
          }
          return toArray((root).querySelectorAll(selector))
        }
      
        qwery.uniq = uniq
      
        return qwery
      }, this);
      
    },
    'src/ender': function (module, exports, require, global) {
      (function ($) {
        var q = require('qwery')
      
        $._select = function (s, r) {
          // detect if sibling module 'bonzo' is available at run-time
          // rather than load-time since technically it's not a dependency and
          // can be loaded in any order
          // hence the lazy function re-definition
          return ($._select = (function () {
            var b
            if (typeof $.create == 'function') return function (s, r) {
              return /^\s*</.test(s) ? $.create(s, r) : q(s, r)
            }
            try {
              b = require('bonzo')
              return function (s, r) {
                return /^\s*</.test(s) ? b.create(s, r) : q(s, r)
              }
            } catch (e) { }
            return q
          })())(s, r)
        }
      
        $.ender({
            find: function (s) {
              var r = [], i, l, j, k, els
              for (i = 0, l = this.length; i < l; i++) {
                els = q(s, this[i])
                for (j = 0, k = els.length; j < k; j++) r.push(els[j])
              }
              return $(q.uniq(r))
            }
          , and: function (s) {
              var plus = $(s)
              for (var i = this.length, j = 0, l = this.length + plus.length; i < l; i++, j++) {
                this[i] = plus[j]
              }
              this.length += plus.length
              return this
            }
        }, true)
      }(ender));
      
    }
  }, 'qwery');

  Module.createPackage('bonzo', {
    'bonzo': function (module, exports, require, global) {
      /*!
        * Bonzo: DOM Utility (c) Dustin Diaz 2012
        * https://github.com/ded/bonzo
        * License MIT
        */
      (function (name, context, definition) {
        if (typeof module != 'undefined' && module.exports) module.exports = definition()
        else if (typeof define == 'function' && define.amd) define(definition)
        else context[name] = definition()
      })('bonzo', this, function() {
        var win = window
          , doc = win.document
          , html = doc.documentElement
          , parentNode = 'parentNode'
          , specialAttributes = /^(checked|value|selected|disabled)$/i
            // tags that we have trouble inserting *into*
          , specialTags = /^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i
          , simpleScriptTagRe = /\s*<script +src=['"]([^'"]+)['"]>/
          , table = ['<table>', '</table>', 1]
          , td = ['<table><tbody><tr>', '</tr></tbody></table>', 3]
          , option = ['<select>', '</select>', 1]
          , noscope = ['_', '', 0, 1]
          , tagMap = { // tags that we have trouble *inserting*
                thead: table, tbody: table, tfoot: table, colgroup: table, caption: table
              , tr: ['<table><tbody>', '</tbody></table>', 2]
              , th: td , td: td
              , col: ['<table><colgroup>', '</colgroup></table>', 2]
              , fieldset: ['<form>', '</form>', 1]
              , legend: ['<form><fieldset>', '</fieldset></form>', 2]
              , option: option, optgroup: option
              , script: noscope, style: noscope, link: noscope, param: noscope, base: noscope
            }
          , stateAttributes = /^(checked|selected|disabled)$/
          , hasClass, addClass, removeClass
          , uidMap = {}
          , uuids = 0
          , digit = /^-?[\d\.]+$/
          , dattr = /^data-(.+)$/
          , px = 'px'
          , setAttribute = 'setAttribute'
          , getAttribute = 'getAttribute'
          , features = function() {
              var e = doc.createElement('p')
              return {
                transform: function () {
                  var props = ['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'], i
                  for (i = 0; i < props.length; i++) {
                    if (props[i] in e.style) return props[i]
                  }
                }()
              , classList: 'classList' in e
              }
            }()
          , whitespaceRegex = /\s+/
          , toString = String.prototype.toString
          , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, boxFlex: 1, WebkitBoxFlex: 1, MozBoxFlex: 1 }
          , query = doc.querySelectorAll && function (selector) { return doc.querySelectorAll(selector) }
      
      
        function getStyle(el, property) {
          var value = null
            , computed = doc.defaultView.getComputedStyle(el, '')
          computed && (value = computed[property])
          return el.style[property] || value
        }
      
      
        function isNode(node) {
          return node && node.nodeName && (node.nodeType == 1 || node.nodeType == 11)
        }
      
      
        function normalize(node, host, clone) {
          var i, l, ret
          if (typeof node == 'string') return bonzo.create(node)
          if (isNode(node)) node = [ node ]
          if (clone) {
            ret = [] // don't change original array
            for (i = 0, l = node.length; i < l; i++) ret[i] = cloneNode(host, node[i])
            return ret
          }
          return node
        }
      
        /**
         * @param {string} c a class name to test
         * @return {boolean}
         */
        function classReg(c) {
          return new RegExp('(^|\\s+)' + c + '(\\s+|$)')
        }
      
      
        /**
         * @param {Bonzo|Array} ar
         * @param {function(Object, number, (Bonzo|Array))} fn
         * @param {Object=} opt_scope
         * @param {boolean=} opt_rev
         * @return {Bonzo|Array}
         */
        function each(ar, fn, opt_scope, opt_rev) {
          var ind, i = 0, l = ar.length
          for (; i < l; i++) {
            ind = opt_rev ? ar.length - i - 1 : i
            fn.call(opt_scope || ar[ind], ar[ind], ind, ar)
          }
          return ar
        }
      
      
        /**
         * @param {Bonzo|Array} ar
         * @param {function(Object, number, (Bonzo|Array))} fn
         * @param {Object=} opt_scope
         * @return {Bonzo|Array}
         */
        function deepEach(ar, fn, opt_scope) {
          for (var i = 0, l = ar.length; i < l; i++) {
            if (isNode(ar[i])) {
              deepEach(ar[i].childNodes, fn, opt_scope)
              fn.call(opt_scope || ar[i], ar[i], i, ar)
            }
          }
          return ar
        }
      
      
        /**
         * @param {string} s
         * @return {string}
         */
        function camelize(s) {
          return s.replace(/-(.)/g, function (m, m1) {
            return m1.toUpperCase()
          })
        }
      
      
        /**
         * @param {string} s
         * @return {string}
         */
        function decamelize(s) {
          return s ? s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : s
        }
      
      
        /**
         * @param {Element} el
         * @return {*}
         */
        function data(el) {
          el[getAttribute]('data-node-uid') || el[setAttribute]('data-node-uid', ++uuids)
          var uid = el[getAttribute]('data-node-uid')
          return uidMap[uid] || (uidMap[uid] = {})
        }
      
      
        /**
         * removes the data associated with an element
         * @param {Element} el
         */
        function clearData(el) {
          var uid = el[getAttribute]('data-node-uid')
          if (uid) delete uidMap[uid]
        }
      
      
        function dataValue(d) {
          var f
          try {
            return (d === null || d === undefined) ? undefined :
              d === 'true' ? true :
                d === 'false' ? false :
                  d === 'null' ? null :
                    (f = parseFloat(d)) == d ? f : d;
          } catch(e) {}
          return undefined
        }
      
      
        /**
         * @param {Bonzo|Array} ar
         * @param {function(Object, number, (Bonzo|Array))} fn
         * @param {Object=} opt_scope
         * @return {boolean} whether `some`thing was found
         */
        function some(ar, fn, opt_scope) {
          for (var i = 0, j = ar.length; i < j; ++i) if (fn.call(opt_scope || null, ar[i], i, ar)) return true
          return false
        }
      
      
        /**
         * this could be a giant enum of CSS properties
         * but in favor of file size sans-closure deadcode optimizations
         * we're just asking for any ol string
         * then it gets transformed into the appropriate style property for JS access
         * @param {string} p
         * @return {string}
         */
        function styleProperty(p) {
            (p == 'transform' && (p = features.transform)) ||
              (/^transform-?[Oo]rigin$/.test(p) && (p = features.transform + 'Origin'))
            return p ? camelize(p) : null
        }
      
        // this insert method is intense
        function insert(target, host, fn, rev) {
          var i = 0, self = host || this, r = []
            // target nodes could be a css selector if it's a string and a selector engine is present
            // otherwise, just use target
            , nodes = query && typeof target == 'string' && target.charAt(0) != '<' ? query(target) : target
          // normalize each node in case it's still a string and we need to create nodes on the fly
          each(normalize(nodes), function (t, j) {
            each(self, function (el) {
              fn(t, r[i++] = j > 0 ? cloneNode(self, el) : el)
            }, null, rev)
          }, this, rev)
          self.length = i
          each(r, function (e) {
            self[--i] = e
          }, null, !rev)
          return self
        }
      
      
        /**
         * sets an element to an explicit x/y position on the page
         * @param {Element} el
         * @param {?number} x
         * @param {?number} y
         */
        function xy(el, x, y) {
          var $el = bonzo(el)
            , style = $el.css('position')
            , offset = $el.offset()
            , rel = 'relative'
            , isRel = style == rel
            , delta = [parseInt($el.css('left'), 10), parseInt($el.css('top'), 10)]
      
          if (style == 'static') {
            $el.css('position', rel)
            style = rel
          }
      
          isNaN(delta[0]) && (delta[0] = isRel ? 0 : el.offsetLeft)
          isNaN(delta[1]) && (delta[1] = isRel ? 0 : el.offsetTop)
      
          x != null && (el.style.left = x - offset.left + delta[0] + px)
          y != null && (el.style.top = y - offset.top + delta[1] + px)
      
        }
      
        // classList support for class management
        // altho to be fair, the api sucks because it won't accept multiple classes at once
        if (features.classList) {
          hasClass = function (el, c) {
            return el.classList.contains(c)
          }
          addClass = function (el, c) {
            el.classList.add(c)
          }
          removeClass = function (el, c) {
            el.classList.remove(c)
          }
        }
        else {
          hasClass = function (el, c) {
            return classReg(c).test(el.className)
          }
          addClass = function (el, c) {
            el.className = (el.className + ' ' + c).trim()
          }
          removeClass = function (el, c) {
            el.className = (el.className.replace(classReg(c), ' ')).trim()
          }
        }
      
      
        /**
         * this allows method calling for setting values
         *
         * @example
         * bonzo(elements).css('color', function (el) {
         *   return el.getAttribute('data-original-color')
         * })
         *
         * @param {Element} el
         * @param {function (Element)|string} v
         * @return {string}
         */
        function setter(el, v) {
          return typeof v == 'function' ? v.call(el, el) : v
        }
      
        function scroll(x, y, type) {
          var el = this[0]
          if (!el) return this
          if (x == null && y == null) {
            return (isBody(el) ? getWindowScroll() : { x: el.scrollLeft, y: el.scrollTop })[type]
          }
          if (isBody(el)) {
            win.scrollTo(x, y)
          } else {
            x != null && (el.scrollLeft = x)
            y != null && (el.scrollTop = y)
          }
          return this
        }
      
        /**
         * @constructor
         * @param {Array.<Element>|Element|Node|string} elements
         */
        function Bonzo(elements) {
          this.length = 0
          if (elements) {
            elements = typeof elements !== 'string' &&
              !elements.nodeType &&
              typeof elements.length !== 'undefined' ?
                elements :
                [elements]
            this.length = elements.length
            for (var i = 0; i < elements.length; i++) this[i] = elements[i]
          }
        }
      
        Bonzo.prototype = {
      
            /**
             * @param {number} index
             * @return {Element|Node}
             */
            get: function (index) {
              return this[index] || null
            }
      
            // itetators
            /**
             * @param {function(Element|Node)} fn
             * @param {Object=} opt_scope
             * @return {Bonzo}
             */
          , each: function (fn, opt_scope) {
              return each(this, fn, opt_scope)
            }
      
            /**
             * @param {Function} fn
             * @param {Object=} opt_scope
             * @return {Bonzo}
             */
          , deepEach: function (fn, opt_scope) {
              return deepEach(this, fn, opt_scope)
            }
      
      
            /**
             * @param {Function} fn
             * @param {Function=} opt_reject
             * @return {Array}
             */
          , map: function (fn, opt_reject) {
              var m = [], n, i
              for (i = 0; i < this.length; i++) {
                n = fn.call(this, this[i], i)
                opt_reject ? (opt_reject(n) && m.push(n)) : m.push(n)
              }
              return m
            }
      
          // text and html inserters!
      
          /**
           * @param {string} h the HTML to insert
           * @param {boolean=} opt_text whether to set or get text content
           * @return {Bonzo|string}
           */
          , html: function (h, opt_text) {
              var method = opt_text
                    ? 'textContent'
                    : 'innerHTML'
                , that = this
                , append = function (el, i) {
                    each(normalize(h, that, i), function (node) {
                      el.appendChild(node)
                    })
                  }
                , updateElement = function (el, i) {
                    try {
                      if (opt_text || (typeof h == 'string' && !specialTags.test(el.tagName))) {
                        return el[method] = h
                      }
                    } catch (e) {}
                    append(el, i)
                  }
              return typeof h != 'undefined'
                ? this.empty().each(updateElement)
                : this[0] ? this[0][method] : ''
            }
      
            /**
             * @param {string=} opt_text the text to set, otherwise this is a getter
             * @return {Bonzo|string}
             */
          , text: function (opt_text) {
              return this.html(opt_text, true)
            }
      
            // more related insertion methods
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , append: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el.appendChild(i)
                })
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , prepend: function (node) {
              var that = this
              return this.each(function (el, i) {
                var first = el.firstChild
                each(normalize(node, that, i), function (i) {
                  el.insertBefore(i, first)
                })
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , appendTo: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                t.appendChild(el)
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , prependTo: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                t.insertBefore(el, t.firstChild)
              }, 1)
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , before: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el[parentNode].insertBefore(i, el)
                })
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , after: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el[parentNode].insertBefore(i, el.nextSibling)
                }, null, 1)
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , insertBefore: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                t[parentNode].insertBefore(el, t)
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , insertAfter: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                var sibling = t.nextSibling
                sibling ?
                  t[parentNode].insertBefore(el, sibling) :
                  t[parentNode].appendChild(el)
              }, 1)
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , replaceWith: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el[parentNode] && el[parentNode].replaceChild(i, el)
                })
              })
            }
      
            /**
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , clone: function (opt_host) {
              var ret = [] // don't change original array
                , l, i
              for (i = 0, l = this.length; i < l; i++) ret[i] = cloneNode(opt_host || this, this[i])
              return bonzo(ret)
            }
      
            // class management
      
            /**
             * @param {string} c
             * @return {Bonzo}
             */
          , addClass: function (c) {
              c = toString.call(c).split(whitespaceRegex)
              return this.each(function (el) {
                // we `each` here so you can do $el.addClass('foo bar')
                each(c, function (c) {
                  if (c && !hasClass(el, setter(el, c)))
                    addClass(el, setter(el, c))
                })
              })
            }
      
      
            /**
             * @param {string} c
             * @return {Bonzo}
             */
          , removeClass: function (c) {
              c = toString.call(c).split(whitespaceRegex)
              return this.each(function (el) {
                each(c, function (c) {
                  if (c && hasClass(el, setter(el, c)))
                    removeClass(el, setter(el, c))
                })
              })
            }
      
      
            /**
             * @param {string} c
             * @return {boolean}
             */
          , hasClass: function (c) {
              c = toString.call(c).split(whitespaceRegex)
              return some(this, function (el) {
                return some(c, function (c) {
                  return c && hasClass(el, c)
                })
              })
            }
      
      
            /**
             * @param {string} c classname to toggle
             * @param {boolean=} opt_condition whether to add or remove the class straight away
             * @return {Bonzo}
             */
          , toggleClass: function (c, opt_condition) {
              c = toString.call(c).split(whitespaceRegex)
              return this.each(function (el) {
                each(c, function (c) {
                  if (c) {
                    typeof opt_condition !== 'undefined' ?
                      opt_condition ? !hasClass(el, c) && addClass(el, c) : removeClass(el, c) :
                      hasClass(el, c) ? removeClass(el, c) : addClass(el, c)
                  }
                })
              })
            }
      
            // display togglers
      
            /**
             * @param {string=} opt_type useful to set back to anything other than an empty string
             * @return {Bonzo}
             */
          , show: function (opt_type) {
              opt_type = typeof opt_type == 'string' ? opt_type : ''
              return this.each(function (el) {
                el.style.display = opt_type
              })
            }
      
      
            /**
             * @return {Bonzo}
             */
          , hide: function () {
              return this.each(function (el) {
                el.style.display = 'none'
              })
            }
      
      
            /**
             * @param {Function=} opt_callback
             * @param {string=} opt_type
             * @return {Bonzo}
             */
          , toggle: function (opt_callback, opt_type) {
              opt_type = typeof opt_type == 'string' ? opt_type : '';
              typeof opt_callback != 'function' && (opt_callback = null)
              return this.each(function (el) {
                el.style.display = (el.offsetWidth || el.offsetHeight) ? 'none' : opt_type;
                opt_callback && opt_callback.call(el)
              })
            }
      
      
            // DOM Walkers & getters
      
            /**
             * @return {Element|Node}
             */
          , first: function () {
              return bonzo(this.length ? this[0] : [])
            }
      
      
            /**
             * @return {Element|Node}
             */
          , last: function () {
              return bonzo(this.length ? this[this.length - 1] : [])
            }
      
      
            /**
             * @return {Element|Node}
             */
          , next: function () {
              return this.related('nextSibling')
            }
      
      
            /**
             * @return {Element|Node}
             */
          , previous: function () {
              return this.related('previousSibling')
            }
      
      
            /**
             * @return {Element|Node}
             */
          , parent: function() {
              return this.related(parentNode)
            }
      
      
            /**
             * @private
             * @param {string} method the directional DOM method
             * @return {Element|Node}
             */
          , related: function (method) {
              return bonzo(this.map(
                function (el) {
                  el = el[method]
                  while (el && el.nodeType !== 1) {
                    el = el[method]
                  }
                  return el || 0
                },
                function (el) {
                  return el
                }
              ))
            }
      
      
            /**
             * @return {Bonzo}
             */
          , focus: function () {
              this.length && this[0].focus()
              return this
            }
      
      
            /**
             * @return {Bonzo}
             */
          , blur: function () {
              this.length && this[0].blur()
              return this
            }
      
            // style getter setter & related methods
      
            /**
             * @param {Object|string} o
             * @param {string=} opt_v
             * @return {Bonzo|string}
             */
          , css: function (o, opt_v) {
              var p, iter = o
              // is this a request for just getting a style?
              if (opt_v === undefined && typeof o == 'string') {
                // repurpose 'v'
                opt_v = this[0]
                if (!opt_v) return null
                if (opt_v === doc || opt_v === win) {
                  p = (opt_v === doc) ? bonzo.doc() : bonzo.viewport()
                  return o == 'width' ? p.width : o == 'height' ? p.height : ''
                }
                return (o = styleProperty(o)) ? getStyle(opt_v, o) : null
              }
      
              if (typeof o == 'string') {
                iter = {}
                iter[o] = opt_v
              }
      
              function fn(el, p, v) {
                for (var k in iter) {
                  if (iter.hasOwnProperty(k)) {
                    v = iter[k];
                    // change "5" to "5px" - unless you're line-height, which is allowed
                    (p = styleProperty(k)) && digit.test(v) && !(p in unitless) && (v += px)
                    try { el.style[p] = setter(el, v) } catch(e) {}
                  }
                }
              }
              return this.each(fn)
            }
      
      
            /**
             * @param {number=} opt_x
             * @param {number=} opt_y
             * @return {Bonzo|number}
             */
          , offset: function (opt_x, opt_y) {
              if (opt_x && typeof opt_x == 'object' && (typeof opt_x.top == 'number' || typeof opt_x.left == 'number')) {
                return this.each(function (el) {
                  xy(el, opt_x.left, opt_x.top)
                })
              } else if (typeof opt_x == 'number' || typeof opt_y == 'number') {
                return this.each(function (el) {
                  xy(el, opt_x, opt_y)
                })
              }
              if (!this[0]) return {
                  top: 0
                , left: 0
                , height: 0
                , width: 0
              }
              var el = this[0]
                , de = el.ownerDocument.documentElement
                , bcr = el.getBoundingClientRect()
                , scroll = getWindowScroll()
                , width = el.offsetWidth
                , height = el.offsetHeight
                , top = bcr.top + scroll.y - Math.max(0, de && de.clientTop, doc.body.clientTop)
                , left = bcr.left + scroll.x - Math.max(0, de && de.clientLeft, doc.body.clientLeft)
      
              return {
                  top: top
                , left: left
                , height: height
                , width: width
              }
            }
      
      
            /**
             * @return {number}
             */
          , dim: function () {
              if (!this.length) return { height: 0, width: 0 }
              var el = this[0]
                , de = el.nodeType == 9 && el.documentElement // document
                , orig = !de && !!el.style && !el.offsetWidth && !el.offsetHeight ?
                   // el isn't visible, can't be measured properly, so fix that
                   function (t) {
                     var s = {
                         position: el.style.position || ''
                       , visibility: el.style.visibility || ''
                       , display: el.style.display || ''
                     }
                     t.first().css({
                         position: 'absolute'
                       , visibility: 'hidden'
                       , display: 'block'
                     })
                     return s
                  }(this) : null
                , width = de
                    ? Math.max(el.body.scrollWidth, el.body.offsetWidth, de.scrollWidth, de.offsetWidth, de.clientWidth)
                    : el.offsetWidth
                , height = de
                    ? Math.max(el.body.scrollHeight, el.body.offsetHeight, de.scrollHeight, de.offsetHeight, de.clientHeight)
                    : el.offsetHeight
      
              orig && this.first().css(orig)
              return {
                  height: height
                , width: width
              }
            }
      
            // attributes are hard. go shopping
      
            /**
             * @param {string} k an attribute to get or set
             * @param {string=} opt_v the value to set
             * @return {Bonzo|string}
             */
          , attr: function (k, opt_v) {
              var el = this[0]
                , n
      
              if (typeof k != 'string' && !(k instanceof String)) {
                for (n in k) {
                  k.hasOwnProperty(n) && this.attr(n, k[n])
                }
                return this
              }
      
              return typeof opt_v == 'undefined' ?
                !el ? null : specialAttributes.test(k) ?
                  stateAttributes.test(k) && typeof el[k] == 'string' ?
                    true : el[k] :  el[getAttribute](k) :
                this.each(function (el) {
                  specialAttributes.test(k) ? (el[k] = setter(el, opt_v)) : el[setAttribute](k, setter(el, opt_v))
                })
            }
      
      
            /**
             * @param {string} k
             * @return {Bonzo}
             */
          , removeAttr: function (k) {
              return this.each(function (el) {
                stateAttributes.test(k) ? (el[k] = false) : el.removeAttribute(k)
              })
            }
      
      
            /**
             * @param {string=} opt_s
             * @return {Bonzo|string}
             */
          , val: function (s) {
              return (typeof s == 'string' || typeof s == 'number') ?
                this.attr('value', s) :
                this.length ? this[0].value : null
            }
      
            // use with care and knowledge. this data() method uses data attributes on the DOM nodes
            // to do this differently costs a lot more code. c'est la vie
            /**
             * @param {string|Object=} opt_k the key for which to get or set data
             * @param {Object=} opt_v
             * @return {Bonzo|Object}
             */
          , data: function (opt_k, opt_v) {
              var el = this[0], o, m
              if (typeof opt_v === 'undefined') {
                if (!el) return null
                o = data(el)
                if (typeof opt_k === 'undefined') {
                  each(el.attributes, function (a) {
                    (m = ('' + a.name).match(dattr)) && (o[camelize(m[1])] = dataValue(a.value))
                  })
                  return o
                } else {
                  if (typeof o[opt_k] === 'undefined')
                    o[opt_k] = dataValue(this.attr('data-' + decamelize(opt_k)))
                  return o[opt_k]
                }
              } else {
                return this.each(function (el) { data(el)[opt_k] = opt_v })
              }
            }
      
            // DOM detachment & related
      
            /**
             * @return {Bonzo}
             */
          , remove: function () {
              this.deepEach(clearData)
              return this.detach()
            }
      
      
            /**
             * @return {Bonzo}
             */
          , empty: function () {
              return this.each(function (el) {
                deepEach(el.childNodes, clearData)
      
                while (el.firstChild) {
                  el.removeChild(el.firstChild)
                }
              })
            }
      
      
            /**
             * @return {Bonzo}
             */
          , detach: function () {
              return this.each(function (el) {
                el[parentNode] && el[parentNode].removeChild(el)
              })
            }
      
            // who uses a mouse anyway? oh right.
      
            /**
             * @param {number} y
             */
          , scrollTop: function (y) {
              return scroll.call(this, null, y, 'y')
            }
      
      
            /**
             * @param {number} x
             */
          , scrollLeft: function (x) {
              return scroll.call(this, x, null, 'x')
            }
      
        }
      
      
        function cloneNode(host, el) {
          var c = el.cloneNode(true)
            , cloneElems
            , elElems
            , i
      
          // check for existence of an event cloner
          // preferably https://github.com/fat/bean
          // otherwise Bonzo won't do this for you
          if (host.$ && typeof host.cloneEvents == 'function') {
            host.$(c).cloneEvents(el)
      
            // clone events from every child node
            cloneElems = host.$(c).find('*')
            elElems = host.$(el).find('*')
      
            for (i = 0; i < elElems.length; i++)
              host.$(cloneElems[i]).cloneEvents(elElems[i])
          }
          return c
        }
      
        function isBody(element) {
          return element === win || (/^(?:body|html)$/i).test(element.tagName)
        }
      
        function getWindowScroll() {
          return { x: win.pageXOffset || html.scrollLeft, y: win.pageYOffset || html.scrollTop }
        }
      
        function createScriptFromHtml(html) {
          var scriptEl = document.createElement('script')
            , matches = html.match(simpleScriptTagRe)
          scriptEl.src = matches[1]
          return scriptEl
        }
      
        /**
         * @param {Array.<Element>|Element|Node|string} els
         * @return {Bonzo}
         */
        function bonzo(els) {
          return new Bonzo(els)
        }
      
        bonzo.setQueryEngine = function (q) {
          query = q;
          delete bonzo.setQueryEngine
        }
      
        bonzo.aug = function (o, target) {
          // for those standalone bonzo users. this love is for you.
          for (var k in o) {
            o.hasOwnProperty(k) && ((target || Bonzo.prototype)[k] = o[k])
          }
        }
      
        bonzo.create = function (node) {
          // hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
          return typeof node == 'string' && node !== '' ?
            function () {
              if (simpleScriptTagRe.test(node)) return [createScriptFromHtml(node)]
              var tag = node.match(/^\s*<([^\s>]+)/)
                , el = doc.createElement('div')
                , els = []
                , p = tag ? tagMap[tag[1].toLowerCase()] : null
                , dep = p ? p[2] + 1 : 1
                , ns = p && p[3]
                , pn = parentNode
      
              el.innerHTML = p ? (p[0] + node + p[1]) : node
              while (dep--) el = el.firstChild
              // for IE NoScope, we may insert cruft at the begining just to get it to work
              if (ns && el && el.nodeType !== 1) el = el.nextSibling
              do {
                if (!tag || el.nodeType == 1) {
                  els.push(el)
                }
              } while (el = el.nextSibling)
              // IE < 9 gives us a parentNode which messes up insert() check for cloning
              // `dep` > 1 can also cause problems with the insert() check (must do this last)
              each(els, function(el) { el[pn] && el[pn].removeChild(el) })
              return els
            }() : isNode(node) ? [node.cloneNode(true)] : []
        }
      
        bonzo.doc = function () {
          var vp = bonzo.viewport()
          return {
              width: Math.max(doc.body.scrollWidth, html.scrollWidth, vp.width)
            , height: Math.max(doc.body.scrollHeight, html.scrollHeight, vp.height)
          }
        }
      
        bonzo.firstChild = function (el) {
          for (var c = el.childNodes, i = 0, j = (c && c.length) || 0, e; i < j; i++) {
            if (c[i].nodeType === 1) e = c[j = i]
          }
          return e
        }
      
        bonzo.viewport = function () {
          return {
              width: win.innerWidth
            , height: win.innerHeight
          }
        }
      
        bonzo.isAncestor = 'compareDocumentPosition' in html ?
          function (container, element) {
            return (container.compareDocumentPosition(element) & 16) == 16
          } :
          function (container, element) {
            return container !== element && container.contains(element);
          }
      
        return bonzo
      }); // the only line we care about using a semi-colon. placed here for concatenation tools
      
    },
    'src/ender': function (module, exports, require, global) {
      (function ($) {
      
        var b = require('bonzo')
        b.setQueryEngine($)
        $.ender(b)
        $.ender(b(), true)
        $.ender({
          create: function (node) {
            return $(b.create(node))
          }
        })
      
        $.id = function (id) {
          return $([document.getElementById(id)])
        }
      
        function indexOf(ar, val) {
          for (var i = 0; i < ar.length; i++) if (ar[i] === val) return i
          return -1
        }
      
        function uniq(ar) {
          var r = [], i = 0, j = 0, k, item, inIt
          for (; item = ar[i]; ++i) {
            inIt = false
            for (k = 0; k < r.length; ++k) {
              if (r[k] === item) {
                inIt = true; break
              }
            }
            if (!inIt) r[j++] = item
          }
          return r
        }
      
        $.ender({
          parents: function (selector, closest) {
            if (!this.length) return this
            if (!selector) selector = '*'
            var collection = $(selector), j, k, p, r = []
            for (j = 0, k = this.length; j < k; j++) {
              p = this[j]
              while (p = p.parentNode) {
                if (~indexOf(collection, p)) {
                  r.push(p)
                  if (closest) break;
                }
              }
            }
            return $(uniq(r))
          }
      
        , parent: function() {
            return $(uniq(b(this).parent()))
          }
      
        , closest: function (selector) {
            return this.parents(selector, true)
          }
      
        , first: function () {
            return $(this.length ? this[0] : this)
          }
      
        , last: function () {
            return $(this.length ? this[this.length - 1] : [])
          }
      
        , next: function () {
            return $(b(this).next())
          }
      
        , previous: function () {
            return $(b(this).previous())
          }
      
        , related: function (t) {
            return $(b(this).related(t))
          }
      
        , appendTo: function (t) {
            return b(this.selector).appendTo(t, this)
          }
      
        , prependTo: function (t) {
            return b(this.selector).prependTo(t, this)
          }
      
        , insertAfter: function (t) {
            return b(this.selector).insertAfter(t, this)
          }
      
        , insertBefore: function (t) {
            return b(this.selector).insertBefore(t, this)
          }
      
        , clone: function () {
            return $(b(this).clone(this))
          }
      
        , siblings: function () {
            var i, l, p, r = []
            for (i = 0, l = this.length; i < l; i++) {
              p = this[i]
              while (p = p.previousSibling) p.nodeType == 1 && r.push(p)
              p = this[i]
              while (p = p.nextSibling) p.nodeType == 1 && r.push(p)
            }
            return $(r)
          }
      
        , children: function () {
            var i, l, el, r = []
            for (i = 0, l = this.length; i < l; i++) {
              if (!(el = b.firstChild(this[i]))) continue;
              r.push(el)
              while (el = el.nextSibling) el.nodeType == 1 && r.push(el)
            }
            return $(uniq(r))
          }
      
        , height: function (v) {
            return dimension.call(this, 'height', v)
          }
      
        , width: function (v) {
            return dimension.call(this, 'width', v)
          }
        }, true)
      
        /**
         * @param {string} type either width or height
         * @param {number=} opt_v becomes a setter instead of a getter
         * @return {number}
         */
        function dimension(type, opt_v) {
          return typeof opt_v == 'undefined'
            ? b(this).dim()[type]
            : this.css(type, opt_v)
        }
      }(ender));
    }
  }, 'bonzo');

  Module.createPackage('bean', {
    'bean': function (module, exports, require, global) {
      /*!
        * Bean - copyright (c) Jacob Thornton 2011-2012
        * https://github.com/fat/bean
        * MIT license
        */
      (function (name, context, definition) {
        if (typeof module != 'undefined' && module.exports) module.exports = definition()
        else if (typeof define == 'function' && define.amd) define(definition)
        else context[name] = definition()
      })('bean', this, function (name, context) {
        name    = name    || 'bean'
        context = context || this
      
        var win            = window
          , old            = context[name]
          , namespaceRegex = /[^\.]*(?=\..*)\.|.*/
          , nameRegex      = /\..*/
          , addEvent       = 'addEventListener'
          , removeEvent    = 'removeEventListener'
          , doc            = document || {}
          , root           = doc.documentElement || {}
          , W3C_MODEL      = root[addEvent]
          , eventSupport   = W3C_MODEL ? addEvent : 'attachEvent'
          , ONE            = {} // singleton for quick matching making add() do one()
      
          , slice          = Array.prototype.slice
          , str2arr        = function (s, d) { return s.split(d || ' ') }
          , isString       = function (o) { return typeof o == 'string' }
          , isFunction     = function (o) { return typeof o == 'function' }
      
            // events that we consider to be 'native', anything not in this list will
            // be treated as a custom event
          , standardNativeEvents =
              'click dblclick mouseup mousedown contextmenu '                  + // mouse buttons
              'mousewheel mousemultiwheel DOMMouseScroll '                     + // mouse wheel
              'mouseover mouseout mousemove selectstart selectend '            + // mouse movement
              'keydown keypress keyup '                                        + // keyboard
              'orientationchange '                                             + // mobile
              'focus blur change reset select submit '                         + // form elements
              'load unload beforeunload resize move DOMContentLoaded '         + // window
              'readystatechange message '                                      + // window
              'error abort scroll '                                              // misc
            // element.fireEvent('onXYZ'... is not forgiving if we try to fire an event
            // that doesn't actually exist, so make sure we only do these on newer browsers
          , w3cNativeEvents =
              'show '                                                          + // mouse buttons
              'input invalid '                                                 + // form elements
              'touchstart touchmove touchend touchcancel '                     + // touch
              'gesturestart gesturechange gestureend '                         + // gesture
              'textinput '                                                     + // TextEvent
              'readystatechange pageshow pagehide popstate '                   + // window
              'hashchange offline online '                                     + // window
              'afterprint beforeprint '                                        + // printing
              'dragstart dragenter dragover dragleave drag drop dragend '      + // dnd
              'loadstart progress suspend emptied stalled loadmetadata '       + // media
              'loadeddata canplay canplaythrough playing waiting seeking '     + // media
              'seeked ended durationchange timeupdate play pause ratechange '  + // media
              'volumechange cuechange '                                        + // media
              'checking noupdate downloading cached updateready obsolete '       // appcache
      
            // convert to a hash for quick lookups
          , nativeEvents = (function (hash, events, i) {
              for (i = 0; i < events.length; i++) events[i] && (hash[events[i]] = 1)
              return hash
            }({}, str2arr(standardNativeEvents + (W3C_MODEL ? w3cNativeEvents : ''))))
      
            // custom events are events that we *fake*, they are not provided natively but
            // we can use native events to generate them
          , customEvents = (function () {
              var isAncestor = 'compareDocumentPosition' in root
                    ? function (element, container) {
                        return container.compareDocumentPosition && (container.compareDocumentPosition(element) & 16) === 16
                      }
                    : 'contains' in root
                      ? function (element, container) {
                          container = container.nodeType === 9 || container === window ? root : container
                          return container !== element && container.contains(element)
                        }
                      : function (element, container) {
                          while (element = element.parentNode) if (element === container) return 1
                          return 0
                        }
                , check = function (event) {
                    var related = event.relatedTarget
                    return !related
                      ? related == null
                      : (related !== this && related.prefix !== 'xul' && !/document/.test(this.toString())
                          && !isAncestor(related, this))
                  }
      
              return {
                  mouseenter: { base: 'mouseover', condition: check }
                , mouseleave: { base: 'mouseout', condition: check }
                , mousewheel: { base: /Firefox/.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel' }
              }
            }())
      
            // we provide a consistent Event object across browsers by taking the actual DOM
            // event object and generating a new one from its properties.
          , Event = (function () {
                  // a whitelist of properties (for different event types) tells us what to check for and copy
              var commonProps  = str2arr('altKey attrChange attrName bubbles cancelable ctrlKey currentTarget ' +
                    'detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey '  +
                    'srcElement target timeStamp type view which propertyName')
                , mouseProps   = commonProps.concat(str2arr('button buttons clientX clientY dataTransfer '      +
                    'fromElement offsetX offsetY pageX pageY screenX screenY toElement'))
                , mouseWheelProps = mouseProps.concat(str2arr('wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ ' +
                    'axis')) // 'axis' is FF specific
                , keyProps     = commonProps.concat(str2arr('char charCode key keyCode keyIdentifier '          +
                    'keyLocation location'))
                , textProps    = commonProps.concat(str2arr('data'))
                , touchProps   = commonProps.concat(str2arr('touches targetTouches changedTouches scale rotation'))
                , messageProps = commonProps.concat(str2arr('data origin source'))
                , stateProps   = commonProps.concat(str2arr('state'))
                , overOutRegex = /over|out/
                  // some event types need special handling and some need special properties, do that all here
                , typeFixers   = [
                      { // key events
                          reg: /key/i
                        , fix: function (event, newEvent) {
                            newEvent.keyCode = event.keyCode || event.which
                            return keyProps
                          }
                      }
                    , { // mouse events
                          reg: /click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i
                        , fix: function (event, newEvent, type) {
                            newEvent.rightClick = event.which === 3 || event.button === 2
                            newEvent.pos = { x: 0, y: 0 }
                            if (event.pageX || event.pageY) {
                              newEvent.clientX = event.pageX
                              newEvent.clientY = event.pageY
                            } else if (event.clientX || event.clientY) {
                              newEvent.clientX = event.clientX + doc.body.scrollLeft + root.scrollLeft
                              newEvent.clientY = event.clientY + doc.body.scrollTop + root.scrollTop
                            }
                            if (overOutRegex.test(type)) {
                              newEvent.relatedTarget = event.relatedTarget
                                || event[(type == 'mouseover' ? 'from' : 'to') + 'Element']
                            }
                            return mouseProps
                          }
                      }
                    , { // mouse wheel events
                          reg: /mouse.*(wheel|scroll)/i
                        , fix: function () { return mouseWheelProps }
                      }
                    , { // TextEvent
                          reg: /^text/i
                        , fix: function () { return textProps }
                      }
                    , { // touch and gesture events
                          reg: /^touch|^gesture/i
                        , fix: function () { return touchProps }
                      }
                    , { // message events
                          reg: /^message$/i
                        , fix: function () { return messageProps }
                      }
                    , { // popstate events
                          reg: /^popstate$/i
                        , fix: function () { return stateProps }
                      }
                    , { // everything else
                          reg: /.*/
                        , fix: function () { return commonProps }
                      }
                  ]
                , typeFixerMap = {} // used to map event types to fixer functions (above), a basic cache mechanism
      
                , Event = function (event, element, isNative) {
                    if (!arguments.length) return
                    event = event || ((element.ownerDocument || element.document || element).parentWindow || win).event
                    this.originalEvent = event
                    this.isNative       = isNative
                    this.isBean         = true
      
                    if (!event) return
      
                    var type   = event.type
                      , target = event.target || event.srcElement
                      , i, l, p, props, fixer
      
                    this.target = target && target.nodeType === 3 ? target.parentNode : target
      
                    if (isNative) { // we only need basic augmentation on custom events, the rest expensive & pointless
                      fixer = typeFixerMap[type]
                      if (!fixer) { // haven't encountered this event type before, map a fixer function for it
                        for (i = 0, l = typeFixers.length; i < l; i++) {
                          if (typeFixers[i].reg.test(type)) { // guaranteed to match at least one, last is .*
                            typeFixerMap[type] = fixer = typeFixers[i].fix
                            break
                          }
                        }
                      }
      
                      props = fixer(event, this, type)
                      for (i = props.length; i--;) {
                        if (!((p = props[i]) in this) && p in event) this[p] = event[p]
                      }
                    }
                  }
      
              // preventDefault() and stopPropagation() are a consistent interface to those functions
              // on the DOM, stop() is an alias for both of them together
              Event.prototype.preventDefault = function () {
                if (this.originalEvent.preventDefault) this.originalEvent.preventDefault()
                else this.originalEvent.returnValue = false
              }
              Event.prototype.stopPropagation = function () {
                if (this.originalEvent.stopPropagation) this.originalEvent.stopPropagation()
                else this.originalEvent.cancelBubble = true
              }
              Event.prototype.stop = function () {
                this.preventDefault()
                this.stopPropagation()
                this.stopped = true
              }
              // stopImmediatePropagation() has to be handled internally because we manage the event list for
              // each element
              // note that originalElement may be a Bean#Event object in some situations
              Event.prototype.stopImmediatePropagation = function () {
                if (this.originalEvent.stopImmediatePropagation) this.originalEvent.stopImmediatePropagation()
                this.isImmediatePropagationStopped = function () { return true }
              }
              Event.prototype.isImmediatePropagationStopped = function () {
                return this.originalEvent.isImmediatePropagationStopped && this.originalEvent.isImmediatePropagationStopped()
              }
              Event.prototype.clone = function (currentTarget) {
                //TODO: this is ripe for optimisation, new events are *expensive*
                // improving this will speed up delegated events
                var ne = new Event(this, this.element, this.isNative)
                ne.currentTarget = currentTarget
                return ne
              }
      
              return Event
            }())
      
            // if we're in old IE we can't do onpropertychange on doc or win so we use doc.documentElement for both
          , targetElement = function (element, isNative) {
              return !W3C_MODEL && !isNative && (element === doc || element === win) ? root : element
            }
      
            /**
              * Bean maintains an internal registry for event listeners. We don't touch elements, objects
              * or functions to identify them, instead we store everything in the registry.
              * Each event listener has a RegEntry object, we have one 'registry' for the whole instance.
              */
          , RegEntry = (function () {
              // each handler is wrapped so we can handle delegation and custom events
              var wrappedHandler = function (element, fn, condition, args) {
                  var call = function (event, eargs) {
                        return fn.apply(element, args ? slice.call(eargs, event ? 0 : 1).concat(args) : eargs)
                      }
                    , findTarget = function (event, eventElement) {
                        return fn.__beanDel ? fn.__beanDel.ft(event.target, element) : eventElement
                      }
                    , handler = condition
                        ? function (event) {
                            var target = findTarget(event, this) // deleated event
                            if (condition.apply(target, arguments)) {
                              if (event) event.currentTarget = target
                              return call(event, arguments)
                            }
                          }
                        : function (event) {
                            if (fn.__beanDel) event = event.clone(findTarget(event)) // delegated event, fix the fix
                            return call(event, arguments)
                          }
                  handler.__beanDel = fn.__beanDel
                  return handler
                }
      
              , RegEntry = function (element, type, handler, original, namespaces, args, root) {
                  var customType     = customEvents[type]
                    , isNative
      
                  if (type == 'unload') {
                    // self clean-up
                    handler = once(removeListener, element, type, handler, original)
                  }
      
                  if (customType) {
                    if (customType.condition) {
                      handler = wrappedHandler(element, handler, customType.condition, args)
                    }
                    type = customType.base || type
                  }
      
                  this.isNative      = isNative = nativeEvents[type] && !!element[eventSupport]
                  this.customType    = !W3C_MODEL && !isNative && type
                  this.element       = element
                  this.type          = type
                  this.original      = original
                  this.namespaces    = namespaces
                  this.eventType     = W3C_MODEL || isNative ? type : 'propertychange'
                  this.target        = targetElement(element, isNative)
                  this[eventSupport] = !!this.target[eventSupport]
                  this.root          = root
                  this.handler       = wrappedHandler(element, handler, null, args)
                }
      
              // given a list of namespaces, is our entry in any of them?
              RegEntry.prototype.inNamespaces = function (checkNamespaces) {
                var i, j, c = 0
                if (!checkNamespaces) return true
                if (!this.namespaces) return false
                for (i = checkNamespaces.length; i--;) {
                  for (j = this.namespaces.length; j--;) {
                    if (checkNamespaces[i] == this.namespaces[j]) c++
                  }
                }
                return checkNamespaces.length === c
              }
      
              // match by element, original fn (opt), handler fn (opt)
              RegEntry.prototype.matches = function (checkElement, checkOriginal, checkHandler) {
                return this.element === checkElement &&
                  (!checkOriginal || this.original === checkOriginal) &&
                  (!checkHandler || this.handler === checkHandler)
              }
      
              return RegEntry
            }())
      
          , registry = (function () {
              // our map stores arrays by event type, just because it's better than storing
              // everything in a single array.
              // uses '$' as a prefix for the keys for safety and 'r' as a special prefix for
              // rootListeners so we can look them up fast
              var map = {}
      
                // generic functional search of our registry for matching listeners,
                // `fn` returns false to break out of the loop
                , forAll = function (element, type, original, handler, root, fn) {
                    var pfx = root ? 'r' : '$'
                    if (!type || type == '*') {
                      // search the whole registry
                      for (var t in map) {
                        if (t.charAt(0) == pfx) {
                          forAll(element, t.substr(1), original, handler, root, fn)
                        }
                      }
                    } else {
                      var i = 0, l, list = map[pfx + type], all = element == '*'
                      if (!list) return
                      for (l = list.length; i < l; i++) {
                        if ((all || list[i].matches(element, original, handler)) && !fn(list[i], list, i, type)) return
                      }
                    }
                  }
      
                , has = function (element, type, original, root) {
                    // we're not using forAll here simply because it's a bit slower and this
                    // needs to be fast
                    var i, list = map[(root ? 'r' : '$') + type]
                    if (list) {
                      for (i = list.length; i--;) {
                        if (!list[i].root && list[i].matches(element, original, null)) return true
                      }
                    }
                    return false
                  }
      
                , get = function (element, type, original, root) {
                    var entries = []
                    forAll(element, type, original, null, root, function (entry) {
                      return entries.push(entry)
                    })
                    return entries
                  }
      
                , put = function (entry) {
                    var has = !entry.root && !this.has(entry.element, entry.type, null, false)
                      , key = (entry.root ? 'r' : '$') + entry.type
                    ;(map[key] || (map[key] = [])).push(entry)
                    return has
                  }
      
                , del = function (entry) {
                    forAll(entry.element, entry.type, null, entry.handler, entry.root, function (entry, list, i) {
                      list.splice(i, 1)
                      entry.removed = true
                      if (list.length === 0) delete map[(entry.root ? 'r' : '$') + entry.type]
                      return false
                    })
                  }
      
                  // dump all entries, used for onunload
                , entries = function () {
                    var t, entries = []
                    for (t in map) {
                      if (t.charAt(0) == '$') entries = entries.concat(map[t])
                    }
                    return entries
                  }
      
              return { has: has, get: get, put: put, del: del, entries: entries }
            }())
      
            // we need a selector engine for delegated events, use querySelectorAll if it exists
            // but for older browsers we need Qwery, Sizzle or similar
          , selectorEngine
          , setSelectorEngine = function (e) {
              if (!arguments.length) {
                selectorEngine = doc.querySelectorAll
                  ? function (s, r) {
                      return r.querySelectorAll(s)
                    }
                  : function () {
                      throw new Error('Bean: No selector engine installed') // eeek
                    }
              } else {
                selectorEngine = e
              }
            }
      
            // we attach this listener to each DOM event that we need to listen to, only once
            // per event type per DOM element
          , rootListener = function (event, type) {
              if (!W3C_MODEL && type && event && event.propertyName != '_on' + type) return
      
              var listeners = registry.get(this, type || event.type, null, false)
                , l = listeners.length
                , i = 0
      
              event = new Event(event, this, true)
              if (type) event.type = type
      
              // iterate through all handlers registered for this type, calling them unless they have
              // been removed by a previous handler or stopImmediatePropagation() has been called
              for (; i < l && !event.isImmediatePropagationStopped(); i++) {
                if (!listeners[i].removed) listeners[i].handler.call(this, event)
              }
            }
      
            // add and remove listeners to DOM elements
          , listener = W3C_MODEL
              ? function (element, type, add) {
                  // new browsers
                  element[add ? addEvent : removeEvent](type, rootListener, false)
                }
              : function (element, type, add, custom) {
                  // IE8 and below, use attachEvent/detachEvent and we have to piggy-back propertychange events
                  // to simulate event bubbling etc.
                  var entry
                  if (add) {
                    registry.put(entry = new RegEntry(
                        element
                      , custom || type
                      , function (event) { // handler
                          rootListener.call(element, event, custom)
                        }
                      , rootListener
                      , null
                      , null
                      , true // is root
                    ))
                    if (custom && element['_on' + custom] == null) element['_on' + custom] = 0
                    entry.target.attachEvent('on' + entry.eventType, entry.handler)
                  } else {
                    entry = registry.get(element, custom || type, rootListener, true)[0]
                    if (entry) {
                      entry.target.detachEvent('on' + entry.eventType, entry.handler)
                      registry.del(entry)
                    }
                  }
                }
      
          , once = function (rm, element, type, fn, originalFn) {
              // wrap the handler in a handler that does a remove as well
              return function () {
                fn.apply(this, arguments)
                rm(element, type, originalFn)
              }
            }
      
          , removeListener = function (element, orgType, handler, namespaces) {
              var type     = orgType && orgType.replace(nameRegex, '')
                , handlers = registry.get(element, type, null, false)
                , removed  = {}
                , i, l
      
              for (i = 0, l = handlers.length; i < l; i++) {
                if ((!handler || handlers[i].original === handler) && handlers[i].inNamespaces(namespaces)) {
                  // TODO: this is problematic, we have a registry.get() and registry.del() that
                  // both do registry searches so we waste cycles doing this. Needs to be rolled into
                  // a single registry.forAll(fn) that removes while finding, but the catch is that
                  // we'll be splicing the arrays that we're iterating over. Needs extra tests to
                  // make sure we don't screw it up. @rvagg
                  registry.del(handlers[i])
                  if (!removed[handlers[i].eventType] && handlers[i][eventSupport])
                    removed[handlers[i].eventType] = { t: handlers[i].eventType, c: handlers[i].type }
                }
              }
              // check each type/element for removed listeners and remove the rootListener where it's no longer needed
              for (i in removed) {
                if (!registry.has(element, removed[i].t, null, false)) {
                  // last listener of this type, remove the rootListener
                  listener(element, removed[i].t, false, removed[i].c)
                }
              }
            }
      
            // set up a delegate helper using the given selector, wrap the handler function
          , delegate = function (selector, fn) {
              //TODO: findTarget (therefore $) is called twice, once for match and once for
              // setting e.currentTarget, fix this so it's only needed once
              var findTarget = function (target, root) {
                    var i, array = isString(selector) ? selectorEngine(selector, root) : selector
                    for (; target && target !== root; target = target.parentNode) {
                      for (i = array.length; i--;) {
                        if (array[i] === target) return target
                      }
                    }
                  }
                , handler = function (e) {
                    var match = findTarget(e.target, this)
                    if (match) fn.apply(match, arguments)
                  }
      
              // __beanDel isn't pleasant but it's a private function, not exposed outside of Bean
              handler.__beanDel = {
                  ft       : findTarget // attach it here for customEvents to use too
                , selector : selector
              }
              return handler
            }
      
          , fireListener = W3C_MODEL ? function (isNative, type, element) {
              // modern browsers, do a proper dispatchEvent()
              var evt = doc.createEvent(isNative ? 'HTMLEvents' : 'UIEvents')
              evt[isNative ? 'initEvent' : 'initUIEvent'](type, true, true, win, 1)
              element.dispatchEvent(evt)
            } : function (isNative, type, element) {
              // old browser use onpropertychange, just increment a custom property to trigger the event
              element = targetElement(element, isNative)
              isNative ? element.fireEvent('on' + type, doc.createEventObject()) : element['_on' + type]++
            }
      
            /**
              * Public API: off(), on(), add(), (remove()), one(), fire(), clone()
              */
      
            /**
              * off(element[, eventType(s)[, handler ]])
              */
          , off = function (element, typeSpec, fn) {
              var isTypeStr = isString(typeSpec)
                , k, type, namespaces, i
      
              if (isTypeStr && typeSpec.indexOf(' ') > 0) {
                // off(el, 't1 t2 t3', fn) or off(el, 't1 t2 t3')
                typeSpec = str2arr(typeSpec)
                for (i = typeSpec.length; i--;)
                  off(element, typeSpec[i], fn)
                return element
              }
      
              type = isTypeStr && typeSpec.replace(nameRegex, '')
              if (type && customEvents[type]) type = customEvents[type].base
      
              if (!typeSpec || isTypeStr) {
                // off(el) or off(el, t1.ns) or off(el, .ns) or off(el, .ns1.ns2.ns3)
                if (namespaces = isTypeStr && typeSpec.replace(namespaceRegex, '')) namespaces = str2arr(namespaces, '.')
                removeListener(element, type, fn, namespaces)
              } else if (isFunction(typeSpec)) {
                // off(el, fn)
                removeListener(element, null, typeSpec)
              } else {
                // off(el, { t1: fn1, t2, fn2 })
                for (k in typeSpec) {
                  if (typeSpec.hasOwnProperty(k)) off(element, k, typeSpec[k])
                }
              }
      
              return element
            }
      
            /**
              * on(element, eventType(s)[, selector], handler[, args ])
              */
          , on = function(element, events, selector, fn) {
              var originalFn, type, types, i, args, entry, first
      
              //TODO: the undefined check means you can't pass an 'args' argument, fix this perhaps?
              if (selector === undefined && typeof events == 'object') {
                //TODO: this can't handle delegated events
                for (type in events) {
                  if (events.hasOwnProperty(type)) {
                    on.call(this, element, type, events[type])
                  }
                }
                return
              }
      
              if (!isFunction(selector)) {
                // delegated event
                originalFn = fn
                args       = slice.call(arguments, 4)
                fn         = delegate(selector, originalFn, selectorEngine)
              } else {
                args       = slice.call(arguments, 3)
                fn         = originalFn = selector
              }
      
              types = str2arr(events)
      
              // special case for one(), wrap in a self-removing handler
              if (this === ONE) {
                fn = once(off, element, events, fn, originalFn)
              }
      
              for (i = types.length; i--;) {
                // add new handler to the registry and check if it's the first for this element/type
                first = registry.put(entry = new RegEntry(
                    element
                  , types[i].replace(nameRegex, '') // event type
                  , fn
                  , originalFn
                  , str2arr(types[i].replace(namespaceRegex, ''), '.') // namespaces
                  , args
                  , false // not root
                ))
                if (entry[eventSupport] && first) {
                  // first event of this type on this element, add root listener
                  listener(element, entry.eventType, true, entry.customType)
                }
              }
      
              return element
            }
      
            /**
              * add(element[, selector], eventType(s), handler[, args ])
              *
              * Deprecated: kept (for now) for backward-compatibility
              */
          , add = function (element, events, fn, delfn) {
              return on.apply(
                  null
                , !isString(fn)
                    ? slice.call(arguments)
                    : [ element, fn, events, delfn ].concat(arguments.length > 3 ? slice.call(arguments, 5) : [])
              )
            }
      
            /**
              * one(element, eventType(s)[, selector], handler[, args ])
              */
          , one = function () {
              return on.apply(ONE, arguments)
            }
      
            /**
              * fire(element, eventType(s)[, args ])
              *
              * The optional 'args' argument must be an array, if no 'args' argument is provided
              * then we can use the browser's DOM event system, otherwise we trigger handlers manually
              */
          , fire = function (element, type, args) {
              var types = str2arr(type)
                , i, j, l, names, handlers
      
              for (i = types.length; i--;) {
                type = types[i].replace(nameRegex, '')
                if (names = types[i].replace(namespaceRegex, '')) names = str2arr(names, '.')
                if (!names && !args && element[eventSupport]) {
                  fireListener(nativeEvents[type], type, element)
                } else {
                  // non-native event, either because of a namespace, arguments or a non DOM element
                  // iterate over all listeners and manually 'fire'
                  handlers = registry.get(element, type, null, false)
                  args = [false].concat(args)
                  for (j = 0, l = handlers.length; j < l; j++) {
                    if (handlers[j].inNamespaces(names)) {
                      handlers[j].handler.apply(element, args)
                    }
                  }
                }
              }
              return element
            }
      
            /**
              * clone(dstElement, srcElement[, eventType ])
              *
              * TODO: perhaps for consistency we should allow the same flexibility in type specifiers?
              */
          , clone = function (element, from, type) {
              var handlers = registry.get(from, type, null, false)
                , l = handlers.length
                , i = 0
                , args, beanDel
      
              for (; i < l; i++) {
                if (handlers[i].original) {
                  args = [ element, handlers[i].type ]
                  if (beanDel = handlers[i].handler.__beanDel) args.push(beanDel.selector)
                  args.push(handlers[i].original)
                  on.apply(null, args)
                }
              }
              return element
            }
      
          , bean = {
                'on'                : on
              , 'add'               : add
              , 'one'               : one
              , 'off'               : off
              , 'remove'            : off
              , 'clone'             : clone
              , 'fire'              : fire
              , 'Event'             : Event
              , 'setSelectorEngine' : setSelectorEngine
              , 'noConflict'        : function () {
                  context[name] = old
                  return this
                }
            }
      
        // for IE, clean up on unload to avoid leaks
        if (win.attachEvent) {
          var cleanup = function () {
            var i, entries = registry.entries()
            for (i in entries) {
              if (entries[i].type && entries[i].type !== 'unload') off(entries[i].element, entries[i].type)
            }
            win.detachEvent('onunload', cleanup)
            win.CollectGarbage && win.CollectGarbage()
          }
          win.attachEvent('onunload', cleanup)
        }
      
        // initialize selector engine to internal default (qSA or throw Error)
        setSelectorEngine()
      
        return bean
      });
      
    },
    'src/ender': function (module, exports, require, global) {
      !function ($) {
        var b = require('bean')
      
          , integrate = function (method, type, method2) {
              var _args = type ? [type] : []
              return function () {
                for (var i = 0, l = this.length; i < l; i++) {
                  if (!arguments.length && method == 'on' && type) method = 'fire'
                  b[method].apply(this, [this[i]].concat(_args, Array.prototype.slice.call(arguments, 0)))
                }
                return this
              }
            }
      
          , add   = integrate('add')
          , on    = integrate('on')
          , one   = integrate('one')
          , off   = integrate('off')
          , fire  = integrate('fire')
          , clone = integrate('clone')
      
          , hover = function (enter, leave, i) { // i for internal
              for (i = this.length; i--;) {
                b['on'].call(this, this[i], 'mouseenter', enter)
                b['on'].call(this, this[i], 'mouseleave', leave)
              }
              return this
            }
      
          , methods = {
                'on'             : on
              , 'addListener'    : on
              , 'bind'           : on
              , 'listen'         : on
              , 'delegate'       : add // jQuery compat, same arg order as add()
      
              , 'one'            : one
      
              , 'off'            : off
              , 'unbind'         : off
              , 'unlisten'       : off
              , 'removeListener' : off
              , 'undelegate'     : off
      
              , 'emit'           : fire
              , 'trigger'        : fire
      
              , 'cloneEvents'    : clone
      
              , 'hover'          : hover
            }
      
          , shortcuts =
               ('blur change click dblclick error focus focusin focusout keydown keypress '
              + 'keyup load mousedown mouseenter mouseleave mouseout mouseover mouseup '
              + 'mousemove resize scroll select submit unload').split(' ')
      
        for (var i = shortcuts.length; i--;) {
          methods[shortcuts[i]] = integrate('on', shortcuts[i])
        }
      
        b['setSelectorEngine']($)
      
        $.ender(methods, true)
      }(ender);
    }
  }, 'bean');

  Module.createPackage('reqwest', {
    'reqwest': function (module, exports, require, global) {
      /*!
        * Reqwest! A general purpose XHR connection manager
        * license MIT (c) Dustin Diaz 2014
        * https://github.com/ded/reqwest
        */
      
      !function (name, context, definition) {
        if (typeof module != 'undefined' && module.exports) module.exports = definition()
        else if (typeof define == 'function' && define.amd) define(definition)
        else context[name] = definition()
      }('reqwest', this, function () {
      
        var win = window
          , doc = document
          , httpsRe = /^http/
          , protocolRe = /(^\w+):\/\//
          , twoHundo = /^(20\d|1223)$/ //http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
          , byTag = 'getElementsByTagName'
          , readyState = 'readyState'
          , contentType = 'Content-Type'
          , requestedWith = 'X-Requested-With'
          , head = doc[byTag]('head')[0]
          , uniqid = 0
          , callbackPrefix = 'reqwest_' + (+new Date())
          , lastValue // data stored by the most recent JSONP callback
          , xmlHttpRequest = 'XMLHttpRequest'
          , xDomainRequest = 'XDomainRequest'
          , noop = function () {}
      
          , isArray = typeof Array.isArray == 'function'
              ? Array.isArray
              : function (a) {
                  return a instanceof Array
                }
      
          , defaultHeaders = {
                'contentType': 'application/x-www-form-urlencoded'
              , 'requestedWith': xmlHttpRequest
              , 'accept': {
                    '*':  'text/javascript, text/html, application/xml, text/xml, */*'
                  , 'xml':  'application/xml, text/xml'
                  , 'html': 'text/html'
                  , 'text': 'text/plain'
                  , 'json': 'application/json, text/javascript'
                  , 'js':   'application/javascript, text/javascript'
                }
            }
      
          , xhr = function(o) {
              // is it x-domain
              if (o['crossOrigin'] === true) {
                var xhr = win[xmlHttpRequest] ? new XMLHttpRequest() : null
                if (xhr && 'withCredentials' in xhr) {
                  return xhr
                } else if (win[xDomainRequest]) {
                  return new XDomainRequest()
                } else {
                  throw new Error('Browser does not support cross-origin requests')
                }
              } else if (win[xmlHttpRequest]) {
                return new XMLHttpRequest()
              } else {
                return new ActiveXObject('Microsoft.XMLHTTP')
              }
            }
          , globalSetupOptions = {
              dataFilter: function (data) {
                return data
              }
            }
      
        function succeed(r) {
          var protocol = protocolRe.exec(r.url);
          protocol = (protocol && protocol[1]) || window.location.protocol;
          return httpsRe.test(protocol) ? twoHundo.test(r.request.status) : !!r.request.response;
        }
      
        function handleReadyState(r, success, error) {
          return function () {
            // use _aborted to mitigate against IE err c00c023f
            // (can't read props on aborted request objects)
            if (r._aborted) return error(r.request)
            if (r._timedOut) return error(r.request, 'Request is aborted: timeout')
            if (r.request && r.request[readyState] == 4) {
              r.request.onreadystatechange = noop
              if (succeed(r)) success(r.request)
              else
                error(r.request)
            }
          }
        }
      
        function setHeaders(http, o) {
          var headers = o['headers'] || {}
            , h
      
          headers['Accept'] = headers['Accept']
            || defaultHeaders['accept'][o['type']]
            || defaultHeaders['accept']['*']
      
          var isAFormData = typeof FormData === 'function' && (o['data'] instanceof FormData);
          // breaks cross-origin requests with legacy browsers
          if (!o['crossOrigin'] && !headers[requestedWith]) headers[requestedWith] = defaultHeaders['requestedWith']
          if (!headers[contentType] && !isAFormData) headers[contentType] = o['contentType'] || defaultHeaders['contentType']
          for (h in headers)
            headers.hasOwnProperty(h) && 'setRequestHeader' in http && http.setRequestHeader(h, headers[h])
        }
      
        function setCredentials(http, o) {
          if (typeof o['withCredentials'] !== 'undefined' && typeof http.withCredentials !== 'undefined') {
            http.withCredentials = !!o['withCredentials']
          }
        }
      
        function generalCallback(data) {
          lastValue = data
        }
      
        function urlappend (url, s) {
          return url + (/\?/.test(url) ? '&' : '?') + s
        }
      
        function handleJsonp(o, fn, err, url) {
          var reqId = uniqid++
            , cbkey = o['jsonpCallback'] || 'callback' // the 'callback' key
            , cbval = o['jsonpCallbackName'] || reqwest.getcallbackPrefix(reqId)
            , cbreg = new RegExp('((^|\\?|&)' + cbkey + ')=([^&]+)')
            , match = url.match(cbreg)
            , script = doc.createElement('script')
            , loaded = 0
            , isIE10 = navigator.userAgent.indexOf('MSIE 10.0') !== -1
      
          if (match) {
            if (match[3] === '?') {
              url = url.replace(cbreg, '$1=' + cbval) // wildcard callback func name
            } else {
              cbval = match[3] // provided callback func name
            }
          } else {
            url = urlappend(url, cbkey + '=' + cbval) // no callback details, add 'em
          }
      
          win[cbval] = generalCallback
      
          script.type = 'text/javascript'
          script.src = url
          script.async = true
          if (typeof script.onreadystatechange !== 'undefined' && !isIE10) {
            // need this for IE due to out-of-order onreadystatechange(), binding script
            // execution to an event listener gives us control over when the script
            // is executed. See http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
            script.htmlFor = script.id = '_reqwest_' + reqId
          }
      
          script.onload = script.onreadystatechange = function () {
            if ((script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded') || loaded) {
              return false
            }
            script.onload = script.onreadystatechange = null
            script.onclick && script.onclick()
            // Call the user callback with the last value stored and clean up values and scripts.
            fn(lastValue)
            lastValue = undefined
            head.removeChild(script)
            loaded = 1
          }
      
          // Add the script to the DOM head
          head.appendChild(script)
      
          // Enable JSONP timeout
          return {
            abort: function () {
              script.onload = script.onreadystatechange = null
              err({}, 'Request is aborted: timeout', {})
              lastValue = undefined
              head.removeChild(script)
              loaded = 1
            }
          }
        }
      
        function getRequest(fn, err) {
          var o = this.o
            , method = (o['method'] || 'GET').toUpperCase()
            , url = typeof o === 'string' ? o : o['url']
            // convert non-string objects to query-string form unless o['processData'] is false
            , data = (o['processData'] !== false && o['data'] && typeof o['data'] !== 'string')
              ? reqwest.toQueryString(o['data'])
              : (o['data'] || null)
            , http
            , sendWait = false
      
          // if we're working on a GET request and we have data then we should append
          // query string to end of URL and not post data
          if ((o['type'] == 'jsonp' || method == 'GET') && data) {
            url = urlappend(url, data)
            data = null
          }
      
          if (o['type'] == 'jsonp') return handleJsonp(o, fn, err, url)
      
          // get the xhr from the factory if passed
          // if the factory returns null, fall-back to ours
          http = (o.xhr && o.xhr(o)) || xhr(o)
      
          http.open(method, url, o['async'] === false ? false : true)
          setHeaders(http, o)
          setCredentials(http, o)
          if (win[xDomainRequest] && http instanceof win[xDomainRequest]) {
              http.onload = fn
              http.onerror = err
              // NOTE: see
              // http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/30ef3add-767c-4436-b8a9-f1ca19b4812e
              http.onprogress = function() {}
              sendWait = true
          } else {
            http.onreadystatechange = handleReadyState(this, fn, err)
          }
          o['before'] && o['before'](http)
          if (sendWait) {
            setTimeout(function () {
              http.send(data)
            }, 200)
          } else {
            http.send(data)
          }
          return http
        }
      
        function Reqwest(o, fn) {
          this.o = o
          this.fn = fn
      
          init.apply(this, arguments)
        }
      
        function setType(header) {
          // json, javascript, text/plain, text/html, xml
          if (header.match('json')) return 'json'
          if (header.match('javascript')) return 'js'
          if (header.match('text')) return 'html'
          if (header.match('xml')) return 'xml'
        }
      
        function init(o, fn) {
      
          this.url = typeof o == 'string' ? o : o['url']
          this.timeout = null
      
          // whether request has been fulfilled for purpose
          // of tracking the Promises
          this._fulfilled = false
          // success handlers
          this._successHandler = function(){}
          this._fulfillmentHandlers = []
          // error handlers
          this._errorHandlers = []
          // complete (both success and fail) handlers
          this._completeHandlers = []
          this._erred = false
          this._responseArgs = {}
      
          var self = this
      
          fn = fn || function () {}
      
          if (o['timeout']) {
            this.timeout = setTimeout(function () {
              timedOut()
            }, o['timeout'])
          }
      
          if (o['success']) {
            this._successHandler = function () {
              o['success'].apply(o, arguments)
            }
          }
      
          if (o['error']) {
            this._errorHandlers.push(function () {
              o['error'].apply(o, arguments)
            })
          }
      
          if (o['complete']) {
            this._completeHandlers.push(function () {
              o['complete'].apply(o, arguments)
            })
          }
      
          function complete (resp) {
            o['timeout'] && clearTimeout(self.timeout)
            self.timeout = null
            while (self._completeHandlers.length > 0) {
              self._completeHandlers.shift()(resp)
            }
          }
      
          function success (resp) {
            var type = o['type'] || resp && setType(resp.getResponseHeader('Content-Type')) // resp can be undefined in IE
            resp = (type !== 'jsonp') ? self.request : resp
            // use global data filter on response text
            var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type)
              , r = filteredResponse
            try {
              resp.responseText = r
            } catch (e) {
              // can't assign this in IE<=8, just ignore
            }
            if (r) {
              switch (type) {
              case 'json':
                try {
                  resp = win.JSON ? win.JSON.parse(r) : eval('(' + r + ')')
                } catch (err) {
                  return error(resp, 'Could not parse JSON in response', err)
                }
                break
              case 'js':
                resp = eval(r)
                break
              case 'html':
                resp = r
                break
              case 'xml':
                resp = resp.responseXML
                    && resp.responseXML.parseError // IE trololo
                    && resp.responseXML.parseError.errorCode
                    && resp.responseXML.parseError.reason
                  ? null
                  : resp.responseXML
                break
              }
            }
      
            self._responseArgs.resp = resp
            self._fulfilled = true
            fn(resp)
            self._successHandler(resp)
            while (self._fulfillmentHandlers.length > 0) {
              resp = self._fulfillmentHandlers.shift()(resp)
            }
      
            complete(resp)
          }
      
          function timedOut() {
            self._timedOut = true
            self.request.abort()      
          }
      
          function error(resp, msg, t) {
            resp = self.request
            self._responseArgs.resp = resp
            self._responseArgs.msg = msg
            self._responseArgs.t = t
            self._erred = true
            while (self._errorHandlers.length > 0) {
              self._errorHandlers.shift()(resp, msg, t)
            }
            complete(resp)
          }
      
          this.request = getRequest.call(this, success, error)
        }
      
        Reqwest.prototype = {
          abort: function () {
            this._aborted = true
            this.request.abort()
          }
      
        , retry: function () {
            init.call(this, this.o, this.fn)
          }
      
          /**
           * Small deviation from the Promises A CommonJs specification
           * http://wiki.commonjs.org/wiki/Promises/A
           */
      
          /**
           * `then` will execute upon successful requests
           */
        , then: function (success, fail) {
            success = success || function () {}
            fail = fail || function () {}
            if (this._fulfilled) {
              this._responseArgs.resp = success(this._responseArgs.resp)
            } else if (this._erred) {
              fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
            } else {
              this._fulfillmentHandlers.push(success)
              this._errorHandlers.push(fail)
            }
            return this
          }
      
          /**
           * `always` will execute whether the request succeeds or fails
           */
        , always: function (fn) {
            if (this._fulfilled || this._erred) {
              fn(this._responseArgs.resp)
            } else {
              this._completeHandlers.push(fn)
            }
            return this
          }
      
          /**
           * `fail` will execute when the request fails
           */
        , fail: function (fn) {
            if (this._erred) {
              fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
            } else {
              this._errorHandlers.push(fn)
            }
            return this
          }
        , 'catch': function (fn) {
            return this.fail(fn)
          }
        }
      
        function reqwest(o, fn) {
          return new Reqwest(o, fn)
        }
      
        // normalize newline variants according to spec -> CRLF
        function normalize(s) {
          return s ? s.replace(/\r?\n/g, '\r\n') : ''
        }
      
        function serial(el, cb) {
          var n = el.name
            , t = el.tagName.toLowerCase()
            , optCb = function (o) {
                // IE gives value="" even where there is no value attribute
                // 'specified' ref: http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-862529273
                if (o && !o['disabled'])
                  cb(n, normalize(o['attributes']['value'] && o['attributes']['value']['specified'] ? o['value'] : o['text']))
              }
            , ch, ra, val, i
      
          // don't serialize elements that are disabled or without a name
          if (el.disabled || !n) return
      
          switch (t) {
          case 'input':
            if (!/reset|button|image|file/i.test(el.type)) {
              ch = /checkbox/i.test(el.type)
              ra = /radio/i.test(el.type)
              val = el.value
              // WebKit gives us "" instead of "on" if a checkbox has no value, so correct it here
              ;(!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on' : val))
            }
            break
          case 'textarea':
            cb(n, normalize(el.value))
            break
          case 'select':
            if (el.type.toLowerCase() === 'select-one') {
              optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null)
            } else {
              for (i = 0; el.length && i < el.length; i++) {
                el.options[i].selected && optCb(el.options[i])
              }
            }
            break
          }
        }
      
        // collect up all form elements found from the passed argument elements all
        // the way down to child elements; pass a '<form>' or form fields.
        // called with 'this'=callback to use for serial() on each element
        function eachFormElement() {
          var cb = this
            , e, i
            , serializeSubtags = function (e, tags) {
                var i, j, fa
                for (i = 0; i < tags.length; i++) {
                  fa = e[byTag](tags[i])
                  for (j = 0; j < fa.length; j++) serial(fa[j], cb)
                }
              }
      
          for (i = 0; i < arguments.length; i++) {
            e = arguments[i]
            if (/input|select|textarea/i.test(e.tagName)) serial(e, cb)
            serializeSubtags(e, [ 'input', 'select', 'textarea' ])
          }
        }
      
        // standard query string style serialization
        function serializeQueryString() {
          return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
        }
      
        // { 'name': 'value', ... } style serialization
        function serializeHash() {
          var hash = {}
          eachFormElement.apply(function (name, value) {
            if (name in hash) {
              hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]])
              hash[name].push(value)
            } else hash[name] = value
          }, arguments)
          return hash
        }
      
        // [ { name: 'name', value: 'value' }, ... ] style serialization
        reqwest.serializeArray = function () {
          var arr = []
          eachFormElement.apply(function (name, value) {
            arr.push({name: name, value: value})
          }, arguments)
          return arr
        }
      
        reqwest.serialize = function () {
          if (arguments.length === 0) return ''
          var opt, fn
            , args = Array.prototype.slice.call(arguments, 0)
      
          opt = args.pop()
          opt && opt.nodeType && args.push(opt) && (opt = null)
          opt && (opt = opt.type)
      
          if (opt == 'map') fn = serializeHash
          else if (opt == 'array') fn = reqwest.serializeArray
          else fn = serializeQueryString
      
          return fn.apply(null, args)
        }
      
        reqwest.toQueryString = function (o, trad) {
          var prefix, i
            , traditional = trad || false
            , s = []
            , enc = encodeURIComponent
            , add = function (key, value) {
                // If value is a function, invoke it and return its value
                value = ('function' === typeof value) ? value() : (value == null ? '' : value)
                s[s.length] = enc(key) + '=' + enc(value)
              }
          // If an array was passed in, assume that it is an array of form elements.
          if (isArray(o)) {
            for (i = 0; o && i < o.length; i++) add(o[i]['name'], o[i]['value'])
          } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for (prefix in o) {
              if (o.hasOwnProperty(prefix)) buildParams(prefix, o[prefix], traditional, add)
            }
          }
      
          // spaces should be + according to spec
          return s.join('&').replace(/%20/g, '+')
        }
      
        function buildParams(prefix, obj, traditional, add) {
          var name, i, v
            , rbracket = /\[\]$/
      
          if (isArray(obj)) {
            // Serialize array item.
            for (i = 0; obj && i < obj.length; i++) {
              v = obj[i]
              if (traditional || rbracket.test(prefix)) {
                // Treat each array item as a scalar.
                add(prefix, v)
              } else {
                buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add)
              }
            }
          } else if (obj && obj.toString() === '[object Object]') {
            // Serialize object item.
            for (name in obj) {
              buildParams(prefix + '[' + name + ']', obj[name], traditional, add)
            }
      
          } else {
            // Serialize scalar item.
            add(prefix, obj)
          }
        }
      
        reqwest.getcallbackPrefix = function () {
          return callbackPrefix
        }
      
        // jQuery and Zepto compatibility, differences can be remapped here so you can call
        // .ajax.compat(options, callback)
        reqwest.compat = function (o, fn) {
          if (o) {
            o['type'] && (o['method'] = o['type']) && delete o['type']
            o['dataType'] && (o['type'] = o['dataType'])
            o['jsonpCallback'] && (o['jsonpCallbackName'] = o['jsonpCallback']) && delete o['jsonpCallback']
            o['jsonp'] && (o['jsonpCallback'] = o['jsonp'])
          }
          return new Reqwest(o, fn)
        }
      
        reqwest.ajaxSetup = function (options) {
          options = options || {}
          for (var k in options) {
            globalSetupOptions[k] = options[k]
          }
        }
      
        return reqwest
      });
      
    },
    'src/ender': function (module, exports, require, global) {
      !function ($) {
        var r = require('reqwest')
          , integrate = function (method) {
              return function () {
                var args = Array.prototype.slice.call(arguments, 0)
                  , i = (this && this.length) || 0
                while (i--) args.unshift(this[i])
                return r[method].apply(null, args)
              }
            }
          , s = integrate('serialize')
          , sa = integrate('serializeArray')
      
        $.ender({
            ajax: r
          , serialize: r.serialize
          , serializeArray: r.serializeArray
          , toQueryString: r.toQueryString
          , ajaxSetup: r.ajaxSetup
        })
      
        $.ender({
            serialize: s
          , serializeArray: sa
        }, true)
      }(ender);
      
    }
  }, 'reqwest');

  Module.createPackage('traversty', {
    'traversty': function (module, exports, require, global) {
      /***************************************************************
        * Traversty: A DOM collection management and traversal utility
        * (c) Rod Vagg (@rvagg) 2012
        * https://github.com/rvagg/traversty
        * License: MIT
        */
      
      (function (name, context, definition) {
        if (typeof module != 'undefined' && module.exports)
          module.exports = definition()
        else if (typeof define == 'function' && define.amd)
          define(definition)
        else
          context[name] = definition()
      })('traversty', this, function () {
      
        var context = this
          , old = context.traversty
          , doc = window.document
          , html = doc.documentElement
          , toString = Object.prototype.toString
          , Ap = Array.prototype
          , slice = Ap.slice
            // feature test to find native matchesSelector()
          , matchesSelector = (function (el, pfx, name, i, ms) {
              while (i < pfx.length)
                if (el[ms = pfx[i++] + name])
                  return ms
            }(html, [ 'msM', 'webkitM', 'mozM', 'oM', 'm' ], 'atchesSelector', 0))
      
          , Kfalse = function () { return false }
      
          , isNumber = function (o) {
              return toString.call(o) === '[object Number]'
            }
      
          , isString = function (o) {
              return toString.call(o) === '[object String]'
            }
      
          , isFunction = function (o) {
              return toString.call(o) === '[object Function]'
            }
      
          , isUndefined = function (o) {
              return o === void 0
            }
      
          , isElement = function (o) {
              return o && o.nodeType === 1
            }
      
            // figure out which argument, if any, is our 'index'
          , getIndex = function (selector, index) {
              return isUndefined(selector) && !isNumber(index) ? 0 :
                isNumber(selector) ? selector : isNumber(index) ? index : null
            }
      
            // figure out which argument, if any, is our 'selector'
          , getSelector = function (selector) {
              return isString(selector) ? selector : '*'
            }
      
          , nativeSelectorFind = function (selector, el) {
              return slice.call(el.querySelectorAll(selector), 0)
            }
      
          , nativeSelectorMatches = function (selector, el) {
              return selector === '*' || el[matchesSelector](selector)
            }
      
          , selectorFind = nativeSelectorFind
      
          , selectorMatches = nativeSelectorMatches
      
            // used in the case where our selector engine does out-of-order element returns for
            // grouped selectors, e.g. '.class, tag', we need our elements in document-order
            // so we do it ourselves if need be
          , createUnorderedEngineSelectorFind = function(engineSelect, selectorMatches) {
              return function (selector, el) {
                if (/,/.test(selector)) {
                  var ret = [], i = -1, els = el.getElementsByTagName('*')
                  while (++i < els.length)
                    if (isElement(els[i]) && selectorMatches(selector, els[i]))
                      ret.push(els[i])
                  return ret
                }
                return engineSelect(selector, el)
              }
            }
      
            // is 'element' underneath 'container' somewhere
          , isAncestor = 'compareDocumentPosition' in html
              ? function (element, container) {
                  return (container.compareDocumentPosition(element) & 16) == 16
                }
              : 'contains' in html
                ? function (element, container) {
                    container = container.nodeType === 9 || container == window ? html : container
                    return container !== element && container.contains(element)
                  }
                : function (element, container) { // old smelly browser
                    while (element = element.parentNode)
                      if (element === container)
                        return 1
                    return 0
                  }
      
            // return an array containing only unique elements
          , unique = function (ar) {
              var a = [], i = -1, j, has
              while (++i < ar.length) {
                j = -1
                has = false
                while (++j < a.length) {
                  if (a[j] === ar[i]) {
                    has = true
                    break
                  }
                }
                if (!has)
                  a.push(ar[i])
              }
              return a
            }
      
            // for each element of 'els' execute 'fn' to get an array of elements to collect
          , collect = function (els, fn) {
              var ret = [], res, i = 0, j, l = els.length, l2
              while (i < l) {
                j = 0
                l2 = (res = fn(els[i], i++)).length
                while (j < l2)
                  ret.push(res[j++])
              }
              return ret
            }
      
           // generic DOM navigator to move multiple elements around the DOM
         , move = function (els, method, selector, index, filterFn) {
              index = getIndex(selector, index)
              selector = getSelector(selector)
              return collect(els
                , function (el, elind) {
                    var i = index || 0, ret = []
                    if (!filterFn)
                      el = el[method]
                    while (el && (index === null || i >= 0)) {
                      // ignore non-elements, only consider selector-matching elements
                      // handle both the index and no-index (selector-only) cases
                      if (isElement(el)
                          && (!filterFn || filterFn === true || filterFn(el, elind))
                          && selectorMatches(selector, el)
                          && (index === null || i-- === 0)) {
                        // this concat vs push is to make sure we add elements to the result array
                        // in reverse order when doing a previous(selector) and up(selector)
                        index === null
                            && method != 'nextSibling'
                            && method != 'parentNode'
                          ? ret.unshift(el)
                          : ret.push(el)
                      }
                      el = el[method]
                    }
                    return ret
                  }
              )
            }
      
            // given an index & length, return a 'fixed' index, fixes non-numbers & neative indexes
          , eqIndex = function (length, index, def) {
              if (index < 0)
                index = length + index
              if (index < 0 || index >= length)
                return null
              return !index && index !== 0 ? def : index
            }
      
            // collect elements of an array that match a filter function
          , filter = function (els, fn) {
              var arr = [], i = 0, l = els.length
              for (; i < l; i++)
                if (fn(els[i], i))
                  arr.push(els[i])
              return arr
            }
      
            // create a filter function, for use by filter(), is() & not()
            // allows the argument to be an element, a function or a selector
          , filterFn = function (slfn) {
              var to
              return isElement(slfn)
                ? function (el) { return el === slfn }
                : (to = typeof slfn) == 'function'
                  ? function (el, i) { return slfn.call(el, i) }
                  : to == 'string' && slfn.length
                    ? function (el) { return selectorMatches(slfn, el) }
                    : Kfalse
            }
      
            // fn = !fn
          , inv = function (fn) {
              return function () {
                return !fn.apply(this, arguments)
              }
            }
      
          , traversty = (function () {
              function T(els) {
                this.length = 0
                if (els) {
                  els = unique(!els.nodeType && !isUndefined(els.length) ? els : [ els ])
                  var i = this.length = els.length
                  while (i--)
                    this[i] = els[i]
                }
              }
      
              T.prototype = {
                  down: function (selector, index) {
                    index = getIndex(selector, index)
                    selector = getSelector(selector)
                    return traversty(collect(this
                      , function (el) {
                          var f = selectorFind(selector, el)
                          return index === null ? f : ([ f[index] ] || [])
                        }
                      ))
                  }
      
                , up: function (selector, index) {
                    return traversty(move(this, 'parentNode', selector, index))
                  }
      
                , parents: function () {
                    return T.prototype.up.apply(this, arguments.length ? arguments : [ '*' ])
                  }
      
                , closest: function (selector, index) {
                    if (isNumber(selector)) {
                      index = selector
                      selector = '*'
                    } else if (!isString(selector)) {
                      return traversty([])
                    } else if (!isNumber(index)) {
                      index = 0
                    }
                    return traversty(move(this, 'parentNode', selector, index, true))
                  }
      
                , previous: function (selector, index) {
                    return traversty(move(this, 'previousSibling', selector, index))
                  }
      
                , next: function (selector, index) {
                    return traversty(move(this, 'nextSibling', selector, index))
                  }
      
                , siblings: function (selector, index) {
                    var self = this
                      , arr = slice.call(this, 0)
                      , i = 0, l = arr.length
      
                    for (; i < l; i++) {
                      arr[i] = arr[i].parentNode.firstChild
                      while (!isElement(arr[i]))
                        arr[i] = arr[i].nextSibling
                    }
      
                    if (isUndefined(selector))
                      selector = '*'
      
                    return traversty(move(arr, 'nextSibling', selector || '*', index
                          , function (el, i) { return el !== self[i] } // filter
                        ))
                  }
      
                , children: function (selector, index) {
                    return traversty(move(T.prototype.down.call(this), 'nextSibling', selector || '*', index, true))
                  }
      
                , first: function () {
                    return T.prototype.eq.call(this, 0)
                  }
      
                , last: function () {
                    return T.prototype.eq.call(this, -1)
                  }
      
                , eq: function (index) {
                    return traversty(this.get(index))
                  }
      
                , get: function (index) {
                    return this[eqIndex(this.length, index, 0)]
                  }
      
                  // a crazy man wrote this, don't try to understand it, see the tests
                , slice: function (start, end) {
                    var e = end, l = this.length, arr = []
                    start = eqIndex(l, Math.max(-this.length, start), 0)
                    e = eqIndex(end < 0 ? l : l + 1, end, l)
                    end = e === null || e > l ? end < 0 ? 0 : l : e
                    while (start !== null && start < end)
                      arr.push(this[start++])
                    return traversty(arr)
                  }
      
                , filter: function (slfn) {
                    return traversty(filter(this, filterFn(slfn)))
                  }
      
                , not: function (slfn) {
                    return traversty(filter(this, inv(filterFn(slfn))))
                  }
      
                  // similar to filter() but cares about descendent elements
                , has: function (slel) {
                    return traversty(filter(
                        this
                      , isElement(slel)
                          ? function (el) { return isAncestor(slel, el) }
                          : typeof slel == 'string' && slel.length
                            ? function (el) { return selectorFind(slel, el).length } //TODO: performance
                            : Kfalse
                    ))
                  }
      
                  // same as filter() but return a boolean so quick-return after first successful find
                , is: function (slfn) {
                    var i = 0, l = this.length
                      , fn = filterFn(slfn)
                    for (; i < l; i++)
                      if (fn(this[i], i))
                        return true
                    return false
                  }
      
                , toArray: function () { return Ap.slice.call(this) }
      
                , size: function () { return this.length }
      
                , each: function (fn, ctx) {
                    var i = 0, l = this.length
                    for (; i < l; i++)
                      fn.call(ctx || this[i], this[i], i, this)
                    return this
                  }
      
                  // quack like a duck (Array)
                , push: Ap.push
                , sort: Ap.sort
                , splice: Ap.splice
              }
      
              T.prototype.prev = T.prototype.previous
      
              function t(els) {
                return new T(isString(els) ? selectorFind(els, doc) : els)
              }
      
              // extend traversty functionality with custom methods
              t.aug = function (methods) {
                var key, method
                for (key in methods) {
                  method = methods[key]
                  if (typeof method == 'function')
                    T.prototype[key] = method
                }
              }
      
      
              t.setSelectorEngine = function (s) {
                // feature testing the selector engine like a boss
                var ss, r, a, _selectorMatches, _selectorFind
                  , e = doc.createElement('p')
                  , select = s.select || s.sel || s
      
                e.innerHTML = '<a/><i/><b/>'
                a = e.firstChild
                try {
                  // YO! I HEARD YOU LIKED NESTED TERNARY OPERATORS SO I COOKED SOME UP FOR YOU!
                  // (one day I might loop this...)
      
                  // check to see how we do a matchesSelector
                  _selectorMatches = isFunction(s.matching)
                    ? function (selector, el) { return s.matching([el], selector).length > 0 }
                    : isFunction(s.is)
                      ? function (selector, el) { return s.is(el, selector) }
                      : isFunction(s.matchesSelector)
                        ? function (selector, el) { return s.matchesSelector(el, selector) }
                        : isFunction(s.match)
                          ? function (selector, el) { return s.match(el, selector) }
                          : isFunction(s.matches)
                            ? function (selector, el) { return s.matches(el, selector) }
                            : null
      
                  if (!_selectorMatches) {
                    // perhaps it's an selector(x).is(y) type selector?
                    ss = s('a', e)
                    _selectorMatches = isFunction(ss._is)
                      ? function (selector, el) { return s(el)._is(selector) } // original .is(), replaced by Ender bridge
                      : isFunction(ss.matching)
                        ? function (selector, el) { return s(el).matching(selector).length > 0 }
                        : isFunction(ss.is) && !ss.is.__ignore
                          ? function (selector, el) { return s(el).is(selector) }
                            : isFunction(ss.matchesSelector)
                              ? function (selector, el) { return s(el).matchesSelector(selector) }
                              : isFunction(ss.match)
                                ? function (selector, el) { return s(el).match(selector) }
                                : isFunction(ss.matches)
                                  ? function (selector, el) { return s(el).matches(selector) }
                                  : null
                  }
      
                  if (!_selectorMatches)
                      throw new Error('Traversty: couldn\'t find selector engine\'s `matchesSelector`')
      
                  // verify that we have a working `matchesSelector`
                  if (_selectorMatches('x,y', e) || !_selectorMatches('a,p', e))
                      throw new Error('Traversty: couldn\'t make selector engine\'s `matchesSelector` work')
      
                  // basic select
                  if ((r = select('b,a', e)).length !== 2)
                    throw new Error('Traversty: don\'t know how to use this selector engine')
      
                  // check to see if the selector engine has given us the results in document-order
                  // and if not, work around it
                  _selectorFind = r[0] === a ? select : createUnorderedEngineSelectorFind(select, _selectorMatches)
      
                  // have we done enough to get a working `selectorFind`?
                  if ((r = _selectorFind('b,a', e)).length !== 2 || r[0] !== a)
                    throw new Error('Traversty: couldn\'t make selector engine work')
      
                  selectorMatches = _selectorMatches
                  selectorFind = _selectorFind
                } catch (ex) {
                  throw isString(ex)
                    ? ex
                    : new Error('Traversty: error while figuring out how the selector engine works: ' + (ex.message || ex))
                } finally {
                  e = null
                }
      
                return t
              }
      
              t.noConflict = function () {
                context.traversty = old
                return this
              }
      
              return t
            }())
       
        return traversty
      });
    },
    'ender_bridge': function (module, exports, require, global) {
      /*global ender:true*/
      
      (function ($) {
        var t = require('traversty')
          , integrated = false
          , integrate = function (meth) {
              // this crazyness is for lazy initialisation because we can't be guaranteed
              // that a selector engine has been installed *before* traversty in an ender build
              var fn = function (self, selector, index) {
                  if (!integrated) {
                    try {
                      t.setSelectorEngine($)
                    } catch (ex) { } // ignore exception, we may have an ender build with no selector engine
                    integrated = true
                  }
                  fn = meth == 'is'
                    ? function (self, slfn) {
                        return t(self)[meth](slfn) // boolean
                      }
                    : function (self, selector, index) {
                        return $(t(self)[meth](selector, index)) // collection
                      }
                  return fn(self, selector, index)
                }
              return function (selector, index) { return fn(this, selector, index) }
            }
          , methods = 'up down next previous prev parents closest siblings children first last eq slice filter not is has'.split(' ')
          , b = {}, i = methods.length
      
        // does this build have an .is()? if so, shift it to _is() for traversty to use and
        // allow us to integrate a new is(), wrapped around it
        if ($.fn.is) $.fn._is = $.fn.is
        while (--i >= 0) b[methods[i]] = integrate(methods[i])
        $.ender(b, true)
        $.fn.is.__ignore = true
      }(ender))
    }
  }, 'traversty');

  Module.createPackage('timeout', {
    'lib/timeout': function (module, exports, require, global) {
      var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
      !(function(timeout) {
        var _maxId, _timeouts;
        _timeouts = {};
        _maxId = 0;
        return timeout.timeout = function(name, delay, fn) {
          var args, data, resetTimeout;
          if (typeof name === 'string') {
            args = Array.prototype.slice.call(arguments, 3);
          } else {
            fn = delay;
            delay = name;
            name = "_timeout__" + (++_maxId);
          }
          if (name in _timeouts) {
            data = _timeouts[name];
            clearTimeout(data.id);
          } else {
            _timeouts[name] = data = {};
          }
          if (fn) {
            resetTimeout = function() {
              return data.id = setTimeout(data.fn, delay);
            };
            data.fn = __bind(function() {
              if (fn.apply(this, args) === true) {
                return resetTimeout();
              } else {
                return delete _timeouts[name];
              }
            }, this);
            resetTimeout();
            return name;
          } else {
            if (delay != null) {
              return data.fn();
            } else if (name in _timeouts) {
              return delete _timeouts[name];
            } else {
              return false;
            }
          }
        };
      })(typeof exports !== "undefined" && exports !== null ? exports : (this['timeout'] = {}));
    },
    'lib/ender': function (module, exports, require, global) {
      !(function($) {
        var timeout;
        timeout = require('timeout').timeout;
        $.ender({
          timeout: timeout
        });
        return $.ender({
          timeout: function() {
            timeout.apply(this, arguments);
            return this;
          }
        }, true);
      })(ender);
    }
  }, 'lib/timeout');

  Module.createPackage('verge', {
    'verge': function (module, exports, require, global) {
      /*!      
       * verge 1.9.1+201402130803      
       * https://github.com/ryanve/verge      
       * MIT License 2013 Ryan Van Etten      
       */      
            
      (function(root, name, make) {      
        if (typeof module != 'undefined' && module['exports']) module['exports'] = make();      
        else root[name] = make();      
      }(this, 'verge', function() {      
            
        var xports = {}      
          , win = typeof window != 'undefined' && window      
          , doc = typeof document != 'undefined' && document      
          , docElem = doc && doc.documentElement      
          , matchMedia = win['matchMedia'] || win['msMatchMedia']      
          , mq = matchMedia ? function(q) {      
              return !!matchMedia.call(win, q).matches;      
            } : function() {      
              return false;      
            }      
          , viewportW = xports['viewportW'] = function() {      
              var a = docElem['clientWidth'], b = win['innerWidth'];      
              return a < b ? b : a;      
            }      
          , viewportH = xports['viewportH'] = function() {      
              var a = docElem['clientHeight'], b = win['innerHeight'];      
              return a < b ? b : a;      
            };      
              
        /**       
         * Test if a media query is active. Like Modernizr.mq      
         * @since 1.6.0      
         * @return {boolean}      
         */        
        xports['mq'] = mq;      
            
        /**       
         * Normalized matchMedia      
         * @since 1.6.0      
         * @return {MediaQueryList|Object}      
         */       
        xports['matchMedia'] = matchMedia ? function() {      
          // matchMedia must be binded to window      
          return matchMedia.apply(win, arguments);      
        } : function() {      
          // Gracefully degrade to plain object      
          return {};      
        };      
            
        /**      
         * @since 1.8.0      
         * @return {{width:number, height:number}}      
         */      
        function viewport() {      
          return {'width':viewportW(), 'height':viewportH()};      
        }      
        xports['viewport'] = viewport;      
              
        /**       
         * Cross-browser window.scrollX      
         * @since 1.0.0      
         * @return {number}      
         */      
        xports['scrollX'] = function() {      
          return win.pageXOffset || docElem.scrollLeft;       
        };      
            
        /**       
         * Cross-browser window.scrollY      
         * @since 1.0.0      
         * @return {number}      
         */      
        xports['scrollY'] = function() {      
          return win.pageYOffset || docElem.scrollTop;       
        };      
            
        /**      
         * @param {{top:number, right:number, bottom:number, left:number}} coords      
         * @param {number=} cushion adjustment      
         * @return {Object}      
         */      
        function calibrate(coords, cushion) {      
          var o = {};      
          cushion = +cushion || 0;      
          o['width'] = (o['right'] = coords['right'] + cushion) - (o['left'] = coords['left'] - cushion);      
          o['height'] = (o['bottom'] = coords['bottom'] + cushion) - (o['top'] = coords['top'] - cushion);      
          return o;      
        }      
            
        /**      
         * Cross-browser element.getBoundingClientRect plus optional cushion.      
         * Coords are relative to the top-left corner of the viewport.      
         * @since 1.0.0      
         * @param {Element|Object} el element or stack (uses first item)      
         * @param {number=} cushion +/- pixel adjustment amount      
         * @return {Object|boolean}      
         */      
        function rectangle(el, cushion) {      
          el = el && !el.nodeType ? el[0] : el;      
          if (!el || 1 !== el.nodeType) return false;      
          return calibrate(el.getBoundingClientRect(), cushion);      
        }      
        xports['rectangle'] = rectangle;      
            
        /**      
         * Get the viewport aspect ratio (or the aspect ratio of an object or element)      
         * @since 1.7.0      
         * @param {(Element|Object)=} o optional object with width/height props or methods      
         * @return {number}      
         * @link http://w3.org/TR/css3-mediaqueries/#orientation      
         */      
        function aspect(o) {      
          o = null == o ? viewport() : 1 === o.nodeType ? rectangle(o) : o;      
          var h = o['height'], w = o['width'];      
          h = typeof h == 'function' ? h.call(o) : h;      
          w = typeof w == 'function' ? w.call(o) : w;      
          return w/h;      
        }      
        xports['aspect'] = aspect;      
            
        /**      
         * Test if an element is in the same x-axis section as the viewport.      
         * @since 1.0.0      
         * @param {Element|Object} el      
         * @param {number=} cushion      
         * @return {boolean}      
         */      
        xports['inX'] = function(el, cushion) {      
          var r = rectangle(el, cushion);      
          return !!r && r.right >= 0 && r.left <= viewportW();      
        };      
            
        /**      
         * Test if an element is in the same y-axis section as the viewport.      
         * @since 1.0.0      
         * @param {Element|Object} el      
         * @param {number=} cushion      
         * @return {boolean}      
         */      
        xports['inY'] = function(el, cushion) {      
          var r = rectangle(el, cushion);      
          return !!r && r.bottom >= 0 && r.top <= viewportH();      
        };      
            
        /**      
         * Test if an element is in the viewport.      
         * @since 1.0.0      
         * @param {Element|Object} el      
         * @param {number=} cushion      
         * @return {boolean}      
         */      
        xports['inViewport'] = function(el, cushion) {      
          // Equiv to `inX(el, cushion) && inY(el, cushion)` but just manually do both       
          // to avoid calling rectangle() twice. It gzips just as small like this.      
          var r = rectangle(el, cushion);      
          return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= viewportH() && r.left <= viewportW();      
        };      
            
        return xports;      
      }));
    },
    'src/ender': function (module, exports, require, global) {
      /* integrate with ender.jit.su */      
      (function($, name) {      
        $ && $.ender(require(name));      
      }(this.ender, 'verge'));
    }
  }, 'verge');

  Module.createPackage('valentine', {
    'valentine': function (module, exports, require, global) {
      /*!
        * Valentine: JavaScript's functional Sister
        * (c) Dustin Diaz 2014
        * https://github.com/ded/valentine License MIT
        */
      
      (function (name, context, definition) {
        if (typeof module != 'undefined') module.exports = definition()
        else if (typeof define == 'function') define(definition)
        else context[name] = context['v'] = definition()
      })('valentine', this, function () {
      
        var ap = []
          , hasOwn = Object.prototype.hasOwnProperty
          , n = null
          , slice = ap.slice
      
        var iters = {
          each: function (a, fn, scope) {
            ap.forEach.call(a, fn, scope)
          }
      
        , map: function (a, fn, scope) {
            return ap.map.call(a, fn, scope)
          }
      
        , some: function (a, fn, scope) {
            return a.some(fn, scope)
          }
      
        , every: function (a, fn, scope) {
            return a.every(fn, scope)
          }
      
        , filter: function (a, fn, scope) {
            return a.filter(fn, scope)
          }
        , indexOf: function (a, el, start) {
            return a.indexOf(el, isFinite(start) ? start : 0)
          }
      
        , lastIndexOf: function (a, el, start) {
            return a.lastIndexOf(el, isFinite(start) ? start : a.length)
          }
      
        , reduce: function (o, i, m, c) {
            return ap.reduce.call(o, v.bind(c, i), m);
          }
      
        , reduceRight: function (o, i, m, c) {
            return ap.reduceRight.call(o, v.bind(c, i), m)
          }
      
        , find: function (obj, iterator, context) {
            var result
            iters.some(obj, function (value, index, list) {
              if (iterator.call(context, value, index, list)) {
                result = value
                return true
              }
            })
            return result
          }
      
        , reject: function (a, fn, scope) {
            var r = []
            for (var i = 0, j = 0, l = a.length; i < l; i++) {
              if (i in a) {
                if (fn.call(scope, a[i], i, a)) {
                  continue;
                }
                r[j++] = a[i]
              }
            }
            return r
          }
      
        , size: function (a) {
            return o.toArray(a).length
          }
      
        , compact: function (a) {
            return iters.filter(a, function (value) {
              return !!value
            })
          }
      
        , flatten: function (a) {
            return iters.reduce(a, function (memo, value) {
              if (is.arr(value)) {
                return memo.concat(iters.flatten(value))
              }
              memo[memo.length] = value
              return memo
            }, [])
          }
      
        , uniq: function (ar, opt_iterator) {
            if (ar === null) return []
            var a = [], seen = []
            for (var i = 0, length = ar.length; i < length; i++) {
              var value = ar[i]
              if (opt_iterator) value = opt_iterator(value, i, ar)
              if (!iters.inArray(seen, value)) {
                seen.push(value)
                a.push(ar[i])
              }
            }
            return a
          }
      
        , merge: function (one, two) {
            var i = one.length, j = 0, l
            if (isFinite(two.length)) {
              for (l = two.length; j < l; j++) {
                one[i++] = two[j]
              }
            } else {
              while (two[j] !== undefined) {
                one[i++] = two[j++]
              }
            }
            one.length = i
            return one
          }
      
        , inArray: function (ar, needle) {
            return !!~iters.indexOf(ar, needle)
          }
      
        , memo: function (fn, hasher) {
            var store = {}
            hasher || (hasher = function (v) {
              return v
            })
            return function () {
              var key = hasher.apply(this, arguments)
              return hasOwn.call(store, key) ? store[key] : (store[key] = fn.apply(this, arguments))
            }
          }
        }
      
        var is = {
          fun: function (f) {
            return typeof f === 'function'
          }
      
        , str: function (s) {
            return typeof s === 'string'
          }
      
        , ele: function (el) {
            return !!(el && el.nodeType && el.nodeType == 1)
          }
      
        , arr: function (ar) {
            return ar instanceof Array
          }
      
        , arrLike: function (ar) {
            return (ar && ar.length && isFinite(ar.length))
          }
      
        , num: function (n) {
            return typeof n === 'number'
          }
      
        , bool: function (b) {
            return (b === true) || (b === false)
          }
      
        , args: function (a) {
            return !!(a && hasOwn.call(a, 'callee'))
          }
      
        , emp: function (o) {
            var i = 0
            return is.arr(o) ? o.length === 0 :
              is.obj(o) ? (function () {
                for (var _ in o) {
                  i++
                  break;
                }
                return (i === 0)
              }()) :
              o === ''
          }
      
        , dat: function (d) {
            return !!(d && d.getTimezoneOffset && d.setUTCFullYear)
          }
      
        , reg: function (r) {
            return !!(r && r.test && r.exec && (r.ignoreCase || r.ignoreCase === false))
          }
      
        , nan: function (n) {
            return n !== n
          }
      
        , nil: function (o) {
            return o === n
          }
      
        , und: function (o) {
            return typeof o === 'undefined'
          }
      
        , def: function (o) {
            return typeof o !== 'undefined'
          }
      
        , obj: function (o) {
            return o instanceof Object && !is.fun(o) && !is.arr(o)
          }
        }
      
        // nicer looking aliases
        is.empty = is.emp
        is.date = is.dat
        is.regexp = is.reg
        is.element = is.ele
        is.array = is.arr
        is.string = is.str
        is.undef = is.und
        is.func = is.fun
      
        var o = {
          each: function each(a, fn, scope) {
            is.arrLike(a) ?
              iters.each(a, fn, scope) : (function () {
                for (var k in a) {
                  hasOwn.call(a, k) && fn.call(scope, k, a[k], a)
                }
              }())
          }
      
        , map: function map(a, fn, scope) {
            var r = [], i = 0
            return is.arrLike(a) ?
              iters.map(a, fn, scope) : !function () {
                for (var k in a) {
                  hasOwn.call(a, k) && (r[i++] = fn.call(scope, k, a[k], a))
                }
              }() && r
          }
      
        , some: function some(a, fn, scope) {
            if (is.arrLike(a)) return iters.some(a, fn, scope)
            for (var k in a) {
              if (hasOwn.call(a, k) && fn.call(scope, k, a[k], a)) {
                return true
              }
            }
            return false
      
          }
      
        , every: function every(a, fn, scope) {
            if (is.arrLike(a)) return iters.every(a, fn, scope)
            for (var k in a) {
              if (!(hasOwn.call(a, k) && fn.call(scope, k, a[k], a))) {
                return false
              }
            }
            return true
          }
      
        , filter: function filter(a, fn, scope) {
            var r = {}, k
            if (is.arrLike(a)) return iters.filter(a, fn, scope)
            for (k in a) {
              if (hasOwn.call(a, k) && fn.call(scope, k, a[k], a)) {
                r[k] = a[k]
              }
            }
            return r
          }
      
        , pluck: function pluck(a, k) {
            return is.arrLike(a) ?
              iters.map(a, function (el) {
                return el[k]
              }) :
              o.map(a, function (_, v) {
                return v[k]
              })
          }
      
        , toArray: function toArray(a) {
            if (!a) return []
      
            if (is.arr(a)) return a
      
            if (a.toArray) return a.toArray()
      
            if (is.args(a)) return slice.call(a)
      
            return iters.map(a, function (k) {
              return k
            })
          }
      
        , first: function first(a) {
            return a[0]
          }
      
        , last: function last(a) {
            return a[a.length - 1]
          }
      
        , keys: Object.keys
        , values: function (ob) {
            return o.map(ob, function (_, v) {
              return v
            })
          }
      
        , extend: function extend() {
            // based on jQuery deep merge
            var options, name, src, copy, clone
              , target = arguments[0], i = 1, length = arguments.length
      
            for (; i < length; i++) {
              if ((options = arguments[i]) !== n) {
                // Extend the base object
                for (name in options) {
                  src = target[name]
                  copy = options[name]
                  if (target === copy) {
                    continue;
                  }
                  if (copy && (is.obj(copy))) {
                    clone = src && is.obj(src) ? src : {}
                    target[name] = o.extend(clone, copy);
                  } else if (copy !== undefined) {
                    target[name] = copy
                  }
                }
              }
            }
            return target
          }
      
        , trim: function (s) {
            return s.trim()
          }
      
        , bind: function (scope, fn) {
            var args = arguments.length > 2 ? slice.call(arguments, 2) : null
            return function () {
              return fn.apply(scope, args ? args.concat(slice.call(arguments)) : arguments)
            }
          }
      
        , curry: function curry(fn) {
            if (arguments.length == 1) return fn
            var args = slice.call(arguments, 1)
            return function () {
              return fn.apply(null, args.concat(slice.call(arguments)))
            }
          }
      
        , parallel: function parallel(fns, callback) {
            var args = o.toArray(arguments)
              , len = 0
              , returns = []
              , flattened = []
      
            if (is.arr(fns) && fns.length === 0 || (is.fun(fns) && args.length === 1)) throw new TypeError('Empty parallel array')
            if (!is.arr(fns)) {
              callback = args.pop()
              fns = args
            }
      
            iters.each(fns, function (el, i) {
              el(function () {
                var a = o.toArray(arguments)
                  , e = a.shift()
                if (e) return callback(e)
                returns[i] = a
                if (fns.length == ++len) {
                  returns.unshift(n)
      
                  iters.each(returns, function (r) {
                    flattened = flattened.concat(r)
                  })
      
                  callback.apply(n, flattened)
                }
              })
            })
          }
      
        , waterfall: function waterfall(fns, callback) {
            var args = o.toArray(arguments)
      
            if (is.arr(fns) && fns.length === 0 || (is.fun(fns) && args.length === 1)) throw new TypeError('Empty waterfall array')
            if (!is.arr(fns)) {
              callback = args.pop()
              fns = args
            }
      
            (function f() {
              var args = o.toArray(arguments)
              if (!args.length) args.push(null) // allow callbacks with no args as passable non-errored functions
              args.push(f)
              var err = args.shift()
              if (!err && fns.length) fns.shift().apply(n, args)
              else {
                args.pop()
                args.unshift(err)
                callback.apply(n, args)
              }
            }(n))
          }
      
        , series: function (tasks, callback) {
            o.waterfall(tasks.map(function (task) {
              return function (f) {
                task(function (err) {
                  f(err)
                })
              }
            }), callback)
          }
      
        , queue: function queue(ar) {
            return new Queue(is.arrLike(ar) ? ar : o.toArray(arguments))
          }
      
        , debounce: function debounce(wait, fn, opt_scope) {
            var timeout
            function caller() {
              var args = arguments
                , context = opt_scope || this
              function later() {
                timeout = null
                fn.apply(context, args)
              }
              clearTimeout(timeout)
              timeout = setTimeout(later, wait)
            }
      
            // cancelation method
            caller.cancel = function debounceCancel() {
              clearTimeout(timeout)
              timeout = null
            }
      
            return caller
          }
      
        , throttle: function throttle(wait, fn, opt_scope, head) {
            var timeout
            var origHead = head
            return function throttler() {
              var context = opt_scope || this
                , args = arguments
              if (head) {
                fn.apply(context, args)
                head = false
                return
              }
              if (!timeout) {
                timeout = setTimeout(function throttleTimeout() {
                    fn.apply(context, args)
                    timeout = null
                    head = origHead
                  },
                  wait
                )
              }
            }
          }
      
        , throttleDebounce: function (throttleMs, debounceMs, fn, opt_scope) {
            var args
              , context
              , debouncer
              , throttler
      
            function caller() {
              args = arguments
              context = opt_scope || this
      
              clearTimeout(debouncer)
              debouncer = setTimeout(function () {
                clearTimeout(throttler)
                throttler = null
                fn.apply(context, args)
              }, debounceMs)
      
              if (!throttler) {
                throttler = setTimeout(function () {
                  clearTimeout(debouncer)
                  throttler = null
                  fn.apply(context, args)
                }, throttleMs)
              }
            }
      
            // cancelation method
            caller.cancel = function () {
              clearTimeout(debouncer)
              clearTimeout(throttler)
              throttler = null
            }
      
            return caller
          }
        }
      
        function Queue (a) {
          this.values = a
          this.index = 0
        }
      
        Queue.prototype.next = function () {
          this.index < this.values.length && this.values[this.index++]()
          return this
        }
      
        function v(a, scope) {
          return new Valentine(a, scope)
        }
      
        function aug(o, o2) {
          for (var k in o2) o[k] = o2[k]
        }
      
        aug(v, iters)
        aug(v, o)
        v.is = is
      
        v.v = v // vainglory
      
        // peoples like the object style
        function Valentine(a, scope) {
          this.val = a
          this._scope = scope || n
          this._chained = 0
        }
      
        v.each(v.extend({}, iters, o), function (name, fn) {
          Valentine.prototype[name] = function () {
            var a = v.toArray(arguments)
            a.unshift(this.val)
            var ret = fn.apply(this._scope, a)
            this.val = ret
            return this._chained ? this : ret
          }
        })
      
        // people like chaining
        aug(Valentine.prototype, {
          chain: function () {
            this._chained = 1
            return this
          }
        , value: function () {
            return this.val
          }
        })
      
        return v
      });
      
    },
    'src/ender': function (module, exports, require, global) {
      var v = require('valentine')
      ender.ender(v)
      ender.ender({
          merge: v.merge
        , extend: v.extend
        , each: v.each
        , map: v.map
        , toArray: v.toArray
        , keys: v.keys
        , values: v.values
        , trim: v.trim
        , bind: v.bind
        , curry: v.curry
        , parallel: v.parallel
        , waterfall: v.waterfall
        , inArray: v.inArray
        , queue: v.queue
      })
      
    }
  }, 'valentine');

  Module.createPackage('isarray', {
    'index': function (module, exports, require, global) {
      module.exports = Array.isArray || function (arr) {
        return Object.prototype.toString.call(arr) == '[object Array]';
      };
      
    }
  }, 'index');

  Module.createPackage('path-to-regexp', {
    'index': function (module, exports, require, global) {
      var isArray = require('isarray');
      
      /**
       * Expose `pathToRegexp`.
       */
      module.exports = pathToRegexp;
      
      /**
       * The main path matching regexp utility.
       *
       * @type {RegExp}
       */
      var PATH_REGEXP = new RegExp([
        // Match escaped characters that would otherwise appear in future matches.
        // This allows the user to escape special characters that won't transform.
        '(\\\\.)',
        // Match Express-style parameters and un-named parameters with a prefix
        // and optional suffixes. Matches appear as:
        //
        // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
        // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
        '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',
        // Match regexp special characters that are always escaped.
        '([.+*?=^!:${}()[\\]|\\/])'
      ].join('|'), 'g');
      
      /**
       * Escape the capturing group by escaping special characters and meaning.
       *
       * @param  {String} group
       * @return {String}
       */
      function escapeGroup (group) {
        return group.replace(/([=!:$\/()])/g, '\\$1');
      }
      
      /**
       * Attach the keys as a property of the regexp.
       *
       * @param  {RegExp} re
       * @param  {Array}  keys
       * @return {RegExp}
       */
      function attachKeys (re, keys) {
        re.keys = keys;
        return re;
      }
      
      /**
       * Get the flags for a regexp from the options.
       *
       * @param  {Object} options
       * @return {String}
       */
      function flags (options) {
        return options.sensitive ? '' : 'i';
      }
      
      /**
       * Pull out keys from a regexp.
       *
       * @param  {RegExp} path
       * @param  {Array}  keys
       * @return {RegExp}
       */
      function regexpToRegexp (path, keys) {
        // Use a negative lookahead to match only capturing groups.
        var groups = path.source.match(/\((?!\?)/g);
      
        if (groups) {
          for (var i = 0; i < groups.length; i++) {
            keys.push({
              name:      i,
              delimiter: null,
              optional:  false,
              repeat:    false
            });
          }
        }
      
        return attachKeys(path, keys);
      }
      
      /**
       * Transform an array into a regexp.
       *
       * @param  {Array}  path
       * @param  {Array}  keys
       * @param  {Object} options
       * @return {RegExp}
       */
      function arrayToRegexp (path, keys, options) {
        var parts = [];
      
        for (var i = 0; i < path.length; i++) {
          parts.push(pathToRegexp(path[i], keys, options).source);
        }
      
        var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));
        return attachKeys(regexp, keys);
      }
      
      /**
       * Replace the specific tags with regexp strings.
       *
       * @param  {String} path
       * @param  {Array}  keys
       * @return {String}
       */
      function replacePath (path, keys) {
        var index = 0;
      
        function replace (_, escaped, prefix, key, capture, group, suffix, escape) {
          if (escaped) {
            return escaped;
          }
      
          if (escape) {
            return '\\' + escape;
          }
      
          var repeat   = suffix === '+' || suffix === '*';
          var optional = suffix === '?' || suffix === '*';
      
          keys.push({
            name:      key || index++,
            delimiter: prefix || '/',
            optional:  optional,
            repeat:    repeat
          });
      
          prefix = prefix ? ('\\' + prefix) : '';
          capture = escapeGroup(capture || group || '[^' + (prefix || '\\/') + ']+?');
      
          if (repeat) {
            capture = capture + '(?:' + prefix + capture + ')*';
          }
      
          if (optional) {
            return '(?:' + prefix + '(' + capture + '))?';
          }
      
          // Basic parameter support.
          return prefix + '(' + capture + ')';
        }
      
        return path.replace(PATH_REGEXP, replace);
      }
      
      /**
       * Normalize the given path string, returning a regular expression.
       *
       * An empty array can be passed in for the keys, which will hold the
       * placeholder key descriptions. For example, using `/user/:id`, `keys` will
       * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
       *
       * @param  {(String|RegExp|Array)} path
       * @param  {Array}                 [keys]
       * @param  {Object}                [options]
       * @return {RegExp}
       */
      function pathToRegexp (path, keys, options) {
        keys = keys || [];
      
        if (!isArray(keys)) {
          options = keys;
          keys = [];
        } else if (!options) {
          options = {};
        }
      
        if (path instanceof RegExp) {
          return regexpToRegexp(path, keys, options);
        }
      
        if (isArray(path)) {
          return arrayToRegexp(path, keys, options);
        }
      
        var strict = options.strict;
        var end = options.end !== false;
        var route = replacePath(path, keys);
        var endsWithSlash = path.charAt(path.length - 1) === '/';
      
        // In non-strict mode we allow a slash at the end of match. If the path to
        // match already ends with a slash, we remove it for consistency. The slash
        // is valid at the end of a path match, not in the middle. This is important
        // in non-ending mode, where "/test/" shouldn't match "/test//route".
        if (!strict) {
          route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
        }
      
        if (end) {
          route += '$';
        } else {
          // In non-ending mode, we need the capturing groups to match as much as
          // possible by using a positive lookahead to the end or next path segment.
          route += strict && endsWithSlash ? '' : '(?=\\/|$)';
        }
      
        return attachKeys(new RegExp('^' + route, flags(options)), keys);
      }
      
    }
  }, 'index');

  Module.createPackage('page', {
    'index': function (module, exports, require, global) {
        /* globals require, module */
      
        'use strict';
      
        /**
         * Module dependencies.
         */
      
        var pathtoRegexp = require('path-to-regexp');
      
        /**
         * Module exports.
         */
      
        module.exports = page;
      
        /**
         * Detect click event
         */
        var clickEvent = ('undefined' !== typeof document) && document.ontouchstart ? 'touchstart' : 'click';
      
        /**
         * To work properly with the URL
         * history.location generated polyfill in https://github.com/devote/HTML5-History-API
         */
      
        var location = ('undefined' !== typeof window) && (window.history.location || window.location);
      
        /**
         * Perform initial dispatch.
         */
      
        var dispatch = true;
      
      
        /**
         * Decode URL components (query string, pathname, hash).
         * Accommodates both regular percent encoding and x-www-form-urlencoded format.
         */
        var decodeURLComponents = true;
      
        /**
         * Base path.
         */
      
        var base = '';
      
        /**
         * Running flag.
         */
      
        var running;
      
        /**
         * HashBang option
         */
      
        var hashbang = false;
      
        /**
         * Previous context, for capturing
         * page exit events.
         */
      
        var prevContext;
      
        /**
         * Register `path` with callback `fn()`,
         * or route `path`, or redirection,
         * or `page.start()`.
         *
         *   page(fn);
         *   page('*', fn);
         *   page('/user/:id', load, user);
         *   page('/user/' + user.id, { some: 'thing' });
         *   page('/user/' + user.id);
         *   page('/from', '/to')
         *   page();
         *
         * @param {String|Function} path
         * @param {Function} fn...
         * @api public
         */
      
        function page(path, fn) {
          // <callback>
          if ('function' === typeof path) {
            return page('*', path);
          }
      
          // route <path> to <callback ...>
          if ('function' === typeof fn) {
            var route = new Route(path);
            for (var i = 1; i < arguments.length; ++i) {
              page.callbacks.push(route.middleware(arguments[i]));
            }
            // show <path> with [state]
          } else if ('string' === typeof path) {
            page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
            // start [options]
          } else {
            page.start(path);
          }
        }
      
        /**
         * Callback functions.
         */
      
        page.callbacks = [];
        page.exits = [];
      
        /**
         * Current path being processed
         * @type {String}
         */
        page.current = '';
      
        /**
         * Number of pages navigated to.
         * @type {number}
         *
         *     page.len == 0;
         *     page('/login');
         *     page.len == 1;
         */
      
        page.len = 0;
      
        /**
         * Get or set basepath to `path`.
         *
         * @param {String} path
         * @api public
         */
      
        page.base = function(path) {
          if (0 === arguments.length) return base;
          base = path;
        };
      
        /**
         * Bind with the given `options`.
         *
         * Options:
         *
         *    - `click` bind to click events [true]
         *    - `popstate` bind to popstate [true]
         *    - `dispatch` perform initial dispatch [true]
         *
         * @param {Object} options
         * @api public
         */
      
        page.start = function(options) {
          options = options || {};
          if (running) return;
          running = true;
          if (false === options.dispatch) dispatch = false;
          if (false === options.decodeURLComponents) decodeURLComponents = false;
          if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
          if (false !== options.click) {
            document.addEventListener(clickEvent, onclick, false);
          }
          if (true === options.hashbang) hashbang = true;
          if (!dispatch) return;
          var url = (hashbang && ~location.hash.indexOf('#!')) ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;
          page.replace(url, null, true, dispatch);
        };
      
        /**
         * Unbind click and popstate event handlers.
         *
         * @api public
         */
      
        page.stop = function() {
          if (!running) return;
          page.current = '';
          page.len = 0;
          running = false;
          document.removeEventListener(clickEvent, onclick, false);
          window.removeEventListener('popstate', onpopstate, false);
        };
      
        /**
         * Show `path` with optional `state` object.
         *
         * @param {String} path
         * @param {Object} state
         * @param {Boolean} dispatch
         * @return {Context}
         * @api public
         */
      
        page.show = function(path, state, dispatch, push) {
          var ctx = new Context(path, state);
          page.current = ctx.path;
          if (false !== dispatch) page.dispatch(ctx);
          if (false !== ctx.handled && false !== push) ctx.pushState();
          return ctx;
        };
      
        /**
         * Goes back in the history
         * Back should always let the current route push state and then go back.
         *
         * @param {String} path - fallback path to go back if no more history exists, if undefined defaults to page.base
         * @param {Object} [state]
         * @api public
         */
      
        page.back = function(path, state) {
          if (page.len > 0) {
            // this may need more testing to see if all browsers
            // wait for the next tick to go back in history
            history.back();
            page.len--;
          } else if (path) {
            setTimeout(function() {
              page.show(path, state);
            });
          }else{
            setTimeout(function() {
              page.show(base, state);
            });
          }
        };
      
      
        /**
         * Register route to redirect from one path to other
         * or just redirect to another route
         *
         * @param {String} from - if param 'to' is undefined redirects to 'from'
         * @param {String} [to]
         * @api public
         */
        page.redirect = function(from, to) {
          // Define route from a path to another
          if ('string' === typeof from && 'string' === typeof to) {
            page(from, function(e) {
              setTimeout(function() {
                page.replace(to);
              }, 0);
            });
          }
      
          // Wait for the push state and replace it with another
          if ('string' === typeof from && 'undefined' === typeof to) {
            setTimeout(function() {
              page.replace(from);
            }, 0);
          }
        };
      
        /**
         * Replace `path` with optional `state` object.
         *
         * @param {String} path
         * @param {Object} state
         * @return {Context}
         * @api public
         */
      
      
        page.replace = function(path, state, init, dispatch) {
          var ctx = new Context(path, state);
          page.current = ctx.path;
          ctx.init = init;
          ctx.save(); // save before dispatching, which may redirect
          if (false !== dispatch) page.dispatch(ctx);
          return ctx;
        };
      
        /**
         * Dispatch the given `ctx`.
         *
         * @param {Object} ctx
         * @api private
         */
      
        page.dispatch = function(ctx) {
          var prev = prevContext,
            i = 0,
            j = 0;
      
          prevContext = ctx;
      
          function nextExit() {
            var fn = page.exits[j++];
            if (!fn) return nextEnter();
            fn(prev, nextExit);
          }
      
          function nextEnter() {
            var fn = page.callbacks[i++];
      
            if (ctx.path !== page.current) {
              ctx.handled = false;
              return;
            }
            if (!fn) return unhandled(ctx);
            fn(ctx, nextEnter);
          }
      
          if (prev) {
            nextExit();
          } else {
            nextEnter();
          }
        };
      
        /**
         * Unhandled `ctx`. When it's not the initial
         * popstate then redirect. If you wish to handle
         * 404s on your own use `page('*', callback)`.
         *
         * @param {Context} ctx
         * @api private
         */
      
        function unhandled(ctx) {
          if (ctx.handled) return;
          var current;
      
          if (hashbang) {
            current = base + location.hash.replace('#!', '');
          } else {
            current = location.pathname + location.search;
          }
      
          if (current === ctx.canonicalPath) return;
          page.stop();
          ctx.handled = false;
          location.href = ctx.canonicalPath;
        }
      
        /**
         * Register an exit route on `path` with
         * callback `fn()`, which will be called
         * on the previous context when a new
         * page is visited.
         */
        page.exit = function(path, fn) {
          if (typeof path === 'function') {
            return page.exit('*', path);
          }
      
          var route = new Route(path);
          for (var i = 1; i < arguments.length; ++i) {
            page.exits.push(route.middleware(arguments[i]));
          }
        };
      
        /**
         * Remove URL encoding from the given `str`.
         * Accommodates whitespace in both x-www-form-urlencoded
         * and regular percent-encoded form.
         *
         * @param {str} URL component to decode
         */
        function decodeURLEncodedURIComponent(val) {
          if (typeof val !== 'string') { return val; }
          return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
        }
      
        /**
         * Initialize a new "request" `Context`
         * with the given `path` and optional initial `state`.
         *
         * @param {String} path
         * @param {Object} state
         * @api public
         */
      
        function Context(path, state) {
          if ('/' === path[0] && 0 !== path.indexOf(base)) path = base + (hashbang ? '#!' : '') + path;
          var i = path.indexOf('?');
      
          this.canonicalPath = path;
          this.path = path.replace(base, '') || '/';
          if (hashbang) this.path = this.path.replace('#!', '') || '/';
      
          this.title = document.title;
          this.state = state || {};
          this.state.path = path;
          this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
          this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
          this.params = {};
      
          // fragment
          this.hash = '';
          if (!hashbang) {
            if (!~this.path.indexOf('#')) return;
            var parts = this.path.split('#');
            this.path = parts[0];
            this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
            this.querystring = this.querystring.split('#')[0];
          }
        }
      
        /**
         * Expose `Context`.
         */
      
        page.Context = Context;
      
        /**
         * Push state.
         *
         * @api private
         */
      
        Context.prototype.pushState = function() {
          page.len++;
          history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        };
      
        /**
         * Save the context state.
         *
         * @api public
         */
      
        Context.prototype.save = function() {
          history.replaceState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        };
      
        /**
         * Initialize `Route` with the given HTTP `path`,
         * and an array of `callbacks` and `options`.
         *
         * Options:
         *
         *   - `sensitive`    enable case-sensitive routes
         *   - `strict`       enable strict matching for trailing slashes
         *
         * @param {String} path
         * @param {Object} options.
         * @api private
         */
      
        function Route(path, options) {
          options = options || {};
          this.path = (path === '*') ? '(.*)' : path;
          this.method = 'GET';
          this.regexp = pathtoRegexp(this.path,
            this.keys = [],
            options.sensitive,
            options.strict);
        }
      
        /**
         * Expose `Route`.
         */
      
        page.Route = Route;
      
        /**
         * Return route middleware with
         * the given callback `fn()`.
         *
         * @param {Function} fn
         * @return {Function}
         * @api public
         */
      
        Route.prototype.middleware = function(fn) {
          var self = this;
          return function(ctx, next) {
            if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
            next();
          };
        };
      
        /**
         * Check if this route matches `path`, if so
         * populate `params`.
         *
         * @param {String} path
         * @param {Object} params
         * @return {Boolean}
         * @api private
         */
      
        Route.prototype.match = function(path, params) {
          var keys = this.keys,
            qsIndex = path.indexOf('?'),
            pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
            m = this.regexp.exec(decodeURIComponent(pathname));
      
          if (!m) return false;
      
          for (var i = 1, len = m.length; i < len; ++i) {
            var key = keys[i - 1];
            var val = decodeURLEncodedURIComponent(m[i]);
            if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
              params[key.name] = val;
            }
          }
      
          return true;
        };
      
      
        /**
         * Handle "populate" events.
         */
      
        var onpopstate = (function () {
          var loaded = false;
          if ('undefined' === typeof window) {
            return;
          }
          if (document.readyState === 'complete') {
            loaded = true;
          } else {
            window.addEventListener('load', function() {
              setTimeout(function() {
                loaded = true;
              }, 0);
            });
          }
          return function onpopstate(e) {
            if (!loaded) return;
            if (e.state) {
              var path = e.state.path;
              page.replace(path, e.state);
            } else {
              page.show(location.pathname + location.hash, undefined, undefined, false);
            }
          };
        })();
        /**
         * Handle "click" events.
         */
      
        function onclick(e) {
      
          if (1 !== which(e)) return;
      
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
          if (e.defaultPrevented) return;
      
      
      
          // ensure link
          var el = e.target;
          while (el && 'A' !== el.nodeName) el = el.parentNode;
          if (!el || 'A' !== el.nodeName) return;
      
      
      
          // Ignore if tag has
          // 1. "download" attribute
          // 2. rel="external" attribute
          if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;
      
          // ensure non-hash for the same path
          var link = el.getAttribute('href');
          if (!hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) return;
      
      
      
          // Check for mailto: in the href
          if (link && link.indexOf('mailto:') > -1) return;
      
          // check target
          if (el.target) return;
      
          // x-origin
          if (!sameOrigin(el.href)) return;
      
      
      
          // rebuild path
          var path = el.pathname + el.search + (el.hash || '');
      
          // strip leading "/[drive letter]:" on NW.js on Windows
          if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
            path = path.replace(/^\/[a-zA-Z]:\//, '/');
          }
      
          // same page
          var orig = path;
      
          if (path.indexOf(base) === 0) {
            path = path.substr(base.length);
          }
      
          if (hashbang) path = path.replace('#!', '');
      
          if (base && orig === path) return;
      
          e.preventDefault();
          page.show(orig);
        }
      
        /**
         * Event button.
         */
      
        function which(e) {
          e = e || window.event;
          return null === e.which ? e.button : e.which;
        }
      
        /**
         * Check if `href` is the same origin.
         */
      
        function sameOrigin(href) {
          var origin = location.protocol + '//' + location.hostname;
          if (location.port) origin += ':' + location.port;
          return (href && (0 === href.indexOf(origin)));
        }
      
        page.sameOrigin = sameOrigin;
      
    },
    'page': function (module, exports, require, global) {
      !function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.page=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
      (function (process){
        /* globals require, module */
      
        'use strict';
      
        /**
         * Module dependencies.
         */
      
        var pathtoRegexp = require('path-to-regexp');
      
        /**
         * Module exports.
         */
      
        module.exports = page;
      
        /**
         * Detect click event
         */
        var clickEvent = ('undefined' !== typeof document) && document.ontouchstart ? 'touchstart' : 'click';
      
        /**
         * To work properly with the URL
         * history.location generated polyfill in https://github.com/devote/HTML5-History-API
         */
      
        var location = ('undefined' !== typeof window) && (window.history.location || window.location);
      
        /**
         * Perform initial dispatch.
         */
      
        var dispatch = true;
      
      
        /**
         * Decode URL components (query string, pathname, hash).
         * Accommodates both regular percent encoding and x-www-form-urlencoded format.
         */
        var decodeURLComponents = true;
      
        /**
         * Base path.
         */
      
        var base = '';
      
        /**
         * Running flag.
         */
      
        var running;
      
        /**
         * HashBang option
         */
      
        var hashbang = false;
      
        /**
         * Previous context, for capturing
         * page exit events.
         */
      
        var prevContext;
      
        /**
         * Register `path` with callback `fn()`,
         * or route `path`, or redirection,
         * or `page.start()`.
         *
         *   page(fn);
         *   page('*', fn);
         *   page('/user/:id', load, user);
         *   page('/user/' + user.id, { some: 'thing' });
         *   page('/user/' + user.id);
         *   page('/from', '/to')
         *   page();
         *
         * @param {String|Function} path
         * @param {Function} fn...
         * @api public
         */
      
        function page(path, fn) {
          // <callback>
          if ('function' === typeof path) {
            return page('*', path);
          }
      
          // route <path> to <callback ...>
          if ('function' === typeof fn) {
            var route = new Route(path);
            for (var i = 1; i < arguments.length; ++i) {
              page.callbacks.push(route.middleware(arguments[i]));
            }
            // show <path> with [state]
          } else if ('string' === typeof path) {
            page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
            // start [options]
          } else {
            page.start(path);
          }
        }
      
        /**
         * Callback functions.
         */
      
        page.callbacks = [];
        page.exits = [];
      
        /**
         * Current path being processed
         * @type {String}
         */
        page.current = '';
      
        /**
         * Number of pages navigated to.
         * @type {number}
         *
         *     page.len == 0;
         *     page('/login');
         *     page.len == 1;
         */
      
        page.len = 0;
      
        /**
         * Get or set basepath to `path`.
         *
         * @param {String} path
         * @api public
         */
      
        page.base = function(path) {
          if (0 === arguments.length) return base;
          base = path;
        };
      
        /**
         * Bind with the given `options`.
         *
         * Options:
         *
         *    - `click` bind to click events [true]
         *    - `popstate` bind to popstate [true]
         *    - `dispatch` perform initial dispatch [true]
         *
         * @param {Object} options
         * @api public
         */
      
        page.start = function(options) {
          options = options || {};
          if (running) return;
          running = true;
          if (false === options.dispatch) dispatch = false;
          if (false === options.decodeURLComponents) decodeURLComponents = false;
          if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
          if (false !== options.click) {
            document.addEventListener(clickEvent, onclick, false);
          }
          if (true === options.hashbang) hashbang = true;
          if (!dispatch) return;
          var url = (hashbang && ~location.hash.indexOf('#!')) ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;
          page.replace(url, null, true, dispatch);
        };
      
        /**
         * Unbind click and popstate event handlers.
         *
         * @api public
         */
      
        page.stop = function() {
          if (!running) return;
          page.current = '';
          page.len = 0;
          running = false;
          document.removeEventListener(clickEvent, onclick, false);
          window.removeEventListener('popstate', onpopstate, false);
        };
      
        /**
         * Show `path` with optional `state` object.
         *
         * @param {String} path
         * @param {Object} state
         * @param {Boolean} dispatch
         * @return {Context}
         * @api public
         */
      
        page.show = function(path, state, dispatch, push) {
          var ctx = new Context(path, state);
          page.current = ctx.path;
          if (false !== dispatch) page.dispatch(ctx);
          if (false !== ctx.handled && false !== push) ctx.pushState();
          return ctx;
        };
      
        /**
         * Goes back in the history
         * Back should always let the current route push state and then go back.
         *
         * @param {String} path - fallback path to go back if no more history exists, if undefined defaults to page.base
         * @param {Object} [state]
         * @api public
         */
      
        page.back = function(path, state) {
          if (page.len > 0) {
            // this may need more testing to see if all browsers
            // wait for the next tick to go back in history
            history.back();
            page.len--;
          } else if (path) {
            setTimeout(function() {
              page.show(path, state);
            });
          }else{
            setTimeout(function() {
              page.show(base, state);
            });
          }
        };
      
      
        /**
         * Register route to redirect from one path to other
         * or just redirect to another route
         *
         * @param {String} from - if param 'to' is undefined redirects to 'from'
         * @param {String} [to]
         * @api public
         */
        page.redirect = function(from, to) {
          // Define route from a path to another
          if ('string' === typeof from && 'string' === typeof to) {
            page(from, function(e) {
              setTimeout(function() {
                page.replace(to);
              }, 0);
            });
          }
      
          // Wait for the push state and replace it with another
          if ('string' === typeof from && 'undefined' === typeof to) {
            setTimeout(function() {
              page.replace(from);
            }, 0);
          }
        };
      
        /**
         * Replace `path` with optional `state` object.
         *
         * @param {String} path
         * @param {Object} state
         * @return {Context}
         * @api public
         */
      
      
        page.replace = function(path, state, init, dispatch) {
          var ctx = new Context(path, state);
          page.current = ctx.path;
          ctx.init = init;
          ctx.save(); // save before dispatching, which may redirect
          if (false !== dispatch) page.dispatch(ctx);
          return ctx;
        };
      
        /**
         * Dispatch the given `ctx`.
         *
         * @param {Object} ctx
         * @api private
         */
      
        page.dispatch = function(ctx) {
          var prev = prevContext,
            i = 0,
            j = 0;
      
          prevContext = ctx;
      
          function nextExit() {
            var fn = page.exits[j++];
            if (!fn) return nextEnter();
            fn(prev, nextExit);
          }
      
          function nextEnter() {
            var fn = page.callbacks[i++];
      
            if (ctx.path !== page.current) {
              ctx.handled = false;
              return;
            }
            if (!fn) return unhandled(ctx);
            fn(ctx, nextEnter);
          }
      
          if (prev) {
            nextExit();
          } else {
            nextEnter();
          }
        };
      
        /**
         * Unhandled `ctx`. When it's not the initial
         * popstate then redirect. If you wish to handle
         * 404s on your own use `page('*', callback)`.
         *
         * @param {Context} ctx
         * @api private
         */
      
        function unhandled(ctx) {
          if (ctx.handled) return;
          var current;
      
          if (hashbang) {
            current = base + location.hash.replace('#!', '');
          } else {
            current = location.pathname + location.search;
          }
      
          if (current === ctx.canonicalPath) return;
          page.stop();
          ctx.handled = false;
          location.href = ctx.canonicalPath;
        }
      
        /**
         * Register an exit route on `path` with
         * callback `fn()`, which will be called
         * on the previous context when a new
         * page is visited.
         */
        page.exit = function(path, fn) {
          if (typeof path === 'function') {
            return page.exit('*', path);
          }
      
          var route = new Route(path);
          for (var i = 1; i < arguments.length; ++i) {
            page.exits.push(route.middleware(arguments[i]));
          }
        };
      
        /**
         * Remove URL encoding from the given `str`.
         * Accommodates whitespace in both x-www-form-urlencoded
         * and regular percent-encoded form.
         *
         * @param {str} URL component to decode
         */
        function decodeURLEncodedURIComponent(val) {
          if (typeof val !== 'string') { return val; }
          return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
        }
      
        /**
         * Initialize a new "request" `Context`
         * with the given `path` and optional initial `state`.
         *
         * @param {String} path
         * @param {Object} state
         * @api public
         */
      
        function Context(path, state) {
          if ('/' === path[0] && 0 !== path.indexOf(base)) path = base + (hashbang ? '#!' : '') + path;
          var i = path.indexOf('?');
      
          this.canonicalPath = path;
          this.path = path.replace(base, '') || '/';
          if (hashbang) this.path = this.path.replace('#!', '') || '/';
      
          this.title = document.title;
          this.state = state || {};
          this.state.path = path;
          this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
          this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
          this.params = {};
      
          // fragment
          this.hash = '';
          if (!hashbang) {
            if (!~this.path.indexOf('#')) return;
            var parts = this.path.split('#');
            this.path = parts[0];
            this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
            this.querystring = this.querystring.split('#')[0];
          }
        }
      
        /**
         * Expose `Context`.
         */
      
        page.Context = Context;
      
        /**
         * Push state.
         *
         * @api private
         */
      
        Context.prototype.pushState = function() {
          page.len++;
          history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        };
      
        /**
         * Save the context state.
         *
         * @api public
         */
      
        Context.prototype.save = function() {
          history.replaceState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        };
      
        /**
         * Initialize `Route` with the given HTTP `path`,
         * and an array of `callbacks` and `options`.
         *
         * Options:
         *
         *   - `sensitive`    enable case-sensitive routes
         *   - `strict`       enable strict matching for trailing slashes
         *
         * @param {String} path
         * @param {Object} options.
         * @api private
         */
      
        function Route(path, options) {
          options = options || {};
          this.path = (path === '*') ? '(.*)' : path;
          this.method = 'GET';
          this.regexp = pathtoRegexp(this.path,
            this.keys = [],
            options.sensitive,
            options.strict);
        }
      
        /**
         * Expose `Route`.
         */
      
        page.Route = Route;
      
        /**
         * Return route middleware with
         * the given callback `fn()`.
         *
         * @param {Function} fn
         * @return {Function}
         * @api public
         */
      
        Route.prototype.middleware = function(fn) {
          var self = this;
          return function(ctx, next) {
            if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
            next();
          };
        };
      
        /**
         * Check if this route matches `path`, if so
         * populate `params`.
         *
         * @param {String} path
         * @param {Object} params
         * @return {Boolean}
         * @api private
         */
      
        Route.prototype.match = function(path, params) {
          var keys = this.keys,
            qsIndex = path.indexOf('?'),
            pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
            m = this.regexp.exec(decodeURIComponent(pathname));
      
          if (!m) return false;
      
          for (var i = 1, len = m.length; i < len; ++i) {
            var key = keys[i - 1];
            var val = decodeURLEncodedURIComponent(m[i]);
            if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
              params[key.name] = val;
            }
          }
      
          return true;
        };
      
      
        /**
         * Handle "populate" events.
         */
      
        var onpopstate = (function () {
          var loaded = false;
          if ('undefined' === typeof window) {
            return;
          }
          if (document.readyState === 'complete') {
            loaded = true;
          } else {
            window.addEventListener('load', function() {
              setTimeout(function() {
                loaded = true;
              }, 0);
            });
          }
          return function onpopstate(e) {
            if (!loaded) return;
            if (e.state) {
              var path = e.state.path;
              page.replace(path, e.state);
            } else {
              page.show(location.pathname + location.hash, undefined, undefined, false);
            }
          };
        })();
        /**
         * Handle "click" events.
         */
      
        function onclick(e) {
      
          if (1 !== which(e)) return;
      
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
          if (e.defaultPrevented) return;
      
      
      
          // ensure link
          var el = e.target;
          while (el && 'A' !== el.nodeName) el = el.parentNode;
          if (!el || 'A' !== el.nodeName) return;
      
      
      
          // Ignore if tag has
          // 1. "download" attribute
          // 2. rel="external" attribute
          if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;
      
          // ensure non-hash for the same path
          var link = el.getAttribute('href');
          if (!hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) return;
      
      
      
          // Check for mailto: in the href
          if (link && link.indexOf('mailto:') > -1) return;
      
          // check target
          if (el.target) return;
      
          // x-origin
          if (!sameOrigin(el.href)) return;
      
      
      
          // rebuild path
          var path = el.pathname + el.search + (el.hash || '');
      
          // strip leading "/[drive letter]:" on NW.js on Windows
          if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
            path = path.replace(/^\/[a-zA-Z]:\//, '/');
          }
      
          // same page
          var orig = path;
      
          if (path.indexOf(base) === 0) {
            path = path.substr(base.length);
          }
      
          if (hashbang) path = path.replace('#!', '');
      
          if (base && orig === path) return;
      
          e.preventDefault();
          page.show(orig);
        }
      
        /**
         * Event button.
         */
      
        function which(e) {
          e = e || window.event;
          return null === e.which ? e.button : e.which;
        }
      
        /**
         * Check if `href` is the same origin.
         */
      
        function sameOrigin(href) {
          var origin = location.protocol + '//' + location.hostname;
          if (location.port) origin += ':' + location.port;
          return (href && (0 === href.indexOf(origin)));
        }
      
        page.sameOrigin = sameOrigin;
      
      }).call(this,require('_process'))
      },{"_process":2,"path-to-regexp":3}],2:[function(require,module,exports){
      // shim for using process in browser
      
      var process = module.exports = {};
      
      process.nextTick = (function () {
          var canSetImmediate = typeof window !== 'undefined'
          && window.setImmediate;
          var canMutationObserver = typeof window !== 'undefined'
          && window.MutationObserver;
          var canPost = typeof window !== 'undefined'
          && window.postMessage && window.addEventListener
          ;
      
          if (canSetImmediate) {
              return function (f) { return window.setImmediate(f) };
          }
      
          var queue = [];
      
          if (canMutationObserver) {
              var hiddenDiv = document.createElement("div");
              var observer = new MutationObserver(function () {
                  var queueList = queue.slice();
                  queue.length = 0;
                  queueList.forEach(function (fn) {
                      fn();
                  });
              });
      
              observer.observe(hiddenDiv, { attributes: true });
      
              return function nextTick(fn) {
                  if (!queue.length) {
                      hiddenDiv.setAttribute('yes', 'no');
                  }
                  queue.push(fn);
              };
          }
      
          if (canPost) {
              window.addEventListener('message', function (ev) {
                  var source = ev.source;
                  if ((source === window || source === null) && ev.data === 'process-tick') {
                      ev.stopPropagation();
                      if (queue.length > 0) {
                          var fn = queue.shift();
                          fn();
                      }
                  }
              }, true);
      
              return function nextTick(fn) {
                  queue.push(fn);
                  window.postMessage('process-tick', '*');
              };
          }
      
          return function nextTick(fn) {
              setTimeout(fn, 0);
          };
      })();
      
      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];
      
      function noop() {}
      
      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      
      process.binding = function (name) {
          throw new Error('process.binding is not supported');
      };
      
      // TODO(shtylman)
      process.cwd = function () { return '/' };
      process.chdir = function (dir) {
          throw new Error('process.chdir is not supported');
      };
      
      },{}],3:[function(require,module,exports){
      var isArray = require('isarray');
      
      /**
       * Expose `pathToRegexp`.
       */
      module.exports = pathToRegexp;
      
      /**
       * The main path matching regexp utility.
       *
       * @type {RegExp}
       */
      var PATH_REGEXP = new RegExp([
        // Match escaped characters that would otherwise appear in future matches.
        // This allows the user to escape special characters that won't transform.
        '(\\\\.)',
        // Match Express-style parameters and un-named parameters with a prefix
        // and optional suffixes. Matches appear as:
        //
        // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
        // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
        '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',
        // Match regexp special characters that are always escaped.
        '([.+*?=^!:${}()[\\]|\\/])'
      ].join('|'), 'g');
      
      /**
       * Escape the capturing group by escaping special characters and meaning.
       *
       * @param  {String} group
       * @return {String}
       */
      function escapeGroup (group) {
        return group.replace(/([=!:$\/()])/g, '\\$1');
      }
      
      /**
       * Attach the keys as a property of the regexp.
       *
       * @param  {RegExp} re
       * @param  {Array}  keys
       * @return {RegExp}
       */
      function attachKeys (re, keys) {
        re.keys = keys;
        return re;
      }
      
      /**
       * Get the flags for a regexp from the options.
       *
       * @param  {Object} options
       * @return {String}
       */
      function flags (options) {
        return options.sensitive ? '' : 'i';
      }
      
      /**
       * Pull out keys from a regexp.
       *
       * @param  {RegExp} path
       * @param  {Array}  keys
       * @return {RegExp}
       */
      function regexpToRegexp (path, keys) {
        // Use a negative lookahead to match only capturing groups.
        var groups = path.source.match(/\((?!\?)/g);
      
        if (groups) {
          for (var i = 0; i < groups.length; i++) {
            keys.push({
              name:      i,
              delimiter: null,
              optional:  false,
              repeat:    false
            });
          }
        }
      
        return attachKeys(path, keys);
      }
      
      /**
       * Transform an array into a regexp.
       *
       * @param  {Array}  path
       * @param  {Array}  keys
       * @param  {Object} options
       * @return {RegExp}
       */
      function arrayToRegexp (path, keys, options) {
        var parts = [];
      
        for (var i = 0; i < path.length; i++) {
          parts.push(pathToRegexp(path[i], keys, options).source);
        }
      
        var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));
        return attachKeys(regexp, keys);
      }
      
      /**
       * Replace the specific tags with regexp strings.
       *
       * @param  {String} path
       * @param  {Array}  keys
       * @return {String}
       */
      function replacePath (path, keys) {
        var index = 0;
      
        function replace (_, escaped, prefix, key, capture, group, suffix, escape) {
          if (escaped) {
            return escaped;
          }
      
          if (escape) {
            return '\\' + escape;
          }
      
          var repeat   = suffix === '+' || suffix === '*';
          var optional = suffix === '?' || suffix === '*';
      
          keys.push({
            name:      key || index++,
            delimiter: prefix || '/',
            optional:  optional,
            repeat:    repeat
          });
      
          prefix = prefix ? ('\\' + prefix) : '';
          capture = escapeGroup(capture || group || '[^' + (prefix || '\\/') + ']+?');
      
          if (repeat) {
            capture = capture + '(?:' + prefix + capture + ')*';
          }
      
          if (optional) {
            return '(?:' + prefix + '(' + capture + '))?';
          }
      
          // Basic parameter support.
          return prefix + '(' + capture + ')';
        }
      
        return path.replace(PATH_REGEXP, replace);
      }
      
      /**
       * Normalize the given path string, returning a regular expression.
       *
       * An empty array can be passed in for the keys, which will hold the
       * placeholder key descriptions. For example, using `/user/:id`, `keys` will
       * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
       *
       * @param  {(String|RegExp|Array)} path
       * @param  {Array}                 [keys]
       * @param  {Object}                [options]
       * @return {RegExp}
       */
      function pathToRegexp (path, keys, options) {
        keys = keys || [];
      
        if (!isArray(keys)) {
          options = keys;
          keys = [];
        } else if (!options) {
          options = {};
        }
      
        if (path instanceof RegExp) {
          return regexpToRegexp(path, keys, options);
        }
      
        if (isArray(path)) {
          return arrayToRegexp(path, keys, options);
        }
      
        var strict = options.strict;
        var end = options.end !== false;
        var route = replacePath(path, keys);
        var endsWithSlash = path.charAt(path.length - 1) === '/';
      
        // In non-strict mode we allow a slash at the end of match. If the path to
        // match already ends with a slash, we remove it for consistency. The slash
        // is valid at the end of a path match, not in the middle. This is important
        // in non-ending mode, where "/test/" shouldn't match "/test//route".
        if (!strict) {
          route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
        }
      
        if (end) {
          route += '$';
        } else {
          // In non-ending mode, we need the capturing groups to match as much as
          // possible by using a positive lookahead to the end or next path segment.
          route += strict && endsWithSlash ? '' : '(?=\\/|$)';
        }
      
        return attachKeys(new RegExp('^' + route, flags(options)), keys);
      }
      
      },{"isarray":4}],4:[function(require,module,exports){
      module.exports = Array.isArray || function (arr) {
        return Object.prototype.toString.call(arr) == '[object Array]';
      };
      
      },{}]},{},[1])(1)
      });
    }
  }, 'index');

  Module.createPackage('morpheus', {
    'morpheus': function (module, exports, require, global) {
      /*!
        * Morpheus - A Brilliant Animator
        * https://github.com/ded/morpheus - (c) Dustin Diaz 2011
        * License MIT
        */
      !function (name, definition) {
        if (typeof define == 'function') define(definition)
        else if (typeof module != 'undefined') module.exports = definition()
        else this[name] = definition()
      }('morpheus', function () {
      
        var doc = document
          , win = window
          , perf = win.performance
          , perfNow = perf && (perf.now || perf.webkitNow || perf.msNow || perf.mozNow)
          , now = perfNow ? function () { return perfNow.call(perf) } : function () { return +new Date() }
          , fixTs = false // feature detected below
          , html = doc.documentElement
          , thousand = 1000
          , rgbOhex = /^rgb\(|#/
          , relVal = /^([+\-])=([\d\.]+)/
          , numUnit = /^(?:[\+\-]=?)?\d+(?:\.\d+)?(%|in|cm|mm|em|ex|pt|pc|px)$/
          , rotate = /rotate\(((?:[+\-]=)?([\-\d\.]+))deg\)/
          , scale = /scale\(((?:[+\-]=)?([\d\.]+))\)/
          , skew = /skew\(((?:[+\-]=)?([\-\d\.]+))deg, ?((?:[+\-]=)?([\-\d\.]+))deg\)/
          , translate = /translate\(((?:[+\-]=)?([\-\d\.]+))px, ?((?:[+\-]=)?([\-\d\.]+))px\)/
            // these elements do not require 'px'
          , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, transform: 1}
      
        // which property name does this browser use for transform
        var transform = function () {
          var styles = doc.createElement('a').style
            , props = ['webkitTransform', 'MozTransform', 'OTransform', 'msTransform', 'Transform']
            , i
          for (i = 0; i < props.length; i++) {
            if (props[i] in styles) return props[i]
          }
        }()
      
        // does this browser support the opacity property?
        var opasity = function () {
          return typeof doc.createElement('a').style.opacity !== 'undefined'
        }()
      
        // initial style is determined by the elements themselves
        var getStyle = doc.defaultView && doc.defaultView.getComputedStyle ?
          function (el, property) {
            property = property == 'transform' ? transform : property
            property = camelize(property)
            var value = null
              , computed = doc.defaultView.getComputedStyle(el, '')
            computed && (value = computed[property])
            return el.style[property] || value
          } : html.currentStyle ?
      
          function (el, property) {
            property = camelize(property)
      
            if (property == 'opacity') {
              var val = 100
              try {
                val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity
              } catch (e1) {
                try {
                  val = el.filters('alpha').opacity
                } catch (e2) {}
              }
              return val / 100
            }
            var value = el.currentStyle ? el.currentStyle[property] : null
            return el.style[property] || value
          } :
          function (el, property) {
            return el.style[camelize(property)]
          }
      
        var frame = function () {
          // native animation frames
          // http://webstuff.nfshost.com/anim-timing/Overview.html
          // http://dev.chromium.org/developers/design-documents/requestanimationframe-implementation
          return win.requestAnimationFrame  ||
            win.webkitRequestAnimationFrame ||
            win.mozRequestAnimationFrame    ||
            win.msRequestAnimationFrame     ||
            win.oRequestAnimationFrame      ||
            function (callback) {
              win.setTimeout(function () {
                callback(+new Date())
              }, 17) // when I was 17..
            }
        }()
      
        frame(function(timestamp) {
          // feature-detect if rAF and now() are of the same scale (epoch or high-res),
          // if not, we have to do a timestamp fix on each frame
          fixTs = timestamp > 1e12 != now() > 1e12
        })
      
        var children = []
      
        function has(array, elem, i) {
          if (Array.prototype.indexOf) return array.indexOf(elem)
          for (i = 0; i < array.length; ++i) {
            if (array[i] === elem) return i
          }
        }
      
        function render(timestamp) {
          var i, count = children.length
          if (fixTs) timestamp = now()
          for (i = count; i--;) {
            children[i](timestamp)
          }
          children.length && frame(render)
        }
      
        function live(f) {
          if (children.push(f) === 1) frame(render)
        }
      
        function die(f) {
          var rest, index = has(children, f)
          if (index >= 0) {
            rest = children.slice(index + 1)
            children.length = index
            children = children.concat(rest)
          }
        }
      
        function parseTransform(style, base) {
          var values = {}, m
          if (m = style.match(rotate)) values.rotate = by(m[1], base ? base.rotate : null)
          if (m = style.match(scale)) values.scale = by(m[1], base ? base.scale : null)
          if (m = style.match(skew)) {values.skewx = by(m[1], base ? base.skewx : null); values.skewy = by(m[3], base ? base.skewy : null)}
          if (m = style.match(translate)) {values.translatex = by(m[1], base ? base.translatex : null); values.translatey = by(m[3], base ? base.translatey : null)}
          return values
        }
      
        function formatTransform(v) {
          var s = ''
          if ('rotate' in v) s += 'rotate(' + v.rotate + 'deg) '
          if ('scale' in v) s += 'scale(' + v.scale + ') '
          if ('translatex' in v) s += 'translate(' + v.translatex + 'px,' + v.translatey + 'px) '
          if ('skewx' in v) s += 'skew(' + v.skewx + 'deg,' + v.skewy + 'deg)'
          return s
        }
      
        function rgb(r, g, b) {
          return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
        }
      
        // convert rgb and short hex to long hex
        function toHex(c) {
          var m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
          return (m ? rgb(m[1], m[2], m[3]) : c)
            .replace(/#(\w)(\w)(\w)$/, '#$1$1$2$2$3$3') // short skirt to long jacket
        }
      
        // change font-size => fontSize etc.
        function camelize(s) {
          return s.replace(/-(.)/g, function (m, m1) {
            return m1.toUpperCase()
          })
        }
      
        // aren't we having it?
        function fun(f) {
          return typeof f == 'function'
        }
      
        function nativeTween(t) {
          // default to a pleasant-to-the-eye easeOut (like native animations)
          return Math.sin(t * Math.PI / 2)
        }
      
        /**
          * Core tween method that requests each frame
          * @param duration: time in milliseconds. defaults to 1000
          * @param fn: tween frame callback function receiving 'position'
          * @param done {optional}: complete callback function
          * @param ease {optional}: easing method. defaults to easeOut
          * @param from {optional}: integer to start from
          * @param to {optional}: integer to end at
          * @returns method to stop the animation
          */
        function tween(duration, fn, done, ease, from, to) {
          ease = fun(ease) ? ease : morpheus.easings[ease] || nativeTween
          var time = duration || thousand
            , self = this
            , diff = to - from
            , start = now()
            , stop = 0
            , end = 0
      
          function run(t) {
            var delta = t - start
            if (delta > time || stop) {
              to = isFinite(to) ? to : 1
              stop ? end && fn(to) : fn(to)
              die(run)
              return done && done.apply(self)
            }
            // if you don't specify a 'to' you can use tween as a generic delta tweener
            // cool, eh?
            isFinite(to) ?
              fn((diff * ease(delta / time)) + from) :
              fn(ease(delta / time))
          }
      
          live(run)
      
          return {
            stop: function (jump) {
              stop = 1
              end = jump // jump to end of animation?
              if (!jump) done = null // remove callback if not jumping to end
            }
          }
        }
      
        /**
          * generic bezier method for animating x|y coordinates
          * minimum of 2 points required (start and end).
          * first point start, last point end
          * additional control points are optional (but why else would you use this anyway ;)
          * @param points: array containing control points
             [[0, 0], [100, 200], [200, 100]]
          * @param pos: current be(tween) position represented as float  0 - 1
          * @return [x, y]
          */
        function bezier(points, pos) {
          var n = points.length, r = [], i, j
          for (i = 0; i < n; ++i) {
            r[i] = [points[i][0], points[i][1]]
          }
          for (j = 1; j < n; ++j) {
            for (i = 0; i < n - j; ++i) {
              r[i][0] = (1 - pos) * r[i][0] + pos * r[parseInt(i + 1, 10)][0]
              r[i][1] = (1 - pos) * r[i][1] + pos * r[parseInt(i + 1, 10)][1]
            }
          }
          return [r[0][0], r[0][1]]
        }
      
        // this gets you the next hex in line according to a 'position'
        function nextColor(pos, start, finish) {
          var r = [], i, e, from, to
          for (i = 0; i < 6; i++) {
            from = Math.min(15, parseInt(start.charAt(i),  16))
            to   = Math.min(15, parseInt(finish.charAt(i), 16))
            e = Math.floor((to - from) * pos + from)
            e = e > 15 ? 15 : e < 0 ? 0 : e
            r[i] = e.toString(16)
          }
          return '#' + r.join('')
        }
      
        // this retreives the frame value within a sequence
        function getTweenVal(pos, units, begin, end, k, i, v) {
          if (k == 'transform') {
            v = {}
            for (var t in begin[i][k]) {
              v[t] = (t in end[i][k]) ? Math.round(((end[i][k][t] - begin[i][k][t]) * pos + begin[i][k][t]) * thousand) / thousand : begin[i][k][t]
            }
            return v
          } else if (typeof begin[i][k] == 'string') {
            return nextColor(pos, begin[i][k], end[i][k])
          } else {
            // round so we don't get crazy long floats
            v = Math.round(((end[i][k] - begin[i][k]) * pos + begin[i][k]) * thousand) / thousand
            // some css properties don't require a unit (like zIndex, lineHeight, opacity)
            if (!(k in unitless)) v += units[i][k] || 'px'
            return v
          }
        }
      
        // support for relative movement via '+=n' or '-=n'
        function by(val, start, m, r, i) {
          return (m = relVal.exec(val)) ?
            (i = parseFloat(m[2])) && (start + (m[1] == '+' ? 1 : -1) * i) :
            parseFloat(val)
        }
      
        /**
          * morpheus:
          * @param element(s): HTMLElement(s)
          * @param options: mixed bag between CSS Style properties & animation options
          *  - {n} CSS properties|values
          *     - value can be strings, integers,
          *     - or callback function that receives element to be animated. method must return value to be tweened
          *     - relative animations start with += or -= followed by integer
          *  - duration: time in ms - defaults to 1000(ms)
          *  - easing: a transition method - defaults to an 'easeOut' algorithm
          *  - complete: a callback method for when all elements have finished
          *  - bezier: array of arrays containing x|y coordinates that define the bezier points. defaults to none
          *     - this may also be a function that receives element to be animated. it must return a value
          */
        function morpheus(elements, options) {
          var els = elements ? (els = isFinite(elements.length) ? elements : [elements]) : [], i
            , complete = options.complete
            , duration = options.duration
            , ease = options.easing
            , points = options.bezier
            , begin = []
            , end = []
            , units = []
            , bez = []
            , originalLeft
            , originalTop
      
          if (points) {
            // remember the original values for top|left
            originalLeft = options.left;
            originalTop = options.top;
            delete options.right;
            delete options.bottom;
            delete options.left;
            delete options.top;
          }
      
          for (i = els.length; i--;) {
      
            // record beginning and end states to calculate positions
            begin[i] = {}
            end[i] = {}
            units[i] = {}
      
            // are we 'moving'?
            if (points) {
      
              var left = getStyle(els[i], 'left')
                , top = getStyle(els[i], 'top')
                , xy = [by(fun(originalLeft) ? originalLeft(els[i]) : originalLeft || 0, parseFloat(left)),
                        by(fun(originalTop) ? originalTop(els[i]) : originalTop || 0, parseFloat(top))]
      
              bez[i] = fun(points) ? points(els[i], xy) : points
              bez[i].push(xy)
              bez[i].unshift([
                parseInt(left, 10),
                parseInt(top, 10)
              ])
            }
      
            for (var k in options) {
              switch (k) {
              case 'complete':
              case 'duration':
              case 'easing':
              case 'bezier':
                continue
              }
              var v = getStyle(els[i], k), unit
                , tmp = fun(options[k]) ? options[k](els[i]) : options[k]
              if (typeof tmp == 'string' &&
                  rgbOhex.test(tmp) &&
                  !rgbOhex.test(v)) {
                delete options[k]; // remove key :(
                continue; // cannot animate colors like 'orange' or 'transparent'
                          // only #xxx, #xxxxxx, rgb(n,n,n)
              }
      
              begin[i][k] = k == 'transform' ? parseTransform(v) :
                typeof tmp == 'string' && rgbOhex.test(tmp) ?
                  toHex(v).slice(1) :
                  parseFloat(v)
              end[i][k] = k == 'transform' ? parseTransform(tmp, begin[i][k]) :
                typeof tmp == 'string' && tmp.charAt(0) == '#' ?
                  toHex(tmp).slice(1) :
                  by(tmp, parseFloat(v));
              // record original unit
              (typeof tmp == 'string') && (unit = tmp.match(numUnit)) && (units[i][k] = unit[1])
            }
          }
          // ONE TWEEN TO RULE THEM ALL
          return tween.apply(els, [duration, function (pos, v, xy) {
            // normally not a fan of optimizing for() loops, but we want something
            // fast for animating
            for (i = els.length; i--;) {
              if (points) {
                xy = bezier(bez[i], pos)
                els[i].style.left = xy[0] + 'px'
                els[i].style.top = xy[1] + 'px'
              }
              for (var k in options) {
                v = getTweenVal(pos, units, begin, end, k, i)
                k == 'transform' ?
                  els[i].style[transform] = formatTransform(v) :
                  k == 'opacity' && !opasity ?
                    (els[i].style.filter = 'alpha(opacity=' + (v * 100) + ')') :
                    (els[i].style[camelize(k)] = v)
              }
            }
          }, complete, ease])
        }
      
        // expose useful methods
        morpheus.tween = tween
        morpheus.getStyle = getStyle
        morpheus.bezier = bezier
        morpheus.transform = transform
        morpheus.parseTransform = parseTransform
        morpheus.formatTransform = formatTransform
        morpheus.animationFrame = frame
        morpheus.easings = {}
      
        return morpheus
      
      });
      
    },
    'src/ender': function (module, exports, require, global) {
      var morpheus = require('morpheus')
      !function ($) {
        $.ender({
          animate: function (options) {
            return morpheus(this, options)
          }
        , fadeIn: function (d, fn) {
            return morpheus(this, {
                duration: d
              , opacity: 1
              , complete: fn
            })
          }
        , fadeOut: function (d, fn) {
            return morpheus(this, {
                duration: d
              , opacity: 0
              , complete: fn
            })
          }
        }, true)
        $.ender({
          tween: morpheus.tween
        })
      }(ender)
    }
  }, 'morpheus');

  require('domready');
  require('domready/src/ender');
  require('qwery');
  require('qwery/src/ender');
  require('bonzo');
  require('bonzo/src/ender');
  require('bean');
  require('bean/src/ender');
  require('reqwest');
  require('reqwest/src/ender');
  require('traversty');
  require('traversty/ender_bridge');
  require('timeout');
  require('timeout/lib/ender');
  require('verge');
  require('verge/src/ender');
  require('valentine');
  require('valentine/src/ender');
  require('isarray');
  require('path-to-regexp');
  require('page');
  require('morpheus');
  require('morpheus/src/ender');

}.call(window));
//# sourceMappingURL=ender.js.map
