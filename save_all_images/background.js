chrome.runtime.onInstalled.addListener(function(){
  chrome.contextMenus.create({
    'id':'saveall',
    'type':'normal',
    'title':'保存所有图片',
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab){
  if(info.menuItemId == 'saveall'){
    chrome.tabs.executeScript(tab.id, {file: 'main.js'}, function(results){
      if (results && results[0] && results[0].length){
        results[0].forEach(function(url) {
          chrome.downloads.download({
            url: url,
            conflictAction: 'uniquify', // 重名文件的处理方式：只能是uniquify（在文件名后面添加序号以保证唯一）
            // filename: 'test.png', // 保存的文件名(可选，也可以自动识别)            
            // headers: headers, // 自定义header数组（可选）
            // method: method, // 请求方式GET POST（可选）
            // body: body, // POST的数据（可选）
            saveAs: false //是否弹出另存为
          });
        });
      }
    });
  }
});
