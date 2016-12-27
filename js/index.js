var leftArea = document.getElementById("leftArea");
var nav = document.getElementById("nav");
var docInnerarea = document.getElementById("docInnerarea");
var data = datas.files;
var treeInitId = -1;
var checkAll = document.getElementById("checkAll");
var tipBox = document.getElementById("tipBox");
var tipTop = document.getElementById("tipTop");
var chooseWin = document.getElementById("chooseWin");
var confirmWin = document.getElementById("confirmWin");


function creatTreeById(data, id) {
    var childs = fn.getChildsById(data, id);
    var html = '';
    html += '<ul>';
    childs.forEach(function(value) {
        var parentPadding = fn.getParentById(data, value.id).length *
            20 - 20;
        html += '<li><div data-id=' + value.id +
            ' class="tree-title"><span style="padding-left:' +
            parentPadding + 'px">' + value.title + '</span></div>'

        html += creatTreeById(data, value.id);

        html += '</li>'
    })
    html += '</ul>';
    return html;
}

leftArea.innerHTML = creatTreeById(data, treeInitId);

function creatNav(data, id) {
    var str = '';
    fn.getParentById(data, id).reverse().forEach(function(value) {
        str += '<span data-id = "' + value.id + '">' + value.title +
            '</span><strong>></strong>';
    })
    return str.substr(0, str.length - 14);
}
nav.innerHTML = creatNav(data, 0);

function creaDoc(data, id) {
    var arr = fn.getChildsById(data, id);
    var html = '';
    arr.forEach(function(value) {
        html += '<div class="doc-title" data-id="' + value.id +
            '"><em class="docCheck"></em><i></i><span>' + value.title +
            '</span><input type="text" value="" class="docText"/></div>'
    })
    return html;
}
docInnerarea.innerHTML = creaDoc(data, 0)

var curtId = 0;

//-------------------------------------------tree区域点击进入下一级或者选中---------------------------------------------------
leftArea.addEventListener('click', function(e) {
    var target = e.target;
    if (t.parents(target, '.tree-title')) {
        t.parents(target, '.tree-title').style.backgroundColor =
            '#e1e8ee';
        renderById(t.parents(target, '.tree-title').dataset.id);
    }
}, false)

//-------------------------------------------nav区域点击进入下一级或者选中---------------------------------------------------
spansNav = nav.getElementsByTagName('span');
nav.onclick = function(e) {
        if (e.target.nodeName == 'SPAN') {
            renderById(e.target.dataset.id);
        }
    }
    //-------------------------------------------doc区域点击进入下一级或者选中-----------------------------------------------------------------------
docInnerarea.onmouseup = function(e) {
    var target = e.target;
    if (t.parents(target, '.docCheck')) { //选中
        target = t.parents(target, '.docCheck');
        t.toggleClass(target, 'docChecked');
        t.toggleClass(t.parents(target, '.doc-title'), 'selected')
        checkFn();
    } else if (t.parents(target, '.doc-title') && target.nodeName !=
        'INPUT' && !onoff && !onoff2) { //进入下一级
        target = t.parents(target, '.doc-title')
        renderById(target.dataset.id);
    }
}
checkAll.addEventListener('click', function() {
        var divs = document.querySelectorAll("#docInnerarea .doc-title");
        if (!divs.length) {
            return;
        };
        var bl = t.toggleClass(this, 'checked');
        var checkBoxs = document.querySelectorAll("#docInnerarea .docCheck");
        divs = Array.from(divs);
        divs.forEach(function(value, index) {
            if (bl) {
                t.addClass(checkBoxs[index], 'docChecked');
                t.addClass(divs[index], 'selected');
            } else {
                t.removeClass(checkBoxs[index], 'docChecked');
                t.removeClass(divs[index], 'selected');
            }
        });
    })
    //-------------------------------------------新建文件夹-采用insertBefore方式--------------------------------------------------------------------------
