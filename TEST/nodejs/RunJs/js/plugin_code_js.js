
				
/*CodeFolder*/
CodeFolder = (function() {

	var PT = CodeFolder.prototype;
	var instance;

	PT.init = function(runjs) {
		instance = this;
		plugins.importJavaScript("/js/CodeMirror-2.25/lib/util/foldcode.js");
	};

	PT.onEditorViewInit = function() {

		instance.foldFunc_html = CodeMirror.newFoldFunction(CodeMirror.tagRangeFinder);
		instance.foldFunc_js = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);

		runjs.editor.editorJs.setOption("onGutterClick", instance.foldFunc_js);
		runjs.editor.editorHtml.setOption("onGutterClick", instance.foldFunc_html);
	}

});

plugins.newPlugin("avnuxtyh",CodeFolder);

/*ExplorerPlugin*/
ExplorerPlugin = (function() {

	var PT = ExplorerPlugin.prototype;

	PT.Events = {
		"click->.mainresource .js_resource .rurl": "importJs",
		"click->.mainresource .css_resource .rurl": "importCss",
		"click->.mainresource .image_resource .rurl": "importImg",
		"click->.mainresource .other_resource .rurl": "importImg"
	};

	var instance;

	PT.init = function() {
		instance = this;
	}

	PT.onEditorViewInit = function() {
		runjs.editor.editorHtml.setOption("onFocus",
		function(cm) {
			instance.focusEditor = cm;
		});
		runjs.editor.editorCss.setOption("onFocus",
		function(cm) {
			instance.focusEditor = cm;
		});
		runjs.editor.editorJs.setOption("onFocus",
		function(cm) {
			instance.focusEditor = cm;
		});
	}

	PT.importJs = function(cur, e) {
		var href = $(this).attr("href");
		g_utils.insertScriptIntoHead(href,'js');
		g_utils.stopDefault(e);
		return false;  
	};

	PT.importCss = function(cur, e) {
		var href = $(this).attr("href");
		g_utils.insertScriptIntoHead(href,'css');
		g_utils.stopDefault(e);
		return false;
	}

	PT.importImg = function(cur, e) {
		var href = $(this).attr("href");
		var editor = instance.focusEditor;
		if (isNotEmpty(editor)) {
			var range = instance.getSelectedRange(editor);
			editor.replaceRange(href, range.from, range.to);
		}
		g_utils.stopDefault(e);
		return false;
	}
    
	PT.getSelectedRange = function(editor) {
		return {
			from: editor.getCursor(true),
			to: editor.getCursor(false)
		};
	}

});

plugins.newPlugin("qhva0jan",ExplorerPlugin);
/*HTMLCloseTag*/
HTMLCloseTag = (function() {

	var PT = HTMLCloseTag.prototype;

	var instance;

	PT.init = function(runjs) {
		instance = this;
		plugins.importJavaScript("/js/CodeMirror-2.25/lib/util/closetag.js");
	};

});

plugins.newPlugin("gkrelxmw",HTMLCloseTag);

/*HTMLFormater*/
HTMLFormater = (function() {

	var PT = HTMLFormater.prototype;

	var instance;

	PT.init = function(runjs) {
		instance = this;
		plugins.importJavaScript("/js/js_beautify.js");
	};

	PT.getSelectedRange = function(editor) {
		return {
			from: editor.getCursor(true),
			to: editor.getCursor(false)
		};
	};

	PT.removeJsTagBlank = function() {
		var editor = runjs.editor.editorHtml;
		var line = null,
		ln = 0;
		var startLine = 0;
		while (line = editor.getLine(ln)) {
			try {
				if (startLine == 0 && line.indexOf("<script") > -1 && typeof($(line).attr("class")) != 'undefined' && $(line).attr("class").indexOf("library") > -1) {
					if (line.indexOf("</script>") == -1) startLine = ln;
				} else if (startLine != 0 && line.indexOf("</script>") > -1) {
					var start = editor.getLine(startLine);
					var end = line;
					var blank_start = {
						line: startLine,
						ch: start.length
					};
					var blank_end = {
						line: ln,
						ch: end.indexOf('</')
					};
					editor.replaceRange("", blank_start, blank_end);
					startLine = 0;
					ln--;
				}
			} catch(e) {}
			ln++;
		}
	};

	PT.format = function(cm) {
		var helper = plugins.getPlugin("qhva0jan");
		var cur = helper.focusEditor;
		var gr = instance.getSelectedRange;
		var html = runjs.editor.editorHtml;
		var css = runjs.editor.editorCss;
		var js = runjs.editor.editorJs;
		if (cur != null) {
			if (cur != js) {
				var range = gr(cur);
				if ((range.from.char == range.to.char) && (range.from.line == range.to.line)) {
					CodeMirror.commands["selectAll"](cur);
					range = gr(cur);
				}
				cur.autoFormatRange(range.from, range.to);
				if (cur == html) instance.removeJsTagBlank();
			} else {
				var value = js.getValue();
				var js_source = value.replace(/^\s+/, '');
				var fjs = js_beautify(js_source, 1, '\t');
				js.setValue(fjs);
			}
		}
	}

});

