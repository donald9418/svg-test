// =============================================================
// createWaitRing: 创建并显示一个等待圈
// 参数: ParentNode: 父节点 default=document
//       diameter: 直径 default=25
//       color: 颜色 default='white'
// 返回: {s: svg, pos: function(), free: function(), speed: function()}
// 方法: pos(x, y): 设置左上角位置，0,0=父节点左上角
//       free(): 关闭并释放
//       speed(sp): 旋转速度，sp为旋转一圈的时间，单位秒，越小速度越快  sp=0停止转动 default=2 

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

  var id = 0;
  while (true) {
    if (parentNode.find('svg#waitRing' + (++id)).length === 0) break;
  }
  id = 'waitRing' + id;  //生产唯一的id
  
  var svgNS = "http://www.w3.org/2000/svg";
  // parentNode.append('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>');
  var svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('id', id);
  id = '#' + id;
  parentNode.append(svg);
  svgNS = svg.namespaceURI;
  svg = parentNode.find('svg' + id)

  var w = Math.round(diameter / 4.1),
    h = Math.round(diameter / 2.5) / 10,
    barCount = 12;

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
      .attr('transform', 'rotate(ang, rad, rad) translate(0, rad)'.replace(/ang/g, n * (360 / barCount)).replace(/rad/g, diameter / 2))
      .attr('fill', color)
      .attr('fill-opacity', op);
  });
  $g.append(document.createElementNS(svgNS, 'animateTransform'));

  var _ring = {
    p: parentNode.get(0),
    n: id,
    r: diameter / 2,
  };

  _ring.pos = function(x, y) {
    var off = $(this.p).offset(), s = $(this.p).find(this.n).get(0);
    s.style.left = (off.left + x) + 'px';
    s.style.top = (off.top + y) + 'px';
  }

  _ring.speed = function(sp) {
    var a = $(this.p).find(this.n).find('animateTransform').get(0);
    a.setAttribute('attributeType', 'xml'); //$.attr()会把属性字母全改成小写
    $(a).attr({
      // attributeType: 'xml',
      // 'attributeName': "transform",
      type: 'rotate',
      from: '0 r r'.replace(/r/g, this.r),
      to: '360 r r'.replace(/r/g, this.r),
      begin: '0',
      dur: sp + 's',
      // 'repeatCount': 'indefinite',
      fill: 'freeze'
    });
    a.setAttribute('repeatCount', 'indefinite');
    a.setAttribute('attributeName', 'transform'); //最后一个设置该属性确保动画起作用
  }

  _ring.free = function() {
    var p = this.p, s = $(p).find(this.n).get(0);
    for (var x in this) delete this[x];
    p.removeChild(s);
  }

  _ring.pos(0, 0);
  _ring.speed(2);
  return _ring;
}