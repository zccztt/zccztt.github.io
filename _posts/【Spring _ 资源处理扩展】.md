> 上文讲了[ 【Spring | 资源处理 】](https://blog.csdn.net/wodejiaAA/article/details/131576783)
> 本文讲一下resource的扩展接口相关

@[TOC](资源处理扩展)

# ResourceLoader 接口
<hr>

`ResourceLoader` 接口用于加载 `Resource` 对象。

## 定义
<hr>


**定义如下：**

```java

public interface ResourceLoader {

	Resource getResource(String location);

	ClassLoader getClassLoader();
}

```
&emsp;&emsp;Spring 中，所有的 `ApplicationContext` 都实现了 `ResourceLoader` 接口。因此，所有 `ApplicationContext` 都可以通过 `getResource() `方法获取 `Resource`实例。

## 图解
<hr>

**图解如下**：
![在这里插入图片描述](https://img-blog.csdnimg.cn/765873d04fb643faab18af9e385ed283.png)


## 示例
<hr>

**示例如下**：

```java
// 
Resource template = ctx.getResource("some/resource/path/myTemplate.txt");
// 
Resource template = ctx.getResource("classpath:some/resource/path/myTemplate.txt");
//
Resource template = ctx.getResource("file:///some/resource/path/myTemplate.txt");
//
Resource template = ctx.getResource("https://myhost.com/resource/path/myTemplate.txt");


```
## 策略
<hr>

Spring根据各种位置路径加载资源的策略如下：

| 字首 | 样例 |描述|
|--|--|--|
| ` classpath:` |`classpath:com/myapp/config.xml`  |从类路径加载|
|`file:`|`file:///data/config.xml`|以URL形式从文件系统加载|
|`http:`|`http://myserver/logo.png`|以URL形式加载|
|--|`/data/config.xml`|取决于底层`ApplicationContext`|

# ResourcePatternResolver接口
<hr>

&emsp;&emsp;`ResourcePatternResolver`接口是 `ResourceLoader`接口的扩展，它的作用是定义策略，根据位置模式解析`Resource`对象。

```java
public interface ResourcePatternResolver extends ResourceLoader {

	String CLASSPATH_ALL_URL_PREFIX = "classpath*:";

	Resource[] getResources(String locationPattern) throws IOException;
}
```
&emsp;&emsp;由上文示例可知，该接口还为类路径中的所有匹配资源定义了一个特殊的`classpath*：resource`前缀。请注意，在这种情况下，资源位置应该是一个没有占位符的路径 — 例如，类路径中的`classpath*：/config/beans.xml`.JAR文件或不同目录可以包含多个具有相同路径和相同名称的文件。

&emsp;&emsp;`PathMatchingResourcePatternResolver`是一个独立的实现，可以在`ApplicationContext`外部使用，也可以被`ResourceArrayPropertyEditor`用于填充`Resource[]bean`属性。`PathMatchingResourcePatternResolver` 能够将指定的资源位置路径解析为一个或多个匹配的`Resource`对象。

> <font color='green'>🔔 注： </font>
> &emsp;&emsp;任何标准`ApplicationContext`中的默认`ResourceLoader`实际上都是`PathMatchingResourcePatternResolver`的一个实例，它实现了`ResourcePatternResolver`接口。

# ResourceLoaderAware接口
<hr>

&emsp;&emsp;`ResourceLoaderAware` 接口是一个特殊的回调接口，用于标记提供`ResourceLoader`引用的对象。
**定义如下：**

```java
public interface ResourceLoaderAware {

	void setResourceLoader(ResourceLoader resourceLoader);
}
```
&emsp;&emsp;当一个类实现`ResourceLoaderAware`并部署到`ApplicationContext`中（作为 Spring 管理的 bean）时，它会被`ApplicationContext`识别为`ResourceLoaderAware`，然后，`ApplicationContext`会调用`setResourceLoader(ResourceLoader)`，将自身作为参数提供（请记住，Spring 中的）所有`ApplicationContext`都实现`ResourceLoader`接口）。

&emsp;&emsp;由于`ApplicationContext`是一个`ResourceLoader`，该bean还可以实现`ApplicationContextAware`接口并直接使用提供的`ApplicationContext`来加载资源。但是，一般来说，如果您只需要这些，最好使用专用的接口。该代码将仅连接到资源加载`ResourceLoader`接口（可以被视为实用程序接口），而不是耦合到整个 `SpringApplicationContext`接口。

&emsp;&emsp;在应用程序中，还可以使用`ResourceLoader`自动装配作为实现`ResourceLoaderAware`接口的替代方法。传统的构造函数和byType自动装配模式能够分别为构造函数参数或setter方法参数提供`ResourceLoader`。以获得更大的灵活性（包括自动装配字段在这种情况下，会自动`ResourceLoader`连接到需要`ResourceLoader`类型的字段、构造函数参数或方法参数中，只需相关字段、构造函数或方法带有`@Autowired`注解即可。

> <font color='green'>🔔 注： </font>
> &emsp;&emsp;要为包含通配符或使用特殊类路径*：Resource前缀的资源路径加载一个或多个Resource对象，请考虑将`ResourcePatternResolver`的实例自动连接到应用程序组件中，而不是`ResourceLoader`。

# 资源依赖
<hr>

## 定义
<hr>

&emsp;&emsp;如果bean本身要通过某种动态过程来确定并提供资源路径，那么bean可以使用`ResourceLoader`或`ResourcePatternResolver`接口来加载资源。例如，考虑加载某种模板，其中需要的特定资源取决于用户的角色。如果资源是静态的的，完全消除`ResourceLoader`接口（或`ResourcePatternResolver`接口）的使用，让bean公开它需要的Resource属性，并希望将它们注入其中是有意义的。

&emsp;&emsp;使注入这些属性变得简单的原因是所有应用程序下面都注册并使用一个特殊的JavaBeans `PropertyEditor`，它可以将String路径转换为Resource对象。例如，下面的MyBean类有一个Resource类型的模板属性。

```java
public class MyBean {

	private Resource template;

	public setTemplate(Resource template) {
		this.template = template;
	}

	// ...
}
```
&emsp;&emsp;请注意，配置中引用的模板资源路径本身没有远端，因为应用程序下游将使用，`ResourceLoader`资源本身将根据需要通过`ClassPathResource，FileSystemResource或 ServletContextResource` 加载，取决于具体下游的目的类型。

&emsp;&emsp;如果需要强制显示使用特定的资源类型，则可以使用导出。以下两个示例如何强制使用`ClassPathResource`和`UrlResource`（后者用于访问文件系统文件）。

```java
<property name="template" value="classpath:some/resource/path/myTemplate.txt">

<property name="template" value="file:///some/resource/path/myTemplate.txt"/>
```
## value注解加载
<hr>

可以通过@Value注解加载资源文件myTemplate.txt，示例如下：

```java
@Component
public class MyBean {

	private final Resource template;

	public MyBean(@Value("${template.path}") Resource template) {
		this.template = template;
	}

	// ...
}
```
&emsp;&emsp;Spring的`PropertyEditor`会根据资源文件的路径字符串，加载Resource对象，把其注入到MyBean的构造方法。

## 加载多资源
<hr>


如果想要加载多个资源文件，可以使用classpath*:出口，例如：classpath*:/config/templates/*.txt。

```java
@Component
public class MyBean {

	private final Resource[] templates;

	public MyBean(@Value("${templates.path}") Resource[] templates) {
		this.templates = templates;
	}

	// ...
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的支持就是我✍️创作的动力！					  💞💞💞



参考：
[spring - Resource 官方文档](https://docs.spring.io/spring-framework/reference/core/resources.html)
