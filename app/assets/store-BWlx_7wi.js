import{A as Ee,f as Me,g as Se,e as Te}from"./navgrid-BNcFehwK.js";class At{worker;nextId=1;pending=new Map;busy=!1;constructor(){this.worker=new Worker(new URL("/namma-space-pages/app/assets/detector.worker-BR3V1VUB.js",import.meta.url),{type:"module"}),this.worker.onmessage=e=>{this.busy=!1,e.data.error&&console.warn("[detector]",e.data.error),this.pending.get(e.data.id)?.(e.data),this.pending.delete(e.data.id)}}detect(e,n,r,i,s=!1){if(this.busy)return null;this.busy=!0;const a=this.nextId++;return new Promise(o=>{this.pending.set(a,o),this.worker.postMessage({id:a,width:n,height:r,data:e,mode:i,sharpness:s},[e])})}dispose(){this.worker.terminate()}}const ke=`/*
Copyright (c) 2011 Juan Mellado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
References:
- "OpenCV: Open Computer Vision Library"
  http://sourceforge.net/projects/opencvlibrary/
- "Stack Blur: Fast But Goodlooking"
  http://incubator.quasimondo.com/processing/fast_blur_deluxe.php
*/

var CV = CV || {};
this.CV = CV;

CV.Image = function(width, height, data){
  this.width = width || 0;
  this.height = height || 0;
  this.data = data || [];
};

CV.grayscale = function(imageSrc, imageDst){
  var src = imageSrc.data, dst = imageDst.data, len = src.length,
      i = 0, j = 0;

  for (; i < len; i += 4){
    dst[j ++] =
      (src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114 + 0.5) & 0xff;
  }

  imageDst.width = imageSrc.width;
  imageDst.height = imageSrc.height;

  return imageDst;
};

CV.threshold = function(imageSrc, imageDst, threshold){
  var src = imageSrc.data, dst = imageDst.data,
      len = src.length, tab = [], i;

  for (i = 0; i < 256; ++ i){
    tab[i] = i <= threshold? 0: 255;
  }

  for (i = 0; i < len; ++ i){
    dst[i] = tab[ src[i] ];
  }

  imageDst.width = imageSrc.width;
  imageDst.height = imageSrc.height;

  return imageDst;
};

CV.adaptiveThreshold = function(imageSrc, imageDst, kernelSize, threshold){
  var src = imageSrc.data, dst = imageDst.data, len = src.length, tab = [], i;

  CV.stackBoxBlur(imageSrc, imageDst, kernelSize);

  for (i = 0; i < 768; ++ i){
    tab[i] = (i - 255 <= -threshold)? 255: 0;
  }

  for (i = 0; i < len; ++ i){
    dst[i] = tab[ src[i] - dst[i] + 255 ];
  }

  imageDst.width = imageSrc.width;
  imageDst.height = imageSrc.height;

  return imageDst;
};

CV.otsu = function(imageSrc){
  var src = imageSrc.data, len = src.length, hist = [],
      threshold = 0, sum = 0, sumB = 0, wB = 0, wF = 0, max = 0,
      mu, between, i;

  for (i = 0; i < 256; ++ i){
    hist[i] = 0;
  }

  for (i = 0; i < len; ++ i){
    hist[ src[i] ] ++;
  }

  for (i = 0; i < 256; ++ i){
    sum += hist[i] * i;
  }

  for (i = 0; i < 256; ++ i){
    wB += hist[i];
    if (0 !== wB){

      wF = len - wB;
      if (0 === wF){
        break;
      }

      sumB += hist[i] * i;

      mu = (sumB / wB) - ( (sum - sumB) / wF );

      between = wB * wF * mu * mu;

      if (between > max){
        max = between;
        threshold = i;
      }
    }
  }

  return threshold;
};

CV.stackBoxBlurMult =
  [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265];

CV.stackBoxBlurShift =
  [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13];

CV.BlurStack = function(){
  this.color = 0;
  this.next = null;
};

CV.stackBoxBlur = function(imageSrc, imageDst, kernelSize){
  var src = imageSrc.data, dst = imageDst.data,
      height = imageSrc.height, width = imageSrc.width,
      heightMinus1 = height - 1, widthMinus1 = width - 1,
      size = kernelSize + kernelSize + 1, radius = kernelSize + 1,
      mult = CV.stackBoxBlurMult[kernelSize],
      shift = CV.stackBoxBlurShift[kernelSize],
      stack, stackStart, color, sum, pos, start, p, x, y, i;

  stack = stackStart = new CV.BlurStack();
  for (i = 1; i < size; ++ i){
    stack = stack.next = new CV.BlurStack();
  }
  stack.next = stackStart;

  pos = 0;

  for (y = 0; y < height; ++ y){
    start = pos;

    color = src[pos];
    sum = radius * color;

    stack = stackStart;
    for (i = 0; i < radius; ++ i){
      stack.color = color;
      stack = stack.next;
    }
    for (i = 1; i < radius; ++ i){
      stack.color = src[pos + i];
      sum += stack.color;
      stack = stack.next;
    }

    stack = stackStart;
    for (x = 0; x < width; ++ x){
      dst[pos ++] = (sum * mult) >>> shift;

      p = x + radius;
      p = start + (p < widthMinus1? p: widthMinus1);
      sum -= stack.color - src[p];

      stack.color = src[p];
      stack = stack.next;
    }
  }

  for (x = 0; x < width; ++ x){
    pos = x;
    start = pos + width;

    color = dst[pos];
    sum = radius * color;

    stack = stackStart;
    for (i = 0; i < radius; ++ i){
      stack.color = color;
      stack = stack.next;
    }
    for (i = 1; i < radius; ++ i){
      stack.color = dst[start];
      sum += stack.color;
      stack = stack.next;

      start += width;
    }

    stack = stackStart;
    for (y = 0; y < height; ++ y){
      dst[pos] = (sum * mult) >>> shift;

      p = y + radius;
      p = x + ( (p < heightMinus1? p: heightMinus1) * width );
      sum -= stack.color - dst[p];

      stack.color = dst[p];
      stack = stack.next;

      pos += width;
    }
  }

  return imageDst;
};

CV.gaussianBlur = function(imageSrc, imageDst, imageMean, kernelSize){
  var kernel = CV.gaussianKernel(kernelSize);

  imageDst.width = imageSrc.width;
  imageDst.height = imageSrc.height;

  imageMean.width = imageSrc.width;
  imageMean.height = imageSrc.height;

  CV.gaussianBlurFilter(imageSrc, imageMean, kernel, true);
  CV.gaussianBlurFilter(imageMean, imageDst, kernel, false);

  return imageDst;
};

CV.gaussianBlurFilter = function(imageSrc, imageDst, kernel, horizontal){
  var src = imageSrc.data, dst = imageDst.data,
      height = imageSrc.height, width = imageSrc.width,
      pos = 0, limit = kernel.length >> 1,
      cur, value, i, j, k;

  for (i = 0; i < height; ++ i){

    for (j = 0; j < width; ++ j){
      value = 0.0;

      for (k = -limit; k <= limit; ++ k){

        if (horizontal){
          cur = pos + k;
          if (j + k < 0){
            cur = pos;
          }
          else if (j + k >= width){
            cur = pos;
          }
        }else{
          cur = pos + (k * width);
          if (i + k < 0){
            cur = pos;
          }
          else if (i + k >= height){
            cur = pos;
          }
        }

        value += kernel[limit + k] * src[cur];
      }

      dst[pos ++] = horizontal? value: (value + 0.5) & 0xff;
    }
  }

  return imageDst;
};

CV.gaussianKernel = function(kernelSize){
  var tab =
    [ [1],
      [0.25, 0.5, 0.25],
      [0.0625, 0.25, 0.375, 0.25, 0.0625],
      [0.03125, 0.109375, 0.21875, 0.28125, 0.21875, 0.109375, 0.03125] ],
    kernel = [], center, sigma, scale2X, sum, x, i;

  if ( (kernelSize <= 7) && (kernelSize % 2 === 1) ){
    kernel = tab[kernelSize >> 1];
  }else{
    center = (kernelSize - 1.0) * 0.5;
    sigma = 0.8 + (0.3 * (center - 1.0) );
    scale2X = -0.5 / (sigma * sigma);
    sum = 0.0;
    for (i = 0; i < kernelSize; ++ i){
      x = i - center;
      sum += kernel[i] = Math.exp(scale2X * x * x);
    }
    sum = 1 / sum;
    for (i = 0; i < kernelSize; ++ i){
      kernel[i] *= sum;
    }
  }

  return kernel;
};

CV.findContours = function(imageSrc, binary){
  var width = imageSrc.width, height = imageSrc.height, contours = [],
      src, deltas, pos, pix, nbd, outer, hole, i, j;

  src = CV.binaryBorder(imageSrc, binary);

  deltas = CV.neighborhoodDeltas(width + 2);

  pos = width + 3;
  nbd = 1;

  for (i = 0; i < height; ++ i, pos += 2){

    for (j = 0; j < width; ++ j, ++ pos){
      pix = src[pos];

      if (0 !== pix){
        outer = hole = false;

        if (1 === pix && 0 === src[pos - 1]){
          outer = true;
        }
        else if (pix >= 1 && 0 === src[pos + 1]){
          hole = true;
        }

        if (outer || hole){
          ++ nbd;

          contours.push( CV.borderFollowing(src, pos, nbd, {x: j, y: i}, hole, deltas) );
        }
      }
    }
  }

  return contours;
};

CV.borderFollowing = function(src, pos, nbd, point, hole, deltas){
  var contour = [], pos1, pos3, pos4, s, s_end, s_prev;

  contour.hole = hole;

  s = s_end = hole? 0: 4;
  do{
    s = (s - 1) & 7;
    pos1 = pos + deltas[s];
    if (src[pos1] !== 0){
      break;
    }
  }while(s !== s_end);

  if (s === s_end){
    src[pos] = -nbd;
    contour.push( {x: point.x, y: point.y} );

  }else{
    pos3 = pos;
    s_prev = s ^ 4;

    while(true){
      s_end = s;

      do{
        pos4 = pos3 + deltas[++ s];
      }while(src[pos4] === 0);

      s &= 7;

      if ( ( (s - 1) >>> 0) < (s_end >>> 0) ){
        src[pos3] = -nbd;
      }
      else if (src[pos3] === 1){
        src[pos3] = nbd;
      }

      contour.push( {x: point.x, y: point.y} );

      s_prev = s;

      point.x += CV.neighborhood[s][0];
      point.y += CV.neighborhood[s][1];

      if ( (pos4 === pos) && (pos3 === pos1) ){
        break;
      }

      pos3 = pos4;
      s = (s + 4) & 7;
    }
  }

  return contour;
};

CV.neighborhood =
  [ [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1] ];

CV.neighborhoodDeltas = function(width){
  var deltas = [], len = CV.neighborhood.length, i = 0;

  for (; i < len; ++ i){
    deltas[i] = CV.neighborhood[i][0] + (CV.neighborhood[i][1] * width);
  }

  return deltas.concat(deltas);
};

CV.approxPolyDP = function(contour, epsilon){
  var slice = {start_index: 0, end_index: 0},
      right_slice = {start_index: 0, end_index: 0},
      poly = [], stack = [], len = contour.length,
      pt, start_pt, end_pt, dist, max_dist, le_eps,
      dx, dy, i, j, k;

  epsilon *= epsilon;

  k = 0;

  for (i = 0; i < 3; ++ i){
    max_dist = 0;

    k = (k + right_slice.start_index) % len;
    start_pt = contour[k];
    if (++ k === len) {k = 0;}

    for (j = 1; j < len; ++ j){
      pt = contour[k];
      if (++ k === len) {k = 0;}

      dx = pt.x - start_pt.x;
      dy = pt.y - start_pt.y;
      dist = dx * dx + dy * dy;

      if (dist > max_dist){
        max_dist = dist;
        right_slice.start_index = j;
      }
    }
  }

  if (max_dist <= epsilon){
    poly.push( {x: start_pt.x, y: start_pt.y} );

  }else{
    slice.start_index = k;
    slice.end_index = (right_slice.start_index += slice.start_index);

    right_slice.start_index -= right_slice.start_index >= len? len: 0;
    right_slice.end_index = slice.start_index;
    if (right_slice.end_index < right_slice.start_index){
      right_slice.end_index += len;
    }

    stack.push( {start_index: right_slice.start_index, end_index: right_slice.end_index} );
    stack.push( {start_index: slice.start_index, end_index: slice.end_index} );
  }

  while(stack.length !== 0){
    slice = stack.pop();

    end_pt = contour[slice.end_index % len];
    start_pt = contour[k = slice.start_index % len];
    if (++ k === len) {k = 0;}

    if (slice.end_index <= slice.start_index + 1){
      le_eps = true;

    }else{
      max_dist = 0;

      dx = end_pt.x - start_pt.x;
      dy = end_pt.y - start_pt.y;

      for (i = slice.start_index + 1; i < slice.end_index; ++ i){
        pt = contour[k];
        if (++ k === len) {k = 0;}

        dist = Math.abs( (pt.y - start_pt.y) * dx - (pt.x - start_pt.x) * dy);

        if (dist > max_dist){
          max_dist = dist;
          right_slice.start_index = i;
        }
      }

      le_eps = max_dist * max_dist <= epsilon * (dx * dx + dy * dy);
    }

    if (le_eps){
      poly.push( {x: start_pt.x, y: start_pt.y} );

    }else{
      right_slice.end_index = slice.end_index;
      slice.end_index = right_slice.start_index;

      stack.push( {start_index: right_slice.start_index, end_index: right_slice.end_index} );
      stack.push( {start_index: slice.start_index, end_index: slice.end_index} );
    }
  }

  return poly;
};

CV.warp = function(imageSrc, imageDst, contour, warpSize){
  var src = imageSrc.data, dst = imageDst.data,
      width = imageSrc.width, height = imageSrc.height,
      pos = 0,
      sx1, sx2, dx1, dx2, sy1, sy2, dy1, dy2, p1, p2, p3, p4,
      m, r, s, t, u, v, w, x, y, i, j;

  m = CV.getPerspectiveTransform(contour, warpSize - 1);

  r = m[8];
  s = m[2];
  t = m[5];

  for (i = 0; i < warpSize; ++ i){
    r += m[7];
    s += m[1];
    t += m[4];

    u = r;
    v = s;
    w = t;

    for (j = 0; j < warpSize; ++ j){
      u += m[6];
      v += m[0];
      w += m[3];

      x = v / u;
      y = w / u;

      sx1 = x >>> 0;
      sx2 = (sx1 === width - 1)? sx1: sx1 + 1;
      dx1 = x - sx1;
      dx2 = 1.0 - dx1;

      sy1 = y >>> 0;
      sy2 = (sy1 === height - 1)? sy1: sy1 + 1;
      dy1 = y - sy1;
      dy2 = 1.0 - dy1;

      p1 = p2 = sy1 * width;
      p3 = p4 = sy2 * width;

      dst[pos ++] =
        (dy2 * (dx2 * src[p1 + sx1] + dx1 * src[p2 + sx2]) +
         dy1 * (dx2 * src[p3 + sx1] + dx1 * src[p4 + sx2]) ) & 0xff;

    }
  }

  imageDst.width = warpSize;
  imageDst.height = warpSize;

  return imageDst;
};

CV.getPerspectiveTransform = function(src, size){
  var rq = CV.square2quad(src);

  rq[0] /= size;
  rq[1] /= size;
  rq[3] /= size;
  rq[4] /= size;
  rq[6] /= size;
  rq[7] /= size;

  return rq;
};

CV.square2quad = function(src){
  var sq = [], px, py, dx1, dx2, dy1, dy2, den;

  px = src[0].x - src[1].x + src[2].x - src[3].x;
  py = src[0].y - src[1].y + src[2].y - src[3].y;

  if (0 === px && 0 === py){
    sq[0] = src[1].x - src[0].x;
    sq[1] = src[2].x - src[1].x;
    sq[2] = src[0].x;
    sq[3] = src[1].y - src[0].y;
    sq[4] = src[2].y - src[1].y;
    sq[5] = src[0].y;
    sq[6] = 0;
    sq[7] = 0;
    sq[8] = 1;

  }else{
    dx1 = src[1].x - src[2].x;
    dx2 = src[3].x - src[2].x;
    dy1 = src[1].y - src[2].y;
    dy2 = src[3].y - src[2].y;
    den = dx1 * dy2 - dx2 * dy1;

    sq[6] = (px * dy2 - dx2 * py) / den;
    sq[7] = (dx1 * py - px * dy1) / den;
    sq[8] = 1;
    sq[0] = src[1].x - src[0].x + sq[6] * src[1].x;
    sq[1] = src[3].x - src[0].x + sq[7] * src[3].x;
    sq[2] = src[0].x;
    sq[3] = src[1].y - src[0].y + sq[6] * src[1].y;
    sq[4] = src[3].y - src[0].y + sq[7] * src[3].y;
    sq[5] = src[0].y;
  }

  return sq;
};

CV.isContourConvex = function(contour){
  var orientation = 0, convex = true,
      len = contour.length, i = 0, j = 0,
      cur_pt, prev_pt, dxdy0, dydx0, dx0, dy0, dx, dy;

  prev_pt = contour[len - 1];
  cur_pt = contour[0];

  dx0 = cur_pt.x - prev_pt.x;
  dy0 = cur_pt.y - prev_pt.y;

  for (; i < len; ++ i){
    if (++ j === len) {j = 0;}

    prev_pt = cur_pt;
    cur_pt = contour[j];

    dx = cur_pt.x - prev_pt.x;
    dy = cur_pt.y - prev_pt.y;
    dxdy0 = dx * dy0;
    dydx0 = dy * dx0;

    orientation |= dydx0 > dxdy0? 1: (dydx0 < dxdy0? 2: 3);

    if (3 === orientation){
        convex = false;
        break;
    }

    dx0 = dx;
    dy0 = dy;
  }

  return convex;
};

CV.perimeter = function(poly){
  var len = poly.length, i = 0, j = len - 1,
      p = 0.0, dx, dy;

  for (; i < len; j = i ++){
    dx = poly[i].x - poly[j].x;
    dy = poly[i].y - poly[j].y;

    p += Math.sqrt(dx * dx + dy * dy) ;
  }

  return p;
};

CV.minEdgeLength = function(poly){
  var len = poly.length, i = 0, j = len - 1,
      min = Infinity, d, dx, dy;

  for (; i < len; j = i ++){
    dx = poly[i].x - poly[j].x;
    dy = poly[i].y - poly[j].y;

    d = dx * dx + dy * dy;

    if (d < min){
      min = d;
    }
  }

  return Math.sqrt(min);
};

CV.countNonZero = function(imageSrc, square){
  var src = imageSrc.data, height = square.height, width = square.width,
      pos = square.x + (square.y * imageSrc.width),
      span = imageSrc.width - width,
      nz = 0, i, j;

  for (i = 0; i < height; ++ i){

    for (j = 0; j < width; ++ j){

      if ( 0 !== src[pos ++] ){
        ++ nz;
      }
    }

    pos += span;
  }

  return nz;
};

CV.binaryBorder = function(imageSrc, dst){
  var src = imageSrc.data, height = imageSrc.height, width = imageSrc.width,
      posSrc = 0, posDst = 0, i, j;

  for (j = -2; j < width; ++ j){
    dst[posDst ++] = 0;
  }

  for (i = 0; i < height; ++ i){
    dst[posDst ++] = 0;

    for (j = 0; j < width; ++ j){
      dst[posDst ++] = (0 === src[posSrc ++]? 0: 1);
    }

    dst[posDst ++] = 0;
  }

  for (j = -2; j < width; ++ j){
    dst[posDst ++] = 0;
  }

  return dst;
};
`,Fe=`/*
Copyright (c) 2020 Damiano Falcioni
Copyright (c) 2011 Juan Mellado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
References:
- "ArUco: a minimal library for Augmented Reality applications based on OpenCv"
  http://www.uco.es/investiga/grupos/ava/node/26
- "js-aruco: a port to JavaScript of the ArUco library"
  https://github.com/jcmellado/js-aruco
*/

var AR = {};
var CV = this.CV || require('./cv').CV;
this.AR = AR;

AR.DICTIONARIES = {
  ARUCO: {
    nBits: 25,
    tau: 3,
    codeList: [0x1084210,0x1084217,0x1084209,0x108420e,0x10842f0,0x10842f7,0x10842e9,0x10842ee,0x1084130,0x1084137,0x1084129,0x108412e,0x10841d0,0x10841d7,0x10841c9,0x10841ce,0x1085e10,0x1085e17,0x1085e09,0x1085e0e,0x1085ef0,0x1085ef7,0x1085ee9,0x1085eee,0x1085d30,0x1085d37,0x1085d29,0x1085d2e,0x1085dd0,0x1085dd7,0x1085dc9,0x1085dce,0x1082610,0x1082617,0x1082609,0x108260e,0x10826f0,0x10826f7,0x10826e9,0x10826ee,0x1082530,0x1082537,0x1082529,0x108252e,0x10825d0,0x10825d7,0x10825c9,0x10825ce,0x1083a10,0x1083a17,0x1083a09,0x1083a0e,0x1083af0,0x1083af7,0x1083ae9,0x1083aee,0x1083930,0x1083937,0x1083929,0x108392e,0x10839d0,0x10839d7,0x10839c9,0x10839ce,0x10bc210,0x10bc217,0x10bc209,0x10bc20e,0x10bc2f0,0x10bc2f7,0x10bc2e9,0x10bc2ee,0x10bc130,0x10bc137,0x10bc129,0x10bc12e,0x10bc1d0,0x10bc1d7,0x10bc1c9,0x10bc1ce,0x10bde10,0x10bde17,0x10bde09,0x10bde0e,0x10bdef0,0x10bdef7,0x10bdee9,0x10bdeee,0x10bdd30,0x10bdd37,0x10bdd29,0x10bdd2e,0x10bddd0,0x10bddd7,0x10bddc9,0x10bddce,0x10ba610,0x10ba617,0x10ba609,0x10ba60e,0x10ba6f0,0x10ba6f7,0x10ba6e9,0x10ba6ee,0x10ba530,0x10ba537,0x10ba529,0x10ba52e,0x10ba5d0,0x10ba5d7,0x10ba5c9,0x10ba5ce,0x10bba10,0x10bba17,0x10bba09,0x10bba0e,0x10bbaf0,0x10bbaf7,0x10bbae9,0x10bbaee,0x10bb930,0x10bb937,0x10bb929,0x10bb92e,0x10bb9d0,0x10bb9d7,0x10bb9c9,0x10bb9ce,0x104c210,0x104c217,0x104c209,0x104c20e,0x104c2f0,0x104c2f7,0x104c2e9,0x104c2ee,0x104c130,0x104c137,0x104c129,0x104c12e,0x104c1d0,0x104c1d7,0x104c1c9,0x104c1ce,0x104de10,0x104de17,0x104de09,0x104de0e,0x104def0,0x104def7,0x104dee9,0x104deee,0x104dd30,0x104dd37,0x104dd29,0x104dd2e,0x104ddd0,0x104ddd7,0x104ddc9,0x104ddce,0x104a610,0x104a617,0x104a609,0x104a60e,0x104a6f0,0x104a6f7,0x104a6e9,0x104a6ee,0x104a530,0x104a537,0x104a529,0x104a52e,0x104a5d0,0x104a5d7,0x104a5c9,0x104a5ce,0x104ba10,0x104ba17,0x104ba09,0x104ba0e,0x104baf0,0x104baf7,0x104bae9,0x104baee,0x104b930,0x104b937,0x104b929,0x104b92e,0x104b9d0,0x104b9d7,0x104b9c9,0x104b9ce,0x1074210,0x1074217,0x1074209,0x107420e,0x10742f0,0x10742f7,0x10742e9,0x10742ee,0x1074130,0x1074137,0x1074129,0x107412e,0x10741d0,0x10741d7,0x10741c9,0x10741ce,0x1075e10,0x1075e17,0x1075e09,0x1075e0e,0x1075ef0,0x1075ef7,0x1075ee9,0x1075eee,0x1075d30,0x1075d37,0x1075d29,0x1075d2e,0x1075dd0,0x1075dd7,0x1075dc9,0x1075dce,0x1072610,0x1072617,0x1072609,0x107260e,0x10726f0,0x10726f7,0x10726e9,0x10726ee,0x1072530,0x1072537,0x1072529,0x107252e,0x10725d0,0x10725d7,0x10725c9,0x10725ce,0x1073a10,0x1073a17,0x1073a09,0x1073a0e,0x1073af0,0x1073af7,0x1073ae9,0x1073aee,0x1073930,0x1073937,0x1073929,0x107392e,0x10739d0,0x10739d7,0x10739c9,0x10739ce,0x1784210,0x1784217,0x1784209,0x178420e,0x17842f0,0x17842f7,0x17842e9,0x17842ee,0x1784130,0x1784137,0x1784129,0x178412e,0x17841d0,0x17841d7,0x17841c9,0x17841ce,0x1785e10,0x1785e17,0x1785e09,0x1785e0e,0x1785ef0,0x1785ef7,0x1785ee9,0x1785eee,0x1785d30,0x1785d37,0x1785d29,0x1785d2e,0x1785dd0,0x1785dd7,0x1785dc9,0x1785dce,0x1782610,0x1782617,0x1782609,0x178260e,0x17826f0,0x17826f7,0x17826e9,0x17826ee,0x1782530,0x1782537,0x1782529,0x178252e,0x17825d0,0x17825d7,0x17825c9,0x17825ce,0x1783a10,0x1783a17,0x1783a09,0x1783a0e,0x1783af0,0x1783af7,0x1783ae9,0x1783aee,0x1783930,0x1783937,0x1783929,0x178392e,0x17839d0,0x17839d7,0x17839c9,0x17839ce,0x17bc210,0x17bc217,0x17bc209,0x17bc20e,0x17bc2f0,0x17bc2f7,0x17bc2e9,0x17bc2ee,0x17bc130,0x17bc137,0x17bc129,0x17bc12e,0x17bc1d0,0x17bc1d7,0x17bc1c9,0x17bc1ce,0x17bde10,0x17bde17,0x17bde09,0x17bde0e,0x17bdef0,0x17bdef7,0x17bdee9,0x17bdeee,0x17bdd30,0x17bdd37,0x17bdd29,0x17bdd2e,0x17bddd0,0x17bddd7,0x17bddc9,0x17bddce,0x17ba610,0x17ba617,0x17ba609,0x17ba60e,0x17ba6f0,0x17ba6f7,0x17ba6e9,0x17ba6ee,0x17ba530,0x17ba537,0x17ba529,0x17ba52e,0x17ba5d0,0x17ba5d7,0x17ba5c9,0x17ba5ce,0x17bba10,0x17bba17,0x17bba09,0x17bba0e,0x17bbaf0,0x17bbaf7,0x17bbae9,0x17bbaee,0x17bb930,0x17bb937,0x17bb929,0x17bb92e,0x17bb9d0,0x17bb9d7,0x17bb9c9,0x17bb9ce,0x174c210,0x174c217,0x174c209,0x174c20e,0x174c2f0,0x174c2f7,0x174c2e9,0x174c2ee,0x174c130,0x174c137,0x174c129,0x174c12e,0x174c1d0,0x174c1d7,0x174c1c9,0x174c1ce,0x174de10,0x174de17,0x174de09,0x174de0e,0x174def0,0x174def7,0x174dee9,0x174deee,0x174dd30,0x174dd37,0x174dd29,0x174dd2e,0x174ddd0,0x174ddd7,0x174ddc9,0x174ddce,0x174a610,0x174a617,0x174a609,0x174a60e,0x174a6f0,0x174a6f7,0x174a6e9,0x174a6ee,0x174a530,0x174a537,0x174a529,0x174a52e,0x174a5d0,0x174a5d7,0x174a5c9,0x174a5ce,0x174ba10,0x174ba17,0x174ba09,0x174ba0e,0x174baf0,0x174baf7,0x174bae9,0x174baee,0x174b930,0x174b937,0x174b929,0x174b92e,0x174b9d0,0x174b9d7,0x174b9c9,0x174b9ce,0x1774210,0x1774217,0x1774209,0x177420e,0x17742f0,0x17742f7,0x17742e9,0x17742ee,0x1774130,0x1774137,0x1774129,0x177412e,0x17741d0,0x17741d7,0x17741c9,0x17741ce,0x1775e10,0x1775e17,0x1775e09,0x1775e0e,0x1775ef0,0x1775ef7,0x1775ee9,0x1775eee,0x1775d30,0x1775d37,0x1775d29,0x1775d2e,0x1775dd0,0x1775dd7,0x1775dc9,0x1775dce,0x1772610,0x1772617,0x1772609,0x177260e,0x17726f0,0x17726f7,0x17726e9,0x17726ee,0x1772530,0x1772537,0x1772529,0x177252e,0x17725d0,0x17725d7,0x17725c9,0x17725ce,0x1773a10,0x1773a17,0x1773a09,0x1773a0e,0x1773af0,0x1773af7,0x1773ae9,0x1773aee,0x1773930,0x1773937,0x1773929,0x177392e,0x17739d0,0x17739d7,0x17739c9,0x17739ce,0x984210,0x984217,0x984209,0x98420e,0x9842f0,0x9842f7,0x9842e9,0x9842ee,0x984130,0x984137,0x984129,0x98412e,0x9841d0,0x9841d7,0x9841c9,0x9841ce,0x985e10,0x985e17,0x985e09,0x985e0e,0x985ef0,0x985ef7,0x985ee9,0x985eee,0x985d30,0x985d37,0x985d29,0x985d2e,0x985dd0,0x985dd7,0x985dc9,0x985dce,0x982610,0x982617,0x982609,0x98260e,0x9826f0,0x9826f7,0x9826e9,0x9826ee,0x982530,0x982537,0x982529,0x98252e,0x9825d0,0x9825d7,0x9825c9,0x9825ce,0x983a10,0x983a17,0x983a09,0x983a0e,0x983af0,0x983af7,0x983ae9,0x983aee,0x983930,0x983937,0x983929,0x98392e,0x9839d0,0x9839d7,0x9839c9,0x9839ce,0x9bc210,0x9bc217,0x9bc209,0x9bc20e,0x9bc2f0,0x9bc2f7,0x9bc2e9,0x9bc2ee,0x9bc130,0x9bc137,0x9bc129,0x9bc12e,0x9bc1d0,0x9bc1d7,0x9bc1c9,0x9bc1ce,0x9bde10,0x9bde17,0x9bde09,0x9bde0e,0x9bdef0,0x9bdef7,0x9bdee9,0x9bdeee,0x9bdd30,0x9bdd37,0x9bdd29,0x9bdd2e,0x9bddd0,0x9bddd7,0x9bddc9,0x9bddce,0x9ba610,0x9ba617,0x9ba609,0x9ba60e,0x9ba6f0,0x9ba6f7,0x9ba6e9,0x9ba6ee,0x9ba530,0x9ba537,0x9ba529,0x9ba52e,0x9ba5d0,0x9ba5d7,0x9ba5c9,0x9ba5ce,0x9bba10,0x9bba17,0x9bba09,0x9bba0e,0x9bbaf0,0x9bbaf7,0x9bbae9,0x9bbaee,0x9bb930,0x9bb937,0x9bb929,0x9bb92e,0x9bb9d0,0x9bb9d7,0x9bb9c9,0x9bb9ce,0x94c210,0x94c217,0x94c209,0x94c20e,0x94c2f0,0x94c2f7,0x94c2e9,0x94c2ee,0x94c130,0x94c137,0x94c129,0x94c12e,0x94c1d0,0x94c1d7,0x94c1c9,0x94c1ce,0x94de10,0x94de17,0x94de09,0x94de0e,0x94def0,0x94def7,0x94dee9,0x94deee,0x94dd30,0x94dd37,0x94dd29,0x94dd2e,0x94ddd0,0x94ddd7,0x94ddc9,0x94ddce,0x94a610,0x94a617,0x94a609,0x94a60e,0x94a6f0,0x94a6f7,0x94a6e9,0x94a6ee,0x94a530,0x94a537,0x94a529,0x94a52e,0x94a5d0,0x94a5d7,0x94a5c9,0x94a5ce,0x94ba10,0x94ba17,0x94ba09,0x94ba0e,0x94baf0,0x94baf7,0x94bae9,0x94baee,0x94b930,0x94b937,0x94b929,0x94b92e,0x94b9d0,0x94b9d7,0x94b9c9,0x94b9ce,0x974210,0x974217,0x974209,0x97420e,0x9742f0,0x9742f7,0x9742e9,0x9742ee,0x974130,0x974137,0x974129,0x97412e,0x9741d0,0x9741d7,0x9741c9,0x9741ce,0x975e10,0x975e17,0x975e09,0x975e0e,0x975ef0,0x975ef7,0x975ee9,0x975eee,0x975d30,0x975d37,0x975d29,0x975d2e,0x975dd0,0x975dd7,0x975dc9,0x975dce,0x972610,0x972617,0x972609,0x97260e,0x9726f0,0x9726f7,0x9726e9,0x9726ee,0x972530,0x972537,0x972529,0x97252e,0x9725d0,0x9725d7,0x9725c9,0x9725ce,0x973a10,0x973a17,0x973a09,0x973a0e,0x973af0,0x973af7,0x973ae9,0x973aee,0x973930,0x973937,0x973929,0x97392e,0x9739d0,0x9739d7,0x9739c9,0x9739ce,0xe84210,0xe84217,0xe84209,0xe8420e,0xe842f0,0xe842f7,0xe842e9,0xe842ee,0xe84130,0xe84137,0xe84129,0xe8412e,0xe841d0,0xe841d7,0xe841c9,0xe841ce,0xe85e10,0xe85e17,0xe85e09,0xe85e0e,0xe85ef0,0xe85ef7,0xe85ee9,0xe85eee,0xe85d30,0xe85d37,0xe85d29,0xe85d2e,0xe85dd0,0xe85dd7,0xe85dc9,0xe85dce,0xe82610,0xe82617,0xe82609,0xe8260e,0xe826f0,0xe826f7,0xe826e9,0xe826ee,0xe82530,0xe82537,0xe82529,0xe8252e,0xe825d0,0xe825d7,0xe825c9,0xe825ce,0xe83a10,0xe83a17,0xe83a09,0xe83a0e,0xe83af0,0xe83af7,0xe83ae9,0xe83aee,0xe83930,0xe83937,0xe83929,0xe8392e,0xe839d0,0xe839d7,0xe839c9,0xe839ce,0xebc210,0xebc217,0xebc209,0xebc20e,0xebc2f0,0xebc2f7,0xebc2e9,0xebc2ee,0xebc130,0xebc137,0xebc129,0xebc12e,0xebc1d0,0xebc1d7,0xebc1c9,0xebc1ce,0xebde10,0xebde17,0xebde09,0xebde0e,0xebdef0,0xebdef7,0xebdee9,0xebdeee,0xebdd30,0xebdd37,0xebdd29,0xebdd2e,0xebddd0,0xebddd7,0xebddc9,0xebddce,0xeba610,0xeba617,0xeba609,0xeba60e,0xeba6f0,0xeba6f7,0xeba6e9,0xeba6ee,0xeba530,0xeba537,0xeba529,0xeba52e,0xeba5d0,0xeba5d7,0xeba5c9,0xeba5ce,0xebba10,0xebba17,0xebba09,0xebba0e,0xebbaf0,0xebbaf7,0xebbae9,0xebbaee,0xebb930,0xebb937,0xebb929,0xebb92e,0xebb9d0,0xebb9d7,0xebb9c9,0xebb9ce,0xe4c210,0xe4c217,0xe4c209,0xe4c20e,0xe4c2f0,0xe4c2f7,0xe4c2e9,0xe4c2ee,0xe4c130,0xe4c137,0xe4c129,0xe4c12e,0xe4c1d0,0xe4c1d7,0xe4c1c9,0xe4c1ce,0xe4de10,0xe4de17,0xe4de09,0xe4de0e,0xe4def0,0xe4def7,0xe4dee9,0xe4deee,0xe4dd30,0xe4dd37,0xe4dd29,0xe4dd2e,0xe4ddd0,0xe4ddd7,0xe4ddc9,0xe4ddce,0xe4a610,0xe4a617,0xe4a609,0xe4a60e,0xe4a6f0,0xe4a6f7,0xe4a6e9,0xe4a6ee,0xe4a530,0xe4a537,0xe4a529,0xe4a52e,0xe4a5d0,0xe4a5d7,0xe4a5c9,0xe4a5ce,0xe4ba10,0xe4ba17,0xe4ba09,0xe4ba0e,0xe4baf0,0xe4baf7,0xe4bae9,0xe4baee,0xe4b930,0xe4b937,0xe4b929,0xe4b92e,0xe4b9d0,0xe4b9d7,0xe4b9c9,0xe4b9ce,0xe74210,0xe74217,0xe74209,0xe7420e,0xe742f0,0xe742f7,0xe742e9,0xe742ee,0xe74130,0xe74137,0xe74129,0xe7412e,0xe741d0,0xe741d7,0xe741c9,0xe741ce,0xe75e10,0xe75e17,0xe75e09,0xe75e0e,0xe75ef0,0xe75ef7,0xe75ee9,0xe75eee,0xe75d30,0xe75d37,0xe75d29,0xe75d2e,0xe75dd0,0xe75dd7,0xe75dc9,0xe75dce,0xe72610,0xe72617,0xe72609,0xe7260e,0xe726f0,0xe726f7,0xe726e9,0xe726ee,0xe72530,0xe72537,0xe72529,0xe7252e,0xe725d0,0xe725d7,0xe725c9,0xe725ce,0xe73a10,0xe73a17,0xe73a09,0xe73a0e,0xe73af0,0xe73af7,0xe73ae9,0xe73aee,0xe73930,0xe73937,0xe73929,0xe7392e,0xe739d0,0xe739d7,0xe739c9]
  },
  ARUCO_MIP_36h12: {
    nBits: 36,
    tau: 12,
    codeList: [0xd2b63a09d,0x6001134e5,0x1206fbe72,0xff8ad6cb4,0x85da9bc49,0xb461afe9c,0x6db51fe13,0x5248c541f,0x8f34503,0x8ea462ece,0xeac2be76d,0x1af615c44,0xb48a49f27,0x2e4e1283b,0x78b1f2fa8,0x27d34f57e,0x89222fff1,0x4c1669406,0xbf49b3511,0xdc191cd5d,0x11d7c3f85,0x16a130e35,0xe29f27eff,0x428d8ae0c,0x90d548477,0x2319cbc93,0xc3b0c3dfc,0x424bccc9,0x2a081d630,0x762743d96,0xd0645bf19,0xf38d7fd60,0xc6cbf9a10,0x3c1be7c65,0x276f75e63,0x4490a3f63,0xda60acd52,0x3cc68df59,0xab46f9dae,0x88d533d78,0xb6d62ec21,0xb3c02b646,0x22e56d408,0xac5f5770a,0xaaa993f66,0x4caa07c8d,0x5c9b4f7b0,0xaa9ef0e05,0x705c5750,0xac81f545e,0x735b91e74,0x8cc35cee4,0xe44694d04,0xb5e121de0,0x261017d0f,0xf1d439eb5,0xa1a33ac96,0x174c62c02,0x1ee27f716,0x8b1c5ece9,0x6a05b0c6a,0xd0568dfc,0x192d25e5f,0x1adbeccc8,0xcfec87f00,0xd0b9dde7a,0x88dcef81e,0x445681cb9,0xdbb2ffc83,0xa48d96df1,0xb72cc2e7d,0xc295b53f,0xf49832704,0x9968edc29,0x9e4e1af85,0x8683e2d1b,0x810b45c04,0x6ac44bfe2,0x645346615,0x3990bd598,0x1c9ed0f6a,0xc26729d65,0x83993f795,0x3ac05ac5d,0x357adff3b,0xd5c05565,0x2f547ef44,0x86c115041,0x640fd9e5f,0xce08bbcf7,0x109bb343e,0xc21435c92,0x35b4dfce4,0x459752cf2,0xec915b82c,0x51881eed0,0x2dda7dc97,0x2e0142144,0x42e890f99,0x9a8856527,0x8e80d9d80,0x891cbcf34,0x25dd82410,0x239551d34,0x8fe8f0c70,0x94106a970,0x82609b40c,0xfc9caf36,0x688181d11,0x718613c08,0xf1ab7629,0xa357bfc18,0x4c03b7a46,0x204dedce6,0xad6300d37,0x84cc4cd09,0x42160e5c4,0x87d2adfa8,0x7850e7749,0x4e750fc7c,0xbf2e5dfda,0xd88324da5,0x234b52f80,0x378204514,0xabdf2ad53,0x365e78ef9,0x49caa6ca2,0x3c39ddf3,0xc68c5385d,0x5bfcbbf67,0x623241e21,0xabc90d5cc,0x388c6fe85,0xda0e2d62d,0x10855dfe9,0x4d46efd6b,0x76ea12d61,0x9db377d3d,0xeed0efa71,0xe6ec3ae2f,0x441faee83,0xba19c8ff5,0x313035eab,0x6ce8f7625,0x880dab58d,0x8d3409e0d,0x2be92ee21,0xd60302c6c,0x469ffc724,0x87eebeed3,0x42587ef7a,0x7a8cc4e52,0x76a437650,0x999e41ef4,0x7d0969e42,0xc02baf46b,0x9259f3e47,0x2116a1dc0,0x9f2de4d84,0xeffac29,0x7b371ff8c,0x668339da9,0xd010aee3f,0x1cd00b4c0,0x95070fc3b,0xf84c9a770,0x38f863d76,0x3646ff045,0xce1b96412,0x7a5d45da8,0x14e00ef6c,0x5e95abfd8,0xb2e9cb729,0x36c47dd7,0xb8ee97c6b,0xe9e8f657,0xd4ad2ef1a,0x8811c7f32,0x47bde7c31,0x3adadfb64,0x6e5b28574,0x33e67cd91,0x2ab9fdd2d,0x8afa67f2b,0xe6a28fc5e,0x72049cdbd,0xae65dac12,0x1251a4526,0x1089ab841,0xe2f096ee0,0xb0caee573,0xfd6677e86,0x444b3f518,0xbe8b3a56a,0x680a75cfc,0xac02baea8,0x97d815e1c,0x1d4386e08,0x1a14f5b0e,0xe658a8d81,0xa3868efa7,0x3668a9673,0xe8fc53d85,0x2e2b7edd5,0x8b2470f13,0xf69795f32,0x4589ffc8e,0x2e2080c9c,0x64265f7d,0x3d714dd10,0x1692c6ef1,0x3e67f2f49,0x5041dad63,0x1a1503415,0x64c18c742,0xa72eec35,0x1f0f9dc60,0xa9559bc67,0xf32911d0d,0x21c0d4ffc,0xe01cef5b0,0x4e23a3520,0xaa4f04e49,0xe1c4fcc43,0x208e8f6e8,0x8486774a5,0x9e98c7558,0x2c59fb7dc,0x9446a4613,0x8292dcc2e,0x4d61631,0xd05527809,0xa0163852d,0x8f657f639,0xcca6c3e37,0xcb136bc7a,0xfc5a83e53,0x9aa44fc30,0xbdec1bd3c,0xe020b9f7c,0x4b8f35fb0,0xb8165f637,0x33dc88d69,0x10a2f7e4d,0xc8cb5ff53,0xde259ff6b,0x46d070dd4,0x32d3b9741,0x7075f1c04,0x4d58dbea0]
  }
};

AR.Dictionary = function (dicName) {
  this.codes = {};
  this.codeList = [];
  this.tau = 0;
  this._initialize(dicName);
};

AR.Dictionary.prototype._initialize = function (dicName) {
  this.codes = {};
  this.codeList = [];
  this.tau = 0;
  this.nBits = 0;
  this.markSize = 0;
  this.dicName = dicName;
  var dictionary = AR.DICTIONARIES[dicName];
  if (!dictionary)
    throw 'The dictionary "' + dicName + '" is not recognized.';
  
  this.nBits = dictionary.nBits;
  this.markSize = Math.sqrt(dictionary.nBits) + 2;
  for (var i = 0; i < dictionary.codeList.length; i++) {
    var code = null;
    if (typeof dictionary.codeList[i] === 'number')
      code = this._hex2bin(dictionary.codeList[i], dictionary.nBits);
    if (typeof dictionary.codeList[i] === 'string')
      code = this._hex2bin(parseInt(dictionary.codeList[i], 16), dictionary.nBits);
    if (Array.isArray(dictionary.codeList[i])) 
      code = this._bytes2bin(dictionary.codeList[i], dictionary.nBits);
    if (code === null) 
      throw 'Invalid code ' + i + ' in dictionary ' + dicName + ': ' + JSON.stringify(dictionary.codeList[i]);
    if (code.length != dictionary.nBits)
      throw 'The code ' + i + ' in dictionary ' + dicName + ' is not ' +  dictionary.nBits + ' bits long but ' + code.length + ': ' + code;
    this.codeList.push(code);
    this.codes[code] = {
      id: i
    };
  }
  this.tau = dictionary.tau || this._calculateTau();
};

AR.Dictionary.prototype.find = function (bits) {
  var val = '',
    i, j;
  for (i = 0; i < bits.length; i++) {
    var bitRow = bits[i];
    for (j = 0; j < bitRow.length; j++) {
      val += bitRow[j];
    }
  }
  var minFound = this.codes[val];
  if (minFound)
    return {
      id: minFound.id,
      distance: 0
    };

  for (i = 0; i < this.codeList.length; i++) {
    var code = this.codeList[i];
    var distance = this._hammingDistance(val, code);
    if (this._hammingDistance(val, code) < this.tau) {
      if (!minFound || minFound.distance > distance) {
        minFound = {
          id: this.codes[code].id,
          distance: distance
        };
      }
    }
  }
  return minFound;
};

AR.Dictionary.prototype._hex2bin = function (hex, nBits) {
  return hex.toString(2).padStart(nBits, '0');
};

AR.Dictionary.prototype._bytes2bin = function (byteList, nBits) {
  var bits = '', byte;
  for (byte of byteList) {
    bits += byte.toString(2).padStart(bits.length + 8 > nBits?nBits - bits.length:8, '0');
  }
  return bits;
};

AR.Dictionary.prototype._hammingDistance = function (str1, str2) {
  if (str1.length != str2.length)
    throw 'Hamming distance calculation require inputs of the same length';
  var distance = 0,
    i;
  for (i = 0; i < str1.length; i++)
    if (str1[i] !== str2[i])
      distance += 1;
  return distance;
};

AR.Dictionary.prototype._calculateTau = function () {
  var tau = Number.MAX_VALUE;
  for(var i=0;i<this.codeList.length;i++)
    for(var j=i+1;j<this.codeList.length;j++) {
      var distance = this._hammingDistance(this.codeList[i], this.codeList[j]);
      tau = distance < tau ? distance : tau;
    }
  return tau;
};

AR.Dictionary.prototype.generateSVG = function (id) {
  var code = this.codeList[id];
  if (code == null)
    throw 'The id "' + id + '" is not valid for the dictionary "' + this.dicName + '". ID must be between 0 and ' + (this.codeList.length-1) + ' included.';
  var size = this.markSize - 2;
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+ (size+4) + ' ' + (size+4) + '">';
  svg += '<rect x="0" y="0" width="' + (size+4) + '" height="' + (size+4) + '" fill="white"/>';
  svg += '<rect x="1" y="1" width="' + (size+2) + '" height="' + (size+2) + '" fill="black"/>';
  for(var y=0;y<size;y++) {
    for(var x=0;x<size;x++) {
      if (code[y*size+x]=='1') 
        svg += '<rect x="' + (x+2) + '" y="' + (y+2) + '" width="1" height="1" fill="white"/>';
    }
  }
  svg += '</svg>';
  return svg;
};

AR.Marker = function (id, corners, hammingDistance) {
  this.id = id;
  this.corners = corners;
  this.hammingDistance = hammingDistance;
};

AR.Detector = function (config) {
  config = config || {};
  this.grey = new CV.Image();
  this.thres = new CV.Image();
  this.homography = new CV.Image();
  this.binary = [];
  this.contours = [];
  this.polys = [];
  this.candidates = [];
  config.dictionaryName = config.dictionaryName || 'ARUCO_MIP_36h12';
  this.dictionary = new AR.Dictionary(config.dictionaryName);
  this.dictionary.tau = config.maxHammingDistance != null ? config.maxHammingDistance : this.dictionary.tau;
};

AR.Detector.prototype.detectImage = function (width, height, data) {
  return this.detect({
    width: width,
    height: height,
    data: data
  });
};

AR.Detector.prototype.detectStreamInit = function (width, height, callback) {
  this.streamConfig = {};
  this.streamConfig.width = width;
  this.streamConfig.height = height;
  this.streamConfig.imageSize = width * height * 4; //provided image must be a sequence of rgba bytes (4 bytes represent a pixel)
  this.streamConfig.index = 0;
  this.streamConfig.imageData = new Uint8ClampedArray(this.streamConfig.imageSize);
  this.streamConfig.callback = callback || function (image, markerList) {};
};

//accept data chunks of different sizes
AR.Detector.prototype.detectStream = function (data) {
  for (var i = 0; i < data.length; i++) {
    this.streamConfig.imageData[this.streamConfig.index] = data[i];
    this.streamConfig.index = (this.streamConfig.index + 1) % this.streamConfig.imageSize;
    if (this.streamConfig.index == 0) {
      var image = {
        width: this.streamConfig.width,
        height: this.streamConfig.height,
        data: this.streamConfig.imageData
      };
      var markerList = this.detect(image);
      this.streamConfig.callback(image, markerList);
    }
  }
};

AR.Detector.prototype.detectMJPEGStreamInit = function (width, height, callback, decoderFn) {
  this.mjpeg = {
    decoderFn: decoderFn,
    chunks: [],
    SOI: [0xff, 0xd8],
    EOI: [0xff, 0xd9]
  };
  this.detectStreamInit(width, height, callback);
};

AR.Detector.prototype.detectMJPEGStream = function (chunk) {
  var eoiPos = chunk.findIndex(function (element, index, array) {
    return this.mjpeg.EOI[0] == element && array.length > index + 1 && this.mjpeg.EOI[1] == array[index + 1];
  });
  var soiPos = chunk.findIndex(function (element, index, array) {
    return this.mjpeg.SOI[0] == element && array.length > index + 1 && this.mjpeg.SOI[1] == array[index + 1];
  });

  if (eoiPos === -1) {
    this.mjpeg.chunks.push(chunk);
  } else {
    var part1 = chunk.slice(0, eoiPos + 2);
    if (part1.length) {
      this.mjpeg.chunks.push(part1);
    }
    if (this.mjpeg.chunks.length) {
      var jpegImage = this.mjpeg.chunks.flat();
      var rgba = this.mjpeg.decoderFn(jpegImage);
      this.detectStream(rgba);
    }
    this.mjpeg.chunks = [];
  }
  if (soiPos > -1) {
    this.mjpeg.chunks = [];
    this.mjpeg.chunks.push(chunk.slice(soiPos));
  }
};

AR.Detector.prototype.detect = function (image) {
  CV.grayscale(image, this.grey);
  CV.adaptiveThreshold(this.grey, this.thres, 2, 7);

  this.contours = CV.findContours(this.thres, this.binary);
  //Scale Fix: https://stackoverflow.com/questions/35936397/marker-detection-on-paper-sheet-using-javascript
  //this.candidates = this.findCandidates(this.contours, image.width * 0.20, 0.05, 10);
  this.candidates = this.findCandidates(this.contours, image.width * 0.01, 0.05, 10);
  this.candidates = this.clockwiseCorners(this.candidates);
  this.candidates = this.notTooNear(this.candidates, 10);

  return this.findMarkers(this.grey, this.candidates, 49);
};

AR.Detector.prototype.findCandidates = function (contours, minSize, epsilon, minLength) {
  var candidates = [],
    len = contours.length,
    contour, poly, i;

  this.polys = [];

  for (i = 0; i < len; ++i) {
    contour = contours[i];

    if (contour.length >= minSize) {
      poly = CV.approxPolyDP(contour, contour.length * epsilon);

      this.polys.push(poly);

      if ((4 === poly.length) && (CV.isContourConvex(poly))) {

        if (CV.minEdgeLength(poly) >= minLength) {
          candidates.push(poly);
        }
      }
    }
  }

  return candidates;
};

AR.Detector.prototype.clockwiseCorners = function (candidates) {
  var len = candidates.length,
    dx1, dx2, dy1, dy2, swap, i;

  for (i = 0; i < len; ++i) {
    dx1 = candidates[i][1].x - candidates[i][0].x;
    dy1 = candidates[i][1].y - candidates[i][0].y;
    dx2 = candidates[i][2].x - candidates[i][0].x;
    dy2 = candidates[i][2].y - candidates[i][0].y;

    if ((dx1 * dy2 - dy1 * dx2) < 0) {
      swap = candidates[i][1];
      candidates[i][1] = candidates[i][3];
      candidates[i][3] = swap;
    }
  }

  return candidates;
};

AR.Detector.prototype.notTooNear = function (candidates, minDist) {
  var notTooNear = [],
    len = candidates.length,
    dist, dx, dy, i, j, k;

  for (i = 0; i < len; ++i) {

    for (j = i + 1; j < len; ++j) {
      dist = 0;

      for (k = 0; k < 4; ++k) {
        dx = candidates[i][k].x - candidates[j][k].x;
        dy = candidates[i][k].y - candidates[j][k].y;

        dist += dx * dx + dy * dy;
      }

      if ((dist / 4) < (minDist * minDist)) {

        if (CV.perimeter(candidates[i]) < CV.perimeter(candidates[j])) {
          candidates[i].tooNear = true;
        } else {
          candidates[j].tooNear = true;
        }
      }
    }
  }

  for (i = 0; i < len; ++i) {
    if (!candidates[i].tooNear) {
      notTooNear.push(candidates[i]);
    }
  }

  return notTooNear;
};

AR.Detector.prototype.findMarkers = function (imageSrc, candidates, warpSize) {
  var markers = [],
    len = candidates.length,
    candidate, marker, i;

  for (i = 0; i < len; ++i) {
    candidate = candidates[i];

    CV.warp(imageSrc, this.homography, candidate, warpSize);

    CV.threshold(this.homography, this.homography, CV.otsu(this.homography));

    marker = this.getMarker(this.homography, candidate);
    if (marker) {
      markers.push(marker);
    }
  }

  return markers;
};

AR.Detector.prototype.getMarker = function (imageSrc, candidate) {
  var markSize = this.dictionary.markSize;
  var width = (imageSrc.width / markSize) >>> 0,
    minZero = (width * width) >> 1,
    bits = [],
    rotations = [],
    square, inc, i, j;

  for (i = 0; i < markSize; ++i) {
    inc = (0 === i || (markSize - 1) === i) ? 1 : (markSize - 1);

    for (j = 0; j < markSize; j += inc) {
      square = {
        x: j * width,
        y: i * width,
        width: width,
        height: width
      };
      if (CV.countNonZero(imageSrc, square) > minZero) {
        return null;
      }
    }
  }

  for (i = 0; i < markSize - 2; ++i) {
    bits[i] = [];

    for (j = 0; j < markSize - 2; ++j) {
      square = {
        x: (j + 1) * width,
        y: (i + 1) * width,
        width: width,
        height: width
      };

      bits[i][j] = CV.countNonZero(imageSrc, square) > minZero ? 1 : 0;
    }
  }

  rotations[0] = bits;

  var foundMin = null;
  var rot = 0;
  for (i = 0; i < 4; i++) {
    var found = this.dictionary.find(rotations[i]);
    if (found && (foundMin === null || found.distance < foundMin.distance)) {
      foundMin = found;
      rot = i;
      if (foundMin.distance === 0)
        break;
    }
    rotations[i + 1] = this.rotate(rotations[i]);
  }

  if (foundMin)
    return new AR.Marker(foundMin.id, this.rotate2(candidate, 4 - rot), foundMin.distance);

  return null;
};

AR.Detector.prototype.rotate = function (src) {
  var dst = [],
    len = src.length,
    i, j;

  for (i = 0; i < len; ++i) {
    dst[i] = [];
    for (j = 0; j < src[i].length; ++j) {
      dst[i][j] = src[src[i].length - j - 1][i];
    }
  }

  return dst;
};

AR.Detector.prototype.rotate2 = function (src, rotation) {
  var dst = [],
    len = src.length,
    i;

  for (i = 0; i < len; ++i) {
    dst[i] = src[(rotation + i) % len];
  }

  return dst;
};
`,Ie=`/*
By downloading, copying, installing or using the software you agree to this
license. If you do not agree to this license, do not download, install,
copy or use the software.
                          License Agreement
               For Open Source Computer Vision Library
                       (3-clause BSD License)
Copyright (C) 2013, OpenCV Foundation, all rights reserved.
Third party copyrights are property of their respective owners.
Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:
  * Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.
  * Neither the names of the copyright holders nor the names of the contributors
    may be used to endorse or promote products derived from this software
    without specific prior written permission.
This software is provided by the copyright holders and contributors "as is" and
any express or implied warranties, including, but not limited to, the implied
warranties of merchantability and fitness for a particular purpose are
disclaimed. In no event shall copyright holders or contributors be liable for
any direct, indirect, incidental, special, exemplary, or consequential damages
(including, but not limited to, procurement of substitute goods or services;
loss of use, data, or profits; or business interruption) however caused
and on any theory of liability, whether in contract, strict liability,
or tort (including negligence or otherwise) arising in any way out of
the use of this software, even if advised of the possibility of such damage.
*/

//Dictionary extracted from https://github.com/opencv/opencv_contrib/blob/4.x/modules/aruco/src/predefined_dictionaries.hpp

var AR = this.AR || require('../aruco').AR;
AR.DICTIONARIES['ARUCO_4X4_1000'] = {
  nBits: 16,
  tau: null,
  codeList: [[181,50],[15,154],[51,45],[153,70],[84,158],[121,205],[158,46],[196,242],[254,218],[207,86],[249,145],[17,167],[14,183],[42,15],[36,177],[38,62],[70,101],[102,0],[108,94],[118,175],[134,139],[176,43],[204,213],[221,130],[254,71],[148,113],[172,228],[165,84],[33,35],[52,111],[68,21],[87,178],[158,207],[240,203],[8,174],[9,41],[24,117],[4,255],[13,246],[28,90],[23,24],[42,40],[50,140],[56,178],[36,232],[46,235],[45,63],[75,100],[80,46],[80,19],[81,148],[85,104],[93,65],[95,151],[104,1],[104,103],[97,36],[97,233],[107,18],[111,229],[103,223],[126,27],[128,160],[131,68],[139,162],[147,122],[132,108],[133,42],[133,156],[156,137],[159,161],[187,124],[188,4],[182,91],[191,200],[183,171],[202,31],[201,98],[217,88],[211,213],[204,152],[199,160],[197,55],[233,93],[249,37],[251,187],[238,42],[247,77],[53,117],[138,173],[118,23],[10,207],[6,75],[45,193],[73,216],[67,244],[79,54],[79,211],[105,228],[112,199],[122,110],[180,234],[237,79],[252,231],[254,166],[0,37],[0,67],[10,136],[10,134],[2,111],[0,28],[0,151],[8,55],[10,49],[9,198],[11,1],[9,251],[11,88],[16,130],[24,45],[16,120],[16,115],[18,116],[18,177],[26,249],[19,6],[12,14],[12,241],[4,51],[12,159],[14,242],[14,253],[7,76],[15,164],[7,47],[5,181],[15,145],[7,219],[30,228],[20,57],[29,128],[21,200],[31,139],[21,186],[29,177],[32,128],[40,233],[34,162],[40,83],[42,240],[34,247],[41,64],[33,70],[41,185],[43,156],[43,178],[56,202],[56,46],[48,7],[56,231],[58,73],[58,101],[50,93],[59,136],[57,29],[59,211],[38,71],[39,128],[47,170],[45,20],[37,222],[37,83],[47,119],[52,72],[60,168],[60,65],[52,13],[52,251],[54,154],[61,224],[53,106],[61,9],[61,237],[63,196],[63,108],[55,206],[61,92],[61,118],[55,176],[63,23],[63,255],[72,229],[66,104],[74,45],[65,96],[73,81],[65,221],[75,223],[88,79],[90,72],[88,22],[80,93],[90,250],[90,181],[81,35],[91,138],[89,25],[81,53],[76,105],[70,193],[78,11],[68,95],[78,89],[77,131],[77,125],[71,216],[71,115],[92,133],[94,68],[86,43],[92,187],[85,195],[95,110],[95,235],[93,18],[85,94],[98,112],[98,21],[97,194],[107,32],[99,69],[107,92],[107,91],[120,12],[122,207],[120,127],[121,128],[113,229],[113,116],[121,182],[113,211],[123,51],[100,106],[102,168],[110,167],[110,145],[101,34],[109,203],[103,141],[109,49],[126,128],[126,226],[126,141],[116,210],[124,50],[126,53],[117,171],[119,5],[127,43],[125,218],[127,146],[128,117],[128,243],[129,166],[137,237],[129,252],[152,166],[154,32],[145,67],[153,249],[145,147],[155,212],[132,9],[132,107],[134,196],[142,100],[134,26],[133,78],[141,203],[133,103],[133,175],[133,215],[135,179],[156,225],[156,242],[148,23],[149,0],[149,162],[157,35],[159,98],[157,82],[149,218],[160,197],[170,205],[162,216],[162,87],[169,61],[169,87],[171,82],[163,54],[163,89],[176,244],[184,18],[176,191],[178,157],[187,237],[185,114],[185,150],[164,195],[172,210],[174,177],[165,130],[175,101],[165,123],[175,250],[180,100],[188,98],[180,129],[182,160],[190,238],[190,13],[188,217],[190,248],[181,40],[183,9],[183,210],[192,234],[192,25],[192,253],[200,211],[202,90],[193,77],[201,180],[193,87],[195,152],[195,29],[216,128],[216,239],[218,43],[208,30],[209,5],[211,173],[219,167],[196,201],[204,120],[205,69],[197,11],[207,207],[220,172],[212,2],[220,99],[212,39],[212,245],[214,120],[222,184],[221,230],[213,93],[221,189],[223,29],[226,202],[234,107],[224,180],[226,56],[226,212],[227,34],[225,216],[240,3],[242,204],[248,246],[241,73],[243,234],[241,156],[249,245],[241,59],[236,141],[238,201],[230,15],[228,247],[231,96],[239,232],[237,178],[229,21],[239,209],[244,134],[252,1],[246,195],[244,124],[252,147],[245,66],[253,152],[245,61],[2,189],[0,225],[2,226],[2,174],[8,120],[0,116],[8,158],[8,209],[8,125],[10,50],[10,222],[2,81],[1,162],[3,128],[11,131],[11,75],[11,39],[11,239],[9,182],[9,89],[9,147],[11,248],[3,217],[3,241],[16,196],[24,171],[26,160],[26,4],[26,108],[26,174],[18,137],[16,23],[26,243],[25,64],[17,2],[17,43],[17,207],[27,34],[19,46],[17,21],[19,187],[12,32],[12,201],[12,220],[12,54],[6,20],[6,114],[13,97],[5,13],[13,143],[15,224],[15,73],[7,133],[5,144],[13,51],[15,150],[15,118],[20,96],[28,141],[20,218],[28,115],[30,148],[30,186],[22,217],[30,61],[22,251],[29,233],[29,254],[31,159],[40,139],[32,175],[34,14],[34,169],[42,141],[42,163],[42,239],[40,144],[40,59],[42,88],[34,51],[33,160],[33,2],[33,165],[33,199],[43,3],[35,103],[41,48],[41,210],[43,25],[43,155],[43,151],[56,40],[56,165],[58,134],[50,1],[56,159],[50,210],[58,153],[58,213],[57,232],[59,193],[51,67],[59,231],[49,154],[51,144],[59,158],[36,196],[44,74],[44,173],[44,207],[44,103],[38,234],[46,229],[44,112],[46,18],[46,209],[46,57],[37,100],[37,231],[47,204],[45,188],[45,113],[37,213],[37,155],[39,16],[47,124],[39,242],[39,58],[47,182],[39,211],[47,179],[39,31],[60,75],[54,192],[54,238],[62,233],[52,184],[60,20],[60,82],[52,114],[52,126],[52,191],[62,113],[62,83],[61,140],[53,162],[53,46],[53,45],[55,172],[53,112],[55,250],[63,241],[63,219],[72,196],[72,233],[74,194],[74,65],[66,235],[72,19],[74,216],[66,253],[74,23],[73,99],[67,110],[65,58],[73,177],[65,61],[75,146],[75,155],[67,63],[88,34],[80,170],[88,39],[82,200],[82,132],[82,10],[90,15],[88,152],[88,92],[80,219],[80,247],[90,244],[81,236],[81,66],[81,13],[91,3],[83,235],[81,118],[89,113],[81,147],[83,249],[91,179],[83,151],[76,76],[68,75],[76,35],[70,140],[78,39],[70,144],[78,212],[69,206],[69,229],[69,39],[79,193],[71,5],[69,52],[69,114],[92,200],[92,14],[84,235],[86,137],[86,67],[94,231],[92,112],[84,178],[94,121],[86,243],[93,163],[93,242],[85,29],[93,157],[87,252],[87,210],[95,115],[104,45],[104,195],[104,135],[106,74],[98,105],[96,185],[104,255],[106,220],[106,218],[106,62],[106,81],[106,49],[98,215],[97,204],[107,130],[107,227],[105,58],[97,158],[97,149],[97,117],[105,95],[105,55],[99,218],[112,2],[120,99],[112,79],[114,202],[122,173],[112,123],[122,20],[122,249],[122,211],[122,187],[121,226],[113,41],[123,103],[113,208],[121,57],[115,48],[115,185],[115,83],[115,255],[108,136],[100,9],[108,67],[102,6],[102,131],[100,176],[100,218],[110,159],[103,200],[111,238],[109,59],[111,210],[116,128],[124,171],[126,104],[126,2],[124,156],[116,54],[124,17],[126,222],[126,182],[118,219],[125,196],[125,138],[117,109],[119,136],[119,32],[119,65],[117,56],[117,190],[125,155],[119,87],[136,40],[128,172],[136,13],[136,103],[130,78],[138,161],[130,43],[128,24],[136,249],[128,157],[138,156],[130,49],[138,117],[130,151],[129,9],[129,235],[129,7],[139,40],[139,172],[131,46],[131,229],[129,80],[137,50],[139,122],[139,150],[131,125],[144,135],[154,252],[146,245],[145,170],[147,65],[147,37],[155,235],[153,52],[145,247],[155,218],[147,86],[132,66],[140,129],[140,79],[134,72],[134,166],[142,3],[134,227],[134,111],[142,175],[132,94],[132,119],[134,250],[142,30],[142,55],[135,10],[143,138],[143,38],[135,33],[135,13],[133,114],[135,62],[156,67],[158,97],[148,88],[148,248],[156,50],[148,118],[148,177],[148,221],[148,155],[156,219],[158,156],[158,210],[150,25],[158,177],[149,105],[159,109],[151,43],[149,182],[149,185],[157,61],[157,87],[168,236],[168,37],[162,172],[162,2],[170,102],[170,143],[170,231],[168,48],[168,122],[168,246],[168,147],[162,20],[170,52],[162,114],[170,242],[162,241],[161,64],[169,10],[161,38],[169,197],[169,207],[161,52],[169,18],[161,250],[171,152],[163,247],[176,6],[176,69],[184,141],[178,132],[184,240],[184,85],[178,118],[186,145],[178,113],[185,192],[185,66],[185,42],[179,140],[179,202],[187,102],[179,15],[177,218],[187,20],[187,246],[179,19],[164,104],[172,44],[172,161],[172,235],[172,199],[164,103],[166,192],[174,224],[166,35],[173,232],[165,204],[167,236],[173,124],[165,26],[165,145],[173,25],[165,151],[180,109],[190,203],[188,58],[188,245],[190,189],[190,243],[181,37],[181,143],[183,104],[191,228],[189,254],[189,157],[181,245],[181,243],[191,176],[183,90],[191,62],[183,57],[191,213],[183,29],[191,53],[183,127],[200,1],[192,165],[194,130],[200,189],[194,252],[202,145],[194,91],[201,68],[193,42],[195,192],[201,122],[193,185],[201,117],[193,247],[203,177],[208,108],[216,135],[208,175],[218,196],[210,12],[218,9],[208,48],[216,148],[208,58],[208,182],[208,117],[210,118],[218,93],[218,53],[210,23],[217,2],[211,232],[211,229],[209,154],[209,246],[209,81],[219,20],[211,62],[211,211],[196,96],[204,167],[198,66],[198,71],[206,231],[196,92],[204,29],[204,53],[198,188],[205,168],[197,12],[197,228],[197,194],[205,45],[205,89],[205,149],[197,147],[199,95],[212,197],[222,136],[214,36],[222,236],[214,226],[222,198],[222,35],[220,220],[220,26],[212,17],[222,84],[214,148],[222,157],[221,129],[213,165],[215,172],[215,102],[223,169],[213,220],[221,31],[223,240],[226,72],[226,232],[226,7],[224,93],[234,245],[235,38],[235,237],[225,82],[225,126],[233,219],[248,6],[240,238],[248,161],[250,0],[250,194],[240,155],[250,244],[250,60],[242,252],[242,189],[242,147],[241,96],[249,236],[241,70],[249,225],[243,72],[243,174],[243,193],[243,139],[243,167],[241,115],[241,151],[243,244],[251,50],[228,7],[230,77],[236,85],[237,192],[237,133],[239,162],[231,78],[229,213],[239,80],[244,34],[244,137],[244,41],[246,106],[254,11],[254,111],[244,149],[244,53],[244,31],[246,176],[245,232],[245,197],[253,35],[255,192],[247,204],[247,233],[245,188],[253,246],[245,217],[253,151],[253,63],[255,156],[255,90],[247,254],[255,17],[247,191]]
};`;let U=null;function Ce(){if(U)return U;const t={},e=n=>{throw new Error(`vendored js-aruco2 tried to require(${n}); load order is wrong`)};for(const n of[ke,Fe,Ie])new Function("require",n).call(t,e);return t.AR.DICTIONARIES.DICT_4X4_50={nBits:16,tau:null,codeList:t.AR.DICTIONARIES.ARUCO_4X4_1000.codeList.slice(0,50)},U={AR:t.AR,CV:t.CV},U}function ge(t){const{AR:e}=Ce(),r=new e.Dictionary("DICT_4X4_50").codeList[t];if(!r)throw new Error(`DICT_4X4_50 has no id ${t}`);return[...r].map(i=>i==="1"?1:0)}let W=null;function De(t){if(!W){const e=a=>[0,1,2,3].map(o=>a.slice(o*4,o*4+4)),n=a=>a[0].map((o,c)=>a.map(h=>h[c]).reverse()),r=Array.from({length:50},(a,o)=>e(ge(o))),i=a=>a.flat().join(""),s=new Map;r.forEach((a,o)=>{let c=a;for(let h=0;h<4;h++)s.set(i(c),o),c=n(c)}),W=r.map(a=>s.get(i([...a].reverse()))??null)}return W[t]??null}function Et(t,e,n){const r=c=>c.some(h=>e.has(h.id)&&De(h.id)===null),i=r(t.asRead),s=r(t.flipped);if(i!==s)return s;if(i&&s)return null;const a=t.asRead.some(c=>e.has(c.id)&&n(c,!1)),o=t.flipped.some(c=>e.has(c.id)&&n(c,!0));return a!==o?o:null}const Be=.2,de=2*Math.PI;function N(t){const e=Math.hypot(t[0],t[1],t[2],t[3]);if(!Number.isFinite(e)||e<1e-12)throw new Error(`cannot normalize quaternion with norm ${e}`);return[t[0]/e,t[1]/e,t[2]/e,t[3]/e]}const Ne=t=>[0,Math.sin(t/2),0,Math.cos(t/2)];function Le(t,e){const n=Math.hypot(t[0],t[1],t[2]);if(n<1e-12)throw new Error("zero rotation axis");const r=Math.sin(e/2)/n;return[t[0]*r,t[1]*r,t[2]*r,Math.cos(e/2)]}function j(t,e){const[n,r,i,s]=t,[a,o,c,h]=e;return[s*a+n*h+r*c-i*o,s*o-n*c+r*h+i*a,s*c+n*o-r*a+i*h,s*h-n*a-r*o-i*c]}const H=t=>[-t[0],-t[1],-t[2],t[3]];function S(t,e){const[n,r,i,s]=t,[a,o,c]=e,h=2*(r*c-i*o),d=2*(i*a-n*c),x=2*(n*o-r*a);return[a+s*h+(r*x-i*d),o+s*d+(i*h-n*x),c+s*x+(n*d-r*h)]}function qe(t){let e=0;for(let a=0;a<3;a++)for(let o=0;o<3;o++){const c=t[a][0]*t[o][0]+t[a][1]*t[o][1]+t[a][2]*t[o][2];e=Math.max(e,Math.abs(c-(a===o?1:0)))}const n=t[0][0]*(t[1][1]*t[2][2]-t[1][2]*t[2][1])-t[0][1]*(t[1][0]*t[2][2]-t[1][2]*t[2][0])+t[0][2]*(t[1][0]*t[2][1]-t[1][1]*t[2][0]);if(!(e<=.001)||n<0)throw new Error("matrix is not a proper rotation");const r=t[0][0]+t[1][1]+t[2][2];let i;if(r>0){const a=.5/Math.sqrt(r+1);i=[(t[2][1]-t[1][2])*a,(t[0][2]-t[2][0])*a,(t[1][0]-t[0][1])*a,.25/a]}else if(t[0][0]>=t[1][1]&&t[0][0]>=t[2][2]){const a=2*Math.sqrt(1+t[0][0]-t[1][1]-t[2][2]);i=[.25*a,(t[1][0]+t[0][1])/a,(t[0][2]+t[2][0])/a,(t[2][1]-t[1][2])/a]}else if(t[1][1]>=t[2][2]){const a=2*Math.sqrt(1-t[0][0]+t[1][1]-t[2][2]);i=[(t[1][0]+t[0][1])/a,.25*a,(t[2][1]+t[1][2])/a,(t[0][2]-t[2][0])/a]}else{const a=2*Math.sqrt(1-t[0][0]-t[1][1]+t[2][2]);i=[(t[0][2]+t[2][0])/a,(t[2][1]+t[1][2])/a,.25*a,(t[1][0]-t[0][1])/a]}const s=N(i);return s[3]<0?[-s[0],-s[1],-s[2],-s[3]]:s}function V(t){let e=(t+Math.PI)%de;return e!==0&&e<0&&(e+=de),e-Math.PI}function te(t){const e=S(t,[0,0,-1]);if(Math.hypot(e[0],e[2])>=Be)return Math.atan2(-e[0],-e[2]);let n=S(t,[0,1,0]);if(e[1]>0&&(n=[-n[0],-n[1],-n[2]]),Math.hypot(n[0],n[2])<1e-9)throw new Error("heading undefined");return Math.atan2(-n[0],-n[2])}const xe=.4,k=(t,e)=>{const n=Math.cos(t),r=Math.sin(t);return[n*e[0]+r*e[2],e[1],-r*e[0]+n*e[2]]};function Pe(t){if(t.length!==3||!t.every(Number.isFinite))throw new Error("expected a finite [x, y, z]")}function ze(t,e,n,r){[t,e,n,r].forEach(Pe);const i=Math.atan2(n[0]-t[0],-(n[2]-t[2])),s=Math.atan2(r[0]-e[0],-(r[2]-e[2])),a=Math.hypot(n[0]-t[0],n[2]-t[2]),o=Math.hypot(r[0]-e[0],r[2]-e[2]);if(a<xe||o<xe||Math.abs(a-o)>Math.max(.5,.25*a))return null;const c=V(s-i),h=[0,1,2].map(u=>(t[u]+n[u])/2),d=[0,1,2].map(u=>(e[u]+r[u])/2),x=k(c,d);return{yaw:c,t:[h[0]-x[0],h[1]-x[1],h[2]-x[2]]}}function Oe(t,e,n,r){if(![...t.position,...t.quaternion,...e.position,...e.quaternion,...r.position,...r.quaternion,n].every(Number.isFinite))throw new Error("non-finite input");const s=N(t.quaternion),a=N(e.quaternion),o=H(s),c=S(o,t.position).map(l=>-l),h=j(a,o),d=S(a,c),x=[e.position[0]+d[0],e.position[1]+d[1],e.position[2]+d[2]],u=V(te(h)+n-te(r.quaternion)),f=k(u,r.position);return{yaw:u,t:[x[0]-f[0],x[1]-f[1],x[2]-f[2]]}}function we(t,e,n=[0,0,0]){const r=k(t.yaw,n),i=k(e.yaw,n);return[Math.hypot(r[0]+t.t[0]-i[0]-e.t[0],r[1]+t.t[1]-i[1]-e.t[1],r[2]+t.t[2]-i[2]-e.t[2]),Math.abs(V(e.yaw-t.yaw))]}function je(t,e,n,r=Ee,i=[0,0,0]){if(!e||!Number.isFinite(n)||n>r||![e.yaw,...e.t,...i,...t?[t.yaw,...t.t]:[]].every(Number.isFinite))return!0;if(!t)return!1;const[a,o]=we(t,e,i);return a>Me||o>Se}const se=(t,e)=>t.map(n=>e[0].map((r,i)=>n.reduce((s,a,o)=>s+a*e[o][i],0))),ve=(t,e)=>[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]],_e=(t,e)=>t.reduce((n,r,i)=>n+r*e[i],0),ne=t=>Math.sqrt(_e(t,t));function oe(t,e){const n=e.length,r=t.map((a,o)=>[...a,e[o]]);let i=0;for(const a of t)for(const o of a)i=Math.max(i,Math.abs(o));for(let a=0;a<n;a++){let o=a;for(let c=a+1;c<n;c++)Math.abs(r[c][a])>Math.abs(r[o][a])&&(o=c);if(Math.abs(r[o][a])<=1e-14*(i||1))return null;[r[a],r[o]]=[r[o],r[a]];for(let c=a+1;c<n;c++){const h=r[c][a]/r[a][a];for(let d=a;d<=n;d++)r[c][d]-=h*r[a][d]}}const s=new Array(n).fill(0);for(let a=n-1;a>=0;a--){let o=r[a][n];for(let c=a+1;c<n;c++)o-=r[a][c]*s[c];s[a]=o/r[a][a]}return s}function Re(t){const e=ne(t);if(e<1e-12)return[[1,-t[2],t[1]],[t[2],1,-t[0]],[-t[1],t[0],1]];const n=t.map(o=>o/e),r=[[0,-n[2],n[1]],[n[2],0,-n[0]],[-n[1],n[0],0]],i=se(r,r),s=Math.sin(e),a=1-Math.cos(e);return r.map((o,c)=>o.map((h,d)=>(c===d?1:0)+s*h+a*i[c][d]))}function Ae(t){const e=[t[0][0],t[1][0],t[2][0]],n=[t[0][1],t[1][1],t[2][1]],r=ne(e),i=e.map(d=>d/r),s=_e(i,n),a=n.map((d,x)=>d-s*i[x]),o=ne(a),c=a.map(d=>d/o),h=ve(i,c);return[[i[0],c[0],h[0]],[i[1],c[1],h[1]],[i[2],c[2],h[2]]]}const Ve=16;function Ue(t){const e=[];let n=0;for(let r=0;r<4;r++){const i=t[r],s=t[(r+1)%4],a=t[(r+2)%4];e.push((s[0]-i[0])*(a[1]-s[1])-(s[1]-i[1])*(a[0]-s[0])),n+=i[0]*s[1]-s[0]*i[1]}return(e.every(r=>r>0)||e.every(r=>r<0))&&Math.abs(n)/2>=Ve}function Xe(t){const e=t/2;return[[-e,e,0],[e,e,0],[e,-e,0],[-e,-e,0]]}function ie(t,e,n,r,i){let s=0;for(let a=0;a<4;a++){const o=n[a],c=t[0][0]*o[0]+t[0][1]*o[1]+t[0][2]*o[2]+e[0],h=t[1][0]*o[0]+t[1][1]*o[1]+t[1][2]*o[2]+e[1],d=t[2][0]*o[0]+t[2][1]*o[1]+t[2][2]*o[2]+e[2];if(!(d>0))return 1/0;const x=i[0][0]*(c/d)+i[0][1]*(h/d)+i[0][2],u=i[1][1]*(h/d)+i[1][2];s+=(x-r[a][0])**2+(u-r[a][1])**2}return Math.sqrt(s/4)}function He(t,e,n){const r=[[0,0,0],[0,0,0],[0,0,0]],i=[0,0,0];for(let s=0;s<4;s++){const a=e[s],o=[0,1,2].map(x=>t[x][0]*a[0]+t[x][1]*a[1]+t[x][2]*a[2]),[c,h]=n[s],d=[[[1,0,-c],c*o[2]-o[0]],[[0,1,-h],h*o[2]-o[1]]];for(const[x,u]of d)for(let f=0;f<3;f++){i[f]+=x[f]*u;for(let l=0;l<3;l++)r[f][l]+=x[f]*x[l]}}return oe(r,i)}function Ye(t,e){const n=[],r=[];for(let T=0;T<4;T++){const[F,I]=t[T],[B,P]=e[T];n.push([F,I,1,0,0,0,-B*F,-B*I]),r.push(B),n.push([0,0,0,F,I,1,-P*F,-P*I]),r.push(P)}const i=oe(n,r);if(!i)return null;const s=[[i[0],i[1],i[2]],[i[3],i[4],i[5]],[i[6],i[7],1]],a=s[0][2],o=s[1][2],c=[[s[0][0]-s[2][0]*a,s[0][1]-s[2][1]*a],[s[1][0]-s[2][0]*o,s[1][1]-s[2][1]*o]],h=Math.sqrt(a*a+o*o+1),d=Math.hypot(a,o);let x;if(d<1e-12)x=[[1,0,0],[0,1,0],[0,0,1]];else{const T=Math.atan2(d/h,1/h);x=Re([-o/d*T,a/d*T,0])}const u=[[x[0][0]-a*x[2][0],x[0][1]-a*x[2][1]],[x[1][0]-o*x[2][0],x[1][1]-o*x[2][1]]],f=u[0][0]*u[1][1]-u[0][1]*u[1][0];if(Math.abs(f)<1e-12)return null;const l=[[u[1][1]/f,-u[0][1]/f],[-u[1][0]/f,u[0][0]/f]],y=l[0][0]*c[0][0]+l[0][1]*c[1][0],b=l[0][0]*c[0][1]+l[0][1]*c[1][1],g=l[1][0]*c[0][0]+l[1][1]*c[1][0],m=l[1][0]*c[0][1]+l[1][1]*c[1][1],v=y*y+b*b,R=y*g+b*m,p=g*g+m*m,_=.5*(v+p+Math.sqrt((v-p)**2+4*R*R));if(!(_>1e-24))return null;const w=Math.sqrt(_),E=y/w,A=b/w,C=g/w,M=m/w,L=Math.sqrt(Math.max(0,1-E*E-C*C));let G=Math.sqrt(Math.max(0,1-A*A-M*M));-(E*A+C*M)<0&&(G=-G);const ce=[];for(const T of[1,-1]){const F=[E,C,T*L],I=[A,M,T*G],B=ve(F,I),P=[[F[0],I[0],B[0]],[F[1],I[1],B[1]],[F[2],I[2],B[2]]];ce.push(Ae(se(x,P)))}return ce}function Ge(t,e,n,r,i){let s=t,a=e,o=ie(s,a,n,r,i),c=.001;const h=i[0][0],d=i[1][1],x=i[0][1];for(let u=0;u<100&&Number.isFinite(o)&&o>1e-12;u++){const f=Array.from({length:6},()=>new Array(6).fill(0)),l=new Array(6).fill(0);for(let b=0;b<4;b++){const g=n[b],m=[0,1,2].map(A=>s[A][0]*g[0]+s[A][1]*g[1]+s[A][2]*g[2]),v=m[0]+a[0],R=m[1]+a[1],p=m[2]+a[2],_=[h*(v/p)+x*(R/p)+i[0][2]-r[b][0],d*(R/p)+i[1][2]-r[b][1]],w=[[h/p,x/p,-(h*v+x*R)/(p*p)],[0,d/p,-d*R/(p*p)]],E=[[0,m[2],-m[1]],[-m[2],0,m[0]],[m[1],-m[0],0]];for(let A=0;A<2;A++){const C=[...[0,1,2].map(M=>w[A][0]*E[0][M]+w[A][1]*E[1][M]+w[A][2]*E[2][M]),...w[A]];for(let M=0;M<6;M++){l[M]+=C[M]*_[A];for(let L=0;L<6;L++)f[M][L]+=C[M]*C[L]}}}let y=!1;for(let b=0;b<10;b++){const g=f.map((_,w)=>_.map((E,A)=>w===A?E*(1+c)+1e-18:E)),m=oe(g,l.map(_=>-_));if(!m){c*=10;continue}const v=Ae(se(Re(m.slice(0,3)),s)),R=[a[0]+m[3],a[1]+m[4],a[2]+m[5]],p=ie(v,R,n,r,i);if(p<o){const _=Math.hypot(...m);s=v,a=R;const w=(o-p)/Math.max(o,1e-300);o=p,c=Math.max(c/10,1e-12),y=_>1e-15&&w>1e-14;break}c*=10}if(!y)break}return{R:s,T:a}}function We(t,e,n){if(t.length!==4||!t.every(u=>u.length===2&&u.every(Number.isFinite)))throw new Error("cornersPx must be 4 finite [u, v]");if(!(e>0)||!(n[0][0]>0)||!(n[1][1]>0))throw new Error("sizeM and focal lengths must be positive");if(!Ue(t))return null;const r=Xe(e),i=t.map(u=>{const f=(u[1]-n[1][2])/n[1][1];return[(u[0]-n[0][2]-n[0][1]*f)/n[0][0],f]}),s=Ye(r,i);if(!s)return null;const a=[];for(const u of s){const f=He(u,r,i);if(!f||!(f[2]>0))continue;const{R:l,T:y}=Ge(u,f,r,t,n),b=ie(l,y,r,t,n);Number.isFinite(b)&&y[2]>0&&a.push({err:b,R:l,T:y})}if(!a.length)return null;a.sort((u,f)=>u.err-f.err);const{R:o,T:c}=a[0],d=o.map(u=>[u[0],u[2],-u[1]]).map((u,f)=>f===0?u:u.map(l=>-l));return{pose:{position:[c[0],-c[1],-c[2]],quaternion:qe(d)},reprojErrPx:a[0].err,altReprojErrPx:a.length>1?a[1].err:1/0}}const Ze=.1;function Y(t,e,n){if(t.length!==16)throw new Error("projection matrix must have 16 numbers");const r=Array.from(t);if(!r.every(Number.isFinite))throw new Error("projection matrix must be finite");if(!(e>0&&n>0))throw new Error("image size must be positive");const[i,s,a,o,c]=[r[0],r[4],r[8],r[5],r[9]];return Math.abs(r[11]+1)>1e-6||Math.abs(r[3])>1e-9||Math.abs(r[7])>1e-9||Math.abs(r[15])>1e-9||Math.abs(r[1])>1e-9||Math.abs(r[2])>1e-9||Math.abs(r[6])>1e-9||!(i>0&&o>0)||Math.abs(s)>1e-6*i?null:{fx:i*e/2,fy:o*n/2,cx:(1-a)*e/2-.5,cy:(1+c)*n/2-.5}}const $e=t=>[[t.fx,0,t.cx],[0,t.fy,t.cy],[0,0,1]];function Mt(t,e,n){if(![...t.position,...t.quaternion,...e.position,...e.quaternion,...n.position,...n.quaternion].every(Number.isFinite))throw new Error("non-finite input");const i=N(t.quaternion),s=N(e.quaternion),a=N(n.quaternion),o=j(j(s,H(i)),H(a)),c=S(o,[0,1,0]),h=Math.acos(Math.max(-1,Math.min(1,c[1])));if(Math.hypot(o[1],o[3])<1e-6)return null;const d=V(2*Math.atan2(o[1],o[3])),x=S(a,t.position),u=[x[0]+n.position[0],x[1]+n.position[1],x[2]+n.position[2]],f=k(d,u),l=e.position;return{yaw:d,t:[l[0]-f[0],l[1]-f[1],l[2]-f[2]],residualTiltRad:h}}function Je(t,e=[0,0,0],n=Ze){if(!t.length||!(n>0))return null;const r=[];for(const b of t){const g=b.weight??1;if(b.t.length!==3||![b.yaw,g,...b.t].every(Number.isFinite)||g<0)return null;r.push(g)}const i=r.reduce((b,g)=>b+g,0);if(!(i>0))return null;let s=0,a=0;t.forEach((b,g)=>{s+=r[g]*Math.sin(b.yaw),a+=r[g]*Math.cos(b.yaw)});const o=Math.hypot(s,a)/i;if(o<1e-9)return null;const c=Math.atan2(s,a),h=Math.sqrt(Math.max(0,-2*Math.log(Math.min(1,o)))),d=t.map(b=>{const g=k(b.yaw,e);return[g[0]+b.t[0],g[1]+b.t[1],g[2]+b.t[2]]});let x=[0,1,2].map(b=>d.reduce((g,m,v)=>g+r[v]*m[b],0)/i);const u=b=>Math.hypot(b[0]-x[0],b[1]-x[1],b[2]-x[2]);for(let b=0;b<200;b++){const g=d.map((p,_)=>{const w=u(p);return r[_]*(w>n?n/Math.max(w,1e-300):1)}),m=g.reduce((p,_)=>p+_,0),v=[0,1,2].map(p=>d.reduce((_,w,E)=>_+g[E]*w[p],0)/m),R=Math.hypot(v[0]-x[0],v[1]-x[1],v[2]-x[2])<1e-12;if(x=v,R)break}let f=0,l=0;d.forEach((b,g)=>{const m=u(b);f+=r[g]*m*m,m<=n&&r[g]>0&&l++});const y=k(c,e);return{yaw:c,t:[x[0]-y[0],x[1]-y[1],x[2]-y[2]],spreadYawRad:h,spreadM:Math.sqrt(f/i),inliers:l,n:t.length}}const Qe=V,Ke=t=>te(t),he=(t,e)=>j(t,e),et=(t,e)=>S(t,e),re=Ne,fe=(t,e)=>Le(t,e);function D(t,e){const n=k(t.yaw,e);return[n[0]+t.t[0],n[1]+t.t[1],n[2]+t.t[2]]}function tt(t){const e=k(-t.yaw,t.t);return{yaw:-t.yaw,t:[-e[0],-e[1],-e[2]]}}function ae(t,e){const n=S(t.quaternion,e.position);return{position:[t.position[0]+n[0],t.position[1]+n[1],t.position[2]+n[2]],quaternion:N(j(t.quaternion,e.quaternion))}}function nt(t){const e=H(t.quaternion),n=S(e,t.position);return{position:[-n[0],-n[1],-n[2]],quaternion:e}}function St(t,e,n){return We(t,e,$e(n))}function Tt(t,e,n,r){const i=n.position,s=[];for(const[x,u]of t){const f=S(n.quaternion,[(x-e.cx)/e.fx,-(u-e.cy)/e.fy,-1]);if(f[1]>-.05)return null;s.push([-f[0]/f[1],-1,-f[2]/f[1]])}let a=0;for(let x=0;x<4;x++)a+=Math.hypot(s[(x+1)%4][0]-s[x][0],s[(x+1)%4][2]-s[x][2]);const o=r/(a/4);if(!(o>.05&&o<6))return null;const c=s.map(x=>[i[0]+o*x[0],i[1]-o,i[2]+o*x[2]]);let h=0,d=0;for(let x=0;x<4;x++){const u=c[x],f=c[(x+1)%4];h+=u[0]*f[2]-f[0]*u[2],d=Math.max(d,Math.abs(Math.hypot(f[0]-u[0],f[2]-u[2])-r)/r)}for(const[x,u]of[[0,2],[1,3]])d=Math.max(d,Math.abs(Math.hypot(c[u][0]-c[x][0],c[u][2]-c[x][2])/Math.SQRT2-r)/r);return{points:c,signedArea:h/2,squareness:d,heightM:o}}function kt(t,e,n,r,i){const s=n.position,a=[];for(const[p,_]of t){const w=S(n.quaternion,[(p-e.cx)/e.fx,-(_-e.cy)/e.fy,-1]);if(w[1]>-.05)return null;a.push([-w[0]/w[1],-1,-w[2]/w[1]])}let o=0;for(let p=0;p<4;p++)o+=Math.hypot(a[(p+1)%4][0]-a[p][0],a[(p+1)%4][2]-a[p][2]);const c=i/(o/4);if(!(c>.1&&c<4))return null;const h=i/2,d=[[-h,0,-h],[h,0,-h],[h,0,h],[-h,0,h]],x=a.map(p=>[s[0]+c*p[0],s[1]-c,s[2]+c*p[2]]),u=d.map(p=>ae(r,{position:p,quaternion:[0,0,0,1]}).position),f=[0,1,2].map(p=>x.reduce((_,w)=>_+w[p],0)/4),l=[0,1,2].map(p=>u.reduce((_,w)=>_+w[p],0)/4);let y=0,b=0;for(let p=0;p<4;p++){const _=x[p][0]-f[0],w=x[p][2]-f[2],E=u[p][0]-l[0],A=u[p][2]-l[2];b+=E*_+A*w,y+=E*w-A*_}const g=Math.atan2(y,b),m=k(g,f),v=[l[0]-m[0],l[1]-m[1],l[2]-m[2]];let R=0;for(let p=0;p<4;p++){const _=D({yaw:g,t:v},x[p]);R+=(_[0]-u[p][0])**2+(_[2]-u[p][2])**2}return{mapFromXr:{yaw:g,t:v},markerXr:f,residualM:Math.sqrt(R/4),rangeM:Math.hypot(f[0]-s[0],f[1]-s[1],f[2]-s[2])}}const Ft={composeMapFromXr:Oe,solveTwo:ze,shouldRefuse:je,disagreement:we,fuseMarkerObservations:Je};function It(t){let e=0;for(let n=1;n<t.length;n++)e+=Math.hypot(t[n][0]-t[n-1][0],t[n][1]-t[n-1][1]);return e}function Ct(t,e){if(t.length===1)return{dist:Math.hypot(e[0]-t[0][0],e[1]-t[0][1]),along:0,seg:0,point:t[0]};let n={dist:1/0,along:0,seg:0,point:t[0]},r=0;for(let i=1;i<t.length;i++){const s=t[i-1],a=t[i],o=a[0]-s[0],c=a[1]-s[1],h=o*o+c*c,d=Math.sqrt(h),x=h>0?Math.max(0,Math.min(1,((e[0]-s[0])*o+(e[1]-s[1])*c)/h)):0,u=[s[0]+x*o,s[1]+x*c],f=Math.hypot(e[0]-u[0],e[1]-u[1]);f<n.dist-1e-9&&(n={dist:f,along:r+x*d,seg:i-1,point:u}),r+=d}return n}function ue(t,e){let n=0;for(let r=1;r<t.length;r++){const i=t[r-1],s=t[r],a=Math.hypot(s[0]-i[0],s[1]-i[1]);if(a!==0){if(n+a>=e||r===t.length-1){const o=Math.max(0,Math.min(1,(e-n)/a));return{point:[i[0]+o*(s[0]-i[0]),i[1]+o*(s[1]-i[1])],dir:[(s[0]-i[0])/a,(s[1]-i[1])/a]}}n+=a}}return{point:t[t.length-1],dir:[0,-1]}}function Dt(t,e=30*Math.PI/180){const n=[];let r=0;for(let i=1;i<t.length-1;i++){const s=t[i-1],a=t[i],o=t[i+1];r+=Math.hypot(a[0]-s[0],a[1]-s[1]);const c=Math.atan2(a[1]-s[1],a[0]-s[0]),h=Math.atan2(o[1]-a[1],o[0]-a[0]),d=Qe(h-c);if(Math.abs(d)>=e){const x=(a[0]-s[0])*(o[1]-a[1])-(a[1]-s[1])*(o[0]-a[0]);n.push({index:i,along:r,dir:x>0?"right":"left",angle:Math.abs(d)})}}return n}const Bt=(t,e)=>Math.atan2(-t,-e),Nt=(t,e)=>Math.hypot(t[0]-e[0],t[1]-e[1]);function Lt(t,e){const n=Math.max(1,Math.round(e));return`Turn ${t} in ${n} ${n===1?"metre":"metres"}`}const z={CHEVRON:0,LINE:1,RING:2,DEST:3,SQUARE:4},it=`#version 300 es
layout(location=0) in vec2 a_uv;
layout(location=1) in vec4 i_pose;   // x, z, dirX, dirZ (map frame)
layout(location=2) in vec4 i_param;  // halfAcross, halfAlong, kind, phase
layout(location=3) in vec4 i_color;  // rgb, alpha
uniform mat4 u_proj, u_view, u_model;
uniform float u_floorY;
out vec2 v_uv; out vec4 v_param; out vec4 v_color;
void main(){
  vec2 d = i_pose.zw;
  vec2 across = vec2(-d.y, d.x);
  vec2 p = i_pose.xy + across * a_uv.x * i_param.x + d * a_uv.y * i_param.y;
  gl_Position = u_proj * u_view * u_model * vec4(p.x, u_floorY + 0.01, p.y, 1.0);
  v_uv = a_uv; v_param = i_param; v_color = i_color;
}`,rt=`#version 300 es
precision mediump float;
in vec2 v_uv; in vec4 v_param; in vec4 v_color;
uniform float u_time;
out vec4 o;
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h); }
void main(){
  int kind = int(v_param.z + 0.5);
  float a = 0.0;
  if (kind == 0) {            // chevron pointing along +v
    vec2 q = vec2(abs(v_uv.x), v_uv.y);
    float d = seg(q, vec2(0.0, 0.55), vec2(0.9, -0.35));
    float core = smoothstep(0.17, 0.09, d);
    float glow = exp(-d * 5.0) * 0.55;
    float wave = fract(v_param.w * 0.6 - u_time * 1.4);   // bright band sweeping forward
    float pulse = 0.35 + 0.65 * pow(wave, 3.0);
    a = (core + glow) * pulse;
  } else if (kind == 1) {     // guide line
    float d = abs(v_uv.x);
    a = smoothstep(0.35, 0.0, d) * 0.8 + exp(-d * 3.0) * 0.25;
  } else if (kind == 2) {     // reticle ring
    float d = abs(length(v_uv) - 0.75);
    a = smoothstep(0.12, 0.04, d) + exp(-d * 8.0) * 0.4;
    a *= step(length(v_uv), 1.0);
    a += smoothstep(0.12, 0.05, length(v_uv));
  } else if (kind == 3) {     // destination: pulsing rings
    float r = length(v_uv);
    float ring = abs(fract(r * 2.0 - u_time * 0.8) - 0.5);
    a = smoothstep(0.12, 0.02, ring) * smoothstep(1.0, 0.6, r) + smoothstep(0.25, 0.15, r);
  } else {                    // square outline
    vec2 q = abs(v_uv);
    float d = abs(max(q.x, q.y) - 0.92);
    a = smoothstep(0.08, 0.02, d);
  }
  a *= v_color.a;
  o = vec4(v_color.rgb * a, a);   // premultiplied
}`,le=[.15,.95,1];class qt{constructor(e){this.gl=e,this.prog=O(e,it,rt);for(const r of["u_proj","u_view","u_model","u_floorY","u_time"])this.u[r]=e.getUniformLocation(this.prog,r);this.vao=e.createVertexArray(),e.bindVertexArray(this.vao);const n=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),this.inst=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.inst),e.bufferData(e.ARRAY_BUFFER,this.data.byteLength,e.DYNAMIC_DRAW);for(let r=0;r<3;r++)e.enableVertexAttribArray(1+r),e.vertexAttribPointer(1+r,4,e.FLOAT,!1,48,r*16),e.vertexAttribDivisor(1+r,1);e.bindVertexArray(null)}gl;prog;vao;inst;data=new Float32Array(12*512);count=0;u={};push(e,n,r,i,s,a,o,c,h,d){this.count>=512||(this.data.set([e,n,r,i,s,a,o,c,h[0],h[1],h[2],d],this.count*12),this.count++)}build(e){if(this.count=0,e.showArrows&&e.route&&e.route.length>1&&e.mapFromXr){const n=Math.max(0,e.along+.8),r=Math.min(e.routeLengthM,e.along+14);for(let i=Math.max(0,e.along);i<r;i+=.5){const s=ue(e.route,i+.25),a=1-Math.max(0,(i-e.along)/14);this.push(s.point[0],s.point[1],s.dir[0],s.dir[1],.035,.26,z.LINE,i,le,.55*a)}for(let i=n-n%.7;i<r;i+=.7){if(i<n)continue;const s=ue(e.route,i),a=Math.min(1,(i-e.along)/1.5)*(1-Math.max(0,(i-e.along-6)/8));this.push(s.point[0],s.point[1],s.dir[0],s.dir[1],.22,.2,z.CHEVRON,i,le,a)}}e.destination&&e.showArrows&&this.push(e.destination[0],e.destination[1],0,-1,.6,.6,z.DEST,0,[1,.25,.85],.9);for(const n of e.markerOutlines){const r=(n[0][0]+n[2][0])/2,i=(n[0][2]+n[2][2])/2,s=n[0][0]-n[3][0],a=n[0][2]-n[3][2],o=Math.hypot(s,a)||1;this.push(r,i,s/o,a/o,o/2/.92,o/2/.92,z.SQUARE,0,[1,.85,.2],.9)}if(e.reticle&&e.mapFromXr){const n=D(e.mapFromXr,e.reticle);this.push(n[0],n[2],0,-1,.12,.12,z.RING,0,e.reticleColor,1)}return this.count}draw(e,n,r,i,s){const a=this.gl;this.count&&(a.useProgram(this.prog),a.uniformMatrix4fv(this.u.u_proj,!1,e),a.uniformMatrix4fv(this.u.u_view,!1,n),a.uniformMatrix4fv(this.u.u_model,!1,at(tt(r??{yaw:0,t:[0,0,0]}))),a.uniform1f(this.u.u_floorY,i),a.uniform1f(this.u.u_time,s),a.bindVertexArray(this.vao),a.bindBuffer(a.ARRAY_BUFFER,this.inst),a.bufferSubData(a.ARRAY_BUFFER,0,this.data,0,this.count*12),a.disable(a.DEPTH_TEST),a.enable(a.BLEND),a.blendFunc(a.ONE,a.ONE_MINUS_SRC_ALPHA),a.drawArraysInstanced(a.TRIANGLE_STRIP,0,4,this.count),a.bindVertexArray(null))}}function at(t){const e=Math.cos(t.yaw),n=Math.sin(t.yaw);return new Float32Array([e,0,-n,0,0,1,0,0,n,0,e,0,t.t[0],t.t[1],t.t[2],1])}function O(t,e,n){const r=(s,a)=>{const o=t.createShader(s);if(t.shaderSource(o,a),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS))throw new Error(t.getShaderInfoLog(o)??"shader");return o},i=t.createProgram();if(t.attachShader(i,r(t.VERTEX_SHADER,e)),t.attachShader(i,r(t.FRAGMENT_SHADER,n)),t.linkProgram(i),!t.getProgramParameter(i,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(i)??"link");return i}function Z(t,e){const[n,r,i,s]=t;return new Float32Array([1-2*(r*r+i*i),2*(n*r+i*s),2*(n*i-r*s),0,2*(n*r-i*s),1-2*(n*n+i*i),2*(r*i+n*s),0,2*(n*i+r*s),2*(r*i-n*s),1-2*(n*n+r*r),0,e[0],e[1],e[2],1])}function $(t){const e=new Float32Array(16);return e[0]=t[0],e[1]=t[4],e[2]=t[8],e[4]=t[1],e[5]=t[5],e[6]=t[9],e[8]=t[2],e[9]=t[6],e[10]=t[10],e[12]=-(e[0]*t[12]+e[4]*t[13]+e[8]*t[14]),e[13]=-(e[1]*t[12]+e[5]*t[13]+e[9]*t[14]),e[14]=-(e[2]*t[12]+e[6]*t[13]+e[10]*t[14]),e[15]=1,e}function be(t,e,n=.05,r=100){const i=1/Math.tan(t/2);return new Float32Array([i/e,0,0,0,0,i,0,0,0,0,(r+n)/(n-r),-1,0,0,2*r*n/(n-r),0])}const st=`#version 300 es
uniform vec4 u_rect;
out vec2 v_uv;
void main(){ vec2 p = vec2(float((gl_VertexID<<1)&2), float(gl_VertexID&2)); v_uv = u_rect.xy + p * u_rect.zw; gl_Position = vec4(p*2.0-1.0, 0.0, 1.0); }`,ot=`#version 300 es
precision mediump float;
in vec2 v_uv; uniform sampler2D u_cam; out vec4 o;
void main(){ vec3 c = texture(u_cam, v_uv).rgb; float y = dot(c, vec3(0.299, 0.587, 0.114)); o = vec4(y, y, y, 1.0); }`,pe=t=>({position:[t.position.x,t.position.y,t.position.z],quaternion:[t.orientation.x,t.orientation.y,t.orientation.z,t.orientation.w]});class Pt{constructor(e={}){this.opts=e;const n=this.canvas.getContext("webgl2",{xrCompatible:!0,alpha:!0,antialias:!1,depth:!1});if(!n)throw new Error("WebGL2 unavailable");this.gl=n}opts;gl;onFrame=null;onCameraImage=null;onTap=null;onEnd=null;crop=null;lastError="";canvas=document.createElement("canvas");session=null;layer=null;ref=null;hitSource=null;binding=null;reticle=null;hz=5;ds=2;lastCapture=0;dsProg=null;fbo=null;fboTex=null;fboSize=[0,0];pbo=null;pending=null;requestCrop(e){this.crop=e}setCapture(e,n){this.hz=e,this.ds=n}async start(e){if(!navigator.xr)throw new Error("WebXR not available");const n={requiredFeatures:this.opts.requiredFeatures??["local-floor"],optionalFeatures:this.opts.optionalFeatures??["hit-test","anchors","dom-overlay","camera-access"],...this.opts.depthSensing?{depthSensing:this.opts.depthSensing}:{},domOverlay:{root:e}},r=await navigator.xr.requestSession("immersive-ar",n);this.session=r;const i=this.gl;await i.makeXRCompatible(),this.layer=new XRWebGLLayer(r,i,{alpha:!0,antialias:!1,depth:!1}),r.updateRenderState({baseLayer:this.layer}),this.ref=await r.requestReferenceSpace("local-floor");const s=await r.requestReferenceSpace("viewer"),a=[...r.enabledFeatures??[]];try{this.hitSource=await r.requestHitTestSource?.({space:s})??null}catch(h){this.lastError=`hit-test: ${h}`}const o=globalThis.XRWebGLBinding,c=a.includes("camera-access")&&!!o;return c&&o&&(this.binding=new o(r,i)),e.addEventListener("beforexrselect",h=>{h.target?.closest?.("[data-ui]")&&h.preventDefault()}),r.addEventListener("select",h=>{this.reticle&&this.onTap?.(this.reticle,(h.frame,performance.now()))}),r.addEventListener("end",()=>{this.session=null,this.hitSource=null,this.binding=null,this.pending=null,this.onEnd?.()}),r.requestAnimationFrame(this.loop),{cameraAccess:c,hitTest:!!this.hitSource,enabledFeatures:a}}end(){this.session?.end().catch(()=>{})}loop=(e,n)=>{const r=this.session;if(!r||!this.ref||!this.layer)return;r.requestAnimationFrame(this.loop);const i=this.gl,s=n.getViewerPose(this.ref);if(this.reticle=null,this.hitSource){const h=n.getHitTestResults(this.hitSource)[0]?.getPose(this.ref);h&&(this.reticle=[h.transform.position.x,h.transform.position.y,h.transform.position.z])}this.pollRead(e),i.bindFramebuffer(i.FRAMEBUFFER,this.layer.framebuffer),i.clearColor(0,0,0,0),i.clear(i.COLOR_BUFFER_BIT);const a=[];if(s){for(const h of s.views){const d=this.layer.getViewport(h);a.push({projection:h.projectionMatrix,viewMatrix:h.transform.inverse.matrix,viewport:[d.x,d.y,d.width,d.height],framebuffer:this.layer.framebuffer})}const c=s.views[0].camera;if(c&&this.binding&&this.onCameraImage&&!this.pending&&e-this.lastCapture>=1e3/this.hz&&!s.emulatedPosition){this.lastCapture=e;try{this.capture(c,s.views[0],e)}catch(h){this.lastError=`capture: ${h}`}}}const o={t:e,viewer:s?pe(s.transform):null,emulated:!!s?.emulatedPosition,views:a,reticle:this.reticle};if(i.bindFramebuffer(i.FRAMEBUFFER,this.layer.framebuffer),s&&this.opts.onXrFrame)try{this.opts.onXrFrame(n,s,this.ref)}catch(c){this.lastError=`onXrFrame: ${c}`}this.onFrame?.(o)};capture(e,n,r){const i=this.gl,s=this.binding.getCameraImage(e);if(!s)return;const a=this.crop;this.crop=null;const o=a?a.w:Math.max(64,Math.floor(e.width/this.ds)),c=a?a.h:Math.max(64,Math.floor(e.height/this.ds));this.dsProg||(this.dsProg=O(i,st,ot)),(!this.fbo||this.fboSize[0]!==o||this.fboSize[1]!==c)&&(this.fboTex=i.createTexture(),i.bindTexture(i.TEXTURE_2D,this.fboTex),i.texStorage2D(i.TEXTURE_2D,1,i.RGBA8,o,c),this.fbo=i.createFramebuffer(),i.bindFramebuffer(i.FRAMEBUFFER,this.fbo),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,this.fboTex,0),this.pbo=i.createBuffer(),i.bindBuffer(i.PIXEL_PACK_BUFFER,this.pbo),i.bufferData(i.PIXEL_PACK_BUFFER,o*c*4,i.STREAM_READ),i.bindBuffer(i.PIXEL_PACK_BUFFER,null),this.fboSize=[o,c]);const h=performance.now();i.bindFramebuffer(i.FRAMEBUFFER,this.fbo),i.viewport(0,0,o,c),i.disable(i.BLEND),i.useProgram(this.dsProg),i.uniform4f(i.getUniformLocation(this.dsProg,"u_rect"),a?a.x/e.width:0,a?a.yBuf/e.height:0,a?o/e.width:1,a?c/e.height:1),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,s),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.uniform1i(i.getUniformLocation(this.dsProg,"u_cam"),0),i.bindVertexArray(null),i.drawArrays(i.TRIANGLES,0,3),i.bindBuffer(i.PIXEL_PACK_BUFFER,this.pbo),i.readPixels(0,0,o,c,i.RGBA,i.UNSIGNED_BYTE,0),i.bindBuffer(i.PIXEL_PACK_BUFFER,null);const d=i.fenceSync(i.SYNC_FENCE,0),x=a?Y(n.projectionMatrix,e.width,e.height):Y(n.projectionMatrix,o,c);x&&(this.pending={sync:d,w:o,h:c,K:x,pose:pe(n.transform),t:r,t0:h,camW:e.width,camH:e.height,ds:a?1:this.ds,crop:a})}pollRead(e){const n=this.pending;if(!n)return;const r=this.gl,i=r.clientWaitSync(n.sync,0,0);if(i===r.TIMEOUT_EXPIRED||(r.deleteSync(n.sync),this.pending=null,i===r.WAIT_FAILED))return;const s=new Uint8Array(n.w*n.h*4);r.bindBuffer(r.PIXEL_PACK_BUFFER,this.pbo),r.getBufferSubData(r.PIXEL_PACK_BUFFER,0,s),r.bindBuffer(r.PIXEL_PACK_BUFFER,null),this.onCameraImage?.({t:n.t,rgba:s.buffer,width:n.w,height:n.h,K:n.K,xrFromView:n.pose,camW:n.camW,camH:n.camH,ds:n.ds,crop:n.crop,readMs:performance.now()-n.t0})}}function ct(t,e,n){const r=new Uint8Array(e*4);for(let i=0;i<n>>1;i++){const s=i*e*4,a=(n-1-i)*e*4;r.set(t.subarray(s,s+e*4)),t.copyWithin(s,a,a+e*4),t.set(r,a)}}const dt=`#version 300 es
layout(location=0) in vec3 a_pos; layout(location=1) in vec3 a_nrm;
layout(location=2) in vec3 i_c; layout(location=3) in vec3 i_s; layout(location=4) in vec3 i_col;
uniform mat4 u_pv; out vec3 v_n; out vec3 v_col; out vec3 v_w;
void main(){ vec3 w = i_c + a_pos * i_s; v_w = w; v_n = a_nrm; v_col = i_col; gl_Position = u_pv * vec4(w, 1.0); }`,xt=`#version 300 es
precision mediump float;
in vec3 v_n; in vec3 v_col; in vec3 v_w; out vec4 o;
void main(){
  float l = 0.45 + 0.55 * max(0.0, dot(normalize(v_n), normalize(vec3(0.4, 1.0, 0.3))));
  float shelfLine = step(0.92, fract(v_w.y * 2.5)) * 0.35;
  o = vec4(v_col * l * (1.0 - shelfLine), 1.0);
}`,ht=`#version 300 es
layout(location=0) in vec2 a_p; uniform mat4 u_pv; out vec2 v_p;
void main(){ v_p = a_p; gl_Position = u_pv * vec4(a_p.x, 0.0, a_p.y, 1.0); }`,ft=`#version 300 es
precision mediump float;
in vec2 v_p; out vec4 o;
void main(){
  vec2 g = abs(fract(v_p) - 0.5);
  float line = step(0.485, max(g.x, g.y));
  float chk = mod(floor(v_p.x * 2.0) + floor(v_p.y * 2.0), 2.0);
  o = vec4(vec3(0.62 + 0.04 * chk - 0.18 * line), 1.0);
}`,ut=`#version 300 es
layout(location=0) in vec2 a_uv;
layout(location=1) in vec4 i_m;  // x, z, yaw, id
layout(location=2) in vec4 i_q;  // halfW, halfH, offsetZ, kind
uniform mat4 u_pv; out vec2 v_uv; flat out int v_id; flat out int v_kind;
void main(){
  float lx = (a_uv.x * 2.0 - 1.0) * i_q.x;
  float lz = (a_uv.y * 2.0 - 1.0) * i_q.y + i_q.z;
  float c = cos(i_m.z), s = sin(i_m.z);
  vec3 w = vec3(i_m.x + c * lx + s * lz, 0.002 + 0.001 * i_q.w, i_m.y - s * lx + c * lz);
  v_uv = a_uv; v_id = int(i_m.w + 0.5); v_kind = int(i_q.w + 0.5);
  gl_Position = u_pv * vec4(w, 1.0);
}`,lt=`#version 300 es
precision mediump float;
in vec2 v_uv; flat in int v_id; flat in int v_kind; uniform sampler2D u_bits; out vec4 o;
void main(){
  if (v_kind == 0) { o = vec4(0.97, 0.97, 0.95, 1.0); return; }
  ivec2 cell = ivec2(floor(v_uv * 6.0));
  if (cell.x <= 0 || cell.y <= 0 || cell.x >= 5 || cell.y >= 5) { o = vec4(0.05, 0.05, 0.05, 1.0); return; }
  float b = texelFetch(u_bits, ivec2((cell.x - 1) + (cell.y - 1) * 4, v_id), 0).r;
  o = vec4(vec3(b > 0.5 ? 0.97 : 0.05), 1.0);
}`;class bt{constructor(e,n){this.gl=e,this.box=O(e,dt,xt),this.floor=O(e,ht,ft),this.mark=O(e,ut,lt);const r=[];if(n.shelves.length)for(const f of n.shelves)r.push((f.x0+f.x1)/2,f.h/2,(f.z0+f.z1)/2,f.x1-f.x0,f.h,f.z1-f.z0,...f.color);else if(n.grid){const f=n.grid;for(let l=0;l<f.height;l++){let y=0;for(;y<f.width;){if(f.occupancy[l*f.width+y]!==1){y++;continue}const b=y;for(;y<f.width&&f.occupancy[l*f.width+y]===1;)y++;const g=f.originX+b*f.cellSize,m=f.originX+y*f.cellSize;r.push((g+m)/2,.8,f.originZ+(l+.5)*f.cellSize,m-g,1.6,f.cellSize,.55,.6,.7)}}}this.boxCount=r.length/9,this.boxVao=e.createVertexArray(),e.bindVertexArray(this.boxVao);const{pos:i,nrm:s,idx:a}=mt();X(e,0,3,i),X(e,1,3,s);const o=e.createBuffer();e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,o),e.bufferData(e.ELEMENT_ARRAY_BUFFER,a,e.STATIC_DRAW);const c=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,c),e.bufferData(e.ARRAY_BUFFER,new Float32Array(r),e.STATIC_DRAW);for(let f=0;f<3;f++)e.enableVertexAttribArray(2+f),e.vertexAttribPointer(2+f,3,e.FLOAT,!1,36,f*12),e.vertexAttribDivisor(2+f,1);this.floorVao=e.createVertexArray(),e.bindVertexArray(this.floorVao);const h=60;X(e,0,2,new Float32Array([-h,-h,h,-h,-h,h,h,h])),this.markVao=e.createVertexArray(),e.bindVertexArray(this.markVao),X(e,0,2,new Float32Array([0,0,1,0,0,1,1,1]));const d=pt(n.markers);this.markCount=d.length/8;const x=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,x),e.bufferData(e.ARRAY_BUFFER,new Float32Array(d),e.STATIC_DRAW);for(let f=0;f<2;f++)e.enableVertexAttribArray(1+f),e.vertexAttribPointer(1+f,4,e.FLOAT,!1,32,f*16),e.vertexAttribDivisor(1+f,1);e.bindVertexArray(null);const u=new Uint8Array(800);for(let f=0;f<50;f++)ge(f).forEach((l,y)=>u[f*16+y]=l?255:0);this.bits=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.bits),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texImage2D(e.TEXTURE_2D,0,e.R8,16,50,0,e.RED,e.UNSIGNED_BYTE,u),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST)}gl;box;floor;mark;boxVao;boxCount;floorVao;markVao;markCount;bits;draw(e){const n=this.gl;n.clearColor(.13,.14,.17,1),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT),n.enable(n.DEPTH_TEST),n.disable(n.BLEND),n.useProgram(this.floor),n.uniformMatrix4fv(n.getUniformLocation(this.floor,"u_pv"),!1,e),n.bindVertexArray(this.floorVao),n.drawArrays(n.TRIANGLE_STRIP,0,4),n.useProgram(this.mark),n.uniformMatrix4fv(n.getUniformLocation(this.mark,"u_pv"),!1,e),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.bits),n.uniform1i(n.getUniformLocation(this.mark,"u_bits"),0),n.bindVertexArray(this.markVao),n.drawArraysInstanced(n.TRIANGLE_STRIP,0,4,this.markCount),this.boxCount&&(n.useProgram(this.box),n.uniformMatrix4fv(n.getUniformLocation(this.box,"u_pv"),!1,e),n.bindVertexArray(this.boxVao),n.drawElementsInstanced(n.TRIANGLES,36,n.UNSIGNED_SHORT,0,this.boxCount)),n.bindVertexArray(null),n.disable(n.DEPTH_TEST)}}function pt(t){const e=[],n=t.sizeM/2;for(const r of t.markers){const[i,,s]=r.pose.position,a=Ke(r.pose.quaternion);e.push(i,s,a,r.id,.105,.1485,-.0035,0),e.push(i,s,a,r.id,n,n,0,1)}return e}function X(t,e,n,r){const i=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,r,t.STATIC_DRAW),t.enableVertexAttribArray(e),t.vertexAttribPointer(e,n,t.FLOAT,!1,0,0)}function mt(){const t=[[[1,0,0],[0,1,0],[0,0,1]],[[-1,0,0],[0,1,0],[0,0,-1]],[[0,1,0],[0,0,1],[1,0,0]],[[0,-1,0],[0,0,-1],[1,0,0]],[[0,0,1],[1,0,0],[0,1,0]],[[0,0,-1],[-1,0,0],[0,1,0]]],e=[],n=[],r=[];return t.forEach(([i,s,a],o)=>{for(const[c,h]of[[-1,-1],[1,-1],[1,1],[-1,1]])e.push(.5*(i[0]+c*s[0]+h*a[0]),.5*(i[1]+c*s[1]+h*a[1]),.5*(i[2]+c*s[2]+h*a[2])),n.push(...i);r.push(o*4,o*4+1,o*4+2,o*4,o*4+2,o*4+3)}),{pos:new Float32Array(e),nrm:new Float32Array(n),idx:new Uint16Array(r)}}const me=62*Math.PI/180,J=1.45;class zt{constructor(e,n){this.canvas=e,this.store=n;const r=e.getContext("webgl2",{antialias:!0,alpha:!1,preserveDrawingBuffer:!0});if(!r)throw new Error("WebGL2 unavailable");this.gl=r,this.scene=new bt(r,n),this.rep=D(this.xrFromMap0,[this.truth.x,0,this.truth.z]),this.bindInput(),requestAnimationFrame(this.loop)}canvas;store;gl;onFrame=null;onCameraImage=null;onTap=null;onEnd=null;focusBlurPx=0;crop=null;drift={linearPct:0,yawDegPer10m:0,lost:!1};cameraAccess=!0;headings=[];truth={x:0,z:1.1,yaw:0,pitch:-.85};xrFromMap0={yaw:.9,t:[2.3,0,-1.7]};yawDrift=0;rep=[0,0,0];frozen=null;running=!1;keys=new Set;scene;hz=5;ds=2;lastCap=0;lastT=0;reticle=null;fbo=null;setCapture(e,n){this.hz=e,this.ds=n}async start(){return await new Promise(e=>setTimeout(e,400)),this.running=!0,{cameraAccess:this.cameraAccess,hitTest:!0,enabledFeatures:["local-floor","hit-test","anchors","dom-overlay",...this.cameraAccess?["camera-access"]:[]]}}end(){this.running&&(this.running=!1,this.xrFromMap0={yaw:this.xrFromMap0.yaw+1.1,t:[this.xrFromMap0.t[0]-1.3,0,this.xrFromMap0.t[2]+.7]},this.yawDrift=0,this.rep=D(this.xrFromMap0,[this.truth.x,0,this.truth.z]),setTimeout(()=>this.onEnd?.(),0))}teleport(e,n,r){this.truth={...this.truth,x:e,z:n,yaw:r},this.rep=D({yaw:this.xrFromMap0.yaw+this.yawDrift,t:[0,0,0]},[e,0,n]).map((i,s)=>i+(this.rep[s]-D({yaw:this.xrFromMap0.yaw+this.yawDrift,t:[0,0,0]},[this.truth.x,0,this.truth.z])[s])),this.rep=D(this.xrFromMap0,[e,0,n]),this.yawDrift=0}truePose(){const e=he(re(this.truth.yaw),fe([1,0,0],this.truth.pitch));return{position:[this.truth.x,J,this.truth.z],quaternion:e}}reportedPose(){const e=he(re(this.truth.yaw+this.xrFromMap0.yaw+this.yawDrift),fe([1,0,0],this.truth.pitch));return{position:[this.rep[0],J,this.rep[2]],quaternion:e}}walkable(e,n){const r=this.store.grid;if(!r)return!0;const i=Math.floor((e-r.originX)/r.cellSize),s=Math.floor((n-r.originZ)/r.cellSize);return i<0||s<0||i>=r.width||s>=r.height?!1:r.occupancy[s*r.width+i]===0&&r.clearanceMm[s*r.width+i]>=150}bindInput(){const e=r=>r.target?.closest?.("input, textarea, select");window.addEventListener("keydown",r=>{e(r)||(this.keys.add(r.key.toLowerCase()),r.key===" "&&(r.preventDefault(),this.reticle&&this.running&&this.onTap?.(this.reticle,performance.now())),r.key.toLowerCase()==="l"&&(this.drift.lost=!this.drift.lost))}),window.addEventListener("keyup",r=>this.keys.delete(r.key.toLowerCase()));let n=null;this.canvas.addEventListener("pointerdown",r=>n={x:r.clientX,y:r.clientY,moved:!1}),window.addEventListener("pointermove",r=>{if(!n)return;const i=r.clientX-n.x,s=r.clientY-n.y;Math.abs(i)+Math.abs(s)>3&&(n.moved=!0),this.truth.yaw-=i*.005,this.truth.pitch=Math.max(-1.45,Math.min(.3,this.truth.pitch-s*.004)),n.x=r.clientX,n.y=r.clientY}),window.addEventListener("pointerup",()=>{n&&!n.moved&&this.reticle&&this.running&&this.onTap?.(this.reticle,performance.now()),n=null})}step(e){const n=this.keys,r=(n.has("q")||n.has("arrowleft")?1:0)-(n.has("e")||n.has("arrowright")?1:0);this.truth.yaw+=r*1.4*e;const i=(n.has("r")||n.has("arrowup")?1:0)-(n.has("f")||n.has("arrowdown")?1:0);this.truth.pitch=Math.max(-1.45,Math.min(.3,this.truth.pitch+i*.9*e));const s=(n.has("w")?1:0)-(n.has("s")?1:0),a=(n.has("d")?1:0)-(n.has("a")?1:0);if(!s&&!a)return;const o=(n.has("shift")?2.4:1.2)*e,c=this.truth.yaw,h=(-Math.sin(c)*s+Math.cos(c)*a)*o,d=(-Math.cos(c)*s-Math.sin(c)*a)*o,x=this.truth.x+h,u=this.truth.z+d;this.walkable(x,u)&&(this.truth.x=x,this.truth.z=u,this.applyDrift(h,d))}applyDrift(e,n){const r=Math.hypot(e,n);this.yawDrift+=this.drift.yawDegPer10m*Math.PI/180/10*r;const i=D({yaw:this.xrFromMap0.yaw+this.yawDrift,t:[0,0,0]},[e,0,n]),s=1+this.drift.linearPct/100;this.rep=[this.rep[0]+i[0]*s,0,this.rep[2]+i[2]*s]}loop=e=>{requestAnimationFrame(this.loop);const n=Math.min(.05,(e-(this.lastT||e))/1e3);this.lastT=e,this.step(n),this.headings.push({t:e,yaw:this.truth.yaw}),this.headings.length>600&&this.headings.shift();const r=this.gl,i=Math.min(2,window.devicePixelRatio||1),s=Math.floor(this.canvas.clientWidth*i),a=Math.floor(this.canvas.clientHeight*i);(this.canvas.width!==s||this.canvas.height!==a)&&(this.canvas.width=s,this.canvas.height=a);const o=be(me,s/a),c=this.truePose(),h=ye(o,$(Z(c.quaternion,c.position)));r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,s,a),this.scene.draw(h);let d=this.reportedPose();this.drift.lost?d=this.frozen??(this.frozen=d):this.frozen=null,this.reticle=null;const x=et(c.quaternion,[0,0,-1]);if(x[1]<-.05){const u=J/-x[1],f=[c.position[0]+u*x[0],0,c.position[2]+u*x[2]],l=ae(nt(c),{position:f,quaternion:[0,0,0,1]}).position;this.reticle=ae(this.reportedPose(),{position:l,quaternion:[0,0,0,1]}).position}this.running&&(this.cameraAccess&&this.onCameraImage&&!this.drift.lost&&e-this.lastCap>=1e3/this.hz&&(this.lastCap=e,this.onCameraImage(this.captureTruth(o,this.reportedPose(),e)),r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,s,a)),this.onFrame?.({t:e,viewer:d,emulated:this.drift.lost,views:[{projection:o,viewMatrix:$(Z(d.quaternion,d.position)),viewport:[0,0,s,a],framebuffer:null}],reticle:this.reticle}))};captureTruth(e,n,r,i=!1){const s=this.gl,a=this.canvas.width,o=this.canvas.height,c=i?null:this.crop;i||(this.crop=null);const h=c?1:this.ds,d=Math.max(64,Math.floor(a/h)),x=Math.max(64,Math.floor(o/h));if(!this.fbo||this.fbo.w!==d||this.fbo.h!==x){const m=s.createFramebuffer();s.bindFramebuffer(s.FRAMEBUFFER,m);const v=s.createRenderbuffer();s.bindRenderbuffer(s.RENDERBUFFER,v),s.renderbufferStorage(s.RENDERBUFFER,s.RGBA8,d,x),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,v);const R=s.createRenderbuffer();s.bindRenderbuffer(s.RENDERBUFFER,R),s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_COMPONENT24,d,x),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,R),this.fbo={fb:m,w:d,h:x}}const u=performance.now();s.bindFramebuffer(s.FRAMEBUFFER,this.fbo.fb),s.viewport(0,0,d,x);const f=this.truePose();this.scene.draw(ye(e,$(Z(f.quaternion,f.position))));let l=new Uint8Array(d*x*4),y=d,b=x;if(c){const m=new Uint8Array(d*x*4);s.readPixels(0,0,d,x,s.RGBA,s.UNSIGNED_BYTE,m),y=Math.min(c.w,a-c.x),b=Math.min(c.h,o-c.yBuf),l=new Uint8Array(y*b*4);for(let v=0;v<b;v++)l.set(m.subarray(((c.yBuf+v)*d+c.x)*4,((c.yBuf+v)*d+c.x+y)*4),v*y*4)}else s.readPixels(0,0,d,x,s.RGBA,s.UNSIGNED_BYTE,l);this.focusBlurPx>0&&yt(l,y,b,this.focusBlurPx/h),i&&ct(l,y,b);const g=c?Y(e,a,o):Y(e,d,x);return{t:r,rgba:l.buffer,width:y,height:b,K:g,xrFromView:n,camW:a,camH:o,ds:h,crop:c?{...c,w:y,h:b}:null,readMs:performance.now()-u}}requestCrop(e){this.crop=e}captureForScan(e){const n=be(me,this.canvas.width/this.canvas.height),r=this.captureTruth(n,this.truePose(),e,!0);return{rgba:r.rgba,width:r.width,height:r.height,K:r.K,t:e}}headingDelta(e,n){const r=i=>this.headings.reduce((s,a)=>Math.abs(a.t-i)<Math.abs(s.t-i)?a:s,this.headings[0]);return this.headings.length?r(n).yaw-r(e).yaw:null}}function ye(t,e){const n=new Float32Array(16);for(let r=0;r<4;r++)for(let i=0;i<4;i++){let s=0;for(let a=0;a<4;a++)s+=t[a*4+i]*e[r*4+a];n[r*4+i]=s}return n}function yt(t,e,n,r){const i=Math.max(1,Math.round(Math.sqrt(12*r*r/3+1)/2)),s=new Float32Array(e*n);for(let o=0;o<e*n;o++)s[o]=t[o*4];const a=new Float32Array(e*n);for(let o=0;o<3;o++){for(let c=0;c<n;c++){let h=0;for(let d=-i;d<=i;d++)h+=s[c*e+Math.min(e-1,Math.max(0,d))];for(let d=0;d<e;d++)a[c*e+d]=h/(2*i+1),h+=s[c*e+Math.min(e-1,d+i+1)]-s[c*e+Math.max(0,d-i)]}for(let c=0;c<e;c++){let h=0;for(let d=-i;d<=i;d++)h+=a[Math.min(n-1,Math.max(0,d))*e+c];for(let d=0;d<n;d++)s[d*e+c]=h/(2*i+1),h+=a[Math.min(n-1,d+i+1)*e+c]-a[Math.max(0,d-i)*e+c]}}for(let o=0;o<e*n;o++)t[o*4]=t[o*4+1]=t[o*4+2]=s[o]}const Q=-6,gt=14,K=-22,wt=2,q=.1;function vt(){const t=[],e=[[-5,-4.2],[-2,-1.2],[1.2,2],[4.2,5],[7.2,8],[10.2,11]],n=[[-10.5,-3.5],[-18.5,-13.5]],r=[[.85,.45,.25],[.3,.6,.85],[.45,.75,.4],[.85,.75,.3],[.65,.45,.8],[.8,.35,.45]];e.forEach(([u,f],l)=>n.forEach(([y,b],g)=>t.push({x0:u,z0:y,x1:f,z1:b,h:1.8,color:r[(l+g)%r.length]}))),t.push({x0:8.5,z0:-1.2,x1:12.5,z1:-.6,h:1,color:[.6,.6,.65]});const i=Math.round((gt-Q)/q),s=Math.round((wt-K)/q),a=new Uint8Array(i*s);for(let u=0;u<s;u++)for(let f=0;f<i;f++){const l=Q+(f+.5)*q,y=K+(u+.5)*q,b=f===0||u===0||f===i-1||u===s-1,g=t.some(m=>l>=m.x0&&l<=m.x1&&y>=m.z0&&y<=m.z1);a[u*i+f]=b||g?1:0}const o={width:i,height:s,cellSize:q,originX:Q,originZ:K,floorY:0,occupancy:a,clearanceMm:_t(a,i,s,q)},c=(u,f,l,y,b)=>{const g=re(b),m=.09,v=Math.cos(b),R=Math.sin(b),p=(_,w)=>[l+v*_+R*w,0,y-R*_+v*w];return{id:u,label:f,pose:{position:[l,0,y],quaternion:g},corners:[p(-m,-m),p(m,-m),p(m,m),p(-m,m)],residualM:0,observations:0}},h={schema:"namma.markers/1",dictionary:"DICT_4X4_50",sizeM:.18,markers:[c(0,"M0 Entrance",0,0,0),c(1,"M1",0,-12,0),c(2,"M2",6,-12,-Math.PI/2),c(3,"M3",6,-2.5,Math.PI),c(4,"M4",-3,-20,Math.PI/2)]},d=(u,f,l,y,b,g,m,v=[])=>({id:u,name:f,kind:"product",aliases:v,categories:[],position:l,approach:y,facing:b,shelf:{aisle:g,level:m},source:"manual",confidence:1,confirmed:!0});return{storeId:"demo-mart",source:"demo-fallback",pois:{schema:"namma.pois/1",storeId:"demo-mart",updatedAt:"2026-09-14T00:00:00Z",pois:[d("poi_oats_01","Oats",[4.2,1.1,-16],[3.1,-16],-Math.PI/2,"A4",2,["rolled oats","oatmeal","jai"]),d("poi_rice_01","Basmati rice",[-1.2,.6,-6],[0,-6],Math.PI/2,"A2",1,["rice","chawal"]),d("poi_milk_01","Milk",[8,1,-21.8],[8,-20.6],0,"Dairy wall",2,["doodh","dairy"]),d("poi_tea_01","Tea",[-4.2,1.4,-15],[-3.1,-15],Math.PI/2,"A1",3,["chai"]),{...d("poi_checkout","Checkout",[10.5,1,-.9],[10.5,-2.2],Math.PI,"Front",0),kind:"checkout",shelf:void 0}]},markers:h,grid:o,shelves:t}}function _t(t,e,n,r){const i=e*n,s=new Int32Array(i).fill(-1),a=new Int32Array(i).fill(-1),o=new Float64Array(i).fill(1/0);for(let d=0;d<i;d++)t[d]!==0&&(s[d]=d%e,a[d]=d/e|0,o[d]=0);const c=(d,x)=>{if(s[x]<0)return;const u=d%e,f=d/e|0,l=(u-s[x])**2+(f-a[x])**2;l<o[d]&&(o[d]=l,s[d]=s[x],a[d]=a[x])};for(let d=0;d<n;d++)for(let x=0;x<e;x++){const u=d*e+x;x>0&&c(u,u-1),d>0&&c(u,u-e),x>0&&d>0&&c(u,u-e-1),x<e-1&&d>0&&c(u,u-e+1)}for(let d=n-1;d>=0;d--)for(let x=e-1;x>=0;x--){const u=d*e+x;x<e-1&&c(u,u+1),d<n-1&&c(u,u+e),x<e-1&&d<n-1&&c(u,u+e+1),x>0&&d<n-1&&c(u,u+e-1)}const h=new Uint16Array(i);for(let d=0;d<i;d++)h[d]=t[d]!==0?0:Math.min(65535,Math.max(0,Math.round((Math.sqrt(o[d])-.5)*r*1e3)));return h}async function ee(t){const e=await fetch(t);if(!e.ok)throw new Error(`${t}: ${e.status}`);return await e.json()}async function Ot(t,e){const n=`/namma-space-pages/app/stores/${encodeURIComponent(t)}/public/`;try{const r=await ee(n+"manifest.json"),[i,s]=await Promise.all([ee(n+r.pois),ee(n+r.markers)]);let a=null;try{const o=await fetch(n+r.navgrid.url);o.ok&&(a=Te(await o.arrayBuffer()))}catch{a=null}return i.pois=i.pois.filter(o=>o.confirmed),{storeId:t,source:"bundle",pois:i,markers:s,grid:a,shelves:[]}}catch{return vt()}}export{tt as A,pe as B,At as D,zt as E,qt as O,Pt as R,D as a,Qe as b,H as c,Ke as d,ue as e,qe as f,Bt as g,Lt as h,Nt as i,It as j,Et as k,Ot as l,j as m,N as n,St as o,Ct as p,Mt as q,S as r,kt as s,Dt as t,Ft as u,Tt as v,V as w,O as x,te as y,at as z};
