import {
	initVueI18n as e
} from "@dcloudio/uni-i18n";
"undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ?
	global : "undefined" != typeof self && self;

function t(e) {
	return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e
}

function s(e, t, s) {
	return e(s = {
		path: t,
		exports: {},
		require: function(e, t) {
			return function() {
				throw new Error(
					"Dynamic requires are not currently supported by @rollup/plugin-commonjs")
			}(null == t && s.path)
		}
	}, s.exports), s.exports
}
var n = s((function(e, t) {
		var s;
		e.exports = (s = s || function(e, t) {
			var s = Object.create || function() {
					function e() {}
					return function(t) {
						var s;
						return e.prototype = t, s = new e, e.prototype = null, s
					}
				}(),
				n = {},
				r = n.lib = {},
				o = r.Base = {
					extend: function(e) {
						var t = s(this);
						return e && t.mixIn(e), t.hasOwnProperty("init") && this.init !== t.init ||
							(t.init = function() {
								t.$super.init.apply(this, arguments)
							}), t.init.prototype = t, t.$super = this, t
					},
					create: function() {
						var e = this.extend();
						return e.init.apply(e, arguments), e
					},
					init: function() {},
					mixIn: function(e) {
						for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
						e.hasOwnProperty("toString") && (this.toString = e.toString)
					},
					clone: function() {
						return this.init.prototype.extend(this)
					}
				},
				i = r.WordArray = o.extend({
					init: function(e, t) {
						e = this.words = e || [], this.sigBytes = null != t ? t : 4 * e.length
					},
					toString: function(e) {
						return (e || c).stringify(this)
					},
					concat: function(e) {
						var t = this.words,
							s = e.words,
							n = this.sigBytes,
							r = e.sigBytes;
						if (this.clamp(), n % 4)
							for (var o = 0; o < r; o++) {
								var i = s[o >>> 2] >>> 24 - o % 4 * 8 & 255;
								t[n + o >>> 2] |= i << 24 - (n + o) % 4 * 8
							} else
								for (o = 0; o < r; o += 4) t[n + o >>> 2] = s[o >>> 2];
						return this.sigBytes += r, this
					},
					clamp: function() {
						var t = this.words,
							s = this.sigBytes;
						t[s >>> 2] &= 4294967295 << 32 - s % 4 * 8, t.length = e.ceil(s / 4)
					},
					clone: function() {
						var e = o.clone.call(this);
						return e.words = this.words.slice(0), e
					},
					random: function(t) {
						for (var s, n = [], r = function(t) {
								t = t;
								var s = 987654321,
									n = 4294967295;
								return function() {
									var r = ((s = 36969 * (65535 & s) + (s >> 16) &
										n) << 16) + (t = 18e3 * (65535 & t) + (t >>
										16) & n) & n;
									return r /= 4294967296, (r += .5) * (e.random() >
										.5 ? 1 : -1)
								}
							}, o = 0; o < t; o += 4) {
							var a = r(4294967296 * (s || e.random()));
							s = 987654071 * a(), n.push(4294967296 * a() | 0)
						}
						return new i.init(n, t)
					}
				}),
				a = n.enc = {},
				c = a.Hex = {
					stringify: function(e) {
						for (var t = e.words, s = e.sigBytes, n = [], r = 0; r < s; r++) {
							var o = t[r >>> 2] >>> 24 - r % 4 * 8 & 255;
							n.push((o >>> 4).toString(16)), n.push((15 & o).toString(16))
						}
						return n.join("")
					},
					parse: function(e) {
						for (var t = e.length, s = [], n = 0; n < t; n += 2) s[n >>> 3] |= parseInt(
							e.substr(n, 2), 16) << 24 - n % 8 * 4;
						return new i.init(s, t / 2)
					}
				},
				u = a.Latin1 = {
					stringify: function(e) {
						for (var t = e.words, s = e.sigBytes, n = [], r = 0; r < s; r++) {
							var o = t[r >>> 2] >>> 24 - r % 4 * 8 & 255;
							n.push(String.fromCharCode(o))
						}
						return n.join("")
					},
					parse: function(e) {
						for (var t = e.length, s = [], n = 0; n < t; n++) s[n >>> 2] |= (255 & e
							.charCodeAt(n)) << 24 - n % 4 * 8;
						return new i.init(s, t)
					}
				},
				h = a.Utf8 = {
					stringify: function(e) {
						try {
							return decodeURIComponent(escape(u.stringify(e)))
						} catch (e) {
							throw new Error("Malformed UTF-8 data")
						}
					},
					parse: function(e) {
						return u.parse(unescape(encodeURIComponent(e)))
					}
				},
				l = r.BufferedBlockAlgorithm = o.extend({
					reset: function() {
						this._data = new i.init, this._nDataBytes = 0
					},
					_append: function(e) {
						"string" == typeof e && (e = h.parse(e)), this._data.concat(e), this
							._nDataBytes += e.sigBytes
					},
					_process: function(t) {
						var s = this._data,
							n = s.words,
							r = s.sigBytes,
							o = this.blockSize,
							a = r / (4 * o),
							c = (a = t ? e.ceil(a) : e.max((0 | a) - this._minBufferSize, 0)) *
							o,
							u = e.min(4 * c, r);
						if (c) {
							for (var h = 0; h < c; h += o) this._doProcessBlock(n, h);
							var l = n.splice(0, c);
							s.sigBytes -= u
						}
						return new i.init(l, u)
					},
					clone: function() {
						var e = o.clone.call(this);
						return e._data = this._data.clone(), e
					},
					_minBufferSize: 0
				}),
				d = (r.Hasher = l.extend({
					cfg: o.extend(),
					init: function(e) {
						this.cfg = this.cfg.extend(e), this.reset()
					},
					reset: function() {
						l.reset.call(this), this._doReset()
					},
					update: function(e) {
						return this._append(e), this._process(), this
					},
					finalize: function(e) {
						return e && this._append(e), this._doFinalize()
					},
					blockSize: 16,
					_createHelper: function(e) {
						return function(t, s) {
							return new e.init(s).finalize(t)
						}
					},
					_createHmacHelper: function(e) {
						return function(t, s) {
							return new d.HMAC.init(e, s).finalize(t)
						}
					}
				}), n.algo = {});
			return n
		}(Math), s)
	})),
	r = (s((function(e, t) {
		var s;
		e.exports = (s = n, function(e) {
			var t = s,
				n = t.lib,
				r = n.WordArray,
				o = n.Hasher,
				i = t.algo,
				a = [];
			! function() {
				for (var t = 0; t < 64; t++) a[t] = 4294967296 * e.abs(e.sin(t + 1)) | 0
			}();
			var c = i.MD5 = o.extend({
				_doReset: function() {
					this._hash = new r.init([1732584193, 4023233417, 2562383102,
						271733878
					])
				},
				_doProcessBlock: function(e, t) {
					for (var s = 0; s < 16; s++) {
						var n = t + s,
							r = e[n];
						e[n] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 |
							r >>> 8)
					}
					var o = this._hash.words,
						i = e[t + 0],
						c = e[t + 1],
						f = e[t + 2],
						p = e[t + 3],
						g = e[t + 4],
						m = e[t + 5],
						y = e[t + 6],
						_ = e[t + 7],
						v = e[t + 8],
						w = e[t + 9],
						S = e[t + 10],
						T = e[t + 11],
						k = e[t + 12],
						A = e[t + 13],
						P = e[t + 14],
						I = e[t + 15],
						E = o[0],
						O = o[1],
						U = o[2],
						b = o[3];
					E = u(E, O, U, b, i, 7, a[0]), b = u(b, E, O, U, c, 12, a[1]), U =
						u(U, b, E, O, f, 17, a[2]), O = u(O, U, b, E, p, 22, a[3]), E =
						u(E, O, U, b, g, 7, a[4]), b = u(b, E, O, U, m, 12, a[5]), U =
						u(U, b, E, O, y, 17, a[6]), O = u(O, U, b, E, _, 22, a[7]), E =
						u(E, O, U, b, v, 7, a[8]), b = u(b, E, O, U, w, 12, a[9]), U =
						u(U, b, E, O, S, 17, a[10]), O = u(O, U, b, E, T, 22, a[11]),
						E = u(E, O, U, b, k, 7, a[12]), b = u(b, E, O, U, A, 12, a[13]),
						U = u(U, b, E, O, P, 17, a[14]), E = h(E, O = u(O, U, b, E, I,
							22, a[15]), U, b, c, 5, a[16]), b = h(b, E, O, U, y, 9, a[
							17]), U = h(U, b, E, O, T, 14, a[18]), O = h(O, U, b, E, i,
							20, a[19]), E = h(E, O, U, b, m, 5, a[20]), b = h(b, E, O,
							U, S, 9, a[21]), U = h(U, b, E, O, I, 14, a[22]), O = h(O,
							U, b, E, g, 20, a[23]), E = h(E, O, U, b, w, 5, a[24]), b =
						h(b, E, O, U, P, 9, a[25]), U = h(U, b, E, O, p, 14, a[26]), O =
						h(O, U, b, E, v, 20, a[27]), E = h(E, O, U, b, A, 5, a[28]), b =
						h(b, E, O, U, f, 9, a[29]), U = h(U, b, E, O, _, 14, a[30]), E =
						l(E, O = h(O, U, b, E, k, 20, a[31]), U, b, m, 4, a[32]), b = l(
							b, E, O, U, v, 11, a[33]), U = l(U, b, E, O, T, 16, a[34]),
						O = l(O, U, b, E, P, 23, a[35]), E = l(E, O, U, b, c, 4, a[36]),
						b = l(b, E, O, U, g, 11, a[37]), U = l(U, b, E, O, _, 16, a[
						38]), O = l(O, U, b, E, S, 23, a[39]), E = l(E, O, U, b, A, 4,
							a[40]), b = l(b, E, O, U, i, 11, a[41]), U = l(U, b, E, O,
							p, 16, a[42]), O = l(O, U, b, E, y, 23, a[43]), E = l(E, O,
							U, b, w, 4, a[44]), b = l(b, E, O, U, k, 11, a[45]), U = l(
							U, b, E, O, I, 16, a[46]), E = d(E, O = l(O, U, b, E, f, 23,
							a[47]), U, b, i, 6, a[48]), b = d(b, E, O, U, _, 10, a[49]),
						U = d(U, b, E, O, P, 15, a[50]), O = d(O, U, b, E, m, 21, a[
						51]), E = d(E, O, U, b, k, 6, a[52]), b = d(b, E, O, U, p, 10,
							a[53]), U = d(U, b, E, O, S, 15, a[54]), O = d(O, U, b, E,
							c, 21, a[55]), E = d(E, O, U, b, v, 6, a[56]), b = d(b, E,
							O, U, I, 10, a[57]), U = d(U, b, E, O, y, 15, a[58]), O = d(
							O, U, b, E, A, 21, a[59]), E = d(E, O, U, b, g, 6, a[60]),
						b = d(b, E, O, U, T, 10, a[61]), U = d(U, b, E, O, f, 15, a[
						62]), O = d(O, U, b, E, w, 21, a[63]), o[0] = o[0] + E | 0, o[
						1] = o[1] + O | 0, o[2] = o[2] + U | 0, o[3] = o[3] + b | 0
				},
				_doFinalize: function() {
					var t = this._data,
						s = t.words,
						n = 8 * this._nDataBytes,
						r = 8 * t.sigBytes;
					s[r >>> 5] |= 128 << 24 - r % 32;
					var o = e.floor(n / 4294967296),
						i = n;
					s[15 + (r + 64 >>> 9 << 4)] = 16711935 & (o << 8 | o >>> 24) |
						4278255360 & (o << 24 | o >>> 8), s[14 + (r + 64 >>> 9 << 4)] =
						16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>>
							8), t.sigBytes = 4 * (s.length + 1), this._process();
					for (var a = this._hash, c = a.words, u = 0; u < 4; u++) {
						var h = c[u];
						c[u] = 16711935 & (h << 8 | h >>> 24) | 4278255360 & (h << 24 |
							h >>> 8)
					}
					return a
				},
				clone: function() {
					var e = o.clone.call(this);
					return e._hash = this._hash.clone(), e
				}
			});

			function u(e, t, s, n, r, o, i) {
				var a = e + (t & s | ~t & n) + r + i;
				return (a << o | a >>> 32 - o) + t
			}

			function h(e, t, s, n, r, o, i) {
				var a = e + (t & n | s & ~n) + r + i;
				return (a << o | a >>> 32 - o) + t
			}

			function l(e, t, s, n, r, o, i) {
				var a = e + (t ^ s ^ n) + r + i;
				return (a << o | a >>> 32 - o) + t
			}

			function d(e, t, s, n, r, o, i) {
				var a = e + (s ^ (t | ~n)) + r + i;
				return (a << o | a >>> 32 - o) + t
			}
			t.MD5 = o._createHelper(c), t.HmacMD5 = o._createHmacHelper(c)
		}(Math), s.MD5)
	})), s((function(e, t) {
		var s, r, o;
		e.exports = (r = (s = n).lib.Base, o = s.enc.Utf8, void(s.algo.HMAC = r.extend({
			init: function(e, t) {
				e = this._hasher = new e.init, "string" == typeof t && (t = o.parse(t));
				var s = e.blockSize,
					n = 4 * s;
				t.sigBytes > n && (t = e.finalize(t)), t.clamp();
				for (var r = this._oKey = t.clone(), i = this._iKey = t.clone(), a = r
						.words, c = i.words, u = 0; u < s; u++) a[u] ^= 1549556828, c[
					u] ^= 909522486;
				r.sigBytes = i.sigBytes = n, this.reset()
			},
			reset: function() {
				var e = this._hasher;
				e.reset(), e.update(this._iKey)
			},
			update: function(e) {
				return this._hasher.update(e), this
			},
			finalize: function(e) {
				var t = this._hasher,
					s = t.finalize(e);
				return t.reset(), t.finalize(this._oKey.clone().concat(s))
			}
		})))
	})), s((function(e, t) {
		e.exports = n.HmacMD5
	})));