var funcArea = document.getElementById("funcArea");
var funcBtns = document.querySelectorAll("#funcArea ul li");
var intiId = 10000; //新建文件夹的初始id，每次加加
funcBtns[5].onmouseup = function() {
        if (onoff || onoff2) {
            return;
        }
        var inp = document.createElement("input");
        inp.type = 'text';
        inp.className = 'docInp';
        var span = document.createElement("span");
        var div = document.createElement("div");
        div.innerHTML = '<em class="docCheck"></em><i></i>';
        div.className = 'doc-title';
        div.dataset.id = intiId;
        div.appendChild(span);
        div.appendChild(inp);
        docInnerarea.insertBefore(div, docInnerarea.firstElementChild);
        inp.focus();
        var obj = {};
        checkBack();
        inp.onblur = function() {
            if (inp.value.trim()) {
                if (fn.findExisted(data, curtId, 'title', inp.value.trim())) {
                    docInnerarea.removeChild(div);
                    checkBack();
                    tipTopFn('warning', '有同名文件！')
                    checkFn();
                    return;
                }
                obj.id = intiId;
                obj.pid = curtId;
                obj.title = inp.value.trim();
                span.innerHTML = inp.value.trim();
                inp.style.display = 'none';
                fn.addData(data, obj);
                leftArea.innerHTML = creatTreeById(data, treeInitId);
                checkFn();
                intiId++;
            } else {
                docInnerarea.removeChild(div);
                checkBack();
                checkFn();
            }
            inp.onblur = null;
        }
    }
    //---------------------------------------------框选部分--------------------------------------------------------------
docInnerarea.addEventListener('mousedown', function(e) {
    if (!t.parents(e.target, '.docCheck')) {
        if (!t.parents(e.target, '.doc-title') || !t.hasClass(t.parents(
                e.target, '.doc-title'), 'selected')) {
            lef = e.clientX;
            topp = e.clientY;
            onoff = true;
            faLef = docInnerarea.getBoundingClientRect().left;
            faTop = docInnerarea.getBoundingClientRect().top;
            p = document.createElement("p");
            p.style.position = 'absolute';
            p.style.margin = 0;
            p.style.backgroundColor = 'tan';
            p.style.opacity = 0.3;
            divs = docInnerarea.getElementsByClassName('doc-title');
            checkBoxs = docInnerarea.getElementsByClassName('docCheck');
        }
    }
}, false);
docInnerarea.addEventListener('mousemove', function(e) {
    seleBoxMove(e);
}, false);
document.addEventListener('mouseup', function deleMoveFn(e) {
        if (onoff) {
            if (!p.style.width) {
                if (t.parents(e.target, '.doc-title')) {
                    renderById(t.parents(e.target, '.doc-title').dataset.id);
                }
                onoff = false;
                return;
            }
            docInnerarea.removeChild(p);
            p = null;
            onoff = false;
            docInnerarea.removeEventListener('mousedown', seleBoxMove);
            checkFn();
            //			document.removeEventListener('mouseup', deleMoveFn);
        }
    })
    //---------------------------------------------删除部分--------------------------------------------------------------
