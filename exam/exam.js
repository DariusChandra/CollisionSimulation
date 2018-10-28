/*
	exam.js
	Represent problems for exam in JS
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180303
	Start this library.
	20180304
	Continue improving this library.
*/
function examMyProject(){
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	var sel = window.event.target;
	
	// Execute a test function
	test_define_rectangle();

	// 20180213.0751-1512 ok
	function test_define_rectangle() {
		// Define a box coordinates
		/*
				z
				|
				
				H           G
				 .---------.
				/         /|
		 E /       F / |
			.---------.  |
			|  .      |  .
			| D       | / C
			|         |/
			.---------.    -- x
		 A           B
		*/
		var s = 1;
		var rA = new Vect3(0, 0, 0);
		var rB = new Vect3(s, 0, 0);
		var rC = new Vect3(s, s, 0);
		var rD = new Vect3(0, s, 0);
		var rE = new Vect3(0, 0, s);
		var rF = new Vect3(s, 0, s);
		var rG = new Vect3(s, s, s);
		var rH = new Vect3(0, s, s);
		
		// Define box sides
		var surf = new Grid4();
		var sides = [];
		surf = new Grid4(rE, rF, rB, rA);
		sides.push(surf);
		surf = new Grid4(rF, rG, rC, rB);
		sides.push(surf);
		surf = new Grid4(rG, rH, rD, rC);
		sides.push(surf);
		surf = new Grid4(rH, rE, rA, rD);
		sides.push(surf);
		surf = new Grid4(rE, rH, rG, rF);
		sides.push(surf);
		
		// Defina spherical particles
		var p = new Sphere();
		var pars = [];
		p = new Sphere();
		p.m = 4;
		p.d = 0.05;
		p.r = new Vect3(s/2, s/2, 0.25);
		p.v = new Vect3(0.1, 0.1, 0);
		pars.push(p);
		
		// Define world coordinate
		var xmin = -0.1;
		var ymin = -0.1;
		var xmax = 1.1;
		var ymax = 1.1;
		
		// Define canvas size
		var canvasWidth = 150;
		var canvasHeight = 150;
		
		// Define canvas coordinate
		var XMIN = 0;
		var YMIN = canvasHeight;
		var XMAX = canvasWidth;
		var YMAX = 0;
		
		// Create a canvas
		var c = document.createElement("canvas");
		c.id = "drawingboard";
		c.width = canvasWidth;
		c.height = canvasHeight;
		c.style.border = "1px solid #ccc";
		
		// Create some divs
		var d;
		d	= document.createElement("div");
		d.id = "ekin";
		document.body.appendChild(d);
		d	= document.createElement("div");
		d.id = "hidtext";
		document.body.appendChild(d);
		
		// Draw a circle
		function drawSphere(id, s, color) {
			var cx = document.getElementById(id).getContext("2d");
			cx.strokeStyle = color;
			cx.beginPath();
			var rr = transform({x: s.r.x, y: s.r.y});
			var rr2 = transform({x: s.r.x + s.d, y: s.r.y});
			var DD = rr2.x - rr.x;
			cx.arc(rr.x, rr.y, 0.5 * DD, 0, 2 * Math.PI);
			cx.stroke();
		}
		
		// Draw sides of rectangle
		function drawRectangles(id, surfs, color) {
			var cx = document.getElementById(id).getContext("2d");
			cx.strokeStyle = color;
			var N = surfs.length;
			for(var i = 0; i < N; i++) {
				var M = surfs[i].p.length;
				cx.beginPath();
				for(var j = 0; j < M; j++) {
					var s = surfs[i];
					var rr = transform({x: s.p[j].x, y: s.p[j].y});
					if(j == 0) {
						cx.moveTo(rr.x, rr.y);
					} else {
						cx.lineTo(rr.x, rr.y);
					}
				}
				cx.stroke();
			}
		}
		
		// Clear canvas with color
		function clearCanvas() {
			var id = arguments[0];
			var el = document.getElementById(id);
			var color = arguments[1];
			var cx = el.getContext("2d");
			cx.fillStyle = color;
			cx.fillRect(0, 0, c.width, c.height);
		}
		
		// Transform (x, y) to (X, Y)
		function transform(r) {
			var X = (r.x - xmin) / (xmax - xmin) * (XMAX - XMIN);
			X += XMIN;
			var Y = (r.y - ymin) / (ymax - ymin) * (YMAX - YMIN);
			Y += YMIN;
			return {x: X, y: Y};
		}
		
		// Collide particle and a rectangle surface
		function collide(p, surf) {
			// Declare force variable
			var F = new Vect3();
			
			// Define constants
			var kN = 100;
			var gN = 0.2;
			
			if(arguments[1] instanceof Grid4) {
				// Get colliding objects
				var p = arguments[0];
				var surf = arguments[1];
				
				// Calculate normal vector
				var r10 = Vect3.sub(surf.p[1], surf.p[0]);
				var r21 = Vect3.sub(surf.p[2], surf.p[1]);
				var n = Vect3.cross(r10, r21);
				
				// Calculate distance from surface
				var r = p.r;
				var dr = Vect3.sub(r, surf.p[0]);
				var h = Math.abs(Vect3.dot(dr, n));
				
				// Calculate overlap
				var xi = Math.max(0, 0.5 * p.d - h);
				var xidot = Vect3.dot(p.v, n);
				
				// Calculate force
				var f = (xi > 0) ? kN * xi - gN * xidot : 0;
				F = Vect3.mul(f, n);
			} else {
				// Get colliding objects
				var p0 = arguments[0];
				var p1 = arguments[1];
				
				// Calculate overlap
				var r10 = Vect3.sub(p1.r, p0.r);
				var l10 = r10.len();
				var n = r10.unit();
				var v10 = Vect3.sub(p1.v, p0.v);
				var xi = Math.max(0, 0.5 * (p1.d + p0.d) - l10);
				var xidot = Vect3.dot(v10, n);
				
				// Calculate force
				var f = (xi > 0) ? kN * xi - gN * xidot : 0;
				var m0 = p0.m;
				var m1 = p1.m;
				var mu = (m1 * m0) / (m0 + m1);
				f /= mu;
				F = Vect3.mul(f, n);
			}
			
			// Return force value
			return F;
		}
		
		var TBEG = new Date().getTime()
		console.log("BEG: " + TBEG);
		var tbeg = 0;
		var tend = 1000;
		var dt = 5E-2;
		var t = tbeg;
		var NT = 100;
		var iT = 0;
		var NT2 = 10;
		var iT2 = 0;
		
		// 20180222.2117
		var div = document.createElement("div");
		div.style.textAlign = "center";
		//Add sphere Button
		var buttonAdd = document.createElement("button");
		buttonAdd.innerHTML = "Add Particle";
		div.appendChild(buttonAdd);
		
		buttonAdd.addEventListener("click", function() {
		var theta = randInt(-180, 180);
		var vx=0.03*Math.cos(theta * Math.PI / 180);;
		var vy=0.03*Math.sin(theta * Math.PI / 180);
		p = new Sphere();
		p.m = 4;
		p.d = 0.05;
		p.r = new Vect3(s/2, s/2, 0.25);
		p.v = new Vect3(vx,vy, 0);
		pars.push(p);
		});
		//Restart Button
		var restart = document.createElement("button");
		restart.innerHTML = "Restart";
		div.appendChild(restart);
		
		restart.addEventListener("click", function() {
		pars = [];		
		p = new Sphere();
		p.m = 4;
		p.d = 0.05;
		p.r = new Vect3(s/2, s/2, 0.25);
		p.v = new Vect3(0.1, 0.1, 0);
		pars.push(p);
		t=tbeg;
		});
		
		
		var b1 = document.createElement("button");
		b1.innerHTML = "Start";
		div.append(c);
		div.appendChild(b1);
		eout.append(div);
		var ekin = document.createElement("div");
		ekin.id = "ekin";
		div.append(ekin);
		
		var iter;
		
		b1.addEventListener("click", function() {
			if(b1.innerHTML == "Start") {
				b1.innerHTML = "Stop";
				sel.disabled = true;
				iter = setInterval(simulate, 5);
			} else {
				b1.innerHTML = "Start";
				clearInterval(iter);
				sel.disabled = false;
			}
		});
				
		function calculate() {
			var M = pars.length;
			
			for(var j = 0; j < M; j++) {
				var p = pars[j];
				
				// Calculate force with wall
				var SF = new Vect3();
				var N = sides.length;
				for(var i = 0; i < N; i++) {
					var F = collide(p, sides[i]);
					SF = Vect3.add(SF, F);
				}
				
				// Calculate force with other particles
				for(var i = 0; i < M; i++) {
					if(i != j) {
						var F = collide(pars[i], pars[j]);
						SF = Vect3.add(SF, F);
					}
				}
				
				// Calculate acceleration
				p.a = Vect3.div(SF, p.m);
				
				// Perform Euler numerical integration
				p.v = Vect3.add(p.v, Vect3.mul(p.a, dt));
				p.r = Vect3.add(p.r, Vect3.mul(p.v, dt));
			}
			
			// Increase time
			t += dt;
			
			// Stop simulation
			if(t > tend) {
				clearInterval(iter);
				var TEND = new Date().getTime();
				console.log("END: " + TEND);
				var TDUR = TEND - TBEG;
				console.log("DUR: " + TDUR);
			}
		}
		
		function simulate() {
			calculate();
			
			iT++;
			iT2++;
			
			if(iT2 >= NT2) {
				// Clear and draw
				clearCanvas("drawingboard", "#fff");
				drawRectangles("drawingboard", sides, "#f00");
				var M = pars.length;
				for(var j = 0; j < M; j++) {
					drawSphere("drawingboard", pars[j], "#00f");
				}
				iT2 = 0;
			}
			if(iT >= NT) {
				// Calculate total kenetic energy
				var K = 0;
				var M = pars.length;
				for(var j = 0; j < M; j++) {
					var v = pars[j].v.len();
					var m = pars[j].m;
					K += (0.5 * m * v * v);
				var sK = K.toExponential(2)
				}
				var aa = sK.split("e")[0];
				var bb = sK.split("e")[1];
				var textEkin = "<i>K</i> = " + aa
					+ " &times; 10<sup>" + bb + "</sup> J";
				ekin.innerHTML = textEkin;
				
				iT = 0;
			}
		}
	}
}
function examRandomDataChart(){
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	
	var ecan = document.createElement("canvas");
	ecan.width = "300";
	ecan.height = "200";
	ecan.style.width = "300px";
	ecan.style.height = "200px";
	ecan.id = "drawingArea"
	ecan.style.background = "#f8f8f8";
		
	eout.appendChild(ecan);
	
	var t1=1;//batas kiri 
	var t2=20;//batas kanan
	var x=[];//data
	var N=20;//Jumlah data
	var xdummy=[];
	var initialize=true;//true jika generate data pertama kali
	var iter;
	var b1 = document.createElement("button");
	b1.innerHTML = "Start";
	eout.appendChild(b1);
	
		b1.addEventListener("click", function() {
			if(b1.innerHTML == "Start") {
				b1.innerHTML = "Stop";
				MenuPermission=false;
				iter = setInterval(generateData, 500);
			} else {
				b1.innerHTML = "Start";
				MenuPermission=true;
				clearInterval(iter);
			}
	});
	
	function generateData(){
		var t = [];
		if(initialize==false){
		x=xdummy;
		x[N-1]=Math.floor((Math.random() * 10) + 1);
		}
		for(var dt=0;dt<N;dt++){
			t[dt]=t1+dt;
			//Hanya generate 20 data untuk pertama kali
			if(initialize==true){
			x[dt] = Math.floor((Math.random() * 10) + 1);
			}
			if(dt>0){
			xdummy[dt-1] = x[dt];
			}
		}
		var series = new XYSeries("series1", t, x);
		var chart = new Chart2("drawingArea");
		t1++;
		initialize=false;
		chart.yAxis.Ntics = 4;
		chart.xAxis.Ntics = 8;
		chart.addSeries(series);
		chart.drawSeries("series1");
	}
}
function examMatrixAdditionMathJax(){
		var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	
	var elef = document.createElement("div");
	elef.style.width = "125px";
	elef.style.float = "left";
	
	var elef2 = document.createElement("div");
	elef2.style.width = "125px";
	elef2.style.float = "left";
	
	var erig = document.createElement("div");
	erig.style.float = "left";
	erig.style.padding = "4px 50px 4px 50px";
	erig.id = "mathjax-matrix"
	
	var etxa = document.createElement("textarea");
	etxa.style.width = "120px";
	etxa.style.height = "120px";
	etxa.style.overflowY = "scroll"
	etxa.value = "1 2 3 4\n"
	+ "0 4 0 4\n"
	+ "1 3 9 7\n"
	+ "6 4 5 8";
	
	var etxa2 = document.createElement("textarea");
	etxa2.style.width = "120px";
	etxa2.style.height = "120px";
	etxa2.style.overflowY = "scroll"
	etxa2.value = "1 2 3 4\n"
	+ "3 2 8 4\n"
	+ "6 1 2 7\n"
	+ "9 7 0 5";
	
	var ebtn = document.createElement("button");
	ebtn.innerHTML = "Add matrices";
	ebtn.style.width = "125px";
	ebtn.addEventListener("click", btnClick);
	
	eout.appendChild(elef);
	eout.appendChild(elef2);
	elef.appendChild(etxa);
	elef.appendChild(ebtn);
	elef2.appendChild(etxa2);
	eout.appendChild(erig);
	
	function btnClick() {
		var content = etxa.value;
		var content2 = etxa2.value;
		var lines = content.split("\n");
		var lines2 = content2.split("\n");
		var M = [];
		var M2 = [];
		for(var j = 0; j < lines.length; j++) {
			var words = lines[j].split(" ");
			var words2 = lines2[j].split(" ");
			var row = [];
			var row2 = [];
			for(var i = 0; i < words.length; i++) {
				var Mel = words[i];
				var Mel2 = words2[i];
				row.push(Mel);
				row2.push(Mel2);
			}
			M.push(row);
			M2.push(row2);
		}
		var ROW = M.length;
		
		var latex = "\\begin{equation}\n"
			+ "M = \\left[\n"
			+ "\\begin{array}\n";
		var COL = M[0].length;
		var COL2 = M2[0].length;
		latex += "{" + "c".repeat(COL) + "}\n";
		for(var j = 0; j < ROW; j++) {
			var arow = M[j];
			var arow2 = M2[j];
			var COL = arow.length;
			for(var i = 0; i < COL; i++) {
				var Mtotal= parseInt(M[j][i])+parseInt(M2[j][i]);
				latex += Mtotal;
				if(i < COL - 1) {
					latex += " & ";
				} else {
					latex += " \\\\\n";
				}
			}
		}
		latex += "\\end{array}\n"
			+ "\\right]\n"
			+ "\\end{equation}";
		
		updateMath("mathjax-matrix", latex)
	}
	
	
	
}
function examDynamicColor(){
	var div = document.getElementById("scriptResult");
	div.innerHTML = "&nbsp;";
	var can = document.createElement("canvas");
	div.appendChild(can);
	
	var cx = can.getContext("2d");
	cx.fillStyle = int2rgb(255 , 255, 255);
	cx.strokeStyle = int2rgb(0 , 0, 0);
	cx.lineWidth = 5;
	cx.beginPath();
	cx.arc(50, 50, 40, 0, 2 * Math.PI);
	cx.fill();
	cx.stroke();
	
	var b1 = document.createElement("button");
	b1.innerHTML = "Start";
	div.appendChild(b1);
	
	var GB=255;//Green Blue
	var descend=true;
	var iter;
	
	b1.addEventListener("click", function() {
			if(b1.innerHTML == "Start") {
				b1.innerHTML = "Stop";
				iter = setInterval(changeColor, 10);
			} else {
				b1.innerHTML = "Start";
				clearInterval(iter);
			}
	});
	
	function changeColor(){
		if(descend==true){
			GB =GB-5;
			if(GB<0){
			descend=false;	
			}
		} 
		if(descend==false){
			GB =GB+5;
			if(GB>=255){
			descend=true;	
			}
		}
	cx.fillStyle = int2rgb(255 ,GB,GB);
	cx.fill();
	}
}
function examDrawCircularMotion(){
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	var sel = window.event.target;
	
	// Execute a test function
	test_define_rectangle();

	// 20180213.0751-1512 ok
	function test_define_rectangle() {
		// Define a box coordinates
		/*
				z
				|
				
				H           G
				 .---------.
				/         /|
		 E /       F / |
			.---------.  |
			|  .      |  .
			| D       | / C
			|         |/
			.---------.    -- x
		 A           B
		*/
		var s = 1;
		var rA = new Vect3(0, 0, 0);
		var rB = new Vect3(s, 0, 0);
		var rC = new Vect3(s, s, 0);
		var rD = new Vect3(0, s, 0);
		var rE = new Vect3(0, 0, s);
		var rF = new Vect3(s, 0, s);
		var rG = new Vect3(s, s, s);
		var rH = new Vect3(0, s, s);
		
		// Define box sides
		var surf = new Grid4();
		var sides = [];
		surf = new Grid4(rE, rF, rB, rA);
		sides.push(surf);
		surf = new Grid4(rF, rG, rC, rB);
		sides.push(surf);
		surf = new Grid4(rG, rH, rD, rC);
		sides.push(surf);
		surf = new Grid4(rH, rE, rA, rD);
		sides.push(surf);
		surf = new Grid4(rE, rH, rG, rF);
		sides.push(surf);
		
		// Define spherical particles
		var p = new Sphere();
		var pars = [];
		p=new Sphere();
		p.m = 4;
		p.d = 0.2;
		p.r = new Vect3(0.25, 0.25, 0.25);
		p.v = new Vect3(0.1, 0.05, 0);
		pars.push(p);
		
		// Define world coordinate
		var xmin = -0.1;
		var ymin = -0.1;
		var xmax = 1.1;
		var ymax = 1.1;
		
		// Define canvas size
		var canvasWidth = 150;
		var canvasHeight = 150;
		
		// Define canvas coordinate
		var XMIN = 0;
		var YMIN = canvasHeight;
		var XMAX = canvasWidth;
		var YMAX = 0;
		
		// Create a canvas
		var c = document.createElement("canvas");
		c.id = "drawingboard";
		c.width = canvasWidth;
		c.height = canvasHeight;
		c.style.border = "1px solid #ccc";
		
		// Create some divs
		var d;
		d	= document.createElement("div");
		d.id = "ekin";
		document.body.appendChild(d);
		d	= document.createElement("div");
		d.id = "hidtext";
		document.body.appendChild(d);
		
		// Draw a circle
		function drawSphere(id, s, color) {
			var cx = document.getElementById(id).getContext("2d");
			cx.strokeStyle = color;
			cx.beginPath();
			var rr = transform({x: s.r.x, y: s.r.y});
			var rr2 = transform({x: s.r.x + s.d, y: s.r.y});
			var DD = rr2.x - rr.x;
			cx.arc(rr.x, rr.y, 0.5 * DD, 0, 2 * Math.PI);
			cx.stroke();
		}
		
		// Draw sides of rectangle
		function drawRectangles(id, surfs, color) {
			var cx = document.getElementById(id).getContext("2d");
			cx.strokeStyle = color;
			var N = surfs.length;
			for(var i = 0; i < N; i++) {
				var M = surfs[i].p.length;
				cx.beginPath();
				for(var j = 0; j < M; j++) {
					var s = surfs[i];
					var rr = transform({x: s.p[j].x, y: s.p[j].y});
					if(j == 0) {
						cx.moveTo(rr.x, rr.y);
					} else {
						cx.lineTo(rr.x, rr.y);
					}
				}
				cx.stroke();
			}
		}
		
		// Clear canvas with color
		function clearCanvas() {
			var id = arguments[0];
			var el = document.getElementById(id);
			var color = arguments[1];
			var cx = el.getContext("2d");
			cx.fillStyle = color;
			cx.fillRect(0, 0, c.width, c.height);
		}
		
		// Transform (x, y) to (X, Y)
		function transform(r) {
			var X = (r.x - xmin) / (xmax - xmin) * (XMAX - XMIN);
			X += XMIN;
			var Y = (r.y - ymin) / (ymax - ymin) * (YMAX - YMIN);
			Y += YMIN;
			return {x: X, y: Y};
		}
		
		// Collide particle and a rectangle surface
		
		var TBEG = new Date().getTime()
		console.log("BEG: " + TBEG);
		var tbeg = 0;
		var tend = 1000;
		var dt = 5E-2;
		var t = tbeg;
		var NT = 100;
		var iT = 0;
		var NT2 = 10;
		var iT2 = 0;
		
		var xc=5;
		var yc=5;
		var A=0.2;
		var T=10;
		// 20180222.2117
		var div = document.createElement("div");
		div.style.textAlign = "center";
		var b1 = document.createElement("button");
		b1.innerHTML = "Start";
		div.append(c);
		div.appendChild(b1);
		eout.append(div);
		var ekin = document.createElement("div");
		ekin.id = "ekin";
		div.append(ekin);
		
		var iter;
		
		b1.addEventListener("click", function() {
			if(b1.innerHTML == "Start") {
				b1.innerHTML = "Stop";
				sel.disabled = true;
				iter = setInterval(simulate, 5);
			} else {
				b1.innerHTML = "Start";
				clearInterval(iter);
				sel.disabled = false;
			}
		});
				
		
		function simulate() {
			p.r=new Vect3(0.5+A*Math.cos(2*Math.PI*t/T),0.5+A*Math.sin(2*Math.PI*t/T),s);
			t=t+dt;
			//p.r=new Vect3(xc+A*Math.cos(2*Math.PI*t/T),yc+A*Math.cos(2*Math.PI*t/T),0.25);
				// Clear and draw
				clearCanvas("drawingboard", "#fff");
				drawRectangles("drawingboard", sides, "#f00");
				var M = pars.length;
				drawSphere("drawingboard", p, "#00f");
			
		}
	}
}