plugins.newPlugin("cv9igin0",HTMLFormater)
/*ImageResourcePreview*/
ImageResourcePreview = (function() {

	var PT = ImageResourcePreview.prototype;

	PT.Events = {
		"mouseover->.image_resource .rurl": "showPreview",
		"mouseout->.image_resource .rurl": "hidePreview"
	};

	PT.init = function() {};

	PT.showPreview = function() {
		$("#image_preview").remove();
		var cur = $(this);
		var url = $(this).attr("href");
		img = $("<img id='image_preview' src='" + url + "' width='100'/>").css({
			left: cur.offset().left + 180,
			top: cur.offset().top,
			position: 'absolute',
			'z-index': 999999
		});
		$("body").append(img);
	};
  
  PT.hidePreview = function(){
  	$("#image_preview").remove();
  };

});

plugins.newPlugin("09uuathd",ImageResourcePreview);

/*LineHighlight*/
LineHighlight = (function() {

    var PT = LineHighlight.prototype;
    var instance;
    var hlLine;
    var added = false;

    PT.init = function(runjs) {
        instance = this;
    };

    PT.onEditorViewInit = function() {
        if(added)return;
        hlLine = runjs.editor.editorHtml.setLineClass( - 1, "activeline");

        instance.addEvent("onJsCursorActivity",
        function(cm) {
            cm.setLineClass(hlLine, null, null);
            hlLine = cm.setLineClass(cm.getCursor().line, null, "activeline");
        });

        instance.addEvent("onCssCursorActivity",
        function(cm) {
            cm.setLineClass(hlLine, null, null);
            hlLine = cm.setLineClass(cm.getCursor().line, null, "activeline");
        });
        instance.addEvent("onHtmlCursorActivity",
        function(cm) {
            cm.setLineClass(hlLine, null, null);
            hlLine = cm.setLineClass(cm.getCursor().line, null, "activeline");
        });
        added=true;
    }

});