function o(e) {
	return function(t) {
		if (!((t = t || {}).success || t.fail || t.complete)) return e.call(this, t);
		e.call(this, t).then(e => {
			t.success && t.success(e), t.complete && t.complete(e)
		}, e => {
			t.fail && t.fail(e), t.complete && t.complete(e)
		})
	}
}
class i extends Error {
	constructor(e) {
		super(e.message), this.errMsg = e.message || "", Object.defineProperties(this, {
			code: {
				get: () => e.code
			},
			requestId: {
				get: () => e.requestId
			},
			message: {
				get() {
					return this.errMsg
				},
				set(e) {
					this.errMsg = e
				}
			}
		})
	}
}
const {
	t: a,
	setLocale: c,
	getLocale: u
} = e({
	"zh-Hans": {
		"uniCloud.init.paramRequired": "缺少参数：{param}",
		"uniCloud.uploadFile.fileError": "filePath应为File对象"
	},
	"zh-Hant": {
		"uniCloud.init.paramRequired": "缺少参数：{param}",
		"uniCloud.uploadFile.fileError": "filePath应为File对象"
	},
	en: {
		"uniCloud.init.paramRequired": "{param} required",
		"uniCloud.uploadFile.fileError": "filePath should be instance of File"
	},
	fr: {
		"uniCloud.init.paramRequired": "{param} required",
		"uniCloud.uploadFile.fileError": "filePath should be instance of File"
	},
	es: {
		"uniCloud.init.paramRequired": "{param} required",
		"uniCloud.uploadFile.fileError": "filePath should be instance of File"
	}
}, "zh-Hans");
let h, l, d;
try {
	h = require("uni-stat-config").default || require("uni-stat-config")
} catch (e) {
	h = {
		appid: ""
	}
}

function f(e = 8) {
	let t = "";
	for (; t.length < e;) t += Math.random().toString(32).substring(2);
	return t.substring(0, e)
}

function p() {
	if ("n" === g()) {
		try {
			l = plus.runtime.getDCloudId()
		} catch (e) {
			l = ""
		}
		return l
	}
	return l || (l = f(32), uni.setStorage({
		key: "__DC_CLOUD_UUID",
		data: l
	})), l
}

function g() {
	return {
		"app-plus": "n",
		h5: "h5",
		"mp-weixin": "wx",
		[
			["y", "a", "p", "mp-ali"].reverse().join("")
		]: "ali",
		"mp-baidu": "bd",
		"mp-toutiao": "tt",
		"mp-qq": "qq",
		"quickapp-native": "qn"
	} [process.env.VUE_APP_PLATFORM]
}
var m = {
	sign: function(e, t) {
		let s = "";
		return Object.keys(e).sort().forEach((function(t) {
			e[t] && (s = s + "&" + t + "=" + e[t])
		})), s = s.slice(1), r(s, t).toString()
	},
	wrappedRequest: function(e, t) {
		return new Promise((s, n) => {
			t(Object.assign(e, {
				complete(e) {
					e || (e = {}), "h5" === process.env.VUE_APP_PLATFORM &&
						"development" === process.env.NODE_ENV && e.errMsg && 0 === e.errMsg
						.indexOf("request:fail") && console.warn(
							"发布H5，需要在uniCloud后台操作，绑定安全域名，否则会因为跨域问题而无法访问。教程参考：https://uniapp.dcloud.io/uniCloud/quickstart?id=useinh5"
							);
					const t = e.data && e.data.header && e.data.header[
						"x-serverless-request-id"] || e.header && e.header["request-id"];
					if (!e.statusCode || e.statusCode >= 400) return n(new i({
						code: "SYS_ERR",
						message: e.errMsg || "request:fail",
						requestId: t
					}));
					const r = e.data;
					if (r.error) return n(new i({
						code: r.error.code,
						message: r.error.message,
						requestId: t
					}));
					r.result = r.data, r.requestId = t, delete r.data, s(r)
				}
			}))
		})
	}
};
const y = {
	request: e => uni.request(e),
	uploadFile: e => uni.uploadFile(e),
	setStorageSync: (e, t) => uni.setStorageSync(e, t),
	getStorageSync: e => uni.getStorageSync(e),
	removeStorageSync: e => uni.removeStorageSync(e),
	clearStorageSync: () => uni.clearStorageSync()
};
class _ {
	constructor(e) {
		["spaceId", "clientSecret"].forEach(t => {
				if (!Object.prototype.hasOwnProperty.call(e, t)) throw new Error(a(
					"uniCloud.init.paramRequired", {
						param: t
					}))
			}), this.config = Object.assign({}, {
				endpoint: "https://api.bspapp.com"
			}, e), this.config.provider = "aliyun", this.config.requestUrl = this.config.endpoint + "/client", this
			.config.envType = this.config.envType || "public", this.config.accessTokenKey = "access_token_" + this
			.config.spaceId, this.adapter = y
	}
	get hasAccessToken() {
		return !!this.accessToken
	}
	setAccessToken(e) {
		this.accessToken = e
	}
	requestWrapped(e) {
		return m.wrappedRequest(e, this.adapter.request)
	}
	requestAuth(e) {
		return this.requestWrapped(e)
	}
	request(e, t) {
		return Promise.resolve().then(() => this.hasAccessToken ? t ? this.requestWrapped(e) : this.requestWrapped(
			e).catch(t => new Promise((e, s) => {
			!t || "GATEWAY_INVALID_TOKEN" !== t.code && "InvalidParameter.InvalidToken" !== t.code ?
				s(t) : e()
		}).then(() => this.getAccessToken()).then(() => {
			const t = this.rebuildRequest(e);
			return this.request(t, !0)
		})) : this.getAccessToken().then(() => {
			const t = this.rebuildRequest(e);
			return this.request(t, !0)
		}))
	}
	rebuildRequest(e) {
		const t = Object.assign({}, e);
		return t.data.token = this.accessToken, t.header["x-basement-token"] = this.accessToken, t.header[
			"x-serverless-sign"] = m.sign(t.data, this.config.clientSecret), t
	}
	setupRequest(e, t) {
		const s = Object.assign({}, e, {
				spaceId: this.config.spaceId,
				timestamp: Date.now()
			}),
			n = {
				"Content-Type": "application/json"
			};
		return "auth" !== t && (s.token = this.accessToken, n["x-basement-token"] = this.accessToken), n[
			"x-serverless-sign"] = m.sign(s, this.config.clientSecret), {
			url: this.config.requestUrl,
			method: "POST",
			data: s,
			dataType: "json",
			header: n
		}
	}
	getAccessToken() {
		return this.requestAuth(this.setupRequest({
			method: "serverless.auth.user.anonymousAuthorize",
			params: "{}"
		}, "auth")).then(e => new Promise((t, s) => {
			e.result && e.result.accessToken ? (this.setAccessToken(e.result.accessToken), t(this
				.accessToken)) : s(new i({
				code: "AUTH_FAILED",
				message: "获取accessToken失败"
			}))
		}))
	}
	authorize() {
		this.getAccessToken()
	}
	callFunction(e) {
		const t = {
			method: "serverless.function.runtime.invoke",
			params: JSON.stringify({
				functionTarget: e.name,
				functionArgs: e.data || {}
			})
		};
		return this.request(this.setupRequest(t))
	}
	getOSSUploadOptionsFromPath(e) {
		const t = {
			method: "serverless.file.resource.generateProximalSign",
			params: JSON.stringify(e)
		};
		return this.request(this.setupRequest(t))
	}
	uploadFileToOSS({
		url: e,
		formData: t,
		name: s,
		filePath: n,
		fileType: r,
		onUploadProgress: o
	}) {
		return new Promise((a, c) => {
			const u = this.adapter.uploadFile({
				url: e,
				formData: t,
				name: s,
				filePath: n,
				fileType: r,
				header: {
					"X-OSS-server-side-encrpytion": "AES256"
				},
				success(e) {
					e && e.statusCode < 400 ? a(e) : c(new i({
						code: "UPLOAD_FAILED",
						message: "文件上传失败"
					}))
				},
				fail(e) {
					c(new i({
						code: e.code || "UPLOAD_FAILED",
						message: e.message || e.errMsg || "文件上传失败"
					}))
				}
			});
			"function" == typeof o && u && "function" == typeof u.onProgressUpdate && u.onProgressUpdate(
				e => {
					o({
						loaded: e.totalBytesSent,
						total: e.totalBytesExpectedToSend
					})
				})
		})
	}
	reportOSSUpload(e) {
		const t = {
			method: "serverless.file.resource.report",
			params: JSON.stringify(e)
		};
		return this.request(this.setupRequest(t))
	}
	uploadFile({
		filePath: e,
		cloudPath: t,
		fileType: s = "image",
		onUploadProgress: n,
		config: r
	}) {
		if (!t) throw new i({
			code: "CLOUDPATH_REQUIRED",
			message: "cloudPath不可为空"
		});
		const o = r && r.envType || this.config.envType;
		let a, c;
		return this.getOSSUploadOptionsFromPath({
			env: o,
			filename: t
		}).then(t => {
			const r = t.result;
			a = r.id, c = "https://" + r.cdnDomain + "/" + r.ossPath;
			const o = {
				url: "https://" + r.host,
				formData: {
					"Cache-Control": "max-age=2592000",
					"Content-Disposition": "attachment",
					OSSAccessKeyId: r.accessKeyId,
					Signature: r.signature,
					host: r.host,
					id: a,
					key: r.ossPath,
					policy: r.policy,
					success_action_status: 200
				},
				fileName: "file",
				name: "file",
				filePath: e,
				fileType: s
			};
			return this.uploadFileToOSS(Object.assign({}, o, {
				onUploadProgress: n
			}))
		}).then(() => this.reportOSSUpload({
			id: a
		})).then(t => new Promise((s, n) => {
			t.success ? s({
				success: !0,
				filePath: e,
				fileID: c
			}) : n(new i({
				code: "UPLOAD_FAILED",
				message: "文件上传失败"
			}))
		}))
	}
	deleteFile({
		fileList: e
	}) {
		const t = {
			method: "serverless.file.resource.delete",
			params: JSON.stringify({
				id: e[0]
			})
		};
		return this.request(this.setupRequest(t))
	}
	getTempFileURL({
		fileList: e
	} = {}) {
		return new Promise((t, s) => {
			Array.isArray(e) && 0 !== e.length || s(new i({
				code: "INVALID_PARAM",
				message: "fileList的元素必须是非空的字符串"
			})), t({
				fileList: e.map(e => ({
					fileID: e,
					tempFileURL: e
				}))
			})
		})
	}
}
const v = {
		init(e) {
			const t = new _(e);
			["deleteFile", "getTempFileURL"].forEach(e => {
				t[e] = o(t[e]).bind(t)
			});
			const s = {
				signInAnonymously: function() {
					return t.authorize()
				},
				getLoginState: function() {
					return Promise.resolve(!1)
				}
			};
			return t.auth = function() {
				return s
			}, t.customAuth = t.auth, t
		}
	},
	w = "undefined" != typeof location && "http:" === location.protocol ? "http:" : "https:",
	S = "undefined" != typeof process && "e2e" === process.env.NODE_ENV && "pre" === process.env.END_POINT ?
	"//tcb-pre.tencentcloudapi.com/web" : "//tcb-api.tencentcloudapi.com/web";
