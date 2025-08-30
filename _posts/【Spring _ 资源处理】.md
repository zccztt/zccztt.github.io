@[toc](Resource)


# `Resource` 接口
<hr>

> &emsp;&emsp;不幸的是，Java的标准`Java.net.URL`类和各种URL前缀的标准处理程序对于所有对低级资源的访问来说都不够充分。例如，没有标准化的URL实现可以用于访问需要从类路径或相对于`Servlet`上下文获得的资源。虽然可以为专用URL前缀注册新的处理程序（类似于http:等前缀的现有处理程序），但这通常相当复杂，并且URL接口仍然缺乏一些所需的功能，例如检查所指向的资源是否存在的方法。

## 介绍
<hr>

&emsp;&emsp;Java的标准`Java.net.URL` 类和各种URL前缀的标准处理程序对于所有对低级资源的访问来说都不够充分，基于此，Spring 的 `org.springframework.core.io.Resource `接口旨在成为一个更强大的接口，用于抽象对低级资源的访问，有关`Resource`接口的更多详细信息，参考[Resource](https://docs.spring.io/spring-framework/docs/6.0.10/javadoc-api/org/springframework/core/io/Resource.html)。
![在这里插入图片描述](https://img-blog.csdnimg.cn/43bf5f4e45b6483cb11e1369a7188d5a.png)

```java
public interface Resource extends InputStreamSource {

	boolean exists();

	boolean isReadable();

	boolean isOpen();

	boolean isFile();

	URL getURL() throws IOException;

	URI getURI() throws IOException;

	File getFile() throws IOException;

	ReadableByteChannel readableChannel() throws IOException;

	long contentLength() throws IOException;

	long lastModified() throws IOException;

	Resource createRelative(String relativePath) throws IOException;

	String getFilename();

	String getDescription();
}

```

&emsp;正如`Resource`接口的定义所示，它扩展了`InputStreamSource`接口。以下列表显示`InputStreamSource`接口的定义：

```java
public interface InputStreamSource {
	InputStream getInputStream() throws IOException;
}
```

## 核心方法
<hr>

`Resource` 接口的最核心方法如下：

 - `getInputStream()`：定位并打开资源，返回用于从资源中读取的`InputStream`。预计每次调用都会返回一个新的 `InputStream`。 调用者需要负责关闭流。
 - `exists()`：返回一个`boolean`值，用于判断当前资源是否存在。
 - `isOpen()`：返回一个`boolean`值，判断当前资源是否是一个已打开的 InputStream。如果为 true，则不能多次读取`InputStream` ，必须只读取一次，然后关闭以避免资源泄漏。除`InputStreamResource` 外，对于所有常见的资源实现，返回false。
 - `getDescription()`：返回该资源的描述，当处理资源出错时，资源的描述会用于错误信息的输出。一般来说，资源的描述是一个完全限定的文件名称，或者是当前资源的实际URL。

><font color='green'> **注：**</font>
>资源抽象不会取代功能。它尽可能地将其包裹起来。例如，`UrlResource`包装了一个URL，并使用包装后的URL来完成其工作。

## 常见接口
<hr>


`Resource` 一些常见接口:

|类型|接口  |
|--|--|
| 输入流 | `org.springframework.core.io.InputStreamSource` |
|只读资源|`org.springframework.core.io.Resource`|
|可写资源|`org.springframework.core.io.WritableResource`|
|编码资源|`org.springframework.core.io.support.EncodedResource`|
|上下文资源|`org.springframework.core.io.ContextResource`|

图解关系如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/2633ae2fcd1b4f83a34d67771fc514af.png)



## 优缺点
<hr>

`Resource`  接口的优缺点：
	

 - **<font color='red'>优点</font>**
	- Resource 接口是一个标准接口，可以用于任何资源加载，不管资源是在文件中、在数据库中或其他地方。
 	- Resource 接口提供了同步和异步加载方法，可以适应不同的应用场景。
 	- Resource 接口可以方便地获取资源的元数据信息，例如资源的大小、修改时间等。
 	- Resource 接口支持资源锁定和解锁，可以避免多个线程同时访问同一个资源导致的问题。

 - <font color='gray'>缺点</font>：
	- Resource 接口需要应用层自己维护资源之间的依赖关系以及管理生命周期，比较麻烦。
	- Resource 接口对内存敏感，如果加载的资源过多可能会导致内存溢出。
	- Resource 接口不支持动态加载和更新资源，需要手动进行操作。
 	
# 内置`Resource`实现
<hr>

 		
Spring 包含几个内置Resource实现：

 - UrlResource
 - ClassPathResource
 - FileSystemResource
 - PathResource
 - ServletContextResource
 - InputStreamResource
 - ByteArrayResource

|资源来源| 前缀  | 描述|
|--|--|--|
| `UrlResource` | `file:、https:、ftp: `等  | <a href="#url">`UrlResource` </a>   |
|`ClassPathResource`  | `classpath:` | <a href="#cpr">`ClassPathResource`</a> |
|`FileSystemResource`  | `file:` | <a href="#fsr">`FileSystemResource`</a> |
|`PathResource`  | -- | <a href="#pr">`PathResource`</a> |
|`ServletContextResource`  | -- | <a href="#scr">`ServletContextResource`</a> |
|`InputStreamResource`  | -- | <a href="#isr">`InputStreamResource`</a> |
|`ByteArrayResource`  | -- | <a href="#bar">`ByteArrayResource`</a> |

## UrlResource
<hr>

&emsp;&emsp;<span id='url'>`UrlResource `</span>封装了一个 java.net.URL 对象，用于访问可通过 URL 访问的任何对象，例如文件、HTTPS 目标、FTP 目标等。所有 URL 都可以通过标准化的字符串形式表示，因此可以使用适当的标准化前缀来指示一种 URL 类型与另一种 URL 类型的区别。 这包括：file：用于访问文件系统路径；https：用于通过 HTTPS 协议访问资源；ftp：用于通过 FTP 访问资源等等。

&emsp;&emsp;`UrlResource `是由Java代码显式使用`UrlResoResource`构造函数创建的，但当您调用采用`String`参数表示路径的API方法时，通常会隐式创建。对于后一种情况，`JavaBeans PropertyEditor`最终决定创建哪种类型的`Resource`。如果路径字符串包含一个众所周知的（对属性编辑器来说就是）前缀（例如classpath：），它会为该前缀创建一个适当的专用`Resource`。但是，如果它不能识别前缀，它会假定该字符串是标准URL字符串，并创建一个`UrlResource`。

## ClassPathResource
<hr>

&emsp;&emsp;<span id='cpr'>`ClassPathResource`</span>从类路径上加载资源。它使用线程上下文加载器、给定的类加载器或给定的类来加载资源。

&emsp;&emsp;如果类路径资源驻留在文件系统中，但不支持驻留在jar中且尚未（通过servlet引擎或任何环境）扩展到文件系统的类路径资源，则此`Resource`实现支持解析为`java.io.File`。为了解决这一问题，各种`Resource`实现始终支持解析为`java.net.URL`。

&emsp;&emsp; `ClassPathResource`是由Java代码显式使用`ClassPath`资源构造函数创建的，但当您调用接受表示路径的String参数的API方法时，通常会隐式创建。对于后一种情况，`JavaBeans PropertyEditor`识别字符串路径上的特殊前缀`classpath：`，并在这种情况下创建一个`ClassPathResource`。
## FileSystemResource
<hr>

&emsp;&emsp;<span id='fsr'>`FileSystemResource`</span>是` java.io.File` 的资源实现。它还支持 `java.nio.file.Path `，应用 `Spring `的标准对字符串路径进行转换。`FileSystemResource` 支持解析为文件和 URL。
## PathResource
<hr>

&emsp;&emsp;<span id='pr'>`PathResource`</span>是 `java.nio.file.Path` 的资源实现。它实际上是`FileSystemResource`的纯`java.nio.path.path`替代方案，具有不同的`createRelative`行为。
## ServletContextResource
<hr>

&emsp;&emsp;<span id='scr'>`ServletContextResource`</span>是 `ServletContext` 的资源实现。它表示相应 Web 应用程序根目录中的相对路径。

&emsp;&emsp;它始终支持流访问和URL访问，但仅当web应用程序归档扩展并且资源在文件系统上时才允许`java.io.File`访问。无论它是在文件系统上扩展还是直接从JAR或其他类似数据库的地方访问（这是可以想象的），实际上都取决于`Servlet`容器。
## InputStreamResource
<hr>

&emsp;&emsp;<span id='isr'>`InputStreamResource`</span>是指定  `InputStream`的资源实现。注意：如果该 `InputStream` 已被打开，则不可以多次读取该流。
## ByteArrayResource
<hr>

&emsp;&emsp;<span id='bar'>`ByteArrayResource`</span>是指定的二进制数组的资源实现。它会为给定的字节数组创建一个 `ByteArrayInputStream`。


![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的支持就是我✍️创作的动力！					  💞💞💞



参考：
[spring - Resource 官方文档](https://docs.spring.io/spring-framework/reference/core/resources.html)
