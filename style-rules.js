/*
        @licstart  The following is the entire license notice for the
        JavaScript code in this page.

        Copyright (C) 2015-2017  CSU Phil-LiDAR 1
        http://csulidar1.info/
        http://www.edselmatt.com/
        Last Updated: 07/06/2017

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
                if (diffHours == 24) {
                  getIndex = parseFloat(rainVal.length - k - 1)
                  //console.log('24-hour Rainfall Data is available.');
                }//else{console.log('24-hour Rainfall Data is NOT available.')}
        }
        

        for (i = getIndex; i < rainVal.length; i++) {
          var accumRain = parseFloat(rainVal[i][1]);
          finalAccum = parseFloat(finalAccum + accumRain);
          rainValpH = rainVal[i][1] * 4;
          tofixAccum = finalAccum.toFixed(1);
          tofixRainVal = rainValpH.toFixed(1);
          var t = rainVal[i][0];
          console.log('Date: '+Highcharts.dateFormat("%b %e, %Y %I:%M %p", new Date(t))+' -- Rainfall Value: '+tofixRainVal+' mm/hr.');
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

/**
 * Here we create a new style object with rules that determine
 * which symbolizer will be used to render each feature.
 */
var style = new OpenLayers.Style(
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
var jsonObj = {
   "type": "FeatureCollection",
   "features": [
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.5998,8.73295 ]
    },
    "properties": {
    "No":1,
    "proper_name":"LAS NIEVES, MAT-I",
    "device_id":611,
    "City_Municipality":"Las Nieves",
    "Province":"Agusan del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.40895,8.97455 ]
    },
    "properties": {
    "No":2,
    "proper_name":"BUENAVISTA, BUENAVISTA MUNICIPAL HALL",
    "device_id":1564,
    "City_Municipality":"Buenavista",
    "Province":"Agusan del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.34303,8.924192 ]
    },
    "properties": {
    "No":3,
    "proper_name":"NASIPIT, BRGY. HAMIGUITAN",
    "device_id":1565,
    "City_Municipality":"Nasipit",
    "Province":"Agusan del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.578056,9.449444 ]
    },
    "properties": {
    "No":4,
    "proper_name":"KITCHARAO, KITCHARAO - BSWM_Lufft",
    "device_id":368,
    "City_Municipality":"Kitcharao",
    "Province":"Agusan del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.2957,8.990048 ]
    },
    "properties": {
    "No":5,
    "proper_name":"CARMEN, CARMEN MUNICIPAL HALL",
    "device_id":1561,
    "City_Municipality":"Carmen",
    "Province":"Agusan del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.516667,8.933333 ]
    },
    "properties": {
    "No":6,
    "proper_name":"BUTUAN, BUTUAN PAGASA COMPOUND - UAAWS",
    "device_id":118,
    "City_Municipality":"Butuan",
    "Province":"Agusan del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.516111,9.342778 ]
    },
    "properties": {
    "No":7,
    "proper_name":"JABONGA, POBLACION",
    "device_id":712,
    "City_Municipality":"Jabonga",
    "Province":"Agusan del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.59641,8.95917 ]
    },
    "properties": {
    "No":8,
    "proper_name":"AMPAYON, BUTUAN CITY, CARAGA STATE UNIVERSITY",
    "device_id":779,
    "City_Municipality":"Butuan City",
    "Province":"Agusan del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.692222,9.014444 ]
    },
    "properties": {
    "No":9,
    "proper_name":"BUTUAN, DUGYAMAN, ANTICALA",
    "device_id":707,
    "City_Municipality":"Butuan City",
    "Province":"Agusan del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.626858,8.825895 ]
    },
    "properties": {
    "No":10,
    "proper_name":"BUTUAN CITY, SUMILE",
    "device_id":706,
    "City_Municipality":"Butuan City",
    "Province":"Agusan del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.545556,9.121944 ]
    },
    "properties": {
    "No":11,
    "proper_name":"CABADBARAN CITY, CABADBARAN",
    "device_id":711,
    "City_Municipality":"Cabadbaran",
    "Province":"Agusan del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.578333,9.45 ]
    },
    "properties": {
    "No":12,
    "proper_name":"KITCHARAO, KITCHARAO MUNICIPAL HALL COMPOUND",
    "device_id":155,
    "City_Municipality":"Kitcharao",
    "Province":"Agusan del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.559444,9.241389 ]
    },
    "properties": {
    "No":13,
    "proper_name":"SANTIAGO, JAGUPIT",
    "device_id":713,
    "City_Municipality":"Santiago",
    "Province":"Agusan del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.6298,8.8245 ]
    },
    "properties": {
    "No":14,
    "proper_name":"REMEDIOS T. ROMUALDEZ, SAN ANTONIO",
    "device_id":710,
    "City_Municipality":"RTR",
    "Province":"Agusan del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.02515,8.47803 ]
    },
    "properties": {
    "No":15,
    "proper_name":"SAN FRANCISCO ALEGRIA",
    "device_id":566,
    "City_Municipality":"San Francisco",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.03271,8.00983 ]
    },
    "properties": {
    "No":16,
    "proper_name":"SANTA JOSEFA, STA. ISABEL",
    "device_id":571,
    "City_Municipality":"Sta. Josefa",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.12321,8.12093 ]
    },
    "properties": {
    "No":17,
    "proper_name":"MANAT, TRENTO, MANAT ELEM. SCHOOL",
    "device_id":568,
    "City_Municipality":"Trento",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.749225,8.715886 ]
    },
    "properties": {
    "No":18,
    "proper_name":"BAYUGAN CITY, BAYUGAN III NATIONAL HIGH SCHOOL",
    "device_id":592,
    "City_Municipality":"Bayugan City",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.00708,8.63208 ]
    },
    "properties": {
    "No":19,
    "proper_name":"PROSPERIDAD, MAGSAYSAY AGUSAN DEL SUR",
    "device_id":588,
    "City_Municipality":"Prosperidad",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.95547,8.0693 ]
    },
    "properties": {
    "No":20,
    "proper_name":"VERUELA, VERUELA MUNICIPAL HALL",
    "device_id":567,
    "City_Municipality":"Veruela",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.8571,8.189546 ]
    },
    "properties": {
    "No":21,
    "proper_name":"LORETO, LORETO MUNICIPAL HALL",
    "device_id":591,
    "City_Municipality":"Loreto",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.8011,8.5869 ]
    },
    "properties": {
    "No":22,
    "proper_name":"TALACOGON, TALACOGON MUNICIPAL HALL",
    "device_id":606,
    "City_Municipality":"Talacogon",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.85662,8.54236 ]
    },
    "properties": {
    "No":23,
    "proper_name":"PROSPERIDAD, SAN VICENTE POSPERIDAD",
    "device_id":589,
    "City_Municipality":"Prosperidad",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.7394,8.6283 ]
    },
    "properties": {
    "No":24,
    "proper_name":"SAN LUIS, DOÑA FLAVIA",
    "device_id":607,
    "City_Municipality":"San Luis",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.00091,8.38282 ]
    },
    "properties": {
    "No":25,
    "proper_name":"ROSARIO, ROSARIO MUNICIPAL HALL",
    "device_id":565,
    "City_Municipality":"Rosario",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.8011,8.5869 ]
    },
    "properties": {
    "No":26,
    "proper_name":"TALACOGON, DESAMPORADOS",
    "device_id":587,
    "City_Municipality":"Talacogon",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.1593,8.01986 ]
    },
    "properties": {
    "No":27,
    "proper_name":"STA MARIA, TRENTO, STA MARIA ELEM SCHOOL",
    "device_id":569,
    "City_Municipality":"Trento",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.8066,8.2798 ]
    },
    "properties": {
    "No":28,
    "proper_name":"LA PAZ , PANANGAN",
    "device_id":612,
    "City_Municipality":"La Paz",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.7514,8.713 ]
    },
    "properties": {
    "No":29,
    "proper_name":"BAYUGAN CITY, BAYUGAN CITY HALL",
    "device_id":564,
    "City_Municipality":"Bayugan City",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.6929,8.8193 ]
    },
    "properties": {
    "No":30,
    "proper_name":"SIBAGAT, SIBAGAT MUNICPAL HALL",
    "device_id":563,
    "City_Municipality":"Sibagat",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.7044,8.7806 ]
    },
    "properties": {
    "No":31,
    "proper_name":"ESPERANZA, ESPERANZA POBLACION",
    "device_id":609,
    "City_Municipality":"Esperanza",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.94108,8.550003 ]
    },
    "properties": {
    "No":32,
    "proper_name":"PATIN-AY PROSPERIDAD, AGUSAN DEL SUR, PROVINCIAL CAPITOL",
    "device_id":739,
    "City_Municipality":"Prosperidad",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.0028,8.1706 ]
    },
    "properties": {
    "No":33,
    "proper_name":"BUNAWAN, ASSCAT, SAN TEODORO",
    "device_id":570,
    "City_Municipality":"Bunawan",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.657833,8.678833 ]
    },
    "properties": {
    "No":34,
    "proper_name":"ESPERANZA, ESPERANZA - BSWM_Lufft",
    "device_id":890,
    "City_Municipality":"Esperanza",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.943417,8.552306 ]
    },
    "properties": {
    "No":35,
    "proper_name":"PROSPERIDAD, PROSPERIDAD - BSWM_Lufft",
    "device_id":893,
    "City_Municipality":"Prosperidad",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.033333,7.983333 ]
    },
    "properties": {
    "No":36,
    "proper_name":"STA. JOSEFA, STA. JOSEFA GOVERNMENT SITE - UAAWS",
    "device_id":119,
    "City_Municipality":"Sta. Josefa",
    "Province":"Agusan del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.017602,9.229468 ]
    },
    "properties": {
    "No":37,
    "proper_name":"CARMEN, Carmen Municipal Hall",
    "device_id":1561,
    "City_Municipality":"Carmen",
    "Province":"Surigao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.477278,9.663402 ]
    },
    "properties": {
    "No":38,
    "proper_name":"SURIGAO CITY ELEMENTARY SCHOOL, SUKALIANG",
    "device_id":1575,
    "City_Municipality":"Surigao",
    "Province":"Surigao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.495498,9.738568 ]
    },
    "properties": {
    "No":39,
    "proper_name":"SURIGAO CITY, BONIFACIO ELEMENTARY SCHOOL",
    "device_id":1567,
    "City_Municipality":"Surigao",
    "Province":"Surigao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.506,9.6872 ]
    },
    "properties": {
    "No":40,
    "proper_name":"SURIGAO CITY, QUEZON",
    "device_id":1568,
    "City_Municipality":"Surigao",
    "Province":"Surigao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.557778,9.536667 ]
    },
    "properties": {
    "No":41,
    "proper_name":"MAINIT, MAINIT - BSWM_Lufft",
    "device_id":885,
    "City_Municipality":"Mainit",
    "Province":"Surigao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.421111,9.776667 ]
    },
    "properties": {
    "No":42,
    "proper_name":"SAN FRANCISCO, SAN FRANCISCO MUNICIPAL HALL COMPOUND",
    "device_id":152,
    "City_Municipality":"San Francisco",
    "Province":"Surigao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.732709,9.57376 ]
    },
    "properties": {
    "No":43,
    "proper_name":"CLAVER, CLAVER MUNICIPAL HALL COMPOUND",
    "device_id":154,
    "City_Municipality":"Claver",
    "Province":"Surigao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.528611,9.659722 ]
    },
    "properties": {
    "No":44,
    "proper_name":"SISON, SISON ELEMENTARY SCHOOL",
    "device_id":153,
    "City_Municipality":"Sison",
    "Province":"Surigao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.401667,9.618611 ]
    },
    "properties": {
    "No":45,
    "proper_name":"MALIMONO, MALIMONO",
    "device_id":1203,
    "City_Municipality":"Malimono",
    "Province":"Surigao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.697778,9.595833 ]
    },
    "properties": {
    "No":46,
    "proper_name":"GIGAQUIT, GIGAQUIT",
    "device_id":1204,
    "City_Municipality":"Gigaquit",
    "Province":"Surigao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.569722,9.553889 ]
    },
    "properties": {
    "No":47,
    "proper_name":"TUBOD, TUBOD MUNICIPAL HALL",
    "device_id":708,
    "City_Municipality":"Tubod",
    "Province":"Surigao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.523056,9.540556 ]
    },
    "properties": {
    "No":48,
    "proper_name":"MAINIT, MAINIT MUNICIPAL HALL",
    "device_id":709,
    "City_Municipality":"Mainit",
    "Province":"Surigao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.05973,9.23172 ]
    },
    "properties": {
    "No":49,
    "proper_name":"LANUZA, Florita Herrera-Irizari Nat’l High School",
    "device_id":1576,
    "City_Municipality":"lanuza",
    "Province":"Surigao del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.038611,8.946861 ]
    },
    "properties": {
    "No":50,
    "proper_name":"SAN MIGUEL, TAGO, TINA",
    "device_id":780,
    "City_Municipality":"San Miguel",
    "Province":"Surigao del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.28368,8.96935 ]
    },
    "properties": {
    "No":51,
    "proper_name":"BAYABAS, BALITE",
    "device_id":781,
    "City_Municipality":"Bayabas",
    "Province":"Surigao del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.968306,9.338611 ]
    },
    "properties": {
    "No":52,
    "proper_name":"CANTILAN, CANTILAN - BSWM_Lufft",
    "device_id":887,
    "City_Municipality":"Cantilan",
    "Province":"Surigao del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.47825,9.716331 ]
    },
    "properties": {
    "No":53,
    "proper_name":"SURIGAO CITY, MAT-I NATIONAL HIGH SCHOOL",
    "device_id":1573,
    "City_Municipality":"Surigao",
    "Province":"Surigao del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.233861,9.015889 ]
    },
    "properties": {
    "No":54,
    "proper_name":"TAGO, TAGO POBLACION",
    "device_id":1574,
    "City_Municipality":"Tago",
    "Province":"Surigao del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.315939,8.213136 ]
    },
    "properties": {
    "No":55,
    "proper_name":"BISLIG CITY, BISLIG CITY NATIONAL HIGH SCHOOL - UAAWS",
    "device_id":121,
    "City_Municipality":"Bislig",
    "Province":"Surigao del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.223699,8.743103 ]
    },
    "properties": {
    "No":56,
    "proper_name":"SAN AGUSTIN, SAN AGUSTIN MUNICIPAL TOWN SQUARE - UAAWS",
    "device_id":120,
    "City_Municipality":"San Agustin",
    "Province":"Surigao del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.16872,9.07375 ]
    },
    "properties": {
    "No":57,
    "proper_name":"TANDAG CITY, AWASIAN",
    "device_id":782,
    "City_Municipality":"Tandag",
    "Province":"Surigao del Sur",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.616944,9.950278 ]
    },
    "properties": {
    "No":58,
    "proper_name":"DINAGAT, DINAGAT",
    "device_id":1562,
    "City_Municipality":"Dinagat",
    "Province":"Dinagat Islands",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.5888,10.0083 ]
    },
    "properties": {
    "No":59,
    "proper_name":"SAN JOSE, LUNA",
    "device_id":1386,
    "City_Municipality":"San Jose",
    "Province":"Dinagat Islands",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.672013,9.923205 ]
    },
    "properties": {
    "No":60,
    "proper_name":"CAGDIANAO, CAGDIANAO",
    "device_id":1625,
    "City_Municipality":"Cagdianao",
    "Province":"Dinagat Islands",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.57843,10.359748 ]
    },
    "properties": {
    "No":61,
    "proper_name":"LORETO, LORETO",
    "device_id":1624,
    "City_Municipality":"Loreto",
    "Province":"Dinagat Islands",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.533495,10.195108 ]
    },
    "properties": {
    "No":62,
    "proper_name":"LIBJO, LIBJO",
    "device_id":1626,
    "City_Municipality":"Libjo",
    "Province":"Dinagat Islands",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.510278,9.998067 ]
    },
    "properties": {
    "No":63,
    "proper_name":"BASILISA, BASILISA POBLACION",
    "device_id":1563,
    "City_Municipality":"Basilisa",
    "Province":"Dinagat Islands",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.969264,7.448167 ]
    },
    "properties": {
    "No":64,
    "proper_name":"MACO, MACO - Waterlevel & Rain2",
    "device_id":723,
    "City_Municipality":"Maco",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.01519,7.28042 ]
    },
    "properties": {
    "No":65,
    "proper_name":"MABINI - ANITAPAN NATIONAL HIGH SCHOOL",
    "device_id":2110,
    "City_Municipality":"Mabini",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.792719,7.819065 ]
    },
    "properties": {
    "No":66,
    "proper_name":"LAAK, LAAK MUNICIPAL HALL",
    "device_id":1289,
    "City_Municipality":"Laak",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.063778,7.75 ]
    },
    "properties": {
    "No":67,
    "proper_name":"MONKAYO, BABAG BRIDGE - Waterlevel & Rain2",
    "device_id":1198,
    "City_Municipality":"Monkayo",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.10832,7.70599 ]
    },
    "properties": {
    "No":68,
    "proper_name":"COMPOSTELA, COMPOSTELA - MANGAYON NHS",
    "device_id":960,
    "City_Municipality":"Compostela",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.089583,7.676012 ]
    },
    "properties": {
    "No":69,
    "proper_name":"COMPOSTELA, AGUSAN BRIDGE COMPOSTELA - Waterlevel & Rain2",
    "device_id":959,
    "City_Municipality":"Compostela",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.034139,7.795833 ]
    },
    "properties": {
    "No":70,
    "proper_name":"MONKAYO, OLAYCON - BRIDGE - Waterlevel & Rain2",
    "device_id":1197,
    "City_Municipality":"Monkayo",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.02328,7.383583 ]
    },
    "properties": {
    "No":71,
    "proper_name":"MAKO - TERESA NATIONAL HIGH SCHOOL, BRGY. Teresa",
    "device_id":959,
    "City_Municipality":"Mako",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.158521,7.51321 ]
    },
    "properties": {
    "No":72,
    "proper_name":"NEW BATAAN - BRGY. ANDAP -  Rain2",
    "device_id":958,
    "City_Municipality":"New Bataan",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.21166,7.455778 ]
    },
    "properties": {
    "No":73,
    "proper_name":"CATEEL, SITIO MAHO, BRGY. ANDAP",
    "device_id":1915,
    "City_Municipality":"Cateel",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.086,7.351111 ]
    },
    "properties": {
    "No":74,
    "proper_name":"MARAGUSAN, PSTC COMPOSTELA VALLEY",
    "device_id":131,
    "City_Municipality":"Monkayo",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.120651,7.823864 ]
    },
    "properties": {
    "No":75,
    "proper_name":"MONKAYO - MANGANON",
    "device_id":1449,
    "City_Municipality":"Monkayo",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.366194,7.677697 ]
    },
    "properties": {
    "No":76,
    "proper_name":"CATEEL, SITIO ANAHAW 35",
    "device_id":1914,
    "City_Municipality":"Cateel",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.013774,7.402992 ]
    },
    "properties": {
    "No":77,
    "proper_name":"NEW LEYTE - NEW LEYTE",
    "device_id":724,
    "City_Municipality":"Mako",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.050444,7.831358 ]
    },
    "properties": {
    "No":78,
    "proper_name":"MONKAYO - KALAW BRIDGE - Waterlevel & Rain2",
    "device_id":1199,
    "City_Municipality":"Monkayo",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.003941,7.707788 ]
    },
    "properties": {
    "No":79,
    "proper_name":"MONTEVISTA - MONTEVISTA POBLACION",
    "device_id":1284,
    "City_Municipality":"Montevista",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.171995,7.261005 ]
    },
    "properties": {
    "No":80,
    "proper_name":"PANTUKAN - BRGY. ARAIBO - Waterlevel & Rain2",
    "device_id":1461,
    "City_Municipality":"Pantukan",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.143663,7.314996 ]
    },
    "properties": {
    "No":81,
    "proper_name":"MARAGUSAN, AGUSAN BRIDGE MARAGUSAN - Waterlevel & Rain2",
    "device_id":1285,
    "City_Municipality":"Maragusan",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.100521,7.572987 ]
    },
    "properties": {
    "No":82,
    "proper_name":"NEW BATAAN, BRGY. PANAG - Waterlevel & Rain2",
    "device_id":955,
    "City_Municipality":"New Bataan",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.134194,7.578735 ]
    },
    "properties": {
    "No":83,
    "proper_name":"NEW BATAAN - BANGOY BRIDGE - Waterlevel & Rain2",
    "device_id":957,
    "City_Municipality":"New Bataan",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.063778,7.75 ]
    },
    "properties": {
    "No":84,
    "proper_name":"MONKAYO - UNION BRIDGE - Waterlevel & Rain2",
    "device_id":1198,
    "City_Municipality":"Monkayo",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.920721,7.526523 ]
    },
    "properties": {
    "No":85,
    "proper_name":"MAWAB - MALINAWON - Waterlevel & Rain2",
    "device_id":1287,
    "City_Municipality":"Mawab",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.018333,7.289972 ]
    },
    "properties": {
    "No":86,
    "proper_name":"MARAGUSAN - MARAGUSAN - BSWM_LUFFT",
    "device_id":364,
    "City_Municipality":"Maragusan",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.992667,7.57775 ]
    },
    "properties": {
    "No":87,
    "proper_name":"NABUNTURAN - UPAWS",
    "device_id":1480,
    "City_Municipality":"Nabunturan",
    "Province":"Compostela Valley",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.486414,7.633998 ]
    },
    "properties": {
    "No":88,
    "proper_name":"TALAINGOD - BRGY. STO. NINO",
    "device_id":1456,
    "City_Municipality":"Talaingod",
    "Province":"Davao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.779748,7.45242 ]
    },
    "properties": {
    "No":89,
    "proper_name":"TAGUM - PDRRM OFFICE",
    "device_id":1476,
    "City_Municipality":"Tagum city",
    "Province":"Davao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.82408,7.58712 ]
    },
    "properties": {
    "No":90,
    "proper_name":"NEW CORELLA - NEW CORELLA",
    "device_id":726,
    "City_Municipality":"New Corella",
    "Province":"Davao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 124.24397,8.1628 ]
    },
    "properties": {
    "No":91,
    "proper_name":"PANABO - PANABO",
    "device_id":129,
    "City_Municipality":"Panabo",
    "Province":"Davao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.571777,7.631437 ]
    },
    "properties": {
    "No":92,
    "proper_name":"TALAINGOD - TALAINGOD MUNICIPAL HALL",
    "device_id":1457,
    "City_Municipality":"Talaingod",
    "Province":"Davao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.69877,7.59273 ]
    },
    "properties": {
    "No":93,
    "proper_name":"KAPALONG - KAPALONG",
    "device_id":1152,
    "City_Municipality":"Kapalong",
    "Province":"Davao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.749679,7.438699 ]
    },
    "properties": {
    "No":94,
    "proper_name":"TAGUM CITY - MAGUPISING BRIDGE",
    "device_id":1460,
    "City_Municipality":"Tagum city",
    "Province":"Davao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.75814,7.5343 ]
    },
    "properties": {
    "No":95,
    "proper_name":"ASUNCION - LAWANG BRIDGE, ASUNCION",
    "device_id":961,
    "City_Municipality":"Asuncion",
    "Province":"Davao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.62144,7.51597 ]
    },
    "properties": {
    "No":96,
    "proper_name":"STO. TOMAS - MENZI BRIDGE",
    "device_id":956,
    "City_Municipality":"Sto. Tomas",
    "Province":"Davao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.827938,7.434327 ]
    },
    "properties": {
    "No":97,
    "proper_name":"TAGUM CITY - APOKON BRIDGE",
    "device_id":1453,
    "City_Municipality":"Tagum city",
    "Province":"Davao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.598222,7.495 ]
    },
    "properties": {
    "No":98,
    "proper_name":"STO TOMAS - STO TOMAS - BSWM_Lufft",
    "device_id":316,
    "City_Municipality":"Sto. Tomas",
    "Province":"Davao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 125.704444,7.362778 ]
    },
    "properties": {
    "No":99,
    "proper_name":"CARMEN - ISING - BSWM_Lufft",
    "device_id":366,
    "City_Municipality":"Carmen",
    "Province":"Davao del Norte",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.091894,6.836565 ]
    },
    "properties": {
    "No":100,
    "proper_name":"SAN ISIDRO, MDRRM OFFICE",
    "device_id":1454,
    "City_Municipality":"San Isidro",
    "Province":"Davao Oriental",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.539245,7.210315 ]
    },
    "properties": {
    "No":101,
    "proper_name":"MANAY, MANAY",
    "device_id":732,
    "City_Municipality":"Manay",
    "Province":"Davao Oriental",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.072317,6.653412 ]
    },
    "properties": {
    "No":102,
    "proper_name":"GOVERNOR GENEROSO, GOVERNOR GENEROSO",
    "device_id":731,
    "City_Municipality":"Governor Generoso",
    "Province":"Davao Oriental",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.565397,7.328405 ]
    },
    "properties": {
    "No":103,
    "proper_name":"CARAGA, CARAGA",
    "device_id":729,
    "City_Municipality":"Caraga",
    "Province":"Davao Oriental",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.46017,7.37361 ]
    },
    "properties": {
    "No":104,
    "proper_name":"CARAGA, MAGSAYAP ELEMENTARY SCHOOL, SITIO BATIANO, BRGY. SAN PEDRO",
    "device_id":2048,
    "City_Municipality":"Caraga",
    "Province":"Davao Oriental",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.375944,7.869846 ]
    },
    "properties": {
    "No":105,
    "proper_name":"BOSTON, BOSTON",
    "device_id":728,
    "City_Municipality":"Boston",
    "Province":"Davao Oriental",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.448292,7.79103 ]
    },
    "properties": {
    "No":106,
    "proper_name":"CATEEL, CATEEL",
    "device_id":730,
    "City_Municipality":"Cateel",
    "Province":"Davao Oriental",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.360598,7.838637 ]
    },
    "properties": {
    "No":107,
    "proper_name":"BOSTON, MRGY. CABASAGAN",
    "device_id":1450,
    "City_Municipality":"Boston",
    "Province":"Davao Oriental",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.468611,7.332222 ]
    },
    "properties": {
    "No":108,
    "proper_name":"CARAGA, PUROK LANSONES, PM SOBRECAREY",
    "device_id":1912,
    "City_Municipality":"Caraga",
    "Province":"Davao Oriental",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.561331,7.575417 ]
    },
    "properties": {
    "No":109,
    "proper_name":"BAGANGA, BAGANGA",
    "device_id":795,
    "City_Municipality":"Baganga",
    "Province":"Davao Oriental",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.113144,6.829236 ]
    },
    "properties": {
    "No":110,
    "proper_name":"SAN ISIDRO, BRGY. IBA",
    "device_id":1458,
    "City_Municipality":"San Isidro",
    "Province":"Davao Oriental",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.010952,6.898034 ]
    },
    "properties": {
    "No":111,
    "proper_name":"LUPON, MDRRMO",
    "device_id":549,
    "City_Municipality":"Lupon",
    "Province":"Davao Oriental",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.48217,7.33151 ]
    },
    "properties": {
    "No":112,
    "proper_name":"CARAGA, KAWAIG BRIDGE, PM SOBRECAREY - Waterlevel & Rain2",
    "device_id":1913,
    "City_Municipality":"Caraga",
    "Province":"Davao Oriental",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.441611,7.794056 ]
    },
    "properties": {
    "No":113,
    "proper_name":"CATEEL, CATEEL - BSWM_Lufft",
    "device_id":362,
    "City_Municipality":"Cateel",
    "Province":"Davao Oriental",
    "FIELD8":""
    }
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [ 126.535204,7.620745 ]
    },
    "properties": {
    "No":114,
    "proper_name":"BAGANGA, BAGANGA MUNICIPAL GROUNDS - UAAWS",
    "device_id":122,
    "City_Municipality":"Baganga",
    "Province":"Davao Oriental",
    "FIELD8":""
    }
  }
]
};

