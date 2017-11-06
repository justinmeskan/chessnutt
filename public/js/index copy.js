var state = {
    11: "wc1", 21: "wh1", 31: "wb1", 41: "wk", 51: "wq", 61: "wb2", 71: "wh2", 81: "wc2",
    12: "wp1", 22: "wp2", 32: "wp3", 42: "wp4", 52: "wp5", 62: "wp6", 72: "wp7", 82: "wp8",
    13: "", 23: "", 33: "", 43: "", 53: "", 63: "", 73: "", 83: "",
    14: "", 24: "", 34: "", 44: "", 54: "", 64: "", 74: "", 84: "",
    15: "", 25: "", 35: "", 45: "", 55: "", 65: "", 75: "", 85: "",
    16: "", 26: "", 36: "", 46: "", 56: "", 66: "", 76: "", 86: "",
    17: "bp8", 27: "bp7", 37: "bp6", 47: "bp5", 57: "bp4", 67: "bp3", 77: "bp2", 87: "bp1",
    18: "bc2", 28: "bh2", 38: "bb2", 48: "bk", 58: "bq", 68: "bb1", 78: "bh1", 88: "bc1"
};

// var boardPositions = {
//     wc1:"14.5,0.5",wh1:"14.5,2.5",wb1:"14.5,4.5",wk:"14.5,6.5",wq:"14.5,8.5",wb2:"14.5,10.5",wh2:"14.5,12.5",wc2:"14.5,14.5",
//     wp1:"12.5,0.5",wp2:"12.5,2.5",wp3:"12.5,4.5",wp4:"12.5,6.5",wp5:"12.5,8.5",wp6:"12.5,10.5",wp7:"12.5,12.5",wp8:"12.5,14.5",
//     bp8:"2.5,0.5",bp7:"2.5,2.5",bp6:"2.5,4.5",bp5:"2.5,6.5",bp4:"2.5,8.5",bp3:"2.5,10.5",bp2:"2.5,12.5",bp1:"2.5,14.5",
//     bc2:"0.5,0.5",bh2:"0.5,2.5",bb2:"0.5,4.5",bk:"0.5,6.5",bq:"0.5,8.5",bb1:"0.5,10.5",bh1:"0.5,12.5",bc1:"0.5,14.5"
// };
var boardPositions = {
    "14.5,0.5": "wc1", "14.5,2.5": "wh1", "14.5,4.5": "wb1", "14.5,6.5": "wk", "14.5,8.5": "wq", "14.5,10.5": "wb2", "14.5,12.5": "wh2", "14.5,14.5": "wc2",
    "12.5,0.5": "wp1", "12.5,2.5": "wp2", "12.5,4.5": "wp3", "12.5,6.5": "wp4", "12.5,8.5": "wp5", "12.5,10.5": "wp6", "12.5,12.5": "wp7", "12.5,14.5": "wp8",
    "10.5,0.5": "", "10.5,2.5": "", "10.5,4.5": "", "10.5,6.5": "", "10.5,8.5": "", "10.5,10.5": "", "10.5,12.5": "", "10.5,14.5": "",
    "8.5,0.5": "", "8.5,2.5": "", "8.5,4.5": "", "8.5,6.5": "", "8.5,8.5": "", "8.5,10.5": "", "8.5,12.5": "", "8.5,14.5": "",
    "6.5,0.5": "", "6.5,2.5": "", "6.5,4.5": "", "6.5,6.5": "", "6.5,8.5": "", "6.5,10.5": "", "6.5,12.5": "", "6.5,14.5": "",
    "4.5,0.5": "", "4.5,2.5": "", "4.5,4.5": "", "4.5,6.5": "", "4.5,8.5": "", "4.5,10.5": "", "4.5,12.5": "", "4.5,14.5": "",
    "2.5,0.5": "bp8", "2.5,2.5": "bp7", "2.5,4.5": "bp6", "2.5,6.5": "bp5", "2.5,8.5": "bp4", "2.5,10.5": "bp3", "2.5,12.5": "bp2", "2.5,14.5": "bp1",
    "0.5,0.5": "bc2", "0.5,2.5": "bh2", "0.5,4.5": "bb2", "0.5,6.5": "bk", "0.5,8.5": "bq", "0.5,10.5": "bb1", "0.5,12.5": "bh1", "0.5,14.5": "bc1"
};
var mode = {
    login: false,
    match: false,
    chat: false
};
var renderer;
var scene;
var camera;
var cameraControl;
var tube;
var cameraBG;
var sceneBG;
var composer;
var clock;
var height = window.innerHeight;
var width = window.innerWidth;
function resizeLogin() {
    $('#overLayLogin').css({ 'height': height, 'width': width });
    $('#overLayMatchup').css({ 'height': height, 'width': width });
    $('#overLayChat').css({ 'height': height, 'width': width });
    $('#matchup').css({ 'height': height });
}
$(window).on('load', function () {

    resizeLogin();
});
$(window).on('resize', function () {

    overLaySize();
});
// var toolbartoggle = false;
$('#toolbar').on('mouseover', function (e) {
    $('#toolbar').css({ 'opacity': '1' });
});
$('#toolbar').on('mouseout', function (e) {
    $('#toolbar').css({ 'opacity': '0.005' });
});
function overLaySize() {
    height = window.innerHeight;
    width = window.innerWidth;
    $('#overLayLogin').css({ 'height': height, 'width': width });
    $('#overLayMatchup').css({ 'height': height, 'width': width });
    $('#overLayChat').css({ 'height': height, 'width': width });
    $('#matchup').css({ 'height': height });
};
var gameState = {
    color: 'w',
    pieceActivated: false
};