function examArrayOfCircle(){
	var div = document.getElementById("scriptResult");
	div.innerHTML = "&nbsp;";
	div.height=2000;
	var can = document.createElement("canvas");
	can.width=1500;
	can.height=1500;
	div.appendChild(can);
	
	for (var j=1;j<=4;j++){
		for (var i=0;i<j;i++){
		var cx = can.getContext("2d");
		cx.fillStyle = "#76D7C4";
		cx.strokeStyle = "#1F618D";
		cx.lineWidth = 5;
		cx.beginPath();
		cx.arc(30+60*i,60*j, 25, 0, 2 * Math.PI);
		cx.fill();
		cx.stroke();
		}
	}
}
function examTextareaAndChartXY() {
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	
	var elef = document.createElement("div");
	elef.style.width = "125px";
	elef.style.float = "left";
	
	var erig = document.createElement("div");
	erig.style.float = "left";
	erig.style.padding = "4px 50px 4px 50px";
	erig.id = "mathjax-matrix"
	
	//Canvas
	var ecan = document.createElement("canvas");
	ecan.width = "300";
	ecan.height = "200";
	ecan.style.width = "300px";
	ecan.style.height = "200px";
	ecan.id = "drawingArea"
	ecan.style.background = "#f8f8f8";
	
	erig.appendChild(ecan);
	
	//Data to be plotted
	var A=2;
	var T=10;
	var t = [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10];
	var x=[];
	var N;
	for(var i=0;i<t.length;i++){
		x[i]=A*Math.sin(2*Math.PI*t[i]/T);
	}
	
	
	var etxa = document.createElement("textarea");
	etxa.style.width = "120px";
	etxa.style.height = "120px";
	etxa.style.overflowY = "scroll"
	etxa.value = "1 2 3 4\n"
	+ "0 4 0 4\n"
	+ "1 3 9 7\n"
	+ "6 4 5 8";
	
	var ebtn = document.createElement("button");
	ebtn.innerHTML = "Plot data";
	ebtn.style.width = "125px";
	ebtn.addEventListener("click", btnClick);
	
	eout.appendChild(elef);
	elef.appendChild(etxa);
	elef.appendChild(ebtn);
	eout.appendChild(erig);
	
	function btnClick() {
		var content = etxa.value;
		var lines = content.split("\n");
		var M = [];
		for(var j = 0; j < lines.length; j++) {
			var words = lines[j].split(" ");
			var row = [];
			for(var i = 0; i < words.length; i++) {
				var Mel = words[i];
				row.push(Mel);
			}
			M.push(row);
		}
		var ROW = M.length;
		
		var latex = "\\begin{equation}\n"
			+ "M = \\left[\n"
			+ "\\begin{array}\n";
		var COL = M[0].length;
		M[0][0]="\\frac{1}{10}";
		M[0][3]="\\log{ \\frac{3}{9} }";
		M[1][2]="\\sin{x^2}";
		M[2][1]="-\\exp{y}";
		M[3][3]="\\frac{z}{x}";
		latex += "{" + "c".repeat(COL) + "}\n";
		for(var j = 0; j < ROW; j++) {
			var arow = M[j];
			var COL = arow.length;
			for(var i = 0; i < COL; i++) {
				latex += M[j][i];
				if(i < COL - 1) {
					latex += " & ";
				} else {
					latex += " \\\\\n";
				}
			}
		}
		latex += "\\end{array}\n"
			+ "\\right]\n"
			+ "\\end{equation}";
		
		updateMath("mathjax-matrix", latex)
	}
}