function stationNames(){
    var stations = [];
    var json_len = jsonObj.features.length;
    for(var i=0;i<json_len;i++){
      var gauge_name = jsonObj.features[i].properties.proper_name;
      stations.push(gauge_name);
    }
    return stations;
}

function plotRainfallStations() {
  //list of CARAGA Region Rainfall Station Device ID
  var arr_id=[611,1564,1565,368,1561,118,712,779,707,706,711,155,713,710,566,571,568,592,588,567,591,606,589,607,565,587,569,612,564,563,609,739,570,890,893,119,1575,1567,1568,885,152,154,153,1203,1204,708,709,1576,780,781,887,1573,1574,121,120,782,1562,1386,1625,1624,1626,1563,723,2110,1289,960,1197,959,958,1915,131,1449,1914,724,1199,1284,1461,1285,955,957,1198,1287,364,1480,1456,1476,726,129,1457,1152,1460,961,956,1453,316,366,1454,732,731,729,2048,728,730,1450,1912,795,1458,549,1913,362,122];
  //var arr_id = [118,711,779,707,713,155,611,712,710,706,739,566,570,564,592,607,608,609,591,588,568,612,565,563,1561,1387,1388,1575,1567,1577,1568,152,154,153,1203,1204,708,709,1576,780,781,1573,1574,121,120,782,1562,1385,1386,1565,1563];
  //var arr_id = [118,711,779,707,713,155,611,712,710,706,739];
  var jsonObj_device_id,
    len = jsonObj.features.length,
    counter = 0,
    i,
    no_data = 0,
    with_data = 0;

  for (i = 0; i < arr_id.length; i++) {
    let station = arr_id[i];
    $.ajax({
      url: "https://cors-for-rainfall.herokuapp.com/http://fmon.asti.dost.gov.ph/dataloc.php?param=rv&dfrm=null&dto=null&numloc=1&data24=1&locs[]=" + station,
      dataType: 'html',
      type: "GET",
      tryCount : 0,
      retryLimit : 3,
      success: function(html_d) {
        var data = jQuery.parseJSON(html_d);
        if ((typeof data === 'object') && !($.isEmptyObject(data))) {
          var latest_rainval;
          var st_name = Object.keys(data);
          var data_len = data[st_name].length;
          var lst_indx = parseInt(data_len - 1);
          latest_rainval = parseFloat(data[st_name][lst_indx][1] * 4);
          for (var k = 0; k < len; k++) {
            jsonObj_device_id = jsonObj.features[k].properties.device_id;
            if (jsonObj_device_id == station) {
              var coords = jsonObj.features[k].geometry.coordinates;
              var prop_name = jsonObj.features[k].properties.proper_name;
              var d = jsonObj.features[k].properties.Province;
              var e = jsonObj.features[k].properties.City_Municipality;
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
                    "province": d,
                    "municipality": e
                  }
                }]
              }
              addFeaturetoVectorLayer(new_json1);
              with_data++;
              console.log(prop_name + ': ' + st_name + '(Device ID: '+jsonObj_device_id+') Latest Rainfall Value: ' + latest_rainval + ' mm/hr')
            }
          }
        } else {
          for (var k = 0; k < len; k++) {
            jsonObj_device_id = jsonObj.features[k].properties.device_id;
            if (jsonObj_device_id == station) {
              var coords = jsonObj.features[k].geometry.coordinates;
              var prop_name = jsonObj.features[k].properties.proper_name;
              var d = jsonObj.features[k].properties.Province;
              var e = jsonObj.features[k].properties.City_Municipality;
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
                    "province": d,
                    "municipality": e
                  }
                }]
              }
              addFeaturetoVectorLayer(new_json);
              no_data++;
              console.log(prop_name + '(Device ID: '+jsonObj_device_id+') Latest Rainfall Value: No DATA')
            }
          }

        }

        counter++;
        $('#count').text(counter + ' out of ' + arr_id.length + ' stations have been loaded.');

        if (counter == arr_id.length) {
          //$('#count').fadeOut("slow");
          console.log("Stations with data: "+ with_data+'-- Stations without Data: '+no_data)
        } else {}
      }, //success
      error : function(xhr, textStatus, errorThrown ) {
        if (textStatus == 'timeout') {
            this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                $('#count').html('<strong><p style="color:red">Requesting data again...please wait.</p></strong>');
                $.ajax(this);
                return;
            }
            return;
        }
        if (xhr.status == 500) {
            $('#count').html('<strong><p style="color:red">Unable to access stations. Try again later.</p></strong>');
        }
      }
    });
  };
}

function addFeaturetoVectorLayer(geojson) {
  vector_layer.addFeatures(geojson_format.read(geojson));
}

function filterRainfall(gaugeS) {
  var bounds;
  for (var f = 0; f < vector_layer.features.length; f++) {
       if (vector_layer.features[f].attributes.proper_name === gaugeS) {
           featsel = vector_layer.features[f];
           bounds = featsel.geometry.bounds;
           map.zoomToExtent(new OpenLayers.Bounds(bounds.right,bounds.top,bounds.left,bounds.bottom));
           break;
       }
  }
}

$(window).load(function() {
  init();
  plotRainfallStations();

  $("#rain_gauge").typeahead({
    source: stationNames()
  });

  document.getElementById("frmSearch").addEventListener("submit", function(event){
    event.preventDefault();
    var gauge = document.getElementById("rain_gauge").value;
    filterRainfall(gauge);
  },false);
  document.getElementById("reset").addEventListener("click", function(event){
    map.setCenter(new OpenLayers.LonLat(125.74, 9.13).transform(
      new OpenLayers.Projection("EPSG:4326"),
      map.getProjectionObject()
    ), 9);
  });
});
