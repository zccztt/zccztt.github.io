

@[TOC](应用上下文)

# 应用上下文和资源路径
<hr>

&emsp;&emsp;本节介绍如何使用资源创建应用程序上下文，包括使用 XML 的快捷方式、如何使用通配符以及其他详细信息。

## 构造应用上下文
<hr>


&emsp;&emsp;应用上下文构造函数（针对特定的应用上下文类型）通常将字符串或字符串数组作为资源的位置路径，例如构成上下文定义的 XML 文件。
**示例如下**

```java

ApplicationContext ctx = new ClassPathXmlApplicationContext("conf/appContext.xml");
ApplicationContext ctx = new FileSystemXmlApplicationContext("conf/appContext.xml");
ApplicationContext ctx = new FileSystemXmlApplicationContext("classpath:conf/appContext.xml");
ApplicationContext ctx = new ClassPathXmlApplicationContext(new String[] {"services.xml", "daos.xml"}, MessengerService.class);

```
## 构造ClassPathXmlApplicationContext实例 — 快捷方式
<hr>

&emsp;&emsp;`ClassPathXmlApplicationContext`公开了许多构造函数以实现方便的实例化。基本思想是，您可以只提供一个字符串数组，该数组只包含XML文件本身的文件名（没有前导路径信息），还可以提供一个类。然后，`ClassPathXmlApplicationContext`从提供的类派生路径信息。
示例如下：

```java
com/
  example/
    services.xml
    repositories.xml
    MessengerService.class
```

## 使用通配符
<hr>

&emsp;&emsp;`ApplicationContext` 构造器的中的资源路径可以是单一的路径（即一对一地映射到目标资源）；也可以是通配符形式——可包含 `classpath*`：也可以是前缀或 ant 风格的正则表达式（使用 spring 的 PathMatcher 来匹配）。

&emsp;&emsp;这种机制的一个用途是当您需要进行组件样式的应用程序组装时。所有组件都可以将上下文定义片段发布到已知的位置路径，并且，当使用以classpath*：为前缀的相同路径创建最终应用程序上下文时，所有组件片段都会自动拾取。

&emsp;&emsp;这种通配符是特定于应用程序上下文构造函数中资源路径的使用（或者直接使用PathMatcher实用程序类层次结构时），并且在构建时进行解析。它与资源类型本身无关。不能使用classpath*：前缀来构造实际的Resource，因为一个资源一次只指向一个资源。

### 蚂蚁式图案
<hr>

**示例如下：**
```java
/WEB-INF/*-context.xml
com/mycompany/**/applicationContext.xml
file:C:/some/path/*-context.xml
classpath:com/mycompany/**/applicationContext.xml
```

&emsp;&emsp;当路径位置包含Ant样式的模式时，解析器会遵循更复杂的过程来尝试解析通配符。它为最后一个非通配符段的路径生成一个Resource，并从中获取一个URL。

&emsp;&emsp;如果这个URL不是jar:URL或容器特定的变体（如WebLogic中的zip:、WebSphere中的wsjar等），则会从中获取`java.io.File`，并用于通过遍历文件系统来解析通配符。(在jar URL的情况下，解析器要么从中获取`java.net.JarURLConnection`，要么手动解析jar URL，然后遍历jar文件的内容以解析通配符)。

### 类路径：前缀
<hr>

**示例如下**：

```java
ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath*:conf/appContext.xml");

```

&emsp;&emsp;使用 `classpath* `表示类路径下所有匹配文件名称的资源都会被获取(本质上就是调用了 `ClassLoader.getResources(…) `方法），接着将获取到的资源组装成最终的应用上下文。

&emsp;&emsp;在位置路径的其余部分，`classpath*`: 前缀可以与 `PathMatcher `结合使用，如：`classpath*:META-INF/*-beans.xml`。


&emsp;&emsp;带有类路径的Ant样式模式：如果要搜索的根包在多个类路径位置可用，则不能保证资源能够找到匹配的资源。
**示例如下**：

```java
com/mycompany/package1/service-context.xml

classpath:com/mycompany/**/service-context.xml
```

&emsp;&emsp;这样的资源可能只存在于类路径中的一个位置，但当使用前面的示例这样的路径来尝试解析它时，解析程序会处理`getResource（“com/mycompany”）`；返回的（第一个）URL；。如果此基本包节点存在于多个`ClassLoader`位置，则所需资源可能不存在于找到的第一个位置。因此，在这种情况下，您应该更喜欢使用classpath*：使用相同的Ant样式模式，该模式搜索包含`com.mycompany`基本包的所有`classpath`位置：`classpath*∶com/mycompany/**/service-context.xml`。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的支持就是我✍️创作的动力！					  💞💞💞



参考：
[spring - Doc 官方文档](https://docs.spring.io/spring-framework/reference/core/resources.html)
