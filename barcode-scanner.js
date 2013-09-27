// Generated by CoffeeScript 1.3.3
(function() {
  var BarcodeScanner,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  BarcodeScanner = (function() {

    function BarcodeScanner() {
      this.submit = __bind(this.submit, this);

      this.keyPress = __bind(this.keyPress, this);

      this.getArguments = __bind(this.getArguments, this);

      this.getAction = __bind(this.getAction, this);

      this.execute = __bind(this.execute, this);

      this.addAction = __bind(this.addAction, this);

      this.addChar = __bind(this.addChar, this);
      this.actions = [];
      this.buffer = null;
      this.delay = 50;
      this.timer = null;
    }

    BarcodeScanner.prototype.addChar = function(char) {
      var _ref;
      if ((_ref = this.buffer) == null) {
        this.buffer = "";
      }
      this.buffer += char;
      window.clearTimeout(this.timer);
      return this.timer = window.setTimeout((function() {
        return this.buffer = null;
      }), this.delay);
    };

    BarcodeScanner.prototype.addAction = function(string, callback) {
      var regexp;
      string = "^" + (string.replace(/\(.*?\)/ig, "(\\S*)")) + "$";
      regexp = new RegExp(string);
      return this.actions.push({
        regexp: regexp,
        callback: callback
      });
    };

    BarcodeScanner.prototype.execute = function() {
      var action, activeElement, code, target;
      activeElement = $(document.activeElement);
      target = activeElement.is("input, textarea") ? activeElement : $("[data-barcode-scanner-target]:last");
      code = this.buffer;
      action = this.getAction(code);
      if (action != null) {
        action.callback.apply(target, this.getArguments(code, action));
      } else {
        target.val("").val(code).focus();
        this.submit(target);
      }
      return this.buffer = null;
    };

    BarcodeScanner.prototype.getAction = function(code) {
      var action, _i, _len, _ref;
      _ref = this.actions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        if (action.regexp.test(code)) {
          return action;
        }
      }
    };

    BarcodeScanner.prototype.getArguments = function(code, action) {
      var matches;
      matches = action.regexp.exec(code);
      return matches.slice(1, matches.length + 1 || 9e9);
    };

    BarcodeScanner.prototype.keyPress = function(e) {
      var char, charCode;
      if (e == null) {
        e = window.event;
      }
      charCode = typeof e.which === "number" ? e.which : e.keyCode;
      char = String.fromCharCode(charCode);
      if ((charCode === 13) && (this.buffer != null)) {
        e.preventDefault();
        return this.execute();
      } else {
        return this.addChar(char);
      }
    };

    BarcodeScanner.prototype.submit = function(target) {
      if (!target.closest("[data-prevent-barcode-scanner-submit]").length) {
        return target.closest("form").submit();
      }
    };

    return BarcodeScanner;

  })();

  window.BarcodeScanner = new BarcodeScanner();

  $(window).keypress(window.BarcodeScanner.keyPress);

}).call(this);
