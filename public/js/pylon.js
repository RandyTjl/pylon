/**
 * 生成电塔
 * @param h1
 * @param l1
 * @param l2
 * @param n1 分的段数
 * @param radian
 */
function pylon(h1,l1,l2,l3,n1,radian) {
    var py = pylon_bottom(h1,l1,l2,l3,n1,radian);
    //var tab = tabula(py[0],py[1],py[2],3);
	//pylon_body(l1,py[2],h1,40,1,1,radian,1);
    return py;
}
/**
 * 生成电塔底部,以原点为中心
 * @param h1
 * @param l1    底部长度
 * @param l2    顶部长度
 * @param l3    第二个面的底边长度
 * @param n1    分段数
 * @param radian 倾斜弧度PI/4 到 PI/2
 * @returns {*[]}
 */
function pylon_bottom(h1,l1,l2,l3,n1,radian) {
    var tower_body = []; //塔身开始坐标
    var temp = [];  //缓存
    var vertices = []; //点坐标
    var faces = [];  //坐标索引
    vertices.push(new THREE.Vector3(-l1/2,0,l3/2));
	
    x = (l1-l2)/2;
    for(i=1;i<=n1;i++){
        x1 = -l1/2 + x*(i/n1);
        y1 = h1*(i/n1);
        x2 = -l1/2+(i/n1)*(l1/2);
        y2 = h1*(i/n1);
        z = l3/2-h1/Math.tan(radian)*(i/n1);
        vertices.push(new THREE.Vector3(x1,y1,z));
        vertices.push(new THREE.Vector3(x2,y2,z));
    }
    temp = get_relative(vertices,z);
    vertices = vertices.concat(temp.reverse());

    //第二个面
    x_1 = l1/2-vertices[2*n1+1].x;
    var vertices1= [];
    vertices1.push(new THREE.Vector3(l1/2,0,l3/2));
    for(i=1;i<=n1;i++){
        y1 = h1*(i/n1);
        z1 = l3/2-h1/Math.tan(radian)*(i/n1);
        z2 = l3/2-(i/n1)*(l3/2);

        x = l1/2-x_1*(i/n1);
        vertices1.push(new THREE.Vector3(x,y1,z1));
        vertices1.push(new THREE.Vector3(x,y1,z2));
    }

    temp = get_relative(vertices1,x);
    vertices1 = vertices1.concat(temp.reverse());
    //获得第三个面
    var vertices2 =  get_relative(vertices,x).reverse();
    //获得第四个面
    var vertices3 =  get_relative(vertices1,z).reverse();

    vertices = vertices.concat(vertices1);
    vertices = vertices.concat(vertices2);
    vertices = vertices.concat(vertices3);

    for(j=0;j<vertices.length-2;j++){
        faces.push(new THREE.Face3(j,j+1,j+2));
    }
    /*//横隔
    faces.push(new THREE.Face3(2*n1-1,10*n1+2,6*n1+2));
    faces.push(new THREE.Face3(10*n1+2,6*n1+2,2*n1+1));
    //塔身起始点*/
    tower_body = [vertices[2*n1-1],vertices[2*n1+1],vertices[6*n1+2],vertices[10*n1+2]];

    return [vertices,faces,tower_body];
}

/**
 * 获得面的对称面坐标
 * @param vertices
 * @param xyz 哪个轴
 */
function get_relative(vertices,xyz) {
    temp = [];
    for(i=0;i<vertices.length-1;i++){
        x1 = vertices[i].x;
        y1 = vertices[i].y;
        z1 = vertices[i].z;
        if(xyz == x){
            z1 = -z1;
        }else if(xyz == z){
            x1 = - x1;
        }
        temp.push(new THREE.Vector3(x1,y1,z1));
    }
    return temp;
}

/**
 * 获得面的对称面坐标
 * @param vertices
 * @param xyz 哪个轴
 */
function get_relative_all(vertices,xyz) {
    temp = [];
    for(i=0;i<vertices.length;i++){
        x1 = vertices[i].x;
        y1 = vertices[i].y;
        z1 = vertices[i].z;
        if(xyz == x){
            z1 = -z1;
        }else if(xyz == z){
            x1 = - x1;
        }
        temp.push(new THREE.Vector3(x1,y1,z1));
    }
    return temp;
}

/**
 * 通过顶点坐标生成横隔
 * @param vertices 顶点所有坐标
 * @param point 上顶点坐标
 * @param faces 构成面的索引
 * @param type  横隔类型
 */
