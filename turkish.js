var TURKISH_CODEPOINTS = 
			 '\u00e2\u00e7\u011f\u0131\u00f6\u00fb\u00fc\u015f' 
			 +
                         '\u00c2\u00c7\u011e\u0130\u00d6\u00db\u00dc\u015e';
var TURKISH_LETTERS    = 'a-zA-Z' + TURKISH_CODEPOINTS;

var _turkish_hack = { lower:[], upper:[] };
if ('I'.toLocaleLowerCase != '\u0131')
        _turkish_hack.lower.push({ se:new RegExp('I', 'g'),       re:'\u0131' });
if ('\u0130'.toLocaleLowerCase != 'i')
        _turkish_hack.lower.push({ se:new RegExp('\\u0130', 'g'), re:'i'      });
if ('\u0131'.toLocaleUpperCase != 'I')
        _turkish_hack.upper.push({ se:new RegExp('\\u0131', 'g'), re:'I'      });
if ('i'.toLocaleUpperCase != '\u0130')
        _turkish_hack.upper.push({ se:new RegExp('i', 'g'),       re:'\u0130' });

if (_turkish_hack.lower.length)
        String.prototype.toTurkishLowerCase = function () {
                var fixed = this;
                for (var i in _turkish_hack.lower)
                        fixed = fixed.replace(
                                _turkish_hack.lower[i].se,
                                _turkish_hack.lower[i].re
                        );
                return fixed.toLocaleLowerCase();
        }
else String.prototype.toTurkishLowerCase = String.prototype.toLocaleLowerCase;

if (_turkish_hack.upper.length)
        String.prototype.toTurkishUpperCase = function () {
                var fixed = this;
                for (var i in _turkish_hack.upper)
                        fixed = fixed.replace(
                                _turkish_hack.upper[i].se,
                                _turkish_hack.upper[i].re
                        );
                return fixed.toLocaleUpperCase();
        }
else String.prototype.toTurkishUpperCase = String.prototype.toLocaleUpperCase;
