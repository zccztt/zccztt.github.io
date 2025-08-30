> 上一篇讲了 Spring Boot 的beans
> 本篇来讲一讲 依赖注入
> 在学习本篇前需要对依赖注入有一定得理解
> 不了解的可以看[<font color='red'>【Spring 核心 | Ioc】</font>](https://blog.csdn.net/wodejiaAA/article/details/131211355?spm=1001.2014.3001.5501)
> Spring Boot 初识：
> [【Spring Boot 初识丨一】入门实战](https://blog.csdn.net/wodejiaAA/article/details/131084712?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨二】maven](https://blog.csdn.net/wodejiaAA/article/details/130887654?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨三】starter](https://blog.csdn.net/wodejiaAA/article/details/131123497?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨四】主应用类](https://blog.csdn.net/wodejiaAA/article/details/131139228)
> [【Spring Boot 初识丨五】beans ](https://blog.csdn.net/wodejiaAA/article/details/131164139)

@[TOC](依赖注入)
# 一、 定义
	
> &emsp;&emsp;Spring Boot 依赖注入(Dependency Injection,DI)是 Spring
> 框架提供的一种解耦方式，它允许将对象之间的依赖关系通过外部配置文件或注解进行管理，从而实现松散耦合。

# 二、 实现

## 2.1 @Autowired
&emsp;&emsp;@Autowired 注解：这是 Spring 框架中最常用的依赖注入方式。通过在需要注入的字段或方法上添加 @Autowired 注解，Spring Boot 会自动将对应的 bean 注入到该字段或方法中。

示例：

```java

@Service

public class UserServiceImpl implements UserService {

    @Autowired

    private UserRepository userRepository;



    // ...其他代码

}


```
<hr>

[`Autowired `](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/beans/factory/annotation/Autowired.html)

![在这里插入图片描述](https://img-blog.csdnimg.cn/733e4a0d0b744df5871766e1a4ac4235.png)
&emsp;&emsp;将构造函数、字段、setter 方法或配置方法标记为由 Spring 的依赖注入工具自动装配。 这是 JSR-330 Inject注释的替代方法，添加了必需与可选的语义。

**自动装配构造函数**
&emsp;&emsp;任何给定 bean 类的只有一个构造函数可以声明此注释并将属性 required()设置为true，指示构造函数在用作 Spring bean 时自动装配。此外，如果该required 属性设置为true，则只能使用 @Autowired。
&emsp;&emsp;注释一个构造函数如果多个非必需构造函数声明注解，它们将被视为自动装配的候选者。将选择 Spring 容器中匹配 beans 可以满足的依赖项数量最多的构造函数。如果没有一个候选者可以满足，那么将使用主/默认构造函数（如果存在）。
&emsp;&emsp;同样，如果一个类声明了多个构造函数，但没有一个被注释为 @Autowired，然后将使用主/默认构造函数（如果存在）。如果一个类一开始只声明了一个构造函数，那么它将始终被使用，即使没有注释。带注释的构造函数不必是公共的。

**自动装配字段**
&emsp;&emsp;在构造 bean 之后，在调用任何配置方法之前，立即注入字段。这样的配置字段不必是公开的。

**自动装配方法**
&emsp;&emsp;配置方法可以有任意名称和任意数量的参数；这些参数中的每一个都将与 Spring 容器中的匹配 bean 自动装配。
&emsp;&emsp;Bean 属性设置方法实际上只是这种通用配置方法的特例。这样的配置方法不必是公开的。

**自动装配数组、集合和映射**
&emsp;&emsp;在数组、Collection或Map 依赖类型的情况下，容器会自动装配与声明的值类型匹配的所有 beans。为此，必须将映射键声明为String 将解析为相应 bean 名称的类型。
&emsp;&emsp;这样一个容器提供的集合将被排序，考虑到 目标组件的值，否则遵循它们在容器中的注册顺序Ordered。@Order或者，单个匹配的目标 bean 也可以是一般类型的 Collection或Map本身，这样被注入。

**不支持BeanPostProcessor或BeanFactoryPostProcessor**
&emsp;&emsp;请注意，实际注入是通过 一个 BeanPostProcessor执行的 ，这反过来意味着您不能 将@Autowired用于引用注入 BeanPostProcessor或 BeanFactoryPostProcessor 类型。


<font color='blue'>**可选元素：**</font>
| 修饰符和类型 | 可选元素 |说明|
|--|--|--|
| boolean | required |声明是否需要带注释的依赖项。|


<hr>

## 2.2 @Resource 

&emsp;&emsp;@Resource 注解：与 @Autowired 类似，@Resource 也是用于依赖注入的注解。但是，@Resource 只能用于非静态字段和方法的注入，而不能用于静态字段和方法的注入。

示例：

```java

@Service

public class UserServiceImpl implements UserService {

    @Resource

    private UserRepository userRepository;



    // ...其他代码

}

```

[`Resource `](https://docs.oracle.com/javaee/6/api/javax/annotation/Resource.html)
![在这里插入图片描述](https://img-blog.csdnimg.cn/0b2e000121a7453a964d6bd7f9a6c80b.png)

&emsp;&emsp;@Resource默认按照ByName自动注入，由J2EE提供，需要导入包javax.annotation.Resource。
&emsp;&emsp;@Resource有两个重要的属性：name和type，而Spring将@Resource注解的name属性解析为bean的名字，而type属性则解析为bean的类型。
&emsp;&emsp;所以，如果使用name属性，则使用byName的自动注入策略，而使用type属性时则使用byType自动注入策略。
&emsp;&emsp;如果既不制定name也不制定type属性，这时将通过反射机制使用byName自动注入策略。


## 2.3 @Inject

&emsp;&emsp;@Inject 注解：这是 JavaEE 标准的依赖注入注解，也可以在 Spring Boot 中使用。与 @Autowired 和 @Resource 不同，@Inject 可以用于所有类型的字段和方法的注入。

示例：

```java

@Service

public class UserServiceImpl implements UserService {

    @Inject

    private UserRepository userRepository;



    // ...其他代码

}


```
[`Inject`](https://docs.oracle.com/javaee/6/api/javax/inject/Inject.html)
![在这里插入图片描述](https://img-blog.csdnimg.cn/8547d9bcae754d1bbcadbf9940dd2f9f.png)
&emsp;&emsp;标识可注入的构造函数、方法和字段。可以应用于静态成员和实例成员。可注入成员可以具有任何访问修饰符（private、package-private、protected、public）。首先注入构造函数，然后是字段，最后是方法。超类中的字段和方法在子类中的字段和方法之前注入。未指定字段之间和同一类中的方法之间的注入顺序。
&emsp;&emsp;可注入的构造函数使用@Inject注释，并接受零个或多个依赖项作为参数。@Injec最多可以应用于t每个类的一个构造函数。
@Inject对于没有其他构造函数存在时的公共的无参数构造函数是可选的。这使注入器能够调用默认构造函数。

<font color='gray'>可注入字段：</font>

 - 都是用 @Inject注释。
 - 不是最终的决定。
 - 可以有任何其他有效的名称。


<font color='gray'>注入方法：</font>

 - 用 @Inject注释。
 - 不是抽象的。
 - 不声明自己的类型参数。
 - 可能会返回一个结果
 - 可以有任何其他有效的名称。
 - 接受零个或多个依赖项作为参数。


<hr>

## 2.4 @ComponentScan
&emsp;&emsp;@ComponentScan:是 Spring Boot 提供的一种自动扫描组件的方式。通过在启动类上添加 @ComponentScan 注解，Spring Boot 会自动扫描指定包及其子包下的所有组件，并将其注册为 bean。

示例：

```java

@SpringBootApplication

@ComponentScan("com.example")

public class Application {

    public static void main(String[] args) {

        SpringApplication.run(Application.class, args);

    }

}

```

不了解`ComponentScan` 的可以看[【Spring Boot 初识丨四】主应用类](https://blog.csdn.net/wodejiaAA/article/details/131139228)

	


![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的评价就是我✍️创作的动力！					  💞💞💞