var T;
! function(e) {
	e.local = "local", e.none = "none", e.session = "session"
}(T || (T = {}));
var k = function() {};
s((function(e, t) {
	var s;
	e.exports = (s = n, function(e) {
		var t = s,
			n = t.lib,
			r = n.WordArray,
			o = n.Hasher,
			i = t.algo,
			a = [],
			c = [];
		! function() {
			function t(t) {
				for (var s = e.sqrt(t), n = 2; n <= s; n++)
					if (!(t % n)) return !1;
				return !0
			}

			function s(e) {
				return 4294967296 * (e - (0 | e)) | 0
			}
			for (var n = 2, r = 0; r < 64;) t(n) && (r < 8 && (a[r] = s(e.pow(n, .5))), c[r] = s(e
				.pow(n, 1 / 3)), r++), n++
		}();
		var u = [],
			h = i.SHA256 = o.extend({
				_doReset: function() {
					this._hash = new r.init(a.slice(0))
				},
				_doProcessBlock: function(e, t) {
					for (var s = this._hash.words, n = s[0], r = s[1], o = s[2], i = s[3],
							a = s[4], h = s[5], l = s[6], d = s[7], f = 0; f < 64; f++) {
						if (f < 16) u[f] = 0 | e[t + f];
						else {
							var p = u[f - 15],
								g = (p << 25 | p >>> 7) ^ (p << 14 | p >>> 18) ^ p >>> 3,
								m = u[f - 2],
								y = (m << 15 | m >>> 17) ^ (m << 13 | m >>> 19) ^ m >>> 10;
							u[f] = g + u[f - 7] + y + u[f - 16]
						}
						var _ = n & r ^ n & o ^ r & o,
							v = (n << 30 | n >>> 2) ^ (n << 19 | n >>> 13) ^ (n << 10 |
								n >>> 22),
							w = d + ((a << 26 | a >>> 6) ^ (a << 21 | a >>> 11) ^ (a << 7 |
								a >>> 25)) + (a & h ^ ~a & l) + c[f] + u[f];
						d = l, l = h, h = a, a = i + w | 0, i = o, o = r, r = n, n = w + (
							v + _) | 0
					}
					s[0] = s[0] + n | 0, s[1] = s[1] + r | 0, s[2] = s[2] + o | 0, s[3] = s[
						3] + i | 0, s[4] = s[4] + a | 0, s[5] = s[5] + h | 0, s[6] = s[
						6] + l | 0, s[7] = s[7] + d | 0
				},
				_doFinalize: function() {
					var t = this._data,
						s = t.words,
						n = 8 * this._nDataBytes,
						r = 8 * t.sigBytes;
					return s[r >>> 5] |= 128 << 24 - r % 32, s[14 + (r + 64 >>> 9 << 4)] = e
						.floor(n / 4294967296), s[15 + (r + 64 >>> 9 << 4)] = n, t
						.sigBytes = 4 * s.length, this._process(), this._hash
				},
				clone: function() {
					var e = o.clone.call(this);
					return e._hash = this._hash.clone(), e
				}
			});
		t.SHA256 = o._createHelper(h), t.HmacSHA256 = o._createHmacHelper(h)
	}(Math), s.SHA256)
})), s((function(e, t) {
	e.exports = n.HmacSHA256
})), s((function(e, t) {
	var s, r, o;
	e.exports = (r = (s = o = n).lib.WordArray, s.enc.Base64 = {
		stringify: function(e) {
			var t = e.words,
				s = e.sigBytes,
				n = this._map;
			e.clamp();
			for (var r = [], o = 0; o < s; o += 3)
				for (var i = (t[o >>> 2] >>> 24 - o % 4 * 8 & 255) << 16 | (t[o + 1 >>> 2] >>>
							24 - (o + 1) % 4 * 8 & 255) << 8 | t[o + 2 >>> 2] >>> 24 - (o + 2) %
						4 * 8 & 255, a = 0; a < 4 && o + .75 * a < s; a++) r.push(n.charAt(i >>>
					6 * (3 - a) & 63));
			var c = n.charAt(64);
			if (c)
				for (; r.length % 4;) r.push(c);
			return r.join("")
		},
		parse: function(e) {
			var t = e.length,
				s = this._map,
				n = this._reverseMap;
			if (!n) {
				n = this._reverseMap = [];
				for (var o = 0; o < s.length; o++) n[s.charCodeAt(o)] = o
			}
			var i = s.charAt(64);
			if (i) {
				var a = e.indexOf(i); - 1 !== a && (t = a)
			}
			return function(e, t, s) {
				for (var n = [], o = 0, i = 0; i < t; i++)
					if (i % 4) {
						var a = s[e.charCodeAt(i - 1)] << i % 4 * 2,
							c = s[e.charCodeAt(i)] >>> 6 - i % 4 * 2;
						n[o >>> 2] |= (a | c) << 24 - o % 4 * 8, o++
					} return r.create(n, o)
			}(e, t, n)
		},
		_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
	}, o.enc.Base64)
})), s((function(e, t) {
	e.exports = n.enc.Utf8
}));
const A = () => {
	let e;
	if (!Promise) {
		e = () => {}, e.promise = {};
		const t = () => {
			throw new Error(
				'Your Node runtime does support ES6 Promises. Set "global.Promise" to your preferred implementation of promises.'
				)
		};
		return Object.defineProperty(e.promise, "then", {
			get: t
		}), Object.defineProperty(e.promise, "catch", {
			get: t
		}), e
	}
	const t = new Promise((t, s) => {
		e = (e, n) => e ? s(e) : t(n)
	});
	return e.promise = t, e
};

function P(e) {
	return void 0 === e
}

function I(e) {
	return "[object Null]" === Object.prototype.toString.call(e)
}
var E;

function O(e) {
	const t = (s = e, "[object Array]" === Object.prototype.toString.call(s) ? e : [e]);
	var s;
	for (const e of t) {
		const {
			isMatch: t,
			genAdapter: s,
			runtime: n
		} = e;
		if (t()) return {
			adapter: s(),
			runtime: n
		}
	}
}! function(e) {
	e.WEB = "web", e.WX_MP = "wx_mp"
}(E || (E = {}));
const U = {
		adapter: null,
		runtime: void 0
	},
	b = ["anonymousUuidKey"];
class D extends k {
	constructor() {
		super(), U.adapter.root.tcbObject || (U.adapter.root.tcbObject = {})
	}
	setItem(e, t) {
		U.adapter.root.tcbObject[e] = t
	}
	getItem(e) {
		return U.adapter.root.tcbObject[e]
	}
	removeItem(e) {
		delete U.adapter.root.tcbObject[e]
	}
	clear() {
		delete U.adapter.root.tcbObject
	}
}

function C(e, t) {
	switch (e) {
		case "local":
			return t.localStorage || new D;
		case "none":
			return new D;
		default:
			return t.sessionStorage || new D
	}
}
class R {
	constructor(e) {
		if (!this._storage) {
			this._persistence = U.adapter.primaryStorage || e.persistence, this._storage = C(this._persistence, U
				.adapter);
			const t = "access_token_" + e.env,
				s = "access_token_expire_" + e.env,
				n = "refresh_token_" + e.env,
				r = "anonymous_uuid_" + e.env,
				o = "login_type_" + e.env,
				i = "user_info_" + e.env;
			this.keys = {
				accessTokenKey: t,
				accessTokenExpireKey: s,
				refreshTokenKey: n,
				anonymousUuidKey: r,
				loginTypeKey: o,
				userInfoKey: i
			}
		}
	}
	updatePersistence(e) {
		if (e === this._persistence) return;
		const t = "local" === this._persistence;
		this._persistence = e;
		const s = C(e, U.adapter);
		for (const e in this.keys) {
			const n = this.keys[e];
			if (t && b.includes(e)) continue;
			const r = this._storage.getItem(n);
			P(r) || I(r) || (s.setItem(n, r), this._storage.removeItem(n))
		}
		this._storage = s
	}
	setStore(e, t, s) {
		if (!this._storage) return;
		const n = {
				version: s || "localCachev1",
				content: t
			},
			r = JSON.stringify(n);
		try {
			this._storage.setItem(e, r)
		} catch (e) {
			throw e
		}
	}
	getStore(e, t) {
		try {
			if (!this._storage) return
		} catch (e) {
			return ""
		}
		t = t || "localCachev1";
		const s = this._storage.getItem(e);
		if (!s) return "";
		if (s.indexOf(t) >= 0) {
			return JSON.parse(s).content
		}
		return ""
	}
	removeStore(e) {
		this._storage.removeItem(e)
	}
}
const x = {},
	q = {};

function F(e) {
	return x[e]
}
class L {
	constructor(e, t) {
		this.data = t || null, this.name = e
	}
}
class N extends L {
	constructor(e, t) {
		super("error", {
			error: e,
			data: t
		}), this.error = e
	}
}
const M = new class {
	constructor() {
		this._listeners = {}
	}
	on(e, t) {
		return function(e, t, s) {
			s[e] = s[e] || [], s[e].push(t)
		}(e, t, this._listeners), this
	}
	off(e, t) {
		return function(e, t, s) {
			if (s && s[e]) {
				const n = s[e].indexOf(t); - 1 !== n && s[e].splice(n, 1)
			}
		}(e, t, this._listeners), this
	}
	fire(e, t) {
		if (e instanceof N) return console.error(e.error), this;
		const s = "string" == typeof e ? new L(e, t || {}) : e;
		const n = s.name;
		if (this._listens(n)) {
			s.target = this;
			const e = this._listeners[n] ? [...this._listeners[n]] : [];
			for (const t of e) t.call(this, s)
		}
		return this
	}
	_listens(e) {
		return this._listeners[e] && this._listeners[e].length > 0
	}
};

function $(e, t) {
	M.on(e, t)
}

function K(e, t = {}) {
	M.fire(e, t)
}

function B(e, t) {
	M.off(e, t)
}
const j = "loginStateChanged",
	H = "loginStateExpire",
	W = "loginTypeChanged",
	V = "anonymousConverted",
	z = "refreshAccessToken";
var Y;
! function(e) {
	e.ANONYMOUS = "ANONYMOUS", e.WECHAT = "WECHAT", e.WECHAT_PUBLIC = "WECHAT-PUBLIC", e.WECHAT_OPEN = "WECHAT-OPEN", e
		.CUSTOM = "CUSTOM", e.EMAIL = "EMAIL", e.USERNAME = "USERNAME", e.NULL = "NULL"
}(Y || (Y = {}));
const J = ["auth.getJwt", "auth.logout", "auth.signInWithTicket", "auth.signInAnonymously", "auth.signIn",
		"auth.fetchAccessTokenWithRefreshToken", "auth.signUpWithEmailAndPassword", "auth.activateEndUserMail",
		"auth.sendPasswordResetEmail", "auth.resetPasswordWithToken", "auth.isUsernameRegistered"
	],
	X = {
		"X-SDK-Version": "1.3.5"
	};

function G(e, t, s) {
	const n = e[t];
	e[t] = function(t) {
		const r = {},
			o = {};
		s.forEach(s => {
			const {
				data: n,
				headers: i
			} = s.call(e, t);
			Object.assign(r, n), Object.assign(o, i)
		});
		const i = t.data;
		return i && (() => {
			var e;
			if (e = i, "[object FormData]" !== Object.prototype.toString.call(e)) t.data = {
				...i,
				...r
			};
			else
				for (const e in r) i.append(e, r[e])
		})(), t.headers = {
			...t.headers || {},
			...o
		}, n.call(e, t)
	}
}

