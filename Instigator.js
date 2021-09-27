(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.exe = {}));
})(this, (function (exports) { 'use strict';

  window.$ = '__$__';
  const PLACEHOLDER = '__$__';
  window.__curry__ = fn => {
    const test = x => x === PLACEHOLDER;
    return function curried() {
      const argLength = arguments.length;
      let args = new Array(argLength);

      for (let i = 0; i < argLength; ++i) {
        args[i] = arguments[i];
      }
      const countNonPlaceholders = toCount => {
        let count = toCount.length;
        while (!test(toCount[count])) {
          count--;
        }
        return count;
      };
      const length = as => (as.some(test) ? countNonPlaceholders(as) : as.length);
      function saucy() {
        const arg2Length = arguments.length;
        const args2 = new Array(arg2Length);
        for (let j = 0; j < arg2Length; ++j) {
          args2[j] = arguments[j];
        }

        return curried.apply(
          this,
          args
            .map(y =>
              test(y) && args2[0]
                ? args2.shift()
                : y
            )
            .concat(args2)
        );
      }

      if (length(args) >= fn.length) {
        const currentArgs = args.slice(0, fn.length);
        const result = fn.apply(this, currentArgs);
        const nextArgs = args.slice(fn.length);

        if (typeof result === "function" && length(nextArgs) > 0) {
          return result.apply(this, nextArgs);
        } else {
          return result;
        }
      } else {
        return saucy;
      }
    };
  };

  window.__eq__ = (l, r) => {
    if (l === r) {
      return true;
    }
    if (typeof l !== typeof r) {
      return false;
    }
    if (typeof l === `object`) {
      if (Array.isArray(l)) {
        return l.length === r.length && l.reduce((res, _, i) => res && __eq__(l[i], r[i]), true);
      }
      const keysL = Object.keys(l);
      const keysR = Object.keys(r);
      return keysL.length === keysR.length && keysL.reduce((res, k) => res && __eq__(l[k], r[k]), true);
    }
    return l === r;
  };

  const __applyMany__ = (f, params) => params.reduce((_f, param) => _f(param), f);
  window.__apMtdDicts__ = (dict, dicts) =>
    Object.keys(dict).reduce((o, k) => ({ ...o, [k]: () => __applyMany__(dict[k](), dicts) }), {});

  window.__once__ = (fn, context) => {

      var result;

      return function() {

          if (fn) {

              result = fn.apply(context || this, arguments);

              fn = null;

          }

          return result;

      };

  };

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/IO.mad
  let withColor = (color => v => color + v + "\x1b[0m");
  let red = withColor("\x1b[31m");
  let green = withColor("\x1b[32m");
  let yellow = withColor("\x1b[33m");
  let grey = withColor("\x1b[90m");
  let log = (a => { console.log(a); return a; });
  let logAndPass = (v => a => { console.log(v); return a; });
  let newLine = logAndPass("");
  let trace = (v => a => { console.log(v, a); return a; });
  let err = (e => { console.log(e); return e; });
  let warn = (w => { console.warn(w); return w; });
  let inspect = (a => {
      console.log(a);
      
    return a
  });
  const stringify = (x) => {
    if (typeof x === "object") {
      if (Array.isArray(x)) {
        const items = x.map(stringify).reduce((acc, xx) => acc + ",\n    " + xx);
        return items.length < 80
          ? `[${items.replace("\n    ", " ")}]`
          : `[\n    ${items}\n]`
      }
      else {
        if (x.__constructor) {
          return x.__constructor + " " + x.__args.map(stringify).reduce((acc, xx) => acc + " " + xx, "")
        }
        else {
          const items = Object
            .keys(x)
            .map((k) => k + ": " + x[k])
            .reduce((acc, xx) => acc + ",\n    " + xx, "");

          return `{\n  ${items}\n}`
        }
      }
    } else return JSON.stringify(x)
  };
  let prettyPrint = (a => {
    console.log(stringify(a));
    return a
  });
  let table = (rows => a => {
    const xSpaces = x => new Array(x).fill(' ').join('');

    const longestId = rows.map(x => x.id.length).reduce((a, b) => Math.max(a, b), 0);

    const readyRows = rows
      .map(x => ({ ...x, id: x.id + xSpaces(longestId - x.id.length) }))
      .reduce((rows, row) => {
        return {
          ...rows,
          [row.id]: row.cols.reduce((o, [colName, colValue]) => { o[colName] = colValue; return o; }, {})
        }
      }, {});
    console.table(readyRows);
    return a
  });
  var IO = { red, green, yellow, grey, log, logAndPass, newLine, trace, err, warn, inspect, prettyPrint, table };

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/Function.mad
  let complement = (fn => x => !(fn(x)));
  let always = (a => b => a);
  let identity = (a => a);
  let equals = (val => a => __eq__(val, a));
  let notEquals = (val => a => !__eq__(val, a));
  let ifElse = (predicate => truthy => falsy => value => (predicate(value) ? truthy(value) : falsy(value)));
  let when = (predicate => truthy => value => ifElse(predicate)(truthy)(always(value))(value));
  let not = (b => !(b));
  let flip = (f => b => a => f(a)(b));
  let any = (predicate => xs => xs.some(predicate));
  let all = (predicate => xs => xs.every(predicate));
  const nativeMemoize = (fn) => {
    let cache = {};
    return (a) => {
      const key = JSON.stringify(a);
      if (!cache[key]) {
        cache[key] = fn.apply(undefined, [a]);
      }
      return cache[key]
    }
  };
  let memoize = (fn => nativeMemoize(fn));
  const nativeMemoize2 = (fn) => {
    let cache = {};
    return __curry__((a, b) => {
      const key = JSON.stringify([a, b]);
      if (!cache[key]) {
        cache[key] = fn.apply(undefined, [a, b]);
      }
      return cache[key]
    })
  };
  let memoize2 = (fn => nativeMemoize2((a, b) => fn(a)(b)));
  const nativeMemoize3 = (fn) => {
    let cache = {};
    return __curry__((a, b, c) => {
      const key = JSON.stringify([a, b, c]);
      if (!cache[key]) {
        cache[key] = fn.apply(undefined, [a, b, c]);
      }
      return cache[key]
    })
  };
  let memoize3 = (fn => nativeMemoize3(fn));
  var Fun = { complement, always, identity, equals, notEquals, ifElse, when, not, flip, any, all, memoize, memoize2, memoize3 };

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/Functor.mad

  window.Functor = {};
  __once__(() => (_P_ => Functor_i164.map()(always(_P_))));

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/Applicative.mad

  window.Applicative = {};
  __once__(() => (a => b => Applicative_w178.ap()(Functor_w178.map()(always)(a))(b)));
  __once__(() => (f => x1 => x2 => (_P_ => (__ph0__ => Applicative_q198.ap()(__ph0__)(x2))(Functor_q198.map()(f)(_P_)))(x1)));
  __once__(() => (f => x1 => x2 => x3 => (_P_ => (__ph0__ => Applicative_p223.ap()(__ph0__)(x3))((__ph0__ => Applicative_p223.ap()(__ph0__)(x2))(Functor_p223.map()(f)(_P_))))(x1)));

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/Monad.mad

  window.Monad = {};
  __once__(() => (b => a => Monad_y258.chain()((_ => b))(a)));

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/Show.mad
  window.Show = {};

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/Maybe.mad

  let Just = (a => ({ __constructor: "Just", __args: [ a ] }));
  let Nothing = ({ __constructor: "Nothing", __args: [  ] });
  Functor['Maybe'] = {};
  Functor['Maybe']['map'] = () => (f => __x__ => ((__x__) => {
    if (__x__.__constructor === "Just" && true) {
      let x = __x__.__args[0];
      return Just(f(x));
    }
    else if (__x__.__constructor === "Nothing") {
      return Nothing;
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(__x__));
  Applicative['Maybe'] = {};
  Applicative['Maybe']['ap'] = () => (mf => mx => ((__x__) => {
    if (__x__.length === 2 && __x__[0].__constructor === "Just" && true && __x__[1].__constructor === "Just" && true) {
      let [{ __args: [f]},{ __args: [x]}] = __x__;
      return Applicative.Maybe.pure()(f(x));
    }
    else {
      return Nothing;
    }
  })(([mf, mx])));
  Applicative['Maybe']['pure'] = () => Just;
  Monad['Maybe'] = {};
  Monad['Maybe']['chain'] = () => (f => m => ((__x__) => {
    if (__x__.__constructor === "Just" && true) {
      let x = __x__.__args[0];
      return f(x);
    }
    else if (__x__.__constructor === "Nothing") {
      return Nothing;
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(m));
  Monad['Maybe']['of'] = () => Applicative.Maybe.pure();
  Show['Maybe'] = {};
  let __ShowMaybeshow = __once__(() => (__x__ => ((__x__) => {
    if (__x__.__constructor === "Just" && true) {
      let a = __x__.__args[0];
      return "Just " + Show_z337.show()(a);
    }
    else if (__x__.__constructor === "Nothing") {
      return "Nothing";
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(__x__)));
  Show['Maybe']['show'] = () => (Show_z337) => {
    window.Show_z337 = Show_z337;
    return __ShowMaybeshow();
  };

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/Read.mad
  window.Read = {};

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/Number.mad

  Show['Number'] = {};
  Show['Number']['show'] = () => (x => x.toString());
  Read['Number'] = {};
  Read['Number']['read'] = () => fromString;
  let fromString = (str => {
    const n = parseFloat(str);
    return isNaN(n) ? Nothing : Just(n)
  });

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/Semigroup.mad
  window.Semigroup = {};

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/Monoid.mad

  window.Monoid = {};

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/String.mad

  Semigroup['String'] = {};
  Semigroup['String']['assoc'] = () => (a => b => a + b);
  Monoid['String'] = {};
  Monoid['String']['mappend'] = () => (a => b => a + b);
  Monoid['String']['mempty'] = () => "";
  Show['String'] = {};
  Show['String']['show'] = () => (a => a);
  let split = (separator => str => str.split(separator));

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/Compare.mad
  window.Comparable = {};
  Comparable['Number'] = {};
  Comparable['Number']['compare'] = () => (a => b => (a > b ? MORE : (__eq__(a, b) ? EQUAL : LESS)));
  Comparable['String'] = {};
  Comparable['String']['compare'] = () => (a => b => a > b ? MORE : a == b ? EQUAL : LESS);
  Comparable['Boolean'] = {};
  Comparable['Boolean']['compare'] = () => (a => b => ((__x__) => {
    if (__x__.length === 2 && __x__[0] === true && __x__[1] === false) {
      return MORE;
    }
    else if (__x__.length === 2 && __x__[0] === false && __x__[1] === true) {
      return LESS;
    }
    else {
      return EQUAL;
    }
  })(([a, b])));
  let MORE = 1;
  let LESS = -1;
  let EQUAL = 0;
  __once__(() => (a => b => __eq__(Comparable_l401.compare()(a)(b), MORE)));
  __once__(() => (a => b => Comparable_v411.compare()(a)(b) >= EQUAL));
  __once__(() => (a => b => __eq__(Comparable_f421.compare()(a)(b), LESS)));
  __once__(() => (a => b => Comparable_p431.compare()(a)(b) <= EQUAL));

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/Tuple.mad

  Show['Tuple_2'] = {};
  let __ShowTuple_2show = __once__(() => (__x__ => ((__x__) => {
    if (__x__.length === 2 && true && true) {
      let [a,b] = __x__;
      return "<" + Show_d575.show()(a) + ", " + Show_e576.show()(b) + ">";
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(__x__)));
  Show['Tuple_2']['show'] = () => (Show_e576) => (Show_d575) => {
    window.Show_d575 = Show_d575;
    window.Show_e576 = Show_e576;
    return __ShowTuple_2show();
  };
  Show['Tuple_3'] = {};
  let __ShowTuple_3show = __once__(() => (__x__ => ((__x__) => {
    if (__x__.length === 3 && true && true && true) {
      let [a,b,c] = __x__;
      return "<" + Show_w594.show()(a) + ", " + Show_x595.show()(b) + ", " + Show_y596.show()(c) + ">";
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(__x__)));
  Show['Tuple_3']['show'] = () => (Show_y596) => (Show_x595) => (Show_w594) => {
    window.Show_w594 = Show_w594;
    window.Show_x595 = Show_x595;
    window.Show_y596 = Show_y596;
    return __ShowTuple_3show();
  };
  Show['Tuple_4'] = {};
  let __ShowTuple_4show = __once__(() => (__x__ => ((__x__) => {
    if (__x__.length === 4 && true && true && true && true) {
      let [a,b,c,d] = __x__;
      return "<" + Show_x621.show()(a) + ", " + Show_y622.show()(b) + ", " + Show_z623.show()(c) + ", " + Show_a624.show()(d) + ">";
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(__x__)));
  Show['Tuple_4']['show'] = () => (Show_a624) => (Show_z623) => (Show_y622) => (Show_x621) => {
    window.Show_x621 = Show_x621;
    window.Show_y622 = Show_y622;
    window.Show_z623 = Show_z623;
    window.Show_a624 = Show_a624;
    return __ShowTuple_4show();
  };
  let fst = (tuple => ((__x__) => {
    if (__x__.length === 2 && true && true) {
      let [a,] = __x__;
      return a;
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(tuple));
  let snd = (tuple => ((__x__) => {
    if (__x__.length === 2 && true && true) {
      let [,b] = __x__;
      return b;
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(tuple));

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/Control.mad

  let loop = (start => pred => evaluate => {
      let s = start;
      while(pred(s)) {
      s = evaluate(s);
    }    return s;
  });

  // file: /usr/local/lib/node_modules/@madlib-lang/madlib/node_modules/binary-install/bin/prelude/__internal__/List.mad

  Functor['List'] = {};
  Functor['List']['map'] = () => (f => xs => xs.map((x) => f(x)));
  Applicative['List'] = {};
  Applicative['List']['ap'] = () => (mf => ma => (_P_ => flatten(Functor.List.map()((f => Functor.List.map()(f)(ma)))(_P_)))(mf));
  Applicative['List']['pure'] = () => (x => ([x]));
  Monad['List'] = {};
  Monad['List']['chain'] = () => (f => xs => (_P_ => flatten(Functor.List.map()(f)(_P_)))(xs));
  Monad['List']['of'] = () => Applicative.List.pure();
  Semigroup['List'] = {};
  Semigroup['List']['assoc'] = () => (xs1 => xs2 => xs1.concat(xs2));
  Monoid['List'] = {};
  Monoid['List']['mappend'] = () => Semigroup.List.assoc();
  Monoid['List']['mempty'] = () => ([]);
  Show['List'] = {};
  let __ShowListshow = __once__(() => (_P_ => (x => `[${x}]`)(reduceL(Monoid.String.mappend())("")(intercalate(", ")(Functor.List.map()(Show_x777.show())(_P_))))));
  Show['List']['show'] = () => (Show_x777) => {
    window.Show_x777 = Show_x777;
    return __ShowListshow();
  };
  Applicative.List.pure();
  let intercalate = (a => xs => ((__x__) => {
    if (__x__.length === 0) {
      return ([]);
    }
    else if (__x__.length === 1 && true) {
      let [one] = __x__;
      return ([one]);
    }
    else if (__x__.length === 2 && true && true) {
      let [one,two] = __x__;
      return ([one, a, two]);
    }
    else if (__x__.length >= 1 && true && true) {
      let [one,...rest] = __x__;
      return ([one, a,  ...intercalate(a)(rest)]);
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(xs));
  let join = (Show_p847) => (Show_o846) => {
    window.Show_o846 = Show_o846;
    window.Show_p847 = Show_p847;

    return join__ND__()
  };
  let join__ND__ = __once__(() => (a => xs => (_P_ => reduce(Monoid.String.mappend())("")(intercalate(Show_o846.show()(a))(Functor.List.map()(Show_p847.show())(_P_))))(xs)));
  let concat = (xs1 => xs2 => xs1.concat(xs2));
  let last = (xs => {
    const item = xs.slice(-1)[0];
    return item ? Just(item) : Nothing;
  });
  let first = (xs => {
    const item = xs[0];
    return item ? Just(item) : Nothing;
  });
  let tail = (xs => xs.slice(1));
  let nth = (i => xs => {
    const x = xs[i];
    return x === undefined
      ? Nothing
      : Just(x);
  });
  let reduceL = (f => initial => xs => xs.reduce((a, b) => f(a)(b), initial));
  let reduce = reduceL;
  __once__(() => (fn => initial => xs => (_P_ => fst((__ph0__ => loop(__ph0__)((_P_ => Fun.complement(isEmpty)(snd(_P_))))((__x__ => ((__x__) => {
    if (__x__.length === 2 && true && __x__[1].length >= 1 && true && true) {
      let [initialM,[h, ...rest]] = __x__;
      return ([Monad_x933.chain()((__ph0__ => fn(__ph0__)(h)))(initialM), rest]);
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(__x__))))(_P_)))(([Monad_x933.of()(initial), xs]))));
  let filter = (predicate => xs => xs.filter(predicate));
  let reject = (predicate => xs => xs.filter(Fun.complement(predicate)));
  let find = (predicate => xs => {
    const found = xs.find(predicate);
    if (found === undefined) {
      return Nothing
    }
    else {
      return Just(found)
    }
  });
  let len = (xs => xs.length);
  let isEmpty = (xs => __eq__(len(xs), 0));
  let sortBy = (fn => xs => xs.sort((a, b) => fn(a)(b)));
  let sort = (Comparable_w1036) => {
    window.Comparable_w1036 = Comparable_w1036;

    return sort__ND__()
  };
  let sort__ND__ = __once__(() => sortBy(Comparable_w1036.compare()));
  __once__(() => sort(Comparable_b1041));
  __once__(() => sortBy((a => b => Comparable_e1044.compare()(a)(b) * -1)));
  let flatten = reduceL(concat)(([]));
  let includes = (x => xs => xs.includes(x));

  // file: /Users/brekk/work/madland/instigator/src/String.mad

  let startsWith = (needle => haystack => haystack.startsWith(needle));
  let slashes = split('/');
  let tailString = (x => x.slice(1));

  // file: /Users/brekk/work/madland/instigator/src/Function.mad
  let addIndex = (fn => y => xs => {
      let i = 0;
      return fn((x => {
      let result = y(x)(i);
      i = i + 1;
      return result;
  }))(xs);
  });

  // file: /Users/brekk/work/madland/instigator/src/Types.mad
  let ExplicitMatch = (a => ({ __constructor: "ExplicitMatch", __args: [ a ] }));
  let WildcardMatch = (a => ({ __constructor: "WildcardMatch", __args: [ a ] }));
  let NoMatch = ({ __constructor: "NoMatch", __args: [  ] });
  let DiscreteExplicitMatch = (a => b => ({ __constructor: "DiscreteExplicitMatch", __args: [ a, b ] }));
  let DiscreteWildcardMatch = (a => b => c => ({ __constructor: "DiscreteWildcardMatch", __args: [ a, b, c ] }));
  let DiscreteNoMatch = (a => ({ __constructor: "DiscreteNoMatch", __args: [ a ] }));

  // file: /Users/brekk/work/madland/instigator/src/DiscreteMatch.mad

  let imap = (Functor_f1175) => {
    window.Functor_f1175 = Functor_f1175;

    return imap__ND__()
  };
  let imap__ND__ = __once__(() => addIndex(Functor_f1175.map()));
  let matchToDiscreteMatch = (given => routes => (_P_ => Functor.List.map()(imap(Functor.List)((m => index => (_P_ => (__x__ => ((__x__) => {
    if (__x__.__constructor === "Just" && true) {
      let x = __x__.__args[0];
      return x;
    }
    else if (__x__.__constructor === "Nothing") {
      return DiscreteNoMatch(index);
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(__x__))((__x__ => ((__x__) => {
    if (__x__.__constructor === "ExplicitMatch" && true) {
      let x = __x__.__args[0];
      return Just(DiscreteExplicitMatch(x)(index));
    }
    else if (__x__.__constructor === "WildcardMatch" && true) {
      let match = __x__.__args[0];
      return (_P_ => Functor.Maybe.map()((value => DiscreteWildcardMatch(match)(value)(index)))(nth(index)(_P_)))(given);
    }
    else if (__x__.__constructor === "NoMatch") {
      return Nothing;
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(__x__))(_P_)))(m))))(_P_))(routes));
  let discreteMatchToBoolean = (__x__ => ((__x__) => {
    if (__x__.__constructor === "DiscreteExplicitMatch" && true && true) {
      __x__.__args[0];
      __x__.__args[1];
      return true;
    }
    else if (__x__.__constructor === "DiscreteWildcardMatch" && true && true && true) {
      __x__.__args[0];
      __x__.__args[1];
      __x__.__args[2];
      return true;
    }
    else if (__x__.__constructor === "DiscreteNoMatch" && true) {
      __x__.__args[0];
      return false;
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(__x__));
  let maybeToDiscreteMatch = (__x__ => ((__x__) => {
    if (__x__.__constructor === "Just" && true) {
      let x = __x__.__args[0];
      return discreteMatchToBoolean(x);
    }
    else if (__x__.__constructor === "Nothing") {
      return false;
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(__x__));
  let skipLeadingNoMatch = filter((_P_ => maybeToDiscreteMatch(first(_P_))));
  let skipTrailingNoMatch = filter((_P_ => maybeToDiscreteMatch(last(_P_))));
  let discreteMatchToIdentifiers = (__x__ => ((__x__) => {
    if (__x__.__constructor === "DiscreteExplicitMatch" && true && true) {
      let x = __x__.__args[0];
      __x__.__args[1];
      return x;
    }
    else if (__x__.__constructor === "DiscreteWildcardMatch" && true && true && true) {
      let k = __x__.__args[0];
      __x__.__args[1];
      __x__.__args[2];
      return k;
    }
    else if (__x__.__constructor === "DiscreteNoMatch" && true) {
      __x__.__args[0];
      return '';
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(__x__));
  let discreteMatchToParams = (__x__ => ((__x__) => {
    if (__x__.__constructor === "DiscreteExplicitMatch" && true && true) {
      let value = __x__.__args[0];
      return ({ key: 'explicit', value: value });
    }
    else if (__x__.__constructor === "DiscreteWildcardMatch" && true && true && true) {
      let key = __x__.__args[0];
      let value = __x__.__args[1];
      return ({ key: tailString(key), value: value });
    }
    else if (__x__.__constructor === "DiscreteNoMatch" && true) {
      return ({ key: 'no-match', value: '' });
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(__x__));

  // file: /Users/brekk/work/madland/instigator/src/Match.mad

  let matchToBoolean = (__x__ => ((__x__) => {
    if (__x__.__constructor === "ExplicitMatch" && true) {
      return true;
    }
    else if (__x__.__constructor === "WildcardMatch" && true) {
      return true;
    }
    else if (__x__.__constructor === "NoMatch") {
      return false;
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(__x__));

  // file: /Users/brekk/work/madland/instigator/src/Main.mad
  __once__(() => addIndex(Functor_h1333.map()));
  let routeSegments = ifElse(startsWith('/'))((_P_ => tail(slashes(_P_))))(slashes);
  let initialPath = (_P_ => routeSegments((__R__ => __R__.path)(_P_)));
  let matchRoutes = (routeStrings => given => Functor.List.map()((x => (startsWith(':')(x) ? WildcardMatch(x) : (!__eq__(x, '') && includes(x)(given) ? ExplicitMatch(x) : NoMatch))))(routeStrings));
  let testURI = (routes => given => Functor.List.map()((_P_ => (__ph0__ => matchRoutes(__ph0__)(given))(initialPath(_P_))))(routes));
  let matchesURI = (routes => given => (_P_ => any(any(matchToBoolean))(testURI(routes)(_P_)))(given));
  let transformPathToParams = (routes => given => (_P_ => Functor.List.map()((_P_ => ifElse((_P_ => (x => x >= len(given))(len(_P_))))((__ph0__ => matchRoutes(__ph0__)(given)))(always(([NoMatch])))(initialPath(_P_))))(_P_))(routes));
  let warnOnPartialMatches = (given => (_P_ => (_ => skipTrailingNoMatch(given))(Functor.List.map()((_P_ => IO.trace('There is a partially matchable route which is not explicitly defined but could be:')((matched => '/' + matched)(join(Show.String)(Show.String)('/')(filter((z => !__eq__(z, '')))(Functor.List.map()(discreteMatchToIdentifiers)(_P_)))))))(reject((_P_ => maybeToDiscreteMatch(last(_P_))))(_P_))))(given));
  let onlyWildcards = filter((__x__ => ((__x__) => {
    if (__x__.__constructor === "DiscreteExplicitMatch" && true && true) {
      __x__.__args[0];
      return false;
    }
    else if (__x__.__constructor === "DiscreteWildcardMatch" && true && true && true) {
      __x__.__args[0];
      __x__.__args[1];
      return true;
    }
    else if (__x__.__constructor === "DiscreteNoMatch" && true) {
      return false;
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(__x__)));
  let loadRoute = (config => routes => raw => (_P_ => (matched => (_P_ => (__x__ => ((__x__) => {
    if (__x__.__constructor === "Just" && true) {
      let x = __x__.__args[0];
      return (_P_ => (_ => true)((config.dryRun ? identity : x.callback)(Functor.List.map()((m => ([m.key, m.value])))(Functor.List.map()(discreteMatchToParams)(onlyWildcards(_P_))))))(raw);
    }
    else if (__x__.__constructor === "Nothing") {
      return false;
    }
    else {
      console.log('non exhaustive patterns for value: ', __x__.toString()); 
      console.trace(); 
      throw 'non exhaustive patterns!';
    }
  })(__x__))(find((_P_ => (x => equals('/' + matched)(x) || equals(matched)(x))((__R__ => __R__.path)(_P_))))(_P_)))(routes))(join(Show.String)(Show.String)('/')(Functor.List.map()(discreteMatchToIdentifiers)(_P_))))(raw));
  let instigate = (config => routes => locationPath => (_P_ => (given => ifElse(matchesURI(routes))((_P_ => loadRoute(config)(routes)(Monad.List.chain()(identity)((config.warnOnPartialMatches ? warnOnPartialMatches : skipTrailingNoMatch)(skipLeadingNoMatch(matchToDiscreteMatch(given)(transformPathToParams(routes)(_P_))))))))(always(false))(given))(routeSegments(_P_)))(locationPath));
    window.instigate = instigate
  ;
  var Main = { testURI, matchesURI, instigate };

  exports["default"] = Main;
  exports.instigate = instigate;
  exports.matchesURI = matchesURI;
  exports.testURI = testURI;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
