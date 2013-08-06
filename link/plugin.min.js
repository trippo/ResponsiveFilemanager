tinymce.PluginManager.add("link", function(e) {
    function openmanager() {
        var win, data, dom = e.dom,
            imgElm = e.selection.getNode();
        var width, height, imageListCtrl;
        win = e.windowManager.open({
            title: 'File Manager',
            data: data,
            classes: 'filemanager',
            file: tinyMCE.baseURL + '/plugins/filemanager/dialog.php?type=2&editor=' + e.id + '&lang=' + tinymce.settings.language + '&subfolder=' + tinymce.settings.subfolder,
            filetype: 'file',
            width: 900,
            height: 600,
            inline: 1
        })
    }
    function t() {
        function t() {
            var t = [{
                text: "None",
                value: ""
            }];
            return tinymce.each(e.settings.link_list, function(e) {
                t.push({
                    text: e.text || e.title,
                    value: e.value || e.url,
                    menu: e.menu
                })
            }), t
        }
        function n(t) {
            var n = [{
                text: "None",
                value: ""
            }];
            return tinymce.each(e.settings.rel_list, function(e) {
                n.push({
                    text: e.text || e.title,
                    value: e.value,
                    selected: t === e.value
                })
            }), n
        }
        function r(t) {
            var n = [{
                text: "None",
                value: ""
            }];
            return e.settings.target_list || n.push({
                text: "New window",
                value: "_blank"
            }), tinymce.each(e.settings.target_list, function(e) {
                n.push({
                    text: e.text || e.title,
                    value: e.value,
                    selected: t === e.value
                })
            }), n
        }
        function i() {
            s || 0 !== f.text.length || this.parent().parent().find("#text")[0].value(this.value())
        }
        var o, a, s, l, c, u, d, f = {},
            p = e.selection,
            h = e.dom;
        o = p.getNode(), a = h.getParent(o, "a[href]"), a && p.select(a), f.text = s = p.getContent({
            format: "text"
        }), f.href = a ? h.getAttrib(a, "href") : "", f.target = a ? h.getAttrib(a, "target") : "", f.rel = a ? h.getAttrib(a, "rel") : "", "IMG" == o.nodeName && (f.text = s = " "), e.settings.link_list && (c = {
            type: "listbox",
            label: "Link list",
            values: t(),
            onselect: function(e) {
                var t = l.find("#text");
                (!t.value() || e.lastControl && t.value() == e.lastControl.text()) && t.value(e.control.text()), l.find("#href").value(e.control.value())
            }
        }), e.settings.target_list !== !1 && (d = {
            name: "target",
            type: "listbox",
            label: "Target",
            values: r(f.target)
        }), e.settings.rel_list && (u = {
            name: "rel",
            type: "listbox",
            label: "Rel",
            values: n(f.rel)
        }), l = e.windowManager.open({
            title: "Insert link",
            data: f,
            body: [{
                type: 'container',
                layout: 'flex',
                classes: 'combobox has-open',
                label: 'Source',
                direction: 'row',
                align: 0,
                items: [{
                    name: 'href',
                    type: 'textbox',
                    filetype: 'file',
                    size: 35,
                    classes: 'link_' + e.id,
                    autofocus: true,
                    label: 'Url',
                    onchange: i,
                    onkeyup: i
                }, {
                    name: 'upl_img',
                    type: 'button',
                    classes: 'btn open',
                    icon: 'browse',
                    onclick: openmanager,
                    tooltip: 'Select file'
                }]
            }, {
                name: "text",
                type: "textbox",
                classes: 'text_' + e.id,
                size: 40,
                label: "Text to display",
                onchange: function() {
                    f.text = this.value()
                }
            },
            c, u, d],
            onSubmit: function(t) {
                var n = t.data;
                return n.href ? (n.text != s ? a ? (e.focus(), a.innerHTML = n.text, h.setAttribs(a, {
                    href: n.href,
                    target: n.target ? n.target : null,
                    rel: n.rel ? n.rel : null
                }), p.select(a)) : e.insertContent(h.createHTML("a", {
                    href: n.href,
                    target: n.target ? n.target : null,
                    rel: n.rel ? n.rel : null
                }, n.text)) : e.execCommand("mceInsertLink", !1, {
                    href: n.href,
                    target: n.target,
                    rel: n.rel ? n.rel : null
                }), void 0) : (e.execCommand("unlink"), void 0)
            }
        })
    }
    e.addButton("link", {
        icon: "link",
        tooltip: "Insert/edit link",
        shortcut: "Ctrl+K",
        onclick: t,
        stateSelector: "a[href]"
    }), e.addButton("unlink", {
        icon: "unlink",
        tooltip: "Remove link(s)",
        cmd: "unlink",
        stateSelector: "a[href]"
    }), e.addShortcut("Ctrl+K", "", t), this.showDialog = t, e.addMenuItem("link", {
        icon: "link",
        text: "Insert link",
        shortcut: "Ctrl+K",
        onclick: t,
        stateSelector: "a[href]",
        context: "insert",
        prependToContext: !0
    })
});