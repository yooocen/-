[参考官网的信息](https://www.ibm.com/developerworks/cn/java/j-lo-servlet/)
## servlet的定义
Servlet（Servlet Applet），全称Java Servlert .是用Java编写的服务器端程序。**其主要功能在与交互式的浏览和修改数据，生成动态Web内容。**

狭义的servlet是指Java语言实现的一个接口，广义的Servlet是指任何实现了这个Servlet的类，一般情况下，人们将Servlet理解为后者。比如HttpServlet类继承自Servlet类，可以利用继承Http Servlet  来实现Http请求，当不是Http请求的时候，也可以定义其他形式的Servlet。

这个类的实例由servlet容器来进行调用，接受信息，处理，返回结果


 Servlet编程需要使用到javax.servlet和javax.servlet.http两个包下面的类和接口，在所有的类和接口中，javax.servlet.servlet接口最为重要。所有的servlet程序都必须实现该接口和继承实现了该接口的类。以下是Servlet的主要类和接口：

        javax.servlet.ServletConfig;

        javax.servlet.ServletException;

        javax.servlet.HttpServlet;

        javax.servlet.HttpServletRequest;

        javax.servlet.HttpServletResponse;

        javax.servlet.HttpSession;

        javax.servlet.Cookie;

        javax.servlet.ServletContext;

        javax.servlet.GenericServlet;


## servlet容器

