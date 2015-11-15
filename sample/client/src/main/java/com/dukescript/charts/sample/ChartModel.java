package com.dukescript.charts.sample;

/*
 * #%L
 * Charts Sample General Code - a library from the "DukeScript" project.
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
import java.util.Random;
import net.java.html.json.Model;
import net.java.html.charts.Chart;
import net.java.html.charts.ChartEvent;
import net.java.html.charts.ChartListener;
import net.java.html.charts.Color;
import net.java.html.charts.Config;
import net.java.html.charts.Segment;
import net.java.html.charts.Values;
import net.java.html.json.Function;
import net.java.html.json.ModelOperation;
import net.java.html.json.Property;

@Model(className = "Data", targetId="", properties = {
    @Property(name = "code", type = String.class)
})
public final class ChartModel {
    private static Data ui;
    private static final Color[] PALETTE = {
        Color.valueOf("#4D4D4D"),
        Color.valueOf("#5DA5DA"),
        Color.valueOf("#FAA43A"),
        Color.valueOf("#60BD68"),
        Color.valueOf("#F17CB0"),
        Color.valueOf("#B2912F"),
        Color.valueOf("#B276B2"),
        Color.valueOf("#DECF3F"),
        Color.valueOf("#F15854")
    };
    private static int paletteIndex;
    private static Chart<?,?> chart;
    private static final double[] VALUES = new double[12];
    private static final String[] NAMES = {
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    };
    
    public static void onPageLoad() throws Exception {
        Random r = new Random();
        for (int i = 0; i < VALUES.length; i++) {
            VALUES[i] = (int)(r.nextDouble() * 100.0);
        }
        ui = new Data();
        ui.applyBindings();
        lineLike(ui, false);
    }

    @ModelOperation
    static void pieLike(Data model, int type) {
        StringBuilder sb = new StringBuilder();
        Chart<Segment, Config> segmentChart;
        sb.append("// import net.java.html.charts.*;\n");
        sb.append("Chart<Segment, Config> chart = Chart.create");
        switch (type) {
            case 0:
                segmentChart = Chart.createPie();
                sb.append("Pie();\n");
                break;
            case 1: 
                segmentChart = Chart.createDoughnut();
                sb.append("Doughnut();\n");
                break;
            default:
                segmentChart = Chart.createPolar();
                sb.append("Polar();\n");
                break;
        }
        final List<Segment> data = segmentChart.getData();
        for (int i = 0; i < 12; i++) {
            Color c = PALETTE[i % PALETTE.length];
            data.add(new Segment(NAMES[i], VALUES[i], c, c));
            sb.append("chart.getData().add(\"").append(NAMES[i]);
            sb.append("\", ").append(VALUES[i]).append(", Color.valueOf(\"");
            sb.append(c).append("\"), Color.valueOf(\"");
            sb.append(c).append("\"));\n");
        }
        segmentChart.addChartListener(new AddSegment(segmentChart));
        segmentChart.applyTo("chart");
        sb.append("chart.applyTo(\"chart\");\n");
        if (chart != null) {
            chart.destroy();
        }
        chart = segmentChart;
        model.setCode(sb.toString());
    }
    
    static void lineLike(Data model, boolean line) {
        StringBuilder sb = new StringBuilder();
        final Color c1 = PALETTE[nextPaletteIndex()];
        final Color c2 = PALETTE[nextPaletteIndex()];
        final Values.Set values = new Values.Set("Months", c1, c2);

        Chart<Values, Config> bar = line ?
            Chart.createLine(values)
            : Chart.createBar(values);

        sb.append("// import net.java.html.charts.*;\n");
        sb.append("Chart<Values, Config> chart = Chart.");
        if (line) {
            sb.append("createLine(");
        } else {
            sb.append("createBar(");
        }
        sb.append("new Values.Set(\"Months\", Color.valueOf(\"");
        sb.append(c1).append("\"), Color.valueOf(\"").append(c2).append("\")));\n");

        List<Values> data = bar.getData();
        for (int i = 0; i < 12; i++) {
            data.add(new Values(NAMES[i], VALUES[i]));
            sb.append("chart.getData().add(new Values(\"").append(NAMES[i]).append("\", ").append(VALUES[i]).append("));\n");
        }
        bar.addChartListener(new AddOne(bar));
        bar.applyTo("chart");
        sb.append("chart.applyTo(\"chart\");\n");
        if (chart != null) {
            chart.destroy();
        }
        chart = bar;
        model.setCode(sb.toString());
    }

    @Function
    static void pie(Data model) {
        pieLike(model, 0);
    }
    @Function
    static void doughnut(Data model) {
        pieLike(model, 1);
    }
    @Function
    static void polar(Data model) {
        pieLike(model, 2);
    }
    @Function
    static void line(Data model) {
        lineLike(model, true);
    }
    @Function
    static void bar(Data model) {
        lineLike(model, false);
    }


    private static int nextPaletteIndex() {
        return paletteIndex++ % PALETTE.length;
    }

    private static double delta(ChartEvent ev) {
        int delta = ev.isCtrlKey() ? 10 : 1;
        return ev.isShiftKey() ? -delta : delta;
    }

    private static class AddOne implements ChartListener {
        private final Chart<Values,?> chart;

        public AddOne(Chart<Values, ?> chart) {
            this.chart = chart;
        }

        @Override
        public void chartClick(ChartEvent ev) {
            final double d = delta(ev);
            int index = 0;
            for (Values v : chart.getData()) {
                if (ev.getLabel().equals(v.getLabel())) {
                    chart.getData().set(index, new Values(ev.getLabel(), ev.getValues()[0] + d));
                    VALUES[index] += d;
                }
                index++;
            }
        }
    }

    private static class AddSegment implements ChartListener {
        private final Chart<Segment,?> chart;

        public AddSegment(Chart<Segment, ?> chart) {
            this.chart = chart;
        }

        @Override
        public void chartClick(ChartEvent ev) {
            final double d = delta(ev);
            int index = 0;
            for (Segment v : chart.getData()) {
                if (ev.getLabel().equals(v.getLabel())) {
                    Color c = PALETTE[index % PALETTE.length];
                    chart.getData().set(index, new Segment("Index" + index, ev.getValues()[0] + d, c, c));
                    VALUES[index] += d;
                }
                index++;
            }
        }
    }
}
