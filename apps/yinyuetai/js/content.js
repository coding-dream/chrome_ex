document.addEventListener('DOMContentLoaded', function(){
	initCustomPanel();
});	

function initCustomPanel(){
	var panel = document.createElement('div');
	panel.className = 'download';
	panel.innerHTML = `
		<style>
			.tip {
				z-index: 1000;
			    position: fixed;
			    left: 20px;
			    padding: 16px 10px;
			    top: 30px;
			    color: white;
			    min-width: 150px;
				max-width: 700px;
			    border-radius: 3px;
			    text-align: center;
			    font-size: 16px;
			    background: #70a800;
			    background-image: linear-gradient(to bottom, #95cc2a, #70a800);
			    box-shadow: 0 0 3px rgba(0, 0, 0, .2);
				transition: top .4s;
		}

		</style>
		<div class = "tip" style="display:none;">
			<a id="down_url" href="#">视频地址</a><br>
			<button class = "btn_down" href="#">复制下载地址</button>
		</div>
	`;
	document.body.appendChild(panel);
}