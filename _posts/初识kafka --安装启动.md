> 💬 初识<font color=#FF0000 >**kafka**</font>
> 👁️‍🗨️  kafka的安装及启动 

@[TOC](kafka)

> &emsp;&emsp;Kafka是一个开源的分布式消息队列系统，最初由LinkedIn公司开发。它可以用于构建高吞吐量、低延迟的数据管道，支持实时数据处理和流式计算。


> &emsp;&emsp;Kafka的核心概念是消息(Message)、主题(Topic)和分区(Partition)。消息是数据的基本单位，可以包含任何类型的数据。主题是消息的分类或分类器，将消息分配到不同的主题中以便进行处理。分区是主题的子集，每个分区都有自己的副本和控制器。当消息被写入Kafka时，它们首先被写入主分区，然后被复制到所有副本分区中。如果一个副本分区不可用，则其他副本分区会继续接收和处理该消息，从而保证数据的可靠性和可用性。

>Kafka具有以下特点：
>  1. 高吞吐量：Kafka可以处理数百万条消息每秒，支持大规模并发处理。
 > 2. 低延迟：Kafka使用异步IO模型，可以在毫秒级别内处理消息。
 > 3. 可扩展性：Kafka可以轻松地扩展到数千个节点，以应对不断增长的数据需求。
  >4. 可靠性：Kafka通过副本机制和控制器确保数据的可靠性和可用性。
  >5. 灵活性：Kafka支持多种数据格式和协议，可以与各种应用程序集成。

&emsp;&emsp;初步了解了kafka的基本概念之后我们来下载安装使用。
# 🥖1. 官网下载：🥖
&emsp;&emsp;[download](https://kafka.apache.org/downloads)
![在这里插入图片描述](https://img-blog.csdnimg.cn/e0c8e998000c4c4ab08397762fbcfbac.png)
根据官网提示 最好是下载<font color=#0000FF >scala 2.13</font>相关的版本
3.4.0是最新的稳定版本 可以看到新增了一些功能还有改进了一些功能 
新加的功能：
 - <font color=#008000 >禁用 JmxReporter 注册</font>
 - <font color=#008000 >允许广播结果记录</font>
 - <font color=#008000 >在消费者协议中添加“生成”字段</font>
 - <font color=#008000 >基于时间的集群元数据快照</font>

![在这里插入图片描述](https://img-blog.csdnimg.cn/80fd1d1627684148be4dadc3fb618c4c.png)
# 🍗2. 解压 🍗
&emsp;&emsp;工具解压 或者命令解压
命令解压参照下方命令：
![在这里插入图片描述](https://img-blog.csdnimg.cn/bb6a0d76050f4c40a380b99aad7b3433.png)
# 🍢3. 安装jdk🍢

> 根据提示 使用之前需要安装jdk8以上 如果没有安装的自己装一下即可 具体安装及配置网上很多这里就不详细写了

[jdk下载地址](https://www.oracle.com/java/technologies/downloads/)：[https://www.oracle.com/java/technologies/downloads/](jdk%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%EF%BC%9Ahttps://www.oracle.com/java/technologies/downloads/)

![在这里插入图片描述](https://img-blog.csdnimg.cn/d5844252955b4abb992e8453fe38946f.png)
# 🍬4. 配置kafka🍬
## 4.1  配置server.properties
![在这里插入图片描述](https://img-blog.csdnimg.cn/a7d1d22ca47248868d853338c781f596.png)
进入到config文件夹里面，找到server.properties文件，进行编辑，找到log.dirs，修改这个参数的路径为：
<font color=#FF0000 >log.dirs=(安装目录\kafka-logs)</font>
## 4.2 配置zookeeper.properties
进入到config文件夹里面，找到zookeeper.properties文件，进行编辑，找到dataDir，修改这个参数的路径为：
<font color=#FF0000 >dataDir=(安装目录\zookeeper-data)</font>
配置完毕，kafka安装完成。
# 💤5. 启动kafka💤
![在这里插入图片描述](https://img-blog.csdnimg.cn/449875bba6b74386897bb31f9c629112.png)
windows kafka启动命令
（1）：
打开cmd，进入kafka安装目录，执行：
<font color=#FF0000 >.\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties</font>

（2）：
再打开一个cmd，进入kafka安装目录，执行：
<font color=#FF0000 >.\bin\windows\kafka-server-start.bat .\config\server.properties</font>