function tabula(vertices,faces,point,type) {
    switch(type){
        case 1:
            vertices = vertices.concat(point);
            //因为索引是从0开始的所以要减去1
            var len = vertices.length-1;
            var len1 = point.length-1;
            faces.push(new THREE.Face3(len-len1,len,len-len1+1));
            faces.push(new THREE.Face3(len,len-len1,len-len1+2));
            break;
        case 2:
            var temp = [];
            var x,y,z;
            for(i=0;i<point.length;i++){
                temp.push(point[i]);
                var poi;
                if(i+1 == point.length){
                    poi = point[0];
                }else{
                    poi = point[i+1];
                }
                x = (point[i].x+poi.x)/2;
                y = (point[i].y+poi.y)/2;
                z = (point[i].z+poi.z)/2;
                temp.push(new THREE.Vector3(x,y,z));
            }

            //中心点坐标
            x =  (point[0].x+point[1].x+point[2].x+point[3].x)/4;
            y =  (point[0].y+point[1].y+point[2].y+point[3].y)/4;
            z =  (point[0].z+point[1].z+point[2].z+point[3].z)/4;
            temp.push(new THREE.Vector3(x,y,z));

            vertices = vertices.concat(temp);
            var len = vertices.length-1;
            var len1 = temp.length-1;
            faces.push(new THREE.Face3(len,len-1,len-len1+1));
            faces.push(new THREE.Face3(len,len-len1+1,len-len1+3));
            faces.push(new THREE.Face3(len,len-len1+3,len-len1+5));
            faces.push(new THREE.Face3(len,len-len1+5,len-len1+7));
            break;
        case 3:
            var temp = [];
            var temp1 = [];

            var x,y,z;
            for(i=0;i<point.length;i++){
                temp.push(point[i]);
                var poi;
                if(i+1 == point.length){
                    poi = point[0];
                }else{
                    poi = point[i+1];
                }
                x = (point[i].x+poi.x)/2;
                y = (point[i].y+poi.y)/2;
                z = (point[i].z+poi.z)/2;
                temp.push(new THREE.Vector3(x,y,z));
                x1 = point[i].x/2;
                y1 = point[i].y;
                z1 = point[i].z/2;
                temp1.push(new THREE.Vector3(x1,y1,z1));
            }

            //中心点坐标
            x =  (point[0].x+point[1].x+point[2].x+point[3].x)/4;
            y =  (point[0].y+point[1].y+point[2].y+point[3].y)/4;
            z =  (point[0].z+point[1].z+point[2].z+point[3].z)/4;
            temp.push(new THREE.Vector3(x,y,z));


            vertices = vertices.concat(temp);
            vertices = vertices.concat(temp1);
            var len = vertices.length-1;
            var len1 = temp.length-1;
            var len2 = temp1.length;
            faces.push(new THREE.Face3(len-len2,len-len2-1,len-len2-len1+1));
            faces.push(new THREE.Face3(len-len2,len-len2-len1+1,len-len2-len1+3));
            faces.push(new THREE.Face3(len-len2,len-len2-len1+3,len-len2-len1+5));
            faces.push(new THREE.Face3(len-len2,len-len2-len1+5,len-len2-len1+7));

            faces.push(new THREE.Face3(len-len2-len1,len-len2+1,len-len2-len1+1));
            faces.push(new THREE.Face3(len-len2-len1+2,len-len2+2,len-len2-len1+3));
            faces.push(new THREE.Face3(len-len2-len1+4,len-len2+3,len-len2-len1+5));
            faces.push(new THREE.Face3(len-len2-len1+6,len-len2+4,len-len2-len1+7));
            break;
        default:
            vertices = vertices.concat(point);
            //因为索引是从0开始的所以要减去1
            var len = vertices.length-1;
            var len1 = point.length-1;
            faces.push(new THREE.Face3(len-len1,len,len-len1+1));
            faces.push(new THREE.Face3(len,len-len1,len-len1+2));
            break;
            break;
    }
    return [vertices,faces,point];
}

/**
 * @param l1 最底边的长度
 * @param point 起始顶点
 * @param h_p 前面所有模块总高度
 * @param h 单个塔身模块高度
 * @param n1 分成几个模块
 * @param radian 属于什么类型塔身
 * @param type 属于什么类型塔身
 */
