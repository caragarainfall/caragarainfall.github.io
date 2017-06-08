/*    
        @licstart  The following is the entire license notice for the 
        JavaScript code in this page.

        Copyright (C) 2015  CSU Phil-LiDAR 1
        http://csulidar1.info/ 
        http://www.edselmatt.com/

        The JavaScript code in this page is free software: you can
        redistribute it and/or modify it under the terms of the GNU
        General Public License (GNU GPL) as published by the Free Software
        Foundation, either version 3 of the License, or (at your option)
        any later version.  The code is distributed WITHOUT ANY WARRANTY;
        without even the implied warranty of MERCHANTABILITY or FITNESS
        FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

        As additional permission under GNU GPL version 3 section 7, you
        may distribute non-source (e.g., minimized or compacted) forms of
        that code without the copy of the GNU GPL normally required by
        section 4, provided you include this license notice and a URL
        through which recipients can access the Corresponding Source.   


        @licend  The above is the entire license notice
        for the JavaScript code in this page.
*/

var vector_layer;
var geojson_format = new OpenLayers.Format.GeoJSON({
	internalProjection: new OpenLayers.Projection("EPSG:3857"),
	externalProjection: new OpenLayers.Projection("EPSG:4326")
});
var arr_id;
    
//https://cors-anywhere.herokuapp.com/http://fmon.asti.dost.gov.ph/dataloc.php?param=rv&dfrm=null&dto=null&numloc=1&locs[]=779&data24=1
function get_sttion(device_id, station_name, rainVal) {
	 $.ajax({
        url: "https://cors-anywhere.herokuapp.com/http://fmon.asti.dost.gov.ph/dataloc.php?param=rv&dfrm=null&dto=null&numloc=1&data24=1&locs[]=" + device_id,
        dataType: 'html',
        type: "GET",
        beforeSend: function() {
            $('#max_rainfall, #accum').hide();
            $('#container').html("<br/><br/><center><p>Getting <strong>" + station_name + "</strong> data. Please wait.</p></center><br/>");
        },
        success: function(html_d) {
			  var data = jQuery.parseJSON(html_d);
		     if(data.length == 0) {
				  $('#max_rainfall, #accum').hide();
                $('#container').html('<br/><center><strong><p style="color:red">No data available...try again later.</p></strong></center>');
            } else {
				
				var st_name = Object.keys(data);
					var rainVal = data[st_name];
					var lenlen = rainVal.length;
					  var   finalAccum = [],
							a = [],
							o = [],
							tofixAccum,
							tofixRainVal,
							firstDate,
							lastDate,
							getIndex = 0,
							diffHours = 0,
							i;
					for(var k=0;k < rainVal.length; k++){
						firstDate = rainVal[rainVal.length - k - 1][0];
						lastDate = rainVal[rainVal.length - 1][0];
						diffHours = Math.abs(lastDate - firstDate) / 36e5;
						console.log(diffHours);
					}
					
					for (i = 0; i < rainVal.length; i++) {
							var accumRain = parseFloat(rainVal[i][1]);
							finalAccum = parseFloat(finalAccum + accumRain);
							rainValpH = rainVal[i][1] * 4;
							tofixAccum = finalAccum.toFixed(1);
							tofixRainVal = rainValpH.toFixed(1);
							var t = rainVal[i][0];
							a.push([t, parseFloat(tofixAccum)]), o.push([t, parseFloat(tofixRainVal)]);
					}
                var aLen = a.length - 1;
                var options = {
                    chart: {
                        renderTo: 'container',
                        type: 'line',
                        //width: 800,
                        height: 450,
                        alignTicks: false,
                        reflow: true
                    },
                    credits: false,                  
                    title: {
                        text: station_name
                    },
                    subtitle: {
                        text: 'Source: <a href="http://fmon.asti.dost.gov.ph/weather/predict/" target="_blank">PREDICT, DOST</a>',
                        x: -20
                    },
                    xAxis: {
                        type: "datetime",
                        labels: {
                          formatter: function() {
                            return Highcharts.dateFormat("%b %e, %Y %I:%M %p", this.value);
                          },
                          dateTimeLabelFormats: {
                            hour: "%I:%M",
                            minute: "%I:%M %p",
                            day: "%e. %b",
                            week: "%e. %b",
                            month: "%b '%y",
                            year: "%Y"
                          },
                          padding: 15,
                          align: "center",
                          style: {
                            fontSize: "10px"
                          }
                        },
                        reversed:false
                      },
                      tooltip: {
                        formatter: function() {
                          if ("Rainfall Intensity" != this.series.name) return Highcharts.dateFormat("%b %e, %Y %I:%M %p", new Date(this.x)) + "<br/>" + this.series.name + ": <b>" + this.y + " mm</b>";
                          else return Highcharts.dateFormat("%b %e, %Y %I:%M %p", new Date(this.x)) + "<br/>" + this.series.name + ": <b>" + this.y + " mm/hr.</b>";
                        },
                        style: {
                          fontSize: "11px"
                        }
                      },
                    yAxis: [{ //primary y axis  
                        min: 0,
                        max: 100,
                        tickInterval:20,
                        title: {
                            text: "Rainfall Intensity, mm/hr."
                        },
                        reversed: !0,
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: "#808080"
                        }],
                        plotBands: [{
                                color: '#86e3e7',
                                from: 0,
                                to: 2.5,
                                label: {
                                    text: 'Light',
                                    align: 'left',
                                    x: 10
                                }
                            }, {
                                color: '#8aa7fd',
                                from: 2.5,
                                to: 7.5,
                                label: {
                                    text: 'Moderate',
                                    align: 'left',
                                    x: 10
                                }
                            }, {
                                color: '#8686dc',
                                from: 7.5,
                                to: 15,
                                label: {
                                    text: 'Heavy',
                                    align: 'left',
                                    x: 10
                                }
                            }, {
                                color: '#fed88d',
                                from: 15,
                                to: 30,
                                label: {
                                    text: 'Intense',
                                    align: 'left',
                                    x: 10
                                }
                            }, {
                                color: '#fe9686',
                                from: 30,
                                to: 50000,
                                label: {
                                    text: 'Torrential',
                                    align: 'left',
                                    x: 10
                                }
                            }

                        ]
                    }, { //secondary y axis                            
                        title: {
                            text: "Accumulated Rainfall, mm"
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: "#808080"
                        }],
                        opposite: !0,
                        min: 0,
                        max: 200,
                        tickInterval:40,
                        startOnTick: false,
                        endOnTick: false, 
                        reversed: !1
                    }],
                    gridLineDashStyle: 'solid',
                    series: [{
                        name: "Rainfall Intensity",
                        data: o,
                        tooltip: {
                            valueSuffix: "  mm/hr."
                        },
                        color: "#0000ff"
                    }, {
                        name: "Accumulated Rainfall",
                        data: a,
                        tooltip: {
                            valueSuffix: " mm"
                        },
                        yAxis: 1,
                        color: "#ff0000"
                    }]
                }; //options
                var chart = new Highcharts.Chart(options);
                var max = chart.yAxis[0].dataMax,
                    series,
                    i = 0,
                    arr = [],
                    myIndex = [],
                    s = chart.series[0],
                    len = s.data.length;

                //getting the latest index with max value in y-axis
                for (var j = 0; j < len; j++) {
                    arr[j] = chart.series[0].data[j].y;
                    if (arr[j] === max) {
                        myIndex.push(j);
                    }
                }

                var maxIndex = Math.max.apply(Math, myIndex);
                var realDate = Highcharts.dateFormat("%b %e, %Y %I:%M %p", new Date(o[maxIndex][0]));
                var finalData = a[aLen][1];

                if (max > 0) {
                    $('#max_rainfall').html("Maximum Rainfall Intensity: <strong>" + max + " mm/hr</strong> on " + realDate)
                } else {
                    $('#max_rainfall').html("Maximum Rainfall Intensity: <strong>" + max + " mm/hr</strong>")
                }
                if (getIndex!=0){
                    $('#accum').html("Total Accumulated Rainfall in the last 24 hrs.: <strong>" + finalData + " mm</strong>")
                } else {
                    $('#accum').html("Total Accumulated Rainfall: <strong>" + finalData + " mm</strong>")
                }
                $('#max_rainfall, #accum').show();
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            $('#container').html('<br/><br/><center><strong><p style="color:red">Status: ' + xhr.status + '\n' + thrownError + '</p></strong></center>');
        }
    }); //AJAX           
}

