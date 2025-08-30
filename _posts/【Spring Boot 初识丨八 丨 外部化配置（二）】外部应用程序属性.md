> 上一篇讲了 Spring Boot 的外部化配置的加载顺序及一些简单的属性说明
> 本篇来讲一讲 外部化配置一些比较重要的部分
> Spring Boot 初识：
> [【Spring Boot 初识丨一】入门实战](https://blog.csdn.net/wodejiaAA/article/details/131084712)
> [【Spring Boot 初识丨二】maven](https://blog.csdn.net/wodejiaAA/article/details/130887654)
> [【Spring Boot 初识丨三】starter](https://blog.csdn.net/wodejiaAA/article/details/131123497)
> [【Spring Boot 初识丨四】主应用类](https://blog.csdn.net/wodejiaAA/article/details/131139228)
> [【Spring Boot 初识丨五】beans ](https://blog.csdn.net/wodejiaAA/article/details/131164139)
> [【Spring Boot 初识丨六】依赖注入](https://blog.csdn.net/wodejiaAA/article/details/131188509)
> [【Spring Boot 初识丨七】外部化配置（一）](https://blog.csdn.net/wodejiaAA/article/details/131323662)


@[TOC](外部化配置详解)

# 外部应用程序属性
<hr>

&emsp;&emsp;当您的应用程序启动时，Spring Boot 将自动从以下位置查找并加载`application.properties`和`application.yaml`文件：

 1. classpath:
 
	&emsp;a：classpath 根路径
	&emsp;b：classpath 路径下的 /config 包
2. 当前目录：
	&emsp;a：当前目录
	&emsp;b：当前目录的 /config 子目录
	&emsp;c： /config 子目录 的直接子目录
 
&emsp;&emsp; `SpringApplication `会自动加载以下路径下的 application.properties 配置文件，将其中的属性读到 Spring 的` Environment `中。

> 注：
> 
> 以上列表的配置文件会根据顺序(按优先级排序)，后序的配置会覆盖前序的配置。
> 可以选择 `YAML(yml) `配置文件替换 `properties` 配置文件。

如果不喜欢 `application.properties` 作为配置文件名，可以使用 `spring.config.name` 环境变量替换：

```java
$ java -jar myproject.jar --spring.config.name=myproject

```
还可以使用 spring.config.location 环境变量指定配置文件路径（此属性接受以逗号分隔的一个或多个要检查位置的列表）：

```java
$ java -jar myproject.jar --spring.config.location=\
    optional:classpath:/default.properties,\
    optional:classpath:/override.properties
```

> 📞 提示： 
> &emsp;&emsp;如果位置是可选的并且您不介意它们不存在， 请使用前缀optional: 。
> 🔔<font color='red'>**警告：**</font>
> &emsp;&emsp;spring.config.name、spring.config.location、 和spring.config.additional-location很早就被用来确定必须加载哪些文件。它们必须定义为环境属性（通常是操作系统环境变量、系统属性或命令行参数）。

## 可选位置
<hr>

&emsp;&emsp;默认情况下，当指定的配置数据位置不存在时，Spring Boot 将抛出`ConfigDataLocationNotFoundException`异常，并且您的应用程序将无法启动。

&emsp;&emsp;如果您想指定一个位置，但不介意它并不总是存在，则可以使用前缀`optional: `。您可以将此前缀与`spring.config.location`和`spring.config.additional-location`属性以及`spring.config.import`声明一起使用。

&emsp;&emsp;例如，即使文件丢失，`spring.config.import`值 也允许您的应用程序启动。`optional:file:./myconfig.propertiesmyconfig.properties`

&emsp;&emsp;如果您想忽略所有`ConfigDataLocationNotFoundExceptions `并始终继续启动您的应用程序，您可以使用`spring.config.on-not-found`属性。`SpringApplication.setDefaultProperties(…​)`或与系统/环境变量一起使用将值设置为忽略。

## 通配符位置
<hr>

&emsp;&emsp;如果配置文件位置包含最后一个路径段的*字符，则它被视为通配符位置。加载配置时会扩展通配符，以便同时检查直接子目录。当存在多个配置属性源时，通配符位置在 Kubernetes 等环境中特别有用。

&emsp;&emsp;例如，如果您有一些 Redis 配置和一些 MySQL 配置，您可能希望将这两个配置分开，同时要求它们都存在于`application.properties`文件中。这可能会导致两个单独的`application.properties`文件安装在不同的位置，例如`/config/redis/application.properties`和`/config/mysql/application.properties`。在这种情况下，使用`config/*/`通配符位置, 将导致两个文件都被处理。

&emsp;&emsp;默认情况下，Spring Boot 在默认搜索位置中包含`config/*/`。这意味着将搜索 jar 之外的`/config`目录的所有子目录。

您可以通过`spring.config.location`和`spring.config.additional-location`属性使用通配符位置。


```java
通配符位置必须仅包含一个*，并以*/作为目录的搜索位置或*/<filename>结尾，
对于属于文件的搜索位置,带有通配符的位置必须根据文件名的绝对路径按字母顺序排序。
```

> 通配符位置仅适用于外部目录。不能在类路径`classpath:location` 使用通配符。

## 特定属性profile
&emsp;&emsp;除了application属性文件之外，Spring Boot 还将尝试使用命名约定application-{profile} 加载特定于配置文件的文件。例如，如果您的应用程序激活名为prod的配置文件并使用 YAML 文件，则application.yaml 和application-prod.yaml都会被考虑。

&emsp;&emsp;配置文件特定的属性从与标准application.properties相同的位置加载，配置文件特定的文件始终覆盖非特定的文件。如果指定了多个配置文件，则应用最后获胜策略。例如，如果prod,live配置文件由spring.profiles.active属性指定，则 application-prod.properties中的值可以被 application-live.properties中的值覆盖。

&emsp;&emsp;可以通过 spring.profiles.active 参数来激活 profile，如果没有激活的 profile,默认会加载 application-default.properties 中的配置。

## 属性占位符
<hr>

&emsp;&emsp;application.properties 中的值会被 Environment 过滤，所以，可以引用之前定义的属性。

```java
app.name=MyApp
app.description=${app.name} is a Spring Boot application written by ${username:Unknown}

```

> 注：你可以使用此技术来创建 Spring Boot 属性变量。请参考： [“Use ‘Short’ Command Line Arguments](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto.properties-and-configuration.short-command-line-arguments)
> 
![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的评价就是我✍️创作的动力！					  💞💞💞


参考资料
[Spring Boot 官方文档 features-external-config](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.external-config)
