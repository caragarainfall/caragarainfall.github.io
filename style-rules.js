/*
        @licstart  The following is the entire license notice for the
        JavaScript code in this page.

        Copyright (C) 2015-2017  CSU Phil-LiDAR 1
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


//https://cors-anywhere.herokuapp.com/http://fmon.asti.dost.gov.ph/dataloc.php?param=rv&dfrm=null&dto=null&numloc=1&locs[]=779&data24=1
function get_sttion(device_id, station_name) {
  $.ajax({
    url: "https://cors-for-rainfall.herokuapp.com/http://fmon.asti.dost.gov.ph/dataloc.php?param=rv&dfrm=null&dto=null&numloc=1&data24=1&locs[]=" + device_id,
    dataType: 'html',
    type: "GET",
    beforeSend: function() {
      $('#max_rainfall, #accum').hide();
      $('#container').html("<br/><br/><center><p>Getting <strong>" + station_name + "</strong> data. Please wait.</p></center><br/>");
    },
    success: function(html_d) {
      var data = jQuery.parseJSON(html_d);
      var st_name = Object.keys(data);
      console.log(st_name);
      if (data.length == 0) {
        $('#max_rainfall, #accum').hide();
        $('#container').html('<br/><center><strong><p style="color:red">No data available...try again later.</p></strong></center>');
      } else {

        var st_name = Object.keys(data);
        var rainVal = data[st_name];
        var lenlen = rainVal.length;
        var finalAccum = [],
          a = [],
          o = [],
          tofixAccum,
          tofixRainVal,
          firstDate,
          lastDate,
          getIndex = 0,
          diffHours = 0,
          i;
        for (var k = 0; k < rainVal.length; k++) {
          firstDate = rainVal[rainVal.length - k - 1][0];
          lastDate = rainVal[rainVal.length - 1][0];
          diffHours = Math.abs(lastDate - firstDate) / 36e5;
          console.log(diffHours + ': index: ' + parseFloat(rainVal.length - k - 1));
          if (diffHours == 24) {
            getIndex = parseFloat(rainVal.length - k - 1)
          }

        }

        for (i = getIndex; i < rainVal.length; i++) {
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
            reversed: false
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
            tickInterval: 20,
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
            tickInterval: 40,
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
        if (diffHours >= 24) {
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
          lowerBoundary: 0.00000000000001,
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

      $("#modal-content").modal({
        show: !0
      });
      get_sttion(deviceID, station_name);
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

var vector_layer;
var geojson_format = new OpenLayers.Format.GeoJSON({
  internalProjection: new OpenLayers.Projection("EPSG:3857"),
  externalProjection: new OpenLayers.Projection("EPSG:4326")
});

function plotRainfallStations() {
  //list of CARAGA Region Rainfall Station Device ID
  //arr_id = [118,711,779,707,713,155,611,712,710,706,739,566,570,564,592,607,608,609,591,588,568,612,565,563,1561,1387,1388,1575,1567,1577,1568,152,154,153,1203,1204,708,709,1576,780,781,1573,1574,121,120,782,1562,1385,1386,1565,1563];

  //arr_id=['611','1564','1565','368','1561','118','712','779','707','706','711','155','713','710','566','571','568','592','588','567','591','606','589','607','565','587','569','612','564','563','609','739','570','890','893','119','1575','1567','1568','885','152','154','153','1203','1204','708','709','1576','780','781','887','1573','1574','121','120','782','1562','1386','1625','1624','1626','1563','723','2110','1289','960','1197','959','958','1915','131','1449','1914','724','1199','1284','1461','1285','955','957','1198','1287','364','1480','1456','1476','726','129','1457','1152','1460','961','956','1453','316','366','1454','732','731','729','2048','728','730','1450','1912','795','1458','549','1913','362','122'];
  var arr_id = ['611', '1564', '1565', '368', '1561', '118', '712', '779', '707', '706', '711', '155'];
  var jsonObj = {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.5998, 8.73295]
      },
      "properties": {
        "A": "1",
        "proper_name": "LAS NIEVES, MAT-I",
        "device_id": "611",
        "D": "Las Nieves",
        "E": "Agusan del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.40895, 8.97455]
      },
      "properties": {
        "A": "2",
        "proper_name": "BUENAVISTA, BUENAVISTA MUNICIPAL HALL",
        "device_id": "1564",
        "D": "Buenavista",
        "E": "Agusan del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.34303, 8.924192]
      },
      "properties": {
        "A": "3",
        "proper_name": "NASIPIT, BRGY. HAMIGUITAN",
        "device_id": "1565",
        "D": "Nasipit",
        "E": "Agusan del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.578056, 9.449444]
      },
      "properties": {
        "A": "4",
        "proper_name": "KITCHARAO, KITCHARAO - BSWM_Lufft",
        "device_id": "368",
        "D": "Kitcharao",
        "E": "Agusan del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.2957, 8.990048]
      },
      "properties": {
        "A": "5",
        "proper_name": "CARMEN, CARMEN MUNICIPAL HALL",
        "device_id": "1561",
        "D": "Carmen",
        "E": "Agusan del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.516667, 8.933333]
      },
      "properties": {
        "A": "6",
        "proper_name": "BUTUAN, BUTUAN PAGASA COMPOUND - UAAWS",
        "device_id": "118",
        "D": "Butuan",
        "E": "Agusan del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.51621, 9.34275]
      },
      "properties": {
        "A": "7",
        "proper_name": "JABONGA, POBLACION",
        "device_id": "712",
        "D": "Jabonga",
        "E": "Agusan del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.59641, 8.95917]
      },
      "properties": {
        "A": "8",
        "proper_name": "AMPAYON, BUTUAN CITY, CARAGA STATE UNIVERSITY",
        "device_id": "779",
        "D": "Butuan City",
        "E": "Agusan del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.692222, 9.014444]
      },
      "properties": {
        "A": "9",
        "proper_name": "BUTUAN, DUGYAMAN, ANTICALA",
        "device_id": "707",
        "D": "Butuan City",
        "E": "Agusan del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.626858, 8.825895]
      },
      "properties": {
        "A": "10",
        "proper_name": "BUTUAN CITY, SUMILE",
        "device_id": "706",
        "D": "Butuan City",
        "E": "Agusan del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.545556, 9.121944]
      },
      "properties": {
        "A": "11",
        "proper_name": "CABADBARAN CITY, CABADBARAN",
        "device_id": "711",
        "D": "Cabadbaran",
        "E": "Agusan del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.578333, 9.45]
      },
      "properties": {
        "A": "12",
        "proper_name": "KITCHARAO, KITCHARAO MUNICIPAL HALL COMPOUND",
        "device_id": "155",
        "D": "Kitcharao",
        "E": "Agusan del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.559444, 9.241389]
      },
      "properties": {
        "A": "13",
        "proper_name": "SANTIAGO, JAGUPIT",
        "device_id": "713",
        "D": "Santiago",
        "E": "Agusan del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.6298, 8.8245]
      },
      "properties": {
        "A": "14",
        "proper_name": "REMEDIOS T. ROMUALDEZ, SAN ANTONIO",
        "device_id": "710",
        "D": "RTR",
        "E": "Agusan del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.02515, 8.47803]
      },
      "properties": {
        "A": "15",
        "proper_name": "SAN FRANCISCO ALEGRIA",
        "device_id": "566",
        "D": "San Francisco",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.03271, 8.00983]
      },
      "properties": {
        "A": "16",
        "proper_name": "SANTA JOSEFA, STA. ISABEL",
        "device_id": "571",
        "D": "Sta. Josefa",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.12321, 8.12093]
      },
      "properties": {
        "A": "17",
        "proper_name": "MANAT, TRENTO, MANAT ELEM. SCHOOL",
        "device_id": "568",
        "D": "Trento",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.749225, 8.715886]
      },
      "properties": {
        "A": "18",
        "proper_name": "BAYUGAN CITY, BAYUGAN III NATIONAL HIGH SCHOOL",
        "device_id": "592",
        "D": "Bayugan City",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.00708, 8.63208]
      },
      "properties": {
        "A": "19",
        "proper_name": "PROSPERIDAD, MAGSAYSAY AGUSAN DEL SUR",
        "device_id": "588",
        "D": "Prosperidad",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.95547, 8.0693]
      },
      "properties": {
        "A": "20",
        "proper_name": "VERUELA, VERUELA MUNICIPAL HALL",
        "device_id": "567",
        "D": "Veruela",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.8571, 8.189546]
      },
      "properties": {
        "A": "21",
        "proper_name": "LORETO, LORETO MUNICIPAL HALL",
        "device_id": "591",
        "D": "Loreto",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.8011, 8.5869]
      },
      "properties": {
        "A": "22",
        "proper_name": "TALACOGON, TALACOGON MUNICIPAL HALL",
        "device_id": "606",
        "D": "Talacogon",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.85662, 8.54236]
      },
      "properties": {
        "A": "23",
        "proper_name": "PROSPERIDAD, SAN VICENTE POSPERIDAD",
        "device_id": "589",
        "D": "Prosperidad",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.7394, 8.6283]
      },
      "properties": {
        "A": "24",
        "proper_name": "SAN LUIS, DON FLAVIA",
        "device_id": "607",
        "D": "San Luis",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.00091, 8.38282]
      },
      "properties": {
        "A": "25",
        "proper_name": "ROSARIO, ROSARIO MUNICIPAL HALL",
        "device_id": "565",
        "D": "Rosario",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.8011, 8.5869]
      },
      "properties": {
        "A": "26",
        "proper_name": "TALACOGON, DESAMPORADOS",
        "device_id": "587",
        "D": "Talacogon",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.1593, 8.01986]
      },
      "properties": {
        "A": "27",
        "proper_name": "STA MARIA, TRENTO, STA MARIA ELEM SCHOOL",
        "device_id": "569",
        "D": "Trento",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.8066, 8.2798]
      },
      "properties": {
        "A": "28",
        "proper_name": "LA PAZ , PANANGAN",
        "device_id": "612",
        "D": "La Paz",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.7514, 8.713]
      },
      "properties": {
        "A": "29",
        "proper_name": "BAYUGAN CITY, BAYUGAN CITY HALL",
        "device_id": "564",
        "D": "Bayugan City",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.6929, 8.8193]
      },
      "properties": {
        "A": "30",
        "proper_name": "SIBAGAT, SIBAGAT MUNICPAL HALL",
        "device_id": "563",
        "D": "Sibagat",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.7044, 8.7806]
      },
      "properties": {
        "A": "31",
        "proper_name": "ESPERANZA, ESPERANZA POBLACION",
        "device_id": "609",
        "D": "Esperanza",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.94108, 8.550003]
      },
      "properties": {
        "A": "32",
        "proper_name": "PATIN-AY PROSPERIDAD, AGUSAN DEL SUR, PROVINCIAL CAPITOL",
        "device_id": "739",
        "D": "Prosperidad",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.0028, 8.1706]
      },
      "properties": {
        "A": "33",
        "proper_name": "BUNAWAN, ASSCAT, SAN TEODORO",
        "device_id": "570",
        "D": "Bunawan",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.657833, 8.678833]
      },
      "properties": {
        "A": "34",
        "proper_name": "ESPERANZA, ESPERANZA - BSWM_Lufft",
        "device_id": "890",
        "D": "Esperanza",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.943417, 8.552306]
      },
      "properties": {
        "A": "35",
        "proper_name": "PROSPERIDAD, PROSPERIDAD - BSWM_Lufft",
        "device_id": "893",
        "D": "Prosperidad",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.033333, 7.983333]
      },
      "properties": {
        "A": "36",
        "proper_name": "STA. JOSEFA, STA. JOSEFA GOVERNMENT SITE - UAAWS",
        "device_id": "119",
        "D": "Sta. Josefa",
        "E": "Agusan del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.477278, 9.663402]
      },
      "properties": {
        "A": "38",
        "proper_name": "SURIGAO CITY ELEMENTARY SCHOOL, SUKALIANG",
        "device_id": "1575",
        "D": "Surigao",
        "E": "Surigao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.495498, 9.738568]
      },
      "properties": {
        "A": "39",
        "proper_name": "SURIGAO CITY, BONIFACIO ELEMENTARY SCHOOL",
        "device_id": "1567",
        "D": "Surigao",
        "E": "Surigao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.506, 9.6872]
      },
      "properties": {
        "A": "40",
        "proper_name": "SURIGAO CITY, QUEZON",
        "device_id": "1568",
        "D": "Surigao",
        "E": "Surigao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.557778, 9.536667]
      },
      "properties": {
        "A": "41",
        "proper_name": "MAINIT, MAINIT - BSWM_Lufft",
        "device_id": "885",
        "D": "Mainit",
        "E": "Surigao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.421111, 9.776667]
      },
      "properties": {
        "A": "42",
        "proper_name": "SAN FRANCISCO, SAN FRANCISCO MUNICIPAL HALL COMPOUND",
        "device_id": "152",
        "D": "San Francisco",
        "E": "Surigao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.732709, 9.57376]
      },
      "properties": {
        "A": "43",
        "proper_name": "CLAVER, CLAVER MUNICIPAL HALL COMPOUND",
        "device_id": "154",
        "D": "Claver",
        "E": "Surigao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.528611, 9.659722]
      },
      "properties": {
        "A": "44",
        "proper_name": "SISON, SISON ELEMENTARY SCHOOL",
        "device_id": "153",
        "D": "Sison",
        "E": "Surigao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.401667, 9.618611]
      },
      "properties": {
        "A": "45",
        "proper_name": "MALIMONO, MALIMONO",
        "device_id": "1203",
        "D": "Malimono",
        "E": "Surigao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.697778, 9.595833]
      },
      "properties": {
        "A": "46",
        "proper_name": "GIGAQUIT, GIGAQUIT",
        "device_id": "1204",
        "D": "Gigaquit",
        "E": "Surigao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.569722, 9.553889]
      },
      "properties": {
        "A": "47",
        "proper_name": "TUBOD, TUBOD MUNICIPAL HALL",
        "device_id": "708",
        "D": "Tubod",
        "E": "Surigao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.523056, 9.540556]
      },
      "properties": {
        "A": "48",
        "proper_name": "MAINIT, MAINIT MUNICIPAL HALL",
        "device_id": "709",
        "D": "Mainit",
        "E": "Surigao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.05973, 9.23172]
      },
      "properties": {
        "A": "49",
        "proper_name": "LANUZA, Florita Herrera-Irizari Nat’l High School",
        "device_id": "1576",
        "D": "lanuza",
        "E": "Surigao del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.038611, 8.946861]
      },
      "properties": {
        "A": "50",
        "proper_name": "SAN MIGUEL, TAGO, TINA",
        "device_id": "780",
        "D": "San Miguel",
        "E": "Surigao del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.28368, 8.96935]
      },
      "properties": {
        "A": "51",
        "proper_name": "BAYABAS, BALITE",
        "device_id": "781",
        "D": "Bayabas",
        "E": "Surigao del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.968306, 9.338611]
      },
      "properties": {
        "A": "52",
        "proper_name": "CANTILAN, CANTILAN - BSWM_Lufft",
        "device_id": "887",
        "D": "Cantilan",
        "E": "Surigao del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.47825, 9.716331]
      },
      "properties": {
        "A": "53",
        "proper_name": "SURIGAO CITY, MAT-I NATIONAL HIGH SCHOOL",
        "device_id": "1573",
        "D": "Surigao",
        "E": "Surigao del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.233861, 9.015889]
      },
      "properties": {
        "A": "54",
        "proper_name": "TAGO, TAGO POBLACION",
        "device_id": "1574",
        "D": "Tago",
        "E": "Surigao del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.315939, 8.213136]
      },
      "properties": {
        "A": "55",
        "proper_name": "BISLIG CITY, BISLIG CITY NATIONAL HIGH SCHOOL - UAAWS",
        "device_id": "121",
        "D": "Bislig",
        "E": "Surigao del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.223699, 8.743103]
      },
      "properties": {
        "A": "56",
        "proper_name": "SAN AGUSTIN, SAN AGUSTIN MUNICIPAL TOWN SQUARE - UAAWS",
        "device_id": "120",
        "D": "San Agustin",
        "E": "Surigao del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.16872, 9.07375]
      },
      "properties": {
        "A": "57",
        "proper_name": "TANDAG CITY, AWASIAN",
        "device_id": "782",
        "D": "Tandag",
        "E": "Surigao del Sur"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.35, 9.5746]
      },
      "properties": {
        "A": "58",
        "proper_name": "DINAGAT, DINAGAT",
        "device_id": "1562",
        "D": "Dinagat",
        "E": "Dinagat Islands"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.5888, 10.0083]
      },
      "properties": {
        "A": "59",
        "proper_name": "SAN JOSE, LUNA",
        "device_id": "1386",
        "D": "San Jose",
        "E": "Dinagat Islands"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.672013, 9.923205]
      },
      "properties": {
        "A": "60",
        "proper_name": "CAGDIANAO, CAGDIANAO",
        "device_id": "1625",
        "D": "Cagdianao",
        "E": "Dinagat Islands"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.57843, 10.359748]
      },
      "properties": {
        "A": "61",
        "proper_name": "LORETO, LORETO",
        "device_id": "1624",
        "D": "Loreto",
        "E": "Dinagat Islands"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.533495, 10.195108]
      },
      "properties": {
        "A": "62",
        "proper_name": "LIBJO, LIBJO",
        "device_id": "1626",
        "D": "Libjo",
        "E": "Dinagat Islands"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.510278, 9.998067]
      },
      "properties": {
        "A": "63",
        "proper_name": "BASILISA, BASILISA POBLACION",
        "device_id": "1563",
        "D": "Basilisa",
        "E": "Dinagat Islands"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.969264, 7.448167]
      },
      "properties": {
        "A": "64",
        "proper_name": "MACO, MACO - Waterlevel & Rain2",
        "device_id": "723",
        "D": "Maco",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.01519, 7.28042]
      },
      "properties": {
        "A": "65",
        "proper_name": "MABINI - ANITAPAN NATIONAL HIGH SCHOOL",
        "device_id": "2110",
        "D": "Mabini",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.792719, 7.819065]
      },
      "properties": {
        "A": "66",
        "proper_name": "LAAK, LAAK MUNICIPAL HALL",
        "device_id": "1289",
        "D": "Laak",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.063778, 7.75]
      },
      "properties": {
        "A": "67",
        "proper_name": "MONKAYO, BABAG BRIDGE - Waterlevel & Rain2",
        "device_id": "1198",
        "D": "Monkayo",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.10832, 7.70599]
      },
      "properties": {
        "A": "68",
        "proper_name": "COMPOSTELA, COMPOSTELA - MANGAYON NHS",
        "device_id": "960",
        "D": "Compostela",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.089583, 7.676012]
      },
      "properties": {
        "A": "69",
        "proper_name": "COMPOSTELA, AGUSAN BRIDGE COMPOSTELA - Waterlevel & Rain2",
        "device_id": "959",
        "D": "Compostela",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.034139, 7.795833]
      },
      "properties": {
        "A": "70",
        "proper_name": "MONKAYO, OLAYCON - BRIDGE - Waterlevel & Rain2",
        "device_id": "1197",
        "D": "Monkayo",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.02328, 7.383583]
      },
      "properties": {
        "A": "71",
        "proper_name": "MAKO - TERESA NATIONAL HIGH SCHOOL, BRGY. Teresa",
        "device_id": "959",
        "D": "Mako",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.158521, 7.51321]
      },
      "properties": {
        "A": "72",
        "proper_name": "NEW BATAAN - BRGY. ANDAP -  Rain2",
        "device_id": "958",
        "D": "New Bataan",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.21166, 7.455778]
      },
      "properties": {
        "A": "73",
        "proper_name": "CATEEL, SITIO MAHO, BRGY. ANDAP",
        "device_id": "1915",
        "D": "Cateel",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.086, 7.351111]
      },
      "properties": {
        "A": "74",
        "proper_name": "MARAGUSAN, PSTC COMPOSTELA VALLEY",
        "device_id": "131",
        "D": "Monkayo",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.120651, 7.823864]
      },
      "properties": {
        "A": "75",
        "proper_name": "MONKAYO - MANGANON",
        "device_id": "1449",
        "D": "Monkayo",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.366194, 7.677697]
      },
      "properties": {
        "A": "76",
        "proper_name": "CATEEL, SITIO ANAHAW 35",
        "device_id": "1914",
        "D": "Cateel",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.013774, 7.402992]
      },
      "properties": {
        "A": "77",
        "proper_name": "NEW LEYTE - NEW LEYTE",
        "device_id": "724",
        "D": "Mako",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.050434, 7.83]
      },
      "properties": {
        "A": "78",
        "proper_name": "MONKAYO - KALAW BRIDGE - Waterlevel & Rain2",
        "device_id": "1199",
        "D": "Monkayo",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.003941, 7.707788]
      },
      "properties": {
        "A": "79",
        "proper_name": "MONTEVISTA - MONTEVISTA POBLACION",
        "device_id": "1284",
        "D": "Montevista",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.171995, 7.261005]
      },
      "properties": {
        "A": "80",
        "proper_name": "PANTUKAN - BRGY. ARAIBO - Waterlevel & Rain2",
        "device_id": "1461",
        "D": "Pantukan",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.143663, 7.314996]
      },
      "properties": {
        "A": "81",
        "proper_name": "MARAGUSAN, AGUSAN BRIDGE MARAGUSAN - Waterlevel & Rain2",
        "device_id": "1285",
        "D": "Maragusan",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.100521, 7.572987]
      },
      "properties": {
        "A": "82",
        "proper_name": "NEW BATAAN, BRGY. PANAG - Waterlevel & Rain2",
        "device_id": "955",
        "D": "New Bataan",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.134194, 7.578735]
      },
      "properties": {
        "A": "83",
        "proper_name": "NEW BATAAN - BANGOY BRIDGE - Waterlevel & Rain2",
        "device_id": "957",
        "D": "New Bataan",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.920721, 7.526523]
      },
      "properties": {
        "A": "85",
        "proper_name": "MAWAB - MALINAWON - Waterlevel & Rain2",
        "device_id": "1287",
        "D": "Mawab",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.018333, 7.289972]
      },
      "properties": {
        "A": "86",
        "proper_name": "MARAGUSAN - MARAGUSAN - BSWM_LUFFT",
        "device_id": "364",
        "D": "Maragusan",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.992667, 7.57775]
      },
      "properties": {
        "A": "87",
        "proper_name": "NABUNTURAN - UPAWS",
        "device_id": "1480",
        "D": "Nabunturan",
        "E": "Compostela Valley"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.486414, 7.633998]
      },
      "properties": {
        "A": "88",
        "proper_name": "TALAINGOD - BRGY. STO. NINO",
        "device_id": "1456",
        "D": "Talaingod",
        "E": "Davao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.779748, 7.45242]
      },
      "properties": {
        "A": "89",
        "proper_name": "TAGUM - PDRRM OFFICE",
        "device_id": "1476",
        "D": "Tagum city",
        "E": "Davao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.82408, 7.58712]
      },
      "properties": {
        "A": "90",
        "proper_name": "NEW CORELLA - NEW CORELLA",
        "device_id": "726",
        "D": "New Corella",
        "E": "Davao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [124.24397, 8.1628]
      },
      "properties": {
        "A": "91",
        "proper_name": "PANABO - PANABO",
        "device_id": "129",
        "D": "Panabo",
        "E": "Davao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.571777, 7.631437]
      },
      "properties": {
        "A": "92",
        "proper_name": "TALAINGOD - TALAINGOD MUNICIPAL HALL",
        "device_id": "1457",
        "D": "Talaingod",
        "E": "Davao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.69877, 7.59273]
      },
      "properties": {
        "A": "93",
        "proper_name": "KAPALONG - KAPALONG - Waterlevel & Rain 2",
        "device_id": "1152",
        "D": "Kapalong",
        "E": "Davao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.749679, 7.438699]
      },
      "properties": {
        "A": "94",
        "proper_name": "TAGUM CITY - MAGUPISING BRIDGE - Waterlevel & Rain 2",
        "device_id": "1460",
        "D": "Tagum city",
        "E": "Davao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.75814, 7.5343]
      },
      "properties": {
        "A": "95",
        "proper_name": "ASUNCION - LAWANG BRIDGE, ASUNCION - Waterlevel & Rain 2",
        "device_id": "961",
        "D": "Asuncion",
        "E": "Davao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.62144, 7.51597]
      },
      "properties": {
        "A": "96",
        "proper_name": "STO. TOMAS - MENZI BRIDGE - Waterlevel & Rain 2",
        "device_id": "956",
        "D": "Sto. Tomas",
        "E": "Davao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.827938, 7.434327]
      },
      "properties": {
        "A": "97",
        "proper_name": "TAGUM CITY - APOKON BRIDGE - Waterlevel & Rain 2",
        "device_id": "1453",
        "D": "Tagum city",
        "E": "Davao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.598222, 7.495]
      },
      "properties": {
        "A": "98",
        "proper_name": "STO TOMAS - STO TOMAS - BSWM_Lufft",
        "device_id": "316",
        "D": "Sto. Tomas",
        "E": "Davao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.704444, 7.362778]
      },
      "properties": {
        "A": "99",
        "proper_name": "CARMEN - ISING - BSWM_Lufft",
        "device_id": "366",
        "D": "Carmen",
        "E": "Davao del Norte"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.091894, 6.836565]
      },
      "properties": {
        "A": "100",
        "proper_name": "SAN ISIDRO, MDRRM OFFICE",
        "device_id": "1454",
        "D": "San Isidro",
        "E": "Davao Oriental"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.539245, 7.210315]
      },
      "properties": {
        "A": "101",
        "proper_name": "MANAY, MANAY",
        "device_id": "732",
        "D": "Manay",
        "E": "Davao Oriental"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.072317, 6.653412]
      },
      "properties": {
        "A": "102",
        "proper_name": "GOVERNOR GENEROSO, GOVERNOR GENEROSO",
        "device_id": "731",
        "D": "Governor Generoso",
        "E": "Davao Oriental"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.565397, 7.328405]
      },
      "properties": {
        "A": "103",
        "proper_name": "CARAGA, CARAGA",
        "device_id": "729",
        "D": "Caraga",
        "E": "Davao Oriental"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.46017, 7.37361]
      },
      "properties": {
        "A": "104",
        "proper_name": "CARAGA, MAGSAYAP ELEMENTARY SCHOOL, SITIO BATIANO, BRGY. SAN PEDRO",
        "device_id": "2048",
        "D": "Caraga",
        "E": "Davao Oriental"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.375944, 7.869846]
      },
      "properties": {
        "A": "105",
        "proper_name": "BOSTON, BOSTON",
        "device_id": "728",
        "D": "Boston",
        "E": "Davao Oriental"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.448292, 7.79103]
      },
      "properties": {
        "A": "106",
        "proper_name": "CATEEL, CATEEL",
        "device_id": "730",
        "D": "Cateel",
        "E": "Davao Oriental"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.360598, 7.838637]
      },
      "properties": {
        "A": "107",
        "proper_name": "BOSTON, MRGY. CABASAGAN",
        "device_id": "1450",
        "D": "Boston",
        "E": "Davao Oriental"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.468611, 7.332222]
      },
      "properties": {
        "A": "108",
        "proper_name": "CARAGA, PUROK LANSONES, PM SOBRECAREY",
        "device_id": "1912",
        "D": "Caraga",
        "E": "Davao Oriental"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.561331, 7.575417]
      },
      "properties": {
        "A": "109",
        "proper_name": "BAGANGA, BAGANGA",
        "device_id": "795",
        "D": "Baganga",
        "E": "Davao Oriental"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.113144, 6.829236]
      },
      "properties": {
        "A": "110",
        "proper_name": "SAN ISIDRO, BRGY. IBA",
        "device_id": "1458",
        "D": "San Isidro",
        "E": "Davao Oriental"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.010952, 6.898034]
      },
      "properties": {
        "A": "111",
        "proper_name": "LUPON, MDRRMO",
        "device_id": "549",
        "D": "Lupon",
        "E": "Davao Oriental"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.48217, 7.33151]
      },
      "properties": {
        "A": "112",
        "proper_name": "CARAGA, KAWAIG BRIDGE, PM SOBRECAREY - Waterlevel & Rain2",
        "device_id": "1913",
        "D": "Caraga",
        "E": "Davao Oriental"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.441611, 7.794056]
      },
      "properties": {
        "A": "113",
        "proper_name": "CATEEL, CATEEL - BSWM_Lufft",
        "device_id": "362",
        "D": "Cateel",
        "E": "Davao Oriental"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.535204, 7.620745]
      },
      "properties": {
        "A": "114",
        "proper_name": "BAGANGA, BAGANGA MUNICIPAL GROUNDS - UAAWS",
        "device_id": "122",
        "D": "Baganga",
        "E": "Davao Oriental"
      }
    }]
  };
  var jsonObj_device_id,
    len = jsonObj.features.length,
    counter = 0,
    i;

  for (i = 0; i < arr_id.length; i++) {
    let station = arr_id[i];
    $.ajax({
      url: "https://cors-for-rainfall.herokuapp.com/http://fmon.asti.dost.gov.ph/dataloc.php?param=rv&dfrm=null&dto=null&numloc=1&data24=1&locs[]=" + arr_id[i],
      dataType: 'html',
      type: "GET",
      success: function(html_d) {
        var data = jQuery.parseJSON(html_d);
        var dev_id = arr_id[counter];

        if ((typeof data === 'object') && !($.isEmptyObject(data))) {
          var latest_rainval;
          var st_name = Object.keys(data);
          var data_len = data[st_name].length;
          var lst_indx = parseInt(data_len - 1);
          latest_rainval = parseFloat(data[st_name][lst_indx][1] * 4);
          for (var k = 0; k < len; k++) {
            jsonObj_device_id = jsonObj.features[k].properties.device_id;
            if (jsonObj_device_id === station) {
              var coords = jsonObj.features[k].geometry.coordinates;
              var prop_name = jsonObj.features[k].properties.proper_name;
              var d = jsonObj.features[k].properties.D;
              var e = jsonObj.features[k].properties.E;
              var new_json1 = {
                "type": "FeatureCollection",
                "features": [{
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": coords
                  },
                  "properties": {
                    "A": counter,
                    "proper_name": prop_name,
                    "device_id": jsonObj_device_id,
                    "rain_intensity": latest_rainval,
                    "D": d,
                    "E": e
                  }
                }]
              }
              addFeaturetoVectorLayer(new_json1);
              console.log(prop_name + ': ' + st_name + ' Latest Rainfall Value: ' + latest_rainval + ' mm/hr : ' + dev_id + ' : ' + jsonObj_device_id)
            }
          }
        } else {
          for (var k = 0; k < len; k++) {
            jsonObj_device_id = jsonObj.features[k].properties.device_id;
            if (jsonObj_device_id === station) {
              jsonObj.features[k].properties["rain_intensity"] = -1;
              var coords = jsonObj.features[k].geometry.coordinates;
              var prop_name = jsonObj.features[k].properties.proper_name;
              var d = jsonObj.features[k].properties.D;
              var e = jsonObj.features[k].properties.E;
              var new_json = {
                "type": "FeatureCollection",
                "features": [{
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": coords
                  },
                  "properties": {
                    "A": counter,
                    "proper_name": prop_name,
                    "device_id": jsonObj_device_id,
                    "rain_intensity": -1,
                    "D": d,
                    "E": e
                  }
                }]
              }
              addFeaturetoVectorLayer(new_json);
              console.log(prop_name + ' Latest Rainfall Value: -1 mm/hr : ' + dev_id + ' : ' + jsonObj_device_id)
            }
          }

        }

        counter++;
        $('#count').text(counter + ' out of ' + arr_id.length + ' stations has been loaded.').fadeIn("slow");
        $('#help').fadeIn("slow");

        if (counter == arr_id.length) {
          $('#count').fadeOut("slow");
        } else {}
      }, //success
      error: function(xhr, ajaxOptions, thrownError) {
        $('#count').html('<strong><p style="color:red">Unable to access remaining stations. Try again later.</p></strong>');
      }
    });
  };
}

function addFeaturetoVectorLayer(geojson) {
  vector_layer.addFeatures(geojson_format.read(geojson));
}

$(window).load(function() {
  init();
  plotRainfallStations();
});
