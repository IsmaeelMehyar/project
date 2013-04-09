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
        
        var average = 0,
        x = 0;
        
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
                //counter = counter +  (data[g] /( data[r] > 0 ? data[r] : 1 * data[b] > 0 ? data[b] : 1));// + data[b] + data[r];
                counter += data[r] + data[g] + data[b];
            }
            
            x++;
            if (x < 5){
               average += counter;
            } else if (x === 5){
                average = average/5;
               // console.log('start detecting ' + average);
            } else {
                //start detecting
                var detect = parseInt(average - counter/100000)
                console.log(detect);
                //console.log(average);
                
                //if (something) {
                    //code
                    //tell server
                //}
            }
            
            //console.log(counter)
            //console.log(last+last2);
            //context.putImageData(imageData, 0 ,0 );
            // And repeat.
            setTimeout(processWebcamVideo, 500);
        }
        
    })();
} else {
    
}