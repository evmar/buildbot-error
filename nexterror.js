var spans = document.getElementsByTagName('span');
var errnum = 0;
var kMacPathRE = new RegExp('^/b/slave/mac/build/src(.*)$', 'gm');
for (var i = 0, span = spans[0]; span = spans[i]; ++i) {
  if (span.innerHTML.match('error:')) {  // Mac style.
    // Don't use createElement/insertBefore because the error message could be in
    // in the middle of a large span, and we want the anchor right here.
    var anchor = '<a name=error' + errnum++ + '></a>';
    span.innerHTML = span.innerHTML.replace(/(error:)/g, anchor + '<font color=red>$1</font>');
    span.innerHTML = span.innerHTML.replace(kMacPathRE, '...<b>$1</b>');
  }
}
var errorcount = errnum;

function nextError() {
  var hash = document.location.hash;
  if (!hash) {
    document.location.hash = 'error0';
  } else {
    var err = parseInt(document.location.hash.substr('#error'.length));
    if (++err == errorcount || isNaN(err))
      err = 0;
    document.location.hash = 'error' + err;
  }
}


// Construct the button and show it.
var next = document.createElement('input');
next.type = 'submit';
next.value = 'next error';
next.style.position = 'fixed';
next.style.right = 0;
next.style.top = 0;
next.onclick = nextError;
document.body.appendChild(next);