function Q() {
	const e = Math.random().toString(16).slice(2);
	return {
		data: {
			seqId: e
		},
		headers: {
			...X,
			"x-seqid": e
		}
	}
}
class Z {
	constructor(e = {}) {
		var t;
		this.config = e, this._reqClass = new U.adapter.reqClass({
			timeout: this.config.timeout,
			timeoutMsg: `请求在${this.config.timeout/1e3}s内未完成，已中断`,
			restrictedMethods: ["post"]
		}), this._cache = F(this.config.env), this._localCache = (t = this.config.env, q[t]), G(this._reqClass,
			"post", [Q]), G(this._reqClass, "upload", [Q]), G(this._reqClass, "download", [Q])
	}
	async post(e) {
		return await this._reqClass.post(e)
	}
	async upload(e) {
		return await this._reqClass.upload(e)
	}
	async download(e) {
		return await this._reqClass.download(e)
	}
	async refreshAccessToken() {
		let e, t;
		this._refreshAccessTokenPromise || (this._refreshAccessTokenPromise = this._refreshAccessToken());
		try {
			e = await this._refreshAccessTokenPromise
		} catch (e) {
			t = e
		}
		if (this._refreshAccessTokenPromise = null, this._shouldRefreshAccessTokenHook = null, t) throw t;
		return e
	}
	async _refreshAccessToken() {
		const {
			accessTokenKey: e,
			accessTokenExpireKey: t,
			refreshTokenKey: s,
			loginTypeKey: n,
			anonymousUuidKey: r
		} = this._cache.keys;
		this._cache.removeStore(e), this._cache.removeStore(t);
		let o = this._cache.getStore(s);
		if (!o) throw new Error("未登录CloudBase");
		const i = {
				refresh_token: o
			},
			a = await this.request("auth.fetchAccessTokenWithRefreshToken", i);
		if (a.data.code) {
			const {
				code: e
			} = a.data;
			if ("SIGN_PARAM_INVALID" === e || "REFRESH_TOKEN_EXPIRED" === e || "INVALID_REFRESH_TOKEN" === e) {
				if (this._cache.getStore(n) === Y.ANONYMOUS && "INVALID_REFRESH_TOKEN" === e) {
					const e = this._cache.getStore(r),
						t = this._cache.getStore(s),
						n = await this.send("auth.signInAnonymously", {
							anonymous_uuid: e,
							refresh_token: t
						});
					return this.setRefreshToken(n.refresh_token), this._refreshAccessToken()
				}
				K(H), this._cache.removeStore(s)
			}
			throw new Error("刷新access token失败：" + a.data.code)
		}
		if (a.data.access_token) return K(z), this._cache.setStore(e, a.data.access_token), this._cache.setStore(t,
			a.data.access_token_expire + Date.now()), {
			accessToken: a.data.access_token,
			accessTokenExpire: a.data.access_token_expire
		};
		a.data.refresh_token && (this._cache.removeStore(s), this._cache.setStore(s, a.data.refresh_token), this
			._refreshAccessToken())
	}
	async getAccessToken() {
		const {
			accessTokenKey: e,
			accessTokenExpireKey: t,
			refreshTokenKey: s
		} = this._cache.keys;
		if (!this._cache.getStore(s)) throw new Error("refresh token不存在，登录状态异常");
		let n = this._cache.getStore(e),
			r = this._cache.getStore(t),
			o = !0;
		return this._shouldRefreshAccessTokenHook && !await this._shouldRefreshAccessTokenHook(n, r) && (o = !1), (!
			n || !r || r < Date.now()) && o ? this.refreshAccessToken() : {
			accessToken: n,
			accessTokenExpire: r
		}
	}
	async request(e, t, s) {
		const n = "x-tcb-trace_" + this.config.env;
		let r = "application/x-www-form-urlencoded";
		const o = {
			action: e,
			env: this.config.env,
			dataVersion: "2019-08-16",
			...t
		};
		if (-1 === J.indexOf(e)) {
			const {
				refreshTokenKey: e
			} = this._cache.keys;
			this._cache.getStore(e) && (o.access_token = (await this.getAccessToken()).accessToken)
		}
		let i;
		if ("storage.uploadFile" === e) {
			i = new FormData;
			for (let e in i) i.hasOwnProperty(e) && void 0 !== i[e] && i.append(e, o[e]);
			r = "multipart/form-data"
		} else {
			r = "application/json;charset=UTF-8", i = {};
			for (let e in o) void 0 !== o[e] && (i[e] = o[e])
		}
		let a = {
			headers: {
				"content-type": r
			}
		};
		s && s.onUploadProgress && (a.onUploadProgress = s.onUploadProgress);
		const c = this._localCache.getStore(n);
		c && (a.headers["X-TCB-Trace"] = c);
		const {
			parse: u,
			inQuery: h,
			search: l
		} = t;
		let d = {
			env: this.config.env
		};
		u && (d.parse = !0), h && (d = {
			...h,
			...d
		});
		let f = function(e, t, s = {}) {
			const n = /\?/.test(t);
			let r = "";
			for (let e in s) "" === r ? !n && (t += "?") : r += "&", r += `${e}=${encodeURIComponent(s[e])}`;
			return /^http(s)?\:\/\//.test(t += r) ? t : `${e}${t}`
		}(w, S, d);
		l && (f += l);
		const p = await this.post({
				url: f,
				data: i,
				...a
			}),
			g = p.header && p.header["x-tcb-trace"];
		if (g && this._localCache.setStore(n, g), 200 !== Number(p.status) && 200 !== Number(p.statusCode) || !p
			.data) throw new Error("network request error");
		return p
	}
	async send(e, t = {}) {
		const s = await this.request(e, t, {
			onUploadProgress: t.onUploadProgress
		});
		if ("ACCESS_TOKEN_EXPIRED" === s.data.code && -1 === J.indexOf(e)) {
			await this.refreshAccessToken();
			const s = await this.request(e, t, {
				onUploadProgress: t.onUploadProgress
			});
			if (s.data.code) throw new Error(`[${s.data.code}] ${s.data.message}`);
			return s.data
		}
		if (s.data.code) throw new Error(`[${s.data.code}] ${s.data.message}`);
		return s.data
	}
	setRefreshToken(e) {
		const {
			accessTokenKey: t,
			accessTokenExpireKey: s,
			refreshTokenKey: n
		} = this._cache.keys;
		this._cache.removeStore(t), this._cache.removeStore(s), this._cache.setStore(n, e)
	}
}
const ee = {};

