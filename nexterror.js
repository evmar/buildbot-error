var errorcount = 0;

function doParse() {
  var next_error = 1;
  var next_warning = 1;
  var spans = document.getElementsByTagName('span');
  // /.../dtoa/dtoa.c:2550: warning: comparison between signed and unsigned
  var kGCCErrorRE = new RegExp('^[^ :]+:\\d+: ', 'gm');
  var kPathRE = new RegExp('^/b/slave/(mac|linux|linux_view)/build/src/(.*)$', 'gm');
  var kPathWinRE = new RegExp('[a-zA-Z]:\\\\b\\\\slave\\\\([^\\\\]*)\\\\build\\\\src\\\\(.*)$', 'gm');
  var kMakeRE = new RegExp('^(make: \\*\\*\\* .* Error.*)', 'gm');
  for (var i = 0; i < spans.length; ++i) {
    var span = spans[i];
    if (span.innerHTML.match('error:') ||  // Mac style.
        span.innerHTML.match('error (C|LNK)[0-9][0-9][0-9][0-9]') ||  // Windows style.
        span.innerHTML.match(kGCCErrorRE)) {
      span.innerHTML = span.innerHTML.replace(kPathRE, '...<b>$2</b>');
      span.innerHTML = span.innerHTML.replace(kPathWinRE, '...<b>$2</b>');
      while (true) {
        // Don't use createElement/insertBefore because the error message could be in
        // in the middle of a large span, and we want the anchor right here.
        var length = span.innerHTML.length;
        // We insert an anchor before the error message and if we don't exclude
        // errors/warnings with </a> in front this will loop forever, trying to
        // insert the anchor tag. Hence the [^>] at the front of the regexp.
        span.innerHTML = span.innerHTML.replace(/[^>](error:|error (C|LNK)[0-9][0-9][0-9][0-9])/,
                                                '<a name=error' + next_error + '></a>' +
                                                '<font color=red>$1</font>');
        if (span.innerHTML.length != length) {
          ++next_error;
          continue;
        }

        span.innerHTML = span.innerHTML.replace(/[^>](warning:)/,
                                                '<a name=warning' + next_warning + '></a>' +
                                                '<font color=red>$1</font>');
        if (span.innerHTML.length != length) {
          ++next_warning;
          continue;
        }

        // If we get here, there's nothing left to replace.
        break;
      }
    }
    if (span.innerHTML.match(kMakeRE)) {
      span.innerHTML = span.innerHTML.replace(kPathWinRE, '...<b>$2</b>');
      while (true) {
        var length = span.innerHTML.length;
        span.innerHTML = span.innerHTML.replace(kMakeRE,
                                                '<a name=error' + next_error + '></a>' +
                                                '<font color=red>$1</font>');
        if (span.innerHTML.length != length) {
          ++next_error;
          continue;
        }
        break;
      }
    }
  }
  errorcount = next_error - 1;
}

function doSanitize() {
  var kSanitizeREs = [
    [ /^[0-9]+&gt;/gm, '' ],
    [ /^(distcc.*)|(Check dependencies.*)|(    setenv .*)|(    cd .*)|(make: Nothing to be done.*)|(    \/Developer\/usr\/bin\/.*)|(    \/Developer\/Library\/PrivateFrameworks\/DevToolsCore.framework.*)|(    \/Developer\/Library\/Xcode\/Plug-ins\/CoreBuildTasks.xcplugin\/.*)|(python scripts\/rule_binding.py.*)|(The operation completed successfully\.)$/gm, '' ],
    [ /^Distributed-CompileC (.*) normal i386 c\+\+ com\.apple\.compilers\.gcc\.4_2.*$/gm, '    CC $1' ],
    [ /^CompileC (.*) normal i386 c\+\+ com\.apple\.compilers\.gcc\.4_2.*$/gm, '    CC $1' ],
  ];

  var spans = document.getElementsByTagName('span');
  for (var i = 0; i < spans.length; ++i) {
    var span = spans[i];
    for (var j = 0; j < kSanitizeREs.length; ++j) {
      span.innerHTML = span.innerHTML.replace(kSanitizeREs[j][0], kSanitizeREs[j][1]);
    }
    // Clean up any extra spurrious newlines introduced by the substitutions.
    span.innerHTML = span.innerHTML.replace(/^\s*$[\n\r]{1,}/gm, '');
  }
}

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

function createButton(id, label, handler) {
  var button = document.createElement('input');
  button.id = id;
  button.type = 'submit';
  button.value = label;
  button.style.cssFloat = 'right';
  button.onclick = handler;
  return button;
}

doParse();

var div = document.createElement('div');
div.style.position = 'fixed';
div.style.right = 0;
div.style.top = 0;

div.appendChild(createButton('sanitizeButton', 'Sanitize log', doSanitize));
div.appendChild(createButton('nextErrorButton', buttonLabel(currentIndex()), nextError));

document.body.appendChild(div);

