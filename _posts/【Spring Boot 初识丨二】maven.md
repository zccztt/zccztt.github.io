> 上一篇讲了使用spirngboot 自带的构建器构建项目
> 本篇来讲一讲如何从零开始构建一个`maven`项目
> Spring Boot 初识：
> [【Spring Boot 初识丨一】入门实战](https://blog.csdn.net/wodejiaAA/article/details/131084712?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨二】maven](https://blog.csdn.net/wodejiaAA/article/details/130887654?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨三】starter](https://blog.csdn.net/wodejiaAA/article/details/131123497?spm=1001.2014.3001.5501)
> [【Spring Boot 初识丨四】主应用类](https://blog.csdn.net/wodejiaAA/article/details/131139228)

前提：
jdk  推荐 java17及以上
maven 推荐 Maven 3.5+


 @[TOC](maven构建)


# 一、 安装maven
&emsp;&emsp;`Maven`的安装需要依赖`JDK`的安装，所以必须先安装完成`JDK`且配置好`JDK`环境变量后在进行`Maven`的安装。

## 1. <font color='red'>下载</font>
&emsp;&emsp;[官网下载：](https://maven.apache.org/download.cgi)
&emsp;&emsp;&emsp;&emsp;最新版：
![在这里插入图片描述](https://img-blog.csdnimg.cn/b4b3a37f5c2448dfb510e2ad7ada7557.png)
&emsp;&emsp;&emsp;&emsp;历史版本：
![在这里插入图片描述](https://img-blog.csdnimg.cn/d6ccc23970b94af0bf1e6b6083b4ce97.png)
点击上面的 ‘[Maven 3 archives](https://archive.apache.org/dist/maven/maven-3/)’在这个里边找自己需要的版本
![在这里插入图片描述](https://img-blog.csdnimg.cn/e5883515dfb24f08b2894a177b14a34d.png)
下载完了之后解压缩 然后将Maven的bin目录添加到环境变量中。
输入mvn -v命令，如果能够输出Maven的版本信息如下图，则说明安装成功。
![在这里插入图片描述](https://img-blog.csdnimg.cn/77575ae3b803497f81dcd295445b3f74.png)
## 2. <font color='green'>settings.xml</font>
&emsp;&emsp;安装完毕之后 配置settings.xml

 - 设置Maven本地仓库路径：在settings.xml文件中修改localRepository节点 如下图：
![在这里插入图片描述](https://img-blog.csdnimg.cn/6a99bb23e70f4fdfab41667346584338.png)
 - 添加国内镜像源：在settings.xml文件中修改mirrors节点 如下图：
![在这里插入图片描述](https://img-blog.csdnimg.cn/67edfdaf705142ff90aa1d98f80d93fd.png)
&emsp;&emsp;上文添加的是阿里云中央仓库的镜像 可以根据自己的需要自行加镜像


 - 修改Maven默认的JDK版本：在settings.xml文件中profiles节点之间添加jdk版本 如下图：
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/a8c64210f25848cfa91aa452fcf6b9f6.png)
<hr>


# 二、 构建maven项目

## 2.1 创建项目
&emsp;&emsp;上述的准备工作做完了之后开始创建 `maven` 项目 。
点击 ‘create new project’ 选择maven项目 然后一路next 起个项目名点击完成即可。
![在这里插入图片描述](https://img-blog.csdnimg.cn/b839c0d25224439b88ecc15f48a039e1.png)

## 2.2 配置maven
打开项目之后配置maven 
配置maven（File | Settings | Build, Execution, Deployment | Build Tools | Maven ）
配置 maven路径 使用的配置文件还有本地仓库的位置 这三项 如下图：
![在这里插入图片描述](https://img-blog.csdnimg.cn/c2109e3f4df944579c008e7986088051.png)
## 2.3 <font color='purple'> pom.xml </font>
在打开的项目下面创建一个简单的子目录结构 如下：

└── src
   &emsp;&emsp; └── main
      &emsp;&emsp;&emsp;&emsp;  └── java
       &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;     └── demo

在项目根目录下的pom.xml文件添加如下内容

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>org.example</groupId>
    <artifactId>mavenDemo</artifactId>
    <packaging>jar</packaging>
    <version>1.0-SNAPSHOT</version>
    <name>mavenDemo</name>
    <description>Maven Demo project for Spring Boot</description>
    <properties>
        <java.version>8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
        	<!--  SpringBoot 自带的打包插件-->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>

<!--  MAVEN 打包-->
<!--            <plugin>-->
<!--                <groupId>org.apache.maven.plugins</groupId>-->
<!--                <artifactId>maven-shade-plugin</artifactId>-->
<!--                <version>3.2.4</version>-->
<!--                <executions>-->
<!--                    <execution>-->
<!--                        <phase>package</phase>-->
<!--                        <goals>-->
<!--                            <goal>shade</goal>-->
<!--                        </goals>-->
<!--                        <configuration>-->
<!--                            <transformers>-->
<!--                                <transformer-->
<!--                                        implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">-->
<!--                                    <mainClass>hello.HelloWorld</mainClass>-->
<!--                                </transformer>-->
<!--                            </transformers>-->
<!--                        </configuration>-->
<!--                    </execution>-->
<!--                </executions>-->
<!--            </plugin>-->
    </build>

</project>

```
`modelVersion`：POM 模型版本（始终为 4.0.0）。

`groupId`： 项目所属的组或组织。通常表现为倒置域名。

`artifactId`： 项目名称（例如，其 JAR 或 WAR 文件的名称）。

`version` ： 正在构建的项目的版本。

`packaging` ： 项目应该如何打包。JAR 文件打包默认为“jar”。WAR文件打包使用“war”。       

`description` ：项目描述 可写可不写

`java.version` ： 项目的jdk版本

**SpringBoot  自带的打包插件**

```xml
<build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
```
**继承 Starter Parent POM**
将项目配置为继承自spring-boot-starter-parent，`parent`
```xml
<parent>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-parent</artifactId>
	<version>3.1.0-SNAPSHOT</version>
</parent>
```
**不从Parent  继承使用Spring Boot POM**
可以通过使用`import`范围依赖来保持依赖管理（但不是插件管理）的好处
```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <!-- Import dependency management from Spring Boot -->
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>3.1.0-SNAPSHOT</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

```
**自动重启**
重新编译应用程序时检测到更改 Spring Boot应用可以自动重启
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>

```


![在这里插入图片描述](https://img-blog.csdnimg.cn/2fcb2c13bb9a4ef69b9329beb7c9fab4.gif )

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的评价就是我✍️创作的动力！					  💞💞💞





