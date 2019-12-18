var displayAbout = function(){
	displayFullScreen();
	document.getElementById('ig-post-content').innerHTML = '<h3>Welcome</h3><p>I\'m Quentin, and I\'m the Developper of Pretty-Instagram. I\'m currently in First grade of Computer Sciences study (Licence 1 d\'informatique for baguette speaker) in France.</p><p>I make this website, because, we can\'t display posts in fullscreen in instagram, posts are everytimes a bit small, even on mobile where it\'s complicated to enlarge the posts, I wanted to refocused instagram posts on the most important: pictures.<br />So I took the opportunity not to integrate many superfluous things like likes and comments, but you can still find the image on instagram easily.</p><p>Have a good time by using Pretty-instagram, and don\'t hesitate to share it to your Friends and on socials networks</p><p>If you feel you are in a mood to help me code this site or if you have seen a bug do not hesitate to come on the repositories: <a style="color:blue;text-decoration:underline;" href="https://github.com/SexiestCHiba/pretty-instagram">https://github.com/SexiestCHiba/pretty-instagram</a></p>';
};
document.getElementById('search-icon').addEventListener("click", function(){
    window.location.assign('/' + document.getElementById('input-search').value);
});
document.getElementById('ig-setting').addEventListener("click", displayAbout);