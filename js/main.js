$(function(){
	var is_async_step = false;
	
	var isFrench = false;
	var prenom;
	var newprenom;
	var gender;
	var audio = new Audio();
	var delayInMilliseconds = 2000; 
	var twitterUrl = "https://twitter.com/intent/tweet?hashtags=EricTeBaptise&url=https%3A%2F%2Ferictebaptise.azurewebsites.net&text=";
	var message = "";
	
	$("#wizard").steps({
        headerTag: "h4",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
		enableFinishButton: false,
        transitionEffectSpeed: 300,
        labels: {
            next: "Suivant",
            previous: "Précédent"
        },
        onStepChanging: function (event, currentIndex, newIndex) { 
			if (newIndex === 0){
				$('.steps ul').removeClass('step-2');
				$('.steps ul').addClass('step-1');
				$("#wizard .actions a[href='#next']").show();
            }
			else if (newIndex === 1){
				goToStep2();
            }
			else if (newIndex === 2){
				goToStep3();
            }
			else if (newIndex === 3){
				goToStep4();
            }
			else if (newIndex === 4){
				goToStep5();
            }
			
            return true; 
        }
    });
	
    $('#inputName').keydown(function (e){
		if(e.keyCode == 13){
			$("#wizard").steps('next');
		}
	})
	
	function goToStep2(){
		$('.steps ul').removeClass('step-3');
		$('.steps ul').addClass('step-2');
		$("#wizard .actions a[href='#previous']").hide();
		$("#wizard .actions a[href='#next']").hide();
		
		prenom = $('#inputName').val();
		gender = $('#selectGenre').val();
		
		if(prenom.toLowerCase() === "hapsatou"){
			setTimeout(function() {
				$("#resultText").text("Le prénom " + prenom + " est une INSULTE à la France !")
				$('#resultSubText').text("Pas de panique l'heure de ton baptême est arrivé")
				playAudio('mp3/zemmourprenom.mp3')
				$("#wizard").steps('next');
			}, delayInMilliseconds);
		}else{
			var url = "https://www.behindthename.com/api/lookup.json?name=" +  prenom + "&key=mo238238234";
			console.log(url);
			setTimeout(function() {
				  $.ajax({
					type: 'GET',
					url: url,
					dataType: 'json',
					success: function (data) {
						hasErrorProperty = data.hasOwnProperty('error');
						
						if(!hasErrorProperty){
							isFrench = isFrenchName(data)
						}else{
							isFrench = false;
						}
						
						console.log(isFrench);
						
						if(isFrench){
							$("#resultText").text("Bravo, Votre mère a fait un très bon choix !")
							$('#resultSubText').text("Je peux tout de même vous baptiser")
							playAudio('https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3')
						}else{
							$("#resultText").text("Le prénom " + prenom + " est une INSULTE à la France !")
							$('#resultSubText').text("Pas de panique l'heure de ton baptême est arrivé")
							playAudio('mp3/zemmourprenom.mp3')
						}
						
						$("#wizard").steps('next');
					}
				});
			}, delayInMilliseconds);
		}
	}
	
	function goToStep3(){
		$('.steps ul').removeClass('step-2');
		$('.steps ul').addClass('step-3');
		
		$("#wizard .actions a[href='#previous']").hide();
		$("#wizard .actions a[href='#next']").show();
	}
	
	function goToStep4(){
		audio.pause();
			
		$('.steps ul').removeClass('step-3');
		$('.steps ul').addClass('step-4');
		
		$("#wizard .actions a[href='#previous']").hide();
		$("#wizard .actions a[href='#next']").hide();
		
		var url = "https://www.behindthename.com/api/random.json?usage=fre&gender=" + gender + "&number=1&key=mo238238234";
	
		console.log(url);
		
		if(isFrench){
			setTimeout(function() {
				message = "Ouf mon prénom " + prenom + " n’est pas une insulte à la France, toi aussi vérifie et fait toi baptiser par Éric ";

				$("#resultTextSec5").html(prenom + " <br/> vous va très bien")	
				$("#resultSubTextSec5").html("Partage ton prénom sur les réseaux sociaux")	
				$("#wizard").steps('next');
			}, delayInMilliseconds);
				
		}else{
			console.log(prenom);
			
			if(prenom.toLowerCase() === "hapsatou"){
				setTimeout(function() {
					newprenom = "Corinne";
					setResult5('mp3/corinne.mp3');
				}, delayInMilliseconds);
			}else{
				setTimeout(function() {
			  $.ajax({
				type: 'GET',
				url: url,
				dataType: 'json',
				success: function (data) {
					newprenom = data.names[0];
					setResult5('mp3/choixprenom.mp3');
				}
			});
			}, delayInMilliseconds);
			}
		}
	}
	
	function goToStep5(){
		$('.steps ul').removeClass('step-4');
		$('.steps ul').addClass('step-5');
		
		$("#wizard .actions a[href='#previous']").hide();
		$("#wizard .actions a[href='#next']").hide();

	}
	
	function isFrenchName(data){
		var isFrench = false; 
		data.forEach(function(element) {		
			element.usages.forEach(function(usage) {
				console.log(usage.usage_code);
				if(usage.usage_code === "fre"){
					isFrench = true;
				}
			});
		});
		return isFrench;
	}
	
	function playAudio(url){
		audio = new Audio(url);
		audio.volume = 0.75;
		//audio.loop = true;
		audio.play()
	}
	
	function setResult5(url){
	    message = "Mon prénom " + prenom + " est une insulte à la France, Éric m’a baptisé " + newprenom + ". Pour un baptême en ligne par Éric ";	
		$("#resultTextSec5").html(newprenom + " <br/>ça vous irait très bien")	
		$("#resultSubTextSec5").html("Partage ton nouveau prénom sur les réseaux sociaux")	
		playAudio(url)
		$("#wizard").steps('next');
	}
	
	$("#facebookButton").click(function(e) {
		 FB.ui({
            method: 'feed',
            link: 'https://erictebaptise.azurewebsites.net/',
            description: message
        });
	});
	
	$("#twitterButton").click(function(e) {
		window.open(twitterUrl + message, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
	});
	
	
	(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id))
        return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/fr_FR/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

	window.fbAsyncInit = function() {
		FB.init({
			appId: '1666767543433284',  
			status: true,
			xfbml: true,
			cookie: true
		});
	};
})
