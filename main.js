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
				websiteTitle.style.backgroundColor = '#f2f2f2';
				websiteTitle.innerHTML = "FILM PALETTE";

				var credits = document.createElement('div');
				credits.id = 'credits';
				credits.classList.add('back');
				credits.style.width = '25vw';
				credits.innerHTML = "Programmed by Tom Février <br /> All rights reserved";

				var flipper = document.createElement('div');
				flipper.classList.add('flipper');
				flipper.appendChild(websiteTitle);
				flipper.appendChild(credits);

				var container = document.createElement('div');
				container.classList.add('flip-container');
				container.style.width = '25vw';
				container.appendChild(flipper);

				var page = document.getElementById('page');
				page.appendChild(container);
			}


			var title = document.createElement('h1');
			title.innerHTML = data.films[i].title;

			var director = document.createElement('h2');
			director.innerHTML = data.films[i].director;
			var color = document.createElement('h3');
			color.innerHTML = data.films[i].color;

			var info = document.createElement('div');
			info.classList.add('info');
			info.appendChild(title);
			info.appendChild(director);
			info.appendChild(color);

			var front = document.createElement('div');
			front.classList.add('front');
			front.style.backgroundImage = "url('data/" + data.films[i].id + "/" + data.films[i].id + ".png')";
			front.style.backgroundSize = '100% 100%';

			var back = document.createElement('div');
			back.classList.add('back');
			back.style.backgroundColor = data.films[i].color;
			back.appendChild(info);

			var flipper = document.createElement('div');
			flipper.classList.add('flipper');
			flipper.appendChild(front);
			flipper.appendChild(back);

			var container = document.createElement('div');
			container.classList.add('flip-container');
			container.setAttribute('onclick', "location.href='films/" + data.films[i].id + ".html'");
			container.appendChild(flipper);

			var page = document.getElementById('page');
			page.appendChild(container);
		}
	});

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
