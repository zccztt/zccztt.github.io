
@[TOC](数据绑定)

# 概述
<hr>

&emsp;&emsp; **Spring 数据绑定(Data Binding)的作用是将用户的输入动态绑定到应用程序的领域模型JavaBean(或用于处理用户输入的任何对象)。** 也就是说，Spring数据绑定机制是将属性值设置到目标对象中。如下图所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/a1918d31ef554970ad8bc6c0e5345ac2.png)


&emsp;&emsp;Spring 提供了DataBinder来做到这一点。此外，BeanWrapper 也具有类似的功能，DataBinder和较低级别的BeanWrapper都使用PropertyEditorSupport 来实现解析和格式化属性值。

![在这里插入图片描述](https://img-blog.csdnimg.cn/59ed8659f3f946cc9e5762fea7a862f4.png)
但DataBinder是 在org.springframework.validation 内的，因此它也支持验证功能。

# Databinder
<hr>

在 Spring 中，DataBinder 类是数据绑定功能的基类。他的直接子类是WebDataBinder（主要用于 Spring Web 数据的绑定），此外，还有一些 WebDataBinder 的扩展子类，如下图所示：
![在这里插入图片描述](https://img-blog.csdnimg.cn/735d6599397445b0bf79adc7d65d998d.png)
## 核心属性
<HR>

|  属性|说明  |
|--|--|
| target | 要绑定的目标对象（或者null 如果绑定器仅用于转换普通参数值） |
|objectName|目标对象的名称|
|bindingResult|属性绑定结果（绑定结果的通用接口。扩展了 Errors错误注册功能的接口，允许Validator应用，并添加了特定于绑定的分析和模型构建。）|
|typeConverter|类型转换器（定义类型转换方法的接口。通常（但不一定）与PropertyEditorRegistry接口结合实现 - 线程不安全）|
|conversionService|类型转换服务（用于类型转换的服务接口。这是转换系统的入口点。调用convert(Object, Class)以使用该系统执行线程安全类型转换）|
|messageCodesResolver|消息代码解析器（用于从验证错误代码构建消息代码的策略接口。由 DataBinder 用于构建 ObjectErrors 和 FieldErrors 的代码列表。生成的消息代码对应于 MessageSourceResolvable 的代码（由 ObjectError 和 FieldError 实现）。）|
|validators|验证器（特定于应用程序的对象的验证器。该界面完全脱离任何基础设施或上下文；也就是说，它不与仅验证 Web 层、数据访问层或其他层中的对象相关。因此，它适合在应用程序的任何层中使用，并支持将验证逻辑封装为一等公民。）|

## 绑定参数
<hr>

|参数名称  |说明  |
|--|--|
| allowedFields | 注册应允许绑定的字段模式 （白名单）|
|disallowedFields|注册不允许绑定的字段模式（黑名单）|
|ignoreInvalidFields|是否忽略无效字段，即是否忽略目标对象中具有不可访问的对应字段（例如由于嵌套路径中为空值）的绑定参数。默认值：false|
|ignoreUnknownFields|是否忽略未知字段，即是否忽略目标对象中没有对应字段的绑定参数。默认值：true|
|autoGrowNestedPaths|是否自动增加嵌套路径，默认值：true|
|requiredFields|绑定必须字段|
|autoGrowCollectionLimit|指定数组和集合自动增长的限制。|

## 绑定元数据
<hr>

|特征|  说明|
|--|--|
| 数据来源 |BeanDefinition，主要来源 XML 资源配置 BeanDefinition  |
|数据结构  | 由一个或多个 PropertyValue 组成 |
| 成员结构 | 	PropertyValue 包含属性名称，以及属性值（包括原始值、类型转换后的值） |
| 常见实现 |  MutablePropertyValues|
|  Web 扩展实现| ServletConfigPropertyValues、ServletRequestParameterPropertyValues |
| 相关生命周期 |  InstantiationAwareBeanPostProcessor#postProcessProperties|

## 绑定验证
<hr>

DataBinder 与 BeanWrapper(BeanWrapper通常不由应用程序代码直接使用，而是由DataBinder和BeanFactory使用。)

 - bind 方法生成 BeanPropertyBindingResult
 - BeanPropertyBindingResult 关联 BeanWrapper
![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的评价就是我✍️创作的动力！					  💞💞💞




参考：
[Spring  文档 -数据绑定](https://docs.spring.io/spring-framework/reference/core/validation.html)
[Spring  - 数据绑定](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/validation/DataBinder.html)
