> 上篇 [Spring 事件监听概述](https://blog.csdn.net/wodejiaAA/article/details/131436853) 对 Spring 事件监听的机制有了个基本的了解。
> 本篇来详细的解读下Spring 的 <font color='green'>事件监听机制</font>。

@[TOC](事件监听详解)

# ApplicationEvent 
<hr>

&emsp;&emsp;`ApplicationEvent`最重要的子类是`ApplicationContextEvent`抽象类，`ApplicationContextEvent`是spring容器Context生命周期事件的基类。

`ApplicationContextEvent`的有四个子类，如下：

 - ContextRefreshedEvent：当spring容器context刷新时触发
 - ContextStartedEvent：当spring容器context启动后触发
 - ContextStoppedEvent：当spring容器context停止时触发
 - ContextClosedEvent：当spring容器context关闭时触发，容器被关闭时，其管理的所有单例Bean都被销毁。

&emsp;&emsp;以上四个事件就是spring容器生命周期的四个事件，当每个事件触发时，相关的监听器就会监听到相应事件，然后触发`onApplicationEvent`方法，此时就可以做一些容器，同时这些容器事件跟spring的后置处理器一样，留给用户扩展自定义逻辑，作为暴露的扩展点。

ApplicationEvent 重要的子类关系图如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/22e02d12a17840fda8524674432842bf.png)


示例：

```java
public class BlockedListEvent extends ApplicationEvent {

	private final String address;
	private final String content;

	public BlockedListEvent(Object source, String address, String content) {
		super(source);
		this.address = address;
		this.content = content;
	}

	// accessor and other methods...
}
```

# ApplicationListener
<hr>

&emsp;&emsp;`ApplicationListener `（继承自JDK的`EventListener`,JDK要求所有的监听器继承它。）是所有事件监听器的接口，事件监听器监听某个事件必须要实现该接口。
&emsp;&emsp;`ApplicationListener `通常使用自定义事件的类型（在前面的示例中为BlockedListEvent）进行参数化。这意味着 `onApplicationEvent() `方法可以保持类型安全，避免任何向下转型的需要。您可以根据需要注册任意数量的事件侦听器，但请注意，默认情况下，事件侦听器同步接收事件。这意味着`publishEvent()`方法将阻塞，直到所有侦听器完成对事件的处理。这种同步单线程方法的优点之一是，当侦听器接收事件时，如果事务上下文可用，它会在发布者的事务上下文内进行操作。若想提供顺序触发监听器的语义,则可以使用另一个接口`SmartApplicationListener`

```java
public class BlockedListNotifier implements ApplicationListener<BlockedListEvent> {

	private String notificationAddress;

	public void setNotificationAddress(String notificationAddress) {
		this.notificationAddress = notificationAddress;
	}

	public void onApplicationEvent(BlockedListEvent event) {
		// notify appropriate parties via notificationAddress...
	}
}
```

## 基于注释
<hr>
使用`@EventListener` 注释在托管bean 的任何方法上注册事件监听器。重写如下：

```java
public class BlockedListNotifier {

	private String notificationAddress;

	public void setNotificationAddress(String notificationAddress) {
		this.notificationAddress = notificationAddress;
	}

	@EventListener
	public void processBlockedListEvent(BlockedListEvent event) {
		// notify appropriate parties via notificationAddress...
	}
}
```
方法签名再次声明它所监听的事件类型，但是这一次使用了灵活的名称，并且没有实现特点的监听器接口。只要实际事件类型在它实现的层次结构中解析泛型参数，也可以通过泛型缩小事件类型范围。
也可以在注释本身指定事件类型 ，示例如下：

```java
@EventListener({ContextStartedEvent.class, ContextRefreshedEvent.class})
public void handleContextStart() {
	// ...
}
```
还可以通过使用`condition` 定义表达式的注释的属性SpEL来添加额外的运行时过滤，该表达式应该匹配以实际调用特定事件的方法。
示例如下：
```java
@EventListener(condition = "#blEvent.content == 'my-event'")
public void processBlockedListEvent(BlockedListEvent blEvent) {
	// notify appropriate parties via notificationAddress...
}
```

