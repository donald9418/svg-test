// =============================================================
// createWaitRing: 创建并显示一个等待圈
// 参数: ParentNode: 父节点 default=document
//       diameter: 直径 default=25
//       color: 颜色 default='white'
// 返回: {g: svg.g, angle: 0, frozen: false, pos: function(), free: function()}
// 方法: pos(x, y): 设置左上角位置，0,0=父节点左上角
//       free(): 关闭并释放
// 属性：frozen：暂停旋转 true/false

function createWaitRing(parentNode, diameter, color) {
  try {
    (jQuery);
  } catch (err) {
    alert('please load jquery first!');
    return;
  }

  parentNode = $(parentNode);
  if (!parentNode || !(parentNode.get(0)) || !(parentNode.get(0).parentNode) || parentNode.length < 1)
    parentNode = $(document.documentElement);
  parentNode = $(parentNode.get(0));
  (!diameter || diameter <= 0) && (diameter = 25);
  (!color) && (color = 'white');

  var svgNS = "http://www.w3.org/2000/svg";
  parentNode.append(document.createElementNS(svgNS, 'svg'));
  // parentNode.append('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>');
  var svg = parentNode.find('svg').get(-1);
  svgNS = svg.namespaceURI;
  svg = $(svg);

  var w = Math.round(diameter / 3.7),
    h = Math.round(diameter / 2.5) / 10,
    barCount = 12,
    center = diameter / 2 + ',' + diameter / 2; //center for rotate

  svg.css('position', 'absolute').attr('width', diameter).attr('height', diameter);
  svg.append(document.createElementNS(svgNS, 'g'));
  var $g = svg.find('g');
  for (var i = 0; i < barCount; i++)
    $g.append(document.createElementNS(svgNS, 'polygon'));
  $g.find('polygon').each(function(n, element) {
    var op = 0.25;
    if (n <= 5) {
      if (n === 0 || n === 5) op = 0.55;
      else
      if (n === 1 || n === 4) op = 0.75;
      else op = 0.95
    }
    $(this)
      .attr('points', '0,0 hh,h w,h whh,0 w,-h hh,-h 0,0'.replace(/whh/g, w + h + h).replace(/hh/g, h + h).replace(/h/g, h).replace(/w/g, w))
      .attr('transform', 'rotate(ang, ctr) translate(0, rad)'.replace(/ang/, n * (360 / barCount)).replace(/ctr/, center).replace(/rad/, diameter / 2))
      .attr('fill', color)
      .attr('fill-opacity', op);
  });

  var _ring = {
    g: $g.get(0),
    ct: center,
    angle: 0,
    frozen: false
  };

  _ring.timerId = setInterval(function() {
    if (this.frozen) return;
    this.angle += 5;
    if (this.angle >= 360) this.angle = 0;
    this.g.setAttribute('transform', 'rotate(ang, ctr)'.replace(/ang/, this.angle).replace(/ctr/, this.ct));
  }.bind(_ring), 25);

  _ring.pos = function(x, y) {
    var off = $(this.g.parentNode.parentNode).offset();
    $(this.g.parentNode).css('left', (off.left + x) + 'px').css('top', (off.top + y) + 'px');

    // this.container.setAttribute('width', x + this.r);
    // this.container.setAttribute('height', y + this.r);
    // this.ct = ',' + (diameter / 2 + x) + ',' + (diameter / 2 + y);
    // if (x === 0 && y === 0)
    // 	this.pos = '';
    // else
    // 	this.pos = ' translate(' + x + ',' + y + ')';
    // this.g.setAttribute('transform', 'rotate(' + this.angle + this.ct + ')' + this.pos);
  }
  _ring.pos(0, 0);

  _ring.free = function() {
    clearInterval(this.timerId);
    var p = this.g.parentNode;
    p.parentNode.removeChild(p);
    for (var x in this) delete this[x];
  }

  return _ring;
}