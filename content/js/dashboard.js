/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 85.0, "KoPercent": 15.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6129032258064516, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.975, 500, 1500, "http://159.89.38.11/-21"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/login/submit"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-22"], "isController": false}, {"data": [0.975, 500, 1500, "http://159.89.38.11/-20"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/chart/data"], "isController": false}, {"data": [0.65, 500, 1500, "http://159.89.38.11/-5"], "isController": false}, {"data": [0.925, 500, 1500, "http://159.89.38.11/-6"], "isController": false}, {"data": [0.975, 500, 1500, "http://159.89.38.11/-7"], "isController": false}, {"data": [0.95, 500, 1500, "http://159.89.38.11/-8"], "isController": false}, {"data": [0.05, 500, 1500, "http://159.89.38.11/-9"], "isController": false}, {"data": [0.375, 500, 1500, "http://159.89.38.11/-12"], "isController": false}, {"data": [0.475, 500, 1500, "http://159.89.38.11/-13"], "isController": false}, {"data": [0.425, 500, 1500, "http://159.89.38.11/-10"], "isController": false}, {"data": [0.65, 500, 1500, "http://159.89.38.11/-0"], "isController": false}, {"data": [0.475, 500, 1500, "http://159.89.38.11/-11"], "isController": false}, {"data": [0.7166666666666667, 500, 1500, "http://159.89.38.11/-1"], "isController": false}, {"data": [0.85, 500, 1500, "http://159.89.38.11/-2"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-3"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-4"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/"], "isController": false}, {"data": [0.55, 500, 1500, "http://159.89.38.11/-18"], "isController": false}, {"data": [0.925, 500, 1500, "http://159.89.38.11/-19"], "isController": false}, {"data": [0.775, 500, 1500, "http://159.89.38.11/-16"], "isController": false}, {"data": [0.8, 500, 1500, "http://159.89.38.11/-17"], "isController": false}, {"data": [0.425, 500, 1500, "http://159.89.38.11/-14"], "isController": false}, {"data": [0.475, 500, 1500, "http://159.89.38.11/-15"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 620, 93, 15.0, 749.4596774193548, 0, 8516, 514.0, 1354.6, 1963.4499999999925, 3940.659999999998, 0.008039979133401253, 0.8597042121218882, 0.011583519394822212], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://159.89.38.11/-21", 20, 0, 0.0, 277.65, 246, 512, 267.0, 288.50000000000006, 500.89999999999986, 512.0, 2.593690521002655E-4, 0.001085348035400037, 2.349265584208948E-4], "isController": false}, {"data": ["http://159.89.38.11/login/submit", 20, 20, 100.0, 632.1, 512, 1571, 545.0, 1230.8000000000015, 1557.6, 1571.0, 2.593665596853095E-4, 1.4039734768903035E-4, 1.2613725265945717E-4], "isController": false}, {"data": ["http://159.89.38.11/-22", 20, 0, 0.0, 259.34999999999997, 240, 287, 260.0, 275.8, 286.45, 287.0, 2.5936935146236915E-4, 0.0018241973332343581, 2.3391366804247844E-4], "isController": false}, {"data": ["http://159.89.38.11/-20", 20, 0, 0.0, 285.75, 247, 514, 275.5, 301.9, 503.39999999999986, 514.0, 2.5936936491686194E-4, 0.012585999748748897, 2.369531649216058E-4], "isController": false}, {"data": ["http://159.89.38.11/chart/data", 20, 20, 100.0, 343.55000000000007, 287, 1112, 302.0, 319.9, 1072.3999999999994, 1112.0, 2.5938726399195853E-4, 1.4063653219564004E-4, 2.4811506355480804E-4], "isController": false}, {"data": ["http://159.89.38.11/-5", 20, 0, 0.0, 479.05000000000007, 244, 543, 515.0, 539.6, 542.85, 543.0, 2.5936959700708235E-4, 7.218782729201023E-4, 2.4328564250517833E-4], "isController": false}, {"data": ["http://159.89.38.11/-6", 20, 0, 0.0, 425.8, 249, 1722, 294.5, 1345.900000000002, 1707.9999999999998, 1722.0, 2.593697080068998E-4, 0.030871834102543915, 1.06382106799705E-4], "isController": false}, {"data": ["http://159.89.38.11/-7", 20, 0, 0.0, 83.99999999999999, 17, 1122, 27.0, 51.900000000000006, 1068.499999999999, 1122.0, 2.593712519233027E-4, 0.004081690437188142, 1.0663603228487346E-4], "isController": false}, {"data": ["http://159.89.38.11/-8", 20, 0, 0.0, 284.44999999999993, 174, 1161, 205.0, 845.3000000000014, 1148.6, 1161.0, 2.593719044773738E-4, 0.006047114108879708, 1.0739617919766257E-4], "isController": false}, {"data": ["http://159.89.38.11/-9", 20, 15, 75.0, 1669.65, 1056, 7422, 1242.5, 2469.1000000000004, 7175.649999999997, 7422.0, 2.593680093837271E-4, 0.13192833583360852, 2.9729804786538054E-4], "isController": false}, {"data": ["http://159.89.38.11/-12", 20, 0, 0.0, 1414.6000000000004, 534, 3172, 1123.0, 3057.2000000000016, 3170.5, 3172.0, 2.593647770157367E-4, 0.022394020893622406, 2.3872197493880062E-4], "isController": false}, {"data": ["http://159.89.38.11/-13", 20, 0, 0.0, 1139.55, 351, 2861, 1078.0, 1686.100000000001, 2804.899999999999, 2861.0, 2.5936741066640695E-4, 0.0111852195849888, 2.3517836015992074E-4], "isController": false}, {"data": ["http://159.89.38.11/-10", 20, 0, 0.0, 1290.2499999999998, 893, 1654, 1277.0, 1608.6000000000001, 1652.05, 1654.0, 2.5936741066640695E-4, 0.013627123230255105, 4.5452618988365943E-4], "isController": false}, {"data": ["http://159.89.38.11/-0", 60, 0, 0.0, 892.2666666666667, 274, 6740, 835.5, 1346.1, 1591.1499999999992, 6740.0, 7.780924542162943E-4, 0.13769690922322136, 6.350622429871467E-4], "isController": false}, {"data": ["http://159.89.38.11/-11", 20, 0, 0.0, 1138.95, 484, 2972, 1089.5, 1512.6000000000008, 2900.8999999999987, 2972.0, 2.593690621911117E-4, 0.010726075856061532, 2.3619301805977703E-4], "isController": false}, {"data": ["http://159.89.38.11/-1", 60, 15, 25.0, 239.06666666666666, 0, 581, 275.0, 439.99999999999994, 519.6999999999999, 581.0, 7.780930293731934E-4, 0.006717042580213805, 4.026606098457143E-4], "isController": false}, {"data": ["http://159.89.38.11/-2", 40, 0, 0.0, 385.72499999999997, 189, 1105, 272.0, 643.3999999999999, 812.5499999999994, 1105.0, 5.187316595937605E-4, 0.00486346391041193, 3.420640167389519E-4], "isController": false}, {"data": ["http://159.89.38.11/-3", 20, 0, 0.0, 839.6499999999999, 505, 1284, 802.0, 1111.4, 1275.55, 1284.0, 2.593687729204995E-4, 0.008630090655221932, 2.4125855098317946E-4], "isController": false}, {"data": ["http://159.89.38.11/-4", 20, 0, 0.0, 816.9499999999998, 528, 1272, 788.0, 1020.3000000000001, 1259.6499999999999, 1272.0, 2.593678748402683E-4, 0.004192438539410275, 2.364452257454985E-4], "isController": false}, {"data": ["http://159.89.38.11/", 20, 19, 95.0, 3746.2999999999997, 2874, 8516, 3313.0, 4575.6, 8319.849999999997, 8516.0, 2.5935954014516093E-4, 0.35694513746574347, 0.0052288681586951], "isController": false}, {"data": ["http://159.89.38.11/-18", 20, 0, 0.0, 748.2, 280, 1627, 535.0, 1544.6000000000004, 1623.85, 1627.0, 2.593694759164807E-4, 0.021385823818926078, 2.402460428777168E-4], "isController": false}, {"data": ["http://159.89.38.11/-19", 20, 0, 0.0, 334.5, 250, 828, 270.5, 545.3000000000001, 813.9499999999998, 828.0, 2.5936864846706255E-4, 0.005148113066497115, 2.3467290312962252E-4], "isController": false}, {"data": ["http://159.89.38.11/-16", 20, 2, 10.0, 388.4, 1, 830, 277.5, 799.3000000000001, 828.5, 830.0, 2.5937049846289263E-4, 0.004284248459131743, 2.1990768238816736E-4], "isController": false}, {"data": ["http://159.89.38.11/-17", 20, 0, 0.0, 465.2, 250, 798, 301.0, 796.3000000000001, 797.95, 798.0, 2.593694490074735E-4, 0.006172942228282361, 2.4227234177309415E-4], "isController": false}, {"data": ["http://159.89.38.11/-14", 20, 0, 0.0, 1359.6, 542, 2519, 1333.0, 1778.3000000000006, 2483.4499999999994, 2519.0, 2.593673433949707E-4, 0.038299995470797765, 2.36444741268755E-4], "isController": false}, {"data": ["http://159.89.38.11/-15", 20, 2, 10.0, 644.3000000000001, 1, 1858, 536.5, 1073.4, 1818.8499999999995, 1858.0, 2.593679791114367E-4, 0.01804046136583619, 2.18411141003703E-4], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 159.89.38.11:80 failed to respond", 19, 20.43010752688172, 3.064516129032258], "isController": false}, {"data": ["419/unknown status", 40, 43.01075268817204, 6.451612903225806], "isController": false}, {"data": ["Assertion failed", 34, 36.55913978494624, 5.483870967741935], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 620, 93, "419/unknown status", 40, "Assertion failed", 34, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 159.89.38.11:80 failed to respond", 19, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["http://159.89.38.11/login/submit", 20, 20, "419/unknown status", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://159.89.38.11/chart/data", 20, 20, "419/unknown status", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://159.89.38.11/-9", 20, 15, "Assertion failed", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://159.89.38.11/-1", 60, 15, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 159.89.38.11:80 failed to respond", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://159.89.38.11/", 20, 19, "Assertion failed", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://159.89.38.11/-16", 20, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 159.89.38.11:80 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://159.89.38.11/-15", 20, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 159.89.38.11:80 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
