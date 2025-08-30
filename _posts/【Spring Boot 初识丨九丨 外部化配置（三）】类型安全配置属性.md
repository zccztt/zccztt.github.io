> 上一篇讲了 Spring Boot 的外部化配置的加载顺序及一些简单的属性说明
> 本篇来讲一讲 外部化配置类型安全属性
> Spring Boot 初识：
> [【Spring Boot 初识丨一】入门实战](https://blog.csdn.net/wodejiaAA/article/details/131084712)
> [【Spring Boot 初识丨二】maven](https://blog.csdn.net/wodejiaAA/article/details/130887654)
> [【Spring Boot 初识丨三】starter](https://blog.csdn.net/wodejiaAA/article/details/131123497)
> [【Spring Boot 初识丨四】主应用类](https://blog.csdn.net/wodejiaAA/article/details/131139228)
> [【Spring Boot 初识丨五】beans ](https://blog.csdn.net/wodejiaAA/article/details/131164139)
> [【Spring Boot 初识丨六】依赖注入](https://blog.csdn.net/wodejiaAA/article/details/131188509)
> [【Spring Boot 初识丨七 丨 外部化配置（一）】属性详解](https://blog.csdn.net/wodejiaAA/article/details/131323662)
> [【Spring Boot 初识丨八 丨 外部化配置（二）】外部应用程序属性](https://blog.csdn.net/wodejiaAA/article/details/131168867)


@[TOC](类型安全配置属性)

![在这里插入图片描述](https://img-blog.csdnimg.cn/1efc2551b7534061a80d060e5b549c36.png)

# 类型安全配置属性
<hr>

&emsp;&emsp;使用@Value("${property}")注释来注入配置属性有时可能很麻烦，尤其是处理多个属性或您的数据本质上是层次结构的情况下。Spring Boot 提供了另一种使用属性的方法，让强类型 bean 管理和验证应用程序的配置。

## JavaBean 属性绑定
<hr>

```java
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("my.service")
public class MyProperties {

    private boolean enabled;

    private InetAddress remoteAddress;

    private final Security security = new Security();

    public boolean isEnabled() {
        return this.enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public InetAddress getRemoteAddress() {
        return this.remoteAddress;
    }

    public void setRemoteAddress(InetAddress remoteAddress) {
        this.remoteAddress = remoteAddress;
    }

    public Security getSecurity() {
        return this.security;
    }

    public static class Security {

        private String username;

        private String password;

        private List<String> roles = new ArrayList<>(Collections.singleton("USER"));

        public String getUsername() {
            return this.username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return this.password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public List<String> getRoles() {
            return this.roles;
        }

        public void setRoles(List<String> roles) {
            this.roles = roles;
        }

    }

}


```

POJO 定义了以下属性：

 - my.service.enabled，默认值为false。
 - my.service.remote-address，具有可以从 强制的类型String。
 - my.service.security.username，带有一个嵌套的“安全”对象，其名称由属性名称确定。特别是，该类型根本没有在那里使用，并且本来可以使用SecurityProperties。
 - my.service.security.password。
 - my.service.security.roles，其中的集合String默认为USER。


> **<font color='purple'>注意：</font>** 
> &emsp;&emsp;映射到 Spring Boot 中可用的@ConfigurationProperties类的属性（通过属性文件、YAML 文件、环境变量和其他机制进行配置）是公共API，但类本身的访问器（getter/setter）并不意味着可以直接使用。

你需要使用 @EnableConfigurationProperties 注解将属性类注入配置类中。
```java
@Configuration
@EnableConfigurationProperties(MyProperties.class)
public class MyConfiguration {
}

```

> **<font color='purple'>注意：
> </font>** &emsp;&emsp;这种安排依赖于默认的空构造函数，并且 getter 和 setter 通常是强制性的，因为绑定是通过标准 Java Beans 属性描述符进行的，就像在 Spring MVC中一样。在以下情况下可以省略 setter：
> 
>  - 映射，只要它们被初始化，就需要一个 getter，但不一定需要一个 setter，因为它们可以被绑定器改变。
>  - m可以通过索引（通常使用 YAML）或使用单个逗号分隔值（属性）来访问集合和数组。在后一种情况下，setter 是强制性的。我们建议始终为此类类型添加 setter。如果初始化集合，请确保它不是不可变的（如前面的示例所示）。
>  - 如果嵌套 POJO 属性已初始化（如前面示例中的Security字段），则不需要 setter。如果您希望绑定器使用默认构造函数动态创建实例，则需要一个setter。
> 
> &emsp;&emsp;有些人使用 Project Lombok 自动添加 getter 和 setter。确保 Lombok不会为此类类型生成任何特定的构造函数，因为容器会自动使用它来实例化对象。
> 
> &emsp;&emsp;最后，仅考虑标准 Java Bean 属性，并且不支持静态属性的绑定。

## 构造函数绑定
<hr>

上一节中的示例可以以不可变的方式重写，示例如下：

```java
import java.net.InetAddress;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties("my.service")
public class MyProperties {

    private final boolean enabled;

    private final InetAddress remoteAddress;

    private final Security security;

    public MyProperties(boolean enabled, InetAddress remoteAddress, Security security) {
        this.enabled = enabled;
        this.remoteAddress = remoteAddress;
        this.security = security;
    }

    public boolean isEnabled() {
        return this.enabled;
    }

    public InetAddress getRemoteAddress() {
        return this.remoteAddress;
    }

    public Security getSecurity() {
        return this.security;
    }

    public static class Security {

        private final String username;

        private final String password;

        private final List<String> roles;

        public Security(String username, String password, @DefaultValue("USER") List<String> roles) {
            this.username = username;
            this.password = password;
            this.roles = roles;
        }

        public String getUsername() {
            return this.username;
        }

        public String getPassword() {
            return this.password;
        }

        public List<String> getRoles() {
            return this.roles;
        }

    }

}

```

&emsp;&emsp;在此设置中，单个参数化构造函数的存在意味着应使用构造函数绑定。这意味着绑定器将找到一个带有您希望绑定的参数的构造函数。如果您的类有多个构造函数，则可以使用@ConstructorBinding注释来指定用于构造函数绑定的构造函数。要选择退出具有单个参数化构造函数的类的构造函数绑定，该构造函数必须使用@Autowired 进行注释。

&emsp;&emsp;构造函数绑定可以与记录一起使用。除非您的记录有多个构造函数，否则无需使用@ConstructorBinding。

&emsp;&emsp;构造函数绑定类的嵌套成员（例如上面的示例Security）也将通过其构造函数进行绑定。

&emsp;&emsp;可以使用@DefaultValue 在构造函数参数和记录组件指定默认值。转换服务将用于将注释的String值强制转换为缺失属性的目标类型。

&emsp;&emsp;参考前面的示例，如果没有属性绑定到Security，则MyProperties实例将包含null的值。要使其包含非空security实例，即使没有绑定任何属性（使用 Kotlin 时，这将要求Security 的username和password参数声明为可为空，因为它们没有默认值），请使用空的@DefaultValue注释：

```java
public MyProperties(boolean enabled, InetAddress remoteAddress, @DefaultValue Security security) {
    this.enabled = enabled;
    this.remoteAddress = remoteAddress;
    this.security = security;
}
```
> **<font color='purple'>注意：</font>** 
> &emsp;&emsp;要使用构造函数绑定，必须使用@EnableConfigurationProperties或配置属性扫描来启用类。您不能将构造函数绑定到由常规Spring 机制创建的 bean（例如@Componentbean、使用@Bean方法创建的 bean 或使用 @Import加载的bean ）。
> &emsp;&emsp; 要在本机映像中使用构造函数绑定，必须使用-parameters编译类。 如果您使用 Spring Boot 的Gradle 插件或者使用 Maven 和spring-boot-starter-parent，将会自动编译。
> &emsp;&emsp;在java，util 中不建议使用@ConfigurationProperties，因为它主要用作返回类型。因此，它不太适合配置属性注入。为了与其他类型的属性保持一致，如果声明了一个Optional属性并且它没有值，则将绑定null，而不是空的Optional。


## 松散的绑定规则
&emsp;&emsp;Spring Boot 使用一些宽松的规则将Environment属性绑定到bean，因此属性名称和 bean 属性名称@ConfigurationProperties之间不需要完全匹配。Environment此功能有用的常见示例包括用破折号分隔的环境属性（例如，context-path绑定到contextPath）和大写的环境属性（例如，PORT绑定到port）。
示例如下：

```java
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "my.main-project.person")
public class MyPersonProperties {

    private String firstName;

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

}

```
松散的绑定：

|Property| Note |
|--|--|
|my.main-project.person.first-name  | 建议使用在.properties 和 YAML 文件。- 分隔 |
|my.main-project.person.firstName|标准的驼峰大小写语法。|
|my.main-project.person.first_name|下划线_ 在.properties 和 YAML 文件 使用的另一种格式|
|my.main-project.person.first_name|大写格式， 推荐在使用环境系统变量时使用。|

每个属性源的松散绑定规则：
| Property Source |  Simple| List|
|--|--|--|
| Properties Files |  驼峰式大小写、烤肉串大小写或下划线表示法| 使用[ ] 或 逗号分隔值的标准列表语法|
|YAML Files  | 驼峰式大小写、烤肉串大小写或下划线表示法 |标准 YAML 列表语法或逗号分隔值|
|Environment Variables  |大写格式，下划线作为分隔符  |用下划线包围的数值|
|System properties  |  驼峰式大小写、烤肉串大小写或下划线表示法|使用[ ] 或 逗号 分隔值的标准列表语法|



## 属性转换
<hr>
&emsp;&emsp;Spring Boot 在绑定到@ConfigurationPropertiesbean 时尝试将外部应用程序属性强制转换为正确的类型。

&emsp;&emsp;如果需要类型转换，你可以提供一个 ConversionService bean (一个名叫 conversionService 的 bean) 或自定义属性配置 (一个 CustomEditorConfigurer bean) 或自定义的 Converters (带有@ConfigurationPropertiesBinding 注解修饰的 bean)。


> **<font color='purple'>注：</font>** 
> 由于此 bean 在应用程序生命周期的早期就被请求，因此请确保限制您ConversionService正在使用的依赖项。通常，您需要的任何依赖项在创建时可能不会完全初始化。如果配置键强制不需要ConversionService ，并且仅依赖于使用@ConfigurationPropertiesBinding限定的自定义转换器，您可能需要重命名您的自定义ConversionService 。
> 
![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的评价就是我✍️创作的动力！					  💞💞💞


参考资料
[Spring Boot 官方文档 features-external-config](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.external-config)
