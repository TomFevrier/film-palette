var unit;
var repo = 'film-palette';
var frames = [];

function init() {

	loadJSON1(function(response) {
		var data = JSON.parse(response);
		var id = window.location.hash.replace(/#/g, '');

		var music = document.createElement('audio');
		music.src = ((window.location.hostname != 'localhost') ? ("/" + repo) : "") + "/films/" + id + "/" + id + ".mp3";
		music.autoplay = 'true';
		music.loop = 'true';
		music.volume = '0.1';

		for (var i = 0; i < data.films.length; i++) {

			if (data.films[i].id == id) {

				var color = data.films[i].color;
				document.body.style.backgroundColor = color;
				var rgb = getRGBColor(color);
				var brightness = (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3;
				if (brightness >= 128) {
					document.body.style.color = '#2a2a2a';
				}
				else {
					document.body.style.color = '#f2f2f2';
				}

				var title = document.createElement('h1');
				title.innerHTML = data.films[i].title;
				document.title = data.films[i].title.replace('<br />', '');

				var director = document.createElement('h2');
				director.innerHTML = data.films[i].director;

				var text = document.getElementById('text');

				var offset = parseInt(data.films[i].offset);
				for (var i = 0; i < 400; i++) {
					frames.push(new Image());
					var path = ((window.location.hostname != 'localhost') ? ("/" + repo) : "") + "/films/" + id + "/frames/" + frameNumber(i + offset) + ".jpg";
					frames[i].src = path;
				}

				text.appendChild(title);
				text.appendChild(director);

				var preload = document.getElementById('preload');
				preload.style.visibility = 'visible';

				break;
			}
		}
	});

	loadJSON2(function(response) {

		var data = JSON.parse(response);
		var id = window.location.hash.replace(/#/g, '');

		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		unit = Math.min(Math.floor(0.05*h), Math.floor(0.02*w));
		var dimension = unit*20;

		var info = document.createElement('p');
		if (data.info != undefined) {
			info.innerHTML = data.info;
		}
		else {
			info.innerHTML = "No description available yet."
		}
		info.style.textAlign = 'justify';
		info.style.width = Math.floor(0.3*w) + 'px';

		var text = document.getElementById('text');
		text.appendChild(info);

		var frame = document.getElementById('frame');
		var imgForRatio = new Image();
		imgForRatio.onload = function() {
			frame.style.width = Math.floor(0.3*w) + 'px';
			frame.style.height = Math.floor(imgForRatio.height / (imgForRatio.width/(0.3*w))) + unit + 'px';
		}
		imgForRatio.src = "/films/" + id + "/frames/001.jpg";

		document.getElementById('color-code').style.fontSize = (unit/1.5) + 'px';

		var img = document.createElement('div');
		img.classList.add('image');
		img.style.width = dimension + 'px';
		img.style.height = dimension + 'px';
		img.style.alignSelf = 'center';
		for (var y = 0; y < dimension; y += unit) {
			for (var x = 0; x < dimension; x += unit) {
				var index = x/unit + 20*y/unit;
				var square = document.createElement('div');
				square.id = index.toString();
				square.classList.add('square');
				square.onmouseenter = function(e) {
					e.target.style.cursor = 'pointer';
					e.target.style.borderWidth = unit/5 + 'px';
					showFrame(e.target);
				};
				square.onmouseout = function(e) {
					e.target.style.borderWidth = '0';
					e.target.style.transition = 'transition: all .05s ease-in';
					hideFrame();
				};
				square.style.backgroundColor = data.colors[index];
				square.style.width = unit +'px';
				square.style.height = unit + 'px';
				img.appendChild(square);
		   	}
		}

		document.getElementById('img-container').appendChild(img);

		var icon = document.createElement('img');
		icon.id = 'back-home';
		icon.src = 'rewind-arrow.svg';
		icon.width = '60';
		icon.height = '60';

		var backHome = document.createElement('a');
		backHome.href = "/" + ((window.location.hostname != 'localhost') ? repo : "");

		backHome.appendChild(icon);

		var page = document.getElementById('page');
		page.insertBefore(backHome, page.firstChild);
	});

}


function hideFrame() {
	var frame = document.getElementById('frame');
	frame.style.visibility = 'hidden';
	frame.removeChild(frame.firstChild);
}

function showFrame(target) {
	var frame = document.getElementById('frame');
	var colorCode = document.getElementById('color-code')
	var color = target.style.backgroundColor;

	var rgb = color.match(/\d+/g);
	var hex = rgbToHex(rgb);

	var img = frames[parseInt(target.id)];
	img.width = frame.style.width.slice(0, -2)
	img.height = frame.style.height.slice(0, -2) - unit;

	frame.insertBefore(img, frame.firstChild);

	colorCode.innerHTML = hex;
	var brightness = (parseInt(rgb[0]) + parseInt(rgb[0]) + parseInt(rgb[0])) / 3;
	if (brightness >= 128) {
		colorCode.style.color = '#2a2a2a';
	}
	else {
		colorCode.style.color = '#f2f2f2';
	}
	frame.style.backgroundColor = color;

	frame.style.visibility = 'visible';
}



function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
	return "#" + componentToHex(parseInt(rgb[0])) + componentToHex(parseInt(rgb[1])) + componentToHex(parseInt(rgb[2]));
}

function getRGBColor(hex) {
	hex = hex.substr(1);
	var bigint = parseInt(hex, 16);
	var r = (bigint >> 16) & 255;
	var g = (bigint >> 8) & 255;
	var b = bigint & 255;
    return [r, g, b];
}

function frameNumber(i) {
	if (i < 10) {
		return "00" + i;
	}
	if (i < 100) {
		return "0" + i;
	}
	return "" + i;
}

function loadJSON1(callback) {
	var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', 'films.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == '200') {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

function loadJSON2(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
	var id = window.location.hash.replace(/#/g, '');
	var path = ((window.location.hostname != 'localhost') ? ("/" + repo) : "") + "/films/" + id + "/" + id + ".json";
    xobj.open('GET', path, true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == '200') {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }
