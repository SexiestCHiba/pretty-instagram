var express = require('express');
var favicon = require('serve-favicon');
require("dotenv").config();
var app = express();
var bodyParser = require('body-parser');
const Instagram = require('instagram-web-api');
var client;
var loginUser;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

var message ='<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8" /><title>Pretty Instagram</title><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>'+
'<style>html{background-color: #fafafa;font-family:Verdana, Geneva, Tahoma, sans-serif;;}'+
'body{margin:0;border:0;padding:0;font-size:16px;font-size:1rem;height:100%;}'+
'#nav{z-index:100;position:fixed;top:0;left:0;width:100%;height:48px;line-height: 48px;background-color: white;box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.1);font-family: \'Courier New\', Courier, monospace;}'+
'#nav .ig-title{position:absolute;margin-left: 20px;font-size:20px;font-size:1.5rem;}#nav .ig-search{position:absolute;left:50%;transform: translateX(-50%);width:max-content;height:48px;}#nav .ig-setting{position:absolute;right:0;margin-right: 20px;top:50%;transform: translateY(-50%);}'+
'.material-icons{position: relative;top:7px;}'+
'#main{margin:100px;}a{text-decoration:none;color:black;}'+
'.profile_pic{border-radius:50%;float:left;width:150px;height:150px;}.block_name{float:left;margin:0 20px;color: #262626;}.material-icons.md-light{color:rgba(255, 255, 255, 1);}'+ 
'.photo{z-index:10;display:grid;grid-template-columns: 20% 20% 20% 20% 20%;grid-gap:3px;margin-top:30px;}.lazy{min-height:100px;}.ig-post img{width:100%;min-height:50px;height:auto;}.ig-post{grid-column:span 1;grid-row:span 1;}.graphIcon{position:absolute;width:max-content;z-index:15;}'+
'#fullScreen{position:absolute;left:0;width:100%;height:100%;background-color:rgba(0, 0, 0, 0.85);z-index:200;}'+
'.ig-post-link{position:absolute;top:0px;left:0px;z-index:201;margin-top:10px;font-size:1.2rem;}.ig-post-link a{color:white;}'+
'@media screen and (max-width: 750px) {#main{margin:40px;}.ig-post img{min-height:30px;}}#search-icon{cursor:pointer;}#last{display:none;} '+
'</style></head>'+
'<div id="fullScreen" style="display:none;"><div class="ig-post-link"><a href="javascript:closeFulllScreen();"><span><i class="material-icons">close</i>Fermer</span></a><a id="ig-link-to-post" target="_blank" href=""><span style="margin-left:10px;"><i class="material-icons">exit_to_app</i>Voir sur Instagram</span></a></div>'+
'<div id="ig-post-content" style="color:white;width:max-content;max-width:50%;height:max-content;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"></div></div>'+
'<body><div id="nav"><div class="ig-title">Pretty Instagram</div><div class="ig-search"><input id="input-search" type="text" placaholder="Search" value=""><i class="material-icons" id="search-icon">keyboard_arrow_right</i></div><div class="ig-setting"><i class="material-icons">more_vert</i></div></div>'+
'<script type="text/javascript">var cursor; document.getElementById(\'search-icon\').addEventListener("click", function(){window.location.assign(\'/\' + document.getElementById(\'input-search\').value);});</script>'+
'<div id="main">';



var finMessage= '<script type="text/javascript">var lazyloadImages;'+
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
'<script type="text/javascript">'+
'var currentCard;'+
'var obj;'+
'var showPost = function(id){'+
'displayFullScreen(id);'+
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
			'document.getElementById(\'ig-post-content\').innerHTML = \'Une erreur est survenue: \' + status + \' \' + error;'+
		'}'+
	'});'+
'};'+
'var displayFullScreen = function(id){'+
	'document.body.setAttribute(\'style\', \'overflow:hidden;\');'+
	'const position = window.scrollY;'+
	'document.getElementById(\'fullScreen\').setAttribute(\'style\', \'display:block;top:\' + position + \'px;\');'+
	'document.getElementById(\'ig-link-to-post\').setAttribute(\'href\', \'https://instagram.com/p/\' + id + \'/\');'+
