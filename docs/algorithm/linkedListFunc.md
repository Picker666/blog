# 实现链表

主要思路就是要时刻清楚对应Node的next和prev的指向，并利用while循环去做对应的增删改查操作。

![链表实现逻辑](/blog/images/algorithm/linkedList1.webp)

```js
class Node {
  constructor(data) {
    this.data = data; // 节点数据
    this.next = null; // 指向下一个节点
    this.prev = null; // 指向前一个节点
  }
}

class LinkedList {
  constructor() {
    this.head = null; // 链表头
    this.tail = null; // 链表尾
  }

  // 在链表尾部添加新节点
  add(item) {
    let node = new Node(item);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
  }

  // 链表指定位置添加新节点
  addAt(index, item) {
    let current = this.head;
    let counter = 1;
    let node = new Node(item);

    if (index === 0) {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    } else {
      while (current) {
        current = current.next;
        if (counter === index) {
          node.prev = current.prev;
          current.prev.next = node;
          node.next = current;
          current.prev = node;
        }
        counter++;
      }
    }
  }

  remove(item) {
    let current = this.head;
    while (current) {
      if (current.data === item) {
        if (current == this.head && current == this.tail) {
          this.head = null;
          this.tail = null;
        } else if (current == this.head) {
          this.head = this.head.next;
          this.head.prev = null;
        } else if (current == this.tail) {
          this.tail = this.tail.prev;
          this.tail.next = null;
        } else {
          current.prev.next = current.next;
          current.next.prev = current.prev;
        }
      }
      current = current.next;
    }
  }

  removeAt(index) {
    let current = this.head;
    let counter = 1;

    if (index === 0) {
      this.head = this.head.next;
      this.head.prev = null;
    } else {
      while (current) {
        current = current.next;
        if (current == this.tail) {
          this.tail = this.tail.prev;
          this.tail.next = null;
        } else if (counter === index) {
          current.prev.next = current.next;
          current.next.prev = current.prev;
          break;
        }
        counter++;
      }
    }
  }

  reverse() {
    let current = this.head;
    let prev = null;
    while (current) {
      let next = current.next;
      current.next = prev;
      current.prev = next;
      prev = current;
      current = next;
    }

    this.tail = this.head;
    this.head = prev;
  }

  swap(index1, index2) {
    if (index1 > index2) {
      return this.swap(index2, index1);
    }

    let current = this.head;
    let counter = 0;
    let firstNode;

    while (current !== null) {
      if (counter === index1) {
        firstNode = current;
      } else if (counter === index2) {
        let temp = current.data;
        current.data = firstNode.data;
        firstNode.data = temp;
      }

      current = current.next;
      counter++;
    }
    return true;
  }

  traverse(fn) {
    let current = this.head;
    while (current !== null) {
      fn(current);
      current = current.next;
    }
    return true;
  }

  find(item) {
    let current = this.head;
    let counter = 0;
    while (current) {
      if (current.data == item) {
        return counter;
      }
      current = current.next;
      counter++;
    }
    return false;
  }

  isEmpty() {
    return this.length() < 1;
  }

  length() {
    let current = this.head;
    let counter = 0;
    while (current !== null) {
      counter++;
      current = current.next;
    }
    return counter;
  }
}
```
