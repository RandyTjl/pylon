<html>
<head>
    <title>WebGL TEST</title>
</head>
<script src="/js/minMatrix.js" type="text/javascript"></script>
<script id="vs" type="x-shader/x-vertex">
attribute vec3 position;
attribute vec4 color;
uniform   mat4 mvpMatrix;
varying   vec4 vColor;

void main(void){
    vColor = color;
    gl_Position = mvpMatrix * vec4(position, 1.0);
}
        </script>

<script id="fs" type="x-shader/x-fragment">
precision mediump float;

varying vec4 vColor;

void main(void){
    gl_FragColor = vColor;
}
        </script>
<body>
<canvas id="canvas" style="border:1px solid #c3c3c3;"></canvas>
<span>
    this is a test of tang
</span>
</body>
<script>

    var a = torus(100,5,0.3,1);


// canvas对象获取
var c = document.getElementById('canvas');
c.width = 500;
c.height = 500;

/*// 保存顶点的位置情报的数组
var vertex_position = [
    0.0,  1.0,  0.0,
    1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    0.0, -1.0,  0.0
];

// 保存顶点的颜色情报的数组
var vertex_color = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
];

var index = [
  0,1,2,
  1,2,3
];*/
    // 保存顶点的位置情报的数组
    var vertex_position = a[0];
       ;

    // 保存顶点的颜色情报的数组
    var vertex_color = a[1];

    var index = a[2];

//依次递增的数
var count = 0;
// 使用minMatrix.js对矩阵的相关处理
// matIV对象生成
var m = new matIV();

// 各种矩阵的生成和初始化
var mMatrix = m.identity(m.create());
var vMatrix = m.identity(m.create());
var pMatrix = m.identity(m.create());
var tmpMatrix = m.identity(m.create());
var mvpMatrix = m.identity(m.create());
// 视图变换坐标矩阵
m.lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);

// 投影坐标变换矩阵
m.perspective(90, c.width / c.height, 0.1, 100, pMatrix);

m.multiply(pMatrix, vMatrix, tmpMatrix);