'};'+
'var closeFulllScreen = function(){'+
	'document.body.setAttribute(\'style\', \'overflow:auto;\');'+
	'document.getElementById(\'fullScreen\').setAttribute(\'style\', \'display:none;\');'+
	'document.getElementById(\'ig-link-to-post\').setAttribute(\'href\', \'\');'+
	'document.getElementById(\'ig-post-content\').innerHTML = \'\';'+
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
'<script type="text/javascript">'+
'function loadMorePost(lastPostId){'+
	'$.ajax({'+
		'url: window.location.href,'+
		'type: \'POST\','+
		'dataType: \'html\','+
		'data: \'lastPostId=\' + lastPostId,'+
		'success: function(html, status){'+
			'document.getElementById(\'posts\').innerHTML = document.getElementById(\'posts\').innerHTML + html;'+
			'document.getElementById(\'lazyLoadDiv\').innerHTML = \'Cliquez ici pour charger plus de posts\';'+
			'lazyloadImages = document.querySelectorAll("img.lazy");'+
		'},'+
		'error: function(result, status, error){'+
			'lazyLoadDiv.innerHTML = \'Une erreur est survenue lors du chargement des posts suivant\' + status + \' \' + error;'+
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
'</script></body></html>';


var loginInsta = async function (user, res) {
	let profile;
	let photo;
	let milieuMessage = '';
	let error = false;
	try{
	client = new Instagram({username, password});
	loginUser = await client.login();
	if(loginUser.status === 'ok'){
		milieuMessage += '<script type="text/javascript">document.getElementById(\'input-search\').value="' + user + '";</script>';
		profile = await client.getUserByUsername({username: user});
		res.status(200);
		milieuMessage += '<img class="profile_pic" src="' + profile.profile_pic_url + '"><span class="block_name"><h2>@' + profile.username +  '</h2><h3>'+ profile.full_name + '</h3><p class="biography">' + profile.biography + '</p></span><br style="clear:both;" />';
		if(profile.is_private != true){
			photo = await client.getPhotosByUsername({username: user, first: 50, after:''});
			milieuMessage = await displayPicture(photo, milieuMessage);
		}else{
			milieuMessage += 'profil privé';
		}
	}else{
		console.log('erreur 1');
	}
	}catch(err){
		console.log('erreur 2');
		error = true;
		console.log(err);
		if(err.statusCode === 404){
		milieuMessage += 'Utilisateur introuvable';
		}
		if(err.error.message){
			milieuMessage += 'Instagram signale une erreur: ' + err.error.message;
		}
		if(err.error && err.error.message === 'checkpoint_required'){
			const challengeUrl = err.error.checkpoint_url;
			await client.updateChallenge({challengeUrl, choice: 1});
		
			await client.updateChallenge({challengeUrl, securityCode: '301794'}); // <== securityCode - set code from email.
		}
	}finally{
		if(error === true) milieuMessage += 'Une erreur est survenue';
		res.send(message + milieuMessage + finMessage);
	}
}

var displayPicture = async function(photo, milieuMessage, firstLoad = true){
	let max = 50;
	let x;
	if(firstLoad) milieuMessage += '<div id="posts" class="photo">';
	if(photo.user.edge_owner_to_timeline_media.count < max) max = photo.user.edge_owner_to_timeline_media.count;
	if(max === 0 ) milieuMessage += 'Aucune image a affiché';
	for(x = 0; x < max; x++){
		milieuMessage += '<div class="ig-post">';
		if(photo.user.edge_owner_to_timeline_media.edges[x].node.__typename == 'GraphSidecar'){
			milieuMessage += '<div class="graphIcon"><i class="material-icons md-light">filter</i></div>';
		} else{
			if(photo.user.edge_owner_to_timeline_media.edges[x].node.__typename === 'GraphVideo'){
				milieuMessage+= '<div class="graphIcon"><i class="material-icons md-light">videocam</i></div>';
			}
		}
		if(x<5){
			milieuMessage += '<a href="javascript:showPost(\'' + photo.user.edge_owner_to_timeline_media.edges[x].node.shortcode + '\');"><img src="' + photo.user.edge_owner_to_timeline_media.edges[x].node.thumbnail_src + '"></a>';
		}else{
			milieuMessage += '<a href="javascript:showPost(\'' + photo.user.edge_owner_to_timeline_media.edges[x].node.shortcode + '\');"><img class="lazy" data-src="' + photo.user.edge_owner_to_timeline_media.edges[x].node.thumbnail_src + '"></a>';
		}

		milieuMessage += '</div>';
	}

	if(firstLoad){
		if(photo.user.edge_owner_to_timeline_media.page_info.has_next_page === true){
			milieuMessage += '<div id="last">'+ photo.user.edge_owner_to_timeline_media.page_info.end_cursor + '</div>';
		}
	}else{
		if(photo.user.edge_owner_to_timeline_media.page_info.has_next_page === true){
			milieuMessage += '<div id="last">' + photo.user.edge_owner_to_timeline_media.page_info.end_cursor + '</div>';
		}else{
			milieuMessage += '<div id="last">null</div>';
		}
	}

	if(firstLoad) milieuMessage += '</div>';
	if(firstLoad){
		if(photo.user.edge_owner_to_timeline_media.page_info.has_next_page === true){
			milieuMessage += '<div style="text-align:center;"><div id="lazyLoadDiv">Cliquez ici pour charger plus de posts</div></div>';
		}
	}
	milieuMessage += '</div>';
	return milieuMessage;
}

