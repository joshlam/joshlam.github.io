(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Resistance"] = factory();
	else
		root["Resistance"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(31);


/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(32)['default'];

	var _libSha256 = __webpack_require__(33);

	var _libSha2562 = _interopRequireDefault(_libSha256);

	var _servicesGameClient = __webpack_require__(34);

	var _servicesGameClient2 = _interopRequireDefault(_servicesGameClient);

	var _servicesMasterClient = __webpack_require__(51);

	var _servicesMasterClient2 = _interopRequireDefault(_servicesMasterClient);

	var HASHED_PW = 'f00a787f7492a95e165b470702f4fe9373583fbdc025b2c8bdf0262cc48fcff4';
	var MASTER = 'fc613b4dfd6736a7bd268c8a0e74ed0d1c04a959f59dd74ef2874983fd443fc9';
	var password = prompt('Password?');
	var gameClient = undefined;

	switch (_libSha2562['default'].hash(password)) {
	  case HASHED_PW:
	    gameClient = new _servicesGameClient2['default']('https://shining-fire-2823.firebaseio.com/');
	    break;
	  case MASTER:
	    gameClient = new _servicesMasterClient2['default']('https://shining-fire-2823.firebaseio.com/');
	    break;
	}

	if (gameClient) {
	  window.gameClient = gameClient;
	  window.onbeforeunload = function () {
	    return 'La Resistance';
	  };
	}

/***/ },
/* 32 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};

	exports.__esModule = true;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	/*  SHA-256 implementation in JavaScript                (c) Chris Veness 2002-2014 / MIT Licence  */
	/*                                                                                                */
	/*  - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                              */
	/*        http://csrc.nist.gov/groups/ST/toolkit/examples.html                                    */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	/* jshint node:true */ /* global define, escape, unescape */
	'use strict';

	/**
	 * SHA-256 hash function reference implementation.
	 *
	 * @namespace
	 */
	var Sha256 = {};

	/**
	 * Generates SHA-256 hash of string.
	 *
	 * @param   {string} msg - String to be hashed
	 * @returns {string} Hash of msg as hex character string
	 */
	Sha256.hash = function (msg) {
	    // convert string to UTF-8, as SHA only deals with byte-streams
	    msg = msg.utf8Encode();

	    // constants [§4.2.2]
	    var K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
	    // initial hash value [§5.3.1]
	    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

	    // PREPROCESSING

	    msg += String.fromCharCode(0x80); // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

	    // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
	    var l = msg.length / 4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
	    var N = Math.ceil(l / 16); // number of 16-integer-blocks required to hold 'l' ints
	    var M = new Array(N);

	    for (var i = 0; i < N; i++) {
	        M[i] = new Array(16);
	        for (var j = 0; j < 16; j++) {
	            // encode 4 chars per integer, big-endian encoding
	            M[i][j] = msg.charCodeAt(i * 64 + j * 4) << 24 | msg.charCodeAt(i * 64 + j * 4 + 1) << 16 | msg.charCodeAt(i * 64 + j * 4 + 2) << 8 | msg.charCodeAt(i * 64 + j * 4 + 3);
	        } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
	    }
	    // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
	    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
	    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
	    M[N - 1][14] = (msg.length - 1) * 8 / Math.pow(2, 32);M[N - 1][14] = Math.floor(M[N - 1][14]);
	    M[N - 1][15] = (msg.length - 1) * 8 & 0xffffffff;

	    // HASH COMPUTATION [§6.1.2]

	    var W = new Array(64);var a, b, c, d, e, f, g, h;
	    for (var i = 0; i < N; i++) {

	        // 1 - prepare message schedule 'W'
	        for (var t = 0; t < 16; t++) W[t] = M[i][t];
	        for (var t = 16; t < 64; t++) W[t] = Sha256.Sig1(W[t - 2]) + W[t - 7] + Sha256.Sig0(W[t - 15]) + W[t - 16] & 0xffffffff;

	        // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
	        a = H[0];b = H[1];c = H[2];d = H[3];e = H[4];f = H[5];g = H[6];h = H[7];

	        // 3 - main loop (note 'addition modulo 2^32')
	        for (var t = 0; t < 64; t++) {
	            var T1 = h + Sha256.Sigma1(e) + Sha256.Ch(e, f, g) + K[t] + W[t];
	            var T2 = Sha256.Sigma0(a) + Sha256.Maj(a, b, c);
	            h = g;
	            g = f;
	            f = e;
	            e = d + T1 & 0xffffffff;
	            d = c;
	            c = b;
	            b = a;
	            a = T1 + T2 & 0xffffffff;
	        }
	        // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
	        H[0] = H[0] + a & 0xffffffff;
	        H[1] = H[1] + b & 0xffffffff;
	        H[2] = H[2] + c & 0xffffffff;
	        H[3] = H[3] + d & 0xffffffff;
	        H[4] = H[4] + e & 0xffffffff;
	        H[5] = H[5] + f & 0xffffffff;
	        H[6] = H[6] + g & 0xffffffff;
	        H[7] = H[7] + h & 0xffffffff;
	    }

	    return Sha256.toHexStr(H[0]) + Sha256.toHexStr(H[1]) + Sha256.toHexStr(H[2]) + Sha256.toHexStr(H[3]) + Sha256.toHexStr(H[4]) + Sha256.toHexStr(H[5]) + Sha256.toHexStr(H[6]) + Sha256.toHexStr(H[7]);
	};

	/**
	 * Rotates right (circular right shift) value x by n positions [§3.2.4].
	 * @private
	 */
	Sha256.ROTR = function (n, x) {
	    return x >>> n | x << 32 - n;
	};

	/**
	 * Logical functions [§4.1.2].
	 * @private
	 */
	Sha256.Sigma0 = function (x) {
	    return Sha256.ROTR(2, x) ^ Sha256.ROTR(13, x) ^ Sha256.ROTR(22, x);
	};
	Sha256.Sigma1 = function (x) {
	    return Sha256.ROTR(6, x) ^ Sha256.ROTR(11, x) ^ Sha256.ROTR(25, x);
	};
	Sha256.Sig0 = function (x) {
	    return Sha256.ROTR(7, x) ^ Sha256.ROTR(18, x) ^ x >>> 3;
	};
	Sha256.Sig1 = function (x) {
	    return Sha256.ROTR(17, x) ^ Sha256.ROTR(19, x) ^ x >>> 10;
	};
	Sha256.Ch = function (x, y, z) {
	    return x & y ^ ~x & z;
	};
	Sha256.Maj = function (x, y, z) {
	    return x & y ^ x & z ^ y & z;
	};

	/**
	 * Hexadecimal representation of a number.
	 * @private
	 */
	Sha256.toHexStr = function (n) {
	    // note can't use toString(16) as it is implementation-dependant,
	    // and in IE returns signed numbers when used on full words
	    var s = "",
	        v;
	    for (var i = 7; i >= 0; i--) {
	        v = n >>> i * 4 & 0xf;s += v.toString(16);
	    }
	    return s;
	};

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

	/** Extend String object with method to encode multi-byte string to utf8
	 *  - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html */
	if (typeof String.prototype.utf8Encode == 'undefined') {
	    String.prototype.utf8Encode = function () {
	        return unescape(encodeURIComponent(this));
	    };
	}

	/** Extend String object with method to decode utf8 string to multi-byte */
	if (typeof String.prototype.utf8Decode == 'undefined') {
	    String.prototype.utf8Decode = function () {
	        try {
	            return decodeURIComponent(escape(this));
	        } catch (e) {
	            return this; // invalid UTF-8? return as-is
	        }
	    };
	}

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
	if (typeof module != 'undefined' && module.exports) module.exports = Sha256; // CommonJs export
	if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return Sha256;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// todo: separate player sign in events from game instance events
	'use strict';

	var _createClass = __webpack_require__(35)['default'];

	var _classCallCheck = __webpack_require__(39)['default'];

	var _Object$keys = __webpack_require__(40)['default'];

	var _interopRequireDefault = __webpack_require__(32)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _modelsPlayer = __webpack_require__(50);

	var _modelsPlayer2 = _interopRequireDefault(_modelsPlayer);

	var USE_COOKIE = false;

	var GameClient = (function () {
	  function GameClient(url) {
	    var _this = this;

	    _classCallCheck(this, GameClient);

	    var db = this.db = new Firebase(url);

	    this.players = [];

	    db.once('value', function (snapshot) {
	      _this.init(snapshot.val() || {});
	      db.on('child_added', function (msg) {
	        return _this.handleEvent(msg.val());
	      });
	      _this.signIn();
	    });
	  }

	  _createClass(GameClient, [{
	    key: 'init',
	    value: function init(events) {
	      var _this2 = this;

	      this.READ_ONLY = true;

	      _Object$keys(events).forEach(function (key) {
	        _this2.handleEvent(events[key]);
	      });
	      // READ_ONLY should be false for last event?

	      this.READ_ONLY = false;
	    }
	  }, {
	    key: 'handleEvent',
	    value: function handleEvent(_ref) {
	      var name = _ref.name;
	      var data = _ref.data;

	      var eventHandler = this['on' + name];

	      if (eventHandler) {
	        eventHandler.call(this, data);
	      }
	    }
	  }, {
	    key: 'push',
	    value: function push(event) {
	      this.db.push(event);
	    }
	  }, {
	    key: 'signIn',
	    value: function signIn() {
	      var _this3 = this;

	      var id = Number(document.cookie || NaN);

	      if (isNaN(id) || !USE_COOKIE) {
	        document.cookie = id = this.id = this.players.length + 1;

	        var _name = this.name = prompt('Please enter your name');

	        this.push({
	          name: 'PlayerSignIn',
	          data: {
	            id: id,
	            name: _name
	          }
	        });
	      } else {
	        this.id = id;
	      }

	      var chatInput = document.querySelector('.chat__input');
	      var onKeyPress = function onKeyPress(e) {
	        var keyCode = e.keyCode;
	        var target = e.target;

	        if (keyCode !== 13) {
	          return;
	        }

	        _this3.push({
	          name: 'ChatMessage',
	          data: {
	            name: _this3.name,
	            message: target.value
	          }
	        });

	        target.value = '';
	      };

	      chatInput.addEventListener('keypress', onKeyPress, false);
	    }
	  }, {
	    key: 'onPlayerSignIn',
	    value: function onPlayerSignIn(_ref2) {
	      var id = _ref2.id;
	      var name = _ref2.name;

	      var players = this.players;

	      if (players[id - 1]) {
	        return;
	      }

	      players.push(new _modelsPlayer2['default'](id, name));
	    }
	  }, {
	    key: 'onSetRole',
	    value: function onSetRole(_ref3) {
	      var id = _ref3.id;
	      var role = _ref3.role;
	      var imageNumber = _ref3.imageNumber;

	      if (id !== this.id) {
	        return;
	      }

	      var roleClass = 'player__role--' + role;
	      var roleCardClass = roleClass + '--' + imageNumber;
	      var roleCard = document.querySelector('.player--current .player__role');

	      roleCard.classList.add(roleClass);
	      roleCard.classList.add(roleCardClass);
	      roleCard.classList.remove('player__role--face-down');
	    }
	  }, {
	    key: 'onSpiesHeadsUp',
	    value: function onSpiesHeadsUp() {
	      // todo: display spies heads up phase for a while
	    }
	  }, {
	    key: 'onSetMerlin',
	    value: function onSetMerlin(_ref4) {
	      var id = _ref4.id;
	      var roles = _ref4.roles;

	      if (id !== this.id) {
	        return;
	      }

	      this.gamePlayers.forEach(function (player) {
	        var id = player.id;
	        var _roles$id = roles[id];
	        var role = _roles$id.role;
	        var imageNumber = _roles$id.imageNumber;

	        var roleClass = 'player__role--' + role;
	        var roleCardClass = roleClass + '--' + imageNumber;
	        var roleCard = document.querySelector('.player--' + id + ' .player__role');
	        var faceDown = 'player__role--face-down';

	        roleCard.classList.add(roleClass);
	        roleCard.classList.add(roleCardClass);
	        roleCard.classList.remove(faceDown);
	      });
	    }
	  }, {
	    key: 'onLeaderChange',
	    value: function onLeaderChange(_ref5) {
	      var id = _ref5.id;

	      var oldLeader = this.leader;
	      var token = '.player__leader-token';
	      var hidden = 'player__leader-token--hidden';
	      var newLeaderSelector = '.player--' + id + ' ' + token;

	      if (oldLeader) {
	        var oldLeaderSelector = '.player--' + oldLeader + ' ' + token;

	        document.querySelector(oldLeaderSelector).classList.add(hidden);
	      }

	      document.querySelector(newLeaderSelector).classList.remove(hidden);

	      this.leader = id;
	      // todo: highlight current mission
	    }
	  }, {
	    key: 'onBuildTeam',
	    value: function onBuildTeam(_ref6) {
	      var _this4 = this;

	      var numPlayers = _ref6.numPlayers;

	      if (this.leader !== this.id || this.READ_ONLY) {
	        return;
	      }

	      var selected = {};
	      var panel = document.querySelector('.game__table__decision-panel');
	      var submit = document.querySelector('.submit');
	      var icons = document.querySelectorAll('.player__icon');
	      var teamCount = 0;

	      var onClick = function onClick(e) {
	        var target = e.target;

	        if (target.classList.contains('player__icon--selected')) {
	          target.classList.remove('player__icon--selected');
	          selected[target.id] = false;
	          teamCount--;
	        } else {
	          if (teamCount === numPlayers) {
	            return;
	          }

	          target.classList.add('player__icon--selected');
	          selected[target.id] = true;
	          teamCount++;
	        }

	        if (teamCount === numPlayers) {
	          submit.removeAttribute('disabled');
	        } else {
	          submit.setAttribute('disabled', 'true');
	        }
	      };

	      [].forEach.call(icons, function (icon) {
	        icon.addEventListener('click', onClick, false);
	      });

	      panel.classList.add('game__table__decision-panel--open');
	      panel.classList.add('game__table__decision-panel--team');

	      var onSubmit = function onSubmit() {
	        submit.removeEventListener('click', onSubmit, false);

	        [].forEach.call(icons, function (icon) {
	          icon.removeEventListener('click', onClick, false);
	        });

	        panel.classList.remove('game__table__decision-panel--open');
	        panel.classList.remove('game__table__decision-panel--team');
	        submit.setAttribute('disabled', 'true');

	        _this4.push({
	          name: 'TeamChosen',
	          data: {
	            team: _Object$keys(selected).reduce(function (team, id) {
	              if (selected[id]) {
	                team.push(id);
	              }

	              return team;
	            }, [])
	          }
	        });

	        var chosen = document.querySelectorAll('.player__icon--selected');

	        [].forEach.call(chosen, function (icon) {
	          icon.classList.remove('player__icon--selected');
	        });
	      };

	      submit.addEventListener('click', onSubmit, false);
	    }
	  }, {
	    key: 'onTeamChosen',
	    value: function onTeamChosen(_ref7) {
	      var team = _ref7.team;

	      var onTeam = 'player__icon--on-team';

	      team.forEach(function (id) {
	        var playerIcon = '.player--' + id + ' .player__icon';

	        document.querySelector(playerIcon).classList.add(onTeam);
	      });

	      this.team = team;
	    }
	  }, {
	    key: 'onTeamVote',
	    value: function onTeamVote() {
	      var _this5 = this;

	      if (this.READ_ONLY) {
	        return;
	      }

	      this.votes = [];

	      var panel = document.querySelector('.game__table__decision-panel');
	      var submit = document.querySelector('.submit');
	      var approveToken = document.querySelector('.vote-token--approve');
	      var rejectToken = document.querySelector('.vote-token--reject');
	      var onClick = function onClick(e) {
	        var prev = document.querySelector('.vote-token--selected');
	        var target = e.target;

	        if (prev && prev !== target) {
	          prev.classList.remove('vote-token--selected');
	        }

	        target.classList.add('vote-token--selected');
	        submit.removeAttribute('disabled');
	      };

	      approveToken.addEventListener('click', onClick, false);
	      rejectToken.addEventListener('click', onClick, false);

	      panel.classList.add('game__table__decision-panel--open');
	      panel.classList.add('game__table__decision-panel--vote');

	      var onSubmit = function onSubmit() {
	        submit.removeEventListener('click', onSubmit, false);
	        approveToken.removeEventListener('click', onClick, false);
	        rejectToken.removeEventListener('click', onClick, false);

	        panel.classList.remove('game__table__decision-panel--open');
	        panel.classList.remove('game__table__decision-panel--vote');
	        submit.setAttribute('disabled', 'true');

	        var selected = document.querySelector('.vote-token--selected');
	        var approve = selected.classList.contains('vote-token--approve');

	        selected.classList.remove('vote-token--selected');

	        _this5.push({
	          name: 'Vote',
	          data: { approve: approve, id: _this5.id }
	        });
	      };

	      submit.addEventListener('click', onSubmit, false);
	    }
	  }, {
	    key: 'onVote',
	    value: function onVote(data) {
	      this.votes.push(data);
	    }
	  }, {
	    key: 'onVotingResults',
	    value: function onVotingResults(_ref8) {
	      var approved = _ref8.approved;

	      if (approved) {
	        // todo: display approved message
	        // todo: reset failed vote token
	        // todo: team tokens
	        this.team.forEach(function (id) {
	          var playerClass = '.player--' + id;
	          var missionCardSelector = playerClass + ' .player__mission-card';
	          var hidden = 'player__mission-card--hidden';

	          [].forEach.call(document.querySelectorAll(missionCardSelector), function (el) {
	            el.classList.remove(hidden);
	          });
	        });
	      } else {
	        // todo: display rejected message
	        // todo: move failed vote token

	        var team = document.querySelectorAll('.player__icon--on-team');

	        [].forEach.call(team, function (icon) {
	          icon.classList.remove('player__icon--on-team');
	        });

	        this.team = [];
	      }

	      var revealedTokens = [];
	      var faceDown = 'player__vote--face-down';

	      this.votes.forEach(function (vote) {
	        var player = '.player--' + vote.id;
	        var token = '.player__vote--' + (vote.approve ? 'approve' : 'reject');
	        var selected = document.querySelector(player + ' ' + token);

	        selected.classList.remove(faceDown);
	        revealedTokens.push(selected);
	      });

	      this.votes = [];

	      setTimeout(function () {
	        revealedTokens.forEach(function (token) {
	          return token.classList.add(faceDown);
	        });
	      }, 10000);
	    }
	  }, {
	    key: 'onConductMission',
	    value: function onConductMission(_ref9) {
	      var _this6 = this;

	      var team = _ref9.team;

	      if (!team[this.id] || this.READ_ONLY) {
	        return;
	      }

	      var panel = document.querySelector('.game__table__decision-panel');
	      var submit = document.querySelector('.submit');
	      var successCard = document.querySelector('.mission-card--success');
	      var failCard = document.querySelector('.mission-card--fail');
	      var onClick = function onClick(e) {
	        var prev = document.querySelector('.mission-card--selected');
	        var target = e.target;

	        if (prev && prev !== target) {
	          prev.classList.remove('mission-card--selected');
	        }

	        target.classList.add('mission-card--selected');
	        submit.removeAttribute('disabled');
	      };

	      successCard.addEventListener('click', onClick, false);
	      failCard.addEventListener('click', onClick, false);

	      panel.classList.add('game__table__decision-panel--open');
	      panel.classList.add('game__table__decision-panel--mission');

	      var onSubmit = function onSubmit() {
	        submit.removeEventListener('click', onSubmit, false);
	        successCard.removeEventListener('click', onClick, false);
	        failCard.removeEventListener('click', onClick, false);

	        panel.classList.remove('game__table__decision-panel--open');
	        panel.classList.remove('game__table__decision-panel--mission');
	        submit.setAttribute('disabled', 'true');

	        var selected = document.querySelector('.mission-card--selected');
	        var success = selected.classList.contains('mission-card--success');

	        selected.classList.remove('mission-card--selected');

	        _this6.push({
	          name: 'MissionCardChosen',
	          data: { success: success }
	        });
	      };

	      submit.addEventListener('click', onSubmit, false);
	    }
	  }, {
	    key: 'onMissionResults',
	    value: function onMissionResults(_ref10) {
	      var success = _ref10.success;
	      var missionCards = _ref10.missionCards;

	      var els = [];
	      var message = document.querySelector('.message');

	      missionCards.forEach(function (successCard) {
	        var el = document.createElement('div');

	        el.classList.add('mission-card');

	        if (successCard) {
	          el.classList.add('mission-card--success');
	        } else {
	          el.classList.add('mission-card--fail');
	        }

	        message.appendChild(el);
	        els.push(el);
	      });

	      setTimeout(function () {
	        els.forEach(function (el) {
	          message.removeChild(el);
	        });
	      }, 10000);

	      var wins = document.querySelector('.wins');
	      var win = document.createElement('div');

	      win.classList.add('win');

	      if (success) {
	        win.classList.add('win--resistance');
	      } else {
	        win.classList.add('win--spy');
	      }

	      wins.appendChild(win);

	      var missionCardEls = document.querySelectorAll('.player__mission-card');

	      [].forEach.call(missionCardEls, function (missionCard) {
	        missionCard.classList.add('player__mission-card--hidden');
	      });

	      var team = document.querySelectorAll('.player__icon--on-team');

	      [].forEach.call(team, function (icon) {
	        icon.classList.remove('player__icon--on-team');
	      });

	      this.team = [];
	    }
	  }, {
	    key: 'onGameStart',
	    value: function onGameStart(_ref11) {
	      var players = _ref11.players;
	      var positions = _ref11.positions;

	      // todo: setup board
	      // todo: add player icon / info to room display
	      var numPlayers = players.length;
	      var gameClass = 'game--' + numPlayers + '-players';
	      var offset = positions[this.id];

	      this.gamePlayers = players;

	      players.forEach(function (player, idx) {
	        var position = idx - offset + 1;

	        if (position < 1) {
	          position += numPlayers;
	        }

	        var id = player.id;
	        var playerClass = 'player--' + id;
	        var seat = document.querySelector('.player--position-' + position);

	        seat.classList.add(playerClass);
	        seat.querySelector('.player__name').textContent = player.name;
	        seat.querySelector('.player__icon').id = id;
	      });

	      document.querySelector('.game').classList.add(gameClass);
	    }
	  }, {
	    key: 'onGameOver',
	    value: function onGameOver(_ref12) {
	      var winners = _ref12.winners;
	      var roles = _ref12.roles;

	      // todo: display winners message

	      this.gamePlayers.forEach(function (player) {
	        var id = player.id;
	        var _roles$id2 = roles[id];
	        var role = _roles$id2.role;
	        var imageNumber = _roles$id2.imageNumber;

	        var roleClass = 'player__role--' + role;
	        var roleCardClass = roleClass + '--' + imageNumber;
	        var roleCard = document.querySelector('.player--' + id + ' .player__role');
	        var faceDown = 'player__role--face-down';

	        roleCard.classList.add(roleClass);
	        roleCard.classList.add(roleCardClass);
	        roleCard.classList.remove(faceDown);
	      });
	    }
	  }, {
	    key: 'onGameEnd',
	    value: function onGameEnd() {
	      // l33t hacks, remove
	      document.querySelector('.game').outerHTML = '\n    <div class="game">\n      <div class="player player--position-1 player--current">\n        <div class="player__name"></div>\n        <div class="player__icon"></div>\n        <div class="player__role player__role--face-down"></div>\n        <div class="player__vote player__vote--approve player__vote--face-down"></div>\n        <div class="player__vote player__vote--reject player__vote--face-down"></div>\n        <div class="player__leader-token player__leader-token--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n      </div>\n      <div class="player player--position-2">\n        <div class="player__name"></div>\n        <div class="player__icon"></div>\n        <div class="player__role player__role--face-down"></div>\n        <div class="player__vote player__vote--approve player__vote--face-down"></div>\n        <div class="player__vote player__vote--reject player__vote--face-down"></div>\n        <div class="player__leader-token player__leader-token--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n      </div>\n      <div class="player player--position-3">\n        <div class="player__name"></div>\n        <div class="player__icon"></div>\n        <div class="player__role player__role--face-down"></div>\n        <div class="player__vote player__vote--approve player__vote--face-down"></div>\n        <div class="player__vote player__vote--reject player__vote--face-down"></div>\n        <div class="player__leader-token player__leader-token--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n      </div>\n      <div class="player player--position-4">\n        <div class="player__name"></div>\n        <div class="player__icon"></div>\n        <div class="player__role player__role--face-down"></div>\n        <div class="player__vote player__vote--approve player__vote--face-down"></div>\n        <div class="player__vote player__vote--reject player__vote--face-down"></div>\n        <div class="player__leader-token player__leader-token--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n      </div>\n      <div class="player player--position-5">\n        <div class="player__name"></div>\n        <div class="player__icon"></div>\n        <div class="player__role player__role--face-down"></div>\n        <div class="player__vote player__vote--approve player__vote--face-down"></div>\n        <div class="player__vote player__vote--reject player__vote--face-down"></div>\n        <div class="player__leader-token player__leader-token--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n      </div>\n      <div class="player player--position-6">\n        <div class="player__name"></div>\n        <div class="player__icon"></div>\n        <div class="player__role player__role--face-down"></div>\n        <div class="player__vote player__vote--approve player__vote--face-down"></div>\n        <div class="player__vote player__vote--reject player__vote--face-down"></div>\n        <div class="player__leader-token player__leader-token--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n      </div>\n      <div class="player player--position-7">\n        <div class="player__name"></div>\n        <div class="player__icon"></div>\n        <div class="player__role player__role--face-down"></div>\n        <div class="player__vote player__vote--approve player__vote--face-down"></div>\n        <div class="player__vote player__vote--reject player__vote--face-down"></div>\n        <div class="player__leader-token player__leader-token--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n      </div>\n      <div class="player player--position-8">\n        <div class="player__name"></div>\n        <div class="player__icon"></div>\n        <div class="player__role player__role--face-down"></div>\n        <div class="player__vote player__vote--approve player__vote--face-down"></div>\n        <div class="player__vote player__vote--reject player__vote--face-down"></div>\n        <div class="player__leader-token player__leader-token--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n      </div>\n      <div class="player player--position-9">\n        <div class="player__name"></div>\n        <div class="player__icon"></div>\n        <div class="player__role player__role--face-down"></div>\n        <div class="player__vote player__vote--approve player__vote--face-down"></div>\n        <div class="player__vote player__vote--reject player__vote--face-down"></div>\n        <div class="player__leader-token player__leader-token--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n      </div>\n      <div class="player player--position-10">\n        <div class="player__name"></div>\n        <div class="player__icon"></div>\n        <div class="player__role player__role--face-down"></div>\n        <div class="player__vote player__vote--approve player__vote--face-down"></div>\n        <div class="player__vote player__vote--reject player__vote--face-down"></div>\n        <div class="player__leader-token player__leader-token--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n        <div class="player__mission-card player__mission-card--hidden"></div>\n      </div>\n      <div class="game__area">\n        <div class="game__table">\n          <div class="game__table__top">\n            <div class="game__table__top__display"></div>\n          </div>\n          <div class="game__table__middle">\n            <div class="game__table__middle__strip"></div>\n            <div class="game__board">\n              <div class="game__board__panel"></div>\n              <div class="game__board__results"></div>\n            </div>\n            <div class="display">\n              <div class="message"></div>\n              <div class="wins"></div>\n            </div>\n          </div>\n          <div class="game__table__bottom">\n            <div class="game__table__bottom__results"></div>\n          </div>\n        </div>\n        <div class="game__table__decision-panel">\n          <div class="team"></div>\n          <div class="vote-tokens">\n            <div class="vote-token vote-token--approve"></div>\n            <div class="vote-token vote-token--reject"></div>\n          </div>\n          <div class="mission-cards">\n            <div class="mission-card mission-card--success"></div>\n            <div class="mission-card mission-card--fail"></div>\n          </div>\n          <button class="submit" disabled="true">Submit</button>\n        </div>\n      </div>\n    </div>'.replace(/>\s+/g, '>');

	      this.gamePlayers = [];
	    }
	  }, {
	    key: 'onChatMessage',
	    value: function onChatMessage(_ref13) {
	      var name = _ref13.name;
	      var message = _ref13.message;

	      var nameEl = document.createElement('strong');
	      var messageEl = document.createElement('li');
	      var chatHistory = document.querySelector('.chat__history');

	      nameEl.classList.add('chat__message__name');
	      nameEl.textContent = name + ': ';
	      messageEl.classList.add('chat__message');
	      messageEl.textContent = message;
	      messageEl.insertBefore(nameEl, messageEl.firstChild);

	      chatHistory.appendChild(messageEl);
	      chatHistory.scrollTop = chatHistory.scrollHeight;
	    }
	  }]);

	  return GameClient;
	})();

	exports['default'] = GameClient;
	module.exports = exports['default'];

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$defineProperty = __webpack_require__(36)["default"];

	exports["default"] = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;

	      _Object$defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	})();

	exports.__esModule = true;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(37), __esModule: true };

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(38);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	exports.__esModule = true;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(41), __esModule: true };

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(42);
	module.exports = __webpack_require__(48).Object.keys;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(43);

	__webpack_require__(45)('keys', function($keys){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(44);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	module.exports = function(KEY, exec){
	  var $def = __webpack_require__(46)
	    , fn   = (__webpack_require__(48).Object || {})[KEY] || Object[KEY]
	    , exp  = {};
	  exp[KEY] = exec(fn);
	  $def($def.S + $def.F * __webpack_require__(49)(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(47)
	  , core      = __webpack_require__(48)
	  , PROTOTYPE = 'prototype';
	var ctx = function(fn, that){
	  return function(){
	    return fn.apply(that, arguments);
	  };
	};
	var $def = function(type, name, source){
	  var key, own, out, exp
	    , isGlobal = type & $def.G
	    , isProto  = type & $def.P
	    , target   = isGlobal ? global : type & $def.S
	        ? global[name] : (global[name] || {})[PROTOTYPE]
	    , exports  = isGlobal ? core : core[name] || (core[name] = {});
	  if(isGlobal)source = name;
	  for(key in source){
	    // contains in native
	    own = !(type & $def.F) && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    if(isGlobal && typeof target[key] != 'function')exp = source[key];
	    // bind timers to global for call from export context
	    else if(type & $def.B && own)exp = ctx(out, global);
	    // wrap global constructors for prevent change them in library
	    else if(type & $def.W && target[key] == out)!function(C){
	      exp = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      exp[PROTOTYPE] = C[PROTOTYPE];
	    }(out);
	    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export
	    exports[key] = exp;
	    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$def.F = 1;  // forced
	$def.G = 2;  // global
	$def.S = 4;  // static
	$def.P = 8;  // proto
	$def.B = 16; // bind
	$def.W = 32; // wrap
	module.exports = $def;

/***/ },
/* 47 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var UNDEFINED = 'undefined';
	var global = module.exports = typeof window != UNDEFINED && window.Math == Math
	  ? window : typeof self != UNDEFINED && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 48 */
/***/ function(module, exports) {

	var core = module.exports = {};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _classCallCheck = __webpack_require__(39)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var Player = function Player(id, name) {
	  _classCallCheck(this, Player);

	  this.id = id;
	  this.name = name;
	  this.role = null;
	  this.imageNumber = null;
	};

	exports["default"] = Player;
	module.exports = exports["default"];

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _get = __webpack_require__(52)['default'];

	var _inherits = __webpack_require__(59)['default'];

	var _createClass = __webpack_require__(35)['default'];

	var _classCallCheck = __webpack_require__(39)['default'];

	var _interopRequireDefault = __webpack_require__(32)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _modelsGame = __webpack_require__(70);

	var _modelsGame2 = _interopRequireDefault(_modelsGame);

	var _servicesGameClient = __webpack_require__(34);

	var _servicesGameClient2 = _interopRequireDefault(_servicesGameClient);

	var MasterClient = (function (_GameClient) {
	  _inherits(MasterClient, _GameClient);

	  function MasterClient(url) {
	    _classCallCheck(this, MasterClient);

	    _get(Object.getPrototypeOf(MasterClient.prototype), 'constructor', this).call(this, url);

	    this.game = null;
	  }

	  _createClass(MasterClient, [{
	    key: 'createGame',
	    value: function createGame(players) {
	      var variant = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	      this.game = new _modelsGame2['default'](this, players, variant);
	    }
	  }, {
	    key: 'startGame',
	    value: function startGame(leaderPosition) {
	      var players = this.game.players;
	      var numPlayers = players.length;
	      var leader = Number(leaderPosition);
	      var isNum = !isNaN(leader);
	      var position = isNum ? leader : Math.floor(Math.random() * numPlayers);

	      this.push({
	        name: 'GameStart',
	        data: {
	          players: players,
	          positions: players.reduce(function (positions, player, idx) {
	            positions[player.id] = idx;

	            return positions;
	          }, {})
	        }
	      });
	      this.game.start(position);
	    }
	  }, {
	    key: 'endGame',
	    value: function endGame() {
	      this.db.set([]);
	      this.push({ name: 'GameEnd' });
	    }
	  }, {
	    key: 'onTeamChosen',
	    value: function onTeamChosen(_ref) {
	      var team = _ref.team;

	      _get(Object.getPrototypeOf(MasterClient.prototype), 'onTeamChosen', this).apply(this, arguments);
	      this.game.setTeam(team);
	      this.push({ name: 'TeamVote' });
	    }
	  }, {
	    key: 'onVote',
	    value: function onVote(_ref2) {
	      var approve = _ref2.approve;

	      _get(Object.getPrototypeOf(MasterClient.prototype), 'onVote', this).apply(this, arguments);
	      this.game.recordVote(approve);
	    }
	  }, {
	    key: 'onMissionCardChosen',
	    value: function onMissionCardChosen(_ref3) {
	      var success = _ref3.success;

	      this.game.recordMissionCard(success);
	    }
	  }]);

	  return MasterClient;
	})(_servicesGameClient2['default']);

	exports['default'] = MasterClient;
	module.exports = exports['default'];

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$getOwnPropertyDescriptor = __webpack_require__(53)["default"];

	exports["default"] = function get(_x, _x2, _x3) {
	  var _again = true;

	  _function: while (_again) {
	    var object = _x,
	        property = _x2,
	        receiver = _x3;
	    desc = parent = getter = undefined;
	    _again = false;
	    if (object === null) object = Function.prototype;

	    var desc = _Object$getOwnPropertyDescriptor(object, property);

	    if (desc === undefined) {
	      var parent = Object.getPrototypeOf(object);

	      if (parent === null) {
	        return undefined;
	      } else {
	        _x = parent;
	        _x2 = property;
	        _x3 = receiver;
	        _again = true;
	        continue _function;
	      }
	    } else if ("value" in desc) {
	      return desc.value;
	    } else {
	      var getter = desc.get;

	      if (getter === undefined) {
	        return undefined;
	      }

	      return getter.call(receiver);
	    }
	  }
	};

	exports.__esModule = true;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(54), __esModule: true };

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(38);
	__webpack_require__(55);
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $.getDesc(it, key);
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject = __webpack_require__(56);

	__webpack_require__(45)('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(57)
	  , defined = __webpack_require__(44);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	// indexed object, fallback for non-array-like ES3 strings
	var cof = __webpack_require__(58);
	module.exports = 0 in Object('z') ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 58 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$create = __webpack_require__(60)["default"];

	var _Object$setPrototypeOf = __webpack_require__(62)["default"];

	exports["default"] = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = _Object$create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	exports.__esModule = true;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(61), __esModule: true };

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(38);
	module.exports = function create(P, D){
	  return $.create(P, D);
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(63), __esModule: true };

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(64);
	module.exports = __webpack_require__(48).Object.setPrototypeOf;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $def = __webpack_require__(46);
	$def($def.S, 'Object', {setPrototypeOf: __webpack_require__(65).set});

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var getDesc  = __webpack_require__(38).getDesc
	  , isObject = __webpack_require__(66)
	  , anObject = __webpack_require__(67);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
	    ? function(buggy, set){
	        try {
	          set = __webpack_require__(68)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
	          set({}, []);
	        } catch(e){ buggy = true; }
	        return function setPrototypeOf(O, proto){
	          check(O, proto);
	          if(buggy)O.__proto__ = proto;
	          else set(O, proto);
	          return O;
	        };
	      }()
	    : undefined),
	  check: check
	};

/***/ },
/* 66 */
/***/ function(module, exports) {

	// http://jsperf.com/core-js-isobject
	module.exports = function(it){
	  return it !== null && (typeof it == 'object' || typeof it == 'function');
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(66);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(69);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  } return function(/* ...args */){
	      return fn.apply(that, arguments);
	    };
	};

/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = __webpack_require__(35)['default'];

	var _classCallCheck = __webpack_require__(39)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _libUtils = __webpack_require__(71);

	var GAMES = {
	  5: { resistance: 3, spies: 2,
	    missions: {
	      1: { players: 2, fails: 1 },
	      2: { players: 3, fails: 1 },
	      3: { players: 2, fails: 1 },
	      4: { players: 3, fails: 1 },
	      5: { players: 3, fails: 1 }
	    }
	  },
	  6: { resistance: 4, spies: 2,
	    missions: {
	      1: { players: 2, fails: 1 },
	      2: { players: 3, fails: 1 },
	      3: { players: 4, fails: 1 },
	      4: { players: 3, fails: 1 },
	      5: { players: 4, fails: 1 }
	    }
	  },
	  7: { resistance: 4, spies: 3,
	    missions: {
	      1: { players: 2, fails: 1 },
	      2: { players: 3, fails: 1 },
	      3: { players: 3, fails: 1 },
	      4: { players: 4, fails: 2 },
	      5: { players: 4, fails: 1 }
	    }
	  },
	  8: { resistance: 5, spies: 3,
	    missions: {
	      1: { players: 3, fails: 1 },
	      2: { players: 4, fails: 1 },
	      3: { players: 4, fails: 1 },
	      4: { players: 5, fails: 2 },
	      5: { players: 5, fails: 1 }
	    }
	  },
	  9: { resistance: 6, spies: 3,
	    missions: {
	      1: { players: 3, fails: 1 },
	      2: { players: 4, fails: 1 },
	      3: { players: 4, fails: 1 },
	      4: { players: 5, fails: 2 },
	      5: { players: 5, fails: 1 }
	    }
	  },
	  10: { resistance: 6, spies: 4,
	    missions: {
	      1: { players: 3, fails: 1 },
	      2: { players: 4, fails: 1 },
	      3: { players: 4, fails: 1 },
	      4: { players: 5, fails: 2 },
	      5: { players: 5, fails: 1 }
	    }
	  }
	};

	var Game = (function () {
	  function Game(client, players, variant) {
	    _classCallCheck(this, Game);

	    var numPlayers = this.numPlayers = players.length;

	    this.client = client;
	    this.players = players;
	    this.schema = GAMES[numPlayers];
	    this.variant = variant;
	  }

	  _createClass(Game, [{
	    key: 'start',
	    value: function start(leaderPosition) {
	      this.setup();
	      this.setLeader(leaderPosition % this.numPlayers);
	      this.enterMissionPhase();
	    }
	  }, {
	    key: 'push',
	    value: function push(event) {
	      this.client.push(event);
	    }
	  }, {
	    key: 'setup',
	    value: function setup() {
	      var _schema = this.schema;
	      var resistance = _schema.resistance;
	      var spies = _schema.spies;
	      var missions = _schema.missions;

	      this.missions = missions;
	      this.numResistance = resistance;
	      this.numSpies = spies;
	      this.missionNumber = 1;
	      this.resistanceWins = this.spyWins = 0;

	      this.assignRoles();
	    }
	  }, {
	    key: 'assignRoles',
	    value: function assignRoles() {
	      var _this = this;

	      var roles = [];
	      var numResistance = this.numResistance;
	      var numSpies = this.numSpies;

	      while (numResistance--) {
	        roles.push(0);
	      }
	      while (numSpies--) {
	        roles.push(1);
	      }

	      roles = (0, _libUtils.shuffle)(roles);

	      this.players.forEach(function (player, idx) {
	        var role = undefined;
	        var imageNumber = undefined;

	        if (roles[idx]) {
	          role = 'spy';
	          numSpies += 1;
	          imageNumber = numSpies + 1;
	        } else {
	          role = 'resistance';
	          numResistance += 1;
	          imageNumber = numResistance + 1;
	        }

	        player.role = role;
	        player.imageNumber = imageNumber;

	        _this.push({
	          name: 'SetRole',
	          data: {
	            id: player.id,
	            role: role,
	            imageNumber: imageNumber
	          }
	        });
	      });

	      this.push({ name: 'SpiesHeadsUp' });

	      if (this.variant === 'avalon') {
	        this.assignMerlin();
	      }
	    }
	  }, {
	    key: 'assignMerlin',
	    value: function assignMerlin() {
	      var players = this.players;
	      var numPlayers = this.numPlayers;

	      var player = players[Math.floor(Math.random() * numPlayers)];

	      while (player.role !== 'resistance') {
	        player = players[Math.floor(Math.random() * numPlayers)];
	      }

	      this.push({
	        name: 'SetMerlin',
	        data: {
	          id: player.id,
	          roles: this.roles
	        }
	      });
	    }
	  }, {
	    key: 'setLeader',
	    value: function setLeader(position) {
	      var leader = this.leader = this.players[position];

	      this.leaderPosition = position;

	      this.push({
	        name: 'LeaderChange',
	        data: { id: leader.id }
	      });
	    }
	  }, {
	    key: 'enterMissionPhase',
	    value: function enterMissionPhase() {
	      this.failedVotes = this.receivedMissionCards = this.failCount = 0;
	      this.mission = this.missions[this.missionNumber];
	      this.enterTeamBuildingPhase();
	    }
	  }, {
	    key: 'enterTeamBuildingPhase',
	    value: function enterTeamBuildingPhase() {
	      this.receivedVotes = this.approveCount = 0;

	      this.push({
	        name: 'BuildTeam',
	        data: { numPlayers: this.mission.players }
	      });
	    }
	  }, {
	    key: 'moveLeaderToken',
	    value: function moveLeaderToken() {
	      var newLeaderPosition = (this.leaderPosition + 1) % this.numPlayers;

	      this.setLeader(newLeaderPosition);
	    }
	  }, {
	    key: 'setTeam',
	    value: function setTeam(players) {
	      var team = this.team = {};

	      players.forEach(function (id) {
	        return team[id] = true;
	      });
	    }
	  }, {
	    key: 'recordVote',
	    value: function recordVote(approve) {
	      var voteCount = this.receivedVotes += 1;

	      if (approve) {
	        this.approveCount += 1;
	      }

	      if (voteCount === this.numPlayers) {
	        this.calculateVotingResults();
	      }
	    }
	  }, {
	    key: 'calculateVotingResults',
	    value: function calculateVotingResults() {
	      var threshold = Math.floor(this.numPlayers / 2);
	      var approved = this.approveCount > threshold;

	      this.push({
	        name: 'VotingResults',
	        data: { approved: approved }
	      });

	      if (approved) {
	        this.push({
	          name: 'ConductMission',
	          data: { team: this.team }
	        });
	      } else {
	        this.voteFailed();
	      }
	    }
	  }, {
	    key: 'voteFailed',
	    value: function voteFailed() {
	      var failedVotes = this.failedVotes += 1;

	      if (failedVotes === 5) {
	        this.push({
	          name: 'GameOver',
	          data: {
	            winners: 'spies',
	            roles: this.roles
	          }
	        });
	      } else {
	        this.moveLeaderToken();
	        this.enterTeamBuildingPhase();
	      }
	    }
	  }, {
	    key: 'recordMissionCard',
	    value: function recordMissionCard(success) {
	      var missionCardCount = this.receivedMissionCards += 1;

	      if (!success) {
	        this.failCount += 1;
	      }

	      if (missionCardCount === this.mission.players) {
	        this.calculateMissionResults();
	      }
	    }
	  }, {
	    key: 'calculateMissionResults',
	    value: function calculateMissionResults() {
	      var _mission = this.mission;
	      var players = _mission.players;
	      var fails = _mission.fails;

	      var numFails = this.failCount;
	      var numSuccesses = players - numFails;
	      var missionCards = [];
	      var success = numFails < fails;

	      while (numFails-- > 0) {
	        missionCards.push(0);
	      }

	      while (numSuccesses-- > 0) {
	        missionCards.push(1);
	      }

	      missionCards = (0, _libUtils.shuffle)(missionCards);

	      this.push({
	        name: 'MissionResults',
	        data: { success: success, missionCards: missionCards }
	      });

	      if (success) {
	        this.resistanceWins += 1;
	      } else {
	        this.spyWins += 1;
	      }

	      if (this.gameOver) {
	        this.push({
	          name: 'GameOver',
	          data: {
	            winners: this.resistanceWins > this.spyWins ? 'resistance' : 'spies',
	            roles: this.roles
	          }
	        });
	      } else {
	        this.missionNumber += 1;
	        this.moveLeaderToken();
	        this.enterMissionPhase();
	      }
	    }
	  }, {
	    key: 'gameOver',
	    get: function get() {
	      return this.resistanceWins === 3 || this.spyWins === 3;
	    }
	  }, {
	    key: 'roles',
	    get: function get() {
	      return this.players.reduce(function (roles, player) {
	        roles[player.id] = {
	          role: player.role,
	          imageNumber: player.imageNumber
	        };

	        return roles;
	      }, {});
	    }
	  }]);

	  return Game;
	})();

	exports['default'] = Game;
	module.exports = exports['default'];

/***/ },
/* 71 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.shuffle = shuffle;

	function shuffle(arr) {
	  var currentIndex = arr.length;
	  var temp = undefined;
	  var randomIndex = undefined;

	  while (currentIndex) {
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	    temp = arr[currentIndex];
	    arr[currentIndex] = arr[randomIndex];
	    arr[randomIndex] = temp;
	  }

	  return arr;
	}

/***/ }
/******/ ])
});
;