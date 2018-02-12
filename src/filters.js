import Vue from 'vue';

Vue.filter('stripDate', function(string) {
      if (string) {
        var date = new Date(string);
        var options = {year: "numeric", month: "long", day: "numeric"};
        date = date.toLocaleTimeString("en-us", options);
        date = date.split(' ');
        return (date[0] + ' ' + date[1] + ' ' + date[2].slice(0,4));
      }
    });

// Need to modify based on category IDs within wordpress, these are for current localhost
Vue.filter('categoryTitle', function(id) {
      switch (id) {
        case 1:
          return 'Uncategorized';
          break;
        case 2:
          return 'Photography';
          break;
        case 6:
          return 'Read, Watch, Listen';
          break;
        default: return "No category";
      }
    });

Vue.filter('getImage', function(string) {
      if (string) {
      //   // the _embedded object is not present if no image has been set so check for that first
        if (string._embedded['wp:featuredmedia'] != undefined) {
          return string._embedded['wp:featuredmedia'][0].source_url;
        } else {
          // fallback image if no featured image is set
          return "http://localhost/wp-content/uploads/2018/01/Pro400H080.jpg"
        }
      }
    });