// 20180304.1658 ok
function executeScript(target, menu) {
	var target = window.event.target;
	var value = target.value;
	var idx = target.selectedIndex;
	var script = menu[idx][1];
	script();
}

// 20180306.0514 ok
function examThreeGrains() {
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	var sel = window.event.target;
	
	// Execute a test function
	test_define_rectangle();

	// 20180213.0751-1512 ok
	function test_define_rectangle() {
		// Define a box coordinates
		/*
				z
				|
				
				H           G
				 .---------.
				/         /|
		 E /       F / |
			.---------.  |
			|  .      |  .
			| D       | / C
			|         |/
			.---------.    -- x
		 A           B
		*/
		var s = 1;
		var rA = new Vect3(0, 0, 0);
		var rB = new Vect3(s, 0, 0);
		var rC = new Vect3(s, s, 0);
		var rD = new Vect3(0, s, 0);
		var rE = new Vect3(0, 0, s);
		var rF = new Vect3(s, 0, s);
		var rG = new Vect3(s, s, s);
		var rH = new Vect3(0, s, s);
		
		// Define box sides
		var surf = new Grid4();
		var sides = [];
		surf = new Grid4(rE, rF, rB, rA);
		sides.push(surf);
		surf = new Grid4(rF, rG, rC, rB);
		sides.push(surf);
		surf = new Grid4(rG, rH, rD, rC);
		sides.push(surf);
		surf = new Grid4(rH, rE, rA, rD);
		sides.push(surf);
		surf = new Grid4(rE, rH, rG, rF);
		sides.push(surf);
		
		// Defina spherical particles
		var p = new Sphere();
		var pars = [];
		p = new Sphere();
		p.m = 4;
		p.d = 0.2;
		p.r = new Vect3(0.25, 0.25, 0.25);
		p.v = new Vect3(0.1, 0.05, 0);
		pars.push(p);
		p = new Sphere();
		p.m = 4;
		p.d = 0.2;
		p.r = new Vect3(0.25, 0.5, 0.25);
		p.v = new Vect3(0.0, 0.05, 0);
		pars.push(p);
		p = new Sphere();
		p.m = 4;
		p.d = 0.2;
		p.r = new Vect3(0.8, 0.8, 0.25);
		p.v = new Vect3(-0.02, 0.05, 0);
		pars.push(p);
		
		// Define world coordinate
		var xmin = -0.1;
		var ymin = -0.1;
		var xmax = 1.1;
		var ymax = 1.1;
		
		// Define canvas size
		var canvasWidth = 150;
		var canvasHeight = 150;
		
		// Define canvas coordinate
		var XMIN = 0;
		var YMIN = canvasHeight;
		var XMAX = canvasWidth;
		var YMAX = 0;
		
		// Create a canvas
		var c = document.createElement("canvas");
		c.id = "drawingboard";
		c.width = canvasWidth;
		c.height = canvasHeight;
		c.style.border = "1px solid #ccc";
		
		// Create some divs
		var d;
		d	= document.createElement("div");
		d.id = "ekin";
		document.body.appendChild(d);
		d	= document.createElement("div");
		d.id = "hidtext";
		document.body.appendChild(d);
		
		// Draw a circle
		function drawSphere(id, s, color) {
			var cx = document.getElementById(id).getContext("2d");
			cx.strokeStyle = color;
			cx.beginPath();
			var rr = transform({x: s.r.x, y: s.r.y});
			var rr2 = transform({x: s.r.x + s.d, y: s.r.y});
			var DD = rr2.x - rr.x;
			cx.arc(rr.x, rr.y, 0.5 * DD, 0, 2 * Math.PI);
			cx.stroke();
		}
		
		// Draw sides of rectangle
		function drawRectangles(id, surfs, color) {
			var cx = document.getElementById(id).getContext("2d");
			cx.strokeStyle = color;
			var N = surfs.length;
			for(var i = 0; i < N; i++) {
				var M = surfs[i].p.length;
				cx.beginPath();
				for(var j = 0; j < M; j++) {
					var s = surfs[i];
					var rr = transform({x: s.p[j].x, y: s.p[j].y});
					if(j == 0) {
						cx.moveTo(rr.x, rr.y);
					} else {
						cx.lineTo(rr.x, rr.y);
					}
				}
				cx.stroke();
			}
		}
		
		// Clear canvas with color
		function clearCanvas() {
			var id = arguments[0];
			var el = document.getElementById(id);
			var color = arguments[1];
			var cx = el.getContext("2d");
			cx.fillStyle = color;
			cx.fillRect(0, 0, c.width, c.height);
		}
		
		// Transform (x, y) to (X, Y)
		function transform(r) {
			var X = (r.x - xmin) / (xmax - xmin) * (XMAX - XMIN);
			X += XMIN;
			var Y = (r.y - ymin) / (ymax - ymin) * (YMAX - YMIN);
			Y += YMIN;
			return {x: X, y: Y};
		}
		
		// Collide particle and a rectangle surface
		function collide(p, surf) {
			// Declare force variable
			var F = new Vect3();
			
			// Define constants
			var kN = 100;
			var gN = 0.2;
			
			if(arguments[1] instanceof Grid4) {
				// Get colliding objects
				var p = arguments[0];
				var surf = arguments[1];
				
				// Calculate normal vector
				var r10 = Vect3.sub(surf.p[1], surf.p[0]);
				var r21 = Vect3.sub(surf.p[2], surf.p[1]);
				var n = Vect3.cross(r10, r21);
				
				// Calculate distance from surface
				var r = p.r;
				var dr = Vect3.sub(r, surf.p[0]);
				var h = Math.abs(Vect3.dot(dr, n));
				
				// Calculate overlap
				var xi = Math.max(0, 0.5 * p.d - h);
				var xidot = Vect3.dot(p.v, n);
				
				// Calculate force
				var f = (xi > 0) ? kN * xi - gN * xidot : 0;
				F = Vect3.mul(f, n);
			} else {
				// Get colliding objects
				var p0 = arguments[0];
				var p1 = arguments[1];
				
				// Calculate overlap
				var r10 = Vect3.sub(p1.r, p0.r);
				var l10 = r10.len();
				var n = r10.unit();
				var v10 = Vect3.sub(p1.v, p0.v);
				var xi = Math.max(0, 0.5 * (p1.d + p0.d) - l10);
				var xidot = Vect3.dot(v10, n);
				
				// Calculate force
				var f = (xi > 0) ? kN * xi - gN * xidot : 0;
				var m0 = p0.m;
				var m1 = p1.m;
				var mu = (m1 * m0) / (m0 + m1);
				f /= mu;
				F = Vect3.mul(f, n);
			}
			
			// Return force value
			return F;
		}
		
		var TBEG = new Date().getTime()
		console.log("BEG: " + TBEG);
		var tbeg = 0;
		var tend = 1000;
		var dt = 5E-2;
		var t = tbeg;
		var NT = 100;
		var iT = 0;
		var NT2 = 10;
		var iT2 = 0;
		
		// 20180222.2117
		var div = document.createElement("div");
		div.style.textAlign = "center";
		var b1 = document.createElement("button");
		b1.innerHTML = "Start";
		div.append(c);
		div.appendChild(b1);
		eout.append(div);
		var ekin = document.createElement("div");
		ekin.id = "ekin";
		div.append(ekin);
		
		var iter;
		
		b1.addEventListener("click", function() {
			if(b1.innerHTML == "Start") {
				b1.innerHTML = "Stop";
				sel.disabled = true;
				iter = setInterval(simulate, 5);
			} else {
				b1.innerHTML = "Start";
				clearInterval(iter);
				sel.disabled = false;
			}
		});
				
		function calculate() {
			var M = pars.length;
			
			for(var j = 0; j < M; j++) {
				var p = pars[j];
				
				// Calculate force with wall
				var SF = new Vect3();
				var N = sides.length;
				for(var i = 0; i < N; i++) {
					var F = collide(p, sides[i]);
					SF = Vect3.add(SF, F);
				}
				
				// Calculate force with other particles
				for(var i = 0; i < M; i++) {
					if(i != j) {
						var F = collide(pars[i], pars[j]);
						SF = Vect3.add(SF, F);
					}
				}
				
				// Calculate acceleration
				p.a = Vect3.div(SF, p.m);
				
				// Perform Euler numerical integration
				p.v = Vect3.add(p.v, Vect3.mul(p.a, dt));
				p.r = Vect3.add(p.r, Vect3.mul(p.v, dt));
			}
			
			// Increase time
			t += dt;
			
			// Stop simulation
			if(t > tend) {
				clearInterval(iter);
				var TEND = new Date().getTime();
				console.log("END: " + TEND);
				var TDUR = TEND - TBEG;
				console.log("DUR: " + TDUR);
			}
		}
		
		function simulate() {
			calculate();
			
			iT++;
			iT2++;
			
			if(iT2 >= NT2) {
				// Clear and draw
				clearCanvas("drawingboard", "#fff");
				drawRectangles("drawingboard", sides, "#f00");
				var M = pars.length;
				for(var j = 0; j < M; j++) {
					drawSphere("drawingboard", pars[j], "#00f");
				}
				iT2 = 0;
			}
			if(iT >= NT) {
				// Calculate total kenetic energy
				var K = 0;
				var M = pars.length;
				for(var j = 0; j < M; j++) {
					var v = pars[j].v.len();
					var m = pars[j].m;
					K += (0.5 * m * v * v);
				var sK = K.toExponential(2)
				}
				var aa = sK.split("e")[0];
				var bb = sK.split("e")[1];
				var textEkin = "<i>K</i> = " + aa
					+ " &times; 10<sup>" + bb + "</sup> J";
				ekin.innerHTML = textEkin;
				
				iT = 0;
			}
		}
	}
}

