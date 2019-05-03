"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _pug = _interopRequireDefault(require("pug"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _common = _interopRequireDefault(require("./common"));

var _i18n = _interopRequireDefault(require("../lib/i18n"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Generator =
/*#__PURE__*/
function (_Common) {
  _inherits(Generator, _Common);

  function Generator(config) {
    var _this;

    _classCallCheck(this, Generator);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Generator).call(this));
    _this._recipient = {};
    _this._statement_heading = {};
    _this._reference_info = {};
    _this._statement_conclusion = {};
    _this._article_headers = [];
    _this._articles = [];

    _this._i18nConfigure(config.language);

    _this.hydrate(config.global, _this._itemsToHydrate());

    return _this;
  }

  _createClass(Generator, [{
    key: "deleteArticles",

    /**
     * @description Reinitialize articles attribute
     */
    value: function deleteArticles() {
      this._total_inc_taxes = 0;
      this._total_taxes = 0;
      this._total_exc_taxes = 0;
      this._articles = [];
    }
    /**
     * @description Hydrate from configuration
     * @returns {[string,string,string,string]}
     */

  }, {
    key: "_itemsToHydrate",
    value: function _itemsToHydrate() {
      return ['logo', 'invoice_template', 'date_format', 'date', 'invoice_reference_pattern', 'invoice_note', 'lang'];
    }
    /**
     * @description Precompile translation to merging glabal with custom translations
     * @returns {{logo: *, header_date: *, fromto_phone, fromto_mail, moment: (*|moment.Moment)}}
     * @private
     */

  }, {
    key: "_preCompileCommonTranslations",
    value: function _preCompileCommonTranslations() {
      return {
        logo: this.logo,
        header_date: this.date,
        fromto_phone: _i18n["default"].__({
          phrase: 'fromto_phone',
          locale: this.lang
        }),
        fromto_mail: _i18n["default"].__({
          phrase: 'fromto_mail',
          locale: this.lang
        }),
        recipient: this._recipient,
        statement_heading: this._statement_heading,
        statement_conclusion: this._statement_conclusion,
        article_headers: this.article_headers,
        articles: this.articles,
        template_configuration: this._templateConfiguration(),
        moment: (0, _moment["default"])()
      };
    }
    /**
     * @description Compile pug template to HTML
     * @param keys
     * @returns {*}
     * @private
     */

  }, {
    key: "_compile",
    value: function _compile(keys) {
      var template = this.invoice_template;

      var compiled = _pug["default"].compileFile(_path["default"].resolve(template));

      console.log(keys);
      return compiled(keys);
    }
    /**
     * @description Return invoice translation keys object
     * @returns {*}
     */

  }, {
    key: "getInvoice",
    value: function getInvoice() {
      var _this2 = this;

      var keys = {
        invoice_header_title: _i18n["default"].__({
          phrase: 'invoice_header_title',
          locale: this.lang
        }),
        invoice_header_subject: _i18n["default"].__({
          phrase: 'invoice_header_subject',
          locale: this.lang
        }),
        table_note_content: this.invoice_note,
        note: function note(_note) {
          return _note ? _this2.invoice_note = _note : _this2.invoice_note;
        },
        filename: 'invoice'
      };
      return Object.assign(keys, {
        toHTML: function toHTML() {
          return _this2._toHTML(keys);
        },
        toPDF: function toPDF(options) {
          return _this2._toPDF(keys, options);
        }
      }, this._preCompileCommonTranslations());
    }
    /**
     * @description Return reference from pattern
     * @param type
     * @return {*}
     */

  }, {
    key: "getReferenceFromPattern",
    value: function getReferenceFromPattern(type) {
      if (!['invoice'].includes(type)) throw new Error('Type have to be "invoice"');
      if (this.reference) return this.reference;
      return this.setReferenceFromPattern(this.invoice_reference_pattern);
    }
    /**
     * @description Set reference
     * @param pattern
     * @return {*}
     * @private
     * @todo optimize it
     */

  }, {
    key: "setReferenceFromPattern",
    value: function setReferenceFromPattern(pattern) {
      var tmp = pattern.split('$').slice(1);
      var output = ''; // eslint-disable-next-line no-restricted-syntax

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = tmp[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;
          if (!item.endsWith('}')) throw new Error('Wrong pattern type');
          if (item.startsWith('prefix{')) output += item.replace('prefix{', '').slice(0, -1);else if (item.startsWith('separator{')) output += item.replace('separator{', '').slice(0, -1);else if (item.startsWith('date{')) output += (0, _moment["default"])().format(item.replace('date{', '').slice(0, -1));else if (item.startsWith('id{')) {
            var id = item.replace('id{', '').slice(0, -1);
            if (!/^\d+$/.test(id)) throw new Error("Id must be an integer (".concat(id, ")"));
            output += this._id ? this.pad(this._id, id.length) : this.pad(0, id.length);
          } else throw new Error("".concat(item, " pattern reference unknown"));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return output;
    }
    /**
     * @description Export object with html content and exportation functions
     * @returns {{html: *, toFile: (function(*): *)}}
     * @private
     */

  }, {
    key: "_toHTML",
    value: function _toHTML(keys) {
      var _this3 = this;

      var html = this._compile(this.getInvoice());

      return {
        html: html,
        toFile: function toFile(filepath) {
          return _this3._toFileFromHTML(html, filepath || "".concat(keys.filename, ".html"));
        }
      };
    }
    /**
     * @description Save content to pdf file
     * @returns {*}
     * @private
     */

  }, {
    key: "_toPDF",
    value: function _toPDF(keys, options) {
      var _this4 = this;

      var htmlToPdf = this._loadHtmlToPdf();

      var pdf = htmlToPdf.create(this._toHTML(keys).html, options);
      return {
        pdf: pdf,
        toFile: function toFile(filepath) {
          return _this4._toFileFromPDF(pdf, filepath || "".concat(keys.filename, ".pdf"));
        },
        toBuffer: function toBuffer() {
          return _this4._toBufferFromPDF(pdf);
        },
        toStream: function toStream(filepath) {
          return _this4._toStreamFromPDF(pdf, filepath || "".concat(keys.filename, ".pdf"));
        }
      };
    }
    /**
     * @description Save content into file from toHTML() method
     * @param content
     * @param filepath
     * @returns {Promise}
     * @private
     */

  }, {
    key: "_toFileFromHTML",
    value: function _toFileFromHTML(content, filepath) {
      return new Promise(function (resolve, reject) {
        return _fs["default"].writeFile(filepath, content, function (err) {
          if (err) reject(err);
          return resolve();
        });
      });
    }
    /**
     * @description Save content into file from toPDF() method
     * @param content
     * @param filepath
     * @returns {Promise}
     * @private
     */

  }, {
    key: "_toFileFromPDF",
    value: function _toFileFromPDF(content, filepath) {
      return new Promise(function (resolve, reject) {
        return content.toFile(filepath, function (err, res) {
          if (err) return reject(err);
          return resolve(res);
        });
      });
    }
    /**
     * @description Export PDF to buffer
     * @param content
     * @returns {*}
     * @private
     */

  }, {
    key: "_toBufferFromPDF",
    value: function _toBufferFromPDF(content) {
      return content.toBuffer(function (err, buffer) {
        if (err) throw new Error(err);
        return buffer;
      });
    }
    /**
     * @description Export PDF to file using stream
     * @param content
     * @param filepath
     * @returns {*}
     * @private
     */

  }, {
    key: "_toStreamFromPDF",
    value: function _toStreamFromPDF(content, filepath) {
      return content.toStream(function (err, stream) {
        return stream.pipe(_fs["default"].createWriteStream(filepath));
      });
    }
    /**
     * @description Calculates number of pages and items per page
     * @return {{rows_in_first_page: number, rows_in_others_pages: number, loop_table: number}}
     * @private
     */

  }, {
    key: "_templateConfiguration",
    value: function _templateConfiguration() {
      return {};
    }
    /**
     * @description Overrides i18n configuration
     * @param config
     * @private
     */

  }, {
    key: "_i18nConfigure",
    value: function _i18nConfigure(config) {
      this._defaultLocale = config && config.defaultLocale ? config.defaultLocale : 'en';
      this._availableLocale = config && config.locales ? config.locales : ['en', 'fr'];
      if (config) _i18n["default"].configure(config);
    }
    /**
     * @description Loads html-pdf module if available
     * @returns {*}
     * @private
     */

  }, {
    key: "_loadHtmlToPdf",
    value: function _loadHtmlToPdf() {
      try {
        /* eslint import/no-unresolved: [2, { ignore: ['html-pdf'] }] */
        return require('html-pdf'); // eslint-disable-line global-require
      } catch (err) {
        throw new Error('Cannot load html-pdf. Try installing it: npm i -S html-pdf@2.2.0');
      }
    }
  }, {
    key: "template",
    get: function get() {
      return this._template;
    },
    set: function set(value) {
      this._template = value;
    }
  }, {
    key: "lang",
    get: function get() {
      return !this._lang ? this._defaultLocale : this._lang;
    },
    set: function set(value) {
      var tmp = value.toLowerCase();
      if (!this._availableLocale.includes(tmp)) throw new Error("Wrong lang, please set one of ".concat(this._availableLocale.join(', ')));
      this._lang = tmp;
    }
  }, {
    key: "id",
    get: function get() {
      return this._id;
    },
    set: function set(value) {
      this._id = value;
    }
  }, {
    key: "invoice_reference_pattern",
    get: function get() {
      return !this._invoice_reference_pattern ? '$prefix{IN}$date{YYMM}$separator{-}$id{00000}' : this._invoice_reference_pattern;
    },
    set: function set(value) {
      this._invoice_reference_pattern = value;
    }
  }, {
    key: "reference",
    get: function get() {
      return this._reference;
    },
    set: function set(value) {
      this._reference = value;
    }
  }, {
    key: "logo",
    get: function get() {
      return this._logo;
    },
    set: function set(value) {
      this._logo = value;
    }
  }, {
    key: "invoice_template",
    get: function get() {
      return this._invoice_template;
    },
    set: function set(value) {
      this._invoice_template = value;
    }
  }, {
    key: "date_format",
    get: function get() {
      return !this._date_format ? 'YYYY/MM/DD' : this._date_format;
    },
    set: function set(value) {
      this._date_format = value;
    }
  }, {
    key: "date",
    get: function get() {
      return !this._date ? (0, _moment["default"])().format(this.date_format) : this._date;
    },
    set: function set(value) {
      if (!(0, _moment["default"])(value).isValid()) throw new Error('Date not valid');
      this._date = (0, _moment["default"])(value).format(this.date_format);
    }
  }, {
    key: "statement_heading",
    get: function get() {
      return this._statement_heading;
    }
    /**
     * @description Set
     * @param value
     */
    ,
    set: function set(value) {
      this._statement_heading = value;
    }
  }, {
    key: "reference_info",
    get: function get() {
      return this._reference_info;
    }
    /**
     * @description Set
     * @param value
     */
    ,
    set: function set(value) {
      this._reference_info = value;
    }
  }, {
    key: "statement_conclusion",
    get: function get() {
      return this._statement_conclusion;
    }
    /**
     * @description Set
     * @param value
     */
    ,
    set: function set(value) {
      this._statement_conclusion = value;
    }
  }, {
    key: "recipient",
    get: function get() {
      return this._recipient;
    }
    /**
     * @description Set
     * @param value
     */
    ,
    set: function set(value) {
      this._recipient = value;
    }
  }, {
    key: "article_headers",
    get: function get() {
      return this._article_headers;
    }
    /**
     * @description Set
     * @param value
     */
    ,
    set: function set(value) {
      var tmp = value;
      this._article_headers = this._article_headers ? this._article_headers.concat(tmp) : [].concat(tmp);
    }
  }, {
    key: "articles",
    get: function get() {
      return this._articles;
    }
    /**
     * @description Set
     * @param value
     */
    ,
    set: function set(value) {
      var tmp = value;
      this._articles = this._articles ? this._articles.concat(tmp) : [].concat(tmp);
    }
  }]);

  return Generator;
}(_common["default"]);

exports["default"] = Generator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzc2VzL2dlbmVyYXRvci5qcyJdLCJuYW1lcyI6WyJHZW5lcmF0b3IiLCJjb25maWciLCJfcmVjaXBpZW50IiwiX3N0YXRlbWVudF9oZWFkaW5nIiwiX3JlZmVyZW5jZV9pbmZvIiwiX3N0YXRlbWVudF9jb25jbHVzaW9uIiwiX2FydGljbGVfaGVhZGVycyIsIl9hcnRpY2xlcyIsIl9pMThuQ29uZmlndXJlIiwibGFuZ3VhZ2UiLCJoeWRyYXRlIiwiZ2xvYmFsIiwiX2l0ZW1zVG9IeWRyYXRlIiwiX3RvdGFsX2luY190YXhlcyIsIl90b3RhbF90YXhlcyIsIl90b3RhbF9leGNfdGF4ZXMiLCJsb2dvIiwiaGVhZGVyX2RhdGUiLCJkYXRlIiwiZnJvbXRvX3Bob25lIiwiaTE4biIsIl9fIiwicGhyYXNlIiwibG9jYWxlIiwibGFuZyIsImZyb210b19tYWlsIiwicmVjaXBpZW50Iiwic3RhdGVtZW50X2hlYWRpbmciLCJzdGF0ZW1lbnRfY29uY2x1c2lvbiIsImFydGljbGVfaGVhZGVycyIsImFydGljbGVzIiwidGVtcGxhdGVfY29uZmlndXJhdGlvbiIsIl90ZW1wbGF0ZUNvbmZpZ3VyYXRpb24iLCJtb21lbnQiLCJrZXlzIiwidGVtcGxhdGUiLCJpbnZvaWNlX3RlbXBsYXRlIiwiY29tcGlsZWQiLCJwdWciLCJjb21waWxlRmlsZSIsInBhdGgiLCJyZXNvbHZlIiwiY29uc29sZSIsImxvZyIsImludm9pY2VfaGVhZGVyX3RpdGxlIiwiaW52b2ljZV9oZWFkZXJfc3ViamVjdCIsInRhYmxlX25vdGVfY29udGVudCIsImludm9pY2Vfbm90ZSIsIm5vdGUiLCJmaWxlbmFtZSIsIk9iamVjdCIsImFzc2lnbiIsInRvSFRNTCIsIl90b0hUTUwiLCJ0b1BERiIsIm9wdGlvbnMiLCJfdG9QREYiLCJfcHJlQ29tcGlsZUNvbW1vblRyYW5zbGF0aW9ucyIsInR5cGUiLCJpbmNsdWRlcyIsIkVycm9yIiwicmVmZXJlbmNlIiwic2V0UmVmZXJlbmNlRnJvbVBhdHRlcm4iLCJpbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuIiwicGF0dGVybiIsInRtcCIsInNwbGl0Iiwic2xpY2UiLCJvdXRwdXQiLCJpdGVtIiwiZW5kc1dpdGgiLCJzdGFydHNXaXRoIiwicmVwbGFjZSIsImZvcm1hdCIsImlkIiwidGVzdCIsIl9pZCIsInBhZCIsImxlbmd0aCIsImh0bWwiLCJfY29tcGlsZSIsImdldEludm9pY2UiLCJ0b0ZpbGUiLCJmaWxlcGF0aCIsIl90b0ZpbGVGcm9tSFRNTCIsImh0bWxUb1BkZiIsIl9sb2FkSHRtbFRvUGRmIiwicGRmIiwiY3JlYXRlIiwiX3RvRmlsZUZyb21QREYiLCJ0b0J1ZmZlciIsIl90b0J1ZmZlckZyb21QREYiLCJ0b1N0cmVhbSIsIl90b1N0cmVhbUZyb21QREYiLCJjb250ZW50IiwiUHJvbWlzZSIsInJlamVjdCIsImZzIiwid3JpdGVGaWxlIiwiZXJyIiwicmVzIiwiYnVmZmVyIiwic3RyZWFtIiwicGlwZSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwiX2RlZmF1bHRMb2NhbGUiLCJkZWZhdWx0TG9jYWxlIiwiX2F2YWlsYWJsZUxvY2FsZSIsImxvY2FsZXMiLCJjb25maWd1cmUiLCJyZXF1aXJlIiwiX3RlbXBsYXRlIiwidmFsdWUiLCJfbGFuZyIsInRvTG93ZXJDYXNlIiwiam9pbiIsIl9pbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuIiwiX3JlZmVyZW5jZSIsIl9sb2dvIiwiX2ludm9pY2VfdGVtcGxhdGUiLCJfZGF0ZV9mb3JtYXQiLCJfZGF0ZSIsImRhdGVfZm9ybWF0IiwiaXNWYWxpZCIsImNvbmNhdCIsIkNvbW1vbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRXFCQSxTOzs7OztBQUNuQixxQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUFBOztBQUNsQjtBQUNBLFVBQUtDLFVBQUwsR0FBa0IsRUFBbEI7QUFDQSxVQUFLQyxrQkFB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O0FBQ0Q7QUFFRDs7Ozs7c0JBSW1CNEcsSyxFQUFPO0FBQ3hCLFdBQUs1RyxlQUFMLEdBQXVCNEcsS0FBdkI7QUFDRDs7O3dCQUUwQjtBQUN6QixhQUFPLEtBQUszRyxxQkFBWjtBQUNEO0FBRUQ7Ozs7O3NCQUl5QjJHLEssRUFBTztBQUM5QixXQUFLM0cscUJBQUwsR0FBNkIyRyxLQUE3QjtBQUNEOzs7d0JBRWU7QUFDZCxhQUFPLEtBQUs5RyxVQUFaO0FBQ0Q7QUFFRDs7Ozs7c0JBSWM4RyxLLEVBQU87QUFDbkIsV0FBSzlHLFVBQUwsR0FBa0I4RyxLQUFsQjtBQUNEOzs7d0JBRXFCO0FBQ3BCLGFBQU8sS0FBSzFHLGdCQUFaO0FBQ0Q7QUFFRDs7Ozs7c0JBSW9CMEcsSyxFQUFPO0FBQ3pCLFVBQU0vQyxHQUFHLEdBQUcrQyxLQUFaO0FBQ0EsV0FBSzFHLGdCQUFMLEdBQXlCLEtBQUtBLGdCQUFOLEdBQTBCLEtBQUtBLGdCQUFMLENBQXNCc0gsTUFBdEIsQ0FBNkIzRCxHQUE3QixDQUExQixHQUE4RCxHQUFHMkQsTUFBSCxDQUFVM0QsR0FBVixDQUF0RjtBQUNEOzs7d0JBR2M7QUFDYixhQUFPLEtBQUsxRCxTQUFaO0FBQ0Q7QUFFRDs7Ozs7c0JBSWF5RyxLLEVBQU87QUFDbEIsVUFBTS9DLEdBQUcsR0FBRytDLEtBQVo7QUFDQSxXQUFLekcsU0FBTCxHQUFrQixLQUFLQSxTQUFOLEdBQW1CLEtBQUtBLFNBQUwsQ0FBZXFILE1BQWYsQ0FBc0IzRCxHQUF0QixDQUFuQixHQUFnRCxHQUFHMkQsTUFBSCxDQUFVM0QsR0FBVixDQUFqRTtBQUNEOzs7O0VBaktvQzRELGtCIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgcHVnIGZyb20gJ3B1Zyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgQ29tbW9uIGZyb20gJy4vY29tbW9uJztcbmltcG9ydCBpMThuIGZyb20gJy4uL2xpYi9pMThuJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXJhdG9yIGV4dGVuZHMgQ29tbW9uIHtcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9yZWNpcGllbnQgPSB7fTtcbiAgICB0aGlzLl9zdGF0ZW1lbnRfaGVhZGluZyA9IHt9O1xuICAgIHRoaXMuX3JlZmVyZW5jZV9pbmZvID0ge307XG4gICAgdGhpcy5fc3RhdGVtZW50X2NvbmNsdXNpb24gPSB7fTtcbiAgICB0aGlzLl9hcnRpY2xlX2hlYWRlcnMgPSBbXTtcbiAgICB0aGlzLl9hcnRpY2xlcyA9IFtdO1xuICAgIHRoaXMuX2kxOG5Db25maWd1cmUoY29uZmlnLmxhbmd1YWdlKTtcbiAgICB0aGlzLmh5ZHJhdGUoY29uZmlnLmdsb2JhbCwgdGhpcy5faXRlbXNUb0h5ZHJhdGUoKSk7XG4gIH1cblxuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlO1xuICB9XG5cbiAgc2V0IHRlbXBsYXRlKHZhbHVlKSB7XG4gICAgdGhpcy5fdGVtcGxhdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBsYW5nKCkge1xuICAgIHJldHVybiAoIXRoaXMuX2xhbmcpID8gdGhpcy5fZGVmYXVsdExvY2FsZSA6IHRoaXMuX2xhbmc7XG4gIH1cblxuICBzZXQgbGFuZyh2YWx1ZSkge1xuICAgIGNvbnN0IHRtcCA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKCF0aGlzLl9hdmFpbGFibGVMb2NhbGUuaW5jbHVkZXModG1wKSkgdGhyb3cgbmV3IEVycm9yKGBXcm9uZyBsYW5nLCBwbGVhc2Ugc2V0IG9uZSBvZiAke3RoaXMuX2F2YWlsYWJsZUxvY2FsZS5qb2luKCcsICcpfWApO1xuICAgIHRoaXMuX2xhbmcgPSB0bXA7XG4gIH1cblxuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG5cbiAgc2V0IGlkKHZhbHVlKSB7XG4gICAgdGhpcy5faWQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBpbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuKCkge1xuICAgIHJldHVybiAoIXRoaXMuX2ludm9pY2VfcmVmZXJlbmNlX3BhdHRlcm4pID8gJyRwcmVmaXh7SU59JGRhdGV7WVlNTX0kc2VwYXJhdG9yey19JGlkezAwMDAwfScgOiB0aGlzLl9pbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuO1xuICB9XG5cbiAgc2V0IGludm9pY2VfcmVmZXJlbmNlX3BhdHRlcm4odmFsdWUpIHtcbiAgICB0aGlzLl9pbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcmVmZXJlbmNlKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWZlcmVuY2U7XG4gIH1cblxuICBzZXQgcmVmZXJlbmNlKHZhbHVlKSB7XG4gICAgdGhpcy5fcmVmZXJlbmNlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgbG9nbygpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9nbztcbiAgfVxuXG4gIHNldCBsb2dvKHZhbHVlKSB7XG4gICAgdGhpcy5fbG9nbyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGludm9pY2VfdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ludm9pY2VfdGVtcGxhdGU7XG4gIH1cblxuICBzZXQgaW52b2ljZV90ZW1wbGF0ZSh2YWx1ZSkge1xuICAgIHRoaXMuX2ludm9pY2VfdGVtcGxhdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBkYXRlX2Zvcm1hdCgpIHtcbiAgICByZXR1cm4gKCF0aGlzLl9kYXRlX2Zvcm1hdCkgPyAnWVlZWS9NTS9ERCcgOiB0aGlzLl9kYXRlX2Zvcm1hdDtcbiAgfVxuXG4gIHNldCBkYXRlX2Zvcm1hdCh2YWx1ZSkge1xuICAgIHRoaXMuX2RhdGVfZm9ybWF0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZGF0ZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLl9kYXRlKSA/IG1vbWVudCgpLmZvcm1hdCh0aGlzLmRhdGVfZm9ybWF0KSA6IHRoaXMuX2RhdGU7XG4gIH1cblxuICBzZXQgZGF0ZSh2YWx1ZSkge1xuICAgIGlmICghbW9tZW50KHZhbHVlKS5pc1ZhbGlkKCkpIHRocm93IG5ldyBFcnJvcignRGF0ZSBub3QgdmFsaWQnKTtcbiAgICB0aGlzLl9kYXRlID0gbW9tZW50KHZhbHVlKS5mb3JtYXQodGhpcy5kYXRlX2Zvcm1hdCk7XG4gIH1cblxuICBnZXQgc3RhdGVtZW50X2hlYWRpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlbWVudF9oZWFkaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBTZXRcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICBzZXQgc3RhdGVtZW50X2hlYWRpbmcodmFsdWUpIHtcbiAgICB0aGlzLl9zdGF0ZW1lbnRfaGVhZGluZyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHJlZmVyZW5jZV9pbmZvKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWZlcmVuY2VfaW5mbztcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gU2V0XG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgc2V0IHJlZmVyZW5jZV9pbmZvKHZhbHVlKSB7XG4gICAgdGhpcy5fcmVmZXJlbmNlX2luZm8gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBzdGF0ZW1lbnRfY29uY2x1c2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGVtZW50X2NvbmNsdXNpb247XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFNldFxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICovXG4gIHNldCBzdGF0ZW1lbnRfY29uY2x1c2lvbih2YWx1ZSkge1xuICAgIHRoaXMuX3N0YXRlbWVudF9jb25jbHVzaW9uID0gdmFsdWU7XG4gIH1cbiAgXG4gIGdldCByZWNpcGllbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlY2lwaWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gU2V0XG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgc2V0IHJlY2lwaWVudCh2YWx1ZSkge1xuICAgIHRoaXMuX3JlY2lwaWVudCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGFydGljbGVfaGVhZGVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fYXJ0aWNsZV9oZWFkZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBTZXRcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICBzZXQgYXJ0aWNsZV9oZWFkZXJzKHZhbHVlKSB7XG4gICAgY29uc3QgdG1wID0gdmFsdWU7XG4gICAgdGhpcy5fYXJ0aWNsZV9oZWFkZXJzID0gKHRoaXMuX2FydGljbGVfaGVhZGVycykgPyB0aGlzLl9hcnRpY2xlX2hlYWRlcnMuY29uY2F0KHRtcCkgOiBbXS5jb25jYXQodG1wKTtcbiAgfVxuXG5cbiAgZ2V0IGFydGljbGVzKCkge1xuICAgIHJldHVybiB0aGlzLl9hcnRpY2xlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gU2V0XG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgc2V0IGFydGljbGVzKHZhbHVlKSB7XG4gICAgY29uc3QgdG1wID0gdmFsdWU7XG4gICAgdGhpcy5fYXJ0aWNsZXMgPSAodGhpcy5fYXJ0aWNsZXMpID8gdGhpcy5fYXJ0aWNsZXMuY29uY2F0KHRtcCkgOiBbXS5jb25jYXQodG1wKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gUmVpbml0aWFsaXplIGFydGljbGVzIGF0dHJpYnV0ZVxuICAgKi9cbiAgZGVsZXRlQXJ0aWNsZXMoKSB7XG4gICAgdGhpcy5fdG90YWxfaW5jX3RheGVzID0gMDtcbiAgICB0aGlzLl90b3RhbF90YXhlcyA9IDA7XG4gICAgdGhpcy5fdG90YWxfZXhjX3RheGVzID0gMDtcbiAgICB0aGlzLl9hcnRpY2xlcyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBIeWRyYXRlIGZyb20gY29uZmlndXJhdGlvblxuICAgKiBAcmV0dXJucyB7W3N0cmluZyxzdHJpbmcsc3RyaW5nLHN0cmluZ119XG4gICAqL1xuICBfaXRlbXNUb0h5ZHJhdGUoKSB7XG4gICAgcmV0dXJuIFsnbG9nbycsICdpbnZvaWNlX3RlbXBsYXRlJywgJ2RhdGVfZm9ybWF0JywgJ2RhdGUnLCAnaW52b2ljZV9yZWZlcmVuY2VfcGF0dGVybicsICdpbnZvaWNlX25vdGUnLCAnbGFuZyddO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBQcmVjb21waWxlIHRyYW5zbGF0aW9uIHRvIG1lcmdpbmcgZ2xhYmFsIHdpdGggY3VzdG9tIHRyYW5zbGF0aW9uc1xuICAgKiBAcmV0dXJucyB7e2xvZ286ICosIGhlYWRlcl9kYXRlOiAqLCBmcm9tdG9fcGhvbmUsIGZyb210b19tYWlsLCBtb21lbnQ6ICgqfG1vbWVudC5Nb21lbnQpfX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9wcmVDb21waWxlQ29tbW9uVHJhbnNsYXRpb25zKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsb2dvOiB0aGlzLmxvZ28sXG4gICAgICBoZWFkZXJfZGF0ZTogdGhpcy5kYXRlLFxuICAgICAgZnJvbXRvX3Bob25lOiBpMThuLl9fKHtwaHJhc2U6ICdmcm9tdG9fcGhvbmUnLCBsb2NhbGU6IHRoaXMubGFuZ30pLFxuICAgICAgZnJvbXRvX21haWw6IGkxOG4uX18oe3BocmFzZTogJ2Zyb210b19tYWlsJywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIHJlY2lwaWVudDogdGhpcy5fcmVjaXBpZW50LFxuICAgICAgc3RhdGVtZW50X2hlYWRpbmc6IHRoaXMuX3N0YXRlbWVudF9oZWFkaW5nLFxuICAgICAgc3RhdGVtZW50X2NvbmNsdXNpb246IHRoaXMuX3N0YXRlbWVudF9jb25jbHVzaW9uLFxuICAgICAgYXJ0aWNsZV9oZWFkZXJzOiB0aGlzLmFydGljbGVfaGVhZGVycyxcbiAgICAgIGFydGljbGVzOiB0aGlzLmFydGljbGVzLFxuICAgICAgdGVtcGxhdGVfY29uZmlndXJhdGlvbjogdGhpcy5fdGVtcGxhdGVDb25maWd1cmF0aW9uKCksXG4gICAgICBtb21lbnQ6IG1vbWVudCgpLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIENvbXBpbGUgcHVnIHRlbXBsYXRlIHRvIEhUTUxcbiAgICogQHBhcmFtIGtleXNcbiAgICogQHJldHVybnMgeyp9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY29tcGlsZShrZXlzKSB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLmludm9pY2VfdGVtcGxhdGU7XG4gICAgY29uc3QgY29tcGlsZWQgPSBwdWcuY29tcGlsZUZpbGUocGF0aC5yZXNvbHZlKHRlbXBsYXRlKSk7XG4gICAgY29uc29sZS5sb2coa2V5cyk7XG4gICAgcmV0dXJuIGNvbXBpbGVkKGtleXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBSZXR1cm4gaW52b2ljZSB0cmFuc2xhdGlvbiBrZXlzIG9iamVjdFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGdldEludm9pY2UoKSB7XG4gICAgY29uc3Qga2V5cyA9IHtcbiAgICAgIGludm9pY2VfaGVhZGVyX3RpdGxlOiBpMThuLl9fKHtwaHJhc2U6ICdpbnZvaWNlX2hlYWRlcl90aXRsZScsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICBpbnZvaWNlX2hlYWRlcl9zdWJqZWN0OiBpMThuLl9fKHtwaHJhc2U6ICdpbnZvaWNlX2hlYWRlcl9zdWJqZWN0JywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIHRhYmxlX25vdGVfY29udGVudDogdGhpcy5pbnZvaWNlX25vdGUsXG4gICAgICBub3RlOiAobm90ZSkgPT4gKChub3RlKSA/IHRoaXMuaW52b2ljZV9ub3RlID0gbm90ZSA6IHRoaXMuaW52b2ljZV9ub3RlKSxcbiAgICAgIGZpbGVuYW1lOiAnaW52b2ljZScsXG4gICAgfTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihrZXlzLCB7XG4gICAgICB0b0hUTUw6ICgpID0+IHRoaXMuX3RvSFRNTChrZXlzKSxcbiAgICAgIHRvUERGOiAob3B0aW9ucykgPT4gdGhpcy5fdG9QREYoa2V5cyxvcHRpb25zKSxcbiAgICB9LCB0aGlzLl9wcmVDb21waWxlQ29tbW9uVHJhbnNsYXRpb25zKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBSZXR1cm4gcmVmZXJlbmNlIGZyb20gcGF0dGVyblxuICAgKiBAcGFyYW0gdHlwZVxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0UmVmZXJlbmNlRnJvbVBhdHRlcm4odHlwZSkge1xuICAgIGlmICghWydpbnZvaWNlJ10uaW5jbHVkZXModHlwZSkpIHRocm93IG5ldyBFcnJvcignVHlwZSBoYXZlIHRvIGJlIFwiaW52b2ljZVwiJyk7XG4gICAgaWYgKHRoaXMucmVmZXJlbmNlKSByZXR1cm4gdGhpcy5yZWZlcmVuY2U7XG4gICAgcmV0dXJuIHRoaXMuc2V0UmVmZXJlbmNlRnJvbVBhdHRlcm4odGhpcy5pbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gU2V0IHJlZmVyZW5jZVxuICAgKiBAcGFyYW0gcGF0dGVyblxuICAgKiBAcmV0dXJuIHsqfVxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdG9kbyBvcHRpbWl6ZSBpdFxuICAgKi9cbiAgc2V0UmVmZXJlbmNlRnJvbVBhdHRlcm4ocGF0dGVybikge1xuICAgIGNvbnN0IHRtcCA9IHBhdHRlcm4uc3BsaXQoJyQnKS5zbGljZSgxKTtcbiAgICBsZXQgb3V0cHV0ID0gJyc7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHRtcCkge1xuICAgICAgaWYgKCFpdGVtLmVuZHNXaXRoKCd9JykpIHRocm93IG5ldyBFcnJvcignV3JvbmcgcGF0dGVybiB0eXBlJyk7XG4gICAgICBpZiAoaXRlbS5zdGFydHNXaXRoKCdwcmVmaXh7JykpIG91dHB1dCArPSBpdGVtLnJlcGxhY2UoJ3ByZWZpeHsnLCAnJykuc2xpY2UoMCwgLTEpO1xuICAgICAgZWxzZSBpZiAoaXRlbS5zdGFydHNXaXRoKCdzZXBhcmF0b3J7JykpIG91dHB1dCArPSBpdGVtLnJlcGxhY2UoJ3NlcGFyYXRvcnsnLCAnJykuc2xpY2UoMCwgLTEpO1xuICAgICAgZWxzZSBpZiAoaXRlbS5zdGFydHNXaXRoKCdkYXRleycpKSBvdXRwdXQgKz0gbW9tZW50KCkuZm9ybWF0KGl0ZW0ucmVwbGFjZSgnZGF0ZXsnLCAnJykuc2xpY2UoMCwgLTEpKTtcbiAgICAgIGVsc2UgaWYgKGl0ZW0uc3RhcnRzV2l0aCgnaWR7JykpIHtcbiAgICAgICAgY29uc3QgaWQgPSBpdGVtLnJlcGxhY2UoJ2lkeycsICcnKS5zbGljZSgwLCAtMSk7XG4gICAgICAgIGlmICghL15cXGQrJC8udGVzdChpZCkpIHRocm93IG5ldyBFcnJvcihgSWQgbXVzdCBiZSBhbiBpbnRlZ2VyICgke2lkfSlgKTtcbiAgICAgICAgb3V0cHV0ICs9ICh0aGlzLl9pZCkgPyB0aGlzLnBhZCh0aGlzLl9pZCwgaWQubGVuZ3RoKSA6IHRoaXMucGFkKDAsIGlkLmxlbmd0aCk7XG4gICAgICB9IGVsc2UgdGhyb3cgbmV3IEVycm9yKGAke2l0ZW19IHBhdHRlcm4gcmVmZXJlbmNlIHVua25vd25gKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gRXhwb3J0IG9iamVjdCB3aXRoIGh0bWwgY29udGVudCBhbmQgZXhwb3J0YXRpb24gZnVuY3Rpb25zXG4gICAqIEByZXR1cm5zIHt7aHRtbDogKiwgdG9GaWxlOiAoZnVuY3Rpb24oKik6ICopfX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF90b0hUTUwoa2V5cykge1xuICAgIGNvbnN0IGh0bWwgPSB0aGlzLl9jb21waWxlKHRoaXMuZ2V0SW52b2ljZSgpKTtcbiAgICByZXR1cm4ge1xuICAgICAgaHRtbCxcbiAgICAgIHRvRmlsZTogKGZpbGVwYXRoKSA9PiB0aGlzLl90b0ZpbGVGcm9tSFRNTChodG1sLCAoZmlsZXBhdGgpIHx8IGAke2tleXMuZmlsZW5hbWV9Lmh0bWxgKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBTYXZlIGNvbnRlbnQgdG8gcGRmIGZpbGVcbiAgICogQHJldHVybnMgeyp9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdG9QREYoa2V5cywgb3B0aW9ucykge1xuICAgIGNvbnN0IGh0bWxUb1BkZiA9IHRoaXMuX2xvYWRIdG1sVG9QZGYoKTtcbiAgICBjb25zdCBwZGYgPSBodG1sVG9QZGYuY3JlYXRlKHRoaXMuX3RvSFRNTChrZXlzKS5odG1sLCBvcHRpb25zXG4gICAgKTtcbiAgICByZXR1cm4ge1xuICAgICAgcGRmLFxuICAgICAgdG9GaWxlOiAoZmlsZXBhdGgpID0+IHRoaXMuX3RvRmlsZUZyb21QREYocGRmLCAoZmlsZXBhdGgpIHx8IGAke2tleXMuZmlsZW5hbWV9LnBkZmApLFxuICAgICAgdG9CdWZmZXI6ICgpID0+IHRoaXMuX3RvQnVmZmVyRnJvbVBERihwZGYpLFxuICAgICAgdG9TdHJlYW06IChmaWxlcGF0aCkgPT4gdGhpcy5fdG9TdHJlYW1Gcm9tUERGKHBkZiwgKGZpbGVwYXRoKSB8fCBgJHtrZXlzLmZpbGVuYW1lfS5wZGZgKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBTYXZlIGNvbnRlbnQgaW50byBmaWxlIGZyb20gdG9IVE1MKCkgbWV0aG9kXG4gICAqIEBwYXJhbSBjb250ZW50XG4gICAqIEBwYXJhbSBmaWxlcGF0aFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF90b0ZpbGVGcm9tSFRNTChjb250ZW50LCBmaWxlcGF0aCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiBmcy53cml0ZUZpbGUoZmlsZXBhdGgsIGNvbnRlbnQsIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHJlamVjdChlcnIpO1xuICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFNhdmUgY29udGVudCBpbnRvIGZpbGUgZnJvbSB0b1BERigpIG1ldGhvZFxuICAgKiBAcGFyYW0gY29udGVudFxuICAgKiBAcGFyYW0gZmlsZXBhdGhcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdG9GaWxlRnJvbVBERihjb250ZW50LCBmaWxlcGF0aCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiBjb250ZW50LnRvRmlsZShmaWxlcGF0aCwgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICByZXR1cm4gcmVzb2x2ZShyZXMpO1xuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gRXhwb3J0IFBERiB0byBidWZmZXJcbiAgICogQHBhcmFtIGNvbnRlbnRcbiAgICogQHJldHVybnMgeyp9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdG9CdWZmZXJGcm9tUERGKGNvbnRlbnQpIHtcbiAgICByZXR1cm4gY29udGVudC50b0J1ZmZlcigoZXJyLCBidWZmZXIpID0+IHtcbiAgICAgIGlmIChlcnIpIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIGJ1ZmZlcjtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gRXhwb3J0IFBERiB0byBmaWxlIHVzaW5nIHN0cmVhbVxuICAgKiBAcGFyYW0gY29udGVudFxuICAgKiBAcGFyYW0gZmlsZXBhdGhcbiAgICogQHJldHVybnMgeyp9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdG9TdHJlYW1Gcm9tUERGKGNvbnRlbnQsIGZpbGVwYXRoKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQudG9TdHJlYW0oKGVyciwgc3RyZWFtKSA9PiBzdHJlYW0ucGlwZShmcy5jcmVhdGVXcml0ZVN0cmVhbShmaWxlcGF0aCkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gQ2FsY3VsYXRlcyBudW1iZXIgb2YgcGFnZXMgYW5kIGl0ZW1zIHBlciBwYWdlXG4gICAqIEByZXR1cm4ge3tyb3dzX2luX2ZpcnN0X3BhZ2U6IG51bWJlciwgcm93c19pbl9vdGhlcnNfcGFnZXM6IG51bWJlciwgbG9vcF90YWJsZTogbnVtYmVyfX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF90ZW1wbGF0ZUNvbmZpZ3VyYXRpb24oKSB7XG4gICAgcmV0dXJuIHt9XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIE92ZXJyaWRlcyBpMThuIGNvbmZpZ3VyYXRpb25cbiAgICogQHBhcmFtIGNvbmZpZ1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2kxOG5Db25maWd1cmUoY29uZmlnKSB7XG4gICAgdGhpcy5fZGVmYXVsdExvY2FsZSA9IChjb25maWcgJiYgY29uZmlnLmRlZmF1bHRMb2NhbGUpID8gY29uZmlnLmRlZmF1bHRMb2NhbGUgOiAnZW4nO1xuICAgIHRoaXMuX2F2YWlsYWJsZUxvY2FsZSA9IChjb25maWcgJiYgY29uZmlnLmxvY2FsZXMpID8gY29uZmlnLmxvY2FsZXMgOiBbJ2VuJywgJ2ZyJ107XG4gICAgaWYgKGNvbmZpZykgaTE4bi5jb25maWd1cmUoY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gTG9hZHMgaHRtbC1wZGYgbW9kdWxlIGlmIGF2YWlsYWJsZVxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9sb2FkSHRtbFRvUGRmKCkge1xuICAgIHRyeSB7XG4gICAgICAvKiBlc2xpbnQgaW1wb3J0L25vLXVucmVzb2x2ZWQ6IFsyLCB7IGlnbm9yZTogWydodG1sLXBkZiddIH1dICovXG4gICAgICByZXR1cm4gcmVxdWlyZSgnaHRtbC1wZGYnKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBnbG9iYWwtcmVxdWlyZVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgbG9hZCBodG1sLXBkZi4gVHJ5IGluc3RhbGxpbmcgaXQ6IG5wbSBpIC1TIGh0bWwtcGRmQDIuMi4wJyk7XG4gICAgfVxuICB9XG59XG4iXX0=