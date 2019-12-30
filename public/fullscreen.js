var currentCard;
var obj;
var showPost = function(id){
    displayFullScreen();
    document.getElementById('ig-link-to-post').setAttribute('href', 'https://instagram.com/p/' + id + '/');
	$.ajax({
		url: '/',
		type: 'POST',
		dataType: 'html',
		data:'idPost=' + id,
		success: function(html, status){
			obj = JSON.parse(html);
			document.getElementById('ig-post-content').classList.remove('story');
			document.getElementById('ig-post-content').setAttribute('style', '');
			removeTextSection();
		    if(obj.type === 'GraphImage'){
			    document.getElementById('ig-post-content').innerHTML = '<img src="' + obj.photo + '">';
		    }else{
			    if(obj.type === 'GraphVideo'){
				    document.getElementById('ig-post-content').innerHTML = '<video controls autoplay><source src="' + obj.video + '" type="video/mp4"></video>';
			    }else{
			        currentCard = 0;
			        if(obj[0].type === 'GraphImage'){
				        document.getElementById('ig-post-content').innerHTML = '<img src="' + obj[0].photo + '"><div id="ig-post-arrow-right" onclick="changePic(currentCard + 1)"><i class="material-icons md-light">keyboard_arrow_right</i></div>';
				    }else{
				        document.getElementById('ig-post-content').innerHTML = '<video controls autoplay><source src="' + obj[0].video + '" type="video/mp4"></video><div id="ig-post-arrow-right" onclick="changePic(currentCard + 1)"><i class="material-icons md-light">keyboard_arrow_right</i></div>';
				    }
			    }
			}
        	textMessage = '<div class="ig-post-text-owner"><img src="' + obj.profile_pic + '">' + obj.owner + '</div>';
        	if(obj.description !== undefined){
            	textMessage += '<p>' + obj.description.replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\n/g, '<br />') + '</p>';
			}
			textMessage += "<h4>Tagged People</h4><p id=\"tagged_people\">";
			if(obj.type === 'GraphImage' || obj.type === 'GraphVideo'){
				if(obj.tagged_people.count > 0){
					for(i=0;i<obj.tagged_people.count;i++){
						textMessage += '<a href="' + obj.tagged_people[i].username + '"><img src="'+ obj.tagged_people[i].profile_pic + '" alt="' + obj.tagged_people[i].username + '">' + obj.tagged_people[i].fullname + '</a><br />'
					}
				}else{
					textMessage += 'Noone has been tagged';
				}
			}else{
				if(obj[0].tagged_people.count > 0){
					for(i=0;i<obj[0].tagged_people.count;i++){
						textMessage += '<a href="' + obj[0].tagged_people[i].username + '"><img src="' + obj[0].tagged_people[i].profile_pic + '" alt="' + obj[0].tagged_people[i].username + '">' + obj[0].tagged_people[i].fullname + '</a><br />'
					}
				}else{
					textMessage += 'Noone has been tagged';
				}
			}
			textMessage += "</p>";

        	document.getElementById('ig-post-text').innerHTML= textMessage;
		},
		error: function(result, status, error){
			document.getElementById('ig-post-content').innerHTML = 'An error has occurred: ' + status + ' ' + error;
			document.getElementById('ig-post-content').setAttribute('style', 'height:unset;');
			document.getElementById('ig-post-text').innerHTML = 'An error has occurred';
		}
	});
};
var displayFullScreen = function(){
	document.body.setAttribute('style', 'overflow:hidden;');
	const position = window.scrollY;
	document.getElementById('fullScreen').setAttribute('style', 'display:block;top:' + position + 'px;');
};
var closeFulllScreen = function(){
	document.body.setAttribute('style', 'overflow:auto;');
	document.getElementById('fullScreen').setAttribute('style', 'display:none;');
	document.getElementById('ig-link-to-post').setAttribute('href', '');
	document.getElementById('ig-post-content').innerHTML = '<i class="material-icons rotation">cached</i>';
	document.getElementById('fullScreen').classList.remove("about");
	document.getElementById('ig-post-text').innerHTML = '<div class="centered"><i class="material-icons rotation">cached</i></div>';
};
var removeTextSection = function(){
	if(document.getElementById('ig-post-content').classList.contains('story')){
		document.getElementById('ig-post-text').setAttribute('style', 'display:none;');
	}else{
		document.getElementById('ig-post-text').setAttribute('style', '');
	}
}

var changePic = function(num){
	if(num <= obj.count){
	    let messageToSend = '';
	    if(num !== 0){ 
            messageToSend += '<div id="ig-post-arrow-left" onclick="changePic(currentCard - 1)"><i class="material-icons md-light">keyboard_arrow_left</i></div>';
        }
	    if(obj[num].type === 'GraphImage'){
		    messageToSend += '<img src="' + obj[num].photo + '">';
	    }else{
		    messageToSend += '<video controls autoplay><source src="' + obj[num].video + '" type="video/mp4"></video>';
	    }
		if(num != obj.count){ 
            messageToSend += '<div id="ig-post-arrow-right" onclick="changePic(currentCard + 1)"><i class="material-icons md-light">keyboard_arrow_right</i></div>';
		}

		textMessage='';
		if(obj[num].tagged_people.count > 0){
			for(i=0;i<obj[num].tagged_people.count;i++){
				textMessage += '<a href="' + obj[num].tagged_people[i].username + '"><img src="' + obj[num].tagged_people[i].profile_pic + '" alt="' + obj[num].tagged_people[i].username + '">' + obj[num].tagged_people[i].fullname + '</a><br />'
			}
		}

		document.getElementById('ig-post-content').innerHTML = messageToSend;
		document.getElementById('tagged_people').innerHTML = textMessage;
		currentCard = num;
	}else{
        return;
    }
};

var displayAbout = function(){
	displayFullScreen();
	document.getElementById('ig-post-content').innerHTML = '<h3>Welcome</h3><p>I\'m Quentin, and I\'m the Developper of Pretty-Instagram. I\'m currently in First grade of Computer Sciences study (Licence 1 d\'informatique for baguette speaker) in France.</p><p>I make this website, because, we can\'t display posts in fullscreen in instagram, posts are everytimes a bit small, even on mobile where it\'s complicated to enlarge the posts, I wanted to refocused instagram posts on the most important: pictures.<br />So I took the opportunity not to integrate many superfluous things like likes and comments, but you can still find the image on instagram easily.</p><p>Have a good time by using Pretty-instagram, and don\'t hesitate to share it to your Friends and on socials networks</p><p>If you feel you are in a mood to help me code this site or if you have seen a bug do not hesitate to come on the repositories: <a style="color:blue;text-decoration:underline;" href="https://github.com/SexiestCHiba/pretty-instagram">https://github.com/SexiestCHiba/pretty-instagram</a></p>';
	document.getElementById('fullScreen').classList.add("about");
};
document.getElementById('search-icon').addEventListener("click", function(){
    window.location.assign('/' + document.getElementById('input-search').value);
});
document.getElementById('ig-setting').addEventListener("click", displayAbout);
