<?php

session_start();
if($_SESSION["verify"] != "RESPONSIVEfilemanager") die('forbiden');

include('config/config.php');
include('include/utils.php');

if(isset($_GET['action']))
    switch($_GET['action']){
	case 'view':
	    if(isset($_GET['type']))
		$_SESSION["view_type"] =$_GET['type'];
	    else
		die('view type number missing');
	    break;
	case 'sort':
	    if(isset($_GET['sort_by']))
		$_SESSION["sort_by"] =$_GET['sort_by'];
	    if(isset($_GET['descending']))
		$_SESSION["descending"] =$_GET['descending']==="true";
	    break;
	case 'image_size':
	    $pos = strpos($_POST['path'],$upload_dir);
	    if ($pos !== false) {
		$info=getimagesize(substr_replace($_POST['path'],$current_path,$pos,strlen($upload_dir)));
		echo json_encode($info);
	    }
	    
	    break;
	case 'media_preview':
	    
$preview_file = $_GET["file"];
$info = pathinfo($preview_file);
?>
<div id="jp_container_1" class="jp-video " style="margin:0 auto;">
    <div class="jp-type-single">
      <div id="jquery_jplayer_1" class="jp-jplayer"></div>
      <div class="jp-gui">
        <div class="jp-video-play">
          <a href="javascript:;" class="jp-video-play-icon" tabindex="1">play</a>
        </div>
        <div class="jp-interface">
          <div class="jp-progress">
            <div class="jp-seek-bar">
              <div class="jp-play-bar"></div>
            </div>
          </div>
          <div class="jp-current-time"></div>
          <div class="jp-duration"></div>
          <div class="jp-controls-holder">
            <ul class="jp-controls">
              <li><a href="javascript:;" class="jp-play" tabindex="1">play</a></li>
              <li><a href="javascript:;" class="jp-pause" tabindex="1">pause</a></li>
              <li><a href="javascript:;" class="jp-stop" tabindex="1">stop</a></li>
              <li><a href="javascript:;" class="jp-mute" tabindex="1" title="mute">mute</a></li>
              <li><a href="javascript:;" class="jp-unmute" tabindex="1" title="unmute">unmute</a></li>
              <li><a href="javascript:;" class="jp-volume-max" tabindex="1" title="max volume">max volume</a></li>
            </ul>
            <div class="jp-volume-bar">
              <div class="jp-volume-bar-value"></div>
            </div>
            <ul class="jp-toggles">
              <li><a href="javascript:;" class="jp-full-screen" tabindex="1" title="full screen">full screen</a></li>
              <li><a href="javascript:;" class="jp-restore-screen" tabindex="1" title="restore screen">restore screen</a></li>
              <li><a href="javascript:;" class="jp-repeat" tabindex="1" title="repeat">repeat</a></li>
              <li><a href="javascript:;" class="jp-repeat-off" tabindex="1" title="repeat off">repeat off</a></li>
            </ul>
          </div>
          <div class="jp-title" style="display:none;">
            <ul>
              <li></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="jp-no-solution">
        <span>Update Required</span>
        To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.
      </div>
    </div>
  </div>
<?php
if(in_array($info['extension'], $ext_music)){ ?>

<script type="text/javascript">
    $(document).ready(function(){
		
      $("#jquery_jplayer_1").jPlayer({
        ready: function () {
          $(this).jPlayer("setMedia", {
	    title:"<?php $_GET['title']; ?>",  
            mp3: "<?php echo $preview_file; ?>",
            m4a: "<?php echo $preview_file; ?>",
	    oga: "<?php echo $preview_file; ?>",
            wav: "<?php echo $preview_file; ?>"
          });
        },
        swfPath: "js",
	solution:"html,flash",
        supplied: "mp3, m4a, midi, mid, oga,webma, ogg, wav",
	smoothPlayBar: true,
	keyEnabled: false
      });
    });
  </script>

<?php
}elseif(in_array($info['extension'], $ext_video)){ ?>
    
    <script type="text/javascript">
    $(document).ready(function(){
		
      $("#jquery_jplayer_1").jPlayer({
        ready: function () {
          $(this).jPlayer("setMedia", {
	    title:"<?php $_GET['title']; ?>",  
            m4v: "<?php echo $preview_file; ?>",
            ogv: "<?php echo $preview_file; ?>"
          });
        },
        swfPath: "js",
	solution:"html,flash",
        supplied: "mp4, m4v, ogv, flv, webmv, webm",
	smoothPlayBar: true,
	keyEnabled: false
    });
	  
    });
  </script>
    
<?php
}
	    break;
    }
else
    die('no action passed');
?>