// 20180305.2023 ok
function examRandomLines() {
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	
	var w = 200;
	var h = 200;
	
	var can = createCanvasWithId("drawingArea", w, h);
	eout.appendChild(can);
	var cx = can.getContext("2d");
	
	var i = 0;
	var di = 1;
	var iend = 1000;
	var sel = window.event.target;
	sel.disabled = true;
	
	var tid = setInterval(randomLine, 10);
	
	var x = w / 2;
	var y = h / 2; 
	
	var theta = randInt(-180, 180);
	function randomLine() {
		if(i >= iend) {
			i = iend;
			clearInterval(tid);
			sel.disabled = false;
		}
	theta=theta+90*randInt(-1,1);
		var dr = 10;
		var dx = dr * Math.cos(theta * Math.PI / 180);
		var dy = dr * Math.sin(theta * Math.PI / 180);
		
		var j = (i / iend) * 255;
		cx.strokeStyle = int2rgb(255 - j, 0, j);
		cx.beginPath();
		cx.moveTo(x, y);
		x += dx;
		if(x > w || x < 0) x -= dx;
		y += dy;
		if(y > h || y < 0) y -= dy;
		cx.lineTo(x, y);
		cx.stroke();
		
		i += di;
	}
		
	function createCanvasWithId(id, w, h) {
		var can = document.createElement("canvas");
		can.width = w;
		can.height = h;
		can.style.width = w + "px";
		can.style.height = h + "px";
		can.style.border = "1px solid #bbb";
		can.id = id;
		return can;
	}
}


