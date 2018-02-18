# css中的position、display、float的小实验

## 简单的demo
我们先写一个div，里面包着三个小的div，代码如下
```html
<div id="hello">
    <div className="p1">第一</div>
    <div className="p2">第二</div>
    <div className="p3">第三</div>
</div>

```
下面是css样式,需要一些less的语法知识
```less
@charset "utf-8";
.father {
    font-size: 20px;
    width: 400px;
    height: 400px;
    background-color: gray;
}
.son {
    width: 100px;
    height: 100px;
    border: 1px;
    border-style: solid;
    text-align: center;
}

#hello {
    .father;
    .p1 {.son;}
    .p2 {.son;}
    .p3 {.son;}
}


```

效果就是下图所所示
![](https://github.com/yooocen/dadaLearningBlogs/raw/master/rescource/1.jpg)

## 疑惑:为什么设置了宽高，三个div却没有并排
这个是因为div是块元素，虽然给块元素设置了宽高，甚至把右外边距设置为0都好，块元素仍然会把它的右外边距填充满它的父亲级元素，可以用chrome的审查元素去看，就是下图所示
![](https://github.com/yooocen/dadaLearningBlogs/raw/master/rescource/2.png)
橙色部分就是外边距，尽管已经设置为0，但是仍然填充满了

## 给第一个子div设置position:absolute
```diff
#hello {
    .father;
-   .p1 {.son;}
+   .p1 {.son; position: absolute}
    .p2 {.son;}
    .p3 {.son;}
}
```

效果就是相当于将第一个子div从父级div中抽离出来，所以另外两个兄弟div则会直接相对于父级div，然后直接往上排列。
效果如下
![](https://github.com/yooocen/dadaLearningBlogs/raw/master/rescource/3.png)

# 给第一个div设置display:inline

```diff
#hello {
    .father;
-   .p1 {.son;}
+   .p1 {.son; display: inline}
    .p2 {.son;}
    .p3 {.son;}
}
```

效果就是，这个div从此不能再设置width和height，同时也只能设置左右外边距，而它的实际宽高就是变成auto，效果如下

![](https://github.com/yooocen/dadaLearningBlogs/raw/master/rescource/4.png)

有趣的是第二和第三个div将会依次排列在第一个div的下方，并且第二个div的border会覆盖第一个div的border

# 给第一个div设置float:left

```diff
#hello {
    .father;
-   .p1 {.son;}
+   .p1 {.son; float:left}
    .p2 {.son;}
    .p3 {.son;}
}
```

![](https://github.com/yooocen/dadaLearningBlogs/raw/master/rescource/5.png)

更改代码后的结果是第一个div浮动到了最左边，并且把作为块元素时自动填充的外边距也会消失，这时候第二个div就排在了左上角，但是由于第一个div的文字浮动在左上角，那么第二个div的的文字就被挤到了下面，和第三个div的文字重叠在了一起，结果就是这个样子

![](https://github.com/yooocen/dadaLearningBlogs/raw/master/rescource/6.png)