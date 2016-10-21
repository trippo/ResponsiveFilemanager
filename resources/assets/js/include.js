var encodeURL,show_animation,hide_animation,apply,apply_none,apply_img,apply_any,apply_video,apply_link,apply_file_rename,apply_file_duplicate,apply_folder_rename;
(function ($, Modernizr, image_editor)
{
	"use strict";

	var version = "9.11.0";
	var active_contextmenu = true;
	var copy_count = 0;

	var delay = (function ()
	{
		var timer = 0;
		return function (callback, ms)
		{
			clearTimeout(timer);
			timer = setTimeout(callback, ms);
		};
	})();

	var getLink = function($trigger)
	{

		if($('#ftp').val()==true){
			var m = $('#ftp_base_url').val() + $('#upload_dir').val() + $('#fldr_value').val();

		}else{
			var m = $('#base_url').val() + $('#cur_dir').val();
		}
		var add = $trigger.find('a.link').attr('data-file');
		if (add != "" && add != null)
		{
			m += add;
		}

		add = $trigger.find('h4 a.folder-link').attr('data-file');

		if (add != "" && add != null)
		{
			m += add;
		}
		return m;
	}

	var FileManager = {

		contextActions: {

			copy_url : function($trigger)
			{
				var m = getLink($trigger);

				bootbox.alert(
					'URL:<br/>' +
					'<div class="input-append" style="width:100%">' +
					'<input id="url_text' + copy_count + '" type="text" style="width:80%; height:30px;" value="' + encodeURL(m) + '" />' +
					'<button id="copy-button' + copy_count + '" class="btn btn-inverse copy-button" style="width:20%; height:30px;" data-clipboard-target="url_text' + copy_count + '" data-clipboard-text="Copy Me!" title="copy">' +
					'</button>' +
					'</div>'
				);

				$('#copy-button' + copy_count).html('<i class="icon icon-white icon-share"></i> ' + $('#lang_copy').val());

				var client = new ZeroClipboard($('#copy-button' + copy_count));

				client.on("ready", function (readyEvent)
				{

					client.on("wrongFlash noFlash", function ()
					{
						ZeroClipboard.destroy();
					});

					client.on("aftercopy", function (event)
					{
						$('#copy-button' + copy_count).html('<i class="icon icon-ok"></i> ' + $('#ok').val());
						$('#copy-button' + copy_count).attr('class', 'btn disabled');
						copy_count++;
					});

					client.on('error', function (event) {});

				});
			},

			unzip: function($trigger)
			{
				var m = $('#sub_folder').val() + $('#fldr_value').val() + $trigger.find('a.link').attr('data-file');
				show_animation();
				$.ajax({
					type: "POST",
					url: "ajax_calls.php?action=extract",
					data: {
						path: m
					}
				}).done(function (msg)
				{
					hide_animation();
					if (msg != "")
					{
						bootbox.alert(msg);
					}
					else
					{
						window.location.href = $('#refresh').attr('href') + '&' + new Date().getTime();
					}
				});
			},

			edit_img: function($trigger)
			{
				var filename = $trigger.attr('data-name');
				if($('#ftp').val()==true){
					var full_path = $('#ftp_base_url').val() + $('#upload_dir').val() + $('#fldr_value').val() + filename;
				}else{
					var full_path = $('#base_url').val() + $('#cur_dir').val() + filename;
				}

				var aviaryElement = $('#aviary_img');
				aviaryElement.attr('data-name', filename);
				show_animation();
				aviaryElement.attr('src', full_path).load(launchEditor(aviaryElement.attr('id'), full_path));
			},

			duplicate: function($trigger)
			{
				var old_name = $trigger.find('h4').text().trim();

				bootbox.prompt($('#lang_duplicate').val(), $('#cancel').val(), $('#ok').val(), function (name)
				{
					if (name !== null)
					{
						name = fix_filename(name);
						if (name != old_name)
						{
							var _this = $trigger.find('.rename-file');
							execute_action('duplicate_file', _this.attr('data-path'), name, _this, 'apply_file_duplicate');
						}
					}
				}, old_name);
			},

			select: function($trigger)
			{
				var url = getLink($trigger);
				var external = $('#field_id').val();
				var windowParent;
				var is_return_relative_url = $('#return_relative_url').val();

				if(is_return_relative_url==1){
					url = url.replace($('#base_url').val(), '');
					url = url.replace($('#cur_dir').val(), '');
				}
				if ($('#popup').val() == 1)
				{
					windowParent = window.opener;
				}
				else
				{
					windowParent = window.parent;
				}
				if (external != "")
				{
					if ($('#crossdomain').val() == 1)
					{
						windowParent.postMessage({
								sender: 'responsivefilemanager',
								url: url,
								field_id: external
							},
							'*'
						);
					}
					else
					{
						var target = $('#' + external, windowParent.document);
						target.val(url).trigger('change');
						if (typeof windowParent.responsive_filemanager_callback == 'function')
						{
							windowParent.responsive_filemanager_callback(external);
						}
						close_window();
					}
				}
				else
				{
					apply_any(url);
				}
			
				
			},
			copy: function($trigger)
			{
				copy_cut_clicked($trigger, 'copy');
			},
			cut: function($trigger)
			{
				copy_cut_clicked($trigger, 'cut');
			},
			paste: function()
			{
				paste_to_this_dir();
			},
			chmod: function($trigger)
			{
				chmod($trigger);
			},
			edit_text_file: function($trigger)
			{
				edit_text_file($trigger);
			}

		},

		makeContextMenu: function()
		{
			var fm = this;

			$.contextMenu({
				selector: 'figure:not(.back-directory), .list-view2 figure:not(.back-directory)',
				autoHide: true,
				build: function ($trigger)
				{

					$trigger.addClass('selected');

					var options = {
						callback: function (key, options)
						{
							fm.contextActions[key]($trigger);
						},
						items: {}
					};
					// tooltip options
					// edit image/show url
					if (
						(
							$trigger.find('.img-precontainer-mini .filetype').hasClass('png')
							|| $trigger.find('.img-precontainer-mini .filetype').hasClass('jpg')
							|| $trigger.find('.img-precontainer-mini .filetype').hasClass('jpeg')
						) && image_editor)
					{
						options.items.edit_img = {
							name: $('#lang_edit_image').val(),
							icon: "edit_img",
							disabled: false
						};
					}
					// select folder
					if ($trigger.hasClass('directory') && $('#type_param').val()!=0)
					{
						options.items.select = {
							name: $('#lang_select').val(),
							icon: "",
							disabled: false
						};
					}

					options.items.copy_url = {
						name: $('#lang_show_url').val(),
						icon: "url",
						disabled: false
					};
					// extract
					if ($trigger.find('.img-precontainer-mini .filetype').hasClass('zip') ||
						$trigger.find('.img-precontainer-mini .filetype').hasClass('tar') ||
						$trigger.find('.img-precontainer-mini .filetype').hasClass('gz'))
					{
						options.items.unzip = {
							name: $('#lang_extract').val(),
							icon: "extract",
							disabled: false
						};
					}

					// edit file's content
					if ($trigger.find('.img-precontainer-mini .filetype').hasClass('edit-text-file-allowed'))
					{
						options.items.edit_text_file = {
							name: $('#lang_edit_file').val(),
							icon: "edit",
							disabled: false
						};
					}


					// duplicate
					if (!$trigger.hasClass('directory') && $('#duplicate').val() == 1)
					{
						options.items.duplicate = {
							name: $('#lang_duplicate').val(),
							icon: "duplicate",
							disabled: false
						};
					}

					// copy & cut
					if (!$trigger.hasClass('directory') && $('#copy_cut_files_allowed').val() == 1)
					{
						options.items.copy = {
							name: $('#lang_copy').val(),
							icon: "copy",
							disabled: false
						};
						options.items.cut = {
							name: $('#lang_cut').val(),
							icon: "cut",
							disabled: false
						};
					}
					else if ($trigger.hasClass('directory') && $('#copy_cut_dirs_allowed').val() == 1)
					{
						options.items.copy = {
							name: $('#lang_copy').val(),
							icon: "copy",
							disabled: false
						};
						options.items.cut = {
							name: $('#lang_cut').val(),
							icon: "cut",
							disabled: false
						};
					}

					// paste
					// Its not added to folders because it might confuse someone
					if ($('#clipboard').val() != 0 && !$trigger.hasClass('directory'))
					{
						options.items.paste = {
							name: $('#lang_paste_here').val(),
							icon: "clipboard-apply",
							disabled: false
						};
					}

					// file permission
					if (!$trigger.hasClass('directory') && $('#chmod_files_allowed').val() == 1)
					{
						options.items.chmod = {
							name: $('#lang_file_permission').val(),
							icon: "key",
							disabled: false
						};
					}
					else if ($trigger.hasClass('directory') && $('#chmod_dirs_allowed').val() == 1)
					{
						options.items.chmod = {
							name: $('#lang_file_permission').val(),
							icon: "key",
							disabled: false
						};
					}

					// fileinfo
					options.items.sep = '----';
					options.items.info = {
						name: "<strong>" + $('#lang_file_info').val() + "</strong>",
						disabled: true
					};
					options.items.name = {
						name: $trigger.attr('data-name'),
						icon: 'label',
						disabled: true
					};
					if ($trigger.attr('data-type') == "img")
					{
						options.items.dimension = {
							name: $trigger.find('.img-dimension').html(),
							icon: "dimension",
							disabled: true
						};
					}
					if(($('#show_folder_size').val()==='true' || $('#show_folder_size').val()==='true')){
						if ($trigger.hasClass('directory')){
							options.items.size = {
								name: $trigger.find('.file-size').html()+" - "+$trigger.find('.nfiles').val()+" "+$('#lang_files').val()+" - "+$trigger.find('.nfolders').val()+" "+$('#lang_folders').val(),
								icon: "size",
								disabled: true
							};
						}else{

							options.items.size = {
								name: $trigger.find('.file-size').html(),
								icon: "size",
								disabled: true
							};
						}
					}
					options.items.date = {
						name: $trigger.find('.file-date').html(),
						icon: "date",
						disabled: true
					};


					return options;
				},
				events: {
					hide: function ()
					{
						$('figure').removeClass('selected');
					}
				}
			});

			$(document).on('contextmenu', function (e)
			{
				if (!$(e.target).is("figure"))
				{
					return false;
				}
			});
		},

		bindGridEvents: function()
		{
			var grid = $('ul.grid');

			grid.on('click', '.modalAV', function (e)
			{
				var _this = $(this);
				e.preventDefault();

				var previewElement = $('#previewAV');
				var bodyPreviewElement = $(".body-preview");
				previewElement.removeData("modal");
				previewElement.modal({
					backdrop: 'static',
					keyboard: false
				});

				if (_this.hasClass('audio'))
				{
					bodyPreviewElement.css('height', '80px');
				}
				else
				{
					bodyPreviewElement.css('height', '345px');
				}

				$.ajax({
					url: _this.attr('data-url'),
					success: function (data)
					{
						bodyPreviewElement.html(data);
					}
				});
			});

			grid.on('click', '.file-preview-btn', function (e)
			{
				var _this = $(this);
				e.preventDefault();
				$.ajax({
					url: _this.attr('data-url'),
					success: function (data)
					{
						bootbox.modal(data, " "+_this.parent().parent().parent().find('.name').val());
					}
				});
			});

			grid.on('click', '.preview', function ()
			{
				var _this = $(this);
				if(_this.hasClass('disabled')==false)
				{
					$('#full-img').attr('src', decodeURIComponent(_this.attr('data-url')));
				}
				return true;
			});

			grid.on('click', '.rename-file', function ()
			{
				var _this = $(this);

				var file_container = _this.parent().parent().parent();
				var file_title = file_container.find('h4');
				var old_name = $.trim(file_title.text());
				bootbox.prompt($('#rename').val(), $('#cancel').val(), $('#ok').val(), function (name)
				{
					if (name !== null)
					{
						name = fix_filename(name);
						if (name != old_name)
						{
							execute_action('rename_file', _this.attr('data-path'), name, file_container, 'apply_file_rename');
						}
					}
				}, old_name);
			});

			grid.on('click', '.rename-folder', function ()
			{
				var _this = $(this);

				var file_container = _this.parent().parent().parent();
				var file_title = file_container.find('h4');
				var old_name = $.trim(file_title.text());
				bootbox.prompt($('#rename').val(), $('#cancel').val(), $('#ok').val(), function (name)
				{
					if (name !== null)
					{
						name = fix_filename(name).replace('.', '');
						if (name != old_name)
						{
							execute_action('rename_folder', _this.attr('data-path'), name, file_container, 'apply_folder_rename');
						}
					}
				}, old_name);
			});

			grid.on('click', '.delete-file', function ()
			{
				var _this = $(this);
				bootbox.confirm(_this.attr('data-confirm'), $('#cancel').val(), $('#ok').val(), function (result)
				{
					if (result == true)
					{
						execute_action('delete_file', _this.attr('data-path'), '', '', '');
						var fil = $('#files_number');
						fil.text(parseInt(fil.text())-1);
						_this.parent().parent().parent().parent().remove();
					}
				});
			});

			grid.on('click', '.delete-folder', function ()
			{
				var _this = $(this);

				bootbox.confirm(_this.attr('data-confirm'), $('#cancel').val(), $('#ok').val(), function (result)
				{
					if (result == true)
					{
						execute_action('delete_folder', _this.attr('data-path'), '', '', '');
						var fol = $('#folders_number');
						fol.text(parseInt(fol.text())-1);
						_this.parent().parent().parent().remove();
					}
				});
			});

			function handleFileLink($el)
			{
				window[ $el.attr('data-function') ]($el.attr('data-file'), $('#field_id').val());
			}

			$('ul.grid').on('click','.link',function ()
			{
				handleFileLink($(this));
			});

			$('ul.grid').on('click','div.box', function (e)
			{

				var fileLink = $(this).find(".link");
				if (fileLink.length !== 0)
				{
					handleFileLink(fileLink);
				}
				else
				{
					var folderLink = $(this).find(".folder-link");
					if (folderLink.length !== 0)
					{
						document.location = $(folderLink).prop("href");
					}
				}
			});
			// End of link handler
		},

		makeFilters: function(js_script)
		{
			$('#filter-input').on('keyup', function ()
			{
				$('.filters label').removeClass("btn-inverse");
				$('.filters label').find('i').removeClass('icon-white');
				$('#ff-item-type-all').addClass("btn-inverse");
				$('#ff-item-type-all').find('i').addClass('icon-white');
				var val = fix_filename($(this).val()).toLowerCase();
				$(this).val(val);
				if (js_script)
				{
					delay(function ()
					{
						$('li', 'ul.grid ').each(function ()
						{
							var _this = $(this);
							if (val != "" && _this.attr('data-name').toLowerCase().indexOf(val) == -1)
							{
								_this.hide(100);
							}
							else
							{
								_this.show(100);
							}
						});

						$.ajax({
							url: "ajax_calls.php?action=filter&type=" + val
						}).done(function (msg)
						{
							if (msg != "")
							{
								bootbox.alert(msg);
							}
						});
						delay(function ()
						{
							var sortDescending = $('#descending').val() != 0 ? true : false;
							sortUnorderedList(sortDescending, "." + $('#sort_by').val());

							lazyLoad();
						}, 500);

					}, 300);
				}
			}).keypress(function (e)
			{
				if (e.which == 13)
				{
					$('#filter').trigger('click');
				}
			});

			// filtering
			$('#filter').on('click', function ()
			{
				var val = fix_filename($('#filter-input').val());
				window.location.href = $('#current_url').val() + "&filter=" + val;
			});
		},

		makeUploader: function()
		{
			// upload btn
			$('#uploader-btn').on('click', function ()
			{
				var path = $('#sub_folder').val() + $('#fldr_value').val() + "/";
				path = path.substring(0, path.length - 1);

				$('#iframe-container').html($('<iframe />', {
					name: 'JUpload',
					id: 'uploader_frame',
					src: "uploader/index.php?path=" + path,
					frameborder: 0,
					width: "100%",
					height: 360
				}));
			});
			$('.upload-btn').on('click', function ()
			{
				$('.uploader').show(500);
			});

			$('.close-uploader').on('click', function ()
			{
				$('.uploader').hide(500);
				setTimeout(function ()
				{
					window.location.href = $('#refresh').attr('href') + '&' + new Date().getTime();
				}, 420);
			});
		},
		uploadURL: function()
		{
			$('#uploadURL').on('click',function(e){
				e.preventDefault();
				var url = $('#url').val();
				var path = $('#cur_path').val();
				var path_thumb = $('#cur_dir_thumb').val();
				show_animation();
				$.ajax({
					type: "POST",
					url: "upload.php",
					data: {
						path: path,
						path_thumb: path_thumb,
						url: url
					}
				}).done(function (msg)
				{
					if(msg!=""){
						alert($('#lang_error_upload').val());
					}
					hide_animation();
					$('#url').val('');
				}).fail(function(msg){
					alert($('#lang_error_upload').val());
					hide_animation();
					$('#url').val('');
				});
			})
		},

		makeSort: function(js_script)
		{
			// sorting
			$('input[name=radio-sort]').on('click', function ()
			{
				var li = $(this).attr('data-item');
				var liElement = $('#' + li);
				var labelElement = $('.filters label');

				labelElement.removeClass("btn-inverse");
				labelElement.find('i').removeClass('icon-white');

				$('#filter-input').val('');

				liElement.addClass("btn-inverse");
				liElement.find('i').addClass('icon-white');

				if (li == 'ff-item-type-all')
				{
					if (js_script)
					{
						$('.grid li').show(300);
					}
					else
					{
						window.location.href = $('#current_url').val() + "&sort_by=" + $('#sort_by').val() + "&descending=" + (sortDescending ? 1 : 0);
					}
					if(typeof(Storage) !== "undefined") {
						localStorage.setItem("sort", '');
					}
				}
				else
				{
					if ($(this).is(':checked'))
					{
						$('.grid li').not('.' + li).hide(300);
						$('.grid li.' + li).show(300);
						if(typeof(Storage) !== "undefined") {
							localStorage.setItem("sort", li);
						}
					}
				}

				lazyLoad();
			});
			var sortDescending = $('#descending').val();
			$('.sorter').on('click', function ()
			{
				var _this = $(this);
				if ($('#sort_by').val() === _this.attr('data-sort'))
				{
					sortDescending = sortDescending == 0 ? true : false
				}
				else
				{
					sortDescending = true;
				}

				if (js_script)
				{
					$.ajax({
						url: "ajax_calls.php?action=sort&sort_by=" + _this.attr('data-sort') + "&descending=" + (sortDescending ? 1 : 0)
					});
					sortUnorderedList(sortDescending, "." + _this.attr('data-sort'));
					$(' a.sorter').removeClass('descending').removeClass('ascending');
					if (sortDescending)
					{
						$('.sort-' + _this.attr('data-sort')).addClass("descending");
					}
					else
					{
						$('.sort-' + _this.attr('data-sort')).addClass("ascending");
					}

					$('#sort_by').val(_this.attr('data-sort'));
					$('#descending').val(sortDescending ? 1 : 0);
					lazyLoad();
				}
				else
				{
					window.location.href = $('#current_url').val() + "&sort_by=" + _this.attr('data-sort') + "&descending=" + (sortDescending ? 1 : 0);
				}
			});
		}

	}

	$(document).ready(function ()
	{

		$('#rfmDropzone').on('click','.dz-success .dz-detail',function(){
			var _this = $(this);
			alert(_this.find('.dz-filename span').tex());
		});

		// Right click menu
		if (active_contextmenu)
		{
			FileManager.makeContextMenu();
		}

		if(typeof(Storage) !== "undefined") {
			var li = localStorage.getItem("sort");
			if(li){
				var liElement = $('#'+li);
				liElement.addClass("btn-inverse");
				liElement.find('i').addClass('icon-white');
				$('.grid li').not('.' + li).hide(300);
				$('.grid li.' + li).show(300);
			}
		}

		// preview image
		$('#full-img').on('click', function ()
		{
			$('#previewLightbox').lightbox('hide');
		});

		$('body').on('click', function (){ 
			$('.tip-right').tooltip('hide'); 
		});

		FileManager.bindGridEvents();

		if (parseInt($('#file_number').val()) > parseInt($('#file_number_limit_js').val()))
		{
			var js_script = false;
		}
		else
		{
			var js_script = true;
		}

		FileManager.makeSort(js_script);
		FileManager.makeFilters(js_script);
		FileManager.uploadURL();

		// info btn
		$('#info').on('click', function ()
		{
			bootbox.alert('<div class="text-center"><br/><img src="img/logo.png" alt="responsive filemanager"/><br/><br/><p><strong>RESPONSIVE filemanager v.' + version + '</strong><br/><a href="http://www.responsivefilemanager.com">responsivefilemanager.com</a></p><br/><p>Copyright © <a href="http://www.tecrail.com" alt="tecrail">Tecrail</a> - Alberto Peripolli. All rights reserved.</p><br/><p>License<br/><small><img alt="Creative Commons License" style="border-width:0" src="http://responsivefilemanager.com/license.php" /><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/3.0/">Creative Commons Attribution-NonCommercial 3.0 Unported License</a>.</small></p></div>');
		});

		$('#change_lang_btn').on('click', function ()
		{
			change_lang();
		});

		FileManager.makeUploader();

		$('body').on('keypress', function (e)
		{
			var c = String.fromCharCode(e.which);
			if (c == "'" || c == '"' || c == "\\" || c == '/')
			{
				return false;
			}
		});

		$('ul.grid li figcaption').on('click','a[data-toggle="lightbox"]',function(){
			preview_loading_animation(decodeURIComponent($(this).attr('data-url')));
		})

		$('.create-file-btn').on('click', function ()
		{
			create_text_file();
		});

		$('.new-folder').on('click', function ()
		{
			bootbox.prompt($('#insert_folder_name').val(), $('#cancel').val(), $('#ok').val(), function (name)
			{
				if (name !== null)
				{
					name = fix_filename(name).replace('.', '');
					var folder_path = $('#sub_folder').val() + $('#fldr_value').val();
					$.ajax({
						type: "POST",
						url: "execute.php?action=create_folder",
						data: {
							path: folder_path,
							name: name
						}
					}).done(function (msg)
					{
						setTimeout(function ()
						{
							window.location.href = $('#refresh').attr('href') + '&' + new Date().getTime();
						}, 300);

					});
				}
			});
		});

		$('.view-controller button').on('click', function ()
		{
			var _this = $(this);

			$('.view-controller button').removeClass('btn-inverse');
			$('.view-controller i').removeClass('icon-white');
			_this.addClass('btn-inverse');
			_this.find('i').addClass('icon-white');

			$.ajax({
				url: "ajax_calls.php?action=view&type=" + _this.attr('data-value')
			}).done(function (msg)
			{
				if (msg != "")
				{
					bootbox.alert(msg);
				}
			});
			if (typeof  $('ul.grid')[ 0 ] !== "undefined" && $('ul.grid')[ 0 ])
			{
				$('ul.grid')[ 0 ].className = $('ul.grid')[ 0 ].className.replace(/\blist-view.*?\b/g, '');
			}
			if (typeof $('.sorter-container')[ 0 ] !== "undefined" && $('.sorter-container')[ 0 ])
			{
				$('.sorter-container')[ 0 ].className = $('.sorter-container')[ 0 ].className.replace(/\blist-view.*?\b/g, '');
			}

			var value = _this.attr('data-value');
			$('#view').val(value);
			$('ul.grid').addClass('list-view' + value);
			$('.sorter-container').addClass('list-view' + value);
			if (_this.attr('data-value') >= 1)
			{
				fix_colums(14);
			}
			else
			{
				$('ul.grid li').css("width", 126);
				$('ul.grid figure').css("width", 122);
			}
			lazyLoad();
		});

		if (!Modernizr.touch)
		{
			$('.tip').tooltip({ placement: "bottom" });
			$('.tip-top').tooltip({ placement: "top" });
			$('.tip-left').tooltip({ placement: "left" });
			$('.tip-right').tooltip({ placement: "right" });
			$('body').addClass('no-touch');
		}
		else
		{

			$('#help').show();

			//Enable swiping...
			$(".box:not(.no-effect)").swipe({
				//Generic swipe handler for all directions
				swipeLeft: swipe_reaction,
				swipeRight: swipe_reaction,
				//Default is 75px, set to 0 for demo so any distance triggers swipe
				threshold: 30
			});
		}

		$('.paste-here-btn').on('click', function ()
		{
			if ($(this).hasClass('disabled') == false)
			{
				paste_to_this_dir();
			}
		});

		$('.clear-clipboard-btn').on('click', function ()
		{
			if ($(this).hasClass('disabled') == false)
			{
				clear_clipboard();
			}
		});

		// reverted to jquery from Modernizr.csstransforms because drag&drop
		if (!Modernizr.csstransforms)
		{ // Test if CSS transform are supported
			var figures = $('figure');
			figures.on('mouseover', function ()
			{
				if ($('#view').val() == 0 && $('#main-item-container').hasClass('no-effect-slide') === false)
				{
					$(this).find('.box:not(.no-effect)').animate({ top: "-26px" }, {
						queue: false,
						duration: 300
					});
				}
			});

			figures.on('mouseout', function ()
			{
				if ($('#view').val() == 0)
				{
					$(this).find('.box:not(.no-effect)').animate({ top: "0px" }, {
						queue: false,
						duration: 300
					});
				}
			});
		}

		$(window).resize(function ()
		{
			fix_colums(28);
		});
		fix_colums(14);

		if ($('#clipboard').val() == 1)
		{
			toggle_clipboard(true);
		}
		else
		{
			toggle_clipboard(false);
		}

		// Drag & Drop
		$('li.dir, li.file').draggable({
			distance: 20,
			cursor: "move",

			helper: function ()
			{
				//hack all the way through
				$(this).find('figure').find('.box').css("top", "0px");
				var ret = $(this).clone().css("z-index", 1000).find('.box').css("box-shadow", "none").css("-webkit-box-shadow", "none").parent().parent();
				$(this).addClass('selected');
				return ret;
			},

			start: function (e,ui)
			{
				$(ui.helper).addClass("ui-draggable-helper");
				if ($('#view').val() == 0)
				{
					$('#main-item-container').addClass('no-effect-slide');
				}
			},
			stop: function ()
			{
				$(this).removeClass('selected');
				if ($('#view').val() == 0)
				{
					$('#main-item-container').removeClass('no-effect-slide');
				}
			}
		});

		$('li.dir,li.back').droppable({
			accept: "ul.grid li",
			activeClass: "ui-state-highlight",
			hoverClass: "ui-state-hover",
			drop: function (event, ui)
			{
				drag_n_drop_paste(ui.draggable.find('figure'), $(this).find('figure'));
			}
		});

		// file permissions window
		$(document).on("keyup", '#chmod_form #chmod_value', function ()
		{
			chmod_logic(true);
		});

		// file permissions window
		$(document).on("change", '#chmod_form input', function ()
		{
			chmod_logic(false);
		});

		//safety
		$(document).on("focusout", '#chmod_form #chmod_value', function ()
		{
			var chmodElement = $('#chmod_form #chmod_value');
			if (chmodElement.val().match(/^[0-7]{3}$/) == null)
			{
				chmodElement.val(chmodElement.attr('data-def-value'));
				chmod_logic(true);
			}
		});
	});

	function preview_loading_animation(url)
	{
		show_animation();
		var tmpImg = new Image();
		tmpImg.src=url;
		$(tmpImg).on('load',function(){
			hide_animation();
		});
	}

	function create_text_file()
	{
		// remove to prevent duplicates
		$('#textfile_create_area').parent().parent().remove();

		$.ajax({
			type: "GET",
			url: "ajax_calls.php?action=new_file_form"
		}).done(function (status_msg){
			bootbox.dialog(status_msg,
			[
				{
					"label": $('#cancel').val(),
					"class": "btn"
				},
				{
					"label": $('#ok').val(),
					"class": "btn-inverse",
					"callback": function ()
					{
						var newFileName = $('#create_text_file_name').val()+$('#create_text_file_extension').val();
						var newContent = $('#textfile_create_area').val();

						if (newFileName !== null)
						{
							newFileName = fix_filename(newFileName);
							var folder_path = $('#sub_folder').val() + $('#fldr_value').val();
							// post ajax
							$.ajax({
								type: "POST",
								url: "execute.php?action=create_file",
								data: {
									path: folder_path,
									name: newFileName,
									new_content: newContent
								}
							}).done(function (status_msg)
							{
								if (status_msg != "")
								{
									bootbox.alert(status_msg, function (/*result*/)
									{
										setTimeout(function ()
										{
											window.location.href = $('#refresh').attr('href') + '&' + new Date().getTime();
										}, 500);
									});
								}
							});
						}
					}
				}
			],
			{
				"header": $('#lang_new_file').val()
			});
		});
	}

	function edit_text_file($trigger)
	{
		// remove to prevent duplicates
		$('#textfile_edit_area').parent().parent().remove();

		var full_path = $trigger.find('.rename-file-paths').attr('data-path');

		$.ajax({
			type: "POST",
			url: "ajax_calls.php?action=get_file&sub_action=edit&preview_mode=text",
			data: { path: full_path }
		}).done(function (init_content)
		{
			bootbox.dialog(init_content,
				[
					{
						"label": $('#cancel').val(),
						"class": "btn"
					},
					{
						"label": $('#ok').val(),
						"class": "btn-inverse",
						"callback": function ()
						{
							var newContent = $('#textfile_edit_area').val();
							// post ajax
							$.ajax({
								type: "POST",
								url: "execute.php?action=save_text_file",
								data: {
									path: full_path,
									new_content: newContent
								}
							}).done(function (status_msg)
							{
								if (status_msg != "")
								{
									bootbox.alert(status_msg);
								}
							});
						}
					}
				],
				{
					"header": $trigger.find('.name_download').val()
				});
		});
	}

	function change_lang()
	{
		$.ajax({
			type: "POST",
			url: "ajax_calls.php?action=get_lang",
			data: {}
		}).done(function (init_msg)
		{
			bootbox.dialog(init_msg,
				[
					{
						"label": $('#cancel').val(),
						"class": "btn"
					},
					{
						"label": $('#ok').val(),
						"class": "btn-inverse",
						"callback": function ()
						{
							// get new lang
							var newLang = $('#new_lang_select').val();
							// post ajax
							$.ajax({
								type: "POST",
								url: "ajax_calls.php?action=change_lang",
								data: { choosen_lang: newLang }
							}).done(function (error_msg)
							{
								if (error_msg != "")
								{
									bootbox.alert(error_msg);
								}
								else
								{
									setTimeout(function ()
									{
										window.location.href = $('#refresh').attr('href').replace(/lang=[\w]*&/i, 'lang='+newLang+"&") + '&' + new Date().getTime();
									}, 100);
								}
							});
						}
					}
				],
				{
					"header": $('#lang_lang_change').val()
				});
		});
	}

	function chmod($trigger)
	{
		// remove to prevent duplicates
		$('#files_permission_start').parent().parent().remove();

		var obj = $trigger.find('.rename-file-paths');
		var full_path = obj.attr('data-path');
		var permissions = obj.attr('data-permissions');
		var folder = obj.attr('data-folder');

		// ajax -> box -> ajax -> box -> mind blown
		$.ajax({
			type: "POST",
			url: "ajax_calls.php?action=chmod",
			data: {
				path: full_path,
				permissions: permissions,
				folder: folder
			}
		}).done(function (init_msg)
		{
			bootbox.dialog(init_msg,
				[
					{
						"label": $('#cancel').val(),
						"class": "btn"
					},
					{
						"label": $('#ok').val(),
						"class": "btn-inverse",
						"callback": function ()
						{
							var info = "-";
							if($('#u_4').is(':checked')){
								info += "r";
							}else{
								info += "-";
							}
							if($('#u_2').is(':checked')){
								info += "w";
							}else{
								info += "-";
							}
							if($('#u_1').is(':checked')){
								info += "x";
							}else{
								info += "-";
							}
							if($('#g_4').is(':checked')){
								info += "r";
							}else{
								info += "-";
							}
							if($('#g_2').is(':checked')){
								info += "w";
							}else{
								info += "-";
							}
							if($('#g_1').is(':checked')){
								info += "x";
							}else{
								info += "-";
							}
							if($('#a_4').is(':checked')){
								info += "r";
							}else{
								info += "-";
							}
							if($('#a_2').is(':checked')){
								info += "w";
							}else{
								info += "-";
							}
							if($('#a_1').is(':checked')){
								info += "x";
							}else{
								info += "-";
							}

							// get new perm
							var newPerm = $('#chmod_form #chmod_value').val();
							if (newPerm != '' && typeof newPerm !== "undefined")
							{
								// get recursive option if any
								var recOpt = $('#chmod_form input[name=apply_recursive]:checked').val();
								if (recOpt == '' || typeof recOpt === "undefined")
								{
									recOpt = 'none';
								}

								// post ajax
								$.ajax({
									type: "POST",
									url: "execute.php?action=chmod",
									data: {
										path: full_path,
										new_mode: newPerm,
										is_recursive: recOpt,
										folder: folder
									}
								}).done(function (status_msg)
								{
									if (status_msg != "")
									{
										bootbox.alert(status_msg);
									}else{
										obj.attr('data-permissions',info);
									}
								});
							}
						}
					}
				],
				{
					"header": $('#lang_file_permission').val()
				}
			);
			setTimeout(function(){ chmod_logic(false); }, 100);
		});
	}

	function chmod_logic(is_text)
	{
		var perm = [];
		perm[ 'user' ] = 0;
		perm[ 'group' ] = 0;
		perm[ 'all' ] = 0;

		// value was set by text input
		if (typeof is_text !== "undefined" && is_text == true)
		{
			// assign values
			var newperm = $('#chmod_form #chmod_value').val();
			perm[ 'user' ] = newperm.substr(0, 1);
			perm[ 'group' ] = newperm.substr(1, 1);
			perm[ 'all' ] = newperm.substr(2, 1);

			// check values for errors (empty,not num, not 0-7)
			$.each(perm, function (index)
			{
				if (perm[ index ] == '' ||
					$.isNumeric(perm[ index ]) == false ||
					(parseInt(perm[ index ]) < 0 || parseInt(perm[ index ]) > 7))
				{
					perm[ index ] = "0";
				}
			});

			// update checkboxes
			$('#chmod_form input:checkbox').each(function ()
			{
				var group = $(this).attr('data-group');
				var val = $(this).attr('data-value');

				if (chmod_logic_helper(perm[ group ], val))
				{
					$(this).prop('checked', true);
				}
				else
				{
					$(this).prop('checked', false);
				}
			});

		}
		else
		{ //a checkbox was updated
			$('#chmod_form input:checkbox:checked').each(function ()
			{
				var group = $(this).attr('data-group');
				var val = $(this).attr('data-value');
				perm[ group ] = parseInt(perm[ group ]) + parseInt(val);
			});

			$('#chmod_form #chmod_value').val(perm[ 'user' ].toString() + perm[ 'group' ].toString() + perm[ 'all' ].toString());
		}
	}

	function chmod_logic_helper(perm, val)
	{
		var valid = [];
		valid[ 1 ] = [ 1, 3, 5, 7 ];
		valid[ 2 ] = [ 2, 3, 6, 7 ];
		valid[ 4 ] = [ 4, 5, 6, 7 ];

		perm = parseInt(perm);
		val = parseInt(val);

		return ($.inArray(perm, valid[ val ]) != -1);
	}

	function clear_clipboard()
	{
		bootbox.confirm($('#lang_clear_clipboard_confirm').val(), $('#cancel').val(), $('#ok').val(), function (result)
		{
			if (result == true)
			{
				$.ajax({
					type: "POST",
					url: "ajax_calls.php?action=clear_clipboard",
					data: {}
				}).done(function (msg)
				{
					if (msg != "")
					{
						bootbox.alert(msg);
					}
					else
					{
						$('#clipboard').val('0');
					}
					toggle_clipboard(false);
				});
			}
		});
	}

	function copy_cut_clicked($trigger, atype)
	{
		if (atype != 'copy' && atype != 'cut')
		{
			return;
		}

		var thumb_path, full_path;

		if (!$trigger.hasClass('directory'))
		{
			full_path = $trigger.find('.rename-file-paths').attr('data-path');
		}
		else
		{
			full_path = $trigger.find('.rename-file-paths').attr('data-path');
		}

		$.ajax({
			type: "POST",
			url: "ajax_calls.php?action=copy_cut",
			data: {
				path: full_path,
				sub_action: atype
			}
		}).done(function (msg)
		{
			if (msg != "")
			{
				bootbox.alert(msg);
			}
			else
			{
				$('#clipboard').val("1");
				toggle_clipboard(true);
			}
		});
	}

	function paste_to_this_dir(dnd)
	{
		bootbox.confirm($('#lang_paste_confirm').val(), $('#cancel').val(), $('#ok').val(), function (result)
		{
			if (result == true)
			{
				var folder_path;
				if (typeof dnd != 'undefined')
				{
					folder_path = dnd.find('.rename-folder').attr('data-path');
				}
				else
				{
					folder_path = $('#sub_folder').val() + $('#fldr_value').val();
				}

				$.ajax({
					type: "POST",
					url: "execute.php?action=paste_clipboard",
					data: {
						path: folder_path
					}
				}).done(function (msg)
				{
					if (msg != "")
					{
						bootbox.alert(msg);
					}
					else
					{
						$('#clipboard').val('0');
						toggle_clipboard(false);
						setTimeout(function ()
						{
							window.location.href = $('#refresh').attr('href') + '&' + new Date().getTime();
						}, 300);
					}
				});
			}
		});
	}

// Had to separate from copy_cut_clicked & paste_to_this_dir func
// because of feedback and on error bahhhhh...
	function drag_n_drop_paste($trigger, dnd)
	{
		var obj;

		if (!$trigger.hasClass('directory'))
		{
			obj = $trigger.find('.rename-file');
		}
		else
		{
			obj = $trigger.find('.rename-folder');
		}

		var full_path = obj.attr('data-path');

		$trigger.parent().hide(100);

		$.ajax({
			type: "POST",
			url: "ajax_calls.php?action=copy_cut",
			data: {
				path: full_path,
				sub_action: 'cut'
			}
		}).done(function (msg)
		{
			if (msg != "")
			{
				bootbox.alert(msg);
			}
			else
			{
				var folder_path;
				if (typeof dnd != 'undefined')
				{
					if (dnd.hasClass('back-directory'))
					{
						folder_path = dnd.find('.path').val();
					}
					else
					{
						folder_path = dnd.find('.rename-folder').attr('data-path');
					}
				}
				else
				{
					folder_path = $('#sub_folder').val() + $('#fldr_value').val();
				}

				$.ajax({
					type: "POST",
					url: "execute.php?action=paste_clipboard",
					data: {
						path: folder_path
					}
				}).done(function (msg)
				{
					if (msg != "")
					{
						bootbox.alert(msg);
						$trigger.parent().show(100);
					}
					else
					{
						$('#clipboard').val('0');
						toggle_clipboard(false);
						$trigger.parent().remove();
					}
				});
			}
		})
			.error(function (/*err*/)
			{
				$trigger.parent().show(100);
			});
	}

	function toggle_clipboard(lever)
	{
		if (lever == true)
		{
			$('.paste-here-btn, .clear-clipboard-btn').removeClass('disabled');
		}
		else
		{
			$('.paste-here-btn, .clear-clipboard-btn').addClass('disabled');
		}
	}

	function fix_colums(adding)
	{
		var width = $('.breadcrumb').width() + adding;

		var viewElement = $('#view');
		var helpElement = $('#help');

		$('.uploader').css('width', width);
		if (viewElement.val() > 0)
		{
			if (viewElement.val() == 1)
			{
				$('ul.grid li, ul.grid figure').css("width", '100%');
			}
			else
			{
				var col = Math.floor(width / 380);
				if (col == 0)
				{
					col = 1;
					$('h4').css('font-size', 12);
				}
				width = Math.floor((width / col) - 3);
				$('ul.grid li, ul.grid figure').css("width", width);
			}
			helpElement.hide();
		}
		else
		{
			if (Modernizr.touch)
			{
				helpElement.show();
			}
		}
	}

	function swipe_reaction(/*event, direction, distance, duration, fingerCount*/)
	{
		var _this = $(this);

		if ($('#view').val() == 0)
		{
			if (_this.attr('toggle') == 1)
			{
				_this.attr('toggle', 0);
				_this.animate({ top: "0px" }, {
					queue: false,
					duration: 300
				});
			}
			else
			{
				_this.attr('toggle', 1);
				_this.animate({ top: "-30px" }, {
					queue: false,
					duration: 300
				});
			}

		}
	}

	encodeURL = function(url)
	{
		var tmp = url.split('/');
		for (var i = 3; i < tmp.length; i++)
		{
			tmp[ i ] = encodeURIComponent(tmp[ i ]);
		}
		return tmp.join('/');
	}

	apply = function(file, external)
	{
		var windowParent;

		if ($('#popup').val() == 1)
		{
			windowParent = window.opener;
		}
		else
		{
			windowParent = window.parent;
		}
		var path = $('#cur_dir').val();
		var subdir = $('#subdir').val();
		var base_url = $('#base_url').val();
		var alt_name = file.substr(0, file.lastIndexOf('.'));
		var ext = file.split('.').pop();
		ext = ext.toLowerCase();
		var fill = '';
		var ext_audio = ['ogg', 'mp3', 'wav'];
		var ext_video = ['mp4', 'ogg', 'webm'];
		if($('#ftp').val()==true){
			var url = encodeURL($('#ftp_base_url').val() + $('#upload_dir').val() + $('#fldr_value').val() + file);
		}else{
			var is_return_relative_url = $('#return_relative_url').val();
			var url = encodeURL((is_return_relative_url == 1 ? subdir : base_url + path) + file);
		}

		if (external != "")
		{
			if ($('#crossdomain').val() == 1)
			{
				windowParent.postMessage({
						sender: 'responsivefilemanager',
						url: url,
						field_id: external
					},
					'*'
				);
			}
			else
			{
				var target = $('#' + external, windowParent.document);
				target.val(url).trigger('change');
				if (typeof windowParent.responsive_filemanager_callback == 'function')
				{
					windowParent.responsive_filemanager_callback(external);
				}
				close_window();
			}
		}
		else
		{

			if ($.inArray(ext, ext_img) > -1)
			{
				url = url + "?" + new Date().getTime();
				fill = '<img src="' + url + '" alt="' + alt_name + '" />';
			}
			else
			{
				if ($.inArray(ext, ext_video) > -1)
				{
					fill = '<video controls source src="' + url + '" type="video/' + ext + '">' + alt_name + '</video>';
				}
				else
				{
					if ($.inArray(ext, ext_audio) > -1)
					{
						if (ext == 'mp3')
						{
							ext = 'mpeg';
						}
						fill = '<audio controls src="' + url + '" type="audio/' + ext + '">' + alt_name + '</audio>';
					}
					else
					{
						fill = '<a href="' + url + '" title="' + alt_name + '">' + alt_name + '</a>';
					}
				}

			}

			if ($('#crossdomain').val() == 1)
			{
				windowParent.postMessage({
						sender: 'responsivefilemanager',
						url: url,
						field_id: null,
						html: fill
					},
					'*'
				);

			}
			else
			{
				// tinymce 3.X
				if (parent.tinymce.majorVersion < 4)
				{
					parent.tinymce.activeEditor.execCommand('mceInsertContent', false, fill);
					parent.tinymce.activeEditor.windowManager.close(parent.tinymce.activeEditor.windowManager.params.mce_window_id);
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


	apply_link = function(file, external)
	{
		if ($('#popup').val() == 1)
		{
			var windowParent = window.opener;
		}
		else
		{
			var windowParent = window.parent;
		}
		var path = $('#cur_dir').val();
		path = path.replace('\\', '/');
		var subdir = $('#subdir').val();
		subdir = subdir.replace('\\', '/');
		var base_url = $('#base_url').val();
		if($('#ftp').val()==true){
			var url = encodeURL($('#ftp_base_url').val() + $('#upload_dir').val() + $('#fldr_value').val() + file);
		}else{
			var is_return_relative_url = $('#return_relative_url').val();
			var url = encodeURL((is_return_relative_url == 1 ? subdir : base_url + path) + file);
		}

		if (external != "")
		{
			if ($('#crossdomain').val() == 1)
			{
				windowParent.postMessage({
						sender: 'responsivefilemanager',
						url: url,
						field_id: external
					},
					'*'
				);
			}
			else
			{
				var target = $('#' + external, windowParent.document);
				target.val(url).trigger('change');
				if (typeof windowParent.responsive_filemanager_callback == 'function')
				{
					windowParent.responsive_filemanager_callback(external);
				}
				close_window();
			}
		}
		else
		{
			apply_any(url);
		}
	}

	apply_img = function(file, external)
	{
		var windowParent;

		if ($('#popup').val() == 1)
		{
			windowParent = window.opener;
		}
		else
		{
			windowParent = window.parent;
		}
		var path = $('#cur_dir').val();
		path = path.replace('\\', '/');
		var subdir = $('#subdir').val();
		subdir = subdir.replace('\\', '/');
		var base_url = $('#base_url').val();
		if($('#ftp').val()==true){
			var url = encodeURL($('#ftp_base_url').val() + $('#upload_dir').val() + $('#fldr_value').val() + file);
		}else{
			var is_return_relative_url = $('#return_relative_url').val();
			var url = encodeURL((is_return_relative_url == 1 ? subdir : base_url + path) + file);
		}

		if (external != "")
		{
			if ($('#crossdomain').val() == 1)
			{
				windowParent.postMessage({
						sender: 'responsivefilemanager',
						url: url,
						field_id: external
					},
					'*'
				);
			}
			else
			{
				var target = $('#' + external, windowParent.document);
				target.val(url).trigger('change');
				if (typeof windowParent.responsive_filemanager_callback == 'function')
				{
					windowParent.responsive_filemanager_callback(external);
				}
				close_window();
			}
		}
		else
		{
			if($('#add_time_to_img').val()){
				url = url + "?" + new Date().getTime();
			}
			apply_any(url);
		}
	}

	apply_video = function(file, external)
	{
		var windowParent;
		if ($('#popup').val() == 1)
		{
			windowParent = window.opener;
		}
		else
		{
			windowParent = window.parent;
		}
		var path = $('#cur_dir').val();
		path = path.replace('\\', '/');
		var subdir = $('#subdir').val();
		subdir = subdir.replace('\\', '/');
		var base_url = $('#base_url').val();
		if($('#ftp').val()==true){
			var url = encodeURL($('#ftp_base_url').val() + $('#upload_dir').val() + $('#fldr_value').val() + file);
		}else{
			var is_return_relative_url = $('#return_relative_url').val();
			var url = encodeURL((is_return_relative_url == 1 ? subdir : base_url + path) + file);
		}

		if (external != "")
		{
			if ($('#crossdomain').val() == 1)
			{
				windowParent.postMessage({
						sender: 'responsivefilemanager',
						url: url,
						field_id: external
					},
					'*'
				);
			}
			else
			{
				var target = $('#' + external, windowParent.document);
				target.val(url).trigger('change');
				if (typeof windowParent.responsive_filemanager_callback == 'function')
				{
					windowParent.responsive_filemanager_callback(external);
				}
				close_window();
			}
		}
		else
		{
			apply_any(url);
		}
	}

	apply_none = function(file/*, external*/)
	{
		var _this = $('ul.grid').find('li[data-name="' + file + '"] figcaption a');
		_this[1].click();
		$('.tip-right').tooltip('hide');
	}

	function getUrlParam(paramName)
	{
		var reParam = new RegExp('(?:[\?&]|&)' + paramName + '=([^&]+)', 'i');
		var match = window.location.search.match(reParam);

		return ( match && match.length > 1 ) ? match[ 1 ] : null;
	}

	apply_any = function(url)
	{
		if ($('#crossdomain').val() == 1)
		{
			window.parent.postMessage({
					sender: 'responsivefilemanager',
					url: url,
					field_id: null
				},
				'*'
			);
		}
		else
		{
			var editor = $('#editor').val();
			if (editor == 'ckeditor')
			{
				var funcNum = getUrlParam('CKEditorFuncNum');
				window.opener.CKEDITOR.tools.callFunction(funcNum, url);
				window.close();
			}
			else
			{
				// tinymce 3.X
				if (parent.tinymce.majorVersion < 4)
				{
					parent.tinymce.activeEditor.windowManager.params.setUrl(url);
					parent.tinymce.activeEditor.windowManager.close(parent.tinymce.activeEditor.windowManager.params.mce_window_id);
				}
				// tinymce 4.X
				else
				{
					parent.tinymce.activeEditor.windowManager.getParams().setUrl(url);
					parent.tinymce.activeEditor.windowManager.close();
				}
			}
		}
	}

	function close_window()
	{
		if ($('#popup').val() == 1)
		{
			window.close();
		}
		else
		{
			if (typeof parent.$('.modal').modal == "function"){
				parent.$('.modal').modal('hide');
			}
			if (typeof parent.jQuery !== "undefined" && parent.jQuery)
			{
				if(typeof parent.jQuery.fancybox == 'function'){
					parent.jQuery.fancybox.close();
				}
			}
			else
			{
				if(typeof parent.$.fancybox == 'function'){
					parent.$.fancybox.close();
				}
			}
		}
	}

	apply_file_duplicate = function(container, name)
	{
		var li_container = container.parent().parent().parent().parent();

		li_container.after("<li class='" + li_container.attr('class') + "' data-name='" + li_container.attr('data-name') + "'>" + li_container.html() + "</li>");

		var cont = li_container.next();

		apply_file_rename(cont.find('figure'), name);

		var form = cont.find('.download-form');
		var new_form_id = 'form' + new Date().getTime();

		form.attr('id', new_form_id);
		form.find('.tip-right').attr('onclick', "$('#" + new_form_id + "').submit();");
	}

	apply_file_rename = function(container, name)
	{
		var file;

		container.attr('data-name', name);
		container.parent().attr('data-name', name);
		container.find('h4').text(name);

		//select link
		var link = container.find('a.link');

		file = link.attr('data-file');

		var old_name = file.substring(file.lastIndexOf('/') + 1);
		var extension = file.substring(file.lastIndexOf('.') + 1);

		link.each(function ()
		{
			$(this).attr('data-file', encodeURIComponent(name + "." + extension));
		});

		//thumbnails
		container.find('img').each(function ()
		{
			var src = $(this).attr('src');

			$(this).attr('src', src.replace(old_name, name + "." + extension) + '?time=' + new Date().getTime());
			$(this).attr('alt', name + " thumbnails");
		});

		//preview link
		var link2 = container.find('a.preview');
		file = link2.attr('data-url');
		if (typeof file !== "undefined" && file)
		{
			link2.attr('data-url', file.replace(encodeURIComponent(old_name), encodeURIComponent(name + "." + extension)));
		}

		//li data-name
		container.parent().attr('data-name', name + "." + extension);
		container.attr('data-name', name + "." + extension);

		//download link
		container.find('.name_download').val(name + "." + extension);

		//rename link && delete link
		var link3 = container.find('a.rename-file');
		var link4 = container.find('a.delete-file');

		var path_old = link3.attr('data-path');
		var new_path = path_old.replace(old_name, name + "." + extension);

		link3.attr('data-path', new_path);
		link4.attr('data-path', new_path);
	}

	apply_folder_rename = function (container, name)
	{

		container.attr('data-name', name);
		container.find('figure').attr('data-name', name);

		var old_name = container.find('h4').find('a').text();
		container.find('h4 > a').text(name);

		//select link
		var link = container.find('.folder-link');
		var url = link.attr('href');
		var fldr = $('#fldr_value').val();
		var new_url = url.replace('fldr=' + fldr + encodeURIComponent(old_name), 'fldr=' + fldr + encodeURIComponent(name));
		link.each(function ()
		{
			$(this).attr('href', new_url);
		});

		//rename link && delete link
		var link2 = container.find('a.delete-folder');
		var link3 = container.find('a.rename-folder');
		var path_old = link3.attr('data-path');
		var index = path_old.lastIndexOf('/');
		var new_path = path_old.substr(0, index + 1) + name;
		link2.attr('data-path', new_path);
		link3.attr('data-path', new_path);

	}

	function replace_last(str, find, replace)
	{
		var re = new RegExp(find + "$");
		return str.replace(re, replace);
	}

	function replaceDiacritics(s)
	{
		var s;

		var diacritics = [
			/[\300-\306]/g, /[\340-\346]/g,  // A, a
			/[\310-\313]/g, /[\350-\353]/g,  // E, e
			/[\314-\317]/g, /[\354-\357]/g,  // I, i
			/[\322-\330]/g, /[\362-\370]/g,  // O, o
			/[\331-\334]/g, /[\371-\374]/g,  // U, u
			/[\321]/g, /[\361]/g, // N, n
			/[\307]/g, /[\347]/g // C, c
		];

		var chars = [ 'A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c' ];

		for (var i = 0; i < diacritics.length; i++)
		{
			s = s.replace(diacritics[ i ], chars[ i ]);
		}

		return s;
	}

	function fix_filename(stri)
	{
		if (stri != null)
		{
			if ($('#transliteration').val() == "true")
			{
				stri = replaceDiacritics(stri);
				stri = stri.replace(/[^A-Za-z0-9\.\-\[\] _]+/g, '');
			}
			if ($('#convert_spaces').val() == "true")
			{
				stri = stri.replace(/ /g, $('#replace_with').val());
			}
			if($('#lower_case').val() == "true")
			{
				stri = stri.toLowerCase();
			}
			stri = stri.replace('"', '');
			stri = stri.replace("'", '');
			stri = stri.replace("/", '');
			stri = stri.replace("\\", '');
			stri = stri.replace(/<\/?[^>]+(>|$)/g, "");
			return $.trim(stri);
		}
		return null;
	}

	function execute_action(action, file, name, container, function_name)
	{
		if (name !== null)
		{
			name = fix_filename(name);
			$.ajax({
				type: "POST",
				url: "execute.php?action=" + action,
				data: {
					path: file,
					name: name.replace('/', '')
				}
			}).done(function (msg)
			{
				if (msg != "")
				{
					bootbox.alert(msg);
					return false;
				}
				else
				{
					if (function_name != "")
					{
						window[ function_name ](container, name);
					}
				}
				return true;
			});
		}
	}


	function sortUnorderedList(sortDescending, sort_field)
	{
		var lis_dir = $('li.dir', 'ul.grid').filter(':visible');
		var lis_file = $('li.file', 'ul.grid').filter(':visible');

		var vals_dir = [];
		var values_dir = [];
		var vals_file = [];
		var values_file = [];

		lis_dir.each(function (/*index*/)
		{
			var _this = $(this);
			var value = _this.find(sort_field).val();
			if ($.isNumeric(value))
			{
				value = parseFloat(value);
				while (typeof vals_dir[ value ] !== "undefined" && vals_dir[ value ])
				{
					value = parseFloat(parseFloat(value) + parseFloat(0.001));
				}
			}
			else
			{
				value = value + "a" + _this.find('h4 a').attr('data-file');
			}
			vals_dir[ value ] = _this.html();
			values_dir.push(value);
		});

		lis_file.each(function (/*index*/)
		{

			var _this = $(this);
			var value = _this.find(sort_field).val();
			if ($.isNumeric(value))
			{
				value = parseFloat(value);
				while (typeof vals_file[ value ] !== "undefined" && vals_file[ value ])
				{
					value = parseFloat(parseFloat(value) + parseFloat(0.001));
				}
			}
			else
			{
				value = value + "a" + _this.find('h4 a').attr('data-file');
			}
			vals_file[ value ] = _this.html();
			values_file.push(value);
		});

		if ($.isNumeric(values_dir[ 0 ]))
		{
			values_dir.sort(function (a, b)
			{
				return parseFloat(a) - parseFloat(b);
			});
		}
		else
		{
			values_dir.sort();
		}

		if ($.isNumeric(values_file[ 0 ]))
		{
			values_file.sort(function (a, b)
			{
				return parseFloat(a) - parseFloat(b);
			});
		}
		else
		{
			values_file.sort();
		}

		if (sortDescending)
		{
			values_dir.reverse();
			values_file.reverse();
		}

		lis_dir.each(function (index)
		{
			var _this = $(this);
			_this.html(vals_dir[ values_dir[ index ] ]);
		});

		lis_file.each(function (index)
		{
			var _this = $(this);
			_this.html(vals_file[ values_file[ index ] ]);
		});
	}

	show_animation = function()
	{
		$('#loading_container').css('display', 'block');
		$('#loading').css('opacity', '.7');
	}

	hide_animation = function()
	{
		$('#loading_container').fadeOut();
	}

	function launchEditor(id, src)
	{
		featherEditor.launch({
			image: id,
			url: src
		});
		return false;
	}

	function lazyLoad() {
		$('.lazy-loaded').lazyload(); //Reset generale lazyload altrimenti sul sort non riparte
	}

})(jQuery, Modernizr, image_editor);