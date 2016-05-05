<!DOCTYPE html>
<html lang="en">
<head>  
  <meta charset="utf-8" />
  <title>Photopon | Making Coupons Social</title>
  <meta name="description" content="Empower your business with Photopon. Make your coupons social." />
  <meta name="keywords" content="photopon, coupon, social, share, redeem, local" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <link rel="stylesheet" href="libs/assets/animate.css/animate.css" type="text/css" />
  <link rel="stylesheet" href="libs/assets/font-awesome/css/font-awesome.min.css" type="text/css" />
  <link rel="stylesheet" href="libs/assets/simple-line-icons/css/simple-line-icons.css" type="text/css" />
{% if build %}
  <link rel="stylesheet" href="libs/jquery/bootstrap/dist/css/bootstrap.css" type="text/css" />
  <link rel="stylesheet" href="css/font.css" type="text/css" />
  <link rel="stylesheet" href="css/app.css" type="text/css" />
{% else %}
  <link rel="stylesheet" href="css/app.min.css" type="text/css" />
{%endif%}
</head>
<body>
	{% include 'header.tpl' %}
  <div id="content">
    {% block content %}
    {% endblock %}
  </div>
  {% include 'footer.tpl' %}
  <script src="libs/jquery/jquery/dist/jquery.js"></script>
  <script src="libs/jquery/bootstrap/dist/js/bootstrap.js"></script>
  <script src="libs/jquery/jquery_appear/jquery.appear.js"></script>
  <script src="https://cdn.jsdelivr.net/parse/1.6.7/parse.min.js"></script>
  <script src="js/landing.js"></script>
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-71484200-1', 'auto');
    ga('send', 'pageview');

  </script>
</body>
</html>