plugins.newPlugin("u3ctfkqz", LineHighlight)
/*ToolBarPlugin*/
var ResourceUtils = (function() {

	var PT = ResourceUtils.prototype;
	var idents, instance;
	var ident_to_lib;
	var resource;
	var imported;

	function ResourceUtils(res) {
		instance = this;
		resource = res;
		this.listAllIdent();
	};

	PT.listAllIdent = function() {
		if (isEmpty(idents)) {
			idents = [];
			ident_to_lib = {};
			$.each(resource,
			function(k, v) {
				if (typeOf(v, 'object')) {
					if (isNotEmpty(v.scripts)) {
						$.each(v.scripts,
						function(idx, url) {
							idents.push(url.ident);
							ident_to_lib[url.ident] = url;
						});
					}
				}
			});
		}
		return idents;
	};

	PT.getLibByIdent = function(ident) {
		if (isEmpty(ident_to_lib)) {
			this.listAllIdent();
		}
		return ident_to_lib[ident];
	};

	PT.getLibByName = function(name) {
		if (this.is1stClassLib(name)) {
			return resource[name];
		} else if (this.isIdent(name)) {
			return this.getLibByIdent(name);
		}
	};

	PT.is1stClassLib = function(name) {
		return typeOf(resource[name], 'object');
	};

	PT.isIdent = function(name) {
		return idents.indexOf(name) > -1;
	};

	PT.getParentByIdent = function(ident) {
		var name = instance.getParentNameByIdent(ident);
		if (isEmpty(name)) return;
		return resource[name];
	};

	PT.getParentNameByIdent = function(ident) {
		if (isEmpty(ident)) return;
		var pn = ident.split("_")[0];
		return pn;
	};

	PT.getSiblingsIdByIdent = function(ident) {
		if (isEmpty(ident)) return;
		var p = instance.getParentByIdent(ident);
		if (isEmpty(p)) return;
		var idents = [];
		$.each(p.scripts,
		function(idx, s) {
			if (isNotEmpty(s) && isNotEmpty(s.ident) && s.ident != ident) {
				idents.push(s.ident);
			}
		});
		return idents;
	};

	PT.getAllByIdent = function(ident, idents) {
		if (this.isIdent(ident)) {
			if (isEmpty(idents)) {
				idents = [];
			}
			var lib = instance.getLibByIdent(ident);
			var parent = instance.getParentByIdent(ident);
			if (isNotEmpty(lib)) idents.push(ident);
			if (isNotEmpty(lib) && isNotEmpty(lib.requires)) {
				$.each(lib.requires,
				function(idx, id) {
					var ids = instance.getAllByIdent(id);
					if (isNotEmpty(ids)) {
						$.merge(ids, idents);
						idents = ids;
					}
				});
			}
			if (isNotEmpty(parent) && isNotEmpty(parent.requires)) {
				$.each(parent.requires,
				function(idx, id) {
					var ids = instance.getAllByIdent(id);
					if (isNotEmpty(ids)) {
						$.merge(ids, idents);
						idents = ids;
					}
				});
			}
		}
		return $.unique($.unique(idents));
	};

	PT.getUrlsByIdent = function(ident, type, scripts, noreq) {
		if (this.isIdent(ident) && isNotEmpty(type)) {
			if (isEmpty(scripts)) {
				scripts = [];
			}
			var lib = instance.getLibByIdent(ident);
			var parent = instance.getParentByIdent(ident);
			if (isNotEmpty(type == "js" ? lib.url: lib.style)) {
				$.merge(scripts, $.makeArray(type == "js" ? lib.url: lib.style));
			}
			if (isEmpty(noreq) || !noreq) {
				var url = getUrlsFromRequires(lib.requires, type);
				if (isNotEmpty(url) && isArray(url) && url.length > 0) {
					$.merge(url, scripts);
					scripts = url;
				}
				url = getUrlsFromRequires(parent.requires, type);
				if (isNotEmpty(url) && isArray(url) && url.length > 0) {
					$.merge(url, scripts);
					scripts = url;
				}
			}
		}
		return scripts;
	}

	var getUrlsFromRequires = function(req, type) {
		var scripts = [];
		if (isNotEmpty(req)) {
			if (typeOf(req, 'string')) {
				if (instance.isIdent(req)) {
					var url = instance.getUrlsByIdent(req, type);
					if (isNotEmpty(url) && isArray(url) && url.length > 0) {
						$.merge(scripts, url);
					}
				} else {
					scripts.push(req);
				}
			} else if (isArray(req)) {
				$.each(req,
				function(k, v) {
					if (instance.isIdent(v)) {
						var url = instance.getUrlsByIdent(v, type);
						if (isNotEmpty(url) && isArray(url) && url.length > 0) {
							$.merge(scripts, url);
						}
					} else if (typeOf(v, "string")) {
						scripts.push(v);
					}
				});
			}
		}
		return scripts;
	};

	PT.getImportedLibIdents = function(editor) {
		if (isEmpty(editor)) return;
		var idents = [];
		var scripts = editor.getValue().match(/(<script[^>]*>(.|\n)*?<\/script>)/ig);
		if (isEmpty(scripts)) return idents;
		$.each(scripts,
		function(idx, script) {
			var ident = $(script).attr("id");
			if (isNotEmpty(ident)) {
				idents.push(ident);
			}
		});
		return idents;
	};

	PT.removeAllImportedScripts = function(editor) {
		var str = "";
		var idents = instance.listAllIdent(editor);
		$.each(idents,
		function(i, ident) {
			str += ident;
			if (i < idents.length - 1) str += "|";
		});
		var rg = new RegExp('(<script id="(' + str + ')"[^>]*>(.|\n)*?<\/script>)|(<link id="(' + str + ')"[^>]*>(.|\n)*?)',"ig");
		var new_line = editor.getValue().replace(rg, "");
		editor.setValue(new_line);
		var count = editor.lineCount();
		new_line = "";
		for (var i = 0; i < count; i++) {
			var line = editor.getLine(i);
			if (isNotEmpty($.trim(line))) {
				new_line += line;
				if (i < count - 1) new_line += "\n";
			}
		}
		editor.setValue(new_line);
	};

	PT.getIdentByUrl = function(url) {
		var re = "";
		$.each(resource,
		function(idx, lib) {
			if (isNotEmpty(re)) return;
			$.each(lib.scripts,
			function(i, s) {
				var arr = $.makeArray(s.url);
				var arr2 = $.makeArray(s.style);
				if (arr.indexOf(url) > -1 || arr2.indexOf(url) > -1) {
					re = s.ident;
				}
			});
		});
		return re;
	};
	
	//高亮引入库
	PT.highlightSelectItem = function(editor,idents) {
		if(typeof idents == "undefined") idents = instance.getImportedLibIdents(editor);
		$(".toolItem .select ul li.imported").removeClass("imported");
		if (idents.length != 0) {
			$.each(idents,function(idx, ident) {
				$(".toolItem .select ul #" + ident).addClass("imported");
			});
		}
	};

	PT.insertScriptIntoHead2 = function(ident, editor) {
		if (isEmpty(ident)) return;
		if (isEmpty(editor)) {
			editor = runjs.editor.editorHtml;
		}
		var idents = instance.getImportedLibIdents(editor);
		if (idents.length != 0) {
			instance.removeAllImportedScripts(editor);
		}
		idents = $.unique($.unique(idents));
		var idents2 = instance.getAllByIdent(ident);
		idents2 = $.unique($.unique(idents2));

		var remove = false;

		var replace_list = [];
		/*$.each(idents2,function(i2,id2){
      if(idents.indexOf(id2)>-1 && replace_list.indexOf(id2) == -1){
      	replace_list.push(id2);
        
      }
    });*/
		if (idents.indexOf(ident) > -1) {
			remove = true;
			replace_list.push(ident);
			idents = $.grep(idents,
			function(n, i) {
				return replace_list.indexOf(n) == -1;
			});
		}
		if (!remove) {
			var replace_list = [];
			$.each(idents,
			function(i1, id1) {
				var parent = instance.getParentNameByIdent(id1);
				$.each(idents2,
				function(i2, id2) {
					var parent2 = instance.getParentNameByIdent(id2);
					if (parent == parent2 && replace_list.indexOf(id1) == -1 && parent != "others") {
						replace_list.push(id1);
					}
				});
			});
			idents = $.grep(idents,
			function(n, i) {
				return replace_list.indexOf(n) == -1;
			});
			$.merge(idents2, idents);
			idents = idents2;
		}

		instance.insertNow(idents, editor);

	};

	var headLine = function(editor) {
		var count = editor.lineCount();
		var head_line = {
			line: 0,
			ch: 0
		};
		for (var i = 0; i < count; i++) {
			var line = editor.getLine(i);
			if (isNotEmpty(line)) {
				var m = line.match(/<\/head>/ig);
				if (isNotEmpty(m) && m.length == 1) {
					head_line = {
						line: i,
						ch: 0
					};
				}
			}
		}
		return head_line;
	}

	PT.insertNow = function(idents, editor) {
		if (typeOf(editor, 'string') && typeOf(idents, 'string')) {
			var e = runjs.editor.editorHtml;
			var head_line = headLine(e);
			if (editor == 'js') {
				var js_urls = '\t<script type="text/javascript" src="' + idents + '"></script>\n';
				e.replaceRange(js_urls, head_line);
				plugins.fireEvent.call(instance, "onScriptImport", js_urls);
			} else if (editor == 'css') {
				var css_urls = '\t<link rel="stylesheet" type="text/css" href="' + idents + '">\n';
				e.replaceRange(css_urls, head_line);
				plugins.fireEvent.call(instance, "onScriptImport", css_urls);
			}
			return;
		}
		//将库引入到Head
		var js = [];
		var css = [];
		idents = $.unique($.unique(idents));

		$.each(idents,
		function(idx, ident) {
			var j = instance.getUrlsByIdent(ident, 'js', [], true);
			var c = instance.getUrlsByIdent(ident, 'css', [], true);
			$.merge(js, j);
			$.merge(css, c);
		});

		$.unique($.unique(js));
		$.unique($.unique(css));

		//高亮引入库
		instance.highlightSelectItem(editor,idents);

		var head_line = headLine(editor);
		var js_urls = "";
		var css_urls = "";

		$.each(js,
		function(idx, j) {
			var ident = instance.getIdentByUrl(j);
			js_urls += '\t<script id="' + ident + '" type="text/javascript" class="library" src="' + j + '"></script>\n';
		});
		$.each(css,
		function(idx, c) {
			var ident = instance.getIdentByUrl(c);
			css_urls += '\t<link id="' + ident + '" rel="stylesheet" type="text/css" class="library" href="' + c + '">\n';
		});
		editor.replaceRange(js_urls, head_line);
		editor.replaceRange(css_urls, head_line);
		plugins.fireEvent.call(instance, "onScriptImport", ident);
	};

	var combineLibs = function(libs) {
		$.each(libs,
		function(idx, lib) {

});
	};

	return ResourceUtils;

})();