var postsInfo = async function(idPost, res){
	try{
		var client = new Instagram({username, password});
		var loginUser = await client.login();
		if(loginUser.status === 'ok'){
			const media = await client.getMediaByShortcode({shortcode: idPost});
			let response = {
				'type': media.__typename
			};
			if(media.__typename !== 'GraphSidecar' && media.__typename !== 'GraphVideo'){
				response.photo = media.display_url;
			}else{
				if(media.__typename === 'GraphVideo'){
					response.video = media.video_url;
				}else{
					let i;
					for(i in media.edge_sidecar_to_children.edges){
						if(media.edge_sidecar_to_children.edges[i].node.__typename === 'GraphImage'){
							response[i] = {
								'photo': media.edge_sidecar_to_children.edges[i].node.display_url,
								'type': 'GraphImage'
							};
						}else{
							//GraphVideo
							response[i] = {
								'video': media.edge_sidecar_to_children.edges[i].node.video_url,
								'type': 'GraphVideo'
							};
						}
					}
					response.count = i;
				}
			}
			res.status(200).send(response);
		}
	}catch(err){
		console.log('error 3');
		if(err.statusCode === 404){
			res.status(404).send('<span style="color:white;">Post introuvable</span>');
			return;
		}else{
			res.status(500).send('Une erreur est survenue');
			console.log(err);
		}
	}
	
}

var morePost = async function(idLastPost, res, user = 'instagram'){
	let photo;
	try{
		client = new Instagram({username, password});
		loginUser = await client.login();
		if(loginUser.status === 'ok'){
			photo = await client.getPhotosByUsername({username: user, first: 50, after: idLastPost});
			let response = '';
			response = await displayPicture(photo, response, false);
			res.status(200)
			res.send(response);
		}else{
			console.log('erreur 1.5');
			res.status(500).send('Une erreur est survenue: impossible de se connecter à instagram');
		}
	}catch(err){
		console.log('error 4');
		if(err.statusCode === 404){
			res.status(404).send('Page introuvable');
		}else{
			if(err.statusCode === 400){
				res.status(400).send('Code de pagination invalide')
			}else{
				res.status(500).send('Une erreur est survenue');
				console.log(err);
			}
		}
	}
}

app.use(express.static(__dirname + '/public'))
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: true}))
.use(favicon(__dirname + '/public/logo.png'))
.get('/', function(req, res){
	res.setHeader('Cache-Control', 'no-store, no-cache, public, no-transform');
	res.setHeader('Keep-Alive', 'timeout=5, max=1000');
 	let user = "instagram";
	loginInsta(user, res);
	 
})
.post('/', function(req, res){
	res.setHeader('Cache-Control', 'no-store, no-cache, public, no-transform');
	res.setHeader('Keep-Alive', 'timeout=5, max=1000');
	if(req.body.idPost === undefined){
		morePost(req.body.lastPostId, res);
	}else{
		postsInfo(req.body.idPost, res);
	}
})
.get('/:nick', function(req, res){
	res.setHeader('Cache-Control', 'no-store, no-cache, public, no-transform');
	res.setHeader('Keep-Alive', 'timeout=5, max=1000');
	loginInsta(req.params.nick, res);
})
.post('/:nick', function(req, res){
	res.setHeader('Cache-Control', 'no-store, no-chache, public, no-transform');
	res.setHeader('Keep-Alive', 'timeout=5, max=1000');
	morePost(req.body.lastPostId, res, req.params.nick);
})
.use(function(req, res, next){
	res.status(404);
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	res.setHeader('Cache-Control', 'no-store, no-cache, public, no-transform');
	res.setHeader('Keep-Alive', 'timeout=5, max=1000');
	res.send('Page introuvable');
});

app.listen(3000);
