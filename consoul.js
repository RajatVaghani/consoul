// === DEFAULT CSS ===

config = {
  "duration": 3,
  "fontsize": 14,
  "maxwidth": 300,
  "search": "https://duckduckgo.com/?q=",
  "oldconsole": console.log,
}


styletext = ".consoul-snack {";
styletext += "position: absolute;";
styletext += "bottom: -9999px;";
styletext += "right: 10px;";
styletext += "width: fit-content;";
styletext += "max-width: " + config.maxwidth + "px;";
styletext += "padding: 10px 20px;";
styletext += "background: #2c2c2c;";
styletext += "border-radius: 15px;";
styletext += "color: #fff;";
styletext += "font-family: sans-serif;";
styletext += "letter-spacing: 1px;";
styletext += "box-sizing: border-box;";
styletext += "box-shadow: 0px 3px 10px -3px #000;";
styletext += "opacity: 1;"
styletext += "transition: all 1s;";
styletext += "}";
styletext += ".consoul-toolbox {";
styletext += "text-align: right;";
styletext += "margin-bottom: 7px;";
styletext += "margin-right: -12px;";
styletext += "}";
styletext += "pre.consoul-pre {";
styletext += "max-width: " + config.maxwidth + "px;";
styletext += "overflow: hidden;";
styletext += "max-width: fit-content;";
styletext += "white-space: pre-wrap;";
styletext += "overflow-wrap: break-word;";
styletext += "}";
styletext += ".consoul-toolbox-button {";
styletext += "display: inline-block;";
styletext += "border: 1px solid #777;";
styletext += "font-size: 9px;";
styletext += "text-transform: uppercase;";
styletext += "padding: 6px 12px;";
styletext += "border-radius: 15px;";
styletext += "margin-left: 8px";
styletext += "}";
styletext += ".consoul-toolbox-button:hover {";
styletext += "cursor: pointer;";
styletext += "}";
styletext += ".consoul-text {";
styletext += "padding: 15px 0px;";
styletext += "text-align: left;"
styletext += "display: block;"
styletext += "width: fit-content;"
styletext += "float: right;"
styletext += "}";
styletext += ".consoul-text-plain {";
styletext += "display:none;";
styletext += "}";

snack_content = "<div class='consoul-toolbox'>";
snack_content += "<span class='consoul-toolbox-button' id='consoul-toolbox-button-copy'>copy &#x1f4cb;</span>";
snack_content += "<span class='consoul-toolbox-button' id='consoul-toolbox-button-search'>search &#x1F50E;</span>";
snack_content += "<span class='consoul-toolbox-button' id='consoul-toolbox-button-close'>close &#x274E;</span>";
snack_content += "</div>";
snack_content += "<div class='consoul-text'></div>";
snack_content += "<div class='consoul-text-plain'></div>";

currentSnack = 0;
var allSnackBars = [];

css = document.createElement('style');
css.type = 'text/css';
if (css.styleSheet)
  css.styleSheet.cssText = styletext;
else
  css.appendChild(document.createTextNode(styletext));
document.getElementsByTagName("head")[0].appendChild(css);

function getBottomSpacing(index) {
  bottom = 10;
  if (index > 0) {
     bottom += parseInt(allSnackBars[index-1].style.bottom);
     bottom += parseInt(allSnackBars[index-1].offsetHeight)
  }
  return bottom;
}

function repositionSnacks() {
  allSnackBars.forEach((item, i) => {
    newBottom = getBottomSpacing(i);
    item.style.bottom = newBottom + "px";
  });
}

function getSnackbar(data) {
  snackbar = document.createElement("div");
  snackbar.classList.add("consoul-snack");
  snackbar.classList.add("consoul-snack-" + (currentSnack+1));
  snackbar.innerHTML = snack_content;

  // custom css for each snackbar
  bottom = getBottomSpacing(allSnackBars.length);
  snackbar.style.bottom = bottom + "px";
  snackbar.style.fontSize = config.fontsize + "px";

  snackbarContent = snackbar.getElementsByClassName("consoul-text")[0];
  snackbarText = snackbar.getElementsByClassName("consoul-text-plain")[0];
  snackbarText.innerText = data;

  if (isJson(data)) {
    data = JSON.stringify(data, undefined, 2);
    pre = document.createElement("pre");
    pre.classList.add("consoul-pre");
    pre.innerHTML = data;
    snackbar.appendChild(pre);
    snackbarContent.style.display = "none";
  } else {
    snackbarContent.innerText = data;
  }

  // handle button clicks
  snackbar.querySelector("#consoul-toolbox-button-close").addEventListener("click", function(){
    removeSnack(this.parentNode.parentNode);
  });

  snackbar.querySelector("#consoul-toolbox-button-copy").addEventListener("click", copyTheLog);

  snackbar.querySelector("#consoul-toolbox-button-search").addEventListener("click", searchTheLog);

  addSnacks(snackbar);

}

function isJson(obj) {
    var t = typeof obj;
    return ['boolean', 'number', 'string', 'symbol', 'function'].indexOf(t) == -1;
}

function searchTheLog() {
  var consoleText = this.parentNode.parentNode.querySelector(".consoul-text-plain").textContent;
  var win = window.open(config.search + consoleText,'_blank');
  win.focus();
}

function copyTheLog() {
  var copyText = this.parentNode.parentNode.querySelector(".consoul-text-plain");
  var textArea = document.createElement("textarea");
  textArea.value = copyText.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("Copy");
  textArea.remove();
}

function addSnacks(snackbar) {
  document.body.appendChild(snackbar);
  allSnackBars.push(snackbar);
  currentSnack++;
  trackSnacks(currentSnack);
}

function removeSnack(snack) {
  snack.style.bottom = "-" + (snack.offsetHeight + 10 + snack.scrollHeight) + "px";
  allSnackBars.splice(allSnackBars.indexOf(snack), 1);
  repositionSnacks();
  setTimeout(function (){
    snack.remove();
  }, 750);
}

function trackSnacks(snackToTrack) {
  setTimeout(function() {
      snacks = document.getElementsByClassName("consoul-snack-"+snackToTrack);
      if (snacks.length > 0) {
        snack = snacks[0];
        removeSnack(snack);
      }
  }, ((config.duration * 1000) * (snackToTrack)));
}

console.on = function() {
  console.log = function(data) {
    getSnackbar(data);
  }
}

console.off = function() {
  oldconsole = config.oldconsole;
  console.log = oldconsole;
}

console.on();
