// 该url必须是permissions中声明过的，否则请求失败
httpGet('http://www.mm131.com/xinggan/', function(response){
    document.getElementById('message').innerText = response;
});