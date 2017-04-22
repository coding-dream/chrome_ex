
httpGet('http://www.java1234.com/', function(response){
    document.getElementById('message').innerText = response;
});