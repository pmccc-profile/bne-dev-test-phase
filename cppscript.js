//get position using getBoundingClientRect()
//detect collision function
//movement function
//reset function


//loop through each article-if
document.querySelectorAll(".article-if").forEach((section, index)=>{
    const btn_start = section.querySelector(".btn-start");
    const btn_end = section.querySelector(".btn-end");
    const div_score_wrapper = section.querySelector(".div-score-wrapper");
    const div_score_array = div_score_wrapper.querySelectorAll(".div-score");
    const div_logic_if = section.querySelector(".div-logic-if");
    
    //variables for collision detection and for resetting position
    let collisionLogicCheck = 0;
    let collisionEndCheck = 0;
    let animationEnd = 0;
    let init_posLeft = 0;
    let init_posTop = 0;
    let next = 0; //set next value to avoid simultaneous movement
    
    //click to start animation
    btn_start.addEventListener("click", () => {

        //initialize each time
        collisionLogicCheck = 0;
        collisionEndCheck = 0;
        animationEnd = 0;
        init_posLeft = 0;
        init_posTop = 0;

        div_score_array.forEach(dscore_arr => { 
            
            //get matching id
            const ds_id = dscore_arr.id;
            
            if(ds_id.includes("70") && next===0) {
                animationStart(dscore_arr);
            }
            else if(ds_id.includes("80") && next===1){ 
                animationStart(dscore_arr);

            }
            else if(ds_id.includes("90") && next===2){
                animationStart(dscore_arr);
            }
        });
    });
    
    //click to reset animation
    btn_end.addEventListener("click", () => {

        //initialize each time;
        collisionLogicCheck = 0;
        collisionEndCheck = 0;
        animationEnd = 0;
        init_posLeft = 0;
        init_posTop = 0;
        next = 0;

        alert("Reset");

        animationReset(dscore_arr);
    });
    
    //animation start
    function animationStart(dscore_arr){
        //get initial position for reset
        //offset is a read-only property which contains position value
        init_posLeft = dscore_arr.offsetLeft;
        init_posTop = dscore_arr.offsetTop;

        if(!animationEnd){
            btn_start.disabled = true;
            btn_end.disabled = true;
        }

        //start animation movement of scores
        animationExecution(dscore_arr); 
    }
    
    //animation movement execution
    function animationExecution(e) {
        //get position using getBoundingClientRect()
        const dli = div_logic_if.querySelector("p").getBoundingClientRect();
        const btnEnd = btn_end.getBoundingClientRect(); 

        if(e.id.includes("70")){

            //set movement
            let moveLeft = e.offsetLeft + 3;
            let moveTop = e.offsetTop + 4;
            let nextValue = 1; //value for 'next' global variable

            //start animation process
            animationProcess(e, dli, btnEnd, moveLeft, moveTop, nextValue);

        }
        else if(e.id.includes("80")){

            //set movement
            let moveLeft = e.offsetLeft + 0;
            let moveTop = e.offsetTop + 5;
            let nextValue = 2; //value for 'next' global variable

            //start animation process
            animationProcess(e, dli, btnEnd, moveLeft, moveTop, nextValue);

        }
        else if(e.id.includes("90")){

            //set movement
            let moveLeft = e.offsetLeft - 4;
            let moveTop = e.offsetTop + 4.5;
            let nextValue = 0; //value for 'next' global variable

            //start animation process
            animationProcess(e, dli, btnEnd, moveLeft, moveTop, nextValue);
        }
    }
    //animation process
    function animationProcess(e, dli, btnEnd, moveLeft, moveTop, nextValue){
    
        if(!collisionLogicCheck){
            //move the e (scores)
            e.style.left = (moveLeft) + 'px';
            e.style.top = (moveTop) + 'px';
        }else{
            //continue moving the e (scores) downwards
            if(collisionLogicCheck || collisionEndCheck){
                e.style.top = (moveTop) + 'px';
            }
        }
        
        //get position using getBoundingClientRect()
        const dscore = e.getBoundingClientRect();
        
        //logic phase (flowchart)
        //collisionCheck is false && collision detection is true
        if(!collisionLogicCheck && animationCollisionDetection(dscore, dli)){
            //change e position to dli position
            e.style.x = (dli.x) + 'px';
            e.style.y = (dli.y) + 'px';

            //start animation for logic checking
            animationLogicChecking(0,e);

            //set timeout or delay before continuing animation
            setTimeout(() => {
                //resume animation after logic processing
                window.requestAnimationFrame(() => animationExecution(e));
                //remove animation for logic checking
                animationLogicChecking(1,e);
            }, 2500);

            //update collisionCheck
            collisionLogicCheck = 1;

            //exit or stop
            return;    
        }
        
        //end phase (flowchart)
        //collisionCheck is false && collision detection is true
        if (!collisionEndCheck && animationCollisionDetection(dscore, btnEnd)){
            //update collisionCheck
            collisionEndCheck = 1;
        }
        
        //stop if dscore.bottom reached btnEnd.bottom
        if (dscore.bottom >= btnEnd.bottom) {
            //update animationEnd
            animationEnd = 1;
            
            //alert("End");
            
            //set timeout or delay before applying reset
            setTimeout(() => {
                //reset to initial position
                animationReset(e);
                //enable btn_start after reset
                btn_start.disabled = false;
                btn_end.disabled = false;
                //run next score
                next = nextValue;
            }, 500);
            //exit or stop
            return;
        }        
        //repeat animation smoothly 
        window.requestAnimationFrame(() => animationExecution(e));
    }
    
    //animation collision detection
    function animationCollisionDetection(e1, e2) {
        //check if not yet collided
        if(e1.right < e2.left || e1.left > e2.right || e1.bottom < e2.top || e1.top > e2.bottom){
            //continue animation
            return false; 
        }
        //collision detected
        return true;      
    }

    //animation logic checking process
    function animationLogicChecking(collisionLogicCheck, e) {
        if(!collisionLogicCheck){      
            if(index===0){
                if(!e.id.includes("70")){
                    loaderBuffer("pass");
                }else{
                    loaderBuffer("");
                }
            }
            if(index===1){
                if(e.id.includes("70")){
                    loaderBuffer("fail");
                }else{
                    loaderBuffer("pass");
                }
            }
            if(index===2){
                if(e.id.includes("90")){
                    loaderBuffer("pass");
                }else if(e.id.includes("80")){
                    loaderBuffer("poor");
                }else{
                    loaderBuffer("fail");
                }
            }
        }else{
            loaderBuffer("hide");
        }
    }

    function loaderBuffer(result){
        const logicLoader = section.querySelector(".loader");
        const loaderBuffer = logicLoader.querySelector(".loader-buffer");
        const loaderResult = logicLoader.querySelector(".loader-result");
        
        logicLoader.style.display = "block";
        loaderBuffer.style.display = "block";
        
        if(result==="hide"){
            logicLoader.style.display = "none";
            loaderBuffer.style.display = "none";
            loaderResult.style.display = "none";
            return;
        }
        
        if(result==="pass"){
            //set timeout or delay before continuing animation
            setTimeout(() => {
                loaderResult.querySelector("h2").innerHTML = "PASS";
                loaderResult.style.backgroundColor = "rgb(60,179,113)";
                loaderResult.style.display = "block";
            }, 1500); 
        }else if(result==="fail"){
            //set timeout or delay before continuing animation
            setTimeout(() => {
                loaderResult.querySelector("h2").innerHTML = "FAIL";
                loaderResult.style.backgroundColor = "rgb(230,103,113)";
                loaderResult.style.display = "block";
            }, 1500);            
        }else if(result==="poor"){
            //set timeout or delay before continuing animation
            setTimeout(() => {
                loaderResult.querySelector("h2").innerHTML = "POOR";
                loaderResult.style.backgroundColor = "orange";
                loaderResult.style.display = "block";
            }, 1500);              
        }
    }

    //animation reset
    function animationReset(e){
        //reset to initial position
        e.style.left = init_posLeft + 'px';
        e.style.top = init_posTop + 'px';
    }
});

