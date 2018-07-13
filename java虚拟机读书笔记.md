# 第八章 虚拟机字节码执行引擎

## 8.3.2分派
代码8-6中：（P247）
Human 称为静态类型（static type）
Man 称为实际类型（actual type）
方法接收者是指执行该示例方法的对象，比如sr
方法的接收者和方法的参数称为方法的宗量 (P254)

# 8.3.3动态类型语言支持
动态类型语言的关键特征就是它的类型检查的主体过程是在运行期而不是编译期，满足这个特征的语言有很多：APL、Clojure、Erlang、Groovy、js、lua
相对的，编译气就进行类型检查的语言（c++、java）就是最常见的静态类型语言。

动态类型的另一个特点是：“变量无类型而变量值有类型”

jdk1.7以前的字节码指令集中：invokevirtual、invokeespecial、invokestatic、invokeinterface

```java
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodType;

import static java.lang.invoke.MethodHandles.lookup;

public class MethodHandleTest {
    static class ClassA {
        public void println(String s){
            System.out.println(s);
        }

        public static void main(String[] args) throws Throwable {
            Object obj = System.currentTimeMillis() % 2 ==0?System.out : new ClassA();

            getPrintlnMH(obj).invokeExact("hhhh");
        }
        private static MethodHandle getPrintlnMH(Object recevier) throws Throwable{
            MethodType mt = MethodType.methodType(void.class , String.class);

            return lookup().findVirtual(recevier.getClass(), "println", mt).bindTo(recevier);

        }
    }
}
```
