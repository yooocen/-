var jQuery = require('jquery');
(function ($) {
    function ColHeaderFilter(options) {
        var opts, id,
            $container, $txtSearch,
            $chkAll, $allChks, $optionChks, $btnQuery;
        var defaults = {
            args: {},
            filterField: "",
            filterTitle: "",
            getFilterText: null,
            showFilterText: null,
            showFilterCheckbox: false
        }
        function init() {
            id = "spread-filter-container-" + Date.now();
            opts = $.extend(true, {}, defaults, options || {});
            if (!opts.filterField) {
                throw "you must specify filter field";
            }
            constructHtml();
            cacheDomObjs();
            setContainerPos();
            bindEvent();
        }
        function destroy() {
            unBindEvent();
            var sheet = opts.args.sheet;
            var grid = sheet && sheet.getGrid();
            if (grid && grid._colHeaderFilter) {
                delete grid._colHeaderFilter;
            }
            id = null;
            opts = null;
            defaults = null;
            $container.remove();
            $container = $txtSearch = $chkAll = $allChks = $optionChks = $btnQuery = null;
        }
        function getCellValue(row, col, grid) {
            var cellVal, item = grid.getItem(row);
            if (opts.getFilterText) {
                cellVal = opts.getFilterText({ row: row, col: col, grid: grid })
            } else {
                cellVal = item && item[opts.filterField];
            }
            return cellVal;
        }
        function getUniqueList(sheet) {
            var grid = sheet.getGrid();
            var col = opts.args.col;
            var list = [], row, args;
            var node, item, cellVal;
            for (row = 0; row < sheet.getRowCount(); row++) {
                node = grid.getNode(row);
                item = grid.getItem(row);
                if (isHide(node, item) || node.hasChildren()) {
                    continue;
                }
                cellVal = getCellValue(row, col, grid);
                //指定的字段取不到值
                if (utils.isNullOrUndefined(cellVal)) {
                    continue;
                }
                cellVal = $.trim(cellVal);
                //去重
                if (list.contains(cellVal)) {
                    continue;
                }
                list.push(cellVal);
            }
            return list;
        }
        function constructHtml() {
            var sheet = opts.args.sheet;
            if (!sheet) return;
            var tmpl = [];
            tmpl.push("<div id='", id, "'class='spread-filter-container'>");


            /**/tmpl.push("<div class='spread-filter-searchpanel' style='display:'", (opts.showFilterText ? 'block' : 'none'), "'>");
            /*****/tmpl.push("<input type='text' class='spread-filter-txtsearch' placeholder='", opts.filterTitle, "'/>");
            /**/tmpl.push("</div>");

            /**/tmpl.push("<div class='spread-filter-multiselectpanel' style='display:", (opts.showFilterCheckbox ? 'block' : 'none'), "'>");
            var optionsList = getUniqueList(sheet);
            /*****/tmpl.push("<div class='spread-filter-itempanel'>");
            /********/tmpl.push("<div class= 'spread-filter-chkpanel'>");
            /**********/tmpl.push("<input type='checkbox' id='chkAll' class'spread-filter-chkall spread-filter-chk' checked='checked'/>");
            /********/tmpl.push("</div>");
            /********/tmpl.push("<div class='spread-filter-optionpanel'>");
            /**********/tmpl.push("<label for='chkAll' class='spread-filter-label'>", "全选", "</label>");
            /********/tmpl.push("</div>");
            /*****/tmpl.push("</div>");
            for (var i = 0; i < optionsList.length; i++) {
                /**/tmpl.push("<div class='spread-filter-chkpanel'>");
                /*****/tmpl.push("<div class='spread-filter-itempanel'>");
                /********/tmpl.push("<input type='checkbox' id='", "chk" + i, "class='spread-filter-chk' option='", optionsList[i], "'checked='checked'/>");
                /*****/tmpl.push("</div>");
                /*****/tmpl.push("<div class='spread-filter-optionpanel' title='", optionsList[i], "'>");
                /********/tmpl.push("</div>");
                /**/tmpl.push("</div>")
            }
            /**/tmpl.push("</div>");

            /**/tmpl.push("<div class='spread-filter-buttonpanel'>");
            /*****/tmpl.push("<a href='javascript:void(0)' class=spread-filter-btn'>", "查询", "</a>");
            /**/tmpl.push("</div>");


            tmpl.push("</div>");

            $(document.body).append(tmpl.join(''));
        }
        function onlyShowFilterText() {
            return (opts.showFilterText && !opts.showFilterCheckbox);
        }
        function bindEvent() {
            $txtSearch.bind('keyup', function (e) {
                if (e.keyCode === $.ui.keyCode.LEFT ||
                    e.keyCode === $.ui.keyCode.RIGHT ||
                    e.keyCode === $.ui.keyCode.UP ||
                    e.keyCode === $.ui.keyCode.DOWN
                    /*还有好多的*/) {
                    return false;
                }
                if (onlyShowFilterText()) {
                    return true;
                }

                //模糊搜索 ， 全部转为大写，去掉首尾空白符号
                var searchText = $.trim($(this).val().toUpperCase());
                var optVal;
                $optionChks.each(function () {
                    optVal = $(this).attr('option').toUpperCase();
                    if (optVal.indexOf(searchText) === -1) {
                        $(this).parent().parent().hide();
                    } else {
                        $(this).parent().parent().show();
                    }
                })
            })
            $chkAll.bind('change', function (e) {
                if (onlyShowFilterText()) {
                    return false;
                }
                if ($chkAll.is(".checked")) {
                    $optionChks.attr("checked", true);
                    $btnQuery.removeClass("disabled");
                } else {
                    $optionChks.removeAttr("disabled");
                    $btnQuery.addClass("disabled");
                }
            });
            $optionChks.bind("change", function (e) {
                if (onlyShowFilterText()) {
                    return false;
                }
                var checkedChks = [];
                var visibleChks = [];
                $optionChks.each(function () {
                    if ($(this).is('visible')) {
                        visibleChks.push($(this));
                        if ($(this).is(":checked")) {
                            checkedChks.push($(this));
                        }
                    }
                });
                if (checkedChks.length === visibleChks.length) {
                    $chkAll.attr("checked", true);
                } else {
                    $chkAll.removeAttr("checked");
                }
                if (checkedChks.length > 0) {
                    $btnQuery.removeClass("disabled");
                } else {
                    $btnQuery.addClass("disabled");
                }
            });
            $btnQuery.bind('click', function (e) {
                if ($btnQuery.hasClass("disabled")) {
                    return false;
                }
                var options = [], optVal;
                var searchText = $.trim($txtSearch.val().toUpperCase());
                $optionChks.each(function () {
                    if (onlyShowFilterText()) {
                        optVal = $(this).attr('option').toUpperCase();
                        if (optVal(optVal.indexOf(searchText) !== -1)) {
                            options.push($(this).attr('option'));
                        }
                    } else {
                        if ($(this).is(':checked') && $(this).is(':visible')) {
                            options.push($(this).attr('option'));
                        }
                    }
                })
                handleSearch(function (text) {
                    return options.contains(text);
                });
                destroy()
            })
            $(document.body).bind('click', onDocClick());

        }
        function unBindEvent(){
            $txtSearch.unbind();
            $chkAll.unbind();
            $optionChks.unbind();
            $btnQuery.unbind();
            $(document.body).unbind('click',onDocClick());
        }
        function onDocClick(){
            var target = $(e.target);
            var id = String(target.attr('id'));
            var cls = String(target.attr('class'));
            if(id.indexOf('vp_vp'==-1 && cls.indexOf('spread-filter')==-1)){
                destroy();
            }
        }
        function isHide(){
            return !node || !item || node.isHide || item.isHide;
        }
        function handleSearch(condition){
            var col = opts.args.col;
            var sheet = opts.args.sheet;
            var grid = sheet.getGrid();
            var row , node , item, children , i , childNode, isParentNodeShow , isNodeShow;
            grid.suspendPaint();
            for(row = sheet.getRowCount(); row>=0; row--){
                node = grid.getNode(row);
                item = getItem(row);
                if(isHide(node,item)){
                    continue;
                }
                //中间节点
                if(node.hasChildren()){
                    children = node.children;
                    isParentNodeShow = false;
                    for(i = 0 ; i <children.length ; i++){
                        childNode = children[i];
                        //跳过收缩隐藏节点
                        if(isHide(childNode,childNode.data)){
                            continue;
                        }
                        //只要有一个子节点显示，则父节点就要显示
                        if(!childNode.filterField){
                            isParentNodeShow = true;
                            break;
                        }
                    }
                    node.filterHide = !isParentNodeShow;
                    sheet.setRowVisible(node.index,isParentNodeShow);
                }
                //叶子节点
                else{
                    if(node.collapsed){
                        continue;
                    }
                    isNodeShow = condition && condition(getCellValue(row,col,grid));
                    //符合条件就展示
                    node.filterHide = !isNodeShow;
                    sheet.setRowVisible(node.index, isNodeShow);
                }
            }
            grid.resumePaint();
        }
        function setContainerPos(){
            var args = opts.args;
            var sheet =args.sheet;
            var offset = $(sheet.getGrid().getContainer()).offset();
            var left = offset.left;
            var top = offset.top;
            var rect = args.cellRect;
            $container.css({
                width:rect.width + 'px',
                position: 'absolute',
                left: (left+rect.x)+ 'px',
                top: (top+rect.y+rect.height+2)+'px'
            });
            $txtSearch.width(rect.width -4 -6);
            $container.find('.spread-filter-label').width(rect.width -25);
        }
        function getCol(){
            return opts.args.col;
        }
        init();
        return {
            destroy: destroy,
            getCol: getCol
        }
    }
    module.export = ColHeaderFilter;
})(jQuery)