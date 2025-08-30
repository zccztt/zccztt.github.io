> 上一篇讲了 Spring Boot 的依赖注入
> 本篇来讲一讲Spring Boot 外部化配置
> Spring Boot 初识：
> [【Spring Boot 初识丨一】入门实战](https://blog.csdn.net/wodejiaAA/article/details/131084712)
> [【Spring Boot 初识丨二】maven](https://blog.csdn.net/wodejiaAA/article/details/130887654)
> [【Spring Boot 初识丨三】starter](https://blog.csdn.net/wodejiaAA/article/details/131123497)
> [【Spring Boot 初识丨四】主应用类](https://blog.csdn.net/wodejiaAA/article/details/131139228)
> [【Spring Boot 初识丨五】beans ](https://blog.csdn.net/wodejiaAA/article/details/131164139)
> [【Spring Boot 初识丨六】依赖注入](https://blog.csdn.net/wodejiaAA/article/details/131188509)


@[TOC](PropertySource)

#  加载顺序
<hr>

&emsp;&emsp;Spring Boot 使用一种非常特殊的`PropertySource`顺序，旨在允许合理地覆盖值。后面的属性源可以覆盖前面定义的值。按以下顺序考虑来源：

 1. 默认属性（由`SpringApplication.setDefaultProperties`指定）。
 2. `@Configuration`类上的`@PropertySource`注释。请注意，在刷新应用程序上下文之前，不会将此类属性源添加到环境中。这对于配置某些属性为时已晚，例如在刷新开始之前读取的logging.*和spring.main.*。
 3. 配置数据（例如`application.properties`文件）。
 4. `RandomValuePropertySource` 加载`random.*` 形式的属性。
 5. 操作系统环境变量。
 6. Java 系统属性 ( `System.getProperties()`)。
 7. 通过` java:comp/env `配置的 JNDI 属性
 8. `ServletContext` 初始化参数。
 9. `ServletConfig` 初始化参数。
 10. `SPRING_APPLICATION_JSON`（嵌入环境变量或系统属性中的内联 JSON）的属性。
 11. 命令行参数。
 12. 测试环境中的属性`properties`：`@SpringBootTest`和`测试注解`。
 13.  测试中的`@DynamicPropertySource`注释。
 14. 测试环境中的 `@TestPropertySource`注解配置。
 15. `Devtools 全局配置`.$HOME/.config/spring-boot (当 devtools 被激活 `~/.spring-boot-devtools.properties`)

配置数据文件按以下顺序考虑：

 1. jar 包外的 `application-{profile}.properties` 或 `application-{profile}.yml` 配置
 2. jar 包内的 `application-{profile}.properties` 或 `application-{profile}.yml` 配置
 3. jar 包外的 `application.properties` 或 `application.yml` 配置
 4. jar 包内的 `application.properties` 或 `application.yml` 配置

# 命令行属性
<HR>

&emsp;&emsp;默认情况下， `SpringApplication` 会获取` -- `参数（例如 `--server.port=9000` ），并将这个 `property` 添加到 Spring 的 `Environment`中。如前所述，命令行属性始终优先于基于文件的源属性。
&emsp;&emsp;如果不想加载命令行属性，可以通过 `SpringApplication.setAddCommandLineProperties(false) `禁用。

# json应用程序属性
<hr>

&emsp;&emsp;环境变量和系统属性通常有限制，这意味着某些属性名称无法使用。为了解决这个问题，Spring Boot 允许您将一个属性块编码到单个 JSON 结构中。
&emsp;&emsp;当您的应用程序启动时，任何`spring.application.json`或`SPRING_APPLICATION_JSON`属性都将被解析并添加到`Environment`.
例如，可以在 UN*X shell 的命令行上提供`SPRING_APPLICATION_JSON`属性作为环境变量：

```java
$ SPRING_APPLICATION_JSON='{"my":{"name":"test"}}' java -jar myapp.jar
```
在前面的示例中，您最终会进入Spring `Environment` 的 `my.name=test` 。
同样的， 也可以提供JSON属性：

```java
$ java -Dspring.application.json='{"my":{"name":"test"}}' -jar myapp.jar

```
或者json 命令行参数：

```java
$ java -jar myapp.jar --spring.application.json='{"my":{"name":"test"}}'

```
如果要部署到经典的Application Server，您还可以使用名为`java:comp/env/spring.application.json` 的 JNDI 变量。

> 🔔<font color='purple'>**注意：**</font>尽管JSON 中的null值将添加到结果属性源中，但`PropertySourcesPropertyResolver`会将null属性视为缺失值。这意味着JSON 无法使用null值覆盖来自低阶属性源的属性。

# 加密属性
<hr>

&emsp;&emsp;Spring Boot 不提供对加密属性值的任何内置支持，但是，它提供了修改 Spring Environment中包含的值所需的钩子点。EnvironmentPostProcessor 接口允许您在应用程序启动之前进行操作Environment。（如果想了解更多详细信息可以看这个：[启动前自定义环境或ApplicationContext](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto.application.customize-the-environment-or-application-context)）
&emsp;&emsp;如果您需要一种安全的方式来存储凭据和密码，[Spring Cloud Vault](https://cloud.spring.io/spring-cloud-vault/reference/html/#_quick_start)项目提供了在[HashiCorp Vault](https://www.vaultproject.io/)中存储外部化配置的支持。

# YAML属性

> YAML是 JSON 的超集，因此是指定分层配置数据的便捷格式。只要您的类路径上有SnakeYAML库，SpringApplication就会自动支持 YAML 作为属性的替代方案。有关YAML的详细可以看这篇（[YAML](https://blog.csdn.net/wodejiaAA/article/details/131329918)）

<hr>

Spring框架提供了两个方便的类，可用于加载YAML文档。

 - `YamlPropertiesFactoryBean` 将 YAML 文件的配置加载为 `Properties` 。
 - `YamlMapFactoryBean` 将 YAML 文件的配置加载为 `Map` 。

如果您想将 YAML 作为 Spring ` PropertySource`加载，您也可以使用`YamlPropertySourceLoader`类。

示例：

```java
environments:
  dev:
    url: "https://dev.example.com"
    name: "Developer Setup"
  prod:
    url: "https://another.example.com"
    name: "My Cool App"
```

等价于：

```java
environments.dev.url=https://dev.example.com
environments.dev.name=Developer Setup
environments.prod.url=https://another.example.com
environments.prod.name=My Cool App
```
YAML 支持列表形式，等价于 property 中的 `[index]` ：

```java
my:
 servers:
 - "dev.example.com"
 - "another.example.com"
```
等价于：

```java
my.servers[0]=dev.example.com
my.servers[1]=another.example.com

```
📞 提示：
&emsp;&emsp;使用`[index]`表示法的属性可以使用 Spring Boot 的类绑定到 Java `List` 或 `Set` 对象。

🔔<font color='red'>**警告：**</font>
&emsp;&emsp;无法使用`@PropertySource`或`@TestPropertySource` 注释加载 YAML 文件。因此，如果您需要以这种方式加载值，则需要使用属性文件。

 **YAML 多文档**
&emsp;&emsp;Spring Boot 允许您将单个物理文件拆分为多个逻辑文档，每个逻辑文档都是独立添加的。文件按从上到下的顺序处理。后面的文档可以覆盖前面文档中定义的属性。
&emsp;&emsp;对于`application.yaml`文件，使用标准 YAML 多文档语法。三个连续的连字符代表一个文档的结束和下一个文档的开始。

```java
spring:
  application:
    name: "MyApp"
---
spring:
  application:
    name: "MyCloudApp"
  config:
    activate:
      on-cloud-platform: "kubernetes"

```

对于application.properties文件，使用特殊#---或!---注释来标记文档拆分：

```java
spring.application.name=MyApp
#---
spring.application.name=MyCloudApp
spring.config.activate.on-cloud-platform=kubernetes

```

# 配置随机值
<hr>

&emsp;&emsp;`RandomValuePropertySource`对于注入随机值（例如，注入秘密或测试用例）非常有用。它可以生成整数、长整型、uuid 或字符串，如以下示例所示：

```java
my.secret=${random.value}
my.number=${random.int}
my.bignumber=${random.long}
my.uuid=${random.uuid}
my.number-less-than-ten=${random.int(10)}
my.number-in-range=${random.int[1024,65536]}
```


# 配置系统环境属性
<hr>

&emsp;&emsp;Spring Boot 支持为环境属性设置前缀。如果系统环境由具有不同配置要求的多个 Spring Boot 应用程序共享，这非常有用。系统环境属性的前缀可以直接在 `SpringApplication`上设置。

&emsp;&emsp;例如，如果将前缀设置为`input`，则在系统环境中 诸如 `remote.timeout` 之类的属性也将被解析为`input.remote.timeout` 。












![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的评价就是我✍️创作的动力！					  💞💞💞


参考资料
[Spring Boot 官方文档 features-external-config](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.external-config)

