function loadMorePost(lastPostId){
	$.ajax({
		url: window.location.href,
		type: 'POST',
		dataType: 'html',
		data: 'lastPostId=' + lastPostId,
		success: function(html, status){
			document.getElementById('posts').innerHTML = document.getElementById('posts').innerHTML + html;
			document.getElementById('lazyLoadDiv').innerHTML = 'click here to load more posts';
			lazyloadImages = document.querySelectorAll("img.lazy");
		},
		error: function(result, status, error){
			lazyLoadDiv.innerHTML = 'An error has occurred while loading next posts ' + status + ' ' + error;
            document.removeEventListener("scroll", lazyloadPosts);
            window.removeEventListener("resize", lazyloadPosts);
            window.removeEventListener("orientationChange", lazyloadPosts);
		}
	});
};
	var lazyloadDiv = document.getElementById('lazyLoadDiv');
	function lazyloadPosts(){
	    document.getElementById('lazyLoadDiv').innerHTML = '<i class="material-icons rotation">cached</i>';
	    let elements = document.querySelectorAll("#last");
	    loadMorePost(elements[elements.length-1].innerHTML);
	}
	document.getElementById('lazyLoadDiv').addEventListener("click", lazyloadPosts);
