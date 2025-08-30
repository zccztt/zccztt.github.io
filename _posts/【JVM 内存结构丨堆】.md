
@[TOC](堆)

![在这里插入图片描述](https://img-blog.csdnimg.cn/89ced3c241be4df8abd9581a5b6566ae.gif)

> <font face= '楷体' size='4'>主页传送门：📀 [传送](https://blog.csdn.net/wodejiaAA?type=blog) </font>
# 定义
---

&emsp;&emsp;JVM（Java Virtual Machine）堆是Java应用程序运行时内存管理的重要组成部分之一。堆内存用于存储Java对象实例，这些对象在运行时被动态分配和管理。

&emsp;&emsp;一个 JVM 实例只存在一个堆内存，堆内存的大小是可调节的。它取决于应用程序的需求和JVM的配置。


# 内存分配
---

 1. 新生代（Young Generation）：新生代是JVM堆的一小部分，通常占整个堆的1/10到1/4。它主要用于存储新创建的对象。新生代又可以分为Eden区和两个Survivor区（S0和S1）。大多数对象都在Eden区中创建，当Eden区满时，会触发Minor GC，将还存活的对象移动到Survivor区。
 2. 老年代（Old Generation）：老年代是JVM堆的另一部分，用于存储长时间存活的对象。当Eden区或Survivor区中的对象经过一定次数的GC后仍然存活，或者大对象直接在老年代中创建，就会触发Major GC。
 3. 永久代（PermGen）或元空间（Metaspace）：jdk7之前有永久代，DK 8之后这个部分被元空间替代。永久代用于存储JVM字节码和类的元数据。元空间则是将这部分内存抽象出来，让JVM在堆外进行分配，以减轻堆内存的压力。
 4. 方法区（Method Area）：方法区是用来存储已被加载的类信息、常量、静态变量以及即时编译器编译后的代码等数据。方法区的内存回收目标主要针对常量池的回收和对类型的卸载。

==图解如下：==
![在这里插入图片描述](https://img-blog.csdnimg.cn/2bdc6cd361844d4dae235e936e13a06e.png)
## 特点:
---

 - 线程共享，整个 Java 虚拟机只有一个堆，所有的线程都访问同一个堆。（程序计数器、Java 虚拟机栈、本地方法栈都是一个线程对应一个。）
 - 在虚拟机启动时创建。（当运行Java应用程序时，JVM会启动，并在内存中分配一块区域来作为堆内存。这个过程发生在JVM启动的早期阶段，通常在执行java命令启动Java程序的时候。且一旦堆内存被创建，它就会在整个Java应用程序的生命周期中存在，直到应用程序结束或JVM关闭。）
 - 是垃圾回收的主要场所。（JVM的垃圾回收器定期扫描堆中的对象，找到不再被引用的对象，并释放它们的内存。）

### 分代结构

 - 堆可分为新生代（Eden 区：From Survior，To Survivor）、老年代。
 - 新生代用于存储新创建的对象，而老年代用于存储存活时间较长的对象。
 - Java 虚拟机规范规定，堆可以处于物理上不连续的内存空间中，但在逻辑上它应该被视为连续的。
 - 关于 Survivor s0，s1 区: 复制之后有交换，谁空谁是 to。

 - 老年代比新生代生命周期长。
 - 新生代与老年代空间默认比例 1:2：JVM 调参数，XX:NewRatio=2，表示新生代占 1，老年代占 2，新生代占整个堆的 1/3。
 - Eden 空间和另外两个 Survivor 空间缺省所占的比例是：8:1:1。
 - 几乎所有的 Java 对象都是在 Eden 区被 new 出来的，Eden 放不了的大对象，就直接进入老年代了。

### 对象分配过程
---

 - new 的对象先放在 Eden 区，大小有限制
 - 如果创建新对象时，Eden 空间填满了，就会触发 Minor GC，将 Eden 不再被其他对象引用的对象进行销毁，再加载新的对象放到 Eden 区，特别注意的是 Survivor 区满了是不会触发 Minor GC 的，而是 Eden 空间填满了，Minor GC 才顺便清理 Survivor 区
 - 将 Eden 中剩余的对象移到 Survivor0 区
 - 再次触发垃圾回收，此时上次 Survivor 下来的，放在 Survivor0 区的，如果没有回收，就会放到 Survivor1 区
 - 再次经历垃圾回收，又会将幸存者重新放回 Survivor0 区，依次类推
 - 默认是 15 次的循环，超过 15 次，则会将幸存者区幸存下来的转去老年区 jvm 参数设置次数 : -XX:MaxTenuringThreshold=N 进行设置
 - 频繁在新生区收集，很少在养老区收集，几乎不在永久区/元空间搜集

### Full GC /Major GC 触发条件
---

 - 显示调用System.gc()，老年代的空间不够，方法区的空间不够等都会触发 Full GC，同时对新生代和老年代回收，FUll GC 的 STW 的时间最长，应该要避免
 - 在出现 Major GC 之前，会先触发 Minor GC，如果老年代的空间还是不够就会触发 Major GC，STW 的时间长于 Minor GC

### 引用方式
---

**==四种引用方式==**

 - 强引用：创建一个对象并把这个对象赋给一个引用变量，普通 new 出来对象的变量引用都是强引用，有引用变量指向时永远不会被垃圾回收，jvm 即使抛出 OOM，可以将引用赋值为 null，那么它所指向的对象就会被垃圾回收。
 - 软引用：如果一个对象具有软引用，内存空间足够，垃圾回收器就不会回收它，如果内存空间不足了，就会回收这些对象的内存。只要垃圾回收器没有回收它，该对象就可以被程序使用。
 - 弱引用：非必需对象，当 JVM 进行垃圾回收时，无论内存是否充足，都会回收被弱引用关联的对象。
 - 虚引用：虚引用并不会决定对象的生命周期，如果一个对象仅持有虚引用，那么它就和没有任何引用一样，在任何时候都可能被垃圾回收器回收。

### 堆参数
----
|参数|说明  |示例|
|--|--|--|
|-Xms|设置初始堆大小。|-Xms256m表示初始堆大小为256MB。默认值通常是较小的值，例如32MB。|
| -Xmx |  设置最大堆大小。|-Xmx1024m表示最大堆大小为1GB。根据应用程序的需求，可以调整这个值。一般此值建议与-Xmx相同，避免每次垃圾回收完成后JVM重新分配内存|
|-Xmn|设置新生代的大小。（新生代是堆的一部分，用于存储新创建的对象。）|-Xmn256m表示新生代大小为256MB。|
|-XX:MaxPermSize|（在Java 7之前）指定永久代（Permanent Generation）的最大大小。永久代用于存储类的元数据信息等。|-XX:MaxPermSize=128m表示永久代最大为128MB。|
|-XX:MaxMetaspaceSize|（Java 8及以后）指定元空间（Metaspace）的最大大小。元空间取代了永久代，用于存储类的元数据信息。|-XX:MaxMetaspaceSize=256m表示元空间最大为256MB。|
|-XX:PermSize|（在Java 7之前）指定永久代的初始大小。|-XX:PermSize=64m表示永久代的初始大小为64MB。|
|-XX:MetaspaceSize|（Java 8及以后）指定元空间的初始大小。|-XX:MetaspaceSize=128m表示元空间的初始大小为128MB。|
|-XX:NewRatio=<ratio>|设置新生代和老年代的大小比例。|-XX:NewRatio=2表示新生代大小为老年代大小的1/3。|
|-XX:SurvivorRatio=<ratio>|设置新生代中Eden区和Survivor区的大小比例。|-XX:SurvivorRatio=8表示Eden区大小是Survivor区大小的8倍。|
|-XX:+UseSerialGC|使用串行垃圾回收器|适用于单线程应用程序。|
|-XX:+UseParallelGC|使用并行垃圾回收器。|适用于多核处理器的应用程序。|
|-XX:+UseConcMarkSweepGC|使用CMS（Concurrent Mark-Sweep）垃圾回收器。|适用于需要降低垃圾回收停顿时间的应用程序。|

### 堆内存实例

```java
public class HeapMemoryExample {
    public static void main(String[] args) {
        // 创建一个数组对象并分配到堆内存中
        int[] numbers = new int[1000];
        
        // 堆内存中的对象可以动态修改
        for (int i = 0; i < numbers.length; i++) {
            numbers[i] = i * 2;
        }
        
        // 创建一个字符串对象并分配到堆内存中
        String greeting = "Hello, World!";
        
        // 堆内存中的对象可以通过引用来访问
        System.out.println(greeting);
        
        // 创建自定义对象并分配到堆内存中
        Person person1 = new Person("Alice", 25);
        Person person2 = new Person("Bob", 30);
        
        // 堆内存中的对象可以相互引用
        person1.setFriend(person2);
        person2.setFriend(person1);
    }
}

class Person {
    private String name;
    private int age;
    private Person friend;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void setFriend(Person friend) {
        this.friend = friend;
    }
}

```
&emsp;&emsp;上面的示例中创建了一个整数数组、一个字符串和自定义的Person对象，并将它们分配到堆内存中。堆内存中的对象可以通过引用来访问，可以进行动态修改和相互引用。这些对象的内存管理由JVM的垃圾回收器负责，不需要手动释放内存。


![在这里插入图片描述](https://img-blog.csdnimg.cn/903b5590b4264d469a50a9b7a967f471.gif)

>  		如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的支持就是我✍️创作的动力！					  💞💞💞








