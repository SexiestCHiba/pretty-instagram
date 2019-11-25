var message ='<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8" /><title>Pretty Instagram</title><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><meta name="viewport" content="width=device-width, initial-scale=1"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>'+
'<style>html{background-color: #fafafa;font-family:Verdana, Geneva, Tahoma, sans-serif;}'+
'body{margin:0;border:0;padding:0;font-size:16px;font-size:1rem;height:100%;}'+
'#nav{z-index:100;position:fixed;top:0;left:0;width:100%;height:48px;line-height: 48px;background-color: white;box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.1);font-family: \'Courier New\', Courier, monospace;}'+
'#nav .ig-title{position:absolute;margin-left: 20px;font-size:20px;font-size:1.5rem;}#nav .ig-search{position:absolute;left:50%;transform: translateX(-50%);width:max-content;height:48px;}#nav #ig-setting{position:absolute;right:0;margin-right: 20px;top:50%;transform: translateY(-50%);}'+
'.material-icons{position: relative;top:7px;}'+
'main{margin:50px 0px;}a{text-decoration:none;color:black;}'+
'#ig-post-content{color:white;width:max-content;max-width:50%;height:max-content;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}'+
'.profile_pic{border-radius:50%;float:left;width:150px;height:150px;}.block_name{float:left;margin:0 20px;color: #262626;}.material-icons.md-light{color:rgba(255, 255, 255, 1);}'+ 
'.photo{z-index:10;display:grid;grid-template-columns: 1fr 1fr 1fr 1fr 1fr;grid-gap:3px;margin-top:30px;}.lazy{min-height:100px;}.ig-post img{width:100%;min-height:50px;height:100%;}.ig-post{grid-column:span 1;grid-row:span 1;min-height:15vw;}.graphIcon{position:absolute;width:max-content;z-index:15;}'+
'#fullScreen{position:absolute;left:0;width:100%;height:100%;background-color:rgba(0, 0, 0, 0.85);z-index:200;}'+
'.ig-post-link{position:absolute;top:0px;left:0px;z-index:201;margin-top:10px;font-size:1.2rem;}.ig-post-link a{color:white;}#lazyLoadDiv{padding:20px;}.rotation{animation-name: loading;animation-duration: 1s;animation-iteration-count: infinite;animation-timing-function: linear;}'+
'@media screen and (max-width: 750px) {.photo{grid-template-columns: 1fr 1fr;}#ig-post-content{max-width:95%;}.ig-post img{min-height:30px;}}#search-icon{cursor:pointer;}#last{display:none;} '+
'@keyframes loading{'+
	'0%{transform: rotate(360deg);}'+
	'50%{transform: rotate(180deg);}'+
	'100%{transform:rotate(0deg);}'+
'}'+
'</style></head><body>'+
'<div id="fullScreen" style="display:none;"><div class="ig-post-link"><a href="javascript:closeFulllScreen();"><span><i class="material-icons">close</i>Close</span></a><a id="ig-link-to-post" target="_blank" href=""><span style="margin-left:10px;"><i class="material-icons">exit_to_app</i>See on Instagram</span></a></div>'+
'<div id="ig-post-content" style=""><i class="material-icons rotation">cached</i></div></div>'+
'<div id="nav"><div class="ig-title">Pretty Instagram</div><div class="ig-search"><input id="input-search" type="text" placeholder="Search" value=""><i class="material-icons" id="search-icon">keyboard_arrow_right</i></div><div id="ig-setting"><i class="material-icons">more_vert</i></div></div>'+
'<script>'+
'var displayAbout = function(){'+
	'displayFullScreen();'+
	'document.getElementById(\'ig-post-content\').innerHTML = \'<h3>Welcome</h3><p>I\\\'m Quentin, and I\\\'m the Developper of Pretty-Instagram. I\\\'m currently in First grade of Computer Sciences study (Licence 1 d\\\'informatique for baguette speaker) in France.</p><p>I make this website, because, we can\\\'t display posts in fullscreen in instagram, posts are everytimes a bit small, even on mobile where it\\\'s complicated to enlarge the posts, I wanted to refocused instagram posts on the most important: pictures.<br />So I took the opportunity not to integrate many superfluous things like likes and comments, but you can still find the image on instagram easily.</p><p>Have a good time by using Pretty-instagram, and don\\\'t hesitate to share it to your Friends and on socials networks</p><p>If you feel you are in a mood to help me code this site or if you have seen a bug do not hesitate to come on the repositories: <a style="color:blue;text-decoration:underline;" href="https://github.com/SexiestCHiba/pretty-instagram">https://github.com/SexiestCHiba/pretty-instagram</a></p>\';'+