/*
const btn_start = document.querySelector(".btn-start");
const btn_end = document.querySelector(".btn-end");
const div_score_wrapper = document.querySelector(".div-score-wrapper");
const div_score_array = div_score_wrapper.querySelectorAll("div");
const div_logic_if = document.querySelector(".div-logic-if");

//variables for collision detection and for resetting position
let collisionLogicCheck = 0;
let collisionEndCheck = 0;
let animationEnd = 0;
let init_posLeft = 0;
let init_posTop = 0;
let next = 0; //set next value to avoid simultaneous movement

//click to start animation
btn_start.addEventListener("click", () => {

    //initialize each time
    collisionLogicCheck = 0;
    collisionEndCheck = 0;
    animationEnd = 0;
    init_posLeft = 0;
    init_posTop = 0;
    
    div_score_array.forEach(dscore_arr => {       
        if(dscore_arr.id==="div-score-70" && next===0) {
            animationStart(dscore_arr);
        }
        else if(dscore_arr.id==="div-score-80" && next===1){ 
            animationStart(dscore_arr);

        }
        else if(dscore_arr.id==="div-score-90" && next===2){
            animationStart(dscore_arr);
        }
    });
});

//click to reset animation
btn_end.addEventListener("click", () => {
    
    //initialize each time;
    collisionLogicCheck = 0;
    collisionEndCheck = 0;
    animationEnd = 0;
    init_posLeft = 0;
    init_posTop = 0;
    next = 0;
    
    alert("Reset");
 
    animationReset(dscore_arr);
});

//animation start
function animationStart(dscore_arr){
    //get initial position for reset
    //offset is a read-only property which contains position value
    init_posLeft = dscore_arr.offsetLeft;
    init_posTop = dscore_arr.offsetTop;
            
    if(!animationEnd){
        btn_start.disabled = true;
        btn_end.disabled = true;
    }
            
    //start animation movement of scores
    animationExecution(dscore_arr); 
}

//animation movement execution
function animationExecution(e) {
    
    //get position using getBoundingClientRect()
    const dli = div_logic_if.querySelector("p").getBoundingClientRect();
    const btnEnd = btn_end.getBoundingClientRect(); 
    
    if(e.id==="div-score-70"){
        
        //set movement
        let moveLeft = e.offsetLeft + 3;
        let moveTop = e.offsetTop + 4;
        let nextValue = 1; //value for 'next' global variable
        
        //start animation process
        animationProcess(e, dli, btnEnd, moveLeft, moveTop, nextValue);
        
    }
    else if(e.id==="div-score-80"){
        
        //set movement
        let moveLeft = e.offsetLeft + 0;
        let moveTop = e.offsetTop + 5;
        let nextValue = 2; //value for 'next' global variable
        
        //start animation process
        animationProcess(e, dli, btnEnd, moveLeft, moveTop, nextValue);
        
    }
    else if(e.id==="div-score-90"){
        
        //set movement
        let moveLeft = e.offsetLeft - 4;
        let moveTop = e.offsetTop + 4.5;
        let nextValue = 0; //value for 'next' global variable
        
        //start animation process
        animationProcess(e, dli, btnEnd, moveLeft, moveTop, nextValue);
        
    }
}

//animation process
function animationProcess(e, dli, btnEnd, moveLeft, moveTop, nextValue){
    
        if(!collisionLogicCheck){
            //move the e (scores)
            e.style.left = (moveLeft) + 'px';
            e.style.top = (moveTop) + 'px';
        }else{
            //continue moving the e (scores) downwards
            if(collisionLogicCheck || collisionEndCheck){
                e.style.top = (moveTop) + 'px';
            }
        }
        
        //get position using getBoundingClientRect()
        const dscore = e.getBoundingClientRect();
        
        //logic phase (flowchart)
        //collisionCheck is false && collision detection is true
        if(!collisionLogicCheck && animationCollisionDetection(dscore, dli)){
            //change e position to dli position
            e.style.x = (dli.x) + 'px';
            e.style.y = (dli.y) + 'px';

            //start animation for logic checking
            animationLogicChecking(0,e);

            //set timeout or delay before continuing animation
            setTimeout(() => {
                //resume animation after logic processing
                window.requestAnimationFrame(() => animationExecution(e));
                //remove animation for logic checking
                animationLogicChecking(1,e);
            }, 2500);

            //update collisionCheck
            collisionLogicCheck = 1;

            //exit or stop
            return;    
        }
        
        //end phase (flowchart)
        //collisionCheck is false && collision detection is true
        if (!collisionEndCheck && animationCollisionDetection(dscore, btnEnd)){
            //update collisionCheck
            collisionEndCheck = 1;
        }
        
        //stop if dscore.bottom reached btnEnd.bottom
        if (dscore.bottom >= btnEnd.bottom) {
            //update animationEnd
            animationEnd = 1;
            
            //alert("End");
            
            //set timeout or delay before applying reset
            setTimeout(() => {
                //reset to initial position
                animationReset(e);
                //enable btn_start after reset
                btn_start.disabled = false;
                btn_end.disabled = false;
                //run next score
                next = nextValue;
            }, 500);
            //exit or stop
            return;
        }        
        //repeat animation smoothly 
        window.requestAnimationFrame(() => animationExecution(e));
}

//animation collision detection
function animationCollisionDetection(e1, e2) {
    
    //check if not yet collided
    if(e1.right < e2.left || e1.left > e2.right || e1.bottom < e2.top || e1.top > e2.bottom){
        //continue animation
        return false; 
    }
    
    //collision detected
    return true;      
}

//animation logic checking process
function animationLogicChecking(collisionLogicCheck, e) {
    
    const logicLoader = document.querySelector(".loader");
    const loaderBuffer = logicLoader.querySelector(".loader-buffer");
    const loaderResult = logicLoader.querySelector(".loader-result");
    
    if(!collisionLogicCheck){
        logicLoader.style.display = "block";
        if(e.id!=="div-score-70"){
            //set timeout or delay before continuing animation
            setTimeout(() => {
                loaderResult.style.display = "block";
            }, 1500);
        }
    }else{
        logicLoader.style.display = "none";
        loaderResult.style.display = "none";
    }
}

//animation output 'PASS' display

//animation reset
function animationReset(e){
    //reset to initial position
    e.style.left = init_posLeft + 'px';
    e.style.top = init_posTop + 'px';
}
*/