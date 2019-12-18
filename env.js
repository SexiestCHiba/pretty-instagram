var message ='<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8" /><title>Pretty Instagram</title><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><meta name="viewport" content="width=device-width, initial-scale=1"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>'+
'<style>html{background-color: #fafafa;font-family:Verdana, Geneva, Tahoma, sans-serif;}'+
'body{margin:0;border:0;padding:0;font-size:16px;font-size:1rem;height:100%;}'+
'#nav{z-index:100;position:fixed;top:0;left:0;width:100%;height:48px;line-height: 48px;background-color: white;box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.1);font-family: \'Courier New\', Courier, monospace;}'+
'#nav .ig-title{position:absolute;margin-left: 20px;font-size:20px;font-size:1.5rem;}#nav .ig-search{position:absolute;left:50%;transform: translateX(-50%);width:max-content;height:48px;}#nav #ig-setting{position:absolute;right:0;margin-right: 20px;top:50%;transform: translateY(-50%);}'+
'.material-icons{position: relative;top:7px;}'+
'main{margin:50px 0px;}a{text-decoration:none;color:black;}'+
'#ig-post-content{color:white;width:max-content;max-width:50%;height:max-content;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}'+
'#profile_infos{margin:70px 0 0 50px;}#profile_pic{border-radius:50%;float:left;width:150px;height:150px;}#profile_name{float:left;margin:0 20px;color: #262626;}.material-icons.md-light{color:rgba(255, 255, 255, 1);}'+ 
'.photo{z-index:10;display:grid;grid-template-columns: 1fr 1fr 1fr 1fr 1fr;grid-gap:3px;margin-top:30px;}.lazy{min-height:100px;}.ig-post img{width:100%;min-height:50px;height:100%;}.ig-post{grid-column:span 1;grid-row:span 1;min-height:15vw;}.graphIcon{position:absolute;width:max-content;z-index:15;}'+
'#fullScreen{position:absolute;left:0;width:100%;height:100%;background-color:rgba(0, 0, 0, 0.85);z-index:200;}'+
'.ig-post-link{position:absolute;top:0px;left:0px;z-index:201;margin-top:10px;font-size:1.2rem;}.ig-post-link a{color:white;}#lazyLoadDiv{padding:20px;}.rotation{animation-name: loading;animation-duration: 1s;animation-iteration-count: infinite;animation-timing-function: linear;}'+
'@media screen and (max-width: 750px) {.photo{grid-template-columns: 1fr 1fr;}#ig-post-content{max-width:95%;}.ig-post img{min-height:30px;}}#search-icon{cursor:pointer;}#last{display:none;} '+
'@keyframes loading{'+
	'0%{transform: rotate(360deg);}'+
	'50%{transform: rotate(180deg);}'+
	'100%{transform:rotate(0deg);}'+
'}'+
'</style></head><body>'+
'<div id="fullScreen" style="display:none;"><div class="ig-post-link"><a href="javascript:closeFulllScreen();"><span><i class="material-icons">close</i>Close</span></a><a id="ig-link-to-post" target="_blank" href=""><span style="margin-left:10px;"><i class="material-icons">exit_to_app</i>See on Instagram</span></a></div>'+
'<div id="ig-post-content" style=""><i class="material-icons rotation">cached</i></div></div>'+
'<div id="nav"><div class="ig-title">Pretty Instagram</div><div class="ig-search"><input id="input-search" type="text" placeholder="Search" value=""><i class="material-icons" id="search-icon">keyboard_arrow_right</i></div><div id="ig-setting"><i class="material-icons">more_vert</i></div></div>'+
'<script src="/public/displayAbout.js"></script>'+
'<main>';


var finMessage= '<script src="/public/lazyloader.js"></script>'+
'<script src="/public/fullscreen.js"></script>'+
'<script src="/public/loadPosts.js"></script>'+
'</main></body></html>';

exports.message = message;
exports.finMessage = finMessage;
