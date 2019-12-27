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
        	if(obj.description != undefined){
            	textMessage += obj.description.replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\n/g, '<br />');
			}
			
        	document.getElementById('ig-post-text').innerHTML= textMessage;
		},
		error: function(result, status, error){
			document.getElementById('ig-post-content').innerHTML = 'An error has occurred: ' + status + ' ' + error;
			document.getElementById('ig-post-content').setAttribute('style', 'height:unset;');
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
};
var removeTextSection = function(){
	if(document.getElementById('ig-post-content').classList.contains('story')){
		document.getElementById('ig-post-text').setAttribute('style', 'display:none;');
	}else{
		document.getElementById('ig-post-text').setAttribute('style', 'display:block;');
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
		document.getElementById('ig-post-content').innerHTML = messageToSend;
		currentCard = num;
	}else{
        return;
    }
};
