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
        this.top = 0;
        this.left = 0;
    }

    BarrelGallery.prototype = {
        init: function(imgs) {
            this.append(imgs);
        },

        append: function(data) {
            var i, item, itemWidth, len, ratio;
            
            for (i = 0, len = data.length; i < len; i++) {
                ratio = data[i].width / data[i].height;
                itemWidth = this.minHeight * ratio;
                item = createItem(data[i].src);
                this.container.appendChild(item);
                
                this.left += this.padding;
                setItem(item, {
                    top: this.top,
                    left: this.left,
                    width: itemWidth,
                    height: this.minHeight
                });
                this.left += itemWidth;
    
                if (this.left > this.width) {
                    this.left -= itemWidth - this.padding;

                    this.renderRow();

                    setItem(item, {
                        top: this.top,
                        left: this.left
                    });
                    this.container.style.height = this.top + this.minHeight + this.padding + 'px';
                    this.lastRowItems = [];
                    this.left += itemWidth;
                }

                this.lastRowItems.push({
                    item: item,
                    ratio: ratio
                });
            }
        },

        renderRow: function() {
            var rowLen = this.lastRowItems.length,
                ratio = this.calcRatio(this.width - this.padding * rowLen, this.left - this.padding * rowLen),
                rowHeight = ratio * this.minHeight,
                items = this.lastRowItems,
                i, widthArr = [];

            this.top += rowHeight + this.padding;
            this.left = this.padding;
            for (i = 0; i < rowLen; i++) {
                items[i].item.style.height = rowHeight + 'px';
                widthArr.push(Math.ceil(items[i].ratio * rowHeight));
            }

            this.renderItem(widthArr);
        },

        // 去除浮点数运算造成的尾部不对齐
        renderItem: function(widthArr) {
            var i, offset, tmp, len = widthArr.length,
                items = this.lastRowItems,
                left = this.padding,
                rowWidth = widthArr.reduce(function(x, y) {
                return x + y;
            }, 0);

            if (rowWidth + this.padding * len !== this.width) {
                offset = this.width - rowWidth - this.padding * len;
                tmp = offset > 0 ? Math.ceil(offset / len) : Math.floor(offset / len);

                for (i = 0; offset > tmp; i++) {
                    setItem(items[i].item, {
                        left: left,
                        width: widthArr[i] + tmp
                    });
                    left += widthArr[i] + tmp + this.padding;
                    offset -= tmp;
                }

                setItem(items[i].item, {
                    left: left,
                    width: widthArr[i] + offset
                });
            }
        },

        calcRatio: function(current, origin) {
            return current / origin;
        }
    }

    // 设置元素的position和宽高
    function setItem(item, opt) {
        if (opt.top !== undefined) item.style.top = opt.top + 'px';
        if (opt.left !== undefined)item.style.left = opt.left + 'px';
        if (opt.width !== undefined) item.style.width = opt.width + 'px';
        if (opt.width !== undefined) item.style.height = opt.height + 'px';
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
        }, 'items.json');

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
                    }, 'items.json');
                }, 2000);
            }
        });
    });
})();
