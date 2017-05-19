
//Include all generated json files
var animations = {};
console.log(locals.iconsArray);

function importAll(r) {
  r.keys().forEach(key => {
    var simKey = key.replace("./", "").replace(".json", "");
    // animations[simKey] = r(JSON.stringify(key));
    animations[simKey] = JSON.parse(r(key));
  });
}

importAll(require.context('../anim/', true, /\.json$/));

// console.log(animations);

var icons = [];
//Create Array based on generated html
function buildIcons() {
  var elements = document.querySelectorAll("[id^='icon-container-']")
  for(var element of elements) {
    var anim;
    var ident = element.id.replace("icon-container-", "");
    var btn = document.getElementById('button-' + ident);
    var params = {
      container: element.querySelector("[id^='icon-']"),
      autoplay: false,
      loop: false,
      animationData: animations[ident],
      renderer: 'svg'
    };
    anim = bodymovin.loadAnimation(params);
    icons.push({
      anim: anim,
      element: element,
      ident, ident,
      btn: btn
    });
  }
};

function renderPage() {
  icons.forEach(icon => {
    icon.element.style.display = 'inline-block';
    icon.anim.play();
    icon.btn.addEventListener("click", (e) => {
      icon.anim.goToAndPlay(0, true);
    });
  })
}

buildIcons();
renderPage();
