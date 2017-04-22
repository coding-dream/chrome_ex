var times = 0;

function run() {
   times++; 	
   setTimeout(function(){
	   run();
   }, 5000);
}

run();