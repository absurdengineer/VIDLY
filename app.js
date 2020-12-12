function factory (handler) {
    return function (a, b) {
        try {
            const c = handler(a, b)
            console.log(`Result = ${c}`)
        } catch(ex){
            console.error(ex)
        }
    }
}
//? Any Function or anything which will call the factory function 
//? will get a new function which is returned by factory function 
//? and then it can excute the new function.
//? So if some driver function needs to pass some arguments then 
//? it won't pass the argments to factory instead it will pass arguments
//? to the function returned by factory function.
factory(function (a, b) {
    return a + b
})
factory(function (c, d) {
    return c - d
})