function te(e) {
	return ee[e]
}
class se {
	constructor(e) {
		this.config = e, this._cache = F(e.env), this._request = te(e.env)
	}
	setRefreshToken(e) {
		const {
			accessTokenKey: t,
			accessTokenExpireKey: s,
			refreshTokenKey: n
		} = this._cache.keys;
		this._cache.removeStore(t), this._cache.removeStore(s), this._cache.setStore(n, e)
	}
	setAccessToken(e, t) {
		const {
			accessTokenKey: s,
			accessTokenExpireKey: n
		} = this._cache.keys;
		this._cache.setStore(s, e), this._cache.setStore(n, t)
	}
	async refreshUserInfo() {
		const {
			data: e
		} = await this._request.send("auth.getUserInfo", {});
		return this.setLocalUserInfo(e), e
	}
	setLocalUserInfo(e) {
		const {
			userInfoKey: t
		} = this._cache.keys;
		this._cache.setStore(t, e)
	}
}
class ne {
	constructor(e) {
		if (!e) throw new Error("envId is not defined");
		this._envId = e, this._cache = F(this._envId), this._request = te(this._envId), this.setUserInfo()
	}
	linkWithTicket(e) {
		if ("string" != typeof e) throw new Error("ticket must be string");
		return this._request.send("auth.linkWithTicket", {
			ticket: e
		})
	}
	linkWithRedirect(e) {
		e.signInWithRedirect()
	}
	updatePassword(e, t) {
		return this._request.send("auth.updatePassword", {
			oldPassword: t,
			newPassword: e
		})
	}
	updateEmail(e) {
		return this._request.send("auth.updateEmail", {
			newEmail: e
		})
	}
	updateUsername(e) {
		if ("string" != typeof e) throw new Error("username must be a string");
		return this._request.send("auth.updateUsername", {
			username: e
		})
	}
	async getLinkedUidList() {
		const {
			data: e
		} = await this._request.send("auth.getLinkedUidList", {});
		let t = !1;
		const {
			users: s
		} = e;
		return s.forEach(e => {
			e.wxOpenId && e.wxPublicId && (t = !0)
		}), {
			users: s,
			hasPrimaryUid: t
		}
	}
	setPrimaryUid(e) {
		return this._request.send("auth.setPrimaryUid", {
			uid: e
		})
	}
	unlink(e) {
		return this._request.send("auth.unlink", {
			platform: e
		})
	}
	async update(e) {
		const {
			nickName: t,
			gender: s,
			avatarUrl: n,
			province: r,
			country: o,
			city: i
		} = e, {
			data: a
		} = await this._request.send("auth.updateUserInfo", {
			nickName: t,
			gender: s,
			avatarUrl: n,
			province: r,
			country: o,
			city: i
		});
		this.setLocalUserInfo(a)
	}
	async refresh() {
		const {
			data: e
		} = await this._request.send("auth.getUserInfo", {});
		return this.setLocalUserInfo(e), e
	}
	setUserInfo() {
		const {
			userInfoKey: e
		} = this._cache.keys, t = this._cache.getStore(e);
		["uid", "loginType", "openid", "wxOpenId", "wxPublicId", "unionId", "qqMiniOpenId", "email", "hasPassword",
			"customUserId", "nickName", "gender", "avatarUrl"
		].forEach(e => {
			this[e] = t[e]
		}), this.location = {
			country: t.country,
			province: t.province,
			city: t.city
		}
	}
	setLocalUserInfo(e) {
		const {
			userInfoKey: t
		} = this._cache.keys;
		this._cache.setStore(t, e), this.setUserInfo()
	}
}
class re {
	constructor(e) {
		if (!e) throw new Error("envId is not defined");
		this._cache = F(e);
		const {
			refreshTokenKey: t,
			accessTokenKey: s,
			accessTokenExpireKey: n
		} = this._cache.keys, r = this._cache.getStore(t), o = this._cache.getStore(s), i = this._cache.getStore(n);
		this.credential = {
			refreshToken: r,
			accessToken: o,
			accessTokenExpire: i
		}, this.user = new ne(e)
	}
	get isAnonymousAuth() {
		return this.loginType === Y.ANONYMOUS
	}
	get isCustomAuth() {
		return this.loginType === Y.CUSTOM
	}
	get isWeixinAuth() {
		return this.loginType === Y.WECHAT || this.loginType === Y.WECHAT_OPEN || this.loginType === Y.WECHAT_PUBLIC
	}
	get loginType() {
		return this._cache.getStore(this._cache.keys.loginTypeKey)
	}
}
class oe extends se {
	async signIn() {
		this._cache.updatePersistence("local");
		const {
			anonymousUuidKey: e,
			refreshTokenKey: t
		} = this._cache.keys, s = this._cache.getStore(e) || void 0, n = this._cache.getStore(t) || void 0, r =
			await this._request.send("auth.signInAnonymously", {
				anonymous_uuid: s,
				refresh_token: n
			});
		if (r.uuid && r.refresh_token) {
			this._setAnonymousUUID(r.uuid), this.setRefreshToken(r.refresh_token), await this._request
				.refreshAccessToken(), K(j), K(W, {
					env: this.config.env,
					loginType: Y.ANONYMOUS,
					persistence: "local"
				});
			const e = new re(this.config.env);
			return await e.user.refresh(), e
		}
		throw new Error("匿名登录失败")
	}
	async linkAndRetrieveDataWithTicket(e) {
		const {
			anonymousUuidKey: t,
			refreshTokenKey: s
		} = this._cache.keys, n = this._cache.getStore(t), r = this._cache.getStore(s), o = await this._request
			.send("auth.linkAndRetrieveDataWithTicket", {
				anonymous_uuid: n,
				refresh_token: r,
				ticket: e
			});
		if (o.refresh_token) return this._clearAnonymousUUID(), this.setRefreshToken(o.refresh_token), await this
			._request.refreshAccessToken(), K(V, {
				env: this.config.env
			}), K(W, {
				loginType: Y.CUSTOM,
				persistence: "local"
			}), {
				credential: {
					refreshToken: o.refresh_token
				}
			};
		throw new Error("匿名转化失败")
	}
	_setAnonymousUUID(e) {
		const {
			anonymousUuidKey: t,
			loginTypeKey: s
		} = this._cache.keys;
		this._cache.removeStore(t), this._cache.setStore(t, e), this._cache.setStore(s, Y.ANONYMOUS)
	}
	_clearAnonymousUUID() {
		this._cache.removeStore(this._cache.keys.anonymousUuidKey)
	}
}
class ie extends se {
	async signIn(e) {
		if ("string" != typeof e) throw new Error("ticket must be a string");
		const {
			refreshTokenKey: t
		} = this._cache.keys, s = await this._request.send("auth.signInWithTicket", {
			ticket: e,
			refresh_token: this._cache.getStore(t) || ""
		});
		if (s.refresh_token) return this.setRefreshToken(s.refresh_token), await this._request.refreshAccessToken(),
			K(j), K(W, {
				env: this.config.env,
				loginType: Y.CUSTOM,
				persistence: this.config.persistence
			}), await this.refreshUserInfo(), new re(this.config.env);
		throw new Error("自定义登录失败")
	}
}
class ae extends se {
	async signIn(e, t) {
		if ("string" != typeof e) throw new Error("email must be a string");
		const {
			refreshTokenKey: s
		} = this._cache.keys, n = await this._request.send("auth.signIn", {
			loginType: "EMAIL",
			email: e,
			password: t,
			refresh_token: this._cache.getStore(s) || ""
		}), {
			refresh_token: r,
			access_token: o,
			access_token_expire: i
		} = n;
		if (r) return this.setRefreshToken(r), o && i ? this.setAccessToken(o, i) : await this._request
			.refreshAccessToken(), await this.refreshUserInfo(), K(j), K(W, {
				env: this.config.env,
				loginType: Y.EMAIL,
				persistence: this.config.persistence
			}), new re(this.config.env);
		throw n.code ? new Error(`邮箱登录失败: [${n.code}] ${n.message}`) : new Error("邮箱登录失败")
	}
	async activate(e) {
		return this._request.send("auth.activateEndUserMail", {
			token: e
		})
	}
	async resetPasswordWithToken(e, t) {
		return this._request.send("auth.resetPasswordWithToken", {
			token: e,
			newPassword: t
		})
	}
}
class ce extends se {
	async signIn(e, t) {
		if ("string" != typeof e) throw new Error("username must be a string");
		"string" != typeof t && (t = "", console.warn("password is empty"));
		const {
			refreshTokenKey: s
		} = this._cache.keys, n = await this._request.send("auth.signIn", {
			loginType: Y.USERNAME,
			username: e,
			password: t,
			refresh_token: this._cache.getStore(s) || ""
		}), {
			refresh_token: r,
			access_token_expire: o,
			access_token: i
		} = n;
		if (r) return this.setRefreshToken(r), i && o ? this.setAccessToken(i, o) : await this._request
			.refreshAccessToken(), await this.refreshUserInfo(), K(j), K(W, {
				env: this.config.env,
				loginType: Y.USERNAME,
				persistence: this.config.persistence
			}), new re(this.config.env);
		throw n.code ? new Error(`用户名密码登录失败: [${n.code}] ${n.message}`) : new Error("用户名密码登录失败")
	}
}
class ue {
	constructor(e) {
		this.config = e, this._cache = F(e.env), this._request = te(e.env), this._onAnonymousConverted = this
			._onAnonymousConverted.bind(this), this._onLoginTypeChanged = this._onLoginTypeChanged.bind(this), $(W,
				this._onLoginTypeChanged)
	}
	get currentUser() {
		const e = this.hasLoginState();
		return e && e.user || null
	}
	get loginType() {
		return this._cache.getStore(this._cache.keys.loginTypeKey)
	}
	anonymousAuthProvider() {
		return new oe(this.config)
	}
	customAuthProvider() {
		return new ie(this.config)
	}
	emailAuthProvider() {
		return new ae(this.config)
	}
	usernameAuthProvider() {
		return new ce(this.config)
	}
	async signInAnonymously() {
		return new oe(this.config).signIn()
	}
	async signInWithEmailAndPassword(e, t) {
		return new ae(this.config).signIn(e, t)
	}
	signInWithUsernameAndPassword(e, t) {
		return new ce(this.config).signIn(e, t)
	}
	async linkAndRetrieveDataWithTicket(e) {
		this._anonymousAuthProvider || (this._anonymousAuthProvider = new oe(this.config)), $(V, this
			._onAnonymousConverted);
		return await this._anonymousAuthProvider.linkAndRetrieveDataWithTicket(e)
	}
	async signOut() {
		if (this.loginType === Y.ANONYMOUS) throw new Error("匿名用户不支持登出操作");
		const {
			refreshTokenKey: e,
			accessTokenKey: t,
			accessTokenExpireKey: s
		} = this._cache.keys, n = this._cache.getStore(e);
		if (!n) return;
		const r = await this._request.send("auth.logout", {
			refresh_token: n
		});
		return this._cache.removeStore(e), this._cache.removeStore(t), this._cache.removeStore(s), K(j), K(W, {
			env: this.config.env,
			loginType: Y.NULL,
			persistence: this.config.persistence
		}), r
	}
	async signUpWithEmailAndPassword(e, t) {
		return this._request.send("auth.signUpWithEmailAndPassword", {
			email: e,
			password: t
		})
	}
	async sendPasswordResetEmail(e) {
		return this._request.send("auth.sendPasswordResetEmail", {
			email: e
		})
	}
	onLoginStateChanged(e) {
		$(j, () => {
			const t = this.hasLoginState();
			e.call(this, t)
		});
		const t = this.hasLoginState();
		e.call(this, t)
	}
	onLoginStateExpired(e) {
		$(H, e.bind(this))
	}
	onAccessTokenRefreshed(e) {
		$(z, e.bind(this))
	}
	onAnonymousConverted(e) {
		$(V, e.bind(this))
	}
	onLoginTypeChanged(e) {
		$(W, () => {
			const t = this.hasLoginState();
			e.call(this, t)
		})
	}
	async getAccessToken() {
		return {
			accessToken: (await this._request.getAccessToken()).accessToken,
			env: this.config.env
		}
	}
	hasLoginState() {
		const {
			refreshTokenKey: e
		} = this._cache.keys;
		return this._cache.getStore(e) ? new re(this.config.env) : null
	}
	async isUsernameRegistered(e) {
		if ("string" != typeof e) throw new Error("username must be a string");
		const {
			data: t
		} = await this._request.send("auth.isUsernameRegistered", {
			username: e
		});
		return t && t.isRegistered
	}
	getLoginState() {
		return Promise.resolve(this.hasLoginState())
	}
	async signInWithTicket(e) {
		return new ie(this.config).signIn(e)
	}
	shouldRefreshAccessToken(e) {
		this._request._shouldRefreshAccessTokenHook = e.bind(this)
	}
	getUserInfo() {
		return this._request.send("auth.getUserInfo", {}).then(e => e.code ? e : {
			...e.data,
			requestId: e.seqId
		})
	}
	getAuthHeader() {
		const {
			refreshTokenKey: e,
			accessTokenKey: t
		} = this._cache.keys, s = this._cache.getStore(e);
		return {
			"x-cloudbase-credentials": this._cache.getStore(t) + "/@@/" + s
		}
	}
	_onAnonymousConverted(e) {
		const {
			env: t
		} = e.data;
		t === this.config.env && this._cache.updatePersistence(this.config.persistence)
	}
	_onLoginTypeChanged(e) {
		const {
			loginType: t,
			persistence: s,
			env: n
		} = e.data;
		n === this.config.env && (this._cache.updatePersistence(s), this._cache.setStore(this._cache.keys
			.loginTypeKey, t))
	}
}
const he = function(e, t) {
		t = t || A();
		const s = te(this.config.env),
			{
				cloudPath: n,
				filePath: r,
				onUploadProgress: o,
				fileType: i = "image"
			} = e;
		return s.send("storage.getUploadMetadata", {
			path: n
		}).then(e => {
			const {
				data: {
					url: a,
					authorization: c,
					token: u,
					fileId: h,
					cosFileId: l
				},
				requestId: d
			} = e, f = {
				key: n,
				signature: c,
				"x-cos-meta-fileid": l,
				success_action_status: "201",
				"x-cos-security-token": u
			};
			s.upload({
				url: a,
				data: f,
				file: r,
				name: n,
				fileType: i,
				onUploadProgress: o
			}).then(e => {
				201 === e.statusCode ? t(null, {
					fileID: h,
					requestId: d
				}) : t(new Error("STORAGE_REQUEST_FAIL: " + e.data))
			}).catch(e => {
				t(e)
			})
		}).catch(e => {
			t(e)
		}), t.promise
	},
	le = function(e, t) {
		t = t || A();
		const s = te(this.config.env),
			{
				cloudPath: n
			} = e;
		return s.send("storage.getUploadMetadata", {
			path: n
		}).then(e => {
			t(null, e)
		}).catch(e => {
			t(e)
		}), t.promise
	},
	de = function({
		fileList: e
	}, t) {
		if (t = t || A(), !e || !Array.isArray(e)) return {
			code: "INVALID_PARAM",
			message: "fileList必须是非空的数组"
		};
		for (let t of e)
			if (!t || "string" != typeof t) return {
				code: "INVALID_PARAM",
				message: "fileList的元素必须是非空的字符串"
			};
		const s = {
			fileid_list: e
		};
		return te(this.config.env).send("storage.batchDeleteFile", s).then(e => {
			e.code ? t(null, e) : t(null, {
				fileList: e.data.delete_list,
				requestId: e.requestId
			})
		}).catch(e => {
			t(e)
		}), t.promise
	},
	fe = function({
		fileList: e
	}, t) {
		t = t || A(), e && Array.isArray(e) || t(null, {
			code: "INVALID_PARAM",
			message: "fileList必须是非空的数组"
		});
		let s = [];
		for (let n of e) "object" == typeof n ? (n.hasOwnProperty("fileID") && n.hasOwnProperty("maxAge") || t(null, {
			code: "INVALID_PARAM",
			message: "fileList的元素必须是包含fileID和maxAge的对象"
		}), s.push({
			fileid: n.fileID,
			max_age: n.maxAge
		})) : "string" == typeof n ? s.push({
			fileid: n
		}) : t(null, {
			code: "INVALID_PARAM",
			message: "fileList的元素必须是字符串"
		});
		const n = {
			file_list: s
		};
		return te(this.config.env).send("storage.batchGetDownloadUrl", n).then(e => {
			e.code ? t(null, e) : t(null, {
				fileList: e.data.download_list,
				requestId: e.requestId
			})
		}).catch(e => {
			t(e)
		}), t.promise
	},
	pe = async function({
		fileID: e
	}, t) {
		const s = (await fe.call(this, {
			fileList: [{
				fileID: e,
				maxAge: 600
			}]
		})).fileList[0];
		if ("SUCCESS" !== s.code) return t ? t(s) : new Promise(e => {
			e(s)
		});
		const n = te(this.config.env);
		let r = s.download_url;
		if (r = encodeURI(r), !t) return n.download({
			url: r
		});
		t(await n.download({
			url: r
		}))
	}, ge = function({
		name: e,
		data: t,
		query: s,
		parse: n,
		search: r
	}, o) {
		const i = o || A();
		let a;
		try {
			a = t ? JSON.stringify(t) : ""
		} catch (e) {
			return Promise.reject(e)
		}
		if (!e) return Promise.reject(new Error("函数名不能为空"));
		const c = {
			inQuery: s,
			parse: n,
			search: r,
			function_name: e,
			request_data: a
		};
		return te(this.config.env).send("functions.invokeFunction", c).then(e => {
			if (e.code) i(null, e);
			else {
				let t = e.data.response_data;
				if (n) i(null, {
					result: t,
					requestId: e.requestId
				});
				else try {
					t = JSON.parse(e.data.response_data), i(null, {
						result: t,
						requestId: e.requestId
					})
				} catch (e) {
					i(new Error("response data must be json"))
				}
			}
			return i.promise
		}).catch(e => {
			i(e)
		}), i.promise
	}, me = {
		timeout: 15e3,
		persistence: "session"
	}, ye = {};