ToolbarExtend = (function() {

	var utils = new ResourceUtils(Resource2);

	var PT = ToolbarExtend.prototype;

	var instance, toolbar = $(".toolBar");

	var updateViewClone, getCombinedHtmlClone;

	var common_lib = [{
		'Ajax 框架': ['jquery', 'dojo', 'mootools', 'prototype']
	},
	{
		'移动开发框架': ['others_sencha_touch_2011', 'others_zepto_10rc1', 'jquerymobile','jqmobi']
	},
	{
		'UI 框架': ['others_extjs_411a', 'others_jquery_easyui_131', 'others_dwzui_144', 'bootstrap', 'jqueryui', 'yui']
	},
	'jqueryplugins', {
		'HTML5 相关': ['others_processing_141', 'others_es5_shim_124', 'others_jquery_html5_uploader', 'others_jcanvascript_1518', 'others_canvastext_041']
	},
	{
		'工具库': ['others_underscore_133', 'others_raphael_210', 'others_sammy_063', 'others_modernizr_262']
	}];

	PT.Events = {
		"mouseenter->.toolBar .select": function() {
			var cur = $(this);
			cur.find("ul").show();
		},
		"mouseleave->.toolBar .select": function() {
			var cur = $(this);
			cur.find("ul").hide();
		},
		"click->.toolBar .select li": function() {
			var cur = $(this);
			if (isNotEmpty(cur.attr("id"))) {
				utils.insertScriptIntoHead2(cur.attr("id"), runjs.editor.editorHtml);
			}
		},
		"change->#js_switcher": function() {
			if ($(this).is(":checked")) {
				instance.enableJS();
			} else {
				instance.disableJS();
			}
			runjs.editor.updatePreview("", true);
		},
		"change->#preview_switcher": function() {
			//if (g_status.mode == "plugin") return;
			if ($(this).is(":checked")) {
				instance.enablePreview();
				runjs.editor.updatePreview("", true);
			} else {

				Editor.prototype.updatePreview = function() {
					runjs.editor.setEditedStatus();
				};
			}
		}
	};

	PT.init = function() {
		instance = this;
	};

	var addJsEnable = function() {
		toolbar.append('<div class="toolItem view"><input type="checkbox" checked="" id="js_switcher"><label for="js_switcher">启用JavaScript</label></div>');
	}

	var addPreveiwEnable = function() {
		toolbar.append('<div class="toolItem view"><input type="checkbox" checked="" id="preview_switcher"><label for="preview_switcher">启用实时预览</label></div>');
	}

	PT.enableJS = function() {
		Editor.prototype.getCombinedHtml = getCombinedHtmlClone;
	};

	PT.disableJS = function() {
		Editor.prototype.getCombinedHtml = function() {
			var html = runjs.editor.editorHtml.getValue();
			html = html.replace(/<script[^>]*>(.|\n)*?<\/script>/ig, "");
			var temp = "";
			if (html.indexOf("</body>") > -1) {
				var body = [];
				body.push(html.substring(0, html.lastIndexOf("</body>")));
				body.push(html.substring(html.lastIndexOf("</body>")));
				html = body[0];
				temp = body.length == 2 && body[1] ? body[1] : "";
			}
			return html + "<style>" + this.editorCss.getValue() + "</style>" + temp;
		}
	};

	PT.enablePreview = function() {
		Editor.prototype.updatePreview = updateViewClone;
	};

	PT.onEditorViewInit = function() {
		toolbar.html("");
		instance.addLibs();
		addJsEnable();
		addPreveiwEnable();
		updateViewClone = runjs.editor.updatePreview;
		getCombinedHtmlClone = runjs.editor.getCombinedHtml;
		if (g_status.posted) toolbar.append('<div class="toolItem view" style="float:right;"><a href="/detail/' + g_status.ident + '" target="_blank">查看发布详情»</a></div>');
		Utils.prototype.insertScriptIntoHead = utils.insertNow;
		utils.highlightSelectItem(runjs.editor.editorHtml);
	};

	PT.addLibs = function() {
		$.each(common_lib,
		function(key, value) {
			if (typeOf(value, 'string') && utils.is1stClassLib(value)) {
				var lib = utils.getLibByName(value);
				toolbar.append(build1stClassSelect(lib));
			} else if (typeOf(value, 'object')) {
				handleCombinedLib(value);
			}
		});
		addOthersLib(common_lib);

	};

	var addOthersLib = function(common_lib) {
		var replace_lib = [];
		var replace_idents = [];
		$.each(common_lib,
		function(key, value) {
			if (typeOf(value, 'string') && utils.is1stClassLib(value)) {
				var lib = utils.getLibByName(value);
				if (isNotEmpty(lib)) replace_lib.push(value);
			} else if (typeOf(value, 'object')) {
				$.each(value,
				function(k, v) {
					$.each(v,
					function(k1, v1) {
						if (utils.is1stClassLib(v1)) {
							replace_lib.push(v1);
						} else if (utils.isIdent(v1)) {
							replace_idents.push(v1);
						}
					});
				});
			}
		});
		var str = '<div class="toolItem library" id="jquery"><div class="select"><div class="title">其他库<div class="arrow_bottom_blue"></div></div><ul style="display: none;">';;
		$.each(Resource2,
		function(k, v) {
			if (replace_lib.indexOf(k) == -1) {
				var scripts = Resource2[k].scripts;
				if (isEmpty(scripts)) return;
				var arr = [];
				$.each(scripts,
				function(i, s) {
					if (isNotEmpty(s.ident) && replace_idents.indexOf(s.ident) == -1) {
						arr.push(s);
					}
				});
				if (arr.length != 0) {
					if (arr.length == 1) {
						str += '<li id="' + arr[0].ident + '" title="' + arr[0].text + '">' + arr[0].text + '</li>';
					} else {
						str += '<li class="lib_name">' + utils.getParentNameByIdent(arr[0].ident) + '</li>';
						$.each(arr,
						function(i, a) {
							str += '<li id="' + a.ident + '" title="' + a.text + '">' + a.text + '</li>';
						});
					}
				}
			}
		});
		str += '</ul></div></div>';
		toolbar.append(str);
	};

	var handleCombinedLib = function(value) {
		if (value.conflict) {

} else {
			buildCombinedSelect(value);
		}
	};

	var buildCombinedSelect = function(value) {
		$.each(value,
		function(k, v) {
			if (k != "conflict") {
				var ul;
				$.each(v,
				function(idx, name) {
					var lib = utils.getLibByName(name);
					if (utils.isIdent(name)) {
						if (isEmpty(ul)) {
							ul = buildIdentUl(lib);
						} else {
							ul.append(buildIdentLi(lib));
						}
					} else if (utils.is1stClassLib(name)) {
						if (isEmpty(ul)) {
							ul = build1stClassUl(lib, name);
						} else {
							build1stClassLi(ul, lib, name);
						}
					}
				});
				var el = $('<div class="select"></div>');
				el.append(buildTitle(k));
				el.append(ul);
				var lib_item = $('<div class="toolItem library" id="jquery"></div>');
				lib_item.append(el);
				toolbar.append(lib_item);
			}
		});
	};

	var build1stClassLi = function(ul, lib, name) {
		if (isNotEmpty(name)) {
			var li = $('<li class="lib_name"></li>').attr("title", name).html(lib.text);
			ul.append(li);
		}
		$.each(lib.scripts,
		function(k, v) {
			var li = $('<li></li>').attr({
				"id": v.ident,
				"title": v.text
			}).html(v.text);
			ul.append(li);
		});
		return ul;
	};

	var build1stClassUl = function(lib, name) {
		var ul = $('<ul style="display:none;"></ul>');
		return build1stClassLi(ul, lib, name);
	};

	var buildIdentLi = function(lib) {
		return $('<li></li>').attr({
			"id": lib.ident,
			"title": lib.text
		}).html(lib.text);
	};

	var buildIdentUl = function(lib) {
		var ul = $('<ul style="display:none;"></ul>');
		ul.append(buildIdentLi(lib));
		return ul;
	};

	var buildTitle = function(name) {
		return $('<div class="title">' + name + '<div class="arrow_bottom_blue"></div></div>');
	};

	var build1stClassSelect = function(lib) {
		var el = $('<div class="select"></div>');
		el.append(buildTitle(lib.text));
		el.append(build1stClassUl(lib));
		var lib_item = $('<div class="toolItem library" id="jquery"></div>');
		lib_item.append(el);
		return lib_item;
	};
});

