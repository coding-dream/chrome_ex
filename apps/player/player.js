var flashvars={
		f:'http://img.ksbbs.com/asset/Mon_1605/0ec8cc80112a2d6.mp4',
		c:0,
		b:1,
		i:'http://www.ckplayer.com/static/images/cqdw.jpg'
	};

	var video=['http://img.ksbbs.com/asset/Mon_1605/0ec8cc80112a2d6.mp4->video/mp4'];
	// 注意这里的a1(播放区域的div) 和 ckplayer_a1(播放器id)这两个值，自定义的，我们需要用。ckplayer_a1本案例没有使用(开关灯操作等)
	CKobject.embed('ckplayer/ckplayer.swf','a1','ckplayer_a1','600','400',false,flashvars,video);

	function closelights(){// 关灯
		alert(' 本演示不支持开关灯');
	}

	function openlights(){// 开灯
		alert(' 本演示不支持开关灯');
	}
