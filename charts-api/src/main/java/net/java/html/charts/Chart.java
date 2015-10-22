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

import java.util.ArrayList;
import java.util.List;
import net.java.html.js.JavaScriptBody;
import net.java.html.js.JavaScriptResource;

/** Instance of a single chart. The chart is created by one of the
 * factory methods (like {@link #createBar(net.java.html.charts.Values.Set...)},
 * {@link #createLine(net.java.html.charts.Values.Set...)}, {@link #createPie()}, etc.)
 * methods and should first be filled with data:
 * <pre>
 * chart.{@link #getData()}.add(....);
 * </pre>
 * and then displayed on the HTML page by attaching it to an existing
 * DOM element identified by an ID:
 * <pre>
 * chart.{@link #applyTo(java.lang.String) applyTo}("elementId");
 * </pre>
 *
 * @param <D> type of data to put into {@link #getData()} list
 * @param <C> type of the {@link Config configuration} object for this chart
 */
@JavaScriptResource("Chart.min.js")
public final class Chart<D, C extends Config> {
    private final C config;
    private final Values.Set[] dataSets;
    private final List<D> data;
    private Object chart;
    private ChartListener listener;

    private Chart(C config, Values.Set[] dataSets) {
        this.config = config;
        this.data = new ArrayList<>();
        this.dataSets = dataSets;
    }

    /** Associates the chart with an element on the page. This method
     * can be called just once. If used twice, it throws an exception.
     *
     * @param id the id of the element to place the chart to
     * @throws IllegalStateException if already applied to some element
     */
    public void applyTo(String id) {
        if (chart != null) {
            throw new IllegalStateException("Already initialized");
        }
        Values.Set ds = dataSets[0];
        Values[] arr = data.toArray(new Values[0]);
        String[] names = new String[arr.length];
        double[] values = new double[arr.length];
        for (int i = 0; i < arr.length; i++) {
            names[i] = arr[i].label;
            values[i] = arr[i].values[0];
        }
        this.chart = initLine(id, ds.label, names, values);
//        addListener(id, fnName, chart);
    }

    /** Adds a listener to the chart.
     * @param l the listener
     */
    public void addChartListener(ChartListener l) {
        this.listener = Listeners.add(this.listener, l);
    }

    /** Removes a listener from the chart.
     * @param l the listener
     */
    public void removeChartListener(ChartListener l) {
        this.listener = Listeners.remove(this.listener, l);
    }

    /** Access to configuration associated with this graph. The configuration
     * object is either generic {@link Config} object, or a specialized one
     * tailored for the features of this chart.
     *
     * @return non-<code>null</code> configuration object for this chart
     */
    public C getConfig() {
        return config;
    }

    /** The data displayed by this graph. One can change the data,
     * remove some elements, add new ones. The chart will be updated according
     * to such change.
     * @return
     */
    public List<D> getData() {
        return data;
    }

    /**
     * Destroy the graph and cleanup associated resources.
     */
    public void destroy() {
        destroy(chart);
    }

    //
    // Factories
    //

    // Chart.getData() -> List<Values>

    public static Chart<Values, Config> createLine(Values.Set... dataSets) {
        return new Chart<>(new Config(), dataSets);
    }
    public static Chart<Values, Config> createRadar(Values.Set... dataSets) {
        return null;
    }

    /*
    // line:
    // radar:

            {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
*/

    public static Chart<Values,Config> createBar(Values.Set... dataSets) {
        return null;
    }
/*
    // bar:
            {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
*/

    public static Chart<Segment, Config> createPie() {
        return null;
    }

    public static Chart<Segment, Config> createDoughnut() {
        return null;
    }

    public static Chart<Segment, Config> createPolar() {
        return null;
    }

    // Chart.getData() -> List<Segment>

    /*
    // polar:

      {
        value: 120,
        color: "#4D5360",
        highlight: "#616774",
        label: "Dark Grey"
    }

    // pie & doughnat:

    {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    }
    */

    //
    // Implementations
    //


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
    native static Object initLine(String id, String name, String[] names, double[] values);


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

    /*
    static Chart createBar(String id, List<? extends Number> values) {
        Number[] valArr = values.toArray(new Number[0]);
        String[] names = new String[valArr.length];
        for (int i = 0; i < valArr.length; i++) {
            names[i] = "" + i;
        }
        return new Chart(id, "getBarsAtEvent", initBar(id, "Test", names, valArr));
    }

    static Chart createLine(String id, Number number) {
        return new Chart(id, "getPointsAtEvent", initLine(id, "Test", new String[] { "value" }, new Object[] { number }));
    }

    static Chart create360(String type, String id, List<? extends Number> values) {
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
    */
}
