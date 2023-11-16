function merge<T extends object, K>(objA: T, objB: K) {
  return Object.assign(objA, objB)
}

const mergedObj = merge({name: 'max'}, {vage: 30})
console.log(mergedObj);

interface Lengthy {
  length: number
}


function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let descriptionText = 'Got no valu.';

  if (element.length === 1) {
    descriptionText = 'Got 1 element.';
  } else if (element.length > 1) {
    descriptionText = 'Got more than 1 element';
  }

  return [element, descriptionText];
}


console.log(countAndDescribe(['Sports', 'Cooking']))