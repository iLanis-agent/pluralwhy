(function (root) {
  'use strict';
  // CLDR plural categories through the browser's Intl.PluralRules. Nothing here re-implements the rules.
  var LOCALES = ['en','de','nl','sv','es','it','pt','pt-PT','fr','tr','hi','ja','zh','ko','vi','id','he','ar','fa','ru','uk','pl','cs','sk','sl','hr','lt','lv','ro','cy','ga','mt','br','is','fil','ca','hu','fi','el','bg'];
  var ORDER = ['zero', 'one', 'two', 'few', 'many', 'other'];
  function pr(loc, type, frac) { return new Intl.PluralRules(loc, { type: type || 'cardinal', minimumFractionDigits: frac || 0 }); }
  function categories(loc, type) { var c = pr(loc, type).resolvedOptions().pluralCategories.slice(); return ORDER.filter(function (k) { return c.indexOf(k) >= 0; }); }
  function classify(loc, n, type, frac) { return pr(loc, type, frac).select(n); }
  // parse user text such as "1", "1.0", "2.50", "1,5" into {n, frac}
  function parse(txt) {
    var t = String(txt).trim().replace(',', '.');
    if (!/^\d+(\.\d+)?$/.test(t)) return null;
    var f = t.indexOf('.') < 0 ? 0 : t.length - t.indexOf('.') - 1;
    return { n: Number(t), frac: f, text: t };
  }
  function examples(loc, type, max) {
    var out = {}, cats = categories(loc, type), p = pr(loc, type), i, c;
    cats.forEach(function (k) { out[k] = []; });
    for (i = 0; i <= 1200; i++) { c = p.select(i); if (out[c] && out[c].length < (max || 6)) out[c].push(String(i)); }
    if (type !== 'ordinal') {
      var p1 = pr(loc, 'cardinal', 1);
      ['0.0', '0.5', '1.0', '1.5', '2.0', '2.5', '5.0', '10.5'].forEach(function (t) { c = p1.select(Number(t)); if (out[c] && out[c].length < (max || 6) + 2 && out[c].indexOf(t) < 0) out[c].push(t); });
    }
    return out;
  }
  function icu(loc, type, word) {
    var cats = categories(loc, type), forms = cats.map(function (k) { return k + ' {' + (word || '...') + '}'; });
    return '{count, ' + (type === 'ordinal' ? 'selectordinal' : 'plural') + ', ' + forms.join(' ') + '}';
  }
  // how wrong is the English shortcut "n == 1 ? singular : plural" for this language, on whole numbers 0..1000
  function englishShortcut(loc) {
    var p = pr(loc, 'cardinal'), wrong = [], i, shouldSingular;
    for (i = 0; i <= 1000; i++) { shouldSingular = p.select(i) === 'one'; if (shouldSingular !== (i === 1)) wrong.push(i); }
    return { wrongCount: wrong.length, sample: wrong.slice(0, 8) };
  }
  var api = { LOCALES: LOCALES, categories: categories, classify: classify, parse: parse, examples: examples, icu: icu, englishShortcut: englishShortcut };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.PluralWhy = api;
})(typeof window !== 'undefined' ? window : this);
