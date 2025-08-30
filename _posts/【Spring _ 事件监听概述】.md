> 本篇主要对Spring 的 <font color='green'>事件监听机制简单介绍下</font>。

@[TOC](事件监听)



# 概述
<hr>

&emsp;&emsp;`ApplicationContext`中的事件处理是通过`ApplicationEvent` 类和`ApplicationListener`接口提供的。如果将实现该 `ApplicationListener` 接口的 `bean` 部署到上下文中，那么每当 `ApplicationEvent` 发布到 `ApplicationContext ` 时，都会通知该 `bean`。本质上，这是标准的观察者设计模式。

&emsp;&emsp;Spring 的 `ApplicationContext` 容器内部中的所有事件类型均继承自`org.springframework.context.ApplicationEvent`，容器中的所有监听器都实现`org.springframework.context.ApplicationListener`接口，并且以` bean` 的形式注册在容器中。一旦在容器内发布 `ApplicationEvent` 及其子类型的事件，注册到容器的 `ApplicationListener` 就会对这些事件进行处理。

> <font color ='green' size='4'>**提示：**</font>
> &emsp;&emsp;从 Spring 4.2 开始，事件基础设施得到了显著改进，并提供了基于注释的模型以及发布任意事件（即不一定从
> `ApplicationEvent `扩展的对象）的能力。发布这样一个对象时，我们会为您将其包装在一个事件中。

Spring  提供的标准事件：
|事件| 说明  |
|--|--|
| ContextRefreshedEvent | 在初始化或刷新`ApplicationContext`时发布（例如通过在`ConfigurableApplicationContext`接口使用 `refresh()` 的方法）。这里，“初始化”意味着加载所有bean，检测并激活后处理器bean，预实例化单例，并且`ApplicationContext` 对象已经可以使用了。只要上下文尚未关闭，就可以多次触发刷新，前提是所选择的`ApplicationContext` 实际上支持这种“热”刷新。比如`XmlWebApplicationContext`支持热刷新，但是 `GenericApplicationContext` 不支持。 |
|ContextStartedEvent|	使用`ConfigurableApplicationContext`接口上的`start()` 方法 启动`ApplicationContext `时发布。这里，“started”意味着所有Lifecycle bean 都收到显式的启动信号。通常，此信号用于在显式停止后重新启动 Bean，但它也可用于启动尚未配置为自动启动的组件（例如，初始化时尚未启动的组件）。|
|ContextStoppedEvent|使用`ConfigurableApplicationContext `接口上的 `stop()` 方法 停止 `ApplicationContext `时发布。这里，“stopped”意味着所有Lifecycle bean 都收到显式停止信号。停止的上下文可以通过 调用start()重新启动。|
|ContextClosedEvent|当使用`ConfigurableApplicationContext `接口上的 `close() `方法或通过 `JVM shutdown` 挂钩关闭 `ApplicationContext `时发布。这里，“closed”意味着所有单例 bean 将被销毁。一旦上下文关闭，它就达到了生命周期的终点，并且无法刷新或重新启动。|
|RequestHandledEvent|一个特定于 Web 的事件，通知所有 Bean 已处理 HTTP 请求。该事件在请求完成后发布。此事件仅适用于使用 Spring 的`DispatcherServlet` 的web 应用程序|
|ServletRequestHandledEvent|`RequestHandledEvent` 的子类，用于添加特定于`Servlet` 的上下文信息。|

Spring事件机制涉及的重要的类主要有以下四个：

 - ApplicationEvent：该抽象类是所有Spring事件的父类。

 - ApplicationListener：事件监听器，该接口被所有的事件监听器实现，基于标准的java的EventListener接口实现观察者模式。

 - ApplicationEventMulticaster：事件管理者，管理监听器和发布事件，ApplicationContext通过委托ApplicationEventMulticaster来 发布事件。
 
 - ApplicationEventPublisher：事件发布者，该接口封装了事件有关的公共方法，也是委托 ApplicationEventMulticaster完成事件发布。



![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的评价就是我✍️创作的动力！					  💞💞💞


参考资料：
[Spring-framework 官方文档](https://docs.spring.io/spring-framework)
