function init() {
	loadJSON(function(response) {
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var data = JSON.parse(response);
		for (var i = 0; i < data.films.length; i++) {

			if (i == 11) {
				var websiteTitle = document.createElement('div');
				websiteTitle.id = 'website-title';
				websiteTitle.classList.add('front');
				websiteTitle.style.width = '25vw';
				websiteTitle.innerHTML = "FILM PALETTE";

				var credits = document.createElement('div');
				credits.id = 'credits';
				credits.classList.add('back');
				credits.style.width = '25vw';
				var text = "<h4>Designed and developed by</h4><h1>Tom Février</h1>";
				text += "<h2>What is it?</h2>";
				text += "<h3>An artistic visualization <br /> of the use of color in films</h3>";
				text += "<p><i>Send your suggestions to tomfevrier@gmail.com</i></p>";
				credits.innerHTML = text;

				var flipper = document.createElement('div');
				flipper.classList.add('flipper');
				flipper.appendChild(websiteTitle);
				flipper.appendChild(credits);

				var container = document.createElement('div');
				container.classList.add('flip-container');
				container.style.width = '25vw';
				container.appendChild(flipper);
				container.setAttribute('onclick', "window.open('https://github.com/TomFevrier/film-palette', '_blank')");

				var page = document.getElementById('page');
				page.appendChild(container);
			}

			var color = data.films[i].color;
			var rgb = getRGBColor(color);
			var brightness = (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3;

			var title = document.createElement('h1');
			title.innerHTML = data.films[i].title;

			var director = document.createElement('h2');
			director.innerHTML = data.films[i].director;
			var colorCode = document.createElement('h3');
			colorCode.innerHTML = data.films[i].color;

			var info = document.createElement('div');
			info.classList.add('info');
			if (brightness >= 128) {
				info.style.color = '#2a2a2a';
			}
			else {
				info.style.color = '#f2f2f2';
			}
			info.appendChild(title);
			info.appendChild(director);
			info.appendChild(colorCode);

			var front = document.createElement('div');
			front.classList.add('front');
			front.style.backgroundImage = "url('films/" + data.films[i].id + "/" + data.films[i].id + ".png')";
			front.style.backgroundSize = '100% 100%';

			var back = document.createElement('div');
			back.classList.add('back');
			back.style.backgroundColor = color;
			back.appendChild(info);

			var flipper = document.createElement('div');
			flipper.classList.add('flipper');
			flipper.appendChild(front);
			flipper.appendChild(back);

			var container = document.createElement('div');
			container.classList.add('flip-container');
			container.setAttribute('onclick', "location.href='" + window.location.href +  "film.html#" + data.films[i].id + "'");
			container.appendChild(flipper);

			var page = document.getElementById('page');
			page.appendChild(container);

			var preload = document.getElementById('preload');
			preload.style.visibility = 'visible';
		}
	});

}

function getRGBColor(hex) {
	hex = hex.substr(1);
	var bigint = parseInt(hex, 16);
	var r = (bigint >> 16) & 255;
	var g = (bigint >> 8) & 255;
	var b = bigint & 255;
    return [r, g, b];
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', 'films.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == '200') {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }
