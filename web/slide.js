$.get('~slide.md')
  .then(function(data){
    var urls = {};

    data.replace(/<!--\s+include:\s+(\S+)\s+-->/g, function(str, url){
      urls[url] = null;
      return null;
    });

    var defers = [];

    $.each(urls, function(url){
      var defer = $.ajax({ url:url, dataType:"text" })
        .then(function(data){
          return { url: url, data: data };
        })
      ;
      defers.push(defer);
    });

    return $.when.apply($, defers)
      .then(function(){
        var map = {};

        for (var i=0; i<arguments.length; i++) {
          map[arguments[i].url] = arguments[i].data;
        }

        data = data.replace(/<!--\s+include:\s+(\S+)\s+(?:(\S+)\s+)?-->/g, function(str, url, attr){
          var str = map[url];

          if (attr === 'strip') {
            str = str.replace(/\/\/.*$/mg, "");
          }

          return "```\n" + str + "```\n";
        });

        return data;
      })
    ;
  })
  .then(function(data){
    $('#markdown').html(data);
  })
  .then(function(){
    var prefix = "~web/bower/reveal.js/";
    // Full list of configuration options available here:
    // https://github.com/hakimel/reveal.js#configuration
    Reveal.initialize({
      controls: true,
      progress: true,
      history: true,
      center: true,
      //slideNumber: true,

      //theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
      transition: Reveal.getQueryHash().transition || 'page', // default/cube/page/concave/zoom/linear/fade/none
      backgroundTransition: Reveal.getQueryHash().background || 'default', // default/none/slide/concave/convex/zoom

      // Parallax scrolling
      // parallaxBackgroundImage: 'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg',
      // parallaxBackgroundSize: '2100px 900px',

      // Optional libraries used to extend on reveal.js
      dependencies: [
        { src: prefix + 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: prefix + 'plugin/markdown/marked.js',
          condition: function(){
            return !!document.querySelector( '[data-markdown]' );
          },
          callback: function(){
            highlight = hljs;
            hljs = undefined;
            marked.setOptions({
              gfm: true,
              breaks: true,
              highlight: function(code, lang) {
                hljs = highlight;
                //return highlight.highlightAuto(code, [lang]).value;
                if (lang != null && highlight.getLanguage(lang)) {
                  return highlight.highlight(lang, code).value;
                } else {
                  return highlight.highlightAuto(code, []).value;
                }
              }
            });
          }
        },
        { src: prefix + 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        //{ src: prefix + 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
        { src: prefix + 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
        { src: prefix + 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }
      ]
    });
  }
);
