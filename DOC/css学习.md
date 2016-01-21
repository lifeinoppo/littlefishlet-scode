

当然，首先从一个CSS开始：

这是一个钟表的CSS描述：

.second .hand:before {
  content: '';
  display: inline-block;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  top: 0;
  width: 8px;
  height: 0px;
  background-color: #f16b41;
  -webkit-border-radius: 8px;
  -webkit-background-clip: padding-box;
  -moz-border-radius: 8px;
  -moz-background-clip: padding;
  border-radius: 8px;
  background-clip: padding-box;
  -webkit-transform-origin: center 180px;
  -moz-transform-origin: center 180px;
  -o-transform-origin: center 180px;
  -ms-transform-origin: center 180px;
  transform-origin: center 180px;
  -webkit-animation: second-grow 1.6s cubic-bezier(1, 0, 0, 1) 1.45s 1 forwards, second 60s normal infinite steps(60, end) 3s;
  -moz-animation: second-grow 1.6s cubic-bezier(1, 0, 0, 1) 1.45s 1 forwards, second 60s normal infinite steps(60, end) 3s;
  -o-animation: second-grow 1.6s cubic-bezier(1, 0, 0, 1) 1.45s 1 forwards, second 60s normal infinite steps(60, end) 3s;
  animation: second-grow 1.6s cubic-bezier(1, 0, 0, 1) 1.45s 1 forwards, second 60s normal infinite steps(60, end) 3s;
}

看看其中的一些属性的意义：
	
	