// 20180305.1948 ok
function examToggleButton() {
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	
	var div = document.createElement("div");
	div.style.width = "40px";
	div.style.height = "40px";
	div.style.border = "1px solid #000";
	div.style.background = "#eee";
	div.style.float = "left";
	
	var div2 = document.createElement("div");
	div2.style.width = "40px";
	div2.style.height = "40px";
	div2.style.border = "1px solid #000";
	div2.style.background = "#eee";
	div2.style.float = "left";
	
	var div3 = document.createElement("div");
	div3.style.width = "40px";
	div3.style.height = "40px";
	div3.style.border = "1px solid #000";
	div3.style.background = "#eee";
	div3.style.float = "left";
	
	var btn = document.createElement("button");
	btn.innerHTML = "Off";
	btn.style.width = "42px";
	btn.style.height = "20px";
	btn.addEventListener("click", switchOnOff);
	
	var btn2 = document.createElement("button");
	btn2.innerHTML = "Off";
	btn2.style.width = "42px";
	btn2.style.height = "20px";
	btn2.addEventListener("click", switchOnOff2);
	
	var btn3 = document.createElement("button");
	btn3.innerHTML = "Off";
	btn3.style.width = "42px";
	btn3.style.height = "20px";
	btn3.addEventListener("click", switchOnOff3);
	
	eout.appendChild(div);
	eout.appendChild(div2);
	eout.appendChild(div3);
	div.appendChild(btn);
	div2.appendChild(btn2);
	div3.appendChild(btn3);
	
	function switchOnOff() {
		var btn = window.event.target;
		if(btn.innerHTML == "Off") {
			btn.innerHTML = "On";
			div.style.background = "#faa";
		} else {
			btn.innerHTML = "Off";
			div.style.background = "#eee";
		}
	}
	
		function switchOnOff2() {
		var btn2 = window.event.target;
		if(btn2.innerHTML == "Off") {
			btn2.innerHTML = "On";
			div2.style.background = "#23E185";
		} else {
			btn2.innerHTML = "Off";
			div2.style.background = "#eee";
		}
	}
	
		function switchOnOff3() {
		var btn3 = window.event.target;
		if(btn3.innerHTML == "Off") {
			btn3.innerHTML = "On";
			div3.style.background = "#23E1E1";
		} else {
			btn3.innerHTML = "Off";
			div3.style.background = "#eee";
		}
	}
}

