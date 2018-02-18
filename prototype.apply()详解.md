# Function.prototype.apply()
## 简单的回顾
我们已经知道了apply(thisArg,[arg1,arg2,...])的基本使用方法，这里再简单介绍一下
apply的主要作用是将一个方法传递给一些对象使用，假设有好几个对象都需要用到同一种方法，
那么这个方法就只需要写一次就可以了，然后使用这种方法，所有相关的对象就可以直接调用
那么thisArg也就是调用这个方法的对象，有趣的是null或者undefine可以指代全局对象windows
[arg1,arg2,...]这个参数也是apply相当有用的一个地方，它可以将需要传入的多个参数作为一个类数组对象参数传入方法

## 高级用法
以下代码是apply的一个高级用法
包括三个对象：Function.prototype.constuct、f、object
```
Function.prototype.construct = function(args){
    var newObject = Object.create(this.prototype);//相当于new
    this.apply(newObject,args);
    return newObject;
}
var f = function(){
    for(var i =0;i<arguments.length;i++){
        this['property'+i] = arguments[i];
    }
}
var array = ["a",1,"nihao"];
var object = f.construct(array);

console.log(object.property2);
```

这里只要理解了他们里面的 **this** 的具体的指代的话，这段代码也就非常好理解
Function.prototype.construct中的 **this**，指的就是调用construct的对象，那么由于这个construct是挂在Function的
原型上面的，所以也就是说，所有的函数都会带有这个construct属性（方法），那么能够调用它的自然就是下面的f函数对象

f中的 **this** 当然也是调用f的对象，而这个f的功能就是用传给f的参数构建出这个对象的一些属性，这些属性的值就是这些参数的值

那么调用f的对象又是从何而来呢？答案是从Function.prototype.construct中生成的，细读代码可以发现，这个construct中使用了
f的原型来构建了一个新对象newObject，然后这个newObject使用apply方法调用f，再利用f给自己增加属性，所以这个调用f的对象也就是
这个利用f的原型构造的newObject

