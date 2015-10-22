package net.java.html.charts;

/*
 * #%L
 * charts-api - a library from the "DukeScript" project.
 * %%
 * Copyright (C) 2015 Dukehoff GmbH
 * %%
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * #L%
 */

import java.util.List;
import java.util.TooManyListenersException;
import net.java.html.js.JavaScriptBody;
import net.java.html.js.JavaScriptResource;

@JavaScriptResource("Chart.min.js")
public class Chart<Data> {
    private final Object chart;
    private ChartListener listener;

    private Chart(String id, String fnName, Object js) {
        this.chart = js;
        addListener(id, fnName, chart);
    }

    public void applyTo(String id) {
    }

    public void addChartListener(ChartListener l) throws TooManyListenersException {
        this.listener = Listeners.add(this.listener, l);
    }

    public void removeChartListener(ChartListener l) {
        this.listener = Listeners.remove(this.listener, l);
    }

    public List<Data> getData() {
        return null;
    }

    final void fireEvent(ChartEvent ev) {
        for (ChartListener l : Listeners.all(this.listener)) {
            l.chartClick(ev);
        }
    }

    @JavaScriptBody(args = { "id", "name", "names", "values" }, body =
        "var canvas = document.getElementById(id);\n" +
        "var ctx = canvas.getContext('2d');\n" +
        "var data = {\n" +
        "  labels : names,\n" +
        "  datasets : [{\n" +
        "    label : name,\n" +
        "    fillColor: 'rgba(151,187,205,0.5)',\n" +
        "    strokeColor: 'rgba(151,187,205,0.8)',\n" +
        "    highlightFill: 'rgba(151,187,205,0.75)',\n" +
        "    highlightStroke: 'rgba(151,187,205,1)',\n" +
        "    data: values\n" +
        "  }]\n" +
        "};\n" +
        "var graph = new Chart(ctx).Bar(data, {\n" +
        "  'responsive' : true\n" +
        "});\n" +
        "return graph;\n"
    )
    native static Object initBar(String id, String name, String[] names, Object[] values);


    @JavaScriptBody(args = { "id", "fnName", "graph" }, wait4js = false, javacall = true, body =
"var self = this;\n" +
"var canvas = document.getElementById(id);\n" +
"canvas.addEventListener('mousedown', getPosition, false);\n" +
"function getPosition(event)\n" +
"{\n" +
"  var x = event.x;\n" +
"  var y = event.y;\n" +
"  x -= canvas.offsetLeft;\n" +
"  y -= canvas.offsetTop;\n" +
"  var arr = graph[fnName](event);\n" +
"  self.@net.java.html.charts.Chart::onClick([Ljava/lang/Object;)([\n" +
"    arr[0].label, arr[0].value\n" +
"  ]);\n" +
"}\n"  +
"graph.canvas = canvas;\n"  +
"graph.listener = getPosition;\n"
    )
    private native void addListener(String id, String fnName, Object graph);

    void onClick(Object[] info) {
        ChartListener l = this.listener;
        if (l != null) {
            l.chartClick(new ChartEvent(this, (String)info[0], (((Number)info[1])).doubleValue()));
        }
    }

    @JavaScriptBody(args = { "js" }, wait4js = false, body =
        "js.canvas.removeEventListener('mousedown', js.listener);\n" +
        "js.destroy();\n"
    )
    native static void destroy(Object js);


    @JavaScriptBody(args = { "id", "name", "names", "values" }, body =
        "var canvas = document.getElementById(id);\n" +
        "var ctx = canvas.getContext('2d');\n" +
        "var data = {\n" +
        "  labels : names,\n" +
        "  datasets : [{\n" +
        "    label : name,\n" +
        "    fillColor: 'rgba(151,187,205,0.5)',\n" +
        "    strokeColor: 'rgba(151,187,205,0.8)',\n" +
        "    highlightFill: 'rgba(151,187,205,0.75)',\n" +
        "    highlightStroke: 'rgba(151,187,205,1)',\n" +
        "    data: values\n" +
        "  }]\n" +
        "};\n" +
        "var graph = new Chart(ctx).Line(data, {\n" +
        "  'responsive' : true\n" +
        "});\n" +
        "return graph;\n"
    )
    native static Object initLine(String id, String name, String[] names, Object[] values);


    @JavaScriptBody(args = { "type", "id", "name", "names", "values", "colors", "highlights" }, body =
        "var canvas = document.getElementById(id);\n" +
        "var ctx = canvas.getContext('2d');\n" +
        "var data = new Array();\n" +
        "for (var i = 0; i < values.length; i++) {\n" +
        "  data.push({\n" +
        "    'value' : values[i],\n" +
        "    'color' : colors[i],\n" +
        "    'highlight' : highlights[i],\n" +
        "    'label' : names[i]\n" +
        "  });\n" +
        "};\n" +
        "var graph = new Chart(ctx)[type](data, {\n" +
        "  'responsive' : true\n" +
        "});\n" +
        "return graph;\n"
    )
    native static Object init360(String type, String id, String name, String[] names, Object[] values, String[] colors, String[] highlights);

    @JavaScriptBody(args = { "js", "data", "title" }, body =
        "js.addData(data, title);"
    )
    native static Object addData(Object js, Object[] data, String title);

    public static Chart createBar(String id, List<? extends Number> values) {
        Number[] valArr = values.toArray(new Number[0]);
        String[] names = new String[valArr.length];
        for (int i = 0; i < valArr.length; i++) {
            names[i] = "" + i;
        }
        return new Chart(id, "getBarsAtEvent", initBar(id, "Test", names, valArr));
    }

    public static Chart createLine(String id, Number number) {
        return new Chart(id, "getPointsAtEvent", initLine(id, "Test", new String[] { "value" }, new Object[] { number }));
    }

    public static Chart create360(String type, String id, List<? extends Number> values) {
        final String[] palette = {
            "#4D4D4D", "#5DA5DA", "#FAA43A", "#60BD68",
            "#F17CB0", "#B2912F", "#B276B2", "#DECF3F", "#F15854"
        };
        Number[] valArr = values.toArray(new Number[0]);
        String[] names = new String[valArr.length];
        String[] colors = new String[valArr.length];
        for (int i = 0; i < valArr.length; i++) {
            names[i] = "" + i;
            colors[i] = palette[i % palette.length];
        }
        return new Chart(id, "getSegmentsAtEvent", init360(type, id, "Test", names, valArr, colors, colors));
    }

    public void addData(Number value, String title) {
        addData(chart, new Object[] { value }, title);
    }

    public void destroy() {
        destroy(chart);
    }
}