'};'+
'document.getElementById(\'search-icon\').addEventListener("click", function(){window.location.assign(\'/\' + document.getElementById(\'input-search\').value);});'+
'document.getElementById(\'ig-setting\').addEventListener("click", displayAbout);</script>'+
'<main>';


var finMessage= '<script>var lazyloadImages;'+
'window.addEventListener(\'load\', function() {'+
'lazyloadImages = document.querySelectorAll("img.lazy");var lazyloadThrottleTimeout;lazyload();'+
'function lazyload () {'+
	'if(lazyloadThrottleTimeout) {'+
		'clearTimeout(lazyloadThrottleTimeout);'+
	'} '+  
	'lazyloadThrottleTimeout = setTimeout(function() {'+
		'var scrollTop = window.pageYOffset;lazyloadImages.forEach(function(img) {'+
			'if(img.offsetTop < (window.innerHeight + scrollTop)) {'+
				'img.src = img.dataset.src;img.classList.remove(\'lazy\');'+
			'}});'+
		'if(lazyloadImages.length == 0) {'+
			'document.removeEventListener("scroll", lazyload);window.removeEventListener("resize", lazyload);window.removeEventListener("orientationChange", lazyload);'+
		'}}, 20);}'+  
'document.addEventListener("scroll", lazyload);window.addEventListener("resize", lazyload);window.addEventListener("orientationChange", lazyload);});</script>'+
'<script>'+
'var currentCard;'+
'var obj;'+
'var showPost = function(id){'+
'displayFullScreen();'+
'document.getElementById(\'ig-link-to-post\').setAttribute(\'href\', \'https://instagram.com/p/\' + id + \'/\');'+
	'$.ajax({'+
		'url: \'/\','+
		'type: \'POST\','+
		'dataType: \'html\','+
		'data:\'idPost=\' + id,'+
		'success: function(html, status){'+
		'obj = JSON.parse(html);'+
		'if(obj.type === \'GraphImage\'){'+
			'document.getElementById(\'ig-post-content\').innerHTML = \'<img style="width:100%;height:auto;" src="\' + obj.photo + \'">\';'+
		'}else{'+
			'if(obj.type === \'GraphVideo\'){'+
				'document.getElementById(\'ig-post-content\').innerHTML = \'<video controls autoplay><source src="\' + obj.video + \'" type="video/mp4"></video>\';'+
			'}else{'+
			'currentCard = 0;'+
			'if(obj[0].type === \'GraphImage\'){'+
				'document.getElementById(\'ig-post-content\').innerHTML = \'<img style="width:100%;height:auto;" src="\' + obj[0].photo + \'"><div id="ig-post-arrow-right" onclick="changePic(currentCard + 1)" style="cursor:pointer;position:absolute;top:50%; right:0;transform: translateY(-50%);"><i class="material-icons md-light">keyboard_arrow_right</i></div>\';'+
				'}else{'+
				'document.getElementById(\'ig-post-content\').innerHTML = \'<video controls autoplay><source src="\' + obj[0].video + \'" type="video/mp4"></video><div id="ig-post-arrow-right" onclick="changePic(currentCard + 1)" style="cursor:pointer;position:absolute;top:50%; right:0;transform: translateY(-50%);"><i class="material-icons md-light">keyboard_arrow_right</i></div>\';'+
				'}'+
			'}'+
		'}'+
		'},'+
		'error: function(result, status, error){'+
			'document.getElementById(\'ig-post-content\').innerHTML = \'An error has occurred: \' + status + \' \' + error;'+
		'}'+
	'});'+
