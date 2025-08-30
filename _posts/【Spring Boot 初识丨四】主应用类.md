> 上一篇讲了 Spring Boot 的启动器
> 本篇来讲一讲 主程序类 `Main Application Class` 及注解
> Spring Boot 初识：
> [【Spring Boot 初识丨一】入门实战](https://blog.csdn.net/wodejiaAA/article/details/131084712?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨二】maven](https://blog.csdn.net/wodejiaAA/article/details/130887654?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨三】starter](https://blog.csdn.net/wodejiaAA/article/details/131123497?spm=1001.2014.3001.5501)
> 

@[TOC](主程序类)
# 一、定义 
> &emsp;&emsp;Spring Boot的 主程序类 Main Application Class是包含用于启动Spring ApplicationContext的公共静态void main()方法的类。默认情况下，如果未显式指定主类，则Spring将在编译时在类路径中搜索一个，如果找不到一个或多个，则启动失败 。
> &emsp;&emsp; 主应用程序类建议定位在根包中，而不是其他的类。注解通常放在主类上，它隐式地为某些项定义了一个基本‘搜索包’。
>&emsp;&emsp;  例如：如果正在编写一个JPA应用程序，则使用`@SpringBootApplication` 注释类的包来搜索`@Entity` 项。 
> &emsp;&emsp; 使用根包还允许组件扫描仅应用当前。


🔔<font color='green'>**提示**：</font>
&emsp;&emsp; 如果不想使用`@SpringBootApplication`  ,它导入的<a href="#enableCo">`@EnableAutoConfiguration`</a> 和<a href="#cpScan"> `@ComponentScan`</a> 注解定义了此行为，也可以使用这些注解替代。


# 二、<font color='purple'>注解</font>
## 2.1 <span id=' boot'>@SpringBootApplication </span>

 `@SpringBootApplication `等效于使用<a href="#cfTion">`@Configuration` </a> <a href="#enableCo">`@EnableAutoConfiguration`</a> <a href="#cpScan">`@ComponentScan` </a>
 - <a href="#enableCo">`@EnableAutoConfiguration`</a>: 启用Spring Boot 的自动配置机制。
 - <a href="#cpScan"> `@ComponentScan`</a>：`@Component`在应用程序所在的包上启用扫描。
 - <a href="#cfTion"> `@Configuration`</a>：允许在上下文中注册额外的 beans 或导入额外的配置类


&emsp;&emsp; @SpringBootApplication是一个注解，用于标注一个类作为Spring Boot应用程序的主入口。
&emsp;&emsp; 它包含了一些默认的配置和自动配置 ：

 1. 开启了Spring Boot的自动配置功能，可以自动配置一些常用的组件和依赖。
 2. 开启了Spring MVC的Web支持，提供了一个简单的RESTful API接口。
 3. 开启了Spring Security的安全认证功能，提供了基本的用户认证和授权机制
 4. 开启了日志记录功能，可以使用SLF4J或Logback等日志框架进行日志输出。
 5. 开启了Thymeleaf模板引擎的支持，提供了一种简单易用的模板语法。

&emsp;&emsp; 通过使用@SpringBootApplication注解，可以快速搭建一个基于Spring Boot的应用程序，并且不需要手动配置大量的组件和依赖。


## 2.2 @EnableAutoConfiguration
&emsp;&emsp; <span id='enableCo'>`EnableAutoConfiguration`</span>是Spring Boot的一个自动配置类，尝试猜测和配置您可能需要的 bean。自动配置类通常根据您的类路径和您定义的 bean 应用。它的作用是在应用程序启动时自动配置一些常用的组件和依赖。
&emsp;&emsp; `EnableAutoConfiguration`会根据应用程序的类路径、环境变量、配置文件等信息，自动配置一些常用的组件和依赖，例如Tomcat、MySQL、Redis等。这样，就可以快速搭建一个基本的应用程序，而不需要手动配置大量的组件和依赖。
&emsp;&emsp; 🔔**注意**，`EnableAutoConfiguration`并不是所有的应用程序都需要使用的，有些应用程序可能需要更多的自定义配置。因此，可以根据自己的需求来选择是否使用。

**可选元素**：
| 修饰符和类型 | 可选元素 |描述 |
|--|--|--|
| Class<?>[] | exclude |排除特定的自动配置类，这样它们就永远不会被应用。|
|  String[]| excludeName |排除特定的自动配置类名，这样它们就永远不会被应用。|

**字段：**
| 修饰符和类型 | 字段 |描述|
|--|--|--|
|static final String  | ENABLED_OVERRIDE_PROPERTY |启用自动配置时可用于覆盖的环境属性。|



## 2.3 @ComponentScan

&emsp;&emsp; <span id='cpScan'>ComponentScan</span>注解是Spring框架中的一个注解，用于告诉Spring扫描哪些包下的类。它的作用是从约定的扫描路径中，识别标注了组件注册注解的类，并且把这些类自动注册到Spring IoC容器中 。

&emsp;&emsp; 在使用`@ComponentScan`注解时，需要将其与<a href="#cfTion"> `@Configuration`</a>注解一起使用，指定Spring扫描注解的package。

**嵌套类：**
| 修饰符和类型 | Class |描述|
|--|--|--|
|  static @interface|ComponentScan.Filter  |声明要用作包含过滤器或排除过滤器的类型过滤器。|

**可选元素**：
| 修饰符和类型 | 可选元素 |描述 |
|--|--|--|
|Class<?>[]|basePackageClasses|basePackages() 的类型安全替代品，用于指定要扫描带注释组件的包。|
|String[]|basePackages|用于扫描带注释组件的基础包。|
|ComponentScan.Filter[]|excludeFilters|指定哪些类型不符合组件扫描条件。|
|ComponentScan.Filter[]|includeFilters|指定哪些类型符合进行组件扫描。|
|boolean|lazyInit|指定是否应注册扫描的 bean以进行延迟初始化。|
|Class<? extends BeanNameGenerator>|nameGenerator|用于命名 Spring 容器中检测到的组件的BeanNameGenerator类。|
|String|resourcePattern|控制符合组件检测条件的类文件。|
|ScopedProxyMode|scopedProxy|指示是否应为检测到的组件生成代理，当以代理样式使用范围时，这可能是必需的。|
|Class<? extends ScopeMetadataResolver>|scopeResolver|用于解析检测到的组件的作用域的ScopeMetadataResolver|
|boolean|useDefaultFilters|指示是否应启用对用@Component @Repository、@Service或@Controller注释的类的自动检测。|
|String[]|value|basePackages() 的别名|


## 2.4 @Configuration
&emsp;&emsp;<span id='cfTion'>Configuration</span>是Spring Boot中的一个注解，用于标识一个类为配置类，它可以被Spring容器扫描并加载其中的配置信息。`@Configuration`注解通常与`@Bean`注解一起使用，用于定义Spring Bean。`@Configuration`注解的类可以包含多个`@Bean`注解的方法，每个方法都会返回一个Spring Bean实例。

**可选元素**：
| 修饰符和类型 | 可选元素 |描述 |
|--|--|--|
|boolean|enforceUniqueMethods|指定@Bean方法是否需要具有唯一的方法名称，否则会引发异常以防止意外重载。|
|boolean|proxyBeanMethods|指定@Bean方法是否应该代理以强制执行 bean 生命周期行为|
|String|value|显式指定与@Configuration类关联的 Spring bean 定义的名称 。|




![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的评价就是我✍️创作的动力！					  💞💞💞









