$(document).ready(function(){	    
    
    $('input[name=radio-sort]').click(function(){
        var li=$(this).data('item');
	$('.filters label').removeClass("btn-inverse");
	$('.filters label').find('i').removeClass('icon-white');
	$('#'+li).addClass("btn-inverse");
	$('#'+li).find('i').addClass('icon-white');
        if(li=='ff-item-type-all'){ 
			$('.grid li').show(300); 
		}else{
            if($(this).is(':checked')){
                $('.grid li').not('.'+li).hide(300);
                $('.grid li.'+li).show(300);
            }
        }
    });

	$('#full-img').click(function(){
		$('#previewLightbox').lightbox('hide');
	});
	
	$('.upload-btn').click(function(){
		$('.uploader').show(500);
	});
	
	$('.close-uploader').click(function(){
		$('.uploader').hide(500);
		window.location.href = $('#refresh').attr('href') + '&' + new Date().getTime();;
	});
	
	$('.preview').click(function(){
		var _this = $(this);
		
		$('#full-img').attr('src',_this.data('url'));
		if(!_this.hasClass('disabled'))
			show_animation();
		return true;
	});
	
	$('.rename-file').click(function(){
		var _this = $(this);
		
	    var file_container=_this.parent().parent().parent();
	    var file_title=file_container.find('h4');
	    var name=prompt(_this.attr('title'),$.trim(file_title.text()));
	    if(name!=null)
		execute_action('rename_file',_this.data('path'),_this.data('thumb'),name,file_container,'apply_file_rename');
	    return false;
	});
	
	$('.rename-folder').click(function(){
		var _this = $(this);
		
	    var file_container=_this.parent().parent().parent();
	    var file_title=file_container.find('h4');
	    var name=prompt(_this.attr('title'),$.trim(file_title.text()));
	    if(name!=null)
		execute_action('rename_folder',_this.data('path'),_this.data('thumb'),name,file_container,'apply_folder_rename');
	    return false;
	});
	
	$('.delete-file').click(function(){
		var _this = $(this);
		
	    if(confirm(_this.data('confirm'))){
			execute_action('delete_file',_this.data('path'),_this.data('thumb'),'');
			_this.parent().parent().parent().parent().remove();
	    }
	    return false;
	});
	
	$('.delete-folder').click(function(){
		var _this = $(this);
		
	    if(confirm(_this.data('confirm'))){
			execute_action('delete_folder',_this.data('path'),_this.data('thumb'),'');
			_this.parent().parent().parent().remove();
	    }
	    return false;
	});	

	$('.new-folder').click(function(){
		folder_name=window.prompt($('#insert_folder_name').val(),$('#new_folder').val());
		if(folder_name){
			folder_path=$('#root').val()+$('#cur_dir').val()+ folder_name;
			folder_path_thumb=$('#cur_dir_thumb').val()+ folder_name;
			$.ajax({
				  type: "POST",
				  url: "execute.php?action=create_folder",
				  data: {path: folder_path, path_thumb: folder_path_thumb}
				}).done(function( msg ) {
				window.location.href = $('#refresh').attr('href') + '&' + new Date().getTime();
			});
		}
	});
	
	$('.view-controller button').click(function(){
		var _this = $(this);
		
		$('.view-controller button').removeClass('btn-inverse');
		$('.view-controller i').removeClass('icon-white');
		_this.addClass('btn-inverse');
		_this.find('i').addClass('icon-white');
		
		 $.ajax({
		    url: "ajax_calls.php?action=view&type="+_this.data('value')
		}).done(function( msg ) {
		    if (msg!="") {
				alert(msg);
		    }   
		});
		
		if (_this.data('value')>=1){
		    $('ul.grid').addClass('list-view');
		    $('#view').val(_this.data('value'));
		    fix_colums();
		}
		else{
		    $('ul.grid').removeClass('list-view');
		    $('#view').val(0);
		    $('ul.grid li').css( "width",126);
		    $('ul.grid figure').css( "width",122);
		}
	    });
	
	if (!Modernizr.touch) {
	    $('.tip').tooltip({placement: "bottom"});
	    $('.tip-left').tooltip({placement: "left"});
	    $('.tip-right').tooltip({placement: "right"});
	}else{
	    
	    $('#help').show();
	    //Enable swiping...
	    $(".box:not(.no-effect)").swipe( {		    
		    //Generic swipe handler for all directions
		    swipeLeft:swipe_reaction,
		    swipeRight:swipe_reaction,
		    //Default is 75px, set to 0 for demo so any distance triggers swipe
	       threshold:30
	    });
	}
	
	if(!Modernizr.csstransitions) { // Test if CSS transitions are supported
            
		$('figure').bind('mouseover',function(){
			if ($('#view').val()==0) {
				$(this).find('.box').animate({top: "-30px"} ,{queue:false,duration:300});
			}
		});
		
		$('figure').mouseout(function(){
			if ($('#view').val()==0) {
				$(this).find('.box').animate({top: "0px"} ,{queue:false,duration:300});
			}
		});

	}
	
	$(window).resize(function(){fix_colums(); });
	fix_colums();
	
	$('.link').click(function(){
		var _this = $(this);
		
		window[_this.data('function')](_this.data('file'),_this.data('type'),_this.data('field_id'));
	});
	
	
});

function fix_colums() {
	
    var width=$('.ff-container').width()-2;
    $('.uploader').css('width',width-6);
    if($('#view').val()>=1){
	if ($('#view').val()==1) {
	    var col=1
	}else{
	    var col=Math.floor(width/380);
	    if (col==0){
		col=1;
		$('h4').css('font-size',12);
	    }
	}
	width=Math.floor((width/col)-3);
	$('ul.grid li, ul.grid figure').css( "width", width);
	$('#help').hide();
    }else{if(Modernizr.touch) {
	    $('#help').show();
    }}
}

