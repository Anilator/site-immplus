;(function start() {
    G = {
        content: [],
    };

    initMenu();
    getContent();


    function initMenu() {
        var $menu = $('.menu__content').on('click', hideMenu);
        $('.menu__btn').on('click', function (){ $menu.addClass('active'); });
        $('.nav').on('click', '.nav__item', switchBlock);

        $(window).resize(checkForMobile);

        function hideMenu() {

            $menu.removeClass('active');
        }
        function switchBlock(e) {
        }
        function checkForMobile() {
            G.isMobile = window.innerWidth < 976 ? true : false;
        }
    }
    function getContent() {
        $.getJSON(
            "https://www.googleapis.com/blogger/v3/blogs/1786972430348780934/posts",
            {
                key: 'AIzaSyCwoQa4BFVDSY_msOws8ACr_XX2W6qB9KY',
                maxResults: '500',
            },
            parseData
        );


        function parseData(data) {
            var content = [];

            $.each(data.items, function (i, post) {
                if (!post.labels) return;
                var labels = post.labels.join(', ');


                var blockNumber = getValue(labels, /block=(\d+)/);
                if (!blockNumber) return;
                var block = {
                    title: post.title,
                    html: post.content,
                    bgColor: getValue(labels, /(#\w{3,6})/),
                    menuNumber: getValue(labels, /menu=(\d+)/),
                    class: getValue(labels, /class=(\w+)/),
                };
                content[blockNumber] = block;
            });
            G.content = content;


            function getValue(labels, regex) {

                result = regex.exec(labels);
                return result ? result[1] : null;
            }


            renderContent();
        }
    }

    function renderContent() {
        var navContent = [];
        var pageContent = [];

        $.each(G.content, function (i, block) {
            if (!block) return;
            var id = i;
            var style = block.bgColor ? ' style="background: '+ block.bgColor +'"' : '';
            var extraClass = block.class ? ' '+block.class : '';
            var blockHtml =
                '<div class="app__row'+ extraClass +'"'+ style +'>'+
                    '<div class="app__block page" id="'+ id +'">'+
                        block.html +
                    '</div>'+
                '</div>';
            pageContent[i] = blockHtml;

            if (block.menuNumber !== null) {
                var navHtml = '<a class="nav__item" href="#'+ id +'">'+ block.title +'</a>';
                navContent[block.menuNumber] = navHtml;
            }
        });

        $('.app__page').html( pageContent.join('\n') );
        $('.nav').html( navContent.join('\n') );
    }
})();