funcBtns[4].addEventListener('mouseup', function() {
    if (onoff || onoff2) {
        return;
    }
    var selecteds = docInnerarea.querySelectorAll(".selected");
    if (!selecteds.length) {
        tipTopFn('warning', '请选择你要删除的内容！')
        return;
    }
    dialog({
        'title': '删除文件',
        'content': '确定删除文件？',
        'fn1': function() {
            selecteds = Array.from(selecteds);
            var idArr = [];
            selecteds.forEach(function(value, index) { //dom中删除
                idArr.push(value.dataset.id);
                docInnerarea.removeChild(selecteds[
                    index]);
                leftArea.innerHTML = creatTreeById(
                    data, treeInitId);
            });
            data = fn.removeData(data, idArr);
            leftArea.innerHTML = creatTreeById(data,
                treeInitId);
            checkFn();
            checkBack();
            tipTopFn('success', '删除成功！')
        },
        'fn2': null
    });

});
//---------------------------------------------重命名部分-----------------------------------------------------------
funcBtns[3].addEventListener('mouseup', function() {
    if (onoff || onoff2) {
        return;
    }
    var selecteds = docInnerarea.querySelectorAll(".selected");
    if (selecteds.length != 1) {
        tipTopFn('warning', '请选择一个文件重命名！')
        return;
    }
    selected = selecteds[0];
    var inp = selected.querySelector("input");
    var span = selected.querySelector("span");
    inp.value = span.innerHTML;
    inp.style.display = 'block';
    inp.focus();
    inp.onblur = function() {
        if (inp.value.trim()) {
            if (fn.findExisted(data, curtId, 'title', inp.value.trim())) {
                inp.style.display = 'none';
                if (span.innerHTML === inp.value.trim()) {
                    return;
                }
                tipTopFn('warning', '有同名文件！')
                return;
            }
            span.innerHTML = inp.value.trim();
            fn.changeData(data, selected.dataset.id, 'title', inp.value
                .trim());
            inp.style.display = 'none';
            leftArea.innerHTML = creatTreeById(data, treeInitId);
            checkFn();
            tipTopFn('success', '重命名成功！')
        } else {
            tipTopFn('warning', '重命名失败！')
            inp.style.display = 'none';
            checkFn();
        }
    }
});
//---------------------------------------移动到-------------------------------------------------------------------
funcBtns[2].addEventListener('mouseup', function() {
    if (onoff || onoff2) {
        return;
    }
    var selecteds = docInnerarea.querySelectorAll(".selected");
    var targetId = 0;
    var moveAble = true;
    if (!selecteds.length) {
        tipTopFn('warning', '请选择要操作的文件');
        return;
    }
    dialog({
        'title': '选择你要移动到的文件夹',
        'content': creatTreeById(data, treeInitId),
        'fn1': function() {
            if (moveAble) {
                return true;
            }
        }
    });
    var divs = mask.querySelectorAll('ul li div');
    var inp1 = document.querySelector('#mask input');
    var span3 = document.querySelector('#span3');
    var last = null;
    for (var i = 0; i < divs.length; i++) {
        last = divs[i].dataset.id == curtId ? divs[i] : last;
    }
    var selIdArr = [];
    var selNames = [];
    for (var i = 0; i < selecteds.length; i++) {
        selIdArr.push(selecteds[i].dataset.id);
        selecteds.moveAbleSingle = true;
        selNames.push(fn.getSelfById(data, selecteds[i].dataset.id).title)
    };
    for (var i = 0; i < divs.length; i++) {
        divs[i].maskMoveOnoff = true;
        divs[i].index = i;
        var targetId = Infinity;
        divs[i].addEventListener('mouseover', function() {
            this.style.backgroundColor = '#e1e8ee';
        })
        divs[i].addEventListener('mouseout', function() {
            if (this.maskMoveOnoff) {
                this.style.backgroundColor = '#fff';
            }
        })
        divs[i].addEventListener('mouseup', function() {
            divs[last].style.backgroundColor = '#fff';
            divs[last].maskMoveOnoff = true;
            this.maskMoveOnoff = false;
            this.style.backgroundColor = '#e1e8ee';
            last = this.index;
            targetId = this.dataset.id;
            if (targetId == curtId) {
                moveAble = false;
                span3.innerHTML = '目标文件夹已包含该文件1';
            } else {
                var selChilsArr = fn.getAllChildsByIdArr(data,
                    selIdArr);
                moveAble = true;
                span3.innerHTML = '';
                selChilsArr.forEach(function(value) {
                    if (targetId == value.id) {
                        moveAble = false;
                        span3.innerHTML =
                            '目标文件夹为选中文件夹的子文件夹';
                    }
                });
            }
        })
    };
    last = last.index;
    divs[last].style.backgroundColor = '#e1e8ee';
    divs[last].maskMoveOnoff = false;
    inp1.addEventListener('mouseup', function() {
        if (moveAble) {
            var childsNames = fn.getChildsById(data, targetId);
            for (var i = 0; i < selNames.length; i++) {
                if (childsNames.length) {
                    for (var j = 0; j < childsNames.length; j++) {
                        if (childsNames[j].title == selNames[i]) {
                            tipTopFn('warning', '有部分文件重名');
                            selecteds[i].moveAbleSingle = false;
                            break;
                        } else {
                            selecteds[i].moveAbleSingle = true;
                        }
                    }
                } else {
                    selecteds[i].moveAbleSingle = true;
                }
            }
            for (var i = 0; i < selecteds.length; i++) {
                if (selecteds[i].moveAbleSingle) {
                    docInnerarea.removeChild(selecteds[i]);
                    fn.changeData(data, selecteds[i].dataset.id,
                        'pid', targetId);
                    leftArea.innerHTML = creatTreeById(data,
                        treeInitId);
                }
            }
        }
    })
    checkFn();
    checkBack();
});



