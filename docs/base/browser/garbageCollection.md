---
sidebarDepth: 3
---

# 垃圾回收机制

## 判断对象是否存活的方法

### 1、引用计数法

每个对象上都有一个引用计数，对象每被引用一次，引用计数器就+1，对象引用被释放，引用计数器-1，直到对象的引用计数为0，对象就标识可以回收。但是这个算法有明显的缺陷，对于循环引用的情况下，**循环引用的对象就不会被回收**。

```js
public class ReferenceCountingGC{
  public Object instance = null;
  private static finalint _1MB = 1024 * 1024;
  privatebyte[] bigSize = newbyte[2 * _1MB];

  public static void testGC(){
    ReferenceCountingGC objA = new ReferenceCountingGC();
    ReferenceCountingGC objB = new ReferenceCountingGC();
    objA.instance = objB;
    objB.instance = objA;
    objA = null;
    objB = null;
    System.gc();
  }
}
//发生嵌套引用，但是在java中，objA和objB的内存可以被回收
```

### 2、可达性分析算法

基本思路是：通过一系列的称为“GC Roots”的对象作为起始点，从这些节点开始向下探索，搜索所走过的路径称为“引用链”，当一个对象到GC Roots没有任何引用链相连（用图论的话来说，就是从GC Roots到这个对象不可达）时，则证明此对象是不可用的。在Java语言中，可作为GC Roots的对象包括下面几种：

* （1）、虚拟机栈（栈帧中的本地变量表）中引用的对象；
* （2）、方法区中类静态属性引用的对象；
* （3）、方法区中常量引用的对象；
* （4）、本地方法栈中JNI（即一般说的Native方法）引用的对象。

![GC Roots的对象](/blog/images/base/gc1.jpeg)

## 引用类型

* （1）强引用

强引用就是指在程序代码之中普遍存在的，类似“Object obj = new Object()’'这类的引用，只要强引用存在，垃圾收集器永远不会回收掉被引用的对象。

* （2）软引用

需要用 `java.lang.ref.SoftReference` 类来实现，可以让对象豁免一些垃圾收集。

软引用用来描述一些还有用但并非必须的对象。对于软引用关联着的对象，在系统将要发生内存溢出异常之前，将会把这些对象列进回收范围之中进行第二次回收。如果这次还没有足够的内存，才会抛出内存溢出异常。

* （3）弱引用

弱引用需要用 `java.lang.ref.WeakReference` 类来实现，它比软引用的生存期更短。

弱引用也是用来描述非必须对象，但是它的强度比软引用更弱一些，被弱引用关联的对象只能生存到下一次垃圾收集发生之前。当垃圾收集器工作时，无论当前内存是否足够，都会回收掉只被弱引用关联的对象。

* （4）虚引用

虚引用需要 `java.lang.ref.PhantomReference` 来实现。

虚引用也称为幽灵引用或者幻影引用，它是最弱的一种引用关系。一个对象是否有虚引用的存在，完全不会对其生存时间构成影响，也无法通过虚引用来取得一个对象实例。为一个对象设置虚引用关联的唯一目的就是**能在这个对象被收集器回收时收到一个系统通知**。

## 对象是否一定要清除

假设在可达性分析算法中某个对象不可达，它也并非”非死不可”。如果这个对象覆盖了finalize（）方法且这个方法没有被JVM调用过，则JVM会执行finalize（）方法。这时你可以在这个方法中重新使某个引用指向该对象。当然，finalize()方法只能救它一次。

## 垃圾回收算法

### 1、标记-清除（Mark-Sweep）算法

最基础的垃圾回收算法，分为两个阶段，标记和清除。标记阶段标记出所有需要回收的对象，清除阶段回收被标记的对象所占用的空间。从图中我们就可以发现，该算法最大的问题是内存碎片化严重，后续可能发生大对象不能找到可利用空间的问题。

![GC Roots的对象](/blog/images/base/gc2.jpeg)

### 2、标记整理(Mark-Compact)算法

标记阶段和Mark-Sweep算法相同，标记后不是清理对象，而是将存活对象移向内存的一端。然后清除端边界外的对象。

![GC Roots的对象](/blog/images/base/gc3.jpeg)

### 3、复制（Coping）算法

为了解决标记清除（Mark-Sweep）算法内存碎片化的缺陷而被提出的算法。按内存容量将内存划分为等大小的两块。每次只使用其中一块，当这一块内存满后将尚存活的对象复制到另一块上去，把已使用的内存清掉，如图。这种算法虽然实现简单，内存效率高，不易产生碎片，但是最大的问题是可用内存被压缩到了原本的一半。且存活对象增多的话，Copying算法的效率会大大降低。

![GC Roots的对象](/blog/images/base/gc4.jpeg)

### 4、分代收集（Generational Collection）算法

分代收集法是目前大部分JVM所采用的方法，其核心思想是根据对象存活的不同生命周期将内存划分为不同的域，一般情况下将GC堆划分为老生代(Tenured/Old Generation)和新生代(YoungGeneration)。老生代的特点是每次垃圾回收时只有少量对象需要被回收，新生代的特点是每次垃圾回收时都有大量垃圾需要被回收，因此可以根据不同区域选择不同的算法。

目前大部分JVM的GC对于新生代都采取Copying算法，因为新生代中每次垃圾回收都要回收大部分对象，即要复制的操作比较少，但通常并不是按照1：1来划分新生代。一般将新生代划分为一块较大的Eden空间和两个较小的Survivor空间(From Space, To Space)，每次使用Eden空间和其中的一块Survivor空间，当进行回收时，将该两块空间中还存活的对象复制到另一块Survivor空间中。

![GC Roots的对象](/blog/images/base/gc5.jpeg)

而老生代因为每次只回收少量对象，因而采用Mark-Compact算法。

* Young区分为Eden区和两个Survivor区域，其中所有新创建的对象都在Eden区，当Eden区满后会触发minor GC将仍然存活的对象复制到其中一个Survivor区域中，另外一个Survivor区域中的存活对象也复制到这个Survivor区域中，保证始终有一个Survivor区域时空的。
* 当Eden区域满后会将对象存放到Survivor区域中，如果Survivor区域仍然存放不下这些对象，GC收集器会将这些对象直接存放到Old区域。如果在Survivor区域中的对象足够老，也直接存放到Old区域中。如果Old区域也满了，将会触发Full GC，回收整个堆内存。
* Perm区域存放的主要是类的Class对象，如果一个类被频繁地加载，也可能会导致Perm区满，Perm区的垃圾回收也是由Full GC触发的。
