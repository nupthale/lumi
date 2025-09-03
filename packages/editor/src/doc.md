1. 方向键定位问题：都是contentEditable没设置， 或者多设置造成的。
对于image、video、iframe这类没有contentDOM的， 统一设置
```javascript
schema: 
    content: '', // 不允许有内容
    selectable: true,

然后nodeView里设置：
   this.contentDOM = null;    
```

对于其他有内容的， 肯定是contentEditable设置不对造成的：
image、iframe、divider都无法键盘方向键选中了， 尤其是从上往下选都有问题， iframe没实现focus样式plugin， 整体排查一遍。感觉是image的size不是0， 而是有3个字符在里面; hightlight有问题。除了image-iframe外， 其他都是textBlock加了placeholder造成的， 通过设置切换placholder的contentEditable解决了。
  [x] Coder
  [x] Highlight
  [] collection
  [x] Quote
  [x] Table, table从下一个textBlock ArrowLeft也无法定位到最后一个cell， 问题也是contentEditable造成的， prosemirror定位必须明确contentEditalbe=true， table结构很复杂， 最外层的都没有设置contentEditalbe=false， 里面的textBlock——head， 也没设置contentEditable=true，造成的， 都加上就好了