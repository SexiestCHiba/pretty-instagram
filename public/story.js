var story;
var currentStory;
function loadStory(username){
        $.ajax({
            url: '/',
		    type: 'POST',
		    dataType: 'html',
            data: 'story=' + username,
            success: function(html, status){
                story = JSON.parse(html);
                if(story.error == undefined){
                    if(story.count > 0){
                        document.getElementById('profile_pic').classList.add('haveStory');
                    }
                }
            },
            error:function(result, status, error){
                console.log('An error has occurred while getting story: ' + status + ' ' + error);
            }
        });
}

function changeStory(num){
    if(num < story.count){
	    let messageToSend = '';
	    if(num !== 0){
            messageToSend += '<div id="ig-post-arrow-left" onclick="changeStory(currentStory - 1);return false;"><i class="material-icons md-light">keyboard_arrow_left</i></div>';
        }
	    if(story[num].type === 'GraphStoryImage'){
		    messageToSend += '<img src="' + story[num].ressource.image + '">';
	    }else{
		    messageToSend += '<video onended="changeStory(currentStory+1);return false;" poster="' + story[num].ressource.image + '" autoplay><source src="' + story[num].ressource.video + '" type="video/mp4"></video>';
	    }
		if(num != story.count-1){ 
            messageToSend += '<div id="ig-post-arrow-right" onclick="changeStory(currentStory + 1);return false;" style=""><i class="material-icons md-light">keyboard_arrow_right</i></div>';
        }
        document.getElementById('ig-post-content').innerHTML = messageToSend;
		currentStory = num;
	}else{
        closeFulllScreen();
        return;
    }
}

function displayStory(){
    let element = document.getElementById('profile_pic');
    if(element.classList.contains('haveStory')){
        displayFullScreen();
        document.getElementById('ig-link-to-post').setAttribute('href', 'https://instagram.com/' + username);
        currentStory = 0;
        if(story[0].type === "GraphStoryImage"){
            document.getElementById('ig-post-content').innerHTML = '<img src="' + story[0].ressource.image + '">';
        }else{
            //video
            document.getElementById('ig-post-content').innerHTML = '<video id="Story" onended="changeStory(currentStory+1);return false;" poster="'+ story[0].ressource.image + '" autoplay><source src="'+ story[0].ressource.video +'" type="video/mp4"></video>';
        }
        if(story.count > 1){
            document.getElementById('ig-post-content').innerHTML += '<div id="ig-story-arrow-right" onclick="changeStory(currentStory + 1)"><i class="material-icons md-light">keyboard_arrow_right</i></div>';
        }
        document.getElementById('ig-post-content').classList.add('story');
        removeTextSection();
    }
}

loadStory(username);
document.getElementById('profile_pic').addEventListener("click", displayStory);