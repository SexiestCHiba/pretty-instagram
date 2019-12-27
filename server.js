var express = require('express');
var favicon = require('serve-favicon');
var compression = require('compression');
require("dotenv").config();
var app = express();
var bodyParser = require('body-parser');
const Instagram = require('instagram-web-api');
const env = require("./env");
var client;
var loginUser;

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const message = env.message;
const finMessage = env.finMessage;
const fullscreen = env.fullscreen;
const loadPosts = env.loadPosts;
const story = env.story;
const error404 = env.error404;

var loginInsta = async function(){
	client = new Instagram({username, password});
	try{
		loginUser = await client.login();
		if(loginUser.status === 'ok'){
			console.log('Connected');
		}else{
			console.log('Unable to connect to your Instagram account');
			console.log(loginUser.status);
		}
	}catch(err){
		if(err.error && err.error.message === 'checkpoint_required'){
			const challengeUrl = err.error.checkpoint_url;
			client.updateChallenge({challengeUrl, choice: 1});
		
			client.updateChallenge({challengeUrl, securityCode: '301794'}); // <== securityCode - set code from email.
		}
	}
}

var index = async function (user, res, req) {
	let profile;
	let milieuMessage = '';
	try{
		milieuMessage += '<script>var username = "'+ user + '";document.getElementById(\'input-search\').value="' + user + '";</script>';
		profile = await client.getUserByUsername({username: user});
		res.status(200);
		console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' '  + req.url + ': 200 Success');
		milieuMessage += '<div id="profile_infos"><img id="profile_pic" alt="' + profile.username + '" src="' + profile.profile_pic_url + '"><div id="profile_name"><h2>@' + profile.username +  '</h2><h3>'+ profile.full_name + '</h3><p id="profile_biography">' + profile.biography.replace(/\n/g, "<br />") + '</p></div></div><br style="clear:both;" />';
		if(profile.is_private === true){
			milieuMessage += 'private profile';
		}
			milieuMessage = await displayPicture(await client.getPhotosByUsername({username: user, first: 50, after:''}), milieuMessage);
	}catch(err){
		console.log('error 2');
		if(err.statusCode === 404){
		milieuMessage += '<div class="centered">Unable to find User</div>';
		res.status(404);
		console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 404 Not Found');
		}
		if(err.error.message){
			milieuMessage += 'Instagram display an error: ' + err.error.message;
			res.status(500);
			console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 500 Internal server error');
		}
	}finally{
		res.send(message + milieuMessage + finMessage);
	}
}

var displayPicture = function(photo, milieuMessage, firstLoad = true){
	let max = 50;
	let x;
	if(firstLoad) milieuMessage += '<div id="posts" class="photo">';
	if(photo.user.edge_owner_to_timeline_media.count < max) max = photo.user.edge_owner_to_timeline_media.count;
	if(max === 0 || photo.user.edge_owner_to_timeline_media.edges[0] === undefined) {
		milieuMessage += 'No posts to display';
	}else{
		for(x = 0; x < max; x++){
			milieuMessage += '<div class="ig-post">';
			if(photo.user.edge_owner_to_timeline_media.edges[x].node.__typename == 'GraphSidecar'){
				milieuMessage += '<div class="graphIcon"><i class="material-icons md-light">filter_none</i></div>';
			} else{
				if(photo.user.edge_owner_to_timeline_media.edges[x].node.__typename === 'GraphVideo'){
					milieuMessage+= '<div class="graphIcon"><i class="material-icons md-light">videocam</i></div>';
				}
			}
			milieuMessage += '<a href="javascript:showPost(\'' + photo.user.edge_owner_to_timeline_media.edges[x].node.shortcode + '\');"><img class="lazy"'; 

			if(photo.user.edge_owner_to_timeline_media.edges[x].node.edge_media_to_caption.edges[0] != undefined){
				milieuMessage += ' title="' + photo.user.edge_owner_to_timeline_media.edges[x].node.edge_media_to_caption.edges[0].node.text.replace(/"/g, '&quot;').replace(/'/g, '&apos;') + '" alt="' + photo.user.edge_owner_to_timeline_media.edges[x].node.edge_media_to_caption.edges[0].node.text.replace(/"/g, '&quot;').replace(/'/g, '&apos;') + '"';

			}else{
				milieuMessage += ' alt="Post don\'t have a description"';
			}

			milieuMessage += ' data-src="' + photo.user.edge_owner_to_timeline_media.edges[x].node.thumbnail_src + '" src=""></a>';

	
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
				milieuMessage += '<div style="text-align:center;"><button id="lazyLoadDiv">click here to load more posts</button></div>';
			}
		}

	}
	
	return milieuMessage;
}

