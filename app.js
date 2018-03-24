function initMap() {
    var map = new google.maps.Map(d3.select('#map').node(), {
        center: new google.maps.LatLng(61.406, 22.127),
        zoom: 10
    });
 
    const opacity = 0.3;

    d3.csv("static/meterData2.csv", function(err, data){
        if(err) console.log(err);

        d3.select(".list")
            .selectAll("div")
            .data(data)
            .enter()
            .append("div")
            .attr("class", "sub-list")
            .text(function(d){
                return d["ID full"]
            })
            .on("mouseover", onMouseOver)
            .on("mouseout", onMouseOut);

            function onMouseOver(e){  
                d3.select("#map").selectAll("svg")
                    .select(function(d){
                        if (d===e){
                            return this;
                        } else {
                            return null;
                        }
                    }).selectAll("text, circle").transition()
                        .attr("delay", 1500)
                        .attr("fill-opacity", 1)
            };

            function onMouseOut(e){
                var selected = d3.select("#map").selectAll("svg")
                    .select(function(d){
                        if (d===e){
                            return this;
                        } else {
                            return null;
                        }
                    });

                selected.select("text").transition()
                    .attr("delay", 1500)
                    .attr("fill-opacity", 0);

                selected.select("circle").transition()
                    .attr("delay", 1500)
                    .attr("fill-opacity", opacity);
            };

        var overlay = new google.maps.OverlayView();
        overlay.onAdd = function(){
            var layer = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "meter");
        
        overlay.draw = function(){
            var projection = this.getProjection(),padding = 100;
            var marker = layer.selectAll("svg")
                .data(data)
                .each(transform)
                .enter()
                .append("svg")
                .each(transform)
                .attr("class", "marker");

                marker.append("circle").each(function(d){
                    return d3.select(this)
                        .attr("r", (d["Range(m)"]/150))
                    })
                    .attr("cx", padding)
                    .attr("cy", padding)
                    .each(function(d){
                        switch (d["FreqType"]) {
                            case "1":
                                d3.select(this).attr("fill", "green")
                                break;
                            case "2":
                                d3.select(this).attr("fill", "red")
                                break;
                            case "3":
                                d3.select(this).attr("fill", "blue")
                        }
                    })
                    .attr("fill-opacity", opacity);
            
                marker.append("text")
                    .attr("fill", "black")
                    .attr("font-size", 15 + "px")
                    .attr("font-family", "sans-serif")
                    .attr("x", padding)
                    .attr("y", padding)
                    .text(function(d){
                        return (
                            `Range: ${d["Range(m)"]}
                            Freq. type: ${d["FreqType"]} `
                        )
                    }).attr("fill-opacity", 0);
            
                function transform(d) {
                    d = new google.maps.LatLng(d['LAT'], d['LNG']);
                    d = projection.fromLatLngToDivPixel(d);
                    return d3.select(this)
                        .style("left", (d.x - padding) + "px")
                        .style("top", (d.y - padding) + "px")
                }

             
            }
        };

        overlay.setMap(map)
    })
}

