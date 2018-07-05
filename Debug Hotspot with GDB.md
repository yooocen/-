# Debug Hotspot with Eclipse (mac os 10.13)

## 安装gdb
``brew install gdb``

## gdb的代码签名
主要目的是eclipse在debug的时候需要调用gdb，需要gdb有证书
具体的方法可以参照这个[博客](http://blog.csdn.net/u010157717/article/details/51394693)

## 安装eclipse adt插件
[插件地址](http://www.eclipse.org/cdt/downloads.php)
注意在eclipse的安装软件导入链接就可以了

## 导入整个jdk工程
Run eclipse, choose "import project -> C/C++ -> Existing Code as Makefile Project", then click Next, enter the configuration page of the project:

* Project Name is hotspot, you can name yours
* Existing Code Location is /*/openjdk9/hotspot

Right click on hotspot project -> properties -> C/C++ General -> Paths and Symbols -> Source Location -> choose "Add Folder", add ``hotspot/src`` directory

## Debug Configuration
Right click on hotspot project -> "Debug As -> Debug Configurations -> C/C++ Application -> New"

**Main tab**
* C/C++ Application: choose /opt/openjdk9/build/macosx-x86_64-normal-server-slowdebug/jdk/bin/java
* toggle Disable auto build

**Debug tab**<br>
选最下面的Select other，选择LLDB-MI 。。。 的那一项