onload = function() {

        count++;
        // 弧度
        var rad = (count % 360) * Math.PI / 180;


        // webgl的context获取
        var gl = c.getContext('webgl') || c.getContext('experimental-webgl');

        // 设定canvas初始化的颜色
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // 设定canvas初始化时候的深度
        gl.clearDepth(1.0);

        // canvas的初始化
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //开启遮挡删除
        gl.enable(gl.CULL_FACE);


        //开启深度测试
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

    // 顶点着色器和片段着色器的生成
        var v_shader = create_shader('vs');
        var f_shader = create_shader('fs');

        // 程序对象的生成和连接
        var prg = create_program(v_shader, f_shader);

        // attributeLocation的获取
        var attLocation = new Array(2);
        attLocation[0] = gl.getAttribLocation(prg, 'position');
        attLocation[1] = gl.getAttribLocation(prg, 'color');

        // 将元素数attribute保存到数组中
        var attStride = new Array(2);
        attStride[0] = 3;
        attStride[1] = 4;



        // 生成VBO
        var position_vbo = create_vbo(vertex_position);
        var color_vbo = create_vbo(vertex_color);
        set_attribute([position_vbo,color_vbo],attLocation,attStride);

       /* // VBO绑定(位置情报)
        gl.bindBuffer(gl.ARRAY_BUFFER, position_vbo);
        gl.enableVertexAttribArray(attLocation[0]);
        gl.vertexAttribPointer(attLocation[0], attStride[0], gl.FLOAT, false, 0, 0);

        // VBO绑定(颜色情报)
        gl.bindBuffer(gl.ARRAY_BUFFER, color_vbo);
        // 设定attribute属性有効
        gl.enableVertexAttribArray(attLocation[1]);
        //向着色器中写入数据
        gl.vertexAttribPointer(attLocation[1], attStride[1], gl.FLOAT, false, 0, 0);*/

        // 生成IBO
        var ibo = create_ibo(index);

        // IBO进行绑定并添加
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

        // uniformLocation的获取
        var uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');

        // 使用计数器算出角度
        var rad = (count % 360) * Math.PI / 180;

    // 模型坐标变换矩阵的生成(沿着Y轴旋转)
    m.identity(mMatrix);
    m.rotate(mMatrix, rad, [1, 1, 0], mMatrix);
    m.multiply(tmpMatrix, mMatrix, mvpMatrix);
    gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);

    // 使用索引进行绘图
    gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);

    /*// 模型1按照一个圆形轨道进行旋转
        var x = Math.cos(rad);
        var y = Math.sin(rad);
        m.identity(mMatrix);
        m.translate(mMatrix, [x, y + 1.0, 0.0], mMatrix);

        // 完成模型1的坐标变换矩阵，并进行绘图
        m.multiply(tmpMatrix, mMatrix, mvpMatrix);
        gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        // 向uniformLocation中传入坐标变换矩阵
        gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);

        // 绘制模型
        gl.drawArrays(gl.TRIANGLES, 0, 3);


        //移动第二个模型的模型坐标变换矩阵
        m.identity(mMatrix);
        m.translate(mMatrix, [-1.5, 0.0, 0.0], mMatrix);
        m.rotate(mMatrix, rad, [0, 1, 0], mMatrix);

//模型x视图x投影(第二个模型)
        m.multiply(tmpMatrix, mMatrix, mvpMatrix);

//将坐标变换矩阵传入uniformLocation，并绘图(第二个模型)
        gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, 3);



        //第三个模型
        m.identity(mMatrix);
        m.translate(mMatrix, [1.5, 1.5, -1.0], mMatrix);
        m.rotate(mMatrix,rad,[1,0,0],mMatrix);
        m.multiply(tmpMatrix,mMatrix,mvpMatrix);
        gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, 3);*/

        // context的刷新
        gl.flush();

        // 为了循环，进行递归处理
        setTimeout(arguments.callee, 1000 / 30);

        // 生成着色器的函数
        function create_shader(id) {
            // 用来保存着色器的变量
            var shader;

            // 根据id从HTML中获取指定的script标签
            var scriptElement = document.getElementById(id);

            // 如果指定的script标签不存在，则返回
            if (!scriptElement) {
                return;
            }

            // 判断script标签的type属性
            switch (scriptElement.type) {

                // 顶点着色器的时候
                case 'x-shader/x-vertex':
                    shader = gl.createShader(gl.VERTEX_SHADER);
                    break;

                // 片段着色器的时候
                case 'x-shader/x-fragment':
                    shader = gl.createShader(gl.FRAGMENT_SHADER);
                    break;
                default :
                    return;
            }

            // 将标签中的代码分配给生成的着色器
            gl.shaderSource(shader, scriptElement.text);

            // 编译着色器
            gl.compileShader(shader);

            // 判断一下着色器是否编译成功
            if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

                // 编译成功，则返回着色器
                return shader;
            } else {

                // 编译失败，弹出错误消息
                alert(gl.getShaderInfoLog(shader));
            }
        }

        // 程序对象的生成和着色器连接的函数
        function create_program(vs, fs) {
            // 程序对象的生成
            var program = gl.createProgram();

            // 向程序对象里分配着色器
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);

            // 将着色器连接
            gl.linkProgram(program);

            // 判断着色器的连接是否成功
            if (gl.getProgramParameter(program, gl.LINK_STATUS)) {

                // 成功的话，将程序对象设置为有效
                gl.useProgram(program);

                // 返回程序对象
                return program;
            } else {

                // 如果失败，弹出错误信息
                alert(gl.getProgramInfoLog(program));
            }
        }

        // 生成VBO的函数
        function create_vbo(data) {
            // 生成缓存对象
            var vbo = gl.createBuffer();

            // 绑定缓存
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

            // 向缓存中写入数据
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

            // 将绑定的缓存设为无效
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // 返回生成的VBO
            return vbo;
        }

        // 绑定VBO相关的函数
        function set_attribute(vbo, attL, attS){
            // 处理从参数中得到的数组
            for(var i in vbo){
                // 绑定缓存
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);

                // 将attributeLocation设置为有效
                gl.enableVertexAttribArray(attL[i]);

                //通知并添加attributeLocation
                gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
            }
        }

        // IBO的生成函数
        function create_ibo(data){
            // 生成缓存对象
            var ibo = gl.createBuffer();

            // 绑定缓存
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

            // 向缓存中写入数据
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);

            // 将缓存的绑定无效化
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

            // 返回生成的IBO
            return ibo;
        }
}

    //生成圆环体
    /*第一个参数，是构成这个管子的圆是多少个顶点，数值越大，管子就越接近一个圆的形状，太小的话，这个圆就有棱角了。
    第二个参数，是将管子分割成多少份，这个数值越大，生成的圆环体就越圆滑，数值太小的话，就会出现棱角。
    第三个参数，是生成这个管子的半径。
    第四个参数，是原点到管子中心的距离。*/

    function torus(row, column, irad, orad){
        var pos = new Array(), col = new Array(), idx = new Array();
        for(var i = 0; i <= row; i++){
            var r = Math.PI * 2 / row * i;
            var rr = Math.cos(r);
            var ry = Math.sin(r);
            for(var ii = 0; ii <= column; ii++){
                var tr = Math.PI * 2 / column * ii;
                var tx = (rr * irad + orad) * Math.cos(tr);
                var ty = ry * irad;
                var tz = (rr * irad + orad) * Math.sin(tr);
               /* var tx = (Math.cos(tr) * irad + orad) * rr;
                var ty = Math.sin(tr) * irad;
                var tz = (Math.cos(tr) * irad + orad) * ry;*/
                pos.push(tx, ty, tz);
                var tc = hsva(360 / column * ii, 1, 1, 1);
                col.push(tc[0], tc[1], tc[2], tc[3]);
            }
        }
        for(i = 0; i < row; i++){
            for(ii = 0; ii < column; ii++){
                r = (column + 1) * i + ii;
                idx.push(r, r + column + 1, r + 1);
                idx.push(r + column + 1, r + column + 2, r + 1);
            }
        }
        return [pos, col, idx];
    }

    function hsva(h, s, v, a){
        /*if(s > 1 || v > 1 || a > 1){return;}
        var th = h % 360;
        var i = Math.floor(th / 60);
        var f = th / 60 - i;
        var m = v * (1 - s);
        var n = v * (1 - s * f);
        var k = v * (1 - s * (1 - f));
        var color = new Array();
        if(!s > 0 && !s < 0){
            color.push(v, v, v, a);
        } else {
            var r = new Array(v, n, m, m, k, v);
            var g = new Array(k, v, v, n, m, m);
            var b = new Array(m, m, k, v, v, n);
            color.push(r[i], g[i], b[i], a);
        }*/
        var color = new Array();
        color.push(1.0,0.5,1.0,1.0);
        return color;
    }

</script>
</html>