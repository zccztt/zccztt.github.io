> 上一篇讲了 Spring Boot 的主程序类
> 本篇来讲一讲 beans 
> Spring Boot 初识：
> [【Spring Boot 初识丨一】入门实战](https://blog.csdn.net/wodejiaAA/article/details/131084712?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨二】maven](https://blog.csdn.net/wodejiaAA/article/details/130887654?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨三】starter](https://blog.csdn.net/wodejiaAA/article/details/131123497?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨四】主应用类](https://blog.csdn.net/wodejiaAA/article/details/131139228)

@[TOC](beans)
# 一、 定义

> &emsp;&emsp;Spring beans是Spring框架中的核心概念之一，它们是Spring IoC容器中的实例对象。在Spring应用程序中，所有的组件都是通过Spring容器进行管理，而Spring容器就是通过创建和管理bean来实现的。
>&emsp;&emsp;Spring bean可以是一个普通的Java类，也可以是一个接口或抽象类的实现类。当一个Java类被标记为@Component、@Service、@Repository等注解时，它就会成为Spring bean,并被Spring容器管理。
>&emsp;&emsp;Spring容器会自动创建和管理bean的生命周期，包括实例化、属性注入、依赖注入、初始化和销毁等过程。开发者可以通过配置文件或注解的方式来定义bean的属性和依赖关系，从而实现代码的重用和解耦。
	
&emsp;&emsp;bean元素包含：

 - 包限定的类名：通常是被定义的 bean 的实际实现类。
 - Bean 行为配置元素，说明 bean 在容器中的行为方式（作用域、生命周期回调等）。
 - Bean 执行其工作所需的其他bean的引用。这些引用也称为 collaborators或 dependencies。
 - 在新创建的对象中设置的其他配置设置，例如，在管理连接池的 bean 中使用的连接数，或池的大小限制。
# 二、 命名
&emsp;&emsp;每个 bean 都有一个或多个标识符。这些标识符在承载 bean 的容器中必须是唯一的。一个 bean 通常只有一个标识符，但如果需要多个标识符，则多出的可以视为别名。
&emsp;&emsp;在基于 XML 的配置元数据中，您使用 `id` 和/或 `name`属性来指定 bean 标识符。该`id`属性允许您准确指定一个 ID。通常这些名称是字母数字（'myBean'、'fooService' 等），但也可以是特殊字符。如果要给bean引入其他别名，也可以在属性中指定`name`，用逗号（,）、分号（;）或空格分隔。作为历史记录，在 Spring 3.1 之前的版本中， id属性被键入为 xsd:ID，它限制了可能的字符。从 3.1 开始，现在是xsd:string. 请注意，bean id 的唯一性仍然由容器强制执行，但不再由 XML 解析器强制执行。
&emsp;&emsp;您不需要为 bean 提供名称或 ID。如果没有显式提供名称或 ID，容器会为该 bean 生成一个唯一的名称。但是，如果您想通过使用`ref`元素或Service Locator 查找通过名称引用该 bean，则必须提供一个名称。
**bean的命名约定：**
&emsp;&emsp;约定是在命名 bean 时使用标准 Java 约定作为实例字段名称。也就是说，bean 名称以小写字母开头，并从那时起采用驼峰式大小写。此类名称的示例为'accountManager', 'accountService', 'userDao', 'loginController' (不带引号) 等

&emsp;&emsp;始终如一地命名 bean 使您的配置更易于阅读和理解，并且如果您使用的是 Spring AOP，将通知应用于一组按名称相关的 bean 时会有很大帮助。
**在 bean 定义之外为 bean 添加别名**：
&emsp;&emsp;在基于 XML 的配置元数据中，您可以使用 <alias/>元素来完成此操作

# 三、 生命周期
&emsp;&emsp;Spring Bean的生命周期包括以下四个阶段：

 - 实例化阶段(Instantiation):Bean被创建并分配内存空间。
 - 属性赋值阶段(Populate):Bean的属性被设置，可以是使用setter方法或构造函数注入。
 - 初始化阶段(Initialization):Bean的初始化过程，可以在此处执行一些自定义的操作。
 - 销毁阶段(Destruction):Bean被销毁并释放内存空间。
## 3.1 实例化
&emsp;&emsp;bean 定义本质上是创建一个或多个对象的方法。当被请求时，容器查看命名 bean 的方法，并使用该 bean 定义封装的配置元数据来创建（或获取）实际对象。

&emsp;&emsp;如果使用基于 XML 的配置元数据，则可以在<bean/> 元素的 class 属性中指定要实例化的对象的类型（或类） 。该class 属性在内部是BeanDefinition实例上的class属性，通常是必需的。
您可以通过以下两种方式之一使用Class属性：
 - 通常，在容器本身通过反射调用其构造函数直接创建bean 的情况下指定要构造的bean 类，有点类似于使用new运算符的Java 代码。
 - 要指定包含将被调用来创建对象的工厂方法的实际类 ，在容器调用static的不太常见的情况下，类上创建 bean 的工厂 方法。从调用static工厂方法返回的对象类型可能是同一个类，也可能是另一个类。

Spring Bean的创建实例化方法：

 - 通过构造函数实例化：Spring容器通过Bean对应的类中默认的构造函数实例化Bean。
 - 通过静态工厂方法实例化：使用静态工厂方法来创建Bean对象，该方法返回一个Object类型的对象，可以是任何类型，包括Bean对象本身。
 - 通过实例工厂方法实例化：使用实例工厂方法来创建Bean对象，该方法返回一个Object类型的对象，可以是任何类型，包括Bean对象本身。

<font color='green'>**内部类名**</font>

&emsp;&emsp;如果要为 static嵌套类配置 bean 定义，则必须使用 内部类的二进制名称。
&emsp;&emsp;请注意在名称中使用$字符将内部类名称与外部类名称分开。

<hr>



## 3.2  属性赋值
&emsp;&emsp;基于构造函数的依赖注入 是通过容器调用带有多个参数的构造函数来实现的，每个参数代表一个依赖项。使用特定参数调用static的工厂方法来构造 bean 几乎是等价的。
&emsp;&emsp;基于 Setter 的依赖注入是通过容器在调用无参数构造函数或无参数static工厂方法实例化 bean 后调用 bean 上的 setter 方法来实现的。

<font color='red'>**依赖解析过程：**</font>

容器执行 bean 依赖解析如下：

 1. ApplicationContext使用描述所有 bean 的配置元数据创建和初始化。配置元数据可以通过 XML、Java 代码或注释指定。
 2. 对于每个 bean，其依赖关系以属性、构造函数参数或静态工厂方法（如果您使用的是静态工厂方法而不是普通构造函数）参数的形式表示。这些依赖项是在实际创建 bean 时提供给 bean 的 。
 3. 每个属性或构造函数参数都是要设置的值的实际定义，或者是对容器中另一个 bean 的引用。
 4. 每个属性或构造函数参数都是一个值，将其指定格式转换为该属性或构造函数参数的实际类型。默认情况下，Spring 可以将以字符串格式提供的值转换为所有内置类型，例如 int, long, String,boolean等。

&emsp;&emsp;Spring 容器在创建容器时验证每个 bean 的配置，包括当 bean 引用属性引用有效的bean 时的验证。但是，bean 属性本身在实际创建bean 时才会设置 。单例作用域并设置为预实例化的Bean(默认值)被创建。bean的作用域未定义时，bean 仅在被请求时创建。创建 bean 可能会导致创建 bean 图，因为创建并分配了 bean 的依赖项及其依赖项的依赖项（等等）。

## 3.3 初始化
&emsp;&emsp;InitializingBean 接口允许 bean 在容器设置了 bean 的所有必要属性后执行初始化工作。
&emsp;&emsp;建议不要使用 InitializingBean 接口，因为它会将代码不必要地耦合到 Spring。或者，使用 注释或指定 POJO 初始化方法。对于基于 XML 的配置元数据，您可以使用init-method属性来指定具有void无参数签名的方法的名称。
##  3.4 销毁
&emsp;&emsp;DisposableBean 接口允许 bean 在包含它的容器被销毁时获得回调。
&emsp;&emsp;建议不要使用 DisposableBean回调接口，因为它会将代码不必要地耦合到 Spring。或者，使用 注释或指定 bean 定义支持的通用方法。使用基于 XML 的配置元数据，您可以 使用destroy-method



&emsp;&emsp;当您编写不使用 Spring 特定接口 InitializingBean和 DisposableBean回调接口的初始化和销毁​​方法回调时，通常使用诸如init()、 initialize()、dispose()等的方法。理想情况下，此类生命周期回调方法的名称在整个项目中是标准化的，以便所有开发人员使用相同的方法名称并确保一致性。

&emsp;&emsp;您可以配置Spring 容器来查找命名初始化和销毁每个bean上的​​回调方法名称 。这意味着您作为应用程序开发人员可以编写应用程序类并使用名为init() 的初始化回调，而无需为每个 bean 定义配置init-method="init"属性。Spring IoC 容器在创建 bean 时调用该方法（并根据前面描述的标准生命周期回调契约）。此功能还为初始化和销毁​​方法回调强制执行一致的命名约定。

&emsp;&emsp;顶级<beans/>元素属性上的default-init-method属性的存在导致 Spring IoC 容器将在 bean 上调用的init方法识别为初始化方法回调。在创建和组装bean 时，如果bean 类有这样的方法，就会在适当的时候调用它。

&emsp;&emsp;通过使用顶级<beans/>元素上的default-destroy-method属性，您可以类似地（在 XML 中）配置销毁方法回调。

&emsp;&emsp;如果现有的 bean 类已经具有与约定不同的回调方法，您可以通过使用 <bean/ > 本身的init-method和destroy-method属性指定（即在 XML 中）方法名称来覆盖默认值。
# 四、 作用域
&emsp;&emsp;当您创建一个 bean 定义时，您创建了一个 方法，用于创建由该 bean 定义定义的类的实际实例。bean 定义是方法的想法很重要，因为这意味着，与类一样，您可以从单个方法创建许多对象实例。

&emsp;&emsp;您不仅可以控制要插入到从特定 bean 定义创建的对象中的各种依赖项和配置值，还可以控制从特定 bean 定义创建的对象的范围。这种方法强大而灵活，因为您可以通过配置选择您创建的对象的范围，而不必在 Java 类级别对象的范围。Bean 可以定义为部署在多个作用域的一个：开箱即用，Spring 框架支持五个作用域，其中三个只有在您使用 web-aware ApplicationContext 时才可用。
以下作用域是开箱即用的，也可以创建自定义作用域。
| bean 的作用域 | 描述 |
|--|--|
|singleton  |  （默认）将单个 bean 定义的范围限定为每个 Spring IoC 容器的单个对象实例。|
|prototype|将单个 bean 定义的范围限定为任意数量的对象实例。|
|request|将单个 bean 定义限定为单个 HTTP 请求的生命周期；也就是说，每个 HTTP 请求都有自己的 bean 实例，该实例是在单个 bean 定义的基础上创建的。仅在 web-aware Spring ApplicationContext的上下文中有效 。|
|session|将单个 bean 定义限定为 HTTP Session的生命周期。仅在 web-aware Spring ApplicationContext 的上下文中有效 |
|global session|将单个 bean 定义限定为全局 HTTP Session 的生命周期。通常仅在 portlet 上下文中使用时才有效。仅在 web-aware Spring ApplicationContext 的上下文中有效 。|


**自定义作用域：**
可以定义自己的作用域，甚至重新定义现有的作用域，尽管后者被认为是不好的做法，并且不能 覆盖内置singleton和 prototype的作用域。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的评价就是我✍️创作的动力！					  💞💞💞





