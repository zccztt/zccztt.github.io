@[TOC](security 跨域)

![在这里插入图片描述](https://img-blog.csdnimg.cn/cc0521181ea542bca9944ad46a3a8f7e.gif)

> <font face= '楷体' size='4'>主页传送门：📀 [传送](https://blog.csdn.net/wodejiaAA?type=blog) </font>

# 概述
<hr>

&emsp;&emsp;Spring Security是一个功能强大且高度可定制的，主要负责为Java程序提供声明式的身份验证和访问控制的安全框架。其前身是Acegi Security,后来被收纳为Spring的一个子项目，并更名为了Spring Security。Spring Security的底层主要是基于Spring AOP和Servlet过滤器来实现安全控制，它提供了全面的安全解决方案，同时授权粒度可以在Web请求级和方法调用级来处理身份确认和授权。
> &emsp;&emsp;跨域问题是由于浏览器的同源策略所引起的。当一个网页从一个域名(协议、域名和端口号相同)的页面向另一个域名的页面发送请求时，由于浏览器的同源策略限制，浏览器会阻止这种请求。
&emsp;&emsp;Spring Security是一个安全框架，它可以防止跨站请求伪造(CSRF)攻击和其他安全漏洞。但是，它也会影响跨域请求。

# 方案
<hr>

## 方案一
<hr>


**在Spring Security配置文件中添加CORS过滤器**
1.创建一个CORSFilter类，继承WebMvcConfigurerAdapter类，并重写addCorsMappings方法

```java
@Configuration
public class CorsConfig extends WebMvcConfigurerAdapter {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 允许跨域访问的路径
                .allowedOrigins("*") // 允许跨域访问的源
                .allowedMethods("POST", "GET", "PUT", "OPTIONS", "DELETE") // 允许请求的方法
                .maxAge(168000) // 预检间隔时间
                .allowedHeaders("*") // 允许头部设置
                .allowCredentials(true); // 是否发送cookie
    }
}
```
2. 在application.properties或application.yml文件中添加相关配置。

application.properties:

```java
# application.properties
spring.mvc.cors.allowed-origins=*
spring.mvc.cors.allowed-methods=POST,GET,PUT,OPTIONS,DELETE
spring.mvc.cors.allow-credentials=true
spring.mvc.cors.max-age=168000

```
application.yml:
```java
# application.yml
spring:
  mvc:
    cors:
      allowed-origins: *
      allowed-methods: POST,GET,PUT,OPTIONS,DELETE
      allow-credentials: true
      max-age: 168000
```
## 方案二
<hr>

**使用@CrossOrigin注解**
在Controller类或方法上添加@CrossOrigin注解

```java
@RestController
@RequestMapping("/api")
public class ApiController {
    
    @CrossOrigin(origins = "http://localhost:8080", maxAge = 3600) // 允许跨域访问的源和预检间隔时间
    @GetMapping("/hello")
    public String hello() {
        return "Hello World!";
    }
}

```
&emsp;&emsp;@CrossOrigin注解用于指定允许跨域访问的源和预检间隔时间。其中，origins属性表示允许跨域访问的源，maxAge属性表示预检间隔时间。

*如果需要对特定的请求头进行跨域配置，则需要使用@CrossOrigin注解的headers属性*

```java
@CrossOrigin(origins = "http://localhost:8080", maxAge = 3600, headers = "Authorization") // 允许跨域访问的源、预检间隔时间和请求头
@GetMapping("/login")
public String login() {
    return "Login Page";
}
```
&emsp;&emsp;@CrossOrigin注解的headers属性指定了只允许携带Authorization请求头的跨域请求。

## 方案三
<hr>

**使用RestTemplate**
&emsp;&emsp;在Java中，使用RestTemplate解决security跨域问题，可以通过配置CORS策略来实现

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RequestCallback;
import org.springframework.web.client.ResponseExtractor;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class RestTemplateConfig implements WebMvcConfigurer {
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 允许跨域访问的路径
                .allowedOrigins("*") // 允许跨域访问的源
                .allowedMethods(Arrays.asList(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)) // 允许请求的方法
                .allowedHeaders("*") // 允许头部设置
                .allowCredentials(true) // 是否发送cookie
                .maxAge(3600); // 预检间隔时间
    }
    
    public static void main(String[] args) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://api.example.com/users/1"; // 请求URL
        
        RequestCallback requestCallback = restTemplate::getForEntity; // 创建请求回调对象
        ResponseExtractor<ResponseEntity<String>> responseExtractor = restTemplate::getForEntity; // 创建响应提取器对象
        
        ResponseEntity<String> response = restTemplate.execute(url, HttpMethod.GET, requestCallback, responseExtractor); // 发送请求并获取响应实体
        
        if (response.getStatusCode().is2xxSuccessful()) { // 判断响应状态码是否为2xx系列
            String result = response.getBody(); // 获取响应体内容
            System.out.println(result); // 输出响应结果
        } else {
            System.out.println("Request failed with status code: " + response.getStatusCodeValue()); // 输出请求失败的状态码
        }
    }
}
```
&emsp;&emsp;上述代码通过实现WebMvcConfigurer接口并重写addCorsMappings方法，可以配置CORS策略。在addCorsMappings方法中，使用RestTemplate的execute方法发送请求时，会自动应用CORS策略。需要注意的是，在使用RestTemplate时，需要引入相关的依赖包

## 方案四
<hr>

Java中，使用WebMvcConfigurer接口可以方便地解决Spring Security中的跨域问题

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 允许跨域访问的路径
                .allowedOrigins("*") // 允许跨域访问的源
                .allowedMethods("GET", "POST", "PUT", "DELETE") // 允许请求的方法
                .allowedHeaders("*") // 允许头部设置
                .allowCredentials(true) // 是否发送cookie
                .maxAge(3600); // 预检间隔时间
    }
}
```
&emsp;&emsp;上述代码中，通过实现WebMvcConfigurer接口并重写addCorsMappings方法，可以配置CORS策略。在addCorsMappings方法中，使用CorsRegistry对象的addMapping方法指定允许跨域访问的路径、源、请求方法、头部设置、是否发送cookie和预检间隔时间等参数。这样，在使用Spring Security进行安全认证时，就可以自动应用CORS策略，从而解决跨域问题。需要注意的是，在使用WebMvcConfigurer时，需要引入相关的依赖包

![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的支持就是我✍️创作的动力！					  💞💞💞