class Matchup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: {}
        };
    }
    componentDidMount() {
        $.ajax({
            url: '/rooms',
            context: this,
            dataType: 'json',
            type: 'GET'
        }).done(function (data) {
            console.log('data', data);
            this.setState({ rooms: data });
        });
    }
    getRooms() {
        var arrroom = [];
        var state = this.state.rooms;
        var counter = 1;
        console.log('arroom', arrroom);
        arrroom.push(React.createElement(
            "h1",
            { id: "empty", key: "empty" },
            "Please Create A Room"
        ));
        for (var value in state) {
            console.log('values', state[value].roomname);
            counter++;
            arrroom.push(React.createElement(
                "a",
                { key: counter, href: '/joinroom?choosenroom=' + state[value].roomname },
                React.createElement(
                    "ul",
                    null,
                    React.createElement(
                        "li",
                        null,
                        state[value].roomname
                    ),
                    React.createElement(
                        "ul",
                        null,
                        React.createElement(
                            "li",
                            null,
                            state[value].players[0]
                        ),
                        React.createElement(
                            "li",
                            null,
                            state[value].players[1]
                        )
                    )
                )
            ));
        }
        if (arrroom.length > 1) {
            arrroom.shift();
        }
        return React.createElement(
            "div",
            { id: "overlay" },
            React.createElement(
                "div",
                { id: "cover" },
                React.createElement(
                    "div",
                    { id: "matchup" },
                    React.createElement(
                        "div",
                        { id: "content" },
                        arrroom
                    ),
                    React.createElement(
                        "form",
                        { id: "createroomform", action: "/main", method: "post" },
                        React.createElement("input", { type: "text", name: "roomname", id: "inputCR" }),
                        React.createElement(
                            "button",
                            { type: "submit", id: "buttonCR" },
                            "Create A Room"
                        )
                    )
                )
            )
        );
    }

    render() {
        return this.getRooms();
    }
}
if (document.getElementById("hidePanel")) {
    var matchUp = ReactDOM.render(React.createElement(Matchup, null), document.getElementById('app'));
};
function init() {
    THREE.Mesh.prototype.firstMove = false;
    THREE.Mesh.prototype.Moves = [];
    THREE.Mesh.prototype.attacks = [];
    THREE.Mesh.prototype.color = "";
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    scene.position.z = -8;
    scene.position.x = -8;
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    window.addEventListener('resize', handleResize, false);
    renderer.setClearColor(0xFFFFFF, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    // var axes = new THREE.AxisHelper(20);
    // scene.add(axes);
    camera.position.x = 20;
    camera.position.y = 15;
    camera.position.z = 0;

    camera.lookAt(scene.position);
    cameraControl = new THREE.OrbitControls(camera);
    var spotLight = new THREE.DirectionalLight(0xffffff);
    spotLight.position.set(20, 300, 10);
    scene.add(spotLight);

    scene.add(new THREE.AmbientLight(0x252525));
    buildBoard(state);
    createSquares(state);

    cameraBG = new THREE.OrthographicCamera(-window.innerWidth, window.innerWidth, window.innerHeight, -window.innerHeight, -10000, 10000);
    cameraBG.position.z = 50;
    sceneBG = new THREE.Scene();

    var materialColor = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("../textures/starry_background.jpg"), depthTest: false });
    var bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materialColor);
    bgPlane.position.z = -100;
    bgPlane.scale.set(window.innerWidth * 2, window.innerHeight * 2, 1);
    sceneBG.add(bgPlane);
    var bgPass = new THREE.RenderPass(sceneBG, cameraBG);
    var renderPass = new THREE.RenderPass(scene, camera);
    renderPass.clear = false;
    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(bgPass);
    composer.addPass(renderPass);
    composer.addPass(effectCopy);
    document.getElementById('canvas').appendChild(renderer.domElement);
    document.getElementById('canvas').addEventListener('mousedown', onDocumentMouseDown, false);

    render();

    function onDocumentMouseDown(event) {
        var vector = new THREE.Vector3(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
        vector = vector.unproject(camera);
        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            console.log('position-', intersects[0].object.position);
            console.log('id-', intersects[0].object.name);
            clickOnAPiece(intersects);
            clickOnASquareAfterAPiece(intersects);
        }
    }
    var intersected;
    function clickOnAPiece(intersects) {
        if (intersects[0].faceIndex > 1000) {
            if (gameState.pieceActivated) {
                if (intersects[0].object.name[0] == gameState.color) {
                    gameState.pieceActivated = false;
                    intersected.material.opacity = 1;
                    intersected.material.transparent = false;
                } else if (intersects[0].object.name[0] != gameState.color) {
                    gameState.pieceActivated = false;
                    intersected.material.opacity = 1;
                    intersected.material.transparent = false;
                    var result = false;
                    var squarePosition = intersects[0].object.position;
                    var piece = scene.getObjectByName(gameState.pieceName);
                    result = moveLogicCheckerAttack(squarePosition, piece);
                    if (result) {
                        boardPositions[[intersects[0].object.position.x, intersects[0].object.position.z].join(',')] = boardPositions[[intersected.position.x, intersected.position.z].join(',')];
                        boardPositions[[intersected.position.x, intersected.position.z].join(',')] = "";
                        gameState.color = gameState.color == 'w' ? 'b' : 'w';
                        var piece2 = gameState.pieceName;
                        squarePosition.x += .5;
                        squarePosition.z += .5;
                        tweenPiece(squarePosition, piece);
                        socket.emit('animateOpponent', { 'piece': piece2, 'squarePosition': squarePosition, 'gameState': gameState });
                        var victim = scene.getObjectByName(intersects[0].object.name);
                        scene.remove(victim);
                        boardPositions[[intersected.position.x, intersected.position.z].join(',')] = '';
                        socket.emit('removevictim', [intersected.position.x, intersected.position.z].join(','));
                    };
                }
            }
            if (!gameState.pieceActivated) {
                if (intersects[0].object.name[0] == gameState.color) {
                    gameState.pieceActivated = !gameState.pieceActivated;
                    gameState.pieceName = intersects[0].object.name;
                    intersected = intersects[0].object;
                    intersects[0].object.material.transparent = true;
                    intersects[0].object.material.opacity = .9;
                }
            }
        };
    };
    function clickOnASquareAfterAPiece(intersects) {
        if (gameState.pieceActivated) {
            if (intersects[0].faceIndex < 1000) {
                intersected.material.opacity = 1;
                intersected.material.transparent = false;
                var result = false;
                var squarePosition = intersects[0].object.position;
                var piece = scene.getObjectByName(gameState.pieceName);
                result = moveLogicChecker(squarePosition, piece);
                if (result) {
                    console.log('result is-', result);
                    boardPositions[[intersects[0].object.position.x + .5 - 1, intersects[0].object.position.z + .5 - 1].join(',')] = boardPositions[[intersected.position.x, intersected.position.z].join(',')];
                    boardPositions[[intersected.position.x, intersected.position.z].join(',')] = "";
                    gameState.color = gameState.color == 'w' ? 'b' : 'w';
                    var piece2 = gameState.pieceName;
                    tweenPiece(squarePosition, piece);
                    socket.emit('animateOpponent', { 'piece': piece2, 'squarePosition': squarePosition, 'gameState': gameState });
                };
            }
        }
    }
    function tweenPiece(squarePosition, piece) {
        var tweenw = new TWEEN.Tween({ x: piece.position.x, z: piece.position.z }).to({ x: squarePosition.x - .5, z: squarePosition.z - .5 }, 500);
        var animatePiece = function () {
            var targetx = this.x;
            var targetz = this.z;
            piece.position.x = targetx;
            piece.position.z = targetz;
        };
        var complete = function () {
            piece.firstMove = false;
            gameState.pieceActivated = !gameState.pieceActivated;
        };
        tweenw.onUpdate(animatePiece);
        tweenw.onComplete(complete);
        tweenw.start();
    }
    function tweenPieceOpponent(squarePosition, piece) {
        var piece = scene.getObjectByName(piece);
        console.log('this should be the actual piece', piece);
        var tweenw = new TWEEN.Tween({ x: piece.position.x, z: piece.position.z }).to({ x: squarePosition.x - .5, z: squarePosition.z - .5 }, 500);
        var animatePiece = function () {
            var targetx = this.x;
            var targetz = this.z;
            piece.position.x = targetx;
            piece.position.z = targetz;
        };
        var complete = function () {
            piece.firstMove = false;
            gameState.pieceActivated = !gameState.pieceActivated;
        };
        tweenw.onUpdate(animatePiece);
        tweenw.onComplete(complete);
        tweenw.start();
    }

    function checkBlockingNorth(squarePosition, piece) {
        var calcDifference = {
            x: piece.position.x + .5 - squarePosition.x,
            z: piece.position.z + .5 - squarePosition.z
        };
        if (piece.position.x - squarePosition.x > 0) {
            for (let x = piece.position.x - 2; x > squarePosition.x + .5; x -= 2) {
                var testVectors = [x, piece.position.z].join(',');
                if (boardPositions[testVectors]) {
                    return false;
                }
            };
            for (let i = 0; i < piece.movesA.length; i++) {
                let z = piece.movesA[i][0] == calcDifference.z;
                let x = piece.movesA[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
        }
    }
    function checkBlockingSouth(squarePosition, piece) {
        var calcDifference = {
            x: piece.position.x + .5 - squarePosition.x,
            z: piece.position.z + .5 - squarePosition.z
        };
        if (piece.position.x - squarePosition.x < 0) {
            for (let x = piece.position.x + 2; x < squarePosition.x - .5; x += 2) {
                var testVectors = [x, piece.position.z].join(',');
                if (boardPositions[testVectors]) {
                    return false;
                }
            };
            for (let i = 0; i < piece.movesB.length; i++) {
                let z = piece.movesB[i][0] == calcDifference.z;
                let x = piece.movesB[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
        }
    }
    function checkBlockingWest(squarePosition, piece) {
        var calcDifference = {
            x: piece.position.x + .5 - squarePosition.x,
            z: piece.position.z + .5 - squarePosition.z
        };
        if (piece.position.z - squarePosition.z < 0) {
            for (let z = piece.position.z + 2; z < squarePosition.z + .5 - 1; z += 2) {
                var testVectors = [piece.position.x, z].join(',');
                if (boardPositions[testVectors]) {
                    return false;
                }
            };
            for (let i = 0; i < piece.movesD.length; i++) {
                let z = piece.movesD[i][0] == calcDifference.z;
                let x = piece.movesD[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
        }
    }
    function checkBlockingEast(squarePosition, piece) {
        var calcDifference = {
            x: piece.position.x + .5 - squarePosition.x,
            z: piece.position.z + .5 - squarePosition.z
        };
        if (piece.position.z - squarePosition.z > 0) {
            for (let z = piece.position.z - 2; z > squarePosition.z + .5; z -= 2) {
                var testVectors = [piece.position.x, z].join(',');
                if (boardPositions[testVectors]) {
                    return false;
                }
            };
            for (let i = 0; i < piece.movesC.length; i++) {
                let z = piece.movesC[i][0] == calcDifference.z;
                let x = piece.movesC[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
        }
    }
    function checkBlockingNorthWest(squarePosition, piece) {
        var calcDifference = {
            x: piece.position.x + .5 - squarePosition.x,
            z: piece.position.z + .5 - squarePosition.z
        };
        if (piece.position.z - squarePosition.z < 0 && piece.position.x - squarePosition.x > 0) {
            for (let x = piece.position.x - 2, z = piece.position.z + 2; x > squarePosition.x + .5 && z < squarePosition.z + .5 - 1; x -= 2, z += 2) {
                var testVectors = [x, z].join(',');
                if (boardPositions[testVectors]) {
                    return false;
                }
            };
            for (let i = 0; i < piece.movesH.length; i++) {
                let z = piece.movesH[i][0] == calcDifference.z;
                let x = piece.movesH[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
        }
    }
    function checkBlockingSouthWest(squarePosition, piece) {
        var calcDifference = {
            x: piece.position.x + .5 - squarePosition.x,
            z: piece.position.z + .5 - squarePosition.z
        };
        if (piece.position.z - squarePosition.z < 0 && piece.position.x - squarePosition.x < 0) {
            for (let x = piece.position.x + 2, z = piece.position.z + 2; x < squarePosition.x + .5 && z < squarePosition.z + .5 - 1; x += 2, z += 2) {
                var testVectors = [x, z].join(',');
                if (boardPositions[testVectors]) {
                    return false;
                }
            };
            for (let i = 0; i < piece.movesF.length; i++) {
                let z = piece.movesF[i][0] == calcDifference.z;
                let x = piece.movesF[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
        }
    }
    function checkBlockingSouthEast(squarePosition, piece) {
        var calcDifference = {
            x: piece.position.x + .5 - squarePosition.x,
            z: piece.position.z + .5 - squarePosition.z
        };
        if (piece.position.z - squarePosition.z > 0 && piece.position.x - squarePosition.x < 0) {
            for (let x = piece.position.x + 2, z = piece.position.z - 2; x < squarePosition.x + .5 && z > squarePosition.z + .5 - 1; x += 2, z -= 2) {
                var testVectors = [x, z].join(',');
                if (boardPositions[testVectors]) {
                    return false;
                }
            };
            for (let i = 0; i < piece.movesG.length; i++) {
                let z = piece.movesG[i][0] == calcDifference.z;
                let x = piece.movesG[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
        }
    }
    function checkBlockingNorthEast(squarePosition, piece) {
        var calcDifference = {
            x: piece.position.x + .5 - squarePosition.x,
            z: piece.position.z + .5 - squarePosition.z
        };
        if (piece.position.z - squarePosition.z > 0 && piece.position.x - squarePosition.x > 0) {
            for (let x = piece.position.x - 2, z = piece.position.z - 2; x > squarePosition.x + .5 && z > squarePosition.z + .5 - 1; x -= 2, z -= 2) {
                var testVectors = [x, z].join(',');
                if (boardPositions[testVectors]) {
                    return false;
                }
            };
            for (let i = 0; i < piece.movesE.length; i++) {
                let z = piece.movesE[i][0] == calcDifference.z;
                let x = piece.movesE[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
        }
    }
    function moveLogicCheckerAttack(squarePosition, piece) {
        var calcDifference = {
            x: piece.position.x - squarePosition.x,
            z: piece.position.z - squarePosition.z
        };
        if (piece.name[1] == 'p') {
            var moveToggle = piece.firstMove ? piece.movesFirstMove : piece.moves;
            for (var i = 0; i < moveToggle.length; i++) {
                if (moveToggle[i][0] == calcDifference.x && moveToggle[i][1] == calcDifference.z) {
                    return true;
                }
            };
        };
        if (piece.name[1] == 'c') {
            for (let i = 0; i < piece.movesA.length; i++) {
                let z = piece.movesA[i][0] == calcDifference.z;
                let x = piece.movesA[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
            for (let i = 0; i < piece.movesB.length; i++) {
                let z = piece.movesB[i][0] == calcDifference.z;
                let x = piece.movesB[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
            for (let i = 0; i < piece.movesC.length; i++) {
                let z = piece.movesC[i][0] == calcDifference.z;
                let x = piece.movesC[i][1] == calcDifference.x;
                if (z && x) {
                    return true;
                };
            };
            for (let i = 0; i < piece.movesD.length; i++) {
                let z = piece.movesD[i][0] == calcDifference.z;
                let x = piece.movesD[i][1] == calcDifference.x;
                if (z && x) {
                    return true;
                };
            }
        };
        if (piece.name[1] == 'h') {
            for (let i = 0; i < piece.moves.length; i++) {
                let z = piece.moves[i][0] == calcDifference.z;
                let x = piece.moves[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
        };
        if (piece.name[1] == 'k') {
            for (let i = 0; i < piece.moves.length; i++) {
                let z = piece.moves[i][0] == calcDifference.z;
                let x = piece.moves[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
        };
        if (piece.name[1] == 'b') {
            for (let i = 0; i < piece.movesA.length; i++) {
                let z = piece.movesA[i][0] == calcDifference.z;
                let x = piece.movesA[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
            for (let i = 0; i < piece.movesB.length; i++) {
                let z = piece.movesB[i][0] == calcDifference.z;
                let x = piece.movesB[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
            for (let i = 0; i < piece.movesC.length; i++) {
                let z = piece.movesC[i][0] == calcDifference.z;
                let x = piece.movesC[i][1] == calcDifference.x;
                if (z && x) {
                    return true;
                };
            };
            for (let i = 0; i < piece.movesD.length; i++) {
                let z = piece.movesD[i][0] == calcDifference.z;
                let x = piece.movesD[i][1] == calcDifference.x;
                if (z && x) {
                    return true;
                };
            };
        };
        if (piece.name[1] == 'q') {
            for (let i = 0; i < piece.movesA.length; i++) {
                let z = piece.movesA[i][0] == calcDifference.z;
                let x = piece.movesA[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
            for (let i = 0; i < piece.movesB.length; i++) {
                let z = piece.movesB[i][0] == calcDifference.z;
                let x = piece.movesB[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
            for (let i = 0; i < piece.movesC.length; i++) {
                let z = piece.movesC[i][0] == calcDifference.z;
                let x = piece.movesC[i][1] == calcDifference.x;
                if (z && x) {
                    return true;
                };
            };
            for (let i = 0; i < piece.movesD.length; i++) {
                let z = piece.movesD[i][0] == calcDifference.z;
                let x = piece.movesD[i][1] == calcDifference.x;
                if (z && x) {
                    return true;
                };
            };
            for (let i = 0; i < piece.movesE.length; i++) {
                let z = piece.movesE[i][0] == calcDifference.z;
                let x = piece.movesE[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
            for (let i = 0; i < piece.movesF.length; i++) {
                let z = piece.movesF[i][0] == calcDifference.z;
                let x = piece.movesF[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
            for (let i = 0; i < piece.movesG.length; i++) {
                let z = piece.movesG[i][0] == calcDifference.z;
                let x = piece.movesG[i][1] == calcDifference.x;
                if (z && x) {
                    return true;
                };
            };
            for (let i = 0; i < piece.movesH.length; i++) {
                let z = piece.movesH[i][0] == calcDifference.z;
                let x = piece.movesH[i][1] == calcDifference.x;
                if (z && x) {
                    return true;
                };
            };
        }
    }
    function moveLogicChecker(squarePosition, piece) {
        var calcDifference = {
            x: piece.position.x + .5 - squarePosition.x,
            z: piece.position.z + .5 - squarePosition.z
        };
        if (piece.name[1] == 'p') {
            var moveToggle = piece.firstMove ? piece.movesFirstMove : piece.moves;
            for (var i = 0; i < moveToggle.length; i++) {
                if (moveToggle[i][0] == calcDifference.x && moveToggle[i][1] == calcDifference.z) {
                    return true;
                }
            };
        };
        if (piece.name[1] == 'c') {
            if (checkBlockingNorth(squarePosition, piece)) {
                return true;
            } else if (checkBlockingSouth(squarePosition, piece)) {
                return true;
            } else if (checkBlockingEast(squarePosition, piece)) {
                return true;
            } else if (checkBlockingWest(squarePosition, piece)) {
                return true;
            };
        };
        if (piece.name[1] == 'b') {
            if (checkBlockingSouthWest(squarePosition, piece)) {
                return true;
            } else if (checkBlockingSouthEast(squarePosition, piece)) {
                return true;
            } else if (checkBlockingNorthWest(squarePosition, piece)) {
                return true;
            } else if (checkBlockingNorthEast(squarePosition, piece)) {
                return true;
            };
        };
        if (piece.name[1] == 'h') {
            for (let i = 0; i < piece.moves.length; i++) {
                let z = piece.moves[i][0] == calcDifference.z;
                let x = piece.moves[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
        };
        if (piece.name[1] == 'k') {
            for (let i = 0; i < piece.moves.length; i++) {
                let z = piece.moves[i][0] == calcDifference.z;
                let x = piece.moves[i][1] == calcDifference.x;
                if (x && z) {
                    return true;
                };
            };
        };
        if (piece.name[1] == 'q') {
            if (checkBlockingNorth(squarePosition, piece)) {
                return true;
            } else if (checkBlockingSouth(squarePosition, piece)) {
                return true;
            } else if (checkBlockingEast(squarePosition, piece)) {
                return true;
            } else if (checkBlockingWest(squarePosition, piece)) {
                return true;
            } else if (checkBlockingSouthWest(squarePosition, piece)) {
                return true;
            } else if (checkBlockingSouthEast(squarePosition, piece)) {
                return true;
            } else if (checkBlockingNorthWest(squarePosition, piece)) {
                return true;
            } else if (checkBlockingNorthEast(squarePosition, piece)) {
                return true;
            };
        }
    }
    function buildBoard(state) {
        setTimeout(function () {
            for (var prop in state) {
                var color = state[prop].split('')[0];
                var piece = state[prop].split('')[1];
                var squarePosition = scene.getObjectByName(prop).position;
                if (color == 'w') {
                    if (piece == 'p') {
                        createWhitePawn(squarePosition.x + 18, squarePosition.z, state[prop]);
                    };
                    if (piece == 'c') {
                        createWhiteCastle(squarePosition.x + 22, squarePosition.z, state[prop]);
                    };
                    if (piece == 'h') {
                        createWhiteHorse(squarePosition.x + 22, squarePosition.z, state[prop]);
                    };
                    if (piece == 'b') {
                        createWhiteBishop(squarePosition.x + 22, squarePosition.z, state[prop]);
                    };
                    if (piece == 'q') {
                        createWhiteQueen(squarePosition.x + 22, squarePosition.z, state[prop]);
                    };
                    if (piece == 'k') {
                        createWhiteKing(squarePosition.x + 22, squarePosition.z, state[prop]);
                    };
                };
                if (color == 'b') {
                    if (piece == 'p') {
                        createBlackPawn(squarePosition.x - 2, squarePosition.z, state[prop]);
                    };
                    if (piece == 'c') {
                        createBlackCastle(squarePosition.x - 6, squarePosition.z, state[prop]);
                    };
                    if (piece == 'h') {
                        createBlackHorse(squarePosition.x - 6, squarePosition.z, state[prop]);
                    };
                    if (piece == 'b') {
                        createBlackBishop(squarePosition.x - 6, squarePosition.z, state[prop]);
                    };
                    if (piece == 'q') {
                        createBlackQueen(squarePosition.x - 6, squarePosition.z, state[prop]);
                    };
                    if (piece == 'k') {
                        createBlackKing(squarePosition.x - 6, squarePosition.z, state[prop]);
                    };
                }
            }
        }, 4000);
    }
    function createSquares(state) {
        var keys = Object.keys(state);
        for (var i = 0; i < keys.length; i++) {
            var xCalc = i % 8 + 1;

            if (i % 2 != 0) {
                if (i < 8) {
                    blackSquare(i * 2 - -1, 1, keys[i]);
                };
                if (i >= 8 && i < 16) {
                    whiteSquare(xCalc * 2 - 2 - -1, 3, keys[i]);
                };
                if (i >= 16 && i < 24) {
                    blackSquare(xCalc * 2 - 2 - -1, 5, keys[i]);
                };
                if (i >= 24 && i < 32) {
                    whiteSquare(xCalc * 2 - 2 - -1, 7, keys[i]);
                };
                if (i >= 32 && i < 40) {
                    blackSquare(xCalc * 2 - 2 - -1, 9, keys[i]);
                };
                if (i >= 40 && i < 48) {
                    whiteSquare(xCalc * 2 - 2 - -1, 11, keys[i]);
                };
                if (i >= 48 && i < 56) {
                    blackSquare(xCalc * 2 - 2 - -1, 13, keys[i]);
                };
                if (i >= 56 && i < 64) {
                    whiteSquare(xCalc * 2 - 2 - -1, 15, keys[i]);
                };
            };
            if (i % 2 == 0) {
                if (i < 8) {
                    whiteSquare(i * 2 - -1, 1, keys[i]);
                };
                if (i >= 8 && i < 16) {
                    blackSquare(xCalc * 2 - 2 - -1, 3, keys[i]);
                };
                if (i >= 16 && i < 24) {
                    whiteSquare(xCalc * 2 - 2 - -1, 5, keys[i]);
                };
                if (i >= 24 && i < 32) {
                    blackSquare(xCalc * 2 - 2 - -1, 7, keys[i]);
                };
                if (i >= 32 && i < 40) {
                    whiteSquare(xCalc * 2 - 2 - -1, 9, keys[i]);
                };
                if (i >= 40 && i < 48) {
                    blackSquare(xCalc * 2 - 2 - -1, 11, keys[i]);
                };
                if (i >= 48 && i < 56) {
                    whiteSquare(xCalc * 2 - 2 - -1, 13, keys[i]);
                };
                if (i >= 56 && i < 64) {
                    blackSquare(xCalc * 2 - 2 - -1, 15, keys[i]);
                };
            }
        };
        // createRightSide();
        // createLeftSide();
        // createTopSide();
        // createBottomSide();
    }
    function blackSquare(x, z, name) {
        var loader = new THREE.JSONLoader();
        loader.load("js/blackSquare.js", function (model, material) {
            // console.log(model)
            material = new THREE.MeshPhongMaterial();
            material.map = THREE.ImageUtils.loadTexture("../textures/marble-piece-white.png");
            var mesh = new THREE.Mesh(model, material);
            mesh.position.x = x;
            mesh.position.z = z;
            mesh.scale = new THREE.Vector3(3, 3, 3);
            mesh.name = name;
            scene.add(mesh);
        }, "../textures");
    }
    function whiteSquare(x, z, name) {
        var loader = new THREE.JSONLoader();
        loader.load("js/whiteSquare.js", function (model, material) {
            material = new THREE.MeshPhongMaterial();
            material.map = THREE.ImageUtils.loadTexture("../textures/marble-piece-black.png");
            var mesh = new THREE.Mesh(model, material);
            mesh.position.x = x;
            mesh.position.z = z;
            mesh.scale = new THREE.Vector3(3, 3, 3);
            mesh.name = name;
            scene.add(mesh);
        }, "../textures");
    }
    function createBlackPawn(x, z, name) {
        var loader = new THREE.JSONLoader();
        loader.load("js/pawnBlack.js", function (model, material) {
            material = new THREE.MeshPhongMaterial();
            material.map = THREE.ImageUtils.loadTexture("../textures/MetalScuffs002_METALNESS_1K.jpg");
            var mesh = new THREE.Mesh(model, material);
            mesh.scale = new THREE.Vector3(3, 3, 3);
            mesh.position.x = x - .5 + -8;
            mesh.position.z = z - .5;
            mesh.position.y = 0.3;
            mesh.firstMove = true;
            mesh.movesFirstMove = [[-2, 0], [-4, 0]];
            mesh.moves = [[-2, -0]];
            mesh.attacks = [[1, -1], -1, -1];
            mesh.color = 'b';
            mesh.name = name;
            scene.add(mesh);
        }, "../textures");
    }
    function createWhitePawn(x, z, name) {
        var loader = new THREE.JSONLoader();
        loader.load("js/pawnWhite.js", function (model, material) {
            material = new THREE.MeshPhongMaterial();
            material.map = THREE.ImageUtils.loadTexture("../textures/MetalScuffs002_ALPHAMASKED_1K.png");
            var mesh = new THREE.Mesh(model, material);
            mesh.scale = new THREE.Vector3(3, 3, 3);
            mesh.position.x = x - .5 + -8;
            mesh.position.z = z - .5;
            mesh.position.y = 0.3;
            mesh.name = name;
            mesh.firstMove = true;
            mesh.movesFirstMove = [[2, 0], [4, 0]];
            mesh.moves = [[2, 0]];
            mesh.attacks = [[2, 2], 2, -2];
            mesh.color = 'w';
            scene.add(mesh);
        }, "../textures");
    }
    function createWhiteCastle(x, z, name) {
        var loader = new THREE.JSONLoader();
        loader.load("js/castleWhite.js", function (model, material) {
            material = new THREE.MeshPhongMaterial();
            material.map = THREE.ImageUtils.loadTexture("../textures/MetalScuffs002_ALPHAMASKED_1K.png");
            var mesh = new THREE.Mesh(model, material);
            mesh.scale = new THREE.Vector3(3, 3, 3);
            mesh.position.x = x - .5 + -8;
            mesh.position.z = z - .5;
            mesh.position.y = 0.3;
            mesh.firstMove = false;
            mesh.movesA = [[0, 2], [0, 4], [0, 6], [0, 8], [0, 10], [0, 12], [0, 14]];
            mesh.movesB = [[0, -2], [0, -4], [0, -6], [0, -8], [0, -10], [0, -12], [0, -14]];
            mesh.movesC = [[2, 0], [4, 0], [6, 0], [8, 0], [10, 0], [12, 0], [14, 0]];
            mesh.movesD = [[-2, 0], [-4, 0], [-6, 0], [-8, 0], [-10, 0], [-12, 0], [-14, 0]];
            mesh.color = 'w';
            mesh.name = name;
            scene.add(mesh);
        }, "../textures");
    }
    function createBlackCastle(x, z, name) {
        var loader = new THREE.JSONLoader();
        loader.load("js/castleBlack.js", function (model, material) {
            material = new THREE.MeshPhongMaterial();
            material.map = THREE.ImageUtils.loadTexture("../textures/MetalScuffs002_METALNESS_1K.jpg");
            var mesh = new THREE.Mesh(model, material);
            mesh.scale = new THREE.Vector3(3, 3, 3);
            mesh.position.x = x - .5 + -8;
            mesh.position.z = z - .5;
            mesh.position.y = 0.3;
            mesh.firstMove = false;
            mesh.movesA = [[0, 2], [0, 4], [0, 6], [0, 8], [0, 10], [0, 12], [0, 14]];
            mesh.movesB = [[0, -2], [0, -4], [0, -6], [0, -8], [0, -10], [0, -12], [0, -14]];
            mesh.movesC = [[2, 0], [4, 0], [6, 0], [8, 0], [10, 0], [12, 0], [14, 0]];
            mesh.movesD = [[-2, 0], [-4, 0], [-6, 0], [-8, 0], [-10, 0], [-12, 0], [-14, 0]];
            mesh.name = name;
            mesh.color = 'b';
            scene.add(mesh);
        }, "../textures");
    }
    function createWhiteHorse(x, z, name) {
        var loader = new THREE.JSONLoader();
        loader.load("js/horseWhite.js", function (model, material) {
            material = new THREE.MeshPhongMaterial();
            material.map = THREE.ImageUtils.loadTexture("../textures/MetalScuffs002_ALPHAMASKED_1K.png");
            var mesh = new THREE.Mesh(model, material);
            mesh.scale = new THREE.Vector3(3, 3, 3);
            mesh.position.x = x - .5 + -8;
            mesh.position.z = z - .5;
            mesh.position.y = 0.3;
            mesh.firstMove = false;
            mesh.moves = [[-2, -4], [-4, -2], [-4, 2], [-2, 4], [2, 4], [4, 2], [4, -2], [2, -4]];
            mesh.name = name;
            mesh.color = 'w';
            scene.add(mesh);
        }, "../textures");
    }
    function createBlackHorse(x, z, name) {
        var loader = new THREE.JSONLoader();
        loader.load("js/horseBlack.js", function (model, material) {
            material = new THREE.MeshPhongMaterial();
            material.map = THREE.ImageUtils.loadTexture("../textures/MetalScuffs002_METALNESS_1K.jpg");
            var mesh = new THREE.Mesh(model, material);
            mesh.scale = new THREE.Vector3(3, 3, 3);
            mesh.position.x = x - .5 + -8;
            mesh.position.z = z - .5;
            mesh.position.y = 0.3;
            mesh.firstMove = false;
            mesh.moves = [[-2, -4], [-4, -2], [-4, 2], [-2, 4], [2, 4], [4, 2], [4, -2], [2, -4]];
            mesh.name = name;
            mesh.color = 'b';
            scene.add(mesh);
        }, "../textures");
    }
    function createWhiteBishop(x, z, name) {
        var loader = new THREE.JSONLoader();
        loader.load("js/bishopWhite.js", function (model, material) {
            material = new THREE.MeshPhongMaterial();
            material.map = THREE.ImageUtils.loadTexture("../textures/MetalScuffs002_ALPHAMASKED_1K.png");
            var mesh = new THREE.Mesh(model, material);
            mesh.scale = new THREE.Vector3(3, 3, 3);
            mesh.position.x = x - .5 + -8;
            mesh.position.z = z - .5;
            mesh.position.y = 0.3;
            mesh.firstMove = false;
            mesh.movesE = [[2, 2], [4, 4], [6, 6], [8, 8], [10, 10], [12, 12], [14, 14]];
            mesh.movesF = [[-2, -2], [-4, -4], [-6, -6], [-8, -8], [-10, -10], [-12, -12], [-14, -14]];
            mesh.movesG = [[2, -2], [4, -4], [6, -6], [8, -8], [10, -10], [12, -12], [14, -14]];
            mesh.movesH = [[-2, 2], [-4, 4], [-6, 6], [-8, 8], [-10, 10], [-12, 12], [-14, 14]];
            mesh.name = name;
            mesh.color = 'w';
            scene.add(mesh);
        }, "../textures");
    }
    function createBlackBishop(x, z, name) {
        var loader = new THREE.JSONLoader();
        loader.load("js/bishopBlack.js", function (model, material) {
            material = new THREE.MeshPhongMaterial();
            material.map = THREE.ImageUtils.loadTexture("../textures/MetalScuffs002_METALNESS_1K.jpg");
            var mesh = new THREE.Mesh(model, material);
            mesh.scale = new THREE.Vector3(3, 3, 3);
            mesh.position.x = x - .5 + -8;
            mesh.position.z = z - .5;
            mesh.position.y = 0.3;
            mesh.firstMove = false;
            mesh.movesE = [[2, 2], [4, 4], [6, 6], [8, 8], [10, 10], [12, 12], [14, 14]];
            mesh.movesF = [[-2, -2], [-4, -4], [-6, -6], [-8, -8], [-10, -10], [-12, -12], [-14, -14]];
            mesh.movesG = [[2, -2], [4, -4], [6, -6], [8, -8], [10, -10], [12, -12], [14, -14]];
            mesh.movesH = [[-2, 2], [-4, 4], [-6, 6], [-8, 8], [-10, 10], [-12, 12], [-14, 14]];
            mesh.name = name;
            mesh.color = 'b';
            scene.add(mesh);
        }, "../textures");
    }
    function createWhiteQueen(x, z, name) {
        var loader = new THREE.JSONLoader();
        loader.load("js/queenWhite.js", function (model, material) {
            material = new THREE.MeshPhongMaterial();
            material.map = THREE.ImageUtils.loadTexture("../textures/MetalScuffs002_ALPHAMASKED_1K.png");
            var mesh = new THREE.Mesh(model, material);
            mesh.scale = new THREE.Vector3(3, 3, 3);
            mesh.position.x = x - .5 + -8;
            mesh.position.z = z - .5;
            mesh.position.y = 0.3;
            mesh.firstMove = false;
            mesh.movesA = [[0, 2], [0, 4], [0, 6], [0, 8], [0, 10], [0, 12], [0, 14]];
            mesh.movesB = [[0, -2], [0, -4], [0, -6], [0, -8], [0, -10], [0, -12], [0, -14]];
            mesh.movesC = [[2, 0], [4, 0], [6, 0], [8, 0], [10, 0], [12, 0], [14, 0]];
            mesh.movesD = [[-2, 0], [-4, 0], [-6, 0], [-8, 0], [-10, 0], [-12, 0], [-14, 0]];
            mesh.movesE = [[2, 2], [4, 4], [6, 6], [8, 8], [10, 10], [12, 12], [14, 14], [16, 16]];
            mesh.movesF = [[-2, -2], [-4, -4], [-6, -6], [-8, -8], [-10, -10], [-12, -12], [-14, -14], [-16, -16]];
            mesh.movesG = [[2, -2], [4, -4], [6, -6], [8, -8], [10, -10], [12, -12], [14, -14], [16, -16]];
            mesh.movesH = [[-2, 2], [-4, 4], [-6, 6], [-8, 8], [-10, 10], [-12, 12], [-14, 14], [-16, 16]];
            mesh.name = name;
            mesh.color = 'w';
            scene.add(mesh);
        }, "../textures");
    }
    function createBlackQueen(x, z, name) {
        var loader = new THREE.JSONLoader();
        loader.load("js/queenBlack.js", function (model, material) {
            material = new THREE.MeshPhongMaterial();
            material.map = THREE.ImageUtils.loadTexture("../textures/MetalScuffs002_METALNESS_1K.jpg");
            var mesh = new THREE.Mesh(model, material);
            mesh.scale = new THREE.Vector3(3, 3, 3);
            mesh.position.x = x - .5 + -8;
            mesh.position.z = z - .5;
            mesh.position.y = 0.3;
            mesh.firstMove = false;
            mesh.movesA = [[0, 2], [0, 4], [0, 6], [0, 8], [0, 10], [0, 12], [0, 14]];
            mesh.movesB = [[0, -2], [0, -4], [0, -6], [0, -8], [0, -10], [0, -12], [0, -14]];
            mesh.movesC = [[2, 0], [4, 0], [6, 0], [8, 0], [10, 0], [12, 0], [14, 0]];
            mesh.movesD = [[-2, 0], [-4, 0], [-6, 0], [-8, 0], [-10, 0], [-12, 0], [-14, 0]];
            mesh.movesE = [[2, 2], [4, 4], [6, 6], [8, 8], [10, 10], [12, 12], [14, 14], [16, 16]];
            mesh.movesF = [[-2, -2], [-4, -4], [-6, -6], [-8, -8], [-10, -10], [-12, -12], [-14, -14], [-16, -16]];
            mesh.movesG = [[2, -2], [4, -4], [6, -6], [8, -8], [10, -10], [12, -12], [14, -14], [16, -16]];
            mesh.movesH = [[-2, 2], [-4, 4], [-6, 6], [-8, 8], [-10, 10], [-12, 12], [-14, 14], [-16, 16]];
            mesh.name = name;
            mesh.color = 'b';
            scene.add(mesh);
        }, "../textures");
    }
    function createWhiteKing(x, z, name) {
        var loader = new THREE.JSONLoader();
        loader.load("js/kingWhite.js", function (model, material) {
            material = new THREE.MeshPhongMaterial();
            material.map = THREE.ImageUtils.loadTexture("../textures/MetalScuffs002_ALPHAMASKED_1K.png");
            var mesh = new THREE.Mesh(model, material);
            mesh.scale = new THREE.Vector3(3, 3, 3);
            mesh.position.x = x - .5 + -8;
            mesh.position.z = z - .5;
            mesh.position.y = 0.3;
            mesh.firstMove = false;
            mesh.moves = [[-2, 2], [0, 2], [2, 2], [2, 0], [2, -2], [0, -2], [-2, -2], [-2, 0]];
            mesh.name = name;
            mesh.color = 'w';
            scene.add(mesh);
        }, "../textures");
    }
    function createBlackKing(x, z, name) {
        var loader = new THREE.JSONLoader();
        loader.load("js/kingBlack.js", function (model, material) {
            material = new THREE.MeshPhongMaterial();
            material.map = THREE.ImageUtils.loadTexture("../textures/MetalScuffs002_METALNESS_1K.jpg");
            var mesh = new THREE.Mesh(model, material);
            mesh.scale = new THREE.Vector3(3, 3, 3);
            mesh.position.x = x - .5 + -8;
            mesh.position.z = z - .5;
            mesh.position.y = 0.3;
            mesh.firstMove = false;
            mesh.moves = [[-2, 2], [0, 2], [2, 2], [2, 0], [2, -2], [0, -2], [-2, -2], [-2, 0]];
            mesh.name = name;
            mesh.color = 'b';
            scene.add(mesh);
        }, "../textures");
    }
    function render() {
        // if(mode.login){
        cameraControl.update();
        // }

        renderer.autoClear = false;
        composer.render();
        requestAnimationFrame(render);
        TWEEN.update();
    }
    function handleResize() {
        $('#userpanel').css({ 'height': height + 'px' });
        $('#userpanelhalf').css({ 'height': height + 'px' });
        $('#matchup').css({ 'height': height });
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    socket.on('imBeingAnimated', function (data) {
        tweenPieceOpponent(data.squarePosition, data.piece);
        gameState = data.gameState;
    });

    socket.on('victimremoved', function (data) {
        var victim = scene.getObjectByName(data);
        scene.remove(victim);
    });

    socket.on('login', function () {
        var room = $('#room').text();
        var username = $('#username').text();

        console.log('username equals', username);
        console.log('room equals', room);
        socket.emit('login', [room, username]);
    });
}

window.onload = init;