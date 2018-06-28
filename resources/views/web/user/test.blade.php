<html>
<head>
    <title>WebGL TEST</title>
</head>
<script src="/js/minMatrix.js" type="text/javascript"></script>
<script id="vs" type="x-shader/x-vertex">
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main(void){
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }

</script>
<script id="fs" type="x-shader/x-fragment">

    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
</script>

<body>
<canvas id="canvas" style="border:1px solid #c3c3c3;"></canvas>
<span>
    this is a test of tang
</span>
</body>
<script>
    onload = function(){
        var ca = document.getElementById('canvas');
        ca.height = 500;
        ca.width = 500;

        var gl = ca.getContext('webgl') || ca.getContext("experimental-webgl");
        if(!gl){
            alert("你的浏览器不支持或者没有开启gl");
        }


        gl.clearColor(0.0,0.0,0.0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var vs = create_shader("vs");
        var fs = create_shader("fs");
        var prg = create_program(vs,fs);


        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            },
        };
        var vertices = [
            1.0,  1.0,  0.0,
            -1.0, 1.0,  0.0,
            1.0,  -1.0, 0.0,
            -1.0, -1.0, 0.0
        ];
        var po = create_vbo(vertices);


        // 生成着色器的函数传入js的ID
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

            // 向程序对象里分配着色器编译后的代码
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

            /*// 将绑定的缓存设为无效
            gl.bindBuffer(gl.ARRAY_BUFFER, null);*/

            // 返回生成的VBO
            return vbo;
        }

    }
</script>
</html>