SpEL 元数据:
|Name|  Description|
|--|--|
|Event  | 实际的ApplicationEvent |
| Arguments array | 用于调用该方法的参数（作为对象数组）。 |
|Argument name  | 任何方法参数的名称。如果由于某种原因，名称不可用（例如，因为编译的字节代码中没有调试信息），则也可以使用#a<#arg>的语法来使用各个参数 ，其中<#arg> 代表参数索引（从 0 开始）。 |


## 异步
<hr>

如果您希望特定的监听器异步处理事件，您可以重用 常规`@Async` 支持。示例如下：

```java
@EventListener
@Async
public void processBlockedListEvent(BlockedListEvent event) {
	// BlockedListEvent is processed in a separate thread
}
```

使用异步事件时请注意以下限制：

如果异步事件监听器抛出异常，它不会传播到调用者。有关详细信息，请参阅 [AsyncUncaughtExceptionHandler](https://docs.spring.io/spring-framework/docs/6.0.11-SNAPSHOT/javadoc-api/org/springframework/aop/interceptor/AsyncUncaughtExceptionHandler.html) 

异步事件监听器方法无法通过返回值来发布后续事件。如果您需要发布另一个事件作为处理结果，请注入  [ApplicationEventPublisher](https://docs.spring.io/spring-framework/docs/6.0.11-SNAPSHOT/javadoc-api/org/springframework/context/ApplicationEventPublisher.html) 来手动发布该事件。

## 排序
<hr>
如果您需要在另一个侦听器之前调用一个侦听器，则可以将`@Order` 注释添加到方法声明中，示例如下：

```java
@EventListener
@Order(42)
public void processBlockedListEvent(BlockedListEvent event) {
	// notify appropriate parties via notificationAddress...
}
```



# ApplicationEventMulticaster
<hr>
ApplicationEventMulticaster接口功能主要用于广播事件给所有监听器，示例如下：

```java
public interface ApplicationEventMulticaster {
    void addApplicationListener(ApplicationListener<?> var1);

    void addApplicationListenerBean(String var1);

    void removeApplicationListener(ApplicationListener<?> var1);

    void removeApplicationListenerBean(String var1);

    void removeAllListeners();

    void multicastEvent(ApplicationEvent var1);

    void multicastEvent(ApplicationEvent var1, @Nullable ResolvableType var2);
}
```
[AbstractApplicationEventMulticaster](https://docs.spring.io/spring-framework/docs/6.0.11-SNAPSHOT/javadoc-api/org/springframework/context/event/ApplicationEventMulticaster.html)是`ApplicationEventMulticaster`接口的抽象实现，提供监听器的监听器注册的方法。注册监听器时一般不允许相同监听器注册多个实例，因此使用Set集合，用于去重。然后实现广播事件的具体实现没有在这里实现，其他排序子类[SimpleApplicationEventMulticaster](https://docs.spring.io/spring-framework/docs/6.0.11-SNAPSHOT/javadoc-api/org/springframework/context/event/SimpleApplicationEventMulticaster.html)去实现。


# ApplicationEventPublisher
<hr>

要发布自定义`ApplicationEvent`，请在`ApplicationEventPublisher ` 上调用 `publishEvent()` 方法执行。通常，这是通过创建一个实现类 `ApplicationEventPublisherAware`并将其注册为 Spring bean 来完成的。示例如下：

```java

public class EmailService implements ApplicationEventPublisherAware {

	private List<String> blockedList;
	private ApplicationEventPublisher publisher;

	public void setBlockedList(List<String> blockedList) {
		this.blockedList = blockedList;
	}

	public void setApplicationEventPublisher(ApplicationEventPublisher publisher) {
		this.publisher = publisher;
	}

	public void sendEmail(String address, String content) {
		if (blockedList.contains(address)) {
			publisher.publishEvent(new BlockedListEvent(this, address, content));
			return;
		}
		// send email...
	}
}

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的评价就是我✍️创作的动力！					  💞💞💞



参考资料：
[Spring-framework 官方文档](https://docs.spring.io/spring-framework)
