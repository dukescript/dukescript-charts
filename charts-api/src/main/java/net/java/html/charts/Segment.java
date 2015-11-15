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

/** Segment in a {@link Chart#createPie() pie}, {@link Chart#createPolar() polar} or
 * {@link Chart#createDoughnut() doughnut} chart.
 * Carries value with additional
 * visualization attributes. 
 */
public final class Segment {
    final String label;
    final double value;
    final Color color;
    final Color highlight;

    /** Name, value and colors to use to represent the segment
     * in a {@link Chart#createPie() pie}, {@link Chart#createPolar() polar} or
     * {@link Chart#createDoughnut() doughnut} chart.
     * @param label name of the segment
     * @param value value of the segment
     * @param color color to use when drawing the segment
     * @param highlight color when the segment is highlighted
     */
    public Segment(String label, double value, Color color, Color highlight) {
        this.label = label;
        this.value = value;
        this.color = color;
        this.highlight = highlight;
    }

    /**
     * Label associated with this segment.
     * @return string passed as <code>label</code> into the {@link #Segment(java.lang.String, double, net.java.html.charts.Color, net.java.html.charts.Color) constructor}
     */
    public String getLabel() {
        return label;
    }
}