plugins.newPlugin("8qaxpaxr", ToolbarExtend);
/*ViewSwitcher*/
ViewSwitcher = (function() {

	var PT = ViewSwitcher.prototype;

	var instance;

	PT.Events = {
		"change->.menuItem .view input": "viewSwitcher",
		"click->.editor.html .quick_tools img": function() {
			if (isNotEmpty($(this).attr("class")) && $(this).attr("class").indexOf("on") > -1) {
				instance.showAllView(this);
				$(this).attr("src", "/img/arrow-out.png");
			} else {
				instance.resetView(true, false, false, false, this);
				$(this).attr("src", "/img/arrow-in.png");
			}
		},
		"click->.editor.js .quick_tools img": function() {
			if (isNotEmpty($(this).attr("class")) && $(this).attr("class").indexOf("on") > -1) {
				$(this).attr("src", "/img/arrow-out.png");
				instance.showAllView(this);
			} else {
				instance.resetView(false, true, false, false, this);
				$(this).attr("src", "/img/arrow-in.png");
			}
		},
		"click->.editor.css .quick_tools img": function() {
			if (isNotEmpty($(this).attr("class")) && $(this).attr("class").indexOf("on") > -1) {
				$(this).attr("src", "/img/arrow-out.png");
				instance.showAllView(this);
			} else {
				instance.resetView(false, false, true, false, this);
				$(this).attr("src", "/img/arrow-in.png");
			}
		},
		"click->.editor.preview .quick_tools img": function() {
			if (isNotEmpty($(this).attr("class")) && $(this).attr("class").indexOf("on") > -1) {
				$(this).attr("src", "/img/arrow-out.png");
				instance.showAllView(this);
			} else {
				instance.resetView(false, false, false, true, this);
				$(this).attr("src", "/img/arrow-in.png");
			}
		}
	};

	PT.init = function() {

		instance = this;

	};

	PT.onEditorViewInit = function() {
		if (isNotEmpty(instance)) {
			initView();
			addHotKey();
		}
	}

	var addHotKey = function() {
		runjs.addCtrlHotKey({
			'1': {
				event: function(d) {
					instance.resetView(true, false, false, false);
					$(".editor.html .quick_tools img").attr("src", "/img/arrow-in.png");
				},
				data: ''
			},
			'2': {
				event: function(d) {
					instance.resetView(false, true, false, false, this);
					$(".editor.js .quick_tools img").attr("src", "/img/arrow-in.png");
				},
				data: ''
			},
			'3': {
				event: function(d) {
					instance.resetView(false, false, true, false, this);
					$(".editor.css .quick_tools img").attr("src", "/img/arrow-in.png");
				},
				data: ''
			},
			'4': {
				event: function(d) {
					instance.resetView(false, false, false, true, this);
					$(".editor.preview .quick_tools img").attr("src", "/img/arrow-in.png");
				},
				data: ''
			},
			'5': {
				event: function(d) {
					instance.resetView(true, true, true, true, this);
					$(".editor .quick_tools img").attr("src", "/img/arrow-out.png");
				},
				data: ''
			},
		});
	};

	PT.viewSwitcher = function() {
		var v = $(this);
		var id = v.attr('id');
		// 至少要打开一个视图
		if ($(".menuItem .view input:checked").length == 0) {
			v.attr("checked", "checked");
		} else {
			var view = instance.view;
			view[id] = !view[id];
			instance.switchView(view);
		}
	};

	PT.switchView = function(view) {
		var left = true;
		var right = true;
		if (view.html_view) {
			view.left.css({
				width: "50%"
			});
			view.right.css({
				width: "50%"
			});
			view.ver_ctrl.css({
				left: view.left.width() - 5
			});
			if (view.js_view) {
				view.html.css({
					height: "50%"
				});
				view.js.css({
					height: "50%"
				});
			} else {
				view.html.css({
					height: "100%"
				});
				view.js.css({
					height: 0
				});
			}
			view.hor_left.css({
				top: parseInt(view.html.height()) - 5
			});
		} else {
			if (view.js_view) {
				view.left.css({
					width: "50%"
				});
				view.right.css({
					width: "50%"
				});
				view.ver_ctrl.css({
					left: view.left.width() - 5
				});
				view.html.css({
					height: 0
				});
				view.js.css({
					height: "100%"
				});
				view.hor_left.css({
					top: -5
				});
			} else {
				// html和js都不显示
				left = false;
				view.left.css({
					width: 0
				});
				view.right.css({
					width: "100%"
				});
				view.ver_ctrl.css({
					left: -5
				});
			}
		}

		if (view.css_view) {
			if (left) {
				view.left.css({
					width: "50%"
				});
				view.right.css({
					width: "50%"
				});
				view.ver_ctrl.css({
					left: view.left.width() - 5
				});
			}
			if (view.pre_view) {
				view.css.css({
					height: "50%"
				});
				view.preview.css({
					height: "50%"
				});
			} else {
				view.css.css({
					height: "100%"
				});
				view.preview.css({
					height: 0
				});
			}
			view.hor_right.css({
				top: view.css.height() - 5
			});
		} else {
			if (view.pre_view) {
				// css不显示preview显示
				if (left) {
					view.left.css({
						width: "50%"
					});
					view.right.css({
						width: "50%"
					});
					view.ver_ctrl.css({
						left: view.left.width() - 5
					});
				}
				view.css.css({
					height: 0
				});
				view.preview.css({
					height: "100%"
				});
				view.hor_right.css({
					top: -5
				});
			} else {
				// css和preview都不显示
				right = false;
				view.right.css({
					width: 0
				});
				view.left.css({
					width: "100%"
				});
				view.ver_ctrl.css({
					left: view.left.width() - 5
				});
			}
		}
		runjs.editor.refreshEditors();
	};

	PT.resetViewCheckbox = function(view) {
		if (view.html_view) {
			$("#html_view").attr("checked", "checked");
		} else {
			$("#html_view").removeAttr("checked");
		}
		if (view.js_view) {
			$("#js_view").attr("checked", "checked");
		} else {
			$("#js_view").removeAttr("checked");
		}
		if (view.css_view) {
			$("#css_view").attr("checked", "checked");
		} else {
			$("#css_view").removeAttr("checked");
		}
		if (view.pre_view) {
			$("#pre_view").attr("checked", "checked");
		} else {
			$("#pre_view").removeAttr("checked");
		}
	};

	PT.resetView = function(html, js, css, preview, cur) {
		$(cur).addClass("on");
		var view = instance.view;
		view.html_view = html;
		view.js_view = js;
		view.css_view = css;
		view.pre_view = preview;
		instance.resetViewCheckbox(view);
		instance.switchView(view);
	}

	PT.showAllView = function(cur) {
		$(cur).removeClass("on");
		var view = instance.view;
		view.html_view = true;
		view.js_view = true;
		view.css_view = true;
		view.pre_view = true;
		instance.resetViewCheckbox(view);
		instance.switchView(view);
		$(".editor .quick_tools img").attr("src", "/img/arrow-out.png");
	}

	var initView = function() {

		var html = $(".html");
		var js = $(".js");
		var css = $(".css");
		var preview = $(".preview");
		var hor_left = html.parent().find(".handler_horizontal");
		var hor_right = css.parent().find(".handler_horizontal");
		var ver_ctrl = $(".handler_vertical");
		var left = $(".editorSet.left");
		var right = $(".editorSet.right");

		instance.view = {
			html_view: true,
			css_view: true,
			js_view: true,
			pre_view: true,
			ver: {
				left: {
					top: hor_left.css('top'),
					height_top: '50%',
					height_bottom: '50%'
				},
				right: {
					top: 0,
					height_top: 0,
					height_bottom: 0
				}
			},
			hor: {
				left: 0,
				width_left: 0,
				width_right: 0
			},
			html: html,
			js: js,
			hor_left: hor_left,
			css: css,
			preview: preview,
			hor_right: hor_right,
			ver_ctrl: ver_ctrl,
			left: left,
			right: right
		};

	};

});

