var spans = document.getElementsByTagName('span');
var next_error = 1;
var next_warning = 1;
// /.../dtoa/dtoa.c:2550: warning: comparison between signed and unsigned
var kGCCErrorRE = new RegExp('^[^ :]+:\\d+: ', 'gm');
var kPathRE = new RegExp('^/b/slave/(mac|linux|linux_view)/build/src(.*)$', 'gm');
var kPathWinRE = new RegExp('[a-zA-Z]:\\\\b\\\\slave\\\\([^\\\\]*)\\\\build\\\\src\\\\(.*)$', 'gm');
for (var i = 0; i < spans.length; ++i) {
  var span = spans[i];
  if (span.innerHTML.match('error:') ||  // Mac style.
      span.innerHTML.match('error C[0-9][0-9][0-9][0-9]') ||  // Windows style.
      span.innerHTML.match(kGCCErrorRE)) {
    span.innerHTML = span.innerHTML.replace(kPathRE, '...<b>$2</b>');
    span.innerHTML = span.innerHTML.replace(kPathWinRE, '...\\<b>$2</b>');
    while (true) {
      // Don't use createElement/insertBefore because the error message could be in
      // in the middle of a large span, and we want the anchor right here.
      var length = span.innerHTML.length;
      // We insert an anchor before the error message and if we don't exclude
      // errors/warnings with </a> in front this will loop forever, trying to
      // insert the anchor tag. Hence the [^>] at the front of the regexp.
      span.innerHTML = span.innerHTML.replace(/[^>](error:|error C[0-9][0-9][0-9][0-9])/,
                                              '<a name=error' + next_error + '></a>' +
                                              '<font color=red>$1</font>');
      if (span.innerHTML.length != length) {
        ++next_error;
        continue;
      }

      span.innerHTML = span.innerHTML.replace(/[^>](warning:)/,
                                              '<a name=error' + next_warning + '></a>' +
                                              '<font color=red>$1</font>');
      if (span.innerHTML.length != length) {
        ++next_warning;
        continue;
      }

      // If we get here, there's nothing left to replace.
      break;
    }
  }
}

var errorcount = next_error - 1;
var index = currentIndex();

// Returns the one-based index of current error.
function currentIndex() {
  var hash = document.location.hash;
  if (!hash)
    return 0;
  else
    return parseInt(hash.substr('#error'.length));
}

function buttonLabel(index) {
  if (errorcount == 0)
    return 'Error: ?';
  else if (index == 0)
    return 'Next error (' + errorcount + ' found)';
  else
    return 'Error ' + index + '/' + errorcount;
}

function nextError() {
  var index = currentIndex();
  if (++index > errorcount || isNaN(index))
    index = 1;
  document.location.hash = 'error' + index;
  document.getElementById('nextErrorButton').value = buttonLabel(index);
}

// Construct the button and show it.
var next = document.createElement('input');
next.id = 'nextErrorButton';
next.type = 'submit';
next.value = buttonLabel(index);
next.style.position = 'fixed';
next.style.right = 0;
next.style.top = 0;
next.onclick = nextError;
document.body.appendChild(next);

