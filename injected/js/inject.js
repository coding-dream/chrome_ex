/** inject 只和 content-script 有关联，且只能和content-script通信。*/

/**
	通过postMessage调用content-script
	postMessage(data,origin)方法接受两个参数 
	data:要传递的数据,该参数可以是JavaScript的任意基本类型或可复制的对象,然而并不是所有浏览器都做到了这点儿，部分浏览器只能处理字符串参数，所以我们在传递参数的时候需要使用JSON.stringify()方法对对象参数序列化
	origin：字符串参数，指明目标窗口的源，协议+主机+端口号[+URL]，URL会被忽略，所以可以不写，这个参数是为了安全考虑，postMessage()方法只会将message传递给指定窗口，当然如果愿意也可以建参数设置为"*"，这样可以传递给任意窗口，如果要指定和当前窗口同源的话设置为"/"。
*/

/** 发送命令消息到content-script */
function invokeContentScript1(code){
	window.postMessage({cmd: 'invoke', code: code}, '*');
}
/** 发送普通消息到content-script */
function invokeContentScript2(data){
	window.postMessage({cmd: 'message', data: data}, '*'); 
}