function pylon_body(l1,point,h_p,h,n1,radian,type) {
	
	var vertices= []
	var faces = [];
	//生成模块的上四角坐标
	var po = [];
    var proportion = h_p/h;

	//上一模块的下底边超过超过上底边的一半底边
	var x_l1 = l1/2 -Math.abs(point[0].x);
	//当前下底边超过超过上底边的一半底边
	var x_l2 = x_l1/proportion;

	
	//该模块一号底边长度
	var l2 = 2*Math.abs(point[0].x);
	

	//另一边的长度
	var l3 = 2*Math.abs(point[0].z);

	
    switch(type){
        case 1:
			for(i=0;i<=n1;i++){
				x1 = -l2/2 + x_l2*(i/n1);
				y1 = h_p+h*(i/n1);
				
				x2 = -l2/2+(1-i/n1)*(l2/2)+x_l2*(i/n1);
				
				y2 = h_p+h*(i/n1);
				z = l3/2-h/Math.tan(radian)*(i/n1);
				
				if(i != n1){
					vertices.push(new THREE.Vector3(x2,y2,z));
				}
				vertices.push(new THREE.Vector3(x1,y1,z));
			}
			
			vertices = vertices.reverse();
			
			po.push(vertices[0]);
			temp = get_relative(vertices,z);
			po.push(temp[0]);
			vertices = vertices.concat(temp.reverse());
			//计算缺失部分的长度
			x_l4 = l2/2-Math.abs(vertices[vertices.length-1].x);
			z_l1 = l3/2-Math.abs(vertices[vertices.length-1].z);
			
			var vertices1 = [];
			//第二个面
			for(i=0;i<=n1;i++){
				y1 = h_p+h*(i/n1);
				z1 = l3/2-h/Math.tan(radian)*(i/n1);
				z2 = l3/2-(1-i/n1)*(l3/2)-z_l1*(i/n1);

				x = l2/2-x_l4*(i/n1);
				
				if(i != n1){
					vertices1.push(new THREE.Vector3(x,y1,z2));
				}
				vertices1.push(new THREE.Vector3(x,y1,z1));
				
			}
			vertices1 = vertices1.reverse();
			po.push(vertices1[0]);
			temp = get_relative(vertices1,x);
			po.push(temp[0]);
			vertices1 = vertices1.concat(temp.reverse())
			//获得第三个面
			var vertices2 =  get_relative(vertices,x).reverse();
			//获得第四个面
			var vertices3 =  get_relative(vertices1,z).reverse();
			
			
			vertices = vertices.concat(vertices1);
			vertices = vertices.concat(vertices2);
			vertices = vertices.concat(vertices3);
			
			for(j=0;j<vertices.length-2;j++){
				faces.push(new THREE.Face3(j,j+1,j+2));
			}
			break;
		case 2:
			//该模块n1默认是3
			if(n1 == 'undefined'){
				n1 = 3;
			}
			
			//右边分块
			n_left = 4;
			
			//中心点坐标
			ho = h*l2/(2*(l2-x_l2)) //新模块高度（由纸推导出的公式）
			xo = 0;
			yo = h_p+ho
			zo = l3/2-h/Math.tan(radian)*(ho/(h_p+h))
			
			vertices.push(point[0]);
			for(i=1;i<=n1;i++){
	
				x1 = -l2/2 + x_l2*(i/n1);
				y1 = h_p+h*(i/n1);
				z1 = l3/2-h/Math.tan(radian)*(i/n1);
				if(i == 1){
					x2 = -l2/2*(1/2);
					z2 = l3/2-ho/Math.tan(radian)*(1/2);
					y2 = h_p+ho*(1/2);
				}
				
				
				if(i==2){
					x2 = (-l2/2+x_l2)/2;
					z2 = l3/2-(h-ho)/Math.tan(radian)*(1/2)-ho/Math.tan(radian);
					y2 = h_p+ho+(h-ho)/2;
				}
				
				
				if(n1%2 == 0){
					
					vertices.push(new THREE.Vector3(x2,y2,z2));
					vertices.push(new THREE.Vector3(x1,y1,z1));
				}else{
					vertices.push(new THREE.Vector3(x1,y1,z1));
					if(i != n1){
						vertices.push(new THREE.Vector3(x2,y2,z2));
					}
				}
				
			}
			
			vertices.push(new THREE.Vector3(xo,yo,zo))
			//获取顶点坐标
			po.push(vertices[vertices.length-2]);
			
			temp = get_relative(vertices,z);
			
			
			po.push(temp[temp.length-1]);
			vertices = vertices.concat(temp.reverse());
			
			//计算缺失部分的长度
			z_l1 = l3/2-Math.abs(po[po.length-1].z);
			
			//侧面中心点坐标
			ho1 = h*l3/(2*(l3-z_l1)) //新模块高度（由纸推导出的公式）
			xo1 = l2/2-x_l2*(ho1/h);
			yo1 = h_p+ho1
			zo1 = 0;
			
			var vertices1 = [];
			//第二个面

			vertices1.push(point[1]);
			for(i=1;i<=n1;i++){
				x1 = l2/2-x_l2*(i/n1)
				y1 = h_p+h*(i/n1);
				z1 = l3/2-h/Math.tan(radian)*(i/n1);
				if(i == 1){
					x2 = l2/2 - x_l2*(ho1/h)/2
					y2 = h_p+ho1/2;
					z2 = l3/4;
				}
				if(i == 2){
					x2 = l2/2 - x_l2*(ho1/h)-x_l2*(1-ho1/h)/2;
					y2 = h_p+ho1+(h-ho1)/2;
					z2 = (l3/2-z_l1)/2;
				}
				
				if(n1%2 == 0){
					
					vertices1.push(new THREE.Vector3(x2,y2,z2));
					vertices1.push(new THREE.Vector3(x1,y1,z1));
				}else{
					vertices1.push(new THREE.Vector3(x1,y1,z1));
					if(i != n1){
						vertices1.push(new THREE.Vector3(x2,y2,z2));
					}
				}
				
				//vertices1.push(new THREE.Vector3(x1,y1,z1));
				//if(i != n1){
				//	vertices1.push(new THREE.Vector3(x2,y2,z2));
				//}	
			}
			vertices1.push(new THREE.Vector3(xo1,yo1,zo1));
			
			temp = get_relative(vertices1,x);
			
			po.push(temp[temp.length-1]);
			po.push(new THREE.Vector3(-l3/2,h_p+h,-l2/2));
			vertices1 = vertices1.concat(temp.reverse());
			//获得第三个面
			
			var vertices2 =  get_relative(vertices,x).reverse();
			//获得第四个面
			
			var vertices3 =  get_relative(vertices1,z).reverse();
			
			vertices = vertices.concat(vertices1);
			vertices = vertices.concat(vertices2);
			vertices = vertices.concat(vertices3);
			
			for(j=0;j<vertices.length-2;j++){
				if(vertices[j+1].x != 0 && vertices[j+1].y != 0 && vertices[j+1].z != 0 && j != 2*(n1+3) && j != 4*(n1+3) && j != 6*(n1+3)){
					faces.push(new THREE.Face3(j,j+1,j+2));
				}
				
			
				if(vertices[j].x == 0 || vertices[j].z == 0){
		
					if(j-(n1+3)>=0){
					
						faces.push(new THREE.Face3(j,j-1,j-(n1+3)));
					}
					if(vertices[j+(n1+3)]){
						faces.push(new THREE.Face3(j,j+1,j+(n1+3)));
					}
				}
			}
			
			break;

    }

	return [vertices,faces,po];
}

