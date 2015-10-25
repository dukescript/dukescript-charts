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

/** Values in a {@link Chart#createLine(net.java.html.charts.Values.Set...) line},
 * {@link Chart#createRadar(net.java.html.charts.Values.Set...) radar} or
 * {@link Chart#createBar(net.java.html.charts.Values.Set...) bar} chart.
 */
public final class Values {
    final String label;
    final double[] values;
    
    /** One column of values. Comes with a label and an array of values, each
     * for one {@link Set} in the {@link Chart#createLine(net.java.html.charts.Values.Set...) line},
     * {@link Chart#createRadar(net.java.html.charts.Values.Set...) radar} or
     * {@link Chart#createBar(net.java.html.charts.Values.Set...) bar} chart.
     * @param label name of the column of values
     * @param values value for each {@link Set}
     */
    public Values(String label, double... values) {
        this.label = label;
        this.values = values;
    }

    /** Set of {@link Values values} for 
     * {@link Chart#createLine(net.java.html.charts.Values.Set...) line},
     * {@link Chart#createRadar(net.java.html.charts.Values.Set...) radar} or
     * {@link Chart#createBar(net.java.html.charts.Values.Set...) bar} chart.
     */
    public static final class Set {
        final Object[] raw;

        /** Label for the set of values and colors to use to draw it.
         * 
         * @param label name for the set of values
         * @param fillColor color to use to fill the values in the chart
         * @param strokeColor stroke color
         */
        public Set(String label, Color fillColor, Color strokeColor) {
            raw = new Object[] {
                label, fillColor.color, strokeColor.color, null, null, null
            };
        }
    }
}