class _e {
	constructor(e) {
		this.config = e || this.config, this.authObj = void 0
	}
	init(e) {
		switch (U.adapter || (this.requestClient = new U.adapter.reqClass({
			timeout: e.timeout || 5e3,
			timeoutMsg: `请求在${(e.timeout||5e3)/1e3}s内未完成，已中断`
		})), this.config = {
			...me,
			...e
		}, !0) {
			case this.config.timeout > 6e5:
				console.warn("timeout大于可配置上限[10分钟]，已重置为上限数值"), this.config.timeout = 6e5;
				break;
			case this.config.timeout < 100:
				console.warn("timeout小于可配置下限[100ms]，已重置为下限数值"), this.config.timeout = 100
		}
		return new _e(this.config)
	}
	auth({
		persistence: e
	} = {}) {
		if (this.authObj) return this.authObj;
		const t = e || U.adapter.primaryStorage || me.persistence;
		var s;
		return t !== this.config.persistence && (this.config.persistence = t),
			function(e) {
				const {
					env: t
				} = e;
				x[t] = new R(e), q[t] = new R({
					...e,
					persistence: "local"
				})
			}(this.config), s = this.config, ee[s.env] = new Z(s), this.authObj = new ue(this.config), this.authObj
	}
	on(e, t) {
		return $.apply(this, [e, t])
	}
	off(e, t) {
		return B.apply(this, [e, t])
	}
	callFunction(e, t) {
		return ge.apply(this, [e, t])
	}
	deleteFile(e, t) {
		return de.apply(this, [e, t])
	}
	getTempFileURL(e, t) {
		return fe.apply(this, [e, t])
	}
	downloadFile(e, t) {
		return pe.apply(this, [e, t])
	}
	uploadFile(e, t) {
		return he.apply(this, [e, t])
	}
	getUploadMetadata(e, t) {
		return le.apply(this, [e, t])
	}
	registerExtension(e) {
		ye[e.name] = e
	}
	async invokeExtension(e, t) {
		const s = ye[e];
		if (!s) throw Error(`扩展${e} 必须先注册`);
		return await s.invoke(t, this)
	}
	useAdapters(e) {
		const {
			adapter: t,
			runtime: s
		} = O(e) || {};
		t && (U.adapter = t), s && (U.runtime = s)
	}
}
const ve = new _e;

function we(e, t, s) {
	void 0 === s && (s = {});
	var n = /\?/.test(t),
		r = "";
	for (var o in s) "" === r ? !n && (t += "?") : r += "&", r += o + "=" + encodeURIComponent(s[o]);
	return /^http(s)?:\/\//.test(t += r) ? t : "" + e + t
}
class Se {
	post(e) {
		const {
			url: t,
			data: s,
			headers: n
		} = e;
		return new Promise((e, r) => {
			y.request({
				url: we("https:", t),
				data: s,
				method: "POST",
				header: n,
				success(t) {
					e(t)
				},
				fail(e) {
					r(e)
				}
			})
		})
	}
	upload(e) {
		return new Promise((t, s) => {
			const {
				url: n,
				file: r,
				data: o,
				headers: i,
				fileType: a
			} = e, c = y.uploadFile({
				url: we("https:", n),
				name: "file",
				formData: Object.assign({}, o),
				filePath: r,
				fileType: a,
				header: i,
				success(e) {
					const s = {
						statusCode: e.statusCode,
						data: e.data || {}
					};
					200 === e.statusCode && o.success_action_status && (s.statusCode = parseInt(o
						.success_action_status, 10)), t(s)
				},
				fail(e) {
					"mp-alipay" === process.env.VUE_APP_PLATFORM && "development" === process.env
						.NODE_ENV && console.warn("支付宝小程序开发工具上传腾讯云时无法准确判断是否上传成功，请使用真机测试"), s(
							new Error(e.errMsg || "uploadFile:fail"))
				}
			});
			"function" == typeof e.onUploadProgress && c && "function" == typeof c.onProgressUpdate && c
				.onProgressUpdate(t => {
					e.onUploadProgress({
						loaded: t.totalBytesSent,
						total: t.totalBytesExpectedToSend
					})
				})
		})
	}
}
const Te = {
	setItem(e, t) {
		y.setStorageSync(e, t)
	},
	getItem: e => y.getStorageSync(e),
	removeItem(e) {
		y.removeStorageSync(e)
	},
	clear() {
		y.clearStorageSync()
	}
};
const ke = {
	genAdapter: function() {
		return {
			root: {},
			reqClass: Se,
			localStorage: Te,
			primaryStorage: "local"
		}
	},
	isMatch: function() {
		return !0
	},
	runtime: "uni_app"
};
ve.useAdapters(ke);
const Ae = ve,
	Pe = Ae.init;
Ae.init = function(e) {
	e.env = e.spaceId;
	const t = Pe.call(this, e);
	t.config.provider = "tencent", t.config.spaceId = e.spaceId;
	const s = t.auth;
	t.auth = function(e) {
		const t = s.call(this, e);
		return ["linkAndRetrieveDataWithTicket", "signInAnonymously", "signOut", "getAccessToken",
			"getLoginState", "signInWithTicket", "getUserInfo"
		].forEach(e => {
			t[e] = o(t[e]).bind(t)
		}), t
	}, t.customAuth = t.auth;
	return ["deleteFile", "getTempFileURL", "downloadFile"].forEach(e => {
		t[e] = o(t[e]).bind(t)
	}), t
};
class Ie extends _ {
	getAccessToken() {
		return new Promise((e, t) => {
			this.setAccessToken("Anonymous_Access_token"), e("Anonymous_Access_token")
		})
	}
	uploadFileToOSS({
		url: e,
		formData: t,
		name: s,
		filePath: n,
		fileType: r,
		onUploadProgress: o
	}) {
		return new Promise((a, c) => {
			const u = this.adapter.uploadFile({
				url: e,
				formData: t,
				name: s,
				filePath: n,
				fileType: r,
				success(e) {
					e && e.statusCode < 400 ? a(e) : c(new i({
						code: "UPLOAD_FAILED",
						message: "文件上传失败"
					}))
				},
				fail(e) {
					c(new i({
						code: e.code || "UPLOAD_FAILED",
						message: e.message || e.errMsg || "文件上传失败"
					}))
				}
			});
			"function" == typeof o && u && "function" == typeof u.onProgressUpdate && u.onProgressUpdate(
				e => {
					o({
						loaded: e.totalBytesSent,
						total: e.totalBytesExpectedToSend
					})
				})
		})
	}
	uploadFile({
		filePath: e,
		cloudPath: t,
		fileType: s = "image",
		onUploadProgress: n
	}) {
		if (!t) throw new i({
			code: "CLOUDPATH_REQUIRED",
			message: "cloudPath不可为空"
		});
		let r;
		return this.getOSSUploadOptionsFromPath({
			filename: t
		}).then(t => {
			const {
				url: o,
				formData: i,
				name: a,
				fileUrl: c
			} = t.result;
			r = c;
			const u = {
				url: o,
				formData: i,
				name: a,
				filePath: e,
				fileType: s
			};
			return this.uploadFileToOSS(Object.assign({}, u, {
				onUploadProgress: n
			}))
		}).then(() => this.reportOSSUpload({
			id: t
		})).then(t => new Promise((s, n) => {
			t.success ? s({
				success: !0,
				filePath: e,
				fileID: r
			}) : n(new i({
				code: "UPLOAD_FAILED",
				message: "文件上传失败"
			}))
		}))
	}
}
const Ee = {
	init(e) {
		const t = new Ie(e);
		["deleteFile", "getTempFileURL"].forEach(e => {
			t[e] = o(t[e]).bind(t)
		});
		const s = {
			signInAnonymously: function() {
				return t.authorize()
			},
			getLoginState: function() {
				return Promise.resolve(!1)
			}
		};
		return t.auth = function() {
			return s
		}, t.customAuth = t.auth, t
	}
};
let Oe, Ue;

function be({
	name: e,
	data: t,
	spaceId: s,
	provider: n
}) {
	Oe || (Oe = function() {
		const {
			deviceId: e
		} = uni.getSystemInfoSync();
		return {
			PLATFORM: process.env.VUE_APP_PLATFORM,
			OS: d,
			APPID: h.appid,
			LOCALE: u(),
			DEVICEID: e,
			CLIENT_SDK_VERSION: "1.0.1"
		}
	}(), Ue = {
		ak: h.appid,
		p: "android" === d ? "a" : "i",
		ut: g(),
		uuid: p()
	});
	const r = JSON.parse(JSON.stringify(t || {})),
		o = e,
		i = s,
		a = {
			tencent: "t",
			aliyun: "a"
		} [n]; {
		const e = Object.assign({}, Ue, {
			fn: o,
			sid: i,
			pvd: a
		});
		Object.assign(r, {
			clientInfo: Oe,
			uniCloudClientInfo: encodeURIComponent(JSON.stringify(e))
		});
		const {
			deviceId: t
		} = uni.getSystemInfoSync();
		r.uniCloudDeviceId = t
	}
	if (!r.uniIdToken) {
		const e = y.getStorageSync("uni_id_token") || y.getStorageSync("uniIdToken");
		e && (r.uniIdToken = e)
	}
	return r
}

function De({
	name: e,
	data: t
}) {
	const {
		localAddress: s,
		localPort: n
	} = this, r = {
			aliyun: "aliyun",
			tencent: "tcb"
		} [this.config.provider], o = this.config.spaceId, a = `http://${s}:${n}/system/check-function`, c =
		`http://${s}:${n}/cloudfunctions/${e}`;
	return new Promise((t, s) => {
		y.request({
			method: "POST",
			url: a,
			data: {
				name: e,
				platform: process.env.VUE_APP_PLATFORM,
				provider: r,
				spaceId: o
			},
			timeout: 3e3,
			success(e) {
				t(e)
			},
			fail() {
				t({
					data: {
						code: "NETWORK_ERROR",
						message: "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下，自动切换为已部署的云函数。"
					}
				})
			}
		})
	}).then(({
		data: e
	} = {}) => {
		const {
			code: t,
			message: s
		} = e || {};
		return {
			code: 0 === t ? 0 : t || "SYS_ERR",
			message: s || "SYS_ERR"
		}
	}).then(({
		code: s,
		message: n
	}) => {
		if (0 !== s) {
			switch (s) {
				case "MODULE_ENCRYPTED":
					console.error(`此云函数（${e}）依赖加密公共模块不可本地调试，自动切换为云端已部署的云函数`);
					break;
				case "FUNCTION_ENCRYPTED":
					console.error(`此云函数（${e}）已加密不可本地调试，自动切换为云端已部署的云函数`);
					break;
				case "ACTION_ENCRYPTED":
					console.error(n || "需要访问加密的uni-clientDB-action，自动切换为云端环境");
					break;
				case "NETWORK_ERROR": {
					const e = "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下";
					throw console.error(e), new Error(e)
				}
				case "SWITCH_TO_CLOUD":
					break;
				default: {
					const e = `检测本地调试服务出现错误：${n}，请检查网络环境或重启客户端再试`;
					throw console.error(e), new Error(e)
				}
			}
			return this.originCallFunction({
				name: e,
				data: t
			})
		}
		return new Promise((s, n) => {
			const a = be({
				name: e,
				data: t,
				provider: this.config.provider,
				spaceId: o
			});
			y.request({
				method: "POST",
				url: c,
				data: {
					provider: r,
					platform: process.env.VUE_APP_PLATFORM,
					param: a
				},
				success: ({
					statusCode: e,
					data: t
				} = {}) => !e || e >= 400 ? n(new i({
					code: t.code || "SYS_ERR",
					message: t.message || "request:fail"
				})) : s({
					result: t
				}),
				fail(e) {
					n(new i({
						code: e.code || e.errCode || "SYS_ERR",
						message: e.message || e.errMsg || "request:fail"
					}))
				}
			})
		})
	})
}
const Ce = [{
	rule: /fc_function_not_found|FUNCTION_NOT_FOUND/,
	content: "，云函数[{functionName}]在云端不存在，请检查此云函数名称是否正确已经是否已上传到服务空间",
	mode: "append"
}];
var Re = /[\\^$.*+?()[\]{}|]/g,
	xe = RegExp(Re.source);

