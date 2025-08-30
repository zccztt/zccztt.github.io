> 上文讲了 [类型安全配置属性](https://blog.csdn.net/wodejiaAA/article/details/131308451)
> 本篇来讲一下 Spring boot 的默认日志相关

@[TOC](Logging)
#  🍑 概述
<hr>

&emsp;&emsp;Spring Boot在所有内部日志中使用`Commons Logging`，但也保留默认配置对常用日志的支持，如：`Java Util Logging，Log4J, Log4J2， SLF4J 和Logback`。每种Logger都可以通过配置使用控制台或者文件输出日志内容。默认情况下，如果您使用“Starters”，会使用Logback来实现日志管理。

&emsp;&emsp;Logback是log4j框架的作者开发的新一代日志框架，它效率更高、能够适应诸多的运行环境，同时天然支持SLF4J。
![在这里插入图片描述](https://img-blog.csdnimg.cn/1803868355fb4141bf7cca75186060be.png)

&emsp;&emsp;	上图明确的告诉了我们Slf4j  就是简单的外观或抽象，它允许最终用户在部署时插入所需的日志框架 。因此，我们没必要纠结使用默认的Logback还是Log4j，直接用Slf4j 即可。至于这个日志具体是如何写到控制台或者文件的，则由Spring Boot项目中引入了什么具体的日志框架决定，默认情况下就是Logback。

# 🍏 日志格式
<hr>

![在这里插入图片描述](https://img-blog.csdnimg.cn/003f6e1e2ca24bf286448b99f5f6b033.png)

由上图可知，日志输出的主要元素如下：

 - 日期和时间：毫秒精度且易于排序。
 - 日志级别：ERROR、WARN、INFO、DEBUG、 或TRACE。
 - 进程 ID。
 - 分隔符  `---` 用于区分实际日志消息的开始。
 - 线程名称：用方括号括起来（可能会截断控制台输出）。
 - Logger 名称：这通常使用源代码的类名（通常是缩写）。
 - 日志内容。

# 🍐 控制台输出
<hr>


 **日志级别：**
 
 &emsp;&emsp;日志级别从低到高分为TRACE < DEBUG < INFO < WARN < ERROR < FATAL，如果设置为WARN，则低于WARN的信息都不会输出。
 
&emsp;&emsp;Spring Boot中默认配置ERROR、WARN和INFO级别的日志输出到控制台。

**开启DEBUG日志：**

1：在运行命令后加入`-- debug` 标志，如：`$ java -jar myapp.jar --debug`

2：在配置文件`application.properties` 中配置 `debug=true` 

启用调试模式时，会配置一系列核心记录器（嵌入式容器、Hibernate和Spring Boot）以输出更多信息。但是你自己应用的日志并不会输出为DEBUG级别。

**开启TRACE日志：**

1：在运行命令后加入`--trace` 标志

2：在配置文件`application.properties` 中配置 `trace=true` 

&emsp;&emsp;启动应用程序来启用“跟踪”模式。这样做可以为一系列核心记录器（嵌入式容器、Hibernate架构生成和整个Spring产品组合）启用跟踪日志记录。

**颜色编码输出:**

&emsp;&emsp;如果您的终端支持 ANSI，设置颜色输出可以提高日志的可读性。您可以设置`spring.output.ansi.enabled` 来覆盖自动检测。

` spring.output.ansi.enabled` [支持的值](https://docs.spring.io/spring-boot/docs/3.1.1/api/org/springframework/boot/ansi/AnsiOutput.Enabled.html)为以下三项：
| 参数 |说明  |
|--|--|
|ALWAYS  |  启用 ANSI 彩色输出。|
|DETECT|尝试检测ANSI着色功能是否可用。|
NEVER|禁用 ANSI 颜色输出。|


&emsp;&emsp;颜色编码是通过使用`%clr` 转换字来配置的。在最简单的形式中，转换器根据日志级别对输出进行着色，示例如下：

```java
%clr(%5p)
```

日志级别到颜色的映射:
|级别| 颜色  |
|--|--|
| FATAL |  红色|
|ERROR  |  红色|
| WARN |黄色  |
| INFO | 绿色  |
| DEBUG |  绿色 |
| TRACE |  绿色|

&emsp;&emsp;或者，您可以指定应该使用的颜色或样式，方法是将其提供为转换的选项。例如，要使文本变为黄色，示例如下：
```java
%clr(%d{yyyy-MM-dd'T'HH:mm:ss.SSSXXX}){yellow}
```
支持以下颜色和样式：

 - blue
 - cyan
 - faint
 - green
 - magenta
 - red
 - yellow

# 🥥 文件输出
<hr>

&emsp;&emsp;默认情况下，Spring Boot只将日志输出到控制台，而不会写到日志文件。如果除了控制台输出之外还想写入日志文件，则需在application.properties中设置`logging.file`或`logging.path`属性。

 - logging.file，设置文件，可以是绝对路径，也可以是相对路径。如：logging.file=my.log
 - logging.path，设置目录，会在该目录下创建spring.log文件，并写入日志内容，如：logging.path=/var/log



&emsp;&emsp;如果只配置 logging.file，会在项目的当前路径下生成一个 xxx.log 日志文件。
&emsp;&emsp;如果只配置 logging.path，在 /var/log文件夹生成一个日志文件为 spring.log

&emsp;&emsp;**默认情况下，日志文件的大小达到10MB时会切分一次，产生新的日志文件，默认级别为：ERROR、WARN、INFO**

> 注：二者不能同时使用，如若同时使用，则只有logging.file生效

**<font color ='green'>提示：</font>**
&emsp;&emsp;日志记录属性独立于实际的日志记录基础结构。因此，特定的配置密钥（如logback的`logback.configurationFile`）不由spring Boot管理。

# 🥝 文件轮换
<hr>

&emsp;&emsp;如果使用 Logback，则可以使用`application.properties` 或`application.yaml` 文件微调日志轮换设置。对于所有其他日志系统，需要自己直接配置轮换设置（例如，如果使用 Log4j2，则可以添加log4j2.xml或log4j2-spring.xml文件）。

轮换策略属性如下:

|参数|说明  |
|--|--|
| logging.logback.rollingpolicy.file-name-pattern | 	用于创建日志存档的文件名模式。 |
|logging.logback.rollingpolicy.clean-history-on-start|应用程序启动时是否应进行日志归档清理。|
|logging.logback.rollingpolicy.max-file-size|归档之前日志文件的最大大小。|
|logging.logback.rollingpolicy.total-size-cap|logging.logback.rollingpolicy.total-size-cap|
|logging.logback.rollingpolicy.max-history|	要保留的归档日志文件的最大数量（默认为 7）。|

# 🍒 文件级别
<hr>

&emsp;&emsp;所有支持的日志记录系统都可以在Spring环境中设置记录级别（例如在`application.properties`中）格式为：`’logging.level.* = LEVEL’ ` 。根日志记录程序可以使用logging_level.root进行配置。

 -` logging.level`：日志级别控制前缀，`*`为包名或Logger名
 - `LEVEL`：选项TRACE, DEBUG, INFO, WARN, ERROR, FATAL, OFF

示例如下：

```java

logging.level.root=warn   // root日志以WARN级别输出
logging.level.org.springframework.web=debug // 包下所有class以DEBUG级别输出
logging.level.org.hibernate=error //  包下所有class以error级别输出
```
还可以使用环境变量设置日志记录级别。例如，

```java
LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_WEB=DEBUG  // 将ORG.SPRINGFRAMEWORK.WEB 设置为`DEBUG`。
```
**<font color ='green'>提示：</font>**
&emsp;&emsp;上述方法仅适用于包级别的日志记录。由于松弛绑定总是将环境变量转换为小写，因此不可能以这种方式为单个类配置日志记录。如果需要为类配置日志记录，可以使用[SPRING_APPLICATION_JSON](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.external-config.application-json)变量。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的支持就是我✍️创作的动力！					  💞💞💞


参考资料
[Spring Boot 日志官方文档](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.logging)



	

	


