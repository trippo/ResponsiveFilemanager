var version = "9.6.0";
var active_contextmenu = true;
if (loading_bar){   
	if (!(/MSIE (\d+\.\d+);/.test(navigator.userAgent))){ 
	    window.addEventListener('DOMContentLoaded', function() {
	        $("body").queryLoader2({ 'backgroundColor':'none','minimumTime':100,'percentage':true});
	    });
	}
	else {
	    $(document).ready(function () {
	        $("body").queryLoader2({ 'backgroundColor':'none','minimumTime':100,'percentage':true});
	    });
	}
}
$(document).ready(function(){
	// Right click menu
    if (active_contextmenu) {
	$.contextMenu({
	    selector:'figure:not(.back-directory), .list-view2 figure:not(.back-directory)',
	    autoHide:true,
	    build: function($trigger) {
		$trigger.addClass('selected');
		var options = {
		  callback: function(key, options) {
		    switch (key) {
			case "copy_url":
			    var m ="";
			    m+=$('#base_url').val()+$('#cur_dir').val();
			    add=$trigger.find('a.link').attr('data-file');
			    if (add!="" && add!=null) {
						m+=add;
			    }
			    add=$trigger.find('h4 a.folder-link').attr('data-file');
			    if (add!="" && add!=null) {
						m+=add;
			    }
			    bootbox.alert('URL:<br/><br/><input type="text" style="height:30px; width:100%;" value="'+encodeURL(m)+'" />'); 	
			    break;
			case "unzip":
			    var m=$('#sub_folder').val()+$('#fldr_value').val()+$trigger.find('a.link').attr('data-file');
			    $.ajax({
				type: "POST",
				url: "ajax_calls.php?action=extract",
				data: { path: m }
			    }).done(function( msg ) {
				if (msg!="")
				    bootbox.alert(msg);
				else
				    window.location.href = $('#refresh').attr('href') + '&' + new Date().getTime();
			    });
			    break;
			case "edit_img":
			    var filename=$trigger.attr('data-name');
			    var full_path=$('#base_url_true').val()+$('#cur_dir').val()+filename;
			    $('#aviary_img').attr('data-name',filename);
			    $('#aviary_img').attr('src',full_path).load(launchEditor('aviary_img', full_path));
			    
			    break;
			case "duplicate":
			    var old_name=$trigger.find('h4').text().trim();
			    bootbox.prompt($('#lang_duplicate').val(),$('#cancel').val(),$('#ok').val(), function(name) {
				if (name !== null){
				    name=fix_filename(name);
				    if (name!=old_name) {
					var _this=$trigger.find('.rename-file');
					execute_action('duplicate_file',_this.attr('data-path'),_this.attr('data-thumb'),name,_this,'apply_file_duplicate');
				    }
				}
			    },old_name);

			    break;
			case "copy":
			    copy_cut_clicked($trigger, 'copy');
				break;
		    case "cut":
				copy_cut_clicked($trigger, 'cut');
				break;
		    case "paste":
		    	paste_to_this_dir();
			    break;
			case "chmod":
				chmod($trigger);
				break;
			case "edit_text_file":
				edit_text_file($trigger);
				break;
		  }},
		  items: {}
		};
		// tooltip options
		// edit image/show url
		if (($trigger.find('.img-precontainer-mini .filetype').hasClass('png') ||
		    $trigger.find('.img-precontainer-mini .filetype').hasClass('jpg') ||
		    $trigger.find('.img-precontainer-mini .filetype').hasClass('jpeg')) && image_editor )
		{
		    options.items.edit_img = {name: $('#lang_edit_image').val(),icon:"edit_img", disabled:false };
		}
		options.items.copy_url = {name: $('#lang_show_url').val(),icon:"url", disabled:false };
		// extract
		if ($trigger.find('.img-precontainer-mini .filetype').hasClass('zip') ||
		    $trigger.find('.img-precontainer-mini .filetype').hasClass('tar') ||
		    $trigger.find('.img-precontainer-mini .filetype').hasClass('gz') ) 
		{
		    options.items.unzip = {name: $('#lang_extract').val(),icon:"extract", disabled:false };
		}

		// edit file's content
		if ($trigger.find('.img-precontainer-mini .filetype').hasClass('edit-text-file-allowed') ) 
		{
		    options.items.edit_text_file = {name: $('#lang_edit_file').val(),icon:"edit", disabled:false };
		}

		// duplicate
		if (!$trigger.hasClass('directory') && $('#duplicate').val()==1) 
		{
		    options.items.duplicate = {name: $('#lang_duplicate').val(),icon:"duplicate", disabled:false };
		}

		// copy & cut
		if (!$trigger.hasClass('directory') && $('#copy_cut_files_allowed').val()==1) {
		    options.items.copy = {name: $('#lang_copy').val(),icon:"copy", disabled:false };
		    options.items.cut = {name: $('#lang_cut').val(),icon:"cut", disabled:false };
		}
		else if ($trigger.hasClass('directory') && $('#copy_cut_dirs_allowed').val()==1) {
		    options.items.copy = {name: $('#lang_copy').val(),icon:"copy", disabled:false };
		    options.items.cut = {name: $('#lang_cut').val(),icon:"cut", disabled:false };
		}

		// paste
		// Its not added to folders because it might confuse someone
		if ($('#clipboard').val() != 0 && !$trigger.hasClass('directory')) {
		    options.items.paste = {name: $('#lang_paste_here').val(),icon:"clipboard-apply", disabled:false };
		}

		// file permission
		if (!$trigger.hasClass('directory') && $('#chmod_files_allowed').val()==1) {
		    options.items.chmod = {name: $('#lang_file_permission').val(),icon:"key", disabled:false };
		}
		else if ($trigger.hasClass('directory') && $('#chmod_dirs_allowed').val()==1) {
		    options.items.chmod = {name: $('#lang_file_permission').val(),icon:"key", disabled:false };
		}

		// fileinfo
		options.items.sep = '----';
		options.items.info = {name: "<strong>"+$('#lang_file_info').val()+"</strong>", disabled:true };
		options.items.name = {name: $trigger.attr('data-name'),icon:'label', disabled:true };
		if ($trigger.attr('data-type')=="img") {
		  options.items.dimension = {name: $trigger.find('.img-dimension').html(),icon:"dimension", disabled:true };
		}
		options.items.size = {name: $trigger.find('.file-size').html(),icon:"size", disabled:true };
		options.items.date = {name: $trigger.find('.file-date').html(),icon:"date", disabled:true };

	    
		return options;
	      },
	      events: {
		hide: function(opt){ 
		  $('figure').removeClass('selected');
		}
	    }
	});
	
	$(document).on('contextmenu', function(e) {
	    if (!$(e.target).is("figure"))
	       return false;
	});	
    }
    
    // preview image
    $('#full-img').on('click',function(){
	    $('#previewLightbox').lightbox('hide');
    });
    
    $('ul.grid').on('click','.modalAV', function(e) {
		_this=$(this);
        e.preventDefault();

        $('#previewAV').removeData("modal");
        $('#previewAV').modal({
            backdrop: 'static',
            keyboard: false
        });
		
		if (_this.hasClass('audio')) {
	    	$(".body-preview").css('height','80px');
		}else {
	    	$(".body-preview").css('height','345px');
		}
	
        $.ajax({
            url: _this.attr('data-url'),
            success: function(data) {
				$(".body-preview").html(data);
	    	}
        });
    });

    $('ul.grid').on('click','.file-preview-btn', function(e) {
		_this=$(this);
        e.preventDefault();
	
        $.ajax({
            url: _this.attr('data-url'),
            success: function(data) {
				bootbox.alert(data);
	    	}
        });
    });
    
    // sorting
    $('input[name=radio-sort]').on('click',function(){
        var li=$(this).attr('data-item');
		$('.filters label').removeClass("btn-inverse");
		$('.filters label').find('i').removeClass('icon-white');
		$('#filter-input').val('');
		$('#'+li).addClass("btn-inverse");
		$('#'+li).find('i').addClass('icon-white');

        if (li=='ff-item-type-all'){ 
	    	$('.grid li').show(300); 
		}
		else {
            if ($(this).is(':checked')){
                $('.grid li').not('.'+li).hide(300);
                $('.grid li.'+li).show(300);
            }
        }
    });
    
    var delay = (function(){
		var timer = 0;
		return function(callback, ms){
		    clearTimeout (timer);
		    timer = setTimeout(callback, ms);
		};
    })();
    
    if (parseInt($('#file_number').val()) > parseInt($('#file_number_limit_js').val())) var js_script=false;
    else var js_script=true;
	
    $('#filter-input').on('keyup',function(){
	$('.filters label').removeClass("btn-inverse");
	$('.filters label').find('i').removeClass('icon-white');
	$('#ff-item-type-all').addClass("btn-inverse");
	$('#ff-item-type-all').find('i').addClass('icon-white');
	var val=fix_filename($(this).val());
	$(this).val(val);
	delay(function(){
	    if (js_script) {
		$('ul.grid li').each(function(){
		    var _this = $(this);
		    if (val!="" && _this.attr('data-name').toString().toLowerCase().indexOf(val.toLowerCase())==-1) {
			_this.hide(100);
		    }else {
			_this.show(100);
		    }
		});		
	    }
	}, 300 );
    }).keypress(function(e) {
	if (e.which == 13) {
	    $('#filter').trigger('click');
	}
    });
    
    // filtering
    $('#filter').on('click',function(){
	var val=fix_filename($('#filter-input').val());
	window.location.href=$('#current_url').val()+"&filter="+val;
    });
    
    // info btn
    $('#info').on('click',function(){
	bootbox.alert('<center><img src="img/logo.png" alt="responsive filemanager"/><br/><br/><p><strong>RESPONSIVE filemanager v.'+version+'</strong><br/><a href="http://www.responsivefilemanager.com">responsivefilemanager.com</a></p><br/><p>Copyright © <a href="http://www.tecrail.com" alt="tecrail">Tecrail</a> - Alberto Peripolli. All rights reserved.</p><br/><p>License<br/><small><img alt="Creative Commons License" style="border-width:0" src="http://responsivefilemanager.com/license.php" /><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/3.0/">Creative Commons Attribution-NonCommercial 3.0 Unported License</a>.</small></p></center>');
	});

	$('#change_lang_btn').on('click',function(){
		change_lang();
	});
    
    // upload btn
    $('#uploader-btn').on('click',function(){
	    var path=$('#sub_folder').val()+$('#fldr_value').val()+"/";
	    path=path.substring(0, path.length - 1);
	    
	    $('#iframe-container').html($('<iframe />', {
		name: 'JUpload',
		id:   'uploader_frame',
		src: "uploader/index.php?path="+path,
		frameborder: 0,
		width: "100%",
		height: 360
	    }));
	});
    $('.upload-btn').on('click',function(){
	    $('.uploader').show(500);
    });
    
    var sortDescending=$('#descending').val()=== 'true';
    $('.sorter').on('click',function(){
	_this=$(this);

	if($('#sort_by').val() === _this.attr('data-sort')){
		sortDescending = !sortDescending;
	} else {
		sortDescending = true;
	}

	if (js_script) {
	    $.ajax({
		url: "ajax_calls.php?action=sort&sort_by="+_this.attr('data-sort')+"&descending="+sortDescending
	    }).done(function( msg ) {
		    
	    });
	    sortUnorderedList('ul.grid',sortDescending,"."+_this.attr('data-sort'));
	    $(' a.sorter').removeClass('descending').removeClass('ascending');
	    if (sortDescending)
		$('.sort-'+_this.attr('data-sort')).addClass("descending");
	    else
		$('.sort-'+_this.attr('data-sort')).addClass("ascending");

		$('#sort_by').val(_this.attr('data-sort'));
		$('#descending').val(sortDescending);
	}else {
	    window.location.href=$('#current_url').val()+"&sort_by="+_this.attr('data-sort')+"&descending="+sortDescending;
	}
    });
    
    $('.close-uploader').on('click',function(){
	    $('.uploader').hide(500);
	    setTimeout(function(){window.location.href = $('#refresh').attr('href') + '&' + new Date().getTime();},420);
    });
    
    $('ul.grid').on('click','.preview',function(){
	var _this = $(this);
	$('#full-img').attr('src',decodeURIComponent(_this.attr('data-url')));
	if (_this.hasClass('disabled')==false){
	    show_animation();
	}
	return true;
    });
    
    $('body').on('keypress',function(e){
	var c = String.fromCharCode(e.which);
	if (c=="'" || c=='"' || c=="\\" || c=='/') {
	    return false;
	}
    });
    
    $('ul.grid').on('click','.rename-file',function(){
	var _this = $(this);
	
	var file_container=_this.parent().parent().parent();
	var file_title=file_container.find('h4');
	var old_name=$.trim(file_title.text());
	bootbox.prompt($('#rename').val(),$('#cancel').val(),$('#ok').val(), function(name) {
	    if (name !== null){
		name=fix_filename(name);
		if (name!=old_name) {                                             
		    execute_action('rename_file',_this.attr('data-path'),_this.attr('data-thumb'),name,file_container,'apply_file_rename');
		}
	    }
	},old_name);
    });
    
    $('ul.grid').on('click','.rename-folder',function(){
	var _this = $(this);
	    
	var file_container=_this.parent().parent().parent();
	var file_title=file_container.find('h4');
	var old_name=$.trim(file_title.text());
	bootbox.prompt($('#rename').val(),$('#cancel').val(),$('#ok').val(), function(name) {
	    if (name !== null){
		name=fix_filename(name).replace('.','');
		if (name!=old_name) {                                             
		    execute_action('rename_folder',_this.attr('data-path'),_this.attr('data-thumb'),name,file_container,'apply_folder_rename');
		}
	    }
	},old_name);
    });
    
    $('ul.grid').on('click','.delete-file',function(){
	var _this = $(this);
	bootbox.confirm(_this.attr('data-confirm'),$('#cancel').val(),$('#ok').val(), function(result) {
	    if (result==true) {
		execute_action('delete_file',_this.attr('data-path'),_this.attr('data-thumb'),'','','');
		_this.parent().parent().parent().parent().remove();
	    }
	});
    });
    
    $('ul.grid').on('click','.delete-folder',function(){
	var _this = $(this);
	
	bootbox.confirm(_this.attr('data-confirm'),$('#cancel').val(),$('#ok').val(), function(result) {
	    if (result==true) {
		execute_action('delete_folder',_this.attr('data-path'),_this.attr('data-thumb'),'','','');
		_this.parent().parent().parent().remove();
	    }
	});
    });	

    $('.create-file-btn').on('click',function(){
    	create_text_file();
    });

    $('.new-folder').on('click',function(){
	bootbox.prompt($('#insert_folder_name').val(),$('#cancel').val(),$('#ok').val(), function(name) {
	    if (name !== null) {
		name=fix_filename(name).replace('.','');
		var folder_path=$('#sub_folder').val()+$('#fldr_value').val()+ name;
		var folder_path_thumb=$('#cur_dir_thumb').val()+ name;
		$.ajax({
			  type: "POST",
			  url: "execute.php?action=create_folder",
			  data: {path: folder_path, path_thumb: folder_path_thumb}
			}).done(function( msg ) {
				setTimeout(function(){window.location.href = $('#refresh').attr('href') + '&' + new Date().getTime();},300);
			
			});
	    }
	},$('#new_folder').val());
    });
    
    $('.view-controller button').on('click',function(){
	    var _this = $(this);
	    
	    $('.view-controller button').removeClass('btn-inverse');
	    $('.view-controller i').removeClass('icon-white');
	    _this.addClass('btn-inverse');
	    _this.find('i').addClass('icon-white');
	    
	     $.ajax({
		url: "ajax_calls.php?action=view&type="+_this.attr('data-value')
	    }).done(function( msg ) {
		if (msg!="") {
		    bootbox.alert(msg);
		}   
	    });
	    if (typeof  $('ul.grid')[0] !== "undefined" &&  $('ul.grid')[0])
		$('ul.grid')[0].className = $('ul.grid')[0].className.replace(/\blist-view.*?\b/g, '');
	    if (typeof $('.sorter-container')[0] !== "undefined" && $('.sorter-container')[0])
		$('.sorter-container')[0].className = $('.sorter-container')[0].className.replace(/\blist-view.*?\b/g, '');
	    
	    var value=_this.attr('data-value');
	    $('#view').val(value);
	    $('ul.grid').addClass('list-view'+value);
	    $('.sorter-container').addClass('list-view'+value);
	    if (_this.attr('data-value')>=1){
		fix_colums(14);
	    }
	    else {
		$('ul.grid li').css( "width",126);
		$('ul.grid figure').css( "width",122);
	    }
	});
	
	if (!Modernizr.touch) {
	    $('.tip').tooltip({placement: "bottom"});
	    $('.tip-top').tooltip({placement: "top"});
	    $('.tip-left').tooltip({placement: "left"});
	    $('.tip-right').tooltip({placement: "right"});
	    $('body').addClass('no-touch');
	}else {
	    
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

	$('.paste-here-btn').on('click',function(){
	    if ($(this).hasClass('disabled') == false){
	    	paste_to_this_dir();
	    }
    });

    $('.clear-clipboard-btn').on('click',function(){
    	if ($(this).hasClass('disabled') == false){
	    	clear_clipboard();
	    }
    });
	
	// reverted to jquery from Modernizr.csstransforms because drag&drop
	if(!Modernizr.csstransforms) { // Test if CSS transform are supported
		$('figure').on('mouseover',function(){
			if ($('#view').val()==0 && $('#main-item-container').hasClass('no-effect-slide') === false) {
				$(this).find('.box:not(.no-effect)').animate({top: "-26px"} ,{queue:false,duration:300});
			}
		});
		
		$('figure').on('mouseout', function(){
			if ($('#view').val()==0) {
				$(this).find('.box:not(.no-effect)').animate({top: "0px"} ,{queue:false,duration:300});
			}
		});
	}
	
	$(window).resize(function(){fix_colums(28); });
	fix_colums(14);
	
	$('ul.grid').on('click','.link',function(){
		var _this = $(this);
		
		window[_this.attr('data-function')](_this.attr('data-file'),_this.attr('data-field_id'));
	});
	
	if ($('#clipboard').val() == 1){
		toggle_clipboard(true);
	}
	else {
		toggle_clipboard(false);
	}

	// Drag & Drop
	$('li.dir, li.file').draggable({ 
		revert: true, 
		distance: 20,
		cursor: "move",

		helper: function(){
			//hack all the way through
			$(this).find('figure').find('.box').css("top", "0px");
			var ret=$(this).clone().css("z-index", 1000).find('.box').css("box-shadow", "none").css("-webkit-box-shadow", "none").parent().parent();
			$(this).addClass('selected');
			return ret;
		},

		start: function(){
			if ($('#view').val()==0) {
				$('#main-item-container').addClass('no-effect-slide');
			}
		},
		stop: function(){
			$(this).removeClass('selected');
			if ($('#view').val()==0) {
				$('#main-item-container').removeClass('no-effect-slide');
			}
		}
	});

	$('li.dir').droppable({
      accept: "ul.grid li",
      activeClass: "ui-state-highlight",  
  	hoverClass: "ui-state-highlight",
	drop: function(event, ui){
		drag_n_drop_paste(ui.draggable.find('figure'), $(this).find('figure'));
	}
	});

	// file permissions window
	$(document).on("keyup", '#chmod_form #chmod_value', function() 
	{
		chmod_logic(true);
	});
	//safety 
	$(document).on("focusout", '#chmod_form #chmod_value', function() 
	{
		var chmod_temp_val = $('#chmod_form #chmod_value').val();
		if (chmod_temp_val.match(/^[0-7]{3}$/) == null) 
		{
			var def_val = $('#chmod_form #chmod_value').attr('data-def-value'); 
			$('#chmod_form #chmod_value').val(def_val);
			chmod_logic(true);
		}
	});
});

function create_text_file() {
	// remove to prevent duplicates
	$('#textfile_create_area').parent().parent().remove();

	var init_form = $('#lang_filename').val() + ': <input type="text" id="create_text_file_name" style="min-height:30px"><br><hr><textarea id="textfile_create_area" style="width:100%;height:150px;"></textarea>';

	bootbox.dialog(init_form, 
	[
		{
			"label" : $('#cancel').val(),
			"class" : "btn"
		}, 
		{
			"label" : $('#ok').val(),
			"class" : "btn-inverse",
			"callback": function() {
				var newFileName = $('#create_text_file_name').val();
                var newContent = $('#textfile_create_area').val();

                if (newFileName !== null) 
                {
                	newFileName = fix_filename(newFileName);
                	var folder_path = $('#sub_folder').val()+$('#fldr_value').val()+ newFileName;
					var folder_path_thumb = $('#cur_dir_thumb').val()+ newFileName;
                	// post ajax
                	$.ajax({
					type: "POST",
					url: "execute.php?action=create_file",
					data: {path: folder_path, path_thumb: folder_path_thumb, name: newFileName, new_content: newContent}
					}).done(function( status_msg ) {
						if (status_msg!=""){
							bootbox.alert(status_msg, function (result) {
								setTimeout(function(){window.location.href = $('#refresh').attr('href') + '&' + new Date().getTime();},500);
							});
						}
					});
				}
            }
		}
	],
	{
		"header" :$('#lang_new_file').val()
	});
}

function edit_text_file($trigger) {
	// remove to prevent duplicates
	$('#textfile_edit_area').parent().parent().remove();
	
	var thumb_path = $trigger.find('.rename-file').attr('data-thumb');
	var full_path = $trigger.find('.rename-file').attr('data-path');

	$.ajax({
	type: "POST",
	url: "ajax_calls.php?action=get_file&sub_action=edit",
	data: {path: full_path}
    }).done(function( init_content ) 
    {
		bootbox.dialog(init_content, 
		[
			{
				"label" : $('#cancel').val(),
				"class" : "btn"
			}, 
			{
				"label" : $('#ok').val(),
				"class" : "btn-inverse",
				"callback": function() {
                    var newContent = $('#textfile_edit_area').val();
                	// post ajax
                	$.ajax({
					type: "POST",
					url: "execute.php?action=save_text_file",
					data: {path: full_path, path_thumb: thumb_path, new_content: newContent}
					}).done(function( status_msg ) {
						if (status_msg!=""){
							bootbox.alert(status_msg);
						}
					});
                }
			}
		],
		{
			"header" : $trigger.find('.name_download').val()
		});
    });
}

function change_lang() {
	$.ajax({
	type: "POST",
	url: "ajax_calls.php?action=get_lang",
	data: {}
    }).done(function( init_msg ) 
    {
		bootbox.dialog(init_msg, 
		[
			{
				"label" : $('#cancel').val(),
				"class" : "btn"
			}, 
			{
				"label" : $('#ok').val(),
				"class" : "btn-inverse",
				"callback": function() {
					// get new lang
                    var newLang = $('#new_lang_select option:selected').val();
                	// post ajax
                	$.ajax({
					type: "POST",
					url: "ajax_calls.php?action=change_lang",
					data: {choosen_lang: newLang}
					}).done(function( error_msg ) {
						if (error_msg!=""){
							bootbox.alert(error_msg);
						}
						else {
							setTimeout(function(){window.location.href = $('#refresh').attr('href') + '&' + new Date().getTime();},500);
						} 
					});
                }
			}
		],
		{
			"header" : $('#lang_lang_change').val()
		});
    });
}

function chmod($trigger) {
	// remove to prevent duplicates
	$('#files_permission_start').parent().parent().remove();

	if (!$trigger.hasClass('directory')){
    	var thumb_path = $trigger.find('.rename-file').attr('data-thumb');
    	var full_path = $trigger.find('.rename-file').attr('data-path');
    }
    else {
    	var thumb_path = $trigger.find('.rename-folder').attr('data-thumb');
    	var full_path = $trigger.find('.rename-folder').attr('data-path');
    }

    // ajax -> box -> ajax -> box -> mind blown
	$.ajax({
	type: "POST",
	url: "ajax_calls.php?action=chmod",
	data: { path: full_path, path_thumb: thumb_path }
    }).done(function( init_msg ) 
    {
		bootbox.dialog(init_msg, 
		[
			{
				"label" : $('#cancel').val(),
				"class" : "btn"
			}, 
			{
				"label" : $('#ok').val(),
				"class" : "btn-inverse",
				"callback": function() {
					// get new perm
                    var newPerm = $('#chmod_form #chmod_value').val();
                    if (newPerm != '' && typeof newPerm !== "undefined")
                    {
                    	// get recursive option if any
                    	var recOpt = $('#chmod_form input[name=apply_recursive]:checked').val();
                    	if (recOpt == '' || typeof recOpt === "undefined"){
                    		recOpt = 'none';
                    	}

                    	// post ajax
                    	$.ajax({
						type: "POST",
						url: "execute.php?action=chmod",
						data: {path: full_path, path_thumb: thumb_path, new_mode: newPerm, is_recursive: recOpt}
						}).done(function( status_msg ) {
							if (status_msg!=""){
								bootbox.alert(status_msg);
							}
						});
                    }
                }
			}
		],
		{
			"header" : $('#lang_file_permission').val()
		});
    });
}

function chmod_logic(is_text) {
	var perm = [];
	perm['user'] = 0;
	perm['group'] = 0;
	perm['all'] = 0;

	// value was set by text input
	if (typeof is_text !== "undefined" && is_text == true){
		// assign values
		var newperm = $('#chmod_form #chmod_value').val();
		perm['user'] = newperm.substr(0,1);
		perm['group'] = newperm.substr(1,1);
		perm['all'] = newperm.substr(2,1);
		
		// check values for errors (empty,not num, not 0-7)
		$.each(perm, function(index) {
			if ( perm[index] == '' || 
				$.isNumeric(perm[index]) == false || 
				(parseInt(perm[index]) < 0 || parseInt(perm[index]) > 7) ) 
			{
				perm[index] = "0";
			}
		});

		// update checkboxes
		$('#chmod_form input:checkbox').each(function() {
			var group = $(this).attr('data-group');
			var val = $(this).attr('data-value');

			if (chmod_logic_helper(perm[group], val)){
				$(this).prop('checked', true);
			}
			else {
				$(this).prop('checked', false);
			}
		});

	}
	else { //a checkbox was updated
		$('#chmod_form input:checkbox:checked').each(function() {
			var group = $(this).attr('data-group');
			var val = $(this).attr('data-value');
			perm[group] = parseInt(perm[group]) + parseInt(val);
		});

		$('#chmod_form #chmod_value').val(perm['user'].toString() + perm['group'].toString() + perm['all'].toString());
	}
}

function chmod_logic_helper(perm, val){
	var valid = [];
	valid[1] = [1,3,5,7];
	valid[2] = [2,3,6,7];
	valid[4] = [4,5,6,7];

	perm = parseInt(perm);
	val = parseInt(val);

	if ($.inArray(perm, valid[val]) != -1){
		return true;
	}
	else {
		return false;
	}
}

function clear_clipboard() {
	bootbox.confirm($('#lang_clear_clipboard_confirm').val(),$('#cancel').val(),$('#ok').val(), function(result) {
		if (result == true){
			$.ajax({
			type: "POST",
			url: "ajax_calls.php?action=clear_clipboard",
			data: {}
			}).done(function( msg ) {
			if (msg!="")
			    bootbox.alert(msg);
			else
			   $('#clipboard').val('0');
				toggle_clipboard(false);
			});
		}
	});
}

function copy_cut_clicked($trigger, atype) {
	if (atype != 'copy' && atype != 'cut'){
		return;
	}

	if (!$trigger.hasClass('directory')){
    	var thumb_path = $trigger.find('.rename-file').attr('data-thumb');
    	var full_path = $trigger.find('.rename-file').attr('data-path');
    }
    else {
    	var thumb_path = $trigger.find('.rename-folder').attr('data-thumb');
    	var full_path = $trigger.find('.rename-folder').attr('data-path');
    }

    $.ajax({
	type: "POST",
	url: "ajax_calls.php?action=copy_cut",
	data: { path: full_path, path_thumb: thumb_path, sub_action: atype }
    }).done(function( msg ) {
		if (msg!=""){
		    bootbox.alert(msg);
		}
		else {
		   $('#clipboard').val("1");
			toggle_clipboard(true);
		}
    });
}

function paste_to_this_dir(dnd) {
	bootbox.confirm($('#lang_paste_confirm').val(),$('#cancel').val(),$('#ok').val(), function(result) {
		if (result == true){
			if (typeof dnd != 'undefined'){
				var folder_path = dnd.find('.rename-folder').attr('data-path');
				var folder_path_thumb = dnd.find('.rename-folder').attr('data-thumb');
			}
			else {
				var folder_path = $('#sub_folder').val()+$('#fldr_value').val();
				var folder_path_thumb = $('#cur_dir_thumb').val();
			}

			$.ajax({
			type: "POST",
			url: "execute.php?action=paste_clipboard",
			data: {path: folder_path, path_thumb: folder_path_thumb}
			}).done(function( msg ) {
				if (msg!=""){
					bootbox.alert(msg);
				}
				else {
					$('#clipboard').val('0');
					toggle_clipboard(false);
					setTimeout(function(){window.location.href = $('#refresh').attr('href') + '&' + new Date().getTime();},300);
				}
			});
		}
	}); 
}

// Had to separate from copy_cut_clicked & paste_to_this_dir func
// because of feedback and on error bahhhhh...
function drag_n_drop_paste($trigger, dnd){
	if (!$trigger.hasClass('directory')){
    	var thumb_path = $trigger.find('.rename-file').attr('data-thumb');
    	var full_path = $trigger.find('.rename-file').attr('data-path');
    }
    else {
    	var thumb_path = $trigger.find('.rename-folder').attr('data-thumb');
    	var full_path = $trigger.find('.rename-folder').attr('data-path');
    }

    $.ajax({
	type: "POST",
	url: "ajax_calls.php?action=copy_cut",
	data: { path: full_path, path_thumb: thumb_path, sub_action: 'cut' }
    }).done(function( msg ) {
		if (msg!=""){
		    bootbox.alert(msg);
		}
		else {
		   if (typeof dnd != 'undefined'){
				var folder_path = dnd.find('.rename-folder').attr('data-path');
				var folder_path_thumb = dnd.find('.rename-folder').attr('data-thumb');
			}
			else {
				var folder_path = $('#sub_folder').val()+$('#fldr_value').val();
				var folder_path_thumb = $('#cur_dir_thumb').val();
			}

			$.ajax({
			type: "POST",
			url: "execute.php?action=paste_clipboard",
			data: {path: folder_path, path_thumb: folder_path_thumb}
			}).done(function( msg ) {
				if (msg!=""){
					bootbox.alert(msg);
				}
				else {
					$('#clipboard').val('0');
					toggle_clipboard(false);
					setTimeout(function(){window.location.href = $('#refresh').attr('href') + '&' + new Date().getTime();},300);
				}
			});
		}
    });
}

function toggle_clipboard(lever) {
	if (lever == true){
		$('.paste-here-btn, .clear-clipboard-btn').removeClass('disabled');
	}
	else {
		$('.paste-here-btn, .clear-clipboard-btn').addClass('disabled');
	}
}

function fix_colums(adding) {
	
    var width=$('.breadcrumb').width()+adding;
    $('.uploader').css('width',width);
    if ($('#view').val()>0){
	if ($('#view').val()==1) {
	    $('ul.grid li, ul.grid figure').css( "width", '100%');
	}else {
	    var col=Math.floor(width/380);
	    if (col==0){
		col=1;
		$('h4').css('font-size',12);
	    }
	    width=Math.floor((width/col)-3);
	    $('ul.grid li, ul.grid figure').css( "width", width);
	}
	$('#help').hide();
    }else {if (Modernizr.touch) {
	    $('#help').show();
    }}
}

function swipe_reaction(event, direction, distance, duration, fingerCount) {
	var _this = $(this);
	
    if ($('#view').val()==0) {
		if (_this.attr('toggle')==1) {
			_this.attr('toggle',0);
			_this.animate({top: "0px"} ,{queue:false,duration:300});
		}else {
			_this.attr('toggle',1);
			_this.animate({top: "-30px"} ,{queue:false,duration:300});
		}
		
    }
}

function encodeURL(url){
	var tmp=url.split('/');
	for(var i=3;i<tmp.length;i++){
		tmp[i]=encodeURIComponent(tmp[i]);
	}
	return tmp.join('/');
}

function apply(file,external){
  if ($('#popup').val()==1) var window_parent=window.opener; else var window_parent=window.parent;
  var path = $('#cur_dir').val();    
  //path = path.replace('\\', '/');
  var base_url = $('#base_url').val();
  var alt_name=file.substr(0, file.lastIndexOf('.'));
  var ext=file.split('.').pop();
  ext=ext.toLowerCase();
  var fill='';
  var ext_audio=new Array('ogg','mp3','wav');
  var ext_video=new Array('mp4','ogg','webm');
  var url= encodeURL(base_url+path+file);

  if (external!=""){
		if ($('#crossdomain').val()==1){
			window_parent.postMessage({
				sender: 'responsivefilemanager',
				url: url,
				field_id : external
			},
			'*'
			);
    } else {
			var target = $('#'+external, window_parent.document);
			target.val(url).trigger('change');
			close_window();
		}
  }else{
	  if ($.inArray(ext, ext_img) > -1){
	    fill='<img src="'+url+'" alt="'+alt_name+'" />';
	  }else {
			if ($.inArray(ext, ext_video) > -1){
			  fill='<video controls source src="'+url+'" type="video/'+ext+'">'+alt_name+'</video>';
			}else {
			  if ($.inArray(ext, ext_audio) > -1 ){
					if (ext=='mp3') { ext='mpeg'; }
					fill='<audio controls src="'+url+'" type="audio/'+ext+'">'+alt_name+'</audio>';
			  }else {
					fill='<a href="'+url+'" title="'+alt_name+'">'+alt_name+'</a>';
			  }
			}
		
	  }

		if ($('#crossdomain').val()==1){
			window_parent.postMessage({
					sender: 'responsivefilemanager',
					url: url,
					field_id : null,
					html: fill
				},
				'*'
			);

		} else {
			// tinymce 3.X
			if ( parent.tinymce.majorVersion < 4 )
			{
				parent.tinymce.activeEditor.execCommand('mceInsertContent', false, fill); 
				parent.tinymce.activeEditor.windowManager.close( parent.tinymce.activeEditor.windowManager.params.mce_window_id );
			}
			// tinymce 4.X
			else 
			{
				parent.tinymce.activeEditor.insertContent(fill);
				parent.tinymce.activeEditor.windowManager.close();
			}
		}
	}
}



function apply_link(file,external){
  if ($('#popup').val()==1) var window_parent=window.opener; else var window_parent=window.parent;
  var path = $('#cur_dir').val();
  path = path.replace('\\', '/');
  var base_url = $('#base_url').val();
  var url= encodeURL(base_url+path+file);

	if (external!=""){    	
		if ($('#crossdomain').val()==1){
			window_parent.postMessage({
					sender: 'responsivefilemanager',
					url: url,
					field_id : external
				},
				'*'
			);
	  } else {
			var target = $('#'+external, window_parent.document);
			target.val(url).trigger('change');
			close_window();
		}
	}else{
		apply_any(url);
	}
}

function apply_img(file,external){
  if ($('#popup').val()==1) var window_parent=window.opener; else var window_parent=window.parent;
  var path = $('#cur_dir').val();
  path = path.replace('\\', '/');
  var base_url = $('#base_url').val();
  var url= encodeURL(base_url+path+file);

  if (external!=""){
		if ($('#crossdomain').val()==1){
			window_parent.postMessage({
					sender: 'responsivefilemanager',
					url: url,
					field_id : external
				},
				'*'
			);
      } else {
			var target = $('#'+external, window_parent.document);
			target.val(url).trigger('change');
			close_window();
		}
  }else{
    apply_any(url);
  }
}

function apply_video(file,external){
  if ($('#popup').val()==1) var window_parent=window.opener; else var window_parent=window.parent;
  var path = $('#cur_dir').val();
  path = path.replace('\\', '/');
  var base_url = $('#base_url').val();
  var url= encodeURL(base_url+path+file);

  if (external!=""){
		if ($('#crossdomain').val()==1){
			window_parent.postMessage({
					sender: 'responsivefilemanager',
					url: url,
					field_id : external
				},
				'*'
			);
    } else {
			var target = $('#'+external, window_parent.document);
			target.val(url).trigger('change');
			close_window();
		}
  }else{
		apply_any(url);
	}
}

function apply_none(file,external){	
	var _this=$('li[data-name="'+file+'"]').find('.preview');
	
	if (_this.html()!="" && _this.html()!==undefined) {
	    
	  $('#full-img').attr('src',decodeURIComponent(_this.attr('data-url')));
	  if (_this.hasClass('disabled')==false){
			show_animation();
			$('#previewLightbox').lightbox();
	  }
	}else {
	  var _this=$('li[data-name="'+file+'"]').find('.modalAV');

	  $('#previewAV').removeData("modal");
	  $('#previewAV').modal({
			backdrop: 'static',
			keyboard: false
	  });
	  if (_this.hasClass('audio')) {
			$(".body-preview").css('height','80px');
	  }else {
			$(".body-preview").css('height','345px');
	  }
	    
	  $.ajax({
			url: decodeURIComponent(_this.attr('data-url')),
			success: function(data) {
		  	$(".body-preview").html(data);
			}
	  });
	}
	return;
}

function apply_any(url) {
	if ($('#crossdomain').val()==1){
		window.parent.postMessage({
				sender: 'responsivefilemanager',
				url: url,
				field_id : null
			},
			'*'
		);

	} else {
		// tinymce 3.X
		if ( parent.tinymce.majorVersion < 4 )
		{
			parent.tinymce.activeEditor.windowManager.params.setUrl(url);
			parent.tinymce.activeEditor.windowManager.close( parent.tinymce.activeEditor.windowManager.params.mce_window_id );
		}
		// tinymce 4.X
		else
		{
			parent.tinymce.activeEditor.windowManager.getParams().setUrl(url);
			parent.tinymce.activeEditor.windowManager.close();
		}
	}

	return false;	
}

function close_window() {
	if ($('#popup').val()==1){
		window.close();
	}else{
		if(typeof parent.jQuery !== "undefined" && parent.jQuery) {
		  parent.jQuery.fancybox.close();   
		}else{
		  parent.$.fancybox.close();
		}
	}
}

function apply_file_duplicate(container,name){
    var li_container=container.parent().parent().parent().parent();

    li_container.after("<li class='"+li_container.attr('class')+"' data-name='"+li_container.attr('data-name')+"'>"+li_container.html()+"</li>");
    var cont=li_container.next();
    apply_file_rename(cont.find('figure'),name);
    var form=cont.find('.download-form');
    var new_form_id='form'+new Date().getTime();
    form.attr('id',new_form_id);
    form.find('.tip-right').attr('onclick',"$('#"+new_form_id+"').submit();");
}

function apply_file_rename(container,name) {
    container.attr('data-name',name);
    container.parent().attr('data-name',name);
    container.find('h4').find('a').text(name);
    //select link
    var link=container.find('a.link');
    var file=link.attr('data-file');
    var old_name=file.substring(file.lastIndexOf('/') + 1);
    var extension=file.substring(file.lastIndexOf('.') + 1);
    link.each(function(){
	$(this).attr('data-file',encodeURIComponent(name+"."+extension));
	});
    
    //thumbnails
    container.find('img').each(function(){
		var src =$(this).attr('src');
		$(this).attr('src',src.replace(old_name,name+"."+extension)+'?time=' + new Date().getTime());
		$(this).attr('alt',name+" thumbnails");
    });
    
    //preview link
    var link2=container.find('a.preview');
    var file= link2.attr('data-url');
    if (typeof file !=="undefined" && file) {
	link2.attr('data-url',file.replace(encodeURIComponent(old_name),encodeURIComponent(name+"."+extension)));
    }
    
    //li data-name
    container.parent().attr('data-name',name+"."+extension);
    container.attr('data-name',name+"."+extension);
    
    //download link
    container.find('.name_download').val(name+"."+extension);
    
    //rename link && delete link
    var link3=container.find('a.rename-file');
    var link4=container.find('a.delete-file');
    var path_old=link3.attr('data-path');
    var path_thumb=link3.attr('data-thumb');
    var new_path=path_old.replace(old_name,name+"."+extension);
    var new_thumb=path_thumb.replace(old_name,name+"."+extension);
    link3.attr('data-path',new_path);
    link3.attr('data-thumb',new_thumb);
    link4.attr('data-path',new_path);
    link4.attr('data-thumb',new_thumb);
}

function apply_folder_rename(container,name) {
    
    container.attr('data-name',name);
    container.find('figure').attr('data-name',name);
    
    var old_name=container.find('h4').find('a').text();
    container.find('h4 > a').text(name);
    
    //select link
    var link=container.find('.folder-link');
    var url=link.attr('href');
    var fldr=$('#fldr_value').val();
    var new_url=url.replace('fldr='+fldr+encodeURIComponent(old_name),'fldr='+fldr+encodeURIComponent(name));
    link.each(function(){
	$(this).attr('href',new_url);
    });
    
    //rename link && delete link
    var link2=container.find('a.delete-folder');
    var link3=container.find('a.rename-folder');
    var path_old=link3.attr('data-path');
    var thumb_old=link3.attr('data-thumb');
    var index = path_old.lastIndexOf('/');
    var new_path = path_old.substr(0, index + 1)+name;
    link2.attr('data-path',new_path);
    link3.attr('data-path',new_path);
    var index = thumb_old.lastIndexOf('/');
    var new_path = thumb_old.substr(0, index + 1)+name;
    link2.attr('data-thumb',new_path);
    link3.attr('data-thumb',new_path);
    
}

function replace_last(str,find,replace) {
	var re= new RegExp(find+"$");
	return str.replace(re, replace);
}

function replaceDiacritics(s)
{
    var s;

    var diacritics =[
        /[\300-\306]/g, /[\340-\346]/g,  // A, a
        /[\310-\313]/g, /[\350-\353]/g,  // E, e
        /[\314-\317]/g, /[\354-\357]/g,  // I, i
        /[\322-\330]/g, /[\362-\370]/g,  // O, o
        /[\331-\334]/g, /[\371-\374]/g,  // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g // C, c
    ];

    var chars = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];

    for (var i = 0; i < diacritics.length; i++)
    {
        s = s.replace(diacritics[i],chars[i]);
    }

    return s;
}