function swipe_reaction(event, direction, distance, duration, fingerCount) {
	var _this = $(this);
	
    if ($('#view').val()==0) {
		
		if (_this.attr('toggle')==1) {
			_this.attr('toggle',0);
			_this.animate({top: "0px"} ,{queue:false,duration:300});
		}else{
			_this.attr('toggle',1);
			_this.animate({top: "-30px"} ,{queue:false,duration:300});
		}
		
    }
}

function apply(file){
    if ($('#popup').val()==1) var window_parent=window.opener; else var window_parent=window.parent;
    var path = $('#cur_dir').val();
    var base_url = $('#base_url').val();
    var track = $('#track').val();
    var target = window_parent.document.getElementById(track+'_ifr');
    var closed = window_parent.document.getElementsByClassName('mce-filemanager');
    var ext=file.split('.').pop();
    var fill='';
    if($.inArray(ext, ext_img) > -1){
    	
        fill=$("<img />",{"src":path+file});
    }else{
        fill=$("<a />").attr("href", path+file).text(file.replace(/\..+$/, ''));
    }
    $(target).contents().find('#tinymce').append(fill);
    $(closed).find('.mce-close').trigger('click');
}



function apply_link(file,type_file,external){
    if ($('#popup').val()==1) var window_parent=window.opener; else var window_parent=window.parent;
    var path = $('#cur_dir').val();
    var base_url = $('#base_url').val();
    var track = $('#track').val();
    
    if (external=="") {
		$('.mce-link_'+track, window_parent.document).val(base_url+path+file);
		var closed = window_parent.document.getElementsByClassName('mce-filemanager');
		if($('.mce-text_'+track, window_parent.document).val()=='') $('.mce-text_'+track, window_parent.document).val(file.replace(/\..+$/, ''));
		$(closed).find('.mce-close').trigger('click');
    }else{
		var target = window_parent.document.getElementById(external);
		$(target).val(base_url+path+file);
		if($('.mce-text_'+track, window_parent.document).val()=='') $('.mce-text_'+track, window_parent.document).val(file.replace(/\..+$/, ''));
		close_window();
    }
}

function apply_none(file,type_file,external){
    return false;
}

function getImgSize(imgSrc)
{
    var newImg = new Image();
    
    newImg.src = imgSrc;
    return new Array(newImg.height,newImg.width);

}

function apply_img(file,type_file,external){
    if ($('#popup').val()==1) var window_parent=window.opener; else var window_parent=window.parent;
    var path = $('#cur_dir').val();
    var base_url = $('#base_url').val();
    var track = $('#track').val();	
    if (external=="") {		
		var target = window_parent.document.getElementsByClassName('mce-img_'+track);
		var alt = window_parent.document.getElementsByClassName('mce-alt_img_'+track);
		
		var closed = window_parent.document.getElementsByClassName('mce-filemanager');
		$(target).val(base_url+path+file);
		$(alt).val(file.substr(0, file.lastIndexOf('.')));
		$.ajax({
		    url: "ajax_calls.php?action=image_size",
		    type: "POST",
		    data: {path: path+file}
		}).done(function( msg ) {
		    var info=JSON.parse(msg);
		    if (typeof info[0] != 'undefined') {
			var width = window_parent.document.getElementsByClassName('mce-width_img_'+track);
			var height = window_parent.document.getElementsByClassName('mce-height_img_'+track);
			$(width).val(info[0]);
			$(height).val(info[1]);
		    }
		    $(closed).find('.mce-close').trigger('click');	
		});
			
    }else{
		var target = window_parent.document.getElementById(external);
		$(target).val(base_url+path+file);
		close_window();
    }
}

function apply_video(file,type_file,external){
    if ($('#popup').val()==1) var window_parent=window.opener; else var window_parent=window.parent;
    var path = $('#cur_dir').val();
    var base_url = $('#base_url').val();
    var track = $('#track').val();
    
    if (external=="") {
		var target = window_parent.document.getElementsByClassName('mce-video'+ type_file +'_'+track);
		var closed = window_parent.document.getElementsByClassName('mce-filemanager');
		$(target).val(base_url+path+file);
		$(closed).find('.mce-close').trigger('click');
    }else{
		var target = window_parent.document.getElementById(external);
		$(target).val(base_url+path+file);
		close_window();
    }
}

function close_window() {
    if ($('#popup').val()==1) window.close();
    else
	parent.$.fancybox.close();
}


function apply_file_rename(container,name) {
    container.find('h4').find('a').text(name);
    var link=container.find('a.link');
    var file=link.data('file');
    var extension=file.substring(file.lastIndexOf('.') + 1);
    link.data('file',name+"."+extension);
    var link2=container.find('a.preview');
    var file= link2.data('url');
    var old=file.substring(file.lastIndexOf('/') + 1);
    link2.data('url',file.replace(old,name+"."+extension));
}

function apply_folder_rename(container,name) {
    var old_name=container.find('h4').find('a').text();
    container.find('h4').find('a').text(name);
    var link=container.find('.folder-link');
    var url=link.attr('href');
    link.attr('href',url.replace('fldr='+old_name,'fldr='+name));
}

function execute_action(action,file1,file2,name,container,function_name){
    $.ajax({
	type: "POST",
	url: "execute.php?action="+action,
	data: {path: file1, path_thumb: file2, name: name}
    }).done(function( msg ) {
	if (msg!="") {
	    alert(msg);
	    return false;
	}else{
	    window[function_name](container,name);
	}
	return true;
    });
}


function show_animation()
{
    $('#loading_container').css('display', 'block');
    $('#loading').css('opacity', '.7');
}

function hide_animation()
{
	$('#loading_container').fadeOut();
}

	