/**
 * @param point1 塔身上边四顶点
 * @param point2 塔身下边四顶点
 * @param h_p 前面所有模块高度
 * @param h 该模块高度
 * @param l 该模块地底边长度
 * @param n 该模块分成几块
 * @param radian 该模块的倾斜角
 * @param type 哪种头模型
 * @param other_type 头模型的其他分类
 * @param direction  该头部模块方向(x,-x,z,-z)四个方向
 
**/

function pylon_head(point1,point2,h_p,h,l,n,radian,type,other_type,direction){
	var vertices = [];
	var faces = [];
	//最右边的点
	var vertices_right = [];
	//塔身底边长度
	var l2 = 2*Math.abs(point2[0].x);
	//塔身上边长度
	var l3 = 2*Math.abs(point1[0].x);
	//塔身侧边底边长度
	var l4 = 2*Math.abs(point2[0].z);
	
	if(direction == 'x'){
		vertices.push(point1[1]);
		vertices.push(point2[1]);

		vertices_right.push(new THREE.Vector3(point2[1].x+l,point2[1].y,point2[1].z));
	}else if(direction == '-x'){
		vertices.push(point1[2]);
		vertices.push(point2[2]);
		
		vertices_right.push(new THREE.Vector3(point2[2].x-l,point2[2].y,point2[2].z));
	}else if(direction == 'z'){
		vertices.push(point1[0]);
		vertices.push(point2[0]);
		
		vertices_right.push(new THREE.Vector3(point2[0].x,point2[0].y,point2[0].z+l));
	}else if(direction == '-z'){
		vertices.push(point1[3]);
		vertices.push(point2[3]);
		vertices_right.push(new THREE.Vector3(point2[3].x,point2[3].y,point2[0].z-l));	
	}
	switch(type){
		case 1:
			if(direction == 'x'){
				vertices_right.push(new THREE.Vector3(point2[1].x+l,point2[1].y,point2[1].z));
			}else if(direction == '-x'){
				vertices_right.push(new THREE.Vector3(point2[2].x-l,point2[2].y,point2[2].z));
			}else if(direction == 'z'){
				vertices_right.push(new THREE.Vector3(point2[0].x,point2[0].y,point2[0].z+l));
			}else if(direction == '-z'){
				vertices_right.push(new THREE.Vector3(point2[3].x,point2[3].y,point2[0].z-l));	
			}
			
			for(i=1;i<n;i++){
				x1 = l2/2+l*((i-1)/n+1/(2*n));
				y1 = h_p+h*(1-i/(2*n));
				console.log(1-i/(2*n));
				z1 = l4/2-h*(1-i/(2*n))/Math.tan(radian);
				
				x2 = l2/2 + l*(i/n);
				y2 = h_p;
				z2 = Math.abs(point2[0].z);
				if(direction == '-x'){
					x1 = -x1;
					x2 = -x2;
				}
				if(direction == '-z'){
					z1 = -z1;
					z2 = -z2;
				}
				vertices.push(new THREE.Vector3(x1,y1,z1));
				vertices.push(new THREE.Vector3(x2,y2,z2));
			}
			//添加最右边的点
			vertices = vertices.concat(vertices_right);
			var len1 = vertices.length;
			
			var vertices1 = get_relative_all(vertices,direction);
			vertices =vertices.concat(vertices1);
			for(j=0;j<vertices.length-2;j++){
				if(!(j == len1-1 || j == len1-2 || j == 2*len1-1 || j == 2*len1 -2) ){
					faces.push(new THREE.Face3(j,j+1,j+2));
				}	
			}
			for(j1=0;j1<len1;j1++){
				faces.push(new THREE.Face3(j,len1,j1));
			}
			
			break;
		case 2:
			if(direction == 'x'){
				vertices_right.push(new THREE.Vector3(point1[1].x+l,point1[1].y,point1[1].z));
			}else if(direction == '-x'){
				vertices_right.push(new THREE.Vector3(point1[2].x-l,point1[2].y,point1[2].z));
			}else if(direction == 'z'){
				vertices_right.push(new THREE.Vector3(point1[0].x,point1[0].y,point1[0].z+l));
			}else if(direction == '-z'){
				vertices_right.push(new THREE.Vector3(point1[3].x,point1[3].y,point1[0].z-l));	
			}
			
			for(i=1;i<n;i++){
				x1 = l2/2+l*((i-1)/n+1/(2*n));
				y1 = h_p+h*(i/(2*n));
				z1 = l4/2-h*(i/(2*n))/Math.tan(radian);
				
				x2 = l2/2 + l*(i/n);
				y2 = h_p+h;
				z2 = Math.abs(point2[0].z);
				if(direction == '-x'){
					x1 = -x1;
					x2 = -x2;
				}
				if(direction == '-z'){
					z1 = -z1;
					z2 = -z2;
				}
				vertices.push(new THREE.Vector3(x1,y1,z1));
				vertices.push(new THREE.Vector3(x2,y2,z2));
			}
			//添加最右边的点
			vertices = vertices.concat(vertices_right);
			
			break;
	}
	console.log(vertices);
	console.log(faces);
	
	return [vertices,faces];	
}

