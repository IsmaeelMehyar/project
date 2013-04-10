//normalize window.URL
window.URL || (window.URL = window.webkitURL || window.msURL || window.oURL);

//normalize navigator.getUserMedia
navigator.getUserMedia || (navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);


/*
 * we first check if the browser supports the new
 * HTML5 getuserMedia
*/
if (typeof navigator.getUserMedia === "function") {
    
    (function() {
        var video = document.createElement('video'),
        canvas = document.querySelector('canvas'),
        context = canvas.getContext('2d')
        
        // toString for older gUM implementation, see comments on https://gist.github.com/f2ac64ed7fc467ccdfe3
        gUMOptions = {video: true, toString: function(){ return "video"; }};
        
        video.setAttribute('autoplay', true);
        context.fillStyle = "rgba(0, 0, 200, 0.5)";
        navigator.getUserMedia(gUMOptions, handleWebcamStream, errorStartingStream);
        
        function handleWebcamStream(stream) {
            video.src = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(stream) : stream;
            setTimeout(function(){
                processWebcamVideo();
            },1000);
        }
        
        function errorStartingStream() {
            alert('Uh-oh, the webcam didn\'t start. Do you have a webcam? Did you give it permission? Refresh to try again.');
        }
        
        
        var x = 0;
        var prev = 0;
        var count = 0;
        var comparevalue = 0;
        
        //how long to wait before start recording (in seconds)
        var startRecording = 5;
        
        function processWebcamVideo() {
            var startTime = +new Date();
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            var counter = 0;
            var data = imageData.data;
            
            //loop through each frame pixel by pixel
            //and calculate the mean average of RGB colors
            for(var i = 0; i < data.length; i += 4) {
                var r = i, g = i+1, b = i+2, a = i+3;
                counter += data[r] + data[g] + data[b];
            }
            
            x++;
            if (x < (startRecording * 1000) / 500 ){
               //do nothing
            } else {
                //start detecting
                
                //we devide by 
                var detect = parseInt(counter/100000);
                console.log(detect);
                if (prev === detect){
                    count++;
                }
                
                //we will not start detecting befor we get a still image at least 3 times
                //this to prevent detecting any motion while user still infront
                //of the screen
                if (count > 2){
                    //for every time we get a still page we change compare value
                    //so we reset the counter to collect comparevalue again
                    count = 0;
                    comparevalue = detect;
                    console.log('START COMPARE WITH THIS '+ comparevalue);
                }
                
                var diff = comparevalue - detect;
                if (diff < 0) diff = -1*diff; //convert to positive number
                
                //we got a detection
                if (diff > 2 && comparevalue > 0){
                    console.log('Motion Detected');
                    drawimage();
                }
                
                prev = detect;
            }
            
            //context.putImageData(imageData, 0 ,0 );
            // And repeat.
            setTimeout(processWebcamVideo, 500);
        }
        
        function drawimage (data) {
            var note = document.querySelector('#msg');
            note.innerHTML = 'Motion Detected';
            
            setTimeout(function(){
                note.innerHTML = '';
            },1000);
            
        }
        
    })();
} else {
    
}