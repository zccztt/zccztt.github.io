> 学习前提：
> 学习Spring Boot的前提是具备Java编程基础，包括面向对象编程、Java集合框架、异常处理、多线程等基本概念和技能。
> 此外，还需要了解Web开发的基本知识，例如HTTP协议、Servlet、JSP、HTML、CSS、JavaScript等。
> Spring Boot 初识会持续更新 
> Spring Boot 初识：
> [【Spring Boot 初识丨一】入门实战](https://blog.csdn.net/wodejiaAA/article/details/131084712?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨二】maven](https://blog.csdn.net/wodejiaAA/article/details/130887654?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨三】starter](https://blog.csdn.net/wodejiaAA/article/details/131123497?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨四】主应用类](https://blog.csdn.net/wodejiaAA/article/details/131139228)



如果你已经具备了上述基础知识，那么可以开始更好更快速的学习Spring Boot。

<hr>

@[TOC](SpringBoot)
# 一、 🏀 整体概述


&emsp;&emsp;Spring Boot是一个基于Spring框架的快速开发框架，它简化了Spring应用程序的开发过程，提供了自动配置和快速开发的特性。
&emsp;&emsp;通过学习Spring Boot,你可以快速构建高效、可扩展的Web应用程序。

**特征：**

 - 创建独立的 Spring 应用程序
 - 内嵌的Tomcat、Jetty 、Undertow（无需部署WAR文件）
 - 提供 ‘starter’ 起步依赖项以简化构建配置
 - 尽可能自动配置 Spring 和 第三方库
 - 提供生产就绪的功能 （健康检查， 统计，外部化配置）
 - 不需要代码生成也不需要 XML 配置

一些用到了SpringBoot 的项目：
![在这里插入图片描述](https://img-blog.csdnimg.cn/14c352d8ef51491aab6a4bb98b9869f5.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )
# 二、 🏐 <font color="green">入门构建：</font>

> 构建一个经典的“Hello World！SpringBoot 项目
> 集成开发环境：IntelliJ IDEA, Spring Tools, Visual Studio Code,  Eclipse 或者其他你常用的.
> jdk 官网推荐jdk17 
## 1.  ⚽ 创建项目
   
&emsp;&emsp;使用[start.spring.io](https://start.spring.io/) 创建一个web项目。
（Project 选<font color='red'>maven</font>, Spring Boot 版本 和 Packaging默认即可，jdk 按自己情况选 默认官方推荐<font color='red'>jdk17</font>。） 
&emsp;&emsp;在“ADD DEPENDENCIES”对话框中搜索并添加“web”依赖项，如截图所示。点击“generate”按钮，下载压缩包文件，并将其解压到您计算机上的一个文件夹中。

![在这里插入图片描述](https://img-blog.csdnimg.cn/d86296c0ceb649e6b3c01c0c437cb8e0.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/59d45b0dd6204f8480410e637c55a682.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/7b1fe686bbfa4163a50dfdd10d65fcaa.png)
按照上面的方法生成一个SpringBoot的简单demo
## 2.  🥎 添加代码

```java
package com.example.demo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class DemoApplication {
    public static void main(String[] args) {
      SpringApplication.run(DemoApplication.class, args);
    }
    @GetMapping("/hello")
    public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
      return String.format("Hello %s!", name);
    }
}

```
`@SpringBootApplication`是一个方便的注解，它添加了以下所有内容：

 - `@Configuration`：将类标记为应用程序上下文的 bean 定义源。
 - `@EnableAutoConfiguration`：告诉 Spring Boot 开始添加基于类路径设置、其他 bean 和各种属性设置的 bean。例如，如果spring-webmvc在类路径上，此注释将应用程序标记为 Web 应用程序并激活关键行为，例如设置DispatcherServlet.
 - `@ComponentScan`：告诉 Spring 在包中寻找其他组件、配置和服务，让它找到控制器。

这是在 Spring Boot 中创建一个简单的“Hello World”Web 服务所需的所有代码。
我们添加的方法hello()旨在采用名为 name 的 String 参数，然后将此参数与"Hello"代码中的单词组合。这意味着如果您在请求中将您的姓名设置为"Amy"，则响应将是“Hello Amy”。

注释`@RestController` 告诉 Spring，此代码描述了一个端点，该端点应在 Web 上可用。告诉`@GetMapping`(“/hello”) Spring 使用我们的hello()方法来回答发送到http://localhost:8080/hello地址的请求。最后，`@RequestParam`告诉 Spring 在请求中期望一个名称值，但如果不存在，它将默认使用"World"该词。
## 3. 🥎 启动

**命令启动：**

MacOS/Linux:

```c

./gradlew bootRun		gradle启动方式
./mvnw spring-boot:run  maven启动方式
```
Windows:

```c

.\gradlew.bat bootRun    gradle启动方式
  mvn spring-boot:run    maven启动方式


```
出现Spring图样即启动成功
![在这里插入图片描述](https://img-blog.csdnimg.cn/4eb24fc120514e51ad384cf18d56a58b.png)
浏览器打开 看是否输出“Hello World”
![在这里插入图片描述](https://img-blog.csdnimg.cn/33fe615e67704b5183e5a9f38211bb18.png)
或者直接使用idea等工具启动

打开之前解压的项目-配置maven（File | Settings | Build, Execution, Deployment | Build Tools | Maven ）-修改项目jdk-添加一些必要的代码-启动即可

![在这里插入图片描述](https://img-blog.csdnimg.cn/00b208613b8447d29576d18a6ebaaf96.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的评价就是我✍️创作的动力！					  💞💞💞






   















