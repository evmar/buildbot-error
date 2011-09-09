gtestError = {};

gtestError.failurecount = 0;

// Returns the one-based index of current Failure.
gtestError.currentIndex = function() {
  var hash = document.location.hash;
  if (!hash)
    return 0;
  else
    return parseInt(hash.substr('#failure'.length));
}

gtestError.buttonLabel = function(index) {
  if (gtestError.failurecount == 0)
    return 'Failure: ?';
  else if (index == 0)
    return 'Next failure (' + gtestError.failurecount + ' found)';
  else
    return 'Failure ' + index + '/' + gtestError.failurecount;
}

gtestError.nextFailure = function() {
  var index = gtestError.currentIndex();
  if (++index > gtestError.failurecount || isNaN(index))
    index = 1;
  document.location.hash = 'failure' + index;
  document.getElementById('nextFailureButton').value =
      gtestError.buttonLabel(index);
}

gtestError.init = function() {
  var pres = document.getElementsByTagName('pre');
  var next_failure = 1;
  for (var i = 0; i < pres.length; ++i) {
    var pre = pres[i];
    var html = pre.innerHTML;
    if (html.match(/^\[ +FAILED +\]/m)) {
      while (true) {
        var next = html.replace(/^(\[ +FAILED +\])/m,
                                '<a name=failure' + next_failure + '></a>'+
                                '<span style="background: #faa">$1</span>');
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
  gtestError.failurecount = next_failure - 1;

  if (gtestError.failurecount > 0) {
    // Construct the button and show it.
    var next = document.createElement('input');
    next.id = 'nextFailureButton';
    next.type = 'submit';
    next.value = gtestError.buttonLabel(gtestError.currentIndex());
    next.style.position = 'fixed';
    next.style.right = 0;
    next.style.top = 0;
    next.onclick = gtestError.nextFailure;
    document.body.appendChild(next);
  }
}

gtestError.init();