// 20180304.2142 ok
function examChartXY() {
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	
	var ecan = document.createElement("canvas");
	ecan.width = "300";
	ecan.height = "200";
	ecan.style.width = "300px";
	ecan.style.height = "200px";
	ecan.id = "drawingArea"
	ecan.style.background = "#f8f8f8";
		
	eout.appendChild(ecan);
	
	var A=2;
	var T=10;
	
	var t = [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10];
	var x=[];
	for(var i=0;i<t.length;i++){
		x[i]=A*Math.sin(2*Math.PI*t[i]/T);
	}
	var series = new XYSeries("series1", t, x);
	var chart = new Chart2("drawingArea");
	chart.yAxis.Ntics = 4;
	chart.xAxis.Ntics = 8;
	chart.addSeries(series);
	chart.drawSeries("series1");
}

// 20180304.2107 ok
function examTextareaMatrix() {
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	
	var elef = document.createElement("div");
	elef.style.width = "125px";
	elef.style.float = "left";
	
	var erig = document.createElement("div");
	erig.style.float = "left";
	erig.style.padding = "4px 50px 4px 50px";
	erig.id = "mathjax-matrix"
	
	var etxa = document.createElement("textarea");
	etxa.style.width = "120px";
	etxa.style.height = "120px";
	etxa.style.overflowY = "scroll"
	etxa.value = "1 2 3 4\n"
	+ "0 4 0 4\n"
	+ "1 3 9 7\n"
	+ "6 4 5 8";
	
	var ebtn = document.createElement("button");
	ebtn.innerHTML = "MathJax matrix";
	ebtn.style.width = "125px";
	ebtn.addEventListener("click", btnClick);
	
	eout.appendChild(elef);
	elef.appendChild(etxa);
	elef.appendChild(ebtn);
	eout.appendChild(erig);
	
	function btnClick() {
		var content = etxa.value;
		var lines = content.split("\n");
		var M = [];
		for(var j = 0; j < lines.length; j++) {
			var words = lines[j].split(" ");
			var row = [];
			for(var i = 0; i < words.length; i++) {
				var Mel = words[i];
				row.push(Mel);
			}
			M.push(row);
		}
		var ROW = M.length;
		
		var latex = "\\begin{equation}\n"
			+ "M = \\left[\n"
			+ "\\begin{array}\n";
		var COL = M[0].length;
		M[0][0]="\\frac{1}{10}";
		M[0][3]="\\log{ \\frac{3}{9} }";
		M[1][2]="\\sin{x^2}";
		M[2][1]="-\\exp{y}";
		M[3][3]="\\frac{z}{x}";
		latex += "{" + "c".repeat(COL) + "}\n";
		for(var j = 0; j < ROW; j++) {
			var arow = M[j];
			var COL = arow.length;
			for(var i = 0; i < COL; i++) {
				latex += M[j][i];
				if(i < COL - 1) {
					latex += " & ";
				} else {
					latex += " \\\\\n";
				}
			}
		}
		latex += "\\end{array}\n"
			+ "\\right]\n"
			+ "\\end{equation}";
		
		updateMath("mathjax-matrix", latex)
	}
}