function qe(e, t, s) {
	return e.replace(new RegExp((n = t) && xe.test(n) ? n.replace(Re, "\\$&") : n, "g"), s);
	var n
}

function Fe(e) {
	const t = e.callFunction;
	e.callFunction = function(e) {
		let s;
		s = this.isReady ? Promise.resolve() : this.initUniCloud;
		const n = e.name;
		return s.then(() => {
			e.data = be({
				name: n,
				data: e.data,
				provider: this.config.provider,
				spaceId: this.config.spaceId
			});
			const s = {
				aliyun: "aliyun",
				tencent: "tcb"
			} [this.config.provider];
			return new Promise((r, o) => {
				t.call(this, e).then(e => {
					if (this.config.useDebugFunction && e && e.requestId) {
						const t = JSON.stringify({
							spaceId: this.config.spaceId,
							functionName: n,
							requestId: e.requestId
						});
						console.log(`[${s}-request]${t}[/${s}-request]`)
					}
					r(e)
				}).catch(t => {
					if (this.config.useDebugFunction && t && t.requestId) {
						const e = JSON.stringify({
							spaceId: this.config.spaceId,
							functionName: n,
							requestId: t.requestId
						});
						console.log(`[${s}-request]${e}[/${s}-request]`)
					}
					t && t.message && (t.message = function({
						message: e = "",
						extraInfo: t = {},
						formatter: s = []
					} = {}) {
						for (let n = 0; n < s.length; n++) {
							const {
								rule: r,
								content: o,
								mode: i
							} = s[n], a = e.match(r);
							if (!a) continue;
							let c = o;
							for (let e = 1; e < a.length; e++) c = qe(c, `{$${e}}`,
								a[e]);
							for (const e in t) c = qe(c, `{${e}}`, t[e]);
							switch (i) {
								case "replace":
									return c;
								case "append":
								default:
									return e + c
							}
						}
						return e
					}({
						message: `[${e.name}]: ${t.message}`,
						formatter: Ce,
						extraInfo: {
							functionName: n
						}
					})), o(t)
				})
			})
		})
	};
	const s = e.callFunction;
	e.originCallFunction = e.callFunction, e.callFunction = function(t) {
		return o((function(t) {
			let n;
			return n = e.isReady ? Promise.resolve() : e.initUniCloud, n.then(() => "development" ===
				process.env.NODE_ENV && e.debugInfo && !e.debugInfo.forceRemote && process.env
				.UNI_CLOUD_PROVIDER ? De.call(this, t) : s.call(this, t))
		})).call(this, t)
	}
}
const Le = Symbol("CLIENT_DB_INTERNAL");

function Ne(e, t) {
	return e.then = "DoNotReturnProxyWithAFunctionNamedThen", e._internalType = Le, new Proxy(e, {
		get: (e, s, n) => function(e, t) {
			return Object.prototype.hasOwnProperty.call(e, t)
		}(e, s) || e[s] || "string" != typeof s ? e[s] : t.get(e, s, n)
	})
}
class Me extends Error {
	constructor(e, t) {
		super(e), this.code = t
	}
}

function $e(e) {
	switch (t = e, Object.prototype.toString.call(t).slice(8, -1).toLowerCase()) {
		case "array":
			return e.map(e => $e(e));
		case "object":
			return e._internalType === Le || Object.keys(e).forEach(t => {
				e[t] = $e(e[t])
			}), e;
		case "regexp":
			return {
				$regexp: {
					source: e.source,
					flags: e.flags
				}
			};
		case "date":
			return {
				$date: e.toISOString()
			};
		default:
			return e
	}
	var t
}