plugins.newPlugin("7zqdxjtp",ViewSwitcher);

/*CodeMirrorPlugins*/
CMExtraKeyPlugin = (function() {

	var PT = CMExtraKeyPlugin.prototype;

	var instance;

	PT.init = function() {
		instance = this;
	};

	PT.onEditorViewInit = function() {

		var codeFormater = plugins.getPlugin("cv9igin0");

		var htmlCloseTag = plugins.getPlugin("gkrelxmw");

		var codeFolder = plugins.getPlugin("avnuxtyh");

		runjs.editor.editorHtml.setOption("extraKeys", {
			"Shift-Ctrl-F": codeFormater.format,
			"Ctrl-Q": function(cm) {
				codeFolder.foldFunc_html(cm, cm.getCursor().line);
			},
			"'>'": function(cm) {
				cm.closeTag(cm, '>');
			},
			"'/'": function(cm) {
				cm.closeTag(cm, '/');
			}
		});
		runjs.editor.editorJs.setOption("extraKeys", {
			"Shift-Ctrl-F": codeFormater.format,
			"Ctrl-Q": function(cm) {
				codeFolder.foldFunc_js(cm, cm.getCursor().line);
			}
		});
		runjs.editor.editorCss.setOption("extraKeys", {
			"Shift-Ctrl-F": codeFormater.format
		});
	};
});

plugins.newPlugin("gfetqmmn",CMExtraKeyPlugin);
/*WindowCloseCheck*/
WindowCloseCheck = (function() {

	var PT = WindowCloseCheck.prototype;

	PT.init = function() {
		$(window).bind('beforeunload',
		function() {
			if (runjs.editor.edited) { 
				return "代码尚未保存，确认离开将不会保存当前数据。";
			}
		}); 
	};

});

plugins.newPlugin("qnjbkn31",WindowCloseCheck);
