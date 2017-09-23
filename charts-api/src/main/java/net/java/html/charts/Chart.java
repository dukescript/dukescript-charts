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
import java.util.Collection;
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
    private final String type;
    private Object chart;
    private ChartListener listener;

    private Chart(String type, Class<D> elementType, C config, Values.Set[] dataSets) {
        this.type = type;
        this.config = config;
        this.data = new ChartList<>(elementType);
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
        String clickLocationFn;
        if (dataSets != null) {
            Values[] arr = data.toArray(new Values[0]);

            String[] names = new String[arr.length];
            Object[] labels = new Object[dataSets.length];

            for (int i = 0; i < dataSets.length; i++) {
                final Object[] clone = dataSets[i].raw.clone();
                final double[] valuesForDataSet = new double[arr.length];
                for (int j = 0; j < arr.length; j++) {
                    valuesForDataSet[j] = arr[j].values[i];
                }
                clone[5] = valuesForDataSet;
                labels[i] = clone;
            }

            for (int i = 0; i < arr.length; i++) {
                names[i] = arr[i].label;
            }
            switch (type) {
                case "Line":
                    clickLocationFn = "getPointsAtEvent";
                    break;
                case "Bar":
                    clickLocationFn = "getBarsAtEvent";
                    break;
                case "Radar":
                    clickLocationFn = "getPointsAtEvent";
                    break;
                default:
                    throw new IllegalStateException(type);
            }
            this.chart = initLineLike(id, type, config.js, labels, names);
        } else {
            Segment[] arr = data.toArray(new Segment[0]);
            double[] values = new double[arr.length];
            String[] labels = new String[arr.length];
            String[] colors = new String[arr.length];
            String[] highlights = new String[arr.length];
            for (int i = 0; i < arr.length; i++) {
                values[i] = arr[i].value;
                labels[i] = arr[i].label;
                colors[i] = arr[i].color.color;
                highlights[i] = arr[i].highlight.color;
            }
            this.chart = init360(type, id, config.js, labels, values, colors, highlights);
            clickLocationFn = "getSegmentsAtEvent";
        }
        addListener(id, clickLocationFn, chart);
    }

    // for testing purposes
    final Object eval(String t) {
        return eval(t, chart);
    }

    final boolean isRealized() {
        return chart != null;
    }

    final void removeData(int index) {
        removeData(chart, index);
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
     * @return modifiable list of data the chart displays
     */
    public List<D> getData() {
        return data;
    }

    /**
     * Destroy the graph and cleanup associated resources.
     */
    public void destroy() {
        destroy(chart);
        chart = null;
    }

    //
    // Factories
    //

    /** Creates new line based chart.
     * 
     * @param dataSets individual sets of values to display
     * @return chart object to be {@link #getData() filled with data} and
     *   {@link #applyTo(java.lang.String) displayed}.
     */
    public static Chart<Values, Config> createLine(Values.Set... dataSets) {
        return new Chart<>("Line", Values.class, new Config(), dataSets);
    }
    
    /** Creates new radar chart.
     * 
     * @param dataSets individual sets of values to display
     * @return chart object to be {@link #getData() filled with data} and
     *   {@link #applyTo(java.lang.String) displayed}.
     */
    public static Chart<Values, Config> createRadar(Values.Set... dataSets) {
        return new Chart<>("Radar", Values.class, new Config(), dataSets);
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

    /** Creates new bar chart.
     * 
     * @param dataSets individual sets of values to display
     * @return chart object to be {@link #getData() filled with data} and
     *   {@link #applyTo(java.lang.String) displayed}.
     */
    public static Chart<Values,Config> createBar(Values.Set... dataSets) {
        return new Chart<>("Bar", Values.class, new Config(), dataSets);
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

    /** Creates new pie chart.
     * 
     * @return chart object to be {@link #getData() filled with data} and
     *   {@link #applyTo(java.lang.String) displayed}.
     */
    public static Chart<Segment, Config> createPie() {
        return new Chart<>("Pie", Segment.class, new Config(), null);
    }

    /** Creates new doughnut (e.g. {@link #createPie() pie} with missing center) chart.
     * 
     * @return chart object to be {@link #getData() filled with data} and
     *   {@link #applyTo(java.lang.String) displayed}.
     */
    public static Chart<Segment, Config> createDoughnut() {
        return new Chart<>("Doughnut", Segment.class, new Config(), null);
    }

    /** Creates new radar (e.g. scaled {@link #createPie() pie}) chart.
     * 
     * @return chart object to be {@link #getData() filled with data} and
     *   {@link #applyTo(java.lang.String) displayed}.
     */
    public static Chart<Segment, Config> createPolar() {
        return new Chart<>("PolarArea", Segment.class, new Config(), null);
    }

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

    @JavaScriptBody(args = { "id", "fnName", "graph" }, wait4js = false, javacall = true, body =
"var self = this;\n" +
"var canvas = document.getElementById(id);\n" +
"canvas.addEventListener('mousedown', handleClick, false);\n" +
"function handleClick(event)\n" +
"{\n" +
"  var x = event['x'];\n" +
"  var y = event['y'];\n" +
"  x -= canvas['offsetLeft'];\n" +
"  y -= canvas['offsetTop'];\n" +
"  var arr = graph[fnName](event);\n" +
"  var info = [];\n" +
"  for (var i = 0; i < arr.length; i++) {\n" +
"    info.push(arr[i]['label']);\n" +
"    info.push(arr[i]['value']);\n" +
"  }\n" +
"  self.@net.java.html.charts.Chart::onClick([Ljava/lang/Object;[Ljava/lang/Object;)" +
"    ([event['shiftKey'], event['ctrlKey'], event['altKey'], event['metaKey']], info);\n" +
"  event.stopPropagation();\n" +
"  event.preventDefault();\n" +
"}\n"  +
"graph.canvas = canvas;\n"  +
"graph.listener = handleClick;\n"
    )
    private native void addListener(String id, String fnName, Object graph);

    final void onClick(Object[] modifierState, Object[] info) {
        ChartEvent ev = new ChartEvent(this, modifierState[0], modifierState[1], info);
        for (ChartListener l : Listeners.all(this.listener)) {
            l.chartClick(ev);
        }
    }

    @JavaScriptBody(args = { "chart", "index", "value", "color", "highlight", "label" }, wait4js = false, body =
        "chart['addData']({ 'value': value, 'color': color, 'highlight' : highlight, 'label' : label }, index);"
    )
    native static void addData(Object chart, int index, double value, String color, String highlight, String label);

    @JavaScriptBody(args = { "chart", "data", "label" }, wait4js = false, body =
        "chart['addData'](data, label);"
    )
    native static void addData(Object chart, double[] data, String label);

    @JavaScriptBody(args = {"chart", "i"}, wait4js = false, body = "chart['removeData'](i);")
    native static void removeData(Object chart, int i);

    @JavaScriptBody(args = { "js" }, wait4js = false, body =
        "if (js['canvas']) js['canvas']['removeEventListener']('mousedown', js['listener']);\n" +
        "js['destroy']();\n"
    )
    native static void destroy(Object js);

    @JavaScriptBody(args = {"t", "chart" }, body =
        "with (chart) { return eval(t) }"
    )
    native static Object eval(String t, Object chart);


    @JavaScriptBody(args = { "id", "type", "config", "labels", "names"}, body =
        "var canvas = document.getElementById(id);\n" +
        "var ctx = canvas.getContext('2d');\n" +
        "var dataSets = [];\n" +
        "for (var i = 0; i < labels.length; i++) {\n" +
        "  dataSets.push({\n" +
        "    'label' : labels[i][0],\n" +
        "    'fillColor': labels[i][1],\n" +
        "    'strokeColor': labels[i][2],\n" +
        "    'highlightFill': labels[i][3],\n" +
        "    'highlightStroke': labels[i][4],\n" +
        "    'data': labels[i][5]\n" +
        "  });\n" +
        "}\n" +
        "var data = {\n" +
        "  'labels' : names,\n" +
        "  'datasets' : dataSets\n" +
        "};\n" +
        "var graph = new Chart(ctx)[type](data, config);\n" +
        "return graph;\n"
    )
    native static Object initLineLike(String id, String type, Object config, Object[] labels, String[] names);


    @JavaScriptBody(args = { "type", "id", "config", "names", "values", "colors", "highlights" }, body =
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
        "var graph = new Chart(ctx)[type](data, config);\n" +
        "return graph;\n"
    )
    native static Object init360(
        String type, String id, Object config,
        String[] names, double[] values,
        String[] colors, String[] highlights
    );

    @JavaScriptBody(args = { "js", "data", "title" }, wait4js = false, body =
        "js['addData'](data, title);"
    )
    native static void addData(Object js, Object[] data, String title);

    @JavaScriptBody(args = { "js", "type", "sets", "index", "title", "values" }, wait4js = false, body =
        "for (var i = 0; i < sets; i++) {\n" +
        "  js['datasets'][i][type][index]['label'] = title;\n" +
        "  js['datasets'][i][type][index]['value'] = values[i];\n" +
        "}\n" +
        "js['update']();\n"
    )
    native static void updateData(Object js, String type, int sets, int index, String title, double[] data);

    @JavaScriptBody(args = { "js", "index", "title", "value" }, wait4js = false, body =
        "js['segments'][index]['label'] = title;\n" +
        "js['segments'][index]['value'] = value;\n" +
        "js['update']();\n"
    )
    native static void updateData(Object js, int index, String title, double value);

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

    private final class ChartList<T> extends ArrayList<T> {
        private final Class<T> elementType;

        public ChartList(Class<T> elementType) {
            this.elementType = elementType;
        }

        @Override
        public boolean retainAll(Collection<?> c) {
            if (isRealized()) {
                throw new UnsupportedOperationException();
            }
            return super.retainAll(c);
        }

        @Override
        public boolean removeAll(Collection<?> c) {
            if (isRealized()) {
                throw new UnsupportedOperationException();
            }
            return super.removeAll(c);
        }

        @Override
        public boolean addAll(int index, Collection<? extends T> c) {
            if (isRealized()) {
                throw new UnsupportedOperationException();
            }
            return super.addAll(index, c);
        }

        @Override
        public void clear() {
            if (isRealized()) {
                throw new UnsupportedOperationException();
            }
            super.clear();
        }

        @Override
        public boolean remove(Object o) {
            if (isRealized()) {
                throw new UnsupportedOperationException();
            }
            return super.remove(o);
        }

        @Override
        public void add(int index, T element) {
            if (isRealized()) {
                if (elementType == Segment.class) {
                    Segment s = (Segment) element;
                    super.add(index, element);
                    addData(chart, index, s.value, s.color.toString(), s.highlight.toString(), s.label);
                    return;
                }
                throw new UnsupportedOperationException();
            }
            super.add(index, element);
        }

        @Override
        public boolean add(T e) {
            if (isRealized()) {
                if (elementType == Values.class) {
                    Values v = (Values) e;
                    if (super.add(e)) {
                        addData(chart, v.values, v.label);
                        return true;
                    }
                    return false;
                } else {
                    add(size(), e);
                    return true;
                }
            }
            return super.add(e);
        }



        @Override
        public T remove(int index) {
            if (isRealized()) {
                if (index == 0 || elementType == Segment.class) {
                    T r = super.remove(index);
                    removeData(index);
                    return r;
                }
                throw new UnsupportedOperationException();
            }
            return super.remove(index);
        }

        @Override
        public T set(int index, T element) {
            T prev = super.set(index, element);
            if (isRealized()) {
                if (elementType == Values.class) {
                    Values v = (Values) element;
                    if (dataSets.length != v.values.length) {
                        throw new IllegalArgumentException();
                    }
                    String dataType;
                    switch (type) {
                        case "Line":
                        case "Radar":
                            dataType = "points";
                            break;
                        case "Bar":
                            dataType = "bars";
                            break;
                        default:
                            throw new IllegalStateException();
                    }
                    updateData(chart, dataType, dataSets.length, index, v.label,  v.values);
                }
                if (elementType == Segment.class) {
                    Segment s = (Segment) element;
                    updateData(chart, index, s.label, s.value);
                }
            }
            return prev;
        }
    }
}
