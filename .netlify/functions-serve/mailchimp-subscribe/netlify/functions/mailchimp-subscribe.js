var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/superagent/node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/superagent/node_modules/debug/src/common.js"(exports2, module2) {
    "use strict";
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      Object.keys(env).forEach(function(key) {
        createDebug[key] = env[key];
      });
      createDebug.instances = [];
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        var hash = 0;
        for (var i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        var prevTime;
        function debug() {
          if (!debug.enabled) {
            return;
          }
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          var self = debug;
          var curr = Number(/* @__PURE__ */ new Date());
          var ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          var index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
            if (match === "%%") {
              return match;
            }
            index++;
            var formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              var val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          var logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.enabled = createDebug.enabled(namespace);
        debug.useColors = createDebug.useColors();
        debug.color = selectColor(namespace);
        debug.destroy = destroy;
        debug.extend = extend;
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        createDebug.instances.push(debug);
        return debug;
      }
      function destroy() {
        var index = createDebug.instances.indexOf(this);
        if (index !== -1) {
          createDebug.instances.splice(index, 1);
          return true;
        }
        return false;
      }
      function extend(namespace, delimiter) {
        return createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.names = [];
        createDebug.skips = [];
        var i;
        var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        var len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
        for (i = 0; i < createDebug.instances.length; i++) {
          var instance = createDebug.instances[i];
          instance.enabled = createDebug.enabled(instance.namespace);
        }
      }
      function disable() {
        createDebug.enable("");
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        var i;
        var len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/superagent/node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/superagent/node_modules/debug/src/browser.js"(exports2, module2) {
    "use strict";
    function _typeof(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      var c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    function log() {
      var _console;
      return (typeof console === "undefined" ? "undefined" : _typeof(console)) === "object" && console.log && (_console = console).log.apply(_console, arguments);
    }
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      var r;
      try {
        r = exports2.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports2);
    var formatters = module2.exports.formatters;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env) {
      if (env.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream) {
      const level = supportsColor(stream, stream && stream.isTTY);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/superagent/node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/superagent/node_modules/debug/src/node.js"(exports2, module2) {
    "use strict";
    var tty = require("tty");
    var util = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221];
      }
    } catch (error) {
    }
    var supportsColor;
    exports2.inspectOpts = Object.keys(process.env).filter(function(key) {
      return /^debug_/i.test(key);
    }).reduce(function(obj, key) {
      var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function(_, k) {
        return k.toUpperCase();
      });
      var val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      var name = this.namespace, useColors2 = this.useColors;
      if (useColors2) {
        var c = this.color;
        var colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        var prefix = "  ".concat(colorCode, ";1m").concat(name, " \x1B[0m");
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log() {
      return process.stderr.write(util.format.apply(util, arguments) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      var keys = Object.keys(exports2.inspectOpts);
      for (var i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common()(exports2);
    var formatters = module2.exports.formatters;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map(function(str) {
        return str.trim();
      }).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/superagent/node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/superagent/node_modules/debug/src/index.js"(exports2, module2) {
    "use strict";
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/formidable/lib/file.js
var require_file = __commonJS({
  "node_modules/formidable/lib/file.js"(exports2, module2) {
    if (global.GENTLY) require = GENTLY.hijack(require);
    var util = require("util");
    var fs = require("fs");
    var EventEmitter = require("events").EventEmitter;
    var crypto2 = require("crypto");
    function File2(properties) {
      EventEmitter.call(this);
      this.size = 0;
      this.path = null;
      this.name = null;
      this.type = null;
      this.hash = null;
      this.lastModifiedDate = null;
      this._writeStream = null;
      for (var key in properties) {
        this[key] = properties[key];
      }
      if (typeof this.hash === "string") {
        this.hash = crypto2.createHash(properties.hash);
      } else {
        this.hash = null;
      }
    }
    module2.exports = File2;
    util.inherits(File2, EventEmitter);
    File2.prototype.open = function() {
      this._writeStream = new fs.WriteStream(this.path);
    };
    File2.prototype.toJSON = function() {
      var json = {
        size: this.size,
        path: this.path,
        name: this.name,
        type: this.type,
        mtime: this.lastModifiedDate,
        length: this.length,
        filename: this.filename,
        mime: this.mime
      };
      if (this.hash && this.hash != "") {
        json.hash = this.hash;
      }
      return json;
    };
    File2.prototype.write = function(buffer, cb) {
      var self = this;
      if (self.hash) {
        self.hash.update(buffer);
      }
      if (this._writeStream.closed) {
        return cb();
      }
      this._writeStream.write(buffer, function() {
        self.lastModifiedDate = /* @__PURE__ */ new Date();
        self.size += buffer.length;
        self.emit("progress", self.size);
        cb();
      });
    };
    File2.prototype.end = function(cb) {
      var self = this;
      if (self.hash) {
        self.hash = self.hash.digest("hex");
      }
      this._writeStream.end(function() {
        self.emit("end");
        cb();
      });
    };
  }
});

// node_modules/formidable/lib/multipart_parser.js
var require_multipart_parser = __commonJS({
  "node_modules/formidable/lib/multipart_parser.js"(exports2) {
    var Buffer2 = require("buffer").Buffer;
    var s = 0;
    var S = {
      PARSER_UNINITIALIZED: s++,
      START: s++,
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      PART_END: s++,
      END: s++
    };
    var f = 1;
    var F = {
      PART_BOUNDARY: f,
      LAST_BOUNDARY: f *= 2
    };
    var LF = 10;
    var CR = 13;
    var SPACE = 32;
    var HYPHEN = 45;
    var COLON = 58;
    var A = 97;
    var Z = 122;
    var lower = function(c) {
      return c | 32;
    };
    for (s in S) {
      exports2[s] = S[s];
    }
    function MultipartParser() {
      this.boundary = null;
      this.boundaryChars = null;
      this.lookbehind = null;
      this.state = S.PARSER_UNINITIALIZED;
      this.index = null;
      this.flags = 0;
    }
    exports2.MultipartParser = MultipartParser;
    MultipartParser.stateToString = function(stateNumber) {
      for (var state in S) {
        var number = S[state];
        if (number === stateNumber) return state;
      }
    };
    MultipartParser.prototype.initWithBoundary = function(str) {
      this.boundary = new Buffer2(str.length + 4);
      this.boundary.write("\r\n--", 0);
      this.boundary.write(str, 4);
      this.lookbehind = new Buffer2(this.boundary.length + 8);
      this.state = S.START;
      this.boundaryChars = {};
      for (var i = 0; i < this.boundary.length; i++) {
        this.boundaryChars[this.boundary[i]] = true;
      }
    };
    MultipartParser.prototype.write = function(buffer) {
      var self = this, i = 0, len = buffer.length, prevIndex = this.index, index = this.index, state = this.state, flags = this.flags, lookbehind = this.lookbehind, boundary = this.boundary, boundaryChars = this.boundaryChars, boundaryLength = this.boundary.length, boundaryEnd = boundaryLength - 1, bufferLength = buffer.length, c, cl, mark = function(name) {
        self[name + "Mark"] = i;
      }, clear = function(name) {
        delete self[name + "Mark"];
      }, callback = function(name, buffer2, start, end) {
        if (start !== void 0 && start === end) {
          return;
        }
        var callbackSymbol = "on" + name.substr(0, 1).toUpperCase() + name.substr(1);
        if (callbackSymbol in self) {
          self[callbackSymbol](buffer2, start, end);
        }
      }, dataCallback = function(name, clear2) {
        var markSymbol = name + "Mark";
        if (!(markSymbol in self)) {
          return;
        }
        if (!clear2) {
          callback(name, buffer, self[markSymbol], buffer.length);
          self[markSymbol] = 0;
        } else {
          callback(name, buffer, self[markSymbol], i);
          delete self[markSymbol];
        }
      };
      for (i = 0; i < len; i++) {
        c = buffer[i];
        switch (state) {
          case S.PARSER_UNINITIALIZED:
            return i;
          case S.START:
            index = 0;
            state = S.START_BOUNDARY;
          case S.START_BOUNDARY:
            if (index == boundary.length - 2) {
              if (c == HYPHEN) {
                flags |= F.LAST_BOUNDARY;
              } else if (c != CR) {
                return i;
              }
              index++;
              break;
            } else if (index - 1 == boundary.length - 2) {
              if (flags & F.LAST_BOUNDARY && c == HYPHEN) {
                callback("end");
                state = S.END;
                flags = 0;
              } else if (!(flags & F.LAST_BOUNDARY) && c == LF) {
                index = 0;
                callback("partBegin");
                state = S.HEADER_FIELD_START;
              } else {
                return i;
              }
              break;
            }
            if (c != boundary[index + 2]) {
              index = -2;
            }
            if (c == boundary[index + 2]) {
              index++;
            }
            break;
          case S.HEADER_FIELD_START:
            state = S.HEADER_FIELD;
            mark("headerField");
            index = 0;
          case S.HEADER_FIELD:
            if (c == CR) {
              clear("headerField");
              state = S.HEADERS_ALMOST_DONE;
              break;
            }
            index++;
            if (c == HYPHEN) {
              break;
            }
            if (c == COLON) {
              if (index == 1) {
                return i;
              }
              dataCallback("headerField", true);
              state = S.HEADER_VALUE_START;
              break;
            }
            cl = lower(c);
            if (cl < A || cl > Z) {
              return i;
            }
            break;
          case S.HEADER_VALUE_START:
            if (c == SPACE) {
              break;
            }
            mark("headerValue");
            state = S.HEADER_VALUE;
          case S.HEADER_VALUE:
            if (c == CR) {
              dataCallback("headerValue", true);
              callback("headerEnd");
              state = S.HEADER_VALUE_ALMOST_DONE;
            }
            break;
          case S.HEADER_VALUE_ALMOST_DONE:
            if (c != LF) {
              return i;
            }
            state = S.HEADER_FIELD_START;
            break;
          case S.HEADERS_ALMOST_DONE:
            if (c != LF) {
              return i;
            }
            callback("headersEnd");
            state = S.PART_DATA_START;
            break;
          case S.PART_DATA_START:
            state = S.PART_DATA;
            mark("partData");
          case S.PART_DATA:
            prevIndex = index;
            if (index === 0) {
              i += boundaryEnd;
              while (i < bufferLength && !(buffer[i] in boundaryChars)) {
                i += boundaryLength;
              }
              i -= boundaryEnd;
              c = buffer[i];
            }
            if (index < boundary.length) {
              if (boundary[index] == c) {
                if (index === 0) {
                  dataCallback("partData", true);
                }
                index++;
              } else {
                index = 0;
              }
            } else if (index == boundary.length) {
              index++;
              if (c == CR) {
                flags |= F.PART_BOUNDARY;
              } else if (c == HYPHEN) {
                flags |= F.LAST_BOUNDARY;
              } else {
                index = 0;
              }
            } else if (index - 1 == boundary.length) {
              if (flags & F.PART_BOUNDARY) {
                index = 0;
                if (c == LF) {
                  flags &= ~F.PART_BOUNDARY;
                  callback("partEnd");
                  callback("partBegin");
                  state = S.HEADER_FIELD_START;
                  break;
                }
              } else if (flags & F.LAST_BOUNDARY) {
                if (c == HYPHEN) {
                  callback("partEnd");
                  callback("end");
                  state = S.END;
                  flags = 0;
                } else {
                  index = 0;
                }
              } else {
                index = 0;
              }
            }
            if (index > 0) {
              lookbehind[index - 1] = c;
            } else if (prevIndex > 0) {
              callback("partData", lookbehind, 0, prevIndex);
              prevIndex = 0;
              mark("partData");
              i--;
            }
            break;
          case S.END:
            break;
          default:
            return i;
        }
      }
      dataCallback("headerField");
      dataCallback("headerValue");
      dataCallback("partData");
      this.index = index;
      this.state = state;
      this.flags = flags;
      return len;
    };
    MultipartParser.prototype.end = function() {
      var callback = function(self, name) {
        var callbackSymbol = "on" + name.substr(0, 1).toUpperCase() + name.substr(1);
        if (callbackSymbol in self) {
          self[callbackSymbol]();
        }
      };
      if (this.state == S.HEADER_FIELD_START && this.index === 0 || this.state == S.PART_DATA && this.index == this.boundary.length) {
        callback(this, "partEnd");
        callback(this, "end");
      } else if (this.state != S.END) {
        return new Error("MultipartParser.end(): stream ended unexpectedly: " + this.explain());
      }
    };
    MultipartParser.prototype.explain = function() {
      return "state = " + MultipartParser.stateToString(this.state);
    };
  }
});

// node_modules/formidable/lib/querystring_parser.js
var require_querystring_parser = __commonJS({
  "node_modules/formidable/lib/querystring_parser.js"(exports2) {
    if (global.GENTLY) require = GENTLY.hijack(require);
    var querystring = require("querystring");
    function QuerystringParser(maxKeys) {
      this.maxKeys = maxKeys;
      this.buffer = "";
    }
    exports2.QuerystringParser = QuerystringParser;
    QuerystringParser.prototype.write = function(buffer) {
      this.buffer += buffer.toString("ascii");
      return buffer.length;
    };
    QuerystringParser.prototype.end = function() {
      var fields = querystring.parse(this.buffer, "&", "=", { maxKeys: this.maxKeys });
      for (var field in fields) {
        this.onField(field, fields[field]);
      }
      this.buffer = "";
      this.onEnd();
    };
  }
});

// node_modules/formidable/lib/octet_parser.js
var require_octet_parser = __commonJS({
  "node_modules/formidable/lib/octet_parser.js"(exports2) {
    var EventEmitter = require("events").EventEmitter;
    var util = require("util");
    function OctetParser(options) {
      if (!(this instanceof OctetParser)) return new OctetParser(options);
      EventEmitter.call(this);
    }
    util.inherits(OctetParser, EventEmitter);
    exports2.OctetParser = OctetParser;
    OctetParser.prototype.write = function(buffer) {
      this.emit("data", buffer);
      return buffer.length;
    };
    OctetParser.prototype.end = function() {
      this.emit("end");
    };
  }
});

// node_modules/formidable/lib/json_parser.js
var require_json_parser = __commonJS({
  "node_modules/formidable/lib/json_parser.js"(exports2) {
    if (global.GENTLY) require = GENTLY.hijack(require);
    var Buffer2 = require("buffer").Buffer;
    function JSONParser(parent) {
      this.parent = parent;
      this.chunks = [];
      this.bytesWritten = 0;
    }
    exports2.JSONParser = JSONParser;
    JSONParser.prototype.write = function(buffer) {
      this.bytesWritten += buffer.length;
      this.chunks.push(buffer);
      return buffer.length;
    };
    JSONParser.prototype.end = function() {
      try {
        var fields = JSON.parse(Buffer2.concat(this.chunks));
        for (var field in fields) {
          this.onField(field, fields[field]);
        }
      } catch (e) {
        this.parent.emit("error", e);
      }
      this.data = null;
      this.onEnd();
    };
  }
});

// node_modules/formidable/lib/incoming_form.js
var require_incoming_form = __commonJS({
  "node_modules/formidable/lib/incoming_form.js"(exports2) {
    if (global.GENTLY) require = GENTLY.hijack(require);
    var crypto2 = require("crypto");
    var fs = require("fs");
    var util = require("util");
    var path = require("path");
    var File2 = require_file();
    var MultipartParser = require_multipart_parser().MultipartParser;
    var QuerystringParser = require_querystring_parser().QuerystringParser;
    var OctetParser = require_octet_parser().OctetParser;
    var JSONParser = require_json_parser().JSONParser;
    var StringDecoder = require("string_decoder").StringDecoder;
    var EventEmitter = require("events").EventEmitter;
    var Stream = require("stream").Stream;
    var os = require("os");
    function IncomingForm(opts) {
      if (!(this instanceof IncomingForm)) return new IncomingForm(opts);
      EventEmitter.call(this);
      opts = opts || {};
      this.error = null;
      this.ended = false;
      this.maxFields = opts.maxFields || 1e3;
      this.maxFieldsSize = opts.maxFieldsSize || 20 * 1024 * 1024;
      this.maxFileSize = opts.maxFileSize || 200 * 1024 * 1024;
      this.keepExtensions = opts.keepExtensions || false;
      this.uploadDir = opts.uploadDir || os.tmpdir && os.tmpdir() || os.tmpDir();
      this.encoding = opts.encoding || "utf-8";
      this.headers = null;
      this.type = null;
      this.hash = opts.hash || false;
      this.multiples = opts.multiples || false;
      this.bytesReceived = null;
      this.bytesExpected = null;
      this._parser = null;
      this._flushing = 0;
      this._fieldsSize = 0;
      this._fileSize = 0;
      this.openedFiles = [];
      return this;
    }
    util.inherits(IncomingForm, EventEmitter);
    exports2.IncomingForm = IncomingForm;
    IncomingForm.prototype.parse = function(req, cb) {
      this.pause = function() {
        try {
          req.pause();
        } catch (err) {
          if (!this.ended) {
            this._error(err);
          }
          return false;
        }
        return true;
      };
      this.resume = function() {
        try {
          req.resume();
        } catch (err) {
          if (!this.ended) {
            this._error(err);
          }
          return false;
        }
        return true;
      };
      if (cb) {
        var fields = {}, files = {};
        this.on("field", function(name, value) {
          fields[name] = value;
        }).on("file", function(name, file) {
          if (this.multiples) {
            if (files[name]) {
              if (!Array.isArray(files[name])) {
                files[name] = [files[name]];
              }
              files[name].push(file);
            } else {
              files[name] = file;
            }
          } else {
            files[name] = file;
          }
        }).on("error", function(err) {
          cb(err, fields, files);
        }).on("end", function() {
          cb(null, fields, files);
        });
      }
      this.writeHeaders(req.headers);
      var self = this;
      req.on("error", function(err) {
        self._error(err);
      }).on("aborted", function() {
        self.emit("aborted");
        self._error(new Error("Request aborted"));
      }).on("data", function(buffer) {
        self.write(buffer);
      }).on("end", function() {
        if (self.error) {
          return;
        }
        var err = self._parser.end();
        if (err) {
          self._error(err);
        }
      });
      return this;
    };
    IncomingForm.prototype.writeHeaders = function(headers) {
      this.headers = headers;
      this._parseContentLength();
      this._parseContentType();
    };
    IncomingForm.prototype.write = function(buffer) {
      if (this.error) {
        return;
      }
      if (!this._parser) {
        this._error(new Error("uninitialized parser"));
        return;
      }
      if (typeof this._parser.write !== "function") {
        this._error(new Error("did not expect data"));
        return;
      }
      this.bytesReceived += buffer.length;
      this.emit("progress", this.bytesReceived, this.bytesExpected);
      var bytesParsed = this._parser.write(buffer);
      if (bytesParsed !== buffer.length) {
        this._error(new Error("parser error, " + bytesParsed + " of " + buffer.length + " bytes parsed"));
      }
      return bytesParsed;
    };
    IncomingForm.prototype.pause = function() {
      return false;
    };
    IncomingForm.prototype.resume = function() {
      return false;
    };
    IncomingForm.prototype.onPart = function(part) {
      this.handlePart(part);
    };
    IncomingForm.prototype.handlePart = function(part) {
      var self = this;
      if (part.filename === void 0) {
        var value = "", decoder = new StringDecoder(this.encoding);
        part.on("data", function(buffer) {
          self._fieldsSize += buffer.length;
          if (self._fieldsSize > self.maxFieldsSize) {
            self._error(new Error("maxFieldsSize exceeded, received " + self._fieldsSize + " bytes of field data"));
            return;
          }
          value += decoder.write(buffer);
        });
        part.on("end", function() {
          self.emit("field", part.name, value);
        });
        return;
      }
      this._flushing++;
      var file = new File2({
        path: this._uploadPath(part.filename),
        name: part.filename,
        type: part.mime,
        hash: self.hash
      });
      this.emit("fileBegin", part.name, file);
      file.open();
      this.openedFiles.push(file);
      part.on("data", function(buffer) {
        self._fileSize += buffer.length;
        if (self._fileSize > self.maxFileSize) {
          self._error(new Error("maxFileSize exceeded, received " + self._fileSize + " bytes of file data"));
          return;
        }
        if (buffer.length == 0) {
          return;
        }
        self.pause();
        file.write(buffer, function() {
          self.resume();
        });
      });
      part.on("end", function() {
        file.end(function() {
          self._flushing--;
          self.emit("file", part.name, file);
          self._maybeEnd();
        });
      });
    };
    function dummyParser(self) {
      return {
        end: function() {
          self.ended = true;
          self._maybeEnd();
          return null;
        }
      };
    }
    IncomingForm.prototype._parseContentType = function() {
      if (this.bytesExpected === 0) {
        this._parser = dummyParser(this);
        return;
      }
      if (!this.headers["content-type"]) {
        this._error(new Error("bad content-type header, no content-type"));
        return;
      }
      if (this.headers["content-type"].match(/octet-stream/i)) {
        this._initOctetStream();
        return;
      }
      if (this.headers["content-type"].match(/urlencoded/i)) {
        this._initUrlencoded();
        return;
      }
      if (this.headers["content-type"].match(/multipart/i)) {
        var m = this.headers["content-type"].match(/boundary=(?:"([^"]+)"|([^;]+))/i);
        if (m) {
          this._initMultipart(m[1] || m[2]);
        } else {
          this._error(new Error("bad content-type header, no multipart boundary"));
        }
        return;
      }
      if (this.headers["content-type"].match(/json/i)) {
        this._initJSONencoded();
        return;
      }
      this._error(new Error("bad content-type header, unknown content-type: " + this.headers["content-type"]));
    };
    IncomingForm.prototype._error = function(err) {
      if (this.error || this.ended) {
        return;
      }
      this.error = err;
      this.emit("error", err);
      if (Array.isArray(this.openedFiles)) {
        this.openedFiles.forEach(function(file) {
          file._writeStream.on("error", function() {
          }).destroy();
          setTimeout(fs.unlink, 0, file.path, function(error) {
          });
        });
      }
    };
    IncomingForm.prototype._parseContentLength = function() {
      this.bytesReceived = 0;
      if (this.headers["content-length"]) {
        this.bytesExpected = parseInt(this.headers["content-length"], 10);
      } else if (this.headers["transfer-encoding"] === void 0) {
        this.bytesExpected = 0;
      }
      if (this.bytesExpected !== null) {
        this.emit("progress", this.bytesReceived, this.bytesExpected);
      }
    };
    IncomingForm.prototype._newParser = function() {
      return new MultipartParser();
    };
    IncomingForm.prototype._initMultipart = function(boundary) {
      this.type = "multipart";
      var parser = new MultipartParser(), self = this, headerField, headerValue, part;
      parser.initWithBoundary(boundary);
      parser.onPartBegin = function() {
        part = new Stream();
        part.readable = true;
        part.headers = {};
        part.name = null;
        part.filename = null;
        part.mime = null;
        part.transferEncoding = "binary";
        part.transferBuffer = "";
        headerField = "";
        headerValue = "";
      };
      parser.onHeaderField = function(b, start, end) {
        headerField += b.toString(self.encoding, start, end);
      };
      parser.onHeaderValue = function(b, start, end) {
        headerValue += b.toString(self.encoding, start, end);
      };
      parser.onHeaderEnd = function() {
        headerField = headerField.toLowerCase();
        part.headers[headerField] = headerValue;
        var m = headerValue.match(/\bname=("([^"]*)"|([^\(\)<>@,;:\\"\/\[\]\?=\{\}\s\t/]+))/i);
        if (headerField == "content-disposition") {
          if (m) {
            part.name = m[2] || m[3] || "";
          }
          part.filename = self._fileName(headerValue);
        } else if (headerField == "content-type") {
          part.mime = headerValue;
        } else if (headerField == "content-transfer-encoding") {
          part.transferEncoding = headerValue.toLowerCase();
        }
        headerField = "";
        headerValue = "";
      };
      parser.onHeadersEnd = function() {
        switch (part.transferEncoding) {
          case "binary":
          case "7bit":
          case "8bit":
            parser.onPartData = function(b, start, end) {
              part.emit("data", b.slice(start, end));
            };
            parser.onPartEnd = function() {
              part.emit("end");
            };
            break;
          case "base64":
            parser.onPartData = function(b, start, end) {
              part.transferBuffer += b.slice(start, end).toString("ascii");
              var offset = parseInt(part.transferBuffer.length / 4, 10) * 4;
              part.emit("data", new Buffer(part.transferBuffer.substring(0, offset), "base64"));
              part.transferBuffer = part.transferBuffer.substring(offset);
            };
            parser.onPartEnd = function() {
              part.emit("data", new Buffer(part.transferBuffer, "base64"));
              part.emit("end");
            };
            break;
          default:
            return self._error(new Error("unknown transfer-encoding"));
        }
        self.onPart(part);
      };
      parser.onEnd = function() {
        self.ended = true;
        self._maybeEnd();
      };
      this._parser = parser;
    };
    IncomingForm.prototype._fileName = function(headerValue) {
      var m = headerValue.match(/\bfilename=("(.*?)"|([^\(\)<>@,;:\\"\/\[\]\?=\{\}\s\t/]+))($|;\s)/i);
      if (!m) return;
      var match = m[2] || m[3] || "";
      var filename = match.substr(match.lastIndexOf("\\") + 1);
      filename = filename.replace(/%22/g, '"');
      filename = filename.replace(/&#([\d]{4});/g, function(m2, code) {
        return String.fromCharCode(code);
      });
      return filename;
    };
    IncomingForm.prototype._initUrlencoded = function() {
      this.type = "urlencoded";
      var parser = new QuerystringParser(this.maxFields), self = this;
      parser.onField = function(key, val) {
        self.emit("field", key, val);
      };
      parser.onEnd = function() {
        self.ended = true;
        self._maybeEnd();
      };
      this._parser = parser;
    };
    IncomingForm.prototype._initOctetStream = function() {
      this.type = "octet-stream";
      var filename = this.headers["x-file-name"];
      var mime = this.headers["content-type"];
      var file = new File2({
        path: this._uploadPath(filename),
        name: filename,
        type: mime
      });
      this.emit("fileBegin", filename, file);
      file.open();
      this.openedFiles.push(file);
      this._flushing++;
      var self = this;
      self._parser = new OctetParser();
      var outstandingWrites = 0;
      self._parser.on("data", function(buffer) {
        self.pause();
        outstandingWrites++;
        file.write(buffer, function() {
          outstandingWrites--;
          self.resume();
          if (self.ended) {
            self._parser.emit("doneWritingFile");
          }
        });
      });
      self._parser.on("end", function() {
        self._flushing--;
        self.ended = true;
        var done = function() {
          file.end(function() {
            self.emit("file", "file", file);
            self._maybeEnd();
          });
        };
        if (outstandingWrites === 0) {
          done();
        } else {
          self._parser.once("doneWritingFile", done);
        }
      });
    };
    IncomingForm.prototype._initJSONencoded = function() {
      this.type = "json";
      var parser = new JSONParser(this), self = this;
      parser.onField = function(key, val) {
        self.emit("field", key, val);
      };
      parser.onEnd = function() {
        self.ended = true;
        self._maybeEnd();
      };
      this._parser = parser;
    };
    IncomingForm.prototype._uploadPath = function(filename) {
      var buf = crypto2.randomBytes(16);
      var name = "upload_" + buf.toString("hex");
      if (this.keepExtensions) {
        var ext = path.extname(filename);
        ext = ext.replace(/(\.[a-z0-9]+).*/i, "$1");
        name += ext;
      }
      return path.join(this.uploadDir, name);
    };
    IncomingForm.prototype._maybeEnd = function() {
      if (!this.ended || this._flushing || this.error) {
        return;
      }
      this.emit("end");
    };
  }
});

// node_modules/formidable/lib/index.js
var require_lib = __commonJS({
  "node_modules/formidable/lib/index.js"(exports2, module2) {
    var IncomingForm = require_incoming_form().IncomingForm;
    IncomingForm.IncomingForm = IncomingForm;
    module2.exports = IncomingForm;
  }
});

// node_modules/delayed-stream/lib/delayed_stream.js
var require_delayed_stream = __commonJS({
  "node_modules/delayed-stream/lib/delayed_stream.js"(exports2, module2) {
    var Stream = require("stream").Stream;
    var util = require("util");
    module2.exports = DelayedStream;
    function DelayedStream() {
      this.source = null;
      this.dataSize = 0;
      this.maxDataSize = 1024 * 1024;
      this.pauseStream = true;
      this._maxDataSizeExceeded = false;
      this._released = false;
      this._bufferedEvents = [];
    }
    util.inherits(DelayedStream, Stream);
    DelayedStream.create = function(source, options) {
      var delayedStream = new this();
      options = options || {};
      for (var option in options) {
        delayedStream[option] = options[option];
      }
      delayedStream.source = source;
      var realEmit = source.emit;
      source.emit = function() {
        delayedStream._handleEmit(arguments);
        return realEmit.apply(source, arguments);
      };
      source.on("error", function() {
      });
      if (delayedStream.pauseStream) {
        source.pause();
      }
      return delayedStream;
    };
    Object.defineProperty(DelayedStream.prototype, "readable", {
      configurable: true,
      enumerable: true,
      get: function() {
        return this.source.readable;
      }
    });
    DelayedStream.prototype.setEncoding = function() {
      return this.source.setEncoding.apply(this.source, arguments);
    };
    DelayedStream.prototype.resume = function() {
      if (!this._released) {
        this.release();
      }
      this.source.resume();
    };
    DelayedStream.prototype.pause = function() {
      this.source.pause();
    };
    DelayedStream.prototype.release = function() {
      this._released = true;
      this._bufferedEvents.forEach(function(args) {
        this.emit.apply(this, args);
      }.bind(this));
      this._bufferedEvents = [];
    };
    DelayedStream.prototype.pipe = function() {
      var r = Stream.prototype.pipe.apply(this, arguments);
      this.resume();
      return r;
    };
    DelayedStream.prototype._handleEmit = function(args) {
      if (this._released) {
        this.emit.apply(this, args);
        return;
      }
      if (args[0] === "data") {
        this.dataSize += args[1].length;
        this._checkIfMaxDataSizeExceeded();
      }
      this._bufferedEvents.push(args);
    };
    DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
      if (this._maxDataSizeExceeded) {
        return;
      }
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      this._maxDataSizeExceeded = true;
      var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this.emit("error", new Error(message));
    };
  }
});

// node_modules/combined-stream/lib/combined_stream.js
var require_combined_stream = __commonJS({
  "node_modules/combined-stream/lib/combined_stream.js"(exports2, module2) {
    var util = require("util");
    var Stream = require("stream").Stream;
    var DelayedStream = require_delayed_stream();
    module2.exports = CombinedStream;
    function CombinedStream() {
      this.writable = false;
      this.readable = true;
      this.dataSize = 0;
      this.maxDataSize = 2 * 1024 * 1024;
      this.pauseStreams = true;
      this._released = false;
      this._streams = [];
      this._currentStream = null;
      this._insideLoop = false;
      this._pendingNext = false;
    }
    util.inherits(CombinedStream, Stream);
    CombinedStream.create = function(options) {
      var combinedStream = new this();
      options = options || {};
      for (var option in options) {
        combinedStream[option] = options[option];
      }
      return combinedStream;
    };
    CombinedStream.isStreamLike = function(stream) {
      return typeof stream !== "function" && typeof stream !== "string" && typeof stream !== "boolean" && typeof stream !== "number" && !Buffer.isBuffer(stream);
    };
    CombinedStream.prototype.append = function(stream) {
      var isStreamLike = CombinedStream.isStreamLike(stream);
      if (isStreamLike) {
        if (!(stream instanceof DelayedStream)) {
          var newStream = DelayedStream.create(stream, {
            maxDataSize: Infinity,
            pauseStream: this.pauseStreams
          });
          stream.on("data", this._checkDataSize.bind(this));
          stream = newStream;
        }
        this._handleErrors(stream);
        if (this.pauseStreams) {
          stream.pause();
        }
      }
      this._streams.push(stream);
      return this;
    };
    CombinedStream.prototype.pipe = function(dest, options) {
      Stream.prototype.pipe.call(this, dest, options);
      this.resume();
      return dest;
    };
    CombinedStream.prototype._getNext = function() {
      this._currentStream = null;
      if (this._insideLoop) {
        this._pendingNext = true;
        return;
      }
      this._insideLoop = true;
      try {
        do {
          this._pendingNext = false;
          this._realGetNext();
        } while (this._pendingNext);
      } finally {
        this._insideLoop = false;
      }
    };
    CombinedStream.prototype._realGetNext = function() {
      var stream = this._streams.shift();
      if (typeof stream == "undefined") {
        this.end();
        return;
      }
      if (typeof stream !== "function") {
        this._pipeNext(stream);
        return;
      }
      var getStream = stream;
      getStream(function(stream2) {
        var isStreamLike = CombinedStream.isStreamLike(stream2);
        if (isStreamLike) {
          stream2.on("data", this._checkDataSize.bind(this));
          this._handleErrors(stream2);
        }
        this._pipeNext(stream2);
      }.bind(this));
    };
    CombinedStream.prototype._pipeNext = function(stream) {
      this._currentStream = stream;
      var isStreamLike = CombinedStream.isStreamLike(stream);
      if (isStreamLike) {
        stream.on("end", this._getNext.bind(this));
        stream.pipe(this, { end: false });
        return;
      }
      var value = stream;
      this.write(value);
      this._getNext();
    };
    CombinedStream.prototype._handleErrors = function(stream) {
      var self = this;
      stream.on("error", function(err) {
        self._emitError(err);
      });
    };
    CombinedStream.prototype.write = function(data) {
      this.emit("data", data);
    };
    CombinedStream.prototype.pause = function() {
      if (!this.pauseStreams) {
        return;
      }
      if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function") this._currentStream.pause();
      this.emit("pause");
    };
    CombinedStream.prototype.resume = function() {
      if (!this._released) {
        this._released = true;
        this.writable = true;
        this._getNext();
      }
      if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function") this._currentStream.resume();
      this.emit("resume");
    };
    CombinedStream.prototype.end = function() {
      this._reset();
      this.emit("end");
    };
    CombinedStream.prototype.destroy = function() {
      this._reset();
      this.emit("close");
    };
    CombinedStream.prototype._reset = function() {
      this.writable = false;
      this._streams = [];
      this._currentStream = null;
    };
    CombinedStream.prototype._checkDataSize = function() {
      this._updateDataSize();
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this._emitError(new Error(message));
    };
    CombinedStream.prototype._updateDataSize = function() {
      this.dataSize = 0;
      var self = this;
      this._streams.forEach(function(stream) {
        if (!stream.dataSize) {
          return;
        }
        self.dataSize += stream.dataSize;
      });
      if (this._currentStream && this._currentStream.dataSize) {
        this.dataSize += this._currentStream.dataSize;
      }
    };
    CombinedStream.prototype._emitError = function(err) {
      this._reset();
      this.emit("error", err);
    };
  }
});

// node_modules/mime-db/db.json
var require_db = __commonJS({
  "node_modules/mime-db/db.json"(exports2, module2) {
    module2.exports = {
      "application/1d-interleaved-parityfec": {
        source: "iana"
      },
      "application/3gpdash-qoe-report+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/3gpp-ims+xml": {
        source: "iana",
        compressible: true
      },
      "application/3gpphal+json": {
        source: "iana",
        compressible: true
      },
      "application/3gpphalforms+json": {
        source: "iana",
        compressible: true
      },
      "application/a2l": {
        source: "iana"
      },
      "application/ace+cbor": {
        source: "iana"
      },
      "application/activemessage": {
        source: "iana"
      },
      "application/activity+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-directory+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcost+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcostparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointprop+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointpropparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-error+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamcontrol+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamparams+json": {
        source: "iana",
        compressible: true
      },
      "application/aml": {
        source: "iana"
      },
      "application/andrew-inset": {
        source: "iana",
        extensions: ["ez"]
      },
      "application/applefile": {
        source: "iana"
      },
      "application/applixware": {
        source: "apache",
        extensions: ["aw"]
      },
      "application/at+jwt": {
        source: "iana"
      },
      "application/atf": {
        source: "iana"
      },
      "application/atfx": {
        source: "iana"
      },
      "application/atom+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atom"]
      },
      "application/atomcat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomcat"]
      },
      "application/atomdeleted+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomdeleted"]
      },
      "application/atomicmail": {
        source: "iana"
      },
      "application/atomsvc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomsvc"]
      },
      "application/atsc-dwd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dwd"]
      },
      "application/atsc-dynamic-event-message": {
        source: "iana"
      },
      "application/atsc-held+xml": {
        source: "iana",
        compressible: true,
        extensions: ["held"]
      },
      "application/atsc-rdt+json": {
        source: "iana",
        compressible: true
      },
      "application/atsc-rsat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsat"]
      },
      "application/atxml": {
        source: "iana"
      },
      "application/auth-policy+xml": {
        source: "iana",
        compressible: true
      },
      "application/bacnet-xdd+zip": {
        source: "iana",
        compressible: false
      },
      "application/batch-smtp": {
        source: "iana"
      },
      "application/bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/beep+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/calendar+json": {
        source: "iana",
        compressible: true
      },
      "application/calendar+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xcs"]
      },
      "application/call-completion": {
        source: "iana"
      },
      "application/cals-1840": {
        source: "iana"
      },
      "application/captive+json": {
        source: "iana",
        compressible: true
      },
      "application/cbor": {
        source: "iana"
      },
      "application/cbor-seq": {
        source: "iana"
      },
      "application/cccex": {
        source: "iana"
      },
      "application/ccmp+xml": {
        source: "iana",
        compressible: true
      },
      "application/ccxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ccxml"]
      },
      "application/cdfx+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdfx"]
      },
      "application/cdmi-capability": {
        source: "iana",
        extensions: ["cdmia"]
      },
      "application/cdmi-container": {
        source: "iana",
        extensions: ["cdmic"]
      },
      "application/cdmi-domain": {
        source: "iana",
        extensions: ["cdmid"]
      },
      "application/cdmi-object": {
        source: "iana",
        extensions: ["cdmio"]
      },
      "application/cdmi-queue": {
        source: "iana",
        extensions: ["cdmiq"]
      },
      "application/cdni": {
        source: "iana"
      },
      "application/cea": {
        source: "iana"
      },
      "application/cea-2018+xml": {
        source: "iana",
        compressible: true
      },
      "application/cellml+xml": {
        source: "iana",
        compressible: true
      },
      "application/cfw": {
        source: "iana"
      },
      "application/city+json": {
        source: "iana",
        compressible: true
      },
      "application/clr": {
        source: "iana"
      },
      "application/clue+xml": {
        source: "iana",
        compressible: true
      },
      "application/clue_info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cms": {
        source: "iana"
      },
      "application/cnrp+xml": {
        source: "iana",
        compressible: true
      },
      "application/coap-group+json": {
        source: "iana",
        compressible: true
      },
      "application/coap-payload": {
        source: "iana"
      },
      "application/commonground": {
        source: "iana"
      },
      "application/conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cose": {
        source: "iana"
      },
      "application/cose-key": {
        source: "iana"
      },
      "application/cose-key-set": {
        source: "iana"
      },
      "application/cpl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cpl"]
      },
      "application/csrattrs": {
        source: "iana"
      },
      "application/csta+xml": {
        source: "iana",
        compressible: true
      },
      "application/cstadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/csvm+json": {
        source: "iana",
        compressible: true
      },
      "application/cu-seeme": {
        source: "apache",
        extensions: ["cu"]
      },
      "application/cwt": {
        source: "iana"
      },
      "application/cybercash": {
        source: "iana"
      },
      "application/dart": {
        compressible: true
      },
      "application/dash+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpd"]
      },
      "application/dash-patch+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpp"]
      },
      "application/dashdelta": {
        source: "iana"
      },
      "application/davmount+xml": {
        source: "iana",
        compressible: true,
        extensions: ["davmount"]
      },
      "application/dca-rft": {
        source: "iana"
      },
      "application/dcd": {
        source: "iana"
      },
      "application/dec-dx": {
        source: "iana"
      },
      "application/dialog-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/dicom": {
        source: "iana"
      },
      "application/dicom+json": {
        source: "iana",
        compressible: true
      },
      "application/dicom+xml": {
        source: "iana",
        compressible: true
      },
      "application/dii": {
        source: "iana"
      },
      "application/dit": {
        source: "iana"
      },
      "application/dns": {
        source: "iana"
      },
      "application/dns+json": {
        source: "iana",
        compressible: true
      },
      "application/dns-message": {
        source: "iana"
      },
      "application/docbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dbk"]
      },
      "application/dots+cbor": {
        source: "iana"
      },
      "application/dskpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/dssc+der": {
        source: "iana",
        extensions: ["dssc"]
      },
      "application/dssc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdssc"]
      },
      "application/dvcs": {
        source: "iana"
      },
      "application/ecmascript": {
        source: "iana",
        compressible: true,
        extensions: ["es", "ecma"]
      },
      "application/edi-consent": {
        source: "iana"
      },
      "application/edi-x12": {
        source: "iana",
        compressible: false
      },
      "application/edifact": {
        source: "iana",
        compressible: false
      },
      "application/efi": {
        source: "iana"
      },
      "application/elm+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/elm+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.cap+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/emergencycalldata.comment+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.control+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.deviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.ecall.msd": {
        source: "iana"
      },
      "application/emergencycalldata.providerinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.serviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.subscriberinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.veds+xml": {
        source: "iana",
        compressible: true
      },
      "application/emma+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emma"]
      },
      "application/emotionml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emotionml"]
      },
      "application/encaprtp": {
        source: "iana"
      },
      "application/epp+xml": {
        source: "iana",
        compressible: true
      },
      "application/epub+zip": {
        source: "iana",
        compressible: false,
        extensions: ["epub"]
      },
      "application/eshop": {
        source: "iana"
      },
      "application/exi": {
        source: "iana",
        extensions: ["exi"]
      },
      "application/expect-ct-report+json": {
        source: "iana",
        compressible: true
      },
      "application/express": {
        source: "iana",
        extensions: ["exp"]
      },
      "application/fastinfoset": {
        source: "iana"
      },
      "application/fastsoap": {
        source: "iana"
      },
      "application/fdt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fdt"]
      },
      "application/fhir+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fhir+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fido.trusted-apps+json": {
        compressible: true
      },
      "application/fits": {
        source: "iana"
      },
      "application/flexfec": {
        source: "iana"
      },
      "application/font-sfnt": {
        source: "iana"
      },
      "application/font-tdpfr": {
        source: "iana",
        extensions: ["pfr"]
      },
      "application/font-woff": {
        source: "iana",
        compressible: false
      },
      "application/framework-attributes+xml": {
        source: "iana",
        compressible: true
      },
      "application/geo+json": {
        source: "iana",
        compressible: true,
        extensions: ["geojson"]
      },
      "application/geo+json-seq": {
        source: "iana"
      },
      "application/geopackage+sqlite3": {
        source: "iana"
      },
      "application/geoxacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/gltf-buffer": {
        source: "iana"
      },
      "application/gml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["gml"]
      },
      "application/gpx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["gpx"]
      },
      "application/gxf": {
        source: "apache",
        extensions: ["gxf"]
      },
      "application/gzip": {
        source: "iana",
        compressible: false,
        extensions: ["gz"]
      },
      "application/h224": {
        source: "iana"
      },
      "application/held+xml": {
        source: "iana",
        compressible: true
      },
      "application/hjson": {
        extensions: ["hjson"]
      },
      "application/http": {
        source: "iana"
      },
      "application/hyperstudio": {
        source: "iana",
        extensions: ["stk"]
      },
      "application/ibe-key-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pkg-reply+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pp-data": {
        source: "iana"
      },
      "application/iges": {
        source: "iana"
      },
      "application/im-iscomposing+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/index": {
        source: "iana"
      },
      "application/index.cmd": {
        source: "iana"
      },
      "application/index.obj": {
        source: "iana"
      },
      "application/index.response": {
        source: "iana"
      },
      "application/index.vnd": {
        source: "iana"
      },
      "application/inkml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ink", "inkml"]
      },
      "application/iotp": {
        source: "iana"
      },
      "application/ipfix": {
        source: "iana",
        extensions: ["ipfix"]
      },
      "application/ipp": {
        source: "iana"
      },
      "application/isup": {
        source: "iana"
      },
      "application/its+xml": {
        source: "iana",
        compressible: true,
        extensions: ["its"]
      },
      "application/java-archive": {
        source: "apache",
        compressible: false,
        extensions: ["jar", "war", "ear"]
      },
      "application/java-serialized-object": {
        source: "apache",
        compressible: false,
        extensions: ["ser"]
      },
      "application/java-vm": {
        source: "apache",
        compressible: false,
        extensions: ["class"]
      },
      "application/javascript": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["js", "mjs"]
      },
      "application/jf2feed+json": {
        source: "iana",
        compressible: true
      },
      "application/jose": {
        source: "iana"
      },
      "application/jose+json": {
        source: "iana",
        compressible: true
      },
      "application/jrd+json": {
        source: "iana",
        compressible: true
      },
      "application/jscalendar+json": {
        source: "iana",
        compressible: true
      },
      "application/json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["json", "map"]
      },
      "application/json-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/json-seq": {
        source: "iana"
      },
      "application/json5": {
        extensions: ["json5"]
      },
      "application/jsonml+json": {
        source: "apache",
        compressible: true,
        extensions: ["jsonml"]
      },
      "application/jwk+json": {
        source: "iana",
        compressible: true
      },
      "application/jwk-set+json": {
        source: "iana",
        compressible: true
      },
      "application/jwt": {
        source: "iana"
      },
      "application/kpml-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/kpml-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/ld+json": {
        source: "iana",
        compressible: true,
        extensions: ["jsonld"]
      },
      "application/lgr+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lgr"]
      },
      "application/link-format": {
        source: "iana"
      },
      "application/load-control+xml": {
        source: "iana",
        compressible: true
      },
      "application/lost+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lostxml"]
      },
      "application/lostsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/lpf+zip": {
        source: "iana",
        compressible: false
      },
      "application/lxf": {
        source: "iana"
      },
      "application/mac-binhex40": {
        source: "iana",
        extensions: ["hqx"]
      },
      "application/mac-compactpro": {
        source: "apache",
        extensions: ["cpt"]
      },
      "application/macwriteii": {
        source: "iana"
      },
      "application/mads+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mads"]
      },
      "application/manifest+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["webmanifest"]
      },
      "application/marc": {
        source: "iana",
        extensions: ["mrc"]
      },
      "application/marcxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mrcx"]
      },
      "application/mathematica": {
        source: "iana",
        extensions: ["ma", "nb", "mb"]
      },
      "application/mathml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mathml"]
      },
      "application/mathml-content+xml": {
        source: "iana",
        compressible: true
      },
      "application/mathml-presentation+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-associated-procedure-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-deregister+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-envelope+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-protection-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-reception-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-schedule+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-user-service-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbox": {
        source: "iana",
        extensions: ["mbox"]
      },
      "application/media-policy-dataset+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpf"]
      },
      "application/media_control+xml": {
        source: "iana",
        compressible: true
      },
      "application/mediaservercontrol+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mscml"]
      },
      "application/merge-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/metalink+xml": {
        source: "apache",
        compressible: true,
        extensions: ["metalink"]
      },
      "application/metalink4+xml": {
        source: "iana",
        compressible: true,
        extensions: ["meta4"]
      },
      "application/mets+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mets"]
      },
      "application/mf4": {
        source: "iana"
      },
      "application/mikey": {
        source: "iana"
      },
      "application/mipc": {
        source: "iana"
      },
      "application/missing-blocks+cbor-seq": {
        source: "iana"
      },
      "application/mmt-aei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["maei"]
      },
      "application/mmt-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musd"]
      },
      "application/mods+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mods"]
      },
      "application/moss-keys": {
        source: "iana"
      },
      "application/moss-signature": {
        source: "iana"
      },
      "application/mosskey-data": {
        source: "iana"
      },
      "application/mosskey-request": {
        source: "iana"
      },
      "application/mp21": {
        source: "iana",
        extensions: ["m21", "mp21"]
      },
      "application/mp4": {
        source: "iana",
        extensions: ["mp4s", "m4p"]
      },
      "application/mpeg4-generic": {
        source: "iana"
      },
      "application/mpeg4-iod": {
        source: "iana"
      },
      "application/mpeg4-iod-xmt": {
        source: "iana"
      },
      "application/mrb-consumer+xml": {
        source: "iana",
        compressible: true
      },
      "application/mrb-publish+xml": {
        source: "iana",
        compressible: true
      },
      "application/msc-ivr+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msc-mixer+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msword": {
        source: "iana",
        compressible: false,
        extensions: ["doc", "dot"]
      },
      "application/mud+json": {
        source: "iana",
        compressible: true
      },
      "application/multipart-core": {
        source: "iana"
      },
      "application/mxf": {
        source: "iana",
        extensions: ["mxf"]
      },
      "application/n-quads": {
        source: "iana",
        extensions: ["nq"]
      },
      "application/n-triples": {
        source: "iana",
        extensions: ["nt"]
      },
      "application/nasdata": {
        source: "iana"
      },
      "application/news-checkgroups": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-groupinfo": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-transmission": {
        source: "iana"
      },
      "application/nlsml+xml": {
        source: "iana",
        compressible: true
      },
      "application/node": {
        source: "iana",
        extensions: ["cjs"]
      },
      "application/nss": {
        source: "iana"
      },
      "application/oauth-authz-req+jwt": {
        source: "iana"
      },
      "application/oblivious-dns-message": {
        source: "iana"
      },
      "application/ocsp-request": {
        source: "iana"
      },
      "application/ocsp-response": {
        source: "iana"
      },
      "application/octet-stream": {
        source: "iana",
        compressible: false,
        extensions: ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"]
      },
      "application/oda": {
        source: "iana",
        extensions: ["oda"]
      },
      "application/odm+xml": {
        source: "iana",
        compressible: true
      },
      "application/odx": {
        source: "iana"
      },
      "application/oebps-package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["opf"]
      },
      "application/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogx"]
      },
      "application/omdoc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["omdoc"]
      },
      "application/onenote": {
        source: "apache",
        extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"]
      },
      "application/opc-nodeset+xml": {
        source: "iana",
        compressible: true
      },
      "application/oscore": {
        source: "iana"
      },
      "application/oxps": {
        source: "iana",
        extensions: ["oxps"]
      },
      "application/p21": {
        source: "iana"
      },
      "application/p21+zip": {
        source: "iana",
        compressible: false
      },
      "application/p2p-overlay+xml": {
        source: "iana",
        compressible: true,
        extensions: ["relo"]
      },
      "application/parityfec": {
        source: "iana"
      },
      "application/passport": {
        source: "iana"
      },
      "application/patch-ops-error+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xer"]
      },
      "application/pdf": {
        source: "iana",
        compressible: false,
        extensions: ["pdf"]
      },
      "application/pdx": {
        source: "iana"
      },
      "application/pem-certificate-chain": {
        source: "iana"
      },
      "application/pgp-encrypted": {
        source: "iana",
        compressible: false,
        extensions: ["pgp"]
      },
      "application/pgp-keys": {
        source: "iana",
        extensions: ["asc"]
      },
      "application/pgp-signature": {
        source: "iana",
        extensions: ["asc", "sig"]
      },
      "application/pics-rules": {
        source: "apache",
        extensions: ["prf"]
      },
      "application/pidf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pidf-diff+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pkcs10": {
        source: "iana",
        extensions: ["p10"]
      },
      "application/pkcs12": {
        source: "iana"
      },
      "application/pkcs7-mime": {
        source: "iana",
        extensions: ["p7m", "p7c"]
      },
      "application/pkcs7-signature": {
        source: "iana",
        extensions: ["p7s"]
      },
      "application/pkcs8": {
        source: "iana",
        extensions: ["p8"]
      },
      "application/pkcs8-encrypted": {
        source: "iana"
      },
      "application/pkix-attr-cert": {
        source: "iana",
        extensions: ["ac"]
      },
      "application/pkix-cert": {
        source: "iana",
        extensions: ["cer"]
      },
      "application/pkix-crl": {
        source: "iana",
        extensions: ["crl"]
      },
      "application/pkix-pkipath": {
        source: "iana",
        extensions: ["pkipath"]
      },
      "application/pkixcmp": {
        source: "iana",
        extensions: ["pki"]
      },
      "application/pls+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pls"]
      },
      "application/poc-settings+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/postscript": {
        source: "iana",
        compressible: true,
        extensions: ["ai", "eps", "ps"]
      },
      "application/ppsp-tracker+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+xml": {
        source: "iana",
        compressible: true
      },
      "application/provenance+xml": {
        source: "iana",
        compressible: true,
        extensions: ["provx"]
      },
      "application/prs.alvestrand.titrax-sheet": {
        source: "iana"
      },
      "application/prs.cww": {
        source: "iana",
        extensions: ["cww"]
      },
      "application/prs.cyn": {
        source: "iana",
        charset: "7-BIT"
      },
      "application/prs.hpub+zip": {
        source: "iana",
        compressible: false
      },
      "application/prs.nprend": {
        source: "iana"
      },
      "application/prs.plucker": {
        source: "iana"
      },
      "application/prs.rdf-xml-crypt": {
        source: "iana"
      },
      "application/prs.xsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/pskc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pskcxml"]
      },
      "application/pvd+json": {
        source: "iana",
        compressible: true
      },
      "application/qsig": {
        source: "iana"
      },
      "application/raml+yaml": {
        compressible: true,
        extensions: ["raml"]
      },
      "application/raptorfec": {
        source: "iana"
      },
      "application/rdap+json": {
        source: "iana",
        compressible: true
      },
      "application/rdf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rdf", "owl"]
      },
      "application/reginfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rif"]
      },
      "application/relax-ng-compact-syntax": {
        source: "iana",
        extensions: ["rnc"]
      },
      "application/remote-printing": {
        source: "iana"
      },
      "application/reputon+json": {
        source: "iana",
        compressible: true
      },
      "application/resource-lists+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rl"]
      },
      "application/resource-lists-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rld"]
      },
      "application/rfc+xml": {
        source: "iana",
        compressible: true
      },
      "application/riscos": {
        source: "iana"
      },
      "application/rlmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/rls-services+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rs"]
      },
      "application/route-apd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rapd"]
      },
      "application/route-s-tsid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sls"]
      },
      "application/route-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rusd"]
      },
      "application/rpki-ghostbusters": {
        source: "iana",
        extensions: ["gbr"]
      },
      "application/rpki-manifest": {
        source: "iana",
        extensions: ["mft"]
      },
      "application/rpki-publication": {
        source: "iana"
      },
      "application/rpki-roa": {
        source: "iana",
        extensions: ["roa"]
      },
      "application/rpki-updown": {
        source: "iana"
      },
      "application/rsd+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rsd"]
      },
      "application/rss+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rss"]
      },
      "application/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "application/rtploopback": {
        source: "iana"
      },
      "application/rtx": {
        source: "iana"
      },
      "application/samlassertion+xml": {
        source: "iana",
        compressible: true
      },
      "application/samlmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/sarif+json": {
        source: "iana",
        compressible: true
      },
      "application/sarif-external-properties+json": {
        source: "iana",
        compressible: true
      },
      "application/sbe": {
        source: "iana"
      },
      "application/sbml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sbml"]
      },
      "application/scaip+xml": {
        source: "iana",
        compressible: true
      },
      "application/scim+json": {
        source: "iana",
        compressible: true
      },
      "application/scvp-cv-request": {
        source: "iana",
        extensions: ["scq"]
      },
      "application/scvp-cv-response": {
        source: "iana",
        extensions: ["scs"]
      },
      "application/scvp-vp-request": {
        source: "iana",
        extensions: ["spq"]
      },
      "application/scvp-vp-response": {
        source: "iana",
        extensions: ["spp"]
      },
      "application/sdp": {
        source: "iana",
        extensions: ["sdp"]
      },
      "application/secevent+jwt": {
        source: "iana"
      },
      "application/senml+cbor": {
        source: "iana"
      },
      "application/senml+json": {
        source: "iana",
        compressible: true
      },
      "application/senml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["senmlx"]
      },
      "application/senml-etch+cbor": {
        source: "iana"
      },
      "application/senml-etch+json": {
        source: "iana",
        compressible: true
      },
      "application/senml-exi": {
        source: "iana"
      },
      "application/sensml+cbor": {
        source: "iana"
      },
      "application/sensml+json": {
        source: "iana",
        compressible: true
      },
      "application/sensml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sensmlx"]
      },
      "application/sensml-exi": {
        source: "iana"
      },
      "application/sep+xml": {
        source: "iana",
        compressible: true
      },
      "application/sep-exi": {
        source: "iana"
      },
      "application/session-info": {
        source: "iana"
      },
      "application/set-payment": {
        source: "iana"
      },
      "application/set-payment-initiation": {
        source: "iana",
        extensions: ["setpay"]
      },
      "application/set-registration": {
        source: "iana"
      },
      "application/set-registration-initiation": {
        source: "iana",
        extensions: ["setreg"]
      },
      "application/sgml": {
        source: "iana"
      },
      "application/sgml-open-catalog": {
        source: "iana"
      },
      "application/shf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["shf"]
      },
      "application/sieve": {
        source: "iana",
        extensions: ["siv", "sieve"]
      },
      "application/simple-filter+xml": {
        source: "iana",
        compressible: true
      },
      "application/simple-message-summary": {
        source: "iana"
      },
      "application/simplesymbolcontainer": {
        source: "iana"
      },
      "application/sipc": {
        source: "iana"
      },
      "application/slate": {
        source: "iana"
      },
      "application/smil": {
        source: "iana"
      },
      "application/smil+xml": {
        source: "iana",
        compressible: true,
        extensions: ["smi", "smil"]
      },
      "application/smpte336m": {
        source: "iana"
      },
      "application/soap+fastinfoset": {
        source: "iana"
      },
      "application/soap+xml": {
        source: "iana",
        compressible: true
      },
      "application/sparql-query": {
        source: "iana",
        extensions: ["rq"]
      },
      "application/sparql-results+xml": {
        source: "iana",
        compressible: true,
        extensions: ["srx"]
      },
      "application/spdx+json": {
        source: "iana",
        compressible: true
      },
      "application/spirits-event+xml": {
        source: "iana",
        compressible: true
      },
      "application/sql": {
        source: "iana"
      },
      "application/srgs": {
        source: "iana",
        extensions: ["gram"]
      },
      "application/srgs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["grxml"]
      },
      "application/sru+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sru"]
      },
      "application/ssdl+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ssdl"]
      },
      "application/ssml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ssml"]
      },
      "application/stix+json": {
        source: "iana",
        compressible: true
      },
      "application/swid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["swidtag"]
      },
      "application/tamp-apex-update": {
        source: "iana"
      },
      "application/tamp-apex-update-confirm": {
        source: "iana"
      },
      "application/tamp-community-update": {
        source: "iana"
      },
      "application/tamp-community-update-confirm": {
        source: "iana"
      },
      "application/tamp-error": {
        source: "iana"
      },
      "application/tamp-sequence-adjust": {
        source: "iana"
      },
      "application/tamp-sequence-adjust-confirm": {
        source: "iana"
      },
      "application/tamp-status-query": {
        source: "iana"
      },
      "application/tamp-status-response": {
        source: "iana"
      },
      "application/tamp-update": {
        source: "iana"
      },
      "application/tamp-update-confirm": {
        source: "iana"
      },
      "application/tar": {
        compressible: true
      },
      "application/taxii+json": {
        source: "iana",
        compressible: true
      },
      "application/td+json": {
        source: "iana",
        compressible: true
      },
      "application/tei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tei", "teicorpus"]
      },
      "application/tetra_isi": {
        source: "iana"
      },
      "application/thraud+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tfi"]
      },
      "application/timestamp-query": {
        source: "iana"
      },
      "application/timestamp-reply": {
        source: "iana"
      },
      "application/timestamped-data": {
        source: "iana",
        extensions: ["tsd"]
      },
      "application/tlsrpt+gzip": {
        source: "iana"
      },
      "application/tlsrpt+json": {
        source: "iana",
        compressible: true
      },
      "application/tnauthlist": {
        source: "iana"
      },
      "application/token-introspection+jwt": {
        source: "iana"
      },
      "application/toml": {
        compressible: true,
        extensions: ["toml"]
      },
      "application/trickle-ice-sdpfrag": {
        source: "iana"
      },
      "application/trig": {
        source: "iana",
        extensions: ["trig"]
      },
      "application/ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ttml"]
      },
      "application/tve-trigger": {
        source: "iana"
      },
      "application/tzif": {
        source: "iana"
      },
      "application/tzif-leap": {
        source: "iana"
      },
      "application/ubjson": {
        compressible: false,
        extensions: ["ubj"]
      },
      "application/ulpfec": {
        source: "iana"
      },
      "application/urc-grpsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/urc-ressheet+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsheet"]
      },
      "application/urc-targetdesc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["td"]
      },
      "application/urc-uisocketdesc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vcard+json": {
        source: "iana",
        compressible: true
      },
      "application/vcard+xml": {
        source: "iana",
        compressible: true
      },
      "application/vemmi": {
        source: "iana"
      },
      "application/vividence.scriptfile": {
        source: "apache"
      },
      "application/vnd.1000minds.decision-model+xml": {
        source: "iana",
        compressible: true,
        extensions: ["1km"]
      },
      "application/vnd.3gpp-prose+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-prose-pc3ch+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-v2x-local-service-information": {
        source: "iana"
      },
      "application/vnd.3gpp.5gnas": {
        source: "iana"
      },
      "application/vnd.3gpp.access-transfer-events+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.bsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gmop+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gtpc": {
        source: "iana"
      },
      "application/vnd.3gpp.interworking-data": {
        source: "iana"
      },
      "application/vnd.3gpp.lpp": {
        source: "iana"
      },
      "application/vnd.3gpp.mc-signalling-ear": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-payload": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-signalling": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-floor-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-signed+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-init-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-transmission-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mid-call+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ngap": {
        source: "iana"
      },
      "application/vnd.3gpp.pfcp": {
        source: "iana"
      },
      "application/vnd.3gpp.pic-bw-large": {
        source: "iana",
        extensions: ["plb"]
      },
      "application/vnd.3gpp.pic-bw-small": {
        source: "iana",
        extensions: ["psb"]
      },
      "application/vnd.3gpp.pic-bw-var": {
        source: "iana",
        extensions: ["pvb"]
      },
      "application/vnd.3gpp.s1ap": {
        source: "iana"
      },
      "application/vnd.3gpp.sms": {
        source: "iana"
      },
      "application/vnd.3gpp.sms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-ext+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.state-and-event-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ussd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.bcmcsinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.sms": {
        source: "iana"
      },
      "application/vnd.3gpp2.tcap": {
        source: "iana",
        extensions: ["tcap"]
      },
      "application/vnd.3lightssoftware.imagescal": {
        source: "iana"
      },
      "application/vnd.3m.post-it-notes": {
        source: "iana",
        extensions: ["pwn"]
      },
      "application/vnd.accpac.simply.aso": {
        source: "iana",
        extensions: ["aso"]
      },
      "application/vnd.accpac.simply.imp": {
        source: "iana",
        extensions: ["imp"]
      },
      "application/vnd.acucobol": {
        source: "iana",
        extensions: ["acu"]
      },
      "application/vnd.acucorp": {
        source: "iana",
        extensions: ["atc", "acutc"]
      },
      "application/vnd.adobe.air-application-installer-package+zip": {
        source: "apache",
        compressible: false,
        extensions: ["air"]
      },
      "application/vnd.adobe.flash.movie": {
        source: "iana"
      },
      "application/vnd.adobe.formscentral.fcdt": {
        source: "iana",
        extensions: ["fcdt"]
      },
      "application/vnd.adobe.fxp": {
        source: "iana",
        extensions: ["fxp", "fxpl"]
      },
      "application/vnd.adobe.partial-upload": {
        source: "iana"
      },
      "application/vnd.adobe.xdp+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdp"]
      },
      "application/vnd.adobe.xfdf": {
        source: "iana",
        extensions: ["xfdf"]
      },
      "application/vnd.aether.imp": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata-pagedef": {
        source: "iana"
      },
      "application/vnd.afpc.cmoca-cmresource": {
        source: "iana"
      },
      "application/vnd.afpc.foca-charset": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codedfont": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codepage": {
        source: "iana"
      },
      "application/vnd.afpc.modca": {
        source: "iana"
      },
      "application/vnd.afpc.modca-cmtable": {
        source: "iana"
      },
      "application/vnd.afpc.modca-formdef": {
        source: "iana"
      },
      "application/vnd.afpc.modca-mediummap": {
        source: "iana"
      },
      "application/vnd.afpc.modca-objectcontainer": {
        source: "iana"
      },
      "application/vnd.afpc.modca-overlay": {
        source: "iana"
      },
      "application/vnd.afpc.modca-pagesegment": {
        source: "iana"
      },
      "application/vnd.age": {
        source: "iana",
        extensions: ["age"]
      },
      "application/vnd.ah-barcode": {
        source: "iana"
      },
      "application/vnd.ahead.space": {
        source: "iana",
        extensions: ["ahead"]
      },
      "application/vnd.airzip.filesecure.azf": {
        source: "iana",
        extensions: ["azf"]
      },
      "application/vnd.airzip.filesecure.azs": {
        source: "iana",
        extensions: ["azs"]
      },
      "application/vnd.amadeus+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.amazon.ebook": {
        source: "apache",
        extensions: ["azw"]
      },
      "application/vnd.amazon.mobi8-ebook": {
        source: "iana"
      },
      "application/vnd.americandynamics.acc": {
        source: "iana",
        extensions: ["acc"]
      },
      "application/vnd.amiga.ami": {
        source: "iana",
        extensions: ["ami"]
      },
      "application/vnd.amundsen.maze+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.android.ota": {
        source: "iana"
      },
      "application/vnd.android.package-archive": {
        source: "apache",
        compressible: false,
        extensions: ["apk"]
      },
      "application/vnd.anki": {
        source: "iana"
      },
      "application/vnd.anser-web-certificate-issue-initiation": {
        source: "iana",
        extensions: ["cii"]
      },
      "application/vnd.anser-web-funds-transfer-initiation": {
        source: "apache",
        extensions: ["fti"]
      },
      "application/vnd.antix.game-component": {
        source: "iana",
        extensions: ["atx"]
      },
      "application/vnd.apache.arrow.file": {
        source: "iana"
      },
      "application/vnd.apache.arrow.stream": {
        source: "iana"
      },
      "application/vnd.apache.thrift.binary": {
        source: "iana"
      },
      "application/vnd.apache.thrift.compact": {
        source: "iana"
      },
      "application/vnd.apache.thrift.json": {
        source: "iana"
      },
      "application/vnd.api+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.aplextor.warrp+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apothekende.reservation+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apple.installer+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpkg"]
      },
      "application/vnd.apple.keynote": {
        source: "iana",
        extensions: ["key"]
      },
      "application/vnd.apple.mpegurl": {
        source: "iana",
        extensions: ["m3u8"]
      },
      "application/vnd.apple.numbers": {
        source: "iana",
        extensions: ["numbers"]
      },
      "application/vnd.apple.pages": {
        source: "iana",
        extensions: ["pages"]
      },
      "application/vnd.apple.pkpass": {
        compressible: false,
        extensions: ["pkpass"]
      },
      "application/vnd.arastra.swi": {
        source: "iana"
      },
      "application/vnd.aristanetworks.swi": {
        source: "iana",
        extensions: ["swi"]
      },
      "application/vnd.artisan+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.artsquare": {
        source: "iana"
      },
      "application/vnd.astraea-software.iota": {
        source: "iana",
        extensions: ["iota"]
      },
      "application/vnd.audiograph": {
        source: "iana",
        extensions: ["aep"]
      },
      "application/vnd.autopackage": {
        source: "iana"
      },
      "application/vnd.avalon+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.avistar+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.balsamiq.bmml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["bmml"]
      },
      "application/vnd.balsamiq.bmpr": {
        source: "iana"
      },
      "application/vnd.banana-accounting": {
        source: "iana"
      },
      "application/vnd.bbf.usp.error": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bekitzur-stech+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bint.med-content": {
        source: "iana"
      },
      "application/vnd.biopax.rdf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.blink-idb-value-wrapper": {
        source: "iana"
      },
      "application/vnd.blueice.multipass": {
        source: "iana",
        extensions: ["mpm"]
      },
      "application/vnd.bluetooth.ep.oob": {
        source: "iana"
      },
      "application/vnd.bluetooth.le.oob": {
        source: "iana"
      },
      "application/vnd.bmi": {
        source: "iana",
        extensions: ["bmi"]
      },
      "application/vnd.bpf": {
        source: "iana"
      },
      "application/vnd.bpf3": {
        source: "iana"
      },
      "application/vnd.businessobjects": {
        source: "iana",
        extensions: ["rep"]
      },
      "application/vnd.byu.uapi+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cab-jscript": {
        source: "iana"
      },
      "application/vnd.canon-cpdl": {
        source: "iana"
      },
      "application/vnd.canon-lips": {
        source: "iana"
      },
      "application/vnd.capasystems-pg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cendio.thinlinc.clientconf": {
        source: "iana"
      },
      "application/vnd.century-systems.tcp_stream": {
        source: "iana"
      },
      "application/vnd.chemdraw+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdxml"]
      },
      "application/vnd.chess-pgn": {
        source: "iana"
      },
      "application/vnd.chipnuts.karaoke-mmd": {
        source: "iana",
        extensions: ["mmd"]
      },
      "application/vnd.ciedi": {
        source: "iana"
      },
      "application/vnd.cinderella": {
        source: "iana",
        extensions: ["cdy"]
      },
      "application/vnd.cirpack.isdn-ext": {
        source: "iana"
      },
      "application/vnd.citationstyles.style+xml": {
        source: "iana",
        compressible: true,
        extensions: ["csl"]
      },
      "application/vnd.claymore": {
        source: "iana",
        extensions: ["cla"]
      },
      "application/vnd.cloanto.rp9": {
        source: "iana",
        extensions: ["rp9"]
      },
      "application/vnd.clonk.c4group": {
        source: "iana",
        extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"]
      },
      "application/vnd.cluetrust.cartomobile-config": {
        source: "iana",
        extensions: ["c11amc"]
      },
      "application/vnd.cluetrust.cartomobile-config-pkg": {
        source: "iana",
        extensions: ["c11amz"]
      },
      "application/vnd.coffeescript": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet-template": {
        source: "iana"
      },
      "application/vnd.collection+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.doc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.next+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.comicbook+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.comicbook-rar": {
        source: "iana"
      },
      "application/vnd.commerce-battelle": {
        source: "iana"
      },
      "application/vnd.commonspace": {
        source: "iana",
        extensions: ["csp"]
      },
      "application/vnd.contact.cmsg": {
        source: "iana",
        extensions: ["cdbcmsg"]
      },
      "application/vnd.coreos.ignition+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cosmocaller": {
        source: "iana",
        extensions: ["cmc"]
      },
      "application/vnd.crick.clicker": {
        source: "iana",
        extensions: ["clkx"]
      },
      "application/vnd.crick.clicker.keyboard": {
        source: "iana",
        extensions: ["clkk"]
      },
      "application/vnd.crick.clicker.palette": {
        source: "iana",
        extensions: ["clkp"]
      },
      "application/vnd.crick.clicker.template": {
        source: "iana",
        extensions: ["clkt"]
      },
      "application/vnd.crick.clicker.wordbank": {
        source: "iana",
        extensions: ["clkw"]
      },
      "application/vnd.criticaltools.wbs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wbs"]
      },
      "application/vnd.cryptii.pipe+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.crypto-shade-file": {
        source: "iana"
      },
      "application/vnd.cryptomator.encrypted": {
        source: "iana"
      },
      "application/vnd.cryptomator.vault": {
        source: "iana"
      },
      "application/vnd.ctc-posml": {
        source: "iana",
        extensions: ["pml"]
      },
      "application/vnd.ctct.ws+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cups-pdf": {
        source: "iana"
      },
      "application/vnd.cups-postscript": {
        source: "iana"
      },
      "application/vnd.cups-ppd": {
        source: "iana",
        extensions: ["ppd"]
      },
      "application/vnd.cups-raster": {
        source: "iana"
      },
      "application/vnd.cups-raw": {
        source: "iana"
      },
      "application/vnd.curl": {
        source: "iana"
      },
      "application/vnd.curl.car": {
        source: "apache",
        extensions: ["car"]
      },
      "application/vnd.curl.pcurl": {
        source: "apache",
        extensions: ["pcurl"]
      },
      "application/vnd.cyan.dean.root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cybank": {
        source: "iana"
      },
      "application/vnd.cyclonedx+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cyclonedx+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.d2l.coursepackage1p0+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.d3m-dataset": {
        source: "iana"
      },
      "application/vnd.d3m-problem": {
        source: "iana"
      },
      "application/vnd.dart": {
        source: "iana",
        compressible: true,
        extensions: ["dart"]
      },
      "application/vnd.data-vision.rdz": {
        source: "iana",
        extensions: ["rdz"]
      },
      "application/vnd.datapackage+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dataresource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dbf": {
        source: "iana",
        extensions: ["dbf"]
      },
      "application/vnd.debian.binary-package": {
        source: "iana"
      },
      "application/vnd.dece.data": {
        source: "iana",
        extensions: ["uvf", "uvvf", "uvd", "uvvd"]
      },
      "application/vnd.dece.ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uvt", "uvvt"]
      },
      "application/vnd.dece.unspecified": {
        source: "iana",
        extensions: ["uvx", "uvvx"]
      },
      "application/vnd.dece.zip": {
        source: "iana",
        extensions: ["uvz", "uvvz"]
      },
      "application/vnd.denovo.fcselayout-link": {
        source: "iana",
        extensions: ["fe_launch"]
      },
      "application/vnd.desmume.movie": {
        source: "iana"
      },
      "application/vnd.dir-bi.plate-dl-nosuffix": {
        source: "iana"
      },
      "application/vnd.dm.delegation+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dna": {
        source: "iana",
        extensions: ["dna"]
      },
      "application/vnd.document+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dolby.mlp": {
        source: "apache",
        extensions: ["mlp"]
      },
      "application/vnd.dolby.mobile.1": {
        source: "iana"
      },
      "application/vnd.dolby.mobile.2": {
        source: "iana"
      },
      "application/vnd.doremir.scorecloud-binary-document": {
        source: "iana"
      },
      "application/vnd.dpgraph": {
        source: "iana",
        extensions: ["dpg"]
      },
      "application/vnd.dreamfactory": {
        source: "iana",
        extensions: ["dfac"]
      },
      "application/vnd.drive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ds-keypoint": {
        source: "apache",
        extensions: ["kpxx"]
      },
      "application/vnd.dtg.local": {
        source: "iana"
      },
      "application/vnd.dtg.local.flash": {
        source: "iana"
      },
      "application/vnd.dtg.local.html": {
        source: "iana"
      },
      "application/vnd.dvb.ait": {
        source: "iana",
        extensions: ["ait"]
      },
      "application/vnd.dvb.dvbisl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.dvbj": {
        source: "iana"
      },
      "application/vnd.dvb.esgcontainer": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcdftnotifaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess2": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgpdd": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcroaming": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-base": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-enhancement": {
        source: "iana"
      },
      "application/vnd.dvb.notif-aggregate-root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-container+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-generic+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-msglist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-init+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.pfr": {
        source: "iana"
      },
      "application/vnd.dvb.service": {
        source: "iana",
        extensions: ["svc"]
      },
      "application/vnd.dxr": {
        source: "iana"
      },
      "application/vnd.dynageo": {
        source: "iana",
        extensions: ["geo"]
      },
      "application/vnd.dzr": {
        source: "iana"
      },
      "application/vnd.easykaraoke.cdgdownload": {
        source: "iana"
      },
      "application/vnd.ecdis-update": {
        source: "iana"
      },
      "application/vnd.ecip.rlp": {
        source: "iana"
      },
      "application/vnd.eclipse.ditto+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ecowin.chart": {
        source: "iana",
        extensions: ["mag"]
      },
      "application/vnd.ecowin.filerequest": {
        source: "iana"
      },
      "application/vnd.ecowin.fileupdate": {
        source: "iana"
      },
      "application/vnd.ecowin.series": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesrequest": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesupdate": {
        source: "iana"
      },
      "application/vnd.efi.img": {
        source: "iana"
      },
      "application/vnd.efi.iso": {
        source: "iana"
      },
      "application/vnd.emclient.accessrequest+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.enliven": {
        source: "iana",
        extensions: ["nml"]
      },
      "application/vnd.enphase.envoy": {
        source: "iana"
      },
      "application/vnd.eprints.data+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.epson.esf": {
        source: "iana",
        extensions: ["esf"]
      },
      "application/vnd.epson.msf": {
        source: "iana",
        extensions: ["msf"]
      },
      "application/vnd.epson.quickanime": {
        source: "iana",
        extensions: ["qam"]
      },
      "application/vnd.epson.salt": {
        source: "iana",
        extensions: ["slt"]
      },
      "application/vnd.epson.ssf": {
        source: "iana",
        extensions: ["ssf"]
      },
      "application/vnd.ericsson.quickcall": {
        source: "iana"
      },
      "application/vnd.espass-espass+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.eszigno3+xml": {
        source: "iana",
        compressible: true,
        extensions: ["es3", "et3"]
      },
      "application/vnd.etsi.aoc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.asic-e+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.asic-s+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.cug+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvcommand+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-bc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-cod+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-npvr+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvservice+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mcid+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mheg5": {
        source: "iana"
      },
      "application/vnd.etsi.overload-control-policy-dataset+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.pstn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.sci+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.simservs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.timestamp-token": {
        source: "iana"
      },
      "application/vnd.etsi.tsl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.tsl.der": {
        source: "iana"
      },
      "application/vnd.eu.kasparian.car+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.eudora.data": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.profile": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.settings": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.theme": {
        source: "iana"
      },
      "application/vnd.exstream-empower+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.exstream-package": {
        source: "iana"
      },
      "application/vnd.ezpix-album": {
        source: "iana",
        extensions: ["ez2"]
      },
      "application/vnd.ezpix-package": {
        source: "iana",
        extensions: ["ez3"]
      },
      "application/vnd.f-secure.mobile": {
        source: "iana"
      },
      "application/vnd.familysearch.gedcom+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.fastcopy-disk-image": {
        source: "iana"
      },
      "application/vnd.fdf": {
        source: "iana",
        extensions: ["fdf"]
      },
      "application/vnd.fdsn.mseed": {
        source: "iana",
        extensions: ["mseed"]
      },
      "application/vnd.fdsn.seed": {
        source: "iana",
        extensions: ["seed", "dataless"]
      },
      "application/vnd.ffsns": {
        source: "iana"
      },
      "application/vnd.ficlab.flb+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.filmit.zfc": {
        source: "iana"
      },
      "application/vnd.fints": {
        source: "iana"
      },
      "application/vnd.firemonkeys.cloudcell": {
        source: "iana"
      },
      "application/vnd.flographit": {
        source: "iana",
        extensions: ["gph"]
      },
      "application/vnd.fluxtime.clip": {
        source: "iana",
        extensions: ["ftc"]
      },
      "application/vnd.font-fontforge-sfd": {
        source: "iana"
      },
      "application/vnd.framemaker": {
        source: "iana",
        extensions: ["fm", "frame", "maker", "book"]
      },
      "application/vnd.frogans.fnc": {
        source: "iana",
        extensions: ["fnc"]
      },
      "application/vnd.frogans.ltf": {
        source: "iana",
        extensions: ["ltf"]
      },
      "application/vnd.fsc.weblaunch": {
        source: "iana",
        extensions: ["fsc"]
      },
      "application/vnd.fujifilm.fb.docuworks": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.binder": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.jfi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fujitsu.oasys": {
        source: "iana",
        extensions: ["oas"]
      },
      "application/vnd.fujitsu.oasys2": {
        source: "iana",
        extensions: ["oa2"]
      },
      "application/vnd.fujitsu.oasys3": {
        source: "iana",
        extensions: ["oa3"]
      },
      "application/vnd.fujitsu.oasysgp": {
        source: "iana",
        extensions: ["fg5"]
      },
      "application/vnd.fujitsu.oasysprs": {
        source: "iana",
        extensions: ["bh2"]
      },
      "application/vnd.fujixerox.art-ex": {
        source: "iana"
      },
      "application/vnd.fujixerox.art4": {
        source: "iana"
      },
      "application/vnd.fujixerox.ddd": {
        source: "iana",
        extensions: ["ddd"]
      },
      "application/vnd.fujixerox.docuworks": {
        source: "iana",
        extensions: ["xdw"]
      },
      "application/vnd.fujixerox.docuworks.binder": {
        source: "iana",
        extensions: ["xbd"]
      },
      "application/vnd.fujixerox.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujixerox.hbpl": {
        source: "iana"
      },
      "application/vnd.fut-misnet": {
        source: "iana"
      },
      "application/vnd.futoin+cbor": {
        source: "iana"
      },
      "application/vnd.futoin+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fuzzysheet": {
        source: "iana",
        extensions: ["fzs"]
      },
      "application/vnd.genomatix.tuxedo": {
        source: "iana",
        extensions: ["txd"]
      },
      "application/vnd.gentics.grd+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geo+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geocube+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geogebra.file": {
        source: "iana",
        extensions: ["ggb"]
      },
      "application/vnd.geogebra.slides": {
        source: "iana"
      },
      "application/vnd.geogebra.tool": {
        source: "iana",
        extensions: ["ggt"]
      },
      "application/vnd.geometry-explorer": {
        source: "iana",
        extensions: ["gex", "gre"]
      },
      "application/vnd.geonext": {
        source: "iana",
        extensions: ["gxt"]
      },
      "application/vnd.geoplan": {
        source: "iana",
        extensions: ["g2w"]
      },
      "application/vnd.geospace": {
        source: "iana",
        extensions: ["g3w"]
      },
      "application/vnd.gerber": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt-response": {
        source: "iana"
      },
      "application/vnd.gmx": {
        source: "iana",
        extensions: ["gmx"]
      },
      "application/vnd.google-apps.document": {
        compressible: false,
        extensions: ["gdoc"]
      },
      "application/vnd.google-apps.presentation": {
        compressible: false,
        extensions: ["gslides"]
      },
      "application/vnd.google-apps.spreadsheet": {
        compressible: false,
        extensions: ["gsheet"]
      },
      "application/vnd.google-earth.kml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["kml"]
      },
      "application/vnd.google-earth.kmz": {
        source: "iana",
        compressible: false,
        extensions: ["kmz"]
      },
      "application/vnd.gov.sk.e-form+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.gov.sk.e-form+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.gov.sk.xmldatacontainer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.grafeq": {
        source: "iana",
        extensions: ["gqf", "gqs"]
      },
      "application/vnd.gridmp": {
        source: "iana"
      },
      "application/vnd.groove-account": {
        source: "iana",
        extensions: ["gac"]
      },
      "application/vnd.groove-help": {
        source: "iana",
        extensions: ["ghf"]
      },
      "application/vnd.groove-identity-message": {
        source: "iana",
        extensions: ["gim"]
      },
      "application/vnd.groove-injector": {
        source: "iana",
        extensions: ["grv"]
      },
      "application/vnd.groove-tool-message": {
        source: "iana",
        extensions: ["gtm"]
      },
      "application/vnd.groove-tool-template": {
        source: "iana",
        extensions: ["tpl"]
      },
      "application/vnd.groove-vcard": {
        source: "iana",
        extensions: ["vcg"]
      },
      "application/vnd.hal+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hal+xml": {
        source: "iana",
        compressible: true,
        extensions: ["hal"]
      },
      "application/vnd.handheld-entertainment+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zmm"]
      },
      "application/vnd.hbci": {
        source: "iana",
        extensions: ["hbci"]
      },
      "application/vnd.hc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hcl-bireports": {
        source: "iana"
      },
      "application/vnd.hdt": {
        source: "iana"
      },
      "application/vnd.heroku+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hhe.lesson-player": {
        source: "iana",
        extensions: ["les"]
      },
      "application/vnd.hl7cda+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hl7v2+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hp-hpgl": {
        source: "iana",
        extensions: ["hpgl"]
      },
      "application/vnd.hp-hpid": {
        source: "iana",
        extensions: ["hpid"]
      },
      "application/vnd.hp-hps": {
        source: "iana",
        extensions: ["hps"]
      },
      "application/vnd.hp-jlyt": {
        source: "iana",
        extensions: ["jlt"]
      },
      "application/vnd.hp-pcl": {
        source: "iana",
        extensions: ["pcl"]
      },
      "application/vnd.hp-pclxl": {
        source: "iana",
        extensions: ["pclxl"]
      },
      "application/vnd.httphone": {
        source: "iana"
      },
      "application/vnd.hydrostatix.sof-data": {
        source: "iana",
        extensions: ["sfd-hdstx"]
      },
      "application/vnd.hyper+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyper-item+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyperdrive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hzn-3d-crossword": {
        source: "iana"
      },
      "application/vnd.ibm.afplinedata": {
        source: "iana"
      },
      "application/vnd.ibm.electronic-media": {
        source: "iana"
      },
      "application/vnd.ibm.minipay": {
        source: "iana",
        extensions: ["mpy"]
      },
      "application/vnd.ibm.modcap": {
        source: "iana",
        extensions: ["afp", "listafp", "list3820"]
      },
      "application/vnd.ibm.rights-management": {
        source: "iana",
        extensions: ["irm"]
      },
      "application/vnd.ibm.secure-container": {
        source: "iana",
        extensions: ["sc"]
      },
      "application/vnd.iccprofile": {
        source: "iana",
        extensions: ["icc", "icm"]
      },
      "application/vnd.ieee.1905": {
        source: "iana"
      },
      "application/vnd.igloader": {
        source: "iana",
        extensions: ["igl"]
      },
      "application/vnd.imagemeter.folder+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.imagemeter.image+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.immervision-ivp": {
        source: "iana",
        extensions: ["ivp"]
      },
      "application/vnd.immervision-ivu": {
        source: "iana",
        extensions: ["ivu"]
      },
      "application/vnd.ims.imsccv1p1": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p2": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p3": {
        source: "iana"
      },
      "application/vnd.ims.lis.v2.result+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy.id+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings.simple+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informedcontrol.rms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informix-visionary": {
        source: "iana"
      },
      "application/vnd.infotech.project": {
        source: "iana"
      },
      "application/vnd.infotech.project+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.innopath.wamp.notification": {
        source: "iana"
      },
      "application/vnd.insors.igm": {
        source: "iana",
        extensions: ["igm"]
      },
      "application/vnd.intercon.formnet": {
        source: "iana",
        extensions: ["xpw", "xpx"]
      },
      "application/vnd.intergeo": {
        source: "iana",
        extensions: ["i2g"]
      },
      "application/vnd.intertrust.digibox": {
        source: "iana"
      },
      "application/vnd.intertrust.nncp": {
        source: "iana"
      },
      "application/vnd.intu.qbo": {
        source: "iana",
        extensions: ["qbo"]
      },
      "application/vnd.intu.qfx": {
        source: "iana",
        extensions: ["qfx"]
      },
      "application/vnd.iptc.g2.catalogitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.conceptitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.knowledgeitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.packageitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.planningitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ipunplugged.rcprofile": {
        source: "iana",
        extensions: ["rcprofile"]
      },
      "application/vnd.irepository.package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["irp"]
      },
      "application/vnd.is-xpr": {
        source: "iana",
        extensions: ["xpr"]
      },
      "application/vnd.isac.fcs": {
        source: "iana",
        extensions: ["fcs"]
      },
      "application/vnd.iso11783-10+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.jam": {
        source: "iana",
        extensions: ["jam"]
      },
      "application/vnd.japannet-directory-service": {
        source: "iana"
      },
      "application/vnd.japannet-jpnstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-payment-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-registration": {
        source: "iana"
      },
      "application/vnd.japannet-registration-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-setstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-verification": {
        source: "iana"
      },
      "application/vnd.japannet-verification-wakeup": {
        source: "iana"
      },
      "application/vnd.jcp.javame.midlet-rms": {
        source: "iana",
        extensions: ["rms"]
      },
      "application/vnd.jisp": {
        source: "iana",
        extensions: ["jisp"]
      },
      "application/vnd.joost.joda-archive": {
        source: "iana",
        extensions: ["joda"]
      },
      "application/vnd.jsk.isdn-ngn": {
        source: "iana"
      },
      "application/vnd.kahootz": {
        source: "iana",
        extensions: ["ktz", "ktr"]
      },
      "application/vnd.kde.karbon": {
        source: "iana",
        extensions: ["karbon"]
      },
      "application/vnd.kde.kchart": {
        source: "iana",
        extensions: ["chrt"]
      },
      "application/vnd.kde.kformula": {
        source: "iana",
        extensions: ["kfo"]
      },
      "application/vnd.kde.kivio": {
        source: "iana",
        extensions: ["flw"]
      },
      "application/vnd.kde.kontour": {
        source: "iana",
        extensions: ["kon"]
      },
      "application/vnd.kde.kpresenter": {
        source: "iana",
        extensions: ["kpr", "kpt"]
      },
      "application/vnd.kde.kspread": {
        source: "iana",
        extensions: ["ksp"]
      },
      "application/vnd.kde.kword": {
        source: "iana",
        extensions: ["kwd", "kwt"]
      },
      "application/vnd.kenameaapp": {
        source: "iana",
        extensions: ["htke"]
      },
      "application/vnd.kidspiration": {
        source: "iana",
        extensions: ["kia"]
      },
      "application/vnd.kinar": {
        source: "iana",
        extensions: ["kne", "knp"]
      },
      "application/vnd.koan": {
        source: "iana",
        extensions: ["skp", "skd", "skt", "skm"]
      },
      "application/vnd.kodak-descriptor": {
        source: "iana",
        extensions: ["sse"]
      },
      "application/vnd.las": {
        source: "iana"
      },
      "application/vnd.las.las+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.las.las+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lasxml"]
      },
      "application/vnd.laszip": {
        source: "iana"
      },
      "application/vnd.leap+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.liberty-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.llamagraphics.life-balance.desktop": {
        source: "iana",
        extensions: ["lbd"]
      },
      "application/vnd.llamagraphics.life-balance.exchange+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lbe"]
      },
      "application/vnd.logipipe.circuit+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.loom": {
        source: "iana"
      },
      "application/vnd.lotus-1-2-3": {
        source: "iana",
        extensions: ["123"]
      },
      "application/vnd.lotus-approach": {
        source: "iana",
        extensions: ["apr"]
      },
      "application/vnd.lotus-freelance": {
        source: "iana",
        extensions: ["pre"]
      },
      "application/vnd.lotus-notes": {
        source: "iana",
        extensions: ["nsf"]
      },
      "application/vnd.lotus-organizer": {
        source: "iana",
        extensions: ["org"]
      },
      "application/vnd.lotus-screencam": {
        source: "iana",
        extensions: ["scm"]
      },
      "application/vnd.lotus-wordpro": {
        source: "iana",
        extensions: ["lwp"]
      },
      "application/vnd.macports.portpkg": {
        source: "iana",
        extensions: ["portpkg"]
      },
      "application/vnd.mapbox-vector-tile": {
        source: "iana",
        extensions: ["mvt"]
      },
      "application/vnd.marlin.drm.actiontoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.conftoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.license+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.mdcf": {
        source: "iana"
      },
      "application/vnd.mason+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.maxar.archive.3tz+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.maxmind.maxmind-db": {
        source: "iana"
      },
      "application/vnd.mcd": {
        source: "iana",
        extensions: ["mcd"]
      },
      "application/vnd.medcalcdata": {
        source: "iana",
        extensions: ["mc1"]
      },
      "application/vnd.mediastation.cdkey": {
        source: "iana",
        extensions: ["cdkey"]
      },
      "application/vnd.meridian-slingshot": {
        source: "iana"
      },
      "application/vnd.mfer": {
        source: "iana",
        extensions: ["mwf"]
      },
      "application/vnd.mfmp": {
        source: "iana",
        extensions: ["mfm"]
      },
      "application/vnd.micro+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.micrografx.flo": {
        source: "iana",
        extensions: ["flo"]
      },
      "application/vnd.micrografx.igx": {
        source: "iana",
        extensions: ["igx"]
      },
      "application/vnd.microsoft.portable-executable": {
        source: "iana"
      },
      "application/vnd.microsoft.windows.thumbnail-cache": {
        source: "iana"
      },
      "application/vnd.miele+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.mif": {
        source: "iana",
        extensions: ["mif"]
      },
      "application/vnd.minisoft-hp3000-save": {
        source: "iana"
      },
      "application/vnd.mitsubishi.misty-guard.trustweb": {
        source: "iana"
      },
      "application/vnd.mobius.daf": {
        source: "iana",
        extensions: ["daf"]
      },
      "application/vnd.mobius.dis": {
        source: "iana",
        extensions: ["dis"]
      },
      "application/vnd.mobius.mbk": {
        source: "iana",
        extensions: ["mbk"]
      },
      "application/vnd.mobius.mqy": {
        source: "iana",
        extensions: ["mqy"]
      },
      "application/vnd.mobius.msl": {
        source: "iana",
        extensions: ["msl"]
      },
      "application/vnd.mobius.plc": {
        source: "iana",
        extensions: ["plc"]
      },
      "application/vnd.mobius.txf": {
        source: "iana",
        extensions: ["txf"]
      },
      "application/vnd.mophun.application": {
        source: "iana",
        extensions: ["mpn"]
      },
      "application/vnd.mophun.certificate": {
        source: "iana",
        extensions: ["mpc"]
      },
      "application/vnd.motorola.flexsuite": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.adsi": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.fis": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.gotap": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.kmr": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.ttc": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.wem": {
        source: "iana"
      },
      "application/vnd.motorola.iprm": {
        source: "iana"
      },
      "application/vnd.mozilla.xul+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xul"]
      },
      "application/vnd.ms-3mfdocument": {
        source: "iana"
      },
      "application/vnd.ms-artgalry": {
        source: "iana",
        extensions: ["cil"]
      },
      "application/vnd.ms-asf": {
        source: "iana"
      },
      "application/vnd.ms-cab-compressed": {
        source: "iana",
        extensions: ["cab"]
      },
      "application/vnd.ms-color.iccprofile": {
        source: "apache"
      },
      "application/vnd.ms-excel": {
        source: "iana",
        compressible: false,
        extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"]
      },
      "application/vnd.ms-excel.addin.macroenabled.12": {
        source: "iana",
        extensions: ["xlam"]
      },
      "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
        source: "iana",
        extensions: ["xlsb"]
      },
      "application/vnd.ms-excel.sheet.macroenabled.12": {
        source: "iana",
        extensions: ["xlsm"]
      },
      "application/vnd.ms-excel.template.macroenabled.12": {
        source: "iana",
        extensions: ["xltm"]
      },
      "application/vnd.ms-fontobject": {
        source: "iana",
        compressible: true,
        extensions: ["eot"]
      },
      "application/vnd.ms-htmlhelp": {
        source: "iana",
        extensions: ["chm"]
      },
      "application/vnd.ms-ims": {
        source: "iana",
        extensions: ["ims"]
      },
      "application/vnd.ms-lrm": {
        source: "iana",
        extensions: ["lrm"]
      },
      "application/vnd.ms-office.activex+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-officetheme": {
        source: "iana",
        extensions: ["thmx"]
      },
      "application/vnd.ms-opentype": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-outlook": {
        compressible: false,
        extensions: ["msg"]
      },
      "application/vnd.ms-package.obfuscated-opentype": {
        source: "apache"
      },
      "application/vnd.ms-pki.seccat": {
        source: "apache",
        extensions: ["cat"]
      },
      "application/vnd.ms-pki.stl": {
        source: "apache",
        extensions: ["stl"]
      },
      "application/vnd.ms-playready.initiator+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-powerpoint": {
        source: "iana",
        compressible: false,
        extensions: ["ppt", "pps", "pot"]
      },
      "application/vnd.ms-powerpoint.addin.macroenabled.12": {
        source: "iana",
        extensions: ["ppam"]
      },
      "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
        source: "iana",
        extensions: ["pptm"]
      },
      "application/vnd.ms-powerpoint.slide.macroenabled.12": {
        source: "iana",
        extensions: ["sldm"]
      },
      "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
        source: "iana",
        extensions: ["ppsm"]
      },
      "application/vnd.ms-powerpoint.template.macroenabled.12": {
        source: "iana",
        extensions: ["potm"]
      },
      "application/vnd.ms-printdevicecapabilities+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-printing.printticket+xml": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-printschematicket+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-project": {
        source: "iana",
        extensions: ["mpp", "mpt"]
      },
      "application/vnd.ms-tnef": {
        source: "iana"
      },
      "application/vnd.ms-windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.nwprinting.oob": {
        source: "iana"
      },
      "application/vnd.ms-windows.printerpairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.wsd.oob": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-resp": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-resp": {
        source: "iana"
      },
      "application/vnd.ms-word.document.macroenabled.12": {
        source: "iana",
        extensions: ["docm"]
      },
      "application/vnd.ms-word.template.macroenabled.12": {
        source: "iana",
        extensions: ["dotm"]
      },
      "application/vnd.ms-works": {
        source: "iana",
        extensions: ["wps", "wks", "wcm", "wdb"]
      },
      "application/vnd.ms-wpl": {
        source: "iana",
        extensions: ["wpl"]
      },
      "application/vnd.ms-xpsdocument": {
        source: "iana",
        compressible: false,
        extensions: ["xps"]
      },
      "application/vnd.msa-disk-image": {
        source: "iana"
      },
      "application/vnd.mseq": {
        source: "iana",
        extensions: ["mseq"]
      },
      "application/vnd.msign": {
        source: "iana"
      },
      "application/vnd.multiad.creator": {
        source: "iana"
      },
      "application/vnd.multiad.creator.cif": {
        source: "iana"
      },
      "application/vnd.music-niff": {
        source: "iana"
      },
      "application/vnd.musician": {
        source: "iana",
        extensions: ["mus"]
      },
      "application/vnd.muvee.style": {
        source: "iana",
        extensions: ["msty"]
      },
      "application/vnd.mynfc": {
        source: "iana",
        extensions: ["taglet"]
      },
      "application/vnd.nacamar.ybrid+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ncd.control": {
        source: "iana"
      },
      "application/vnd.ncd.reference": {
        source: "iana"
      },
      "application/vnd.nearst.inv+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nebumind.line": {
        source: "iana"
      },
      "application/vnd.nervana": {
        source: "iana"
      },
      "application/vnd.netfpx": {
        source: "iana"
      },
      "application/vnd.neurolanguage.nlu": {
        source: "iana",
        extensions: ["nlu"]
      },
      "application/vnd.nimn": {
        source: "iana"
      },
      "application/vnd.nintendo.nitro.rom": {
        source: "iana"
      },
      "application/vnd.nintendo.snes.rom": {
        source: "iana"
      },
      "application/vnd.nitf": {
        source: "iana",
        extensions: ["ntf", "nitf"]
      },
      "application/vnd.noblenet-directory": {
        source: "iana",
        extensions: ["nnd"]
      },
      "application/vnd.noblenet-sealer": {
        source: "iana",
        extensions: ["nns"]
      },
      "application/vnd.noblenet-web": {
        source: "iana",
        extensions: ["nnw"]
      },
      "application/vnd.nokia.catalogs": {
        source: "iana"
      },
      "application/vnd.nokia.conml+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.conml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.iptv.config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.isds-radio-presets": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.landmarkcollection+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.n-gage.ac+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ac"]
      },
      "application/vnd.nokia.n-gage.data": {
        source: "iana",
        extensions: ["ngdat"]
      },
      "application/vnd.nokia.n-gage.symbian.install": {
        source: "iana",
        extensions: ["n-gage"]
      },
      "application/vnd.nokia.ncd": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.radio-preset": {
        source: "iana",
        extensions: ["rpst"]
      },
      "application/vnd.nokia.radio-presets": {
        source: "iana",
        extensions: ["rpss"]
      },
      "application/vnd.novadigm.edm": {
        source: "iana",
        extensions: ["edm"]
      },
      "application/vnd.novadigm.edx": {
        source: "iana",
        extensions: ["edx"]
      },
      "application/vnd.novadigm.ext": {
        source: "iana",
        extensions: ["ext"]
      },
      "application/vnd.ntt-local.content-share": {
        source: "iana"
      },
      "application/vnd.ntt-local.file-transfer": {
        source: "iana"
      },
      "application/vnd.ntt-local.ogw_remote-access": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_remote": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_tcp_stream": {
        source: "iana"
      },
      "application/vnd.oasis.opendocument.chart": {
        source: "iana",
        extensions: ["odc"]
      },
      "application/vnd.oasis.opendocument.chart-template": {
        source: "iana",
        extensions: ["otc"]
      },
      "application/vnd.oasis.opendocument.database": {
        source: "iana",
        extensions: ["odb"]
      },
      "application/vnd.oasis.opendocument.formula": {
        source: "iana",
        extensions: ["odf"]
      },
      "application/vnd.oasis.opendocument.formula-template": {
        source: "iana",
        extensions: ["odft"]
      },
      "application/vnd.oasis.opendocument.graphics": {
        source: "iana",
        compressible: false,
        extensions: ["odg"]
      },
      "application/vnd.oasis.opendocument.graphics-template": {
        source: "iana",
        extensions: ["otg"]
      },
      "application/vnd.oasis.opendocument.image": {
        source: "iana",
        extensions: ["odi"]
      },
      "application/vnd.oasis.opendocument.image-template": {
        source: "iana",
        extensions: ["oti"]
      },
      "application/vnd.oasis.opendocument.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["odp"]
      },
      "application/vnd.oasis.opendocument.presentation-template": {
        source: "iana",
        extensions: ["otp"]
      },
      "application/vnd.oasis.opendocument.spreadsheet": {
        source: "iana",
        compressible: false,
        extensions: ["ods"]
      },
      "application/vnd.oasis.opendocument.spreadsheet-template": {
        source: "iana",
        extensions: ["ots"]
      },
      "application/vnd.oasis.opendocument.text": {
        source: "iana",
        compressible: false,
        extensions: ["odt"]
      },
      "application/vnd.oasis.opendocument.text-master": {
        source: "iana",
        extensions: ["odm"]
      },
      "application/vnd.oasis.opendocument.text-template": {
        source: "iana",
        extensions: ["ott"]
      },
      "application/vnd.oasis.opendocument.text-web": {
        source: "iana",
        extensions: ["oth"]
      },
      "application/vnd.obn": {
        source: "iana"
      },
      "application/vnd.ocf+cbor": {
        source: "iana"
      },
      "application/vnd.oci.image.manifest.v1+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oftn.l10n+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessdownload+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessstreaming+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.cspg-hexbinary": {
        source: "iana"
      },
      "application/vnd.oipf.dae.svg+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.dae.xhtml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.mippvcontrolmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.pae.gem": {
        source: "iana"
      },
      "application/vnd.oipf.spdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.spdlist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.ueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.userprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.olpc-sugar": {
        source: "iana",
        extensions: ["xo"]
      },
      "application/vnd.oma-scws-config": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-request": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-response": {
        source: "iana"
      },
      "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.drm-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.imd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.ltkm": {
        source: "iana"
      },
      "application/vnd.oma.bcast.notification+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.provisioningtrigger": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgboot": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgdd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sgdu": {
        source: "iana"
      },
      "application/vnd.oma.bcast.simple-symbol-container": {
        source: "iana"
      },
      "application/vnd.oma.bcast.smartcard-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sprov+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.stkm": {
        source: "iana"
      },
      "application/vnd.oma.cab-address-book+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-feature-handler+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-pcc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-subs-invite+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-user-prefs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.dcd": {
        source: "iana"
      },
      "application/vnd.oma.dcdc": {
        source: "iana"
      },
      "application/vnd.oma.dd2+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dd2"]
      },
      "application/vnd.oma.drm.risd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.group-usage-list+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+cbor": {
        source: "iana"
      },
      "application/vnd.oma.lwm2m+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+tlv": {
        source: "iana"
      },
      "application/vnd.oma.pal+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.detailed-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.final-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.groups+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.invocation-descriptor+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.optimized-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.push": {
        source: "iana"
      },
      "application/vnd.oma.scidm.messages+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.xcap-directory+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.omads-email+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-file+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-folder+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omaloc-supl-init": {
        source: "iana"
      },
      "application/vnd.onepager": {
        source: "iana"
      },
      "application/vnd.onepagertamp": {
        source: "iana"
      },
      "application/vnd.onepagertamx": {
        source: "iana"
      },
      "application/vnd.onepagertat": {
        source: "iana"
      },
      "application/vnd.onepagertatp": {
        source: "iana"
      },
      "application/vnd.onepagertatx": {
        source: "iana"
      },
      "application/vnd.openblox.game+xml": {
        source: "iana",
        compressible: true,
        extensions: ["obgx"]
      },
      "application/vnd.openblox.game-binary": {
        source: "iana"
      },
      "application/vnd.openeye.oeb": {
        source: "iana"
      },
      "application/vnd.openofficeorg.extension": {
        source: "apache",
        extensions: ["oxt"]
      },
      "application/vnd.openstreetmap.data+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osm"]
      },
      "application/vnd.opentimestamps.ots": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawing+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["pptx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide": {
        source: "iana",
        extensions: ["sldx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
        source: "iana",
        extensions: ["ppsx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template": {
        source: "iana",
        extensions: ["potx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
        source: "iana",
        compressible: false,
        extensions: ["xlsx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
        source: "iana",
        extensions: ["xltx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.theme+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.vmldrawing": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        source: "iana",
        compressible: false,
        extensions: ["docx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
        source: "iana",
        extensions: ["dotx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.core-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.relationships+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oracle.resource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.orange.indata": {
        source: "iana"
      },
      "application/vnd.osa.netdeploy": {
        source: "iana"
      },
      "application/vnd.osgeo.mapguide.package": {
        source: "iana",
        extensions: ["mgp"]
      },
      "application/vnd.osgi.bundle": {
        source: "iana"
      },
      "application/vnd.osgi.dp": {
        source: "iana",
        extensions: ["dp"]
      },
      "application/vnd.osgi.subsystem": {
        source: "iana",
        extensions: ["esa"]
      },
      "application/vnd.otps.ct-kip+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oxli.countgraph": {
        source: "iana"
      },
      "application/vnd.pagerduty+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.palm": {
        source: "iana",
        extensions: ["pdb", "pqa", "oprc"]
      },
      "application/vnd.panoply": {
        source: "iana"
      },
      "application/vnd.paos.xml": {
        source: "iana"
      },
      "application/vnd.patentdive": {
        source: "iana"
      },
      "application/vnd.patientecommsdoc": {
        source: "iana"
      },
      "application/vnd.pawaafile": {
        source: "iana",
        extensions: ["paw"]
      },
      "application/vnd.pcos": {
        source: "iana"
      },
      "application/vnd.pg.format": {
        source: "iana",
        extensions: ["str"]
      },
      "application/vnd.pg.osasli": {
        source: "iana",
        extensions: ["ei6"]
      },
      "application/vnd.piaccess.application-licence": {
        source: "iana"
      },
      "application/vnd.picsel": {
        source: "iana",
        extensions: ["efif"]
      },
      "application/vnd.pmi.widget": {
        source: "iana",
        extensions: ["wg"]
      },
      "application/vnd.poc.group-advertisement+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.pocketlearn": {
        source: "iana",
        extensions: ["plf"]
      },
      "application/vnd.powerbuilder6": {
        source: "iana",
        extensions: ["pbd"]
      },
      "application/vnd.powerbuilder6-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder7": {
        source: "iana"
      },
      "application/vnd.powerbuilder7-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder75": {
        source: "iana"
      },
      "application/vnd.powerbuilder75-s": {
        source: "iana"
      },
      "application/vnd.preminet": {
        source: "iana"
      },
      "application/vnd.previewsystems.box": {
        source: "iana",
        extensions: ["box"]
      },
      "application/vnd.proteus.magazine": {
        source: "iana",
        extensions: ["mgz"]
      },
      "application/vnd.psfs": {
        source: "iana"
      },
      "application/vnd.publishare-delta-tree": {
        source: "iana",
        extensions: ["qps"]
      },
      "application/vnd.pvi.ptid1": {
        source: "iana",
        extensions: ["ptid"]
      },
      "application/vnd.pwg-multiplexed": {
        source: "iana"
      },
      "application/vnd.pwg-xhtml-print+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.qualcomm.brew-app-res": {
        source: "iana"
      },
      "application/vnd.quarantainenet": {
        source: "iana"
      },
      "application/vnd.quark.quarkxpress": {
        source: "iana",
        extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"]
      },
      "application/vnd.quobject-quoxdocument": {
        source: "iana"
      },
      "application/vnd.radisys.moml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-stream+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-base+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-detect+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-group+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-speech+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-transform+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rainstor.data": {
        source: "iana"
      },
      "application/vnd.rapid": {
        source: "iana"
      },
      "application/vnd.rar": {
        source: "iana",
        extensions: ["rar"]
      },
      "application/vnd.realvnc.bed": {
        source: "iana",
        extensions: ["bed"]
      },
      "application/vnd.recordare.musicxml": {
        source: "iana",
        extensions: ["mxl"]
      },
      "application/vnd.recordare.musicxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musicxml"]
      },
      "application/vnd.renlearn.rlprint": {
        source: "iana"
      },
      "application/vnd.resilient.logic": {
        source: "iana"
      },
      "application/vnd.restful+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rig.cryptonote": {
        source: "iana",
        extensions: ["cryptonote"]
      },
      "application/vnd.rim.cod": {
        source: "apache",
        extensions: ["cod"]
      },
      "application/vnd.rn-realmedia": {
        source: "apache",
        extensions: ["rm"]
      },
      "application/vnd.rn-realmedia-vbr": {
        source: "apache",
        extensions: ["rmvb"]
      },
      "application/vnd.route66.link66+xml": {
        source: "iana",
        compressible: true,
        extensions: ["link66"]
      },
      "application/vnd.rs-274x": {
        source: "iana"
      },
      "application/vnd.ruckus.download": {
        source: "iana"
      },
      "application/vnd.s3sms": {
        source: "iana"
      },
      "application/vnd.sailingtracker.track": {
        source: "iana",
        extensions: ["st"]
      },
      "application/vnd.sar": {
        source: "iana"
      },
      "application/vnd.sbm.cid": {
        source: "iana"
      },
      "application/vnd.sbm.mid2": {
        source: "iana"
      },
      "application/vnd.scribus": {
        source: "iana"
      },
      "application/vnd.sealed.3df": {
        source: "iana"
      },
      "application/vnd.sealed.csf": {
        source: "iana"
      },
      "application/vnd.sealed.doc": {
        source: "iana"
      },
      "application/vnd.sealed.eml": {
        source: "iana"
      },
      "application/vnd.sealed.mht": {
        source: "iana"
      },
      "application/vnd.sealed.net": {
        source: "iana"
      },
      "application/vnd.sealed.ppt": {
        source: "iana"
      },
      "application/vnd.sealed.tiff": {
        source: "iana"
      },
      "application/vnd.sealed.xls": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.html": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.pdf": {
        source: "iana"
      },
      "application/vnd.seemail": {
        source: "iana",
        extensions: ["see"]
      },
      "application/vnd.seis+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.sema": {
        source: "iana",
        extensions: ["sema"]
      },
      "application/vnd.semd": {
        source: "iana",
        extensions: ["semd"]
      },
      "application/vnd.semf": {
        source: "iana",
        extensions: ["semf"]
      },
      "application/vnd.shade-save-file": {
        source: "iana"
      },
      "application/vnd.shana.informed.formdata": {
        source: "iana",
        extensions: ["ifm"]
      },
      "application/vnd.shana.informed.formtemplate": {
        source: "iana",
        extensions: ["itp"]
      },
      "application/vnd.shana.informed.interchange": {
        source: "iana",
        extensions: ["iif"]
      },
      "application/vnd.shana.informed.package": {
        source: "iana",
        extensions: ["ipk"]
      },
      "application/vnd.shootproof+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shopkick+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shp": {
        source: "iana"
      },
      "application/vnd.shx": {
        source: "iana"
      },
      "application/vnd.sigrok.session": {
        source: "iana"
      },
      "application/vnd.simtech-mindmapper": {
        source: "iana",
        extensions: ["twd", "twds"]
      },
      "application/vnd.siren+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.smaf": {
        source: "iana",
        extensions: ["mmf"]
      },
      "application/vnd.smart.notebook": {
        source: "iana"
      },
      "application/vnd.smart.teacher": {
        source: "iana",
        extensions: ["teacher"]
      },
      "application/vnd.snesdev-page-table": {
        source: "iana"
      },
      "application/vnd.software602.filler.form+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fo"]
      },
      "application/vnd.software602.filler.form-xml-zip": {
        source: "iana"
      },
      "application/vnd.solent.sdkm+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sdkm", "sdkd"]
      },
      "application/vnd.spotfire.dxp": {
        source: "iana",
        extensions: ["dxp"]
      },
      "application/vnd.spotfire.sfs": {
        source: "iana",
        extensions: ["sfs"]
      },
      "application/vnd.sqlite3": {
        source: "iana"
      },
      "application/vnd.sss-cod": {
        source: "iana"
      },
      "application/vnd.sss-dtf": {
        source: "iana"
      },
      "application/vnd.sss-ntf": {
        source: "iana"
      },
      "application/vnd.stardivision.calc": {
        source: "apache",
        extensions: ["sdc"]
      },
      "application/vnd.stardivision.draw": {
        source: "apache",
        extensions: ["sda"]
      },
      "application/vnd.stardivision.impress": {
        source: "apache",
        extensions: ["sdd"]
      },
      "application/vnd.stardivision.math": {
        source: "apache",
        extensions: ["smf"]
      },
      "application/vnd.stardivision.writer": {
        source: "apache",
        extensions: ["sdw", "vor"]
      },
      "application/vnd.stardivision.writer-global": {
        source: "apache",
        extensions: ["sgl"]
      },
      "application/vnd.stepmania.package": {
        source: "iana",
        extensions: ["smzip"]
      },
      "application/vnd.stepmania.stepchart": {
        source: "iana",
        extensions: ["sm"]
      },
      "application/vnd.street-stream": {
        source: "iana"
      },
      "application/vnd.sun.wadl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wadl"]
      },
      "application/vnd.sun.xml.calc": {
        source: "apache",
        extensions: ["sxc"]
      },
      "application/vnd.sun.xml.calc.template": {
        source: "apache",
        extensions: ["stc"]
      },
      "application/vnd.sun.xml.draw": {
        source: "apache",
        extensions: ["sxd"]
      },
      "application/vnd.sun.xml.draw.template": {
        source: "apache",
        extensions: ["std"]
      },
      "application/vnd.sun.xml.impress": {
        source: "apache",
        extensions: ["sxi"]
      },
      "application/vnd.sun.xml.impress.template": {
        source: "apache",
        extensions: ["sti"]
      },
      "application/vnd.sun.xml.math": {
        source: "apache",
        extensions: ["sxm"]
      },
      "application/vnd.sun.xml.writer": {
        source: "apache",
        extensions: ["sxw"]
      },
      "application/vnd.sun.xml.writer.global": {
        source: "apache",
        extensions: ["sxg"]
      },
      "application/vnd.sun.xml.writer.template": {
        source: "apache",
        extensions: ["stw"]
      },
      "application/vnd.sus-calendar": {
        source: "iana",
        extensions: ["sus", "susp"]
      },
      "application/vnd.svd": {
        source: "iana",
        extensions: ["svd"]
      },
      "application/vnd.swiftview-ics": {
        source: "iana"
      },
      "application/vnd.sycle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.syft+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.symbian.install": {
        source: "apache",
        extensions: ["sis", "sisx"]
      },
      "application/vnd.syncml+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xsm"]
      },
      "application/vnd.syncml.dm+wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["bdm"]
      },
      "application/vnd.syncml.dm+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xdm"]
      },
      "application/vnd.syncml.dm.notification": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["ddf"]
      },
      "application/vnd.syncml.dmtnds+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmtnds+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.syncml.ds.notification": {
        source: "iana"
      },
      "application/vnd.tableschema+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tao.intent-module-archive": {
        source: "iana",
        extensions: ["tao"]
      },
      "application/vnd.tcpdump.pcap": {
        source: "iana",
        extensions: ["pcap", "cap", "dmp"]
      },
      "application/vnd.think-cell.ppttc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tmd.mediaflex.api+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tml": {
        source: "iana"
      },
      "application/vnd.tmobile-livetv": {
        source: "iana",
        extensions: ["tmo"]
      },
      "application/vnd.tri.onesource": {
        source: "iana"
      },
      "application/vnd.trid.tpt": {
        source: "iana",
        extensions: ["tpt"]
      },
      "application/vnd.triscape.mxs": {
        source: "iana",
        extensions: ["mxs"]
      },
      "application/vnd.trueapp": {
        source: "iana",
        extensions: ["tra"]
      },
      "application/vnd.truedoc": {
        source: "iana"
      },
      "application/vnd.ubisoft.webplayer": {
        source: "iana"
      },
      "application/vnd.ufdl": {
        source: "iana",
        extensions: ["ufd", "ufdl"]
      },
      "application/vnd.uiq.theme": {
        source: "iana",
        extensions: ["utz"]
      },
      "application/vnd.umajin": {
        source: "iana",
        extensions: ["umj"]
      },
      "application/vnd.unity": {
        source: "iana",
        extensions: ["unityweb"]
      },
      "application/vnd.uoml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uoml"]
      },
      "application/vnd.uplanet.alert": {
        source: "iana"
      },
      "application/vnd.uplanet.alert-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.channel": {
        source: "iana"
      },
      "application/vnd.uplanet.channel-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.list": {
        source: "iana"
      },
      "application/vnd.uplanet.list-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.signal": {
        source: "iana"
      },
      "application/vnd.uri-map": {
        source: "iana"
      },
      "application/vnd.valve.source.material": {
        source: "iana"
      },
      "application/vnd.vcx": {
        source: "iana",
        extensions: ["vcx"]
      },
      "application/vnd.vd-study": {
        source: "iana"
      },
      "application/vnd.vectorworks": {
        source: "iana"
      },
      "application/vnd.vel+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.verimatrix.vcas": {
        source: "iana"
      },
      "application/vnd.veritone.aion+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.veryant.thin": {
        source: "iana"
      },
      "application/vnd.ves.encrypted": {
        source: "iana"
      },
      "application/vnd.vidsoft.vidconference": {
        source: "iana"
      },
      "application/vnd.visio": {
        source: "iana",
        extensions: ["vsd", "vst", "vss", "vsw"]
      },
      "application/vnd.visionary": {
        source: "iana",
        extensions: ["vis"]
      },
      "application/vnd.vividence.scriptfile": {
        source: "iana"
      },
      "application/vnd.vsf": {
        source: "iana",
        extensions: ["vsf"]
      },
      "application/vnd.wap.sic": {
        source: "iana"
      },
      "application/vnd.wap.slc": {
        source: "iana"
      },
      "application/vnd.wap.wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["wbxml"]
      },
      "application/vnd.wap.wmlc": {
        source: "iana",
        extensions: ["wmlc"]
      },
      "application/vnd.wap.wmlscriptc": {
        source: "iana",
        extensions: ["wmlsc"]
      },
      "application/vnd.webturbo": {
        source: "iana",
        extensions: ["wtb"]
      },
      "application/vnd.wfa.dpp": {
        source: "iana"
      },
      "application/vnd.wfa.p2p": {
        source: "iana"
      },
      "application/vnd.wfa.wsc": {
        source: "iana"
      },
      "application/vnd.windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.wmc": {
        source: "iana"
      },
      "application/vnd.wmf.bootstrap": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica.package": {
        source: "iana"
      },
      "application/vnd.wolfram.player": {
        source: "iana",
        extensions: ["nbp"]
      },
      "application/vnd.wordperfect": {
        source: "iana",
        extensions: ["wpd"]
      },
      "application/vnd.wqd": {
        source: "iana",
        extensions: ["wqd"]
      },
      "application/vnd.wrq-hp3000-labelled": {
        source: "iana"
      },
      "application/vnd.wt.stf": {
        source: "iana",
        extensions: ["stf"]
      },
      "application/vnd.wv.csp+wbxml": {
        source: "iana"
      },
      "application/vnd.wv.csp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.wv.ssp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xacml+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xara": {
        source: "iana",
        extensions: ["xar"]
      },
      "application/vnd.xfdl": {
        source: "iana",
        extensions: ["xfdl"]
      },
      "application/vnd.xfdl.webform": {
        source: "iana"
      },
      "application/vnd.xmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xmpie.cpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.dpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.plan": {
        source: "iana"
      },
      "application/vnd.xmpie.ppkg": {
        source: "iana"
      },
      "application/vnd.xmpie.xlim": {
        source: "iana"
      },
      "application/vnd.yamaha.hv-dic": {
        source: "iana",
        extensions: ["hvd"]
      },
      "application/vnd.yamaha.hv-script": {
        source: "iana",
        extensions: ["hvs"]
      },
      "application/vnd.yamaha.hv-voice": {
        source: "iana",
        extensions: ["hvp"]
      },
      "application/vnd.yamaha.openscoreformat": {
        source: "iana",
        extensions: ["osf"]
      },
      "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osfpvg"]
      },
      "application/vnd.yamaha.remote-setup": {
        source: "iana"
      },
      "application/vnd.yamaha.smaf-audio": {
        source: "iana",
        extensions: ["saf"]
      },
      "application/vnd.yamaha.smaf-phrase": {
        source: "iana",
        extensions: ["spf"]
      },
      "application/vnd.yamaha.through-ngn": {
        source: "iana"
      },
      "application/vnd.yamaha.tunnel-udpencap": {
        source: "iana"
      },
      "application/vnd.yaoweme": {
        source: "iana"
      },
      "application/vnd.yellowriver-custom-menu": {
        source: "iana",
        extensions: ["cmp"]
      },
      "application/vnd.youtube.yt": {
        source: "iana"
      },
      "application/vnd.zul": {
        source: "iana",
        extensions: ["zir", "zirz"]
      },
      "application/vnd.zzazz.deck+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zaz"]
      },
      "application/voicexml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["vxml"]
      },
      "application/voucher-cms+json": {
        source: "iana",
        compressible: true
      },
      "application/vq-rtcpxr": {
        source: "iana"
      },
      "application/wasm": {
        source: "iana",
        compressible: true,
        extensions: ["wasm"]
      },
      "application/watcherinfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wif"]
      },
      "application/webpush-options+json": {
        source: "iana",
        compressible: true
      },
      "application/whoispp-query": {
        source: "iana"
      },
      "application/whoispp-response": {
        source: "iana"
      },
      "application/widget": {
        source: "iana",
        extensions: ["wgt"]
      },
      "application/winhlp": {
        source: "apache",
        extensions: ["hlp"]
      },
      "application/wita": {
        source: "iana"
      },
      "application/wordperfect5.1": {
        source: "iana"
      },
      "application/wsdl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wsdl"]
      },
      "application/wspolicy+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wspolicy"]
      },
      "application/x-7z-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["7z"]
      },
      "application/x-abiword": {
        source: "apache",
        extensions: ["abw"]
      },
      "application/x-ace-compressed": {
        source: "apache",
        extensions: ["ace"]
      },
      "application/x-amf": {
        source: "apache"
      },
      "application/x-apple-diskimage": {
        source: "apache",
        extensions: ["dmg"]
      },
      "application/x-arj": {
        compressible: false,
        extensions: ["arj"]
      },
      "application/x-authorware-bin": {
        source: "apache",
        extensions: ["aab", "x32", "u32", "vox"]
      },
      "application/x-authorware-map": {
        source: "apache",
        extensions: ["aam"]
      },
      "application/x-authorware-seg": {
        source: "apache",
        extensions: ["aas"]
      },
      "application/x-bcpio": {
        source: "apache",
        extensions: ["bcpio"]
      },
      "application/x-bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/x-bittorrent": {
        source: "apache",
        extensions: ["torrent"]
      },
      "application/x-blorb": {
        source: "apache",
        extensions: ["blb", "blorb"]
      },
      "application/x-bzip": {
        source: "apache",
        compressible: false,
        extensions: ["bz"]
      },
      "application/x-bzip2": {
        source: "apache",
        compressible: false,
        extensions: ["bz2", "boz"]
      },
      "application/x-cbr": {
        source: "apache",
        extensions: ["cbr", "cba", "cbt", "cbz", "cb7"]
      },
      "application/x-cdlink": {
        source: "apache",
        extensions: ["vcd"]
      },
      "application/x-cfs-compressed": {
        source: "apache",
        extensions: ["cfs"]
      },
      "application/x-chat": {
        source: "apache",
        extensions: ["chat"]
      },
      "application/x-chess-pgn": {
        source: "apache",
        extensions: ["pgn"]
      },
      "application/x-chrome-extension": {
        extensions: ["crx"]
      },
      "application/x-cocoa": {
        source: "nginx",
        extensions: ["cco"]
      },
      "application/x-compress": {
        source: "apache"
      },
      "application/x-conference": {
        source: "apache",
        extensions: ["nsc"]
      },
      "application/x-cpio": {
        source: "apache",
        extensions: ["cpio"]
      },
      "application/x-csh": {
        source: "apache",
        extensions: ["csh"]
      },
      "application/x-deb": {
        compressible: false
      },
      "application/x-debian-package": {
        source: "apache",
        extensions: ["deb", "udeb"]
      },
      "application/x-dgc-compressed": {
        source: "apache",
        extensions: ["dgc"]
      },
      "application/x-director": {
        source: "apache",
        extensions: ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"]
      },
      "application/x-doom": {
        source: "apache",
        extensions: ["wad"]
      },
      "application/x-dtbncx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ncx"]
      },
      "application/x-dtbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dtb"]
      },
      "application/x-dtbresource+xml": {
        source: "apache",
        compressible: true,
        extensions: ["res"]
      },
      "application/x-dvi": {
        source: "apache",
        compressible: false,
        extensions: ["dvi"]
      },
      "application/x-envoy": {
        source: "apache",
        extensions: ["evy"]
      },
      "application/x-eva": {
        source: "apache",
        extensions: ["eva"]
      },
      "application/x-font-bdf": {
        source: "apache",
        extensions: ["bdf"]
      },
      "application/x-font-dos": {
        source: "apache"
      },
      "application/x-font-framemaker": {
        source: "apache"
      },
      "application/x-font-ghostscript": {
        source: "apache",
        extensions: ["gsf"]
      },
      "application/x-font-libgrx": {
        source: "apache"
      },
      "application/x-font-linux-psf": {
        source: "apache",
        extensions: ["psf"]
      },
      "application/x-font-pcf": {
        source: "apache",
        extensions: ["pcf"]
      },
      "application/x-font-snf": {
        source: "apache",
        extensions: ["snf"]
      },
      "application/x-font-speedo": {
        source: "apache"
      },
      "application/x-font-sunos-news": {
        source: "apache"
      },
      "application/x-font-type1": {
        source: "apache",
        extensions: ["pfa", "pfb", "pfm", "afm"]
      },
      "application/x-font-vfont": {
        source: "apache"
      },
      "application/x-freearc": {
        source: "apache",
        extensions: ["arc"]
      },
      "application/x-futuresplash": {
        source: "apache",
        extensions: ["spl"]
      },
      "application/x-gca-compressed": {
        source: "apache",
        extensions: ["gca"]
      },
      "application/x-glulx": {
        source: "apache",
        extensions: ["ulx"]
      },
      "application/x-gnumeric": {
        source: "apache",
        extensions: ["gnumeric"]
      },
      "application/x-gramps-xml": {
        source: "apache",
        extensions: ["gramps"]
      },
      "application/x-gtar": {
        source: "apache",
        extensions: ["gtar"]
      },
      "application/x-gzip": {
        source: "apache"
      },
      "application/x-hdf": {
        source: "apache",
        extensions: ["hdf"]
      },
      "application/x-httpd-php": {
        compressible: true,
        extensions: ["php"]
      },
      "application/x-install-instructions": {
        source: "apache",
        extensions: ["install"]
      },
      "application/x-iso9660-image": {
        source: "apache",
        extensions: ["iso"]
      },
      "application/x-iwork-keynote-sffkey": {
        extensions: ["key"]
      },
      "application/x-iwork-numbers-sffnumbers": {
        extensions: ["numbers"]
      },
      "application/x-iwork-pages-sffpages": {
        extensions: ["pages"]
      },
      "application/x-java-archive-diff": {
        source: "nginx",
        extensions: ["jardiff"]
      },
      "application/x-java-jnlp-file": {
        source: "apache",
        compressible: false,
        extensions: ["jnlp"]
      },
      "application/x-javascript": {
        compressible: true
      },
      "application/x-keepass2": {
        extensions: ["kdbx"]
      },
      "application/x-latex": {
        source: "apache",
        compressible: false,
        extensions: ["latex"]
      },
      "application/x-lua-bytecode": {
        extensions: ["luac"]
      },
      "application/x-lzh-compressed": {
        source: "apache",
        extensions: ["lzh", "lha"]
      },
      "application/x-makeself": {
        source: "nginx",
        extensions: ["run"]
      },
      "application/x-mie": {
        source: "apache",
        extensions: ["mie"]
      },
      "application/x-mobipocket-ebook": {
        source: "apache",
        extensions: ["prc", "mobi"]
      },
      "application/x-mpegurl": {
        compressible: false
      },
      "application/x-ms-application": {
        source: "apache",
        extensions: ["application"]
      },
      "application/x-ms-shortcut": {
        source: "apache",
        extensions: ["lnk"]
      },
      "application/x-ms-wmd": {
        source: "apache",
        extensions: ["wmd"]
      },
      "application/x-ms-wmz": {
        source: "apache",
        extensions: ["wmz"]
      },
      "application/x-ms-xbap": {
        source: "apache",
        extensions: ["xbap"]
      },
      "application/x-msaccess": {
        source: "apache",
        extensions: ["mdb"]
      },
      "application/x-msbinder": {
        source: "apache",
        extensions: ["obd"]
      },
      "application/x-mscardfile": {
        source: "apache",
        extensions: ["crd"]
      },
      "application/x-msclip": {
        source: "apache",
        extensions: ["clp"]
      },
      "application/x-msdos-program": {
        extensions: ["exe"]
      },
      "application/x-msdownload": {
        source: "apache",
        extensions: ["exe", "dll", "com", "bat", "msi"]
      },
      "application/x-msmediaview": {
        source: "apache",
        extensions: ["mvb", "m13", "m14"]
      },
      "application/x-msmetafile": {
        source: "apache",
        extensions: ["wmf", "wmz", "emf", "emz"]
      },
      "application/x-msmoney": {
        source: "apache",
        extensions: ["mny"]
      },
      "application/x-mspublisher": {
        source: "apache",
        extensions: ["pub"]
      },
      "application/x-msschedule": {
        source: "apache",
        extensions: ["scd"]
      },
      "application/x-msterminal": {
        source: "apache",
        extensions: ["trm"]
      },
      "application/x-mswrite": {
        source: "apache",
        extensions: ["wri"]
      },
      "application/x-netcdf": {
        source: "apache",
        extensions: ["nc", "cdf"]
      },
      "application/x-ns-proxy-autoconfig": {
        compressible: true,
        extensions: ["pac"]
      },
      "application/x-nzb": {
        source: "apache",
        extensions: ["nzb"]
      },
      "application/x-perl": {
        source: "nginx",
        extensions: ["pl", "pm"]
      },
      "application/x-pilot": {
        source: "nginx",
        extensions: ["prc", "pdb"]
      },
      "application/x-pkcs12": {
        source: "apache",
        compressible: false,
        extensions: ["p12", "pfx"]
      },
      "application/x-pkcs7-certificates": {
        source: "apache",
        extensions: ["p7b", "spc"]
      },
      "application/x-pkcs7-certreqresp": {
        source: "apache",
        extensions: ["p7r"]
      },
      "application/x-pki-message": {
        source: "iana"
      },
      "application/x-rar-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["rar"]
      },
      "application/x-redhat-package-manager": {
        source: "nginx",
        extensions: ["rpm"]
      },
      "application/x-research-info-systems": {
        source: "apache",
        extensions: ["ris"]
      },
      "application/x-sea": {
        source: "nginx",
        extensions: ["sea"]
      },
      "application/x-sh": {
        source: "apache",
        compressible: true,
        extensions: ["sh"]
      },
      "application/x-shar": {
        source: "apache",
        extensions: ["shar"]
      },
      "application/x-shockwave-flash": {
        source: "apache",
        compressible: false,
        extensions: ["swf"]
      },
      "application/x-silverlight-app": {
        source: "apache",
        extensions: ["xap"]
      },
      "application/x-sql": {
        source: "apache",
        extensions: ["sql"]
      },
      "application/x-stuffit": {
        source: "apache",
        compressible: false,
        extensions: ["sit"]
      },
      "application/x-stuffitx": {
        source: "apache",
        extensions: ["sitx"]
      },
      "application/x-subrip": {
        source: "apache",
        extensions: ["srt"]
      },
      "application/x-sv4cpio": {
        source: "apache",
        extensions: ["sv4cpio"]
      },
      "application/x-sv4crc": {
        source: "apache",
        extensions: ["sv4crc"]
      },
      "application/x-t3vm-image": {
        source: "apache",
        extensions: ["t3"]
      },
      "application/x-tads": {
        source: "apache",
        extensions: ["gam"]
      },
      "application/x-tar": {
        source: "apache",
        compressible: true,
        extensions: ["tar"]
      },
      "application/x-tcl": {
        source: "apache",
        extensions: ["tcl", "tk"]
      },
      "application/x-tex": {
        source: "apache",
        extensions: ["tex"]
      },
      "application/x-tex-tfm": {
        source: "apache",
        extensions: ["tfm"]
      },
      "application/x-texinfo": {
        source: "apache",
        extensions: ["texinfo", "texi"]
      },
      "application/x-tgif": {
        source: "apache",
        extensions: ["obj"]
      },
      "application/x-ustar": {
        source: "apache",
        extensions: ["ustar"]
      },
      "application/x-virtualbox-hdd": {
        compressible: true,
        extensions: ["hdd"]
      },
      "application/x-virtualbox-ova": {
        compressible: true,
        extensions: ["ova"]
      },
      "application/x-virtualbox-ovf": {
        compressible: true,
        extensions: ["ovf"]
      },
      "application/x-virtualbox-vbox": {
        compressible: true,
        extensions: ["vbox"]
      },
      "application/x-virtualbox-vbox-extpack": {
        compressible: false,
        extensions: ["vbox-extpack"]
      },
      "application/x-virtualbox-vdi": {
        compressible: true,
        extensions: ["vdi"]
      },
      "application/x-virtualbox-vhd": {
        compressible: true,
        extensions: ["vhd"]
      },
      "application/x-virtualbox-vmdk": {
        compressible: true,
        extensions: ["vmdk"]
      },
      "application/x-wais-source": {
        source: "apache",
        extensions: ["src"]
      },
      "application/x-web-app-manifest+json": {
        compressible: true,
        extensions: ["webapp"]
      },
      "application/x-www-form-urlencoded": {
        source: "iana",
        compressible: true
      },
      "application/x-x509-ca-cert": {
        source: "iana",
        extensions: ["der", "crt", "pem"]
      },
      "application/x-x509-ca-ra-cert": {
        source: "iana"
      },
      "application/x-x509-next-ca-cert": {
        source: "iana"
      },
      "application/x-xfig": {
        source: "apache",
        extensions: ["fig"]
      },
      "application/x-xliff+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/x-xpinstall": {
        source: "apache",
        compressible: false,
        extensions: ["xpi"]
      },
      "application/x-xz": {
        source: "apache",
        extensions: ["xz"]
      },
      "application/x-zmachine": {
        source: "apache",
        extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"]
      },
      "application/x400-bp": {
        source: "iana"
      },
      "application/xacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/xaml+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xaml"]
      },
      "application/xcap-att+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xav"]
      },
      "application/xcap-caps+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xca"]
      },
      "application/xcap-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdf"]
      },
      "application/xcap-el+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xel"]
      },
      "application/xcap-error+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcap-ns+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xns"]
      },
      "application/xcon-conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcon-conference-info-diff+xml": {
        source: "iana",
        compressible: true
      },
      "application/xenc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xenc"]
      },
      "application/xhtml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xhtml", "xht"]
      },
      "application/xhtml-voice+xml": {
        source: "apache",
        compressible: true
      },
      "application/xliff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml", "xsl", "xsd", "rng"]
      },
      "application/xml-dtd": {
        source: "iana",
        compressible: true,
        extensions: ["dtd"]
      },
      "application/xml-external-parsed-entity": {
        source: "iana"
      },
      "application/xml-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/xmpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/xop+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xop"]
      },
      "application/xproc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xpl"]
      },
      "application/xslt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xsl", "xslt"]
      },
      "application/xspf+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xspf"]
      },
      "application/xv+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mxml", "xhvml", "xvml", "xvm"]
      },
      "application/yang": {
        source: "iana",
        extensions: ["yang"]
      },
      "application/yang-data+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-data+xml": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/yin+xml": {
        source: "iana",
        compressible: true,
        extensions: ["yin"]
      },
      "application/zip": {
        source: "iana",
        compressible: false,
        extensions: ["zip"]
      },
      "application/zlib": {
        source: "iana"
      },
      "application/zstd": {
        source: "iana"
      },
      "audio/1d-interleaved-parityfec": {
        source: "iana"
      },
      "audio/32kadpcm": {
        source: "iana"
      },
      "audio/3gpp": {
        source: "iana",
        compressible: false,
        extensions: ["3gpp"]
      },
      "audio/3gpp2": {
        source: "iana"
      },
      "audio/aac": {
        source: "iana"
      },
      "audio/ac3": {
        source: "iana"
      },
      "audio/adpcm": {
        source: "apache",
        extensions: ["adp"]
      },
      "audio/amr": {
        source: "iana",
        extensions: ["amr"]
      },
      "audio/amr-wb": {
        source: "iana"
      },
      "audio/amr-wb+": {
        source: "iana"
      },
      "audio/aptx": {
        source: "iana"
      },
      "audio/asc": {
        source: "iana"
      },
      "audio/atrac-advanced-lossless": {
        source: "iana"
      },
      "audio/atrac-x": {
        source: "iana"
      },
      "audio/atrac3": {
        source: "iana"
      },
      "audio/basic": {
        source: "iana",
        compressible: false,
        extensions: ["au", "snd"]
      },
      "audio/bv16": {
        source: "iana"
      },
      "audio/bv32": {
        source: "iana"
      },
      "audio/clearmode": {
        source: "iana"
      },
      "audio/cn": {
        source: "iana"
      },
      "audio/dat12": {
        source: "iana"
      },
      "audio/dls": {
        source: "iana"
      },
      "audio/dsr-es201108": {
        source: "iana"
      },
      "audio/dsr-es202050": {
        source: "iana"
      },
      "audio/dsr-es202211": {
        source: "iana"
      },
      "audio/dsr-es202212": {
        source: "iana"
      },
      "audio/dv": {
        source: "iana"
      },
      "audio/dvi4": {
        source: "iana"
      },
      "audio/eac3": {
        source: "iana"
      },
      "audio/encaprtp": {
        source: "iana"
      },
      "audio/evrc": {
        source: "iana"
      },
      "audio/evrc-qcp": {
        source: "iana"
      },
      "audio/evrc0": {
        source: "iana"
      },
      "audio/evrc1": {
        source: "iana"
      },
      "audio/evrcb": {
        source: "iana"
      },
      "audio/evrcb0": {
        source: "iana"
      },
      "audio/evrcb1": {
        source: "iana"
      },
      "audio/evrcnw": {
        source: "iana"
      },
      "audio/evrcnw0": {
        source: "iana"
      },
      "audio/evrcnw1": {
        source: "iana"
      },
      "audio/evrcwb": {
        source: "iana"
      },
      "audio/evrcwb0": {
        source: "iana"
      },
      "audio/evrcwb1": {
        source: "iana"
      },
      "audio/evs": {
        source: "iana"
      },
      "audio/flexfec": {
        source: "iana"
      },
      "audio/fwdred": {
        source: "iana"
      },
      "audio/g711-0": {
        source: "iana"
      },
      "audio/g719": {
        source: "iana"
      },
      "audio/g722": {
        source: "iana"
      },
      "audio/g7221": {
        source: "iana"
      },
      "audio/g723": {
        source: "iana"
      },
      "audio/g726-16": {
        source: "iana"
      },
      "audio/g726-24": {
        source: "iana"
      },
      "audio/g726-32": {
        source: "iana"
      },
      "audio/g726-40": {
        source: "iana"
      },
      "audio/g728": {
        source: "iana"
      },
      "audio/g729": {
        source: "iana"
      },
      "audio/g7291": {
        source: "iana"
      },
      "audio/g729d": {
        source: "iana"
      },
      "audio/g729e": {
        source: "iana"
      },
      "audio/gsm": {
        source: "iana"
      },
      "audio/gsm-efr": {
        source: "iana"
      },
      "audio/gsm-hr-08": {
        source: "iana"
      },
      "audio/ilbc": {
        source: "iana"
      },
      "audio/ip-mr_v2.5": {
        source: "iana"
      },
      "audio/isac": {
        source: "apache"
      },
      "audio/l16": {
        source: "iana"
      },
      "audio/l20": {
        source: "iana"
      },
      "audio/l24": {
        source: "iana",
        compressible: false
      },
      "audio/l8": {
        source: "iana"
      },
      "audio/lpc": {
        source: "iana"
      },
      "audio/melp": {
        source: "iana"
      },
      "audio/melp1200": {
        source: "iana"
      },
      "audio/melp2400": {
        source: "iana"
      },
      "audio/melp600": {
        source: "iana"
      },
      "audio/mhas": {
        source: "iana"
      },
      "audio/midi": {
        source: "apache",
        extensions: ["mid", "midi", "kar", "rmi"]
      },
      "audio/mobile-xmf": {
        source: "iana",
        extensions: ["mxmf"]
      },
      "audio/mp3": {
        compressible: false,
        extensions: ["mp3"]
      },
      "audio/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["m4a", "mp4a"]
      },
      "audio/mp4a-latm": {
        source: "iana"
      },
      "audio/mpa": {
        source: "iana"
      },
      "audio/mpa-robust": {
        source: "iana"
      },
      "audio/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"]
      },
      "audio/mpeg4-generic": {
        source: "iana"
      },
      "audio/musepack": {
        source: "apache"
      },
      "audio/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["oga", "ogg", "spx", "opus"]
      },
      "audio/opus": {
        source: "iana"
      },
      "audio/parityfec": {
        source: "iana"
      },
      "audio/pcma": {
        source: "iana"
      },
      "audio/pcma-wb": {
        source: "iana"
      },
      "audio/pcmu": {
        source: "iana"
      },
      "audio/pcmu-wb": {
        source: "iana"
      },
      "audio/prs.sid": {
        source: "iana"
      },
      "audio/qcelp": {
        source: "iana"
      },
      "audio/raptorfec": {
        source: "iana"
      },
      "audio/red": {
        source: "iana"
      },
      "audio/rtp-enc-aescm128": {
        source: "iana"
      },
      "audio/rtp-midi": {
        source: "iana"
      },
      "audio/rtploopback": {
        source: "iana"
      },
      "audio/rtx": {
        source: "iana"
      },
      "audio/s3m": {
        source: "apache",
        extensions: ["s3m"]
      },
      "audio/scip": {
        source: "iana"
      },
      "audio/silk": {
        source: "apache",
        extensions: ["sil"]
      },
      "audio/smv": {
        source: "iana"
      },
      "audio/smv-qcp": {
        source: "iana"
      },
      "audio/smv0": {
        source: "iana"
      },
      "audio/sofa": {
        source: "iana"
      },
      "audio/sp-midi": {
        source: "iana"
      },
      "audio/speex": {
        source: "iana"
      },
      "audio/t140c": {
        source: "iana"
      },
      "audio/t38": {
        source: "iana"
      },
      "audio/telephone-event": {
        source: "iana"
      },
      "audio/tetra_acelp": {
        source: "iana"
      },
      "audio/tetra_acelp_bb": {
        source: "iana"
      },
      "audio/tone": {
        source: "iana"
      },
      "audio/tsvcis": {
        source: "iana"
      },
      "audio/uemclip": {
        source: "iana"
      },
      "audio/ulpfec": {
        source: "iana"
      },
      "audio/usac": {
        source: "iana"
      },
      "audio/vdvi": {
        source: "iana"
      },
      "audio/vmr-wb": {
        source: "iana"
      },
      "audio/vnd.3gpp.iufp": {
        source: "iana"
      },
      "audio/vnd.4sb": {
        source: "iana"
      },
      "audio/vnd.audiokoz": {
        source: "iana"
      },
      "audio/vnd.celp": {
        source: "iana"
      },
      "audio/vnd.cisco.nse": {
        source: "iana"
      },
      "audio/vnd.cmles.radio-events": {
        source: "iana"
      },
      "audio/vnd.cns.anp1": {
        source: "iana"
      },
      "audio/vnd.cns.inf1": {
        source: "iana"
      },
      "audio/vnd.dece.audio": {
        source: "iana",
        extensions: ["uva", "uvva"]
      },
      "audio/vnd.digital-winds": {
        source: "iana",
        extensions: ["eol"]
      },
      "audio/vnd.dlna.adts": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.1": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.2": {
        source: "iana"
      },
      "audio/vnd.dolby.mlp": {
        source: "iana"
      },
      "audio/vnd.dolby.mps": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2x": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2z": {
        source: "iana"
      },
      "audio/vnd.dolby.pulse.1": {
        source: "iana"
      },
      "audio/vnd.dra": {
        source: "iana",
        extensions: ["dra"]
      },
      "audio/vnd.dts": {
        source: "iana",
        extensions: ["dts"]
      },
      "audio/vnd.dts.hd": {
        source: "iana",
        extensions: ["dtshd"]
      },
      "audio/vnd.dts.uhd": {
        source: "iana"
      },
      "audio/vnd.dvb.file": {
        source: "iana"
      },
      "audio/vnd.everad.plj": {
        source: "iana"
      },
      "audio/vnd.hns.audio": {
        source: "iana"
      },
      "audio/vnd.lucent.voice": {
        source: "iana",
        extensions: ["lvp"]
      },
      "audio/vnd.ms-playready.media.pya": {
        source: "iana",
        extensions: ["pya"]
      },
      "audio/vnd.nokia.mobile-xmf": {
        source: "iana"
      },
      "audio/vnd.nortel.vbk": {
        source: "iana"
      },
      "audio/vnd.nuera.ecelp4800": {
        source: "iana",
        extensions: ["ecelp4800"]
      },
      "audio/vnd.nuera.ecelp7470": {
        source: "iana",
        extensions: ["ecelp7470"]
      },
      "audio/vnd.nuera.ecelp9600": {
        source: "iana",
        extensions: ["ecelp9600"]
      },
      "audio/vnd.octel.sbc": {
        source: "iana"
      },
      "audio/vnd.presonus.multitrack": {
        source: "iana"
      },
      "audio/vnd.qcelp": {
        source: "iana"
      },
      "audio/vnd.rhetorex.32kadpcm": {
        source: "iana"
      },
      "audio/vnd.rip": {
        source: "iana",
        extensions: ["rip"]
      },
      "audio/vnd.rn-realaudio": {
        compressible: false
      },
      "audio/vnd.sealedmedia.softseal.mpeg": {
        source: "iana"
      },
      "audio/vnd.vmx.cvsd": {
        source: "iana"
      },
      "audio/vnd.wave": {
        compressible: false
      },
      "audio/vorbis": {
        source: "iana",
        compressible: false
      },
      "audio/vorbis-config": {
        source: "iana"
      },
      "audio/wav": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/wave": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/webm": {
        source: "apache",
        compressible: false,
        extensions: ["weba"]
      },
      "audio/x-aac": {
        source: "apache",
        compressible: false,
        extensions: ["aac"]
      },
      "audio/x-aiff": {
        source: "apache",
        extensions: ["aif", "aiff", "aifc"]
      },
      "audio/x-caf": {
        source: "apache",
        compressible: false,
        extensions: ["caf"]
      },
      "audio/x-flac": {
        source: "apache",
        extensions: ["flac"]
      },
      "audio/x-m4a": {
        source: "nginx",
        extensions: ["m4a"]
      },
      "audio/x-matroska": {
        source: "apache",
        extensions: ["mka"]
      },
      "audio/x-mpegurl": {
        source: "apache",
        extensions: ["m3u"]
      },
      "audio/x-ms-wax": {
        source: "apache",
        extensions: ["wax"]
      },
      "audio/x-ms-wma": {
        source: "apache",
        extensions: ["wma"]
      },
      "audio/x-pn-realaudio": {
        source: "apache",
        extensions: ["ram", "ra"]
      },
      "audio/x-pn-realaudio-plugin": {
        source: "apache",
        extensions: ["rmp"]
      },
      "audio/x-realaudio": {
        source: "nginx",
        extensions: ["ra"]
      },
      "audio/x-tta": {
        source: "apache"
      },
      "audio/x-wav": {
        source: "apache",
        extensions: ["wav"]
      },
      "audio/xm": {
        source: "apache",
        extensions: ["xm"]
      },
      "chemical/x-cdx": {
        source: "apache",
        extensions: ["cdx"]
      },
      "chemical/x-cif": {
        source: "apache",
        extensions: ["cif"]
      },
      "chemical/x-cmdf": {
        source: "apache",
        extensions: ["cmdf"]
      },
      "chemical/x-cml": {
        source: "apache",
        extensions: ["cml"]
      },
      "chemical/x-csml": {
        source: "apache",
        extensions: ["csml"]
      },
      "chemical/x-pdb": {
        source: "apache"
      },
      "chemical/x-xyz": {
        source: "apache",
        extensions: ["xyz"]
      },
      "font/collection": {
        source: "iana",
        extensions: ["ttc"]
      },
      "font/otf": {
        source: "iana",
        compressible: true,
        extensions: ["otf"]
      },
      "font/sfnt": {
        source: "iana"
      },
      "font/ttf": {
        source: "iana",
        compressible: true,
        extensions: ["ttf"]
      },
      "font/woff": {
        source: "iana",
        extensions: ["woff"]
      },
      "font/woff2": {
        source: "iana",
        extensions: ["woff2"]
      },
      "image/aces": {
        source: "iana",
        extensions: ["exr"]
      },
      "image/apng": {
        compressible: false,
        extensions: ["apng"]
      },
      "image/avci": {
        source: "iana",
        extensions: ["avci"]
      },
      "image/avcs": {
        source: "iana",
        extensions: ["avcs"]
      },
      "image/avif": {
        source: "iana",
        compressible: false,
        extensions: ["avif"]
      },
      "image/bmp": {
        source: "iana",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/cgm": {
        source: "iana",
        extensions: ["cgm"]
      },
      "image/dicom-rle": {
        source: "iana",
        extensions: ["drle"]
      },
      "image/emf": {
        source: "iana",
        extensions: ["emf"]
      },
      "image/fits": {
        source: "iana",
        extensions: ["fits"]
      },
      "image/g3fax": {
        source: "iana",
        extensions: ["g3"]
      },
      "image/gif": {
        source: "iana",
        compressible: false,
        extensions: ["gif"]
      },
      "image/heic": {
        source: "iana",
        extensions: ["heic"]
      },
      "image/heic-sequence": {
        source: "iana",
        extensions: ["heics"]
      },
      "image/heif": {
        source: "iana",
        extensions: ["heif"]
      },
      "image/heif-sequence": {
        source: "iana",
        extensions: ["heifs"]
      },
      "image/hej2k": {
        source: "iana",
        extensions: ["hej2"]
      },
      "image/hsj2": {
        source: "iana",
        extensions: ["hsj2"]
      },
      "image/ief": {
        source: "iana",
        extensions: ["ief"]
      },
      "image/jls": {
        source: "iana",
        extensions: ["jls"]
      },
      "image/jp2": {
        source: "iana",
        compressible: false,
        extensions: ["jp2", "jpg2"]
      },
      "image/jpeg": {
        source: "iana",
        compressible: false,
        extensions: ["jpeg", "jpg", "jpe"]
      },
      "image/jph": {
        source: "iana",
        extensions: ["jph"]
      },
      "image/jphc": {
        source: "iana",
        extensions: ["jhc"]
      },
      "image/jpm": {
        source: "iana",
        compressible: false,
        extensions: ["jpm"]
      },
      "image/jpx": {
        source: "iana",
        compressible: false,
        extensions: ["jpx", "jpf"]
      },
      "image/jxr": {
        source: "iana",
        extensions: ["jxr"]
      },
      "image/jxra": {
        source: "iana",
        extensions: ["jxra"]
      },
      "image/jxrs": {
        source: "iana",
        extensions: ["jxrs"]
      },
      "image/jxs": {
        source: "iana",
        extensions: ["jxs"]
      },
      "image/jxsc": {
        source: "iana",
        extensions: ["jxsc"]
      },
      "image/jxsi": {
        source: "iana",
        extensions: ["jxsi"]
      },
      "image/jxss": {
        source: "iana",
        extensions: ["jxss"]
      },
      "image/ktx": {
        source: "iana",
        extensions: ["ktx"]
      },
      "image/ktx2": {
        source: "iana",
        extensions: ["ktx2"]
      },
      "image/naplps": {
        source: "iana"
      },
      "image/pjpeg": {
        compressible: false
      },
      "image/png": {
        source: "iana",
        compressible: false,
        extensions: ["png"]
      },
      "image/prs.btif": {
        source: "iana",
        extensions: ["btif"]
      },
      "image/prs.pti": {
        source: "iana",
        extensions: ["pti"]
      },
      "image/pwg-raster": {
        source: "iana"
      },
      "image/sgi": {
        source: "apache",
        extensions: ["sgi"]
      },
      "image/svg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["svg", "svgz"]
      },
      "image/t38": {
        source: "iana",
        extensions: ["t38"]
      },
      "image/tiff": {
        source: "iana",
        compressible: false,
        extensions: ["tif", "tiff"]
      },
      "image/tiff-fx": {
        source: "iana",
        extensions: ["tfx"]
      },
      "image/vnd.adobe.photoshop": {
        source: "iana",
        compressible: true,
        extensions: ["psd"]
      },
      "image/vnd.airzip.accelerator.azv": {
        source: "iana",
        extensions: ["azv"]
      },
      "image/vnd.cns.inf2": {
        source: "iana"
      },
      "image/vnd.dece.graphic": {
        source: "iana",
        extensions: ["uvi", "uvvi", "uvg", "uvvg"]
      },
      "image/vnd.djvu": {
        source: "iana",
        extensions: ["djvu", "djv"]
      },
      "image/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "image/vnd.dwg": {
        source: "iana",
        extensions: ["dwg"]
      },
      "image/vnd.dxf": {
        source: "iana",
        extensions: ["dxf"]
      },
      "image/vnd.fastbidsheet": {
        source: "iana",
        extensions: ["fbs"]
      },
      "image/vnd.fpx": {
        source: "iana",
        extensions: ["fpx"]
      },
      "image/vnd.fst": {
        source: "iana",
        extensions: ["fst"]
      },
      "image/vnd.fujixerox.edmics-mmr": {
        source: "iana",
        extensions: ["mmr"]
      },
      "image/vnd.fujixerox.edmics-rlc": {
        source: "iana",
        extensions: ["rlc"]
      },
      "image/vnd.globalgraphics.pgb": {
        source: "iana"
      },
      "image/vnd.microsoft.icon": {
        source: "iana",
        compressible: true,
        extensions: ["ico"]
      },
      "image/vnd.mix": {
        source: "iana"
      },
      "image/vnd.mozilla.apng": {
        source: "iana"
      },
      "image/vnd.ms-dds": {
        compressible: true,
        extensions: ["dds"]
      },
      "image/vnd.ms-modi": {
        source: "iana",
        extensions: ["mdi"]
      },
      "image/vnd.ms-photo": {
        source: "apache",
        extensions: ["wdp"]
      },
      "image/vnd.net-fpx": {
        source: "iana",
        extensions: ["npx"]
      },
      "image/vnd.pco.b16": {
        source: "iana",
        extensions: ["b16"]
      },
      "image/vnd.radiance": {
        source: "iana"
      },
      "image/vnd.sealed.png": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.gif": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.jpg": {
        source: "iana"
      },
      "image/vnd.svf": {
        source: "iana"
      },
      "image/vnd.tencent.tap": {
        source: "iana",
        extensions: ["tap"]
      },
      "image/vnd.valve.source.texture": {
        source: "iana",
        extensions: ["vtf"]
      },
      "image/vnd.wap.wbmp": {
        source: "iana",
        extensions: ["wbmp"]
      },
      "image/vnd.xiff": {
        source: "iana",
        extensions: ["xif"]
      },
      "image/vnd.zbrush.pcx": {
        source: "iana",
        extensions: ["pcx"]
      },
      "image/webp": {
        source: "apache",
        extensions: ["webp"]
      },
      "image/wmf": {
        source: "iana",
        extensions: ["wmf"]
      },
      "image/x-3ds": {
        source: "apache",
        extensions: ["3ds"]
      },
      "image/x-cmu-raster": {
        source: "apache",
        extensions: ["ras"]
      },
      "image/x-cmx": {
        source: "apache",
        extensions: ["cmx"]
      },
      "image/x-freehand": {
        source: "apache",
        extensions: ["fh", "fhc", "fh4", "fh5", "fh7"]
      },
      "image/x-icon": {
        source: "apache",
        compressible: true,
        extensions: ["ico"]
      },
      "image/x-jng": {
        source: "nginx",
        extensions: ["jng"]
      },
      "image/x-mrsid-image": {
        source: "apache",
        extensions: ["sid"]
      },
      "image/x-ms-bmp": {
        source: "nginx",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/x-pcx": {
        source: "apache",
        extensions: ["pcx"]
      },
      "image/x-pict": {
        source: "apache",
        extensions: ["pic", "pct"]
      },
      "image/x-portable-anymap": {
        source: "apache",
        extensions: ["pnm"]
      },
      "image/x-portable-bitmap": {
        source: "apache",
        extensions: ["pbm"]
      },
      "image/x-portable-graymap": {
        source: "apache",
        extensions: ["pgm"]
      },
      "image/x-portable-pixmap": {
        source: "apache",
        extensions: ["ppm"]
      },
      "image/x-rgb": {
        source: "apache",
        extensions: ["rgb"]
      },
      "image/x-tga": {
        source: "apache",
        extensions: ["tga"]
      },
      "image/x-xbitmap": {
        source: "apache",
        extensions: ["xbm"]
      },
      "image/x-xcf": {
        compressible: false
      },
      "image/x-xpixmap": {
        source: "apache",
        extensions: ["xpm"]
      },
      "image/x-xwindowdump": {
        source: "apache",
        extensions: ["xwd"]
      },
      "message/cpim": {
        source: "iana"
      },
      "message/delivery-status": {
        source: "iana"
      },
      "message/disposition-notification": {
        source: "iana",
        extensions: [
          "disposition-notification"
        ]
      },
      "message/external-body": {
        source: "iana"
      },
      "message/feedback-report": {
        source: "iana"
      },
      "message/global": {
        source: "iana",
        extensions: ["u8msg"]
      },
      "message/global-delivery-status": {
        source: "iana",
        extensions: ["u8dsn"]
      },
      "message/global-disposition-notification": {
        source: "iana",
        extensions: ["u8mdn"]
      },
      "message/global-headers": {
        source: "iana",
        extensions: ["u8hdr"]
      },
      "message/http": {
        source: "iana",
        compressible: false
      },
      "message/imdn+xml": {
        source: "iana",
        compressible: true
      },
      "message/news": {
        source: "iana"
      },
      "message/partial": {
        source: "iana",
        compressible: false
      },
      "message/rfc822": {
        source: "iana",
        compressible: true,
        extensions: ["eml", "mime"]
      },
      "message/s-http": {
        source: "iana"
      },
      "message/sip": {
        source: "iana"
      },
      "message/sipfrag": {
        source: "iana"
      },
      "message/tracking-status": {
        source: "iana"
      },
      "message/vnd.si.simp": {
        source: "iana"
      },
      "message/vnd.wfa.wsc": {
        source: "iana",
        extensions: ["wsc"]
      },
      "model/3mf": {
        source: "iana",
        extensions: ["3mf"]
      },
      "model/e57": {
        source: "iana"
      },
      "model/gltf+json": {
        source: "iana",
        compressible: true,
        extensions: ["gltf"]
      },
      "model/gltf-binary": {
        source: "iana",
        compressible: true,
        extensions: ["glb"]
      },
      "model/iges": {
        source: "iana",
        compressible: false,
        extensions: ["igs", "iges"]
      },
      "model/mesh": {
        source: "iana",
        compressible: false,
        extensions: ["msh", "mesh", "silo"]
      },
      "model/mtl": {
        source: "iana",
        extensions: ["mtl"]
      },
      "model/obj": {
        source: "iana",
        extensions: ["obj"]
      },
      "model/step": {
        source: "iana"
      },
      "model/step+xml": {
        source: "iana",
        compressible: true,
        extensions: ["stpx"]
      },
      "model/step+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpz"]
      },
      "model/step-xml+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpxz"]
      },
      "model/stl": {
        source: "iana",
        extensions: ["stl"]
      },
      "model/vnd.collada+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dae"]
      },
      "model/vnd.dwf": {
        source: "iana",
        extensions: ["dwf"]
      },
      "model/vnd.flatland.3dml": {
        source: "iana"
      },
      "model/vnd.gdl": {
        source: "iana",
        extensions: ["gdl"]
      },
      "model/vnd.gs-gdl": {
        source: "apache"
      },
      "model/vnd.gs.gdl": {
        source: "iana"
      },
      "model/vnd.gtw": {
        source: "iana",
        extensions: ["gtw"]
      },
      "model/vnd.moml+xml": {
        source: "iana",
        compressible: true
      },
      "model/vnd.mts": {
        source: "iana",
        extensions: ["mts"]
      },
      "model/vnd.opengex": {
        source: "iana",
        extensions: ["ogex"]
      },
      "model/vnd.parasolid.transmit.binary": {
        source: "iana",
        extensions: ["x_b"]
      },
      "model/vnd.parasolid.transmit.text": {
        source: "iana",
        extensions: ["x_t"]
      },
      "model/vnd.pytha.pyox": {
        source: "iana"
      },
      "model/vnd.rosette.annotated-data-model": {
        source: "iana"
      },
      "model/vnd.sap.vds": {
        source: "iana",
        extensions: ["vds"]
      },
      "model/vnd.usdz+zip": {
        source: "iana",
        compressible: false,
        extensions: ["usdz"]
      },
      "model/vnd.valve.source.compiled-map": {
        source: "iana",
        extensions: ["bsp"]
      },
      "model/vnd.vtu": {
        source: "iana",
        extensions: ["vtu"]
      },
      "model/vrml": {
        source: "iana",
        compressible: false,
        extensions: ["wrl", "vrml"]
      },
      "model/x3d+binary": {
        source: "apache",
        compressible: false,
        extensions: ["x3db", "x3dbz"]
      },
      "model/x3d+fastinfoset": {
        source: "iana",
        extensions: ["x3db"]
      },
      "model/x3d+vrml": {
        source: "apache",
        compressible: false,
        extensions: ["x3dv", "x3dvz"]
      },
      "model/x3d+xml": {
        source: "iana",
        compressible: true,
        extensions: ["x3d", "x3dz"]
      },
      "model/x3d-vrml": {
        source: "iana",
        extensions: ["x3dv"]
      },
      "multipart/alternative": {
        source: "iana",
        compressible: false
      },
      "multipart/appledouble": {
        source: "iana"
      },
      "multipart/byteranges": {
        source: "iana"
      },
      "multipart/digest": {
        source: "iana"
      },
      "multipart/encrypted": {
        source: "iana",
        compressible: false
      },
      "multipart/form-data": {
        source: "iana",
        compressible: false
      },
      "multipart/header-set": {
        source: "iana"
      },
      "multipart/mixed": {
        source: "iana"
      },
      "multipart/multilingual": {
        source: "iana"
      },
      "multipart/parallel": {
        source: "iana"
      },
      "multipart/related": {
        source: "iana",
        compressible: false
      },
      "multipart/report": {
        source: "iana"
      },
      "multipart/signed": {
        source: "iana",
        compressible: false
      },
      "multipart/vnd.bint.med-plus": {
        source: "iana"
      },
      "multipart/voice-message": {
        source: "iana"
      },
      "multipart/x-mixed-replace": {
        source: "iana"
      },
      "text/1d-interleaved-parityfec": {
        source: "iana"
      },
      "text/cache-manifest": {
        source: "iana",
        compressible: true,
        extensions: ["appcache", "manifest"]
      },
      "text/calendar": {
        source: "iana",
        extensions: ["ics", "ifb"]
      },
      "text/calender": {
        compressible: true
      },
      "text/cmd": {
        compressible: true
      },
      "text/coffeescript": {
        extensions: ["coffee", "litcoffee"]
      },
      "text/cql": {
        source: "iana"
      },
      "text/cql-expression": {
        source: "iana"
      },
      "text/cql-identifier": {
        source: "iana"
      },
      "text/css": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["css"]
      },
      "text/csv": {
        source: "iana",
        compressible: true,
        extensions: ["csv"]
      },
      "text/csv-schema": {
        source: "iana"
      },
      "text/directory": {
        source: "iana"
      },
      "text/dns": {
        source: "iana"
      },
      "text/ecmascript": {
        source: "iana"
      },
      "text/encaprtp": {
        source: "iana"
      },
      "text/enriched": {
        source: "iana"
      },
      "text/fhirpath": {
        source: "iana"
      },
      "text/flexfec": {
        source: "iana"
      },
      "text/fwdred": {
        source: "iana"
      },
      "text/gff3": {
        source: "iana"
      },
      "text/grammar-ref-list": {
        source: "iana"
      },
      "text/html": {
        source: "iana",
        compressible: true,
        extensions: ["html", "htm", "shtml"]
      },
      "text/jade": {
        extensions: ["jade"]
      },
      "text/javascript": {
        source: "iana",
        compressible: true
      },
      "text/jcr-cnd": {
        source: "iana"
      },
      "text/jsx": {
        compressible: true,
        extensions: ["jsx"]
      },
      "text/less": {
        compressible: true,
        extensions: ["less"]
      },
      "text/markdown": {
        source: "iana",
        compressible: true,
        extensions: ["markdown", "md"]
      },
      "text/mathml": {
        source: "nginx",
        extensions: ["mml"]
      },
      "text/mdx": {
        compressible: true,
        extensions: ["mdx"]
      },
      "text/mizar": {
        source: "iana"
      },
      "text/n3": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["n3"]
      },
      "text/parameters": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/parityfec": {
        source: "iana"
      },
      "text/plain": {
        source: "iana",
        compressible: true,
        extensions: ["txt", "text", "conf", "def", "list", "log", "in", "ini"]
      },
      "text/provenance-notation": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/prs.fallenstein.rst": {
        source: "iana"
      },
      "text/prs.lines.tag": {
        source: "iana",
        extensions: ["dsc"]
      },
      "text/prs.prop.logic": {
        source: "iana"
      },
      "text/raptorfec": {
        source: "iana"
      },
      "text/red": {
        source: "iana"
      },
      "text/rfc822-headers": {
        source: "iana"
      },
      "text/richtext": {
        source: "iana",
        compressible: true,
        extensions: ["rtx"]
      },
      "text/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "text/rtp-enc-aescm128": {
        source: "iana"
      },
      "text/rtploopback": {
        source: "iana"
      },
      "text/rtx": {
        source: "iana"
      },
      "text/sgml": {
        source: "iana",
        extensions: ["sgml", "sgm"]
      },
      "text/shaclc": {
        source: "iana"
      },
      "text/shex": {
        source: "iana",
        extensions: ["shex"]
      },
      "text/slim": {
        extensions: ["slim", "slm"]
      },
      "text/spdx": {
        source: "iana",
        extensions: ["spdx"]
      },
      "text/strings": {
        source: "iana"
      },
      "text/stylus": {
        extensions: ["stylus", "styl"]
      },
      "text/t140": {
        source: "iana"
      },
      "text/tab-separated-values": {
        source: "iana",
        compressible: true,
        extensions: ["tsv"]
      },
      "text/troff": {
        source: "iana",
        extensions: ["t", "tr", "roff", "man", "me", "ms"]
      },
      "text/turtle": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["ttl"]
      },
      "text/ulpfec": {
        source: "iana"
      },
      "text/uri-list": {
        source: "iana",
        compressible: true,
        extensions: ["uri", "uris", "urls"]
      },
      "text/vcard": {
        source: "iana",
        compressible: true,
        extensions: ["vcard"]
      },
      "text/vnd.a": {
        source: "iana"
      },
      "text/vnd.abc": {
        source: "iana"
      },
      "text/vnd.ascii-art": {
        source: "iana"
      },
      "text/vnd.curl": {
        source: "iana",
        extensions: ["curl"]
      },
      "text/vnd.curl.dcurl": {
        source: "apache",
        extensions: ["dcurl"]
      },
      "text/vnd.curl.mcurl": {
        source: "apache",
        extensions: ["mcurl"]
      },
      "text/vnd.curl.scurl": {
        source: "apache",
        extensions: ["scurl"]
      },
      "text/vnd.debian.copyright": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.dmclientscript": {
        source: "iana"
      },
      "text/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "text/vnd.esmertec.theme-descriptor": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.familysearch.gedcom": {
        source: "iana",
        extensions: ["ged"]
      },
      "text/vnd.ficlab.flt": {
        source: "iana"
      },
      "text/vnd.fly": {
        source: "iana",
        extensions: ["fly"]
      },
      "text/vnd.fmi.flexstor": {
        source: "iana",
        extensions: ["flx"]
      },
      "text/vnd.gml": {
        source: "iana"
      },
      "text/vnd.graphviz": {
        source: "iana",
        extensions: ["gv"]
      },
      "text/vnd.hans": {
        source: "iana"
      },
      "text/vnd.hgl": {
        source: "iana"
      },
      "text/vnd.in3d.3dml": {
        source: "iana",
        extensions: ["3dml"]
      },
      "text/vnd.in3d.spot": {
        source: "iana",
        extensions: ["spot"]
      },
      "text/vnd.iptc.newsml": {
        source: "iana"
      },
      "text/vnd.iptc.nitf": {
        source: "iana"
      },
      "text/vnd.latex-z": {
        source: "iana"
      },
      "text/vnd.motorola.reflex": {
        source: "iana"
      },
      "text/vnd.ms-mediapackage": {
        source: "iana"
      },
      "text/vnd.net2phone.commcenter.command": {
        source: "iana"
      },
      "text/vnd.radisys.msml-basic-layout": {
        source: "iana"
      },
      "text/vnd.senx.warpscript": {
        source: "iana"
      },
      "text/vnd.si.uricatalogue": {
        source: "iana"
      },
      "text/vnd.sosi": {
        source: "iana"
      },
      "text/vnd.sun.j2me.app-descriptor": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["jad"]
      },
      "text/vnd.trolltech.linguist": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.wap.si": {
        source: "iana"
      },
      "text/vnd.wap.sl": {
        source: "iana"
      },
      "text/vnd.wap.wml": {
        source: "iana",
        extensions: ["wml"]
      },
      "text/vnd.wap.wmlscript": {
        source: "iana",
        extensions: ["wmls"]
      },
      "text/vtt": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["vtt"]
      },
      "text/x-asm": {
        source: "apache",
        extensions: ["s", "asm"]
      },
      "text/x-c": {
        source: "apache",
        extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"]
      },
      "text/x-component": {
        source: "nginx",
        extensions: ["htc"]
      },
      "text/x-fortran": {
        source: "apache",
        extensions: ["f", "for", "f77", "f90"]
      },
      "text/x-gwt-rpc": {
        compressible: true
      },
      "text/x-handlebars-template": {
        extensions: ["hbs"]
      },
      "text/x-java-source": {
        source: "apache",
        extensions: ["java"]
      },
      "text/x-jquery-tmpl": {
        compressible: true
      },
      "text/x-lua": {
        extensions: ["lua"]
      },
      "text/x-markdown": {
        compressible: true,
        extensions: ["mkd"]
      },
      "text/x-nfo": {
        source: "apache",
        extensions: ["nfo"]
      },
      "text/x-opml": {
        source: "apache",
        extensions: ["opml"]
      },
      "text/x-org": {
        compressible: true,
        extensions: ["org"]
      },
      "text/x-pascal": {
        source: "apache",
        extensions: ["p", "pas"]
      },
      "text/x-processing": {
        compressible: true,
        extensions: ["pde"]
      },
      "text/x-sass": {
        extensions: ["sass"]
      },
      "text/x-scss": {
        extensions: ["scss"]
      },
      "text/x-setext": {
        source: "apache",
        extensions: ["etx"]
      },
      "text/x-sfv": {
        source: "apache",
        extensions: ["sfv"]
      },
      "text/x-suse-ymp": {
        compressible: true,
        extensions: ["ymp"]
      },
      "text/x-uuencode": {
        source: "apache",
        extensions: ["uu"]
      },
      "text/x-vcalendar": {
        source: "apache",
        extensions: ["vcs"]
      },
      "text/x-vcard": {
        source: "apache",
        extensions: ["vcf"]
      },
      "text/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml"]
      },
      "text/xml-external-parsed-entity": {
        source: "iana"
      },
      "text/yaml": {
        compressible: true,
        extensions: ["yaml", "yml"]
      },
      "video/1d-interleaved-parityfec": {
        source: "iana"
      },
      "video/3gpp": {
        source: "iana",
        extensions: ["3gp", "3gpp"]
      },
      "video/3gpp-tt": {
        source: "iana"
      },
      "video/3gpp2": {
        source: "iana",
        extensions: ["3g2"]
      },
      "video/av1": {
        source: "iana"
      },
      "video/bmpeg": {
        source: "iana"
      },
      "video/bt656": {
        source: "iana"
      },
      "video/celb": {
        source: "iana"
      },
      "video/dv": {
        source: "iana"
      },
      "video/encaprtp": {
        source: "iana"
      },
      "video/ffv1": {
        source: "iana"
      },
      "video/flexfec": {
        source: "iana"
      },
      "video/h261": {
        source: "iana",
        extensions: ["h261"]
      },
      "video/h263": {
        source: "iana",
        extensions: ["h263"]
      },
      "video/h263-1998": {
        source: "iana"
      },
      "video/h263-2000": {
        source: "iana"
      },
      "video/h264": {
        source: "iana",
        extensions: ["h264"]
      },
      "video/h264-rcdo": {
        source: "iana"
      },
      "video/h264-svc": {
        source: "iana"
      },
      "video/h265": {
        source: "iana"
      },
      "video/iso.segment": {
        source: "iana",
        extensions: ["m4s"]
      },
      "video/jpeg": {
        source: "iana",
        extensions: ["jpgv"]
      },
      "video/jpeg2000": {
        source: "iana"
      },
      "video/jpm": {
        source: "apache",
        extensions: ["jpm", "jpgm"]
      },
      "video/jxsv": {
        source: "iana"
      },
      "video/mj2": {
        source: "iana",
        extensions: ["mj2", "mjp2"]
      },
      "video/mp1s": {
        source: "iana"
      },
      "video/mp2p": {
        source: "iana"
      },
      "video/mp2t": {
        source: "iana",
        extensions: ["ts"]
      },
      "video/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["mp4", "mp4v", "mpg4"]
      },
      "video/mp4v-es": {
        source: "iana"
      },
      "video/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"]
      },
      "video/mpeg4-generic": {
        source: "iana"
      },
      "video/mpv": {
        source: "iana"
      },
      "video/nv": {
        source: "iana"
      },
      "video/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogv"]
      },
      "video/parityfec": {
        source: "iana"
      },
      "video/pointer": {
        source: "iana"
      },
      "video/quicktime": {
        source: "iana",
        compressible: false,
        extensions: ["qt", "mov"]
      },
      "video/raptorfec": {
        source: "iana"
      },
      "video/raw": {
        source: "iana"
      },
      "video/rtp-enc-aescm128": {
        source: "iana"
      },
      "video/rtploopback": {
        source: "iana"
      },
      "video/rtx": {
        source: "iana"
      },
      "video/scip": {
        source: "iana"
      },
      "video/smpte291": {
        source: "iana"
      },
      "video/smpte292m": {
        source: "iana"
      },
      "video/ulpfec": {
        source: "iana"
      },
      "video/vc1": {
        source: "iana"
      },
      "video/vc2": {
        source: "iana"
      },
      "video/vnd.cctv": {
        source: "iana"
      },
      "video/vnd.dece.hd": {
        source: "iana",
        extensions: ["uvh", "uvvh"]
      },
      "video/vnd.dece.mobile": {
        source: "iana",
        extensions: ["uvm", "uvvm"]
      },
      "video/vnd.dece.mp4": {
        source: "iana"
      },
      "video/vnd.dece.pd": {
        source: "iana",
        extensions: ["uvp", "uvvp"]
      },
      "video/vnd.dece.sd": {
        source: "iana",
        extensions: ["uvs", "uvvs"]
      },
      "video/vnd.dece.video": {
        source: "iana",
        extensions: ["uvv", "uvvv"]
      },
      "video/vnd.directv.mpeg": {
        source: "iana"
      },
      "video/vnd.directv.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dlna.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dvb.file": {
        source: "iana",
        extensions: ["dvb"]
      },
      "video/vnd.fvt": {
        source: "iana",
        extensions: ["fvt"]
      },
      "video/vnd.hns.video": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsavc": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsmpeg2": {
        source: "iana"
      },
      "video/vnd.motorola.video": {
        source: "iana"
      },
      "video/vnd.motorola.videop": {
        source: "iana"
      },
      "video/vnd.mpegurl": {
        source: "iana",
        extensions: ["mxu", "m4u"]
      },
      "video/vnd.ms-playready.media.pyv": {
        source: "iana",
        extensions: ["pyv"]
      },
      "video/vnd.nokia.interleaved-multimedia": {
        source: "iana"
      },
      "video/vnd.nokia.mp4vr": {
        source: "iana"
      },
      "video/vnd.nokia.videovoip": {
        source: "iana"
      },
      "video/vnd.objectvideo": {
        source: "iana"
      },
      "video/vnd.radgamettools.bink": {
        source: "iana"
      },
      "video/vnd.radgamettools.smacker": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg1": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg4": {
        source: "iana"
      },
      "video/vnd.sealed.swf": {
        source: "iana"
      },
      "video/vnd.sealedmedia.softseal.mov": {
        source: "iana"
      },
      "video/vnd.uvvu.mp4": {
        source: "iana",
        extensions: ["uvu", "uvvu"]
      },
      "video/vnd.vivo": {
        source: "iana",
        extensions: ["viv"]
      },
      "video/vnd.youtube.yt": {
        source: "iana"
      },
      "video/vp8": {
        source: "iana"
      },
      "video/vp9": {
        source: "iana"
      },
      "video/webm": {
        source: "apache",
        compressible: false,
        extensions: ["webm"]
      },
      "video/x-f4v": {
        source: "apache",
        extensions: ["f4v"]
      },
      "video/x-fli": {
        source: "apache",
        extensions: ["fli"]
      },
      "video/x-flv": {
        source: "apache",
        compressible: false,
        extensions: ["flv"]
      },
      "video/x-m4v": {
        source: "apache",
        extensions: ["m4v"]
      },
      "video/x-matroska": {
        source: "apache",
        compressible: false,
        extensions: ["mkv", "mk3d", "mks"]
      },
      "video/x-mng": {
        source: "apache",
        extensions: ["mng"]
      },
      "video/x-ms-asf": {
        source: "apache",
        extensions: ["asf", "asx"]
      },
      "video/x-ms-vob": {
        source: "apache",
        extensions: ["vob"]
      },
      "video/x-ms-wm": {
        source: "apache",
        extensions: ["wm"]
      },
      "video/x-ms-wmv": {
        source: "apache",
        compressible: false,
        extensions: ["wmv"]
      },
      "video/x-ms-wmx": {
        source: "apache",
        extensions: ["wmx"]
      },
      "video/x-ms-wvx": {
        source: "apache",
        extensions: ["wvx"]
      },
      "video/x-msvideo": {
        source: "apache",
        extensions: ["avi"]
      },
      "video/x-sgi-movie": {
        source: "apache",
        extensions: ["movie"]
      },
      "video/x-smv": {
        source: "apache",
        extensions: ["smv"]
      },
      "x-conference/x-cooltalk": {
        source: "apache",
        extensions: ["ice"]
      },
      "x-shader/x-fragment": {
        compressible: true
      },
      "x-shader/x-vertex": {
        compressible: true
      }
    };
  }
});

// node_modules/mime-db/index.js
var require_mime_db = __commonJS({
  "node_modules/mime-db/index.js"(exports2, module2) {
    module2.exports = require_db();
  }
});

// node_modules/mime-types/index.js
var require_mime_types = __commonJS({
  "node_modules/mime-types/index.js"(exports2) {
    "use strict";
    var db = require_mime_db();
    var extname = require("path").extname;
    var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
    var TEXT_TYPE_REGEXP = /^text\//i;
    exports2.charset = charset;
    exports2.charsets = { lookup: charset };
    exports2.contentType = contentType;
    exports2.extension = extension;
    exports2.extensions = /* @__PURE__ */ Object.create(null);
    exports2.lookup = lookup;
    exports2.types = /* @__PURE__ */ Object.create(null);
    populateMaps(exports2.extensions, exports2.types);
    function charset(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var mime = match && db[match[1].toLowerCase()];
      if (mime && mime.charset) {
        return mime.charset;
      }
      if (match && TEXT_TYPE_REGEXP.test(match[1])) {
        return "UTF-8";
      }
      return false;
    }
    function contentType(str) {
      if (!str || typeof str !== "string") {
        return false;
      }
      var mime = str.indexOf("/") === -1 ? exports2.lookup(str) : str;
      if (!mime) {
        return false;
      }
      if (mime.indexOf("charset") === -1) {
        var charset2 = exports2.charset(mime);
        if (charset2) mime += "; charset=" + charset2.toLowerCase();
      }
      return mime;
    }
    function extension(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var exts = match && exports2.extensions[match[1].toLowerCase()];
      if (!exts || !exts.length) {
        return false;
      }
      return exts[0];
    }
    function lookup(path) {
      if (!path || typeof path !== "string") {
        return false;
      }
      var extension2 = extname("x." + path).toLowerCase().substr(1);
      if (!extension2) {
        return false;
      }
      return exports2.types[extension2] || false;
    }
    function populateMaps(extensions, types) {
      var preference = ["nginx", "apache", void 0, "iana"];
      Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
          return;
        }
        extensions[type] = exts;
        for (var i = 0; i < exts.length; i++) {
          var extension2 = exts[i];
          if (types[extension2]) {
            var from = preference.indexOf(db[types[extension2]].source);
            var to = preference.indexOf(mime.source);
            if (types[extension2] !== "application/octet-stream" && (from > to || from === to && types[extension2].substr(0, 12) === "application/")) {
              continue;
            }
          }
          types[extension2] = type;
        }
      });
    }
  }
});

// node_modules/asynckit/lib/defer.js
var require_defer = __commonJS({
  "node_modules/asynckit/lib/defer.js"(exports2, module2) {
    module2.exports = defer;
    function defer(fn) {
      var nextTick = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
      if (nextTick) {
        nextTick(fn);
      } else {
        setTimeout(fn, 0);
      }
    }
  }
});

// node_modules/asynckit/lib/async.js
var require_async = __commonJS({
  "node_modules/asynckit/lib/async.js"(exports2, module2) {
    var defer = require_defer();
    module2.exports = async;
    function async(callback) {
      var isAsync = false;
      defer(function() {
        isAsync = true;
      });
      return function async_callback(err, result) {
        if (isAsync) {
          callback(err, result);
        } else {
          defer(function nextTick_callback() {
            callback(err, result);
          });
        }
      };
    }
  }
});

// node_modules/asynckit/lib/abort.js
var require_abort = __commonJS({
  "node_modules/asynckit/lib/abort.js"(exports2, module2) {
    module2.exports = abort;
    function abort(state) {
      Object.keys(state.jobs).forEach(clean.bind(state));
      state.jobs = {};
    }
    function clean(key) {
      if (typeof this.jobs[key] == "function") {
        this.jobs[key]();
      }
    }
  }
});

// node_modules/asynckit/lib/iterate.js
var require_iterate = __commonJS({
  "node_modules/asynckit/lib/iterate.js"(exports2, module2) {
    var async = require_async();
    var abort = require_abort();
    module2.exports = iterate;
    function iterate(list, iterator, state, callback) {
      var key = state["keyedList"] ? state["keyedList"][state.index] : state.index;
      state.jobs[key] = runJob(iterator, key, list[key], function(error, output) {
        if (!(key in state.jobs)) {
          return;
        }
        delete state.jobs[key];
        if (error) {
          abort(state);
        } else {
          state.results[key] = output;
        }
        callback(error, state.results);
      });
    }
    function runJob(iterator, key, item, callback) {
      var aborter;
      if (iterator.length == 2) {
        aborter = iterator(item, async(callback));
      } else {
        aborter = iterator(item, key, async(callback));
      }
      return aborter;
    }
  }
});

// node_modules/asynckit/lib/state.js
var require_state = __commonJS({
  "node_modules/asynckit/lib/state.js"(exports2, module2) {
    module2.exports = state;
    function state(list, sortMethod) {
      var isNamedList = !Array.isArray(list), initState = {
        index: 0,
        keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
        jobs: {},
        results: isNamedList ? {} : [],
        size: isNamedList ? Object.keys(list).length : list.length
      };
      if (sortMethod) {
        initState.keyedList.sort(isNamedList ? sortMethod : function(a, b) {
          return sortMethod(list[a], list[b]);
        });
      }
      return initState;
    }
  }
});

// node_modules/asynckit/lib/terminator.js
var require_terminator = __commonJS({
  "node_modules/asynckit/lib/terminator.js"(exports2, module2) {
    var abort = require_abort();
    var async = require_async();
    module2.exports = terminator;
    function terminator(callback) {
      if (!Object.keys(this.jobs).length) {
        return;
      }
      this.index = this.size;
      abort(this);
      async(callback)(null, this.results);
    }
  }
});

// node_modules/asynckit/parallel.js
var require_parallel = __commonJS({
  "node_modules/asynckit/parallel.js"(exports2, module2) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module2.exports = parallel;
    function parallel(list, iterator, callback) {
      var state = initState(list);
      while (state.index < (state["keyedList"] || list).length) {
        iterate(list, iterator, state, function(error, result) {
          if (error) {
            callback(error, result);
            return;
          }
          if (Object.keys(state.jobs).length === 0) {
            callback(null, state.results);
            return;
          }
        });
        state.index++;
      }
      return terminator.bind(state, callback);
    }
  }
});

// node_modules/asynckit/serialOrdered.js
var require_serialOrdered = __commonJS({
  "node_modules/asynckit/serialOrdered.js"(exports2, module2) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module2.exports = serialOrdered;
    module2.exports.ascending = ascending;
    module2.exports.descending = descending;
    function serialOrdered(list, iterator, sortMethod, callback) {
      var state = initState(list, sortMethod);
      iterate(list, iterator, state, function iteratorHandler(error, result) {
        if (error) {
          callback(error, result);
          return;
        }
        state.index++;
        if (state.index < (state["keyedList"] || list).length) {
          iterate(list, iterator, state, iteratorHandler);
          return;
        }
        callback(null, state.results);
      });
      return terminator.bind(state, callback);
    }
    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    }
    function descending(a, b) {
      return -1 * ascending(a, b);
    }
  }
});

// node_modules/asynckit/serial.js
var require_serial = __commonJS({
  "node_modules/asynckit/serial.js"(exports2, module2) {
    var serialOrdered = require_serialOrdered();
    module2.exports = serial;
    function serial(list, iterator, callback) {
      return serialOrdered(list, iterator, null, callback);
    }
  }
});

// node_modules/asynckit/index.js
var require_asynckit = __commonJS({
  "node_modules/asynckit/index.js"(exports2, module2) {
    module2.exports = {
      parallel: require_parallel(),
      serial: require_serial(),
      serialOrdered: require_serialOrdered()
    };
  }
});

// node_modules/es-object-atoms/index.js
var require_es_object_atoms = __commonJS({
  "node_modules/es-object-atoms/index.js"(exports2, module2) {
    "use strict";
    module2.exports = Object;
  }
});

// node_modules/es-errors/index.js
var require_es_errors = __commonJS({
  "node_modules/es-errors/index.js"(exports2, module2) {
    "use strict";
    module2.exports = Error;
  }
});

// node_modules/es-errors/eval.js
var require_eval = __commonJS({
  "node_modules/es-errors/eval.js"(exports2, module2) {
    "use strict";
    module2.exports = EvalError;
  }
});

// node_modules/es-errors/range.js
var require_range = __commonJS({
  "node_modules/es-errors/range.js"(exports2, module2) {
    "use strict";
    module2.exports = RangeError;
  }
});

// node_modules/es-errors/ref.js
var require_ref = __commonJS({
  "node_modules/es-errors/ref.js"(exports2, module2) {
    "use strict";
    module2.exports = ReferenceError;
  }
});

// node_modules/es-errors/syntax.js
var require_syntax = __commonJS({
  "node_modules/es-errors/syntax.js"(exports2, module2) {
    "use strict";
    module2.exports = SyntaxError;
  }
});

// node_modules/es-errors/type.js
var require_type = __commonJS({
  "node_modules/es-errors/type.js"(exports2, module2) {
    "use strict";
    module2.exports = TypeError;
  }
});

// node_modules/es-errors/uri.js
var require_uri = __commonJS({
  "node_modules/es-errors/uri.js"(exports2, module2) {
    "use strict";
    module2.exports = URIError;
  }
});

// node_modules/math-intrinsics/abs.js
var require_abs = __commonJS({
  "node_modules/math-intrinsics/abs.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.abs;
  }
});

// node_modules/math-intrinsics/floor.js
var require_floor = __commonJS({
  "node_modules/math-intrinsics/floor.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.floor;
  }
});

// node_modules/math-intrinsics/max.js
var require_max = __commonJS({
  "node_modules/math-intrinsics/max.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.max;
  }
});

// node_modules/math-intrinsics/min.js
var require_min = __commonJS({
  "node_modules/math-intrinsics/min.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.min;
  }
});

// node_modules/math-intrinsics/pow.js
var require_pow = __commonJS({
  "node_modules/math-intrinsics/pow.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.pow;
  }
});

// node_modules/math-intrinsics/round.js
var require_round = __commonJS({
  "node_modules/math-intrinsics/round.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.round;
  }
});

// node_modules/math-intrinsics/isNaN.js
var require_isNaN = __commonJS({
  "node_modules/math-intrinsics/isNaN.js"(exports2, module2) {
    "use strict";
    module2.exports = Number.isNaN || function isNaN2(a) {
      return a !== a;
    };
  }
});

// node_modules/math-intrinsics/sign.js
var require_sign = __commonJS({
  "node_modules/math-intrinsics/sign.js"(exports2, module2) {
    "use strict";
    var $isNaN = require_isNaN();
    module2.exports = function sign(number) {
      if ($isNaN(number) || number === 0) {
        return number;
      }
      return number < 0 ? -1 : 1;
    };
  }
});

// node_modules/gopd/gOPD.js
var require_gOPD = __commonJS({
  "node_modules/gopd/gOPD.js"(exports2, module2) {
    "use strict";
    module2.exports = Object.getOwnPropertyDescriptor;
  }
});

// node_modules/gopd/index.js
var require_gopd = __commonJS({
  "node_modules/gopd/index.js"(exports2, module2) {
    "use strict";
    var $gOPD = require_gOPD();
    if ($gOPD) {
      try {
        $gOPD([], "length");
      } catch (e) {
        $gOPD = null;
      }
    }
    module2.exports = $gOPD;
  }
});

// node_modules/es-define-property/index.js
var require_es_define_property = __commonJS({
  "node_modules/es-define-property/index.js"(exports2, module2) {
    "use strict";
    var $defineProperty = Object.defineProperty || false;
    if ($defineProperty) {
      try {
        $defineProperty({}, "a", { value: 1 });
      } catch (e) {
        $defineProperty = false;
      }
    }
    module2.exports = $defineProperty;
  }
});

// node_modules/has-symbols/shams.js
var require_shams = __commonJS({
  "node_modules/has-symbols/shams.js"(exports2, module2) {
    "use strict";
    module2.exports = function hasSymbols() {
      if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
        return false;
      }
      if (typeof Symbol.iterator === "symbol") {
        return true;
      }
      var obj = {};
      var sym = Symbol("test");
      var symObj = Object(sym);
      if (typeof sym === "string") {
        return false;
      }
      if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
        return false;
      }
      if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
        return false;
      }
      var symVal = 42;
      obj[sym] = symVal;
      for (var _ in obj) {
        return false;
      }
      if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
        return false;
      }
      if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
      }
      var syms = Object.getOwnPropertySymbols(obj);
      if (syms.length !== 1 || syms[0] !== sym) {
        return false;
      }
      if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
      }
      if (typeof Object.getOwnPropertyDescriptor === "function") {
        var descriptor = (
          /** @type {PropertyDescriptor} */
          Object.getOwnPropertyDescriptor(obj, sym)
        );
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
          return false;
        }
      }
      return true;
    };
  }
});

// node_modules/has-symbols/index.js
var require_has_symbols = __commonJS({
  "node_modules/has-symbols/index.js"(exports2, module2) {
    "use strict";
    var origSymbol = typeof Symbol !== "undefined" && Symbol;
    var hasSymbolSham = require_shams();
    module2.exports = function hasNativeSymbols() {
      if (typeof origSymbol !== "function") {
        return false;
      }
      if (typeof Symbol !== "function") {
        return false;
      }
      if (typeof origSymbol("foo") !== "symbol") {
        return false;
      }
      if (typeof Symbol("bar") !== "symbol") {
        return false;
      }
      return hasSymbolSham();
    };
  }
});

// node_modules/get-proto/Reflect.getPrototypeOf.js
var require_Reflect_getPrototypeOf = __commonJS({
  "node_modules/get-proto/Reflect.getPrototypeOf.js"(exports2, module2) {
    "use strict";
    module2.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
  }
});

// node_modules/get-proto/Object.getPrototypeOf.js
var require_Object_getPrototypeOf = __commonJS({
  "node_modules/get-proto/Object.getPrototypeOf.js"(exports2, module2) {
    "use strict";
    var $Object = require_es_object_atoms();
    module2.exports = $Object.getPrototypeOf || null;
  }
});

// node_modules/function-bind/implementation.js
var require_implementation = __commonJS({
  "node_modules/function-bind/implementation.js"(exports2, module2) {
    "use strict";
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var toStr = Object.prototype.toString;
    var max = Math.max;
    var funcType = "[object Function]";
    var concatty = function concatty2(a, b) {
      var arr = [];
      for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
      }
      for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
      }
      return arr;
    };
    var slicy = function slicy2(arrLike, offset) {
      var arr = [];
      for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
      }
      return arr;
    };
    var joiny = function(arr, joiner) {
      var str = "";
      for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
          str += joiner;
        }
      }
      return str;
    };
    module2.exports = function bind(that) {
      var target = this;
      if (typeof target !== "function" || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slicy(arguments, 1);
      var bound;
      var binder = function() {
        if (this instanceof bound) {
          var result = target.apply(
            this,
            concatty(args, arguments)
          );
          if (Object(result) === result) {
            return result;
          }
          return this;
        }
        return target.apply(
          that,
          concatty(args, arguments)
        );
      };
      var boundLength = max(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = "$" + i;
      }
      bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
      if (target.prototype) {
        var Empty = function Empty2() {
        };
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    };
  }
});

// node_modules/function-bind/index.js
var require_function_bind = __commonJS({
  "node_modules/function-bind/index.js"(exports2, module2) {
    "use strict";
    var implementation = require_implementation();
    module2.exports = Function.prototype.bind || implementation;
  }
});

// node_modules/call-bind-apply-helpers/functionCall.js
var require_functionCall = __commonJS({
  "node_modules/call-bind-apply-helpers/functionCall.js"(exports2, module2) {
    "use strict";
    module2.exports = Function.prototype.call;
  }
});

// node_modules/call-bind-apply-helpers/functionApply.js
var require_functionApply = __commonJS({
  "node_modules/call-bind-apply-helpers/functionApply.js"(exports2, module2) {
    "use strict";
    module2.exports = Function.prototype.apply;
  }
});

// node_modules/call-bind-apply-helpers/reflectApply.js
var require_reflectApply = __commonJS({
  "node_modules/call-bind-apply-helpers/reflectApply.js"(exports2, module2) {
    "use strict";
    module2.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
  }
});

// node_modules/call-bind-apply-helpers/actualApply.js
var require_actualApply = __commonJS({
  "node_modules/call-bind-apply-helpers/actualApply.js"(exports2, module2) {
    "use strict";
    var bind = require_function_bind();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var $reflectApply = require_reflectApply();
    module2.exports = $reflectApply || bind.call($call, $apply);
  }
});

// node_modules/call-bind-apply-helpers/index.js
var require_call_bind_apply_helpers = __commonJS({
  "node_modules/call-bind-apply-helpers/index.js"(exports2, module2) {
    "use strict";
    var bind = require_function_bind();
    var $TypeError = require_type();
    var $call = require_functionCall();
    var $actualApply = require_actualApply();
    module2.exports = function callBindBasic(args) {
      if (args.length < 1 || typeof args[0] !== "function") {
        throw new $TypeError("a function is required");
      }
      return $actualApply(bind, $call, args);
    };
  }
});

// node_modules/dunder-proto/get.js
var require_get = __commonJS({
  "node_modules/dunder-proto/get.js"(exports2, module2) {
    "use strict";
    var callBind = require_call_bind_apply_helpers();
    var gOPD = require_gopd();
    var hasProtoAccessor;
    try {
      hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
      [].__proto__ === Array.prototype;
    } catch (e) {
      if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
        throw e;
      }
    }
    var desc = !!hasProtoAccessor && gOPD && gOPD(
      Object.prototype,
      /** @type {keyof typeof Object.prototype} */
      "__proto__"
    );
    var $Object = Object;
    var $getPrototypeOf = $Object.getPrototypeOf;
    module2.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
      /** @type {import('./get')} */
      function getDunder(value) {
        return $getPrototypeOf(value == null ? value : $Object(value));
      }
    ) : false;
  }
});

// node_modules/get-proto/index.js
var require_get_proto = __commonJS({
  "node_modules/get-proto/index.js"(exports2, module2) {
    "use strict";
    var reflectGetProto = require_Reflect_getPrototypeOf();
    var originalGetProto = require_Object_getPrototypeOf();
    var getDunderProto = require_get();
    module2.exports = reflectGetProto ? function getProto(O) {
      return reflectGetProto(O);
    } : originalGetProto ? function getProto(O) {
      if (!O || typeof O !== "object" && typeof O !== "function") {
        throw new TypeError("getProto: not an object");
      }
      return originalGetProto(O);
    } : getDunderProto ? function getProto(O) {
      return getDunderProto(O);
    } : null;
  }
});

// node_modules/hasown/index.js
var require_hasown = __commonJS({
  "node_modules/hasown/index.js"(exports2, module2) {
    "use strict";
    var call = Function.prototype.call;
    var $hasOwn = Object.prototype.hasOwnProperty;
    var bind = require_function_bind();
    module2.exports = bind.call(call, $hasOwn);
  }
});

// node_modules/get-intrinsic/index.js
var require_get_intrinsic = __commonJS({
  "node_modules/get-intrinsic/index.js"(exports2, module2) {
    "use strict";
    var undefined2;
    var $Object = require_es_object_atoms();
    var $Error = require_es_errors();
    var $EvalError = require_eval();
    var $RangeError = require_range();
    var $ReferenceError = require_ref();
    var $SyntaxError = require_syntax();
    var $TypeError = require_type();
    var $URIError = require_uri();
    var abs = require_abs();
    var floor = require_floor();
    var max = require_max();
    var min = require_min();
    var pow = require_pow();
    var round = require_round();
    var sign = require_sign();
    var $Function = Function;
    var getEvalledConstructor = function(expressionSyntax) {
      try {
        return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
      } catch (e) {
      }
    };
    var $gOPD = require_gopd();
    var $defineProperty = require_es_define_property();
    var throwTypeError = function() {
      throw new $TypeError();
    };
    var ThrowTypeError = $gOPD ? function() {
      try {
        arguments.callee;
        return throwTypeError;
      } catch (calleeThrows) {
        try {
          return $gOPD(arguments, "callee").get;
        } catch (gOPDthrows) {
          return throwTypeError;
        }
      }
    }() : throwTypeError;
    var hasSymbols = require_has_symbols()();
    var getProto = require_get_proto();
    var $ObjectGPO = require_Object_getPrototypeOf();
    var $ReflectGPO = require_Reflect_getPrototypeOf();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var needsEval = {};
    var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
    var INTRINSICS = {
      __proto__: null,
      "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
      "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
      "%AsyncFromSyncIteratorPrototype%": undefined2,
      "%AsyncFunction%": needsEval,
      "%AsyncGenerator%": needsEval,
      "%AsyncGeneratorFunction%": needsEval,
      "%AsyncIteratorPrototype%": needsEval,
      "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
      "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
      "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
      "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": $Error,
      "%eval%": eval,
      // eslint-disable-line no-eval
      "%EvalError%": $EvalError,
      "%Float16Array%": typeof Float16Array === "undefined" ? undefined2 : Float16Array,
      "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
      "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
      "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
      "%Function%": $Function,
      "%GeneratorFunction%": needsEval,
      "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
      "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
      "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
      "%JSON%": typeof JSON === "object" ? JSON : undefined2,
      "%Map%": typeof Map === "undefined" ? undefined2 : Map,
      "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": $Object,
      "%Object.getOwnPropertyDescriptor%": $gOPD,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
      "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
      "%RangeError%": $RangeError,
      "%ReferenceError%": $ReferenceError,
      "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set === "undefined" ? undefined2 : Set,
      "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
      "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
      "%Symbol%": hasSymbols ? Symbol : undefined2,
      "%SyntaxError%": $SyntaxError,
      "%ThrowTypeError%": ThrowTypeError,
      "%TypedArray%": TypedArray,
      "%TypeError%": $TypeError,
      "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
      "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
      "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
      "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
      "%URIError%": $URIError,
      "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
      "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
      "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
      "%Function.prototype.call%": $call,
      "%Function.prototype.apply%": $apply,
      "%Object.defineProperty%": $defineProperty,
      "%Object.getPrototypeOf%": $ObjectGPO,
      "%Math.abs%": abs,
      "%Math.floor%": floor,
      "%Math.max%": max,
      "%Math.min%": min,
      "%Math.pow%": pow,
      "%Math.round%": round,
      "%Math.sign%": sign,
      "%Reflect.getPrototypeOf%": $ReflectGPO
    };
    if (getProto) {
      try {
        null.error;
      } catch (e) {
        errorProto = getProto(getProto(e));
        INTRINSICS["%Error.prototype%"] = errorProto;
      }
    }
    var errorProto;
    var doEval = function doEval2(name) {
      var value;
      if (name === "%AsyncFunction%") {
        value = getEvalledConstructor("async function () {}");
      } else if (name === "%GeneratorFunction%") {
        value = getEvalledConstructor("function* () {}");
      } else if (name === "%AsyncGeneratorFunction%") {
        value = getEvalledConstructor("async function* () {}");
      } else if (name === "%AsyncGenerator%") {
        var fn = doEval2("%AsyncGeneratorFunction%");
        if (fn) {
          value = fn.prototype;
        }
      } else if (name === "%AsyncIteratorPrototype%") {
        var gen = doEval2("%AsyncGenerator%");
        if (gen && getProto) {
          value = getProto(gen.prototype);
        }
      }
      INTRINSICS[name] = value;
      return value;
    };
    var LEGACY_ALIASES = {
      __proto__: null,
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"]
    };
    var bind = require_function_bind();
    var hasOwn = require_hasown();
    var $concat = bind.call($call, Array.prototype.concat);
    var $spliceApply = bind.call($apply, Array.prototype.splice);
    var $replace = bind.call($call, String.prototype.replace);
    var $strSlice = bind.call($call, String.prototype.slice);
    var $exec = bind.call($call, RegExp.prototype.exec);
    var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = function stringToPath2(string) {
      var first = $strSlice(string, 0, 1);
      var last = $strSlice(string, -1);
      if (first === "%" && last !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
      } else if (last === "%" && first !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
      }
      var result = [];
      $replace(string, rePropName, function(match, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
      });
      return result;
    };
    var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
      var intrinsicName = name;
      var alias;
      if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = "%" + alias[0] + "%";
      }
      if (hasOwn(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
          value = doEval(intrinsicName);
        }
        if (typeof value === "undefined" && !allowMissing) {
          throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
        }
        return {
          alias,
          name: intrinsicName,
          value
        };
      }
      throw new $SyntaxError("intrinsic " + name + " does not exist!");
    };
    module2.exports = function GetIntrinsic(name, allowMissing) {
      if (typeof name !== "string" || name.length === 0) {
        throw new $TypeError("intrinsic name must be a non-empty string");
      }
      if (arguments.length > 1 && typeof allowMissing !== "boolean") {
        throw new $TypeError('"allowMissing" argument must be a boolean');
      }
      if ($exec(/^%?[^%]*%?$/, name) === null) {
        throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
      }
      var parts = stringToPath(name);
      var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
      var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
      var intrinsicRealName = intrinsic.name;
      var value = intrinsic.value;
      var skipFurtherCaching = false;
      var alias = intrinsic.alias;
      if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([0, 1], alias));
      }
      for (var i = 1, isOwn = true; i < parts.length; i += 1) {
        var part = parts[i];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
          throw new $SyntaxError("property names with quotes must have matching quotes");
        }
        if (part === "constructor" || !isOwn) {
          skipFurtherCaching = true;
        }
        intrinsicBaseName += "." + part;
        intrinsicRealName = "%" + intrinsicBaseName + "%";
        if (hasOwn(INTRINSICS, intrinsicRealName)) {
          value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
          if (!(part in value)) {
            if (!allowMissing) {
              throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
            }
            return void undefined2;
          }
          if ($gOPD && i + 1 >= parts.length) {
            var desc = $gOPD(value, part);
            isOwn = !!desc;
            if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
              value = desc.get;
            } else {
              value = value[part];
            }
          } else {
            isOwn = hasOwn(value, part);
            value = value[part];
          }
          if (isOwn && !skipFurtherCaching) {
            INTRINSICS[intrinsicRealName] = value;
          }
        }
      }
      return value;
    };
  }
});

// node_modules/has-tostringtag/shams.js
var require_shams2 = __commonJS({
  "node_modules/has-tostringtag/shams.js"(exports2, module2) {
    "use strict";
    var hasSymbols = require_shams();
    module2.exports = function hasToStringTagShams() {
      return hasSymbols() && !!Symbol.toStringTag;
    };
  }
});

// node_modules/es-set-tostringtag/index.js
var require_es_set_tostringtag = __commonJS({
  "node_modules/es-set-tostringtag/index.js"(exports2, module2) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var $defineProperty = GetIntrinsic("%Object.defineProperty%", true);
    var hasToStringTag = require_shams2()();
    var hasOwn = require_hasown();
    var $TypeError = require_type();
    var toStringTag = hasToStringTag ? Symbol.toStringTag : null;
    module2.exports = function setToStringTag(object, value) {
      var overrideIfSet = arguments.length > 2 && !!arguments[2] && arguments[2].force;
      var nonConfigurable = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
      if (typeof overrideIfSet !== "undefined" && typeof overrideIfSet !== "boolean" || typeof nonConfigurable !== "undefined" && typeof nonConfigurable !== "boolean") {
        throw new $TypeError("if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans");
      }
      if (toStringTag && (overrideIfSet || !hasOwn(object, toStringTag))) {
        if ($defineProperty) {
          $defineProperty(object, toStringTag, {
            configurable: !nonConfigurable,
            enumerable: false,
            value,
            writable: false
          });
        } else {
          object[toStringTag] = value;
        }
      }
    };
  }
});

// node_modules/form-data/lib/populate.js
var require_populate = __commonJS({
  "node_modules/form-data/lib/populate.js"(exports2, module2) {
    module2.exports = function(dst, src) {
      Object.keys(src).forEach(function(prop) {
        dst[prop] = dst[prop] || src[prop];
      });
      return dst;
    };
  }
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/safe-buffer/index.js"(exports2, module2) {
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports2);
      exports2.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer2.prototype);
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/form-data/lib/form_data.js
var require_form_data = __commonJS({
  "node_modules/form-data/lib/form_data.js"(exports2, module2) {
    var CombinedStream = require_combined_stream();
    var util = require("util");
    var path = require("path");
    var http = require("http");
    var https = require("https");
    var parseUrl = require("url").parse;
    var fs = require("fs");
    var mime = require_mime_types();
    var asynckit = require_asynckit();
    var setToStringTag = require_es_set_tostringtag();
    var populate = require_populate();
    var Buffer2 = require_safe_buffer().Buffer;
    module2.exports = FormData;
    util.inherits(FormData, CombinedStream);
    function FormData(options) {
      if (!(this instanceof FormData)) {
        return new FormData();
      }
      this._overheadLength = 0;
      this._valueLength = 0;
      this._valuesToMeasure = [];
      CombinedStream.call(this);
      options = options || {};
      for (var option in options) {
        this[option] = options[option];
      }
    }
    FormData.LINE_BREAK = "\r\n";
    FormData.DEFAULT_CONTENT_TYPE = "application/octet-stream";
    FormData.prototype.append = function(field, value, options) {
      options = options || {};
      if (typeof options == "string") {
        options = { filename: options };
      }
      var append = CombinedStream.prototype.append.bind(this);
      if (typeof value == "number") {
        value = "" + value;
      }
      if (Array.isArray(value)) {
        this._error(new Error("Arrays are not supported."));
        return;
      }
      var header = this._multiPartHeader(field, value, options);
      var footer = this._multiPartFooter();
      append(header);
      append(value);
      append(footer);
      this._trackLength(header, value, options);
    };
    FormData.prototype._trackLength = function(header, value, options) {
      var valueLength = 0;
      if (options.knownLength != null) {
        valueLength += +options.knownLength;
      } else if (Buffer2.isBuffer(value)) {
        valueLength = value.length;
      } else if (typeof value === "string") {
        valueLength = Buffer2.byteLength(value);
      }
      this._valueLength += valueLength;
      this._overheadLength += Buffer2.byteLength(header) + FormData.LINE_BREAK.length;
      if (!value || !value.path && !(value.readable && Object.prototype.hasOwnProperty.call(value, "httpVersion"))) {
        return;
      }
      if (!options.knownLength) {
        this._valuesToMeasure.push(value);
      }
    };
    FormData.prototype._lengthRetriever = function(value, callback) {
      if (Object.prototype.hasOwnProperty.call(value, "fd")) {
        if (value.end != void 0 && value.end != Infinity && value.start != void 0) {
          callback(null, value.end + 1 - (value.start ? value.start : 0));
        } else {
          fs.stat(value.path, function(err, stat) {
            var fileSize;
            if (err) {
              callback(err);
              return;
            }
            fileSize = stat.size - (value.start ? value.start : 0);
            callback(null, fileSize);
          });
        }
      } else if (Object.prototype.hasOwnProperty.call(value, "httpVersion")) {
        callback(null, +value.headers["content-length"]);
      } else if (Object.prototype.hasOwnProperty.call(value, "httpModule")) {
        value.on("response", function(response) {
          value.pause();
          callback(null, +response.headers["content-length"]);
        });
        value.resume();
      } else {
        callback("Unknown stream");
      }
    };
    FormData.prototype._multiPartHeader = function(field, value, options) {
      if (typeof options.header == "string") {
        return options.header;
      }
      var contentDisposition = this._getContentDisposition(value, options);
      var contentType = this._getContentType(value, options);
      var contents = "";
      var headers = {
        // add custom disposition as third element or keep it two elements if not
        "Content-Disposition": ["form-data", 'name="' + field + '"'].concat(contentDisposition || []),
        // if no content type. allow it to be empty array
        "Content-Type": [].concat(contentType || [])
      };
      if (typeof options.header == "object") {
        populate(headers, options.header);
      }
      var header;
      for (var prop in headers) {
        if (Object.prototype.hasOwnProperty.call(headers, prop)) {
          header = headers[prop];
          if (header == null) {
            continue;
          }
          if (!Array.isArray(header)) {
            header = [header];
          }
          if (header.length) {
            contents += prop + ": " + header.join("; ") + FormData.LINE_BREAK;
          }
        }
      }
      return "--" + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
    };
    FormData.prototype._getContentDisposition = function(value, options) {
      var filename, contentDisposition;
      if (typeof options.filepath === "string") {
        filename = path.normalize(options.filepath).replace(/\\/g, "/");
      } else if (options.filename || value.name || value.path) {
        filename = path.basename(options.filename || value.name || value.path);
      } else if (value.readable && Object.prototype.hasOwnProperty.call(value, "httpVersion")) {
        filename = path.basename(value.client._httpMessage.path || "");
      }
      if (filename) {
        contentDisposition = 'filename="' + filename + '"';
      }
      return contentDisposition;
    };
    FormData.prototype._getContentType = function(value, options) {
      var contentType = options.contentType;
      if (!contentType && value.name) {
        contentType = mime.lookup(value.name);
      }
      if (!contentType && value.path) {
        contentType = mime.lookup(value.path);
      }
      if (!contentType && value.readable && Object.prototype.hasOwnProperty.call(value, "httpVersion")) {
        contentType = value.headers["content-type"];
      }
      if (!contentType && (options.filepath || options.filename)) {
        contentType = mime.lookup(options.filepath || options.filename);
      }
      if (!contentType && typeof value == "object") {
        contentType = FormData.DEFAULT_CONTENT_TYPE;
      }
      return contentType;
    };
    FormData.prototype._multiPartFooter = function() {
      return function(next) {
        var footer = FormData.LINE_BREAK;
        var lastPart = this._streams.length === 0;
        if (lastPart) {
          footer += this._lastBoundary();
        }
        next(footer);
      }.bind(this);
    };
    FormData.prototype._lastBoundary = function() {
      return "--" + this.getBoundary() + "--" + FormData.LINE_BREAK;
    };
    FormData.prototype.getHeaders = function(userHeaders) {
      var header;
      var formHeaders = {
        "content-type": "multipart/form-data; boundary=" + this.getBoundary()
      };
      for (header in userHeaders) {
        if (Object.prototype.hasOwnProperty.call(userHeaders, header)) {
          formHeaders[header.toLowerCase()] = userHeaders[header];
        }
      }
      return formHeaders;
    };
    FormData.prototype.getBoundary = function() {
      if (!this._boundary) {
        this._generateBoundary();
      }
      return this._boundary;
    };
    FormData.prototype.getBuffer = function() {
      var dataBuffer = new Buffer2.alloc(0);
      var boundary = this.getBoundary();
      for (var i = 0, len = this._streams.length; i < len; i++) {
        if (typeof this._streams[i] !== "function") {
          if (Buffer2.isBuffer(this._streams[i])) {
            dataBuffer = Buffer2.concat([dataBuffer, this._streams[i]]);
          } else {
            dataBuffer = Buffer2.concat([dataBuffer, Buffer2.from(this._streams[i])]);
          }
          if (typeof this._streams[i] !== "string" || this._streams[i].substring(2, boundary.length + 2) !== boundary) {
            dataBuffer = Buffer2.concat([dataBuffer, Buffer2.from(FormData.LINE_BREAK)]);
          }
        }
      }
      return Buffer2.concat([dataBuffer, Buffer2.from(this._lastBoundary())]);
    };
    FormData.prototype._generateBoundary = function() {
      var boundary = "--------------------------";
      for (var i = 0; i < 24; i++) {
        boundary += Math.floor(Math.random() * 10).toString(16);
      }
      this._boundary = boundary;
    };
    FormData.prototype.getLengthSync = function() {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this.hasKnownLength()) {
        this._error(new Error("Cannot calculate proper length in synchronous way."));
      }
      return knownLength;
    };
    FormData.prototype.hasKnownLength = function() {
      var hasKnownLength = true;
      if (this._valuesToMeasure.length) {
        hasKnownLength = false;
      }
      return hasKnownLength;
    };
    FormData.prototype.getLength = function(cb) {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this._valuesToMeasure.length) {
        process.nextTick(cb.bind(this, null, knownLength));
        return;
      }
      asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
        if (err) {
          cb(err);
          return;
        }
        values.forEach(function(length) {
          knownLength += length;
        });
        cb(null, knownLength);
      });
    };
    FormData.prototype.submit = function(params, cb) {
      var request, options, defaults = { method: "post" };
      if (typeof params == "string") {
        params = parseUrl(params);
        options = populate({
          port: params.port,
          path: params.pathname,
          host: params.hostname,
          protocol: params.protocol
        }, defaults);
      } else {
        options = populate(params, defaults);
        if (!options.port) {
          options.port = options.protocol == "https:" ? 443 : 80;
        }
      }
      options.headers = this.getHeaders(params.headers);
      if (options.protocol == "https:") {
        request = https.request(options);
      } else {
        request = http.request(options);
      }
      this.getLength(function(err, length) {
        if (err) {
          this._error(err);
          return;
        }
        request.setHeader("Content-Length", length);
        this.pipe(request);
        if (cb) {
          request.on("error", cb);
          request.on("response", cb.bind(this, null));
        }
      }.bind(this));
      return request;
    };
    FormData.prototype._error = function(err) {
      if (!this.error) {
        this.error = err;
        this.pause();
        this.emit("error", err);
      }
    };
    FormData.prototype.toString = function() {
      return "[object FormData]";
    };
    setToStringTag(FormData, "FormData");
  }
});

// node_modules/superagent/lib/utils.js
var require_utils = __commonJS({
  "node_modules/superagent/lib/utils.js"(exports2) {
    "use strict";
    exports2.type = function(str) {
      return str.split(/ *; */).shift();
    };
    exports2.params = function(str) {
      return str.split(/ *; */).reduce(function(obj, str2) {
        var parts = str2.split(/ *= */);
        var key = parts.shift();
        var val = parts.shift();
        if (key && val) obj[key] = val;
        return obj;
      }, {});
    };
    exports2.parseLinks = function(str) {
      return str.split(/ *, */).reduce(function(obj, str2) {
        var parts = str2.split(/ *; */);
        var url = parts[0].slice(1, -1);
        var rel = parts[1].split(/ *= */)[1].slice(1, -1);
        obj[rel] = url;
        return obj;
      }, {});
    };
    exports2.cleanHeader = function(header, changesOrigin) {
      delete header["content-type"];
      delete header["content-length"];
      delete header["transfer-encoding"];
      delete header["host"];
      if (changesOrigin) {
        delete header["authorization"];
        delete header["cookie"];
      }
      return header;
    };
  }
});

// node_modules/superagent/lib/response-base.js
var require_response_base = __commonJS({
  "node_modules/superagent/lib/response-base.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = ResponseBase;
    function ResponseBase(obj) {
      if (obj) return mixin(obj);
    }
    function mixin(obj) {
      for (var key in ResponseBase.prototype) {
        obj[key] = ResponseBase.prototype[key];
      }
      return obj;
    }
    ResponseBase.prototype.get = function(field) {
      return this.header[field.toLowerCase()];
    };
    ResponseBase.prototype._setHeaderProperties = function(header) {
      var ct = header["content-type"] || "";
      this.type = utils.type(ct);
      var params = utils.params(ct);
      for (var key in params) this[key] = params[key];
      this.links = {};
      try {
        if (header.link) {
          this.links = utils.parseLinks(header.link);
        }
      } catch (err) {
      }
    };
    ResponseBase.prototype._setStatusProperties = function(status) {
      var type = status / 100 | 0;
      this.status = this.statusCode = status;
      this.statusType = type;
      this.info = 1 == type;
      this.ok = 2 == type;
      this.redirect = 3 == type;
      this.clientError = 4 == type;
      this.serverError = 5 == type;
      this.error = 4 == type || 5 == type ? this.toError() : false;
      this.accepted = 202 == status;
      this.noContent = 204 == status;
      this.badRequest = 400 == status;
      this.unauthorized = 401 == status;
      this.notAcceptable = 406 == status;
      this.forbidden = 403 == status;
      this.notFound = 404 == status;
    };
  }
});

// node_modules/superagent/lib/node/response.js
var require_response = __commonJS({
  "node_modules/superagent/lib/node/response.js"(exports2, module2) {
    "use strict";
    var util = require("util");
    var Stream = require("stream");
    var ResponseBase = require_response_base();
    module2.exports = Response;
    function Response(req) {
      Stream.call(this);
      const res = this.res = req.res;
      this.request = req;
      this.req = req.req;
      this.text = res.text;
      this.body = res.body !== void 0 ? res.body : {};
      this.files = res.files || {};
      this.buffered = "string" == typeof this.text;
      this.header = this.headers = res.headers;
      this._setStatusProperties(res.statusCode);
      this._setHeaderProperties(this.header);
      this.setEncoding = res.setEncoding.bind(res);
      res.on("data", this.emit.bind(this, "data"));
      res.on("end", this.emit.bind(this, "end"));
      res.on("close", this.emit.bind(this, "close"));
      res.on("error", this.emit.bind(this, "error"));
    }
    util.inherits(Response, Stream);
    ResponseBase(Response.prototype);
    Response.prototype.destroy = function(err) {
      this.res.destroy(err);
    };
    Response.prototype.pause = function() {
      this.res.pause();
    };
    Response.prototype.resume = function() {
      this.res.resume();
    };
    Response.prototype.toError = function() {
      const req = this.req;
      const method = req.method;
      const path = req.path;
      const msg = `cannot ${method} ${path} (${this.status})`;
      const err = new Error(msg);
      err.status = this.status;
      err.text = this.text;
      err.method = method;
      err.path = path;
      return err;
    };
    Response.prototype.setStatusProperties = function(status) {
      console.warn("In superagent 2.x setStatusProperties is a private method");
      return this._setStatusProperties(status);
    };
    Response.prototype.toJSON = function() {
      return {
        req: this.request.toJSON(),
        header: this.header,
        status: this.status,
        text: this.text
      };
    };
  }
});

// node_modules/methods/index.js
var require_methods = __commonJS({
  "node_modules/methods/index.js"(exports2, module2) {
    "use strict";
    var http = require("http");
    module2.exports = getCurrentNodeMethods() || getBasicNodeMethods();
    function getCurrentNodeMethods() {
      return http.METHODS && http.METHODS.map(function lowerCaseMethod(method) {
        return method.toLowerCase();
      });
    }
    function getBasicNodeMethods() {
      return [
        "get",
        "post",
        "put",
        "head",
        "delete",
        "options",
        "trace",
        "copy",
        "lock",
        "mkcol",
        "move",
        "purge",
        "propfind",
        "proppatch",
        "unlock",
        "report",
        "mkactivity",
        "checkout",
        "merge",
        "m-search",
        "notify",
        "subscribe",
        "unsubscribe",
        "patch",
        "search",
        "connect"
      ];
    }
  }
});

// node_modules/superagent/lib/node/unzip.js
var require_unzip = __commonJS({
  "node_modules/superagent/lib/node/unzip.js"(exports2) {
    "use strict";
    var StringDecoder = require("string_decoder").StringDecoder;
    var Stream = require("stream");
    var zlib = require("zlib");
    exports2.unzip = (req, res) => {
      const unzip = zlib.createUnzip();
      const stream = new Stream();
      let decoder;
      stream.req = req;
      unzip.on("error", (err) => {
        if (err && err.code === "Z_BUF_ERROR") {
          stream.emit("end");
          return;
        }
        stream.emit("error", err);
      });
      res.pipe(unzip);
      res.setEncoding = (type) => {
        decoder = new StringDecoder(type);
      };
      unzip.on("data", (buf) => {
        if (decoder) {
          const str = decoder.write(buf);
          if (str.length) stream.emit("data", str);
        } else {
          stream.emit("data", buf);
        }
      });
      unzip.on("end", () => {
        stream.emit("end");
      });
      const _on = res.on;
      res.on = function(type, fn) {
        if ("data" == type || "end" == type) {
          stream.on(type, fn);
        } else if ("error" == type) {
          stream.on(type, fn);
          _on.call(res, type, fn);
        } else {
          _on.call(res, type, fn);
        }
        return this;
      };
    };
  }
});

// node_modules/extend/index.js
var require_extend = __commonJS({
  "node_modules/extend/index.js"(exports2, module2) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    var toStr = Object.prototype.toString;
    var defineProperty = Object.defineProperty;
    var gOPD = Object.getOwnPropertyDescriptor;
    var isArray = function isArray2(arr) {
      if (typeof Array.isArray === "function") {
        return Array.isArray(arr);
      }
      return toStr.call(arr) === "[object Array]";
    };
    var isPlainObject = function isPlainObject2(obj) {
      if (!obj || toStr.call(obj) !== "[object Object]") {
        return false;
      }
      var hasOwnConstructor = hasOwn.call(obj, "constructor");
      var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
      if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
        return false;
      }
      var key;
      for (key in obj) {
      }
      return typeof key === "undefined" || hasOwn.call(obj, key);
    };
    var setProperty = function setProperty2(target, options) {
      if (defineProperty && options.name === "__proto__") {
        defineProperty(target, options.name, {
          enumerable: true,
          configurable: true,
          value: options.newValue,
          writable: true
        });
      } else {
        target[options.name] = options.newValue;
      }
    };
    var getProperty = function getProperty2(obj, name) {
      if (name === "__proto__") {
        if (!hasOwn.call(obj, name)) {
          return void 0;
        } else if (gOPD) {
          return gOPD(obj, name).value;
        }
      }
      return obj[name];
    };
    module2.exports = function extend() {
      var options, name, src, copy, copyIsArray, clone;
      var target = arguments[0];
      var i = 1;
      var length = arguments.length;
      var deep = false;
      if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
      }
      if (target == null || typeof target !== "object" && typeof target !== "function") {
        target = {};
      }
      for (; i < length; ++i) {
        options = arguments[i];
        if (options != null) {
          for (name in options) {
            src = getProperty(target, name);
            copy = getProperty(options, name);
            if (target !== copy) {
              if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                if (copyIsArray) {
                  copyIsArray = false;
                  clone = src && isArray(src) ? src : [];
                } else {
                  clone = src && isPlainObject(src) ? src : {};
                }
                setProperty(target, { name, newValue: extend(deep, clone, copy) });
              } else if (typeof copy !== "undefined") {
                setProperty(target, { name, newValue: copy });
              }
            }
          }
        }
      }
      return target;
    };
  }
});

// node_modules/mime/types.json
var require_types = __commonJS({
  "node_modules/mime/types.json"(exports2, module2) {
    module2.exports = { "application/andrew-inset": ["ez"], "application/applixware": ["aw"], "application/atom+xml": ["atom"], "application/atomcat+xml": ["atomcat"], "application/atomsvc+xml": ["atomsvc"], "application/bdoc": ["bdoc"], "application/ccxml+xml": ["ccxml"], "application/cdmi-capability": ["cdmia"], "application/cdmi-container": ["cdmic"], "application/cdmi-domain": ["cdmid"], "application/cdmi-object": ["cdmio"], "application/cdmi-queue": ["cdmiq"], "application/cu-seeme": ["cu"], "application/dash+xml": ["mpd"], "application/davmount+xml": ["davmount"], "application/docbook+xml": ["dbk"], "application/dssc+der": ["dssc"], "application/dssc+xml": ["xdssc"], "application/ecmascript": ["ecma"], "application/emma+xml": ["emma"], "application/epub+zip": ["epub"], "application/exi": ["exi"], "application/font-tdpfr": ["pfr"], "application/font-woff": [], "application/font-woff2": [], "application/geo+json": ["geojson"], "application/gml+xml": ["gml"], "application/gpx+xml": ["gpx"], "application/gxf": ["gxf"], "application/gzip": ["gz"], "application/hyperstudio": ["stk"], "application/inkml+xml": ["ink", "inkml"], "application/ipfix": ["ipfix"], "application/java-archive": ["jar", "war", "ear"], "application/java-serialized-object": ["ser"], "application/java-vm": ["class"], "application/javascript": ["js", "mjs"], "application/json": ["json", "map"], "application/json5": ["json5"], "application/jsonml+json": ["jsonml"], "application/ld+json": ["jsonld"], "application/lost+xml": ["lostxml"], "application/mac-binhex40": ["hqx"], "application/mac-compactpro": ["cpt"], "application/mads+xml": ["mads"], "application/manifest+json": ["webmanifest"], "application/marc": ["mrc"], "application/marcxml+xml": ["mrcx"], "application/mathematica": ["ma", "nb", "mb"], "application/mathml+xml": ["mathml"], "application/mbox": ["mbox"], "application/mediaservercontrol+xml": ["mscml"], "application/metalink+xml": ["metalink"], "application/metalink4+xml": ["meta4"], "application/mets+xml": ["mets"], "application/mods+xml": ["mods"], "application/mp21": ["m21", "mp21"], "application/mp4": ["mp4s", "m4p"], "application/msword": ["doc", "dot"], "application/mxf": ["mxf"], "application/octet-stream": ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"], "application/oda": ["oda"], "application/oebps-package+xml": ["opf"], "application/ogg": ["ogx"], "application/omdoc+xml": ["omdoc"], "application/onenote": ["onetoc", "onetoc2", "onetmp", "onepkg"], "application/oxps": ["oxps"], "application/patch-ops-error+xml": ["xer"], "application/pdf": ["pdf"], "application/pgp-encrypted": ["pgp"], "application/pgp-signature": ["asc", "sig"], "application/pics-rules": ["prf"], "application/pkcs10": ["p10"], "application/pkcs7-mime": ["p7m", "p7c"], "application/pkcs7-signature": ["p7s"], "application/pkcs8": ["p8"], "application/pkix-attr-cert": ["ac"], "application/pkix-cert": ["cer"], "application/pkix-crl": ["crl"], "application/pkix-pkipath": ["pkipath"], "application/pkixcmp": ["pki"], "application/pls+xml": ["pls"], "application/postscript": ["ai", "eps", "ps"], "application/prs.cww": ["cww"], "application/pskc+xml": ["pskcxml"], "application/raml+yaml": ["raml"], "application/rdf+xml": ["rdf"], "application/reginfo+xml": ["rif"], "application/relax-ng-compact-syntax": ["rnc"], "application/resource-lists+xml": ["rl"], "application/resource-lists-diff+xml": ["rld"], "application/rls-services+xml": ["rs"], "application/rpki-ghostbusters": ["gbr"], "application/rpki-manifest": ["mft"], "application/rpki-roa": ["roa"], "application/rsd+xml": ["rsd"], "application/rss+xml": ["rss"], "application/rtf": ["rtf"], "application/sbml+xml": ["sbml"], "application/scvp-cv-request": ["scq"], "application/scvp-cv-response": ["scs"], "application/scvp-vp-request": ["spq"], "application/scvp-vp-response": ["spp"], "application/sdp": ["sdp"], "application/set-payment-initiation": ["setpay"], "application/set-registration-initiation": ["setreg"], "application/shf+xml": ["shf"], "application/smil+xml": ["smi", "smil"], "application/sparql-query": ["rq"], "application/sparql-results+xml": ["srx"], "application/srgs": ["gram"], "application/srgs+xml": ["grxml"], "application/sru+xml": ["sru"], "application/ssdl+xml": ["ssdl"], "application/ssml+xml": ["ssml"], "application/tei+xml": ["tei", "teicorpus"], "application/thraud+xml": ["tfi"], "application/timestamped-data": ["tsd"], "application/vnd.3gpp.pic-bw-large": ["plb"], "application/vnd.3gpp.pic-bw-small": ["psb"], "application/vnd.3gpp.pic-bw-var": ["pvb"], "application/vnd.3gpp2.tcap": ["tcap"], "application/vnd.3m.post-it-notes": ["pwn"], "application/vnd.accpac.simply.aso": ["aso"], "application/vnd.accpac.simply.imp": ["imp"], "application/vnd.acucobol": ["acu"], "application/vnd.acucorp": ["atc", "acutc"], "application/vnd.adobe.air-application-installer-package+zip": ["air"], "application/vnd.adobe.formscentral.fcdt": ["fcdt"], "application/vnd.adobe.fxp": ["fxp", "fxpl"], "application/vnd.adobe.xdp+xml": ["xdp"], "application/vnd.adobe.xfdf": ["xfdf"], "application/vnd.ahead.space": ["ahead"], "application/vnd.airzip.filesecure.azf": ["azf"], "application/vnd.airzip.filesecure.azs": ["azs"], "application/vnd.amazon.ebook": ["azw"], "application/vnd.americandynamics.acc": ["acc"], "application/vnd.amiga.ami": ["ami"], "application/vnd.android.package-archive": ["apk"], "application/vnd.anser-web-certificate-issue-initiation": ["cii"], "application/vnd.anser-web-funds-transfer-initiation": ["fti"], "application/vnd.antix.game-component": ["atx"], "application/vnd.apple.installer+xml": ["mpkg"], "application/vnd.apple.mpegurl": ["m3u8"], "application/vnd.apple.pkpass": ["pkpass"], "application/vnd.aristanetworks.swi": ["swi"], "application/vnd.astraea-software.iota": ["iota"], "application/vnd.audiograph": ["aep"], "application/vnd.blueice.multipass": ["mpm"], "application/vnd.bmi": ["bmi"], "application/vnd.businessobjects": ["rep"], "application/vnd.chemdraw+xml": ["cdxml"], "application/vnd.chipnuts.karaoke-mmd": ["mmd"], "application/vnd.cinderella": ["cdy"], "application/vnd.claymore": ["cla"], "application/vnd.cloanto.rp9": ["rp9"], "application/vnd.clonk.c4group": ["c4g", "c4d", "c4f", "c4p", "c4u"], "application/vnd.cluetrust.cartomobile-config": ["c11amc"], "application/vnd.cluetrust.cartomobile-config-pkg": ["c11amz"], "application/vnd.commonspace": ["csp"], "application/vnd.contact.cmsg": ["cdbcmsg"], "application/vnd.cosmocaller": ["cmc"], "application/vnd.crick.clicker": ["clkx"], "application/vnd.crick.clicker.keyboard": ["clkk"], "application/vnd.crick.clicker.palette": ["clkp"], "application/vnd.crick.clicker.template": ["clkt"], "application/vnd.crick.clicker.wordbank": ["clkw"], "application/vnd.criticaltools.wbs+xml": ["wbs"], "application/vnd.ctc-posml": ["pml"], "application/vnd.cups-ppd": ["ppd"], "application/vnd.curl.car": ["car"], "application/vnd.curl.pcurl": ["pcurl"], "application/vnd.dart": ["dart"], "application/vnd.data-vision.rdz": ["rdz"], "application/vnd.dece.data": ["uvf", "uvvf", "uvd", "uvvd"], "application/vnd.dece.ttml+xml": ["uvt", "uvvt"], "application/vnd.dece.unspecified": ["uvx", "uvvx"], "application/vnd.dece.zip": ["uvz", "uvvz"], "application/vnd.denovo.fcselayout-link": ["fe_launch"], "application/vnd.dna": ["dna"], "application/vnd.dolby.mlp": ["mlp"], "application/vnd.dpgraph": ["dpg"], "application/vnd.dreamfactory": ["dfac"], "application/vnd.ds-keypoint": ["kpxx"], "application/vnd.dvb.ait": ["ait"], "application/vnd.dvb.service": ["svc"], "application/vnd.dynageo": ["geo"], "application/vnd.ecowin.chart": ["mag"], "application/vnd.enliven": ["nml"], "application/vnd.epson.esf": ["esf"], "application/vnd.epson.msf": ["msf"], "application/vnd.epson.quickanime": ["qam"], "application/vnd.epson.salt": ["slt"], "application/vnd.epson.ssf": ["ssf"], "application/vnd.eszigno3+xml": ["es3", "et3"], "application/vnd.ezpix-album": ["ez2"], "application/vnd.ezpix-package": ["ez3"], "application/vnd.fdf": ["fdf"], "application/vnd.fdsn.mseed": ["mseed"], "application/vnd.fdsn.seed": ["seed", "dataless"], "application/vnd.flographit": ["gph"], "application/vnd.fluxtime.clip": ["ftc"], "application/vnd.framemaker": ["fm", "frame", "maker", "book"], "application/vnd.frogans.fnc": ["fnc"], "application/vnd.frogans.ltf": ["ltf"], "application/vnd.fsc.weblaunch": ["fsc"], "application/vnd.fujitsu.oasys": ["oas"], "application/vnd.fujitsu.oasys2": ["oa2"], "application/vnd.fujitsu.oasys3": ["oa3"], "application/vnd.fujitsu.oasysgp": ["fg5"], "application/vnd.fujitsu.oasysprs": ["bh2"], "application/vnd.fujixerox.ddd": ["ddd"], "application/vnd.fujixerox.docuworks": ["xdw"], "application/vnd.fujixerox.docuworks.binder": ["xbd"], "application/vnd.fuzzysheet": ["fzs"], "application/vnd.genomatix.tuxedo": ["txd"], "application/vnd.geogebra.file": ["ggb"], "application/vnd.geogebra.tool": ["ggt"], "application/vnd.geometry-explorer": ["gex", "gre"], "application/vnd.geonext": ["gxt"], "application/vnd.geoplan": ["g2w"], "application/vnd.geospace": ["g3w"], "application/vnd.gmx": ["gmx"], "application/vnd.google-apps.document": ["gdoc"], "application/vnd.google-apps.presentation": ["gslides"], "application/vnd.google-apps.spreadsheet": ["gsheet"], "application/vnd.google-earth.kml+xml": ["kml"], "application/vnd.google-earth.kmz": ["kmz"], "application/vnd.grafeq": ["gqf", "gqs"], "application/vnd.groove-account": ["gac"], "application/vnd.groove-help": ["ghf"], "application/vnd.groove-identity-message": ["gim"], "application/vnd.groove-injector": ["grv"], "application/vnd.groove-tool-message": ["gtm"], "application/vnd.groove-tool-template": ["tpl"], "application/vnd.groove-vcard": ["vcg"], "application/vnd.hal+xml": ["hal"], "application/vnd.handheld-entertainment+xml": ["zmm"], "application/vnd.hbci": ["hbci"], "application/vnd.hhe.lesson-player": ["les"], "application/vnd.hp-hpgl": ["hpgl"], "application/vnd.hp-hpid": ["hpid"], "application/vnd.hp-hps": ["hps"], "application/vnd.hp-jlyt": ["jlt"], "application/vnd.hp-pcl": ["pcl"], "application/vnd.hp-pclxl": ["pclxl"], "application/vnd.hydrostatix.sof-data": ["sfd-hdstx"], "application/vnd.ibm.minipay": ["mpy"], "application/vnd.ibm.modcap": ["afp", "listafp", "list3820"], "application/vnd.ibm.rights-management": ["irm"], "application/vnd.ibm.secure-container": ["sc"], "application/vnd.iccprofile": ["icc", "icm"], "application/vnd.igloader": ["igl"], "application/vnd.immervision-ivp": ["ivp"], "application/vnd.immervision-ivu": ["ivu"], "application/vnd.insors.igm": ["igm"], "application/vnd.intercon.formnet": ["xpw", "xpx"], "application/vnd.intergeo": ["i2g"], "application/vnd.intu.qbo": ["qbo"], "application/vnd.intu.qfx": ["qfx"], "application/vnd.ipunplugged.rcprofile": ["rcprofile"], "application/vnd.irepository.package+xml": ["irp"], "application/vnd.is-xpr": ["xpr"], "application/vnd.isac.fcs": ["fcs"], "application/vnd.jam": ["jam"], "application/vnd.jcp.javame.midlet-rms": ["rms"], "application/vnd.jisp": ["jisp"], "application/vnd.joost.joda-archive": ["joda"], "application/vnd.kahootz": ["ktz", "ktr"], "application/vnd.kde.karbon": ["karbon"], "application/vnd.kde.kchart": ["chrt"], "application/vnd.kde.kformula": ["kfo"], "application/vnd.kde.kivio": ["flw"], "application/vnd.kde.kontour": ["kon"], "application/vnd.kde.kpresenter": ["kpr", "kpt"], "application/vnd.kde.kspread": ["ksp"], "application/vnd.kde.kword": ["kwd", "kwt"], "application/vnd.kenameaapp": ["htke"], "application/vnd.kidspiration": ["kia"], "application/vnd.kinar": ["kne", "knp"], "application/vnd.koan": ["skp", "skd", "skt", "skm"], "application/vnd.kodak-descriptor": ["sse"], "application/vnd.las.las+xml": ["lasxml"], "application/vnd.llamagraphics.life-balance.desktop": ["lbd"], "application/vnd.llamagraphics.life-balance.exchange+xml": ["lbe"], "application/vnd.lotus-1-2-3": ["123"], "application/vnd.lotus-approach": ["apr"], "application/vnd.lotus-freelance": ["pre"], "application/vnd.lotus-notes": ["nsf"], "application/vnd.lotus-organizer": ["org"], "application/vnd.lotus-screencam": ["scm"], "application/vnd.lotus-wordpro": ["lwp"], "application/vnd.macports.portpkg": ["portpkg"], "application/vnd.mcd": ["mcd"], "application/vnd.medcalcdata": ["mc1"], "application/vnd.mediastation.cdkey": ["cdkey"], "application/vnd.mfer": ["mwf"], "application/vnd.mfmp": ["mfm"], "application/vnd.micrografx.flo": ["flo"], "application/vnd.micrografx.igx": ["igx"], "application/vnd.mif": ["mif"], "application/vnd.mobius.daf": ["daf"], "application/vnd.mobius.dis": ["dis"], "application/vnd.mobius.mbk": ["mbk"], "application/vnd.mobius.mqy": ["mqy"], "application/vnd.mobius.msl": ["msl"], "application/vnd.mobius.plc": ["plc"], "application/vnd.mobius.txf": ["txf"], "application/vnd.mophun.application": ["mpn"], "application/vnd.mophun.certificate": ["mpc"], "application/vnd.mozilla.xul+xml": ["xul"], "application/vnd.ms-artgalry": ["cil"], "application/vnd.ms-cab-compressed": ["cab"], "application/vnd.ms-excel": ["xls", "xlm", "xla", "xlc", "xlt", "xlw"], "application/vnd.ms-excel.addin.macroenabled.12": ["xlam"], "application/vnd.ms-excel.sheet.binary.macroenabled.12": ["xlsb"], "application/vnd.ms-excel.sheet.macroenabled.12": ["xlsm"], "application/vnd.ms-excel.template.macroenabled.12": ["xltm"], "application/vnd.ms-fontobject": ["eot"], "application/vnd.ms-htmlhelp": ["chm"], "application/vnd.ms-ims": ["ims"], "application/vnd.ms-lrm": ["lrm"], "application/vnd.ms-officetheme": ["thmx"], "application/vnd.ms-outlook": ["msg"], "application/vnd.ms-pki.seccat": ["cat"], "application/vnd.ms-pki.stl": ["stl"], "application/vnd.ms-powerpoint": ["ppt", "pps", "pot"], "application/vnd.ms-powerpoint.addin.macroenabled.12": ["ppam"], "application/vnd.ms-powerpoint.presentation.macroenabled.12": ["pptm"], "application/vnd.ms-powerpoint.slide.macroenabled.12": ["sldm"], "application/vnd.ms-powerpoint.slideshow.macroenabled.12": ["ppsm"], "application/vnd.ms-powerpoint.template.macroenabled.12": ["potm"], "application/vnd.ms-project": ["mpp", "mpt"], "application/vnd.ms-word.document.macroenabled.12": ["docm"], "application/vnd.ms-word.template.macroenabled.12": ["dotm"], "application/vnd.ms-works": ["wps", "wks", "wcm", "wdb"], "application/vnd.ms-wpl": ["wpl"], "application/vnd.ms-xpsdocument": ["xps"], "application/vnd.mseq": ["mseq"], "application/vnd.musician": ["mus"], "application/vnd.muvee.style": ["msty"], "application/vnd.mynfc": ["taglet"], "application/vnd.neurolanguage.nlu": ["nlu"], "application/vnd.nitf": ["ntf", "nitf"], "application/vnd.noblenet-directory": ["nnd"], "application/vnd.noblenet-sealer": ["nns"], "application/vnd.noblenet-web": ["nnw"], "application/vnd.nokia.n-gage.data": ["ngdat"], "application/vnd.nokia.n-gage.symbian.install": ["n-gage"], "application/vnd.nokia.radio-preset": ["rpst"], "application/vnd.nokia.radio-presets": ["rpss"], "application/vnd.novadigm.edm": ["edm"], "application/vnd.novadigm.edx": ["edx"], "application/vnd.novadigm.ext": ["ext"], "application/vnd.oasis.opendocument.chart": ["odc"], "application/vnd.oasis.opendocument.chart-template": ["otc"], "application/vnd.oasis.opendocument.database": ["odb"], "application/vnd.oasis.opendocument.formula": ["odf"], "application/vnd.oasis.opendocument.formula-template": ["odft"], "application/vnd.oasis.opendocument.graphics": ["odg"], "application/vnd.oasis.opendocument.graphics-template": ["otg"], "application/vnd.oasis.opendocument.image": ["odi"], "application/vnd.oasis.opendocument.image-template": ["oti"], "application/vnd.oasis.opendocument.presentation": ["odp"], "application/vnd.oasis.opendocument.presentation-template": ["otp"], "application/vnd.oasis.opendocument.spreadsheet": ["ods"], "application/vnd.oasis.opendocument.spreadsheet-template": ["ots"], "application/vnd.oasis.opendocument.text": ["odt"], "application/vnd.oasis.opendocument.text-master": ["odm"], "application/vnd.oasis.opendocument.text-template": ["ott"], "application/vnd.oasis.opendocument.text-web": ["oth"], "application/vnd.olpc-sugar": ["xo"], "application/vnd.oma.dd2+xml": ["dd2"], "application/vnd.openofficeorg.extension": ["oxt"], "application/vnd.openxmlformats-officedocument.presentationml.presentation": ["pptx"], "application/vnd.openxmlformats-officedocument.presentationml.slide": ["sldx"], "application/vnd.openxmlformats-officedocument.presentationml.slideshow": ["ppsx"], "application/vnd.openxmlformats-officedocument.presentationml.template": ["potx"], "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"], "application/vnd.openxmlformats-officedocument.spreadsheetml.template": ["xltx"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"], "application/vnd.openxmlformats-officedocument.wordprocessingml.template": ["dotx"], "application/vnd.osgeo.mapguide.package": ["mgp"], "application/vnd.osgi.dp": ["dp"], "application/vnd.osgi.subsystem": ["esa"], "application/vnd.palm": ["pdb", "pqa", "oprc"], "application/vnd.pawaafile": ["paw"], "application/vnd.pg.format": ["str"], "application/vnd.pg.osasli": ["ei6"], "application/vnd.picsel": ["efif"], "application/vnd.pmi.widget": ["wg"], "application/vnd.pocketlearn": ["plf"], "application/vnd.powerbuilder6": ["pbd"], "application/vnd.previewsystems.box": ["box"], "application/vnd.proteus.magazine": ["mgz"], "application/vnd.publishare-delta-tree": ["qps"], "application/vnd.pvi.ptid1": ["ptid"], "application/vnd.quark.quarkxpress": ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"], "application/vnd.realvnc.bed": ["bed"], "application/vnd.recordare.musicxml": ["mxl"], "application/vnd.recordare.musicxml+xml": ["musicxml"], "application/vnd.rig.cryptonote": ["cryptonote"], "application/vnd.rim.cod": ["cod"], "application/vnd.rn-realmedia": ["rm"], "application/vnd.rn-realmedia-vbr": ["rmvb"], "application/vnd.route66.link66+xml": ["link66"], "application/vnd.sailingtracker.track": ["st"], "application/vnd.seemail": ["see"], "application/vnd.sema": ["sema"], "application/vnd.semd": ["semd"], "application/vnd.semf": ["semf"], "application/vnd.shana.informed.formdata": ["ifm"], "application/vnd.shana.informed.formtemplate": ["itp"], "application/vnd.shana.informed.interchange": ["iif"], "application/vnd.shana.informed.package": ["ipk"], "application/vnd.simtech-mindmapper": ["twd", "twds"], "application/vnd.smaf": ["mmf"], "application/vnd.smart.teacher": ["teacher"], "application/vnd.solent.sdkm+xml": ["sdkm", "sdkd"], "application/vnd.spotfire.dxp": ["dxp"], "application/vnd.spotfire.sfs": ["sfs"], "application/vnd.stardivision.calc": ["sdc"], "application/vnd.stardivision.draw": ["sda"], "application/vnd.stardivision.impress": ["sdd"], "application/vnd.stardivision.math": ["smf"], "application/vnd.stardivision.writer": ["sdw", "vor"], "application/vnd.stardivision.writer-global": ["sgl"], "application/vnd.stepmania.package": ["smzip"], "application/vnd.stepmania.stepchart": ["sm"], "application/vnd.sun.wadl+xml": ["wadl"], "application/vnd.sun.xml.calc": ["sxc"], "application/vnd.sun.xml.calc.template": ["stc"], "application/vnd.sun.xml.draw": ["sxd"], "application/vnd.sun.xml.draw.template": ["std"], "application/vnd.sun.xml.impress": ["sxi"], "application/vnd.sun.xml.impress.template": ["sti"], "application/vnd.sun.xml.math": ["sxm"], "application/vnd.sun.xml.writer": ["sxw"], "application/vnd.sun.xml.writer.global": ["sxg"], "application/vnd.sun.xml.writer.template": ["stw"], "application/vnd.sus-calendar": ["sus", "susp"], "application/vnd.svd": ["svd"], "application/vnd.symbian.install": ["sis", "sisx"], "application/vnd.syncml+xml": ["xsm"], "application/vnd.syncml.dm+wbxml": ["bdm"], "application/vnd.syncml.dm+xml": ["xdm"], "application/vnd.tao.intent-module-archive": ["tao"], "application/vnd.tcpdump.pcap": ["pcap", "cap", "dmp"], "application/vnd.tmobile-livetv": ["tmo"], "application/vnd.trid.tpt": ["tpt"], "application/vnd.triscape.mxs": ["mxs"], "application/vnd.trueapp": ["tra"], "application/vnd.ufdl": ["ufd", "ufdl"], "application/vnd.uiq.theme": ["utz"], "application/vnd.umajin": ["umj"], "application/vnd.unity": ["unityweb"], "application/vnd.uoml+xml": ["uoml"], "application/vnd.vcx": ["vcx"], "application/vnd.visio": ["vsd", "vst", "vss", "vsw"], "application/vnd.visionary": ["vis"], "application/vnd.vsf": ["vsf"], "application/vnd.wap.wbxml": ["wbxml"], "application/vnd.wap.wmlc": ["wmlc"], "application/vnd.wap.wmlscriptc": ["wmlsc"], "application/vnd.webturbo": ["wtb"], "application/vnd.wolfram.player": ["nbp"], "application/vnd.wordperfect": ["wpd"], "application/vnd.wqd": ["wqd"], "application/vnd.wt.stf": ["stf"], "application/vnd.xara": ["xar"], "application/vnd.xfdl": ["xfdl"], "application/vnd.yamaha.hv-dic": ["hvd"], "application/vnd.yamaha.hv-script": ["hvs"], "application/vnd.yamaha.hv-voice": ["hvp"], "application/vnd.yamaha.openscoreformat": ["osf"], "application/vnd.yamaha.openscoreformat.osfpvg+xml": ["osfpvg"], "application/vnd.yamaha.smaf-audio": ["saf"], "application/vnd.yamaha.smaf-phrase": ["spf"], "application/vnd.yellowriver-custom-menu": ["cmp"], "application/vnd.zul": ["zir", "zirz"], "application/vnd.zzazz.deck+xml": ["zaz"], "application/voicexml+xml": ["vxml"], "application/wasm": ["wasm"], "application/widget": ["wgt"], "application/winhlp": ["hlp"], "application/wsdl+xml": ["wsdl"], "application/wspolicy+xml": ["wspolicy"], "application/x-7z-compressed": ["7z"], "application/x-abiword": ["abw"], "application/x-ace-compressed": ["ace"], "application/x-apple-diskimage": [], "application/x-arj": ["arj"], "application/x-authorware-bin": ["aab", "x32", "u32", "vox"], "application/x-authorware-map": ["aam"], "application/x-authorware-seg": ["aas"], "application/x-bcpio": ["bcpio"], "application/x-bdoc": [], "application/x-bittorrent": ["torrent"], "application/x-blorb": ["blb", "blorb"], "application/x-bzip": ["bz"], "application/x-bzip2": ["bz2", "boz"], "application/x-cbr": ["cbr", "cba", "cbt", "cbz", "cb7"], "application/x-cdlink": ["vcd"], "application/x-cfs-compressed": ["cfs"], "application/x-chat": ["chat"], "application/x-chess-pgn": ["pgn"], "application/x-chrome-extension": ["crx"], "application/x-cocoa": ["cco"], "application/x-conference": ["nsc"], "application/x-cpio": ["cpio"], "application/x-csh": ["csh"], "application/x-debian-package": ["udeb"], "application/x-dgc-compressed": ["dgc"], "application/x-director": ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"], "application/x-doom": ["wad"], "application/x-dtbncx+xml": ["ncx"], "application/x-dtbook+xml": ["dtb"], "application/x-dtbresource+xml": ["res"], "application/x-dvi": ["dvi"], "application/x-envoy": ["evy"], "application/x-eva": ["eva"], "application/x-font-bdf": ["bdf"], "application/x-font-ghostscript": ["gsf"], "application/x-font-linux-psf": ["psf"], "application/x-font-pcf": ["pcf"], "application/x-font-snf": ["snf"], "application/x-font-type1": ["pfa", "pfb", "pfm", "afm"], "application/x-freearc": ["arc"], "application/x-futuresplash": ["spl"], "application/x-gca-compressed": ["gca"], "application/x-glulx": ["ulx"], "application/x-gnumeric": ["gnumeric"], "application/x-gramps-xml": ["gramps"], "application/x-gtar": ["gtar"], "application/x-hdf": ["hdf"], "application/x-httpd-php": ["php"], "application/x-install-instructions": ["install"], "application/x-iso9660-image": [], "application/x-java-archive-diff": ["jardiff"], "application/x-java-jnlp-file": ["jnlp"], "application/x-latex": ["latex"], "application/x-lua-bytecode": ["luac"], "application/x-lzh-compressed": ["lzh", "lha"], "application/x-makeself": ["run"], "application/x-mie": ["mie"], "application/x-mobipocket-ebook": ["prc", "mobi"], "application/x-ms-application": ["application"], "application/x-ms-shortcut": ["lnk"], "application/x-ms-wmd": ["wmd"], "application/x-ms-wmz": ["wmz"], "application/x-ms-xbap": ["xbap"], "application/x-msaccess": ["mdb"], "application/x-msbinder": ["obd"], "application/x-mscardfile": ["crd"], "application/x-msclip": ["clp"], "application/x-msdos-program": [], "application/x-msdownload": ["com", "bat"], "application/x-msmediaview": ["mvb", "m13", "m14"], "application/x-msmetafile": ["wmf", "emf", "emz"], "application/x-msmoney": ["mny"], "application/x-mspublisher": ["pub"], "application/x-msschedule": ["scd"], "application/x-msterminal": ["trm"], "application/x-mswrite": ["wri"], "application/x-netcdf": ["nc", "cdf"], "application/x-ns-proxy-autoconfig": ["pac"], "application/x-nzb": ["nzb"], "application/x-perl": ["pl", "pm"], "application/x-pilot": [], "application/x-pkcs12": ["p12", "pfx"], "application/x-pkcs7-certificates": ["p7b", "spc"], "application/x-pkcs7-certreqresp": ["p7r"], "application/x-rar-compressed": ["rar"], "application/x-redhat-package-manager": ["rpm"], "application/x-research-info-systems": ["ris"], "application/x-sea": ["sea"], "application/x-sh": ["sh"], "application/x-shar": ["shar"], "application/x-shockwave-flash": ["swf"], "application/x-silverlight-app": ["xap"], "application/x-sql": ["sql"], "application/x-stuffit": ["sit"], "application/x-stuffitx": ["sitx"], "application/x-subrip": ["srt"], "application/x-sv4cpio": ["sv4cpio"], "application/x-sv4crc": ["sv4crc"], "application/x-t3vm-image": ["t3"], "application/x-tads": ["gam"], "application/x-tar": ["tar"], "application/x-tcl": ["tcl", "tk"], "application/x-tex": ["tex"], "application/x-tex-tfm": ["tfm"], "application/x-texinfo": ["texinfo", "texi"], "application/x-tgif": ["obj"], "application/x-ustar": ["ustar"], "application/x-virtualbox-hdd": ["hdd"], "application/x-virtualbox-ova": ["ova"], "application/x-virtualbox-ovf": ["ovf"], "application/x-virtualbox-vbox": ["vbox"], "application/x-virtualbox-vbox-extpack": ["vbox-extpack"], "application/x-virtualbox-vdi": ["vdi"], "application/x-virtualbox-vhd": ["vhd"], "application/x-virtualbox-vmdk": ["vmdk"], "application/x-wais-source": ["src"], "application/x-web-app-manifest+json": ["webapp"], "application/x-x509-ca-cert": ["der", "crt", "pem"], "application/x-xfig": ["fig"], "application/x-xliff+xml": ["xlf"], "application/x-xpinstall": ["xpi"], "application/x-xz": ["xz"], "application/x-zmachine": ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"], "application/xaml+xml": ["xaml"], "application/xcap-diff+xml": ["xdf"], "application/xenc+xml": ["xenc"], "application/xhtml+xml": ["xhtml", "xht"], "application/xml": ["xml", "xsl", "xsd", "rng"], "application/xml-dtd": ["dtd"], "application/xop+xml": ["xop"], "application/xproc+xml": ["xpl"], "application/xslt+xml": ["xslt"], "application/xspf+xml": ["xspf"], "application/xv+xml": ["mxml", "xhvml", "xvml", "xvm"], "application/yang": ["yang"], "application/yin+xml": ["yin"], "application/zip": ["zip"], "audio/3gpp": [], "audio/adpcm": ["adp"], "audio/basic": ["au", "snd"], "audio/midi": ["mid", "midi", "kar", "rmi"], "audio/mp3": [], "audio/mp4": ["m4a", "mp4a"], "audio/mpeg": ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"], "audio/ogg": ["oga", "ogg", "spx"], "audio/s3m": ["s3m"], "audio/silk": ["sil"], "audio/vnd.dece.audio": ["uva", "uvva"], "audio/vnd.digital-winds": ["eol"], "audio/vnd.dra": ["dra"], "audio/vnd.dts": ["dts"], "audio/vnd.dts.hd": ["dtshd"], "audio/vnd.lucent.voice": ["lvp"], "audio/vnd.ms-playready.media.pya": ["pya"], "audio/vnd.nuera.ecelp4800": ["ecelp4800"], "audio/vnd.nuera.ecelp7470": ["ecelp7470"], "audio/vnd.nuera.ecelp9600": ["ecelp9600"], "audio/vnd.rip": ["rip"], "audio/wav": ["wav"], "audio/wave": [], "audio/webm": ["weba"], "audio/x-aac": ["aac"], "audio/x-aiff": ["aif", "aiff", "aifc"], "audio/x-caf": ["caf"], "audio/x-flac": ["flac"], "audio/x-m4a": [], "audio/x-matroska": ["mka"], "audio/x-mpegurl": ["m3u"], "audio/x-ms-wax": ["wax"], "audio/x-ms-wma": ["wma"], "audio/x-pn-realaudio": ["ram", "ra"], "audio/x-pn-realaudio-plugin": ["rmp"], "audio/x-realaudio": [], "audio/x-wav": [], "audio/xm": ["xm"], "chemical/x-cdx": ["cdx"], "chemical/x-cif": ["cif"], "chemical/x-cmdf": ["cmdf"], "chemical/x-cml": ["cml"], "chemical/x-csml": ["csml"], "chemical/x-xyz": ["xyz"], "font/collection": ["ttc"], "font/otf": ["otf"], "font/ttf": ["ttf"], "font/woff": ["woff"], "font/woff2": ["woff2"], "image/apng": ["apng"], "image/bmp": ["bmp"], "image/cgm": ["cgm"], "image/g3fax": ["g3"], "image/gif": ["gif"], "image/ief": ["ief"], "image/jp2": ["jp2", "jpg2"], "image/jpeg": ["jpeg", "jpg", "jpe"], "image/jpm": ["jpm"], "image/jpx": ["jpx", "jpf"], "image/ktx": ["ktx"], "image/png": ["png"], "image/prs.btif": ["btif"], "image/sgi": ["sgi"], "image/svg+xml": ["svg", "svgz"], "image/tiff": ["tiff", "tif"], "image/vnd.adobe.photoshop": ["psd"], "image/vnd.dece.graphic": ["uvi", "uvvi", "uvg", "uvvg"], "image/vnd.djvu": ["djvu", "djv"], "image/vnd.dvb.subtitle": [], "image/vnd.dwg": ["dwg"], "image/vnd.dxf": ["dxf"], "image/vnd.fastbidsheet": ["fbs"], "image/vnd.fpx": ["fpx"], "image/vnd.fst": ["fst"], "image/vnd.fujixerox.edmics-mmr": ["mmr"], "image/vnd.fujixerox.edmics-rlc": ["rlc"], "image/vnd.ms-modi": ["mdi"], "image/vnd.ms-photo": ["wdp"], "image/vnd.net-fpx": ["npx"], "image/vnd.wap.wbmp": ["wbmp"], "image/vnd.xiff": ["xif"], "image/webp": ["webp"], "image/x-3ds": ["3ds"], "image/x-cmu-raster": ["ras"], "image/x-cmx": ["cmx"], "image/x-freehand": ["fh", "fhc", "fh4", "fh5", "fh7"], "image/x-icon": ["ico"], "image/x-jng": ["jng"], "image/x-mrsid-image": ["sid"], "image/x-ms-bmp": [], "image/x-pcx": ["pcx"], "image/x-pict": ["pic", "pct"], "image/x-portable-anymap": ["pnm"], "image/x-portable-bitmap": ["pbm"], "image/x-portable-graymap": ["pgm"], "image/x-portable-pixmap": ["ppm"], "image/x-rgb": ["rgb"], "image/x-tga": ["tga"], "image/x-xbitmap": ["xbm"], "image/x-xpixmap": ["xpm"], "image/x-xwindowdump": ["xwd"], "message/rfc822": ["eml", "mime"], "model/gltf+json": ["gltf"], "model/gltf-binary": ["glb"], "model/iges": ["igs", "iges"], "model/mesh": ["msh", "mesh", "silo"], "model/vnd.collada+xml": ["dae"], "model/vnd.dwf": ["dwf"], "model/vnd.gdl": ["gdl"], "model/vnd.gtw": ["gtw"], "model/vnd.mts": ["mts"], "model/vnd.vtu": ["vtu"], "model/vrml": ["wrl", "vrml"], "model/x3d+binary": ["x3db", "x3dbz"], "model/x3d+vrml": ["x3dv", "x3dvz"], "model/x3d+xml": ["x3d", "x3dz"], "text/cache-manifest": ["appcache", "manifest"], "text/calendar": ["ics", "ifb"], "text/coffeescript": ["coffee", "litcoffee"], "text/css": ["css"], "text/csv": ["csv"], "text/hjson": ["hjson"], "text/html": ["html", "htm", "shtml"], "text/jade": ["jade"], "text/jsx": ["jsx"], "text/less": ["less"], "text/markdown": ["markdown", "md"], "text/mathml": ["mml"], "text/n3": ["n3"], "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"], "text/prs.lines.tag": ["dsc"], "text/richtext": ["rtx"], "text/rtf": [], "text/sgml": ["sgml", "sgm"], "text/slim": ["slim", "slm"], "text/stylus": ["stylus", "styl"], "text/tab-separated-values": ["tsv"], "text/troff": ["t", "tr", "roff", "man", "me", "ms"], "text/turtle": ["ttl"], "text/uri-list": ["uri", "uris", "urls"], "text/vcard": ["vcard"], "text/vnd.curl": ["curl"], "text/vnd.curl.dcurl": ["dcurl"], "text/vnd.curl.mcurl": ["mcurl"], "text/vnd.curl.scurl": ["scurl"], "text/vnd.dvb.subtitle": ["sub"], "text/vnd.fly": ["fly"], "text/vnd.fmi.flexstor": ["flx"], "text/vnd.graphviz": ["gv"], "text/vnd.in3d.3dml": ["3dml"], "text/vnd.in3d.spot": ["spot"], "text/vnd.sun.j2me.app-descriptor": ["jad"], "text/vnd.wap.wml": ["wml"], "text/vnd.wap.wmlscript": ["wmls"], "text/vtt": ["vtt"], "text/x-asm": ["s", "asm"], "text/x-c": ["c", "cc", "cxx", "cpp", "h", "hh", "dic"], "text/x-component": ["htc"], "text/x-fortran": ["f", "for", "f77", "f90"], "text/x-handlebars-template": ["hbs"], "text/x-java-source": ["java"], "text/x-lua": ["lua"], "text/x-markdown": ["mkd"], "text/x-nfo": ["nfo"], "text/x-opml": ["opml"], "text/x-org": [], "text/x-pascal": ["p", "pas"], "text/x-processing": ["pde"], "text/x-sass": ["sass"], "text/x-scss": ["scss"], "text/x-setext": ["etx"], "text/x-sfv": ["sfv"], "text/x-suse-ymp": ["ymp"], "text/x-uuencode": ["uu"], "text/x-vcalendar": ["vcs"], "text/x-vcard": ["vcf"], "text/xml": [], "text/yaml": ["yaml", "yml"], "video/3gpp": ["3gp", "3gpp"], "video/3gpp2": ["3g2"], "video/h261": ["h261"], "video/h263": ["h263"], "video/h264": ["h264"], "video/jpeg": ["jpgv"], "video/jpm": ["jpgm"], "video/mj2": ["mj2", "mjp2"], "video/mp2t": ["ts"], "video/mp4": ["mp4", "mp4v", "mpg4"], "video/mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v"], "video/ogg": ["ogv"], "video/quicktime": ["qt", "mov"], "video/vnd.dece.hd": ["uvh", "uvvh"], "video/vnd.dece.mobile": ["uvm", "uvvm"], "video/vnd.dece.pd": ["uvp", "uvvp"], "video/vnd.dece.sd": ["uvs", "uvvs"], "video/vnd.dece.video": ["uvv", "uvvv"], "video/vnd.dvb.file": ["dvb"], "video/vnd.fvt": ["fvt"], "video/vnd.mpegurl": ["mxu", "m4u"], "video/vnd.ms-playready.media.pyv": ["pyv"], "video/vnd.uvvu.mp4": ["uvu", "uvvu"], "video/vnd.vivo": ["viv"], "video/webm": ["webm"], "video/x-f4v": ["f4v"], "video/x-fli": ["fli"], "video/x-flv": ["flv"], "video/x-m4v": ["m4v"], "video/x-matroska": ["mkv", "mk3d", "mks"], "video/x-mng": ["mng"], "video/x-ms-asf": ["asf", "asx"], "video/x-ms-vob": ["vob"], "video/x-ms-wm": ["wm"], "video/x-ms-wmv": ["wmv"], "video/x-ms-wmx": ["wmx"], "video/x-ms-wvx": ["wvx"], "video/x-msvideo": ["avi"], "video/x-sgi-movie": ["movie"], "video/x-smv": ["smv"], "x-conference/x-cooltalk": ["ice"] };
  }
});

// node_modules/mime/mime.js
var require_mime = __commonJS({
  "node_modules/mime/mime.js"(exports2, module2) {
    var path = require("path");
    var fs = require("fs");
    function Mime() {
      this.types = /* @__PURE__ */ Object.create(null);
      this.extensions = /* @__PURE__ */ Object.create(null);
    }
    Mime.prototype.define = function(map) {
      for (var type in map) {
        var exts = map[type];
        for (var i = 0; i < exts.length; i++) {
          if (process.env.DEBUG_MIME && this.types[exts[i]]) {
            console.warn((this._loading || "define()").replace(/.*\//, ""), 'changes "' + exts[i] + '" extension type from ' + this.types[exts[i]] + " to " + type);
          }
          this.types[exts[i]] = type;
        }
        if (!this.extensions[type]) {
          this.extensions[type] = exts[0];
        }
      }
    };
    Mime.prototype.load = function(file) {
      this._loading = file;
      var map = {}, content = fs.readFileSync(file, "ascii"), lines = content.split(/[\r\n]+/);
      lines.forEach(function(line) {
        var fields = line.replace(/\s*#.*|^\s*|\s*$/g, "").split(/\s+/);
        map[fields.shift()] = fields;
      });
      this.define(map);
      this._loading = null;
    };
    Mime.prototype.lookup = function(path2, fallback) {
      var ext = path2.replace(/^.*[\.\/\\]/, "").toLowerCase();
      return this.types[ext] || fallback || this.default_type;
    };
    Mime.prototype.extension = function(mimeType) {
      var type = mimeType.match(/^\s*([^;\s]*)(?:;|\s|$)/)[1].toLowerCase();
      return this.extensions[type];
    };
    var mime = new Mime();
    mime.define(require_types());
    mime.default_type = mime.lookup("bin");
    mime.Mime = Mime;
    mime.charsets = {
      lookup: function(mimeType, fallback) {
        return /^text\/|^application\/(javascript|json)/.test(mimeType) ? "UTF-8" : fallback;
      }
    };
    module2.exports = mime;
  }
});

// node_modules/object-inspect/util.inspect.js
var require_util_inspect = __commonJS({
  "node_modules/object-inspect/util.inspect.js"(exports2, module2) {
    module2.exports = require("util").inspect;
  }
});

// node_modules/object-inspect/index.js
var require_object_inspect = __commonJS({
  "node_modules/object-inspect/index.js"(exports2, module2) {
    var hasMap = typeof Map === "function" && Map.prototype;
    var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
    var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
    var mapForEach = hasMap && Map.prototype.forEach;
    var hasSet = typeof Set === "function" && Set.prototype;
    var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
    var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
    var setForEach = hasSet && Set.prototype.forEach;
    var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
    var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
    var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
    var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
    var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
    var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
    var booleanValueOf = Boolean.prototype.valueOf;
    var objectToString = Object.prototype.toString;
    var functionToString = Function.prototype.toString;
    var $match = String.prototype.match;
    var $slice = String.prototype.slice;
    var $replace = String.prototype.replace;
    var $toUpperCase = String.prototype.toUpperCase;
    var $toLowerCase = String.prototype.toLowerCase;
    var $test = RegExp.prototype.test;
    var $concat = Array.prototype.concat;
    var $join = Array.prototype.join;
    var $arrSlice = Array.prototype.slice;
    var $floor = Math.floor;
    var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
    var gOPS = Object.getOwnPropertySymbols;
    var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
    var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
    var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
    var isEnumerable = Object.prototype.propertyIsEnumerable;
    var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
      return O.__proto__;
    } : null);
    function addNumericSeparator(num, str) {
      if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
        return str;
      }
      var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
      if (typeof num === "number") {
        var int = num < 0 ? -$floor(-num) : $floor(num);
        if (int !== num) {
          var intStr = String(int);
          var dec = $slice.call(str, intStr.length + 1);
          return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
        }
      }
      return $replace.call(str, sepRegex, "$&_");
    }
    var utilInspect = require_util_inspect();
    var inspectCustom = utilInspect.custom;
    var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
    var quotes = {
      __proto__: null,
      "double": '"',
      single: "'"
    };
    var quoteREs = {
      __proto__: null,
      "double": /(["\\])/g,
      single: /(['\\])/g
    };
    module2.exports = function inspect_(obj, options, depth, seen) {
      var opts = options || {};
      if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
      }
      if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
      }
      var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
      if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
        throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
      }
      if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
      }
      if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
      }
      var numericSeparator = opts.numericSeparator;
      if (typeof obj === "undefined") {
        return "undefined";
      }
      if (obj === null) {
        return "null";
      }
      if (typeof obj === "boolean") {
        return obj ? "true" : "false";
      }
      if (typeof obj === "string") {
        return inspectString(obj, opts);
      }
      if (typeof obj === "number") {
        if (obj === 0) {
          return Infinity / obj > 0 ? "0" : "-0";
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
      }
      if (typeof obj === "bigint") {
        var bigIntStr = String(obj) + "n";
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
      }
      var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
      if (typeof depth === "undefined") {
        depth = 0;
      }
      if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
        return isArray(obj) ? "[Array]" : "[Object]";
      }
      var indent = getIndent(opts, depth);
      if (typeof seen === "undefined") {
        seen = [];
      } else if (indexOf(seen, obj) >= 0) {
        return "[Circular]";
      }
      function inspect(value, from, noIndent) {
        if (from) {
          seen = $arrSlice.call(seen);
          seen.push(from);
        }
        if (noIndent) {
          var newOpts = {
            depth: opts.depth
          };
          if (has(opts, "quoteStyle")) {
            newOpts.quoteStyle = opts.quoteStyle;
          }
          return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
      }
      if (typeof obj === "function" && !isRegExp(obj)) {
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
      }
      if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
        return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
      }
      if (isElement(obj)) {
        var s = "<" + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
          s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
        }
        s += ">";
        if (obj.childNodes && obj.childNodes.length) {
          s += "...";
        }
        s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
        return s;
      }
      if (isArray(obj)) {
        if (obj.length === 0) {
          return "[]";
        }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
          return "[" + indentedJoin(xs, indent) + "]";
        }
        return "[ " + $join.call(xs, ", ") + " ]";
      }
      if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
          return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
        }
        if (parts.length === 0) {
          return "[" + String(obj) + "]";
        }
        return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
      }
      if (typeof obj === "object" && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
          return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
          return obj.inspect();
        }
      }
      if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
          mapForEach.call(obj, function(value, key) {
            mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
          });
        }
        return collectionOf("Map", mapSize.call(obj), mapParts, indent);
      }
      if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
          setForEach.call(obj, function(value) {
            setParts.push(inspect(value, obj));
          });
        }
        return collectionOf("Set", setSize.call(obj), setParts, indent);
      }
      if (isWeakMap(obj)) {
        return weakCollectionOf("WeakMap");
      }
      if (isWeakSet(obj)) {
        return weakCollectionOf("WeakSet");
      }
      if (isWeakRef(obj)) {
        return weakCollectionOf("WeakRef");
      }
      if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
      }
      if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
      }
      if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
      }
      if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
      }
      if (typeof window !== "undefined" && obj === window) {
        return "{ [object Window] }";
      }
      if (typeof globalThis !== "undefined" && obj === globalThis || typeof global !== "undefined" && obj === global) {
        return "{ [object globalThis] }";
      }
      if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? "" : "null prototype";
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
        var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
        var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
        if (ys.length === 0) {
          return tag + "{}";
        }
        if (indent) {
          return tag + "{" + indentedJoin(ys, indent) + "}";
        }
        return tag + "{ " + $join.call(ys, ", ") + " }";
      }
      return String(obj);
    };
    function wrapQuotes(s, defaultStyle, opts) {
      var style = opts.quoteStyle || defaultStyle;
      var quoteChar = quotes[style];
      return quoteChar + s + quoteChar;
    }
    function quote(s) {
      return $replace.call(String(s), /"/g, "&quot;");
    }
    function canTrustToString(obj) {
      return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
    }
    function isArray(obj) {
      return toStr(obj) === "[object Array]" && canTrustToString(obj);
    }
    function isDate(obj) {
      return toStr(obj) === "[object Date]" && canTrustToString(obj);
    }
    function isRegExp(obj) {
      return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
    }
    function isError(obj) {
      return toStr(obj) === "[object Error]" && canTrustToString(obj);
    }
    function isString(obj) {
      return toStr(obj) === "[object String]" && canTrustToString(obj);
    }
    function isNumber(obj) {
      return toStr(obj) === "[object Number]" && canTrustToString(obj);
    }
    function isBoolean(obj) {
      return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
    }
    function isSymbol(obj) {
      if (hasShammedSymbols) {
        return obj && typeof obj === "object" && obj instanceof Symbol;
      }
      if (typeof obj === "symbol") {
        return true;
      }
      if (!obj || typeof obj !== "object" || !symToString) {
        return false;
      }
      try {
        symToString.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    function isBigInt(obj) {
      if (!obj || typeof obj !== "object" || !bigIntValueOf) {
        return false;
      }
      try {
        bigIntValueOf.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    var hasOwn = Object.prototype.hasOwnProperty || function(key) {
      return key in this;
    };
    function has(obj, key) {
      return hasOwn.call(obj, key);
    }
    function toStr(obj) {
      return objectToString.call(obj);
    }
    function nameOf(f) {
      if (f.name) {
        return f.name;
      }
      var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
      if (m) {
        return m[1];
      }
      return null;
    }
    function indexOf(xs, x) {
      if (xs.indexOf) {
        return xs.indexOf(x);
      }
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) {
          return i;
        }
      }
      return -1;
    }
    function isMap(x) {
      if (!mapSize || !x || typeof x !== "object") {
        return false;
      }
      try {
        mapSize.call(x);
        try {
          setSize.call(x);
        } catch (s) {
          return true;
        }
        return x instanceof Map;
      } catch (e) {
      }
      return false;
    }
    function isWeakMap(x) {
      if (!weakMapHas || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakMapHas.call(x, weakMapHas);
        try {
          weakSetHas.call(x, weakSetHas);
        } catch (s) {
          return true;
        }
        return x instanceof WeakMap;
      } catch (e) {
      }
      return false;
    }
    function isWeakRef(x) {
      if (!weakRefDeref || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakRefDeref.call(x);
        return true;
      } catch (e) {
      }
      return false;
    }
    function isSet(x) {
      if (!setSize || !x || typeof x !== "object") {
        return false;
      }
      try {
        setSize.call(x);
        try {
          mapSize.call(x);
        } catch (m) {
          return true;
        }
        return x instanceof Set;
      } catch (e) {
      }
      return false;
    }
    function isWeakSet(x) {
      if (!weakSetHas || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakSetHas.call(x, weakSetHas);
        try {
          weakMapHas.call(x, weakMapHas);
        } catch (s) {
          return true;
        }
        return x instanceof WeakSet;
      } catch (e) {
      }
      return false;
    }
    function isElement(x) {
      if (!x || typeof x !== "object") {
        return false;
      }
      if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
        return true;
      }
      return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
    }
    function inspectString(str, opts) {
      if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
      }
      var quoteRE = quoteREs[opts.quoteStyle || "single"];
      quoteRE.lastIndex = 0;
      var s = $replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte);
      return wrapQuotes(s, "single", opts);
    }
    function lowbyte(c) {
      var n = c.charCodeAt(0);
      var x = {
        8: "b",
        9: "t",
        10: "n",
        12: "f",
        13: "r"
      }[n];
      if (x) {
        return "\\" + x;
      }
      return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
    }
    function markBoxed(str) {
      return "Object(" + str + ")";
    }
    function weakCollectionOf(type) {
      return type + " { ? }";
    }
    function collectionOf(type, size, entries, indent) {
      var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
      return type + " (" + size + ") {" + joinedEntries + "}";
    }
    function singleLineValues(xs) {
      for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], "\n") >= 0) {
          return false;
        }
      }
      return true;
    }
    function getIndent(opts, depth) {
      var baseIndent;
      if (opts.indent === "	") {
        baseIndent = "	";
      } else if (typeof opts.indent === "number" && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), " ");
      } else {
        return null;
      }
      return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
      };
    }
    function indentedJoin(xs, indent) {
      if (xs.length === 0) {
        return "";
      }
      var lineJoiner = "\n" + indent.prev + indent.base;
      return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
    }
    function arrObjKeys(obj, inspect) {
      var isArr = isArray(obj);
      var xs = [];
      if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
          xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
        }
      }
      var syms = typeof gOPS === "function" ? gOPS(obj) : [];
      var symMap;
      if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
          symMap["$" + syms[k]] = syms[k];
        }
      }
      for (var key in obj) {
        if (!has(obj, key)) {
          continue;
        }
        if (isArr && String(Number(key)) === key && key < obj.length) {
          continue;
        }
        if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
          continue;
        } else if ($test.call(/[^\w$]/, key)) {
          xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
        } else {
          xs.push(key + ": " + inspect(obj[key], obj));
        }
      }
      if (typeof gOPS === "function") {
        for (var j = 0; j < syms.length; j++) {
          if (isEnumerable.call(obj, syms[j])) {
            xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
          }
        }
      }
      return xs;
    }
  }
});

// node_modules/side-channel-list/index.js
var require_side_channel_list = __commonJS({
  "node_modules/side-channel-list/index.js"(exports2, module2) {
    "use strict";
    var inspect = require_object_inspect();
    var $TypeError = require_type();
    var listGetNode = function(list, key, isDelete) {
      var prev = list;
      var curr;
      for (; (curr = prev.next) != null; prev = curr) {
        if (curr.key === key) {
          prev.next = curr.next;
          if (!isDelete) {
            curr.next = /** @type {NonNullable<typeof list.next>} */
            list.next;
            list.next = curr;
          }
          return curr;
        }
      }
    };
    var listGet = function(objects, key) {
      if (!objects) {
        return void 0;
      }
      var node = listGetNode(objects, key);
      return node && node.value;
    };
    var listSet = function(objects, key, value) {
      var node = listGetNode(objects, key);
      if (node) {
        node.value = value;
      } else {
        objects.next = /** @type {import('./list.d.ts').ListNode<typeof value, typeof key>} */
        {
          // eslint-disable-line no-param-reassign, no-extra-parens
          key,
          next: objects.next,
          value
        };
      }
    };
    var listHas = function(objects, key) {
      if (!objects) {
        return false;
      }
      return !!listGetNode(objects, key);
    };
    var listDelete = function(objects, key) {
      if (objects) {
        return listGetNode(objects, key, true);
      }
    };
    module2.exports = function getSideChannelList() {
      var $o;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        },
        "delete": function(key) {
          var root = $o && $o.next;
          var deletedNode = listDelete($o, key);
          if (deletedNode && root && root === deletedNode) {
            $o = void 0;
          }
          return !!deletedNode;
        },
        get: function(key) {
          return listGet($o, key);
        },
        has: function(key) {
          return listHas($o, key);
        },
        set: function(key, value) {
          if (!$o) {
            $o = {
              next: void 0
            };
          }
          listSet(
            /** @type {NonNullable<typeof $o>} */
            $o,
            key,
            value
          );
        }
      };
      return channel;
    };
  }
});

// node_modules/call-bound/index.js
var require_call_bound = __commonJS({
  "node_modules/call-bound/index.js"(exports2, module2) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var callBindBasic = require_call_bind_apply_helpers();
    var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
    module2.exports = function callBoundIntrinsic(name, allowMissing) {
      var intrinsic = (
        /** @type {(this: unknown, ...args: unknown[]) => unknown} */
        GetIntrinsic(name, !!allowMissing)
      );
      if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
        return callBindBasic(
          /** @type {const} */
          [intrinsic]
        );
      }
      return intrinsic;
    };
  }
});

// node_modules/side-channel-map/index.js
var require_side_channel_map = __commonJS({
  "node_modules/side-channel-map/index.js"(exports2, module2) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var callBound = require_call_bound();
    var inspect = require_object_inspect();
    var $TypeError = require_type();
    var $Map = GetIntrinsic("%Map%", true);
    var $mapGet = callBound("Map.prototype.get", true);
    var $mapSet = callBound("Map.prototype.set", true);
    var $mapHas = callBound("Map.prototype.has", true);
    var $mapDelete = callBound("Map.prototype.delete", true);
    var $mapSize = callBound("Map.prototype.size", true);
    module2.exports = !!$Map && /** @type {Exclude<import('.'), false>} */
    function getSideChannelMap() {
      var $m;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        },
        "delete": function(key) {
          if ($m) {
            var result = $mapDelete($m, key);
            if ($mapSize($m) === 0) {
              $m = void 0;
            }
            return result;
          }
          return false;
        },
        get: function(key) {
          if ($m) {
            return $mapGet($m, key);
          }
        },
        has: function(key) {
          if ($m) {
            return $mapHas($m, key);
          }
          return false;
        },
        set: function(key, value) {
          if (!$m) {
            $m = new $Map();
          }
          $mapSet($m, key, value);
        }
      };
      return channel;
    };
  }
});

// node_modules/side-channel-weakmap/index.js
var require_side_channel_weakmap = __commonJS({
  "node_modules/side-channel-weakmap/index.js"(exports2, module2) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var callBound = require_call_bound();
    var inspect = require_object_inspect();
    var getSideChannelMap = require_side_channel_map();
    var $TypeError = require_type();
    var $WeakMap = GetIntrinsic("%WeakMap%", true);
    var $weakMapGet = callBound("WeakMap.prototype.get", true);
    var $weakMapSet = callBound("WeakMap.prototype.set", true);
    var $weakMapHas = callBound("WeakMap.prototype.has", true);
    var $weakMapDelete = callBound("WeakMap.prototype.delete", true);
    module2.exports = $WeakMap ? (
      /** @type {Exclude<import('.'), false>} */
      function getSideChannelWeakMap() {
        var $wm;
        var $m;
        var channel = {
          assert: function(key) {
            if (!channel.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect(key));
            }
          },
          "delete": function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapDelete($wm, key);
              }
            } else if (getSideChannelMap) {
              if ($m) {
                return $m["delete"](key);
              }
            }
            return false;
          },
          get: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapGet($wm, key);
              }
            }
            return $m && $m.get(key);
          },
          has: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapHas($wm, key);
              }
            }
            return !!$m && $m.has(key);
          },
          set: function(key, value) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if (!$wm) {
                $wm = new $WeakMap();
              }
              $weakMapSet($wm, key, value);
            } else if (getSideChannelMap) {
              if (!$m) {
                $m = getSideChannelMap();
              }
              $m.set(key, value);
            }
          }
        };
        return channel;
      }
    ) : getSideChannelMap;
  }
});

// node_modules/side-channel/index.js
var require_side_channel = __commonJS({
  "node_modules/side-channel/index.js"(exports2, module2) {
    "use strict";
    var $TypeError = require_type();
    var inspect = require_object_inspect();
    var getSideChannelList = require_side_channel_list();
    var getSideChannelMap = require_side_channel_map();
    var getSideChannelWeakMap = require_side_channel_weakmap();
    var makeChannel = getSideChannelWeakMap || getSideChannelMap || getSideChannelList;
    module2.exports = function getSideChannel() {
      var $channelData;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        },
        "delete": function(key) {
          return !!$channelData && $channelData["delete"](key);
        },
        get: function(key) {
          return $channelData && $channelData.get(key);
        },
        has: function(key) {
          return !!$channelData && $channelData.has(key);
        },
        set: function(key, value) {
          if (!$channelData) {
            $channelData = makeChannel();
          }
          $channelData.set(key, value);
        }
      };
      return channel;
    };
  }
});

// node_modules/qs/lib/formats.js
var require_formats = __commonJS({
  "node_modules/qs/lib/formats.js"(exports2, module2) {
    "use strict";
    var replace = String.prototype.replace;
    var percentTwenties = /%20/g;
    var Format = {
      RFC1738: "RFC1738",
      RFC3986: "RFC3986"
    };
    module2.exports = {
      "default": Format.RFC3986,
      formatters: {
        RFC1738: function(value) {
          return replace.call(value, percentTwenties, "+");
        },
        RFC3986: function(value) {
          return String(value);
        }
      },
      RFC1738: Format.RFC1738,
      RFC3986: Format.RFC3986
    };
  }
});

// node_modules/qs/lib/utils.js
var require_utils2 = __commonJS({
  "node_modules/qs/lib/utils.js"(exports2, module2) {
    "use strict";
    var formats = require_formats();
    var has = Object.prototype.hasOwnProperty;
    var isArray = Array.isArray;
    var hexTable = function() {
      var array = [];
      for (var i = 0; i < 256; ++i) {
        array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
      }
      return array;
    }();
    var compactQueue = function compactQueue2(queue) {
      while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];
        if (isArray(obj)) {
          var compacted = [];
          for (var j = 0; j < obj.length; ++j) {
            if (typeof obj[j] !== "undefined") {
              compacted.push(obj[j]);
            }
          }
          item.obj[item.prop] = compacted;
        }
      }
    };
    var arrayToObject = function arrayToObject2(source, options) {
      var obj = options && options.plainObjects ? { __proto__: null } : {};
      for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== "undefined") {
          obj[i] = source[i];
        }
      }
      return obj;
    };
    var merge = function merge2(target, source, options) {
      if (!source) {
        return target;
      }
      if (typeof source !== "object" && typeof source !== "function") {
        if (isArray(target)) {
          target.push(source);
        } else if (target && typeof target === "object") {
          if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
            target[source] = true;
          }
        } else {
          return [target, source];
        }
        return target;
      }
      if (!target || typeof target !== "object") {
        return [target].concat(source);
      }
      var mergeTarget = target;
      if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
      }
      if (isArray(target) && isArray(source)) {
        source.forEach(function(item, i) {
          if (has.call(target, i)) {
            var targetItem = target[i];
            if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
              target[i] = merge2(targetItem, item, options);
            } else {
              target.push(item);
            }
          } else {
            target[i] = item;
          }
        });
        return target;
      }
      return Object.keys(source).reduce(function(acc, key) {
        var value = source[key];
        if (has.call(acc, key)) {
          acc[key] = merge2(acc[key], value, options);
        } else {
          acc[key] = value;
        }
        return acc;
      }, mergeTarget);
    };
    var assign = function assignSingleSource(target, source) {
      return Object.keys(source).reduce(function(acc, key) {
        acc[key] = source[key];
        return acc;
      }, target);
    };
    var decode = function(str, defaultDecoder, charset) {
      var strWithoutPlus = str.replace(/\+/g, " ");
      if (charset === "iso-8859-1") {
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
      }
      try {
        return decodeURIComponent(strWithoutPlus);
      } catch (e) {
        return strWithoutPlus;
      }
    };
    var limit = 1024;
    var encode = function encode2(str, defaultEncoder, charset, kind, format) {
      if (str.length === 0) {
        return str;
      }
      var string = str;
      if (typeof str === "symbol") {
        string = Symbol.prototype.toString.call(str);
      } else if (typeof str !== "string") {
        string = String(str);
      }
      if (charset === "iso-8859-1") {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
          return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
        });
      }
      var out = "";
      for (var j = 0; j < string.length; j += limit) {
        var segment = string.length >= limit ? string.slice(j, j + limit) : string;
        var arr = [];
        for (var i = 0; i < segment.length; ++i) {
          var c = segment.charCodeAt(i);
          if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats.RFC1738 && (c === 40 || c === 41)) {
            arr[arr.length] = segment.charAt(i);
            continue;
          }
          if (c < 128) {
            arr[arr.length] = hexTable[c];
            continue;
          }
          if (c < 2048) {
            arr[arr.length] = hexTable[192 | c >> 6] + hexTable[128 | c & 63];
            continue;
          }
          if (c < 55296 || c >= 57344) {
            arr[arr.length] = hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
            continue;
          }
          i += 1;
          c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
          arr[arr.length] = hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
        }
        out += arr.join("");
      }
      return out;
    };
    var compact = function compact2(value) {
      var queue = [{ obj: { o: value }, prop: "o" }];
      var refs = [];
      for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];
        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
          var key = keys[j];
          var val = obj[key];
          if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
            queue.push({ obj, prop: key });
            refs.push(val);
          }
        }
      }
      compactQueue(queue);
      return value;
    };
    var isRegExp = function isRegExp2(obj) {
      return Object.prototype.toString.call(obj) === "[object RegExp]";
    };
    var isBuffer = function isBuffer2(obj) {
      if (!obj || typeof obj !== "object") {
        return false;
      }
      return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
    };
    var combine = function combine2(a, b) {
      return [].concat(a, b);
    };
    var maybeMap = function maybeMap2(val, fn) {
      if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
          mapped.push(fn(val[i]));
        }
        return mapped;
      }
      return fn(val);
    };
    module2.exports = {
      arrayToObject,
      assign,
      combine,
      compact,
      decode,
      encode,
      isBuffer,
      isRegExp,
      maybeMap,
      merge
    };
  }
});

// node_modules/qs/lib/stringify.js
var require_stringify = __commonJS({
  "node_modules/qs/lib/stringify.js"(exports2, module2) {
    "use strict";
    var getSideChannel = require_side_channel();
    var utils = require_utils2();
    var formats = require_formats();
    var has = Object.prototype.hasOwnProperty;
    var arrayPrefixGenerators = {
      brackets: function brackets(prefix) {
        return prefix + "[]";
      },
      comma: "comma",
      indices: function indices(prefix, key) {
        return prefix + "[" + key + "]";
      },
      repeat: function repeat(prefix) {
        return prefix;
      }
    };
    var isArray = Array.isArray;
    var push = Array.prototype.push;
    var pushToArray = function(arr, valueOrArray) {
      push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
    };
    var toISO = Date.prototype.toISOString;
    var defaultFormat = formats["default"];
    var defaults = {
      addQueryPrefix: false,
      allowDots: false,
      allowEmptyArrays: false,
      arrayFormat: "indices",
      charset: "utf-8",
      charsetSentinel: false,
      commaRoundTrip: false,
      delimiter: "&",
      encode: true,
      encodeDotInKeys: false,
      encoder: utils.encode,
      encodeValuesOnly: false,
      filter: void 0,
      format: defaultFormat,
      formatter: formats.formatters[defaultFormat],
      // deprecated
      indices: false,
      serializeDate: function serializeDate(date) {
        return toISO.call(date);
      },
      skipNulls: false,
      strictNullHandling: false
    };
    var isNonNullishPrimitive = function isNonNullishPrimitive2(v) {
      return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
    };
    var sentinel = {};
    var stringify = function stringify2(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
      var obj = object;
      var tmpSc = sideChannel;
      var step = 0;
      var findFlag = false;
      while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== "undefined") {
          if (pos === step) {
            throw new RangeError("Cyclic object value");
          } else {
            findFlag = true;
          }
        }
        if (typeof tmpSc.get(sentinel) === "undefined") {
          step = 0;
        }
      }
      if (typeof filter === "function") {
        obj = filter(prefix, obj);
      } else if (obj instanceof Date) {
        obj = serializeDate(obj);
      } else if (generateArrayPrefix === "comma" && isArray(obj)) {
        obj = utils.maybeMap(obj, function(value2) {
          if (value2 instanceof Date) {
            return serializeDate(value2);
          }
          return value2;
        });
      }
      if (obj === null) {
        if (strictNullHandling) {
          return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix;
        }
        obj = "";
      }
      if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
          var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
          return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults.encoder, charset, "value", format))];
        }
        return [formatter(prefix) + "=" + formatter(String(obj))];
      }
      var values = [];
      if (typeof obj === "undefined") {
        return values;
      }
      var objKeys;
      if (generateArrayPrefix === "comma" && isArray(obj)) {
        if (encodeValuesOnly && encoder) {
          obj = utils.maybeMap(obj, encoder);
        }
        objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
      } else if (isArray(filter)) {
        objKeys = filter;
      } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
      }
      var encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
      var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + "[]" : encodedPrefix;
      if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
        return adjustedPrefix + "[]";
      }
      for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === "object" && key && typeof key.value !== "undefined" ? key.value : obj[key];
        if (skipNulls && value === null) {
          continue;
        }
        var encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key);
        var keyPrefix = isArray(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + encodedKey : "[" + encodedKey + "]");
        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify2(
          value,
          keyPrefix,
          generateArrayPrefix,
          commaRoundTrip,
          allowEmptyArrays,
          strictNullHandling,
          skipNulls,
          encodeDotInKeys,
          generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj) ? null : encoder,
          filter,
          sort,
          allowDots,
          serializeDate,
          format,
          formatter,
          encodeValuesOnly,
          charset,
          valueSideChannel
        ));
      }
      return values;
    };
    var normalizeStringifyOptions = function normalizeStringifyOptions2(opts) {
      if (!opts) {
        return defaults;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
        throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
        throw new TypeError("Encoder has to be a function.");
      }
      var charset = opts.charset || defaults.charset;
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      var format = formats["default"];
      if (typeof opts.format !== "undefined") {
        if (!has.call(formats.formatters, opts.format)) {
          throw new TypeError("Unknown format option provided.");
        }
        format = opts.format;
      }
      var formatter = formats.formatters[format];
      var filter = defaults.filter;
      if (typeof opts.filter === "function" || isArray(opts.filter)) {
        filter = opts.filter;
      }
      var arrayFormat;
      if (opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
      } else if ("indices" in opts) {
        arrayFormat = opts.indices ? "indices" : "repeat";
      } else {
        arrayFormat = defaults.arrayFormat;
      }
      if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
        throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
      return {
        addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        arrayFormat,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
        commaRoundTrip: !!opts.commaRoundTrip,
        delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
        encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
        encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter,
        format,
        formatter,
        serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === "function" ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
      };
    };
    module2.exports = function(object, opts) {
      var obj = object;
      var options = normalizeStringifyOptions(opts);
      var objKeys;
      var filter;
      if (typeof options.filter === "function") {
        filter = options.filter;
        obj = filter("", obj);
      } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
      }
      var keys = [];
      if (typeof obj !== "object" || obj === null) {
        return "";
      }
      var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
      var commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
      if (!objKeys) {
        objKeys = Object.keys(obj);
      }
      if (options.sort) {
        objKeys.sort(options.sort);
      }
      var sideChannel = getSideChannel();
      for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];
        var value = obj[key];
        if (options.skipNulls && value === null) {
          continue;
        }
        pushToArray(keys, stringify(
          value,
          key,
          generateArrayPrefix,
          commaRoundTrip,
          options.allowEmptyArrays,
          options.strictNullHandling,
          options.skipNulls,
          options.encodeDotInKeys,
          options.encode ? options.encoder : null,
          options.filter,
          options.sort,
          options.allowDots,
          options.serializeDate,
          options.format,
          options.formatter,
          options.encodeValuesOnly,
          options.charset,
          sideChannel
        ));
      }
      var joined = keys.join(options.delimiter);
      var prefix = options.addQueryPrefix === true ? "?" : "";
      if (options.charsetSentinel) {
        if (options.charset === "iso-8859-1") {
          prefix += "utf8=%26%2310003%3B&";
        } else {
          prefix += "utf8=%E2%9C%93&";
        }
      }
      return joined.length > 0 ? prefix + joined : "";
    };
  }
});

// node_modules/qs/lib/parse.js
var require_parse = __commonJS({
  "node_modules/qs/lib/parse.js"(exports2, module2) {
    "use strict";
    var utils = require_utils2();
    var has = Object.prototype.hasOwnProperty;
    var isArray = Array.isArray;
    var defaults = {
      allowDots: false,
      allowEmptyArrays: false,
      allowPrototypes: false,
      allowSparse: false,
      arrayLimit: 20,
      charset: "utf-8",
      charsetSentinel: false,
      comma: false,
      decodeDotInKeys: false,
      decoder: utils.decode,
      delimiter: "&",
      depth: 5,
      duplicates: "combine",
      ignoreQueryPrefix: false,
      interpretNumericEntities: false,
      parameterLimit: 1e3,
      parseArrays: true,
      plainObjects: false,
      strictDepth: false,
      strictNullHandling: false,
      throwOnLimitExceeded: false
    };
    var interpretNumericEntities = function(str) {
      return str.replace(/&#(\d+);/g, function($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
      });
    };
    var parseArrayValue = function(val, options, currentArrayLength) {
      if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
        return val.split(",");
      }
      if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
        throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
      }
      return val;
    };
    var isoSentinel = "utf8=%26%2310003%3B";
    var charsetSentinel = "utf8=%E2%9C%93";
    var parseValues = function parseQueryStringValues(str, options) {
      var obj = { __proto__: null };
      var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
      cleanStr = cleanStr.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
      var parts = cleanStr.split(
        options.delimiter,
        options.throwOnLimitExceeded ? limit + 1 : limit
      );
      if (options.throwOnLimitExceeded && parts.length > limit) {
        throw new RangeError("Parameter limit exceeded. Only " + limit + " parameter" + (limit === 1 ? "" : "s") + " allowed.");
      }
      var skipIndex = -1;
      var i;
      var charset = options.charset;
      if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
          if (parts[i].indexOf("utf8=") === 0) {
            if (parts[i] === charsetSentinel) {
              charset = "utf-8";
            } else if (parts[i] === isoSentinel) {
              charset = "iso-8859-1";
            }
            skipIndex = i;
            i = parts.length;
          }
        }
      }
      for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
          continue;
        }
        var part = parts[i];
        var bracketEqualsPos = part.indexOf("]=");
        var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
        var key;
        var val;
        if (pos === -1) {
          key = options.decoder(part, defaults.decoder, charset, "key");
          val = options.strictNullHandling ? null : "";
        } else {
          key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
          val = utils.maybeMap(
            parseArrayValue(
              part.slice(pos + 1),
              options,
              isArray(obj[key]) ? obj[key].length : 0
            ),
            function(encodedVal) {
              return options.decoder(encodedVal, defaults.decoder, charset, "value");
            }
          );
        }
        if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
          val = interpretNumericEntities(String(val));
        }
        if (part.indexOf("[]=") > -1) {
          val = isArray(val) ? [val] : val;
        }
        var existing = has.call(obj, key);
        if (existing && options.duplicates === "combine") {
          obj[key] = utils.combine(obj[key], val);
        } else if (!existing || options.duplicates === "last") {
          obj[key] = val;
        }
      }
      return obj;
    };
    var parseObject = function(chain, val, options, valuesParsed) {
      var currentArrayLength = 0;
      if (chain.length > 0 && chain[chain.length - 1] === "[]") {
        var parentKey = chain.slice(0, -1).join("");
        currentArrayLength = Array.isArray(val) && val[parentKey] ? val[parentKey].length : 0;
      }
      var leaf = valuesParsed ? val : parseArrayValue(val, options, currentArrayLength);
      for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];
        if (root === "[]" && options.parseArrays) {
          obj = options.allowEmptyArrays && (leaf === "" || options.strictNullHandling && leaf === null) ? [] : utils.combine([], leaf);
        } else {
          obj = options.plainObjects ? { __proto__: null } : {};
          var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
          var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, ".") : cleanRoot;
          var index = parseInt(decodedRoot, 10);
          if (!options.parseArrays && decodedRoot === "") {
            obj = { 0: leaf };
          } else if (!isNaN(index) && root !== decodedRoot && String(index) === decodedRoot && index >= 0 && (options.parseArrays && index <= options.arrayLimit)) {
            obj = [];
            obj[index] = leaf;
          } else if (decodedRoot !== "__proto__") {
            obj[decodedRoot] = leaf;
          }
        }
        leaf = obj;
      }
      return leaf;
    };
    var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
      if (!givenKey) {
        return;
      }
      var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, "[$1]") : givenKey;
      var brackets = /(\[[^[\]]*])/;
      var child = /(\[[^[\]]*])/g;
      var segment = options.depth > 0 && brackets.exec(key);
      var parent = segment ? key.slice(0, segment.index) : key;
      var keys = [];
      if (parent) {
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        keys.push(parent);
      }
      var i = 0;
      while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        keys.push(segment[1]);
      }
      if (segment) {
        if (options.strictDepth === true) {
          throw new RangeError("Input depth exceeded depth option of " + options.depth + " and strictDepth is true");
        }
        keys.push("[" + key.slice(segment.index) + "]");
      }
      return parseObject(keys, val, options, valuesParsed);
    };
    var normalizeParseOptions = function normalizeParseOptions2(opts) {
      if (!opts) {
        return defaults;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.decodeDotInKeys !== "undefined" && typeof opts.decodeDotInKeys !== "boolean") {
        throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.decoder !== null && typeof opts.decoder !== "undefined" && typeof opts.decoder !== "function") {
        throw new TypeError("Decoder has to be a function.");
      }
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      if (typeof opts.throwOnLimitExceeded !== "undefined" && typeof opts.throwOnLimitExceeded !== "boolean") {
        throw new TypeError("`throwOnLimitExceeded` option must be a boolean");
      }
      var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
      var duplicates = typeof opts.duplicates === "undefined" ? defaults.duplicates : opts.duplicates;
      if (duplicates !== "combine" && duplicates !== "first" && duplicates !== "last") {
        throw new TypeError("The duplicates option must be either combine, first, or last");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
      return {
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
        decodeDotInKeys: typeof opts.decodeDotInKeys === "boolean" ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
        decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
        duplicates,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
        strictDepth: typeof opts.strictDepth === "boolean" ? !!opts.strictDepth : defaults.strictDepth,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling,
        throwOnLimitExceeded: typeof opts.throwOnLimitExceeded === "boolean" ? opts.throwOnLimitExceeded : false
      };
    };
    module2.exports = function(str, opts) {
      var options = normalizeParseOptions(opts);
      if (str === "" || str === null || typeof str === "undefined") {
        return options.plainObjects ? { __proto__: null } : {};
      }
      var tempObj = typeof str === "string" ? parseValues(str, options) : str;
      var obj = options.plainObjects ? { __proto__: null } : {};
      var keys = Object.keys(tempObj);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
        obj = utils.merge(obj, newObj, options);
      }
      if (options.allowSparse === true) {
        return obj;
      }
      return utils.compact(obj);
    };
  }
});

// node_modules/qs/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/qs/lib/index.js"(exports2, module2) {
    "use strict";
    var stringify = require_stringify();
    var parse = require_parse();
    var formats = require_formats();
    module2.exports = {
      formats,
      parse,
      stringify
    };
  }
});

// node_modules/superagent/package.json
var require_package = __commonJS({
  "node_modules/superagent/package.json"(exports2, module2) {
    module2.exports = {
      name: "superagent",
      version: "3.8.1",
      description: "elegant & feature rich browser / node HTTP with a fluent API",
      scripts: {
        prepare: "make all",
        test: "make test"
      },
      keywords: [
        "http",
        "ajax",
        "request",
        "agent"
      ],
      license: "MIT",
      author: "TJ Holowaychuk <tj@vision-media.ca>",
      contributors: [
        "Kornel Lesi\u0144ski <kornel@geekhood.net>",
        "Peter Lyons <pete@peterlyons.com>",
        "Hunter Loftis <hunter@hunterloftis.com>"
      ],
      repository: {
        type: "git",
        url: "git://github.com/visionmedia/superagent.git"
      },
      dependencies: {
        "component-emitter": "^1.2.0",
        cookiejar: "^2.1.0",
        debug: "^3.1.0",
        extend: "^3.0.0",
        "form-data": "^2.3.1",
        formidable: "^1.1.1",
        methods: "^1.1.1",
        mime: "^1.4.1",
        qs: "^6.5.1",
        "readable-stream": "^2.0.5"
      },
      devDependencies: {
        Base64: "^1.0.1",
        "basic-auth-connect": "^1.0.0",
        "body-parser": "^1.18.2",
        browserify: "^14.1.0",
        "cookie-parser": "^1.4.3",
        express: "^4.16.0",
        "express-session": "^1.15.6",
        marked: "^0.3.6",
        mocha: "^3.5.3",
        multer: "^1.3.0",
        should: "^11.2.0",
        "should-http": "^0.1.1",
        zuul: "^3.11.1"
      },
      browser: {
        "./lib/node/index.js": "./lib/client.js",
        "./test/support/server.js": "./test/support/blank.js"
      },
      component: {
        scripts: {
          superagent: "lib/client.js"
        }
      },
      main: "./lib/node/index.js",
      engines: {
        node: ">= 4.0"
      }
    };
  }
});

// node_modules/superagent/lib/is-object.js
var require_is_object = __commonJS({
  "node_modules/superagent/lib/is-object.js"(exports2, module2) {
    "use strict";
    function isObject(obj) {
      return null !== obj && "object" === typeof obj;
    }
    module2.exports = isObject;
  }
});

// node_modules/superagent/lib/request-base.js
var require_request_base = __commonJS({
  "node_modules/superagent/lib/request-base.js"(exports2, module2) {
    "use strict";
    var isObject = require_is_object();
    module2.exports = RequestBase;
    function RequestBase(obj) {
      if (obj) return mixin(obj);
    }
    function mixin(obj) {
      for (var key in RequestBase.prototype) {
        obj[key] = RequestBase.prototype[key];
      }
      return obj;
    }
    RequestBase.prototype.clearTimeout = function _clearTimeout() {
      clearTimeout(this._timer);
      clearTimeout(this._responseTimeoutTimer);
      delete this._timer;
      delete this._responseTimeoutTimer;
      return this;
    };
    RequestBase.prototype.parse = function parse(fn) {
      this._parser = fn;
      return this;
    };
    RequestBase.prototype.responseType = function(val) {
      this._responseType = val;
      return this;
    };
    RequestBase.prototype.serialize = function serialize(fn) {
      this._serializer = fn;
      return this;
    };
    RequestBase.prototype.timeout = function timeout(options) {
      if (!options || "object" !== typeof options) {
        this._timeout = options;
        this._responseTimeout = 0;
        return this;
      }
      for (var option in options) {
        switch (option) {
          case "deadline":
            this._timeout = options.deadline;
            break;
          case "response":
            this._responseTimeout = options.response;
            break;
          default:
            console.warn("Unknown timeout option", option);
        }
      }
      return this;
    };
    RequestBase.prototype.retry = function retry(count, fn) {
      if (arguments.length === 0 || count === true) count = 1;
      if (count <= 0) count = 0;
      this._maxRetries = count;
      this._retries = 0;
      this._retryCallback = fn;
      return this;
    };
    var ERROR_CODES = [
      "ECONNRESET",
      "ETIMEDOUT",
      "EADDRINFO",
      "ESOCKETTIMEDOUT"
    ];
    RequestBase.prototype._shouldRetry = function(err, res) {
      if (!this._maxRetries || this._retries++ >= this._maxRetries) {
        return false;
      }
      if (this._retryCallback) {
        try {
          var override = this._retryCallback(err, res);
          if (override === true) return true;
          if (override === false) return false;
        } catch (e) {
          console.error(e);
        }
      }
      if (res && res.status && res.status >= 500 && res.status != 501) return true;
      if (err) {
        if (err.code && ~ERROR_CODES.indexOf(err.code)) return true;
        if (err.timeout && err.code == "ECONNABORTED") return true;
        if (err.crossDomain) return true;
      }
      return false;
    };
    RequestBase.prototype._retry = function() {
      this.clearTimeout();
      if (this.req) {
        this.req = null;
        this.req = this.request();
      }
      this._aborted = false;
      this.timedout = false;
      return this._end();
    };
    RequestBase.prototype.then = function then(resolve, reject) {
      if (!this._fullfilledPromise) {
        var self = this;
        if (this._endCalled) {
          console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
        }
        this._fullfilledPromise = new Promise(function(innerResolve, innerReject) {
          self.end(function(err, res) {
            if (err) innerReject(err);
            else innerResolve(res);
          });
        });
      }
      return this._fullfilledPromise.then(resolve, reject);
    };
    RequestBase.prototype.catch = function(cb) {
      return this.then(void 0, cb);
    };
    RequestBase.prototype.use = function use(fn) {
      fn(this);
      return this;
    };
    RequestBase.prototype.ok = function(cb) {
      if ("function" !== typeof cb) throw Error("Callback required");
      this._okCallback = cb;
      return this;
    };
    RequestBase.prototype._isResponseOK = function(res) {
      if (!res) {
        return false;
      }
      if (this._okCallback) {
        return this._okCallback(res);
      }
      return res.status >= 200 && res.status < 300;
    };
    RequestBase.prototype.get = function(field) {
      return this._header[field.toLowerCase()];
    };
    RequestBase.prototype.getHeader = RequestBase.prototype.get;
    RequestBase.prototype.set = function(field, val) {
      if (isObject(field)) {
        for (var key in field) {
          this.set(key, field[key]);
        }
        return this;
      }
      this._header[field.toLowerCase()] = val;
      this.header[field] = val;
      return this;
    };
    RequestBase.prototype.unset = function(field) {
      delete this._header[field.toLowerCase()];
      delete this.header[field];
      return this;
    };
    RequestBase.prototype.field = function(name, val) {
      if (null === name || void 0 === name) {
        throw new Error(".field(name, val) name can not be empty");
      }
      if (this._data) {
        console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
      }
      if (isObject(name)) {
        for (var key in name) {
          this.field(key, name[key]);
        }
        return this;
      }
      if (Array.isArray(val)) {
        for (var i in val) {
          this.field(name, val[i]);
        }
        return this;
      }
      if (null === val || void 0 === val) {
        throw new Error(".field(name, val) val can not be empty");
      }
      if ("boolean" === typeof val) {
        val = "" + val;
      }
      this._getFormData().append(name, val);
      return this;
    };
    RequestBase.prototype.abort = function() {
      if (this._aborted) {
        return this;
      }
      this._aborted = true;
      this.xhr && this.xhr.abort();
      this.req && this.req.abort();
      this.clearTimeout();
      this.emit("abort");
      return this;
    };
    RequestBase.prototype._auth = function(user, pass, options, base64Encoder) {
      switch (options.type) {
        case "basic":
          this.set("Authorization", "Basic " + base64Encoder(user + ":" + pass));
          break;
        case "auto":
          this.username = user;
          this.password = pass;
          break;
        case "bearer":
          this.set("Authorization", "Bearer " + user);
          break;
      }
      return this;
    };
    RequestBase.prototype.withCredentials = function(on) {
      if (on == void 0) on = true;
      this._withCredentials = on;
      return this;
    };
    RequestBase.prototype.redirects = function(n) {
      this._maxRedirects = n;
      return this;
    };
    RequestBase.prototype.maxResponseSize = function(n) {
      if ("number" !== typeof n) {
        throw TypeError("Invalid argument");
      }
      this._maxResponseSize = n;
      return this;
    };
    RequestBase.prototype.toJSON = function() {
      return {
        method: this.method,
        url: this.url,
        data: this._data,
        headers: this._header
      };
    };
    RequestBase.prototype.send = function(data) {
      var isObj = isObject(data);
      var type = this._header["content-type"];
      if (this._formData) {
        console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
      }
      if (isObj && !this._data) {
        if (Array.isArray(data)) {
          this._data = [];
        } else if (!this._isHost(data)) {
          this._data = {};
        }
      } else if (data && this._data && this._isHost(this._data)) {
        throw Error("Can't merge these send calls");
      }
      if (isObj && isObject(this._data)) {
        for (var key in data) {
          this._data[key] = data[key];
        }
      } else if ("string" == typeof data) {
        if (!type) this.type("form");
        type = this._header["content-type"];
        if ("application/x-www-form-urlencoded" == type) {
          this._data = this._data ? this._data + "&" + data : data;
        } else {
          this._data = (this._data || "") + data;
        }
      } else {
        this._data = data;
      }
      if (!isObj || this._isHost(data)) {
        return this;
      }
      if (!type) this.type("json");
      return this;
    };
    RequestBase.prototype.sortQuery = function(sort) {
      this._sort = typeof sort === "undefined" ? true : sort;
      return this;
    };
    RequestBase.prototype._finalizeQueryString = function() {
      var query = this._query.join("&");
      if (query) {
        this.url += (this.url.indexOf("?") >= 0 ? "&" : "?") + query;
      }
      this._query.length = 0;
      if (this._sort) {
        var index = this.url.indexOf("?");
        if (index >= 0) {
          var queryArr = this.url.substring(index + 1).split("&");
          if ("function" === typeof this._sort) {
            queryArr.sort(this._sort);
          } else {
            queryArr.sort();
          }
          this.url = this.url.substring(0, index) + "?" + queryArr.join("&");
        }
      }
    };
    RequestBase.prototype._appendQueryString = function() {
      console.trace("Unsupported");
    };
    RequestBase.prototype._timeoutError = function(reason, timeout, errno) {
      if (this._aborted) {
        return;
      }
      var err = new Error(reason + timeout + "ms exceeded");
      err.timeout = timeout;
      err.code = "ECONNABORTED";
      err.errno = errno;
      this.timedout = true;
      this.abort();
      this.callback(err);
    };
    RequestBase.prototype._setTimeouts = function() {
      var self = this;
      if (this._timeout && !this._timer) {
        this._timer = setTimeout(function() {
          self._timeoutError("Timeout of ", self._timeout, "ETIME");
        }, this._timeout);
      }
      if (this._responseTimeout && !this._responseTimeoutTimer) {
        this._responseTimeoutTimer = setTimeout(function() {
          self._timeoutError("Response timeout of ", self._responseTimeout, "ETIMEDOUT");
        }, this._responseTimeout);
      }
    };
  }
});

// node_modules/cookiejar/cookiejar.js
var require_cookiejar = __commonJS({
  "node_modules/cookiejar/cookiejar.js"(exports2) {
    (function() {
      "use strict";
      function CookieAccessInfo(domain, path, secure, script) {
        if (this instanceof CookieAccessInfo) {
          this.domain = domain || void 0;
          this.path = path || "/";
          this.secure = !!secure;
          this.script = !!script;
          return this;
        }
        return new CookieAccessInfo(domain, path, secure, script);
      }
      CookieAccessInfo.All = Object.freeze(/* @__PURE__ */ Object.create(null));
      exports2.CookieAccessInfo = CookieAccessInfo;
      function Cookie(cookiestr, request_domain, request_path) {
        if (cookiestr instanceof Cookie) {
          return cookiestr;
        }
        if (this instanceof Cookie) {
          this.name = null;
          this.value = null;
          this.expiration_date = Infinity;
          this.path = String(request_path || "/");
          this.explicit_path = false;
          this.domain = request_domain || null;
          this.explicit_domain = false;
          this.secure = false;
          this.noscript = false;
          if (cookiestr) {
            this.parse(cookiestr, request_domain, request_path);
          }
          return this;
        }
        return new Cookie(cookiestr, request_domain, request_path);
      }
      exports2.Cookie = Cookie;
      Cookie.prototype.toString = function toString() {
        var str = [this.name + "=" + this.value];
        if (this.expiration_date !== Infinity) {
          str.push("expires=" + new Date(this.expiration_date).toGMTString());
        }
        if (this.domain) {
          str.push("domain=" + this.domain);
        }
        if (this.path) {
          str.push("path=" + this.path);
        }
        if (this.secure) {
          str.push("secure");
        }
        if (this.noscript) {
          str.push("httponly");
        }
        return str.join("; ");
      };
      Cookie.prototype.toValueString = function toValueString() {
        return this.name + "=" + this.value;
      };
      var cookie_str_splitter = /[:](?=\s*[a-zA-Z0-9_\-]+\s*[=])/g;
      Cookie.prototype.parse = function parse(str, request_domain, request_path) {
        if (this instanceof Cookie) {
          if (str.length > 32768) {
            console.warn("Cookie too long for parsing (>32768 characters)");
            return;
          }
          var parts = str.split(";").filter(function(value2) {
            return !!value2;
          });
          var i;
          var pair = parts[0].match(/([^=]+)=([\s\S]*)/);
          if (!pair) {
            console.warn("Invalid cookie header encountered. Header: '" + str + "'");
            return;
          }
          var key = pair[1];
          var value = pair[2];
          if (typeof key !== "string" || key.length === 0 || typeof value !== "string") {
            console.warn("Unable to extract values from cookie header. Cookie: '" + str + "'");
            return;
          }
          this.name = key;
          this.value = value;
          for (i = 1; i < parts.length; i += 1) {
            pair = parts[i].match(/([^=]+)(?:=([\s\S]*))?/);
            key = pair[1].trim().toLowerCase();
            value = pair[2];
            switch (key) {
              case "httponly":
                this.noscript = true;
                break;
              case "expires":
                this.expiration_date = value ? Number(Date.parse(value)) : Infinity;
                break;
              case "path":
                this.path = value ? value.trim() : "";
                this.explicit_path = true;
                break;
              case "domain":
                this.domain = value ? value.trim() : "";
                this.explicit_domain = !!this.domain;
                break;
              case "secure":
                this.secure = true;
                break;
            }
          }
          if (!this.explicit_path) {
            this.path = request_path || "/";
          }
          if (!this.explicit_domain) {
            this.domain = request_domain;
          }
          return this;
        }
        return new Cookie().parse(str, request_domain, request_path);
      };
      Cookie.prototype.matches = function matches(access_info) {
        if (access_info === CookieAccessInfo.All) {
          return true;
        }
        if (this.noscript && access_info.script || this.secure && !access_info.secure || !this.collidesWith(access_info)) {
          return false;
        }
        return true;
      };
      Cookie.prototype.collidesWith = function collidesWith(access_info) {
        if (this.path && !access_info.path || this.domain && !access_info.domain) {
          return false;
        }
        if (this.path && access_info.path.indexOf(this.path) !== 0) {
          return false;
        }
        if (this.explicit_path && access_info.path.indexOf(this.path) !== 0) {
          return false;
        }
        var access_domain = access_info.domain && access_info.domain.replace(/^[\.]/, "");
        var cookie_domain = this.domain && this.domain.replace(/^[\.]/, "");
        if (cookie_domain === access_domain) {
          return true;
        }
        if (cookie_domain) {
          if (!this.explicit_domain) {
            return false;
          }
          var wildcard = access_domain.indexOf(cookie_domain);
          if (wildcard === -1 || wildcard !== access_domain.length - cookie_domain.length) {
            return false;
          }
          return true;
        }
        return true;
      };
      function CookieJar() {
        var cookies, cookies_list, collidable_cookie;
        if (this instanceof CookieJar) {
          cookies = /* @__PURE__ */ Object.create(null);
          this.setCookie = function setCookie(cookie, request_domain, request_path) {
            var remove, i;
            cookie = new Cookie(cookie, request_domain, request_path);
            remove = cookie.expiration_date <= Date.now();
            if (cookies[cookie.name] !== void 0) {
              cookies_list = cookies[cookie.name];
              for (i = 0; i < cookies_list.length; i += 1) {
                collidable_cookie = cookies_list[i];
                if (collidable_cookie.collidesWith(cookie)) {
                  if (remove) {
                    cookies_list.splice(i, 1);
                    if (cookies_list.length === 0) {
                      delete cookies[cookie.name];
                    }
                    return false;
                  }
                  cookies_list[i] = cookie;
                  return cookie;
                }
              }
              if (remove) {
                return false;
              }
              cookies_list.push(cookie);
              return cookie;
            }
            if (remove) {
              return false;
            }
            cookies[cookie.name] = [cookie];
            return cookies[cookie.name];
          };
          this.getCookie = function getCookie(cookie_name, access_info) {
            var cookie, i;
            cookies_list = cookies[cookie_name];
            if (!cookies_list) {
              return;
            }
            for (i = 0; i < cookies_list.length; i += 1) {
              cookie = cookies_list[i];
              if (cookie.expiration_date <= Date.now()) {
                if (cookies_list.length === 0) {
                  delete cookies[cookie.name];
                }
                continue;
              }
              if (cookie.matches(access_info)) {
                return cookie;
              }
            }
          };
          this.getCookies = function getCookies(access_info) {
            var matches = [], cookie_name, cookie;
            for (cookie_name in cookies) {
              cookie = this.getCookie(cookie_name, access_info);
              if (cookie) {
                matches.push(cookie);
              }
            }
            matches.toString = function toString() {
              return matches.join(":");
            };
            matches.toValueString = function toValueString() {
              return matches.map(function(c) {
                return c.toValueString();
              }).join("; ");
            };
            return matches;
          };
          return this;
        }
        return new CookieJar();
      }
      exports2.CookieJar = CookieJar;
      CookieJar.prototype.setCookies = function setCookies(cookies, request_domain, request_path) {
        cookies = Array.isArray(cookies) ? cookies : cookies.split(cookie_str_splitter);
        var successful = [], i, cookie;
        cookies = cookies.map(function(item) {
          return new Cookie(item, request_domain, request_path);
        });
        for (i = 0; i < cookies.length; i += 1) {
          cookie = cookies[i];
          if (this.setCookie(cookie, request_domain, request_path)) {
            successful.push(cookie);
          }
        }
        return successful;
      };
    })();
  }
});

// node_modules/superagent/lib/agent-base.js
var require_agent_base = __commonJS({
  "node_modules/superagent/lib/agent-base.js"(exports2, module2) {
    function Agent() {
      this._defaults = [];
    }
    [
      "use",
      "on",
      "once",
      "set",
      "query",
      "type",
      "accept",
      "auth",
      "withCredentials",
      "sortQuery",
      "retry",
      "ok",
      "redirects",
      "timeout",
      "buffer",
      "serialize",
      "parse",
      "ca",
      "key",
      "pfx",
      "cert"
    ].forEach(function(fn) {
      Agent.prototype[fn] = function() {
        this._defaults.push({ fn, arguments });
        return this;
      };
    });
    Agent.prototype._setDefaults = function(req) {
      this._defaults.forEach(function(def) {
        req[def.fn].apply(req, def.arguments);
      });
    };
    module2.exports = Agent;
  }
});

// node_modules/superagent/lib/node/agent.js
var require_agent = __commonJS({
  "node_modules/superagent/lib/node/agent.js"(exports2, module2) {
    "use strict";
    var CookieJar = require_cookiejar().CookieJar;
    var CookieAccess = require_cookiejar().CookieAccessInfo;
    var parse = require("url").parse;
    var request = require_node2();
    var AgentBase = require_agent_base();
    var methods = require_methods();
    module2.exports = Agent;
    function Agent(options) {
      if (!(this instanceof Agent)) {
        return new Agent(options);
      }
      AgentBase.call(this);
      this.jar = new CookieJar();
      if (options) {
        if (options.ca) {
          this.ca(options.ca);
        }
        if (options.key) {
          this.key(options.key);
        }
        if (options.pfx) {
          this.pfx(options.pfx);
        }
        if (options.cert) {
          this.cert(options.cert);
        }
      }
    }
    Agent.prototype = Object.create(AgentBase.prototype);
    Agent.prototype._saveCookies = function(res) {
      const cookies = res.headers["set-cookie"];
      if (cookies) this.jar.setCookies(cookies);
    };
    Agent.prototype._attachCookies = function(req) {
      const url = parse(req.url);
      const access = CookieAccess(
        url.hostname,
        url.pathname,
        "https:" == url.protocol
      );
      const cookies = this.jar.getCookies(access).toValueString();
      req.cookies = cookies;
    };
    methods.forEach((name) => {
      const method = name.toUpperCase();
      Agent.prototype[name] = function(url, fn) {
        const req = new request.Request(method, url);
        req.on("response", this._saveCookies.bind(this));
        req.on("redirect", this._saveCookies.bind(this));
        req.on("redirect", this._attachCookies.bind(this, req));
        this._attachCookies(req);
        this._setDefaults(req);
        if (fn) {
          req.end(fn);
        }
        return req;
      };
    });
    Agent.prototype.del = Agent.prototype["delete"];
  }
});

// node_modules/superagent/lib/node/parsers/urlencoded.js
var require_urlencoded = __commonJS({
  "node_modules/superagent/lib/node/parsers/urlencoded.js"(exports2, module2) {
    "use strict";
    var qs = require_lib2();
    module2.exports = function(res, fn) {
      res.text = "";
      res.setEncoding("ascii");
      res.on("data", (chunk) => {
        res.text += chunk;
      });
      res.on("end", () => {
        try {
          fn(null, qs.parse(res.text));
        } catch (err) {
          fn(err);
        }
      });
    };
  }
});

// node_modules/superagent/lib/node/parsers/json.js
var require_json = __commonJS({
  "node_modules/superagent/lib/node/parsers/json.js"(exports2, module2) {
    "use strict";
    module2.exports = function parseJSON(res, fn) {
      res.text = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        res.text += chunk;
      });
      res.on("end", () => {
        try {
          var body = res.text && JSON.parse(res.text);
        } catch (e) {
          var err = e;
          err.rawResponse = res.text || null;
          err.statusCode = res.statusCode;
        } finally {
          fn(err, body);
        }
      });
    };
  }
});

// node_modules/superagent/lib/node/parsers/text.js
var require_text = __commonJS({
  "node_modules/superagent/lib/node/parsers/text.js"(exports2, module2) {
    "use strict";
    module2.exports = function(res, fn) {
      res.text = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        res.text += chunk;
      });
      res.on("end", fn);
    };
  }
});

// node_modules/superagent/lib/node/parsers/image.js
var require_image = __commonJS({
  "node_modules/superagent/lib/node/parsers/image.js"(exports2, module2) {
    "use strict";
    module2.exports = (res, fn) => {
      const data = [];
      res.on("data", (chunk) => {
        data.push(chunk);
      });
      res.on("end", () => {
        fn(null, Buffer.concat(data));
      });
    };
  }
});

// node_modules/superagent/lib/node/parsers/index.js
var require_parsers = __commonJS({
  "node_modules/superagent/lib/node/parsers/index.js"(exports2) {
    "use strict";
    exports2["application/x-www-form-urlencoded"] = require_urlencoded();
    exports2["application/json"] = require_json();
    exports2.text = require_text();
    var binary = require_image();
    exports2["application/octet-stream"] = binary;
    exports2["application/pdf"] = binary;
    exports2.image = binary;
  }
});

// node_modules/superagent/lib/node/index.js
var require_node2 = __commonJS({
  "node_modules/superagent/lib/node/index.js"(exports2, module2) {
    "use strict";
    var debug = require_src()("superagent");
    var formidable = require_lib();
    var FormData = require_form_data();
    var Response = require_response();
    var parse = require("url").parse;
    var format = require("url").format;
    var resolve = require("url").resolve;
    var methods = require_methods();
    var Stream = require("stream");
    var utils = require_utils();
    var unzip = require_unzip().unzip;
    var extend = require_extend();
    var mime = require_mime();
    var https = require("https");
    var http = require("http");
    var fs = require("fs");
    var qs = require_lib2();
    var zlib = require("zlib");
    var util = require("util");
    var pkg = require_package();
    var RequestBase = require_request_base();
    function request(method, url) {
      if ("function" == typeof url) {
        return new exports2.Request("GET", method).end(url);
      }
      if (1 == arguments.length) {
        return new exports2.Request("GET", method);
      }
      return new exports2.Request(method, url);
    }
    exports2 = module2.exports = request;
    exports2.Request = Request;
    exports2.agent = require_agent();
    function noop() {
    }
    exports2.Response = Response;
    mime.define({
      "application/x-www-form-urlencoded": ["form", "urlencoded", "form-data"]
    }, true);
    exports2.protocols = {
      "http:": http,
      "https:": https
    };
    exports2.serialize = {
      "application/x-www-form-urlencoded": qs.stringify,
      "application/json": JSON.stringify
    };
    exports2.parse = require_parsers();
    function _initHeaders(req) {
      const ua = `node-superagent/${pkg.version}`;
      req._header = {
        // coerces header names to lowercase
        "user-agent": ua
      };
      req.header = {
        // preserves header name case
        "User-Agent": ua
      };
    }
    function Request(method, url) {
      Stream.call(this);
      if ("string" != typeof url) url = format(url);
      this._agent = false;
      this._formData = null;
      this.method = method;
      this.url = url;
      _initHeaders(this);
      this.writable = true;
      this._redirects = 0;
      this.redirects(method === "HEAD" ? 0 : 5);
      this.cookies = "";
      this.qs = {};
      this._query = [];
      this.qsRaw = this._query;
      this._redirectList = [];
      this._streamRequest = false;
      this.once("end", this.clearTimeout.bind(this));
    }
    util.inherits(Request, Stream);
    RequestBase(Request.prototype);
    Request.prototype.attach = function(field, file, options) {
      if (file) {
        if (this._data) {
          throw Error("superagent can't mix .send() and .attach()");
        }
        let o = options || {};
        if ("string" == typeof options) {
          o = { filename: options };
        }
        if ("string" == typeof file) {
          if (!o.filename) o.filename = file;
          debug("creating `fs.ReadStream` instance for file: %s", file);
          file = fs.createReadStream(file);
        } else if (!o.filename && file.path) {
          o.filename = file.path;
        }
        this._getFormData().append(field, file, o);
      }
      return this;
    };
    Request.prototype._getFormData = function() {
      if (!this._formData) {
        this._formData = new FormData();
        this._formData.on("error", (err) => {
          this.emit("error", err);
          this.abort();
        });
      }
      return this._formData;
    };
    Request.prototype.agent = function(agent) {
      if (!arguments.length) return this._agent;
      this._agent = agent;
      return this;
    };
    Request.prototype.type = function(type) {
      return this.set(
        "Content-Type",
        ~type.indexOf("/") ? type : mime.lookup(type)
      );
    };
    Request.prototype.accept = function(type) {
      return this.set("Accept", ~type.indexOf("/") ? type : mime.lookup(type));
    };
    Request.prototype.query = function(val) {
      if ("string" == typeof val) {
        this._query.push(val);
      } else {
        extend(this.qs, val);
      }
      return this;
    };
    Request.prototype.write = function(data, encoding) {
      const req = this.request();
      if (!this._streamRequest) {
        this._streamRequest = true;
      }
      return req.write(data, encoding);
    };
    Request.prototype.pipe = function(stream, options) {
      this.piped = true;
      this.buffer(false);
      this.end();
      return this._pipeContinue(stream, options);
    };
    Request.prototype._pipeContinue = function(stream, options) {
      this.req.once("response", (res) => {
        const redirect = isRedirect(res.statusCode);
        if (redirect && this._redirects++ != this._maxRedirects) {
          return this._redirect(res)._pipeContinue(stream, options);
        }
        this.res = res;
        this._emitResponse();
        if (this._aborted) return;
        if (this._shouldUnzip(res)) {
          const unzipObj = zlib.createUnzip();
          unzipObj.on("error", (err) => {
            if (err && err.code === "Z_BUF_ERROR") {
              stream.emit("end");
              return;
            }
            stream.emit("error", err);
          });
          res.pipe(unzipObj).pipe(stream, options);
        } else {
          res.pipe(stream, options);
        }
        res.once("end", () => {
          this.emit("end");
        });
      });
      return stream;
    };
    Request.prototype.buffer = function(val) {
      this._buffer = false !== val;
      return this;
    };
    Request.prototype._redirect = function(res) {
      let url = res.headers.location;
      if (!url) {
        return this.callback(new Error("No location header for redirect"), res);
      }
      debug("redirect %s -> %s", this.url, url);
      url = resolve(this.url, url);
      res.resume();
      let headers = this.req._headers;
      const changesOrigin = parse(url).host !== parse(this.url).host;
      if (res.statusCode == 301 || res.statusCode == 302) {
        headers = utils.cleanHeader(this.req._headers, changesOrigin);
        this.method = "HEAD" == this.method ? "HEAD" : "GET";
        this._data = null;
      }
      if (res.statusCode == 303) {
        headers = utils.cleanHeader(this.req._headers, changesOrigin);
        this.method = "GET";
        this._data = null;
      }
      delete headers.host;
      delete this.req;
      delete this._formData;
      _initHeaders(this);
      this._endCalled = false;
      this.url = url;
      this.qs = {};
      this._query.length = 0;
      this.set(headers);
      this.emit("redirect", res);
      this._redirectList.push(this.url);
      this.end(this._callback);
      return this;
    };
    Request.prototype.auth = function(user, pass, options) {
      if (1 === arguments.length) pass = "";
      if (typeof pass === "object" && pass !== null) {
        options = pass;
        pass = "";
      }
      if (!options) {
        options = { type: "basic" };
      }
      var encoder = function(string) {
        return new Buffer(string).toString("base64");
      };
      return this._auth(user, pass, options, encoder);
    };
    Request.prototype.ca = function(cert) {
      this._ca = cert;
      return this;
    };
    Request.prototype.key = function(cert) {
      this._key = cert;
      return this;
    };
    Request.prototype.pfx = function(cert) {
      if (typeof cert === "object" && !Buffer.isBuffer(cert)) {
        this._pfx = cert.pfx;
        this._passphrase = cert.passphrase;
      } else {
        this._pfx = cert;
      }
      return this;
    };
    Request.prototype.cert = function(cert) {
      this._cert = cert;
      return this;
    };
    Request.prototype.request = function() {
      if (this.req) return this.req;
      const options = {};
      try {
        const query = qs.stringify(this.qs, {
          indices: false,
          strictNullHandling: true
        });
        if (query) {
          this.qs = {};
          this._query.push(query);
        }
        this._finalizeQueryString();
      } catch (e) {
        return this.emit("error", e);
      }
      let url = this.url;
      const retries = this._retries;
      if (0 != url.indexOf("http")) url = `http://${url}`;
      url = parse(url);
      if (/^https?\+unix:/.test(url.protocol) === true) {
        url.protocol = `${url.protocol.split("+")[0]}:`;
        const unixParts = url.path.match(/^([^/]+)(.+)$/);
        options.socketPath = unixParts[1].replace(/%2F/g, "/");
        url.path = unixParts[2];
      }
      options.method = this.method;
      options.port = url.port;
      options.path = url.path;
      options.host = url.hostname;
      options.ca = this._ca;
      options.key = this._key;
      options.pfx = this._pfx;
      options.cert = this._cert;
      options.passphrase = this._passphrase;
      options.agent = this._agent;
      const mod = exports2.protocols[url.protocol];
      const req = this.req = mod.request(options);
      req.setNoDelay(true);
      if ("HEAD" != options.method) {
        req.setHeader("Accept-Encoding", "gzip, deflate");
      }
      this.protocol = url.protocol;
      this.host = url.host;
      req.once("drain", () => {
        this.emit("drain");
      });
      req.once("error", (err) => {
        if (this._aborted) return;
        if (this._retries !== retries) return;
        if (this.response) return;
        this.callback(err);
      });
      if (url.auth) {
        const auth = url.auth.split(":");
        this.auth(auth[0], auth[1]);
      }
      if (this.username && this.password) {
        this.auth(this.username, this.password);
      }
      if (this.cookies) req.setHeader("Cookie", this.cookies);
      for (const key in this.header) {
        if (this.header.hasOwnProperty(key))
          req.setHeader(key, this.header[key]);
      }
      return req;
    };
    Request.prototype.callback = function(err, res) {
      if (this._shouldRetry(err, res)) {
        return this._retry();
      }
      const fn = this._callback || noop;
      this.clearTimeout();
      if (this.called) return console.warn("superagent: double callback bug");
      this.called = true;
      if (!err) {
        try {
          if (this._isResponseOK(res)) {
            return fn(err, res);
          }
          let msg = "Unsuccessful HTTP response";
          if (res) {
            msg = http.STATUS_CODES[res.status] || msg;
          }
          err = new Error(msg);
          err.status = res ? res.status : void 0;
        } catch (new_err) {
          err = new_err;
        }
      }
      err.response = res;
      if (this._maxRetries) err.retries = this._retries - 1;
      if (err && this.listeners("error").length > 0) {
        this.emit("error", err);
      }
      fn(err, res);
    };
    Request.prototype._isHost = function _isHost(obj) {
      return Buffer.isBuffer(obj) || obj instanceof Stream || obj instanceof FormData;
    };
    Request.prototype._emitResponse = function(body, files) {
      const response = new Response(this);
      this.response = response;
      response.redirects = this._redirectList;
      if (void 0 !== body) {
        response.body = body;
      }
      response.files = files;
      this.emit("response", response);
      return response;
    };
    Request.prototype.end = function(fn) {
      this.request();
      debug("%s %s", this.method, this.url);
      if (this._endCalled) {
        console.warn(
          "Warning: .end() was called twice. This is not supported in superagent"
        );
      }
      this._endCalled = true;
      this._callback = fn || noop;
      return this._end();
    };
    Request.prototype._end = function() {
      let data = this._data;
      const req = this.req;
      let buffer = this._buffer;
      const method = this.method;
      this._setTimeouts();
      if ("HEAD" != method && !req._headerSent) {
        if ("string" != typeof data) {
          let contentType = req.getHeader("Content-Type");
          if (contentType) contentType = contentType.split(";")[0];
          let serialize = exports2.serialize[contentType];
          if (!serialize && isJSON(contentType)) {
            serialize = exports2.serialize["application/json"];
          }
          if (serialize) data = serialize(data);
        }
        if (data && !req.getHeader("Content-Length")) {
          req.setHeader("Content-Length", Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data));
        }
      }
      req.once("response", (res) => {
        debug("%s %s -> %s", this.method, this.url, res.statusCode);
        if (this._responseTimeoutTimer) {
          clearTimeout(this._responseTimeoutTimer);
        }
        if (this.piped) {
          return;
        }
        const max = this._maxRedirects;
        const mime2 = utils.type(res.headers["content-type"] || "") || "text/plain";
        const type = mime2.split("/")[0];
        const multipart = "multipart" == type;
        const redirect = isRedirect(res.statusCode);
        let parser = this._parser;
        const responseType = this._responseType;
        this.res = res;
        if (redirect && this._redirects++ != max) {
          return this._redirect(res);
        }
        if ("HEAD" == this.method) {
          this.emit("end");
          this.callback(null, this._emitResponse());
          return;
        }
        if (this._shouldUnzip(res)) {
          unzip(req, res);
        }
        if (!parser) {
          if (responseType) {
            parser = exports2.parse.image;
            buffer = true;
          } else if (multipart) {
            const form = new formidable.IncomingForm();
            parser = form.parse.bind(form);
            buffer = true;
          } else if (isImageOrVideo(mime2)) {
            parser = exports2.parse.image;
            buffer = true;
          } else if (exports2.parse[mime2]) {
            parser = exports2.parse[mime2];
          } else if ("text" == type) {
            parser = exports2.parse.text;
            buffer = buffer !== false;
          } else if (isJSON(mime2)) {
            parser = exports2.parse["application/json"];
            buffer = buffer !== false;
          } else if (buffer) {
            parser = exports2.parse.text;
          }
        }
        if (void 0 === buffer && isText(mime2) || isJSON(mime2)) {
          buffer = true;
        }
        let parserHandlesEnd = false;
        if (buffer) {
          let responseBytesLeft = this._maxResponseSize || 2e8;
          res.on("data", (buf) => {
            responseBytesLeft -= buf.byteLength || buf.length;
            if (responseBytesLeft < 0) {
              const err = Error("Maximum response size reached");
              err.code = "ETOOLARGE";
              parserHandlesEnd = false;
              res.destroy(err);
            }
          });
        }
        if (parser) {
          try {
            parserHandlesEnd = buffer;
            parser(res, (err, obj, files) => {
              if (this.timedout) {
                return;
              }
              if (err && !this._aborted) {
                return this.callback(err);
              }
              if (parserHandlesEnd) {
                this.emit("end");
                this.callback(null, this._emitResponse(obj, files));
              }
            });
          } catch (err) {
            this.callback(err);
            return;
          }
        }
        this.res = res;
        if (!buffer) {
          debug("unbuffered %s %s", this.method, this.url);
          this.callback(null, this._emitResponse());
          if (multipart) return;
          res.once("end", () => {
            debug("end %s %s", this.method, this.url);
            this.emit("end");
          });
          return;
        }
        res.once("error", (err) => {
          parserHandlesEnd = false;
          this.callback(err, null);
        });
        if (!parserHandlesEnd)
          res.once("end", () => {
            debug("end %s %s", this.method, this.url);
            this.emit("end");
            this.callback(null, this._emitResponse());
          });
      });
      this.emit("request", this);
      const formData = this._formData;
      if (formData) {
        const headers = formData.getHeaders();
        for (const i in headers) {
          debug('setting FormData header: "%s: %s"', i, headers[i]);
          req.setHeader(i, headers[i]);
        }
        formData.getLength((err, length) => {
          debug("got FormData Content-Length: %s", length);
          if ("number" == typeof length) {
            req.setHeader("Content-Length", length);
          }
          const getProgressMonitor = () => {
            const lengthComputable = true;
            const total = req.getHeader("Content-Length");
            let loaded = 0;
            const progress = new Stream.Transform();
            progress._transform = (chunk, encoding, cb) => {
              loaded += chunk.length;
              this.emit("progress", {
                direction: "upload",
                lengthComputable,
                loaded,
                total
              });
              cb(null, chunk);
            };
            return progress;
          };
          formData.pipe(getProgressMonitor()).pipe(req);
        });
      } else {
        req.end(data);
      }
      return this;
    };
    Request.prototype._shouldUnzip = (res) => {
      if (res.statusCode === 204 || res.statusCode === 304) {
        return false;
      }
      if ("0" === res.headers["content-length"]) {
        return false;
      }
      return /^\s*(?:deflate|gzip)\s*$/.test(res.headers["content-encoding"]);
    };
    if (methods.indexOf("del") == -1) {
      methods = methods.slice(0);
      methods.push("del");
    }
    methods.forEach((method) => {
      const name = method;
      method = "del" == method ? "delete" : method;
      method = method.toUpperCase();
      request[name] = (url, data, fn) => {
        const req = request(method, url);
        if ("function" == typeof data) fn = data, data = null;
        if (data) {
          if (method === "GET" || method === "HEAD") {
            req.query(data);
          } else {
            req.send(data);
          }
        }
        fn && req.end(fn);
        return req;
      };
    });
    function isText(mime2) {
      const parts = mime2.split("/");
      const type = parts[0];
      const subtype = parts[1];
      return "text" == type || "x-www-form-urlencoded" == subtype;
    }
    function isImageOrVideo(mime2) {
      const type = mime2.split("/")[0];
      return "image" == type || "video" == type;
    }
    function isJSON(mime2) {
      return /[\/+]json\b/.test(mime2);
    }
    function isRedirect(code) {
      return ~[301, 302, 303, 305, 307, 308].indexOf(code);
    }
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/AccountExportApi.js
var require_AccountExportApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/AccountExportApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.getAccountExportsWithHttpInfo = function(exportId, opts) {
        opts = opts || {};
        var postBody = null;
        if (exportId === void 0 || exportId === null) {
          throw new Error("Missing the required parameter 'exportId' when calling ");
        }
        var pathParams = {
          "export_id": exportId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/account-exports/{export_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getAccountExports = function(exportId, opts) {
        return this.getAccountExportsWithHttpInfo(exportId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/AccountExportsApi.js
var require_AccountExportsApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/AccountExportsApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.listAccountExportsWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/account-exports",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.listAccountExports = function(opts) {
        return this.listAccountExportsWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createAccountExportWithHttpInfo = function(body) {
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/account-exports",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.createAccountExport = function(body) {
        return this.createAccountExportWithHttpInfo(body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/ActivityFeedApi.js
var require_ActivityFeedApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/ActivityFeedApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.getChimpChatterWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/activity-feed/chimp-chatter",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getChimpChatter = function(opts) {
        return this.getChimpChatterWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/AuthorizedAppsApi.js
var require_AuthorizedAppsApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/AuthorizedAppsApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.listWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/authorized-apps",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.list = function(opts) {
        return this.listWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getWithHttpInfo = function(appId, opts) {
        opts = opts || {};
        var postBody = null;
        if (appId === void 0 || appId === null) {
          throw new Error("Missing the required parameter 'appId' when calling ");
        }
        var pathParams = {
          "app_id": appId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/authorized-apps/{app_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.get = function(appId, opts) {
        return this.getWithHttpInfo(appId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/AutomationsApi.js
var require_AutomationsApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/AutomationsApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.archiveWithHttpInfo = function(workflowId) {
        var postBody = null;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}/actions/archive",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.archive = function(workflowId) {
        return this.archiveWithHttpInfo(workflowId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteWorkflowEmailWithHttpInfo = function(workflowId, workflowEmailId) {
        var postBody = null;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        if (workflowEmailId === void 0 || workflowEmailId === null) {
          throw new Error("Missing the required parameter 'workflowEmailId' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId,
          "workflow_email_id": workflowEmailId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}/emails/{workflow_email_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteWorkflowEmail = function(workflowId, workflowEmailId) {
        return this.deleteWorkflowEmailWithHttpInfo(workflowId, workflowEmailId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.listWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "before_create_time": opts["beforeCreateTime"] ? opts["beforeCreateTime"] : opts["before_create_time"],
          "since_create_time": opts["sinceCreateTime"] ? opts["sinceCreateTime"] : opts["since_create_time"],
          "before_start_time": opts["beforeStartTime"] ? opts["beforeStartTime"] : opts["before_start_time"],
          "since_start_time": opts["sinceStartTime"] ? opts["sinceStartTime"] : opts["since_start_time"],
          "status": opts["status"] ? opts["status"] : opts["status"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.list = function(opts) {
        return this.listWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getWithHttpInfo = function(workflowId, opts) {
        opts = opts || {};
        var postBody = null;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.get = function(workflowId, opts) {
        return this.getWithHttpInfo(workflowId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.listAllWorkflowEmailsWithHttpInfo = function(workflowId) {
        var postBody = null;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}/emails",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.listAllWorkflowEmails = function(workflowId) {
        return this.listAllWorkflowEmailsWithHttpInfo(workflowId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getWorkflowEmailWithHttpInfo = function(workflowId, workflowEmailId) {
        var postBody = null;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        if (workflowEmailId === void 0 || workflowEmailId === null) {
          throw new Error("Missing the required parameter 'workflowEmailId' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId,
          "workflow_email_id": workflowEmailId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}/emails/{workflow_email_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getWorkflowEmail = function(workflowId, workflowEmailId) {
        return this.getWorkflowEmailWithHttpInfo(workflowId, workflowEmailId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getWorkflowEmailSubscriberQueueWithHttpInfo = function(workflowId, workflowEmailId) {
        var postBody = null;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        if (workflowEmailId === void 0 || workflowEmailId === null) {
          throw new Error("Missing the required parameter 'workflowEmailId' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId,
          "workflow_email_id": workflowEmailId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}/emails/{workflow_email_id}/queue",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getWorkflowEmailSubscriberQueue = function(workflowId, workflowEmailId) {
        return this.getWorkflowEmailSubscriberQueueWithHttpInfo(workflowId, workflowEmailId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getWorkflowEmailSubscriberWithHttpInfo = function(workflowId, workflowEmailId, subscriberHash) {
        var postBody = null;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        if (workflowEmailId === void 0 || workflowEmailId === null) {
          throw new Error("Missing the required parameter 'workflowEmailId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId,
          "workflow_email_id": workflowEmailId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}/emails/{workflow_email_id}/queue/{subscriber_hash}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getWorkflowEmailSubscriber = function(workflowId, workflowEmailId, subscriberHash) {
        return this.getWorkflowEmailSubscriberWithHttpInfo(workflowId, workflowEmailId, subscriberHash).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.listWorkflowEmailSubscribersRemovedWithHttpInfo = function(workflowId) {
        var postBody = null;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}/removed-subscribers",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.listWorkflowEmailSubscribersRemoved = function(workflowId) {
        return this.listWorkflowEmailSubscribersRemovedWithHttpInfo(workflowId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getRemovedWorkflowEmailSubscriberWithHttpInfo = function(workflowId, subscriberHash) {
        var postBody = null;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}/removed-subscribers/{subscriber_hash}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getRemovedWorkflowEmailSubscriber = function(workflowId, subscriberHash) {
        return this.getRemovedWorkflowEmailSubscriberWithHttpInfo(workflowId, subscriberHash).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateWorkflowEmailWithHttpInfo = function(workflowId, workflowEmailId, body) {
        var postBody = body;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        if (workflowEmailId === void 0 || workflowEmailId === null) {
          throw new Error("Missing the required parameter 'workflowEmailId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId,
          "workflow_email_id": workflowEmailId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}/emails/{workflow_email_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateWorkflowEmail = function(workflowId, workflowEmailId, body) {
        return this.updateWorkflowEmailWithHttpInfo(workflowId, workflowEmailId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createWithHttpInfo = function(body) {
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.create = function(body) {
        return this.createWithHttpInfo(body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.pauseAllEmailsWithHttpInfo = function(workflowId) {
        var postBody = null;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}/actions/pause-all-emails",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.pauseAllEmails = function(workflowId) {
        return this.pauseAllEmailsWithHttpInfo(workflowId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.startAllEmailsWithHttpInfo = function(workflowId) {
        var postBody = null;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}/actions/start-all-emails",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.startAllEmails = function(workflowId) {
        return this.startAllEmailsWithHttpInfo(workflowId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.pauseWorkflowEmailWithHttpInfo = function(workflowId, workflowEmailId) {
        var postBody = null;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        if (workflowEmailId === void 0 || workflowEmailId === null) {
          throw new Error("Missing the required parameter 'workflowEmailId' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId,
          "workflow_email_id": workflowEmailId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}/emails/{workflow_email_id}/actions/pause",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.pauseWorkflowEmail = function(workflowId, workflowEmailId) {
        return this.pauseWorkflowEmailWithHttpInfo(workflowId, workflowEmailId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.startWorkflowEmailWithHttpInfo = function(workflowId, workflowEmailId) {
        var postBody = null;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        if (workflowEmailId === void 0 || workflowEmailId === null) {
          throw new Error("Missing the required parameter 'workflowEmailId' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId,
          "workflow_email_id": workflowEmailId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}/emails/{workflow_email_id}/actions/start",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.startWorkflowEmail = function(workflowId, workflowEmailId) {
        return this.startWorkflowEmailWithHttpInfo(workflowId, workflowEmailId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addWorkflowEmailSubscriberWithHttpInfo = function(workflowId, workflowEmailId, body) {
        var postBody = body;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        if (workflowEmailId === void 0 || workflowEmailId === null) {
          throw new Error("Missing the required parameter 'workflowEmailId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId,
          "workflow_email_id": workflowEmailId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}/emails/{workflow_email_id}/queue",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addWorkflowEmailSubscriber = function(workflowId, workflowEmailId, body) {
        return this.addWorkflowEmailSubscriberWithHttpInfo(workflowId, workflowEmailId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.removeWorkflowEmailSubscriberWithHttpInfo = function(workflowId, body) {
        var postBody = body;
        if (workflowId === void 0 || workflowId === null) {
          throw new Error("Missing the required parameter 'workflowId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "workflow_id": workflowId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/automations/{workflow_id}/removed-subscribers",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.removeWorkflowEmailSubscriber = function(workflowId, body) {
        return this.removeWorkflowEmailSubscriberWithHttpInfo(workflowId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/BatchWebhooksApi.js
var require_BatchWebhooksApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/BatchWebhooksApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.removeWithHttpInfo = function(batchWebhookId) {
        var postBody = null;
        if (batchWebhookId === void 0 || batchWebhookId === null) {
          throw new Error("Missing the required parameter 'batchWebhookId' when calling ");
        }
        var pathParams = {
          "batch_webhook_id": batchWebhookId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/batch-webhooks/{batch_webhook_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.remove = function(batchWebhookId) {
        return this.removeWithHttpInfo(batchWebhookId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getWithHttpInfo = function(batchWebhookId, opts) {
        opts = opts || {};
        var postBody = null;
        if (batchWebhookId === void 0 || batchWebhookId === null) {
          throw new Error("Missing the required parameter 'batchWebhookId' when calling ");
        }
        var pathParams = {
          "batch_webhook_id": batchWebhookId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/batch-webhooks/{batch_webhook_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.get = function(batchWebhookId, opts) {
        return this.getWithHttpInfo(batchWebhookId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.listWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/batch-webhooks",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.list = function(opts) {
        return this.listWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateWithHttpInfo = function(batchWebhookId, body) {
        var postBody = body;
        if (batchWebhookId === void 0 || batchWebhookId === null) {
          throw new Error("Missing the required parameter 'batchWebhookId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "batch_webhook_id": batchWebhookId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/batch-webhooks/{batch_webhook_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.update = function(batchWebhookId, body) {
        return this.updateWithHttpInfo(batchWebhookId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createWithHttpInfo = function(body) {
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/batch-webhooks",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.create = function(body) {
        return this.createWithHttpInfo(body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/BatchesApi.js
var require_BatchesApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/BatchesApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.deleteRequestWithHttpInfo = function(batchId) {
        var postBody = null;
        if (batchId === void 0 || batchId === null) {
          throw new Error("Missing the required parameter 'batchId' when calling ");
        }
        var pathParams = {
          "batch_id": batchId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/batches/{batch_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteRequest = function(batchId) {
        return this.deleteRequestWithHttpInfo(batchId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.listWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/batches",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.list = function(opts) {
        return this.listWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.statusWithHttpInfo = function(batchId, opts) {
        opts = opts || {};
        var postBody = null;
        if (batchId === void 0 || batchId === null) {
          throw new Error("Missing the required parameter 'batchId' when calling ");
        }
        var pathParams = {
          "batch_id": batchId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/batches/{batch_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.status = function(batchId, opts) {
        return this.statusWithHttpInfo(batchId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.startWithHttpInfo = function(body) {
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/batches",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.start = function(body) {
        return this.startWithHttpInfo(body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/CampaignFoldersApi.js
var require_CampaignFoldersApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/CampaignFoldersApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.removeWithHttpInfo = function(folderId) {
        var postBody = null;
        if (folderId === void 0 || folderId === null) {
          throw new Error("Missing the required parameter 'folderId' when calling ");
        }
        var pathParams = {
          "folder_id": folderId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaign-folders/{folder_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.remove = function(folderId) {
        return this.removeWithHttpInfo(folderId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.listWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaign-folders",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.list = function(opts) {
        return this.listWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getWithHttpInfo = function(folderId, opts) {
        opts = opts || {};
        var postBody = null;
        if (folderId === void 0 || folderId === null) {
          throw new Error("Missing the required parameter 'folderId' when calling ");
        }
        var pathParams = {
          "folder_id": folderId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaign-folders/{folder_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.get = function(folderId, opts) {
        return this.getWithHttpInfo(folderId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateWithHttpInfo = function(folderId, body) {
        var postBody = body;
        if (folderId === void 0 || folderId === null) {
          throw new Error("Missing the required parameter 'folderId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "folder_id": folderId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaign-folders/{folder_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.update = function(folderId, body) {
        return this.updateWithHttpInfo(folderId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createWithHttpInfo = function(body) {
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaign-folders",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.create = function(body) {
        return this.createWithHttpInfo(body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/CampaignsApi.js
var require_CampaignsApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/CampaignsApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.removeWithHttpInfo = function(campaignId) {
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.remove = function(campaignId) {
        return this.removeWithHttpInfo(campaignId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteFeedbackMessageWithHttpInfo = function(campaignId, feedbackId) {
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (feedbackId === void 0 || feedbackId === null) {
          throw new Error("Missing the required parameter 'feedbackId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId,
          "feedback_id": feedbackId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/feedback/{feedback_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteFeedbackMessage = function(campaignId, feedbackId) {
        return this.deleteFeedbackMessageWithHttpInfo(campaignId, feedbackId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.listWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "type": opts["type"] ? opts["type"] : opts["type"],
          "status": opts["status"] ? opts["status"] : opts["status"],
          "before_send_time": opts["beforeSendTime"] ? opts["beforeSendTime"] : opts["before_send_time"],
          "since_send_time": opts["sinceSendTime"] ? opts["sinceSendTime"] : opts["since_send_time"],
          "before_create_time": opts["beforeCreateTime"] ? opts["beforeCreateTime"] : opts["before_create_time"],
          "since_create_time": opts["sinceCreateTime"] ? opts["sinceCreateTime"] : opts["since_create_time"],
          "list_id": opts["listId"] ? opts["listId"] : opts["list_id"],
          "folder_id": opts["folderId"] ? opts["folderId"] : opts["folder_id"],
          "member_id": opts["memberId"] ? opts["memberId"] : opts["member_id"],
          "sort_field": opts["sortField"] ? opts["sortField"] : opts["sort_field"],
          "sort_dir": opts["sortDir"] ? opts["sortDir"] : opts["sort_dir"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.list = function(opts) {
        return this.listWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.get = function(campaignId, opts) {
        return this.getWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getContentWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/content",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getContent = function(campaignId, opts) {
        return this.getContentWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getFeedbackWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/feedback",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getFeedback = function(campaignId, opts) {
        return this.getFeedbackWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getFeedbackMessageWithHttpInfo = function(campaignId, feedbackId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (feedbackId === void 0 || feedbackId === null) {
          throw new Error("Missing the required parameter 'feedbackId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId,
          "feedback_id": feedbackId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/feedback/{feedback_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getFeedbackMessage = function(campaignId, feedbackId, opts) {
        return this.getFeedbackMessageWithHttpInfo(campaignId, feedbackId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getSendChecklistWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/send-checklist",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getSendChecklist = function(campaignId, opts) {
        return this.getSendChecklistWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateWithHttpInfo = function(campaignId, body) {
        var postBody = body;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.update = function(campaignId, body) {
        return this.updateWithHttpInfo(campaignId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateFeedbackMessageWithHttpInfo = function(campaignId, feedbackId, body) {
        var postBody = body;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (feedbackId === void 0 || feedbackId === null) {
          throw new Error("Missing the required parameter 'feedbackId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId,
          "feedback_id": feedbackId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/feedback/{feedback_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateFeedbackMessage = function(campaignId, feedbackId, body) {
        return this.updateFeedbackMessageWithHttpInfo(campaignId, feedbackId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createWithHttpInfo = function(body) {
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.create = function(body) {
        return this.createWithHttpInfo(body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.cancelSendWithHttpInfo = function(campaignId) {
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/actions/cancel-send",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.cancelSend = function(campaignId) {
        return this.cancelSendWithHttpInfo(campaignId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createResendWithHttpInfo = function(campaignId) {
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/actions/create-resend",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.createResend = function(campaignId) {
        return this.createResendWithHttpInfo(campaignId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.pauseWithHttpInfo = function(campaignId) {
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/actions/pause",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.pause = function(campaignId) {
        return this.pauseWithHttpInfo(campaignId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.replicateWithHttpInfo = function(campaignId) {
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/actions/replicate",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.replicate = function(campaignId) {
        return this.replicateWithHttpInfo(campaignId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.resumeWithHttpInfo = function(campaignId) {
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/actions/resume",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.resume = function(campaignId) {
        return this.resumeWithHttpInfo(campaignId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.scheduleWithHttpInfo = function(campaignId, body) {
        var postBody = body;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/actions/schedule",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.schedule = function(campaignId, body) {
        return this.scheduleWithHttpInfo(campaignId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.sendWithHttpInfo = function(campaignId) {
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/actions/send",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.send = function(campaignId) {
        return this.sendWithHttpInfo(campaignId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.sendTestEmailWithHttpInfo = function(campaignId, body) {
        var postBody = body;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/actions/test",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.sendTestEmail = function(campaignId, body) {
        return this.sendTestEmailWithHttpInfo(campaignId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.unscheduleWithHttpInfo = function(campaignId) {
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/actions/unschedule",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.unschedule = function(campaignId) {
        return this.unscheduleWithHttpInfo(campaignId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addFeedbackWithHttpInfo = function(campaignId, body) {
        var postBody = body;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/feedback",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addFeedback = function(campaignId, body) {
        return this.addFeedbackWithHttpInfo(campaignId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.setContentWithHttpInfo = function(campaignId, body) {
        var postBody = body;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/campaigns/{campaign_id}/content",
          "PUT",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.setContent = function(campaignId, body) {
        return this.setContentWithHttpInfo(campaignId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/ConnectedSitesApi.js
var require_ConnectedSitesApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/ConnectedSitesApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.removeWithHttpInfo = function(connectedSiteId) {
        var postBody = null;
        if (connectedSiteId === void 0 || connectedSiteId === null) {
          throw new Error("Missing the required parameter 'connectedSiteId' when calling ");
        }
        var pathParams = {
          "connected_site_id": connectedSiteId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/connected-sites/{connected_site_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.remove = function(connectedSiteId) {
        return this.removeWithHttpInfo(connectedSiteId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.listWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/connected-sites",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.list = function(opts) {
        return this.listWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getWithHttpInfo = function(connectedSiteId, opts) {
        opts = opts || {};
        var postBody = null;
        if (connectedSiteId === void 0 || connectedSiteId === null) {
          throw new Error("Missing the required parameter 'connectedSiteId' when calling ");
        }
        var pathParams = {
          "connected_site_id": connectedSiteId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/connected-sites/{connected_site_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.get = function(connectedSiteId, opts) {
        return this.getWithHttpInfo(connectedSiteId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createWithHttpInfo = function(body) {
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/connected-sites",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.create = function(body) {
        return this.createWithHttpInfo(body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.verifyScriptInstallationWithHttpInfo = function(connectedSiteId) {
        var postBody = null;
        if (connectedSiteId === void 0 || connectedSiteId === null) {
          throw new Error("Missing the required parameter 'connectedSiteId' when calling ");
        }
        var pathParams = {
          "connected_site_id": connectedSiteId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/connected-sites/{connected_site_id}/actions/verify-script-installation",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.verifyScriptInstallation = function(connectedSiteId) {
        return this.verifyScriptInstallationWithHttpInfo(connectedSiteId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/ConversationsApi.js
var require_ConversationsApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/ConversationsApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.listWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "has_unread_messages": opts["hasUnreadMessages"] ? opts["hasUnreadMessages"] : opts["has_unread_messages"],
          "list_id": opts["listId"] ? opts["listId"] : opts["list_id"],
          "campaign_id": opts["campaignId"] ? opts["campaignId"] : opts["campaign_id"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/conversations",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.list = function(opts) {
        return this.listWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getWithHttpInfo = function(conversationId, opts) {
        opts = opts || {};
        var postBody = null;
        if (conversationId === void 0 || conversationId === null) {
          throw new Error("Missing the required parameter 'conversationId' when calling ");
        }
        var pathParams = {
          "conversation_id": conversationId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/conversations/{conversation_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.get = function(conversationId, opts) {
        return this.getWithHttpInfo(conversationId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getConversationMessagesWithHttpInfo = function(conversationId, opts) {
        opts = opts || {};
        var postBody = null;
        if (conversationId === void 0 || conversationId === null) {
          throw new Error("Missing the required parameter 'conversationId' when calling ");
        }
        var pathParams = {
          "conversation_id": conversationId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "is_read": opts["isRead"] ? opts["isRead"] : opts["is_read"],
          "before_timestamp": opts["beforeTimestamp"] ? opts["beforeTimestamp"] : opts["before_timestamp"],
          "since_timestamp": opts["sinceTimestamp"] ? opts["sinceTimestamp"] : opts["since_timestamp"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/conversations/{conversation_id}/messages",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getConversationMessages = function(conversationId, opts) {
        return this.getConversationMessagesWithHttpInfo(conversationId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getConversationMessageWithHttpInfo = function(conversationId, messageId, opts) {
        opts = opts || {};
        var postBody = null;
        if (conversationId === void 0 || conversationId === null) {
          throw new Error("Missing the required parameter 'conversationId' when calling ");
        }
        if (messageId === void 0 || messageId === null) {
          throw new Error("Missing the required parameter 'messageId' when calling ");
        }
        var pathParams = {
          "conversation_id": conversationId,
          "message_id": messageId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/conversations/{conversation_id}/messages/{message_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getConversationMessage = function(conversationId, messageId, opts) {
        return this.getConversationMessageWithHttpInfo(conversationId, messageId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/CustomerJourneysApi.js
var require_CustomerJourneysApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/CustomerJourneysApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.triggerWithHttpInfo = function(journeyId, stepId, body) {
        var postBody = body;
        if (journeyId === void 0 || journeyId === null) {
          throw new Error("Missing the required parameter 'journeyId' when calling ");
        }
        if (stepId === void 0 || stepId === null) {
          throw new Error("Missing the required parameter 'stepId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "journey_id": journeyId,
          "step_id": stepId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/customer-journeys/journeys/{journey_id}/steps/{step_id}/actions/trigger",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.trigger = function(journeyId, stepId, body) {
        return this.triggerWithHttpInfo(journeyId, stepId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/EcommerceApi.js
var require_EcommerceApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/EcommerceApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.deleteStoreWithHttpInfo = function(storeId) {
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        var pathParams = {
          "store_id": storeId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteStore = function(storeId) {
        return this.deleteStoreWithHttpInfo(storeId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteStoreCartWithHttpInfo = function(storeId, cartId) {
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (cartId === void 0 || cartId === null) {
          throw new Error("Missing the required parameter 'cartId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "cart_id": cartId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/carts/{cart_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteStoreCart = function(storeId, cartId) {
        return this.deleteStoreCartWithHttpInfo(storeId, cartId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteCartLineItemWithHttpInfo = function(storeId, cartId, lineId) {
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (cartId === void 0 || cartId === null) {
          throw new Error("Missing the required parameter 'cartId' when calling ");
        }
        if (lineId === void 0 || lineId === null) {
          throw new Error("Missing the required parameter 'lineId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "cart_id": cartId,
          "line_id": lineId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/carts/{cart_id}/lines/{line_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteCartLineItem = function(storeId, cartId, lineId) {
        return this.deleteCartLineItemWithHttpInfo(storeId, cartId, lineId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteStoreCustomerWithHttpInfo = function(storeId, customerId) {
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (customerId === void 0 || customerId === null) {
          throw new Error("Missing the required parameter 'customerId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "customer_id": customerId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/customers/{customer_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteStoreCustomer = function(storeId, customerId) {
        return this.deleteStoreCustomerWithHttpInfo(storeId, customerId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteOrderWithHttpInfo = function(storeId, orderId) {
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (orderId === void 0 || orderId === null) {
          throw new Error("Missing the required parameter 'orderId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "order_id": orderId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/orders/{order_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteOrder = function(storeId, orderId) {
        return this.deleteOrderWithHttpInfo(storeId, orderId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteOrderLineItemWithHttpInfo = function(storeId, orderId, lineId) {
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (orderId === void 0 || orderId === null) {
          throw new Error("Missing the required parameter 'orderId' when calling ");
        }
        if (lineId === void 0 || lineId === null) {
          throw new Error("Missing the required parameter 'lineId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "order_id": orderId,
          "line_id": lineId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/orders/{order_id}/lines/{line_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteOrderLineItem = function(storeId, orderId, lineId) {
        return this.deleteOrderLineItemWithHttpInfo(storeId, orderId, lineId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteStoreProductWithHttpInfo = function(storeId, productId) {
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (productId === void 0 || productId === null) {
          throw new Error("Missing the required parameter 'productId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "product_id": productId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products/{product_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteStoreProduct = function(storeId, productId) {
        return this.deleteStoreProductWithHttpInfo(storeId, productId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteProductImageWithHttpInfo = function(storeId, productId, imageId) {
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (productId === void 0 || productId === null) {
          throw new Error("Missing the required parameter 'productId' when calling ");
        }
        if (imageId === void 0 || imageId === null) {
          throw new Error("Missing the required parameter 'imageId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "product_id": productId,
          "image_id": imageId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products/{product_id}/images/{image_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteProductImage = function(storeId, productId, imageId) {
        return this.deleteProductImageWithHttpInfo(storeId, productId, imageId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteProductVariantWithHttpInfo = function(storeId, productId, variantId) {
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (productId === void 0 || productId === null) {
          throw new Error("Missing the required parameter 'productId' when calling ");
        }
        if (variantId === void 0 || variantId === null) {
          throw new Error("Missing the required parameter 'variantId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "product_id": productId,
          "variant_id": variantId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products/{product_id}/variants/{variant_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteProductVariant = function(storeId, productId, variantId) {
        return this.deleteProductVariantWithHttpInfo(storeId, productId, variantId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deletePromoCodeWithHttpInfo = function(storeId, promoRuleId, promoCodeId) {
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (promoRuleId === void 0 || promoRuleId === null) {
          throw new Error("Missing the required parameter 'promoRuleId' when calling ");
        }
        if (promoCodeId === void 0 || promoCodeId === null) {
          throw new Error("Missing the required parameter 'promoCodeId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "promo_rule_id": promoRuleId,
          "promo_code_id": promoCodeId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}/promo-codes/{promo_code_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deletePromoCode = function(storeId, promoRuleId, promoCodeId) {
        return this.deletePromoCodeWithHttpInfo(storeId, promoRuleId, promoCodeId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deletePromoRuleWithHttpInfo = function(storeId, promoRuleId) {
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (promoRuleId === void 0 || promoRuleId === null) {
          throw new Error("Missing the required parameter 'promoRuleId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "promo_rule_id": promoRuleId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deletePromoRule = function(storeId, promoRuleId) {
        return this.deletePromoRuleWithHttpInfo(storeId, promoRuleId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.ordersWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "campaign_id": opts["campaignId"] ? opts["campaignId"] : opts["campaign_id"],
          "outreach_id": opts["outreachId"] ? opts["outreachId"] : opts["outreach_id"],
          "customer_id": opts["customerId"] ? opts["customerId"] : opts["customer_id"],
          "has_outreach": opts["hasOutreach"] ? opts["hasOutreach"] : opts["has_outreach"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/orders",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.orders = function(opts) {
        return this.ordersWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.storesWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.stores = function(opts) {
        return this.storesWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getStoreWithHttpInfo = function(storeId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        var pathParams = {
          "store_id": storeId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getStore = function(storeId, opts) {
        return this.getStoreWithHttpInfo(storeId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getStoreCartsWithHttpInfo = function(storeId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        var pathParams = {
          "store_id": storeId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/carts",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getStoreCarts = function(storeId, opts) {
        return this.getStoreCartsWithHttpInfo(storeId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getStoreCartWithHttpInfo = function(storeId, cartId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (cartId === void 0 || cartId === null) {
          throw new Error("Missing the required parameter 'cartId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "cart_id": cartId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/carts/{cart_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getStoreCart = function(storeId, cartId, opts) {
        return this.getStoreCartWithHttpInfo(storeId, cartId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getAllCartLineItemsWithHttpInfo = function(storeId, cartId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (cartId === void 0 || cartId === null) {
          throw new Error("Missing the required parameter 'cartId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "cart_id": cartId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/carts/{cart_id}/lines",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getAllCartLineItems = function(storeId, cartId, opts) {
        return this.getAllCartLineItemsWithHttpInfo(storeId, cartId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getCartLineItemWithHttpInfo = function(storeId, cartId, lineId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (cartId === void 0 || cartId === null) {
          throw new Error("Missing the required parameter 'cartId' when calling ");
        }
        if (lineId === void 0 || lineId === null) {
          throw new Error("Missing the required parameter 'lineId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "cart_id": cartId,
          "line_id": lineId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/carts/{cart_id}/lines/{line_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getCartLineItem = function(storeId, cartId, lineId, opts) {
        return this.getCartLineItemWithHttpInfo(storeId, cartId, lineId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getAllStoreCustomersWithHttpInfo = function(storeId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        var pathParams = {
          "store_id": storeId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "email_address": opts["emailAddress"] ? opts["emailAddress"] : opts["email_address"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/customers",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getAllStoreCustomers = function(storeId, opts) {
        return this.getAllStoreCustomersWithHttpInfo(storeId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getStoreCustomerWithHttpInfo = function(storeId, customerId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (customerId === void 0 || customerId === null) {
          throw new Error("Missing the required parameter 'customerId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "customer_id": customerId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/customers/{customer_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getStoreCustomer = function(storeId, customerId, opts) {
        return this.getStoreCustomerWithHttpInfo(storeId, customerId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getStoreOrdersWithHttpInfo = function(storeId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        var pathParams = {
          "store_id": storeId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "customer_id": opts["customerId"] ? opts["customerId"] : opts["customer_id"],
          "has_outreach": opts["hasOutreach"] ? opts["hasOutreach"] : opts["has_outreach"],
          "campaign_id": opts["campaignId"] ? opts["campaignId"] : opts["campaign_id"],
          "outreach_id": opts["outreachId"] ? opts["outreachId"] : opts["outreach_id"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/orders",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getStoreOrders = function(storeId, opts) {
        return this.getStoreOrdersWithHttpInfo(storeId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getOrderWithHttpInfo = function(storeId, orderId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (orderId === void 0 || orderId === null) {
          throw new Error("Missing the required parameter 'orderId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "order_id": orderId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/orders/{order_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getOrder = function(storeId, orderId, opts) {
        return this.getOrderWithHttpInfo(storeId, orderId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getAllOrderLineItemsWithHttpInfo = function(storeId, orderId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (orderId === void 0 || orderId === null) {
          throw new Error("Missing the required parameter 'orderId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "order_id": orderId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/orders/{order_id}/lines",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getAllOrderLineItems = function(storeId, orderId, opts) {
        return this.getAllOrderLineItemsWithHttpInfo(storeId, orderId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getOrderLineItemWithHttpInfo = function(storeId, orderId, lineId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (orderId === void 0 || orderId === null) {
          throw new Error("Missing the required parameter 'orderId' when calling ");
        }
        if (lineId === void 0 || lineId === null) {
          throw new Error("Missing the required parameter 'lineId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "order_id": orderId,
          "line_id": lineId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/orders/{order_id}/lines/{line_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getOrderLineItem = function(storeId, orderId, lineId, opts) {
        return this.getOrderLineItemWithHttpInfo(storeId, orderId, lineId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getAllStoreProductsWithHttpInfo = function(storeId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        var pathParams = {
          "store_id": storeId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getAllStoreProducts = function(storeId, opts) {
        return this.getAllStoreProductsWithHttpInfo(storeId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getStoreProductWithHttpInfo = function(storeId, productId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (productId === void 0 || productId === null) {
          throw new Error("Missing the required parameter 'productId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "product_id": productId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products/{product_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getStoreProduct = function(storeId, productId, opts) {
        return this.getStoreProductWithHttpInfo(storeId, productId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getProductImagesWithHttpInfo = function(storeId, productId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (productId === void 0 || productId === null) {
          throw new Error("Missing the required parameter 'productId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "product_id": productId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products/{product_id}/images",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getProductImages = function(storeId, productId, opts) {
        return this.getProductImagesWithHttpInfo(storeId, productId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getProductImageWithHttpInfo = function(storeId, productId, imageId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (productId === void 0 || productId === null) {
          throw new Error("Missing the required parameter 'productId' when calling ");
        }
        if (imageId === void 0 || imageId === null) {
          throw new Error("Missing the required parameter 'imageId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "product_id": productId,
          "image_id": imageId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products/{product_id}/images/{image_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getProductImage = function(storeId, productId, imageId, opts) {
        return this.getProductImageWithHttpInfo(storeId, productId, imageId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getProductVariantsWithHttpInfo = function(storeId, productId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (productId === void 0 || productId === null) {
          throw new Error("Missing the required parameter 'productId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "product_id": productId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products/{product_id}/variants",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getProductVariants = function(storeId, productId, opts) {
        return this.getProductVariantsWithHttpInfo(storeId, productId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getProductVariantWithHttpInfo = function(storeId, productId, variantId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (productId === void 0 || productId === null) {
          throw new Error("Missing the required parameter 'productId' when calling ");
        }
        if (variantId === void 0 || variantId === null) {
          throw new Error("Missing the required parameter 'variantId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "product_id": productId,
          "variant_id": variantId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products/{product_id}/variants/{variant_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getProductVariant = function(storeId, productId, variantId, opts) {
        return this.getProductVariantWithHttpInfo(storeId, productId, variantId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getPromoCodesWithHttpInfo = function(promoRuleId, storeId, opts) {
        opts = opts || {};
        var postBody = null;
        if (promoRuleId === void 0 || promoRuleId === null) {
          throw new Error("Missing the required parameter 'promoRuleId' when calling ");
        }
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        var pathParams = {
          "promo_rule_id": promoRuleId,
          "store_id": storeId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}/promo-codes",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getPromoCodes = function(promoRuleId, storeId, opts) {
        return this.getPromoCodesWithHttpInfo(promoRuleId, storeId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getPromoCodeWithHttpInfo = function(storeId, promoRuleId, promoCodeId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (promoRuleId === void 0 || promoRuleId === null) {
          throw new Error("Missing the required parameter 'promoRuleId' when calling ");
        }
        if (promoCodeId === void 0 || promoCodeId === null) {
          throw new Error("Missing the required parameter 'promoCodeId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "promo_rule_id": promoRuleId,
          "promo_code_id": promoCodeId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}/promo-codes/{promo_code_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getPromoCode = function(storeId, promoRuleId, promoCodeId, opts) {
        return this.getPromoCodeWithHttpInfo(storeId, promoRuleId, promoCodeId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.listPromoRulesWithHttpInfo = function(storeId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        var pathParams = {
          "store_id": storeId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/promo-rules",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.listPromoRules = function(storeId, opts) {
        return this.listPromoRulesWithHttpInfo(storeId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getPromoRuleWithHttpInfo = function(storeId, promoRuleId, opts) {
        opts = opts || {};
        var postBody = null;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (promoRuleId === void 0 || promoRuleId === null) {
          throw new Error("Missing the required parameter 'promoRuleId' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "promo_rule_id": promoRuleId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getPromoRule = function(storeId, promoRuleId, opts) {
        return this.getPromoRuleWithHttpInfo(storeId, promoRuleId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateStoreWithHttpInfo = function(storeId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateStore = function(storeId, body) {
        return this.updateStoreWithHttpInfo(storeId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateStoreCartWithHttpInfo = function(storeId, cartId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (cartId === void 0 || cartId === null) {
          throw new Error("Missing the required parameter 'cartId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "cart_id": cartId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/carts/{cart_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateStoreCart = function(storeId, cartId, body) {
        return this.updateStoreCartWithHttpInfo(storeId, cartId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateCartLineItemWithHttpInfo = function(storeId, cartId, lineId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (cartId === void 0 || cartId === null) {
          throw new Error("Missing the required parameter 'cartId' when calling ");
        }
        if (lineId === void 0 || lineId === null) {
          throw new Error("Missing the required parameter 'lineId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "cart_id": cartId,
          "line_id": lineId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/carts/{cart_id}/lines/{line_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateCartLineItem = function(storeId, cartId, lineId, body) {
        return this.updateCartLineItemWithHttpInfo(storeId, cartId, lineId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateStoreCustomerWithHttpInfo = function(storeId, customerId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (customerId === void 0 || customerId === null) {
          throw new Error("Missing the required parameter 'customerId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "customer_id": customerId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/customers/{customer_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateStoreCustomer = function(storeId, customerId, body) {
        return this.updateStoreCustomerWithHttpInfo(storeId, customerId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateOrderWithHttpInfo = function(storeId, orderId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (orderId === void 0 || orderId === null) {
          throw new Error("Missing the required parameter 'orderId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "order_id": orderId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/orders/{order_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateOrder = function(storeId, orderId, body) {
        return this.updateOrderWithHttpInfo(storeId, orderId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateOrderLineItemWithHttpInfo = function(storeId, orderId, lineId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (orderId === void 0 || orderId === null) {
          throw new Error("Missing the required parameter 'orderId' when calling ");
        }
        if (lineId === void 0 || lineId === null) {
          throw new Error("Missing the required parameter 'lineId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "order_id": orderId,
          "line_id": lineId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/orders/{order_id}/lines/{line_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateOrderLineItem = function(storeId, orderId, lineId, body) {
        return this.updateOrderLineItemWithHttpInfo(storeId, orderId, lineId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateStoreProductWithHttpInfo = function(storeId, productId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (productId === void 0 || productId === null) {
          throw new Error("Missing the required parameter 'productId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "product_id": productId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products/{product_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateStoreProduct = function(storeId, productId, body) {
        return this.updateStoreProductWithHttpInfo(storeId, productId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateProductImageWithHttpInfo = function(storeId, productId, imageId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (productId === void 0 || productId === null) {
          throw new Error("Missing the required parameter 'productId' when calling ");
        }
        if (imageId === void 0 || imageId === null) {
          throw new Error("Missing the required parameter 'imageId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "product_id": productId,
          "image_id": imageId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products/{product_id}/images/{image_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateProductImage = function(storeId, productId, imageId, body) {
        return this.updateProductImageWithHttpInfo(storeId, productId, imageId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateProductVariantWithHttpInfo = function(storeId, productId, variantId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (productId === void 0 || productId === null) {
          throw new Error("Missing the required parameter 'productId' when calling ");
        }
        if (variantId === void 0 || variantId === null) {
          throw new Error("Missing the required parameter 'variantId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "product_id": productId,
          "variant_id": variantId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products/{product_id}/variants/{variant_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateProductVariant = function(storeId, productId, variantId, body) {
        return this.updateProductVariantWithHttpInfo(storeId, productId, variantId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updatePromoCodeWithHttpInfo = function(storeId, promoRuleId, promoCodeId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (promoRuleId === void 0 || promoRuleId === null) {
          throw new Error("Missing the required parameter 'promoRuleId' when calling ");
        }
        if (promoCodeId === void 0 || promoCodeId === null) {
          throw new Error("Missing the required parameter 'promoCodeId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "promo_rule_id": promoRuleId,
          "promo_code_id": promoCodeId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}/promo-codes/{promo_code_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updatePromoCode = function(storeId, promoRuleId, promoCodeId, body) {
        return this.updatePromoCodeWithHttpInfo(storeId, promoRuleId, promoCodeId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updatePromoRuleWithHttpInfo = function(storeId, promoRuleId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (promoRuleId === void 0 || promoRuleId === null) {
          throw new Error("Missing the required parameter 'promoRuleId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "promo_rule_id": promoRuleId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updatePromoRule = function(storeId, promoRuleId, body) {
        return this.updatePromoRuleWithHttpInfo(storeId, promoRuleId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addStoreWithHttpInfo = function(body) {
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addStore = function(body) {
        return this.addStoreWithHttpInfo(body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addStoreCartWithHttpInfo = function(storeId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/carts",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addStoreCart = function(storeId, body) {
        return this.addStoreCartWithHttpInfo(storeId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addCartLineItemWithHttpInfo = function(storeId, cartId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (cartId === void 0 || cartId === null) {
          throw new Error("Missing the required parameter 'cartId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "cart_id": cartId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/carts/{cart_id}/lines",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addCartLineItem = function(storeId, cartId, body) {
        return this.addCartLineItemWithHttpInfo(storeId, cartId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addStoreCustomerWithHttpInfo = function(storeId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/customers",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addStoreCustomer = function(storeId, body) {
        return this.addStoreCustomerWithHttpInfo(storeId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addStoreOrderWithHttpInfo = function(storeId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/orders",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addStoreOrder = function(storeId, body) {
        return this.addStoreOrderWithHttpInfo(storeId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addOrderLineItemWithHttpInfo = function(storeId, orderId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (orderId === void 0 || orderId === null) {
          throw new Error("Missing the required parameter 'orderId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "order_id": orderId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/orders/{order_id}/lines",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addOrderLineItem = function(storeId, orderId, body) {
        return this.addOrderLineItemWithHttpInfo(storeId, orderId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addStoreProductWithHttpInfo = function(storeId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addStoreProduct = function(storeId, body) {
        return this.addStoreProductWithHttpInfo(storeId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addProductImageWithHttpInfo = function(storeId, productId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (productId === void 0 || productId === null) {
          throw new Error("Missing the required parameter 'productId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "product_id": productId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products/{product_id}/images",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addProductImage = function(storeId, productId, body) {
        return this.addProductImageWithHttpInfo(storeId, productId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addProductVariantsWithHttpInfo = function(storeId, productId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (productId === void 0 || productId === null) {
          throw new Error("Missing the required parameter 'productId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "product_id": productId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products/{product_id}/variants",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addProductVariants = function(storeId, productId, body) {
        return this.addProductVariantsWithHttpInfo(storeId, productId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addPromoCodeWithHttpInfo = function(storeId, promoRuleId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (promoRuleId === void 0 || promoRuleId === null) {
          throw new Error("Missing the required parameter 'promoRuleId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "promo_rule_id": promoRuleId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}/promo-codes",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addPromoCode = function(storeId, promoRuleId, body) {
        return this.addPromoCodeWithHttpInfo(storeId, promoRuleId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addPromoRulesWithHttpInfo = function(storeId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/promo-rules",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addPromoRules = function(storeId, body) {
        return this.addPromoRulesWithHttpInfo(storeId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.setStoreCustomerWithHttpInfo = function(storeId, customerId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (customerId === void 0 || customerId === null) {
          throw new Error("Missing the required parameter 'customerId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "customer_id": customerId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/customers/{customer_id}",
          "PUT",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.setStoreCustomer = function(storeId, customerId, body) {
        return this.setStoreCustomerWithHttpInfo(storeId, customerId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addProductVariantWithHttpInfo = function(storeId, productId, variantId, body) {
        var postBody = body;
        if (storeId === void 0 || storeId === null) {
          throw new Error("Missing the required parameter 'storeId' when calling ");
        }
        if (productId === void 0 || productId === null) {
          throw new Error("Missing the required parameter 'productId' when calling ");
        }
        if (variantId === void 0 || variantId === null) {
          throw new Error("Missing the required parameter 'variantId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "store_id": storeId,
          "product_id": productId,
          "variant_id": variantId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ecommerce/stores/{store_id}/products/{product_id}/variants/{variant_id}",
          "PUT",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addProductVariant = function(storeId, productId, variantId, body) {
        return this.addProductVariantWithHttpInfo(storeId, productId, variantId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/FacebookAdsApi.js
var require_FacebookAdsApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/FacebookAdsApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.listWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "sort_field": opts["sortField"] ? opts["sortField"] : opts["sort_field"],
          "sort_dir": opts["sortDir"] ? opts["sortDir"] : opts["sort_dir"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/facebook-ads",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.list = function(opts) {
        return this.listWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getAdWithHttpInfo = function(outreachId, opts) {
        opts = opts || {};
        var postBody = null;
        if (outreachId === void 0 || outreachId === null) {
          throw new Error("Missing the required parameter 'outreachId' when calling ");
        }
        var pathParams = {
          "outreach_id": outreachId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/facebook-ads/{outreach_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getAd = function(outreachId, opts) {
        return this.getAdWithHttpInfo(outreachId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/FileManagerApi.js
var require_FileManagerApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/FileManagerApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.deleteFileWithHttpInfo = function(fileId) {
        var postBody = null;
        if (fileId === void 0 || fileId === null) {
          throw new Error("Missing the required parameter 'fileId' when calling ");
        }
        var pathParams = {
          "file_id": fileId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/file-manager/files/{file_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteFile = function(fileId) {
        return this.deleteFileWithHttpInfo(fileId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteFolderWithHttpInfo = function(folderId) {
        var postBody = null;
        if (folderId === void 0 || folderId === null) {
          throw new Error("Missing the required parameter 'folderId' when calling ");
        }
        var pathParams = {
          "folder_id": folderId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/file-manager/folders/{folder_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteFolder = function(folderId) {
        return this.deleteFolderWithHttpInfo(folderId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.filesWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "type": opts["type"] ? opts["type"] : opts["type"],
          "created_by": opts["createdBy"] ? opts["createdBy"] : opts["created_by"],
          "before_created_at": opts["beforeCreatedAt"] ? opts["beforeCreatedAt"] : opts["before_created_at"],
          "since_created_at": opts["sinceCreatedAt"] ? opts["sinceCreatedAt"] : opts["since_created_at"],
          "sort_field": opts["sortField"] ? opts["sortField"] : opts["sort_field"],
          "sort_dir": opts["sortDir"] ? opts["sortDir"] : opts["sort_dir"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/file-manager/files",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.files = function(opts) {
        return this.filesWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getFileWithHttpInfo = function(fileId, opts) {
        opts = opts || {};
        var postBody = null;
        if (fileId === void 0 || fileId === null) {
          throw new Error("Missing the required parameter 'fileId' when calling ");
        }
        var pathParams = {
          "file_id": fileId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/file-manager/files/{file_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getFile = function(fileId, opts) {
        return this.getFileWithHttpInfo(fileId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.listFoldersWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "created_by": opts["createdBy"] ? opts["createdBy"] : opts["created_by"],
          "before_created_at": opts["beforeCreatedAt"] ? opts["beforeCreatedAt"] : opts["before_created_at"],
          "since_created_at": opts["sinceCreatedAt"] ? opts["sinceCreatedAt"] : opts["since_created_at"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/file-manager/folders",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.listFolders = function(opts) {
        return this.listFoldersWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getFolderWithHttpInfo = function(folderId, opts) {
        opts = opts || {};
        var postBody = null;
        if (folderId === void 0 || folderId === null) {
          throw new Error("Missing the required parameter 'folderId' when calling ");
        }
        var pathParams = {
          "folder_id": folderId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/file-manager/folders/{folder_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getFolder = function(folderId, opts) {
        return this.getFolderWithHttpInfo(folderId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateFileWithHttpInfo = function(fileId, body) {
        var postBody = body;
        if (fileId === void 0 || fileId === null) {
          throw new Error("Missing the required parameter 'fileId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "file_id": fileId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/file-manager/files/{file_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateFile = function(fileId, body) {
        return this.updateFileWithHttpInfo(fileId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateFolderWithHttpInfo = function(folderId, body) {
        var postBody = body;
        if (folderId === void 0 || folderId === null) {
          throw new Error("Missing the required parameter 'folderId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "folder_id": folderId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/file-manager/folders/{folder_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateFolder = function(folderId, body) {
        return this.updateFolderWithHttpInfo(folderId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.uploadWithHttpInfo = function(body) {
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/file-manager/files",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.upload = function(body) {
        return this.uploadWithHttpInfo(body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createFolderWithHttpInfo = function(body) {
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/file-manager/folders",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.createFolder = function(body) {
        return this.createFolderWithHttpInfo(body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/LandingPagesApi.js
var require_LandingPagesApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/LandingPagesApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.deletePageWithHttpInfo = function(pageId) {
        var postBody = null;
        if (pageId === void 0 || pageId === null) {
          throw new Error("Missing the required parameter 'pageId' when calling ");
        }
        var pathParams = {
          "page_id": pageId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/landing-pages/{page_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deletePage = function(pageId) {
        return this.deletePageWithHttpInfo(pageId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getAllWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "sort_dir": opts["sortDir"] ? opts["sortDir"] : opts["sort_dir"],
          "sort_field": opts["sortField"] ? opts["sortField"] : opts["sort_field"],
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/landing-pages",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getAll = function(opts) {
        return this.getAllWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getPageWithHttpInfo = function(pageId, opts) {
        opts = opts || {};
        var postBody = null;
        if (pageId === void 0 || pageId === null) {
          throw new Error("Missing the required parameter 'pageId' when calling ");
        }
        var pathParams = {
          "page_id": pageId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/landing-pages/{page_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getPage = function(pageId, opts) {
        return this.getPageWithHttpInfo(pageId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getPageContentWithHttpInfo = function(pageId, opts) {
        opts = opts || {};
        var postBody = null;
        if (pageId === void 0 || pageId === null) {
          throw new Error("Missing the required parameter 'pageId' when calling ");
        }
        var pathParams = {
          "page_id": pageId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/landing-pages/{page_id}/content",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getPageContent = function(pageId, opts) {
        return this.getPageContentWithHttpInfo(pageId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updatePageWithHttpInfo = function(pageId, body) {
        var postBody = body;
        if (pageId === void 0 || pageId === null) {
          throw new Error("Missing the required parameter 'pageId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "page_id": pageId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/landing-pages/{page_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updatePage = function(pageId, body) {
        return this.updatePageWithHttpInfo(pageId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createWithHttpInfo = function(body, opts) {
        opts = opts || {};
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {};
        var queryParams = {
          "use_default_list": opts["useDefaultList"] ? opts["useDefaultList"] : opts["use_default_list"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/landing-pages",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.create = function(body, opts) {
        return this.createWithHttpInfo(body, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.publishPageWithHttpInfo = function(pageId) {
        var postBody = null;
        if (pageId === void 0 || pageId === null) {
          throw new Error("Missing the required parameter 'pageId' when calling ");
        }
        var pathParams = {
          "page_id": pageId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/landing-pages/{page_id}/actions/publish",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.publishPage = function(pageId) {
        return this.publishPageWithHttpInfo(pageId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.unpublishPageWithHttpInfo = function(pageId) {
        var postBody = null;
        if (pageId === void 0 || pageId === null) {
          throw new Error("Missing the required parameter 'pageId' when calling ");
        }
        var pathParams = {
          "page_id": pageId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/landing-pages/{page_id}/actions/unpublish",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.unpublishPage = function(pageId) {
        return this.unpublishPageWithHttpInfo(pageId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/ListsApi.js
var require_ListsApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/ListsApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.deleteListWithHttpInfo = function(listId) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteList = function(listId) {
        return this.deleteListWithHttpInfo(listId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteInterestCategoryWithHttpInfo = function(listId, interestCategoryId) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (interestCategoryId === void 0 || interestCategoryId === null) {
          throw new Error("Missing the required parameter 'interestCategoryId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "interest_category_id": interestCategoryId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/interest-categories/{interest_category_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteInterestCategory = function(listId, interestCategoryId) {
        return this.deleteInterestCategoryWithHttpInfo(listId, interestCategoryId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteInterestCategoryInterestWithHttpInfo = function(listId, interestCategoryId, interestId) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (interestCategoryId === void 0 || interestCategoryId === null) {
          throw new Error("Missing the required parameter 'interestCategoryId' when calling ");
        }
        if (interestId === void 0 || interestId === null) {
          throw new Error("Missing the required parameter 'interestId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "interest_category_id": interestCategoryId,
          "interest_id": interestId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/interest-categories/{interest_category_id}/interests/{interest_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteInterestCategoryInterest = function(listId, interestCategoryId, interestId) {
        return this.deleteInterestCategoryInterestWithHttpInfo(listId, interestCategoryId, interestId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteListMemberWithHttpInfo = function(listId, subscriberHash) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteListMember = function(listId, subscriberHash) {
        return this.deleteListMemberWithHttpInfo(listId, subscriberHash).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteListMemberNoteWithHttpInfo = function(listId, subscriberHash, noteId) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        if (noteId === void 0 || noteId === null) {
          throw new Error("Missing the required parameter 'noteId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash,
          "note_id": noteId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}/notes/{note_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteListMemberNote = function(listId, subscriberHash, noteId) {
        return this.deleteListMemberNoteWithHttpInfo(listId, subscriberHash, noteId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteListMergeFieldWithHttpInfo = function(listId, mergeId) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (mergeId === void 0 || mergeId === null) {
          throw new Error("Missing the required parameter 'mergeId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "merge_id": mergeId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/merge-fields/{merge_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteListMergeField = function(listId, mergeId) {
        return this.deleteListMergeFieldWithHttpInfo(listId, mergeId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteSegmentWithHttpInfo = function(listId, segmentId) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (segmentId === void 0 || segmentId === null) {
          throw new Error("Missing the required parameter 'segmentId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "segment_id": segmentId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/segments/{segment_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteSegment = function(listId, segmentId) {
        return this.deleteSegmentWithHttpInfo(listId, segmentId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.removeSegmentMemberWithHttpInfo = function(listId, segmentId, subscriberHash) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (segmentId === void 0 || segmentId === null) {
          throw new Error("Missing the required parameter 'segmentId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "segment_id": segmentId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/segments/{segment_id}/members/{subscriber_hash}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.removeSegmentMember = function(listId, segmentId, subscriberHash) {
        return this.removeSegmentMemberWithHttpInfo(listId, segmentId, subscriberHash).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteListWebhookWithHttpInfo = function(listId, webhookId) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (webhookId === void 0 || webhookId === null) {
          throw new Error("Missing the required parameter 'webhookId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "webhook_id": webhookId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/webhooks/{webhook_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteListWebhook = function(listId, webhookId) {
        return this.deleteListWebhookWithHttpInfo(listId, webhookId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListMemberTagsWithHttpInfo = function(listId, subscriberHash, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}/tags",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListMemberTags = function(listId, subscriberHash, opts) {
        return this.getListMemberTagsWithHttpInfo(listId, subscriberHash, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getAllListsWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "before_date_created": opts["beforeDateCreated"] ? opts["beforeDateCreated"] : opts["before_date_created"],
          "since_date_created": opts["sinceDateCreated"] ? opts["sinceDateCreated"] : opts["since_date_created"],
          "before_campaign_last_sent": opts["beforeCampaignLastSent"] ? opts["beforeCampaignLastSent"] : opts["before_campaign_last_sent"],
          "since_campaign_last_sent": opts["sinceCampaignLastSent"] ? opts["sinceCampaignLastSent"] : opts["since_campaign_last_sent"],
          "email": opts["email"] ? opts["email"] : opts["email"],
          "sort_field": opts["sortField"] ? opts["sortField"] : opts["sort_field"],
          "sort_dir": opts["sortDir"] ? opts["sortDir"] : opts["sort_dir"],
          "has_ecommerce_store": opts["hasEcommerceStore"] ? opts["hasEcommerceStore"] : opts["has_ecommerce_store"],
          "include_total_contacts": opts["includeTotalContacts"] ? opts["includeTotalContacts"] : opts["include_total_contacts"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getAllLists = function(opts) {
        return this.getAllListsWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListWithHttpInfo = function(listId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "include_total_contacts": opts["includeTotalContacts"] ? opts["includeTotalContacts"] : opts["include_total_contacts"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getList = function(listId, opts) {
        return this.getListWithHttpInfo(listId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListAbuseReportsWithHttpInfo = function(listId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/abuse-reports",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListAbuseReports = function(listId, opts) {
        return this.getListAbuseReportsWithHttpInfo(listId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListAbuseReportDetailsWithHttpInfo = function(listId, reportId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (reportId === void 0 || reportId === null) {
          throw new Error("Missing the required parameter 'reportId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "report_id": reportId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/abuse-reports/{report_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListAbuseReportDetails = function(listId, reportId, opts) {
        return this.getListAbuseReportDetailsWithHttpInfo(listId, reportId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListRecentActivityWithHttpInfo = function(listId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/activity",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListRecentActivity = function(listId, opts) {
        return this.getListRecentActivityWithHttpInfo(listId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListClientsWithHttpInfo = function(listId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/clients",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListClients = function(listId, opts) {
        return this.getListClientsWithHttpInfo(listId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListGrowthHistoryWithHttpInfo = function(listId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "sort_field": opts["sortField"] ? opts["sortField"] : opts["sort_field"],
          "sort_dir": opts["sortDir"] ? opts["sortDir"] : opts["sort_dir"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/growth-history",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListGrowthHistory = function(listId, opts) {
        return this.getListGrowthHistoryWithHttpInfo(listId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListGrowthHistoryByMonthWithHttpInfo = function(listId, month, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (month === void 0 || month === null) {
          throw new Error("Missing the required parameter 'month' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "month": month
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/growth-history/{month}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListGrowthHistoryByMonth = function(listId, month, opts) {
        return this.getListGrowthHistoryByMonthWithHttpInfo(listId, month, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListInterestCategoriesWithHttpInfo = function(listId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "type": opts["type"] ? opts["type"] : opts["type"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/interest-categories",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListInterestCategories = function(listId, opts) {
        return this.getListInterestCategoriesWithHttpInfo(listId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getInterestCategoryWithHttpInfo = function(listId, interestCategoryId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (interestCategoryId === void 0 || interestCategoryId === null) {
          throw new Error("Missing the required parameter 'interestCategoryId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "interest_category_id": interestCategoryId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/interest-categories/{interest_category_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getInterestCategory = function(listId, interestCategoryId, opts) {
        return this.getInterestCategoryWithHttpInfo(listId, interestCategoryId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.listInterestCategoryInterestsWithHttpInfo = function(listId, interestCategoryId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (interestCategoryId === void 0 || interestCategoryId === null) {
          throw new Error("Missing the required parameter 'interestCategoryId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "interest_category_id": interestCategoryId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/interest-categories/{interest_category_id}/interests",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.listInterestCategoryInterests = function(listId, interestCategoryId, opts) {
        return this.listInterestCategoryInterestsWithHttpInfo(listId, interestCategoryId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getInterestCategoryInterestWithHttpInfo = function(listId, interestCategoryId, interestId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (interestCategoryId === void 0 || interestCategoryId === null) {
          throw new Error("Missing the required parameter 'interestCategoryId' when calling ");
        }
        if (interestId === void 0 || interestId === null) {
          throw new Error("Missing the required parameter 'interestId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "interest_category_id": interestCategoryId,
          "interest_id": interestId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/interest-categories/{interest_category_id}/interests/{interest_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getInterestCategoryInterest = function(listId, interestCategoryId, interestId, opts) {
        return this.getInterestCategoryInterestWithHttpInfo(listId, interestCategoryId, interestId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListLocationsWithHttpInfo = function(listId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/locations",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListLocations = function(listId, opts) {
        return this.getListLocationsWithHttpInfo(listId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListMembersInfoWithHttpInfo = function(listId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "email_type": opts["emailType"] ? opts["emailType"] : opts["email_type"],
          "status": opts["status"] ? opts["status"] : opts["status"],
          "since_timestamp_opt": opts["sinceTimestampOpt"] ? opts["sinceTimestampOpt"] : opts["since_timestamp_opt"],
          "before_timestamp_opt": opts["beforeTimestampOpt"] ? opts["beforeTimestampOpt"] : opts["before_timestamp_opt"],
          "since_last_changed": opts["sinceLastChanged"] ? opts["sinceLastChanged"] : opts["since_last_changed"],
          "before_last_changed": opts["beforeLastChanged"] ? opts["beforeLastChanged"] : opts["before_last_changed"],
          "unique_email_id": opts["uniqueEmailId"] ? opts["uniqueEmailId"] : opts["unique_email_id"],
          "vip_only": opts["vipOnly"] ? opts["vipOnly"] : opts["vip_only"],
          "interest_category_id": opts["interestCategoryId"] ? opts["interestCategoryId"] : opts["interest_category_id"],
          "interest_ids": opts["interestIds"] ? opts["interestIds"] : opts["interest_ids"],
          "interest_match": opts["interestMatch"] ? opts["interestMatch"] : opts["interest_match"],
          "sort_field": opts["sortField"] ? opts["sortField"] : opts["sort_field"],
          "sort_dir": opts["sortDir"] ? opts["sortDir"] : opts["sort_dir"],
          "since_last_campaign": opts["sinceLastCampaign"] ? opts["sinceLastCampaign"] : opts["since_last_campaign"],
          "unsubscribed_since": opts["unsubscribedSince"] ? opts["unsubscribedSince"] : opts["unsubscribed_since"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListMembersInfo = function(listId, opts) {
        return this.getListMembersInfoWithHttpInfo(listId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListMemberWithHttpInfo = function(listId, subscriberHash, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListMember = function(listId, subscriberHash, opts) {
        return this.getListMemberWithHttpInfo(listId, subscriberHash, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListMemberActivityWithHttpInfo = function(listId, subscriberHash, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "action": this.apiClient.buildCollectionParam(opts["action"] ? opts["action"] : opts["action"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}/activity",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListMemberActivity = function(listId, subscriberHash, opts) {
        return this.getListMemberActivityWithHttpInfo(listId, subscriberHash, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListMemberActivityFeedWithHttpInfo = function(listId, subscriberHash, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "activity_filters": this.apiClient.buildCollectionParam(opts["activityFilters"] ? opts["activityFilters"] : opts["activity_filters"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}/activity-feed",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListMemberActivityFeed = function(listId, subscriberHash, opts) {
        return this.getListMemberActivityFeedWithHttpInfo(listId, subscriberHash, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListMemberEventsWithHttpInfo = function(listId, subscriberHash, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}/events",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListMemberEvents = function(listId, subscriberHash, opts) {
        return this.getListMemberEventsWithHttpInfo(listId, subscriberHash, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListMemberGoalsWithHttpInfo = function(listId, subscriberHash, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}/goals",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListMemberGoals = function(listId, subscriberHash, opts) {
        return this.getListMemberGoalsWithHttpInfo(listId, subscriberHash, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListMemberNotesWithHttpInfo = function(listId, subscriberHash, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {
          "sort_field": opts["sortField"] ? opts["sortField"] : opts["sort_field"],
          "sort_dir": opts["sortDir"] ? opts["sortDir"] : opts["sort_dir"],
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}/notes",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListMemberNotes = function(listId, subscriberHash, opts) {
        return this.getListMemberNotesWithHttpInfo(listId, subscriberHash, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListMemberNoteWithHttpInfo = function(listId, subscriberHash, noteId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        if (noteId === void 0 || noteId === null) {
          throw new Error("Missing the required parameter 'noteId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash,
          "note_id": noteId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}/notes/{note_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListMemberNote = function(listId, subscriberHash, noteId, opts) {
        return this.getListMemberNoteWithHttpInfo(listId, subscriberHash, noteId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListMergeFieldsWithHttpInfo = function(listId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "type": opts["type"] ? opts["type"] : opts["type"],
          "required": opts["required"] ? opts["required"] : opts["required"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/merge-fields",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListMergeFields = function(listId, opts) {
        return this.getListMergeFieldsWithHttpInfo(listId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListMergeFieldWithHttpInfo = function(listId, mergeId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (mergeId === void 0 || mergeId === null) {
          throw new Error("Missing the required parameter 'mergeId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "merge_id": mergeId
        };
        var queryParams = {
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/merge-fields/{merge_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListMergeField = function(listId, mergeId, opts) {
        return this.getListMergeFieldWithHttpInfo(listId, mergeId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getSegmentWithHttpInfo = function(listId, segmentId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (segmentId === void 0 || segmentId === null) {
          throw new Error("Missing the required parameter 'segmentId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "segment_id": segmentId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "include_cleaned": opts["includeCleaned"] ? opts["includeCleaned"] : opts["include_cleaned"],
          "include_transactional": opts["includeTransactional"] ? opts["includeTransactional"] : opts["include_transactional"],
          "include_unsubscribed": opts["includeUnsubscribed"] ? opts["includeUnsubscribed"] : opts["include_unsubscribed"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/segments/{segment_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getSegment = function(listId, segmentId, opts) {
        return this.getSegmentWithHttpInfo(listId, segmentId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getSegmentMembersListWithHttpInfo = function(listId, segmentId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (segmentId === void 0 || segmentId === null) {
          throw new Error("Missing the required parameter 'segmentId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "segment_id": segmentId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "include_cleaned": opts["includeCleaned"] ? opts["includeCleaned"] : opts["include_cleaned"],
          "include_transactional": opts["includeTransactional"] ? opts["includeTransactional"] : opts["include_transactional"],
          "include_unsubscribed": opts["includeUnsubscribed"] ? opts["includeUnsubscribed"] : opts["include_unsubscribed"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/segments/{segment_id}/members",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getSegmentMembersList = function(listId, segmentId, opts) {
        return this.getSegmentMembersListWithHttpInfo(listId, segmentId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListSignupFormsWithHttpInfo = function(listId) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/signup-forms",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListSignupForms = function(listId) {
        return this.getListSignupFormsWithHttpInfo(listId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getAllSurveysForListWithHttpInfo = function(listId) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/surveys",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getAllSurveysForList = function(listId) {
        return this.getAllSurveysForListWithHttpInfo(listId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getSurveyWithHttpInfo = function(listId, surveyId) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (surveyId === void 0 || surveyId === null) {
          throw new Error("Missing the required parameter 'surveyId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "survey_id": surveyId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/surveys/{survey_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getSurvey = function(listId, surveyId) {
        return this.getSurveyWithHttpInfo(listId, surveyId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListWebhooksWithHttpInfo = function(listId) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/webhooks",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListWebhooks = function(listId) {
        return this.getListWebhooksWithHttpInfo(listId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getListWebhookWithHttpInfo = function(listId, webhookId) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (webhookId === void 0 || webhookId === null) {
          throw new Error("Missing the required parameter 'webhookId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "webhook_id": webhookId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/webhooks/{webhook_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getListWebhook = function(listId, webhookId) {
        return this.getListWebhookWithHttpInfo(listId, webhookId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateListWithHttpInfo = function(listId, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateList = function(listId, body) {
        return this.updateListWithHttpInfo(listId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateInterestCategoryWithHttpInfo = function(listId, interestCategoryId, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (interestCategoryId === void 0 || interestCategoryId === null) {
          throw new Error("Missing the required parameter 'interestCategoryId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "interest_category_id": interestCategoryId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/interest-categories/{interest_category_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateInterestCategory = function(listId, interestCategoryId, body) {
        return this.updateInterestCategoryWithHttpInfo(listId, interestCategoryId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateInterestCategoryInterestWithHttpInfo = function(listId, interestCategoryId, interestId, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (interestCategoryId === void 0 || interestCategoryId === null) {
          throw new Error("Missing the required parameter 'interestCategoryId' when calling ");
        }
        if (interestId === void 0 || interestId === null) {
          throw new Error("Missing the required parameter 'interestId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "interest_category_id": interestCategoryId,
          "interest_id": interestId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/interest-categories/{interest_category_id}/interests/{interest_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateInterestCategoryInterest = function(listId, interestCategoryId, interestId, body) {
        return this.updateInterestCategoryInterestWithHttpInfo(listId, interestCategoryId, interestId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateListMemberWithHttpInfo = function(listId, subscriberHash, body, opts) {
        opts = opts || {};
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {
          "skip_merge_validation": opts["skipMergeValidation"] ? opts["skipMergeValidation"] : opts["skip_merge_validation"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateListMember = function(listId, subscriberHash, body, opts) {
        return this.updateListMemberWithHttpInfo(listId, subscriberHash, body, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateListMemberNoteWithHttpInfo = function(listId, subscriberHash, noteId, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        if (noteId === void 0 || noteId === null) {
          throw new Error("Missing the required parameter 'noteId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash,
          "note_id": noteId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}/notes/{note_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateListMemberNote = function(listId, subscriberHash, noteId, body) {
        return this.updateListMemberNoteWithHttpInfo(listId, subscriberHash, noteId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateListMergeFieldWithHttpInfo = function(listId, mergeId, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (mergeId === void 0 || mergeId === null) {
          throw new Error("Missing the required parameter 'mergeId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "merge_id": mergeId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/merge-fields/{merge_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateListMergeField = function(listId, mergeId, body) {
        return this.updateListMergeFieldWithHttpInfo(listId, mergeId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateSegmentWithHttpInfo = function(listId, segmentId, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (segmentId === void 0 || segmentId === null) {
          throw new Error("Missing the required parameter 'segmentId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "segment_id": segmentId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/segments/{segment_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateSegment = function(listId, segmentId, body) {
        return this.updateSegmentWithHttpInfo(listId, segmentId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateListWebhookWithHttpInfo = function(listId, webhookId, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (webhookId === void 0 || webhookId === null) {
          throw new Error("Missing the required parameter 'webhookId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "webhook_id": webhookId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/webhooks/{webhook_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateListWebhook = function(listId, webhookId, body) {
        return this.updateListWebhookWithHttpInfo(listId, webhookId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createListMemberEventWithHttpInfo = function(listId, subscriberHash, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}/events",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.createListMemberEvent = function(listId, subscriberHash, body) {
        return this.createListMemberEventWithHttpInfo(listId, subscriberHash, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateListMemberTagsWithHttpInfo = function(listId, subscriberHash, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}/tags",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateListMemberTags = function(listId, subscriberHash, body) {
        return this.updateListMemberTagsWithHttpInfo(listId, subscriberHash, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createListWithHttpInfo = function(body) {
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.createList = function(body) {
        return this.createListWithHttpInfo(body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.batchListMembersWithHttpInfo = function(listId, body, opts) {
        opts = opts || {};
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {
          "skip_merge_validation": opts["skipMergeValidation"] ? opts["skipMergeValidation"] : opts["skip_merge_validation"],
          "skip_duplicate_check": opts["skipDuplicateCheck"] ? opts["skipDuplicateCheck"] : opts["skip_duplicate_check"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.batchListMembers = function(listId, body, opts) {
        return this.batchListMembersWithHttpInfo(listId, body, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createListInterestCategoryWithHttpInfo = function(listId, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/interest-categories",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.createListInterestCategory = function(listId, body) {
        return this.createListInterestCategoryWithHttpInfo(listId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createInterestCategoryInterestWithHttpInfo = function(listId, interestCategoryId, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (interestCategoryId === void 0 || interestCategoryId === null) {
          throw new Error("Missing the required parameter 'interestCategoryId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "interest_category_id": interestCategoryId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/interest-categories/{interest_category_id}/interests",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.createInterestCategoryInterest = function(listId, interestCategoryId, body) {
        return this.createInterestCategoryInterestWithHttpInfo(listId, interestCategoryId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addListMemberWithHttpInfo = function(listId, body, opts) {
        opts = opts || {};
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {
          "skip_merge_validation": opts["skipMergeValidation"] ? opts["skipMergeValidation"] : opts["skip_merge_validation"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addListMember = function(listId, body, opts) {
        return this.addListMemberWithHttpInfo(listId, body, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteListMemberPermanentWithHttpInfo = function(listId, subscriberHash) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}/actions/delete-permanent",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteListMemberPermanent = function(listId, subscriberHash) {
        return this.deleteListMemberPermanentWithHttpInfo(listId, subscriberHash).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createListMemberNoteWithHttpInfo = function(listId, subscriberHash, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}/notes",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.createListMemberNote = function(listId, subscriberHash, body) {
        return this.createListMemberNoteWithHttpInfo(listId, subscriberHash, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.addListMergeFieldWithHttpInfo = function(listId, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/merge-fields",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.addListMergeField = function(listId, body) {
        return this.addListMergeFieldWithHttpInfo(listId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createSegmentWithHttpInfo = function(listId, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/segments",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.createSegment = function(listId, body) {
        return this.createSegmentWithHttpInfo(listId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.batchSegmentMembersWithHttpInfo = function(body, listId, segmentId) {
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (segmentId === void 0 || segmentId === null) {
          throw new Error("Missing the required parameter 'segmentId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "segment_id": segmentId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/segments/{segment_id}",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.batchSegmentMembers = function(body, listId, segmentId) {
        return this.batchSegmentMembersWithHttpInfo(body, listId, segmentId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createSegmentMemberWithHttpInfo = function(listId, segmentId, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (segmentId === void 0 || segmentId === null) {
          throw new Error("Missing the required parameter 'segmentId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "segment_id": segmentId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/segments/{segment_id}/members",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.createSegmentMember = function(listId, segmentId, body) {
        return this.createSegmentMemberWithHttpInfo(listId, segmentId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateListSignupFormWithHttpInfo = function(listId, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/signup-forms",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateListSignupForm = function(listId, body) {
        return this.updateListSignupFormWithHttpInfo(listId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createListWebhookWithHttpInfo = function(listId, body) {
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/webhooks",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.createListWebhook = function(listId, body) {
        return this.createListWebhookWithHttpInfo(listId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.listSegmentsWithHttpInfo = function(listId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "type": opts["type"] ? opts["type"] : opts["type"],
          "since_created_at": opts["sinceCreatedAt"] ? opts["sinceCreatedAt"] : opts["since_created_at"],
          "before_created_at": opts["beforeCreatedAt"] ? opts["beforeCreatedAt"] : opts["before_created_at"],
          "include_cleaned": opts["includeCleaned"] ? opts["includeCleaned"] : opts["include_cleaned"],
          "include_transactional": opts["includeTransactional"] ? opts["includeTransactional"] : opts["include_transactional"],
          "include_unsubscribed": opts["includeUnsubscribed"] ? opts["includeUnsubscribed"] : opts["include_unsubscribed"],
          "since_updated_at": opts["sinceUpdatedAt"] ? opts["sinceUpdatedAt"] : opts["since_updated_at"],
          "before_updated_at": opts["beforeUpdatedAt"] ? opts["beforeUpdatedAt"] : opts["before_updated_at"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/segments",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.listSegments = function(listId, opts) {
        return this.listSegmentsWithHttpInfo(listId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.setListMemberWithHttpInfo = function(listId, subscriberHash, body, opts) {
        opts = opts || {};
        var postBody = body;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {
          "skip_merge_validation": opts["skipMergeValidation"] ? opts["skipMergeValidation"] : opts["skip_merge_validation"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/members/{subscriber_hash}",
          "PUT",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.setListMember = function(listId, subscriberHash, body, opts) {
        return this.setListMemberWithHttpInfo(listId, subscriberHash, body, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.tagSearchWithHttpInfo = function(listId, opts) {
        opts = opts || {};
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        var pathParams = {
          "list_id": listId
        };
        var queryParams = {
          "name": opts["name"] ? opts["name"] : opts["name"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/tag-search",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.tagSearch = function(listId, opts) {
        return this.tagSearchWithHttpInfo(listId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/PingApi.js
var require_PingApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/PingApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.getWithHttpInfo = function() {
        var postBody = null;
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/ping",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.get = function() {
        return this.getWithHttpInfo().then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/ReportingApi.js
var require_ReportingApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/ReportingApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.getFacebookAdsReportAllWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "sort_field": opts["sortField"] ? opts["sortField"] : opts["sort_field"],
          "sort_dir": opts["sortDir"] ? opts["sortDir"] : opts["sort_dir"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reporting/facebook-ads",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getFacebookAdsReportAll = function(opts) {
        return this.getFacebookAdsReportAllWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getFacebookAdReportWithHttpInfo = function(outreachId, opts) {
        opts = opts || {};
        var postBody = null;
        if (outreachId === void 0 || outreachId === null) {
          throw new Error("Missing the required parameter 'outreachId' when calling ");
        }
        var pathParams = {
          "outreach_id": outreachId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reporting/facebook-ads/{outreach_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getFacebookAdReport = function(outreachId, opts) {
        return this.getFacebookAdReportWithHttpInfo(outreachId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getFacebookAdProductActivityReportWithHttpInfo = function(outreachId, opts) {
        opts = opts || {};
        var postBody = null;
        if (outreachId === void 0 || outreachId === null) {
          throw new Error("Missing the required parameter 'outreachId' when calling ");
        }
        var pathParams = {
          "outreach_id": outreachId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "sort_field": opts["sortField"] ? opts["sortField"] : opts["sort_field"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reporting/facebook-ads/{outreach_id}/ecommerce-product-activity",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getFacebookAdProductActivityReport = function(outreachId, opts) {
        return this.getFacebookAdProductActivityReportWithHttpInfo(outreachId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getLandingPageReportsAllWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reporting/landing-pages",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getLandingPageReportsAll = function(opts) {
        return this.getLandingPageReportsAllWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getLandingPageReportWithHttpInfo = function(outreachId, opts) {
        opts = opts || {};
        var postBody = null;
        if (outreachId === void 0 || outreachId === null) {
          throw new Error("Missing the required parameter 'outreachId' when calling ");
        }
        var pathParams = {
          "outreach_id": outreachId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reporting/landing-pages/{outreach_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getLandingPageReport = function(outreachId, opts) {
        return this.getLandingPageReportWithHttpInfo(outreachId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getSurveyReportsAllWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reporting/surveys",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getSurveyReportsAll = function(opts) {
        return this.getSurveyReportsAllWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getSurveyReportWithHttpInfo = function(outreachId, opts) {
        opts = opts || {};
        var postBody = null;
        if (outreachId === void 0 || outreachId === null) {
          throw new Error("Missing the required parameter 'outreachId' when calling ");
        }
        var pathParams = {
          "outreach_id": outreachId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reporting/surveys/{outreach_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getSurveyReport = function(outreachId, opts) {
        return this.getSurveyReportWithHttpInfo(outreachId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getSurveyQuestionReportsAllWithHttpInfo = function(outreachId, opts) {
        opts = opts || {};
        var postBody = null;
        if (outreachId === void 0 || outreachId === null) {
          throw new Error("Missing the required parameter 'outreachId' when calling ");
        }
        var pathParams = {
          "outreach_id": outreachId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reporting/surveys/{outreach_id}/questions",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getSurveyQuestionReportsAll = function(outreachId, opts) {
        return this.getSurveyQuestionReportsAllWithHttpInfo(outreachId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getSurveyQuestionReportWithHttpInfo = function(outreachId, questionId, opts) {
        opts = opts || {};
        var postBody = null;
        if (outreachId === void 0 || outreachId === null) {
          throw new Error("Missing the required parameter 'outreachId' when calling ");
        }
        if (questionId === void 0 || questionId === null) {
          throw new Error("Missing the required parameter 'questionId' when calling ");
        }
        var pathParams = {
          "outreach_id": outreachId,
          "question_id": questionId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reporting/surveys/{outreach_id}/questions/{question_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getSurveyQuestionReport = function(outreachId, questionId, opts) {
        return this.getSurveyQuestionReportWithHttpInfo(outreachId, questionId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getSurveyQuestionAnswersWithHttpInfo = function(outreachId, questionId, opts) {
        opts = opts || {};
        var postBody = null;
        if (outreachId === void 0 || outreachId === null) {
          throw new Error("Missing the required parameter 'outreachId' when calling ");
        }
        if (questionId === void 0 || questionId === null) {
          throw new Error("Missing the required parameter 'questionId' when calling ");
        }
        var pathParams = {
          "outreach_id": outreachId,
          "question_id": questionId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "respondent_familiarity_is": opts["respondentFamiliarityIs"] ? opts["respondentFamiliarityIs"] : opts["respondent_familiarity_is"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reporting/surveys/{outreach_id}/questions/{question_id}/answers",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getSurveyQuestionAnswers = function(outreachId, questionId, opts) {
        return this.getSurveyQuestionAnswersWithHttpInfo(outreachId, questionId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getSurveyResponsesAllWithHttpInfo = function(outreachId, opts) {
        opts = opts || {};
        var postBody = null;
        if (outreachId === void 0 || outreachId === null) {
          throw new Error("Missing the required parameter 'outreachId' when calling ");
        }
        var pathParams = {
          "outreach_id": outreachId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "answered_question": opts["answeredQuestion"] ? opts["answeredQuestion"] : opts["answered_question"],
          "chose_answer": opts["choseAnswer"] ? opts["choseAnswer"] : opts["chose_answer"],
          "respondent_familiarity_is": opts["respondentFamiliarityIs"] ? opts["respondentFamiliarityIs"] : opts["respondent_familiarity_is"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reporting/surveys/{outreach_id}/responses",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getSurveyResponsesAll = function(outreachId, opts) {
        return this.getSurveyResponsesAllWithHttpInfo(outreachId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getSurveyResponseWithHttpInfo = function(outreachId, responseId) {
        var postBody = null;
        if (outreachId === void 0 || outreachId === null) {
          throw new Error("Missing the required parameter 'outreachId' when calling ");
        }
        if (responseId === void 0 || responseId === null) {
          throw new Error("Missing the required parameter 'responseId' when calling ");
        }
        var pathParams = {
          "outreach_id": outreachId,
          "response_id": responseId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reporting/surveys/{outreach_id}/responses/{response_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getSurveyResponse = function(outreachId, responseId) {
        return this.getSurveyResponseWithHttpInfo(outreachId, responseId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/ReportsApi.js
var require_ReportsApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/ReportsApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.getAllCampaignReportsWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "type": opts["type"] ? opts["type"] : opts["type"],
          "before_send_time": opts["beforeSendTime"] ? opts["beforeSendTime"] : opts["before_send_time"],
          "since_send_time": opts["sinceSendTime"] ? opts["sinceSendTime"] : opts["since_send_time"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getAllCampaignReports = function(opts) {
        return this.getAllCampaignReportsWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getCampaignReportWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getCampaignReport = function(campaignId, opts) {
        return this.getCampaignReportWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getCampaignAbuseReportsWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/abuse-reports",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getCampaignAbuseReports = function(campaignId, opts) {
        return this.getCampaignAbuseReportsWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getCampaignAbuseReportWithHttpInfo = function(campaignId, reportId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (reportId === void 0 || reportId === null) {
          throw new Error("Missing the required parameter 'reportId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId,
          "report_id": reportId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/abuse-reports/{report_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getCampaignAbuseReport = function(campaignId, reportId, opts) {
        return this.getCampaignAbuseReportWithHttpInfo(campaignId, reportId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getCampaignAdviceWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/advice",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getCampaignAdvice = function(campaignId, opts) {
        return this.getCampaignAdviceWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getCampaignClickDetailsWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/click-details",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getCampaignClickDetails = function(campaignId, opts) {
        return this.getCampaignClickDetailsWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getCampaignClickDetailsForLinkWithHttpInfo = function(campaignId, linkId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (linkId === void 0 || linkId === null) {
          throw new Error("Missing the required parameter 'linkId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId,
          "link_id": linkId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/click-details/{link_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getCampaignClickDetailsForLink = function(campaignId, linkId, opts) {
        return this.getCampaignClickDetailsForLinkWithHttpInfo(campaignId, linkId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getSubscribersInfoWithHttpInfo = function(campaignId, linkId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (linkId === void 0 || linkId === null) {
          throw new Error("Missing the required parameter 'linkId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId,
          "link_id": linkId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/click-details/{link_id}/members",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getSubscribersInfo = function(campaignId, linkId, opts) {
        return this.getSubscribersInfoWithHttpInfo(campaignId, linkId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getSubscriberInfoWithHttpInfo = function(campaignId, linkId, subscriberHash, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (linkId === void 0 || linkId === null) {
          throw new Error("Missing the required parameter 'linkId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId,
          "link_id": linkId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/click-details/{link_id}/members/{subscriber_hash}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getSubscriberInfo = function(campaignId, linkId, subscriberHash, opts) {
        return this.getSubscriberInfoWithHttpInfo(campaignId, linkId, subscriberHash, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getDomainPerformanceForCampaignWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/domain-performance",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getDomainPerformanceForCampaign = function(campaignId, opts) {
        return this.getDomainPerformanceForCampaignWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getEcommerceProductActivityForCampaignWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "sort_field": opts["sortField"] ? opts["sortField"] : opts["sort_field"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/ecommerce-product-activity",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getEcommerceProductActivityForCampaign = function(campaignId, opts) {
        return this.getEcommerceProductActivityForCampaignWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getEepurlActivityForCampaignWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/eepurl",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getEepurlActivityForCampaign = function(campaignId, opts) {
        return this.getEepurlActivityForCampaignWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getEmailActivityForCampaignWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "since": opts["since"] ? opts["since"] : opts["since"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/email-activity",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getEmailActivityForCampaign = function(campaignId, opts) {
        return this.getEmailActivityForCampaignWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getEmailActivityForSubscriberWithHttpInfo = function(campaignId, subscriberHash, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "since": opts["since"] ? opts["since"] : opts["since"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/email-activity/{subscriber_hash}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getEmailActivityForSubscriber = function(campaignId, subscriberHash, opts) {
        return this.getEmailActivityForSubscriberWithHttpInfo(campaignId, subscriberHash, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getLocationsForCampaignWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/locations",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getLocationsForCampaign = function(campaignId, opts) {
        return this.getLocationsForCampaignWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getCampaignOpenDetailsWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "since": opts["since"] ? opts["since"] : opts["since"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/open-details",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getCampaignOpenDetails = function(campaignId, opts) {
        return this.getCampaignOpenDetailsWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getSubscriberInfoForOpenedCampaignWithHttpInfo = function(campaignId, subscriberHash, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/open-details/{subscriber_hash}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getSubscriberInfoForOpenedCampaign = function(campaignId, subscriberHash, opts) {
        return this.getSubscriberInfoForOpenedCampaignWithHttpInfo(campaignId, subscriberHash, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getCampaignRecipientsWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/sent-to",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getCampaignRecipients = function(campaignId, opts) {
        return this.getCampaignRecipientsWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getCampaignRecipientWithHttpInfo = function(campaignId, subscriberHash, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/sent-to/{subscriber_hash}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getCampaignRecipient = function(campaignId, subscriberHash, opts) {
        return this.getCampaignRecipientWithHttpInfo(campaignId, subscriberHash, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getSubReportsForCampaignWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/sub-reports",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getSubReportsForCampaign = function(campaignId, opts) {
        return this.getSubReportsForCampaignWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getUnsubscribedListForCampaignWithHttpInfo = function(campaignId, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/unsubscribed",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getUnsubscribedListForCampaign = function(campaignId, opts) {
        return this.getUnsubscribedListForCampaignWithHttpInfo(campaignId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getUnsubscribedListMemberWithHttpInfo = function(campaignId, subscriberHash, opts) {
        opts = opts || {};
        var postBody = null;
        if (campaignId === void 0 || campaignId === null) {
          throw new Error("Missing the required parameter 'campaignId' when calling ");
        }
        if (subscriberHash === void 0 || subscriberHash === null) {
          throw new Error("Missing the required parameter 'subscriberHash' when calling ");
        }
        var pathParams = {
          "campaign_id": campaignId,
          "subscriber_hash": subscriberHash
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/reports/{campaign_id}/unsubscribed/{subscriber_hash}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getUnsubscribedListMember = function(campaignId, subscriberHash, opts) {
        return this.getUnsubscribedListMemberWithHttpInfo(campaignId, subscriberHash, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/RootApi.js
var require_RootApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/RootApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.getRootWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getRoot = function(opts) {
        return this.getRootWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/SearchCampaignsApi.js
var require_SearchCampaignsApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/SearchCampaignsApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.searchWithHttpInfo = function(query, opts) {
        opts = opts || {};
        var postBody = null;
        if (query === void 0 || query === null) {
          throw new Error("Missing the required parameter 'query' when calling ");
        }
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "query": query
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/search-campaigns",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.search = function(query, opts) {
        return this.searchWithHttpInfo(query, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/SearchMembersApi.js
var require_SearchMembersApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/SearchMembersApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.searchWithHttpInfo = function(query, opts) {
        opts = opts || {};
        var postBody = null;
        if (query === void 0 || query === null) {
          throw new Error("Missing the required parameter 'query' when calling ");
        }
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "query": query,
          "list_id": opts["listId"] ? opts["listId"] : opts["list_id"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/search-members",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.search = function(query, opts) {
        return this.searchWithHttpInfo(query, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/SurveysApi.js
var require_SurveysApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/SurveysApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.publishSurveyWithHttpInfo = function(listId, surveyId) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (surveyId === void 0 || surveyId === null) {
          throw new Error("Missing the required parameter 'surveyId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "survey_id": surveyId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/surveys/{survey_id}/actions/publish",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.publishSurvey = function(listId, surveyId) {
        return this.publishSurveyWithHttpInfo(listId, surveyId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.unpublishSurveyWithHttpInfo = function(listId, surveyId) {
        var postBody = null;
        if (listId === void 0 || listId === null) {
          throw new Error("Missing the required parameter 'listId' when calling ");
        }
        if (surveyId === void 0 || surveyId === null) {
          throw new Error("Missing the required parameter 'surveyId' when calling ");
        }
        var pathParams = {
          "list_id": listId,
          "survey_id": surveyId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/lists/{list_id}/surveys/{survey_id}/actions/unpublish",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.unpublishSurvey = function(listId, surveyId) {
        return this.unpublishSurveyWithHttpInfo(listId, surveyId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/TemplateFoldersApi.js
var require_TemplateFoldersApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/TemplateFoldersApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.removeWithHttpInfo = function(folderId) {
        var postBody = null;
        if (folderId === void 0 || folderId === null) {
          throw new Error("Missing the required parameter 'folderId' when calling ");
        }
        var pathParams = {
          "folder_id": folderId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/template-folders/{folder_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.remove = function(folderId) {
        return this.removeWithHttpInfo(folderId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.listWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/template-folders",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.list = function(opts) {
        return this.listWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getWithHttpInfo = function(folderId, opts) {
        opts = opts || {};
        var postBody = null;
        if (folderId === void 0 || folderId === null) {
          throw new Error("Missing the required parameter 'folderId' when calling ");
        }
        var pathParams = {
          "folder_id": folderId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/template-folders/{folder_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.get = function(folderId, opts) {
        return this.getWithHttpInfo(folderId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateWithHttpInfo = function(folderId, body) {
        var postBody = body;
        if (folderId === void 0 || folderId === null) {
          throw new Error("Missing the required parameter 'folderId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "folder_id": folderId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/template-folders/{folder_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.update = function(folderId, body) {
        return this.updateWithHttpInfo(folderId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createWithHttpInfo = function(body) {
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/template-folders",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.create = function(body) {
        return this.createWithHttpInfo(body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/TemplatesApi.js
var require_TemplatesApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/TemplatesApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.deleteTemplateWithHttpInfo = function(templateId) {
        var postBody = null;
        if (templateId === void 0 || templateId === null) {
          throw new Error("Missing the required parameter 'templateId' when calling ");
        }
        var pathParams = {
          "template_id": templateId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/templates/{template_id}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteTemplate = function(templateId) {
        return this.deleteTemplateWithHttpInfo(templateId).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.listWithHttpInfo = function(opts) {
        opts = opts || {};
        var postBody = null;
        var pathParams = {};
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv"),
          "count": opts["count"] ? opts["count"] : opts["count"],
          "offset": opts["offset"] ? opts["offset"] : opts["offset"],
          "created_by": opts["createdBy"] ? opts["createdBy"] : opts["created_by"],
          "since_date_created": opts["sinceDateCreated"] ? opts["sinceDateCreated"] : opts["since_date_created"],
          "before_date_created": opts["beforeDateCreated"] ? opts["beforeDateCreated"] : opts["before_date_created"],
          "type": opts["type"] ? opts["type"] : opts["type"],
          "category": opts["category"] ? opts["category"] : opts["category"],
          "folder_id": opts["folderId"] ? opts["folderId"] : opts["folder_id"],
          "sort_field": opts["sortField"] ? opts["sortField"] : opts["sort_field"],
          "sort_dir": opts["sortDir"] ? opts["sortDir"] : opts["sort_dir"]
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/templates",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.list = function(opts) {
        return this.listWithHttpInfo(opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getTemplateWithHttpInfo = function(templateId, opts) {
        opts = opts || {};
        var postBody = null;
        if (templateId === void 0 || templateId === null) {
          throw new Error("Missing the required parameter 'templateId' when calling ");
        }
        var pathParams = {
          "template_id": templateId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/templates/{template_id}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getTemplate = function(templateId, opts) {
        return this.getTemplateWithHttpInfo(templateId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getDefaultContentForTemplateWithHttpInfo = function(templateId, opts) {
        opts = opts || {};
        var postBody = null;
        if (templateId === void 0 || templateId === null) {
          throw new Error("Missing the required parameter 'templateId' when calling ");
        }
        var pathParams = {
          "template_id": templateId
        };
        var queryParams = {
          "fields": this.apiClient.buildCollectionParam(opts["fields"] ? opts["fields"] : opts["fields"], "csv"),
          "exclude_fields": this.apiClient.buildCollectionParam(opts["excludeFields"] ? opts["excludeFields"] : opts["exclude_fields"], "csv")
        };
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/templates/{template_id}/default-content",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getDefaultContentForTemplate = function(templateId, opts) {
        return this.getDefaultContentForTemplateWithHttpInfo(templateId, opts).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.updateTemplateWithHttpInfo = function(templateId, body) {
        var postBody = body;
        if (templateId === void 0 || templateId === null) {
          throw new Error("Missing the required parameter 'templateId' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "template_id": templateId
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/templates/{template_id}",
          "PATCH",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.updateTemplate = function(templateId, body) {
        return this.updateTemplateWithHttpInfo(templateId, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.createWithHttpInfo = function(body) {
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/templates",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.create = function(body) {
        return this.createWithHttpInfo(body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/api/VerifiedDomainsApi.js
var require_VerifiedDomainsApi = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/api/VerifiedDomainsApi.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = function(apiClient) {
      this.apiClient = apiClient || ApiClient.instance;
      this.createVerifiedDomainWithHttpInfo = function(body) {
        var postBody = body;
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/verified-domains",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.createVerifiedDomain = function(body) {
        return this.createVerifiedDomainWithHttpInfo(body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.deleteDomainWithHttpInfo = function(domainName) {
        var postBody = null;
        if (domainName === void 0 || domainName === null) {
          throw new Error("Missing the required parameter 'domainName' when calling ");
        }
        var pathParams = {
          "domain_name": domainName
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/verified-domains/{domain_name}",
          "DELETE",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.deleteDomain = function(domainName) {
        return this.deleteDomainWithHttpInfo(domainName).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getDomainWithHttpInfo = function(domainName) {
        var postBody = null;
        if (domainName === void 0 || domainName === null) {
          throw new Error("Missing the required parameter 'domainName' when calling ");
        }
        var pathParams = {
          "domain_name": domainName
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/verified-domains/{domain_name}",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getDomain = function(domainName) {
        return this.getDomainWithHttpInfo(domainName).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.getVerifiedDomainsAllWithHttpInfo = function() {
        var postBody = null;
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/verified-domains",
          "GET",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.getVerifiedDomainsAll = function() {
        return this.getVerifiedDomainsAllWithHttpInfo().then(function(response_and_data) {
          return response_and_data.data;
        });
      };
      this.submitDomainVerificationWithHttpInfo = function(domainName, body) {
        var postBody = body;
        if (domainName === void 0 || domainName === null) {
          throw new Error("Missing the required parameter 'domainName' when calling ");
        }
        if (body === void 0 || body === null) {
          throw new Error("Missing the required parameter 'body' when calling ");
        }
        var pathParams = {
          "domain_name": domainName
        };
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = ["basicAuth"];
        var contentTypes = ["application/json"];
        var accepts = ["application/json", "application/problem+json"];
        var returnType = "application/json";
        return this.apiClient.callApi(
          "/verified-domains/{domain_name}/actions/verify",
          "POST",
          pathParams,
          queryParams,
          headerParams,
          formParams,
          postBody,
          authNames,
          contentTypes,
          accepts,
          returnType
        );
      };
      this.submitDomainVerification = function(domainName, body) {
        return this.submitDomainVerificationWithHttpInfo(domainName, body).then(function(response_and_data) {
          return response_and_data.data;
        });
      };
    };
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/ApiClient.js
var require_ApiClient = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/ApiClient.js"(exports2, module2) {
    var superagent = require_node2();
    var querystring = require("querystring");
    var AccountExport = require_AccountExportApi();
    var AccountExports = require_AccountExportsApi();
    var ActivityFeed = require_ActivityFeedApi();
    var AuthorizedApps = require_AuthorizedAppsApi();
    var Automations = require_AutomationsApi();
    var BatchWebhooks = require_BatchWebhooksApi();
    var Batches = require_BatchesApi();
    var CampaignFolders = require_CampaignFoldersApi();
    var Campaigns = require_CampaignsApi();
    var ConnectedSites = require_ConnectedSitesApi();
    var Conversations = require_ConversationsApi();
    var CustomerJourneys = require_CustomerJourneysApi();
    var Ecommerce = require_EcommerceApi();
    var FacebookAds = require_FacebookAdsApi();
    var FileManager = require_FileManagerApi();
    var LandingPages = require_LandingPagesApi();
    var Lists = require_ListsApi();
    var Ping = require_PingApi();
    var Reporting = require_ReportingApi();
    var Reports = require_ReportsApi();
    var Root = require_RootApi();
    var SearchCampaigns = require_SearchCampaignsApi();
    var SearchMembers = require_SearchMembersApi();
    var Surveys = require_SurveysApi();
    var TemplateFolders = require_TemplateFoldersApi();
    var Templates = require_TemplatesApi();
    var VerifiedDomains = require_VerifiedDomainsApi();
    var exports2 = function() {
      this.basePath = "https://server.api.mailchimp.com/3.0".replace(/\/+$/, "");
      this.config = {
        apiKey: "",
        accessToken: "",
        server: "invalid-server"
      };
      this.defaultHeaders = {};
      this.timeout = 12e4;
      this.cache = true;
      this.enableCookies = false;
      if (typeof window === "undefined") {
        this.agent = new superagent.agent();
      }
      this.accountExport = new AccountExport(this);
      this.accountExports = new AccountExports(this);
      this.activityFeed = new ActivityFeed(this);
      this.authorizedApps = new AuthorizedApps(this);
      this.automations = new Automations(this);
      this.batchWebhooks = new BatchWebhooks(this);
      this.batches = new Batches(this);
      this.campaignFolders = new CampaignFolders(this);
      this.campaigns = new Campaigns(this);
      this.connectedSites = new ConnectedSites(this);
      this.conversations = new Conversations(this);
      this.customerJourneys = new CustomerJourneys(this);
      this.ecommerce = new Ecommerce(this);
      this.facebookAds = new FacebookAds(this);
      this.fileManager = new FileManager(this);
      this.landingPages = new LandingPages(this);
      this.lists = new Lists(this);
      this.ping = new Ping(this);
      this.reporting = new Reporting(this);
      this.reports = new Reports(this);
      this.root = new Root(this);
      this.searchCampaigns = new SearchCampaigns(this);
      this.searchMembers = new SearchMembers(this);
      this.Surveys = new Surveys(this);
      this.templateFolders = new TemplateFolders(this);
      this.templates = new Templates(this);
      this.verifiedDomains = new VerifiedDomains(this);
    };
    exports2.prototype.setConfig = function(config = {}) {
      var _this = this;
      this.config = config;
    };
    exports2.prototype.paramToString = function(param) {
      if (param == void 0 || param == null) {
        return "";
      }
      if (param instanceof Date) {
        return param.toJSON();
      }
      return param.toString();
    };
    exports2.prototype.buildUrl = function(path, pathParams) {
      if (!path.match(/^\//)) {
        path = "/" + path;
      }
      var url = this.basePath + path;
      var _this = this;
      url = url.replace(/\{([\w-]+)\}/g, function(fullMatch, key) {
        var value;
        if (pathParams.hasOwnProperty(key)) {
          value = _this.paramToString(pathParams[key]);
        } else {
          value = fullMatch;
        }
        return encodeURIComponent(value);
      });
      if (typeof this.config.server !== "undefined") {
        url = url.replace("server", this.config.server);
      }
      return url;
    };
    exports2.prototype.isJsonMime = function(contentType) {
      return Boolean(contentType != null && contentType.match(/^application\/json(;.*)?$/i));
    };
    exports2.prototype.jsonPreferredMime = function(contentTypes) {
      for (var i = 0; i < contentTypes.length; i++) {
        if (this.isJsonMime(contentTypes[i])) {
          return contentTypes[i];
        }
      }
      return contentTypes[0];
    };
    exports2.prototype.isFileParam = function(param) {
      if (typeof require === "function") {
        var fs;
        try {
          fs = require("fs");
        } catch (err) {
        }
        if (fs && fs.ReadStream && param instanceof fs.ReadStream) {
          return true;
        }
      }
      if (typeof Buffer === "function" && param instanceof Buffer) {
        return true;
      }
      if (typeof Blob === "function" && param instanceof Blob) {
        return true;
      }
      if (typeof File === "function" && param instanceof File) {
        return true;
      }
      return false;
    };
    exports2.prototype.normalizeParams = function(params) {
      var newParams = {};
      for (var key in params) {
        if (params.hasOwnProperty(key) && params[key] != void 0 && params[key] != null) {
          var value = params[key];
          if (this.isFileParam(value) || Array.isArray(value)) {
            newParams[key] = value;
          } else {
            newParams[key] = this.paramToString(value);
          }
        }
      }
      return newParams;
    };
    exports2.CollectionFormatEnum = {
      /**
       * Comma-separated values. Value: <code>csv</code>
       * @const
       */
      CSV: ",",
      /**
       * Space-separated values. Value: <code>ssv</code>
       * @const
       */
      SSV: " ",
      /**
       * Tab-separated values. Value: <code>tsv</code>
       * @const
       */
      TSV: "	",
      /**
       * Pipe(|)-separated values. Value: <code>pipes</code>
       * @const
       */
      PIPES: "|",
      /**
       * Native array. Value: <code>multi</code>
       * @const
       */
      MULTI: "multi"
    };
    exports2.prototype.buildCollectionParam = function buildCollectionParam(param, collectionFormat) {
      if (param == null) {
        return null;
      }
      switch (collectionFormat) {
        case "csv":
          return param.map(this.paramToString).join(",");
        case "ssv":
          return param.map(this.paramToString).join(" ");
        case "tsv":
          return param.map(this.paramToString).join("	");
        case "pipes":
          return param.map(this.paramToString).join("|");
        case "multi":
          return param.map(this.paramToString);
        default:
          throw new Error("Unknown collection format: " + collectionFormat);
      }
    };
    exports2.prototype.deserialize = function deserialize(response, returnType) {
      if (response == null || returnType == null || response.status == 204) {
        return null;
      }
      var data = response.body;
      if (data == null || typeof data === "object" && typeof data.length === "undefined" && !Object.keys(data).length) {
        data = response.text;
      }
      return exports2.convertToType(data, returnType);
    };
    exports2.prototype.callApi = function callApi(path, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts, returnType) {
      var _this = this;
      var url = this.buildUrl(path, pathParams);
      var request = superagent(httpMethod, url);
      if (this.config.apiKey !== void 0 && this.config.apiKey !== "") {
        request.auth("user", this.config.apiKey);
      } else if (this.config.accessToken !== void 0 && this.config.accessToken !== "") {
        request.set({ "Authorization": "Bearer " + this.config.accessToken });
      }
      if (httpMethod.toUpperCase() === "GET" && this.cache === false) {
        queryParams["_"] = (/* @__PURE__ */ new Date()).getTime();
      }
      request.query(this.normalizeParams(queryParams));
      request.set(this.defaultHeaders).set(this.normalizeParams(headerParams));
      request.timeout(this.timeout);
      var contentType = this.jsonPreferredMime(contentTypes);
      if (contentType) {
        if (contentType != "multipart/form-data") {
          request.type(contentType);
        }
      } else if (!HeaderUtils.caseInsensitiveGet(request.header, "content-type")) {
        request.type("application/json");
      }
      if (contentType === "application/x-www-form-urlencoded") {
        request.send(querystring.stringify(this.normalizeParams(formParams)));
      } else if (contentType == "multipart/form-data") {
        var _formParams = this.normalizeParams(formParams);
        for (var key in _formParams) {
          if (_formParams.hasOwnProperty(key)) {
            if (this.isFileParam(_formParams[key])) {
              request.attach(key, _formParams[key]);
            } else {
              request.field(key, _formParams[key]);
            }
          }
        }
      } else if (bodyParam) {
        request.send(bodyParam);
      }
      var accept = this.jsonPreferredMime(accepts);
      if (accept) {
        request.accept(accept);
      }
      if (returnType === "Blob") {
        request.responseType("blob");
      } else if (returnType === "String") {
        request.responseType("string");
      }
      if (this.enableCookies) {
        if (typeof window === "undefined") {
          this.agent.attachCookies(request);
        } else {
          request.withCredentials();
        }
      }
      return new Promise(function(resolve, reject) {
        request.end(function(error, response) {
          if (error) {
            reject(error);
          } else {
            try {
              var data = _this.deserialize(response, returnType);
              if (_this.enableCookies && typeof window === "undefined") {
                _this.agent.saveCookies(response);
              }
              resolve({ data, response });
            } catch (err) {
              reject(err);
            }
          }
        });
      });
    };
    exports2.parseDate = function(str) {
      return new Date(str.replace(/T/i, " "));
    };
    exports2.convertToType = function(data, type) {
      if (data === null || data === void 0)
        return data;
      switch (type) {
        case "Boolean":
          return Boolean(data);
        case "Integer":
          return parseInt(data, 10);
        case "Number":
          return parseFloat(data);
        case "String":
          return String(data);
        case "Date":
          return this.parseDate(String(data));
        case "Blob":
          return data;
        default:
          if (type === Object) {
            return data;
          } else if (typeof type === "function") {
            return type.constructFromObject(data);
          } else if (Array.isArray(type)) {
            var itemType = type[0];
            return data.map(function(item) {
              return exports2.convertToType(item, itemType);
            });
          } else if (typeof type === "object") {
            var keyType, valueType;
            for (var k in type) {
              if (type.hasOwnProperty(k)) {
                keyType = k;
                valueType = type[k];
                break;
              }
            }
            var result = {};
            for (var k in data) {
              if (data.hasOwnProperty(k)) {
                var key = exports2.convertToType(k, keyType);
                var value = exports2.convertToType(data[k], valueType);
                result[key] = value;
              }
            }
            return result;
          } else {
            return data;
          }
      }
    };
    exports2.constructFromObject = function(data, obj, itemType) {
      if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          if (data.hasOwnProperty(i))
            obj[i] = exports2.convertToType(data[i], itemType);
        }
      } else {
        for (var k in data) {
          if (data.hasOwnProperty(k))
            obj[k] = exports2.convertToType(data[k], itemType);
        }
      }
    };
    exports2.instance = new exports2();
    module2.exports = exports2;
  }
});

// node_modules/@mailchimp/mailchimp_marketing/src/index.js
var require_src2 = __commonJS({
  "node_modules/@mailchimp/mailchimp_marketing/src/index.js"(exports2, module2) {
    var ApiClient = require_ApiClient();
    module2.exports = ApiClient.instance;
  }
});

// netlify/functions/mailchimp-subscribe.cjs
var mailchimp = require_src2();
var crypto = require("crypto");
exports.handler = async (event, context) => {
  console.log("ALL ENV VARS:", Object.keys(process.env));
  console.log("Mailchimp API Key exists:", !!process.env.MAILCHIMP_API_KEY);
  console.log("Mailchimp List ID exists:", !!process.env.MAILCHIMP_LIST_ID);
  console.log("Mailchimp Server Prefix exists:", !!process.env.MAILCHIMP_SERVER_PREFIX);
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers
    };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }
  try {
    console.log("Request body:", event.body);
    const data = JSON.parse(event.body);
    console.log("Parsed data:", data);
    const email = data.email;
    let name = data.name || data.mergeFields && data.mergeFields.NAME;
    let phone = data.phone || data.mergeFields && data.mergeFields.PHONE;
    let company = data.company || data.mergeFields && data.mergeFields.COMPANY;
    let message = data.message || data.mergeFields && data.mergeFields.MESSAGE;
    console.log("Received form data:", { email, name, phone, company, hasMessage: !!message });
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Email is required"
        })
      };
    }
    console.log("Email validation passed");
    const apiKey = process.env.MAILCHIMP_API_KEY || "42709f9c4232a35cae6d405124b84886-us5";
    const listId = process.env.MAILCHIMP_LIST_ID || "9e58ad0be4";
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || "us5";
    console.log("Mailchimp env check:", {
      hasApiKey: !!apiKey,
      apiKeyMasked: apiKey ? apiKey.slice(0, 4) + "..." : void 0,
      hasListId: !!listId,
      listId,
      hasServerPrefix: !!serverPrefix,
      serverPrefix
    });
    if (!apiKey || !listId || !serverPrefix) {
      console.error("Missing Mailchimp configuration:", {
        hasApiKey: !!apiKey,
        hasListId: !!listId,
        hasServerPrefix: !!serverPrefix
      });
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Server configuration error",
          detail: "Mailchimp is not properly configured on the server. Please check your environment variables."
        })
      };
    }
    console.log("Server configuration validated");
    mailchimp.setConfig({
      apiKey,
      server: serverPrefix
    });
    const emailHash = crypto.createHash("md5").update(email.toLowerCase()).digest("hex");
    const mergeFields = {};
    if (name) mergeFields.NAME = name;
    if (phone) mergeFields.PHONE = phone;
    if (company) mergeFields.COMPANY = company;
    if (message) mergeFields.MESSAGE = message;
    const subscriberData = {
      email_address: email,
      status: "subscribed",
      // Use 'pending' if double opt-in is enabled
      merge_fields: mergeFields
    };
    console.log(`Submitting to Mailchimp: ${email}`);
    console.log("Mailchimp List ID:", listId);
    console.log("Subscriber data:", JSON.stringify(subscriberData));
    try {
      const response = await mailchimp.lists.setListMember(
        listId,
        emailHash,
        subscriberData
      );
      console.log("Mailchimp API response:", response);
      console.log("Successfully subscribed to Mailchimp:", email);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          status: "Success",
          message: "Successfully subscribed!",
          detail: `${email} has been added to the mailing list.`,
          mailchimpResponse: response
        })
      };
    } catch (err) {
      console.error("Mailchimp API error:", err.status, err.response ? err.response.text : "", err.message);
      if (err.status === 400 && err.response && err.response.body) {
        const errorBody = JSON.parse(err.response.text || "{}");
        if (errorBody.title === "Member Exists" || errorBody.detail && errorBody.detail.toLowerCase().includes("already a list member")) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              status: "Member Exists",
              message: "Already subscribed",
              detail: `${email} is already on the mailing list.`
            })
          };
        }
        return {
          statusCode: err.status,
          headers,
          body: JSON.stringify({
            success: false,
            error: errorBody.title || "Subscription failed",
            detail: errorBody.detail || "Please check your details or try again later",
            mailchimpResponse: errorBody
          })
        };
      }
      return {
        statusCode: err.status || 502,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Mailchimp API error",
          detail: err.message || "Unknown error",
          mailchimpResponse: err.response ? err.response.text : null
        })
      };
    }
  } catch (error) {
    console.error("Server error:", error.message, error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Internal server error",
        detail: error.message
      })
    };
  }
};
/*! Bundled license information:

mime-db/index.js:
  (*!
   * mime-db
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015-2022 Douglas Christopher Wilson
   * MIT Licensed
   *)

mime-types/index.js:
  (*!
   * mime-types
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

safe-buffer/index.js:
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

methods/index.js:
  (*!
   * methods
   * Copyright(c) 2013-2014 TJ Holowaychuk
   * Copyright(c) 2015-2016 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=mailchimp-subscribe.js.map
