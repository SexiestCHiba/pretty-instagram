var express = require('express');
var favicon = require('serve-favicon');
var compression = require('compression');
require("dotenv").config();
var app = express();
var bodyParser = require('body-parser');
const Instagram = require('instagram-web-api');
var client;
var loginUser;

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
let message;
let finMessage;
let error404;

var loginInsta = async function(){
	client = new Instagram({username, password});
	try{
		loginUser = await client.login();
		if(loginUser.status === 'ok'){
			return 'Connected';
		}else{
			console.error(loginUser.status);
			return 'Unable to connect to your Instagram account';
		}
	}catch(err){
		if(err.error && err.error.message === 'checkpoint_required'){
			const challengeUrl = err.error.checkpoint_url;
			client.updateChallenge({challengeUrl, choice: 1});
			client.updateChallenge({challengeUrl, securityCode: '301794'}); // <== securityCode - set code from email.
			console.error("Please follow this URL ( https://instagram.com/ " + err.error.checkpoint_url + ") on browser and give code validation you received by email, then restart the server");
			return 'Chalenge required';
		}else{
			// console.error(err);
			// return 'An error occured';
		}
	}
}

var index = async function (user, res, req) {
	let profile;
	let milieuMessage = '';
	let userId;
	try{
		milieuMessage += '<script>var username = "'+ user + '";document.getElementById(\'input-search\').value="' + user + '"; document.title = "' + user + ' - Pretty Instagram";</script>';
		profile = await client.getUserByUsername({username: user});
		userId = profile.id;
		res.status(200);
		console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' '  + req.url + ': 200 Success');
		milieuMessage += '<div id="profile_infos"><img id="profile_pic" alt="' + profile.username + '" src="' + profile.profile_pic_url + '"><a target="_blank" rel="noopener" href="https://instagram.com/' + profile.username + '"><div id="profile_name"><h2>@' + profile.username +  '</h2></a><h3>'+ profile.full_name + '</h3>';
		if(profile.is_private === true){
			milieuMessage += 'private profile';
		}
		milieuMessage+='<p id="profile_biography">' + profile.biography.replace(/\n/g, "<br />") + '</p></div></div><br style="clear:both;" />';
		milieuMessage += '<script src="/public/story.js"></script>';
		milieuMessage = await displayPicture(await client.getUserIdPhotos({id: userId, first: 50, after:''}), milieuMessage);
	}catch(err){
		
		if(err.statusCode === 404){
		milieuMessage += '<div class="centered">Unable to find User</div>';
		res.status(404);
		console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 404 Not Found');
		}else{
			console.log('error 2');
			console.error(err);
			if(err.error.message){
				milieuMessage += '<div class="centered"><p>Instagram display an error:</p><strong>' + err.error.message + '</strong></div>';
				res.status(500);
				console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 500 Internal server error');
			}
		}
	}finally{
		res.write(milieuMessage + finMessage);
		res.end();
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
		for(x in photo.user.edge_owner_to_timeline_media.edges){
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
								'type': 'GraphImage',
							};
						}else{
							//GraphVideo
							response[i] = {
								'video': media.edge_sidecar_to_children.edges[i].node.video_url,
								'type': 'GraphVideo'
							};
						}
						response[i].tagged_people = {
							'count': media.edge_sidecar_to_children.edges[i].node.edge_media_to_tagged_user.edges.length
						}
						for(e in media.edge_sidecar_to_children.edges[i].node.edge_media_to_tagged_user.edges){
							let fullname;
							if(media.edge_sidecar_to_children.edges[i].node.edge_media_to_tagged_user.edges[e].node.user.full_name === "" || media.edge_sidecar_to_children.edges[i].node.edge_media_to_tagged_user.edges[e].node.user.full_name === undefined){
								fullname = media.edge_sidecar_to_children.edges[i].node.edge_media_to_tagged_user.edges[e].node.user.username;
							}else{
								fullname = media.edge_sidecar_to_children.edges[i].node.edge_media_to_tagged_user.edges[e].node.user.full_name;
							}
							response[i].tagged_people[e] = {
								'username': media.edge_sidecar_to_children.edges[i].node.edge_media_to_tagged_user.edges[e].node.user.username,
								'fullname': fullname,
								'profile_pic': media.edge_sidecar_to_children.edges[i].node.edge_media_to_tagged_user.edges[e].node.user.profile_pic_url
							};
						}
					}
					response.count = i;
				}
			}
			if(media.__typename !== 'GraphSidecar'){
				response.tagged_people = {
					'count': media.edge_media_to_tagged_user.edges.length
				}
				for(e in media.edge_media_to_tagged_user.edges){
					let fullname;
					if(media.edge_media_to_tagged_user.edges[e].node.user.full_name === "" || media.edge_media_to_tagged_user.edges[e].node.user.full_name === undefined){
						fullname =  media.edge_media_to_tagged_user.edges[e].node.user.username;
					}else{
						fullname = media.edge_media_to_tagged_user.edges[e].node.user.full_name;
					}
					response.tagged_people[e] = {
						'username': media.edge_media_to_tagged_user.edges[e].node.user.username,
						'fullname': fullname,
						'profile_pic': media.edge_media_to_tagged_user.edges[e].node.user.profile_pic_url
					};
				}
			}
			res.status(200).send(response);
			console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 200 Success');
	}catch(err){
		if(err.statusCode === 404){
			res.status(404).send('<span style="color:white;">Post introuvable</span>');
			console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 404 Not Found');
			return;
		}else{
			res.status(500).send('An error has occurred');
			console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 500 Internal Serveur Error');
			console.err(err);
		}
	}
	
}