function Ke() {
	const e = y.getStorageSync("uni_id_token") || "",
		t = e.split(".");
	if (!e || 3 !== t.length) return {
		uid: null,
		role: [],
		permission: []
	};
	let s;
	try {
		s = JSON.parse((n = t[1], decodeURIComponent(atob(n).split("").map((function(e) {
			return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2)
		})).join(""))))
	} catch (e) {
		throw new Error("获取当前用户信息出错，详细错误信息为：" + e.message)
	}
	var n;
	return s
}
var Be = t(s((function(e, t) {
	Object.defineProperty(t, "__esModule", {
		value: !0
	});
	const s = "chooseAndUploadFile:fail";

	function n(e, t) {
		return e.tempFiles.forEach((e, s) => {
			e.name || (e.name = e.path.substring(e.path.lastIndexOf("/") + 1)), t && (e
				.fileType = t), e.cloudPath = Date.now() + "_" + s + e.name.substring(e.name
				.lastIndexOf("."))
		}), e.tempFilePaths || (e.tempFilePaths = e.tempFiles.map(e => e.path)), e
	}

	function r(e, t, {
		onChooseFile: s,
		onUploadProgress: n
	}) {
		return t.then(e => {
			if (s) {
				const t = s(e);
				if (void 0 !== t) return Promise.resolve(t).then(t => void 0 === t ? e : t)
			}
			return e
		}).then(t => !1 === t ? {
			errMsg: "chooseAndUploadFile:ok",
			tempFilePaths: [],
			tempFiles: []
		} : function(e, t, s = 5, n) {
			(t = Object.assign({}, t)).errMsg = "chooseAndUploadFile:ok";
			const r = t.tempFiles,
				o = r.length;
			let i = 0;
			return new Promise(a => {
				for (; i < s;) c();

				function c() {
					const s = i++;
					if (s >= o) return void(!r.find(e => !e.url && !e.errMsg) && a(t));
					const u = r[s];
					e.uploadFile({
						filePath: u.path,
						cloudPath: u.cloudPath,
						fileType: u.fileType,
						onUploadProgress(e) {
							e.index = s, e.tempFile = u, e.tempFilePath = u
								.path, n && n(e)
						}
					}).then(e => {
						u.url = e.fileID, s < o && c()
					}).catch(e => {
						u.errMsg = e.errMsg || e.message, s < o && c()
					})
				}
			})
		}(e, t, 5, n))
	}
	t.initChooseAndUploadFile = function(e) {
		return function(t = {
			type: "all"
		}) {
			return "image" === t.type ? r(e, function(e) {
				const {
					count: t,
					sizeType: r,
					sourceType: o = ["album", "camera"],
					extension: i
				} = e;
				return new Promise((e, a) => {
					uni.chooseImage({
						count: t,
						sizeType: r,
						sourceType: o,
						extension: i,
						success(t) {
							e(n(t, "image"))
						},
						fail(e) {
							a({
								errMsg: e.errMsg.replace(
									"chooseImage:fail", s)
							})
						}
					})
				})
			}(t), t) : "video" === t.type ? r(e, function(e) {
				const {
					camera: t,
					compressed: r,
					maxDuration: o,
					sourceType: i,
					extension: a
				} = e;
				return new Promise((e, c) => {
					uni.chooseVideo({
						camera: t,
						compressed: r,
						maxDuration: o,
						sourceType: i,
						extension: a,
						success(t) {
							const {
								tempFilePath: s,
								duration: r,
								size: o,
								height: i,
								width: a
							} = t;
							e(n({
								errMsg: "chooseVideo:ok",
								tempFilePaths: [s],
								tempFiles: [{
									name: t
										.tempFile &&
										t.tempFile
										.name || "",
									path: s,
									size: o,
									type: t
										.tempFile &&
										t.tempFile
										.type || "",
									width: a,
									height: i,
									duration: r,
									fileType: "video",
									cloudPath: ""
								}]
							}, "video"))
						},
						fail(e) {
							c({
								errMsg: e.errMsg.replace(
									"chooseVideo:fail", s)
							})
						}
					})
				})
			}(t), t) : r(e, function(e) {
				const {
					count: t,
					extension: r
				} = e;
				return new Promise((e, o) => {
					let i = uni.chooseFile;
					if ("undefined" != typeof wx && "function" == typeof wx
						.chooseMessageFile && (i = wx.chooseMessageFile),
						"function" != typeof i) return o({
						errMsg: s +
							" 请指定 type 类型，该平台仅支持选择 image 或 video。"
					});
					i({
						type: "all",
						count: t,
						extension: r,
						success(t) {
							e(n(t))
						},
						fail(e) {
							o({
								errMsg: e.errMsg.replace(
									"chooseFile:fail", s)
							})
						}
					})
				})
			}(t), t)
		}
	}
})));
const je = "manual";
async function He(e, t) {
	const s = `http://${e}:${t}/system/ping`;
	try {
		const e = await (n = {
			url: s,
			timeout: 500
		}, new Promise((e, t) => {
			y.request({
				...n,
				success(t) {
					e(t)
				},
				fail(e) {
					t(e)
				}
			})
		}));
		return !(!e.data || 0 !== e.data.code)
	} catch (e) {
		return !1
	}
	var n
}
let We = new class {
	init(e) {
		let t = {};
		const s = !1 !== e.debugFunction && "development" === process.env.NODE_ENV && ("h5" === process.env
			.VUE_APP_PLATFORM && navigator.userAgent.indexOf("HBuilderX") > 0 || "app-plus" === process.env
			.VUE_APP_PLATFORM);
		switch (e.provider) {
			case "tencent":
				t = Ae.init(Object.assign(e, {
					useDebugFunction: s
				}));
				break;
			case "aliyun":
				t = v.init(Object.assign(e, {
					useDebugFunction: s
				}));
				break;
			case "private":
				t = Ee.init(Object.assign(e, {
					useDebugFunction: s
				}));
				break;
			default:
				throw new Error("未提供正确的provider参数")
		}
		const n = process.env.UNICLOUD_DEBUG;
		"development" === process.env.NODE_ENV && n && !n.code && (t.debugInfo = n), t.isReady = !1;
		const r = t.auth();
		return t.initUniCloud = r.getLoginState().then(e => e ? Promise.resolve() : r.signInAnonymously()).then(
				() => {
					if ("development" === process.env.NODE_ENV && t.debugInfo) {
						const {
							address: e,
							servePort: s
						} = t.debugInfo;
						return async function(e, t) {
							let s;
							for (let n = 0; n < e.length; n++) {
								const r = e[n];
								if (await He(r, t)) {
									s = r;
									break
								}
							}
							return {
								address: s,
								port: t
							}
						}(e, s)
					}
					return Promise.resolve()
				}).then(({
				address: e,
				port: s
			} = {}) => {
				if (e) t.localAddress = e, t.localPort = s;
				else if (t.debugInfo) {
					const e = "app-plus" === process.env.VUE_APP_PLATFORM ? "error" : "warn",
						s = console[e];
					"remote" === t.debugInfo.initialLaunchType ? (t.debugInfo.forceRemote = !0, s(
						"当前客户端和HBuilderX不在同一局域网下（或其他网络原因无法连接HBuilderX），uniCloud本地调试服务不对当前客户端生效。\n- 如果不使用uniCloud本地调试服务，请直接忽略此信息。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。\n- 如果在HBuilderX开启的状态下切换过网络环境，请重启HBuilderX后再试"
						)) : s(
						"无法连接uniCloud本地调试服务，请检查当前客户端是否与主机在同一局域网下。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。\n- 如果在HBuilderX开启的状态下切换过网络环境，请重启HBuilderX后再试"
						)
				}
			}).then(() => (function() {
				if ("h5" !== process.env.VUE_APP_PLATFORM || "development" !== process.env.NODE_ENV)
					return;
				if (uni.getStorageSync("__LAST_DCLOUD_APPID") === h.appid) return;
				uni.setStorageSync("__LAST_DCLOUD_APPID", h.appid), uni.removeStorageSync(
					"uni_id_token") && (console.warn(
						"检测到当前项目与上次运行到此端口的项目不一致，自动清理uni-id保存的token信息（仅开发调试时生效）"), uni
					.removeStorageSync("uni_id_token"), uni.removeStorageSync(
						"uni_id_token_expired"))
			}(), new Promise(e => {
				"quickapp-native" === process.env.VUE_APP_PLATFORM ? (d = "android", uni
			.getStorage({
					key: "__DC_CLOUD_UUID",
					success(t) {
						l = t.data ? t.data : f(32), e()
					}
				})) : setTimeout(() => {
					d = uni.getSystemInfoSync().platform, l = uni.getStorageSync(
						"__DC_CLOUD_UUID") || f(32), e()
				}, 0)
			}))).then(() => {
				t.isReady = !0
			}), Fe(t),
			function(e) {
				const t = e.uploadFile;
				e.uploadFile = function(e) {
					let s;
					return s = this.isReady ? Promise.resolve() : this.initUniCloud, s.then(() => t.call(
						this, e))
				};
				const s = e.uploadFile;
				e.uploadFile = function(e) {
					return o(s).call(this, e)
				}
			}(t),
			function(e) {
				e.database = function() {
					if (this._database) return this._database;
					const t = {},
						s = {};
					class n {
						constructor(e, t, s) {
							this.content = e, this.prevStage = t, this.actionName = s
						}
						toJSON() {
							let e = this;
							const t = [e.content];
							for (; e.prevStage;) e = e.prevStage, t.push(e.content);
							return {
								$db: t.reverse().map(e => ({
									$method: e.$method,
									$param: e.$param
								}))
							}
						}
						get useAggregate() {
							let e = this,
								t = !1;
							for (; e.prevStage;) {
								e = e.prevStage;
								const s = e.content.$method;
								if ("aggregate" === s || "pipeline" === s) {
									t = !0;
									break
								}
							}
							return t
						}
						get count() {
							if (!this.useAggregate) return function() {
								return this._send("count", Array.from(arguments))
							};
							const e = this;
							return function() {
								return i({
									$method: "count",
									$param: $e(Array.from(arguments))
								}, e, e.actionName)
							}
						}
						get() {
							return this._send("get", Array.from(arguments))
						}
						add() {
							return this._send("add", Array.from(arguments))
						}
						remove() {
							return this._send("remove", Array.from(arguments))
						}
						update() {
							return this._send("update", Array.from(arguments))
						}
						end() {
							return this._send("end", Array.from(arguments))
						}
						set() {
							throw new Error("clientDB禁止使用set方法")
						}
						_send(n, r) {
							const o = this.toJSON();
							return o.$db.push({
								$method: n,
								$param: r
							}), e.callFunction({
								name: "DCloud-clientDB",
								data: {
									action: this.actionName,
									command: o
								}
							}).then(e => {
								const {
									code: n,
									message: r,
									token: o,
									tokenExpired: i,
									systemInfo: a = []
								} = e.result;
								if (a)
									for (let e = 0; e < a.length; e++) {
										const {
											level: t,
											message: s,
											detail: n
										} = a[e], r = "app-plus" === process.env
											.VUE_APP_PLATFORM && "warn" === t ? "error" : t, o =
											console[r] || console.log;
										let i = "[System Info]" + s;
										n && (i = `${i}\n详细信息：${n}`), o(i)
									}
								return n ? Promise.reject(new Me(r, n)) : (o && i && t
									.refreshToken && t.refreshToken.forEach(e => {
										e({
											token: o,
											tokenExpired: i
										})
									}), o && i && s.refreshToken && s.refreshToken.forEach(
										e => {
											e({
												token: o,
												tokenExpired: i
											})
										}), Promise.resolve(e))
							}).catch(e => {
								const t = new Me(e.message, e.code || "SYSTEM_ERROR");
								return s.error && s.error.forEach(e => {
										e(t)
									}), /fc_function_not_found|FUNCTION_NOT_FOUND/g.test(e
										.message) && console.warn(
										"clientDB未初始化，请在web控制台保存一次schema以开启clientDB"), Promise
									.reject(e)
							})
						}
					}
					const r = ["db.Geo", "db.command", "command.aggregate"];

					function o(e, t) {
						return r.indexOf(`${e}.${t}`) > -1
					}

					function i(e, t, s) {
						return Ne(new n(e, t, s), {
							get(e, t) {
								let n = "db";
								return e && e.content && (n = e.content.$method), o(n, t) ? i({
									$method: t
								}, e, s) : function() {
									return i({
										$method: t,
										$param: $e(Array.from(arguments))
									}, e, s)
								}
							}
						})
					}

					function a({
						path: e,
						method: t
					}) {
						return class {
							constructor() {
								this.param = Array.from(arguments)
							}
							toJSON() {
								return {
									$newDb: [...e.map(e => ({
										$method: e
									})), {
										$method: t,
										$param: this.param
									}]
								}
							}
						}
					}
					const c = {
							auth: {
								on: (e, s) => {
									t[e] = t[e] || [], t[e].indexOf(s) > -1 || t[e].push(s)
								},
								off: (e, s) => {
									t[e] = t[e] || [];
									const n = t[e].indexOf(s); - 1 !== n && t[e].splice(n, 1)
								}
							},
							on: (e, t) => {
								s[e] = s[e] || [], s[e].indexOf(t) > -1 || s[e].push(t)
							},
							off: (e, t) => {
								s[e] = s[e] || [];
								const n = s[e].indexOf(t); - 1 !== n && s[e].splice(n, 1)
							},
							env: Ne({}, {
								get: (e, t) => ({
									$env: t
								})
							}),
							action: e => Ne({}, {
								get: (t, s) => o("db", s) ? i({
									$method: s
								}, null, e) : function() {
									return i({
										$method: s,
										$param: $e(Array.from(arguments))
									}, null, e)
								}
							}),
							Geo: Ne({}, {
								get: (e, t) => a({
									path: ["Geo"],
									method: t
								})
							}),
							getCloudEnv: function(e) {
								if ("string" != typeof e || !e.trim()) throw new Error(
									"getCloudEnv参数错误");
								return {
									$env: e.replace("$cloudEnv_", "")
								}
							},
							get serverDate() {
								return a({
									path: [],
									method: "serverDate"
								})
							},
							get RegExp() {
								return a({
									path: [],
									method: "RegExp"
								})
							}
						},
						u = Ne(c, {
							get: (e, t) => o("db", t) ? i({
								$method: t
							}) : function() {
								return i({
									$method: t,
									$param: $e(Array.from(arguments))
								})
							}
						});
					return this._database = u, u
				}
			}(t),
			function(e) {
				e.getCurrentUserInfo = Ke, e.chooseAndUploadFile = o(Be.initChooseAndUploadFile(e))
			}(t), t.init = this.init, t
	}
};
(() => {
	{
		let e = {};
        const cloudProvider = process.env.UNI_CLOUD_PROVIDER
        const providers = cloudProvider && JSON.parse(cloudProvider)||[]
		if (1 === providers.length) e = providers[0], We = We.init(e);
		else {
			const e = ["auth", "callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile",
					"database", "getCurrentUSerInfo"
				],
				t = providers.length > 0 ? "应用有多个服务空间，请通过uniCloud.init方法指定要使用的服务空间" :
				"应用未关联服务空间，请在cloudfunctions目录右键关联服务空间";
			e.forEach(e => {
				We[e] = function() {
					return console.error(t), Promise.reject(new i({
						code: "SYS_ERR",
						message: t
					}))
				}
			})
		}
		Object.assign(We, {
			get mixinDatacom() {
				return e = We, {
					props: {
						localdata: {
							type: Array,
							default: () => []
						},
						options: {
							type: [Object, Array],
							default: () => ({})
						},
						collection: {
							type: String,
							default: ""
						},
						action: {
							type: String,
							default: ""
						},
						field: {
							type: String,
							default: ""
						},
						orderby: {
							type: String,
							default: ""
						},
						where: {
							type: [String, Object],
							default: ""
						},
						pageData: {
							type: String,
							default: "add"
						},
						pageCurrent: {
							type: Number,
							default: 1
						},
						pageSize: {
							type: Number,
							default: 20
						},
						getcount: {
							type: [Boolean, String],
							default: !1
						},
						gettree: {
							type: [Boolean, String],
							default: !1
						},
						gettreepath: {
							type: [Boolean, String],
							default: !1
						},
						startwith: {
							type: String,
							default: ""
						},
						limitlevel: {
							type: Number,
							default: 10
						},
						groupby: {
							type: String,
							default: ""
						},
						groupField: {
							type: String,
							default: ""
						},
						distinct: {
							type: [Boolean, String],
							default: !1
						},
						foreignKey: {
							type: String,
							default: ""
						},
						loadtime: {
							type: String,
							default: "auto"
						},
						manual: {
							type: Boolean,
							default: !1
						}
					},
					data: () => ({
						mixinDatacomLoading: !1,
						mixinDatacomHasMore: !1,
						mixinDatacomResData: [],
						mixinDatacomErrorMessage: "",
						mixinDatacomPage: {}
					}),
					created() {
						this.mixinDatacomPage = {
							current: this.pageCurrent,
							size: this.pageSize,
							count: 0
						}, this.$watch(() => {
							var e = [];
							return ["pageCurrent", "pageSize", "localdata", "collection",
								"action", "field", "orderby", "where", "getont",
								"getcount", "gettree", "groupby", "groupField",
								"distinct"
							].forEach(t => {
								e.push(this[t])
							}), e
						}, (e, t) => {
							if (this.loadtime === je) return;
							let s = !1;
							const n = [];
							for (let r = 2; r < e.length; r++) e[r] !== t[r] && (n.push(e[
								r]), s = !0);
							e[0] !== t[0] && (this.mixinDatacomPage.current = this
									.pageCurrent), this.mixinDatacomPage.size = this
								.pageSize, this.onMixinDatacomPropsChange(s, n)
						})
					},
					methods: {
						onMixinDatacomPropsChange(e, t) {},
						mixinDatacomEasyGet({
							getone: e = !1,
							success: t,
							fail: s
						} = {}) {
							this.mixinDatacomLoading || (this.mixinDatacomLoading = !0, this
								.mixinDatacomErrorMessage = "", this.mixinDatacomGet().then(
								s => {
									this.mixinDatacomLoading = !1;
									const {
										data: n,
										count: r
									} = s.result;
									this.getcount && (this.mixinDatacomPage.count = r), this
										.mixinDatacomHasMore = n.length < this.pageSize;
									const o = e ? n.length ? n[0] : void 0 : n;
									this.mixinDatacomResData = o, t && t(o)
								}).catch(e => {
									this.mixinDatacomLoading = !1, this
										.mixinDatacomErrorMessage = e, s && s(e)
								}))
						},
						mixinDatacomGet(t = {}) {
							let s = e.database();
							const n = t.action || this.action;
							n && (s = s.action(n));
							const r = t.collection || this.collection;
							s = s.collection(r);
							const o = t.where || this.where;
							o && Object.keys(o).length && (s = s.where(o));
							const i = t.field || this.field;
							i && (s = s.field(i));
							const a = t.foreignKey || this.foreignKey;
							a && (s = s.foreignKey(a));
							const c = t.groupby || this.groupby;
							c && (s = s.groupBy(c));
							const u = t.groupField || this.groupField;
							u && (s = s.groupField(u)), !0 === (void 0 !== t.distinct ? t.distinct :
								this.distinct) && (s = s.distinct());
							const h = t.orderby || this.orderby;
							h && (s = s.orderBy(h));
							const l = void 0 !== t.pageCurrent ? t.pageCurrent : this
								.mixinDatacomPage.current,
								d = void 0 !== t.pageSize ? t.pageSize : this.mixinDatacomPage.size,
								f = void 0 !== t.getcount ? t.getcount : this.getcount,
								p = void 0 !== t.gettree ? t.gettree : this.gettree,
								g = void 0 !== t.gettreepath ? t.gettreepath : this.gettreepath,
								m = {
									getCount: f
								},
								y = {
									limitLevel: void 0 !== t.limitlevel ? t.limitlevel : this
										.limitlevel,
									startWith: void 0 !== t.startwith ? t.startwith : this.startwith
								};
							return p && (m.getTree = y), g && (m.getTreePath = y), s = s.skip(d * (
								l - 1)).limit(d).get(m), s
						}
					}
				};
				var e
			}
		})
	}
})();
var Ve = We;
export default Ve;
