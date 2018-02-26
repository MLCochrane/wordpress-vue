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

// Need to modify based on category IDs within wordpress
Vue.filter('categoryTitle', function(id) {
      switch (id) {
        case 6:
          return 'Photography';
          break;
        case 7:
          return 'Troubled Mind';
          break;
        case 8:
          return 'Something Made';
          break;
        case 9:
          return 'Read, Watch, Listen';
          break;
        default: return "No category";
      }
    });

Vue.filter('getImage', function(string) {
      if (string) {
      //   // the _embedded object is not present if no image has been set so check for that first
        if (string._embedded['wp:featuredmedia'] != undefined) {
          var str = string._embedded['wp:featuredmedia'][0].source_url;
          // The source_url does not seem to change to https eventhough the actual file is found at the https url
          return str.replace('http', 'https');
        } else {
          // fallback image if no featured image is set
          return "https://www.uselessbydesign.ca/wordpress/wp-content/uploads/2018/02/Minimalism.jpg"
        }
      }
    });
