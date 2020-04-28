var lazyloadImages;
window.addEventListener('load', function() {
    lazyloadImages = document.querySelectorAll("img.lazy");
    var lazyloadThrottleTimeout;
    lazyload();
    function lazyload () {
	    if(lazyloadThrottleTimeout) {
		    clearTimeout(lazyloadThrottleTimeout);
	    } 
	    lazyloadThrottleTimeout = setTimeout(function() {
		    var scrollTop = window.pageYOffset;lazyloadImages.forEach(function(img) {
			    if(img.offsetTop < (window.innerHeight + scrollTop)) {
				    img.src = img.dataset.src;img.classList.remove('lazy');
                }
            });
		    if(lazyloadImages.length == 0) {
                document.removeEventListener("scroll", lazyload);
                window.removeEventListener("resize", lazyload);
                window.removeEventListener("orientationChange", lazyload);
            }
        }, 20);
    }
    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
});

function loadMorePost(lastPostId){
	$.ajax({
		url: window.location.href,
		type: 'POST',
		dataType: 'html',
		data: 'lastPostId=' + lastPostId,
		success: function(html){
			document.getElementById('posts').innerHTML = document.getElementById('posts').innerHTML + html;
			let elements = document.querySelectorAll("#last");
			if(elements[elements.length-1].innerHTML !== "null"){
				document.getElementById('lazyLoadDiv').innerHTML = 'click here to load more posts';
			}else{
				document.getElementById('lazyLoadDiv').style.display = "none";
			}
			lazyloadImages = document.querySelectorAll("img.lazy");
		},
		error: function(result, status, error){
			lazyLoadDiv.innerHTML = 'An error has occurred while loading next posts<br /><strong>' + status + ' ' + error + '<br />' + result.responseText + '</strong>';
            document.removeEventListener("scroll", lazyloadPosts);
            window.removeEventListener("resize", lazyloadPosts);
            window.removeEventListener("orientationChange", lazyloadPosts);
		}
	});
}
	var lazyloadDiv = document.getElementById('lazyLoadDiv');
	function lazyloadPosts(){
	    document.getElementById('lazyLoadDiv').innerHTML = '<i class="material-icons rotation">cached</i>';
	    let elements = document.querySelectorAll("#last");
	    loadMorePost(elements[elements.length-1].innerHTML);
	}
	document.getElementById('lazyLoadDiv').addEventListener("click", lazyloadPosts);
