var express = require('express');
var favicon = require('serve-favicon');
require("dotenv").config();
var app = express();
const Instagram = require('instagram-web-api');
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

var message ='<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8" /><title>Pretty Instagram</title><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>'+
'<style>html{background-color: #fafafa;font-family:Verdana, Geneva, Tahoma, sans-serif;;}'+
'body{margin:0;border:0;padding:0;font-size:16px;font-size:1rem;height:100%;}'+
'#nav{z-index:100;position:fixed;top:0;left:0;width:100%;height:48px;line-height: 48px;background-color: white;box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.1);font-family: \'Courier New\', Courier, monospace;}'+
'#nav .ig-title{position:absolute;margin-left: 20px;font-size:20px;font-size:1.5rem;}#nav .ig-search{position:absolute;left:50%;transform: translateX(-50%);width:max-content;height:48px;}#nav .ig-setting{position:absolute;right:0;margin-right: 20px;top:50%;transform: translateY(-50%);}'+
'.material-icons{position: relative;top:7px;}'+
'#main{margin:100px;}'+
'.profile_pic{border-radius:50%;float:left;width:150px;height:150px;}.block_name{float:left;margin:0 20px;color: #262626;}.material-icons.md-light{color:rgba(255, 255, 255, 1);}'+ 
'.photo{z-index:10;display:grid;grid-template-columns: 33% 33% 33%;grid-gap:3px;margin-top:30px;}.ig-post img{width:100%;min-height:50px;height:auto;}.ig-post{grid-column:span 1;grid-row:span 1;}.graphIcon{position:absolute;width:max-content;z-index:15;}'+
'@media screen and (max-width: 750px) {#main{margin:40px;}.ig-post img{min-height:30px;}}#search-icon{cursor:pointer;} '+
'</style></head>'+
'<body><div id="nav"><div class="ig-title">Pretty Instagram</div><div class="ig-search"><input id="input-search" type="text" placaholder="Search" value=""><i class="material-icons" id="search-icon">keyboard_arrow_right</i></div><div class="ig-setting"><i class="material-icons">more_vert</i></div></div>'+
'<script type="text/javascript">document.getElementById(\'search-icon\').addEventListener("click", function(){window.location.href= document.getElementById(\'input-search\').value;});</script>'+
'<div id="main">';



var finMessage= '</div></body></html>';


var loginInsta = async function (user, res) {
	let profile;
	let photo;
	let milieuMessage = '';
	let error = false;
	try{
	var client = new Instagram({username, password});
	var loginUser = await client.login();
	if(loginUser.status === 'ok'){
		milieuMessage += '<script type="text/javascript">document.getElementById(\'input-search\').value="' + user + '";</script>';
		profile = await client.getUserByUsername({username: user});
		res.status(200);
		milieuMessage += '<img class="profile_pic" src="' + profile.profile_pic_url + '"><span class="block_name"><h2>@' + profile.username +  '</h2><h3>'+ profile.full_name + '</h3><p class="biography">' + profile.biography + '</p></span><br style="clear:both;" />';
		if(profile.is_private != true){
			photo = await client.getPhotosByUsername({username: user}, 50, '');
			milieuMessage = await displayPicture(profile, photo, milieuMessage);
		}else{
			milieuMessage += 'profil privé';
		}
	}else{
		console.log('erreur 1');
	}
}catch(err){
	console.log('erreur 2');
	error = true;
	//console.log(err);
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


var loginInstaDebug = async function(user, res){
	let profile;
	let photo;
	let milieuMessage = '';
	try{
		var client = new Instagram({username, password});
		var loginUser = await client.login();
		if(loginUser.status === 'ok'){
			profile = await client.getUserByUsername({username: user});
			photo = await client.getPhotosByUsername({username: user, first: 50, after: ''});
			res.status(200).send(photo);
		}
	}catch(err){
		console.log('erreur 2');
		console.log(err);
		if(profile.statusCode === 404){
			res.status(400).send(message + 'Utilisateur introuvable' + finMessage);
			return;
		}
		if(err.error.message){
			milieuMessage = 'Instagram signale une erreur: ' + err.error.message;
		}
		if(err.error && err.error.message === 'checkpoint_required'){
			const challengeUrl = err.error.checkpoint_url;
			await client.updateChallenge({challengeUrl, choice: 1});
		
			await client.updateChallenge({challengeUrl, securityCode: '301794'}); // <== securityCode - set code from email.
		}
	}
}

var displayPicture = async function(profile, photo, milieuMessage){
	let max = 50;
	milieuMessage += '<div class="photo">';
	if(profile.edge_owner_to_timeline_media.count < max) max = profile.edge_owner_to_timeline_media.count;
	if(max === 0 ) milieuMessage += 'Aucune image a affiché';
	for(let x = 0; x < max; x++){
		milieuMessage = milieuMessage + '<div class="ig-post">';
		if(photo.user.edge_owner_to_timeline_media.edges[x].node.__typename == 'GraphSidecar'){milieuMessage += '<div class="graphIcon"><i class="material-icons md-light">filter</i></div>';} else{ if(photo.user.edge_owner_to_timeline_media.edges[x].node.__typename === 'GraphVideo'){milieuMessage+= '<div class="graphIcon"><i class="material-icons md-light">videocam</i></div>';}}
		if(x<6){ milieuMessage += '<a href="#"><img src="' + photo.user.edge_owner_to_timeline_media.edges[x].node.thumbnail_src + '"'; milieuMessage += '>'; }else{milieuMessage += '<img class="lazy" data-src="' + photo.user.edge_owner_to_timeline_media.edges[x].node.thumbnail_src + '"';milieuMessage+= '>';}

		milieuMessage += '</div>';
	}
	milieuMessage += '<script type="text/javascript">document.addEventListener("DOMContentLoaded", function() {var lazyloadImages = document.querySelectorAll("img.lazy");var lazyloadThrottleTimeout;lazyload();'+
	'function lazyload () {if(lazyloadThrottleTimeout) {clearTimeout(lazyloadThrottleTimeout);} '+  
	'lazyloadThrottleTimeout = setTimeout(function() {var scrollTop = window.pageYOffset;lazyloadImages.forEach(function(img) {if(img.offsetTop < (window.innerHeight + scrollTop)) {img.src = img.dataset.src;img.classList.remove(\'lazy\');}});'+
	'if(lazyloadImages.length == 0) { document.removeEventListener("scroll", lazyload);window.removeEventListener("resize", lazyload);window.removeEventListener("orientationChange", lazyload);}'+
		'}, 20);}'+  
	  'document.addEventListener("scroll", lazyload);window.addEventListener("resize", lazyload);window.addEventListener("orientationChange", lazyload);'+
	'});'+
	'</script></div>';
	return milieuMessage;
}

app.use(express.static(__dirname + '/public'))
.use(favicon(__dirname + '/public/logo.png'))
.get('/', function(req, res){
	res.setHeader('Cache-Control', 'no-store, no-cache, public, no-transform');
 	let user = "instagram";
	loginInsta(user, res);
	 
})
.get('/:nick', function(req, res){
	res.setHeader('Cache-Control', 'no-store, no-cache, public, no-transform');
	loginInsta(req.params.nick, res);
})
.use(function(req, res, next){
	res.status(404);
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	res.setHeader('Cache-Control', 'no-store, no-cache, public, no-transform');
	res.send('Page introuvable');
});

app.listen(3000);
