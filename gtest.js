var failurecount = 0;

// Returns the one-based index of current Failure.
function currentIndex() {
  var hash = document.location.hash;
  if (!hash)
    return 0;
  else
    return parseInt(hash.substr('#failure'.length));
}

function buttonLabel(index) {
  if (failurecount == 0)
    return 'Failure: ?';
  else if (index == 0)
    return 'Next failure (' + failurecount + ' found)';
  else
    return 'Failure ' + index + '/' + failurecount;
}

function nextFailure() {
  var index = currentIndex();
  if (++index > failurecount || isNaN(index))
    index = 1;
  document.location.hash = 'failure' + index;
  document.getElementById('nextFailureButton').value = buttonLabel(index);
}

var pres = document.getElementsByTagName('pre');
var next_failure = 1;
for (var i = 0; i < pres.length; ++i) {
  var pre = pres[i];
  var html = pre.innerHTML;
  if (html.match(/\[ +FAILED +\]/)) {
    while (true) {
      var next = html.replace(/([^>])(\[ +FAILED +\])/,
                              '$1<a name=failure' + next_failure + '></a>'+
                              '<span style="background: #faa">$2</span>');
      if (next.length != html.length) {
        ++next_failure;
        html = next;
        continue;
      }

      break;
    }

    pre.innerHTML = html;
  }
}
failurecount = next_failure - 1;

// Construct the button and show it.
var next = document.createElement('input');
next.id = 'nextFailureButton';
next.type = 'submit';
next.value = buttonLabel(currentIndex());
next.style.position = 'fixed';
next.style.right = 0;
next.style.top = 0;
next.onclick = nextFailure;
document.body.appendChild(next);