var morePost = async function(idLastPost, res, req, user = 'instagram'){
	try{
			response = await displayPicture(await client.getPhotosByUsername({username: user, first: 50, after: idLastPost}), '', false);
			res.status(200);
			console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 200 Success');
			res.send(response);
	}catch(err){
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
				console.error(err);
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
				},
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
			res.send(response);
		}else{
			res.status(500).send('An error has occurred');
			console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 500 Internal server error');
			console.error(err);
		}
	}
}

const promise1 = new Promise((resolve, reject)=> {
	resolve(loginInsta());
});

const promise2 = new Promise((resolve, reject) => {
	try{
		const env = require("./env");
		message = env.message;
		finMessage = env.finMessage;
		error404 = env.error404;
		resolve("All needed files loaded");
	}catch(err){
		reject(err)
	}
});

Promise.all([promise1, promise2]).then((values) => {
	console.log(values);
	routing();
}).catch((reasons) => {
	console.error("ERROR");
	console.warn(reasons);
});


let  routing = function(){
	app.use(compression())
	.use('/public', express.static(__dirname + '/public'))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: true}))
	.use(favicon(__dirname + '/public/logo.png'))
	.get('/robots.txt', (req, res) => {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		res.setHeader('Cache-Control', 'public');
		res.setHeader('Keep-Alive', 'timeout=5, max=1000');
		res.status(200).send('User-agent: *\n'+
		'Allow: *\n'+
		'Disallow: /public/\n');
		console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 200 Success');
	
	})
	.get('/', (req, res) => {
		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		res.setHeader('Cache-Control', 'no-store, no-cache, public');
		res.setHeader('Keep-Alive', 'timeout=5, max=1000');
		res.write(message);
		index("instagram", res, req);
		 
	})
	.get('/:nick', (req, res) => {
		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		res.setHeader('Cache-Control', 'no-store, no-cache, public');
		res.setHeader('Keep-Alive', 'timeout=5, max=1000');
		res.write(message);
		index(req.params.nick, res, req);
	})
	.post('/', (req, res) => {
		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		res.setHeader('Cache-Control', 'no-store, no-cache, public');
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
	.post('/:nick', (req, res) => {
		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		res.setHeader('Cache-Control', 'no-store, no-cache, public');
		res.setHeader('Keep-Alive', 'timeout=5, max=1000');
		morePost(req.body.lastPostId, res, req, req.params.nick);
	})
	.use((req, res) => {
		res.status(404);
		console.log('New request[' + req.connection.remoteAddress + ']: ' + req.method +  ' ' + req.url + ': 404 Not Found');
		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		res.setHeader('Cache-Control', 'public');
		res.setHeader('Keep-Alive', 'timeout=5, max=1000');
		res.send(message + error404);
	});
	
	app.listen(3000);
	
}