//---------------------------------------拖动移动到------------------------------------------------------------------
var divFake = null;
var onoff2 = false; //拖动开关
docInnerarea.addEventListener('mousedown', function(e) {
    if (t.parents(e.target, '.doc-title') && !t.parents(e.target,'.docChecked')) {
        var selecteds = docInnerarea.querySelectorAll('.selected');
        if (t.hasClass((t.parents(e.target, '.doc-title')), 'selected')) {
            onoff2 = true;
            lef = e.clientX;
            topp = e.clientY;
            faLef = docInnerarea.getBoundingClientRect().left;
            faTop = docInnerarea.getBoundingClientRect().top;
            divFake = document.createElement('div');
            divFake.id = 'divFake';
            divFake.style.cssText =
                'margin:0;position:absolute;width:20px;height:20px;background-color:red;left:' +
                (lef - faLef + 10) + 'px;top:' + (topp - faTop + 10) +
                'px;';
            divFake.innerHTML = selecteds.length;
            docInnerarea.appendChild(divFake);
        }
    }
}, false);
docInnerarea.addEventListener('mousemove', function(e) {
    var divFake = document.getElementById('divFake');
    if (onoff2) {
        divFake.style.left = e.clientX - faLef + 10 + 'px';
        divFake.style.top = e.clientY - faTop + 10 + 'px';
    }
}, false);
document.addEventListener('mouseup', function(e) {
        if (onoff2) {
            onoff2 = false;
            docInnerarea.removeChild(divFake);
            if (t.parents(e.target, '.doc-title') && !t.hasClass(t.parents(
                    e.target, '.doc-title'), 'selected')) {
                var selecteds = docInnerarea.querySelectorAll('.selected');
                // docInnerarea.removeEventListener('mousedown', seleBoxMove);
                targetId = t.parents(e.target, '.doc-title').dataset.id;
                for (var i = 0; i < selecteds.length; i++) {
                    docInnerarea.removeChild(selecteds[i]);
                    fn.changeData(data, selecteds[i].dataset.id, 'pid',
                        targetId);
                    leftArea.innerHTML = creatTreeById(data, treeInitId);
                }
                checkFn();
            }
        }
    })
    //---------------------------------------封装函数区域---------------------------------------------------------------
function checkFn() { //检测全选
    var divs = docInnerarea.getElementsByClassName('doc-title');
    divs = Array.from(divs);
    if (!divs.length) {
        t.removeClass(checkAll, 'checked');
        return;
    }
    var bl = (divs.every(function(value) {
        return t.hasClass(value, 'selected');
    }))
    if (bl) {
        t.addClass(checkAll, 'checked')
    } else {
        t.removeClass(checkAll, 'checked')
    }
}

function checkBack() { //检查是否为空，所以加不加背景
    if (docInnerarea.firstElementChild) {
        t.removeClass(docInnerarea, 'empt');
    } else {
        t.addClass(docInnerarea, 'empt');
    }
}

function renderById(id) { //根据id渲染
    findTreeTitleById(curtId).style.backgroundColor = '';
    nav.innerHTML = creatNav(data, id);
    findTreeTitleById(id).style.backgroundColor = '#e1e8ee';
    docInnerarea.innerHTML = creaDoc(data, id);
    t.removeClass(checkAll, 'checked')
    if (docInnerarea.firstElementChild) {
        t.removeClass(docInnerarea, 'empt');
    } else {
        t.addClass(docInnerarea, 'empt');
    }
    t.removeClass(checkAll, 'checked');
    curtId = id;
}

