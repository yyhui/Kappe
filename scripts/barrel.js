;(function() {
    'use strict'
    function BarrelGallery(opt) {
        var opt = opt || {
            containerSel: '.gallery',   // 容器选择器
            rowCName: 'row',    // 设定行的Class Name
            maxNum: 6,  // 每行最多几张图片
            minHeight: 250, // 最小的行高
            padding: 10 // 行内元素之间的间隔，css中设置margin-left
        };

        this.container = document.querySelector(opt.containerSel);
        this.width = this.container.clientWidth;

        this.rowClassName = opt.rowCName;
        this.maxNum = opt.maxNum;
        this.minHeight = opt.minHeight;
        this.padding = opt.padding;
        this.lastRowItems = [];
    }

    BarrelGallery.prototype = {
        init: function(imgs) {
            this.append(imgs);
        },

        newRow: function() {
            var row = document.createElement('div');
            row.className = this.rowClassName;
            this.container.appendChild(row);
            return row;
        },

        renderRow: function(row, items, ratio) {
            var height = this.minHeight * ratio,
                elem;

            row.style.height = height + 'px';
            row.innerHTML = '';
            for (var i = 0, len = items.length; i < len; i++) {
                elem = createItem(items[i].src);
                elem.style.width = items[i].ratio * height + 'px';
                row.appendChild(elem);
            }
        },

        append: function(photos) {
            var elem, currentW, rowWidth = 0, count = 1, photo, row, ratio;
            
            if (this.lastRowItems.length > 0) {
                count = this.lastRow.children.length;
                rowWidth += this.lastRowWidth;
                row = this.lastRow;
            } else {
                row = this.newRow();
            }

            for (; photo = photos.shift(); count ++) {
                currentW = this.minHeight * photo.ratio;
                rowWidth += currentW + this.padding;

                if (rowWidth > this.width) {
                    rowWidth = rowWidth - currentW - this.padding * count;
                    ratio = (this.width - this.padding * (count - 1)) / rowWidth;
                    this.renderRow(row, this.lastRowItems, ratio);

                    row = this.newRow();
                    this.lastRowItems = [];
                    rowWidth = currentW + this.padding;
                    count = 1;
                }
                this.lastRowItems.push(photo);
            }

            this.renderRow(row, this.lastRowItems, 1);
            this.lastRow = row;
            this.lastRowWidth = rowWidth;
        }
    }
    
    // 创建行内的元素，用图片填满，并且保持图片宽高比
    function createItem(src) {
        var item = document.createElement('div'),
            elem = document.createElement('img'),
            detail = document.createElement('div');

        item.className = 'photo';
        elem.src = src;
        item.appendChild(elem);
        detail.innerHTML = '<h3>Cool App Design</h3><p>development, mobile</p><div></div>';
        detail.className = 'detail';
        item.appendChild(detail);

        return item;
    }

    addLoadEvent(function() {
        var gallery = new BarrelGallery(),
            loading = document.querySelector('.loading'),
            flag = false;
        
        getNewContent(function(arr) {
            gallery.init(choice(arr));
        }, 'img.json');

        window.addEventListener('scroll', function() {
            if (load()) {
                if (flag) return;
                flag = true;
                loading.style.display = 'block';
                setTimeout(function() {
                    getNewContent(function(arr) {
                        gallery.append(choice(arr));
                        loading.style.display = 'none';
                        flag = false;
                    }, 'img.json');
                }, 2000);
            }
        });
    });
})();
