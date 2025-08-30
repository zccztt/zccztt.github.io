>上一篇讲了如何构建`MAVEN`项目
>本篇来讲一讲 `starter` 依赖项
> Spring Boot 初识：
> [【Spring Boot 初识丨一】入门实战](https://blog.csdn.net/wodejiaAA/article/details/131084712?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨二】maven](https://blog.csdn.net/wodejiaAA/article/details/130887654?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨三】starter](https://blog.csdn.net/wodejiaAA/article/details/131123497?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨四】主应用类](https://blog.csdn.net/wodejiaAA/article/details/131139228)
> 

@[TOC](Starter)
# 一、定义 
> &emsp;&emsp;启动器是一组方便的依赖关系描述符，它包含了一系列可以集成到应用里面的依赖包。你可以一站式集成Spring及其他技术，而不需要到处找示例代码和依赖包。例如：如果想使用Spring 和 JPA进行数据库访问，请包含 `spring-boot-starter-data-jpa` 依赖项。


# 二、<font color='blue'>启动器</font>
## 2.1 应用启动器
`Spring Boot` 提供了以下应用启动器`org.springframework.boot`：

| spring-boot-starter |  核心启动器，包括自动配置支持、日志记录和 YAML|
|--|--|
| spring-boot-starter-activemq | 使用 Apache ActiveMQ 的 JMS 消息传递启动器 |
| spring-boot-starter-amqp |  使用 Spring AMQP 和 Rabbit MQ 的启动器|
| spring-boot-starter-aop | 使用 Spring AOP 和 AspectJ 进行面向方面编程的入门 |
| spring-boot-starter-artemis |  使用 Apache Artemis 的 JMS 消息传递启动器|
|spring-boot-starter-batch  | 使用 Spring Batch 的启动器 |
| spring-boot-starter-cache | 使用 Spring Framework 的缓存支持的启动器 |
|spring-boot-starter-data-cassandra  | 使用 Cassandra 分布式数据库和 Spring Data Cassandra 的启动器 |
| spring-boot-starter-data-cassandra-reactive | 使用 Cassandra 分布式数据库和 Spring Data Cassandra Reactive 的 启动器|
| spring-boot-starter-data-couchbase |使用 Couchbase 面向文档的数据库和 Spring Data Couchbase 的启动器  |
| spring-boot-starter-data-couchbase-reactive | 使用 Couchbase 面向文档的数据库和 Spring Data Couchbase Reactive 的启动器 |
| spring-boot-starter-data-elasticsearch | 使用 Elasticsearch 搜索和分析引擎以及 Spring Data Elasticsearch 的启动器 |
|spring-boot-starter-data-jdbc  | 使用 Spring Data JDBC 的启动器 |
| spring-boot-starter-data-jpa | 将 Spring Data JPA 与 Hibernate 一起使用的启动器 |
| spring-boot-starter-data-ldap |  使用 Spring Data LDAP 的启动器|
|spring-boot-starter-data-mongodb  | 使用 MongoDB 面向文档的数据库和 Spring Data MongoDB的启动器 |
|spring-boot-starter-data-mongodb-reactive  | 使用 MongoDB 文档型数据库和 Spring Data MongoDB Reactive 的启动器 |
| spring-boot-starter-data-neo4j | 使用 Neo4j 图形数据库和 Spring Data Neo4j 的启动器 |
| spring-boot-starter-data-r2dbc |使用 Spring Data R2DBC 的启动器  |
| spring-boot-starter-data-redis |  用于将 Redis 键值数据存储与 Spring Data Redis 和 Lettuce 客户端一起使用的启动器|
| spring-boot-starter-data-redis-reactive| 将 Redis 键值数据存储与 Spring Data Redis 反应式和 Lettuce 客户端一起使用的启动器 |
|spring-boot-starter-data-rest  |  使用 Spring Data REST 通过 REST 公开 Spring Data 存储库的启动器|
| spring-boot-starter-freemarker | 使用 FreeMarker 视图构建 MVC Web 应用程序的启动器 |
| spring-boot-starter-graphql |  使用 Spring GraphQL 构建 GraphQL 应用程序的启动器|
| spring-boot-starter-groovy-templates | 使用 Groovy 模板视图构建 MVC web 应用程序的启动器 |
| spring-boot-starter-hateoas | 使用Spring MVC 和Spring HATEOAS 构建基于超媒体的RESTful Web 应用程序的启动器 |
| spring-boot-starter-integration |  使用 Spring Integration 的启动器|
| spring-boot-starter-jdbc |将 JDBC 与 HikariCP 连接池一起使用的启动器  |
| spring-boot-starter-jersey | 使用 JAX-RS 和 Jersey 构建 RESTful Web 应用程序的启动器。替代spring-boot-starter-web |
| spring-boot-starter-jooq| 使用 jOOQ 通过 JDBC 访问 SQL 数据库的启动器。替代spring-boot-starter-data-jpa或spring-boot-starter-jdbc|
|spring-boot-starter-json | 读写json的启动器|
|spring-boot-starter-mail | 使用 Java Mail 和 Spring Framework 的电子邮件发送支持的启动器|
|spring-boot-starter-mustache |使用 Mustache 视图构建 Web 应用程序的启动器 |
| spring-boot-starter-oauth2-authorization-server| 使用 Spring Authorization Server 功能的启动器|
| spring-boot-starter-oauth2-client|使用 Spring Security 的 OAuth2/OpenID Connect 客户端功能的启动器 |
|spring-boot-starter-oauth2-resource-server | 使用 Spring Security 的 OAuth2 资源服务器功能的启动器|
| spring-boot-starter-quartz| 使用 Quartz 调度器的启动器|
|spring-boot-starter-rsocket | 用于构建 RSocket 客户端和服务器的启动器|
|spring-boot-starter-security | 使用 Spring Security 的启动器|
|spring-boot-starter-test | 用于使用 JUnit Jupiter、Hamcrest 和 Mockito 等库测试 Spring Boot 应用程序的启动器|
|spring-boot-starter-thymeleaf |使用 Thymeleaf 视图构建 MVC Web 应用程序的启动器 |
|spring-boot-starter-validation | 将 Java Bean Validation 与 Hibernate Validator 结合使用的启动器|
|spring-boot-starter-web | 用于使用 Spring MVC 构建 Web（包括 RESTful）应用程序的启动器。使用 Tomcat 作为默认的嵌入式容器|
|spring-boot-starter-web-services | 使用 Spring Web 服务的启动器|
|spring-boot-starter-webflux | 用于使用 Spring Framework 的 Reactive Web 支持构建 WebFlux 应用程序的启动器|
|spring-boot-starter-websocket | 使用 Spring Framework 的 MVC WebSocket 支持构建 WebSocket 应用程序的启动器|
## 2.2 生产启动器
| spring-boot-starter-actuator |  使用 Spring Boot Actuator 的启动器，它提供生产就绪功能来帮助您监控和管理您的应用程序|
|--|--|
## 2.3 技术启动器
| spring-boot-starter-jetty |使用 Jetty 作为嵌入式 servlet 容器的启动器。替代spring-boot-starter-tomcat  |
|--|--|
| spring-boot-starter-log4j2 | 使用 Log4j2 进行日志记录的启动器。替代spring-boot-starter-logging |
|spring-boot-starter-logging|	使用 Logback 进行日志记录的启动器。默认日志记录启动器|
|spring-boot-starter-reactor-netty|使用 Reactor Netty 作为嵌入式响应式 HTTP 服务器的启动器。|
|spring-boot-starter-tomcat|将 Tomcat 用作嵌入式 servlet 容器的启动器。使用的默认 servlet 容器启动器spring-boot-starter-web|
|spring-boot-starter-undertow|使用 Undertow 作为嵌入式 servlet 容器的启动器。替代spring-boot-starter-tomcat|

![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的评价就是我✍️创作的动力！					  💞💞💞









