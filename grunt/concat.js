module.exports = {
  angular:{
    src:[
      'angular/libs/jquery/jquery/dist/jquery.js',

      'angular/libs/angular/angular/angular.js',
      
      'angular/libs/angular/angular-animate/angular-animate.js',
      'angular/libs/angular/angular-aria/angular-aria.js',
      'angular/libs/angular/angular-cookies/angular-cookies.js',
      'angular/libs/angular/angular-messages/angular-messages.js',
      'angular/libs/angular/angular-resource/angular-resource.js',
      'angular/libs/angular/angular-sanitize/angular-sanitize.js',
      'angular/libs/angular/angular-touch/angular-touch.js',
      'angular/libs/angular/angular-material/angular-material.js',

      'angular/libs/angular/angular-ui-router/release/angular-ui-router.js', 
      'angular/libs/angular/ngstorage/ngStorage.js',
      'angular/libs/angular/angular-ui-utils/ui-utils.js',

      'angular/libs/angular/angular-bootstrap/ui-bootstrap-tpls.js',
     
      'angular/libs/angular/oclazyload/dist/ocLazyLoad.js',
     
      'angular/libs/angular/angular-translate/angular-translate.js',
      'angular/libs/angular/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'angular/libs/angular/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
      'angular/libs/angular/angular-translate-storage-local/angular-translate-storage-local.js',

      'angular/libs/parse/parse/build/parse-latest.js',

      'src/js/*.js',
      'src/js/directives/*.js',
      'src/js/services/*.js',
      'src/js/filters/*.js',
      'src/js/controllers/bootstrap.js'
    ],
    dest:'angular/js/app.src.js'
  },
  html:{
    src:[
      'libs/jquery/jquery/dist/jquery.js',
      'libs/jquery/bootstrap/dist/js/bootstrap.js',
      'html/js/*.js'
    ],
    dest:'html/js/app.src.js'
  }
}