/**
 *vertices 头部第一部分
 *l1 底边1的长度
 *l2 底边2的长度
 *type 类型
**/
function pylon_head_other(vertices,l1,l2,type){
	var len = vertices.length;
	switch(type){
		case 1: 
			var h1 = vertices[len-2].y;
			var h2 = vertices[len].y;
			var x = vertices[len].x+l1
			var z1 = vertices[len-2].z;
			var z2 = vertices[len].z;
			
			vertices.push =	new THREE.Vector3(x,h1,z1);
			vertices.push =	new THREE.Vector3(x,h2,z2);
			break;
		case 2:
			var h1 = vertices[len-2].y;
			var h2 = vertices[len].y;
			var x1 = vertices[len].x+l1;
			var x2 - vertices[len].x+l2;
			var z1 = vertices[len-2].z;
			var z2 = vertices[len].z;
			vertices.push =	new THREE.Vector3(x1,h1,z1);
			vertices.push =	new THREE.Vector3(x1,h2,z2);
			vertices.push =	new THREE.Vector3(x2,h2,z2);
		
			break;
	}
	
	return vertices;
}


//待改的模块横隔
function tabula1(point,type) {
    vertices = [];
    faces = [];
    switch(type){
        case 1:
            vertices = vertices.concat(point);
            //因为索引是从0开始的所以要减去1
            var len = vertices.length-1;
            var len1 = point.length-1;
            
            faces.push(new THREE.Face3(len-len1,len,len-len1+1));
            faces.push(new THREE.Face3(len,len-len1,len-len1+2));
            break;
        case 2:
            var temp = [];
            var x,y,z;
            for(i=0;i<point.length;i++){
                temp.push(point[i]);
                var poi;
                if(i+1 == point.length){
                    poi = point[0];
                }else{
                    poi = point[i+1];
                }
                x = (point[i].x+poi.x)/2;
                y = (point[i].y+poi.y)/2;
                z = (point[i].z+poi.z)/2;
                temp.push(new THREE.Vector3(x,y,z));
            }

            //中心点坐标
            x =  (point[0].x+point[1].x+point[2].x+point[3].x)/4;
            y =  (point[0].y+point[1].y+point[2].y+point[3].y)/4;
            z =  (point[0].z+point[1].z+point[2].z+point[3].z)/4;
            temp.push(new THREE.Vector3(x,y,z));

            vertices = vertices.concat(temp);
            var len = vertices.length-1;
            var len1 = temp.length-1;
            faces.push(new THREE.Face3(len,len-1,len-len1+1));
            faces.push(new THREE.Face3(len,len-len1+1,len-len1+3));
            faces.push(new THREE.Face3(len,len-len1+3,len-len1+5));
            faces.push(new THREE.Face3(len,len-len1+5,len-len1+7));
            break;
        case 3:
            var temp = [];
            var temp1 = [];

            var x,y,z;
            for(i=0;i<point.length;i++){
                temp.push(point[i]);
                var poi;
                if(i+1 == point.length){
                    poi = point[0];
                }else{
                    poi = point[i+1];
                }
                x = (point[i].x+poi.x)/2;
                y = (point[i].y+poi.y)/2;
                z = (point[i].z+poi.z)/2;
                temp.push(new THREE.Vector3(x,y,z));
                x1 = point[i].x/2;
                y1 = point[i].y;
                z1 = point[i].z/2;
                temp1.push(new THREE.Vector3(x1,y1,z1));
            }

            //中心点坐标
            x =  (point[0].x+point[1].x+point[2].x+point[3].x)/4;
            y =  (point[0].y+point[1].y+point[2].y+point[3].y)/4;
            z =  (point[0].z+point[1].z+point[2].z+point[3].z)/4;
            temp.push(new THREE.Vector3(x,y,z));


            vertices = vertices.concat(temp);
            vertices = vertices.concat(temp1);
            var len = vertices.length-1;
            var len1 = temp.length-1;
            var len2 = temp1.length;
            faces.push(new THREE.Face3(len-len2,len-len2-1,len-len2-len1+1));
            faces.push(new THREE.Face3(len-len2,len-len2-len1+1,len-len2-len1+3));
            faces.push(new THREE.Face3(len-len2,len-len2-len1+3,len-len2-len1+5));
            faces.push(new THREE.Face3(len-len2,len-len2-len1+5,len-len2-len1+7));

            faces.push(new THREE.Face3(len-len2-len1,len-len2+1,len-len2-len1+1));
            faces.push(new THREE.Face3(len-len2-len1+2,len-len2+2,len-len2-len1+3));
            faces.push(new THREE.Face3(len-len2-len1+4,len-len2+3,len-len2-len1+5));
            faces.push(new THREE.Face3(len-len2-len1+6,len-len2+4,len-len2-len1+7));
            break;
        default:
            vertices = vertices.concat(point);
            //因为索引是从0开始的所以要减去1
            var len = vertices.length-1;
            var len1 = point.length-1;
            faces.push(new THREE.Face3(len-len1,len,len-len1+1));
            faces.push(new THREE.Face3(len,len-len1,len-len1+2));
            break;
            
    }
    return [vertices,faces,point];
}