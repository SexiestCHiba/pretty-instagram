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
		    if(obj.type === 'GraphImage'){
			    document.getElementById('ig-post-content').innerHTML = '<img style="width:100%;height:auto;" src="' + obj.photo + '">';
		    }else{
			    if(obj.type === 'GraphVideo'){
				    document.getElementById('ig-post-content').innerHTML = '<video controls autoplay><source src="' + obj.video + '" type="video/mp4"></video>';
			    }else{
			        currentCard = 0;
			        if(obj[0].type === 'GraphImage'){
				        document.getElementById('ig-post-content').innerHTML = '<img style="width:100%;height:auto;" src="' + obj[0].photo + '"><div id="ig-post-arrow-right" onclick="changePic(currentCard + 1)" style="cursor:pointer;position:absolute;top:50%; right:0;transform: translateY(-50%);"><i class="material-icons md-light">keyboard_arrow_right</i></div>';
				    }else{
				        document.getElementById('ig-post-content').innerHTML = '<video controls autoplay><source src="' + obj[0].video + '" type="video/mp4"></video><div id="ig-post-arrow-right" onclick="changePic(currentCard + 1)" style="cursor:pointer;position:absolute;top:50%; right:0;transform: translateY(-50%);"><i class="material-icons md-light">keyboard_arrow_right</i></div>';
				    }
			    }
		    }
		},
		error: function(result, status, error){
			document.getElementById('ig-post-content').innerHTML = 'An error has occurred: ' + status + ' ' + error;
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
var changePic = function(num){
	if(num <= obj.count){
	    let messageToSend = '';
	    if(num !== 0){ 
            messageToSend += '<div id="ig-post-arrow-left" onclick="changePic(currentCard - 1)" style="cursor:pointer;position:absolute;top:50%; left:0;transform: translateY(-50%);"><i class="material-icons md-light">keyboard_arrow_left</i></div>';
        }
	    if(obj[num].type === 'GraphImage'){
		    messageToSend += '<img style="width:100%;height:auto;" src="' + obj[num].photo + '">';
	    }else{
		    messageToSend += '<video controls autoplay><source src="' + obj[num].video + '" type="video/mp4"></video>';
	    }
		if(num != obj.count){ 
            messageToSend += '<div id="ig-post-arrow-right" onclick="changePic(currentCard + 1)" style="cursor:pointer;position:absolute;top:50%; right:0;transform: translateY(-50%);"><i class="material-icons md-light">keyboard_arrow_right</i></div>';
        }
		document.getElementById('ig-post-content').innerHTML = messageToSend;
		currentCard = num;
	}else{
        return;
    }
};
