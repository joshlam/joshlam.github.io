export function copy(obj) {
  var type = Object.prototype.toString.call(obj),
      copied = obj;

  if (type === '[object Object]') {
    copied = Object.keys(obj).reduce((c, key) => {
      c[key] = copy(obj[key]);

      return c;
    }, {});
  } else if (type === '[object Array]') {
    copied = obj.map(item => copy(item));
  }

  return copied;
}

export function mixin() {
  var args = Array.prototype.slice.call(arguments),
      obj = args.shift();

  args.forEach(function(props) {
    Object.keys(props).forEach(property => {
      Object.defineProperty(obj, property, Object.getOwnPropertyDescriptor(props, property));
    });
  });

  return obj;
}

export function isEmpty(...objs) {
  return objs.every(obj => {
    return obj === null || obj === undefined || obj.length === 0;
  });
}
