var pres = document.getElementsByTagName('pre');
for (var i = 0; i < pres.length; ++i) {
  var pre = pres[i];
  var html = pre.innerHTML;
  if (html.match(/\[ +FAILED +\]/)) {
    while (true) {
      var next = html.replace(/([^>])(\[ +FAILED +\])/,
                              '$1<span style="background: #faa">$2</span>');
      if (next.length != html.length) {
        html = next;
        continue;
      }

      break;
    }

    pre.innerHTML = html;
  }
}
