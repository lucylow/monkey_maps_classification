		$().ready( function() {

				/* https://codepen.io/lovefield/pen/vEvqZV */

				let love = setInterval(function(){

					let r_num = Math.floor(Math.random() * 40) + 1;
					let r_size = Math.floor(Math.random() * 65) + 10;
					let r_left = Math.floor(Math.random() * 100) + 1;
					let r_bg = Math.floor(Math.random() * 25) + 100;
					let r_time = Math.floor(Math.random() * 5) + 5;
					  
					$('.bg_heart').append("<div class='heart' style='width:"+r_size+"px;height:"+r_size+"px;left:"+r_left+"%;background:rgba(255,"+(r_bg-25)+","+r_bg+",1);-webkit-animation:love "+r_time+"s ease;-moz-animation:love "+r_time+"s ease;-ms-animation:love "+r_time+"s ease;animation:love "+r_time+"s ease'; 'opacity: 0.7'></div>");
					  
					$('.bg_heart').append("<div class='heart' style='width:"+(r_size-10)+"px;height:"+(r_size-10)+"px;left:"+(r_left+r_num)+"%;background:rgba(255,"+(r_bg-25)+","+(r_bg+25)+",1);-webkit-animation:love "+(r_time+5)+"s ease;-moz-animation:love "+(r_time+5)+"s ease;-ms-animation:love "+(r_time+5)+"s ease;animation:love "+(r_time+5)+"s ease' ; 'opacity: 0.7'></div>");
					  
					$('.heart').each(function(){
					    let top = $(this).css("top").replace(/[^-\d\.]/g, '');
					    let width = $(this).css("width").replace(/[^-\d\.]/g, '');
					    if(top <= -100 || width >= 150){
					      $(this).detach();
					    }
					});

				}, 500);/**/

				function stopLove() {clearInterval(love);}

				setTimeout(stopLove, 8000);

				//let figures = $("figure");
				let owl = $(".owl-carousel");
						
				owl.addClass("bounceInRight animated");
							
				owl.owlCarousel({
					loop: true,
					margin: 15,
					nav: true,
					navText: [
					"<i class='fa fa-caret-left'></i>",
					"<i class='fa fa-caret-right'></i>"
					],
					autoWidth: true,
					startPosition: 0,
					fluidSpeed: true,
					dragEndSpeed: true,
				});

				let tabs = $( "#tabs" ).tabs();
		    	tabs.find(".ui-tabs-nav").sortable( { axis: "x", stop: function() { tabs.tabs("refresh") } } );


		   		$(".item > img").each(function() {
					$(this).click(function() {
						$(this).addClass("flash animated");
					});
				});

			})	
			
		
			let sceneView;
			let divProgress = document.getElementsByClassName("div-progress")[0];
			let extentParis = [2.3400771617891882, 48.857670532870394];
			let zoomParis = 12;
			let extentReunion = [55.51939845083782, -21.152135968323005];
			let zoomReunion = 10;
			let extentAilleurs = [6.558827161788094, 38.471012107691045];
			let zoomAilleurs = 2;
			let layer;
			let template;
			let placeDescSpan = document.querySelector("#placeDesc");
			let button_play = document.getElementById("button_play");
			let button_stop = document.getElementById("button_stop");
			// these two highlight handlers are used for selection and hovering over features
			let highlightSelect, highlightHover;
			let hoverPromise;
			let figures = document.getElementsByTagName("figure");
			let lines = document.getElementsByClassName("line");
			let tabParis = document.querySelector("#tabParis");
			let tabReunion = document.querySelector("#tabReunion");
			let tabAilleurs = document.querySelector("#tabAilleurs");
			let photos = document.querySelectorAll("figure > img");
			let tabsEvent = document.querySelector("#tabs");
			let mapRow =  document.querySelector("#row-map");
		   
			require( [	"esri/Map",
						"esri/views/SceneView",
						"esri/request",
						"esri/layers/FeatureLayer",
						"esri/config",
						],

			function(Map, SceneView, esriRequest, FeatureLayer, esriConfig)
			{
				function scaleFig() {
					let this_ = this;
					this_.style.transform = "scale(1.5)";
					this_.className = "";
					this_.style.cursor = "pointer";
				}

				function unScaleFig() {
					let this_ = this;
					this_.style.transform = "none";
					this_.className = "figShadow";
					this_.style.cursor = "";
				}

				for (let i = 0, len = figures.length; i < len; i++) {
		    		let fig = figures[i];
		    		fig.addEventListener( "mouseover", scaleFig );
					fig.addEventListener( "mouseout",  unScaleFig );
		    	}/**/

				function flipInXFigures(figures) {
					for (let i = 0, len = figures.length; i < len; i++) {
			    		let fig = figures[i];
			    		fig.classList.add("flipInX", "animated");
						setTimeout(function() { fig.classList.remove("flipInX" ,"animated"); }, 500 );
			    	}
			    	
				}

				function animateTabFct(tab, color, extent, zoom) {
					
					let idTab = tab.getAttribute("aria-controls");
		    		let figures = document.querySelectorAll("#" + idTab + " > figure");
		    		placeDescSpan.style.display = "none";
		    		flipInXFigures(figures);
		    		for (let i = 0, len = lines.length; i < len; i++) {

					    lines[i].style.display = "none";

					}
		    		let currentLine = tab.firstElementChild;
		    		currentLine.style.width = 0;
		    		currentLine.style.display = "block";
					currentLine.style.backgroundColor = color;
		    		let $line = $(currentLine);
		    		$line.animate({'width':'100%'}, 500);
		    		let place = "Tab=" + "'" + tab.getAttribute("name") + "'";
		    		layer.definitionExpression = place;
					sceneView.goTo({ center: extent, zoom: zoom, tilt: 0, heading: 0 }, { duration: 7000, easing: "in-out-cubic" });/**/

		    	}

		    	// set highlightOptions like color and fillOpacity
		        let highlightOptions = {
		          color: [255, 241, 58],
		          fillOpacity: 0.4
		        } 
		        let environment =  {
		          atmosphereEnabled: true,
		          atmosphere: {
		            quality: "high"
		          }
		        }
		        let currentBasemap = new Map( { basemap: "hybrid",  ground: "world-elevation" } );
				let viewOptions = { container: "sceneView", highlightOptions: highlightOptions, environment: environment, map: currentBasemap, center: extentParis, zoom: zoomParis };
				sceneView = new SceneView ( viewOptions );

				template = {
					title: "<font color='#323232'>{Tab}",
					content: 
					[
						{
				           type: "fields",
				            fieldInfos: [{
				              fieldName: "place",
				              visible: true,
				              label: "Lieu"
				            }]
				          },
				          {
				          	type: "text",
				          	text:  "<table><tbody><tr style='background-color: #d7d7d7, color: #464646;''><th class='esri-popup-renderer__field-header' style='vertical-align: middle;'>Photo</th><td class='esri-popup-renderer__field-data' style='text-align:center;''><img src='{Img}' width='85px' height='85px' style='border-radius: 5px; cursor: pointer;' data-toggle='modal' data-target='{Modal}'></img></td></tr></tbody></table>"
				          }
				    ]
		        }

				layer = new FeatureLayer( { url: "https://services.arcgis.com/OMbfIFNCWRclU5sp/arcgis/rest/services/plmpl/FeatureServer/0", outFields: ["*"], popupTemplate: template/**/} );
				sceneView.map.add(layer);

				layer.then(function() {
					tabParis.addEventListener("click", function()  { animateTabFct(this, "#005ce6", extentParis, zoomParis) });
					tabReunion.addEventListener("click", function() { animateTabFct(this, "#ED7F10", extentReunion, zoomReunion) });
		    		tabAilleurs.addEventListener("click", function() { animateTabFct(this, "#c500ff", extentAilleurs, zoomAilleurs) });
				})/**/

				sceneView.popup.actions.items[0].visible = false;
				sceneView.popup.autoCloseEnabled = true;
				
				sceneView.popup.dockOptions = {
				  // Disables the dock button from the popup
				  buttonEnabled: false,
				  // Ignore the default sizes that trigger responsive docking
				  breakpoint: false,
				};

				// Change basemap onclick button
				let basemaps = document.querySelectorAll(".item");
				for (let i = 0, len = basemaps.length; i < len; i++) {
					let basemap = basemaps[i];
					basemap.addEventListener("click", function() {
						currentBasemap.basemap = this.id;
					});
				};

				// highlight is set on the layerView, so we need to detect when the layerView is ready
				sceneView.whenLayerView(layer).then(function(lyrView) {
					// creates the query that will be used to obtain the features needed for the highlight
					let queryPlaces = layer.createQuery();
					// features that are passed in the highlight function need to have an `objectID`
					// if the query is built using `new Query()` then `queryStations.outFields = ["objectID"]` should be set
					
					for (let i = 0, len = photos.length; i < len; i++) {
						photos[i].addEventListener("click", onClick);
			            photos[i].addEventListener("mouseover", onMouseOver);
						photos[i].addEventListener("mouseout", onMouseOut);
			        }

			        function onClick() {
			        	placeDescSpan.style.display = "none";
			        	placeDescSpan.classList = "";
			            let photoId = this.getAttribute("objectid");
			            let place = this.getAttribute("alt");

			            queryPlaces.where = "OBJECTID=" + photoId;
			            layer.queryFeatures(queryPlaces).then(
		              
			            function(result) {
			              
			                // if a feature is already highlighted, then remove the highlight
			                if (highlightSelect) {
			                  highlightSelect.remove();
			                }

			                // the feature to be highlighted
			                let feature = result.features[0];
			                let placeDesc = feature.attributes.Place;
			                let zoom, titl, heading;
			                zoom = 17;
			               
			                if ((/^paris/).test(place)) {
			                	titl = 0;
			                	heading = 0;
			                }
			                else if ((/^reunion/).test(place)) {
			                	titl = 80;
			                	if (photoId == 27) {
			                		heading = 270;
			                		zoom = 17.7;
			                	} else {
				                	heading = 105;
			                	}
			                	
			            	}
			            	else {
			            		if( photoId == 1 ) {
			            			titl = 82.92118436024847;
			            			heading = 208.55543599851103;
			            			zoom = 14.666159218993604;
			            		}
			            		if( photoId == 24 ) {
			            			heading = 49.19808545889211;
			            			zoom = 15.641198763461151;
			            			titl = 78.78057997351706;
			            		}
			            		if( photoId == 29 || photoId == 37 ) {
			            			heading = 283.40406391956344;
			            			zoom = 16.504134416737035;
			            			titl = 78.73480543914509;
			            		}
			            		if( photoId == 39 ) {
			            			heading = 0;
			            			zoom = 17;
			            			titl = 0;
			            		}
			            		if( photoId == 41 ) {
			            			heading = 7.99528023385289;
			            			zoom = 17.863338490865544;
			            			titl = 79.90827805978651;
			            		}
							}

			                // use the objectID to highlight the feature
			                highlightSelect = lyrView.highlight(feature.attributes[
			                  "OBJECTID"]);

			                sceneView.goTo({
			                  target: feature.geometry,
			                  tilt: titl,/**/
			                  zoom: zoom,
			                  heading: heading

			                }, {
			                  duration: 5000,
			                  easing: "in-out-cubic"
			                });

			                setTimeout(function() {
			                	placeDescSpan.style.display = "inline";
			                	//placeDescSpan.classList = "animated flipInX";
					        	placeDescSpan.textContent = placeDesc;
			                }, 4000);
			               
			            });
		          	}

			        function onMouseOver() {
			           	let photoId = this.getAttribute("objectid");
				       	let place = this.getAttribute("alt");
				        queryPlaces.where = "OBJECTID=" + photoId;
			            hoverPromise = layer.queryFeatures(queryPlaces);
			            hoverPromise.then(
			            function(result) {
			                if (highlightHover) {
			                  highlightHover.remove();
			                }
			                let feature = result.features[0];
			                highlightHover = lyrView.highlight(feature.attributes["OBJECTID"]);
			            });
			        }

			        function onMouseOut() {
			          	// cancel the promise that retrieves the hovered feature in case it's not resolved yet.
			            hoverPromise.cancel();
			            if (highlightHover) {
			              highlightHover.remove();
			            }
			        }	
			    });	

				function setProgress(pg){
				  let pgBar = document.getElementsByClassName("progress-bar")[0];
				  pgBar.style.width= (pg) + "%";
				}

				function stopPropagation(event) { event.stopPropagation() };

				function buttonPlayPress() {

					sceneView.ui.components = [ "attribution" ];
					
					button_play.disabled = true;
		          	button_play.removeEventListener("click", buttonPlayPress);
		          	
		          	tabsEvent.addEventListener("click", stopPropagation, true);

		          	layer.popupEnabled = false;

		          	mapRow.addEventListener("click", stopPropagation, true);

		          	divProgress.style.display = "block";
		          	
		          	for (let i = 0, len = figures.length; i < len; i++) {
			    		let fig = figures[i];
			    		fig.removeEventListener( "mouseover", scaleFig );
						fig.removeEventListener( "mouseout",  unScaleFig );
			    	}/**/

			    	$( "#tabs" ).tabs( "option", "disabled", [ 1, 2, 3 ] );

			    	let currentPhotos = document.querySelectorAll("div[aria-hidden='false'] > figure > img");
		          	placeDescSpan.style.display = "none";
		          	placeDescSpan.classList = "";
		          	let x = 0;
		          	let len = currentPhotos.length;
		          	let z = 8000 * len;
		          	let y = 100/len;
		          	
		          	sceneView.whenLayerView(layer).then(function(lyrView) {

		          		for (let i = 0; i < len; i++) {

		          			setTimeout(function() {
								
								if(i > 0 ) {
									currentPhotos[i-1].parentElement.style.transform = "none";
									placeDescSpan.style.display = "none";
									placeDescSpan.classList = "";
								}

								currentPhotos[i].parentElement.style.transform = "scale(1.5)";
															    
								let queryPlaces = layer.createQuery();

								let photoId =  currentPhotos[i].getAttribute("objectid");
								
				            	let place = currentPhotos[i].getAttribute("alt");

					            queryPlaces.where = "OBJECTID=" + photoId;
					            
					            layer.queryFeatures(queryPlaces).then(
				              
					            function(result) {
					              
					                // if a feature is already highlighted, then remove the highlight
					                if (highlightSelect) {
					                  highlightSelect.remove();
					                }

					                // the feature to be highlighted
					                let feature = result.features[0];
					                let placeDesc = feature.attributes.Place;
					                let zoom, titl, heading;
					                zoom = 17;
					               
					                if ((/^paris/).test(place)) {
					                	titl = 0;
					                	heading = 0;
					                }
					                else if ((/^reunion/).test(place)) {
					                	titl = 80;
					                	if (photoId == 27) {
					                		heading = 270;
					                		zoom = 17.7;
					                	} else {
						                	heading = 105;
					                	}
					                	
					            	}
					            	else {
					            		if( photoId == 1 ) {
					            			titl = 82.92118436024847;
					            			heading = 208.55543599851103;
					            			zoom = 14.666159218993604;
					            		}
					            		if( photoId == 24 ) {
					            			heading = 49.19808545889211;
					            			zoom = 15.641198763461151;
					            			titl = 78.78057997351706;
					            		}
					            		if( photoId == 29 || photoId == 37 ) {
					            			heading = 283.40406391956344;
					            			zoom = 16.504134416737035;
					            			titl = 78.73480543914509;
					            		}
					            		if( photoId == 39 ) {
					            			heading = 0;
					            			zoom = 17;
					            			titl = 0;
					            		}
					            		if( photoId == 41 ) {
					            			heading = 7.99528023385289;
					            			zoom = 17.863338490865544;
					            			titl = 79.90827805978651;
					            		}
									}

					                // use the objectID to highlight the feature
					                highlightSelect = lyrView.highlight(feature.attributes[
					                  "OBJECTID"]);

					                sceneView.goTo({

					                  target: feature.geometry,
					                  tilt: titl,/**/
					                  zoom: zoom,
					                  heading: heading

					                }, {
					                  duration: 5000,
					                  easing: "in-out-cubic"
					                });
					                 setTimeout(function() {
					                	placeDescSpan.style.display = "inline";
							        	placeDescSpan.textContent = placeDesc;
					                }, 3000);
					             })

					            setProgress(y);

								 y += 100/len;
								
					        },x*8000)
			          		
							x+=1;
						
						}


			          	setTimeout(function() {
			          			
			          			sceneView.ui.components = [ "zoom", "navigation-toggle", "compass" ];

			          			currentPhotos[len-1].parentElement.style.transform = "none";
					        	placeDescSpan.style.display = "none";

					        	button_play.disabled = false;
					        	button_play.addEventListener("click", buttonPlayPress);

					        	tabsEvent.removeEventListener("click", stopPropagation, true);

					        	mapRow.removeEventListener("click", stopPropagation, true);

					        	layer.popupEnabled = true;

					        	for (let i = 0, len = figures.length; i < len; i++) {
						    		let fig = figures[i];
						    		fig.addEventListener( "mouseover", scaleFig );
									fig.addEventListener( "mouseout", unScaleFig );
						    	}/**/

						    	$( "#tabs" ).tabs("enable");

						    	setProgress(0);

						    	divProgress.style.display = "none";

						}, z+1000);

			        })
			      	
			    }

				button_play.addEventListener("click", buttonPlayPress);
				
			});