var map, ctrlSelectFeatures;
var style;

    /**
     * Here we create a new style object with rules that determine
     * which symbolizer will be used to render each feature.
     */
    style = new OpenLayers.Style(
        // the first argument is a base symbolizer
        // all other symbolizers in rules will extend this one
        {
            strokeColor: "#000",
            strokeOpacity: 1,
            strokeWidth: 1,
            fillOpacity: 1,
            pointRadius: 7,
            pointerEvents: "visiblePainted",
            label: "${proper_name}",
            fontColor: "#000",
            fontSize: "10px",
            fontFamily: "Arial",
            labelAlign: "left",
            labelOutlineColor: "#eee",
            labelOutlineWidth: .5,
            labelXOffset: 7,
            fontWeight: "bold",
            labelYOffset: 0,
            cursor: "pointer"
        },
        // the second argument will include all rules
        {
            rules: [
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "rain_intensity", // No Data
                        value: -1
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        fillColor: "#000"
                    }
                }),
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "rain_intensity", // No Rain
                        value: 0
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        fillColor: "#fff"
                    }
                }),
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.BETWEEN,
                        property: "rain_intensity", // Light
                        lowerBoundary: 0.00000001,
                        upperBoundary: 2.5
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        fillColor: "#86e3e7"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.BETWEEN,
                        property: "rain_intensity", // Moderate
                        lowerBoundary: 2.5,
                        upperBoundary: 7.5
                    }),
                    symbolizer: {
                        fillColor: "#8aa7fd"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.BETWEEN,
                        property: "rain_intensity", // Heavy
                        lowerBoundary: 7.5,
                        upperBoundary: 15
                    }),
                    symbolizer: {
                        fillColor: "#8686dc"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.BETWEEN,
                        property: "rain_intensity", // Intense
                        lowerBoundary: 15,
                        upperBoundary: 30
                    }),
                    symbolizer: {
                        fillColor: "#fed88d"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.GREATER_THAN,
                        property: "rain_intensity", // Torrential
                        value: 30
                    }),
                    symbolizer: {
                        fillColor: "#fe9686"
                    }
                }),
            ]
        }
    );


