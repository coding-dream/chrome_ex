// inject 只和 content-script 有关联，且只能和content-script通信。

// 通过postMessage调用content-script
function invokeContentScript1(code)
{
	window.postMessage({cmd: 'invoke', code: code}, '*');
}
// 发送普通消息到content-script
function invokeContentScript2(data)
{
	window.postMessage({cmd: 'message', data: data}, '*');
}