var postsInfo = async function(idPost, res, req){
	try{
			const media = await client.getMediaByShortcode({shortcode: idPost});
			let response = {
				'type': media.__typename,
				'owner': media.owner.username,
				'profile_pic': media.owner.profile_pic_url,
				'description': ""
			};
			if(media.edge_media_to_caption.edges[0] !== undefined){
				response.description = media.edge_media_to_caption.edges[0].node.text;
			}
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
			console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 200 Success');
	}catch(err){
		console.log('error 3');
		if(err.statusCode === 404){
			res.status(404).send('<span style="color:white;">Post introuvable</span>');
			console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 404 Not Found');
			return;
		}else{
			res.status(500).send('An error has occurred');
			console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 500 Internal Serveur Error');
			console.log(err);
		}
	}
	
}

var morePost = async function(idLastPost, res, req, user = 'instagram'){
	let photo;
	try{
			response = await displayPicture(await client.getPhotosByUsername({username: user, first: 50, after: idLastPost}), '', false);
			res.status(200);
			console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 200 Success');
			res.send(response);
	}catch(err){
		console.log('error 4');
		if(err.statusCode === 404){
			res.status(404).send('Unable to find the page');
			console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 404 Not Found');
		}else{
			if(err.statusCode === 400){
				res.status(400).send('Invalid pagination code');
				console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 400 Bad Request');
			}else{
				res.status(500).send('An error has occurred');
				console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 500 Internal server error');
				console.log(err);
			}
		}
	}
}

var storyJson = async function(username, res, req){
	try{
		let story = await client.getStoryItemsByUsername({username});
		let response = {
			'count': story.length
		}
		for(i in story){
			response[i] = {
				'type': story[i].__typename,
				'ressource':{
				'image': story[i].display_resources[story[i].display_resources.length-1].src
				}
			};
			if(story[i].__typename == "GraphStoryVideo"){
				response[i].ressource.video = story[i].video_resources[story[i].video_resources.length-1].src;
			}
		}
		res.status(200).send(response);
	}catch(err){
		if(err.statusCode === 404){
			// unable to find user
			res.status(404);
			console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 404 Not Found');
			response = {
				error: 404
			};
			res.send(reponse);
		}
	}
}

loginInsta();

app.use(compression())
.use(express.static(__dirname + '/public'))
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: true}))
.use(favicon(__dirname + '/public/logo.png'))
.get('/', function(req, res){
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.setHeader('Cache-Control', 'no-store, no-cache, public, no-transform');
	res.setHeader('Keep-Alive', 'timeout=5, max=1000');
 	let user = "instagram";
	index(user, res, req);
	 
})
.post('/', function(req, res){
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.setHeader('Cache-Control', 'no-store, no-cache, public, no-transform');
	res.setHeader('Keep-Alive', 'timeout=5, max=1000');
	if(req.body.idPost !== undefined){
		postsInfo(req.body.idPost, res, req);
	}else{
		if(req.body.story !== undefined){
			storyJson(req.body.story, res, req);
		}else{
			if(req.body.lastPostId !== undefined){
				morePost(req.body.lastPostId, res, req);
			}else{
				res.status(400).send("Bad request");
			}
		}
	}
})
.get('/:nick', function(req, res){
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.setHeader('Cache-Control', 'no-store, no-cache, public');
	res.setHeader('Keep-Alive', 'timeout=5, max=1000');
	index(req.params.nick, res, req);
})
.post('/:nick', function(req, res){
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.setHeader('Cache-Control', 'no-store, no-cache, public');
	res.setHeader('Keep-Alive', 'timeout=5, max=1000');
	morePost(req.body.lastPostId, res, req, req.params.nick);
})
.get('/public/fullscreen.js', function(req,res){
	res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
	res.setHeader('Cache-Control', 'public');
	res.setHeader('Keep-Alive', 'timeout=5, max=1000');
	res.status(200).send(fullscreen);
})
.get('/public/loadPosts.js', function(req,res){
	res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
	res.setHeader('Cache-Control', 'public');
	res.setHeader('Keep-Alive', 'timeout=5, max=1000');
	res.status(200).send(loadPosts);
})
.get('/public/story.js', function(req,res){
	res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
	res.setHeader('Cache-Control', 'public');
	res.setHeader('Keep-Alive', 'timeout=5, max=1000');
	res.status(200).send(story);
})
.use(function(req, res, next){
	res.status(404);
	console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 404 Not Found');
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.setHeader('Cache-Control', 'no-cache, public, no-transform');
	res.setHeader('Keep-Alive', 'timeout=5, max=1000');
	res.send(error404);
});

app.listen(3000);
