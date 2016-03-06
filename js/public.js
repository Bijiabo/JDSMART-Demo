// MARK: - Basic functions

window.debug = true;

function extend(Child, Parent) {
    // 继承方法
    var cacheObject = function(){};
    cacheObject.prototype = Parent.prototype;
    Child.prototype = new cacheObject();
    Child.prototype.constructor = Child;
    Child.uber = Parent.prototype;
}

function extendWithCopy(Child, Parent) {
    // 拷贝继承
    var p = Parent.prototype;
    var c = Child.prototype;
    for (var i in p) {
        c[i] = p[i];
    }
    c.uber = p;
}

function extendCopy(p) {
    var c = {};
    for (var i in p) {
        c[i] = p[i];
    }
    c.uber = p;
    return c;
}

function deepCopy(p, c) {
    var c = c || {};
    for (var i in p) {
        if (typeof p[i] === 'object') {
            c[i] = (p[i].constructor === Array) ? [] : {};
            deepCopy(p[i], c[i]);
        } else {
            c[i] = p[i];
        }
    }
    return c;
}

function p(obj) {
    if (!window.debug) {return;}

    console.log("\n>>> >>> Debug message: >>> >>>");
    console.log(obj);
    console.log(">>> >>> stack >>> >>>");
    var stack = new Error().stack;
    console.log(stack);
    console.log("<<< <<< debug message end <<< <<<\n\n");
}

function isEmptyForString(str) {
    return (!str || 0 === str.length);
}