
export default class StringUtils{
  static validDate(text){
    if(!text || typeof text != 'string'){
      return false;
    }
    // MM/DD/YYYY
    var comp = text.split('/');
    var m = parseInt(comp[0], 10);
    var d = parseInt(comp[1], 10);
    var y = parseInt(comp[2], 10);
    var date = new Date(y,m-1,d);
    if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
        return {m, d, y};
    } else {
        return false;
    }
  }
}
