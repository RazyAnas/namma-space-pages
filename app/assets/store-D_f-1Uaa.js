import{A as kt,f as Ft,g as It,e as Ct}from"./navgrid-BNcFehwK.js";class Be{worker;nextId=1;pending=new Map;busy=!1;constructor(){this.worker=new Worker(new URL("/namma-space-pages/app/assets/detector.worker-BR3V1VUB.js",import.meta.url),{type:"module"}),this.worker.onmessage=t=>{this.busy=!1,t.data.error&&console.warn("[detector]",t.data.error),this.pending.get(t.data.id)?.(t.data),this.pending.delete(t.data.id)}}detect(t,e,r,i,o=!1){if(this.busy)return null;this.busy=!0;const s=this.nextId++;return new Promise(a=>{this.pending.set(s,a),this.worker.postMessage({id:s,width:e,height:r,data:t,mode:i,sharpness:o},[t])})}dispose(){this.worker.terminate()}}const Dt=`/*
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
`,Nt=`/*
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
`,Bt=`/*
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
};`;let H=null;function qt(){if(H)return H;const n={},t=e=>{throw new Error(`vendored js-aruco2 tried to require(${e}); load order is wrong`)};for(const e of[Dt,Nt,Bt])new Function("require",e).call(n,t);return n.AR.DICTIONARIES.DICT_4X4_50={nBits:16,tau:null,codeList:n.AR.DICTIONARIES.ARUCO_4X4_1000.codeList.slice(0,50)},H={AR:n.AR,CV:n.CV},H}function vt(n){const{AR:t}=qt(),r=new t.Dictionary("DICT_4X4_50").codeList[n];if(!r)throw new Error(`DICT_4X4_50 has no id ${n}`);return[...r].map(i=>i==="1"?1:0)}let $=null;function Lt(n){if(!$){const t=s=>[0,1,2,3].map(a=>s.slice(a*4,a*4+4)),e=s=>s[0].map((a,c)=>s.map(h=>h[c]).reverse()),r=Array.from({length:50},(s,a)=>t(vt(a))),i=s=>s.flat().join(""),o=new Map;r.forEach((s,a)=>{let c=s;for(let h=0;h<4;h++)o.set(i(c),a),c=e(c)}),$=r.map(s=>o.get(i([...s].reverse()))??null)}return $[n]??null}function qe(n,t=2){const{width:e,height:r,data:i}=n;let o=0,s=0,a=0;for(let h=1;h<r-1;h+=t)for(let d=1;d<e-1;d+=t){const x=(h*e+d)*4,f=i[x-4]+i[x+4]+i[x-e*4]+i[x+e*4]-4*i[x];s+=f,a+=f*f,o++}if(!o)return 0;const c=s/o;return a/o-c*c}function Le(n,t,e){const r=c=>c.some(h=>t.has(h.id)&&Lt(h.id)===null),i=r(n.asRead),o=r(n.flipped);if(i!==o)return o;if(i&&o)return null;const s=n.asRead.some(c=>t.has(c.id)&&e(c,!1)),a=n.flipped.some(c=>t.has(c.id)&&e(c,!0));return s!==a?a:null}const Pt=.2,ht=2*Math.PI;function C(n){const t=Math.hypot(n[0],n[1],n[2],n[3]);if(!Number.isFinite(t)||t<1e-12)throw new Error(`cannot normalize quaternion with norm ${t}`);return[n[0]/t,n[1]/t,n[2]/t,n[3]/t]}const zt=n=>[0,Math.sin(n/2),0,Math.cos(n/2)];function _t(n,t){const e=Math.hypot(n[0],n[1],n[2]);if(e<1e-12)throw new Error("zero rotation axis");const r=Math.sin(t/2)/e;return[n[0]*r,n[1]*r,n[2]*r,Math.cos(t/2)]}function P(n,t){const[e,r,i,o]=n,[s,a,c,h]=t;return[o*s+e*h+r*c-i*a,o*a-e*c+r*h+i*s,o*c+e*a-r*s+i*h,o*h-e*s-r*a-i*c]}const X=n=>[-n[0],-n[1],-n[2],n[3]];function S(n,t){const[e,r,i,o]=n,[s,a,c]=t,h=2*(r*c-i*a),d=2*(i*s-e*c),x=2*(e*a-r*s);return[s+o*h+(r*x-i*d),a+o*d+(i*h-e*x),c+o*x+(e*d-r*h)]}function at(n){let t=0;for(let s=0;s<3;s++)for(let a=0;a<3;a++){const c=n[s][0]*n[a][0]+n[s][1]*n[a][1]+n[s][2]*n[a][2];t=Math.max(t,Math.abs(c-(s===a?1:0)))}const e=n[0][0]*(n[1][1]*n[2][2]-n[1][2]*n[2][1])-n[0][1]*(n[1][0]*n[2][2]-n[1][2]*n[2][0])+n[0][2]*(n[1][0]*n[2][1]-n[1][1]*n[2][0]);if(!(t<=.001)||e<0)throw new Error("matrix is not a proper rotation");const r=n[0][0]+n[1][1]+n[2][2];let i;if(r>0){const s=.5/Math.sqrt(r+1);i=[(n[2][1]-n[1][2])*s,(n[0][2]-n[2][0])*s,(n[1][0]-n[0][1])*s,.25/s]}else if(n[0][0]>=n[1][1]&&n[0][0]>=n[2][2]){const s=2*Math.sqrt(1+n[0][0]-n[1][1]-n[2][2]);i=[.25*s,(n[1][0]+n[0][1])/s,(n[0][2]+n[2][0])/s,(n[2][1]-n[1][2])/s]}else if(n[1][1]>=n[2][2]){const s=2*Math.sqrt(1-n[0][0]+n[1][1]-n[2][2]);i=[(n[1][0]+n[0][1])/s,.25*s,(n[2][1]+n[1][2])/s,(n[0][2]-n[2][0])/s]}else{const s=2*Math.sqrt(1-n[0][0]-n[1][1]+n[2][2]);i=[(n[0][2]+n[2][0])/s,(n[2][1]+n[1][2])/s,.25*s,(n[1][0]-n[0][1])/s]}const o=C(i);return o[3]<0?[-o[0],-o[1],-o[2],-o[3]]:o}function q(n){let t=(n+Math.PI)%ht;return t!==0&&t<0&&(t+=ht),t-Math.PI}function B(n){const t=S(n,[0,0,-1]);if(Math.hypot(t[0],t[2])>=Pt)return Math.atan2(-t[0],-t[2]);let e=S(n,[0,1,0]);if(t[1]>0&&(e=[-e[0],-e[1],-e[2]]),Math.hypot(e[0],e[2])<1e-9)throw new Error("heading undefined");return Math.atan2(-e[0],-e[2])}const ft=.4,k=(n,t)=>{const e=Math.cos(n),r=Math.sin(n);return[e*t[0]+r*t[2],t[1],-r*t[0]+e*t[2]]};function Ot(n){if(n.length!==3||!n.every(Number.isFinite))throw new Error("expected a finite [x, y, z]")}function Vt(n,t,e,r){[n,t,e,r].forEach(Ot);const i=Math.atan2(e[0]-n[0],-(e[2]-n[2])),o=Math.atan2(r[0]-t[0],-(r[2]-t[2])),s=Math.hypot(e[0]-n[0],e[2]-n[2]),a=Math.hypot(r[0]-t[0],r[2]-t[2]);if(s<ft||a<ft||Math.abs(s-a)>Math.max(.5,.25*s))return null;const c=q(o-i),h=[0,1,2].map(f=>(n[f]+e[f])/2),d=[0,1,2].map(f=>(t[f]+r[f])/2),x=k(c,d);return{yaw:c,t:[h[0]-x[0],h[1]-x[1],h[2]-x[2]]}}function jt(n,t,e,r){if(![...n.position,...n.quaternion,...t.position,...t.quaternion,...r.position,...r.quaternion,e].every(Number.isFinite))throw new Error("non-finite input");const o=C(n.quaternion),s=C(t.quaternion),a=X(o),c=S(a,n.position).map(u=>-u),h=P(s,a),d=S(s,c),x=[t.position[0]+d[0],t.position[1]+d[1],t.position[2]+d[2]],f=q(B(h)+e-B(r.quaternion)),l=k(f,r.position);return{yaw:f,t:[x[0]-l[0],x[1]-l[1],x[2]-l[2]]}}function At(n,t,e=[0,0,0]){const r=k(n.yaw,e),i=k(t.yaw,e);return[Math.hypot(r[0]+n.t[0]-i[0]-t.t[0],r[1]+n.t[1]-i[1]-t.t[1],r[2]+n.t[2]-i[2]-t.t[2]),Math.abs(q(t.yaw-n.yaw))]}function Ut(n,t,e,r=kt,i=[0,0,0]){if(!t||!Number.isFinite(e)||e>r||![t.yaw,...t.t,...i,...n?[n.yaw,...n.t]:[]].every(Number.isFinite))return!0;if(!n)return!1;const[s,a]=At(n,t,i);return s>Ft||a>It}const ct=(n,t)=>n.map(e=>t[0].map((r,i)=>e.reduce((o,s,a)=>o+s*t[a][i],0))),Rt=(n,t)=>[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]],Et=(n,t)=>n.reduce((e,r,i)=>e+r*t[i],0),it=n=>Math.sqrt(Et(n,n));function dt(n,t){const e=t.length,r=n.map((s,a)=>[...s,t[a]]);let i=0;for(const s of n)for(const a of s)i=Math.max(i,Math.abs(a));for(let s=0;s<e;s++){let a=s;for(let c=s+1;c<e;c++)Math.abs(r[c][s])>Math.abs(r[a][s])&&(a=c);if(Math.abs(r[a][s])<=1e-14*(i||1))return null;[r[s],r[a]]=[r[a],r[s]];for(let c=s+1;c<e;c++){const h=r[c][s]/r[s][s];for(let d=s;d<=e;d++)r[c][d]-=h*r[s][d]}}const o=new Array(e).fill(0);for(let s=e-1;s>=0;s--){let a=r[s][e];for(let c=s+1;c<e;c++)a-=r[s][c]*o[c];o[s]=a/r[s][s]}return o}function Mt(n){const t=it(n);if(t<1e-12)return[[1,-n[2],n[1]],[n[2],1,-n[0]],[-n[1],n[0],1]];const e=n.map(a=>a/t),r=[[0,-e[2],e[1]],[e[2],0,-e[0]],[-e[1],e[0],0]],i=ct(r,r),o=Math.sin(t),s=1-Math.cos(t);return r.map((a,c)=>a.map((h,d)=>(c===d?1:0)+o*h+s*i[c][d]))}function St(n){const t=[n[0][0],n[1][0],n[2][0]],e=[n[0][1],n[1][1],n[2][1]],r=it(t),i=t.map(d=>d/r),o=Et(i,e),s=e.map((d,x)=>d-o*i[x]),a=it(s),c=s.map(d=>d/a),h=Rt(i,c);return[[i[0],c[0],h[0]],[i[1],c[1],h[1]],[i[2],c[2],h[2]]]}const Xt=16;function Ht(n){const t=[];let e=0;for(let r=0;r<4;r++){const i=n[r],o=n[(r+1)%4],s=n[(r+2)%4];t.push((o[0]-i[0])*(s[1]-o[1])-(o[1]-i[1])*(s[0]-o[0])),e+=i[0]*o[1]-o[0]*i[1]}return(t.every(r=>r>0)||t.every(r=>r<0))&&Math.abs(e)/2>=Xt}function Yt(n){const t=n/2;return[[-t,t,0],[t,t,0],[t,-t,0],[-t,-t,0]]}function rt(n,t,e,r,i){let o=0;for(let s=0;s<4;s++){const a=e[s],c=n[0][0]*a[0]+n[0][1]*a[1]+n[0][2]*a[2]+t[0],h=n[1][0]*a[0]+n[1][1]*a[1]+n[1][2]*a[2]+t[1],d=n[2][0]*a[0]+n[2][1]*a[1]+n[2][2]*a[2]+t[2];if(!(d>0))return 1/0;const x=i[0][0]*(c/d)+i[0][1]*(h/d)+i[0][2],f=i[1][1]*(h/d)+i[1][2];o+=(x-r[s][0])**2+(f-r[s][1])**2}return Math.sqrt(o/4)}function Gt(n,t,e){const r=[[0,0,0],[0,0,0],[0,0,0]],i=[0,0,0];for(let o=0;o<4;o++){const s=t[o],a=[0,1,2].map(x=>n[x][0]*s[0]+n[x][1]*s[1]+n[x][2]*s[2]),[c,h]=e[o],d=[[[1,0,-c],c*a[2]-a[0]],[[0,1,-h],h*a[2]-a[1]]];for(const[x,f]of d)for(let l=0;l<3;l++){i[l]+=x[l]*f;for(let u=0;u<3;u++)r[l][u]+=x[l]*x[u]}}return dt(r,i)}function Wt(n,t){const e=[],r=[];for(let T=0;T<4;T++){const[F,I]=n[T],[L,V]=t[T];e.push([F,I,1,0,0,0,-L*F,-L*I]),r.push(L),e.push([0,0,0,F,I,1,-V*F,-V*I]),r.push(V)}const i=dt(e,r);if(!i)return null;const o=[[i[0],i[1],i[2]],[i[3],i[4],i[5]],[i[6],i[7],1]],s=o[0][2],a=o[1][2],c=[[o[0][0]-o[2][0]*s,o[0][1]-o[2][1]*s],[o[1][0]-o[2][0]*a,o[1][1]-o[2][1]*a]],h=Math.sqrt(s*s+a*a+1),d=Math.hypot(s,a);let x;if(d<1e-12)x=[[1,0,0],[0,1,0],[0,0,1]];else{const T=Math.atan2(d/h,1/h);x=Mt([-a/d*T,s/d*T,0])}const f=[[x[0][0]-s*x[2][0],x[0][1]-s*x[2][1]],[x[1][0]-a*x[2][0],x[1][1]-a*x[2][1]]],l=f[0][0]*f[1][1]-f[0][1]*f[1][0];if(Math.abs(l)<1e-12)return null;const u=[[f[1][1]/l,-f[0][1]/l],[-f[1][0]/l,f[0][0]/l]],b=u[0][0]*c[0][0]+u[0][1]*c[1][0],p=u[0][0]*c[0][1]+u[0][1]*c[1][1],g=u[1][0]*c[0][0]+u[1][1]*c[1][0],y=u[1][0]*c[0][1]+u[1][1]*c[1][1],v=b*b+p*p,A=b*g+p*y,m=g*g+y*y,_=.5*(v+m+Math.sqrt((v-m)**2+4*A*A));if(!(_>1e-24))return null;const w=Math.sqrt(_),E=b/w,R=p/w,D=g/w,M=y/w,z=Math.sqrt(Math.max(0,1-E*E-D*D));let W=Math.sqrt(Math.max(0,1-R*R-M*M));-(E*R+D*M)<0&&(W=-W);const xt=[];for(const T of[1,-1]){const F=[E,D,T*z],I=[R,M,T*W],L=Rt(F,I),V=[[F[0],I[0],L[0]],[F[1],I[1],L[1]],[F[2],I[2],L[2]]];xt.push(St(ct(x,V)))}return xt}function $t(n,t,e,r,i){let o=n,s=t,a=rt(o,s,e,r,i),c=.001;const h=i[0][0],d=i[1][1],x=i[0][1];for(let f=0;f<100&&Number.isFinite(a)&&a>1e-12;f++){const l=Array.from({length:6},()=>new Array(6).fill(0)),u=new Array(6).fill(0);for(let p=0;p<4;p++){const g=e[p],y=[0,1,2].map(R=>o[R][0]*g[0]+o[R][1]*g[1]+o[R][2]*g[2]),v=y[0]+s[0],A=y[1]+s[1],m=y[2]+s[2],_=[h*(v/m)+x*(A/m)+i[0][2]-r[p][0],d*(A/m)+i[1][2]-r[p][1]],w=[[h/m,x/m,-(h*v+x*A)/(m*m)],[0,d/m,-d*A/(m*m)]],E=[[0,y[2],-y[1]],[-y[2],0,y[0]],[y[1],-y[0],0]];for(let R=0;R<2;R++){const D=[...[0,1,2].map(M=>w[R][0]*E[0][M]+w[R][1]*E[1][M]+w[R][2]*E[2][M]),...w[R]];for(let M=0;M<6;M++){u[M]+=D[M]*_[R];for(let z=0;z<6;z++)l[M][z]+=D[M]*D[z]}}}let b=!1;for(let p=0;p<10;p++){const g=l.map((_,w)=>_.map((E,R)=>w===R?E*(1+c)+1e-18:E)),y=dt(g,u.map(_=>-_));if(!y){c*=10;continue}const v=St(ct(Mt(y.slice(0,3)),o)),A=[s[0]+y[3],s[1]+y[4],s[2]+y[5]],m=rt(v,A,e,r,i);if(m<a){const _=Math.hypot(...y);o=v,s=A;const w=(a-m)/Math.max(a,1e-300);a=m,c=Math.max(c/10,1e-12),b=_>1e-15&&w>1e-14;break}c*=10}if(!b)break}return{R:o,T:s}}function Zt(n,t,e){if(n.length!==4||!n.every(f=>f.length===2&&f.every(Number.isFinite)))throw new Error("cornersPx must be 4 finite [u, v]");if(!(t>0)||!(e[0][0]>0)||!(e[1][1]>0))throw new Error("sizeM and focal lengths must be positive");if(!Ht(n))return null;const r=Yt(t),i=n.map(f=>{const l=(f[1]-e[1][2])/e[1][1];return[(f[0]-e[0][2]-e[0][1]*l)/e[0][0],l]}),o=Wt(r,i);if(!o)return null;const s=[];for(const f of o){const l=Gt(f,r,i);if(!l||!(l[2]>0))continue;const{R:u,T:b}=$t(f,l,r,n,e),p=rt(u,b,r,n,e);Number.isFinite(p)&&b[2]>0&&s.push({err:p,R:u,T:b})}if(!s.length)return null;s.sort((f,l)=>f.err-l.err);const{R:a,T:c}=s[0],d=a.map(f=>[f[0],f[2],-f[1]]).map((f,l)=>l===0?f:f.map(u=>-u));return{pose:{position:[c[0],-c[1],-c[2]],quaternion:at(d)},reprojErrPx:s[0].err,altReprojErrPx:s.length>1?s[1].err:1/0}}const Jt=.1;function G(n,t,e){if(n.length!==16)throw new Error("projection matrix must have 16 numbers");const r=Array.from(n);if(!r.every(Number.isFinite))throw new Error("projection matrix must be finite");if(!(t>0&&e>0))throw new Error("image size must be positive");const[i,o,s,a,c]=[r[0],r[4],r[8],r[5],r[9]];return Math.abs(r[11]+1)>1e-6||Math.abs(r[3])>1e-9||Math.abs(r[7])>1e-9||Math.abs(r[15])>1e-9||Math.abs(r[1])>1e-9||Math.abs(r[2])>1e-9||Math.abs(r[6])>1e-9||!(i>0&&a>0)||Math.abs(o)>1e-6*i?null:{fx:i*t/2,fy:a*e/2,cx:(1-s)*t/2-.5,cy:(1+c)*e/2-.5}}const Qt=n=>[[n.fx,0,n.cx],[0,n.fy,n.cy],[0,0,1]];function Pe(n,t,e){if(![...n.position,...n.quaternion,...t.position,...t.quaternion,...e.position,...e.quaternion].every(Number.isFinite))throw new Error("non-finite input");const i=C(n.quaternion),o=C(t.quaternion),s=C(e.quaternion),a=P(P(o,X(i)),X(s)),c=S(a,[0,1,0]),h=Math.acos(Math.max(-1,Math.min(1,c[1])));if(Math.hypot(a[1],a[3])<1e-6)return null;const d=q(2*Math.atan2(a[1],a[3])),x=S(s,n.position),f=[x[0]+e.position[0],x[1]+e.position[1],x[2]+e.position[2]],l=k(d,f),u=t.position;return{yaw:d,t:[u[0]-l[0],u[1]-l[1],u[2]-l[2]],residualTiltRad:h}}function Kt(n,t=[0,0,0],e=Jt){if(!n.length||!(e>0))return null;const r=[];for(const p of n){const g=p.weight??1;if(p.t.length!==3||![p.yaw,g,...p.t].every(Number.isFinite)||g<0)return null;r.push(g)}const i=r.reduce((p,g)=>p+g,0);if(!(i>0))return null;let o=0,s=0;n.forEach((p,g)=>{o+=r[g]*Math.sin(p.yaw),s+=r[g]*Math.cos(p.yaw)});const a=Math.hypot(o,s)/i;if(a<1e-9)return null;const c=Math.atan2(o,s),h=Math.sqrt(Math.max(0,-2*Math.log(Math.min(1,a)))),d=n.map(p=>{const g=k(p.yaw,t);return[g[0]+p.t[0],g[1]+p.t[1],g[2]+p.t[2]]});let x=[0,1,2].map(p=>d.reduce((g,y,v)=>g+r[v]*y[p],0)/i);const f=p=>Math.hypot(p[0]-x[0],p[1]-x[1],p[2]-x[2]);for(let p=0;p<200;p++){const g=d.map((m,_)=>{const w=f(m);return r[_]*(w>e?e/Math.max(w,1e-300):1)}),y=g.reduce((m,_)=>m+_,0),v=[0,1,2].map(m=>d.reduce((_,w,E)=>_+g[E]*w[m],0)/y),A=Math.hypot(v[0]-x[0],v[1]-x[1],v[2]-x[2])<1e-12;if(x=v,A)break}let l=0,u=0;d.forEach((p,g)=>{const y=f(p);l+=r[g]*y*y,y<=e&&r[g]>0&&u++});const b=k(c,t);return{yaw:c,t:[x[0]-b[0],x[1]-b[1],x[2]-b[2]],spreadYawRad:h,spreadM:Math.sqrt(l/i),inliers:u,n:n.length}}function te(n){const t=Math.hypot(n[0],n[1],n[2]);if(!Number.isFinite(t)||t<1e-12)throw new Error("zero normal");const e=[n[0]/t,n[1]/t,n[2]/t],r=e[1],i=[-e[2],0,e[0]],o=Math.hypot(i[0],i[1],i[2]);if(o<1e-12)return r>0?[[1,0,0],[0,1,0],[0,0,1]]:[[1,0,0],[0,-1,0],[0,0,-1]];const s=i.map(c=>c/o),a=[[0,-s[2],s[1]],[s[2],0,-s[0]],[-s[1],s[0],0]];return a.map((c,h)=>c.map((d,x)=>(h===x?1:0)+o*d+(1-r)*(a[h][0]*a[0][x]+a[h][1]*a[1][x]+a[h][2]*a[2][x])))}const Z=Math.PI/180;function Tt(n,t,e){const r=n*Z,i=t*Z,o=e*Z,s=Math.cos(r),a=Math.sin(r),c=Math.cos(i),h=Math.sin(i),d=Math.cos(o),x=Math.sin(o),f=[[s*d-a*h*x,-a*c,s*x+a*h*d],[a*d+s*h*x,s*c,a*x-s*h*d],[-c*x,h,c*d]];return at([f[0],f[2],f[1].map(l=>-l)])}class ze{constructor(t={}){this.opts=t,this.ori=[],this.gyro=[],this.lastSource=null}get maxGap(){return this.opts.maxGapMs??200}prune(t,e){const r=this.opts.keepMs??2e4;for(;t.length&&t[0].t<e-r;)t.shift()}addOrientation(t,e,r,i){if(e==null||r==null||i==null||![t,e,r,i].every(Number.isFinite))return;const o=Tt(e,r,i);this.ori.push({t,yaw:B(o),q:o}),this.prune(this.ori,t)}addGyro(t,e,r,i,o){if(![t,e,r,i].every(Number.isFinite))return;const s=o&&o.every(Number.isFinite)&&Math.hypot(...o)>1e-6?o.slice(0,3):void 0;this.gyro.push({t,w:[e,r,i],up:s}),this.prune(this.gyro,t)}reset(){this.ori=[],this.gyro=[],this.lastSource=null}window(t,e,r){if(!t.length)return null;let i=-1;for(let a=0;a<t.length;a++)t[a].t<=e&&(i=a);i<0&&(i=0);let o=-1;for(let a=t.length-1;a>=0;a--)t[a].t>=r&&(o=a);if(o<0&&(o=t.length-1),Math.abs(t[i].t-e)>this.maxGap||Math.abs(t[o].t-r)>this.maxGap||o<i)return null;const s=t.slice(i,o+1);for(let a=1;a<s.length;a++)if(s[a].t-s[a-1].t>this.maxGap)return null;return s}deltaYaw(t,e){if(!(e>=t))throw new Error("t1Ms must be >= t0Ms");const r=this.window(this.ori,t,e);if(r){let o=0;for(let s=1;s<r.length;s++)o+=q(r[s].yaw-r[s-1].yaw);return this.lastSource="orientation",o}const i=this.window(this.gyro,t,e);if(i){const o=i.find(f=>f.up)?.up??this.upFromOrientation(t);if(!o)return this.lastSource=null;let s=at(te(o)),c=B(s),h=0;const d=(f,l)=>{if(l<=0)return;const u=l/1e3,b=Math.hypot(f[0],f[1],f[2])*u,p=b>1e-12?Math.sin(b/2)/(b/u):u/2;s=C(P(s,[f[0]*p,f[1]*p,f[2]*p,Math.cos(b/2)]));const g=B(s);h+=q(g-c),c=g};i[0].t>t&&d(i[0].w,i[0].t-t);for(let f=0;f+1<i.length;f++){const l=Math.max(i[f].t,t),u=Math.min(i[f+1].t,e),b=[(i[f].w[0]+i[f+1].w[0])/2,(i[f].w[1]+i[f+1].w[1])/2,(i[f].w[2]+i[f+1].w[2])/2];d(b,u-l)}const x=i[i.length-1];return x.t<e&&d(x.w,e-x.t),this.lastSource="gyroscope",h}return this.lastSource=null,null}upFromOrientation(t){let e=null;for(const r of this.ori)(!e||Math.abs(r.t-t)<Math.abs(e.t-t))&&(e=r);return!e||Math.abs(e.t-t)>this.maxGap?null:S(X(e.q),[0,1,0])}}const ee=q,ne=n=>B(n),lt=(n,t)=>P(n,t),ie=(n,t)=>S(n,t),st=zt,ut=(n,t)=>_t(n,t);function N(n,t){const e=k(n.yaw,t);return[e[0]+n.t[0],e[1]+n.t[1],e[2]+n.t[2]]}function re(n){const t=k(-n.yaw,n.t);return{yaw:-n.yaw,t:[-t[0],-t[1],-t[2]]}}function ot(n,t){const e=S(n.quaternion,t.position);return{position:[n.position[0]+e[0],n.position[1]+e[1],n.position[2]+e[2]],quaternion:C(P(n.quaternion,t.quaternion))}}function se(n){const t=X(n.quaternion),e=S(t,n.position);return{position:[-e[0],-e[1],-e[2]],quaternion:t}}function Oe(n,t,e){return Zt(n,t,Qt(e))}function Ve(n,t,e,r){const i=e.position,o=[];for(const[x,f]of n){const l=S(e.quaternion,[(x-t.cx)/t.fx,-(f-t.cy)/t.fy,-1]);if(l[1]>-.05)return null;o.push([-l[0]/l[1],-1,-l[2]/l[1]])}let s=0;for(let x=0;x<4;x++)s+=Math.hypot(o[(x+1)%4][0]-o[x][0],o[(x+1)%4][2]-o[x][2]);const a=r/(s/4);if(!(a>.05&&a<6))return null;const c=o.map(x=>[i[0]+a*x[0],i[1]-a,i[2]+a*x[2]]);let h=0,d=0;for(let x=0;x<4;x++){const f=c[x],l=c[(x+1)%4];h+=f[0]*l[2]-l[0]*f[2],d=Math.max(d,Math.abs(Math.hypot(l[0]-f[0],l[2]-f[2])-r)/r)}for(const[x,f]of[[0,2],[1,3]])d=Math.max(d,Math.abs(Math.hypot(c[f][0]-c[x][0],c[f][2]-c[x][2])/Math.SQRT2-r)/r);return{points:c,signedArea:h/2,squareness:d,heightM:a}}function je(n,t,e,r,i){const o=e.position,s=[];for(const[m,_]of n){const w=S(e.quaternion,[(m-t.cx)/t.fx,-(_-t.cy)/t.fy,-1]);if(w[1]>-.05)return null;s.push([-w[0]/w[1],-1,-w[2]/w[1]])}let a=0;for(let m=0;m<4;m++)a+=Math.hypot(s[(m+1)%4][0]-s[m][0],s[(m+1)%4][2]-s[m][2]);const c=i/(a/4);if(!(c>.1&&c<4))return null;const h=i/2,d=[[-h,0,-h],[h,0,-h],[h,0,h],[-h,0,h]],x=s.map(m=>[o[0]+c*m[0],o[1]-c,o[2]+c*m[2]]),f=d.map(m=>ot(r,{position:m,quaternion:[0,0,0,1]}).position),l=[0,1,2].map(m=>x.reduce((_,w)=>_+w[m],0)/4),u=[0,1,2].map(m=>f.reduce((_,w)=>_+w[m],0)/4);let b=0,p=0;for(let m=0;m<4;m++){const _=x[m][0]-l[0],w=x[m][2]-l[2],E=f[m][0]-u[0],R=f[m][2]-u[2];p+=E*_+R*w,b+=E*w-R*_}const g=Math.atan2(b,p),y=k(g,l),v=[u[0]-y[0],u[1]-y[1],u[2]-y[2]];let A=0;for(let m=0;m<4;m++){const _=N({yaw:g,t:v},x[m]);A+=(_[0]-f[m][0])**2+(_[2]-f[m][2])**2}return{mapFromXr:{yaw:g,t:v},markerXr:l,residualM:Math.sqrt(A/4),rangeM:Math.hypot(l[0]-o[0],l[1]-o[1],l[2]-o[2])}}const Ue={composeMapFromXr:jt,solveTwo:Vt,shouldRefuse:Ut,disagreement:At,fuseMarkerObservations:Kt};function Xe(n){let t=0;for(let e=1;e<n.length;e++)t+=Math.hypot(n[e][0]-n[e-1][0],n[e][1]-n[e-1][1]);return t}function He(n,t){if(n.length===1)return{dist:Math.hypot(t[0]-n[0][0],t[1]-n[0][1]),along:0,seg:0,point:n[0]};let e={dist:1/0,along:0,seg:0,point:n[0]},r=0;for(let i=1;i<n.length;i++){const o=n[i-1],s=n[i],a=s[0]-o[0],c=s[1]-o[1],h=a*a+c*c,d=Math.sqrt(h),x=h>0?Math.max(0,Math.min(1,((t[0]-o[0])*a+(t[1]-o[1])*c)/h)):0,f=[o[0]+x*a,o[1]+x*c],l=Math.hypot(t[0]-f[0],t[1]-f[1]);l<e.dist-1e-9&&(e={dist:l,along:r+x*d,seg:i-1,point:f}),r+=d}return e}function pt(n,t){let e=0;for(let r=1;r<n.length;r++){const i=n[r-1],o=n[r],s=Math.hypot(o[0]-i[0],o[1]-i[1]);if(s!==0){if(e+s>=t||r===n.length-1){const a=Math.max(0,Math.min(1,(t-e)/s));return{point:[i[0]+a*(o[0]-i[0]),i[1]+a*(o[1]-i[1])],dir:[(o[0]-i[0])/s,(o[1]-i[1])/s]}}e+=s}}return{point:n[n.length-1],dir:[0,-1]}}function Ye(n,t=30*Math.PI/180){const e=[];let r=0;for(let i=1;i<n.length-1;i++){const o=n[i-1],s=n[i],a=n[i+1];r+=Math.hypot(s[0]-o[0],s[1]-o[1]);const c=Math.atan2(s[1]-o[1],s[0]-o[0]),h=Math.atan2(a[1]-s[1],a[0]-s[0]),d=ee(h-c);if(Math.abs(d)>=t){const x=(s[0]-o[0])*(a[1]-s[1])-(s[1]-o[1])*(a[0]-s[0]);e.push({index:i,along:r,dir:x>0?"right":"left",angle:Math.abs(d)})}}return e}const Ge=(n,t)=>Math.atan2(-n,-t),We=(n,t)=>Math.hypot(n[0]-t[0],n[1]-t[1]);function $e(n,t){const e=Math.max(1,Math.round(t));return`Turn ${n} in ${e} ${e===1?"metre":"metres"}`}const j={CHEVRON:0,LINE:1,RING:2,DEST:3,SQUARE:4},oe=`#version 300 es
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
}`,ae=`#version 300 es
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
}`,bt=[.15,.95,1];class Ze{constructor(t){this.gl=t,this.prog=U(t,oe,ae);for(const r of["u_proj","u_view","u_model","u_floorY","u_time"])this.u[r]=t.getUniformLocation(this.prog,r);this.vao=t.createVertexArray(),t.bindVertexArray(this.vao);const e=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,e),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),this.inst=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.inst),t.bufferData(t.ARRAY_BUFFER,this.data.byteLength,t.DYNAMIC_DRAW);for(let r=0;r<3;r++)t.enableVertexAttribArray(1+r),t.vertexAttribPointer(1+r,4,t.FLOAT,!1,48,r*16),t.vertexAttribDivisor(1+r,1);t.bindVertexArray(null)}gl;prog;vao;inst;data=new Float32Array(12*512);count=0;u={};push(t,e,r,i,o,s,a,c,h,d){this.count>=512||(this.data.set([t,e,r,i,o,s,a,c,h[0],h[1],h[2],d],this.count*12),this.count++)}build(t){if(this.count=0,t.showArrows&&t.route&&t.route.length>1&&t.mapFromXr){const e=Math.max(0,t.along+.8),r=Math.min(t.routeLengthM,t.along+14);for(let i=Math.max(0,t.along);i<r;i+=.5){const o=pt(t.route,i+.25),s=1-Math.max(0,(i-t.along)/14);this.push(o.point[0],o.point[1],o.dir[0],o.dir[1],.035,.26,j.LINE,i,bt,.55*s)}for(let i=e-e%.7;i<r;i+=.7){if(i<e)continue;const o=pt(t.route,i),s=Math.min(1,(i-t.along)/1.5)*(1-Math.max(0,(i-t.along-6)/8));this.push(o.point[0],o.point[1],o.dir[0],o.dir[1],.22,.2,j.CHEVRON,i,bt,s)}}t.destination&&t.showArrows&&this.push(t.destination[0],t.destination[1],0,-1,.6,.6,j.DEST,0,[1,.25,.85],.9);for(const e of t.markerOutlines){const r=(e[0][0]+e[2][0])/2,i=(e[0][2]+e[2][2])/2,o=e[0][0]-e[3][0],s=e[0][2]-e[3][2],a=Math.hypot(o,s)||1;this.push(r,i,o/a,s/a,a/2/.92,a/2/.92,j.SQUARE,0,[1,.85,.2],.9)}if(t.reticle&&t.mapFromXr){const e=N(t.mapFromXr,t.reticle);this.push(e[0],e[2],0,-1,.12,.12,j.RING,0,t.reticleColor,1)}return this.count}draw(t,e,r,i,o){const s=this.gl;this.count&&(s.useProgram(this.prog),s.uniformMatrix4fv(this.u.u_proj,!1,t),s.uniformMatrix4fv(this.u.u_view,!1,e),s.uniformMatrix4fv(this.u.u_model,!1,ce(re(r??{yaw:0,t:[0,0,0]}))),s.uniform1f(this.u.u_floorY,i),s.uniform1f(this.u.u_time,o),s.bindVertexArray(this.vao),s.bindBuffer(s.ARRAY_BUFFER,this.inst),s.bufferSubData(s.ARRAY_BUFFER,0,this.data,0,this.count*12),s.disable(s.DEPTH_TEST),s.enable(s.BLEND),s.blendFunc(s.ONE,s.ONE_MINUS_SRC_ALPHA),s.drawArraysInstanced(s.TRIANGLE_STRIP,0,4,this.count),s.bindVertexArray(null))}}function ce(n){const t=Math.cos(n.yaw),e=Math.sin(n.yaw);return new Float32Array([t,0,-e,0,0,1,0,0,e,0,t,0,n.t[0],n.t[1],n.t[2],1])}function U(n,t,e){const r=(o,s)=>{const a=n.createShader(o);if(n.shaderSource(a,s),n.compileShader(a),!n.getShaderParameter(a,n.COMPILE_STATUS))throw new Error(n.getShaderInfoLog(a)??"shader");return a},i=n.createProgram();if(n.attachShader(i,r(n.VERTEX_SHADER,t)),n.attachShader(i,r(n.FRAGMENT_SHADER,e)),n.linkProgram(i),!n.getProgramParameter(i,n.LINK_STATUS))throw new Error(n.getProgramInfoLog(i)??"link");return i}function J(n,t){const[e,r,i,o]=n;return new Float32Array([1-2*(r*r+i*i),2*(e*r+i*o),2*(e*i-r*o),0,2*(e*r-i*o),1-2*(e*e+i*i),2*(r*i+e*o),0,2*(e*i+r*o),2*(r*i-e*o),1-2*(e*e+r*r),0,t[0],t[1],t[2],1])}function Q(n){const t=new Float32Array(16);return t[0]=n[0],t[1]=n[4],t[2]=n[8],t[4]=n[1],t[5]=n[5],t[6]=n[9],t[8]=n[2],t[9]=n[6],t[10]=n[10],t[12]=-(t[0]*n[12]+t[4]*n[13]+t[8]*n[14]),t[13]=-(t[1]*n[12]+t[5]*n[13]+t[9]*n[14]),t[14]=-(t[2]*n[12]+t[6]*n[13]+t[10]*n[14]),t[15]=1,t}function mt(n,t,e=.05,r=100){const i=1/Math.tan(n/2);return new Float32Array([i/t,0,0,0,0,i,0,0,0,0,(r+e)/(e-r),-1,0,0,2*r*e/(e-r),0])}const de=`#version 300 es
uniform vec4 u_rect;
out vec2 v_uv;
void main(){ vec2 p = vec2(float((gl_VertexID<<1)&2), float(gl_VertexID&2)); v_uv = u_rect.xy + p * u_rect.zw; gl_Position = vec4(p*2.0-1.0, 0.0, 1.0); }`,xe=`#version 300 es
precision mediump float;
in vec2 v_uv; uniform sampler2D u_cam; out vec4 o;
void main(){ vec3 c = texture(u_cam, v_uv).rgb; float y = dot(c, vec3(0.299, 0.587, 0.114)); o = vec4(y, y, y, 1.0); }`,yt=n=>({position:[n.position.x,n.position.y,n.position.z],quaternion:[n.orientation.x,n.orientation.y,n.orientation.z,n.orientation.w]});class Je{constructor(t={}){this.opts=t;const e=this.canvas.getContext("webgl2",{xrCompatible:!0,alpha:!0,antialias:!1,depth:!1});if(!e)throw new Error("WebGL2 unavailable");this.gl=e}opts;gl;onFrame=null;onCameraImage=null;onTap=null;onEnd=null;crop=null;lastError="";canvas=document.createElement("canvas");session=null;layer=null;ref=null;hitSource=null;binding=null;reticle=null;hz=5;ds=2;lastCapture=0;dsProg=null;fbo=null;fboTex=null;fboSize=[0,0];pbo=null;pending=null;requestCrop(t){this.crop=t}setCapture(t,e){this.hz=t,this.ds=e}async start(t){if(!navigator.xr)throw new Error("WebXR not available");const e={requiredFeatures:this.opts.requiredFeatures??["local-floor"],optionalFeatures:this.opts.optionalFeatures??["hit-test","anchors","dom-overlay","camera-access"],...this.opts.depthSensing?{depthSensing:this.opts.depthSensing}:{},domOverlay:{root:t}},r=await navigator.xr.requestSession("immersive-ar",e);this.session=r;const i=this.gl;await i.makeXRCompatible(),this.layer=new XRWebGLLayer(r,i,{alpha:!0,antialias:!1,depth:!1}),r.updateRenderState({baseLayer:this.layer}),this.ref=await r.requestReferenceSpace("local-floor");const o=await r.requestReferenceSpace("viewer"),s=[...r.enabledFeatures??[]];try{this.hitSource=await r.requestHitTestSource?.({space:o})??null}catch(h){this.lastError=`hit-test: ${h}`}const a=globalThis.XRWebGLBinding,c=s.includes("camera-access")&&!!a;return c&&a&&(this.binding=new a(r,i)),t.addEventListener("beforexrselect",h=>{h.target?.closest?.("[data-ui]")&&h.preventDefault()}),r.addEventListener("select",h=>{this.reticle&&this.onTap?.(this.reticle,(h.frame,performance.now()))}),r.addEventListener("end",()=>{this.session=null,this.hitSource=null,this.binding=null,this.pending=null,this.onEnd?.()}),r.requestAnimationFrame(this.loop),{cameraAccess:c,hitTest:!!this.hitSource,enabledFeatures:s}}end(){this.session?.end().catch(()=>{})}loop=(t,e)=>{const r=this.session;if(!r||!this.ref||!this.layer)return;r.requestAnimationFrame(this.loop);const i=this.gl;this.stats.frames++;let o;try{o=e.getViewerPose(this.ref)??void 0}catch(c){this.fail("getViewerPose",c)}if(o||this.stats.poseNull++,this.reticle=null,this.hitSource)try{const h=e.getHitTestResults(this.hitSource)[0]?.getPose(this.ref);h&&(this.reticle=[h.transform.position.x,h.transform.position.y,h.transform.position.z])}catch(c){this.fail("hit-test",c)}try{this.pollRead(t)}catch(c){this.fail("pollRead",c)}i.bindFramebuffer(i.FRAMEBUFFER,this.layer.framebuffer),i.clearColor(0,0,0,0),i.clear(i.COLOR_BUFFER_BIT);const s=[];if(o){for(const h of o.views){const d=this.layer.getViewport(h);s.push({projection:h.projectionMatrix,viewMatrix:h.transform.inverse.matrix,viewport:[d.x,d.y,d.width,d.height],framebuffer:this.layer.framebuffer})}const c=o.views[0].camera;if(c&&this.binding&&this.onCameraImage&&!this.pending&&t-this.lastCapture>=1e3/this.hz&&!o.emulatedPosition){this.lastCapture=t;try{this.capture(c,o.views[0],t)}catch(h){this.lastError=`capture: ${h}`}}}const a={t,viewer:o?yt(o.transform):null,emulated:!!o?.emulatedPosition,views:s,reticle:this.reticle};if(i.bindFramebuffer(i.FRAMEBUFFER,this.layer.framebuffer),o&&this.opts.onXrFrame)try{this.opts.onXrFrame(e,o,this.ref)}catch(c){this.lastError=`onXrFrame: ${c}`}try{this.onFrame?.(a)}catch(c){this.fail("onFrame",c)}};stats={frames:0,poseNull:0,errors:0,lastErrorAt:""};fail(t,e){this.stats.errors++,this.stats.lastErrorAt=t,this.lastError=`${t}: ${String(e?.message??e)}`}capture(t,e,r){const i=this.gl,o=this.binding.getCameraImage(t);if(!o)return;const s=this.crop;this.crop=null;const a=s?s.w:Math.max(64,Math.floor(t.width/this.ds)),c=s?s.h:Math.max(64,Math.floor(t.height/this.ds));this.dsProg||(this.dsProg=U(i,de,xe)),(!this.fbo||this.fboSize[0]!==a||this.fboSize[1]!==c)&&(this.fboTex=i.createTexture(),i.bindTexture(i.TEXTURE_2D,this.fboTex),i.texStorage2D(i.TEXTURE_2D,1,i.RGBA8,a,c),this.fbo=i.createFramebuffer(),i.bindFramebuffer(i.FRAMEBUFFER,this.fbo),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,this.fboTex,0),this.pbo=i.createBuffer(),i.bindBuffer(i.PIXEL_PACK_BUFFER,this.pbo),i.bufferData(i.PIXEL_PACK_BUFFER,a*c*4,i.STREAM_READ),i.bindBuffer(i.PIXEL_PACK_BUFFER,null),this.fboSize=[a,c]);const h=performance.now();i.bindFramebuffer(i.FRAMEBUFFER,this.fbo),i.viewport(0,0,a,c),i.disable(i.BLEND),i.useProgram(this.dsProg),i.uniform4f(i.getUniformLocation(this.dsProg,"u_rect"),s?s.x/t.width:0,s?s.yBuf/t.height:0,s?a/t.width:1,s?c/t.height:1),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,o),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.uniform1i(i.getUniformLocation(this.dsProg,"u_cam"),0),i.bindVertexArray(null),i.drawArrays(i.TRIANGLES,0,3),i.bindBuffer(i.PIXEL_PACK_BUFFER,this.pbo),i.readPixels(0,0,a,c,i.RGBA,i.UNSIGNED_BYTE,0),i.bindBuffer(i.PIXEL_PACK_BUFFER,null);const d=i.fenceSync(i.SYNC_FENCE,0),x=s?G(e.projectionMatrix,t.width,t.height):G(e.projectionMatrix,a,c);x&&(this.pending={sync:d,w:a,h:c,K:x,pose:yt(e.transform),t:r,t0:h,camW:t.width,camH:t.height,ds:s?1:this.ds,crop:s})}pollRead(t){const e=this.pending;if(!e)return;const r=this.gl,i=r.clientWaitSync(e.sync,0,0);if(i===r.TIMEOUT_EXPIRED||(r.deleteSync(e.sync),this.pending=null,i===r.WAIT_FAILED))return;const o=new Uint8Array(e.w*e.h*4);r.bindBuffer(r.PIXEL_PACK_BUFFER,this.pbo),r.getBufferSubData(r.PIXEL_PACK_BUFFER,0,o),r.bindBuffer(r.PIXEL_PACK_BUFFER,null),this.onCameraImage?.({t:e.t,rgba:o.buffer,width:e.w,height:e.h,K:e.K,xrFromView:e.pose,camW:e.camW,camH:e.camH,ds:e.ds,crop:e.crop,readMs:performance.now()-e.t0})}}function he(n,t,e){const r=new Uint8Array(t*4);for(let i=0;i<e>>1;i++){const o=i*t*4,s=(e-1-i)*t*4;r.set(n.subarray(o,o+t*4)),n.copyWithin(o,s,s+t*4),n.set(r,s)}}const fe=`#version 300 es
layout(location=0) in vec3 a_pos; layout(location=1) in vec3 a_nrm;
layout(location=2) in vec3 i_c; layout(location=3) in vec3 i_s; layout(location=4) in vec3 i_col;
uniform mat4 u_pv; out vec3 v_n; out vec3 v_col; out vec3 v_w;
void main(){ vec3 w = i_c + a_pos * i_s; v_w = w; v_n = a_nrm; v_col = i_col; gl_Position = u_pv * vec4(w, 1.0); }`,le=`#version 300 es
precision mediump float;
in vec3 v_n; in vec3 v_col; in vec3 v_w; out vec4 o;
void main(){
  float l = 0.45 + 0.55 * max(0.0, dot(normalize(v_n), normalize(vec3(0.4, 1.0, 0.3))));
  float shelfLine = step(0.92, fract(v_w.y * 2.5)) * 0.35;
  o = vec4(v_col * l * (1.0 - shelfLine), 1.0);
}`,ue=`#version 300 es
layout(location=0) in vec2 a_p; uniform mat4 u_pv; out vec2 v_p;
void main(){ v_p = a_p; gl_Position = u_pv * vec4(a_p.x, 0.0, a_p.y, 1.0); }`,pe=`#version 300 es
precision mediump float;
in vec2 v_p; out vec4 o;
void main(){
  vec2 g = abs(fract(v_p) - 0.5);
  float line = step(0.485, max(g.x, g.y));
  float chk = mod(floor(v_p.x * 2.0) + floor(v_p.y * 2.0), 2.0);
  o = vec4(vec3(0.62 + 0.04 * chk - 0.18 * line), 1.0);
}`,be=`#version 300 es
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
}`,me=`#version 300 es
precision mediump float;
in vec2 v_uv; flat in int v_id; flat in int v_kind; uniform sampler2D u_bits; out vec4 o;
void main(){
  if (v_kind == 0) { o = vec4(0.97, 0.97, 0.95, 1.0); return; }
  ivec2 cell = ivec2(floor(v_uv * 6.0));
  if (cell.x <= 0 || cell.y <= 0 || cell.x >= 5 || cell.y >= 5) { o = vec4(0.05, 0.05, 0.05, 1.0); return; }
  float b = texelFetch(u_bits, ivec2((cell.x - 1) + (cell.y - 1) * 4, v_id), 0).r;
  o = vec4(vec3(b > 0.5 ? 0.97 : 0.05), 1.0);
}`;class ye{constructor(t,e){this.gl=t,this.box=U(t,fe,le),this.floor=U(t,ue,pe),this.mark=U(t,be,me);const r=[];if(e.shelves.length)for(const l of e.shelves)r.push((l.x0+l.x1)/2,l.h/2,(l.z0+l.z1)/2,l.x1-l.x0,l.h,l.z1-l.z0,...l.color);else if(e.grid){const l=e.grid;for(let u=0;u<l.height;u++){let b=0;for(;b<l.width;){if(l.occupancy[u*l.width+b]!==1){b++;continue}const p=b;for(;b<l.width&&l.occupancy[u*l.width+b]===1;)b++;const g=l.originX+p*l.cellSize,y=l.originX+b*l.cellSize;r.push((g+y)/2,.8,l.originZ+(u+.5)*l.cellSize,y-g,1.6,l.cellSize,.55,.6,.7)}}}this.boxCount=r.length/9,this.boxVao=t.createVertexArray(),t.bindVertexArray(this.boxVao);const{pos:i,nrm:o,idx:s}=we();Y(t,0,3,i),Y(t,1,3,o);const a=t.createBuffer();t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,a),t.bufferData(t.ELEMENT_ARRAY_BUFFER,s,t.STATIC_DRAW);const c=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,c),t.bufferData(t.ARRAY_BUFFER,new Float32Array(r),t.STATIC_DRAW);for(let l=0;l<3;l++)t.enableVertexAttribArray(2+l),t.vertexAttribPointer(2+l,3,t.FLOAT,!1,36,l*12),t.vertexAttribDivisor(2+l,1);this.floorVao=t.createVertexArray(),t.bindVertexArray(this.floorVao);const h=60;Y(t,0,2,new Float32Array([-h,-h,h,-h,-h,h,h,h])),this.markVao=t.createVertexArray(),t.bindVertexArray(this.markVao),Y(t,0,2,new Float32Array([0,0,1,0,0,1,1,1]));const d=ge(e.markers);this.markCount=d.length/8;const x=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,x),t.bufferData(t.ARRAY_BUFFER,new Float32Array(d),t.STATIC_DRAW);for(let l=0;l<2;l++)t.enableVertexAttribArray(1+l),t.vertexAttribPointer(1+l,4,t.FLOAT,!1,32,l*16),t.vertexAttribDivisor(1+l,1);t.bindVertexArray(null);const f=new Uint8Array(800);for(let l=0;l<50;l++)vt(l).forEach((u,b)=>f[l*16+b]=u?255:0);this.bits=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.bits),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texImage2D(t.TEXTURE_2D,0,t.R8,16,50,0,t.RED,t.UNSIGNED_BYTE,f),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST)}gl;box;floor;mark;boxVao;boxCount;floorVao;markVao;markCount;bits;draw(t){const e=this.gl;e.clearColor(.13,.14,.17,1),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.enable(e.DEPTH_TEST),e.disable(e.BLEND),e.useProgram(this.floor),e.uniformMatrix4fv(e.getUniformLocation(this.floor,"u_pv"),!1,t),e.bindVertexArray(this.floorVao),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.useProgram(this.mark),e.uniformMatrix4fv(e.getUniformLocation(this.mark,"u_pv"),!1,t),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.bits),e.uniform1i(e.getUniformLocation(this.mark,"u_bits"),0),e.bindVertexArray(this.markVao),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,this.markCount),this.boxCount&&(e.useProgram(this.box),e.uniformMatrix4fv(e.getUniformLocation(this.box,"u_pv"),!1,t),e.bindVertexArray(this.boxVao),e.drawElementsInstanced(e.TRIANGLES,36,e.UNSIGNED_SHORT,0,this.boxCount)),e.bindVertexArray(null),e.disable(e.DEPTH_TEST)}}function ge(n){const t=[],e=n.sizeM/2;for(const r of n.markers){const[i,,o]=r.pose.position,s=ne(r.pose.quaternion);t.push(i,o,s,r.id,.105,.1485,-.0035,0),t.push(i,o,s,r.id,e,e,0,1)}return t}function Y(n,t,e,r){const i=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,i),n.bufferData(n.ARRAY_BUFFER,r,n.STATIC_DRAW),n.enableVertexAttribArray(t),n.vertexAttribPointer(t,e,n.FLOAT,!1,0,0)}function we(){const n=[[[1,0,0],[0,1,0],[0,0,1]],[[-1,0,0],[0,1,0],[0,0,-1]],[[0,1,0],[0,0,1],[1,0,0]],[[0,-1,0],[0,0,-1],[1,0,0]],[[0,0,1],[1,0,0],[0,1,0]],[[0,0,-1],[-1,0,0],[0,1,0]]],t=[],e=[],r=[];return n.forEach(([i,o,s],a)=>{for(const[c,h]of[[-1,-1],[1,-1],[1,1],[-1,1]])t.push(.5*(i[0]+c*o[0]+h*s[0]),.5*(i[1]+c*o[1]+h*s[1]),.5*(i[2]+c*o[2]+h*s[2])),e.push(...i);r.push(a*4,a*4+1,a*4+2,a*4,a*4+2,a*4+3)}),{pos:new Float32Array(t),nrm:new Float32Array(e),idx:new Uint16Array(r)}}const gt=62*Math.PI/180,K=1.45;class Qe{constructor(t,e){this.canvas=t,this.store=e;const r=t.getContext("webgl2",{antialias:!0,alpha:!1,preserveDrawingBuffer:!0});if(!r)throw new Error("WebGL2 unavailable");this.gl=r,this.scene=new ye(r,e),this.rep=N(this.xrFromMap0,[this.truth.x,0,this.truth.z]),this.bindInput(),requestAnimationFrame(this.loop)}canvas;store;gl;onFrame=null;onCameraImage=null;onTap=null;onEnd=null;focusBlurPx=0;crop=null;drift={linearPct:0,yawDegPer10m:0,lost:!1};cameraAccess=!0;headings=[];truth={x:0,z:1.1,yaw:0,pitch:-.85};xrFromMap0={yaw:.9,t:[2.3,0,-1.7]};yawDrift=0;rep=[0,0,0];frozen=null;running=!1;keys=new Set;scene;hz=5;ds=2;lastCap=0;lastT=0;reticle=null;fbo=null;setCapture(t,e){this.hz=t,this.ds=e}async start(){return await new Promise(t=>setTimeout(t,400)),this.running=!0,{cameraAccess:this.cameraAccess,hitTest:!0,enabledFeatures:["local-floor","hit-test","anchors","dom-overlay",...this.cameraAccess?["camera-access"]:[]]}}end(){this.running&&(this.running=!1,this.xrFromMap0={yaw:this.xrFromMap0.yaw+1.1,t:[this.xrFromMap0.t[0]-1.3,0,this.xrFromMap0.t[2]+.7]},this.yawDrift=0,this.rep=N(this.xrFromMap0,[this.truth.x,0,this.truth.z]),setTimeout(()=>this.onEnd?.(),0))}teleport(t,e,r){this.truth={...this.truth,x:t,z:e,yaw:r},this.rep=N({yaw:this.xrFromMap0.yaw+this.yawDrift,t:[0,0,0]},[t,0,e]).map((i,o)=>i+(this.rep[o]-N({yaw:this.xrFromMap0.yaw+this.yawDrift,t:[0,0,0]},[this.truth.x,0,this.truth.z])[o])),this.rep=N(this.xrFromMap0,[t,0,e]),this.yawDrift=0}truePose(){const t=lt(st(this.truth.yaw),ut([1,0,0],this.truth.pitch));return{position:[this.truth.x,K,this.truth.z],quaternion:t}}reportedPose(){const t=lt(st(this.truth.yaw+this.xrFromMap0.yaw+this.yawDrift),ut([1,0,0],this.truth.pitch));return{position:[this.rep[0],K,this.rep[2]],quaternion:t}}walkable(t,e){const r=this.store.grid;if(!r)return!0;const i=Math.floor((t-r.originX)/r.cellSize),o=Math.floor((e-r.originZ)/r.cellSize);return i<0||o<0||i>=r.width||o>=r.height?!1:r.occupancy[o*r.width+i]===0&&r.clearanceMm[o*r.width+i]>=150}bindInput(){const t=r=>r.target?.closest?.("input, textarea, select");window.addEventListener("keydown",r=>{t(r)||(this.keys.add(r.key.toLowerCase()),r.key===" "&&(r.preventDefault(),this.reticle&&this.running&&this.onTap?.(this.reticle,performance.now())),r.key.toLowerCase()==="l"&&(this.drift.lost=!this.drift.lost))}),window.addEventListener("keyup",r=>this.keys.delete(r.key.toLowerCase()));let e=null;this.canvas.addEventListener("pointerdown",r=>e={x:r.clientX,y:r.clientY,moved:!1}),window.addEventListener("pointermove",r=>{if(!e)return;const i=r.clientX-e.x,o=r.clientY-e.y;Math.abs(i)+Math.abs(o)>3&&(e.moved=!0),this.truth.yaw-=i*.005,this.truth.pitch=Math.max(-1.45,Math.min(.3,this.truth.pitch-o*.004)),e.x=r.clientX,e.y=r.clientY}),window.addEventListener("pointerup",()=>{e&&!e.moved&&this.reticle&&this.running&&this.onTap?.(this.reticle,performance.now()),e=null})}step(t){const e=this.keys,r=(e.has("q")||e.has("arrowleft")?1:0)-(e.has("e")||e.has("arrowright")?1:0);this.truth.yaw+=r*1.4*t;const i=(e.has("r")||e.has("arrowup")?1:0)-(e.has("f")||e.has("arrowdown")?1:0);this.truth.pitch=Math.max(-1.45,Math.min(.3,this.truth.pitch+i*.9*t));const o=(e.has("w")?1:0)-(e.has("s")?1:0),s=(e.has("d")?1:0)-(e.has("a")?1:0);if(!o&&!s)return;const a=(e.has("shift")?2.4:1.2)*t,c=this.truth.yaw,h=(-Math.sin(c)*o+Math.cos(c)*s)*a,d=(-Math.cos(c)*o-Math.sin(c)*s)*a,x=this.truth.x+h,f=this.truth.z+d;this.walkable(x,f)&&(this.truth.x=x,this.truth.z=f,this.applyDrift(h,d))}applyDrift(t,e){const r=Math.hypot(t,e);this.yawDrift+=this.drift.yawDegPer10m*Math.PI/180/10*r;const i=N({yaw:this.xrFromMap0.yaw+this.yawDrift,t:[0,0,0]},[t,0,e]),o=1+this.drift.linearPct/100;this.rep=[this.rep[0]+i[0]*o,0,this.rep[2]+i[2]*o]}loop=t=>{requestAnimationFrame(this.loop);const e=Math.min(.05,(t-(this.lastT||t))/1e3);this.lastT=t,this.step(e),this.headings.push({t,yaw:this.truth.yaw}),this.headings.length>600&&this.headings.shift();const r=this.gl,i=Math.min(2,window.devicePixelRatio||1),o=Math.floor(this.canvas.clientWidth*i),s=Math.floor(this.canvas.clientHeight*i);(this.canvas.width!==o||this.canvas.height!==s)&&(this.canvas.width=o,this.canvas.height=s);const a=mt(gt,o/s),c=this.truePose(),h=wt(a,Q(J(c.quaternion,c.position)));r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,o,s),this.scene.draw(h);let d=this.reportedPose();this.drift.lost?d=this.frozen??(this.frozen=d):this.frozen=null,this.reticle=null;const x=ie(c.quaternion,[0,0,-1]);if(x[1]<-.05){const f=K/-x[1],l=[c.position[0]+f*x[0],0,c.position[2]+f*x[2]],u=ot(se(c),{position:l,quaternion:[0,0,0,1]}).position;this.reticle=ot(this.reportedPose(),{position:u,quaternion:[0,0,0,1]}).position}this.running&&(this.cameraAccess&&this.onCameraImage&&!this.drift.lost&&t-this.lastCap>=1e3/this.hz&&(this.lastCap=t,this.onCameraImage(this.captureTruth(a,this.reportedPose(),t)),r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,o,s)),this.onFrame?.({t,viewer:d,emulated:this.drift.lost,views:[{projection:a,viewMatrix:Q(J(d.quaternion,d.position)),viewport:[0,0,o,s],framebuffer:null}],reticle:this.reticle}))};captureTruth(t,e,r,i=!1){const o=this.gl,s=this.canvas.width,a=this.canvas.height,c=i?null:this.crop;i||(this.crop=null);const h=c?1:this.ds,d=Math.max(64,Math.floor(s/h)),x=Math.max(64,Math.floor(a/h));if(!this.fbo||this.fbo.w!==d||this.fbo.h!==x){const y=o.createFramebuffer();o.bindFramebuffer(o.FRAMEBUFFER,y);const v=o.createRenderbuffer();o.bindRenderbuffer(o.RENDERBUFFER,v),o.renderbufferStorage(o.RENDERBUFFER,o.RGBA8,d,x),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.RENDERBUFFER,v);const A=o.createRenderbuffer();o.bindRenderbuffer(o.RENDERBUFFER,A),o.renderbufferStorage(o.RENDERBUFFER,o.DEPTH_COMPONENT24,d,x),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.RENDERBUFFER,A),this.fbo={fb:y,w:d,h:x}}const f=performance.now();o.bindFramebuffer(o.FRAMEBUFFER,this.fbo.fb),o.viewport(0,0,d,x);const l=this.truePose();this.scene.draw(wt(t,Q(J(l.quaternion,l.position))));let u=new Uint8Array(d*x*4),b=d,p=x;if(c){const y=new Uint8Array(d*x*4);o.readPixels(0,0,d,x,o.RGBA,o.UNSIGNED_BYTE,y),b=Math.min(c.w,s-c.x),p=Math.min(c.h,a-c.yBuf),u=new Uint8Array(b*p*4);for(let v=0;v<p;v++)u.set(y.subarray(((c.yBuf+v)*d+c.x)*4,((c.yBuf+v)*d+c.x+b)*4),v*b*4)}else o.readPixels(0,0,d,x,o.RGBA,o.UNSIGNED_BYTE,u);this.focusBlurPx>0&&ve(u,b,p,this.focusBlurPx/h),i&&he(u,b,p);const g=c?G(t,s,a):G(t,d,x);return{t:r,rgba:u.buffer,width:b,height:p,K:g,xrFromView:e,camW:s,camH:a,ds:h,crop:c?{...c,w:b,h:p}:null,readMs:performance.now()-f}}requestCrop(t){this.crop=t}captureForScan(t){const e=mt(gt,this.canvas.width/this.canvas.height),r=this.captureTruth(e,this.truePose(),t,!0);return{rgba:r.rgba,width:r.width,height:r.height,K:r.K,t}}headingDelta(t,e){const r=i=>this.headings.reduce((o,s)=>Math.abs(s.t-i)<Math.abs(o.t-i)?s:o,this.headings[0]);return this.headings.length?r(e).yaw-r(t).yaw:null}}function wt(n,t){const e=new Float32Array(16);for(let r=0;r<4;r++)for(let i=0;i<4;i++){let o=0;for(let s=0;s<4;s++)o+=n[s*4+i]*t[r*4+s];e[r*4+i]=o}return e}function ve(n,t,e,r){const i=Math.max(1,Math.round(Math.sqrt(12*r*r/3+1)/2)),o=new Float32Array(t*e);for(let a=0;a<t*e;a++)o[a]=n[a*4];const s=new Float32Array(t*e);for(let a=0;a<3;a++){for(let c=0;c<e;c++){let h=0;for(let d=-i;d<=i;d++)h+=o[c*t+Math.min(t-1,Math.max(0,d))];for(let d=0;d<t;d++)s[c*t+d]=h/(2*i+1),h+=o[c*t+Math.min(t-1,d+i+1)]-o[c*t+Math.max(0,d-i)]}for(let c=0;c<t;c++){let h=0;for(let d=-i;d<=i;d++)h+=s[Math.min(e-1,Math.max(0,d))*t+c];for(let d=0;d<e;d++)o[d*t+c]=h/(2*i+1),h+=s[Math.min(e-1,d+i+1)*t+c]-s[Math.max(0,d-i)*t+c]}}for(let a=0;a<t*e;a++)n[a*4]=n[a*4+1]=n[a*4+2]=o[a]}const _e=_t([1,0,0],-Math.PI/2);function Ae(n){return B(C(P(_e,n)))}function Re(n,t,e){return B(Tt(n,t,e))}function Ee(n,t){return q(n-t)}function Me(n){let t=0,e=0;for(const r of n)t+=Math.sin(r),e+=Math.cos(r);return Math.atan2(t,e)}function Se(n){if(!n.length)return 0;let t=0,e=0;for(const i of n)t+=Math.sin(i),e+=Math.cos(i);const r=Math.min(1,Math.hypot(t,e)/n.length);return Math.sqrt(Math.max(0,-2*Math.log(r)))*180/Math.PI}const Te=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];function ke(n,t,e,r,i=1/0){let o=i;if(t[1]<0){const s=(r-n[1])/t[1];s>0&&s<o&&(o=s)}for(const s of e){let a=0,c=o,h=!0;for(let d=0;d<3&&h;d++){if(Math.abs(t[d])<1e-12){(n[d]<s.min[d]||n[d]>s.max[d])&&(h=!1);continue}let x=(s.min[d]-n[d])/t[d],f=(s.max[d]-n[d])/t[d];x>f&&([x,f]=[f,x]),a=Math.max(a,x),c=Math.min(c,f),a>c&&(h=!1)}h&&a>1e-6&&a<o&&(o=a)}return o}function Ke(n,t,e,r,i,o,s=.001,a=8){const c=new ArrayBuffer(e*r*2),h=new DataView(c);for(let d=0;d<r;d++)for(let x=0;x<e;x++){const f=2*((x+.5)/e)-1,l=1-2*((d+.5)/r),u=S(n.quaternion,[(f-t[8])/t[0],(l-t[9])/t[5],-1]),b=ke(n.position,u,i,o,a),p=Number.isFinite(b)&&b<a?Math.min(65535,Math.round(b/s)):0;h.setUint16((d*e+x)*2,p,!0)}return{width:e,height:r,data:c,rawValueToMeters:s,normDepthBufferFromNormView:Te}}class tn{source=null;error="";northInXr=[];xr=[];sensor=null;onAbs=t=>{const e=t;e.alpha===null||e.beta===null||e.gamma===null||this.add(t.timeStamp,Re(e.alpha,e.beta,e.gamma),"deviceorientationabsolute")};addXrYaw(t,e){this.xr.push({t,yaw:e}),this.xr.length>90&&this.xr.shift()}start(){this.stop(),this.northInXr.length=0;const t=globalThis.AbsoluteOrientationSensor;if(t)try{const e=new t({frequency:50,referenceFrame:"device"});e.addEventListener("reading",()=>{e.quaternion&&this.add(performance.now(),Ae(e.quaternion),"absolute-orientation-sensor")}),e.addEventListener("error",r=>{this.error=`AbsoluteOrientationSensor: ${r.error?.message??"error"}`,this.fallback()}),e.start(),this.sensor=e;return}catch(e){this.error=`AbsoluteOrientationSensor: ${e}`}this.fallback()}fallback(){this.sensor?.stop(),this.sensor=null,window.addEventListener("deviceorientationabsolute",this.onAbs)}stop(){this.sensor?.stop(),this.sensor=null,window.removeEventListener("deviceorientationabsolute",this.onAbs)}add(t,e,r){if(!this.xr.length)return;let i=this.xr[0];for(const o of this.xr)Math.abs(o.t-t)<Math.abs(i.t-t)&&(i=o);Math.abs(i.t-t)>50||(this.source??=r,this.northInXr.push(Ee(i.yaw,e)))}summary(){return!this.northInXr.length||!this.source?null:{northYawInXrRad:Me(this.northInXr),samples:this.northInXr.length,spreadDeg:Se(this.northInXr),source:this.source}}}const tt=-6,Fe=14,et=-22,Ie=2,O=.1;function Ce(){const n=[],t=[[-5,-4.2],[-2,-1.2],[1.2,2],[4.2,5],[7.2,8],[10.2,11]],e=[[-10.5,-3.5],[-18.5,-13.5]],r=[[.85,.45,.25],[.3,.6,.85],[.45,.75,.4],[.85,.75,.3],[.65,.45,.8],[.8,.35,.45]];t.forEach(([f,l],u)=>e.forEach(([b,p],g)=>n.push({x0:f,z0:b,x1:l,z1:p,h:1.8,color:r[(u+g)%r.length]}))),n.push({x0:8.5,z0:-1.2,x1:12.5,z1:-.6,h:1,color:[.6,.6,.65]});const i=Math.round((Fe-tt)/O),o=Math.round((Ie-et)/O),s=new Uint8Array(i*o);for(let f=0;f<o;f++)for(let l=0;l<i;l++){const u=tt+(l+.5)*O,b=et+(f+.5)*O,p=l===0||f===0||l===i-1||f===o-1,g=n.some(y=>u>=y.x0&&u<=y.x1&&b>=y.z0&&b<=y.z1);s[f*i+l]=p||g?1:0}const a={width:i,height:o,cellSize:O,originX:tt,originZ:et,floorY:0,occupancy:s,clearanceMm:De(s,i,o,O)},c=(f,l,u,b,p)=>{const g=st(p),y=.09,v=Math.cos(p),A=Math.sin(p),m=(_,w)=>[u+v*_+A*w,0,b-A*_+v*w];return{id:f,label:l,pose:{position:[u,0,b],quaternion:g},corners:[m(-y,-y),m(y,-y),m(y,y),m(-y,y)],residualM:0,observations:0}},h={schema:"namma.markers/1",dictionary:"DICT_4X4_50",sizeM:.18,markers:[c(0,"M0 Entrance",0,0,0),c(1,"M1",0,-12,0),c(2,"M2",6,-12,-Math.PI/2),c(3,"M3",6,-2.5,Math.PI),c(4,"M4",-3,-20,Math.PI/2)]},d=(f,l,u,b,p,g,y,v=[])=>({id:f,name:l,kind:"product",aliases:v,categories:[],position:u,approach:b,facing:p,shelf:{aisle:g,level:y},source:"manual",confidence:1,confirmed:!0});return{storeId:"demo-mart",source:"demo-fallback",pois:{schema:"namma.pois/1",storeId:"demo-mart",updatedAt:"2026-09-14T00:00:00Z",pois:[d("poi_oats_01","Oats",[4.2,1.1,-16],[3.1,-16],-Math.PI/2,"A4",2,["rolled oats","oatmeal","jai"]),d("poi_rice_01","Basmati rice",[-1.2,.6,-6],[0,-6],Math.PI/2,"A2",1,["rice","chawal"]),d("poi_milk_01","Milk",[8,1,-21.8],[8,-20.6],0,"Dairy wall",2,["doodh","dairy"]),d("poi_tea_01","Tea",[-4.2,1.4,-15],[-3.1,-15],Math.PI/2,"A1",3,["chai"]),{...d("poi_checkout","Checkout",[10.5,1,-.9],[10.5,-2.2],Math.PI,"Front",0),kind:"checkout",shelf:void 0}]},markers:h,grid:a,shelves:n}}function De(n,t,e,r){const i=t*e,o=new Int32Array(i).fill(-1),s=new Int32Array(i).fill(-1),a=new Float64Array(i).fill(1/0);for(let d=0;d<i;d++)n[d]!==0&&(o[d]=d%t,s[d]=d/t|0,a[d]=0);const c=(d,x)=>{if(o[x]<0)return;const f=d%t,l=d/t|0,u=(f-o[x])**2+(l-s[x])**2;u<a[d]&&(a[d]=u,o[d]=o[x],s[d]=s[x])};for(let d=0;d<e;d++)for(let x=0;x<t;x++){const f=d*t+x;x>0&&c(f,f-1),d>0&&c(f,f-t),x>0&&d>0&&c(f,f-t-1),x<t-1&&d>0&&c(f,f-t+1)}for(let d=e-1;d>=0;d--)for(let x=t-1;x>=0;x--){const f=d*t+x;x<t-1&&c(f,f+1),d<e-1&&c(f,f+t),x<t-1&&d<e-1&&c(f,f+t+1),x>0&&d<e-1&&c(f,f+t-1)}const h=new Uint16Array(i);for(let d=0;d<i;d++)h[d]=n[d]!==0?0:Math.min(65535,Math.max(0,Math.round((Math.sqrt(a[d])-.5)*r*1e3)));return h}async function nt(n){const t=await fetch(n);if(!t.ok)throw new Error(`${n}: ${t.status}`);return await t.json()}async function en(n,t){const e=`/namma-space-pages/app/stores/${encodeURIComponent(n)}/public/`;try{const r=await nt(e+"manifest.json"),[i,o]=await Promise.all([nt(e+r.pois),nt(e+r.markers)]);let s=null;try{const a=await fetch(e+r.navgrid.url);a.ok&&(s=Ct(await a.arrayBuffer()))}catch{s=null}return i.pois=i.pois.filter(a=>a.confirmed),{storeId:n,source:"bundle",pois:i,markers:o,grid:s,shelves:[],manifest:r}}catch{return Ce()}}export{tn as C,Be as D,Qe as E,ze as G,Ze as O,Je as R,N as a,pt as b,Ge as c,At as d,$e as e,We as f,yt as g,Xe as h,Le as i,Pe as j,je as k,en as l,Oe as m,Ue as n,Ve as o,He as p,U as q,ce as r,Ke as s,Ye as t,re as u,qe as v,ee as w,ne as y};
