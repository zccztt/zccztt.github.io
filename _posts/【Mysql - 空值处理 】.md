> MySQL中，空值通常用于表示缺失或未定义的值。处理空值的关键在于理解空值与其他值之间的关系，以及如何使用不同的SQL函数来处理和转换空值。

@[TOC](空值处理)

![在这里插入图片描述](https://img-blog.csdnimg.cn/9c698924656b477b98f498b2efb5a3d2.gif)

> <font face= '楷体' size='4'>主页传送门：📀 [传送](https://blog.csdn.net/wodejiaAA?type=blog) </font>


# 🍑 NULL Values (空值)
<hr>

> MySQL使用 SQL SELECT 命令及 WHERE 子句来读取数据表中的数据,但是当提供的查询条件字段为 NULL 时，该命令可能就无法正常工作。


## 🍏 定义
<hr>

&emsp;&emsp;`NULL` 用于表示缺失的值。数据表中的 `NULL`值表示该值所处的字段为空。

&emsp;&emsp;具有`NULL`值的字段是没有值的字段。

&emsp;&emsp;如果表中的字段是可选的，则可以插入新记录或更新记录而不向该字段添加值。然后，该字段将被保存为`NULL`值。

&emsp;&emsp;值为 `NULL`的字段没有值。尤其要明白的是，`NULL`值与 0 或者包含空白（spaces）的字段是不同的。

> 🔔<font color='green'  face='楷体' >注意：</font>
>  <font color='gray'  face='楷体' >理解`NULL`值与零值或包含空格的字段不同是非常重要的。具有NULL值的字段是在记录创建期间留空的字段！</font>

## 🍏 测试
<hr>

&emsp;&emsp;使用比较运算符（例如=，<或<>）来测试NULL值是不可行的。

&emsp;&emsp;关于 NULL 的条件比较运算是比较特殊的。你不能使用 = NULL 或 != NULL 在列中查找 NULL 值 

&emsp;&emsp;在MySQL中，NULL值与任何其它值的比较（即使是NULL）永远返回false，即 NULL = NULL 返回false 。因此需要使用`IS NULL`和`IS NOT NULL`运算符。

<font color ='green'>**`IS NULL` 语法**</font>

```java
SELECT column_names
FROM table_name
WHERE column_name IS NULL;
```

<font color ='green'>**`IS NOT NULL` 语法**</font>

```java
SELECT column_names
FROM table_name
WHERE column_name IS NOT NULL;
```
<font color ='green'>**`NOT NULL` 约束**</font>

> 在默认的情况下，表的列接受 NULL 值。
> 
> 　NOT NULL 约束强制列不接受 NULL 值。
> 
> 　NOT NULL 约束强制字段始终包含值。这意味着，如果不向字段添加值，就无法插入新记录或者更新记录。


&emsp;&emsp;`
# 🍑 IFNULL
<hr>

## 🍏 定义
<hr>

&emsp;&emsp;`IFNULL() `函数是 MySQL 数据库中的一个条件函数，用于检查一个表达式的值是否为 NULL。如果该值为 NULL，则返回指定的替代值；否则返回该表达式的值。

**语法如下：**

```java
IFNULL(expression,替代值) // expression 是要检查是否为 NULL 的表达式，替代值 是如果 expression 的值为 NULL 时要返回的值。
```
**示例**：

```java
SELECT IFNULL(salary, 0) FROM employees;
```
&emsp;&emsp;上文示例中从 employees 表中选择 salary 列，并使用`IFNULL() `函数将 NULL 值替换为 0。这意味着如果 salary 列中的某个值为 NULL，则该值将被替换为 0。

# 🍑 COALESCE
<hr>

## 定义
<hr>

&emsp;&emsp;`COALESCE`函数是一个条件函数，用于返回参数列表中的第一个非空值的表达式。如果存在一个非空值，则返回该值；否则返回一个空值。 函数将第一个非空值（即 'xxx'）作为结果返回，因为它是参数列表中的第一个非空值。如果所有参数都是空值，则返回一个空值。


**语法如下：**

```java
SELECT COALESCE(column1, column2, column3)。
```

**示例**：

```java
SELECT COALESCE(NULL, 'apple', 'banana', 'cherry') as result;

SELECT COALESCE(NULL, 'default_value') FROM my_table;
```
&emsp;&emsp;上文示例中，如果my_table表中的某一列的值为NULL，那么该行将返回'default_value'。



## 🍏  <font color ='red'>对比：</font>

| COALESCE | IFNULL |
|--|--|
|参数可以为多个|参数只能有俩个|
|效率稍低|效率高于COALESCE |
|需要检查多个表达式是否为NULL，且对效率要求不高，可以选择使用COALESCE函数。|只需要检查两个表达式是否为NULL，且对效率有一定要求，可以选择使用IFNULL函数|



![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的支持就是我✍️创作的动力！					  💞💞💞