function rainfall(myJson) {
    vector_layer.addFeatures(geojson_format.read(myJson));
   
}

function init() {
    map = new OpenLayers.Map("map", {
        projection: new OpenLayers.Projection("EPSG:3857"),
        units: "m",
        maxResolution: 156543.0339,
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.KeyboardDefaults(),
            new OpenLayers.Control.Zoom
        ]
    });

    var mapnik = new OpenLayers.Layer.OSM("OSM");
    map.addLayer(mapnik);


    // transform coordinates for centering the map and set zoom level
    map.setCenter(new OpenLayers.LonLat(125.74, 9.13).transform(
        new OpenLayers.Projection("EPSG:4326"),
        map.getProjectionObject()
    ), 9);
    $("#modal-content").on("hidden.bs.modal", function() {
        ctrlSelectFeatures.unselectAll()
    })
	vector_layer = new OpenLayers.Layer.Vector("Points", {
        styleMap: new OpenLayers.StyleMap(style)
    });
    map.addLayer(vector_layer);
    ctrlSelectFeatures = new OpenLayers.Control.SelectFeature(
        vector_layer, {
            clickout: true,
            toggle: false,
            multiple: false,
            hover: false
        }
    );

    map.addControl(ctrlSelectFeatures);
    ctrlSelectFeatures.activate();
    vector_layer.events.on({
        "featureselected": function(e) {
            deviceID = e.feature.attributes.device_id;
            station_name = e.feature.attributes.proper_name;
            date_rainval = e.feature.attributes.rain_val;
            
            $("#modal-content").modal({
                show: !0
            });        
            get_sttion(deviceID, station_name, date_rainval);
        },
        "featureunselected": function() {
            $("#modal-content").modal({
                show: !1
            });
             $('#max_rainfall, #accum').hide();       
			 $('#container').empty();
        }
    });

}
var jsonObj;
$(window).load(function() {
    init();
    jsonObj = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.481981,
                    8.947345
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_NORTE-BUTUAN_PAGASA_COMPOUND-UAAWS",
                "device_id": 118,
                "proper_name": "BUTUAN PAGASA COMPOUND - UAAWS"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.546357,
                    9.121524
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_NORTE-CABADBARAN-RAIN2-",
                "device_id": 711,
                "proper_name": "CABADBARAN CITY"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.59641,
                    8.95917
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_NORTE-CARAGA_STATE_UNIVERSITY_AMPAYON-RAIN2-",
                "device_id": 779,
                "proper_name": "CARAGA STATE UNIVERSITY"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.692343,
                    9.014568
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_NORTE-DUGYAMAN_ANTICALA-RAIN2-",
                "device_id": 707,
                "proper_name": "DUGYAMAN, ANTICALA"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.55945,
                    9.24156
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_NORTE-JAGUPIT-RAIN2-",
                "device_id": 713,
                "proper_name": "JAGUPIT"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.569889,
                    9.437884
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_NORTE-KITCHARAO_MUNICIPAL_HALL_COMPOUND-RAIN2-",
                "device_id": 155,
                "proper_name": "KITCHARAO MUNICIPAL HALL COMPOUND"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.5998,
                    8.73295
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_NORTE-MAT-I-RAIN2-",
                "device_id": 611,
                "proper_name": "MAT-I"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.51621,
                    9.34275
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_NORTE-POBLACION-RAIN2-",
                "device_id": 712,
                "proper_name": "POBLACION"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.642308,
                    9.05916
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_NORTE-SAN_ANTONIO-RAIN2-",
                "device_id": 710,
                "proper_name": "SAN ANTONIO"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.626858,
                    8.825895
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_NORTE-SUMILE-RAIN2-",
                "device_id": 706,
                "proper_name": "SUMILE"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.94108,
                    8.550003
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_SUR-AGUSAN_DEL_SUR_PROVINCIAL_CAPITOL-RAIN2-",
                "device_id": 739,
                "proper_name": "PROPERIDAD, PROVINCIAL CAPITOL"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    126.01145,
                    8.506214
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_SUR-ALEGRIA-RAIN2-",
                "device_id": 566,
                "proper_name": "ALEGRIA"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    126.0028,
                    8.1706
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_SUR-ASSCAT_SAN_TEODORO-RAIN2-",
                "device_id": 570,
                "proper_name": "ASSCAT, SAN TEODORO"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.7514,
                    8.713
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_SUR-BAYUGAN_CITY_HALL-RAIN2-",
                "device_id": 564,
                "proper_name": "BAYUGAN CITY HALL"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.7492,
                    8.715886
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_SUR-BAYUGAN_III_NATIONAL_HIGH_SCHOOL-RAIN2-",
                "device_id": 592,
                "proper_name": "BAYUGAN III NATIONAL HIGH SCHOOL"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.7394,
                    8.6283
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_SUR-DON_FLAVIA-RAIN2-",
                "device_id": 607,
                "proper_name": "DOÑA FLAVIA"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.905236,
                    8.06762
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_SUR-DON_MATEO-RAIN2-",
                "device_id": 608,
                "proper_name": "DON MATEO"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.657983,
                    8.67789
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_SUR-ESPERANZA_POBLACION-RAIN2-",
                "device_id": 609,
                "proper_name": "ESPERANZA,POBLACION"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.853157,
                    8.185955
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_SUR-LORETO_MUNICIPAL_HALL-RAIN2-",
                "device_id": 591,
                "proper_name": "LORETO MUNICIPAL HALL"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    126.00708,
                    8.63208
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_SUR-MAGSAYSAY-RAIN2-",
                "device_id": 588,
                "proper_name": "MAGSAYSAY"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    126.12321,
                    8.12093
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_SUR-MANAT_ELEM._SCHOOL-RAIN2-",
                "device_id": 568,
                "proper_name": "MANAT ELEM. SCHOOL"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.8066,
                    8.2798
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_SUR-PANANGAN-RAIN2-",
                "device_id": 612,
                "proper_name": "PANANGAN"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    126.00091,
                    8.38282
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_SUR-ROSARIO_MUNICIPAL_HALL-RAIN2-",
                "device_id": 565,
                "proper_name": "ROSARIO MUNICIPAL HALL"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.6929,
                    8.8193
                ]
            },
            "properties": {
                "name": "AGUSAN_DEL_SUR-SIBAGAT_MUNICIPAL_HALL-RAIN2-",
                "device_id": 563,
                "proper_name": "SIBAGAT MUNICIPAL HALL"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    126.017343,
                    9.229546
                ]
            },
            "properties": {
                "name": "CARMEN, Carmen Municipal Hall - Rain2",
                "device_id": 1561,
                "proper_name": "Carmen Municipal Hall"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.7,
                    9.5833
                ]
            },
            "properties": {
                "name": "GIGAQUIT, POBLACION - Rain2",
                "device_id": 1387,
                "proper_name": "POBLACION"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.4,
                    9.61666
                ]
            },
            "properties": {
                "name": "MALIMONO, SAN ISIDRO - Rain2",
                "device_id": 1388,
                "proper_name": "MALIMONO, SAN ISIDRO"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.477278,
                    9.663402
                ]
            },
            "properties": {
                "name": "SURIGAO CITY ELEMENTARY SCHOOL, SUKALIANG - Rain2",
                "device_id": 1575,
                "proper_name": "SURIGAO CITY ELEMENTARY SCHOOL"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.4954178,
                    9.738635
                ]
            },
            "properties": {
                "name": "SURIGAO CITY, BONIFACIO ELEMENTARY SCHOOL - Rain2",
                "device_id": 1567,
                "proper_name": "BONIFACIO ELEMENTARY SCHOOL"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    126.010491,
                    9.13778
                ]
            },
            "properties": {
                "name": "CARMEN, CARMEN - Rain2",
                "device_id": 1577,
                "proper_name": "CARMEN"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.506084,
                    9.72303
                ]
            },
            "properties": {
                "name": "SURIGAO CITY, QUEZON  - Rain2",
                "device_id": 1568,
                "proper_name": "QUEZON "
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.419528,
                    9.778028
                ]
            },
            "properties": {
                "name": "SAN FRANCISCO MUNICIPAL HALL COMPOUND - Rain2",
                "device_id": 152,
                "proper_name": "SAN FRANCISCO MUNICIPAL HALL COMPOUND"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.721148,
                    9.568606
                ]
            },
            "properties": {
                "name": "CLAVER MUNICIPAL HALL COMPOUND - Rain2",
                "device_id": 154,
                "proper_name": "CLAVER MUNICIPAL HALL COMPOUND "
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.520014,
                    9.652722
                ]
            },
            "properties": {
                "name": "SISON ELEMENTARY SCHOOL - Rain2",
                "device_id": 153,
                "proper_name": "SISON ELEMENTARY SCHOOL"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.40162,
                    9.61856
                ]
            },
            "properties": {
                "name": "MALIMONO, MALIMONO - Rain2",
                "device_id": 1203,
                "proper_name": "MALIMONO"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.69779,
                    9.59577
                ]
            },
            "properties": {
                "name": "GIGAQUIT, GIGAQUIT - Rain2",
                "device_id": 1204,
                "proper_name": "GIGAQUIT"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.56975,
                    9.55373
                ]
            },
            "properties": {
                "name": "TUBOD, TUBOD MUNICIPAL HALL - Rain2",
                "device_id": 708,
                "proper_name": "TUBOD MUNICIPAL HALL"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.523452,
                    9.540541
                ]
            },
            "properties": {
                "name": "MAINIT, MAINIT MUNICIPAL HALL - Rain2",
                "device_id": 709,
                "proper_name": "MAINIT MUNICIPAL HALL"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    126.03578,
                    9.13911
                ]
            },
            "properties": {
                "name": "LANUZA, Florita Herrera-Irizari Nat’l High School - Rain2",
                "device_id": 1576,
                "proper_name": "Florita Herrera-Irizari Nat’l High School"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    126.038571,
                    8.94671
                ]
            },
            "properties": {
                "name": "SAN MIGUEL, TAGO, TINA - Rain2",
                "device_id": 780,
                "proper_name": "TAGO, TINA"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    126.28368,
                    8.96935
                ]
            },
            "properties": {
                "name": "BAYABAS, BALITE - Rain2",
                "device_id": 781,
                "proper_name": "BAYABAS, BALITE"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.466466,
                    9.734774
                ]
            },
            "properties": {
                "name": "SURIGAO CITY, MAT-I NATIONAL HIGH SCHOOL - Rain2",
                "device_id": 1573,
                "proper_name": "MAT-I NATIONAL HIGH SCHOOL"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    126.233591,
                    9.016448
                ]
            },
            "properties": {
                "name": "TAGO, TAGO POBLACION - Rain2",
                "device_id": 1574,
                "proper_name": "TAGO POBLACION"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    126.315939,
                    8.213136
                ]
            },
            "properties": {
                "name": "BISLIG CITY, BISLIG CITY NATIONAL HIGH SCHOOL - UAAWS",
                "device_id": 121,
                "proper_name": "BISLIG CITY NATIONAL HIGH SCHOOL"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    126.202814,
                    8.731382
                ]
            },
            "properties": {
                "name": "SAN AGUSTIN, SAN AGUSTIN MUNICIPAL TOWN SQUARE - UAAWS",
                "device_id": 120,
                "proper_name": "SAN AGUSTIN MUNICIPAL TOWN SQUARE"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    126.16872,
                    9.07375
                ]
            },
            "properties": {
                "name": "TANDAG CITY, AWASIAN - Rain2",
                "device_id": 782,
                "proper_name": "AWASIAN"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.6202214,
                    9.955568
                ]
            },
            "properties": {
                "name": "DINAGAT, DINAGAT - Rain2",
                "device_id": 1562,
                "proper_name": "DINAGAT"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.6166,
                    9.95
                ]
            },
            "properties": {
                "name": "DINAGAT, CAYETANO - Rain2",
                "device_id": 1385,
                "proper_name": "CAYETANO"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.5888,
                    10.0083
                ]
            },
            "properties": {
                "name": "SAN JOSE, LUNA - Rain2",
                "device_id": 1386,
                "proper_name": "LUNA"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.34303,
                    8.924192
                ]
            },
            "properties": {
                "name": "NASIPIT, BRGY. HAMIGUITAN - Rain2",
                "device_id": 1565,
                "proper_name": "BRGY. HAMIGUITAN"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    125.59696,
                    10.0655
                ]
            },
            "properties": {
                "name": "BASILISA, BASILISA POBLACION - Rain2",
                "device_id": 1563,
                "proper_name": "BASILISA POBLACION"
            }
        }]
    };


    //list of CARAGA Region Rainfall Station Device ID
    arr_id = [611, 1564, 1565, 1561, 712, 779, 118, 707, 706, 711, 155, 713, 710, 607, 609, 592, 739, 589, 608, 606, 569, 570, 612, 587, 567, 591, 564, 563, 566, 565, 568, 588, 1561, 1387, 1388, 1575, 1567, 1577, 1568, 152, 154, 153, 1203, 1204, 708, 709, 1576, 780, 781, 1573, 1574, 782, 121, 120, 1562, 1385, 1386, 1563];
    //arr_id = [611, 1564, 1565, 1561, 712];
    var json_device_id,
        arr = [],
        jsonObj_device_id,
        len = jsonObj.features.length,
        counter = 0,
        i;

    for (i = 0; i < arr_id.length; i++) {
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/http://fmon.asti.dost.gov.ph/dataloc.php?param=rv&dfrm=null&dto=null&numloc=1&data24=1&locs[]=" + arr_id[i],
            dataType: 'html',
            type: "GET",
            success: function(html_d) {
				 var data = jQuery.parseJSON(html_d);
                counter++;
                $('#count').text(counter + ' out of ' + arr_id.length + ' stations has been loaded.').fadeIn("slow");
                /**$.map(data, function(e) {
                    var dev_id = arr_id[i];
                    var data = e.data;
                    var max = -1;
                    var rainVal;
                    arr = [];
                    if (data) {
                        for (var j = 0; j < data.length; j++) {
                            rainVal = data[j].rain_value || 0;
                            arr[j] = parseFloat(rainVal);
                        }
                    }
                    if (arr.length) {
                        max = parseFloat(arr[0] * 4);
                    }

                    for (var k = 0; k < len; k++) {
                        jsonObj_device_id = jsonObj.features[k].properties.device_id;
                        if (jsonObj_device_id === dev_id) {
                            var nameR = "rain_intensity";
                            var rainValue = max;
                            jsonObj.features[k].properties[nameR] = rainValue;
                        }
                    }
                });//end map
                **/
                var latest_rainval;
                var dev_id = arr_id[counter-1];
                

                if(data.length == 0){
                    latest_rainval = -1;
                    //console.log(dev_id+' '+latest_rainval)
                }else{
                    var st_name = Object.keys(data);
                    var data_len = parseInt(data[st_name].length) - 1;
                    latest_rainval = parseFloat(data[st_name][data_len][1] * 4);
					console.log(st_name+' Latest Rainfall Value: '+latest_rainval+' mm/hr')
                }
                
                //console.log(latest_rainval);
                for (var k = 0; k < len; k++) {
                        jsonObj_device_id = jsonObj.features[k].properties.device_id;
                        if (jsonObj_device_id === dev_id) {
                            var nameR = "rain_intensity";
                            var rainValue = latest_rainval;
                            jsonObj.features[k].properties[nameR] = rainValue;
                            jsonObj.features[k].properties['rain_val'] = data[st_name];
                        }
                }
                //console.log(jsonObj);
                $('#help').fadeIn("slow");
                vector_layer.addFeatures(geojson_format.read(jsonObj));
                //load map after all the rain_value is updated on the GeoJSON data
                if (counter == arr_id.length) {
                    $('#count').fadeOut("slow");     
                }
            }, //success
            error: function(xhr, ajaxOptions, thrownError) {
                $('#count').html('<strong><p style="color:red">Unable to access remaining stations. Try again later.</p></strong>');
            }
        }); 
    };
});