// 20180304.1608 ok
function examTable() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "";
	var A=2;
	var T=10;
	var data = [
		["t", "x", "y"],
	];
	for(var t=0;t<=10;t++){
		data.push([t,A*Math.cos(2*Math.PI*t/T),A*Math.sin(2*Math.PI*t/T)]);
	}
	
	var tab = document.createElement("table");
	tab.style.background = "#fee";
	var ROW = data.length;
	for(var j = 0; j < ROW; j++) {
		var row = document.createElement("tr");
		if(j == 0) {
			row.style.background = "#fde";
			row.style.fontWeight = "bold";
			row.style.fontStyle = "italic";
			row.style.fontFamily = "Times";
			row.style.color = "red";
		} else {
			row.style.background = "#ffe";
		}
		var dataRow = data[j];
		var COL = dataRow.length;
		for(var i = 0; i < COL; i++) {
			var dataCol = dataRow[i];
			var col = document.createElement("td");
			col.style.border = "1px solid #fde";
			col.style.width = "80px";
			col.style.textAlign = "center";
			col.innerHTML = dataCol;
			row.appendChild(col);
		}
		tab.appendChild(row);
	}
	div.appendChild(tab);
}

// 20180304.0929 ok
function examSimpleStatistics() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "&nbsp;";
	var min = 2;
	var max = 10;
	var N = 20;
	var x = randIntN(min, max, N);
	var xsum = 0;
	var xdev=0;
	for(var i = 0; i < N; i++) {
		xsum += x[i];
	}
	var xavg = xsum / N;

	var str = "xmin = " + min + "<br/>";
	str += "xmax = " + max + "<br/>";
	str += "xsum = " + xsum + "<br/>";
	str += "x = [" + x + "]<br/>";
	str += "N = " + N + "<br/>";
	str += "xavg = " + xavg + "<br/>";
	//sorting
	x.sort(function(a, b){return a-b});
	xmed=(x[N/2]+x[N/2-1])/2;
	//Standard deviation
	for(var i = 0; i < N; i++) {
		xdev += (x[i]-xavg)*(x[i]-xavg);
	}
	xdev=Math.sqrt( xdev/(N-1) );
	
	str += "xmed = " + xmed + "<br/>";
	str += "xdev = " + xdev ; 
	div.innerHTML = str;
}