'};'+
'var displayFullScreen = function(){'+
	'document.body.setAttribute(\'style\', \'overflow:hidden;\');'+
	'const position = window.scrollY;'+
	'document.getElementById(\'fullScreen\').setAttribute(\'style\', \'display:block;top:\' + position + \'px;\');'+
	
'};'+
'var closeFulllScreen = function(){'+
	'document.body.setAttribute(\'style\', \'overflow:auto;\');'+
	'document.getElementById(\'fullScreen\').setAttribute(\'style\', \'display:none;\');'+
	'document.getElementById(\'ig-link-to-post\').setAttribute(\'href\', \'\');'+
	'document.getElementById(\'ig-post-content\').innerHTML = \'<i class="material-icons rotation">cached</i>\';'+
'};'+
'var changePic = function(num){'+
	'if(num <= obj.count){'+
	'let messageToSend = \'\';'+
	'if(num !== 0){ messageToSend += \'<div id="ig-post-arrow-left" onclick="changePic(currentCard - 1)" style="cursor:pointer;position:absolute;top:50%; left:0;transform: translateY(-50%);"><i class="material-icons md-light">keyboard_arrow_left</i></div>\';}'+
		'if(obj[num].type === \'GraphImage\'){'+
			'messageToSend += \'<img style="width:100%;height:auto;" src="\' + obj[num].photo + \'">\';'+
		'}else{'+
			'messageToSend += \'<video controls autoplay><source src="\' + obj[num].video + \'" type="video/mp4"></video>\';'+
		'}'+
		'if(num != obj.count){ messageToSend += \'<div id="ig-post-arrow-right" onclick="changePic(currentCard + 1)" style="cursor:pointer;position:absolute;top:50%; right:0;transform: translateY(-50%);"><i class="material-icons md-light">keyboard_arrow_right</i></div>\';}'+
		'document.getElementById(\'ig-post-content\').innerHTML = messageToSend;'+
		'currentCard = num;'+
	'}else{return;}'+
'};'+

'</script>'+
'<script>'+
'function loadMorePost(lastPostId){'+
	'$.ajax({'+
		'url: window.location.href,'+
		'type: \'POST\','+
		'dataType: \'html\','+
		'data: \'lastPostId=\' + lastPostId,'+
		'success: function(html, status){'+
			'document.getElementById(\'posts\').innerHTML = document.getElementById(\'posts\').innerHTML + html;'+
			'document.getElementById(\'lazyLoadDiv\').innerHTML = \'click here to load more posts\';'+
			'lazyloadImages = document.querySelectorAll("img.lazy");'+
		'},'+
		'error: function(result, status, error){'+
			'lazyLoadDiv.innerHTML = \'An error has occurred while loading next posts \' + status + \' \' + error;'+
			'document.removeEventListener("scroll", lazyloadPosts);window.removeEventListener("resize", lazyloadPosts);window.removeEventListener("orientationChange", lazyloadPosts);'+
		'}'+
	'});'+
'};'+
	'var lazyloadDiv = document.getElementById(\'lazyLoadDiv\');'+
	'function lazyloadPosts(){'+
	'document.getElementById(\'lazyLoadDiv\').innerHTML = \'<i class="material-icons rotation">cached</i>\';'+
	'let elements = document.querySelectorAll("#last");'+
	'loadMorePost(elements[elements.length-1].innerHTML);'+
	'}'+
	'document.getElementById(\'lazyLoadDiv\').addEventListener("click", lazyloadPosts);'+
'</script>'+
'</main></body></html>';

exports.message = message;
exports.finMessage = finMessage;
