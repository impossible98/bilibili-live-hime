setTimeout(() => {

	var windowWidth = window.innerWidth
	var windowHeight = window.innerHeight
	var ratio = windowHeight / windowWidth

	console.log('windowWidth, windowHeight', windowWidth, windowHeight);

	var maodouWidth = document.getElementsByTagName('iframe')[0].clientWidth
	var maodouHeight = document.getElementsByTagName('iframe')[0].clientHeight

	console.log('maodouWidth, maodouHeight', maodouWidth, maodouHeight);

	var rectLeft = document.getElementsByTagName('iframe')[0].getBoundingClientRect().left
	var rectTop = document.getElementsByTagName('iframe')[0].getBoundingClientRect().top
	console.log('rectLeft, rectTop', rectLeft, rectTop);

	var cropWidth = parseInt(maodouWidth / windowWidth * 1280)
	var cropHeight = parseInt(maodouHeight / windowHeight * 720)


	var cropX = parseInt(rectLeft / windowWidth * 1280)
	var cropY = parseInt(rectTop / windowHeight * 720)
	chrome.runtime.sendMessage({
			greeting: cropWidth + ':' + cropHeight + ":" + cropX + ":" + cropY
		},
		function(response) {
			console.log('收到来自后台的回复：' + response);
		}
	);
}, 5000);