// 20180304.0617 ok
function examProgressBar() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "&nbsp;";
	var i = 0;
	var di = 2;
	var iend = 100;
	var sel = window.event.target;
	sel.disabled = true;
	
	var tid = setInterval(progressBar, 100);
	
	function progressBar() {
		if(i >= iend) {
			i = iend;
			clearInterval(tid);
			sel.disabled = false;
		}
		var N = Math.round(i / di);
		var s = "#".repeat(N) + " " + i + " %";
		div.innerHTML = s;
		i += di;
	}
}

// 20180304.0553 ok
function examButtonClick() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "&nbsp;";
	
	var btnLeft = document.createElement("button");
	btnLeft.style.width = "120px";
	btnLeft.innerHTML = "Not yet clicked";
	btnLeft.addEventListener("click", buttonClickLeft);
	div.appendChild(btnLeft);
	
	var btnRight = document.createElement("button");
	btnRight.style.width = "120px";
	btnRight.innerHTML = "Not yet clicked";
	btnRight.addEventListener("click", buttonClickRight);
	div.appendChild(btnRight);
	
	var clickedLeft = 0;
	var clickedRight = 0;
	
	function buttonClickLeft() {
		clickedRight++;
		//var target1 = window.event.target;
		if(clickedRight == 1) {
			btnRight.innerHTML = "Clicked once";
		} else if(clickedRight == 2) {
			btnRight.innerHTML = "Clicked twice";
		} else {
			btnRight.innerHTML = "Clicked " + clickedRight + " times";
		}
	}
	
	function buttonClickRight() {
		clickedLeft++;
		//var target1 = window.event.target;
		if(clickedLeft == 1) {
			btnLeft.innerHTML = "Clicked once";
		} else if(clickedLeft == 2) {
			btnLeft.innerHTML = "Clicked twice";
		} else {
			btnLeft.innerHTML = "Clicked " + clickedLeft + " times";
		}
	}
}

// 20180304.0545 ok
function examColorBar() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "&nbsp;";
	N = 16;
	for(var i = 0; i < N; i++) {
		var sp = document.createElement("span");
		var x = i * 16 - 1;
		var color = int2rgb(0, x, 0);
		sp.style.background = color;
		sp.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;\
		&nbsp;&nbsp;&nbsp;&nbsp;";
		div.appendChild(sp);
	}
}

// 20180304.0530 ok
function examLetterConfiguration() {
	var div = document.getElementById("scriptResult");
	var str = "Komputasi Sistem Fisis";
	var N = str.length;
	var str2 = "";
	for(var i = N-1; i >= 0; i-=3) {
		str2 += str.substring(0, i + 1) + "<br/>";
	}
	div.innerHTML = str2;
}

// 20180304.0004 ok
function examDrawCircle() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "&nbsp;";
	var can = document.createElement("canvas");
	div.appendChild(can);
	
	var cx = can.getContext("2d");
	cx.fillStyle = "#76D7C4";
	cx.strokeStyle = "#1F618D";
	cx.lineWidth = 5;
	cx.beginPath();
	cx.arc(50, 50, 40, 0, 2 * Math.PI);
	cx.fill();
	cx.stroke();
	
	var cx2 = can.getContext("2d");
	cx2.fillStyle = "#ABEBC6   ";
	cx2.strokeStyle = "#239B56 ";
	cx2.lineWidth = 5;
	cx2.beginPath();
	cx2.arc(150, 50, 40, 0, 2 * Math.PI);
	cx2.fill();
	cx2.stroke();
	
	var cx3 = can.getContext("2d");
	cx3.fillStyle = "#FADBD8 ";
	cx3.strokeStyle = "#A93226  ";
	cx3.lineWidth = 5;
	cx3.beginPath();
	cx3.arc(250, 50, 40, 0, 2 * Math.PI);
	cx3.fill();
	cx3.stroke();
}

// 20180303.2347 ok
function examMathJaxRootFormula() {
	var div = document.getElementById("scriptResult");	
	var str = "";

	str += "\\begin{equation}";
	str += "ax^2+bx+c = 0  \\tag{1}";
	str += "\\end{equation}";
	
	str += "\\begin{equation}";
	str += "x_{1,2} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\tag{2}";
	str += "\\end{equation}";
	
	str += "\\begin{equation}";
	str += "x^2+\\frac{b}{a}x+\\frac{c}{a} = 0 \\tag{3}";
	str += "\\end{equation}";
	
	str += "\\begin{equation}";
	str += "(x-x_1)(x-x_2) = 0 \\tag{4}";
	str += "\\end{equation}";
	
	str += "\\begin{equation}";
	str += "x_1+x_2 = -\\frac{b}{a} \\tag{5}";
	str += "\\end{equation}";
	
	str += "\\begin{equation}";
	str += "x_1 \\cdot x_2 = -\\frac{c}{a} \\tag{6}";
	str += "\\end{equation}";
	
	updateMath("scriptResult", str);
}

// 20180303.2308 ok
function examDisplaySeries() {
	var div = document.getElementById("scriptResult");
	var N = 10;
	var str = "";
	for(var i = 0; i <= N; i++) {
		var U=i*i+2;
		str += U + "<br/>";
	}
	div.innerHTML = str;
}

// 20180303.2249 ok
function examClear() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "&nbsp;";	
}

// 20180303.2249 ok
function examHelloWorld() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "Selamat pagi dan selamat datang di folder solusi saya untu U1." + "<br/>"
				     +"Nama saya adalah Darius Chandra"+ "<br/>"+"NIM saya adalah 10214083"+"<br/>"
					 + "Senang berkenalan dengan Anda.";
}

// 20180304.0937 ok
function executeFunctionByValue(value) {
	switch(value) {
		case "Select problems":
			examClear();
			break;
		case "Hello world":
			examHelloWorld();
			break;
		case "Letter configuration":
			examLetterConfiguration();
			break;
		case "Display series":
			examDisplaySeries();
			break;
		case "Root formula":
			examMathJaxRootFormula();
			break;
		case "Draw circle":
			examDrawCircle();
			break;
		case "Color bar":
			examColorBar();
			break;
		case "Button click":
			examButtonClick();
			break;
		case "Progress bar":
			examProgressBar();
			break;
		case "Simple statistics":
			examSimpleStatistics();
			break;
		case "Table":
			examTable();
			break;
		case "Textarea and chart xy":
			examTextareaAndChartXY();
			break;
		default:
	}
}
