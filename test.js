const _ = require('lodash')
let object1 = {
    name: 'bilal',
    age: 20,
    salary: () => {
        return 30
    },
    dateofbirth: new Date()
}

let object2 = _.cloneDeep(object1)

console.log(object1);
console.log(object2);