function findTreeTitleById(id) {
    var divs = document.querySelectorAll("#leftArea ul li div");
    for (var i = 0; i < divs.length; i++) {
        if (divs[i].dataset.id == id) {
            return divs[i];
        }
    }
}
var p = null;
var onoff = false; //框选开关
var divs = null;
var checkBoxs = null;

function seleBoxMove(e) { //框选时的鼠标移动函数
    if (onoff == true) {
        p.style.width = (e.clientX - lef) > 0 ? (e.clientX - lef) + 'px' : (lef -
            e.clientX) + 'px';
        p.style.height = (e.clientY - topp) > 0 ? (e.clientY - topp) + 'px' : (
            topp - e.clientY) + 'px';;
        p.style.left = (e.clientX - lef) > 0 ? lef - faLef + 'px' : e.clientX -
            faLef + 'px';
        p.style.top = (e.clientY - topp) > 0 ? topp - faTop + 'px' : e.clientY -
            faTop + 'px';
        docInnerarea.appendChild(p);
        var posi1 = p.getBoundingClientRect();
        for (var i = 0; i < divs.length; i++) {
            var posi2 = divs[i].getBoundingClientRect();
            if (posi1.right < posi2.left || posi1.left > posi2.right || posi1.bottom <
                posi2.top || posi1.top > posi2.bottom) {
                t.removeClass(divs[i], 'selected');
                t.removeClass(checkBoxs[i], 'docChecked');
            } else {
                t.addClass(divs[i], 'selected');
                t.addClass(checkBoxs[i], 'docChecked');
            }
        }

    }
}


function tipTopFn(attr, str) { // 顶部弹窗函数，可根据参数改变icon，内容
    if (attr === 'warning') {
        tipTop.className = 'warning';
    }
    if (attr === 'success') {
        tipTop.className = 'success';
    }
    tipTop.innerHTML = '<i></i>' + str;
    tipTop.style.transition = '0s';
    tipTop.style.top = '-40px';
    setTimeout(function() {
        tipTop.style.transition = '0.3s';
        tipTop.style.top = 0;
    }, 0)
    clearInterval(tipTop.timer);

    tipTop.timer = setTimeout(function() {
        tipTop.style.top = '-40px';
    }, 2000)

}


function dialog(obj) {
    var mask = document.getElementById('mask');
    if (mask) {
        document.body.removeChild(mask);
    }
    var mask = document.createElement('div');
    mask.id = 'mask';
    mask.style.cssText =
        'width:100%;height:100%;background-color:rgba(0,0,0,0.5);position:absolute;left:0;top:0;z-index:100';
    var tanBox = document.createElement('div');
    tanBox.style.cssText =
        'width:500px;margin-left:-250px;border:1px solid black;border-radius:2px;background:white;position:absolute;left:50%;top:50%;z-index:101;opacity:1;';
    var span1 = document.createElement('span');
    span1.innerHTML = obj.title;
    var span2 = document.createElement('span');
    span2.innerHTML = obj.content;
    span2.style.margin = '20px auto'
    span1.style.display = 'block'
    span2.style.display = 'block'
    var inp1 = document.createElement("input");
    inp1.type = 'button';
    inp1.value = '确定';
    inp1.addEventListener('mouseup', function() {
        if (obj.fn1()) {
            document.body.removeChild(mask);
        };
    });
    var inp2 = document.createElement("input");
    inp2.type = 'button';
    inp2.value = '取消';
    inp2.onclick = obj.fn2 || function() {
        document.body.removeChild(mask);
    }
    var span3 = document.createElement('span');
    span3.innerHTML = obj.warning || '';
    span3.id = 'span3';
    span3.innerHTML = '123';
    tanBox.appendChild(span1);
    tanBox.appendChild(span2);
    tanBox.appendChild(inp1);
    tanBox.appendChild(inp2);
    tanBox.appendChild(span3);
    mask.appendChild(tanBox);
    document.body.appendChild(mask);
}
