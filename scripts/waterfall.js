;(function() {
    'use strict'
    function Waterfall(opt) {
        var opt = opt || {
            container: '.waterfall',
            cols: 4,
            padding: 20
        };

        this.container = document.querySelector(opt.container);
        this.colNum = opt.cols;
        this.padding = opt.padding;
        this.colWidth = (this.container.clientWidth - (this.colNum - 1) * this.padding) / this.colNum;
        this.containerH = 0;
        this.colTopArr = [0];
        this.colLeftArr = [0];
        for (var i = 1; i < this.colNum; i++) {
            this.colTopArr[i] = 0;
            this.colLeftArr[i] = this.colWidth * i + this.padding * i;
        }
    }

    Waterfall.prototype = {
        append: function(data) {
            var i = 0, len = data.length;

            for (; i < len; i++) {
                this.addItem(data[i], findMinIndex(this.colTopArr));
                this.container.style.height = this.getMaxColHeight() + 'px';
            }
        },
        
        addItem: function(dataItem, index) {
            var item = new Item(dataItem);
            item.item.style.top = this.colTopArr[index] + 'px';
            item.item.style.left = this.colLeftArr[index] + 'px';
            item.item.style.width = this.colWidth + 'px';

            this.container.appendChild(item.item);
            this.setColHeight(dataItem, item, index);
        },

        setColHeight: function(dataItem, item, index) {
            if (dataItem.type === 1) {
                this.colTopArr[index] += item.getItemHeight() + dataItem.height * (this.colWidth / dataItem.width) + this.padding;
            } else {
                this.colTopArr[index] += item.getItemHeight() + this.padding;
            }
        },

        getMaxColHeight: function() {
            return Math.max.apply(Math, this.colTopArr);
        }
    }

    function findMinIndex(arr) {
        var i = 1, len = arr.length, index = 0, item = arr[0];
        for (; i < len; i++) {
            if (item > arr[i]) {
                item = arr[i];
                index = i;
            }
        }
        return index;
    }

    function Item(dataItem, opt) {
        var opt = opt || {
            itemCName: 'blog-item', // item最外层ClassName
            imgCName: 'img-wrapper',    // 包裹img的ClassName
            itemInfo: 'item-info',  // 主内容ClassName
            info: 'info'    // 主内容里的评论日期行ClassName
        }
            
        this.item = document.createElement('div');
        switch(dataItem.type) {
            case 1:
                this.createBlogItem(dataItem, opt);
                break
            case 2:
                this.createLinkItem();
                break;
            case 3:
                this.createAsideItem();
                break;
            case 4:
                this.createQuoteItem();
        }
    }

    Item.prototype = {
        createBlogItem: function(dataItem, opt) {
            var imgWrapper = document.createElement('div'),
                img = document.createElement('img'),
                info = document.createElement('div');
    
            this.item.className = opt.itemCName;
    
            imgWrapper.className = opt.imgCName;
            img.src = dataItem.src;
            imgWrapper.appendChild(img);
            this.item.appendChild(imgWrapper);
    
            this.itemInfo = document.createElement('div');
            this.itemInfo.className = opt.itemInfo;
            this.itemInfo.innerHTML = '<h4>Gallery Post Example</h4><p>A man who works with his hands is a laborer, a man who works with his hand s and his brain is a craftsam; but a man who</p>';
            info.className = opt.info;
            info.innerHTML = '<div class="fl">3 comments</div><div class="fl">Dec 19, 2013</div>';
            this.itemInfo.appendChild(info);
            this.item.appendChild(this.itemInfo);
        },

        createLinkItem: function() {
            this.item.className = 'link-item';
            this.item.innerHTML = '<p>Another Post where you can put a link to a specific website</p><p><a href="">http://www.themeforest.net</a></p>'
        },

        createAsideItem: function() {
            this.item.className = 'aside-item';
            this.item.innerHTML = '<div class="aside-wrapper"><h4>Aside Post Format</h4><p>This is Photoshop\'s version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin.</p></div>'
        },

        createQuoteItem: function() {
            this.item.className = 'quote-item';
            this.item.innerHTML = '<p>Logic will get you from A to B. Imagination will take you everywhere.</p><blockquote><p>Albert Einstein</p></blockquote>'
        },

        getItemHeight: function() {
            // 返回除开图片后的高度
            if (this.itemInfo === undefined) return this.item.clientHeight;

            return this.itemInfo.clientHeight;
        }
    }

    addLoadEvent(function() {
        var fall = new Waterfall(),
            loading = document.querySelector('.loading'),
            flag = false;

        getNewContent(function(arr) {
            fall.append(choice(arr));
        }, 'items.json');

        window.addEventListener('scroll', function() {
            if (load()) {
                if (flag) return;
                flag = true;
                loading.style.display = 'block';
                setTimeout(function() {
                    getNewContent(function(arr) {
                        fall.append(choice(arr));
                        loading.style.display = 'none';
                        flag = false;
                    }, 'items.json');
                }, 2000);
            }
        });
    });
})();
