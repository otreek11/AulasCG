
var canvas;
var gl;

var NumVertices  = 36;

var vertices = [
    vec4( 0.5,  0.5,  0.5, 1.0 ),    // 0
    vec4(-0.5,  0.5,  0.5, 1.0),     // 1
    vec4(-0.5, -0.5,  0.5, 1.0),     // 2
    vec4( 0.5, -0.5,  0.5, 1.0),     // 3

    vec4( 0.5,  0.5, -0.5, 1.0),     // 0
    vec4(-0.5,  0.5, -0.5, 1.0),     // 1
    vec4(-0.5, -0.5, -0.5, 1.0),     // 2
    vec4( 0.5, -0.5, -0.5, 1.0),     // 7
];

var colors = [
    vec4(1.0, 0.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),

    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(1.0, 0.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
];

var sh_vertices = []
var sh_colors = [];

var thetax = 0;
var thetay = 0;
var thetaz = 0;

var xl, yl, zl;

function init_vertice_face(a, b, c, d) {

    var vs = [vertices[a], vertices[b], vertices[c], vertices[a], vertices[c], vertices[d]];
    var cs = [colors[a], colors[b], colors[c], colors[a], colors[c], colors[d]];

    for (var i = 0; i < vs.length; i++) {
        sh_vertices.push(vs[i]);
        sh_colors.push(cs[i]);
    }
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //criar o cubo
    init_vertice_face(0, 1, 2, 3); // frente
    init_vertice_face(4, 0, 3, 7); // lateral direita
    init_vertice_face(1, 5, 6, 2); // lateral esquerda
    init_vertice_face(5, 4, 7, 6); // traseira
    init_vertice_face(0, 1, 5, 4); // cima
    init_vertice_face(6, 7, 3, 2); // baixo

    console.log(flatten(sh_vertices));
    console.log(flatten(sh_colors));

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //  Linka e compila os shaders
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    //Vértices
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(sh_vertices), gl.STATIC_DRAW );    

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    var colBuff = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colBuff );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(sh_colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    xl = gl.getUniformLocation( program, "thetax" );
    yl = gl.getUniformLocation( program, "thetay" );
    zl = gl.getUniformLocation( program, "thetaz" );

    render();
}

function render()
{
    thetax += 0.5;
    thetay += 0.3;
    thetaz += 0.9;

    gl.uniform1f(xl, thetax);
    gl.uniform1f(yl, thetay);
    gl.uniform1f(zl, thetaz);

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
}