function fix_filename(stri) {
  if (stri!=null) {
		if ($('#transliteration').val()=="true") {
		    stri=replaceDiacritics(stri);
		    stri=stri.replace(/[^A-Za-z0-9\.\-\[\]\ \_]+/g, '');
		}
		if ($('#convert_spaces').val()=="true") {
	      stri=stri.replace(' ','_');
	  }
		stri=stri.replace('"','');
		stri=stri.replace("'",'');
		stri=stri.replace("/",'');
		stri=stri.replace("\\",'');
		stri=stri.replace(/<\/?[^>]+(>|$)/g, "");
		return $.trim(stri);
  }
  return null;
}

function execute_action(action,file1,file2,name,container,function_name){
    if (name!==null) {
	name=fix_filename(name);
	$.ajax({
	    type: "POST",
	    url: "execute.php?action="+action,
	    data: {path: file1, path_thumb: file2, name: name.replace('/','')}
	}).done(function( msg ) {
	    if (msg!="") {
		bootbox.alert(msg);
		return false;
	    }else {
		if (function_name!="") {
		    window[function_name](container,name);
		}
	    }
	    return true;
	});
    }
}


function sortUnorderedList(ul, sortDescending,sort_field) {
    if (typeof ul == "string")
      ul = $(ul);
    var lis_dir = ul.find("li.dir");
    var lis_file = ul.find("li.file");
    var vals_dir = [];
    var values_dir = [];
    var vals_file = [];
    var values_file = [];
    
    $.each(lis_dir,function(index){
	var _this=$(this);
	var value=_this.find(sort_field).val();
	if ($.isNumeric(value)) {
	    value=parseFloat(value);
	    while (typeof vals_dir[value] !== "undefined" &&  vals_dir[value] ) {
		value=parseFloat(parseFloat(value)+parseFloat(0.001));
	    }
	}else {
	    value=value+"a"+_this.find('h4 a').attr('data-file');
	}
	vals_dir[value]=_this.html();
	values_dir.push(value);
	});
    
    $.each(lis_file,function(index){
	var _this=$(this);
	var value=_this.find(sort_field).val();
	if ($.isNumeric(value)) {
	    value=parseFloat(value);
	    while (typeof vals_file[value] !== "undefined" &&  vals_file[value] ) {
		value=parseFloat(parseFloat(value)+parseFloat(0.001));
	    }
	}else {
	    value=value+"a"+_this.find('h4 a').attr('data-file');
	}
	vals_file[value]=_this.html();
	values_file.push(value);
	});
    
    if ($.isNumeric(values_dir[0])) {
	values_dir.sort(function(a,b){return parseFloat(a)-parseFloat(b);});
    }else {
	values_dir.sort();
    }
    
    if ($.isNumeric(values_file[0])) {
	values_file.sort(function(a,b){return  parseFloat(a)-parseFloat(b); });
    }else {
	values_file.sort();
    }
    
    if (sortDescending){
	values_dir.reverse();
	values_file.reverse();
    }
    
    $.each(lis_dir,function(index){
	var _this=$(this);
	_this.html(vals_dir[values_dir[index]]);
    });
    
    $.each(lis_file,function(index){
	var _this=$(this);
	_this.html(vals_file[values_file[index]]);
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
   
function launchEditor(id, src) {
    featherEditor.launch({
	image: id,
	url: src
    });
   return false;
}
