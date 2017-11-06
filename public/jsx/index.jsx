var boardPositions = {
    "14.5,0.5":"wc1",   "14.5,2.5":"wh1",    "14.5,4.5":"wb1",      "14.5,6.5":"wk",    "14.5,8.5":"wq",    "14.5,10.5":"wb2",  "14.5,12.5":"wh2",  "14.5,14.5":"wc2",
    "12.5,0.5":"wp1",   "12.5,2.5":"wp2",    "12.5,4.5":"wp3",      "12.5,6.5":"wp4",   "12.5,8.5":"wp5",   "12.5,10.5":"wp6",  "12.5,12.5":"wp7",  "12.5,14.5":"wp8",
    "10.5,0.5":"",      "10.5,2.5":"",       "10.5,4.5":"",         "10.5,6.5":"",      "10.5,8.5":"",      "10.5,10.5":"",     "10.5,12.5":"",     "10.5,14.5":"",
    "8.5,0.5":"",       "8.5,2.5":"",        "8.5,4.5":"",          "8.5,6.5":"",       "8.5,8.5":"",       "8.5,10.5":"",      "8.5,12.5":"",      "8.5,14.5":"",
    "6.5,0.5":"",       "6.5,2.5":"",        "6.5,4.5":"",          "6.5,6.5":"",       "6.5,8.5":"",       "6.5,10.5":"",      "6.5,12.5":"",      "6.5,14.5":"",
    "4.5,0.5":"",       "4.5,2.5":"",        "4.5,4.5":"",          "4.5,6.5":"",       "4.5,8.5":"",       "4.5,10.5":"",      "4.5,12.5":"",      "4.5,14.5":"",
    "2.5,0.5":"bp8",    "2.5,2.5":"bp7",     "2.5,4.5":"bp6",       "2.5,6.5":"bp5",    "2.5,8.5":"bp4",    "2.5,10.5":"bp3",   "2.5,12.5":"bp2",   "2.5,14.5":"bp1",
    "0.5,0.5":"bc2",    "0.5,2.5":"bh2",     "0.5,4.5":"bb2",       "0.5,6.5":"bk",     "0.5,8.5":"bq",     "0.5,10.5":"bb1",   "0.5,12.5":"bh1",   "0.5,14.5":"bc1"
};
var currentCheckState = {
    circleAroundKing : [],
    hotSquare : [],
    defensivePossabilities : [],
    kinglessDefensivePossabilities : [],
    victimsDefensivePossabilities : [],
    victimsHotSquare : []
};
var gameState = {
    color: 'w',
    pieceActivated: false,
    pieceName : null
};
var loadMapPieceWhite = new Promise( function(resolve,reject){
    resolve(new THREE.ImageUtils.loadTexture("../textures/marble-piece-white.png"))
});
var loadMapPieceBlack = new Promise( function(resolve,reject){
    resolve(new THREE.ImageUtils.loadTexture("../textures/marble-piece-black.png"))
});
var loadWhitePieceTexture = new Promise( function(resolve,reject){
    resolve(new THREE.ImageUtils.loadTexture("../textures/marble-piece-white.png"))
});
var loadBlackPieceTexture = new Promise( function(resolve,reject){
    resolve(new THREE.ImageUtils.loadTexture("../textures/marble-piece-black.png"))
});
var loadBGTexture = new Promise( function(resolve,reject){
    resolve(new THREE.MeshBasicMaterial({ map: new THREE.ImageUtils.loadTexture("../textures/classic-sphere-black.png"), depthTest: false }))
});
var intersected;
var renderer;
var passedPawn;
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
var extraQueenCounter = 1;
var data = null;
var reactThis;
function resizeLogin(){
    $('#overLayLogin').css({ 'height': height, 'width': width });
    $('#chatwindow').css({ 'height': height});
    $('#cover').css({ 'height': height });
}
function overLaySize() {
    $('#overLayLogin').css({ 'height': height, 'width': width });
    $('#chatwindow').css({ 'height': height});
};
$(window).on('load', function () {
    
    resizeLogin()
});
$(window).on('resize', function () {
    height = window.innerHeight;
    width = window.innerWidth;
    overLaySize();
});
$('#toolbar').on('mouseover',function(e){
    $('#toolbar').css({'opacity':'1'})
})
$('#toolbar').on('mouseout',function(e){
    $('#toolbar').css({'opacity':'0.005'})
})
$('#chat').on('mousedown',function(e){
    $('#chatwindow').css({'z-index':1})
})
$("#newgame").on("click",function(e){
    e.preventDefault();
    if(!document.getElementById("matchup")){
        socket.emit('refresh');
    }
});
class MatchUp extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            rooms:{}
        };
        this.loadMatchesFromServer = this.loadMatchesFromServer.bind(this);
    }
    componentDidMount() {
        this.loadMatchesFromServer();
        setInterval(this.loadMatchesFromServer, 2500);
    }
    loadMatchesFromServer(){
        $.ajax({
            url: '/rooms',
            context: this,
            dataType: 'json',
            type: 'GET'
        }).done((data) => {
            this.setState({rooms: data});
        }); 
    }
    getRooms(){
        var arrroom = []; 
        var state = this.state.rooms;
        var counter = 1;
        arrroom.push(<h1 id='empty' key='empty'>Please Create A Room</h1>)
        for(var value in state){
            console.log('values',state[value].roomname)
            counter++;
            arrroom.push(<a key={counter} href={'/joinroom?choosenroom='+state[value].roomname}><ul className='container'><li className='matchLiRoom'>{state[value].roomname}</li><ul><li className='matchLiPlayer'>{state[value].players[0]}</li><li className='matchLiPlayer'>{state[value].players[1]}</li></ul></ul></a>)
        }
        if(arrroom.length > 1){
            arrroom.shift()
        }
        return(
                <div id='cover'>    
                    <div id='matchup'>
                        <div id='content'>
                            {arrroom}
                        </div>
                        <form id='createroomform' action='/main' method='post'>
                            <input type='text' name='roomname' id='inputCR'/>
                            <button type='submit' id='buttonCR'>Create A Room</button>
                        </form>
                    </div>
                </div>             
        )           
    }
    render(){
        return (
            this.getRooms()
        )      
    }
}
if(document.getElementById("hidePanel")){
    var matchUp = ReactDOM.render(
        <MatchUp/>,
        document.getElementById('matchApp')
    );
};
class PickYourChatToggle extends React.Component{
    render(){
        return (
            <div id='headFrame'>
                <p id='headText'>Enter Player/Room/All to chat</p>
                <input id='headInput' type='text' onChange={this.props.OnInputHeadChange}/>
            </div>
        )
    }
}
class ChatBody extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        var array = [];
        for (var i = 0; i < this.props.body.length; i++) {
           array.push(<div className='chats' key={i}>{this.props.body[i]}</div>)
        }
        return (
            <div id='bodyFrame'>
                {array}
            </div>
        )
    }
}
class SendTheChat extends React.Component{
    render(){
        return (
            <div id='footFrame'>
                <input id='footInput' type='text' value={this.props.chat} onKeyDown={this.props.onSubmitChat} onChange={this.props.footInput}/>
                <span id='closeMe'>Close Chat Window</span>
            </div>
        )
    }
}
class Chat extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            chatDest : 'friendShip',
            chat: '',
            body: []
        };
        this.handleHeadInput = this.handleHeadInput.bind(this)
        this.handleFootInput = this.handleFootInput.bind(this)
        this.submitChat = this.submitChat.bind(this)
    }
    componentDidMount(){
        reactThis = this;
    }
    handleHeadInput(e){
        this.setState({chatDest : e.target.value})
    }
    handleFootInput(e){
        this.setState({chat : e.target.value})
    }
    submitChat(e){
        if (e.keyCode === 13) {
            socket.emit('chat',[this.state.chatDest,this.state.chat,$('#username').text()])
            socket.emit('chatSig',[this.state.chatDest,$('#username').text()])
        }
    }
    render(){
        return (
            <div id='chatwindow'>
                <div id='chatMain'>
                    <PickYourChatToggle OnInputHeadChange={this.handleHeadInput}/>
                    <ChatBody body={this.state.body}/>
                    <SendTheChat chat={this.state.chat} onSubmitChat={this.submitChat} footInput={this.handleFootInput}/>
                </div>
            </div>
        )      
    }
}
if(document.getElementById('chatApp')){
    var chat = ReactDOM.render(
        <Chat/>,
        document.getElementById('chatApp')
    );
}    
class LoginWrapper extends React.Component{
    constructor(props){
        super(props)
        this.state =  {
            name : '',
            password : ''
        }
        this.inputHandlerName = this.inputHandlerName.bind(this);
        this.inputHandlerPassword = this.inputHandlerPassword.bind(this);

    }
    componentDidMount(){
        this.setState({name:'',password:''})
    }
    inputHandlerName(e){
        e.preventDefault();
        this.setState({'name' : e.target.value})
        console.log('state-',e.target.value)
    }
    inputHandlerPassword(e){
        e.preventDefault();
        this.setState({'password' : e.target.value})
        console.log('state-',e.target.value)
    }
    render(){
        return(
            <LoginForm name={this.state.name} password={this.state.password} changeEventName={this.inputHandlerName} changeEventPassword={this.inputHandlerPassword}/>


        )
    }
}
class LoginForm extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
                <form action='/' method='post'>
                    <label className='pagefont fieldfont'>Name</label><br></br>
                    <input className='inpu' onChange={this.props.changeEventName} name='name' type='text' value={this.props.name}/>
                    <br></br>
                    <label className='pagefont fieldfont'>Password</label><br></br>
                    <input className='inpu' onChange={this.props.changeEventPassword} type='password' name='password' value={this.props.password}/>
                    <br></br>
                    <input id='submitlogin' type='submit' value='Submit'/>
                    <a className='log' id='loginbutt'>Enter</a>
                </form>
        )
    }
}
if(document.getElementById('loginApp')){
    var loginWrapper = ReactDOM.render(
        <LoginWrapper/>,
        document.getElementById('loginApp')
    );
    $('#loginbutt').on('click',function(e){
        console.log('click')
        $('#submitlogin').trigger('click');

    })
}
class SigninWrapper extends React.Component{
    constructor(props){
        super(props)
        this.state =  {
            name : '',
            password : ''
        }
        this.inputHandlerName = this.inputHandlerName.bind(this);
        this.inputHandlerPassword = this.inputHandlerPassword.bind(this);

    }
    componentDidMount(){
        this.setState({name:'',password:''})
    }
    inputHandlerName(e){
        e.preventDefault();
        this.setState({'name' : e.target.value})
        console.log('state-',e.target.value)
    }
    inputHandlerPassword(e){
        e.preventDefault();
        this.setState({'password' : e.target.value})
        console.log('state-',e.target.value)
    }
    render(){
        return(
            <SigninForm name={this.state.name} password={this.state.password} changeEventName={this.inputHandlerName} changeEventPassword={this.inputHandlerPassword}/>


        )
    }
}
class SigninForm extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
                <form action='/signup' method='post'>
                    <label className='pagefont fieldfont'>Name</label><br></br>
                    <input className='inpu' onChange={this.props.changeEventName} name='name' type='text' value={this.props.name}/>
                    <br></br>
                    <label className='pagefont fieldfont'>Password</label><br></br>
                    <input className='inpu' onChange={this.props.changeEventPassword} type='password' name='password' value={this.props.password}/>
                    <br></br>
                    <input id='submitsignup' type='submit' value='Submit'/>
                    <a className='log' id='signupbutt'>Enter</a>
                </form>
        )
    }
}
if(document.getElementById('signinApp')){
    var signinWrapper = ReactDOM.render(
        <SigninWrapper/>,
        document.getElementById('signinApp')
    );
    $('#signupbutt').on('click',function(e){
        console.log('click')
        $('#submitsignup').trigger('click');

    })
}
$('#closeMe').on('mousedown',function(e){
    $('#chatwindow').css({'z-index':-1})
})
if(document.getElementById('canvas')){
    function init() {
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
        if(!document.getElementById('matchup')){
            buildBoard();
            createSquares();
        }
        loadBGTexture.then(function(data){
            cameraBG = new THREE.OrthographicCamera(-window.innerWidth, window.innerWidth, window.innerHeight, -window.innerHeight, -10000, 10000);
            sceneBG = new THREE.Scene();
            var bgPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), data);
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
        },null)
        function onDocumentMouseDown(event) {
            var vector = new THREE.Vector3(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
            vector = vector.unproject(camera);
            var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
            var intersects = raycaster.intersectObjects(scene.children);
            if (intersects.length > 0) {
                console.log('position-',intersects[0].object.position)
                console.log('id-',intersects[0].object.name)
                clickOnAPiece(intersects);
                clickOnASquareAfterAPiece(intersects);
            }
        }
        function clickOnAPiece(intersects) {
            if (intersects[0].faceIndex >= 15) {
                if(gameState.pieceActivated){
                    if(intersects[0].object.name[0] == gameState.color){
                        gameState.pieceActivated = false;
                        intersected.material.opacity = 1;
                        intersected.material.transparent = false;
                    }else if(intersects[0].object.name[0] != gameState.color){
                        gameState.pieceActivated = false;
                        intersected.material.opacity = 1;
                        intersected.material.transparent = false;
                        var result = false;
                        var squarePosition = intersects[0].object.position;
                        var piece = scene.getObjectByName(gameState.pieceName);
                        var calcDifference = {
                            x: piece.position.x - squarePosition.x,
                            z: piece.position.z - squarePosition.z
                        };
                      
                        result = moveLogicCheckerAttack(squarePosition, piece, calcDifference)
                        if (result) {
                            squarePosition.x += .5;
                            squarePosition.z += .5;
                            var piece2 = gameState.pieceName;
                            var a = [parseFloat(intersects[0].object.position.x) - .5,parseFloat(intersects[0].object.position.z - .5)].join(',');
                            var b = [parseFloat(intersected.position.x),parseFloat(intersected.position.z)].join(',');                                             
                            updateBoard(a,b);
                            tweenPiece(squarePosition,piece);
                            socket.emit('animateOpponent',{'piece':piece2,'squarePosition':squarePosition,'gameState':gameState})
                            var victim = scene.getObjectByName(intersects[0].object.name);
                            scene.remove(victim);
                            socket.emit('removevictim',[intersects[0].object.name,a,b])
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
                if (intersects[0].faceIndex <= 10) {
                    intersected.material.opacity = 1;
                    intersected.material.transparent = false;
                    var result = false;
                    var dontStepOnAPiecesSquare = true;
                    var squarePosition = intersects[0].object.position;
                    var piece = scene.getObjectByName(gameState.pieceName);
                    var calcDifference = {
                        x: piece.position.x + .5 - squarePosition.x,
                        z: piece.position.z + .5 - squarePosition.z
                    };
                    result = moveLogicChecker(squarePosition, piece, calcDifference);
                    if(boardPositions[[squarePosition.x - .5,squarePosition.z - .5].join(',')]){
                        dontStepOnAPiecesSquare = false;
                    }
                    if (result == true && dontStepOnAPiecesSquare == true) {
                        var piece2 = gameState.pieceName;
                        var a = [parseFloat(intersects[0].object.position.x) - .5,parseFloat(intersects[0].object.position.z - .5)].join(',');
                        var b = [parseFloat(intersected.position.x),parseFloat(intersected.position.z)].join(',');                       
                        updateBoard(a,b);   
                        tweenPiece(squarePosition,piece);
                        socket.emit('animateOpponent',{'piece':piece2,'squarePosition':squarePosition,'gameState':gameState,'a':a,'b':b})
                    };
                }
            }
        }
        function updateBoard(a,b){
            boardPositions[a] = boardPositions[b];
            boardPositions[b] = ''
        }
        function tweenCheckbackward(object,pzs,pze){
            var tweenw = new TWEEN.Tween({ x: 1, y: 1, pz: pzs  }).to({ x: 0.000001, y: 0.000001, pz: pze }, 3000);
            var animateobject = function () {
                object.scale.x = this.x;
                object.scale.y = this.y;
                object.position.z = this.pz;
            };
            var complete = function () {
                
            };
            tweenw.onUpdate(animateobject);
            tweenw.onComplete(complete);
            tweenw.start();
        }
        function tweenCheckforward(pzs,pze,name,revs,reve){
            var object = scene.getObjectByName(name);
            var tweenw = new TWEEN.Tween({ x: 0.000001, y: 0.000001, pz: pzs }).to({ x: 1, y: 1, pz: pze }, 3000);
            var animateobject = function () {
                object.scale.x = this.x;
                object.scale.y = this.y;
                object.position.z = this.pz;
            };
            var complete = function () {
                tweenCheckbackward(object,revs,reve)
            };
            tweenw.onUpdate(animateobject);
            tweenw.onComplete(complete);
            tweenw.start();
        }
        function tweenCheckMateforward(pzs,pze,name,revs,reve){
            var object = scene.getObjectByName(name);
            var tweenw = new TWEEN.Tween({ x: 0.000001, y: 0.000001, pz: pzs }).to({ x: .8, y: .8, pz: pze }, 3000);
            var animateobject = function () {
                object.scale.x = this.x;
                object.scale.y = this.y;
                object.position.z = this.pz;
            };
            var complete = function () {
            };
            tweenw.onUpdate(animateobject);
            tweenw.onComplete(complete);
            tweenw.start();
        }
        function tweenPiece(squarePosition,piece){
            var tweenw = new TWEEN.Tween({ x: piece.position.x, z: piece.position.z }).to({ x: squarePosition.x - .5, z: squarePosition.z - .5 }, 500);
            var animatePiece = function () {
                var targetx = this.x;
                var targetz = this.z;
                piece.position.x = targetx;
                piece.position.z = targetz;
            };
            var complete = function () {
                piece.firstMove = false;
                if(piece.name[1] == 'p' && piece.position.x == 14.5 || piece.position.x == 0.5){
                    pawnGrowsUp(piece);
                }
                gameState.pieceActivated = !gameState.pieceActivated;
                buildCurrentCheckState();
                if(squarePosition.c == undefined){
                    gameState.color = gameState.color == 'w' ? 'b' : 'w';
                };
                if(passedPawn && passedPawn.name[0] != gameState.color){
                    passedPawn.passpawnleft = false;
                    passedPawn.passpawnright = false;
                    passedPawn = undefined;[]
                };
            };
            tweenw.onUpdate(animatePiece);
            tweenw.onComplete(complete);
            tweenw.start();
        }
        function tweenPieceOpponent(squarePosition,piece){
            var piece = scene.getObjectByName(piece);
            intersected = piece;
            var tweenw = new TWEEN.Tween({ x: piece.position.x, z: piece.position.z }).to({ x: squarePosition.x - .5, z: squarePosition.z - .5 }, 500);
            var animatePiece = function () {
                var targetx = this.x;
                var targetz = this.z;
                piece.position.x = targetx;
                piece.position.z = targetz;
            };
            var complete = function () {
                piece.firstMove = false;
                if(piece.name[1] == 'p' && piece.position.x == 14.5 || piece.position.x == 0.5){
                    pawnGrowsUp(piece);
                }
                gameState.pieceActivated = !gameState.pieceActivated;
                buildCurrentCheckState();
                gameState.color = gameState.color == 'w' ? 'b' : 'w';
            };
            tweenw.onUpdate(animatePiece);
            tweenw.onComplete(complete);
            tweenw.start();
        }
        function pawnGrowsUp(piece){
            var position = piece.position;
            if(piece.color == 'w' && piece.position.x == 0.5){
                boardPositions[[intersected.position.x,intersected.position.z].join(',')] = 'wq'+ extraQueenCounter;
                scene.remove(intersected)
                var piece = scene.getObjectByName('wq'+ extraQueenCounter);
                piece.position.x = intersected.position.x;
                piece.position.z = intersected.position.z
                gameState.pieceName = 'wq'+ extraQueenCounter;
            }else if(piece.color == 'b' && piece.position.x == 14.5){
                boardPositions[[intersected.position.x,intersected.position.z].join(',')] = 'bq'+extraQueenCounter; 
                scene.remove(intersected)
                var piece = scene.getObjectByName('bq'+ extraQueenCounter);
                piece.position.x = intersected.position.x;
                piece.position.z = intersected.position.z
                gameState.pieceName = 'bq'+ extraQueenCounter;
            }
            extraQueenCounter++
        }
        function checkBlockingNorth(squarePosition, piece, calcDifference){
            if(piece.position.x - squarePosition.x > 0){
                for (let x = piece.position.x - 2; x > squarePosition.x + .5; x-=2) {
                    var testVectors = [x,piece.position.z].join(',')
                    if(boardPositions[testVectors]){
                        return false
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
        function checkBlockingSouth(squarePosition, piece, calcDifference){
            if(piece.position.x - squarePosition.x < 0){
                for (let x = piece.position.x + 2; x < squarePosition.x - .5; x+=2) {
                    var testVectors = [x,piece.position.z].join(',')
                    if(boardPositions[testVectors]){
                        return false
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
        function checkBlockingWest(squarePosition, piece, calcDifference){
            if(piece.position.z - squarePosition.z < 0){
                for (let z = piece.position.z + 2; z < squarePosition.z + .5 - 1; z+=2) {
                    var testVectors = [piece.position.x,z].join(',')
                    if(boardPositions[testVectors]){
                        return false
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
        function checkBlockingEast(squarePosition, piece, calcDifference){
            if(piece.position.z - squarePosition.z > 0){
                for (let z = piece.position.z - 2; z > squarePosition.z + .5; z-=2) {
                    var testVectors = [piece.position.x,z].join(',')
                    if(boardPositions[testVectors]){
                        return false
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
        function checkBlockingNorthWest(squarePosition, piece, calcDifference){
            if(piece.position.z - squarePosition.z < 0 && piece.position.x - squarePosition.x > 0){
                for (let x = piece.position.x - 2,z = piece.position.z + 2; x > squarePosition.x + .5 && z < squarePosition.z + .5 - 1; x-=2, z+=2) {
                    var testVectors = [x,z].join(',')
                    if(boardPositions[testVectors]){
                        return false
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
        function checkBlockingSouthWest(squarePosition, piece, calcDifference){
            if(piece.position.z - squarePosition.z < 0 && piece.position.x - squarePosition.x < 0){
                for (let x = piece.position.x + 2,z = piece.position.z + 2; x < squarePosition.x + .5 && z < squarePosition.z + .5 - 1; x+=2, z+=2) { 
                    var testVectors = [x,z].join(',')
                    if(boardPositions[testVectors]){
                        return false
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
        function checkBlockingSouthEast(squarePosition, piece, calcDifference){
            if(piece.position.z - squarePosition.z > 0 && piece.position.x - squarePosition.x < 0){
                for (let x = piece.position.x + 2,z = piece.position.z - 2; x < squarePosition.x + .5 - 1 && z > squarePosition.z + .5; x+=2, z-=2) {
                    var testVectors = [x,z].join(',')
                    if(boardPositions[testVectors]){
                        return false
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
        function checkBlockingNorthEast(squarePosition, piece, calcDifference){
            if(piece.position.z - squarePosition.z > 0 && piece.position.x - squarePosition.x > 0){
                for (let x = piece.position.x - 2,z = piece.position.z - 2; x > squarePosition.x + .5 && z > squarePosition.z + .5 - 1; x-=2, z-=2) {
                    var testVectors = [x,z].join(',')
                    if(boardPositions[testVectors]){
                        return false
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
        function whitePawnNorth(squarePosition, piece, calcDifference){
            var moveToggle = piece.firstMove ? piece.movesFirstMove : piece.moves;
            var testVectors = [10.5,squarePosition.z - .5].join(',')
            var testBlackRight = [squarePosition.x - .5,piece.position.z - 2].join(',');
            var testBlackLeft = [squarePosition.x - .5,piece.position.z + 2].join(',');
            if(piece.passpawnleft){
                moveToggle.push(piece.passAttackLeft)
            }else if(piece.passpawnright){
                moveToggle.push(piece.passAttackRight)
            }           
            if(squarePosition.x == 9 && piece.firstMove == true && boardPositions[testVectors] !== ""){
                return false
            }else 
                if(squarePosition.x - .5 == 8.5 && piece.firstMove == true && boardPositions[testBlackRight]){
                    if(boardPositions[testBlackRight][0] == 'b' && boardPositions[testBlackRight][1] == 'p'){
                        passedPawn = scene.getObjectByName(boardPositions[testBlackRight])
                        passedPawn.passpawnright = true;
                    };
                }else if(squarePosition.x - .5 == 8.5 && piece.firstMove == true && boardPositions[testBlackLeft]){
                    if(boardPositions[testBlackLeft][0] == 'b' && boardPositions[testBlackLeft][1] == 'p'){
                        passedPawn = scene.getObjectByName(boardPositions[testBlackLeft])
                        passedPawn.passpawnleft = true;
                    };
                };
                for (var i = 0; i < moveToggle.length; i++) {
                    if (moveToggle[i][0] == calcDifference.x && moveToggle[i][1] == calcDifference.z) {
                        if(moveToggle[i] == piece.passAttackLeft){
                            var victim = scene.getObjectByName(boardPositions[[piece.position.x,piece.position.z + 2].join(',')]);
                            scene.remove(victim)
                            boardPositions[[piece.position.x,piece.position.z + 2].join(',')] = '';
                            socket.emit('passpawn',[boardPositions[[piece.position.x,piece.position.z + 2].join(',')],[piece.position.x,piece.position.z + 2].join(',')])
                        }else if(moveToggle[i] == piece.passAttackRight){
                            var victim = scene.getObjectByName(boardPositions[[piece.position.x,piece.position.z - 2].join(',')]);
                            scene.remove(victim)
                            boardPositions[[piece.position.x,piece.position.z - 2].join(',')] = '';
                            socket.emit('passpawn',[boardPositions[[piece.position.x,piece.position.z - 2].join(',')],[piece.position.x,piece.position.z - 2].join(',')])
                        }
                        return true;
                    };
                }
        }
        function blackPawnSouth(squarePosition, piece, calcDifference){
            var moveToggle = piece.firstMove ? piece.movesFirstMove : piece.moves;
            var testVectors = [4.5,squarePosition.z - .5].join(',')
            var testWhiteRight = [squarePosition.x - .5,piece.position.z + 2].join(',');
            var testWhiteLeft = [squarePosition.x - .5,piece.position.z - 2].join(',');
            if(piece.passpawnleft){
                moveToggle.push(piece.passAttackLeft)
            }else if(piece.passpawnright){
                moveToggle.push(piece.passAttackRight)
            }
            if(squarePosition.x == 7 && piece.firstMove == true && boardPositions[testVectors] !== ""){
                return false
            }else
                if(squarePosition.x - .5 == 6.5 && piece.firstMove == true && boardPositions[testWhiteRight]){
                    if(boardPositions[testWhiteRight][0] == 'w' && boardPositions[testWhiteRight][1] == 'p'){
                        passedPawn = scene.getObjectByName(boardPositions[testWhiteRight])
                        passedPawn.passpawnright = true;
                    };
                }else if(squarePosition.x - .5 == 6.5 && piece.firstMove == true && boardPositions[testWhiteLeft]){
                    if(boardPositions[testWhiteLeft][0] == 'w' && boardPositions[testWhiteLeft][1] == 'p'){
                        passedPawn = scene.getObjectByName(boardPositions[testWhiteLeft])
                        passedPawn.passpawnleft = true;
                    };
                }; 
                for (var i = 0; i < moveToggle.length; i++) {
                    if (moveToggle[i][0] == calcDifference.x && moveToggle[i][1] == calcDifference.z) {
                         if(moveToggle[i] == piece.passAttackLeft){
                            var victim = scene.getObjectByName(boardPositions[[piece.position.x,piece.position.z - 2].join(',')]);
                            scene.remove(victim)
                            boardPositions[[piece.position.x,piece.position.z - 2].join(',')] = '';
                            socket.emit('passpawn',[boardPositions[[piece.position.x,piece.position.z - 2].join(',')],[piece.position.x,piece.position.z - 2].join(',')])
                        }else if(moveToggle[i] == piece.passAttackRight){
                            var victim = scene.getObjectByName(boardPositions[[piece.position.x,piece.position.z + 2].join(',')]);
                            scene.remove(victim)
                            boardPositions[[piece.position.x,piece.position.z + 2].join(',')] = '';
                            socket.emit('passpawn',[boardPositions[[piece.position.x,piece.position.z + 2].join(',')],[piece.position.x,piece.position.z + 2].join(',')])
                        }
                        return true;
                    }
                }
        }
        function inThePiecesPath(testVectors,piece){
            if(!boardPositions[testVectors]){
                if(currentCheckState.hotSquare.indexOf(testVectors) == -1){
                    currentCheckState.hotSquare.push(testVectors);
                }
            }else if(currentCheckState.hotSquare.indexOf(testVectors) == -1){
                currentCheckState.hotSquare.push(testVectors);
                return true;
            }else
                return true;
        }
        function oppositeinThePiecesPath(testVectors,piece){
            if(!boardPositions[testVectors]){
                if(currentCheckState.kinglessDefensivePossabilities.indexOf(testVectors) == -1){
                    currentCheckState.kinglessDefensivePossabilities.push(testVectors);
                    return true;
                }
            }
        }
        function kingHorsePathLogic(piece,parsedCords){
            for (var i = 0; i < piece.moves.length; i++) {
                let data = [parseInt(parsedCords[0]) + (piece.moves[i][0] + .5),parseInt(parsedCords[1]) + (piece.moves[i][1] + .5)].join(',');
                if(Object.keys(boardPositions).indexOf(data) !== -1 && currentCheckState.hotSquare.indexOf(data) == -1){
                    currentCheckState.hotSquare.push(data);
                    if(piece.name[1] != 'k'){
                        currentCheckState.defensivePossabilities.push(data);
                        if(currentCheckState.kinglessDefensivePossabilities.indexOf(data) == -1){
                            currentCheckState.kinglessDefensivePossabilities.push(data);
                        }
                    }
                }
            }
        }
        function oppositekingHorsePathLogic(piece,parsedCords){
            for (var i = 0; i < piece.moves.length; i++) {
                let data = [parseInt(parsedCords[0]) + (piece.moves[i][0] + .5),parseInt(parsedCords[1]) + (piece.moves[i][1] + .5)].join(',');
                if(Object.keys(boardPositions).indexOf(data) !== -1 && currentCheckState.hotSquare.indexOf(data) == -1){
                    if(boardPositions[data][0] !== piece.name[0]){
                        if(piece.name[1] != 'k'){
                            currentCheckState.defensivePossabilities.push(data);
                            if(currentCheckState.kinglessDefensivePossabilities.indexOf(data) == -1){
                                currentCheckState.kinglessDefensivePossabilities.push(data);
                            }
                        }
                    }
                }
            }
        }
        function northSouthEastWest(piece){
            for (let x = piece.position.x - 2; x >= 0; x-=2) {
                var testVectors = [x,piece.position.z].join(',')
                if(inThePiecesPath(testVectors,piece)){
                    break;
                }    
            };
            for (let x = piece.position.x + 2; x <= 15; x+=2) {
                var testVectors = [x,piece.position.z].join(',')
                if(inThePiecesPath(testVectors,piece)){
                    break;
                }
            };
            for (let z = piece.position.z - 2; z >= 0; z-=2) {
                var testVectors = [piece.position.x,z].join(',')
                if(inThePiecesPath(testVectors,piece)){
                    break;
                }
            };
            for (let z = piece.position.z + 2; z <= 15; z+=2) {
                var testVectors = [piece.position.x,z].join(',')
                if(inThePiecesPath(testVectors,piece)){
                    break;
                }
            };
        }
        function northeastNorthwestSoutheastSouthwest(piece){
            for (let x = piece.position.x - 2,z = piece.position.z - 2; x >= 0 && z >= 0; x-=2, z-=2) {
                var testVectors = [x,z].join(',')
                if(inThePiecesPath(testVectors,piece)){
                    break; 
                }
            };
            for (let x = piece.position.x - 2,z = piece.position.z + 2; x >= 0 && z <= 15; x-=2, z+=2) {
                var testVectors = [x,z].join(',')
                if(inThePiecesPath(testVectors,piece)){
                    break;
                }
            };
            for (let x = piece.position.x + 2,z = piece.position.z - 2; x <= 15 && z >= 0; x+=2, z-=2) {
                var testVectors = [x,z].join(',')
                if(inThePiecesPath(testVectors,piece)){
                    break;
                }
            };
            for (let x = piece.position.x + 2,z = piece.position.z + 2; x <= 15 && z <= 15; x+=2, z+=2) {
                var testVectors = [x,z].join(',')
                if(inThePiecesPath(testVectors,piece)){
                    break;
                }
            };
        }
        function oppositenorthSouthEastWest(piece){
            for (let x = piece.position.x - 2; x >= 0; x-=2) {
                var testVectors = [x,piece.position.z].join(',')
                if(oppositeinThePiecesPath(testVectors,piece)){
                    break;
                }    
            };
            for (let x = piece.position.x + 2; x <= 15; x+=2) {
                var testVectors = [x,piece.position.z].join(',')
                if(oppositeinThePiecesPath(testVectors,piece)){
                    break;
                }
            };
            for (let z = piece.position.z - 2; z >= 0; z-=2) {
                var testVectors = [piece.position.x,z].join(',')
                if(oppositeinThePiecesPath(testVectors,piece)){
                    break;
                }
            };
            for (let z = piece.position.z + 2; z <= 15; z+=2) {
                var testVectors = [piece.position.x,z].join(',')
                if(oppositeinThePiecesPath(testVectors,piece)){
                    break;
                }
            };
        }
        function oppositenortheastNorthwestSoutheastSouthwest(piece){
            for (let x = piece.position.x - 2,z = piece.position.z - 2; x >= 0 && z >= 0; x-=2, z-=2) {
                var testVectors = [x,z].join(',')
                if(oppositeinThePiecesPath(testVectors,piece)){
                    break; 
                }
            };
            for (let x = piece.position.x - 2,z = piece.position.z + 2; x >= 0 && z <= 15; x-=2, z+=2) {
                var testVectors = [x,z].join(',')
                if(oppositeinThePiecesPath(testVectors,piece)){
                    break;
                }
            };
            for (let x = piece.position.x + 2,z = piece.position.z - 2; x <= 15 && z >= 0; x+=2, z-=2) {
                var testVectors = [x,z].join(',')
                if(oppositeinThePiecesPath(testVectors,piece)){
                    break;
                }
            };
            for (let x = piece.position.x + 2,z = piece.position.z + 2; x <= 15 && z <= 15; x+=2, z+=2) {
                var testVectors = [x,z].join(',')
                if(oppositeinThePiecesPath(testVectors,piece)){
                    break;
                }
            };
        }
        function circleAroundTheKing(king,isking){
            currentCheckState.circleAroundKing = [];
            var parsedCords = isking.split(',');
            for (let i = 0; i < king.moves.length; i++) {
                let xcord = null, ycord = null; 
                if(parseInt(parsedCords[0]) + (king.moves[i][0] + .5) > 0 && parseInt(parsedCords[0]) + (king.moves[i][0] + .5) < 15){ xcord = parseInt(parsedCords[0]) + (king.moves[i][0] + .5) }else xcord = null;
                if(parseInt(parsedCords[1]) + (king.moves[i][1] + .5) > 0 && parseInt(parsedCords[1]) + (king.moves[i][1] + .5) < 15){ ycord = parseInt(parsedCords[1]) + (king.moves[i][1] + .5) }else ycord = null;
                if(xcord == null || ycord == null){
                    continue;
                }
                if(Object.keys(boardPositions).indexOf([xcord,ycord].join(',')) != -1 && boardPositions[[xcord,ycord].join(',')][0] == gameState.color){
                    currentCheckState.circleAroundKing.push([xcord,ycord].join(',')); 
                };
                if(boardPositions[[xcord,ycord].join(',')] == ''){
                    currentCheckState.circleAroundKing.push([xcord,ycord].join(',')); 
                }
            };
        }
        function vectorBetweenKingAndAttacker(attacker,king){
            var attackVectors = [];
            var diffVector = [parseInt(attacker.position.x - king.position.x),parseInt(attacker.position.z - king.position.z)];
            var aPos = attacker.position, kPos = king.position;
            if(diffVector[0] > 0 && diffVector[1] == 0){
               for (let x = aPos.x,z = aPos.z; x > kPos.x; x -=2) {
                   attackVectors.push([x,z].join(','))
               }
            };
            if(diffVector[0] < 0 && diffVector[1] == 0){
               for (let x = aPos.x,z = aPos.z; x < kPos.x; x +=2) {
                   attackVectors.push([x,z].join(','))
               }
            };
            if(diffVector[0] == 0 && diffVector[1] > 0){
               for (let x = aPos.x,z = aPos.z; z > kPos.z; z -=2) {
                   attackVectors.push([x,z].join(','))
               }
            };
            if(diffVector[0] == 0 && diffVector[1] < 0){
               for (let x = aPos.x,z = aPos.z; z < kPos.z; z +=2) {
                   attackVectors.push([x,z].join(','))
               }
            };
            if(diffVector[0] > 0 && diffVector[1] > 0){
               for (let x = aPos.x,z = aPos.z; x > kPos.x && z > kPos.z; z -=2, x -=2) {
                   attackVectors.push([x,z].join(','))
               }
            };
            if(diffVector[0] > 0 && diffVector[1] < 0){
               for (let x = aPos.x,z = aPos.z; x > kPos.x && z < kPos.z; z +=2, x -=2) {
                   attackVectors.push([x,z].join(','))
               }
            };
            if(diffVector[0] < 0 && diffVector[1] > 0){
               for (let x = aPos.x,z = aPos.z; x < kPos.x && z > kPos.z; z -=2, x +=2) {
                   attackVectors.push([x,z].join(','))
               }
            };
            if(diffVector[0] < 0 && diffVector[1] < 0){
               for (let x = aPos.x,z = aPos.z; x < kPos.x && z < kPos.z; z +=2, x +=2) {
                   attackVectors.push([x,z].join(','))
               }
            };
            console.log('attackVectors-',attackVectors)
            return attackVectors;
        }
        function check(){
            if(gameState.color == 'b'){ 
                tweenCheckforward(7.5,14.5,'checkw',14.5,7.5);
            }else if(gameState.color == 'w'){
                tweenCheckforward(8.5,1.5,'checkb',1.5,8.5);
            }
        }
        function checkMateAnim(){
            if(gameState.color == 'b'){ 
                tweenCheckMateforward(7.5,17,'checkMatew',14.5,7.5);
            }else if(gameState.color == 'w'){
                tweenCheckMateforward(8.5,-.8,'checkMateb',1.5,8.5);
            }
        }
        function CheckMate(){
            var attacker = intersected;
            var attpos = [intersected.position.x,intersected.position.z].join(',');
            var idxAtt = currentCheckState.victimsDefensivePossabilities.indexOf(attpos)
            if(idxAtt != -1){
                var checkthepos = currentCheckState.victimsDefensivePossabilities.splice(idxAtt,1);
            }
            for(var isking in boardPositions){
                if(boardPositions[isking][1] == 'k' && gameState.color !== boardPositions[isking][0]){
                    var king = scene.getObjectByName(boardPositions[isking]);
                    circleAroundTheKing(king,isking);
                    if(currentCheckState.hotSquare.indexOf(isking) !== -1){    
                        var kingsGuard = [];
                        var vecBetKandAtt = vectorBetweenKingAndAttacker(attacker,king);
                        for (var i = 0; i < currentCheckState.circleAroundKing.length; i++) {
                            if(vecBetKandAtt.indexOf(currentCheckState.circleAroundKing[i]) == -1 && currentCheckState.hotSquare.indexOf(currentCheckState.circleAroundKing[i]) == -1 ){
                                kingsGuard.push(currentCheckState.circleAroundKing[i])
                            };
                        };
                        var mateFlag = true;
                        //can block the attack
                        for (var i = 1; i < vecBetKandAtt.length; i++) {
                            if(currentCheckState.kinglessDefensivePossabilities.indexOf(vecBetKandAtt[i]) != -1){
                                mateFlag = false;
                            } 
                        };
                        //can kill attacker
                        if(currentCheckState.victimsHotSquare.indexOf(attpos) != -1){
                            mateFlag = false;
                        } 
                        //king can excape
                        if(kingsGuard != 0){
                            mateFlag = false;
                        };
                        //close up attack with back up
                        if(currentCheckState.circleAroundKing.indexOf(attpos) != -1 && currentCheckState.hotSquare.indexOf(attpos) == -1){
                             mateFlag = false;
                        }
                        if(mateFlag == false){
                            return check();
                        }else if(mateFlag == true){
                            return checkMateAnim();
                        };
                    }
                }
            }
        }
        function buildCurrentCheckState() {
            currentCheckState.victimsHotSquare = [];
            currentCheckState.victimsHotSquare = currentCheckState.hotSquare;
            currentCheckState.hotSquare = [];
            currentCheckState.kinglessDefensivePossabilities = [];
            for(var prop in boardPositions){
                if(boardPositions[prop] !== ''){   
                    var parsedCords = prop.split(',');
                    var piece = scene.getObjectByName(boardPositions[prop]);
                    if (piece.name[1] == 'p' && piece.name[0] == gameState.color) {
                        var toggle = piece.firstMove ? piece.movesFirstMove : piece.moves;
                        for (var i = 0; i < toggle.length; i++) {
                            let data = [parseInt(parsedCords[0]) - (toggle[i][0] - .5),parseInt(parsedCords[1]) - (toggle[i][1] - .5)].join(',');
                            let newKeys = (Object.keys(boardPositions).indexOf(data) !== -1);       
                            if(newKeys == true && currentCheckState.defensivePossabilities.indexOf(data) == -1 && boardPositions[data] == ''){
                            };
                        };
                        for (var i = 0; i < piece.attacks.length; i++) {
                            let data = [parseInt(parsedCords[0]) - (piece.attacks[i][0] - .5),parseInt(parsedCords[1]) - (piece.attacks[i][1] - .5)].join(',');
                            let newKeys = (Object.keys(boardPositions).indexOf(data) !== -1);  
                            if(newKeys == true && currentCheckState.hotSquare.indexOf(data) == -1){
                                currentCheckState.hotSquare.push(data);
                            };
                        };
                    }else if (piece.name[1] == 'p' && piece.name[0] != gameState.color) {
                        var toggle = piece.firstMove ? piece.movesFirstMove : piece.moves;
                        for (var i = 0; i < toggle.length; i++) {
                            let data = [parseInt(parsedCords[0]) - (toggle[i][0] - .5),parseInt(parsedCords[1]) - (toggle[i][1] - .5)].join(',');
                            let newKeys = (Object.keys(boardPositions).indexOf(data) !== -1);       
                            if(newKeys == true && currentCheckState.kinglessDefensivePossabilities.indexOf(data) == -1 && boardPositions[data] == ''){
                                currentCheckState.kinglessDefensivePossabilities.push(data);
                            };
                        };
                    }
                    if(piece.name[1] == 'c' && piece.name[0] == gameState.color) {
                        northSouthEastWest(piece);
                    }else if(piece.name[1] == 'c' && piece.name[0] != gameState.color){
                        oppositenorthSouthEastWest(piece);
                    }
                    if (piece.name[1] == 'b' && piece.name[0] == gameState.color) {  
                        northeastNorthwestSoutheastSouthwest(piece)
                    }else if(piece.name[1] == 'b' && piece.name[0] != gameState.color){
                        oppositenortheastNorthwestSoutheastSouthwest(piece)
                    }
                    if (piece.name[1] == 'q' && piece.name[0] == gameState.color) {
                        northSouthEastWest(piece)
                        northeastNorthwestSoutheastSouthwest(piece)
                    }else if(piece.name[1] == 'q' && piece.name[0] != gameState.color){
                        oppositenorthSouthEastWest(piece)
                        oppositenortheastNorthwestSoutheastSouthwest(piece)
                    } 
                    if (piece.name[1] == 'h' && piece.name[0] == gameState.color) {
                        kingHorsePathLogic(piece,parsedCords);
                    }else if(piece.name[1] == 'h' && piece.name[0] != gameState.color){
                        oppositekingHorsePathLogic(piece,parsedCords);   
                    }
                    if (piece.name[1] == 'k' && piece.name[0] == gameState.color) {
                        oppositekingHorsePathLogic(piece,parsedCords);
                    };
                }
            };
                return CheckMate(); 
        }
        function moveLogicCheckerAttack(squarePosition, piece, calcDifference) {
            if (piece.name[1] == 'p') {
               for (var i = 0; i < piece.attacks.length; i++) {
                    if (piece.attacks[i][0] == calcDifference.x && piece.attacks[i][1] == calcDifference.z) {
                        return true;
                    }
                };
            };
            if (piece.name[1] == 'c') {
                if(checkBlockingNorth(squarePosition, piece, calcDifference)){
                    return true;
                }else if(checkBlockingSouth(squarePosition, piece, calcDifference)){
                   return true;
                }else if(checkBlockingEast(squarePosition, piece, calcDifference)){
                   return true;
                }else if(checkBlockingWest(squarePosition, piece, calcDifference)){
                   return true;
                };
            };
            if (piece.name[1] == 'b') {
                if(checkBlockingSouthWest(squarePosition, piece, calcDifference)){
                    return true;
                }else if(checkBlockingSouthEast(squarePosition, piece, calcDifference)){
                   return true;
                }else if(checkBlockingNorthWest(squarePosition, piece, calcDifference)){
                    return true;
                }else if(checkBlockingNorthEast(squarePosition, piece, calcDifference)){
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
                if(checkBlockingNorth(squarePosition, piece, calcDifference)){
                    return true;
                }else if(checkBlockingSouth(squarePosition, piece, calcDifference)){
                   return true;
                }else if(checkBlockingEast(squarePosition, piece, calcDifference)){
                   return true;
                }else if(checkBlockingWest(squarePosition, piece, calcDifference)){
                   return true;
                }else if(checkBlockingSouthWest(squarePosition, piece, calcDifference)){
                    return true;
                }else if(checkBlockingSouthEast(squarePosition, piece, calcDifference)){
                   return true;
                }else if(checkBlockingNorthWest(squarePosition, piece, calcDifference)){
                    return true;
                }else if(checkBlockingNorthEast(squarePosition, piece, calcDifference)){
                    return true;
                };
            }
        }
        function moveLogicChecker(squarePosition, piece, calcDifference) {
            if (piece.name[1] == 'p') {
                if(piece.name[0] == 'w'){
                    if(whitePawnNorth(squarePosition, piece, calcDifference)){
                        return true;
                    }else
                        return false;

                }else if(piece.name[0] == 'b'){
                    if(blackPawnSouth(squarePosition, piece, calcDifference)){
                        return true;
                    }else
                        return false;  
                }
            };
            if (piece.name[1] == 'c') {
                if(checkBlockingNorth(squarePosition, piece, calcDifference)){
                    return true;
                }else if(checkBlockingSouth(squarePosition, piece, calcDifference)){
                   return true;
                }else if(checkBlockingEast(squarePosition, piece, calcDifference)){
                   return true;
                }else if(checkBlockingWest(squarePosition, piece, calcDifference)){
                   return true;
                };
            };
            if (piece.name[1] == 'b') {
                if(checkBlockingSouthWest(squarePosition, piece, calcDifference)){
                    return true;
                }else if(checkBlockingSouthEast(squarePosition, piece, calcDifference)){
                   return true;
                }else if(checkBlockingNorthWest(squarePosition, piece, calcDifference)){
                    return true;
                }else if(checkBlockingNorthEast(squarePosition, piece, calcDifference)){
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
                if(piece.ableToCastle && piece.castleRight[0] == calcDifference.z && piece.color == 'w' && scene.getObjectByName('wc1').position.z == 0.5 && scene.getObjectByName('wc1').position.x == 14.5 && boardPositions['14.5,4.5'] == '' && boardPositions['14.5,2.5'] == ''){
                    let secondPiece = scene.getObjectByName('wc1')
                    let secondPosition = {c:1,z:5,x:15}
                    piece.ableToCastle = false;
                    tweenPiece(secondPosition,secondPiece)
                    boardPositions['14.5,0.5'] = "";
                    boardPositions['14.5,4.5'] = "wc1";
                    socket.emit('animateCastle',{'position':{x:15 ,z:5 },'piece':"wc1",'a':'14.5,0.5','b':'14.5,4.5'})
                    return true;
                };
                if(piece.ableToCastle && piece.castleLeft[0] == calcDifference.z && piece.color == 'w' && scene.getObjectByName('wc2').position.z == 14.5 && scene.getObjectByName('wc2').position.x == 14.5 && boardPositions['14.5,10.5'] == '' && boardPositions['14.5,12.5'] == '' && boardPositions['14.5,8.5'] == ''){
                    let secondPiece = scene.getObjectByName('wc2')
                    let secondPosition = {c:1,z:9,x:15}
                    piece.ableToCastle = false;
                    tweenPiece(secondPosition,secondPiece)
                    boardPositions['14.5,14.5'] = "";
                    boardPositions['14.5,8.5'] = "wc2";
                    socket.emit('animateCastle',{'position':{x:15 ,z:9 },'piece':"wc2",'a':'14.5,14.5','b':'14.5,8.5'})
                    return true;
                };
                if(piece.ableToCastle && piece.castleRight[0] == calcDifference.z && piece.color == 'b' && scene.getObjectByName('bc1').position.z == 14.5 && scene.getObjectByName('bc1').position.x == 0.5 && boardPositions['0.5,10.5'] == '' && boardPositions['0.5,12.5'] == '' && boardPositions['0.5,8.5'] == ''){
                    let secondPiece = scene.getObjectByName('bc1')
                    let secondPosition = {c:1,z:9,x:1}
                    piece.ableToCastle = false;
                    tweenPiece(secondPosition,secondPiece)
                    boardPositions['0.5,14.5'] = "";
                    boardPositions['0.5,8.5'] = "bc1";
                    socket.emit('animateCastle',{'position':{x:1 ,z:9 },'piece':"bc1",'a':'0.5,14.5','b':'0.5,8.5'})
                    return true;
                };
                if(piece.ableToCastle && piece.castleLeft[0] == calcDifference.z && piece.color == 'b' && scene.getObjectByName('bc2').position.z == 0.5 && scene.getObjectByName('bc2').position.x == 0.5 && boardPositions['0.5,4.5'] == '' && boardPositions['0.5,2.5'] == ''){
                    let secondPiece = scene.getObjectByName('bc2')
                    let secondPosition = {c:1,z:5,x:1}
                    piece.ableToCastle = false;
                    tweenPiece(secondPosition,secondPiece)
                    boardPositions['0.5,0.5'] = "";
                    boardPositions['0.5,4.5'] = "bc2";
                    socket.emit('animateCastle',{'position':{x:1 ,z:5 },'piece':"bc2",'a':'0.5,0.5','b':'0.5,4.5'})
                    return true;
                };
                for (let i = 0; i < piece.moves.length; i++) {
                    let z = piece.moves[i][0] == calcDifference.z;
                    let x = piece.moves[i][1] == calcDifference.x;
                    if (x && z) {
                        piece.ableToCastle = false;
                        return true;
                    };
                };
            };
            if (piece.name[1] == 'q') {
                if(checkBlockingNorth(squarePosition, piece, calcDifference)){
                    return true;
                }else if(checkBlockingSouth(squarePosition, piece, calcDifference)){
                   return true;
                }else if(checkBlockingEast(squarePosition, piece, calcDifference)){
                   return true;
                }else if(checkBlockingWest(squarePosition, piece, calcDifference)){
                   return true;
                }else if(checkBlockingSouthWest(squarePosition, piece, calcDifference)){
                    return true;
                }else if(checkBlockingSouthEast(squarePosition, piece, calcDifference)){
                   return true;
                }else if(checkBlockingNorthWest(squarePosition, piece, calcDifference)){
                    return true;
                }else if(checkBlockingNorthEast(squarePosition, piece, calcDifference)){
                    return true;
                };
            }
        }
        function buildBoard() {
            createWhiteQueen(-10000.3, -10000.3, "wq1")
            createBlackQueen(-10000.3, -10000.3, "bq1")
            createWhiteQueen(-10000.3, -10000.3, "wq2")
            createBlackQueen(-10000.3, -10000.3, "bq2")
            createWhiteQueen(-10000.3, -10000.3, "wq3")
            createBlackQueen(-10000.3, -10000.3, "bq3")
            // createWhiteQueen(-1000.3, -1000.3, "wq4")     //extra queen that you probably will never need
            // createBlackQueen(-1000.3, -1000.3, "bq4")     // if you do you stink at chess seriously
            // createWhiteQueen(-1000.3, -1000.3, "wq5")    // in a serious game turn these on just in case
            // createBlackQueen(-1000.3, -1000.3, "bq5")
            // createWhiteQueen(-1000.3, -1000.3, "wq6")
            // createBlackQueen(-1000.3, -1000.3, "bq6")
            // createWhiteQueen(-1000.3, -1000.3, "wq7")
            // createBlackQueen(-1000.3, -1000.3, "bq7")
            // createWhiteQueen(-1000.3, -1000.3, "wq8")
            // createBlackQueen(-1000.3, -1000.3, "bq8")
            check3D(8,5,14.5,26.7,'checkw')
            check3D(8,5,14.5,29.85,'checkb')
            checkMate3D(8,5,14.5,26.7,'checkMatew')
            checkMate3D(8,5,14.5,29.85,'checkMateb')
            for (var prop in boardPositions) {
                var posx = parseInt(prop.split(',')[0]) + .5;
                var posz = parseInt(prop.split(',')[1]) + .5;
                var color = boardPositions[prop].split('')[0];
                var piece = boardPositions[prop].split('')[1];
                if (color == 'w') {
                    if (piece == 'p') {
                        createWhitePawn(posx, posz, boardPositions[prop]);
                    };
                    if (piece == 'c') {
                        createWhiteCastle(posx, posz, boardPositions[prop]);
                    };
                    if (piece == 'h') {
                        createWhiteHorse(posx, posz, boardPositions[prop]);
                    };
                    if (piece == 'b') {
                        createWhiteBishop(posx, posz, boardPositions[prop]);
                    };
                    if (piece == 'q') {
                        createWhiteQueen(posx, posz, boardPositions[prop]);
                    };
                    if (piece == 'k') {
                        createWhiteKing(posx, posz, boardPositions[prop]);
                    };
                };
                if (color == 'b') {
                    if (piece == 'p') {
                        createBlackPawn(posx, posz, boardPositions[prop]);
                    };
                    if (piece == 'c') {
                        createBlackCastle(posx, posz, boardPositions[prop]);
                    };
                    if (piece == 'h') {
                        createBlackHorse(posx, posz, boardPositions[prop]);
                    };
                    if (piece == 'b') {
                        createBlackBishop(posx, posz, boardPositions[prop]);
                    };
                    if (piece == 'q') {
                        createBlackQueen(posx, posz, boardPositions[prop]);
                    };
                    if (piece == 'k') {
                        createBlackKing(posx, posz, boardPositions[prop]);
                    };
                }
            }
        }
        function createSquares() {
            var idx = -1;
            var rowflip = false;
            for(var prop in boardPositions){
                idx++;
                var posx = parseFloat(prop.split(',')[0]) + .5;
                var posz = parseFloat(prop.split(',')[1]) + .5;
                if(idx % 8 == 0){
                    rowflip = !rowflip;
                }
                if(idx % 2 == 0 && rowflip){    
                    blackSquare(posx,posz,posx + ',' + posz)     
                }else if(idx % 2 == 0 && !rowflip){    
                    whiteSquare(posx,posz,posx + ',' + posz)              
                }else if(idx % 2 != 0 && !rowflip){    
                    blackSquare(posx,posz,posx + ',' + posz)
                }else if(idx % 2 != 0 && rowflip){
                    whiteSquare(posx,posz,posx + ',' + posz)
                }
            }   
        }
        function blackSquare(x, z, name) {
            var loader = new THREE.JSONLoader();
            loadMapPieceWhite.then(function(data){
                return loader.load("js/blackSquare.js", function (model) {
                        material = new THREE.MeshPhongMaterial();
                        material.map = data;
                        var mesh = new THREE.Mesh(model, material);
                        mesh.position.x = x;
                        mesh.position.z = z;
                        mesh.scale = new THREE.Vector3(3, 3, 3);
                        mesh.name = name;
                        scene.add(mesh);
                    }, "../textures")
            })
        }
        function whiteSquare(x, z, name) {
            var loader = new THREE.JSONLoader();
            loadMapPieceBlack.then(function(data){
                return loader.load("js/whiteSquare.js", function (model) {
                        material = new THREE.MeshPhongMaterial();
                        material.map = data;
                        var mesh = new THREE.Mesh(model, material);
                        mesh.position.x = x;
                        mesh.position.z = z;
                        mesh.scale = new THREE.Vector3(3, 3, 3);
                        mesh.name = name;
                        scene.add(mesh);
                    }, "../textures")
            })
        }
        function createBlackPawn(x, z, name) {
            var loader = new THREE.JSONLoader();
            loadBlackPieceTexture.then(function(data){
                return loader.load("js/pawnBlack1.js", function (model, material) {
                        material = new THREE.MeshPhongMaterial();
                        material.map = data;
                        var mesh = new THREE.Mesh(model, material);
                        mesh.scale = new THREE.Vector3(3, 3, 3);
                        mesh.position.x = x;
                        mesh.position.z = z;
                        mesh.position.y = 0.3;
                        mesh.firstMove = true;
                        mesh.movesFirstMove = [[-2, 0], [-4, 0]];
                        mesh.moves = [[-2, 0]];
                        mesh.passAttackLeft = [-2, 2];
                        mesh.passAttackRight = [-2, -2];
                        mesh.attacks = [[-2, 2], [-2, -2]];
                        mesh.color = 'b';
                        mesh.name = name;
                        mesh.passpawnright = false;
                        mesh.passpawnleft = false;
                        scene.add(mesh);
                    }, "../textures")
            })
        }
        function createWhitePawn(x, z, name) {
            var loader = new THREE.JSONLoader();
            loadWhitePieceTexture.then(function(data){
                return loader.load("js/pawnWhite1.js", function (model, material) {
                        material = new THREE.MeshPhongMaterial();
                        material.map = data;
                        var mesh = new THREE.Mesh(model, material);
                        mesh.scale = new THREE.Vector3(3, 3, 3);
                        mesh.position.x = x;
                        mesh.position.z = z;
                        mesh.position.y = 0.3;
                        mesh.firstMove = true;
                        mesh.movesFirstMove = [[2, 0], [4, 0]];
                        mesh.moves = [[2, 0]];
                        mesh.passAttackLeft = [2, -2];
                        mesh.passAttackRight = [2, 2];
                        mesh.attacks = [[2, -2], [2, 2]];
                        mesh.color = 'w';
                        mesh.name = name;
                        mesh.passpawnright = false;
                        mesh.passpawnleft = false;  
                        scene.add(mesh);
                    }, "../textures")
            })
        }
        function createWhiteCastle(x, z, name) {
            var loader = new THREE.JSONLoader();
            loadWhitePieceTexture.then(function(data){
                return loader.load("js/castleWhite1.js", function (model, material) {
                        material = new THREE.MeshPhongMaterial();
                        material.map = data;
                        var mesh = new THREE.Mesh(model, material);
                        mesh.scale = new THREE.Vector3(3, 3, 3);
                        mesh.position.x = x;
                        mesh.position.z = z;
                        mesh.position.y = 0.3;
                        mesh.firstMove = false;
                        mesh.movesA = [[0, 2], [0, 4], [0, 6], [0, 8], [0, 10], [0, 12], [0, 14]];
                        mesh.movesB = [[0, -2], [0, -4], [0, -6], [0, -8], [0, -10], [0, -12], [0, -14]];
                        mesh.movesC = [[2, 0], [4, 0], [6, 0], [8, 0], [10, 0], [12, 0], [14, 0]];
                        mesh.movesD = [[-2, 0], [-4, 0], [-6, 0], [-8, 0], [-10, 0], [-12, 0], [-14, 0]];
                        mesh.color = 'w';
                        mesh.name = name;
                        scene.add(mesh);
                    }, "../textures")
            })
        }
        function createBlackCastle(x, z, name) {
            var loader = new THREE.JSONLoader();
            loadBlackPieceTexture.then(function(data){
                return loader.load("js/castleBlack1.js", function (model, material) {
                        material = new THREE.MeshPhongMaterial();
                        material.map = data;
                        var mesh = new THREE.Mesh(model, material);
                        mesh.scale = new THREE.Vector3(3, 3, 3);
                        mesh.position.x = x;
                        mesh.position.z = z;
                        mesh.position.y = 0.3;
                        mesh.firstMove = false;
                        mesh.movesA = [[0, 2], [0, 4], [0, 6], [0, 8], [0, 10], [0, 12], [0, 14]];
                        mesh.movesB = [[0, -2], [0, -4], [0, -6], [0, -8], [0, -10], [0, -12], [0, -14]];
                        mesh.movesC = [[2, 0], [4, 0], [6, 0], [8, 0], [10, 0], [12, 0], [14, 0]];
                        mesh.movesD = [[-2, 0], [-4, 0], [-6, 0], [-8, 0], [-10, 0], [-12, 0], [-14, 0]];
                        mesh.name = name;
                        mesh.color = 'b';
                        scene.add(mesh);
                    }, "../textures")
            })
        }
        function createWhiteHorse(x, z, name) {
            var loader = new THREE.JSONLoader();
            loadWhitePieceTexture.then(function(data){
                return loader.load("js/horseWhite1.js", function (model, material) {
                        material = new THREE.MeshPhongMaterial();
                        material.map = data;
                        var mesh = new THREE.Mesh(model, material);
                        mesh.scale = new THREE.Vector3(3, 3, 3);
                        mesh.position.x = x;
                        mesh.position.z = z;
                        mesh.position.y = 0.3;
                        mesh.firstMove = false;
                        mesh.moves = [[-2, -4], [-4, -2], [-4, 2], [-2, 4], [2, 4], [4, 2], [4, -2], [2, -4]];
                        mesh.name = name;
                        mesh.color = 'w';
                        scene.add(mesh);
                    }, "../textures")
            })
        }
        function createBlackHorse(x, z, name) {
            var loader = new THREE.JSONLoader();
            loadBlackPieceTexture.then(function(data){
                return loader.load("js/horseBlack1.js", function (model, material) {
                        material = new THREE.MeshPhongMaterial();
                        material.map = data;
                        var mesh = new THREE.Mesh(model, material);
                        mesh.scale = new THREE.Vector3(3, 3, 3);
                        mesh.position.x = x;
                        mesh.position.z = z;
                        mesh.position.y = 0.3;
                        mesh.firstMove = false;
                        mesh.moves = [[-2, -4], [-4, -2], [-4, 2], [-2, 4], [2, 4], [4, 2], [4, -2], [2, -4]];
                        mesh.name = name;
                        mesh.color = 'b';
                        scene.add(mesh);
                    }, "../textures")
            })
        }
        function createWhiteBishop(x, z, name) {
            var loader = new THREE.JSONLoader();
            loadWhitePieceTexture.then(function(data){
                return loader.load("js/bishopWhite1.js", function (model, material) {
                        material = new THREE.MeshPhongMaterial();
                        material.map = data;
                        var mesh = new THREE.Mesh(model, material);
                        mesh.scale = new THREE.Vector3(3, 3, 3);
                        mesh.position.x = x;
                        mesh.position.z = z;
                        mesh.position.y = 0.3;
                        mesh.firstMove = false;
                        mesh.movesE = [[2, 2], [4, 4], [6, 6], [8, 8], [10, 10], [12, 12], [14, 14]];
                        mesh.movesF = [[-2, -2], [-4, -4], [-6, -6], [-8, -8], [-10, -10], [-12, -12], [-14, -14]];
                        mesh.movesG = [[2, -2], [4, -4], [6, -6], [8, -8], [10, -10], [12, -12], [14, -14]];
                        mesh.movesH = [[-2, 2], [-4, 4], [-6, 6], [-8, 8], [-10, 10], [-12, 12], [-14, 14]];
                        mesh.name = name;
                        mesh.color = 'w';
                        scene.add(mesh);
                    }, "../textures")
            })
        }
        function createBlackBishop(x, z, name) {
            var loader = new THREE.JSONLoader();
            loadBlackPieceTexture.then(function(data){
                return loader.load("js/bishopBlack1.js", function (model, material) {
                        material = new THREE.MeshPhongMaterial();
                        material.map = data;
                        var mesh = new THREE.Mesh(model, material);
                        mesh.scale = new THREE.Vector3(3, 3, 3);
                        mesh.position.x = x;
                        mesh.position.z = z;
                        mesh.position.y = 0.3;
                        mesh.firstMove = false;
                        mesh.movesE = [[2, 2], [4, 4], [6, 6], [8, 8], [10, 10], [12, 12], [14, 14]];
                        mesh.movesF = [[-2, -2], [-4, -4], [-6, -6], [-8, -8], [-10, -10], [-12, -12], [-14, -14]];
                        mesh.movesG = [[2, -2], [4, -4], [6, -6], [8, -8], [10, -10], [12, -12], [14, -14]];
                        mesh.movesH = [[-2, 2], [-4, 4], [-6, 6], [-8, 8], [-10, 10], [-12, 12], [-14, 14]];
                        mesh.name = name;
                        mesh.color = 'b';
                        scene.add(mesh);
                    }, "../textures")
            })
        }
        function createWhiteQueen(x, z, name) {
            var loader = new THREE.JSONLoader();
            loadWhitePieceTexture.then(function(data){
                return loader.load("js/queenWhite1.js", function (model, material) {
                        material = new THREE.MeshPhongMaterial();
                        material.map = data;
                        var mesh = new THREE.Mesh(model, material);
                        mesh.scale = new THREE.Vector3(3, 3, 3);
                        mesh.position.x = x;
                        mesh.position.z = z;
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
                    }, "../textures")
            })
        }
        function createBlackQueen(x, z, name) {
            var loader = new THREE.JSONLoader();
            loadBlackPieceTexture.then(function(data){
                return loader.load("js/queenBlack1.js", function (model, material) {
                        material = new THREE.MeshPhongMaterial();
                        material.map = data;
                        var mesh = new THREE.Mesh(model, material);
                        mesh.scale = new THREE.Vector3(3, 3, 3);
                        mesh.position.x = x;
                        mesh.position.z = z;
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
                    }, "../textures")
            })
        }
        function createWhiteKing(x, z, name) {
            var loader = new THREE.JSONLoader();
            loadWhitePieceTexture.then(function(data){
                return loader.load("js/kingWhite1.js", function (model, material) {
                        material = new THREE.MeshPhongMaterial();
                        material.map = data;
                        var mesh = new THREE.Mesh(model, material);
                        mesh.scale = new THREE.Vector3(3, 3, 3);
                        mesh.position.x = x;
                        mesh.position.z = z;
                        mesh.position.y = 0.3;
                        mesh.firstMove = false;
                        mesh.moves = [[-2, 2], [0, 2], [2, 2], [2, 0], [2, -2], [0, -2], [-2, -2], [-2, 0]];
                        mesh.name = name;
                        mesh.color = 'w';
                        mesh.ableToCastle = true;
                        mesh.castleRight = [4,0];
                        mesh.castleLeft = [-4,0];
                        scene.add(mesh);
                    }, "../textures")
            })
        }
        function createBlackKing(x, z, name) {
            var loader = new THREE.JSONLoader();
            loadBlackPieceTexture.then(function(data){
                return loader.load("js/kingBlack1.js", function (model, material) {
                        material = new THREE.MeshPhongMaterial();
                        material.map = data;
                        var mesh = new THREE.Mesh(model, material);
                        mesh.scale = new THREE.Vector3(3, 3, 3);
                        mesh.position.x = x;
                        mesh.position.z = z;
                        mesh.position.y = 0.3;
                        mesh.firstMove = false;
                        mesh.moves = [[-2, 2], [0, 2], [2, 2], [2, 0], [2, -2], [0, -2], [-2, -2], [-2, 0]];
                        mesh.name = name;
                        mesh.color = 'b';
                        mesh.ableToCastle = true;
                        mesh.castleRight = [-4,0];
                        mesh.castleLeft = [4,0];
                        scene.add(mesh);
                    }, "../textures")
            })
        }
        function check3D(px,py,pz,ry,name) {
            var options = {
                size: 2,
                height: 1,
                bevelThickness: .1,
                bevelSize: .1,
                bevelSegments: 10,
                bevelEnabled: true,
                curveSegments: 10,
                steps: 1,
                font: "helvetiker",
                weight: "normal"
            };
            var meshMaterial = new THREE.MeshPhongMaterial({
                specular: 0xffffff,
                color: 0xff5555,
                shininess: 100,
                metal: true
            });
            meshMaterial.side=THREE.DoubleSide;
            
            var text1 = new THREE.TextGeometry("C H E C K", options);
            var data = THREE.SceneUtils.createMultiMaterialObject(text1, [meshMaterial]);
            data.position.z = pz;
            data.position.x = px;
            data.position.y = py;
            data.rotation.y = ry;
            data.scale.x =  0.000001;
            data.scale.y =  0.000001;
            data.name = name;
            scene.add(data);
        }
        function checkMate3D(px,py,pz,ry,name) {
            var options = {
                size: 2,
                height: 1,
                bevelThickness: .1,
                bevelSize: .1,
                bevelSegments: 10,
                bevelEnabled: true,
                curveSegments: 10,
                steps: 1,
                font: "helvetiker",
                weight: "normal"
            };
            var meshMaterial = new THREE.MeshPhongMaterial({
                specular: 0xffffff,
                color: 0xff5555,
                shininess: 100,
                metal: true
            });
            meshMaterial.side=THREE.DoubleSide;
            
            var text1 = new THREE.TextGeometry("C H E C K M A T E", options);
            var data = THREE.SceneUtils.createMultiMaterialObject(text1, [meshMaterial]);
            data.position.z = pz;
            data.position.x = px;
            data.position.y = py;
            data.rotation.y = ry;
            data.scale.x =  0.000001;
            data.scale.y =  0.000001;
            data.name = name;
            scene.add(data);
        }
        function render() {
            cameraControl.update();
            renderer.autoClear = false;
            composer.render();
            requestAnimationFrame(render);
            TWEEN.update();
        }
        function handleResize() {
            $('#userpanelhalf').css({ 'height': height + 'px' });
            $('#matchup').css({ 'height': height });
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        socket.on('imBeingAnimated',function(data){
            updateBoard(data.a,data.b);
            tweenPieceOpponent(data.squarePosition,data.piece);
            gameState = data.gameState;
        })
        socket.on('imCastling',function(data){
            boardPositions[data.a] = '';
            boardPositions[data.b] = data.piece;
            tweenPieceOpponent(data.position,data.piece);
        })
        socket.on('sendChat',function(data){
            var newdata = reactThis.state.body.concat(data);   //use concat here so as not to manip state obj
            // newdata.push(data)
            reactThis.setState({chat:'',body:newdata})
        })
        socket.on('victimremoved',function(data){
            updateBoard(data[1],data[2]);
            scene.remove(scene.getObjectByName(data[0]))
        })
        socket.on('passpawned',function(data){
            scene.remove(scene.getObjectByName(boardPositions[data[1]]))
            boardPositions[data[1]] = "";
        })
        socket.on('login', function () {
            var room = $('#room').text();
            var username = $('#username').text();
            console.log('username equals',username)
            console.log('room equals',room)
            socket.emit('login',[room,username]);
        })
        socket.on('sig',function(data){
            $('#sig').css({'display':'flex'});
            $('#sigh1').text(' Message from '+data[1])
            setTimeout(function(){
                $('#sig').css({'display':'none'})
            },3000)
        })
        socket.on("fresh",function(){
            if(!document.getElementById("matchup")){
                window.location.reload(true)
            }
        });
    }
}
window.onload = init;








